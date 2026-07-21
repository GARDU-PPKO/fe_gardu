import { useEffect, useState } from "react";
import { CheckCircle, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTourPackages } from "../../services/tour-package.service";
import type { TourPackage } from "../../types";

export default function TourPackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<TourPackage[]>([]);

  useEffect(() => {
    getTourPackages().then(res => {
      const pkgs = [...res.data];
      const hasEdukasi = pkgs.some(p => p.nama.toLowerCase().includes('kopi') || p.nama.toLowerCase().includes('susu') || (p.tag && p.tag.toLowerCase() === 'edukasi'));
      if (!hasEdukasi) {
        pkgs.push({
          id: 999,
          nama: 'Edu-Tour Kopi & Susu Kambing',
          deskripsi: 'Wisata edukasi mengenal proses pengelolaan kopi lokal dan cara memerah susu kambing etawa.',
          harga: 45000,
          satuan: 'orang',
          tag: 'Edukasi',
          durasi: '±3 jam',
          min_participants: 5,
          max_participants: 30,
          gambar: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&h=320&fit=crop&auto=format',
          includes: [
            { id: 1, package_id: 999, item: 'Tour kebun kopi', urutan: 1 },
            { id: 2, package_id: 999, item: 'Praktik perah susu', urutan: 2 },
            { id: 3, package_id: 999, item: 'Tasting kopi & susu', urutan: 3 },
            { id: 4, package_id: 999, item: 'Pemandu edukasi', urutan: 4 }
          ],
          is_active: true, created_by: 1, created_at: '', updated_at: ''
        });
      }
      // Add tag Adventure to River Exploration
      const fixedPackages = pkgs.map(p => {
        if (p.nama === 'River Exploration' && !p.tag) {
          return { ...p, tag: 'Adventure' };
        }
        return p;
      });

      setPackages(fixedPackages);
    });
  }, []);

  return (
    <section id="paket" className="py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[380px_1fr] gap-14 items-center">
          {/* Left text */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green-600" style={{ fontFamily: "Inter, sans-serif" }}>Paket Wisata</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1f0f] mt-2 mb-4 leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
              Paket Tubing Seru<br />untuk Semua
            </h2>
            <p className="text-[#4b7a55] text-sm leading-relaxed mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Pilih paket yang sesuai — dari petualangan solo hingga liburan keluarga besar. Semua dilengkapi peralatan keselamatan standar dan panduan profesional.
            </p>
            <div className="space-y-3 mb-8">
              {["Helm & pelampung keselamatan tersedia", "Pemandu berlisensi nasional", "Dokumentasi foto & video", "Area parkir luas & toilet bersih"].map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-[#0a1f0f]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/booking/package')}
              className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition shadow-md shadow-green-200"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              <Ticket size={16} /> Pesan Sekarang
            </button>
          </div>

          {/* Right cards — 2×2 grid showing all 4 packages */}
          <div className="grid sm:grid-cols-2 gap-5">
            {packages.map(p => (
              <div key={p.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 cursor-pointer flex flex-col h-full group ${p.tag === "Terpopuler" ? "border-2 border-green-500 shadow-md shadow-green-100/50 hover:shadow-xl hover:border-green-500 scale-[1.01]" : "border border-[#bbf7d0] hover:shadow-lg hover:border-green-300"}`}
                onClick={() => navigate('/booking/package')}>
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  {p.tag && p.tag.toLowerCase() !== "promo" && (
                    <span className={`absolute top-4 left-4 text-xs font-extrabold px-3 py-1 rounded-full shadow-md ${p.tag === "Terpopuler" ? "bg-amber-500 text-white" : "bg-[#16a34a] text-white"}`}>
                      {p.tag}
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 pr-4">
                    <span className="text-white font-black text-2xl drop-shadow-lg leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>{p.nama}</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{p.deskripsi}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 mt-1 border-t border-dashed border-[#bbf7d0]/60 pt-4">
                    {p.includes?.slice(0, 3).map(inc => (
                      <div key={inc.item} className="flex items-center gap-1.5 text-xs font-medium text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {inc.item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="text-[#16a34a] font-black text-2xl sm:text-3xl leading-none">{`Rp ${Number(p.harga).toLocaleString('id-ID')}`}</div>
                        <div className="text-gray-500 text-xs mt-2 font-medium">{p.satuan === 'orang' ? "per orang" : "per grup"} · {p.durasi}</div>
                      </div>
                      <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                        {p.min_participants === p.max_participants ? `Min. ${p.min_participants}` : `${p.min_participants}–${p.max_participants} org`}
                      </span>
                    </div>
                    <button className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 group/btn active:scale-95 shadow-md shadow-green-200/50"
                      style={{ fontFamily: "Poppins, sans-serif" }}>
                      <Ticket size={16} className="group-hover/btn:rotate-12 transition-transform" /> 
                      Pesan Paket Ini
                      <span className="opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300">&rarr;</span>
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
