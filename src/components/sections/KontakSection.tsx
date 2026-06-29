import { useEffect, useState } from "react";
import { MapPin, Phone, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { getSettings, getVillageProfile } from "../../services/village.service";
import type { Setting, VillageProfile } from "../../types";

export default function KontakSection() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [faqs, setFaqs] = useState<VillageProfile[]>([]);

  useEffect(() => {
    getSettings('alamat_desa,wa_admin').then(res => {
      setSettings(Object.fromEntries(res.data.map((item: Setting) => [item.key, item.value])));
    });
    getVillageProfile().then(res => setFaqs(res.data));
  }, []);

  const contactItems = [
    { icon: MapPin, title: "Alamat", desc: settings.alamat_desa },
    { icon: Phone, title: "WhatsApp", desc: settings.wa_admin },
  ].filter(item => item.desc);

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
            {contactItems.map((item, idx) => (
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
                  <a aria-label="Facebook" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors active:scale-95 shadow-sm">
                   <FaFacebook size={14} />
                 </a>
                  <a aria-label="Instagram" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors active:scale-95 shadow-sm">
                   <FaInstagram size={14} />
                 </a>
                  <a aria-label="YouTube" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors active:scale-95 shadow-sm">
                   <FaYoutube size={14} />
                 </a>
                  <a aria-label="Website" className="w-8 h-8 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#16a34a] hover:bg-[#16a34a] hover:text-white transition-colors active:scale-95 shadow-sm">
                   <Globe size={14} />
                 </a>
               </div>
            </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div className="bg-green-50/20 border border-[#bbf7d0]/40 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#052e16] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Pertanyaan yang Sering Diajukan</h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="border-b border-[#bbf7d0]/30 pb-3 last:border-0 last:pb-0">
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left py-2 gap-3"
                    >
                      <span className="text-[#052e16] font-bold text-xs sm:text-sm hover:text-[#16a34a] transition-colors" style={{ fontFamily: "Poppins, sans-serif" }}>{faq.judul}</span>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-[#16a34a] flex-shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="text-[#4b7a55] text-xs leading-relaxed mt-2 animate-fadeIn" style={{ fontFamily: "Inter, sans-serif" }}>
                        {faq.konten}
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
