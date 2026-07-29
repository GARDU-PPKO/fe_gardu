import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getDusunDetail } from "../../services/dusun.service";
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

  const keunggulanList = detail.keunggulan ? detail.keunggulan.map(k => k.keunggulan) : ["Suami tani organik dan asri", "Pemandangan alam pegunungan sejuk", "Komunitas warga yang ramah dan aktif"];

  return (
    <div className="fixed inset-0 z-[70] bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">

        {/* Back button */}
        <button onClick={onClose}
          className="flex items-center gap-2 text-[#3d518c] text-sm font-semibold hover:text-[#182cc1] transition mb-5">
          <ChevronLeft size={18} /> Kembali ke Beranda
        </button>

        {/* ── Big centered dusun name ── */}
        <h1
          className="font-black text-[#091540] text-center mb-6 leading-none"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(2.8rem, 8vw, 5.5rem)", letterSpacing: "-0.02em" }}>
          {detail.nama}
        </h1>

        {/* ── Main 2-column: large image LEFT + info RIGHT ── */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-5 mb-10">

          {/* Main image with swipe arrows */}
          <div className="relative rounded-3xl overflow-hidden bg-[#e8edff] group" style={{ minHeight: "360px" }}>
            <img
              src={allImages[activeImg] || detail.thumbnail}
              alt={detail.nama}
              key={activeImg}
              className="w-full h-full object-cover"
              style={{ minHeight: "360px" }}
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg(i => (i - 1 + allImages.length) % allImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-white">
                  <ChevronLeft size={18} className="text-[#091540]" />
                </button>
                <button
                  onClick={() => setActiveImg(i => (i + 1) % allImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-white">
                  <ChevronRight size={18} className="text-[#091540]" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`rounded-full transition-all ${activeImg === i ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: info sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-[#c5d0ff] p-5 shadow-sm flex-1">
              <div className="text-xs font-bold uppercase tracking-widest text-[#3d518c] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>Info Dusun</div>
              {[
                { label: "Nama Dusun",  val: detail.nama },
                { label: "Wilayah RW",  val: detail.rw },
                { label: "Jumlah RT",   val: detail.jumlah_rt + " RT" },
                { label: "Penduduk",    val: (detail.jumlah_penduduk ? detail.jumlah_penduduk.toLocaleString("id-ID") : "400") + " jiwa" },
                { label: "Luas",        val: detail.luas_wilayah || "1,2 km²" },
                { label: "Desa",        val: "Getas, Singorojo" },
                { label: "Kabupaten",   val: "Kendal, Jawa Tengah" },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2 border-b border-[#eef2ff] last:border-0 text-sm gap-3">
                  <span className="text-[#3d518c]" style={{ fontFamily: "Inter, sans-serif" }}>{r.label}</span>
                  <span className="text-[#091540] font-medium text-right" style={{ fontFamily: "Poppins, sans-serif" }}>{r.val}</span>
                </div>
              ))}
            </div>
            <button onClick={onClose}
              className="w-full py-3 bg-[#182cc1] hover:bg-[#1524a3] text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#c5d0ff]"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              <ChevronLeft size={16} /> Kembali
            </button>
          </div>
        </div>

        {/* ── Description + Keunggulan + Map ── */}
        <div className="grid lg:grid-cols-2 gap-10 pb-10 items-stretch">
          <div>
            <h2 className="text-xl font-bold text-[#091540] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
              Tentang Dusun {detail.nama}
            </h2>
            <p className="text-[#3d518c] leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              {detail.deskripsi || "Dusun yang asri dengan pemandangan alam indah dan keramahan warga desa yang berlandaskan kearifan lokal."}
            </p>

            <h3 className="text-base font-bold text-[#091540] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Keunggulan & Daya Tarik
            </h3>
            <div className="space-y-2">
              {keunggulanList.map((k, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#eef2ff] border border-[#c5d0ff] rounded-xl p-3">
                  <div className="w-7 h-7 rounded-lg bg-[#e8edff] flex items-center justify-center flex-shrink-0">
                    <Star size={13} className="text-[#182cc1]" />
                  </div>
                  <p className="text-[#091540] text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{k}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-base font-bold text-[#091540] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Lokasi</h3>
            <div className="flex-1 rounded-2xl overflow-hidden border border-[#c5d0ff] shadow-sm" style={{ minHeight: "200px" }}>
              <iframe
                title={`Peta Dusun ${detail.nama}`}
                src={`https://maps.google.com/maps?q=Dusun+${detail.nama},+Desa+Getas,+Singorojo,+Kendal&output=embed&z=14`}
                className="w-full h-full border-0"
                allowFullScreen loading="lazy"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}