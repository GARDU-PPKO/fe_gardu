import { useState } from "react";
import { X, Clock } from "lucide-react";
import { BUDAYA_ITEMS } from "../../data/mockData";




export default function KebudayaanSection() {
  const [lb, setLb] = useState<{ img: string; judul: string; desc: string; cat: string } | null>(null);

  return (
    <section id="budaya" className="py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#16a34a]" style={{ fontFamily: "Inter, sans-serif" }}>Seni & Budaya</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1f0f] mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>Kebudayaan Desa Getas</h2>
          </div>
          <p className="text-[#4b7a55] text-sm max-w-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Warisan seni, tradisi, dan kearifan lokal yang terus hidup di tengah masyarakat.
          </p>
        </div>

        {/* masonry grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[360px] sm:h-[460px]">
          {BUDAYA_ITEMS.map((item, i) => (
            <div key={i} onClick={() => setLb(item)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group bg-[#dcfce7] ${item.span}`}>
              <img src={item.img} alt={item.judul}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              {/* always-visible category pill */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#16a34a] text-[10px] font-bold shadow">
                  {item.cat}
                </span>
              </div>
              {/* hover reveal */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="font-bold text-white text-sm leading-tight drop-shadow mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}>{item.judul}</div>
                {item.span && (
                  <p className="text-white/80 text-xs leading-relaxed line-clamp-2"
                    style={{ fontFamily: "Inter, sans-serif" }}>{item.desc}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* cards below grid */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: "🥁", title: "Kuda Lumping", jadwal: "Setiap bulan Suro & hari nasional" },
            { icon: "🎨", title: "Workshop Batik Tulis", jadwal: "Sabtu–Minggu, 08.00–12.00 WIB" },
            { icon: "🎭", title: "Pentas Seni Malam Jumat", jadwal: "Setiap Jumat malam di Dusun Sanggar" },
          ].map(c => (
            <div key={c.title} className="flex items-center gap-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 hover:border-[#16a34a]/40 hover:shadow-md transition-all">
              <div className="text-3xl flex-shrink-0">{c.icon}</div>
              <div>
                <div className="font-bold text-[#052e16] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{c.title}</div>
                <div className="text-[#4b7a55] text-xs mt-0.5 flex items-center gap-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  <Clock size={10} /> {c.jadwal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* lightbox */}
      {lb && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLb(null)}>
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="relative h-64 bg-[#dcfce7]">
              <img src={lb.img} alt={lb.judul} className="w-full h-full object-cover" />
              <button onClick={() => setLb(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#052e16] hover:bg-white transition shadow">
                <X size={16} />
              </button>
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#16a34a] text-white text-xs font-bold">
                {lb.cat}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#052e16] text-lg mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                {lb.judul}
              </h3>
              <p className="text-[#4b7a55] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                {lb.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}