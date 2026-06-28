import { Users, Briefcase, Mountain, Waves, TreePine } from "lucide-react";

const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

export default function Hero() {
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0f]/95 via-[#0a1f0f]/40 to-[#0a1f0f]/10" />

          {/* Big title like WANDER */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 pb-14 sm:pb-16">
            <p className="text-white/80 text-xs sm:text-sm font-medium mb-2 tracking-widest uppercase" style={{ fontFamily: "Inter, sans-serif" }}>
              Kecamatan Singorojo · Kabupaten Kendal
            </p>
            <h1
              className="font-black text-white leading-none mb-5"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(4rem, 12vw, 10rem)",
                letterSpacing: "-0.02em",
                textShadow: "0 4px 40px rgba(0,0,0,0.4)",
              }}>
              GETAS
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => scrollTo("#paket")}
                className="flex items-center gap-2 px-6 py-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-bold rounded-full transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                <Waves size={16} className="text-white" />
                Jelajahi Wisata Tubing
                <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </button>
              <button onClick={() => scrollTo("#kontak")}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white text-sm font-semibold rounded-full hover:bg-white/20 hover:border-white/50 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                Layanan Online
              </button>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 opacity-60 animate-pulse">
            <div className="w-5 h-8 rounded-full border-2 border-white flex justify-center p-1">
              <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
            </div>
          </div>

          {/* badge top-right */}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-green-500/90 text-white text-xs font-bold backdrop-blur-sm flex items-center gap-1.5 shadow">
              <TreePine size={12} /> Desa Wisata Alam
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5 shadow">
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
            <div key={s.label} className="bg-white border border-[#bbf7d0] rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
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
      </div>
    </section>
  );
}