import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTourPackages } from "../../services/tour-package.service";
import type { TourPackage } from "../../types";

const FALLBACK_PACKAGES: TourPackage[] = [
  {
    id: 1,
    nama: "GENTA Explorer",
    durasi: "±2 jam",
    harga: 125000,
    satuan: "orang",
    tag: "Terpopuler",
    min_participants: 5,
    max_participants: 10,
    gambar: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&h=320&fit=crop&auto=format",
    deskripsi: "Menyusuri Sungai Blukar dengan arus alami.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  },
  {
    id: 2,
    nama: "GEMPI Adventure",
    durasi: "±3 jam",
    harga: 110000,
    satuan: "orang",
    tag: null,
    min_participants: 5,
    max_participants: 10,
    gambar: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=500&h=320&fit=crop&auto=format",
    deskripsi: "Adventure tubing dengan rute lebih panjang dan safety gear lengkap.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  },
  {
    id: 3,
    nama: "Genta Gempi Solo",
    durasi: "1 malam",
    harga: 80000,
    satuan: "paket",
    tag: null,
    min_participants: 1,
    max_participants: 1,
    gambar: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=500&h=320&fit=crop&auto=format",
    deskripsi: "Camping solo — 1 tenda, 1 peserta.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  },
  {
    id: 4,
    nama: "Genta Gempi Buddy",
    durasi: "1 malam",
    harga: 130000,
    satuan: "paket",
    tag: null,
    min_participants: 1,
    max_participants: 2,
    gambar: "https://images.unsplash.com/photo-1541855492-581f618f69a0?w=500&h=320&fit=crop&auto=format",
    deskripsi: "Camping berdua — 1 tenda untuk 2 peserta.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  },
  {
    id: 5,
    nama: "Genta Gempi Family",
    durasi: "1 malam",
    harga: 180000,
    satuan: "paket",
    tag: "Terbaru",
    min_participants: 1,
    max_participants: 2,
    gambar: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=500&h=300&fit=crop&auto=format",
    deskripsi: "Camping keluarga — 1 tenda per 2 peserta, termasuk makan malam & api unggun.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: ""
  }
];

export default function TourPackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<TourPackage[]>(FALLBACK_PACKAGES);
  const [filter, setFilter] = useState("Semua");
  const categories = ["Semua", "Terpopuler", "Promo", "Grup"];

  useEffect(() => {
    getTourPackages()
      .then(res => {
        if (res?.data && res.data.length > 0) {
          setPackages(res.data);
        }
      })
      .catch(() => {
      });
  }, []);

  const filteredPackages = packages.filter(p => {
    if (filter === "Semua") return true;
    if (filter === "Terpopuler") return p.tag?.toLowerCase() === "terpopuler";
    if (filter === "Promo") return p.tag?.toLowerCase() === "promo";
    if (filter === "Grup") return p.satuan === "grup" || (p.min_participants ?? 0) >= 10;
    return true;
  }).slice(0, 4);

  return (
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
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredPackages.map(p => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#c5d0ff] group hover:shadow-lg hover:border-[#182cc1] transition-all cursor-pointer flex flex-col h-full relative"
                  onClick={() => navigate('/packages')}>
                  <div className="relative h-40 bg-[#c5d0ff] overflow-hidden flex-shrink-0">
                    <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                        <div className="text-[#182cc1] font-bold text-sm">{`Rp ${Number(p.harga).toLocaleString('id-ID')}`}</div>
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
          </div>
        </div>
      </div>
    </section>
  );
}
