import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "./assets/logo.png";

export default function App() {
  const [language, setLanguage] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [customers, setCustomers] = useState(0);
  const [years, setYears] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    let yearsInterval = setInterval(() => {
      setYears((prev) => {
        if (prev >= 10) {
          clearInterval(yearsInterval);
          return 10;
        }
        return prev + 1;
      });
    }, 120);

    let customerInterval = setInterval(() => {
      setCustomers((prev) => {
        if (prev >= 5000) {
          clearInterval(customerInterval);
          return 5000;
        }
        return prev + 50;
      });
    }, 10);

  }, []);

  const content = {
    en: {
      home: "Home",
      services: "Services",
      taxi: "Taxi",
      contact: "Contact",
      title: "Premium Auto Repair & Nordic Taxi Service",
      subtitle:
        "Professional vehicle maintenance, diagnostics, and reliable Scandinavian taxi transportation.",
      book: "Book Service",
      taxiBtn: "Taxi Reservation",
      booking: "Quick Booking",
      fullName: "Full Name",
      phone: "Phone Number",
      choose: "Choose Service",
      submit: "Submit Request",
    },

    sv: {
      home: "Hem",
      services: "Tjänster",
      taxi: "Taxi",
      contact: "Kontakt",
      title: "Premium Bilservice & Nordisk Taxi",
      subtitle:
        "Professionell fordonsservice och pålitlig skandinavisk taxitransport.",
      book: "Boka Service",
      taxiBtn: "Taxi Bokning",
      booking: "Snabb Bokning",
      fullName: "Fullständigt Namn",
      phone: "Telefonnummer",
      choose: "Välj Tjänst",
      submit: "Skicka Förfrågan",
    },
  };

  return (
    <>
      {loading ? (

        <div className="fixed inset-0 z-[999] bg-black overflow-hidden flex items-center justify-center">

          {/* GLOW */}
          <div className="absolute w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full"></div>

          {/* CAR MOTION LOGO */}
          <motion.div
            initial={{ x: -1200, rotate: -5 }}
            animate={{
              x: 0,
              rotate: 0,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
            className="relative flex flex-col items-center"
          >

            {/* BRAKE SHAKE */}
            <motion.div
              animate={{
                x: [0, -12, 8, -4, 0],
              }}
              transition={{
                delay: 1.2,
                duration: 0.5,
              }}
            >

              <img
                src={logo}
                alt="Motiva"
                className="w-[280px] md:w-[420px] object-contain drop-shadow-[0_0_50px_rgba(220,38,38,0.5)]"
              />

            </motion.div>

            {/* TEXT */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="text-zinc-500 mt-8 tracking-[0.4em] uppercase text-sm"
            >
              Nordic Auto & Taxi
            </motion.p>

          </motion.div>

        </div>

      ) : (
        <div className="bg-black text-white min-h-screen overflow-hidden">

          {/* NAVBAR */}
          <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-2xl border-b border-zinc-800">

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

              {/* LOGO */}
              {/* LOGO */}
              <div className="flex items-center">

                <img
                  src={logo}
                  alt="Motiva"
                  className="w-[120px] md:w-[120px] object-contain drop-shadow-[0_0_25px_rgba(220,38,38,0.35)]"
                />

              </div>

              {/* DESKTOP MENU */}
              <div className="hidden md:flex items-center gap-8 text-sm">

                <a href="#home" className="hover:text-red-500 transition">
                  {content[language].home}
                </a>

                <a href="#services" className="hover:text-red-500 transition">
                  {content[language].services}
                </a>

                <a href="#taxi" className="hover:text-red-500 transition">
                  {content[language].taxi}
                </a>

                <a href="#contact" className="hover:text-red-500 transition">
                  {content[language].contact}
                </a>

              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-2">

                {/* HAMBURGER */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700"
                >

                  <span className="w-5 h-[2px] bg-white mb-1"></span>
                  <span className="w-5 h-[2px] bg-white mb-1"></span>
                  <span className="w-5 h-[2px] bg-white"></span>

                </button>

                {/* LANGUAGE */}
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-3 md:px-4 py-2 text-xs md:text-sm transition ${language === "en"
                      ? "bg-red-600"
                      : "bg-transparent hover:bg-zinc-800"
                      }`}
                  >
                    EN
                  </button>

                  <button
                    onClick={() => setLanguage("sv")}
                    className={`px-3 md:px-4 py-2 text-xs md:text-sm transition ${language === "sv"
                      ? "bg-red-600"
                      : "bg-transparent hover:bg-zinc-800"
                      }`}
                  >
                    SV
                  </button>

                </div>

                {/* CTA */}
                <button onClick={() => setBookingOpen(true)} className="hidden md:block bg-white text-black px-5 py-3 rounded-xl font-semibold hover:scale-105 transition">
                  {content[language].book}
                </button>

              </div>

            </div>

            {/* MOBILE MENU */}
            {menuOpen && (

              <div className="md:hidden bg-black border-t border-zinc-800">

                <div className="flex flex-col p-6 gap-6 text-lg">

                  <a
                    href="#home"
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-red-500 transition"
                  >
                    {content[language].home}
                  </a>

                  <a
                    href="#services"
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-red-500 transition"
                  >
                    {content[language].services}
                  </a>

                  <a
                    href="#taxi"
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-red-500 transition"
                  >
                    {content[language].taxi}
                  </a>

                  <a
                    href="#contact"
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-red-500 transition"
                  >
                    {content[language].contact}
                  </a>

                  <button onClick={() => setBookingOpen(true)} className="bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] py-4 rounded-2xl font-semibold">
                    {content[language].book}
                  </button>

                </div>

              </div>

            )}

          </nav>

          {/* HERO */}
          <section id="home" className="relative min-h-screen flex items-center">

            {/* BACKGROUND */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop')",
              }}
            />

            {/* OVERLAY */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full"></div>

            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[150px] rounded-full"></div>

            {/* CONTENT */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

              {/* LEFT */}
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >

                <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-700 px-4 py-2 rounded-full text-sm mb-6">

                  <div className="w-2 h-2 rounded-full bg-green-500"></div>

                  Open 24/7 in Göteborg

                </div>

                <h1 className="text-5xl md:text-7xl font-black leading-tight">
                  {content[language].title}
                </h1>

                <p className="mt-8 text-zinc-300 text-lg leading-relaxed max-w-xl">
                  {content[language].subtitle}
                </p>

                <div className="mt-10 flex flex-wrap gap-4">

                  <button onClick={() => setBookingOpen(true)} className="bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] px-8 py-4 rounded-2xl font-semibold hover:bg-red-700 transition">
                    {content[language].book}
                  </button>

                  <button className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition">
                    {content[language].taxiBtn}
                  </button>

                </div>

                {/* STATS */}
                <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg">

                  <div>
                    <h2 className="text-3xl font-bold">{years}+</h2>

                    <p className="text-zinc-400 text-sm mt-1">
                      Years Experience
                    </p>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold">24/7</h2>

                    <p className="text-zinc-400 text-sm mt-1">
                      Taxi Support
                    </p>
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold">{customers.toLocaleString()}+</h2>

                    <p className="text-zinc-400 text-sm mt-1">
                      Customers
                    </p>
                  </div>

                </div>

              </motion.div>

              {/* RIGHT CARD */}
              <div className="flex justify-center">

                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2 }}
                  className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl"
                >
                  <h3 className="text-2xl font-bold mb-6">
                    {content[language].booking}
                  </h3>

                  <div className="space-y-4">

                    <input
                      type="text"
                      placeholder={content[language].fullName}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />

                    <input
                      type="text"
                      placeholder={content[language].phone}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />

                    <select className="w-full bg-black border border-zinc-700 rounded-xl px-5 py-4 outline-none focus:border-red-500">

                      <option>
                        {content[language].choose}
                      </option>

                      <option>
                        Auto Repair
                      </option>

                      <option>
                        Taxi Reservation
                      </option>

                      <option>
                        Road Assistance
                      </option>

                    </select>

                    <button className="w-full bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] py-4 rounded-xl font-semibold hover:bg-red-700 transition">
                      {content[language].submit}
                    </button>

                  </div>

                </motion.div>

              </div>

            </div>
          </section >
          {/* SERVICES */}
          < section id="services" className="bg-zinc-950 py-28 px-6" >

            <div className="max-w-7xl mx-auto">

              <div className="text-center mb-20">

                <p className="text-red-500 uppercase tracking-[0.3em] text-sm">
                  Our Services
                </p>

                <h2 className="text-5xl font-black mt-4">
                  Professional Automotive Solutions
                </h2>

              </div>

              <div className="grid md:grid-cols-3 gap-8">

                {/* CARD */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] transition duration-300 hover:-translate-y-2">

                  <div className="text-5xl mb-6">
                    🔧
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    Auto Repair
                  </h3>

                  <p className="text-zinc-400 leading-relaxed">
                    Professional diagnostics, engine repair,
                    maintenance, and complete vehicle service.
                  </p>

                </div>

                {/* CARD */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] transition duration-300 hover:-translate-y-2">

                  <div className="text-5xl mb-6">
                    🚕
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    Nordic Taxi
                  </h3>

                  <p className="text-zinc-400 leading-relaxed">
                    Clean Scandinavian taxi experience with
                    airport transfers and city transportation.
                  </p>

                </div>

                {/* CARD */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] transition duration-300 hover:-translate-y-2">

                  <div className="text-5xl mb-6">
                    ⚡
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    Road Assistance
                  </h3>

                  <p className="text-zinc-400 leading-relaxed">
                    Emergency support, towing, battery service,
                    and fast roadside assistance.
                  </p>

                </div>

              </div>

            </div>

          </section >

          {/* TAXI SECTION */}
          < section id="taxi" className="bg-black py-28 px-6" >

            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

              {/* LEFT */}
              <div>

                <p className="text-red-500 uppercase tracking-[0.3em] text-sm">
                  Premium Transport
                </p>

                <h2 className="text-5xl font-black mt-4 leading-tight">
                  Scandinavian Taxi Experience
                </h2>

                <p className="mt-8 text-zinc-400 text-lg leading-relaxed">
                  Modern vehicles, professional drivers,
                  fixed pricing, and premium comfort
                  across Göteborg.
                </p>

                <div className="mt-10 space-y-4">

                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <p>Airport Transfer</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <p>Corporate Taxi</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <p>24/7 Availability</p>
                  </div>

                </div>

                <button className="mt-10 bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] px-8 py-4 rounded-2xl font-semibold hover:bg-red-700 transition">
                  Reserve Taxi
                </button>

              </div>


              {/* RIGHT */}
              <div className="relative">

                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
                  alt=""
                  className="rounded-3xl shadow-2xl hover:shadow-[0_0_60px_rgba(255,255,255,0.08)] transition duration-500 border border-zinc-800"
                />

                <div className="absolute -bottom-8 -left-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl">

                  <h3 className="text-3xl font-black">
                    5★
                  </h3>

                  <p className="text-zinc-400 mt-2">
                    Trusted by thousands of customers
                  </p>

                </div>

              </div>

            </div>

          </section >

          {/* TESTIMONIALS */}
          <section className="bg-zinc-950 py-28 px-6 overflow-hidden">

            <div className="max-w-7xl mx-auto">

              <div className="text-center mb-20">

                <p className="text-red-500 uppercase tracking-[0.3em] text-sm">
                  Testimonials
                </p>

                <h2 className="text-5xl font-black mt-4">
                  What Our Customers Say
                </h2>

              </div>

              <div className="grid md:grid-cols-3 gap-8">

                {/* CARD */}
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
                >

                  <div className="flex items-center gap-1 text-yellow-400 text-xl mb-6">
                    ★★★★★
                  </div>

                  <p className="text-zinc-300 leading-relaxed">
                    Amazing service and very professional mechanics.
                    My car was fixed the same day.
                  </p>

                  <div className="mt-8">

                    <h3 className="font-bold text-lg">
                      Johan Eriksson
                    </h3>

                    <p className="text-zinc-500 text-sm">
                      Göteborg
                    </p>

                  </div>

                </motion.div>

                {/* CARD */}
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
                >

                  <div className="flex items-center gap-1 text-yellow-400 text-xl mb-6">
                    ★★★★★
                  </div>

                  <p className="text-zinc-300 leading-relaxed">
                    Clean taxi vehicles and very friendly drivers.
                    Premium Scandinavian experience.
                  </p>

                  <div className="mt-8">

                    <h3 className="font-bold text-lg">
                      Emma Larsson
                    </h3>

                    <p className="text-zinc-500 text-sm">
                      Stockholm
                    </p>

                  </div>

                </motion.div>

                {/* CARD */}
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
                >

                  <div className="flex items-center gap-1 text-yellow-400 text-xl mb-6">
                    ★★★★★
                  </div>

                  <p className="text-zinc-300 leading-relaxed">
                    Fast response, modern workshop and excellent customer support.
                  </p>

                  <div className="mt-8">

                    <h3 className="font-bold text-lg">
                      Alexander Nilsson
                    </h3>

                    <p className="text-zinc-500 text-sm">
                      Malmö
                    </p>

                  </div>

                </motion.div>

              </div>

            </div>

          </section>

          {/* FOOTER */}
          < footer id="contact" className="bg-zinc-950 border-t border-zinc-800 py-10 px-6" >

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

              <div>

                <img
                  src={logo}
                  alt="Motiva"
                  className="w-40 object-contain"
                />

                <p className="text-zinc-500 mt-2">
                  Nordic Auto & Taxi Service
                </p>

              </div>

              <div className="flex gap-8 text-zinc-400">

                <a href="#home" className="hover:text-red-500 transition">
                  Home
                </a>

                <a href="#services" className="hover:text-red-500 transition">
                  Services
                </a>

                <a href="#taxi" className="hover:text-red-500 transition">
                  Taxi
                </a>

                <a href="#contact" className="hover:text-red-500 transition">
                  Contact
                </a>

              </div>

              <p className="text-zinc-500 text-sm">
                © 2026 Motiva Nordic
              </p>

            </div>
            {/* BOOKING MODAL */}
            {bookingOpen && (

              <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-lg relative">

                  {/* CLOSE */}
                  <button
                    onClick={() => setBookingOpen(false)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>

                  <h2 className="text-3xl font-black mb-8">
                    Book Your Service
                  </h2>

                  <div className="space-y-4">

                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-black border border-zinc-700 rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />

                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="w-full bg-black border border-zinc-700 rounded-xl px-5 py-4 outline-none focus:border-red-500"
                    />

                    <select className="w-full bg-black border border-zinc-700 rounded-xl px-5 py-4 outline-none focus:border-red-500">

                      <option>
                        Auto Repair
                      </option>

                      <option>
                        Taxi Reservation
                      </option>

                      <option>
                        Road Assistance
                      </option>

                    </select>

                    <button className="w-full bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] py-4 rounded-xl font-semibold hover:bg-red-700 transition">
                      Confirm Booking
                    </button>

                  </div>

                </div>

              </div>

            )}
            {/* WHATSAPP FLOAT */}
            <a
              href="https://wa.me/46793453507"
              target="_blank"
              className="fixed bottom-6 right-6 z-50 bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-2xl hover:scale-110 transition"
            >
              💬
            </a>

          </footer >

        </div >
      )}
    </>
  );
}