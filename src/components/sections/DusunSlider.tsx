import { useState, useRef, useEffect } from "react";
import { Users, Home, ChevronLeft, ChevronRight, Leaf, Eye, Loader2 } from "lucide-react";
import { getDusun } from "../../services/dusun.service";
import { resolveImageUrl } from "../../utils/image";
import type { Dusun } from "../../types";

const sortByRW = (list: Dusun[]) =>
  [...list].sort((a, b) => {
    const numA = parseInt((a.rw || '').replace(/\D/g, ''), 10) || 0;
    const numB = parseInt((b.rw || '').replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

export default function DusunSlider({ onSelect }: { onSelect: (d: Dusun) => void }) {
  const [dusunList, setDusunList] = useState<Dusun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getDusun()
      .then(res => {
        if (cancelled) return;
        setDusunList(sortByRW(res?.data ?? []));
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

  const CARD_W = 252;
  const GAP = 12;
  const STEP = (CARD_W + GAP) * 3;
  const TOTAL_SLIDES = 2;

  const updateState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    setActiveIdx(Math.min(Math.round(el.scrollLeft / STEP), TOTAL_SLIDES - 1));
  };

  const slide = (dir: "prev" | "next") => {
    trackRef.current?.scrollBy({ left: dir === "next" ? STEP : -STEP, behavior: "smooth" });
  };

  const goTo = (idx: number) => {
    trackRef.current?.scrollTo({ left: idx * STEP, behavior: "smooth" });
  };

  return (
    <div id="wisata" className="mt-7">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#182cc1]" style={{ fontFamily: "Inter, sans-serif" }}>Wilayah Desa</p>
          <h3 className="text-lg font-bold text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>Dusun di Desa Getas</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => slide("prev")} disabled={!canPrev}
            className="w-9 h-9 rounded-full border border-[#c5d0ff] bg-white flex items-center justify-center text-[#3d518c] hover:border-[#182cc1] hover:text-[#182cc1] disabled:opacity-30 transition shadow-sm">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => slide("next")} disabled={!canNext}
            className="w-9 h-9 rounded-full bg-[#182cc1] flex items-center justify-center text-white hover:bg-[#1524a3] disabled:opacity-30 transition shadow-sm">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* track */}
      <div ref={trackRef} onScroll={updateState}
        className="flex gap-3 overflow-x-auto pb-4"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-16 w-full text-[#3d518c]" style={{ fontFamily: "Inter, sans-serif" }}>
            <Loader2 className="w-8 h-8 animate-spin text-[#182cc1]" />
            <span className="text-sm font-medium">Memuat dusun...</span>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 w-full text-center">
            <p className="text-[#3d518c] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Gagal memuat data dusun.</p>
            <button onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#182cc1] hover:bg-[#1524a3] text-white text-sm font-bold rounded-full transition"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              Coba Lagi
            </button>
          </div>
        ) : dusunList.length === 0 ? (
          <div className="py-16 w-full text-center">
            <p className="text-[#3d518c] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Belum ada data dusun.</p>
          </div>
        ) : dusunList.map((d) => (
            <div key={d.id}
              className="flex-shrink-0 w-[220px] sm:w-[260px] h-[300px] sm:h-[340px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#091540] cursor-pointer relative group"
              style={{ scrollSnapAlign: "start" }}
              onClick={() => onSelect(d)}>

              <img src={resolveImageUrl(d.thumbnail)} alt={d.nama} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#091540] via-[#091540]/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

              {/* RW badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold border border-white/30">
                {d.rw}
              </div>

              {/* Content that slides up */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end transition-transform duration-500 ease-out translate-y-[84px] group-hover:translate-y-0">
                <span className="text-white font-black text-2xl leading-none drop-shadow-md mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {d.nama}
                </span>

                {/* stats */}
                <div className="flex items-center gap-3 mb-2 text-white/90">
                  <div className="flex items-center gap-1.5 text-[11px]" style={{ fontFamily: "Inter, sans-serif" }}>
                    <Users size={12} className="text-[#a5b4fc]" /> {d.jumlah_penduduk || "400"}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]" style={{ fontFamily: "Inter, sans-serif" }}>
                    <Home size={12} className="text-[#a5b4fc]" /> {d.jumlah_rt || "3"} RT
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] ml-auto">
                    <Leaf size={12} className="text-[#a5b4fc]" /> {d.luas_wilayah || "1,2 km²"}
                  </div>
                </div>

                {/* deskripsi (hidden until hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-[64px]">
                  <p className="text-white/80 text-xs leading-relaxed line-clamp-2 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                    {d.deskripsi}
                  </p>
                </div>

                <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  style={{ fontFamily: "Poppins, sans-serif" }}>
                  <Eye size={14} /> Lihat Detail Dusun
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* dots */}
      <div className="flex justify-center gap-1.5 mt-1">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${activeIdx === i ? "w-5 h-1.5 bg-[#182cc1]" : "w-1.5 h-1.5 bg-[#c5d0ff] hover:bg-[#abd2fa]"}`} />
        ))}
      </div>
    </div>
  );
}