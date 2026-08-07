import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Footer from "../../components/layout/Footer";
import { getTourPackages } from "../../services/tour-package.service";
import { useBooking } from "../../hooks/useBooking";
import type { TourPackage } from "../../types";

const FALLBACK_PACKAGES: TourPackage[] = [
  {
    id: 1,
    nama: "Tubing Adventure",
    durasi: "±2 jam",
    harga: 75000,
    satuan: "orang",
    tag: "Terpopuler",
    min_participants: 1,
    max_participants: 10,
    gambar: "https://images.unsplash.com/photo-1546058914-5000137323f0?w=500&h=320&fit=crop&auto=format",
    deskripsi: "Menyusuri Sungai Blukar sepanjang 1,5 km dengan arus alami.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  },
  {
    id: 2,
    nama: "River Exploration",
    durasi: "±3 jam",
    harga: 95000,
    satuan: "orang",
    tag: null,
    min_participants: 1,
    max_participants: 8,
    gambar: "https://images.unsplash.com/photo-1561774711-b0fa364863b7?w=500&h=320&fit=crop&auto=format",
    deskripsi: "Eksplorasi sungai bersama guide berpengalaman dan safety equipment lengkap.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  },
  {
    id: 3,
    nama: "Family Package",
    durasi: "½ hari",
    harga: 250000,
    satuan: "grup",
    tag: "Promo",
    min_participants: 2,
    max_participants: 6,
    gambar: "https://images.unsplash.com/photo-1520329612326-d6038d1395a1?w=500&h=320&fit=crop&auto=format",
    deskripsi: "Paket keluarga lengkap — tubing, makan siang, foto dokumentasi.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  },
  {
    id: 4,
    nama: "Group Package",
    durasi: "½ hari",
    harga: 65000,
    satuan: "orang",
    tag: null,
    min_participants: 20,
    max_participants: 100,
    gambar: "https://images.unsplash.com/photo-1643215721864-cd4c354ac298?w=500&h=320&fit=crop&auto=format",
    deskripsi: "Paket rombongan minimal 20 orang dengan guide dan makan siang.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  }
];

export default function PackagesPage() {
  const navigate = useNavigate();
  const { updatePackage } = useBooking();
  const [packages, setPackages] = useState<TourPackage[]>(FALLBACK_PACKAGES);
  const [filter, setFilter] = useState("Semua");
  const categories = ["Semua", "Terpopuler", "Promo", "Grup"];

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    getTourPackages()
      .then(res => {
        if (res?.data && res.data.length > 0) {
          setPackages(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredPackages = packages.filter(p => {
    if (filter === "Semua") return true;
    if (filter === "Terpopuler") return p.tag?.toLowerCase() === "terpopuler";
    if (filter === "Promo") return p.tag?.toLowerCase() === "promo";
    if (filter === "Grup") return p.satuan === "grup" || (p.min_participants ?? 0) >= 10;
    return true;
  });

  const handleSelectPackage = (p: TourPackage) => {
    updatePackage({
      id: String(p.id),
      name: p.nama,
      description: p.deskripsi,
      price: Number(p.harga),
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
    <div className="min-h-screen bg-white text-[#091540] font-sans selection:bg-[#e8edff] selection:text-[#182cc1] flex flex-col">
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1546058914-5000137323f0?w=1200&h=600&fit=crop&auto=format" alt="Packages Header" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#091540]/60" />
        <button onClick={() => navigate('/')} className="absolute top-6 left-4 sm:left-8 flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-semibold shadow-sm" style={{ fontFamily: "Inter, sans-serif" }}>
          <ArrowLeft size={16} /> Kembali ke Beranda
        </button>
        <div className="relative z-10 text-center px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7692ff] mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>Daftar Paket</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md" style={{ fontFamily: "Poppins, sans-serif" }}>
            Eksplorasi Paket Wisata Kami
          </h1>
          <p className="text-white/80 text-sm max-w-xl mx-auto drop-shadow" style={{ fontFamily: "Inter, sans-serif" }}>
            Pilih paket yang paling cocok untuk petualangan Anda. Dari solo tubing hingga rombongan besar, kami punya semuanya.
          </p>
        </div>
      </div>

      <main className="flex-1 py-12 px-4 sm:px-8 bg-white -mt-6 rounded-t-[2.5rem] relative z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="max-w-6xl mx-auto">

          {/* Filters */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    filter === cat 
                      ? "bg-[#091540] text-white shadow-md" 
                      : "bg-[#e8edff] text-[#3d518c] hover:bg-[#c5d0ff] hover:text-[#1d2e80]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map(p => (
              <div 
                key={p.id} 
                onClick={() => handleSelectPackage(p)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#c5d0ff] group hover:shadow-xl hover:border-[#182cc1] transition-all cursor-pointer flex flex-col h-full relative transform hover:-translate-y-1"
              >
                <div className="relative h-48 bg-[#c5d0ff] overflow-hidden flex-shrink-0">
                  <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091540]/80 via-transparent to-transparent" />
                  
                  {p.tag && p.tag.toLowerCase() !== "promo" && (
                    <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#182cc1] text-white shadow">
                      {p.tag}
                    </span>
                  )}
                  {p.tag && p.tag.toLowerCase() === "promo" && (
                    <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white shadow">
                      {p.tag}
                    </span>
                  )}
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-black text-xl drop-shadow-md leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
                      {p.nama}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between bg-white relative overflow-hidden">
                  <div>
                    <p className="text-[#3d518c] text-sm mb-4 leading-relaxed line-clamp-3" style={{ fontFamily: "Inter, sans-serif" }}>{p.deskripsi}</p>
                  </div>
                  
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <div className="text-[#182cc1] font-black text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>
                        {`Rp ${Number(p.harga).toLocaleString('id-ID')}`}
                      </div>
                      <div className="text-[#3d518c] text-xs mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                        {p.satuan === 'orang' ? "/orang" : "/grup"} · {p.durasi}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#e8edff] flex items-center justify-center text-[#182cc1] group-hover:bg-[#182cc1] group-hover:text-white transition-colors shadow-sm">
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
