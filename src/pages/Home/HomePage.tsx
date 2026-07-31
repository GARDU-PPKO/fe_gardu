import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/sections/Hero";
import DusunPage from "../../components/sections/DusunPage";
import TourPackages from "../../components/sections/TourPackages";
import UMKMSection from "../../components/sections/UMKMSection";
import KebudayaanSection from "../../components/sections/KebudayaanSection";
import ARSection from "../../components/sections/ARSection";
import KontakSection from "../../components/sections/KontakSection";
import { getSettings } from "../../services/village.service";
import type { Dusun, Setting } from "../../types";

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedDusun, setSelectedDusun] = useState<Dusun | null>(null);
  const [waAdmin, setWaAdmin] = useState("6281234567890");

  useEffect(() => {
    getSettings('wa_admin')
      .then(res => {
        const wa = res?.data?.find((item: Setting) => item.key === 'wa_admin');
        if (wa?.value) {
          setWaAdmin(wa.value);
        }
      })
      .catch(() => {
        // Tetap menggunakan nomor default agar tombol WA floating selalu tersedia
      });
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#091540] font-sans selection:bg-[#e8edff] selection:text-[#182cc1]">
      <Navbar onOpenBooking={() => navigate('/booking/package')} />
      
      {selectedDusun && (
        <DusunPage dusun={selectedDusun} onClose={() => setSelectedDusun(null)} />
      )}

      <main>
        <Hero onSelectDusun={d => setSelectedDusun(d)} />
        <ARSection />
        <TourPackages />
        <UMKMSection />
        <KebudayaanSection />
        <KontakSection />
      </main>

      {/* Tombol Floating WhatsApp - Selalu Aktif */}
      <a
        href={`https://wa.me/${waAdmin || '6281234567890'}?text=${encodeURIComponent('Halo Admin, saya ingin tanya tentang wisata Desa Getas')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#182CC1] hover:bg-[#122190] text-white w-14 h-14 rounded-full shadow-xl shadow-[#182CC1]/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center group border-2 border-white/30"
        aria-label="Hubungi WhatsApp"
      >
        <MessageSquare size={26} className="text-white transition-transform group-hover:scale-110" />
      </a>

      <Footer />
    </div>
  );
}
