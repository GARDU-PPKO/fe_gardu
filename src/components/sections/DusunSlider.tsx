import { useState, useRef } from "react";
import { ArrowRight, Users, Home, ChevronLeft, ChevronRight, CheckCircle, Leaf, Eye } from "lucide-react";
import { DUSUN } from "../../data/mockData";

export default function DusunSlider({ onSelect }: { onSelect: (d: typeof DUSUN[0]) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const CARD_W = 252;

  const updateState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    setActiveIdx(Math.min(Math.round(el.scrollLeft / CARD_W), DUSUN.length - 1));
  };

  const slide = (dir: "prev" | "next") => {
    trackRef.current?.scrollBy({ left: dir === "next" ? CARD_W * 3 : -CARD_W * 3, behavior: "smooth" });
  };

  const goTo = (idx: number) => {
    trackRef.current?.scrollTo({ left: idx * CARD_W, behavior: "smooth" });
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

      {/* track */}
      <div ref={trackRef} onScroll={updateState}
        className="dusun-track flex gap-3 overflow-x-auto pb-4"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>

        {DUSUN.map((d) => (
          <div key={d.name}
            className="dusun-card flex-shrink-0 w-60 rounded-2xl overflow-hidden border border-[#bbf7d0] bg-white shadow-md hover:shadow-2xl hover:border-[#16a34a]/50 cursor-pointer"
            style={{ scrollSnapAlign: "start" }}
            onClick={() => onSelect(d)}>

            {/* image — grows on hover via CSS */}
            <div className="card-img relative h-32 overflow-hidden bg-[#dcfce7]">
              <img src={d.thumb} alt={d.name}
                className="w-full h-full object-cover"
                style={{ transition: "transform 0.5s ease" }}
              />
              {/* darker overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/70 via-[#052e16]/10 to-transparent" />

              {/* RW badge */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#16a34a] text-[10px] font-bold shadow">
                {d.rw}
              </div>

              {/* "Lihat Detail" pill — appears on hover */}
              <div className="tag-row absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#16a34a] text-white text-[10px] font-bold shadow flex items-center gap-1">
                <Eye size={9} /> Detail
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
              {/* always-visible stats row */}
              <div className="flex items-center gap-3 mb-2">
                {[
                  { icon: Users, val: d.penduduk + " jiwa" },
                  { icon: Home, val: d.rt + " RT" },
                ].map(s => (
                  <div key={s.val} className="flex items-center gap-1 text-[10px] text-[#4b7a55]" style={{ fontFamily: "Inter, sans-serif" }}>
                    <s.icon size={10} className="text-[#16a34a]" /> {s.val}
                  </div>
                ))}
                <div className="flex items-center gap-1 text-[10px] text-[#4b7a55] ml-auto">
                  <Leaf size={10} className="text-[#16a34a]" /> {d.luas}
                </div>
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
                <button className="mt-2.5 w-full py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  style={{ fontFamily: "Poppins, sans-serif" }}>
                  <ArrowRight size={11} /> Lihat Selengkapnya
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* dots */}
      <div className="flex justify-center gap-1.5 mt-1">
        {DUSUN.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${activeIdx === i ? "w-5 h-1.5 bg-[#16a34a]" : "w-1.5 h-1.5 bg-[#bbf7d0] hover:bg-green-300"}`} />
        ))}
      </div>
    </div>
  );
}