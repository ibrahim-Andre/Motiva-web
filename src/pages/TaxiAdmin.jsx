import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";

export default function TaxiAdmin() {

    const [drivers, setDrivers] = useState([]);
    const [requests, setRequests] = useState([]);

    // UNIQUE DRIVERS
    const uniqueDrivers = drivers.filter(
        (driver, index, self) =>
            index ===
            self.findIndex(
                (d) => d.full_name === driver.full_name
            )
    );

    useEffect(() => {

        fetchRequests();
        fetchDrivers();

        const channel = supabase
            .channel("taxi_requests")

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "taxi_requests",
                },
                () => {
                    fetchRequests();
                    fetchDrivers();
                }
            )

            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, []);

    // FETCH REQUESTS
    const fetchRequests = async () => {

        const { data, error } = await supabase
            .from("taxi_requests")
            .select("*")
            .order("created_at", {
                ascending: false,
            });

        if (error) {
            console.error(error);
            return;
        }

        setRequests(data);
    };

    // FETCH DRIVERS
    const fetchDrivers = async () => {

        const { data, error } = await supabase
            .from("drivers")
            .select("*");

        if (error) {
            console.error(error);
            return;
        }

        setDrivers(data);
    };

    // ASSIGN DRIVER
    const assignDriver = async (
        requestId,
        driverName
    ) => {

        // UPDATE REQUEST
        await supabase
            .from("taxi_requests")
            .update({
                driver: driverName,
                status: "Assigned",
            })
            .eq("id", requestId);

        // UPDATE DRIVER
        await supabase
            .from("drivers")
            .update({
                status: "Busy",
            })
            .eq("full_name", driverName);

        fetchRequests();
        fetchDrivers();
    };

    // COMPLETE TRIP
    const completeTrip = async (
        requestId,
        driverName
    ) => {

        // COMPLETE REQUEST
        await supabase
            .from("taxi_requests")
            .update({
                status: "Completed",
            })
            .eq("id", requestId);

        // DRIVER AVAILABLE AGAIN
        await supabase
            .from("drivers")
            .update({
                status: "Available",
            })
            .eq("full_name", driverName);

        fetchRequests();
        fetchDrivers();
    };

    // MANUAL DRIVER STATUS
    const updateDriverStatus = async (
        id,
        status
    ) => {

        await supabase
            .from("drivers")
            .update({ status })
            .eq("id", id);

        fetchDrivers();
    };

    return (

        <div className="min-h-screen bg-black text-white p-6">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-12">

                    <h1 className="text-5xl font-black">
                        Taxi Dispatch
                    </h1>

                    <p className="text-zinc-500 mt-3">
                        Live Taxi Operations
                    </p>

                </div>

                {/* STATS */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">

                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                        <p className="text-zinc-400">
                            Total Requests
                        </p>

                        <h2 className="text-5xl font-black mt-4">
                            {requests.length}
                        </h2>

                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                        <p className="text-zinc-400">
                            Waiting
                        </p>

                        <h2 className="text-5xl font-black mt-4 text-yellow-400">
                            {
                                requests.filter(
                                    (r) => r.status === "Waiting"
                                ).length
                            }
                        </h2>

                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                        <p className="text-zinc-400">
                            Assigned
                        </p>

                        <h2 className="text-5xl font-black mt-4 text-blue-400">
                            {
                                requests.filter(
                                    (r) => r.status === "Assigned"
                                ).length
                            }
                        </h2>

                    </div>

                </div>

                {/* DRIVERS */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">

                    {uniqueDrivers.map((driver) => (

                        <div
                            key={driver.id}
                            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-red-500 transition"
                        >

                            <h2 className="text-2xl font-bold">
                                {driver.full_name}
                            </h2>

                            <p className="text-zinc-400 mt-2">
                                {driver.car}
                            </p>

                            <div className="mt-4">

                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${driver.status === "Available"
                                        ? "bg-green-500/20 text-green-400"
                                        : driver.status === "Busy"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : "bg-zinc-700 text-zinc-300"
                                        }`}
                                >
                                    {driver.status}
                                </span>

                            </div>

                            <div className="flex gap-3 mt-6">

                                <button
                                    onClick={() =>
                                        updateDriverStatus(
                                            driver.id,
                                            "Available"
                                        )
                                    }
                                    className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-xl"
                                >
                                    Available
                                </button>

                                <button
                                    onClick={() =>
                                        updateDriverStatus(
                                            driver.id,
                                            "Busy"
                                        )
                                    }
                                    className="bg-yellow-600 hover:bg-yellow-700 transition px-4 py-2 rounded-xl"
                                >
                                    Busy
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

                {/* LIVE MAP */}
                <div className="mb-12">

                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">

                        <div className="p-6 border-b border-zinc-800">

                            <h2 className="text-3xl font-bold">
                                Live Fleet Map
                            </h2>

                            <p className="text-zinc-500 mt-2">
                                Real-time taxi operations
                            </p>

                        </div>

                        <MapContainer
                            center={[57.7089, 11.9746]}
                            zoom={12}
                            style={{
                                height: "500px",
                                width: "100%",
                            }}
                        >

                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* DRIVER MARKERS */}
                            {uniqueDrivers.map((driver, index) => (

                                <Marker
                                    key={driver.id}

                                    position={[
                                        57.7089 + index * 0.01,
                                        11.9746 + index * 0.01,
                                    ]}
                                >

                                    <Popup>

                                        <div className="text-black">

                                            <strong>
                                                {driver.full_name}
                                            </strong>

                                            <br />

                                            {driver.car}

                                            <br />

                                            Status: {driver.status}

                                        </div>

                                    </Popup>

                                </Marker>

                            ))}

                        </MapContainer>

                    </div>

                </div>

                {/* REQUESTS */}
                <div className="grid gap-6">

                    {requests.map((request) => (

                        <div
                            key={request.id}
                            className="bg-zinc-900 border border-zinc-800 hover:border-red-500 transition rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
                        >

                            {/* LEFT */}
                            <div>

                                <h2 className="text-3xl font-bold">
                                    {request.customer_name}
                                </h2>

                                <p className="text-zinc-400 mt-2">
                                    {request.phone}
                                </p>

                                <p className="text-red-500 mt-4">
                                    {request.pickup}
                                </p>

                                <p className="text-zinc-500">
                                    → {request.destination}
                                </p>

                                {/* DRIVER */}
                                {request.driver && (

                                    <div className="mt-4 flex items-center gap-3">

                                        <span className="text-zinc-500">
                                            Driver
                                        </span>

                                        <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold">
                                            {request.driver}
                                        </span>

                                    </div>

                                )}

                                {/* STATUS */}
                                <div className="mt-5">

                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${request.status === "Waiting"
                                            ? "bg-yellow-500/20 text-yellow-400"

                                            : request.status === "Assigned"
                                                ? "bg-blue-500/20 text-blue-400"

                                                : "bg-green-500/20 text-green-400"
                                            }`}
                                    >
                                        {request.status}
                                    </span>

                                </div>

                            </div>

                            {/* RIGHT */}
                            <div className="flex flex-wrap gap-3">

                                {request.status === "Waiting" && (

                                    uniqueDrivers
                                        .filter(
                                            (driver) =>
                                                driver.status === "Available"
                                        )

                                        .map((driver) => (

                                            <button
                                                key={driver.id}

                                                onClick={() =>
                                                    assignDriver(
                                                        request.id,
                                                        driver.full_name
                                                    )
                                                }

                                                className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl"
                                            >
                                                {driver.full_name}
                                            </button>

                                        ))

                                )}

                                {request.status === "Assigned" && (

                                    <button
                                        onClick={() =>
                                            completeTrip(
                                                request.id,
                                                request.driver
                                            )
                                        }

                                        className="bg-green-600 hover:bg-green-700 transition px-5 py-3 rounded-xl"
                                    >
                                        Complete Trip
                                    </button>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );
}