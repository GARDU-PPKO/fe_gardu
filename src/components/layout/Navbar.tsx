import { useState, useEffect } from "react";
import { Menu, X, Camera, Ticket } from "lucide-react";
import LogoGardu from "../../assets/Logo_Gardu_V2.png";

const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

const NAV = [
  { label: "Beranda",  href: "#hero" },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#c5d0ff]" : "bg-white/90 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-3">

        {/* ── Left: Logo + AR Explore ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={() => scrollTo("#hero")} className="flex items-center gap-2 flex-shrink-0 text-left">
            <img src={LogoGardu} alt="Logo Desa Getas" className="h-11 w-auto object-contain" />
            <div className="hidden sm:block">
              <div className="font-black text-[#091540] text-sm leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
                DESA WISATA <span className="text-[#182cc1]">GETAS</span>
              </div>
              <div className="text-[#3d518c] text-[9px] leading-tight tracking-wide">Kec. Singorojo · Kendal</div>
            </div>
          </button>

          {/* AR Explore — prominent left button (capsule style with circle icon bg) */}
          <button onClick={() => scrollTo("#ar")}
            className="hidden sm:flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-[#c5d0ff] bg-white hover:bg-[#e8edff] hover:border-[#182cc1]/50 transition-all group shadow-sm"
            style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#182cc1] to-[#7692ff] flex items-center justify-center flex-shrink-0 shadow-xs">
              <Camera size={13} className="text-white transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs font-bold text-[#182cc1]">AR Explore</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#7692ff] animate-pulse" />
          </button>
        </div>

        {/* ── Centre: Nav links (Wisata removed) ── */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {NAV.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.href)}
              className="px-3 py-2 text-sm text-[#1d2e80] hover:text-[#182cc1] hover:bg-[#e8edff] rounded-full transition-all font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* ── Right: Pesan Sekarang (capsule) ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={onOpenBooking}
            className="hidden sm:flex items-center gap-1.5 px-5 py-2 bg-[#182cc1] hover:bg-[#1524a3] text-white text-sm font-bold rounded-full transition shadow-md shadow-[#c5d0ff]/60"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            <Ticket size={14} />
            Pesan Sekarang
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-[#1d2e80] hover:bg-[#e8edff] transition">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#c5d0ff] px-5 py-3 space-y-1">
          <button onClick={() => { scrollTo("#ar"); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#182cc1] hover:bg-[#e8edff] rounded-full transition flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#182cc1] to-[#7692ff] flex items-center justify-center flex-shrink-0">
              <Camera size={13} className="text-white" />
            </div>
            <span>AR Explore</span>
          </button>
          {NAV.map(l => (
            <button key={l.label} onClick={() => { scrollTo(l.href); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-[#1d2e80] hover:text-[#182cc1] hover:bg-[#e8edff] rounded-full transition font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}>
              {l.label}
            </button>
          ))}
          <div className="pt-2">
            <button onClick={() => { onOpenBooking(); setOpen(false); }}
              className="w-full py-3 bg-[#182cc1] text-white font-bold rounded-full text-sm flex items-center justify-center gap-2 shadow-md"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              <Ticket size={15} /> Pesan Sekarang
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}