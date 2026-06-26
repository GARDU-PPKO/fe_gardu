import { Users, Briefcase, Mountain, Info, Waves, TreePine } from "lucide-react";
import DusunSlider from "./DusunSlider";
import { DUSUN } from "../../data/mockData";


const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};



export default function Hero({ onSelectDusun }: { onSelectDusun: (d: typeof DUSUN[0]) => void }) {
  return (
    <section id="hero" className="pt-20 pb-8 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* framed hero image — WANDER style */}
        <div className="relative rounded-3xl overflow-hidden bg-[#052e16]" style={{ height: "clamp(320px, 55vw, 600px)" }}>
          <img
            src="https://images.unsplash.com/photo-1719380959727-b240fc7c77de?w=1400&h=700&fit=crop&auto=format"
            alt="Sungai mengalir di tengah hutan hijau Desa Getas"
            className="w-full h-full object-cover opacity-80"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0f]/80 via-[#0a1f0f]/20 to-transparent" />

          {/* Big title like WANDER */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
            <p className="text-white/70 text-sm font-medium mb-2 tracking-widest uppercase" style={{ fontFamily: "Inter, sans-serif" }}>
              Kecamatan Singorojo · Kabupaten Kendal
            </p>
            <h1
              className="font-black text-white leading-none mb-4"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(4rem, 12vw, 10rem)",
                letterSpacing: "-0.02em",
                textShadow: "0 4px 40px rgba(0,0,0,0.4)",
              }}>
              GETAS
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => scrollTo("#wisata")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0a1f0f] text-sm font-bold rounded-xl hover:bg-[#dcfce7] transition shadow-lg"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                <Waves size={16} className="text-green-600" />
                Jelajahi Wisata Tubing
              </button>
              <button onClick={() => scrollTo("#layanan")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold rounded-xl hover:bg-white/25 transition"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                Layanan Online
              </button>
            </div>
          </div>

          {/* badge top-right */}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-green-500/90 text-white text-xs font-bold backdrop-blur-sm flex items-center gap-1.5">
              <TreePine size={12} /> Desa Wisata Alam
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
            </span>
          </div>
        </div>

        {/* ── Profil sekilas — merged into beranda ── */}
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Wisatawan / Tahun", value: "8.500+", icon: Mountain },
            { label: "UMKM Aktif",        value: "62 unit", icon: Briefcase },
            { label: "Total Penduduk",     value: "4.287",   icon: Users },
            { label: "Luas Wilayah",       value: "12,4 km²",icon: TreePine },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#bbf7d0] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#dcfce7] flex items-center justify-center flex-shrink-0">
                <s.icon size={17} className="text-[#16a34a]" />
              </div>
              <div>
                <div className="font-bold text-[#052e16] text-sm leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</div>
                <div className="text-[#4b7a55] text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Profil detail — sejarah + visi + lokasi ── */}
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
          {/* Sejarah singkat */}
          <div className="lg:col-span-2 bg-white border border-[#bbf7d0] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#dcfce7] flex items-center justify-center">
                <Info size={14} className="text-[#16a34a]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#16a34a]" style={{ fontFamily: "Inter, sans-serif" }}>Sekilas Desa Getas</span>
            </div>
            <p className="text-[#4b7a55] text-sm leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Desa Getas di Kecamatan Singorojo, Kabupaten Kendal — berdiri sejak ±1850, dikenal dengan keindahan Sungai Blukar, pertanian organik, dan wisata tubing yang meraih penghargaan Desa Wisata Terbaik 2025.
            </p>
            {/* visi tagline */}
            <div className="bg-[#f0fdf4] border-l-4 border-[#16a34a] rounded-r-xl px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#16a34a] mb-1">Visi Desa</div>
              <p className="text-[#052e16] text-xs font-semibold leading-relaxed" style={{ fontFamily: "Poppins, sans-serif" }}>
                "Desa Getas Maju, Mandiri, dan Sejahtera Berbasis Kearifan Lokal dan Teknologi Digital"
              </p>
            </div>
            {/* mini org */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { jabatan: "Kepala Desa",   nama: "Suyitno, S.Pd." },
                { jabatan: "Sekretaris",    nama: "Supartini" },
                { jabatan: "Kasi Layanan",  nama: "Dwi Lestari" },
              ].map(p => (
                <div key={p.jabatan} className="flex items-center gap-2 bg-[#f0fdf4] rounded-xl p-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#16a34a]/15 flex items-center justify-center flex-shrink-0">
                    <Users size={11} className="text-[#16a34a]" />
                  </div>
                  <div>
                    <div className="text-[#052e16] text-[10px] font-semibold leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>{p.jabatan}</div>
                    <div className="text-[#4b7a55] text-[9px]">{p.nama}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lokasi + stats */}
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-[#bbf7d0] rounded-2xl overflow-hidden shadow-sm flex-1 min-h-[140px]">
              <iframe
                title="Peta Desa Getas"
                src="https://maps.google.com/maps?q=Desa+Getas,+Kecamatan+Singorojo,+Kabupaten+Kendal,+Jawa+Tengah&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[140px]"
                allowFullScreen loading="lazy"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Kecamatan", value: "Singorojo" },
                { label: "Kabupaten", value: "Kendal" },
                { label: "5 Dusun",   value: "8 RW / 24 RT" },
                { label: "Kode Pos",  value: "51382" },
              ].map(i => (
                <div key={i.label} className="bg-white border border-[#bbf7d0] rounded-xl p-2.5 shadow-sm">
                  <div className="text-[#4b7a55] text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>{i.label}</div>
                  <div className="text-[#052e16] text-xs font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>{i.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Dusun slider ── */}
        <DusunSlider onSelect={onSelectDusun} />
      </div>
    </section>
  );
}