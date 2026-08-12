import { useEffect, useState } from "react";
import { Users, Briefcase, Mountain, TreePine, Waves, Building2, Hash, Home, Award } from "lucide-react";
import { getSettings, getVillageStats } from "../../services/village.service";
import DusunSlider from "./DusunSlider";
import defaultHeroImg from "../../assets/image-6.png";
import type { Dusun, Setting, VillageStat } from "../../types";

const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

const ICON_MAP: Record<string, typeof Users> = {
  users: Users, home: Home, briefcase: Briefcase, mountain: Mountain, treepine: TreePine, award: Award, building: Building2, hash: Hash
};

const DEFAULT_STATS = [
  { label: "Wisatawan / Tahun", value: "8.500+", icon: Mountain },
  { label: "UMKM Aktif", value: "62 unit", icon: Briefcase },
  { label: "Total Penduduk", value: "4.287", icon: Users },
  { label: "Luas Wilayah", value: "12,4 km²", icon: TreePine },
  { label: "Jumlah Dusun", value: "10 Dusun", icon: Building2 },
  { label: "Kode Pos", value: "51382", icon: Hash },
];

export default function Hero({ onSelectDusun }: { onSelectDusun: (d: Dusun) => void }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<VillageStat[]>([]);

  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowStats(window.scrollY > 150);
    window.addEventListener("scroll", handleScroll);
    
    getSettings().then(res => {
      if (res.data) {
        setSettings(Object.fromEntries(res.data.map((item: Setting) => [item.key, item.value])));
      }
    });
    getVillageStats().then(res => {
      if (res.data && res.data.length >= 6) {
        setStats(res.data.slice(0, 6));
      } else {
        setStats([]);
      }
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroImage = settings.hero_img || defaultHeroImg;

  const villageName = settings.nama_desa ?? "DESA WISATA GETAS";
  const displayTitle = villageName.toUpperCase().includes("GETAS")
    ? "DESA WISATA GETAS"
    : villageName.toUpperCase();

  const statItems = stats.length >= 6 ? stats.map(s => {
    const IconComponent = (s.icon && ICON_MAP[s.icon.toLowerCase()]) || Users;
    return {
      label: s.label,
      value: `${s.nilai}${s.satuan ? ` ${s.satuan}` : ''}`,
      icon: IconComponent
    };
  }) : DEFAULT_STATS;

  return (
    <>
      <section id="hero" className="relative w-full min-h-screen bg-[#091540]">
        <img
          src={heroImage || defaultHeroImg}
          alt="Tubing Sungai Desa Getas"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#091540] via-[#091540]/40 to-transparent" />

        {/* Big title like WANDER */}
        <div className="absolute inset-0 flex flex-col justify-end pb-20 sm:pb-28 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto w-full relative">
            {/* Inline Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-2">
                <TreePine size={14} className="text-[#a5f3fc]" /> Desa Wisata Alam
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Online
              </span>
            </div>

            <p className="text-white/80 text-sm font-medium mb-2 tracking-widest uppercase" style={{ fontFamily: "Inter, sans-serif" }}>
              Kecamatan Singorojo · Kabupaten Kendal
            </p>
            <h1
              className="font-black text-white leading-none mb-6"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                letterSpacing: "-0.02em",
                textShadow: "0 4px 40px rgba(0,0,0,0.4)",
              }}>
              {displayTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => scrollTo("#paket")}
                className="flex items-center gap-2 px-6 py-3 bg-white text-[#091540] text-sm font-bold rounded-full hover:bg-[#e8edff] transition shadow-xl"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                <Waves size={16} className="text-[#182cc1]" />
                Jelajahi Wisata Tubing
              </button>
              <button onClick={() => scrollTo("#kontak")}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold rounded-full hover:bg-white/20 transition"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                Layanan Online
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content below hero */}
      <div className="bg-[#f8faff] px-3 sm:px-6 lg:px-8 pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* ── Unified Stats Container ── */}
          <div className={`-mt-16 relative z-10 transition-all duration-1000 ease-out transform ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
            <div className="bg-white/95 backdrop-blur-xl border border-[#c5d0ff] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-xl shadow-[#091540]/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[#e8edff]">
              {statItems.map((s, idx) => (
                <div key={s.label} className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${idx !== 0 && idx % 3 !== 0 ? 'lg:pl-6' : ''} ${idx !== 0 && idx % 2 !== 0 ? 'md:pl-6' : ''} pt-4 md:pt-0 first:pt-0`}>
                  <div className="w-12 h-12 rounded-2xl bg-[#e8edff] text-[#182cc1] flex items-center justify-center flex-shrink-0">
                    <s.icon size={22} />
                  </div>
                  <div>
                    <div className="font-black text-[#091540] text-lg leading-tight mb-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</div>
                    <div className="text-[#3d518c] text-xs font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Dusun slider ── */}
          <div className="mt-16">
            <DusunSlider onSelect={onSelectDusun} />
          </div>
        </div>
      </div>
    </>
  );
}
