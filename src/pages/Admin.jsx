import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Admin() {

    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [selectedBooking, setSelectedBooking] =
        useState(null);

    const [notes, setNotes] = useState("");

    const checkUser = async () => {

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            window.location.href = "/login";
        }
    };

    useEffect(() => {

        checkUser();

        fetchBookings();

        const channel = supabase
            .channel("bookings")

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookings",
                },
                () => {
                    fetchBookings();
                }
            )

            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, []);

    const fetchBookings = async () => {

        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false });
        console.log("DATA:", data);
        console.log("ERROR:", error);

        if (error) {
            console.error(error);
            return;
        }
        console.log(data);
        setBookings(data);
    };

    const updateStatus = async (id, status) => {

        await supabase
            .from("bookings")
            .update({ status })
            .eq("id", id);

        fetchBookings();
    };

    const deleteBooking = async (id) => {

        await supabase
            .from("bookings")
            .delete()
            .eq("id", id);

        fetchBookings();
    };

    const filteredBookings = bookings.filter((booking) => {

        const matchesSearch =
            booking.full_name
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            booking.phone.includes(search);

        const matchesFilter =
            filter === "All"
                ? true
                : (booking.status || "Pending") === filter;

        return matchesSearch && matchesFilter;
    });

    const saveNotes = async () => {

        if (!selectedBooking) return;

        await supabase
            .from("bookings")
            .update({
                notes,
            })
            .eq("id", selectedBooking.id);

        fetchBookings();

        setSelectedBooking(null);
    };

    const exportToExcel = () => {

        const exportData = bookings.map((b) => ({
            Name: b.full_name,
            Phone: b.phone,
            Service: b.service,
            Status: b.status || "Pending",
            Date: new Date(
                b.created_at
            ).toLocaleString(),
            Notes: b.notes || "",
        }));

        const worksheet =
            XLSX.utils.json_to_sheet(exportData);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Bookings"
        );

        const excelBuffer = XLSX.write(
            workbook,
            {
                bookType: "xlsx",
                type: "array",
            }
        );

        const data = new Blob(
            [excelBuffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
            }
        );

        saveAs(data, "motiva_bookings.xlsx");
    };

    return (

        <div className="min-h-screen bg-black text-white p-6">

            <div className="max-w-7xl mx-auto">

                

        

                <h1 className="text-5xl font-black mb-10">
                    Admin Dashboard
                </h1>
                <div className="grid md:grid-cols-3 gap-6 mb-12">

                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                        <h2 className="text-zinc-400">
                            Total Bookings
                        </h2>

                        <p className="text-5xl font-black mt-4">
                            {bookings.length}
                        </p>

                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                        <h2 className="text-zinc-400">
                            Pending
                        </h2>

                        <p className="text-5xl font-black mt-4 text-yellow-400">
                            {
                                bookings.filter(
                                    (b) => (b.status || "Pending") === "Pending"
                                ).length
                            }
                        </p>

                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                        <h2 className="text-zinc-400">
                            Completed
                        </h2>

                        <p className="text-5xl font-black mt-4 text-green-400">
                            {
                                bookings.filter(
                                    (b) => (b.status || "Pending") === "Completed"
                                ).length
                            }
                        </p>

                    </div>

                </div>

                <div className="flex flex-col lg:flex-row gap-4 mb-8">

                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-500"
                    />

                    {/* FILTER */}
                    <select
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value)
                        }
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none"
                    >

                        <option>All</option>
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Completed</option>

                    </select>

                    {/* EXPORT */}
                    <button
                        onClick={exportToExcel}
                        className="bg-green-600 px-6 py-4 rounded-2xl font-bold hover:bg-green-700 transition whitespace-nowrap"
                    >
                        Export Excel
                    </button>

                </div>

                <div className="grid gap-6">

                    {filteredBookings.map((booking) => (

                        <div
                            key={booking.id}

                            onClick={() => {
                                setSelectedBooking(booking);
                                setNotes(booking.notes || "");
                            }}
                            className="bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-red-500 transition rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                        >

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {booking.full_name}
                                </h2>

                                <p className="text-zinc-400 mt-2">
                                    {booking.phone}
                                </p>

                                <p className="text-red-500 mt-2">
                                    {booking.service}
                                </p>

                                <div className="mt-4">

                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${booking.status === "Pending"
                                                ? "bg-yellow-500/20 text-yellow-400"
                                                : booking.status === "Confirmed"
                                                    ? "bg-blue-500/20 text-blue-400"
                                                    : "bg-green-500/20 text-green-400"
                                            }`}
                                    >
                                        {booking.status || "Pending"}
                                    </span>

                                </div>

                                <p className="text-zinc-500 text-sm mt-4">
                                    {new Date(
                                        booking.created_at
                                    ).toLocaleString()}
                                </p>

                            </div>

                            <div className="flex flex-wrap gap-3">

                                <button
                                    onClick={() =>
                                        updateStatus(
                                            booking.id,
                                            "Confirmed"
                                        )
                                    }
                                    className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                                >
                                    Confirm
                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus(
                                            booking.id,
                                            "Completed"
                                        )
                                    }
                                    className="bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700 transition"
                                >
                                    Complete
                                </button>

                            </div>

                            <button
                                onClick={() => deleteBooking(booking.id)}
                                className="bg-red-600 px-6 py-3 rounded-xl hover:bg-red-700 transition"
                            >
                                Delete
                            </button>

                        </div>

                    ))}

                </div>

            </div>
            {/* BOOKING MODAL */}
            {selectedBooking && (

                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">

                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-2xl relative">

                        {/* CLOSE */}
                        <button
                            onClick={() =>
                                setSelectedBooking(null)
                            }
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white text-2xl"
                        >
                            ×
                        </button>

                        <h2 className="text-4xl font-black mb-8">
                            Booking Details
                        </h2>

                        <div className="space-y-6">

                            <div>

                                <p className="text-zinc-500 mb-2">
                                    Customer
                                </p>

                                <h3 className="text-2xl font-bold">
                                    {selectedBooking.full_name}
                                </h3>

                            </div>

                            <div>

                                <p className="text-zinc-500 mb-2">
                                    Phone
                                </p>

                                <h3 className="text-xl">
                                    {selectedBooking.phone}
                                </h3>

                            </div>

                            <div>

                                <p className="text-zinc-500 mb-2">
                                    Service
                                </p>

                                <h3 className="text-xl text-red-500">
                                    {selectedBooking.service}
                                </h3>

                            </div>

                            <div>

                                <p className="text-zinc-500 mb-2">
                                    Status
                                </p>

                                <h3 className="text-xl">
                                    {selectedBooking.status || "Pending"}
                                </h3>

                            </div>

                            {/* NOTES */}
                            <div>

                                <p className="text-zinc-500 mb-2">
                                    Admin Notes
                                </p>

                                <textarea
                                    value={notes}
                                    onChange={(e) =>
                                        setNotes(e.target.value)
                                    }
                                    rows={5}
                                    className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-500"
                                />

                            </div>

                            <button
                                onClick={saveNotes}
                                className="w-full bg-red-600 py-4 rounded-2xl font-bold hover:bg-red-700 transition"
                            >
                                Save Notes
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}