import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, MapPin, Navigation, X, CheckCircle2 } from "lucide-react";
import { getDusunDetail } from "../../services/dusun.service";
import { resolveImageUrl } from "../../utils/image";
import type { Dusun } from "../../types";

export default function DusunPage({ dusun, onClose }: { dusun: Dusun; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);
  const [detail, setDetail] = useState<Dusun>(dusun);

  useEffect(() => {
    if (!dusun.galleries || dusun.galleries.length === 0) {
      getDusunDetail(dusun.id)
        .then(res => setDetail(res.data))
        .catch(() => {});
    }
  }, [dusun.id, dusun.galleries]);

  const galleries = detail.galleries ?? [];
  const allImages = galleries.length > 0
    ? galleries.map(g => g.image_url)
    : [detail.hero_img || detail.thumbnail].filter(Boolean);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const keunggulanList = detail.keunggulan ? detail.keunggulan.map(k => k.keunggulan) : [];

  return (
    <div 
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-6xl h-full max-h-[100dvh] sm:max-h-[85vh] rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button Mobile/Desktop */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition-all lg:bg-[#e8edff] lg:hover:bg-[#c5d0ff] lg:text-[#091540]">
          <X size={20} />
        </button>

        {/* ── Left Side: Gallery (Compact) ── */}
        <div className="relative w-full lg:w-[45%] h-[40%] lg:h-full bg-[#091540] group flex-shrink-0">
          <img
            src={resolveImageUrl(allImages[activeImg] || detail.thumbnail)}
            alt={detail.nama}
            key={activeImg}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091540] via-transparent to-transparent opacity-80" />
          
          {/* Gallery Controls */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg(i => (i - 1 + allImages.length) % allImages.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setActiveImg(i => (i + 1) % allImages.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allImages.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`rounded-full transition-all ${activeImg === i ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
                ))}
              </div>
            </>
          )}

          {/* Title on Image */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5" style={{ fontFamily: "Inter, sans-serif" }}>
              <Navigation size={12} className="text-[#7692ff]" /> Dusun Getas
            </div>
            <h1 className="font-black text-white text-4xl lg:text-5xl leading-none drop-shadow-md" style={{ fontFamily: "Poppins, sans-serif" }}>
              {detail.nama}
            </h1>
          </div>
        </div>

        {/* ── Right Side: Content (Compact & Scrollable if needed) ── */}
        <div className="flex-1 bg-[#f8faff] p-6 lg:p-8 overflow-y-auto custom-scrollbar flex flex-col h-full">
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#091540] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Tentang Dusun
            </h2>
            <p className="text-[#3d518c] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              {detail.deskripsi || "Dusun yang asri dengan pemandangan alam indah dan keramahan warga desa yang berlandaskan kearifan lokal."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Info Box */}
            <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-[#e8edff] shadow-sm">
              <h3 className="text-xs font-bold text-[#182cc1] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <MapPin size={14} /> Demografi
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-[10px] text-[#3d518c]">Jumlah RT</div>
                  <div className="font-bold text-[#091540]">{detail.jumlah_rt} RT</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#3d518c]">Penduduk</div>
                  <div className="font-bold text-[#091540]">{(detail.jumlah_penduduk ? detail.jumlah_penduduk.toLocaleString("id-ID") : "400")}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#3d518c]">Wilayah RW</div>
                  <div className="font-bold text-[#091540]">{detail.rw}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#3d518c]">Luas</div>
                  <div className="font-bold text-[#091540]">{detail.luas_wilayah || "1,2 km²"}</div>
                </div>
              </div>
            </div>

            {/* Keunggulan */}
            <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-[#e8edff] shadow-sm">
              <h3 className="text-xs font-bold text-[#182cc1] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Star size={14} /> Daya Tarik
              </h3>
              <div className="space-y-2">
                {keunggulanList.slice(0,3).map((k, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-[#e8edff] flex items-center justify-center flex-shrink-0 text-[#182cc1]">
                      <CheckCircle2 size={10} />
                    </div>
                    <p className="text-[#091540] text-xs font-medium leading-tight">{k}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map (Compact) */}
          <div className="flex-1 bg-white rounded-2xl border border-[#e8edff] shadow-sm overflow-hidden min-h-[150px] relative">
            <h3 className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-[#182cc1] z-10 uppercase tracking-widest shadow-sm">
              Lokasi Peta
            </h3>
            <iframe
              title={`Peta Dusun ${detail.nama}`}
              src={`https://maps.google.com/maps?q=Dusun+${detail.nama},+Desa+Getas,+Singorojo,+Kendal&output=embed&z=14`}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen loading="lazy"
            />
          </div>

        </div>
      </div>
    </div>
  );
}