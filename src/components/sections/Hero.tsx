import { useEffect, useState } from "react";
import { Users, Briefcase, Mountain, TreePine, Waves, Building2, Hash, Home, Award } from "lucide-react";
import { getDusun } from "../../services/dusun.service";
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
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    getSettings('nama_desa').then(res => {
      setSettings(Object.fromEntries(res.data.map((item: Setting) => [item.key, item.value])));
    });
    getVillageStats().then(res => {
      if (res.data && res.data.length >= 6) {
        setStats(res.data.slice(0, 6));
      } else {
        setStats([]);
      }
    });
    getDusun().then(res => {
      const firstDusun = res.data.find((item: Dusun) => item.hero_img || item.thumbnail);
      setHeroImage(firstDusun?.hero_img ?? firstDusun?.thumbnail ?? defaultHeroImg);
    });
  }, []);

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
    <section id="hero" className="pt-20 pb-8 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* framed hero image — WANDER style */}
        <div className="relative rounded-3xl overflow-hidden bg-[#091540]" style={{ height: "clamp(320px, 55vw, 600px)" }}>
          <img
            src={heroImage || defaultHeroImg}
            alt="Tubing Sungai Desa Getas"
            className="w-full h-full object-cover opacity-80"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#091540]/80 via-[#091540]/20 to-transparent" />

          {/* Big title like WANDER */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
            <p className="text-white/70 text-sm font-medium mb-2 tracking-widest uppercase" style={{ fontFamily: "Inter, sans-serif" }}>
              Kecamatan Singorojo · Kabupaten Kendal
            </p>
            <h1
              className="font-black text-white leading-none mb-4"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
                letterSpacing: "-0.02em",
                textShadow: "0 4px 40px rgba(0,0,0,0.4)",
              }}>
              {displayTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => scrollTo("#paket")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#091540] text-sm font-bold rounded-full hover:bg-[#e8edff] transition shadow-lg"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                <Waves size={16} className="text-[#182cc1]" />
                Jelajahi Wisata Tubing
              </button>
              <button onClick={() => scrollTo("#kontak")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold rounded-full hover:bg-white/25 transition"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                Layanan Online
              </button>
            </div>
          </div>

          {/* badge top-right */}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-[#8b5a2b]/90 text-white text-xs font-bold backdrop-blur-sm flex items-center gap-1.5">
              <TreePine size={12} /> Desa Wisata Alam
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7692ff] animate-pulse" /> Online
            </span>
          </div>
        </div>

        {/* ── Stats 6 kartu ── */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statItems.map(s => (
            <div key={s.label} className="bg-white border border-[#c5d0ff] rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-[#182cc1]/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#e8edff] flex items-center justify-center flex-shrink-0">
                <s.icon size={17} className="text-[#182cc1]" />
              </div>
              <div>
                <div className="font-bold text-[#091540] text-sm leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</div>
                <div className="text-[#3d518c] text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Dusun slider ── */}
        <DusunSlider onSelect={onSelectDusun} />
      </div>
    </section>
  );
}
