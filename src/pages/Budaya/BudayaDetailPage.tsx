import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Tag, Loader2, Sparkles } from "lucide-react";
import { getBudayaDetail, getBudaya } from "../../services/budaya.service";
import { resolveImageUrl } from "../../utils/image";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import type { Budaya } from "../../types";

export default function BudayaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [budaya, setBudaya] = useState<Budaya | null>(null);
  const [otherBudaya, setOtherBudaya] = useState<Budaya[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    let isMounted = true;

    const fetchDetail = async () => {
      try {
        const [detailRes, listRes] = await Promise.all([
          getBudayaDetail(id),
          getBudaya().catch(() => ({ data: [] })),
        ]);
        if (isMounted) {
          setBudaya(detailRes.data);
          setOtherBudaya((listRes.data || []).filter(b => String(b.id) !== String(id)).slice(0, 3));
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#182cc1]" />
        <span className="text-sm font-medium text-[#3d518c]" style={{ fontFamily: "Inter, sans-serif" }}>
          Memuat informasi budaya...
        </span>
      </div>
    );
  }

  if (hasError || !budaya) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500">
          <Sparkles size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>
          Data Budaya Tidak Ditemukan
        </h2>
        <p className="text-sm text-[#3d518c] max-w-sm" style={{ fontFamily: "Inter, sans-serif" }}>
          Kebudayaan yang Anda cari mungkin telah dinonaktifkan atau tautan tidak valid.
        </p>
        <button
          onClick={() => navigate('/budaya')}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#182cc1] text-white rounded-full font-semibold text-sm hover:bg-[#1524a3] transition"
        >
          <ArrowLeft size={16} /> Kembali ke Daftar Budaya
        </button>
      </div>
    );
  }

  const schedules = budaya.schedules?.filter(s => s.is_active !== false) || [];

  return (
    <div className="min-h-screen bg-[#f8faff] text-[#091540] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#e8edff] border border-[#c5d0ff] text-sm font-semibold text-[#182cc1] shadow-sm transition"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <ArrowLeft size={16} /> Kembali
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#e8edff] mb-8">
          {/* Main Image Banner */}
          <div className="relative h-64 sm:h-96 w-full bg-[#091540]">
            <img
              src={resolveImageUrl(budaya.gambar)}
              alt={budaya.judul}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091540]/80 via-transparent to-transparent" />
            
            {/* Category Tag */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#182cc1] text-xs font-bold shadow-md">
                <Tag size={13} />
                {budaya.kategori}
              </span>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6">
              <span className="text-white/80 text-xs uppercase tracking-widest font-semibold block mb-1">
                Seni &amp; Tradisi Desa Getas
              </span>
              <h1
                className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-md"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {budaya.judul}
              </h1>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#182cc1] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                Tentang Tradisi Ini
              </h3>
              <p className="text-[#3d518c] text-base sm:text-lg leading-relaxed whitespace-pre-line" style={{ fontFamily: "Inter, sans-serif" }}>
                {budaya.deskripsi}
              </p>
            </div>

            {/* Agenda / Jadwal Acara */}
            {schedules.length > 0 && (
              <div className="border-t border-[#e8edff] pt-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#182cc1] mb-4 flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                  <Calendar size={16} /> Jadwal &amp; Waktu Pelaksanaan
                </h3>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {schedules.map((s) => (
                    <div
                      key={s.id}
                      className="bg-[#f8faff] border border-[#c5d0ff] rounded-2xl p-4 flex items-start gap-3 hover:border-[#182cc1] transition"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#e8edff] text-[#182cc1] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#091540] text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                          {s.nama_acara}
                        </h4>
                        <p className="text-xs text-[#182cc1] font-semibold mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
                          {s.hari}, {s.jam}
                        </p>
                        {s.deskripsi && (
                          <p className="text-xs text-[#3d518c] mt-1.5 leading-relaxed">
                            {s.deskripsi}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Other Recommendations */}
        {otherBudaya.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#182cc1]">Eksplorasi Lainnya</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#091540] mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Kebudayaan Getas Lainnya
                </h3>
              </div>
              <button
                onClick={() => navigate('/budaya')}
                className="text-xs sm:text-sm font-bold text-[#182cc1] hover:underline"
              >
                Lihat Semua →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherBudaya.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/budaya/${item.id}`)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#c5d0ff] hover:border-[#182cc1] hover:shadow-lg transition cursor-pointer group flex flex-col"
                >
                  <div className="relative h-40 bg-[#e8edff] overflow-hidden">
                    <img
                      src={resolveImageUrl(item.gambar)}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-[#182cc1] text-[10px] font-bold shadow">
                        {item.kategori}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="font-bold text-[#091540] text-sm line-clamp-1 group-hover:text-[#182cc1] transition-colors" style={{ fontFamily: "Poppins, sans-serif" }}>
                      {item.judul}
                    </h4>
                    <p className="text-xs text-[#3d518c] line-clamp-2 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                      {item.deskripsi}
                    </p>
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
