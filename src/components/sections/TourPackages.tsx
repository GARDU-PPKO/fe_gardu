import { useEffect, useState } from "react";
import { CheckCircle, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTourPackages } from "../../services/tour-package.service";
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

export default function TourPackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<TourPackage[]>(FALLBACK_PACKAGES);

  useEffect(() => {
    getTourPackages()
      .then(res => {
        if (res?.data && res.data.length > 0) {
          // Batasi maksimal 4 paket agar grid kanan-kiri (2x2) tetap sempurna dan tidak memanjang
          setPackages(res.data.slice(0, 4));
        }
      })
      .catch(() => {
        // Biarkan menggunakan data fallback jika API gagal / tidak aktif
      });
  }, []);

  return (
    <section id="paket" className="py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[380px_1fr] gap-14 items-center">
          {/* Left text */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#182cc1]" style={{ fontFamily: "Inter, sans-serif" }}>Paket Wisata</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#091540] mt-2 mb-4 leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
              Paket Tubing Seru<br />untuk Semua
            </h2>
            <p className="text-[#3d518c] text-sm leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Pilih paket yang sesuai — dari petualangan solo hingga liburan keluarga besar. Semua dilengkapi peralatan keselamatan standar dan panduan profesional.
            </p>
            <div className="space-y-3 mb-8">
              {["Helm & pelampung keselamatan tersedia", "Pemandu berlisensi nasional", "Dokumentasi foto & video", "Area parkir luas & toilet bersih"].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-[#091540]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <CheckCircle size={14} className="text-[#182cc1] flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/booking/package')}
              className="flex items-center gap-2.5 px-6 py-3 bg-[#182cc1] hover:bg-[#1524a3] text-white font-semibold rounded-full transition shadow-md shadow-[#c5d0ff]"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              <Ticket size={16} /> Pesan Sekarang
            </button>
          </div>

          {/* Right cards - 2x2 grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {packages.map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#c5d0ff] group hover:shadow-lg hover:border-[#abd2fa] transition-all cursor-pointer flex flex-col h-full"
                onClick={() => navigate('/booking/package')}>
                <div className="relative h-40 bg-[#c5d0ff] overflow-hidden flex-shrink-0">
                  <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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
                    <p className="text-[#3d518c] text-xs mb-3 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{p.deskripsi}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3 pt-2">
                      <div>
                        <span className="text-[#182cc1] font-bold text-sm">{`Rp ${Number(p.harga).toLocaleString('id-ID')}`}</span>
                        <span className="text-[#3d518c] text-[10px] ml-1">{p.satuan === 'orang' ? "/orang" : "/grup"} · {p.durasi}</span>
                      </div>
                      <span className="text-[10px] text-[#3d518c] bg-[#eef2ff] border border-[#c5d0ff] px-2 py-0.5 rounded-full">
                        {p.min_participants === p.max_participants ? `Min. ${p.min_participants}` : `${p.min_participants}–${p.max_participants} org`}
                      </span>
                    </div>
                    <button className="w-full py-2.5 bg-[#182cc1] hover:bg-[#1524a3] text-white text-xs font-bold rounded-full transition flex items-center justify-center gap-1.5 shadow-xs"
                      style={{ fontFamily: "Poppins, sans-serif" }}>
                      <Ticket size={12} /> Pesan Paket Ini
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
