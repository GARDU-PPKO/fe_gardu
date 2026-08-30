import { useState, useEffect } from "react";
import { Clock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getBudaya } from "../../services/budaya.service";
import { resolveImageUrl } from "../../utils/image";
import type { Budaya } from "../../types";

export default function KebudayaanSection() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Budaya[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
  // Tampilkan 6 item pertama yang simetris (2 baris × 3 kolom)
  const displayItems = items.slice(0, 6);

  return (
    <section id="budaya" className="py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#182cc1]" style={{ fontFamily: "Inter, sans-serif" }}>Seni &amp; Budaya</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#091540] mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>Kebudayaan Desa Getas</h2>
          </div>
          <p className="text-[#3d518c] text-sm max-w-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Warisan seni, tradisi, dan kearifan lokal yang terus hidup di tengah masyarakat.
          </p>
        </div>

        {/* Symmetrical Grid */}
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
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {displayItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/budaya/${item.id}`)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group bg-[#e8edff] shadow-sm hover:shadow-xl transition-all duration-300 h-48 sm:h-56 flex flex-col justify-end"
              >
                <img
                  src={resolveImageUrl(item.gambar)}
                  alt={item.judul}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091540]/90 via-[#091540]/30 to-transparent" />
                
                {/* Category Pill */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#182cc1] text-[10px] sm:text-xs font-bold shadow-sm">
                    {item.kategori}
                  </span>
                </div>
                
                {/* Title & Desc at bottom */}
                <div className="relative z-10 p-3 sm:p-4 text-white">
                  <div
                    className="font-bold text-white text-xs sm:text-base leading-tight drop-shadow mb-1 group-hover:text-[#a5f3fc] transition-colors"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {item.judul}
                  </div>
                  <p
                    className="text-white/80 text-[10px] sm:text-xs leading-relaxed line-clamp-2"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {item.deskripsi}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Button to full catalog (hidden temporarily) */}
          {/* <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate('/budaya')}
              className="flex items-center gap-2.5 px-8 py-3.5 bg-[#182cc1] hover:bg-[#1524a3] text-white font-bold rounded-full transition shadow-lg shadow-[#182cc1]/20 text-sm active:scale-95"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Lihat Semua Kebudayaan
              <ArrowRight size={16} />
            </button>
          </div> */}
        </>
        )}

        {/* cards below grid */}
        {schedules.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            {schedules.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-4 bg-[#f8faff] border border-[#c5d0ff] rounded-2xl p-4 hover:border-[#182cc1]/40 hover:shadow-md transition-all">
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
        )}
      </div>
    </section>
  );
}