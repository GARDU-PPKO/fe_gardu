import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [selectedDusun, setSelectedDusun] = useState<Dusun | null>(null);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 200); // Small delay to ensure DOM is ready
    }
  }, [location.hash]);
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
      <Navbar onOpenBooking={() => navigate('/packages')} />
      
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

      {/* Tombol Floating WhatsApp */}
      <a
        href={`https://wa.me/${waAdmin || '6281234567890'}?text=${encodeURIComponent('Halo Admin, saya ingin tanya tentang wisata Desa Getas')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-[52px] h-[52px] rounded-full bg-[#182cc1] hover:bg-[#1524a3] shadow-lg shadow-[#7692ff]/40 text-white transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Hubungi WhatsApp"
      >
        <MessageSquare size={22} />
      </a>

      <Footer />
    </div>
  );
}
