import { useState, useEffect } from "react";
import { Menu, X, Camera, Ticket } from "lucide-react";
import { LogoGardu } from "../../App";


const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};



const NAV = [
  { label: "Beranda",  href: "#hero" },
  { label: "Wisata",   href: "#wisata" },
  { label: "Paket",    href: "#paket" },
  { label: "UMKM",     href: "#umkm" },
  { label: "Budaya",   href: "#budaya" },
  { label: "Kontak",   href: "#kontak" },
];

export default function Navbar({ onOpenBooking }: { onOpenBooking: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-500 ${scrolled ? "top-3 w-[calc(100%-2rem)] max-w-5xl bg-white/85 backdrop-blur-md border border-[#bbf7d0]/30 shadow-xl rounded-full px-2" : "top-0 w-full bg-white/90 backdrop-blur-md border-b border-[#bbf7d0]/10 px-0"}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-3">

        {/* ── Left: Logo + AR Explore ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={() => scrollTo("#hero")} className="flex items-center gap-2 flex-shrink-0">
            <img src={LogoGardu} alt="Logo Desa Getas" className="w-8 h-8 object-contain" />
            <span className="font-bold text-[#0a1f0f] text-sm tracking-wide hidden sm:block" style={{ fontFamily: "Poppins, sans-serif" }}>
              DESA<span className="text-[#16a34a]">GETAS</span>
            </span>
          </button>

          {/* AR Explore — prominent left button */}
          <button onClick={() => scrollTo("#ar")}
            className="hidden sm:flex items-center gap-1.5 pl-3 pr-3.5 py-1.5 rounded-xl border border-[#bbf7d0] bg-white hover:bg-[#dcfce7] hover:border-[#16a34a]/50 transition-all group shadow-sm"
            style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#16a34a] to-[#4ade80] flex items-center justify-center flex-shrink-0">
              <Camera size={11} className="text-white" />
            </div>
            <span className="text-xs font-bold text-[#16a34a]">AR Explore</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </button>
        </div>

        {/* ── Centre: Nav links ── */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.href)}
              className="px-3.5 py-1.5 text-sm text-[#166534] hover:text-[#16a34a] hover:bg-[#dcfce7] rounded-full transition-all font-semibold relative group"
              style={{ fontFamily: "Inter, sans-serif" }}>
              {l.label}
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#16a34a] transition-all duration-300 group-hover:w-3/5" />
            </button>
          ))}
        </div>

        {/* ── Right: Pesan Sekarang ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={onOpenBooking}
            className="hidden sm:flex items-center gap-1.5 px-4.5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-bold rounded-full transition shadow-md shadow-green-200/60 active:scale-95"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            <Ticket size={14} />
            Pesan Sekarang
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#166534] hover:bg-[#dcfce7] transition">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={`absolute top-full left-0 right-0 mt-2 mx-2 bg-white border border-[#bbf7d0]/40 shadow-xl rounded-2xl p-4 space-y-1 md:hidden z-50`}>
          <button onClick={() => { scrollTo("#ar"); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#16a34a] hover:bg-[#dcfce7] rounded-lg transition flex items-center gap-2">
            <Camera size={14} /> AR Explore
          </button>
          {NAV.map(l => (
            <button key={l.label} onClick={() => { scrollTo(l.href); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-[#166534] hover:text-[#16a34a] hover:bg-[#dcfce7] rounded-lg transition"
              style={{ fontFamily: "Inter, sans-serif" }}>
              {l.label}
            </button>
          ))}
          <div className="pt-2">
            <button onClick={() => { onOpenBooking(); setOpen(false); }}
              className="w-full py-3 bg-[#16a34a] text-white font-bold rounded-full text-sm flex items-center justify-center gap-2 shadow-md shadow-green-200"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              <Ticket size={15} /> Pesan Sekarang
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}