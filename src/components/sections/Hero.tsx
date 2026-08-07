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
    <>
      <section id="hero" className="relative w-full h-[85vh] bg-[#091540]">
        <img
          src={heroImage || defaultHeroImg}
          alt="Tubing Sungai Desa Getas"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#091540] via-[#091540]/40 to-transparent" />

        {/* Big title like WANDER */}
        <div className="absolute inset-0 flex flex-col justify-end pb-16 sm:pb-24 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto w-full relative">
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

            {/* badge top-right */}
            <div className="absolute -top-32 right-0 hidden md:flex gap-2">
              <span className="px-3 py-1.5 rounded-full bg-[#8b5a2b]/90 text-white text-xs font-bold backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-lg">
                <TreePine size={12} /> Desa Wisata Alam
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7692ff] animate-pulse" /> Online
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content below hero */}
      <div className="bg-white px-4 sm:px-8 pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* ── Stats 6 kartu (overlapping slightly) ── */}
          <div className="-mt-12 relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {statItems.map(s => (
              <div key={s.label} className="bg-white/95 backdrop-blur-xl border border-[#c5d0ff] rounded-2xl p-4 flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-[#182cc1]/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e8edff] to-white border border-[#c5d0ff]/50 flex items-center justify-center flex-shrink-0">
                  <s.icon size={18} className="text-[#182cc1]" />
                </div>
                <div>
                  <div className="font-bold text-[#091540] text-sm leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</div>
                  <div className="text-[#3d518c] text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</div>
                </div>
              </div>
            ))}
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
