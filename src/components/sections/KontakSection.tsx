import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const FAQS = [
  { q: "Bagaimana akses jalan menuju lokasi tubing?", a: "Akses jalan menuju Desa Getas sudah beraspal baik dan dapat dilalui oleh kendaraan roda dua maupun roda empat (mobil pribadi & minibus/elf)." },
  { q: "Apakah wisata tubing aman untuk pemula & anak-anak?", a: "Sangat aman! Seluruh peserta wajib mengenakan perlengkapan keselamatan standar (helm & pelampung) serta didampingi oleh pemandu berpengalaman di setiap rombongan." },
  { q: "Apakah harus melakukan pemesanan (booking) terlebih dahulu?", a: "Untuk hari kerja biasa (weekdays), Anda bisa memesan langsung. Namun untuk akhir pekan (weekends) atau paket rombongan, kami sangat menyarankan untuk booking minimal H-3 via WhatsApp." },
  { q: "Bagaimana cara melakukan pembayaran?", a: "Pembayaran dapat dilakukan melalui transfer bank setelah konfirmasi pemesanan dengan admin via WhatsApp, atau tunai (cash) langsung di lokasi saat hari kedatangan." },
];

export default function KontakSection() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  return (
    <section id="kontak" className="py-20 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16a34a] mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>
            Hubungi Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1f0f]" style={{ fontFamily: "Poppins, sans-serif" }}>
            Kontak & Pertanyaan Umum
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: Info */}
          <div className="space-y-3.5">
            {[
              { icon: MapPin, title: "Alamat", desc: "Jl. Raya Getas No. 1, Kec. Singorojo, Kab. Kendal 51382" },
              { icon: Phone, title: "Telepon", desc: "+62 812-3456-7890" },
              { icon: Mail, title: "Email", desc: "desagetas@kendalkab.go.id" },
              { icon: Clock, title: "Jam Pelayanan Kantor", desc: "Senin–Jumat: 08.00–15.00 WIB" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4.5 rounded-2xl bg-[#f0fdf4]/50 border border-[#bbf7d0]/40 items-center hover:border-green-400 hover:bg-[#f0fdf4]/70 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wide mb-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{item.title}</h4>
                  <p className="text-[#0a1f0f] text-sm font-semibold whitespace-pre-line leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
            
            {/* Social Media */}
            <div className="flex flex-col gap-2.5 p-4.5 rounded-2xl bg-[#f0fdf4]/50 border border-[#bbf7d0]/40 hover:border-green-400 transition-all duration-300">
               <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>Media Sosial Resmi</h4>
               <div className="flex gap-3">
                 <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors active:scale-95 shadow-sm">
                   <FaFacebook size={14} />
                 </a>
                 <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors active:scale-95 shadow-sm">
                   <FaInstagram size={14} />
                 </a>
                 <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors active:scale-95 shadow-sm">
                   <FaYoutube size={14} />
                 </a>
                 <a href="#" aria-label="Website" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors active:scale-95 shadow-sm">
                   <Globe size={14} />
                 </a>
               </div>
            </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div className="bg-green-50/20 border border-[#bbf7d0]/40 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#052e16] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Pertanyaan yang Sering Diajukan</h3>
            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="border-b border-[#bbf7d0]/30 pb-3 last:border-0 last:pb-0">
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left py-2 gap-3"
                    >
                      <span className="text-[#052e16] font-bold text-xs sm:text-sm hover:text-[#16a34a] transition-colors" style={{ fontFamily: "Poppins, sans-serif" }}>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-[#16a34a] flex-shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="text-[#4b7a55] text-xs leading-relaxed mt-2 animate-fadeIn" style={{ fontFamily: "Inter, sans-serif" }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
