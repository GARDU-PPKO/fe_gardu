import { useState, useEffect } from "react";
import { Users, Home, Star, ChevronLeft, Leaf, TreePine } from "lucide-react";
import type { DusunData } from "../../data/mockData";

export default function DusunPage({ dusun, onClose }: { dusun: DusunData; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col">

      {/* Hero image */}
      <div className="relative h-64 sm:h-80 flex-shrink-0 bg-[#dcfce7] overflow-hidden">
        <img src={dusun.galeri[activeImg]} alt={dusun.name}
          className="w-full h-full object-cover transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/80 via-[#052e16]/20 to-transparent" />

        {/* back button */}
        <button onClick={onClose}
          className="absolute top-4 left-4 flex items-center gap-2 px-3.5 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-[#052e16] text-sm font-semibold hover:bg-white transition shadow-lg">
          <ChevronLeft size={16} /> Kembali
        </button>

        {/* gallery dots */}
        <div className="absolute top-4 right-4 flex gap-1.5">
          {dusun.galeri.map((_, i) => (
            <button key={i} onClick={() => setActiveImg(i)}
              className={`rounded-full transition-all ${activeImg === i ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`} />
          ))}
        </div>

        {/* title block */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10 bg-gradient-to-t from-[#052e16]/90 to-transparent">
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#16a34a]/80 backdrop-blur-sm">
                <TreePine size={12} className="text-white" />
                <span className="text-white text-xs font-bold uppercase tracking-wide">Desa Getas · {dusun.rw}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>
                {dusun.name}
              </h1>
            </div>
            {/* quick stats */}
            <div className="hidden sm:flex gap-4 pb-1">
              {[
                { icon: Users, label: "Penduduk", val: dusun.penduduk.toLocaleString("id-ID") },
                { icon: Home,  label: "RT",        val: String(dusun.rt) },
                { icon: Leaf,  label: "Luas",      val: dusun.luas },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-white font-black text-lg leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>{s.val}</div>
                  <div className="text-white/60 text-[10px] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex-shrink-0 flex gap-2 px-6 py-3 bg-[#f0fdf4] border-b border-[#bbf7d0] overflow-x-auto">
        {dusun.galeri.map((src, i) => (
          <button key={i} onClick={() => setActiveImg(i)}
            className={`flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? "border-[#16a34a] shadow-md" : "border-transparent opacity-60 hover:opacity-90"}`}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_280px] gap-8">

          {/* Left */}
          <div>
            {/* mobile stats */}
            <div className="sm:hidden grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Users, label: "Penduduk", val: dusun.penduduk.toLocaleString("id-ID") + " jiwa" },
                { icon: Home,  label: "RT",       val: dusun.rt + " RT · " + dusun.rw },
                { icon: Leaf,  label: "Luas",     val: dusun.luas },
              ].map(s => (
                <div key={s.label} className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-3 text-center">
                  <s.icon size={16} className="text-[#16a34a] mx-auto mb-1" />
                  <div className="font-bold text-[#052e16] text-xs leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>{s.val}</div>
                  <div className="text-[#4b7a55] text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#052e16] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                Tentang Dusun {dusun.name}
              </h2>
              <p className="text-[#4b7a55] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                {dusun.detail}
              </p>
            </div>

            {/* Keunggulan */}
            <div className="mb-6">
              <h3 className="text-base font-bold text-[#052e16] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                Keunggulan & Daya Tarik
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {dusun.keunggulan.map((k) => (
                  <div key={k} className="bg-white border border-[#bbf7d0] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-green-300 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-[#dcfce7] flex items-center justify-center mb-3">
                      <Star size={14} className="text-[#16a34a]" />
                    </div>
                    <p className="text-[#052e16] text-sm font-medium leading-snug" style={{ fontFamily: "Inter, sans-serif" }}>{k}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-base font-bold text-[#052e16] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Lokasi</h3>
              <div className="rounded-2xl overflow-hidden border border-[#bbf7d0] h-48 shadow-sm">
                <iframe
                  title={`Peta Dusun ${dusun.name}`}
                  src={`https://maps.google.com/maps?q=Dusun+${dusun.name},+Desa+Getas,+Singorojo,+Kendal&output=embed&z=14`}
                  className="w-full h-full border-0"
                  allowFullScreen loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4 lg:sticky lg:top-4 self-start">
            {/* info card */}
            <div className="bg-white rounded-2xl border border-[#bbf7d0] p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-widest text-[#4b7a55] mb-4">Info Dusun</div>
              {[
                { label: "Nama Dusun",   val: dusun.name },
                { label: "Wilayah RW",  val: dusun.rw },
                { label: "Jumlah RT",   val: dusun.rt + " RT" },
                { label: "Penduduk",    val: dusun.penduduk.toLocaleString("id-ID") + " jiwa" },
                { label: "Luas",        val: dusun.luas },
                { label: "Desa",        val: "Getas, Singorojo" },
                { label: "Kabupaten",   val: "Kendal, Jawa Tengah" },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2 border-b border-[#f0fdf4] last:border-0 text-sm gap-3">
                  <span className="text-[#4b7a55]" style={{ fontFamily: "Inter, sans-serif" }}>{r.label}</span>
                  <span className="text-[#052e16] font-medium text-right" style={{ fontFamily: "Poppins, sans-serif" }}>{r.val}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button onClick={onClose}
              className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-200"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              <ChevronLeft size={16} /> Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}