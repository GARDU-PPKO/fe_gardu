import { useState } from "react";
import { X, MessageSquare, Ticket } from "lucide-react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import DusunPage from "./components/sections/DusunPage";
import TourPackages from "./components/sections/TourPackages";
import UMKMSection from "./components/sections/UMKMSection";
import KebudayaanSection from "./components/sections/KebudayaanSection";
import StatistikSection from "./components/sections/StatistikSection";
import ARSection from "./components/sections/ARSection";
import KontakSection from "./components/sections/KontakSection";
import { PACKAGES } from "./data/mockData";
import type { DusunData } from "./data/mockData";

import LogoGarduImg from "./assets/Logo_Gardu_V2.png";

export const LogoGardu = LogoGarduImg;

export default function App() {
  const [selectedDusun, setSelectedDusun] = useState<DusunData | null>(null);
  const [bookingPkg, setBookingPkg] = useState<typeof PACKAGES[0] | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-200">
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
      
      {selectedDusun ? (
        <DusunPage dusun={selectedDusun} onClose={() => setSelectedDusun(null)} />
      ) : (
        <main>
          <Hero onSelectDusun={setSelectedDusun} />
          <ARSection />
          <TourPackages onBook={(pkg) => setBookingPkg(pkg)} />
          <UMKMSection />
          <KebudayaanSection />
          <StatistikSection />
          <KontakSection />
        </main>
      )}

      {/* Booking Modal Dummy */}
      {(isBookingOpen || bookingPkg) && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative">
            <button onClick={() => { setIsBookingOpen(false); setBookingPkg(null); }} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition">
              <X size={16} />
            </button>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#052e16] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Form Pemesanan
            </h3>
            <p className="text-[#4b7a55] text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Silakan hubungi admin via WhatsApp untuk memproses pesanan {bookingPkg ? <strong className="text-green-700">{bookingPkg.name}</strong> : "paket wisata"}.
            </p>
            <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20pesan%20paket%20wisata"
               target="_blank" rel="noopener noreferrer"
               className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold flex items-center justify-center gap-2 transition"
               style={{ fontFamily: "Poppins, sans-serif" }}>
              <MessageSquare size={16} />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      )}

      
      <Footer />
    </div>
  );
}