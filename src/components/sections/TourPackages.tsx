import { useEffect, useState } from "react";
import { CheckCircle, Loader2, X, Clock, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTourPackages } from "../../services/tour-package.service";
import { resolveImageUrl } from "../../utils/image";
import { useBooking } from "../../hooks/useBooking";
import type { TourPackage } from "../../types";

export default function TourPackages() {
  const navigate = useNavigate();
  const { updatePackage } = useBooking();
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState("Semua");
  const [selectedPreview, setSelectedPreview] = useState<TourPackage | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedPreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPreview]);

  useEffect(() => {
    let cancelled = false;
    getTourPackages()
      .then(res => {
        if (cancelled) return;
        setPackages(res?.data ?? []);
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


  const categories = ["Semua", ...Array.from(new Set(packages.map(p => p.tag).filter(Boolean))) as string[]];

  const filteredPackages = packages.filter(p => {
    if (filter === "Semua") return true;
    return p.tag?.toLowerCase() === filter.toLowerCase();
  }).slice(0, 4);



  return (
    <>
      <section id="paket" className="py-10 sm:py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-14 items-start">
          {/* Left text — sticky only on desktop */}
          <div className="lg:sticky lg:top-24">
            <span className="text-xs font-bold uppercase tracking-widest text-[#182cc1]" style={{ fontFamily: "Inter, sans-serif" }}>Paket Wisata</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#091540] mt-2 mb-3 leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
              Paket Tubing Seru<br />untuk Semua
            </h2>
            <p className="text-[#3d518c] text-sm leading-relaxed mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
              Pilih paket yang sesuai — dari petualangan solo hingga liburan keluarga besar. Semua dilengkapi peralatan keselamatan standar dan panduan profesional.
            </p>
            <div className="space-y-2.5 mb-6">
              {["Helm & pelampung keselamatan tersedia", "Pemandu berlisensi nasional", "Dokumentasi foto & video", "Area parkir luas & toilet bersih"].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-[#091540]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <CheckCircle size={14} className="text-[#182cc1] flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/packages')}
              className="flex items-center gap-2.5 px-6 py-3 bg-[#182cc1] hover:bg-[#1524a3] text-white font-semibold rounded-full transition shadow-md shadow-[#c5d0ff] w-fit text-sm sm:text-base"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              Lihat Paket Lainnya <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>

          {/* Right cards with filter */}
          <div className="flex flex-col gap-5">
            {/* Filter Pills — Symmetrical & Responsive */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border ${
                    filter === cat 
                      ? "bg-[#182cc1] text-white border-[#182cc1] shadow-md shadow-[#182cc1]/20" 
                      : "bg-white text-[#3d518c] border-[#c5d0ff] hover:border-[#182cc1] hover:bg-[#e8edff]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 2x2 grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#3d518c]" style={{ fontFamily: "Inter, sans-serif" }}>
                <Loader2 className="w-8 h-8 animate-spin text-[#182cc1]" />
                <span className="text-sm font-medium">Memuat paket wisata...</span>
              </div>
            ) : hasError ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <p className="text-[#3d518c] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Gagal memuat paket wisata.</p>
                <button onClick={() => window.location.reload()}
                  className="px-5 py-2.5 bg-[#182cc1] hover:bg-[#1524a3] text-white text-sm font-bold rounded-full transition"
                  style={{ fontFamily: "Poppins, sans-serif" }}>
                  Coba Lagi
                </button>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#3d518c] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Belum ada paket wisata tersedia.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
              {filteredPackages.map(p => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#c5d0ff] group hover:shadow-lg hover:border-[#182cc1] transition-all cursor-pointer flex flex-col h-full relative"
                  onClick={() => setSelectedPreview(p)}>

                  <div className="relative h-40 bg-[#c5d0ff] overflow-hidden flex-shrink-0">
                    <img src={resolveImageUrl(p.gambar)} alt={p.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    {p.tag && p.tag.toLowerCase() !== "promo" && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#182cc1] text-white shadow">
                        {p.tag}
                      </span>
                    )}
                    {p.tag && p.tag.toLowerCase() === "promo" && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow">
                        {p.tag}
                      </span>
                    )}
                    <div className="absolute bottom-2 left-3">
                      <span className="text-white font-bold text-sm drop-shadow" style={{ fontFamily: "Poppins, sans-serif" }}>{p.nama}</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-[#3d518c] text-xs mb-3 leading-relaxed line-clamp-2" style={{ fontFamily: "Inter, sans-serif" }}>{p.deskripsi}</p>
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <div className="text-[#182cc1] font-bold text-sm">
                          {p.tiers && p.tiers.length > 0 ? (
                            <>
                              <span className="text-[11px] font-normal text-[#3d518c] mr-1">Mulai</span>
                              Rp {Math.min(...p.tiers.map(t => Number(t.harga_per_orang))).toLocaleString('id-ID')}
                            </>
                          ) : (
                            `Rp ${Number(p.harga).toLocaleString('id-ID')}`
                          )}
                        </div>
                        <div className="text-[#3d518c] text-[10px] mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                          {p.satuan === 'orang' ? "/orang" : "/grup"} · {p.durasi}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#e8edff] flex items-center justify-center text-[#182cc1] group-hover:bg-[#182cc1] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    {/* Package Detail Preview Modal */}
    {selectedPreview && (
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setSelectedPreview(null)}
      >
        <div
          className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Hero Image */}
          <div className="relative h-52 flex-shrink-0">
            <img
              src={resolveImageUrl(selectedPreview.gambar)}
              alt={selectedPreview.nama}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091540]/70 via-transparent to-transparent" />
            {selectedPreview.tag && (
              <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                selectedPreview.tag.toLowerCase() === 'promo' ? 'bg-amber-500' : 'bg-[#182cc1]'
              } text-white shadow`}>
                {selectedPreview.tag}
              </span>
            )}
            <div className="absolute bottom-3 left-4">
              <h2 className="text-white font-black text-xl drop-shadow" style={{ fontFamily: "Poppins, sans-serif" }}>
                {selectedPreview.nama}
              </h2>
            </div>
            <button
              onClick={() => setSelectedPreview(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#091540] hover:bg-white transition shadow"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Info chips & Rating */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex gap-2.5 flex-wrap">
                <div className="flex items-center gap-2 bg-[#f8faff] rounded-xl px-3 py-2 border border-[#e8edff]">
                  <Clock size={14} className="text-[#182cc1]" />
                  <span className="text-xs font-bold text-[#3d518c]">{selectedPreview.durasi}</span>
                </div>
                {selectedPreview.min_participants && (
                  <div className="flex items-center gap-2 bg-[#f8faff] rounded-xl px-3 py-2 border border-[#e8edff]">
                    <Users size={14} className="text-[#182cc1]" />
                    <span className="text-xs font-bold text-[#3d518c]">Min {selectedPreview.min_participants} orang</span>
                  </div>
                )}
              </div>

              {/* Rating badge - top right */}
              {selectedPreview.rating_avg ? (
                <div className="flex items-center gap-1.5 bg-amber-50 rounded-xl px-3 py-2 border border-amber-200 shadow-xs">
                  <span className="text-amber-500 text-sm leading-none font-black">★</span>
                  <span className="text-xs font-black text-amber-900">{selectedPreview.rating_avg.toFixed(1)}</span>
                  <span className="text-[11px] font-semibold text-amber-700/80">({selectedPreview.reviews_count ?? selectedPreview.reviews?.length ?? 0})</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-[#f8faff] rounded-xl px-3 py-2 border border-[#e8edff]">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="text-xs font-semibold text-[#3d518c]">Belum ada ulasan</span>
                </div>
              )}
            </div>

            {/* Deskripsi */}
            <p className="text-[#3d518c] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              {selectedPreview.deskripsi}
            </p>

            {/* Fasilitas */}
            {selectedPreview.includes && selectedPreview.includes.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#182cc1] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  Fasilitas
                </div>
                <div className="space-y-1.5">
                  {selectedPreview.includes.map(inc => (
                    <div key={inc.id} className="flex items-center gap-2 text-sm text-[#091540]" style={{ fontFamily: "Inter, sans-serif" }}>
                      <CheckCircle size={14} className="text-[#182cc1] flex-shrink-0" />
                      {inc.item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Harga */}
            <div className="pt-1">
              <div className="text-[10px] text-[#3d518c] uppercase tracking-widest font-bold mb-1">
                {selectedPreview.tiers && selectedPreview.tiers.length > 0 ? "Tier Rombongan" : "Harga Tiket"}
              </div>
              <div className="text-[#091540] font-black text-2xl" style={{ fontFamily: "Poppins, sans-serif" }}>
                {selectedPreview.tiers && selectedPreview.tiers.length > 0 ? (
                  <>
                    <span className="text-sm font-normal text-[#3d518c] mr-1">Mulai</span>
                    Rp {Math.min(...selectedPreview.tiers.map(t => Number(t.harga_per_orang))).toLocaleString('id-ID')}
                  </>
                ) : (
                  `Rp ${Number(selectedPreview.harga).toLocaleString('id-ID')}`
                )}
                <span className="text-sm text-[#3d518c] font-semibold ml-1">/{selectedPreview.satuan === 'orang' ? 'orang' : 'grup'}</span>
              </div>
            </div>

            {/* Ulasan Pengunjung */}
            <div className="pt-3 border-t border-[#e8edff] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#182cc1]" style={{ fontFamily: "Inter, sans-serif" }}>
                    Ulasan Pengunjung
                  </div>
                  <p className="text-[11px] text-[#3d518c] mt-0.5">
                    Pengalaman nyata dari wisatawan yang telah berkunjung
                  </p>
                </div>
                {selectedPreview.rating_avg && (
                  <div className="flex items-center gap-1 bg-[#f0f4ff] px-2.5 py-1 rounded-lg border border-[#c5d0ff]">
                    <span className="text-amber-500 text-xs">★</span>
                    <span className="text-xs font-bold text-[#091540]">{selectedPreview.rating_avg.toFixed(1)}</span>
                    <span className="text-[10px] text-[#3d518c]">/ 5.0</span>
                  </div>
                )}
              </div>

              {/* Daftar Ulasan */}
              {selectedPreview.reviews && selectedPreview.reviews.length > 0 ? (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {selectedPreview.reviews.map(rev => (
                    <div key={rev.id} className="bg-[#f8faff] rounded-2xl p-3.5 border border-[#e8edff] space-y-1.5 hover:border-[#c5d0ff] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#182cc1] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                            {rev.nama_pengulas.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#091540] flex items-center gap-1">
                              {rev.nama_pengulas}
                              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">✓ Terverifikasi</span>
                            </div>
                            <div className="text-[10px] text-[#3d518c]">{rev.tanggal_formatted ?? 'Baru saja'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={star <= rev.rating ? "text-amber-400" : "text-gray-300"}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#3d518c] leading-relaxed italic" style={{ fontFamily: "Inter, sans-serif" }}>
                        "{rev.komentar}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#f8faff] rounded-2xl p-4 border border-dashed border-[#c5d0ff] text-center space-y-1">
                  <div className="text-lg">💬</div>
                  <p className="text-xs font-semibold text-[#091540]">Belum ada ulasan untuk paket ini</p>
                  <p className="text-[11px] text-[#3d518c]">Jadilah pengunjung pertama yang memesan dan membagikan pengalaman serumu!</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer — tombol Pesan */}
          <div className="flex-shrink-0 p-4 border-t border-[#e8edff] bg-white flex justify-end">
            <button
              onClick={() => {
                setSelectedPreview(null);
                updatePackage({
                  id: String(selectedPreview.id),
                  name: selectedPreview.nama,
                  description: selectedPreview.deskripsi,
                  price: Number(selectedPreview.harga),
                  tipe_harga: selectedPreview.tipe_harga,
                  kapasitas_per_unit: selectedPreview.kapasitas_per_unit,
                  tiers: selectedPreview.tiers,
                  unit: selectedPreview.satuan === 'orang' ? 'orang' : 'grup',
                  tag: selectedPreview.tag ?? undefined,
                  minParticipants: selectedPreview.min_participants ?? undefined,
                  maxParticipants: selectedPreview.max_participants ?? undefined,
                  image: selectedPreview.gambar,
                  duration: selectedPreview.durasi,
                  includes: selectedPreview.includes?.map(i => i.item) ?? [],
                });
                navigate('/booking/package');
              }}
              className="flex items-center gap-2.5 px-7 py-3 bg-[#182cc1] hover:bg-[#1524a3] text-white font-bold rounded-2xl transition shadow-lg shadow-[#182cc1]/20 text-sm"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Pesan Sekarang
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    )}
  </>);
}
