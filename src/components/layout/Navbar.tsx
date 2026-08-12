import { useState, useEffect } from "react";
import { Menu, X, Camera, Ticket } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoGardu from "../../assets/Logo_Gardu_V2.png";

const NAV = [
  { label: "Beranda", href: "#hero" },
  { label: "Paket", href: "#paket" },
  { label: "UMKM", href: "#umkm" },
  { label: "Budaya", href: "#budaya" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar({ onOpenBooking }: { onOpenBooking?: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    /* Outer wrapper — flex-col so pill + dropdown stack vertically */
    <div className="fixed top-3 left-0 right-0 z-50 flex flex-col items-center px-3 sm:px-4 pointer-events-none gap-2">

      {/* ── Pill navbar ── */}
      <nav
        className={`pointer-events-auto transition-all duration-300 rounded-full w-full max-w-5xl ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border border-[#c5d0ff]"
            : "bg-white/85 backdrop-blur-md border border-white/50 shadow-sm"
        }`}
      >
        <div className="px-3 sm:px-5 md:px-7 h-14 sm:h-16 flex items-center justify-between gap-3">

          {/* Left: Logo + Brand */}
          <button
            onClick={() => handleNavClick("#hero")}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <img
              src={LogoGardu}
              alt="Logo Desa Getas"
              className="h-9 sm:h-10 w-auto object-contain flex-shrink-0"
            />
            <div className="flex flex-col leading-tight">
              <div
                className="font-black text-[#091540] text-[11px] sm:text-xs md:text-sm leading-tight"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                DESA WISATA <span className="text-[#182cc1]">GETAS</span>
              </div>
              <div className="text-[#3d518c] text-[8px] sm:text-[9px] leading-tight tracking-wide">
                Kec. Singorojo · Kendal
              </div>
            </div>
          </button>

          {/* Centre: Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            <button
              onClick={() => handleNavClick("#ar")}
              className="flex items-center gap-1.5 pl-3 pr-3.5 py-1.5 rounded-full border border-[#c5d0ff] bg-white hover:bg-[#e8edff] hover:border-[#182cc1]/50 transition-all shadow-sm mr-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#182cc1] to-[#7692ff] flex items-center justify-center flex-shrink-0">
                <Camera size={11} className="text-white" />
              </div>
              <span className="text-xs font-bold text-[#182cc1]">AR Explore</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#7692ff] animate-pulse" />
            </button>
            {NAV.map((l) => (
              <button
                key={l.label}
                onClick={() => handleNavClick(l.href)}
                className="px-3 py-2 text-sm text-[#1d2e80] hover:text-[#182cc1] hover:bg-[#e8edff] rounded-full transition-all font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right: Buttons + Hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop */}
            <button
              onClick={onOpenBooking}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-[#182cc1] hover:bg-[#1524a3] text-white text-sm font-bold rounded-full transition shadow-md shadow-[#c5d0ff]/60"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <Ticket size={14} />
              Pesan Sekarang
            </button>

            {/* Tablet: compact Pesan */}
            <button
              onClick={onOpenBooking}
              className="hidden md:flex lg:hidden items-center gap-1.5 px-3 py-2 bg-[#182cc1] hover:bg-[#1524a3] text-white text-xs font-bold rounded-full transition shadow-md"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <Ticket size={12} />
              Pesan
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-[#1d2e80] hover:bg-[#e8edff] transition flex-shrink-0"
              aria-label={open ? "Tutup menu" : "Buka menu"}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile/Tablet dropdown — stacks BELOW the pill ── */}
      {open && (
        <div className="pointer-events-auto w-full max-w-5xl bg-white/97 backdrop-blur-md border border-[#c5d0ff] rounded-3xl px-3 py-3 shadow-2xl shadow-[#182cc1]/10 flex flex-col gap-1 lg:hidden">
          {/* AR Explore */}
          <button
            onClick={() => handleNavClick("#ar")}
            className="w-full text-left px-4 py-3 text-sm font-bold text-[#182cc1] hover:bg-[#e8edff] rounded-2xl transition flex items-center gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#182cc1] to-[#7692ff] flex items-center justify-center flex-shrink-0">
              <Camera size={14} className="text-white" />
            </div>
            <span>AR Explore</span>
            <div className="w-2 h-2 rounded-full bg-[#7692ff] animate-pulse ml-auto" />
          </button>

          {/* Divider */}
          <div className="h-px bg-[#e8edff] mx-2" />

          {/* Nav items */}
          {NAV.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNavClick(l.href)}
              className="w-full text-left px-4 py-3 text-sm text-[#1d2e80] hover:text-[#182cc1] hover:bg-[#e8edff] rounded-2xl transition font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {l.label}
            </button>
          ))}

          {/* Pesan Sekarang — mobile only */}
          <div className="pt-1 pb-1 px-1 md:hidden">
            <button
              onClick={() => { onOpenBooking?.(); setOpen(false); }}
              className="w-full py-3 bg-[#182cc1] hover:bg-[#1524a3] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md transition"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <Ticket size={15} /> Pesan Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}