import { LogoGardu } from "../../App";

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <footer className="bg-[#052e16] text-white pt-16 pb-8 px-4 sm:px-8 mt-auto border-t border-[#16a34a]/20">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <div className="lg:col-span-2 pr-8">
          <div className="flex items-center gap-3 mb-4">
            <img src={LogoGardu} alt="Logo Desa Getas" className="w-10 h-10 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-wide leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>
                DESA<span className="text-[#16a34a]">GETAS</span>
              </span>
              <span className="text-white/60 text-[10px] mt-1 tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>Kec. Singorojo · Kendal</span>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Mewujudkan desa yang maju, transparan, dan berdaya saing berbasis teknologi digital dan kearifan lokal.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-5 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Navigasi</h4>
          <ul className="text-white/70 text-sm space-y-3" style={{ fontFamily: "Inter, sans-serif" }}>
            <li><button onClick={() => scrollTo("#hero")} className="hover:text-white transition">Beranda</button></li>
            <li><button onClick={() => scrollTo("#paket")} className="hover:text-white transition">Paket</button></li>
            <li><button onClick={() => scrollTo("#umkm")} className="hover:text-white transition">UMKM</button></li>
            <li><button onClick={() => scrollTo("#budaya")} className="hover:text-white transition">Budaya</button></li>
            <li><button onClick={() => scrollTo("#kontak")} className="hover:text-white transition">Kontak</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-5 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Tautan</h4>
          <ul className="text-white/70 text-sm space-y-3" style={{ fontFamily: "Inter, sans-serif" }}>
            <li><a href="#" className="hover:text-white transition flex items-center gap-2">↗ Pemerintah Kab. Kendal</a></li>
            <li><a href="#" className="hover:text-white transition flex items-center gap-2">↗ Pemprov Jawa Tengah</a></li>
            <li><a href="#" className="hover:text-white transition flex items-center gap-2">↗ Portal LAPOR!</a></li>
            <li><a href="#" className="hover:text-white transition flex items-center gap-2">↗ PPID Desa</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/50 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
          &copy; 2025 Pemerintah Desa Getas, Kab. Kendal. Seluruh hak dilindungi.
        </p>
        <p className="text-white/50 text-xs flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
          ✧ Desa Digital Kendal 2025
        </p>
      </div>
    </footer>
  );
}