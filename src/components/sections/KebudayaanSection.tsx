import { useState, useEffect } from "react";
import { X, Clock, Loader2 } from "lucide-react";
import { getBudaya } from "../../services/budaya.service";
import { resolveImageUrl } from "../../utils/image";
import type { Budaya } from "../../types";

export default function KebudayaanSection() {
  const [items, setItems] = useState<Budaya[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [lb, setLb] = useState<Budaya | null>(null);

  useEffect(() => {
    let cancelled = false;
    getBudaya()
      .then(res => {
        if (cancelled) return;
        setItems(res?.data ?? []);
        setHasError(false);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const schedules = items.flatMap(i => i.schedules ?? []).slice(0, 3);

  return (
    <section id="budaya" className="py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#182cc1]" style={{ fontFamily: "Inter, sans-serif" }}>Seni & Budaya</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#091540] mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>Kebudayaan Desa Getas</h2>
          </div>
          <p className="text-[#3d518c] text-sm max-w-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Warisan seni, tradisi, dan kearifan lokal yang terus hidup di tengah masyarakat.
          </p>
        </div>

        {/* masonry grid - 2 col mobile, 3 col md+ */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#3d518c]" style={{ fontFamily: "Inter, sans-serif" }}>
            <Loader2 className="w-8 h-8 animate-spin text-[#182cc1]" />
            <span className="text-sm font-medium">Memuat kebudayaan...</span>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-[#3d518c] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Gagal memuat data kebudayaan.</p>
            <button onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#182cc1] hover:bg-[#1524a3] text-white text-sm font-bold rounded-full transition"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              Coba Lagi
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#3d518c] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Belum ada data kebudayaan.</p>
          </div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-2 sm:gap-3 h-[280px] sm:h-[380px] md:h-[460px]">
          {items.map((item, index) => (
            <div key={item.id} onClick={() => setLb(item)}
              className={`relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group bg-[#e8edff] ${index === 0 ? "col-span-2 md:col-span-2" : "col-span-1"}`}>
              <img src={resolveImageUrl(item.gambar)} alt={item.judul}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091540]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              
              {/* always-visible category pill */}
              <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
                <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#182cc1] text-[9px] sm:text-[10px] font-bold shadow">
                  {item.kategori}
                </span>
              </div>
              
              {/* hover reveal */}
              <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="font-bold text-white text-xs sm:text-sm leading-tight drop-shadow mb-0.5 sm:mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}>{item.judul}</div>
                <p className="text-white/80 text-[10px] sm:text-xs leading-relaxed line-clamp-2 hidden sm:block"
                  style={{ fontFamily: "Inter, sans-serif" }}>{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* cards below grid */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {schedules.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-4 bg-[#eef2ff] border border-[#c5d0ff] rounded-2xl p-4 hover:border-[#182cc1]/40 hover:shadow-md transition-all">
              <div className="text-3xl flex-shrink-0">{idx === 0 ? "🥁" : idx === 1 ? "🎨" : "🎭"}</div>
              <div>
                <div className="font-bold text-[#091540] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{s.nama_acara}</div>
                <div className="text-[#3d518c] text-xs mt-0.5 flex items-center gap-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  <Clock size={10} /> {s.hari}, {s.jam}
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
            <div className="relative h-64 bg-[#e8edff]">
              <img src={resolveImageUrl(lb.gambar)} alt={lb.judul} className="w-full h-full object-cover" />
              <button onClick={() => setLb(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#091540] hover:bg-white transition shadow">
                <X size={16} />
              </button>
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#182cc1] text-white text-xs font-bold">
                {lb.kategori}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#091540] text-lg mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>{lb.judul}</h3>
              <p className="text-[#3d518c] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{lb.deskripsi}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}