import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Tag, Loader2, Sparkles, Clock, Calendar } from "lucide-react";
import { getBudaya } from "../../services/budaya.service";
import { resolveImageUrl } from "../../utils/image";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import type { Budaya } from "../../types";

export default function BudayaListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Budaya[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const categories = ["Semua", ...Array.from(new Set(items.map(i => i.kategori).filter(Boolean)))];

  const filteredItems = items.filter(item => {
    if (selectedCategory === "Semua") return true;
    return item.kategori === selectedCategory;
  });

  const allSchedules = items.flatMap(i => i.schedules ?? []).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#091540] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#e8edff] border border-[#c5d0ff] text-xs font-semibold text-[#182cc1] shadow-sm transition mb-3"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <ArrowLeft size={14} /> Beranda
            </button>
            <h1 className="text-2xl sm:text-4xl font-black text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>
              Seni &amp; Kebudayaan Desa Getas
            </h1>
            <p className="text-sm text-[#3d518c] mt-1.5 max-w-xl" style={{ fontFamily: "Inter, sans-serif" }}>
              Kumpulan warisan tradisi, kesenian lokal, upacara adat, dan kearifan masyarakat Desa Getas yang lestari.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
                  selectedCategory === cat
                    ? "bg-[#182cc1] text-white border-[#182cc1] shadow-md shadow-[#182cc1]/20 scale-105"
                    : "bg-white text-[#3d518c] border-[#c5d0ff] hover:border-[#182cc1] hover:bg-[#e8edff]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#182cc1]" />
            <span className="text-sm font-medium text-[#3d518c]">Memuat daftar budaya...</span>
          </div>
        ) : hasError ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#e8edff] p-8">
            <p className="text-sm text-[#3d518c]">Gagal memuat data kebudayaan.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2.5 bg-[#182cc1] text-white rounded-full text-sm font-bold hover:bg-[#1524a3] transition"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#e8edff] p-8">
            <Sparkles size={32} className="mx-auto text-amber-500 mb-2" />
            <p className="text-sm text-[#3d518c]">Belum ada kebudayaan pada kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => navigate(`/budaya/${item.id}`)}
                className="bg-white rounded-3xl overflow-hidden border border-[#c5d0ff] hover:border-[#182cc1] hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-52 bg-[#e8edff] overflow-hidden">
                  <img
                    src={resolveImageUrl(item.gambar)}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091540]/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#182cc1] text-[11px] font-bold shadow">
                      <Tag size={11} />
                      {item.kategori}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#091540] text-base group-hover:text-[#182cc1] transition-colors leading-snug" style={{ fontFamily: "Poppins, sans-serif" }}>
                      {item.judul}
                    </h3>
                    <p className="text-[#3d518c] text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3" style={{ fontFamily: "Inter, sans-serif" }}>
                      {item.deskripsi}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#e8edff] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#182cc1] group-hover:underline">
                      Lihat Detail &amp; Jadwal →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedules Section at bottom of listing */}
        {allSchedules.length > 0 && (
          <div className="mt-16 bg-white rounded-3xl border border-[#c5d0ff] p-6 sm:p-8">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#182cc1]">Agenda Seni &amp; Budaya</span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#091540] mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                Jadwal Rutin &amp; Pementasan
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allSchedules.map((s) => (
                <div key={s.id} className="bg-[#f8faff] border border-[#e8edff] rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-[#e8edff] text-[#182cc1] flex items-center justify-center mb-2">
                      <Calendar size={16} />
                    </div>
                    <h4 className="font-bold text-[#091540] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                      {s.nama_acara}
                    </h4>
                  </div>
                  <div className="text-xs text-[#182cc1] font-semibold mt-3 flex items-center gap-1.5">
                    <Clock size={12} /> {s.hari}, {s.jam}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
