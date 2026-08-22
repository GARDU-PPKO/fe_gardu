import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock, Globe } from "lucide-react";
import { FaInstagram, FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";
import { getSettings } from "../../services/village.service";
import type { Setting } from "../../types";

export default function KontakSection() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    getSettings('alamat_desa,wa_admin,email_desa,jam_pelayanan,sosmed_ig,sosmed_fb,sosmed_yt,sosmed_tiktok,sosmed_web').then(res => {
      setSettings(Object.fromEntries(res.data.map((item: Setting) => [item.key, item.value])));
    });
  }, []);

  const getJamPelayanan = (val?: string) => {
    if (!val) return "Setiap Hari: 08.00–15.00 WIB";
    return val.replace(/Senin[–-]Jumat/gi, "Setiap Hari");
  };

  const contactItems = [
    { icon: MapPin, title: "Alamat", desc: settings.alamat_desa || "Jl. Raya Getas No. 1, Kec. Singorojo, Kab. Kendal 51382" },
    { icon: Phone, title: "Telepon", desc: settings.wa_admin || "–" },
    { icon: Mail, title: "Email", desc: settings.email_desa || "–" },
    { icon: Clock, title: "Jam Pelayanan", desc: getJamPelayanan(settings.jam_pelayanan) },
  ];

  const isValidSosmed = (val?: string) => {
    if (!val) return false;
    const trimmed = val.trim();
    return trimmed.length > 0 && trimmed !== "#" && trimmed !== "-" && trimmed !== "–";
  };

  // Social media dynamic from API — hanya muncul jika data ada / tidak kosong
  const socialLinks = [
    isValidSosmed(settings.sosmed_ig) && {
      href: settings.sosmed_ig.startsWith("http") ? settings.sosmed_ig : `https://instagram.com/${settings.sosmed_ig.replace(/^@/, '')}`,
      label: "Instagram",
      icon: <FaInstagram size={16} className="group-hover:scale-110 transition-transform" />,
      hoverColor: "hover:border-[#E1306C] hover:text-[#E1306C]",
    },
    isValidSosmed(settings.sosmed_fb) && {
      href: settings.sosmed_fb.startsWith("http") ? settings.sosmed_fb : `https://${settings.sosmed_fb}`,
      label: "Facebook",
      icon: <FaFacebook size={16} className="group-hover:scale-110 transition-transform" />,
      hoverColor: "hover:border-[#1877F2] hover:text-[#1877F2]",
    },
    isValidSosmed(settings.sosmed_yt) && {
      href: settings.sosmed_yt.startsWith("http") ? settings.sosmed_yt : `https://${settings.sosmed_yt}`,
      label: "YouTube",
      icon: <FaYoutube size={16} className="group-hover:scale-110 transition-transform" />,
      hoverColor: "hover:border-[#FF0000] hover:text-[#FF0000]",
    },
    isValidSosmed(settings.sosmed_tiktok) && {
      href: settings.sosmed_tiktok.startsWith("http") ? settings.sosmed_tiktok : `https://tiktok.com/@${settings.sosmed_tiktok.replace(/^@/, '')}`,
      label: "TikTok",
      icon: <FaTiktok size={16} className="group-hover:scale-110 transition-transform" />,
      hoverColor: "hover:border-[#010101] hover:text-[#010101]",
    },
    isValidSosmed(settings.sosmed_web) && {
      href: settings.sosmed_web.startsWith("http") ? settings.sosmed_web : `https://${settings.sosmed_web}`,
      label: "Website",
      icon: <Globe size={16} className="group-hover:scale-110 transition-transform" />,
      hoverColor: "hover:border-[#182cc1] hover:text-[#182cc1]",
    },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; hoverColor: string }[];

  // Fallback: jika belum ada data sama sekali dari API, tampilkan Instagram default Gardu Tourism
  const displaySocials = socialLinks.length > 0 ? socialLinks : [
    {
      href: "https://www.instagram.com/gardutourism.id/",
      label: "Instagram",
      icon: <FaInstagram size={16} className="group-hover:scale-110 transition-transform" />,
      hoverColor: "hover:border-[#E1306C] hover:text-[#E1306C]",
    },
  ];

  return (
    <section id="kontak" className="py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#182cc1]" style={{ fontFamily: "Inter, sans-serif" }}>Hubungi Kami</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#091540] mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>Kontak &amp; Lokasi</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            {contactItems.map(c => (
              <div key={c.title} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#c5d0ff] bg-[#eef2ff]">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e8edff] flex items-center justify-center flex-shrink-0">
                  <c.icon size={16} className="text-[#182cc1]" />
                </div>
                <div>
                  <div className="text-[#3d518c] text-xs mb-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{c.title}</div>
                  <div className="text-[#091540] text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{c.desc}</div>
                </div>
              </div>
            ))}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#c5d0ff] bg-[#eef2ff]">
              <div className="text-[#3d518c] text-xs mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Media Sosial</div>
              <div className="flex gap-3 flex-wrap">
                {displaySocials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-9 h-9 rounded-full border border-[#c5d0ff] bg-white ${s.hoverColor} text-[#3d518c] transition flex items-center justify-center group`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-[#c5d0ff] shadow-sm h-64 sm:h-80 md:h-auto">
            <iframe
              title="Peta Desa Getas"
              src="https://maps.google.com/maps?q=-7.0817,110.1522&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
