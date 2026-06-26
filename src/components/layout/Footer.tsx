import { ArrowRight, MapPin, Phone, Mail, Heart } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      {/* Footer */}
      <footer className="bg-[#052e16] text-white pt-16 pb-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-2xl tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
                DESA<span className="text-[#16a34a]">GETAS</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Desa Wisata unggulan di Kabupaten Kendal dengan keindahan alam, budaya yang kaya, dan kearifan lokal yang terjaga.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-5 text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>Kontak Kami</h4>
            <ul className="text-white/70 text-sm space-y-3" style={{ fontFamily: "Inter, sans-serif" }}>
              <li className="flex items-center gap-3"><Phone size={16} className="text-green-500" /> +62 812-3456-7890</li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-green-500" /> kontak@desagetas.id</li>
              <li className="flex items-center gap-3"><MapPin size={16} className="text-green-500" /> Kec. Singorojo, Kab. Kendal</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-5 text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>Jelajahi</h4>
            <ul className="text-white/70 text-sm space-y-3" style={{ fontFamily: "Inter, sans-serif" }}>
              <li><button onClick={() => scrollTo("#hero")} className="hover:text-white hover:translate-x-1 transition flex items-center gap-2"><ArrowRight size={14} className="text-green-500" /> Beranda</button></li>
              <li><button onClick={() => scrollTo("#paket")} className="hover:text-white hover:translate-x-1 transition flex items-center gap-2"><ArrowRight size={14} className="text-green-500" /> Paket Wisata</button></li>
              <li><button onClick={() => scrollTo("#umkm")} className="hover:text-white hover:translate-x-1 transition flex items-center gap-2"><ArrowRight size={14} className="text-green-500" /> UMKM Desa</button></li>
              <li><button onClick={() => scrollTo("#budaya")} className="hover:text-white hover:translate-x-1 transition flex items-center gap-2"><ArrowRight size={14} className="text-green-500" /> Seni Budaya</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-5 text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>Sosial Media</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-lg"><FaInstagram /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-lg"><FaFacebook /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-lg"><FaYoutube /></a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            &copy; {new Date().getFullYear()} Pemerintah Desa Getas. Hak Cipta Dilindungi.
          </p>
          <p className="text-white/50 text-xs flex items-center gap-1" style={{ fontFamily: "Inter, sans-serif" }}>
            Dibuat dengan <Heart size={12} className="text-red-500" /> di Kendal, Jawa Tengah
          </p>
        </div>
      </footer>
    </>
  );
}