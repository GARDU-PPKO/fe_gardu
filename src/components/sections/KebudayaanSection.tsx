import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { getBudaya } from "../../services/budaya.service";
import type { Budaya } from "../../types";

const DEFAULT_ACARA = [
  { icon: "🥁", title: "Kuda Lumping", jadwal: "Setiap bulan Suro & hari nasional" },
  { icon: "🎨", title: "Workshop Batik Tulis", jadwal: "Sabtu–Minggu, 08.00–12.00 WIB" },
  { icon: "🎭", title: "Pentas Seni Malam Jumat", jadwal: "Setiap Jumat malam di Dusun Sanggar" },
];

const FALLBACK_BUDAYA: Budaya[] = [
  {
    id: 1,
    judul: "Kuda Lumping",
    kategori: "Seni Pertunjukan",
    deskripsi: "Tarian tradisional kuda lumping yang digelar setiap peringatan hari besar dan acara adat desa.",
    gambar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=700&h=460&fit=crop&auto=format",
    span_grid: 2,
    is_active: true,
    created_by: 1,
  },
  {
    id: 2,
    judul: "Batik Tulis Getas",
    kategori: "Kerajinan Tradisional",
    deskripsi: "Batik tulis tangan bermotif sungai dan alam, warisan leluhur yang terus dilestarikan.",
    gambar: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop&auto=format",
    span_grid: 0,
    is_active: true,
    created_by: 1,
  },
  {
    id: 3,
    judul: "Pesta Panen & Sedekah Bumi",
    kategori: "Upacara Adat",
    deskripsi: "Tradisi syukur atas hasil bumi yang digelar setiap tahun dengan arak-arakan dan doa bersama.",
    gambar: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop&auto=format",
    span_grid: 0,
    is_active: true,
    created_by: 1,
  },
  {
    id: 4,
    judul: "Sanggar Tari Tradisional",
    kategori: "Seni Pertunjukan",
    deskripsi: "Sanggar aktif melatih generasi muda dalam tari-tarian Jawa, rebana, dan seni wayang.",
    gambar: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&auto=format",
    span_grid: 0,
    is_active: true,
    created_by: 1,
  },
  {
    id: 5,
    judul: "Perkebun & Agraris",
    kategori: "Kearifan Lokal",
    deskripsi: "Sistem pertanian organik berbasis kearifan lokal yang diwariskan secara turun-temurun.",
    gambar: "https://images.unsplash.com/photo-1683506684881-efbb5203eacf?w=400&h=300&fit=crop&auto=format",
    span_grid: 0,
    is_active: true,
    created_by: 1,
  },
];

export default function KebudayaanSection() {
  const [items, setItems] = useState<Budaya[]>(FALLBACK_BUDAYA);
  const [lb, setLb] = useState<Budaya | null>(null);

  useEffect(() => {
    getBudaya()
      .then(res => {
        if (res?.data && res.data.length > 0) {
          // Selalu pertahankan persis gambar dan jumlah 5 item original sesuai design ppko 1 page
          const synced = res.data.slice(0, 5).map((item, idx) => ({
            ...item,
            gambar: FALLBACK_BUDAYA[idx % FALLBACK_BUDAYA.length].gambar,
            kategori: FALLBACK_BUDAYA[idx % FALLBACK_BUDAYA.length].kategori
          }));
          while (synced.length < 5) {
            synced.push(FALLBACK_BUDAYA[synced.length]);
          }
          setItems(synced);
        }
      })
      .catch(() => {
        // Gunakan data fallback
      });
  }, []);

  const schedules = items.flatMap(i => i.schedules ?? []).slice(0, 3);
  const displayAcara = schedules.length >= 3 ? schedules.map((s, idx) => ({
    icon: idx === 0 ? "🥁" : idx === 1 ? "🎨" : "🎭",
    title: s.nama_acara,
    jadwal: `${s.hari}, ${s.jam}`
  })) : DEFAULT_ACARA;

  return (
    <section id="budaya" className="py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#182cc1]" style={{ fontFamily: "Inter, sans-serif" }}>Seni & Budaya</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#091540] mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>Kebudayaan Desa Getas</h2>
          </div>
          <p className="text-[#3d518c] text-sm max-w-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Warisan seni, tradisi, dan kearifan lokal yang terus hidup di tengah masyarakat.
          </p>
        </div>

        {/* masonry grid persis referensi screenshot (2+1 di atas, 1+1+1 di bawah) */}
        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[360px] sm:h-[460px]">
          {items.map((item, index) => (
            <div key={item.id} onClick={() => setLb(item)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group bg-[#e8edff] ${index === 0 ? "col-span-2" : "col-span-1"}`}>
              <img src={item.gambar} alt={item.judul}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091540]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              
              {/* always-visible category pill */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#182cc1] text-[10px] font-bold shadow">
                  {item.kategori}
                </span>
              </div>
              
              {/* hover reveal */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="font-bold text-white text-sm leading-tight drop-shadow mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}>{item.judul}</div>
                <p className="text-white/80 text-xs leading-relaxed line-clamp-2"
                  style={{ fontFamily: "Inter, sans-serif" }}>{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>

        {/* cards below grid */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {displayAcara.map(c => (
            <div key={c.title} className="flex items-center gap-4 bg-[#eef2ff] border border-[#c5d0ff] rounded-2xl p-4 hover:border-[#182cc1]/40 hover:shadow-md transition-all">
              <div className="text-3xl flex-shrink-0">{c.icon}</div>
              <div>
                <div className="font-bold text-[#091540] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{c.title}</div>
                <div className="text-[#3d518c] text-xs mt-0.5 flex items-center gap-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  <Clock size={10} /> {c.jadwal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* lightbox */}
      {lb && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLb(null)}>
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="relative h-64 bg-[#e8edff]">
              <img src={lb.gambar} alt={lb.judul} className="w-full h-full object-cover" />
              <button onClick={() => setLb(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#091540] hover:bg-white transition shadow">
                <X size={16} />
              </button>
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#182cc1] text-white text-xs font-bold">
                {lb.kategori}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#091540] text-lg mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>{lb.judul}</h3>
              <p className="text-[#3d518c] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{lb.deskripsi}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}