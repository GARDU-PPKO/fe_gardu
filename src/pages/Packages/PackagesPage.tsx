import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle2, Clock, Users, Leaf } from "lucide-react";
import { getTourPackages } from "../../services/tour-package.service";
import { useBooking } from "../../hooks/useBooking";
import Footer from "../../components/layout/Footer";
import type { TourPackage } from "../../types";

const FALLBACK_PACKAGES: TourPackage[] = [
  {
    id: 1,
    nama: "Tubing Adventure",
    durasi: "±2 jam",
    harga: 75000,
    satuan: "orang",
    tag: "Adventure",
    min_participants: 1,
    max_participants: 10,
    gambar: "https://images.unsplash.com/photo-1546058914-5000137323f0?w=500&h=300&fit=crop&auto=format",
    deskripsi: "Menyusuri Sungai Blukar sepanjang 1,5 km dengan arus alami.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  },
  {
    id: 2,
    nama: "Agro Education",
    durasi: "±3 jam",
    harga: 95000,
    satuan: "orang",
    tag: "Education",
    min_participants: 1,
    max_participants: 8,
    gambar: "https://images.unsplash.com/photo-1561774711-b0fa364863b7?w=500&h=300&fit=crop&auto=format",
    deskripsi: "Edukasi pertanian organik dan pengenalan flora lokal bersama guide.",
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
    tag: "Family",
    min_participants: 2,
    max_participants: 6,
    gambar: "https://images.unsplash.com/photo-1520329612326-d6038d1395a1?w=500&h=300&fit=crop&auto=format",
    deskripsi: "Paket keluarga lengkap — tubing, makan siang, foto dokumentasi.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  },
  {
    id: 4,
    nama: "Group Adventure",
    durasi: "½ hari",
    harga: 65000,
    satuan: "orang",
    tag: "Adventure",
    min_participants: 20,
    max_participants: 100,
    gambar: "https://images.unsplash.com/photo-1643215721864-cd4c354ac298?w=500&h=300&fit=crop&auto=format",
    deskripsi: "Paket rombongan (min 20) dengan guide dan makan siang.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  },
  {
    id: 5,
    nama: "Paket Camping (Sewa Tenda)",
    durasi: "1 hari 1 malam",
    harga: 50000,
    satuan: "tenda",
    tag: "Camping",
    min_participants: 1,
    max_participants: 4,
    gambar: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&h=300&fit=crop&auto=format",
    deskripsi: "Sewa tenda muat 4 orang. Termasuk area camping. Checkout 11:00, Checkin 13:00.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  },
];

export default function PackagesPage() {
  const navigate = useNavigate();
  const { updatePackage } = useBooking();
  const [packages, setPackages] = useState<TourPackage[]>(FALLBACK_PACKAGES);
  const [filter, setFilter] = useState("Semua");
  const categories = ["Semua", "Adventure", "Education", "Family", "Camping"];

  useEffect(() => {
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
    if (p.tag) {
       return p.tag.toLowerCase() === filter.toLowerCase();
    }
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
    <div className="min-h-screen w-full bg-[#f8faff] text-[#091540] font-sans flex flex-col relative">
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-[#182cc1]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[50%] bg-[#7692ff]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col z-10">
        {/* Sleek Top Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 sm:px-10 py-6">
          <button onClick={() => navigate('/')} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#e8edff] shadow-md hover:shadow-lg border border-[#e8edff] transition-all text-sm font-semibold text-[#3d518c]">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </button>
          <div className="hidden sm:flex bg-white shadow-md border border-[#e8edff] rounded-full p-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                  filter === cat 
                    ? "bg-[#182cc1] text-white shadow-md transform scale-105" 
                    : "text-[#3d518c] hover:text-[#091540] hover:bg-[#f8faff]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Mobile Filters */}
        <div className="sm:hidden px-6 overflow-x-auto pb-2 flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                filter === cat 
                  ? "bg-[#182cc1] text-white" 
                  : "bg-white text-[#3d518c] border border-[#e8edff]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col px-6 sm:px-10 pb-20 pt-4">
          <div className="mb-10 max-w-2xl">
            <span className="text-[#182cc1] text-sm font-bold tracking-widest uppercase mb-2 block flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#182cc1] rounded-full"></span>
              Daftar Paket Getas
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#091540] leading-tight drop-shadow-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
              Eksplorasi Petualangan
            </h1>
            <p className="text-[#3d518c] mt-4 text-sm sm:text-base leading-relaxed max-w-xl">
              Temukan paket wisata alam eksklusif, edukasi, hingga rekreasi keluarga yang telah kami susun khusus untuk pengalaman tak terlupakan di Desa Getas.
            </p>
          </div>

          {/* Grid Layout - Flows naturally, handles unlimited data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredPackages.map(p => (
              <div 
                key={p.id} 
                onClick={() => handleSelectPackage(p)}
                className="bg-white rounded-[2rem] overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(24,44,193,0.15)] shadow-md border border-[#e8edff] transition-all duration-300 cursor-pointer flex flex-col h-full relative"
              >
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0 p-2">
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative shadow-inner">
                    <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
                        Harga Tiket
                      </div>
                      <div className="text-[#091540] font-black text-2xl leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Rp {Number(p.harga).toLocaleString('id-ID')}
                        <span className="text-[11px] text-[#3d518c] font-semibold ml-1">/{p.satuan}</span>
                      </div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-[#182cc1] text-white flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(24,44,193,0.4)] transition-all shadow-md">
                      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
