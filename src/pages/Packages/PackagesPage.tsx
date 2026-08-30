import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle2, Clock, Users, Leaf, Loader2, X, CheckCircle } from "lucide-react";
import { getTourPackages } from "../../services/tour-package.service";
import { useBooking } from "../../hooks/useBooking";
import { resolveImageUrl } from "../../utils/image";
import Footer from "../../components/layout/Footer";
import type { TourPackage } from "../../types";

export default function PackagesPage() {
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
    window.scrollTo(0, 0);
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
  });


  const handleSelectPackage = (p: TourPackage) => {
    updatePackage({
      id: String(p.id),
      name: p.nama,
      description: p.deskripsi,
      price: Number(p.harga),
      tipe_harga: p.tipe_harga,
      kapasitas_per_unit: p.kapasitas_per_unit,
      tiers: p.tiers,
      unit: p.satuan === 'orang' ? 'orang' : 'grup',
      tag: p.tag ?? undefined,
      minParticipants: p.min_participants ?? undefined,
      maxParticipants: p.max_participants ?? undefined,
      image: p.gambar,
      duration: p.durasi,
      includes: p.includes?.map(item => item.item) ?? [],
    });
    navigate('/booking/package');
  };

  return (
    <div className="min-h-screen w-full bg-[#f8faff] text-[#091540] font-sans flex flex-col relative">
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-[#182cc1]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[50%] bg-[#7692ff]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col z-10">
        {/* Sleek Top Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-10 py-6">
          <button onClick={() => navigate('/')} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#e8edff] shadow-md hover:shadow-lg border border-[#e8edff] transition-all text-sm font-semibold text-[#3d518c]">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col px-4 sm:px-6 lg:px-10 pb-20 pt-2">
          {/* Filter Pills — Symmetrical & Responsive */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border ${
                  filter === cat
                    ? "bg-[#182cc1] text-white border-[#182cc1] shadow-md shadow-[#182cc1]/20 scale-105"
                    : "bg-white text-[#3d518c] border-[#c5d0ff] hover:border-[#182cc1] hover:bg-[#e8edff]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mb-10 max-w-2xl">
            <span className="text-[#182cc1] text-sm font-bold tracking-widest uppercase mb-2 block flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#182cc1] rounded-full"></span>
              Pilihan Paket Wisata
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#091540] tracking-tight mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Jelajahi Pesona Alam Desa Getas
            </h1>
            <p className="text-[#3d518c] text-sm sm:text-base leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Pilih paket petualangan air, edukasi, atau liburan keluarga yang paling cocok untuk rombongan Anda.
            </p>
          </div>

          {/* Grid Layout - Flows naturally, handles unlimited data */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#3d518c]" style={{ fontFamily: "Inter, sans-serif" }}>
              <Loader2 className="w-8 h-8 animate-spin text-[#182cc1]" />
              <span className="text-sm font-medium">Memuat paket wisata...</span>
            </div>
          ) : hasError ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <p className="text-[#3d518c] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Gagal memuat paket wisata. Silakan periksa koneksi Anda.</p>
              <button onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#182cc1] hover:bg-[#1524a3] text-white text-sm font-bold rounded-full transition"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                Coba Lagi
              </button>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#3d518c] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Belum ada paket wisata tersedia.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredPackages.map(p => {
              const minTierPrice = p.tiers && p.tiers.length > 0
                ? Math.min(...p.tiers.map(t => Number(t.harga_per_orang)))
                : Number(p.harga);

              return (
              <div 
                key={p.id} 
                onClick={() => setSelectedPreview(p)}
                className="bg-white rounded-[2rem] overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(24,44,193,0.15)] shadow-md border border-[#e8edff] transition-all duration-300 cursor-pointer flex flex-col h-full relative"
              >
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0 p-2">
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative shadow-inner">
                    <img src={resolveImageUrl(p.gambar)} alt={p.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091540]/60 via-transparent to-transparent opacity-90" />
                    
                    {p.tag && (
                      <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg ${p.tag.toLowerCase() === 'education' ? 'bg-emerald-500/95' : p.tag.toLowerCase() === 'family' ? 'bg-amber-500/95' : 'bg-[#182cc1]/95'}`}>
                        {p.tag.toLowerCase() === 'education' ? <Leaf size={12} className="text-white" /> : p.tag.toLowerCase() === 'family' ? <Users size={12} className="text-white" /> : <CheckCircle2 size={12} className="text-white" />}
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{p.tag}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[#091540] font-black text-xl mb-2 leading-tight group-hover:text-[#182cc1] transition-colors" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {p.nama}
                  </h3>
                  <p className="text-[#3d518c] text-sm mb-6 line-clamp-2 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                    {p.deskripsi}
                  </p>
                  
                  <div className="flex gap-3 mb-auto">
                    <div className="flex items-center gap-2 bg-[#f8faff] rounded-xl px-3 py-2 border border-[#e8edff] shadow-sm">
                      <Clock size={14} className="text-[#182cc1]" />
                      <span className="text-xs font-bold text-[#3d518c]">{p.durasi}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#f8faff] rounded-xl px-3 py-2 border border-[#e8edff] shadow-sm">
                      <Users size={14} className="text-[#182cc1]" />
                      <span className="text-xs font-bold text-[#3d518c]">Min {p.min_participants}</span>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-end justify-between pt-5 mt-4 border-t border-dashed border-[#c5d0ff]">
                    <div>
                      <div className="text-[10px] text-[#3d518c] uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
                        {p.tiers && p.tiers.length > 0 ? "Tier Rombongan" : "Harga Tiket"}
                      </div>
                      <div className="text-[#091540] font-black text-2xl leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>
                        {p.tiers && p.tiers.length > 0 ? (
                          <>
                            <span className="text-xs font-normal text-[#3d518c] mr-1">Mulai</span>
                            Rp {minTierPrice.toLocaleString('id-ID')}
                          </>
                        ) : (
                          `Rp ${Number(p.harga).toLocaleString('id-ID')}`
                        )}
                        <span className="text-[11px] text-[#3d518c] font-semibold ml-1">/{p.satuan}</span>
                      </div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-[#182cc1] text-white flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(24,44,193,0.4)] transition-all shadow-md">
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
          )}
        </main>
      </div>
      
      {/* Footer */}
      <Footer />

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
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg ${
                  selectedPreview.tag.toLowerCase() === 'education' ? 'bg-emerald-500/95'
                  : selectedPreview.tag.toLowerCase() === 'family' ? 'bg-amber-500/95'
                  : 'bg-[#182cc1]/95'
                }`}>
                  {selectedPreview.tag.toLowerCase() === 'education'
                    ? <Leaf size={12} className="text-white" />
                    : selectedPreview.tag.toLowerCase() === 'family'
                      ? <Users size={12} className="text-white" />
                      : <CheckCircle2 size={12} className="text-white" />
                  }
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{selectedPreview.tag}</span>
                </div>
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
              {/* Info chips */}
              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-[#f8faff] rounded-xl px-3 py-2 border border-[#e8edff]">
                  <Clock size={14} className="text-[#182cc1]" />
                  <span className="text-xs font-bold text-[#3d518c]">{selectedPreview.durasi}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#f8faff] rounded-xl px-3 py-2 border border-[#e8edff]">
                  <Users size={14} className="text-[#182cc1]" />
                  <span className="text-xs font-bold text-[#3d518c]">Min {selectedPreview.min_participants} orang</span>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <p className="text-[#3d518c] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  {selectedPreview.deskripsi}
                </p>
              </div>

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
                  <span className="text-sm text-[#3d518c] font-semibold ml-1">/{selectedPreview.satuan}</span>
                </div>
              </div>
            </div>

            {/* Footer — tombol Pesan */}
            <div className="flex-shrink-0 p-4 border-t border-[#e8edff] bg-white flex justify-end">
              <button
                onClick={() => { setSelectedPreview(null); handleSelectPackage(selectedPreview); }}
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
    </div>
  );
}
