import { useState, useRef, useEffect } from "react";
import { Users, Home, ChevronLeft, ChevronRight, Leaf, Eye } from "lucide-react";
import { getDusun } from "../../services/dusun.service";
import type { Dusun } from "../../types";

const FALLBACK_DUSUN: Dusun[] = [
  {
    id: 1,
    nama: "Seklotok",
    rw: "RW 01",
    jumlah_rt: 3,
    jumlah_penduduk: 412,
    luas_wilayah: "1,2 km²",
    thumbnail: "https://images.unsplash.com/photo-1627796863235-2dddce3e862d?w=400&h=300&fit=crop&auto=format",
    hero_img: "https://images.unsplash.com/photo-1627796863235-2dddce3e862d?w=800&h=500&fit=crop&auto=format",
    deskripsi: "Dusun di tepi sungai dengan sawah hijau membentang luas.",
    detail: "Seklotok adalah dusun yang berbatasan langsung dengan aliran Sungai Blukar. Hamparan sawah organik membentang hijau sepanjang musim tanam. Warganya dikenal sebagai petani padi terbaik di Desa Getas.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: "",
    keunggulan: [
      { id: 101, dusun_id: 1, keunggulan: "Sawah organik tepi sungai", urutan: 1 },
      { id: 102, dusun_id: 1, keunggulan: "Pemandangan matahari terbit terbaik", urutan: 2 },
      { id: 103, dusun_id: 1, keunggulan: "Akses jalur tubing utama", urutan: 3 }
    ],
    galleries: [
      { id: 11, dusun_id: 1, image_url: "https://images.unsplash.com/photo-1627796863235-2dddce3e862d?w=600&h=400&fit=crop&auto=format", urutan: 1 },
      { id: 12, dusun_id: 1, image_url: "https://images.unsplash.com/photo-1683506684881-efbb5203eacf?w=600&h=400&fit=crop&auto=format", urutan: 2 },
      { id: 13, dusun_id: 1, image_url: "https://images.unsplash.com/photo-1546845776-dcdf70fd09e3?w=600&h=400&fit=crop&auto=format", urutan: 3 }
    ]
  },
  {
    id: 2,
    nama: "Mambang",
    rw: "RW 02",
    jumlah_rt: 3,
    jumlah_penduduk: 445,
    luas_wilayah: "1,4 km²",
    thumbnail: "https://images.unsplash.com/photo-1683506684881-efbb5203eacf?w=400&h=300&fit=crop&auto=format",
    hero_img: "https://images.unsplash.com/photo-1683506684881-efbb5203eacf?w=800&h=500&fit=crop&auto=format",
    deskripsi: "Kawasan pertanian organik unggulan Desa Getas.",
    detail: "Mambang dikenal sebagai lumbung pangan Desa Getas. Sistem pertanian organik diterapkan secara konsisten sejak 2015. Produk beras organiknya telah merambah pasar Kabupaten Kendal.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: "",
    keunggulan: [
      { id: 201, dusun_id: 2, keunggulan: "Sentra beras organik", urutan: 1 },
      { id: 202, dusun_id: 2, keunggulan: "Kelompok tani aktif", urutan: 2 },
      { id: 203, dusun_id: 2, keunggulan: "Irigasi teknis terbaik", urutan: 3 }
    ],
    galleries: [
      { id: 21, dusun_id: 2, image_url: "https://images.unsplash.com/photo-1683506684881-efbb5203eacf?w=600&h=400&fit=crop&auto=format", urutan: 1 },
      { id: 22, dusun_id: 2, image_url: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&h=400&fit=crop&auto=format", urutan: 2 }
    ]
  },
  {
    id: 3,
    nama: "Jolinggo",
    rw: "RW 03",
    jumlah_rt: 2,
    jumlah_penduduk: 387,
    luas_wilayah: "1,6 km²",
    thumbnail: "https://images.unsplash.com/photo-1672128558402-8e03471c8779?w=400&h=300&fit=crop&auto=format",
    hero_img: "https://images.unsplash.com/photo-1672128558402-8e03471c8779?w=800&h=500&fit=crop&auto=format",
    deskripsi: "Dikelilingi hutan pinus dengan udara sejuk sepanjang hari.",
    detail: "Jolinggo terletak di ketinggian paling tinggi di Desa Getas, dikelilingi hutan pinus dan tanaman kopi. Udaranya paling sejuk dan cocok untuk agrowisata perkebunan.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: "",
    keunggulan: [
      { id: 301, dusun_id: 3, keunggulan: "Hutan pinus dan kopi", urutan: 1 },
      { id: 302, dusun_id: 3, keunggulan: "Agrowisata perkebunan", urutan: 2 }
    ]
  },
  {
    id: 4,
    nama: "Genting",
    rw: "RW 04",
    jumlah_rt: 2,
    jumlah_penduduk: 356,
    luas_wilayah: "1,1 km²",
    thumbnail: "https://images.unsplash.com/photo-1546845776-dcdf70fd09e3?w=400&h=300&fit=crop&auto=format",
    hero_img: "https://images.unsplash.com/photo-1546845776-dcdf70fd09e3?w=800&h=500&fit=crop&auto=format",
    deskripsi: "Dusun yang terkenal dengan kerajinan bambu tradisional.",
    detail: "Genting adalah pusat kerajinan tangan Desa Getas. Anyaman bambu buatan warga Genting dikenal hingga tingkat provinsi.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: "",
    keunggulan: [
      { id: 401, dusun_id: 4, keunggulan: "Pusat kerajinan anyaman bambu", urutan: 1 },
      { id: 402, dusun_id: 4, keunggulan: "Workshop batik tulis", urutan: 2 }
    ]
  },
  {
    id: 5,
    nama: "Metep",
    rw: "RW 05",
    jumlah_rt: 2,
    jumlah_penduduk: 398,
    luas_wilayah: "1,8 km²",
    thumbnail: "https://images.unsplash.com/photo-1637993921206-cae1c2cbba20?w=400&h=300&fit=crop&auto=format",
    hero_img: "https://images.unsplash.com/photo-1637993921206-cae1c2cbba20?w=800&h=500&fit=crop&auto=format",
    deskripsi: "Dekat air terjun alami, destinasi hiking favorit warga.",
    detail: "Metep menjadi pintu masuk utama menuju Air Terjun Getas yang tersembunyi di balik bukit. Jalur hiking sepanjang 3 km melewati dusun ini menjadi favorit wisatawan alam.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: "",
    keunggulan: [
      { id: 501, dusun_id: 5, keunggulan: "Gerbang air terjun tersembunyi", urutan: 1 },
      { id: 502, dusun_id: 5, keunggulan: "Jalur hiking 3 km", urutan: 2 }
    ]
  },
  {
    id: 6,
    nama: "Bleder",
    rw: "RW 06",
    jumlah_rt: 2,
    jumlah_penduduk: 421,
    luas_wilayah: "1,3 km²",
    thumbnail: "https://images.unsplash.com/photo-1719380959727-b240fc7c77de?w=400&h=300&fit=crop&auto=format",
    hero_img: "https://images.unsplash.com/photo-1719380959727-b240fc7c77de?w=800&h=500&fit=crop&auto=format",
    deskripsi: "Titik awal jalur tubing Sungai Blukar yang terkenal.",
    detail: "Bleder adalah titik start utama wisata tubing Sungai Blukar. Pengelola wisata tubing terbesar bermarkas di dusun ini.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: "",
    keunggulan: [
      { id: 601, dusun_id: 6, keunggulan: "Start point tubing Sungai Blukar", urutan: 1 },
      { id: 602, dusun_id: 6, keunggulan: "Fasilitas wisata terlengkap", urutan: 2 }
    ]
  },
  {
    id: 7,
    nama: "Getas",
    rw: "RW 07",
    jumlah_rt: 3,
    jumlah_penduduk: 478,
    luas_wilayah: "1,0 km²",
    thumbnail: "https://images.unsplash.com/photo-1646928232133-8b2e82546057?w=400&h=300&fit=crop&auto=format",
    hero_img: "https://images.unsplash.com/photo-1646928232133-8b2e82546057?w=800&h=500&fit=crop&auto=format",
    deskripsi: "Pusat pemerintahan dan balai desa berada di sini.",
    detail: "Dusun Getas adalah jantung Desa Getas — lokasi balai desa, kantor pelayanan, dan pusat kegiatan masyarakat.",
    is_active: true,
    created_by: 1,
    created_at: "",
    updated_at: "",
    keunggulan: [
      { id: 701, dusun_id: 7, keunggulan: "Pusat pemerintahan desa", urutan: 1 },
      { id: 702, dusun_id: 7, keunggulan: "Pasar desa setiap Minggu", urutan: 2 }
    ]
  }
];

const sortByRW = (list: Dusun[]) =>
  [...list].sort((a, b) => {
    const numA = parseInt((a.rw || '').replace(/\D/g, ''), 10) || 0;
    const numB = parseInt((b.rw || '').replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

export default function DusunSlider({ onSelect }: { onSelect: (d: Dusun) => void }) {
  const [dusunList, setDusunList] = useState<Dusun[]>(sortByRW(FALLBACK_DUSUN));
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    getDusun()
      .then(res => {
        if (res?.data && res.data.length > 0) {
          setDusunList(sortByRW(res.data));
        }
      })
      .catch(() => {});
  }, []);

  const CARD_W = 252;
  const GAP = 12;
  const STEP = (CARD_W + GAP) * 3;
  const TOTAL_SLIDES = 2;

  const updateState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    setActiveIdx(Math.min(Math.round(el.scrollLeft / STEP), TOTAL_SLIDES - 1));
  };

  const slide = (dir: "prev" | "next") => {
    trackRef.current?.scrollBy({ left: dir === "next" ? STEP : -STEP, behavior: "smooth" });
  };

  const goTo = (idx: number) => {
    trackRef.current?.scrollTo({ left: idx * STEP, behavior: "smooth" });
  };

  return (
    <div id="wisata" className="mt-7">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#182cc1]" style={{ fontFamily: "Inter, sans-serif" }}>Wilayah Desa</p>
          <h3 className="text-lg font-bold text-[#091540]" style={{ fontFamily: "Poppins, sans-serif" }}>Dusun di Desa Getas</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => slide("prev")} disabled={!canPrev}
            className="w-9 h-9 rounded-full border border-[#c5d0ff] bg-white flex items-center justify-center text-[#3d518c] hover:border-[#182cc1] hover:text-[#182cc1] disabled:opacity-30 transition shadow-sm">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => slide("next")} disabled={!canNext}
            className="w-9 h-9 rounded-full bg-[#182cc1] flex items-center justify-center text-white hover:bg-[#1524a3] disabled:opacity-30 transition shadow-sm">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* track */}
      <div ref={trackRef} onScroll={updateState}
        className="flex gap-3 overflow-x-auto pb-4"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}>

        {dusunList.map((d) => (
            <div key={d.id}
              className="flex-shrink-0 w-[220px] sm:w-[260px] h-[300px] sm:h-[340px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#091540] cursor-pointer relative group"
              style={{ scrollSnapAlign: "start" }}
              onClick={() => onSelect(d)}>

              <img src={d.thumbnail} alt={d.nama} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#091540] via-[#091540]/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

              {/* RW badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold border border-white/30">
                {d.rw}
              </div>

              {/* Content that slides up */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end transition-transform duration-500 ease-out translate-y-[84px] group-hover:translate-y-0">
                <span className="text-white font-black text-2xl leading-none drop-shadow-md mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {d.nama}
                </span>

                {/* stats */}
                <div className="flex items-center gap-3 mb-2 text-white/90">
                  <div className="flex items-center gap-1.5 text-[11px]" style={{ fontFamily: "Inter, sans-serif" }}>
                    <Users size={12} className="text-[#a5b4fc]" /> {d.jumlah_penduduk || "400"}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]" style={{ fontFamily: "Inter, sans-serif" }}>
                    <Home size={12} className="text-[#a5b4fc]" /> {d.jumlah_rt || "3"} RT
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] ml-auto">
                    <Leaf size={12} className="text-[#a5b4fc]" /> {d.luas_wilayah || "1,2 km²"}
                  </div>
                </div>

                {/* deskripsi (hidden until hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-[64px]">
                  <p className="text-white/80 text-xs leading-relaxed line-clamp-2 mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                    {d.deskripsi}
                  </p>
                </div>

                <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  style={{ fontFamily: "Poppins, sans-serif" }}>
                  <Eye size={14} /> Lihat Detail Dusun
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* dots */}
      <div className="flex justify-center gap-1.5 mt-1">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${activeIdx === i ? "w-5 h-1.5 bg-[#182cc1]" : "w-1.5 h-1.5 bg-[#c5d0ff] hover:bg-[#abd2fa]"}`} />
        ))}
      </div>
    </div>
  );
}