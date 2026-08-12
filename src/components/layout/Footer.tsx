import { ExternalLink, Zap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoGardu from "../../assets/Logo_Gardu_V2.png";

const NAV = [
  { label: "Beranda", href: "#hero" },
  { label: "Paket", href: "#paket" },
  { label: "UMKM", href: "#umkm" },
  { label: "Budaya", href: "#budaya" },
  { label: "Kontak", href: "#kontak" },
];

const MITRA = [
  { label: "Disbusparekraf Jawa Tengah", url: "https://www.disbudparekraf.jatengprov.go.id" },
  { label: "Disporapar Kendal", url: "https://disporapar.kendalkab.go.id" },
  { label: "Puskesmas Singorojo 1", url: "https://puskesmassingorojo1.kendalkab.go.id" },
  { label: "Kecamatan Singorojo", url: "https://kecamatan-singorojo.kendalkab.go.id" },
  { label: "Desa Getas", url: "https://getas-singorojo.desa.id" },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollTo = (href: string) => {
    if (location.pathname === "/") {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + href);
    }
  };

  return (
    <footer className="bg-[#091540] text-white px-4 sm:px-8 py-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={LogoGardu} alt="Logo Desa Getas" className="h-12 w-auto object-contain" />
              <div>
                <div className="font-black text-white text-base sm:text-lg leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
                  DESA WISATA <span className="text-[#7692ff]">GETAS</span>
                </div>
                <div className="text-white/50 text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>Kec. Singorojo · Kendal</div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              Mewujudkan desa yang maju, transparan, dan berdaya saing berbasis teknologi digital dan kearifan lokal.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="font-semibold mb-4 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Navigasi</h4>
            <div className="space-y-2">
              {NAV.map(l => (
                <button key={l.label} onClick={() => scrollTo(l.href)}
                  className="block text-white/50 hover:text-white text-sm transition text-left" style={{ fontFamily: "Inter, sans-serif" }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mitra Kami */}
          <div className="sm:col-span-2 md:col-span-2">
            <h4 className="font-semibold mb-4 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Mitra Kami</h4>
            <div className="flex flex-col space-y-2.5">
              {MITRA.map(m => (
                <a
                  key={m.label}
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/50 hover:text-[#7692ff] text-sm cursor-pointer transition group"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <ExternalLink size={11} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <span>{m.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs text-center sm:text-left" style={{ fontFamily: "Inter, sans-serif" }}>
            © 2026 Pemerintah Desa Getas, Kab. Kendal. Seluruh hak dilindungi.
          </p>
          <div className="flex items-center gap-2 text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            <Zap size={11} className="text-[#7692ff]" />Desa Digital Kendal 2026
          </div>
        </div>
      </div>
    </footer>
  );
}