import { useState, useRef } from "react";
import { ArrowRight, Users, Home, ChevronLeft, ChevronRight, CheckCircle, Leaf, Eye } from "lucide-react";
import { DUSUN } from "../../data/mockData";

export default function DusunSlider({ onSelect }: { onSelect: (d: typeof DUSUN[0]) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const CARD_W = 252;
  const STEP = CARD_W * 3;
  const visibleCards = 5;
  const TOTAL_SLIDES = Math.max(
    1,
    Math.ceil((DUSUN.length - visibleCards) / 3) + 1
  );

  const updateState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    setActiveIdx(
      Math.min(
        Math.round(el.scrollLeft / STEP),
        TOTAL_SLIDES - 1
      )
    );
  };

  const slide = (dir: "prev" | "next") => {
    trackRef.current?.scrollBy({ left: dir === "next" ? STEP : -STEP, behavior: "smooth" });
  };

  const goTo = (idx: number) => {
    trackRef.current?.scrollTo({
      left: idx * STEP,
      behavior: "smooth"
    });
  };

  return (
    <div className="mt-7">
      <style>{`
        .dusun-track::-webkit-scrollbar { display: none; }
        .dusun-card { transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease, border-color 0.25s ease; }
        .dusun-card:hover { transform: translateY(-8px) scale(1.03); }
        .dusun-card .card-img { transition: height 0.35s cubic-bezier(.22,1,.36,1); }
        .dusun-card:hover .card-img { height: 11rem; }
        .dusun-card .reveal { max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(.22,1,.36,1), opacity 0.3s ease; opacity: 0; }
        .dusun-card:hover .reveal { max-height: 120px; opacity: 1; }
        .dusun-card .tag-row { transition: opacity 0.2s ease; opacity: 0; }
        .dusun-card:hover .tag-row { opacity: 1; }
      `}</style>

      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#16a34a]" style={{ fontFamily: "Inter, sans-serif" }}>Wilayah Desa</p>
          <h3 className="text-lg font-bold text-[#052e16]" style={{ fontFamily: "Poppins, sans-serif" }}>Dusun di Desa Getas</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => slide("prev")} disabled={!canPrev}
            className="w-9 h-9 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#4b7a55] hover:border-[#16a34a] hover:text-[#16a34a] disabled:opacity-30 transition shadow-sm">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => slide("next")} disabled={!canNext}
            className="w-9 h-9 rounded-full bg-[#16a34a] flex items-center justify-center text-white hover:bg-[#15803d] disabled:opacity-30 transition shadow-sm">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* track container with relative wrapper for gradient scroll cues */}
      <div className="relative">
        {/* Right scroll fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10 hidden sm:block" />
        {/* Left scroll fade gradient */}
        {canPrev && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10 hidden sm:block" />
        )}

        {/* track */}
        <div ref={trackRef} onScroll={updateState}
          className="dusun-track flex gap-4 overflow-x-auto py-4 items-start h-[450px]"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>

          {DUSUN.map((d) => (
            <div key={d.name}
              className="dusun-card flex-shrink-0 w-60 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_35px_rgb(22,163,74,0.15)] hover:border-green-200 cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
              onClick={() => onSelect(d)}>

              {/* image */}
              <div className="card-img relative h-36 overflow-hidden bg-[#dcfce7]">
                <img src={d.thumb} alt={d.name}
                  className="w-full h-full object-cover"
                />
                {/* darker overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/70 via-[#052e16]/10 to-transparent" />

                {/* RW badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white text-[#16a34a] text-[10px] font-black shadow-sm tracking-wide">
                  {d.rw}
                </div>

                {/* "Lihat Detail" pill — appears on hover */}
                <div className="tag-row absolute top-4 right-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold shadow-sm flex items-center gap-1">
                  <Eye size={10} /> Detail
                </div>

                {/* name */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                  <span className="text-white font-black text-lg leading-none drop-shadow" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {d.name}
                  </span>
                </div>
              </div>

              {/* body */}
              <div className="p-3.5">
                {/* always-visible stats row in a nice dashboard box */}
                <div className="flex items-center justify-between gap-1.5 mb-3 bg-green-50/40 border border-green-100/20 rounded-xl p-2">
                  {[
                    { icon: Users, val: d.penduduk, label: "jiwa" },
                    { icon: Home, val: d.rt, label: "RT" },
                    { icon: Leaf, val: d.luas, label: "" },
                  ].map((s, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
                      <div className="w-5 h-5 rounded-full bg-green-100/50 flex items-center justify-center mb-1 text-green-700">
                        <s.icon size={10} />
                      </div>
                      <span className="text-[10px] font-bold text-[#052e16] leading-none">{s.val}</span>
                      <span className="text-[8px] text-[#4b7a55] mt-0.5">{s.label}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[#4b7a55] text-xs leading-relaxed line-clamp-2 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>{d.desc}</p>

                {/* reveal section — slides in on hover */}
                <div className="reveal">
                  <div className="pt-2 space-y-1">
                    {d.keunggulan.slice(0, 2).map(k => (
                      <div key={k} className="flex items-center gap-1.5 text-[11px] text-[#166534]" style={{ fontFamily: "Inter, sans-serif" }}>
                        <CheckCircle size={10} className="text-[#16a34a] flex-shrink-0" /> {k}
                      </div>
                    ))}
                  </div>
                  <button className="mt-2.5 w-full py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-bold rounded-full transition flex items-center justify-center gap-1.5"
                    style={{ fontFamily: "Poppins, sans-serif" }}>
                    <ArrowRight size={11} /> Lihat Selengkapnya
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${activeIdx === i
              ? "w-8 h-1.5 bg-[#16a34a]"
              : "w-4 h-1.5 bg-green-200 hover:bg-green-300"
              }`}
          />
        ))}
      </div>
    </div>
  );
}