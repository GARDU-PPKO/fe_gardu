import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ArrowRight, MapPin, Phone, Mail,
  Users, Home, Briefcase, Mountain, Star,
  MessageSquare, Info, Camera,
  ChevronLeft, ChevronRight, CheckCircle,
  Clock, Ticket, Leaf,
  Eye, Waves, TreePine, Heart
} from "lucide-react";
const LogoGardu = "https://ui-avatars.com/api/?name=DG&background=16a34a&color=fff";


const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
};

// ─── nav ────────────────────────────────────────────────────────────────────

const NAV = [
  { label: "Beranda",  href: "#hero" },
  { label: "Wisata",   href: "#wisata" },
  { label: "Paket",    href: "#paket" },
  { label: "UMKM",     href: "#umkm" },
  { label: "Budaya",   href: "#budaya" },
  { label: "Kontak",   href: "#kontak" },
];

function Navbar({ onOpenBooking }: { onOpenBooking: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#bbf7d0]" : "bg-white/90 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-3">

        {/* ── Left: Logo + AR Explore ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={() => scrollTo("#hero")} className="flex items-center gap-2 flex-shrink-0">
            <img src={LogoGardu} alt="Logo Desa Getas" className="w-8 h-8 object-contain" />
            <span className="font-bold text-[#0a1f0f] text-sm tracking-wide hidden sm:block" style={{ fontFamily: "Poppins, sans-serif" }}>
              DESA<span className="text-[#16a34a]">GETAS</span>
            </span>
          </button>

          {/* AR Explore — prominent left button */}
          <button onClick={() => scrollTo("#ar")}
            className="hidden sm:flex items-center gap-1.5 pl-3 pr-3.5 py-1.5 rounded-xl border border-[#bbf7d0] bg-white hover:bg-[#dcfce7] hover:border-[#16a34a]/50 transition-all group shadow-sm"
            style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#16a34a] to-[#4ade80] flex items-center justify-center flex-shrink-0">
              <Camera size={11} className="text-white" />
            </div>
            <span className="text-xs font-bold text-[#16a34a]">AR Explore</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </button>
        </div>

        {/* ── Centre: Nav links ── */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {NAV.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.href)}
              className="px-3 py-2 text-sm text-[#166534] hover:text-[#16a34a] hover:bg-[#dcfce7] rounded-lg transition-all font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* ── Right: Pesan Sekarang ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={onOpenBooking}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-bold rounded-xl transition shadow-md shadow-green-200/60"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            <Ticket size={14} />
            Pesan Sekarang
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#166534] hover:bg-[#dcfce7] transition">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#bbf7d0] px-5 py-3 space-y-1">
          <button onClick={() => { scrollTo("#ar"); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#16a34a] hover:bg-[#dcfce7] rounded-lg transition flex items-center gap-2">
            <Camera size={14} /> AR Explore
          </button>
          {NAV.map(l => (
            <button key={l.label} onClick={() => { scrollTo(l.href); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-[#166534] hover:text-[#16a34a] hover:bg-[#dcfce7] rounded-lg transition"
              style={{ fontFamily: "Inter, sans-serif" }}>
              {l.label}
            </button>
          ))}
          <div className="pt-2">
            <button onClick={() => { onOpenBooking(); setOpen(false); }}
              className="w-full py-3 bg-[#16a34a] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              <Ticket size={15} /> Pesan Sekarang
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── hero ────────────────────────────────────────────────────────────────────

function Hero({ onSelectDusun }: { onSelectDusun: (d: typeof DUSUN[0]) => void }) {
  return (
    <section id="hero" className="pt-20 pb-8 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* framed hero image — WANDER style */}
        <div className="relative rounded-3xl overflow-hidden bg-[#052e16]" style={{ height: "clamp(320px, 55vw, 600px)" }}>
          <img
            src="https://images.unsplash.com/photo-1719380959727-b240fc7c77de?w=1400&h=700&fit=crop&auto=format"
            alt="Sungai mengalir di tengah hutan hijau Desa Getas"
            className="w-full h-full object-cover opacity-80"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0f]/80 via-[#0a1f0f]/20 to-transparent" />

          {/* Big title like WANDER */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
            <p className="text-white/70 text-sm font-medium mb-2 tracking-widest uppercase" style={{ fontFamily: "Inter, sans-serif" }}>
              Kecamatan Singorojo · Kabupaten Kendal
            </p>
            <h1
              className="font-black text-white leading-none mb-4"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(4rem, 12vw, 10rem)",
                letterSpacing: "-0.02em",
                textShadow: "0 4px 40px rgba(0,0,0,0.4)",
              }}>
              GETAS
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => scrollTo("#wisata")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0a1f0f] text-sm font-bold rounded-xl hover:bg-[#dcfce7] transition shadow-lg"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                <Waves size={16} className="text-green-600" />
                Jelajahi Wisata Tubing
              </button>
              <button onClick={() => scrollTo("#layanan")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold rounded-xl hover:bg-white/25 transition"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                Layanan Online
              </button>
            </div>
          </div>

          {/* badge top-right */}
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-green-500/90 text-white text-xs font-bold backdrop-blur-sm flex items-center gap-1.5">
              <TreePine size={12} /> Desa Wisata Alam
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
            </span>
          </div>
        </div>

        {/* ── Profil sekilas — merged into beranda ── */}
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Wisatawan / Tahun", value: "8.500+", icon: Mountain },
            { label: "UMKM Aktif",        value: "62 unit", icon: Briefcase },
            { label: "Total Penduduk",     value: "4.287",   icon: Users },
            { label: "Luas Wilayah",       value: "12,4 km²",icon: TreePine },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#bbf7d0] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-[#dcfce7] flex items-center justify-center flex-shrink-0">
                <s.icon size={17} className="text-[#16a34a]" />
              </div>
              <div>
                <div className="font-bold text-[#052e16] text-sm leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</div>
                <div className="text-[#4b7a55] text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Profil detail — sejarah + visi + lokasi ── */}
        <div className="mt-4 grid lg:grid-cols-3 gap-4">
          {/* Sejarah singkat */}
          <div className="lg:col-span-2 bg-white border border-[#bbf7d0] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#dcfce7] flex items-center justify-center">
                <Info size={14} className="text-[#16a34a]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#16a34a]" style={{ fontFamily: "Inter, sans-serif" }}>Sekilas Desa Getas</span>
            </div>
            <p className="text-[#4b7a55] text-sm leading-relaxed mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Desa Getas di Kecamatan Singorojo, Kabupaten Kendal — berdiri sejak ±1850, dikenal dengan keindahan Sungai Blukar, pertanian organik, dan wisata tubing yang meraih penghargaan Desa Wisata Terbaik 2025.
            </p>
            {/* visi tagline */}
            <div className="bg-[#f0fdf4] border-l-4 border-[#16a34a] rounded-r-xl px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#16a34a] mb-1">Visi Desa</div>
              <p className="text-[#052e16] text-xs font-semibold leading-relaxed" style={{ fontFamily: "Poppins, sans-serif" }}>
                "Desa Getas Maju, Mandiri, dan Sejahtera Berbasis Kearifan Lokal dan Teknologi Digital"
              </p>
            </div>
            {/* mini org */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { jabatan: "Kepala Desa",   nama: "Suyitno, S.Pd." },
                { jabatan: "Sekretaris",    nama: "Supartini" },
                { jabatan: "Kasi Layanan",  nama: "Dwi Lestari" },
              ].map(p => (
                <div key={p.jabatan} className="flex items-center gap-2 bg-[#f0fdf4] rounded-xl p-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#16a34a]/15 flex items-center justify-center flex-shrink-0">
                    <Users size={11} className="text-[#16a34a]" />
                  </div>
                  <div>
                    <div className="text-[#052e16] text-[10px] font-semibold leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>{p.jabatan}</div>
                    <div className="text-[#4b7a55] text-[9px]">{p.nama}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lokasi + stats */}
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-[#bbf7d0] rounded-2xl overflow-hidden shadow-sm flex-1 min-h-[140px]">
              <iframe
                title="Peta Desa Getas"
                src="https://maps.google.com/maps?q=Desa+Getas,+Kecamatan+Singorojo,+Kabupaten+Kendal,+Jawa+Tengah&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[140px]"
                allowFullScreen loading="lazy"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Kecamatan", value: "Singorojo" },
                { label: "Kabupaten", value: "Kendal" },
                { label: "5 Dusun",   value: "8 RW / 24 RT" },
                { label: "Kode Pos",  value: "51382" },
              ].map(i => (
                <div key={i.label} className="bg-white border border-[#bbf7d0] rounded-xl p-2.5 shadow-sm">
                  <div className="text-[#4b7a55] text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>{i.label}</div>
                  <div className="text-[#052e16] text-xs font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>{i.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Dusun slider ── */}
        <DusunSlider onSelect={onSelectDusun} />
      </div>
    </section>
  );
}

// ─── dusun slider ────────────────────────────────────────────────────────────

const DUSUN = [
  {
    name: "Seklotok", rw: "RW 01", rt: 3, penduduk: 412, luas: "1,2 km²",
    img: "https://images.unsplash.com/photo-1627796863235-2dddce3e862d?w=800&h=500&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1627796863235-2dddce3e862d?w=400&h=300&fit=crop&auto=format",
    desc: "Dusun di tepi sungai dengan sawah hijau membentang luas.",
    detail: "Seklotok adalah dusun yang berbatasan langsung dengan aliran Sungai Blukar. Hamparan sawah organik membentang hijau sepanjang musim tanam. Warganya dikenal sebagai petani padi terbaik di Desa Getas.",
    keunggulan: ["Sawah organik tepi sungai", "Pemandangan matahari terbit terbaik", "Akses jalur tubing utama"],
    galeri: ["https://images.unsplash.com/photo-1627796863235-2dddce3e862d?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1683506684881-efbb5203eacf?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1546845776-dcdf70fd09e3?w=600&h=400&fit=crop&auto=format"],
  },
  {
    name: "Mambang", rw: "RW 02", rt: 3, penduduk: 445, luas: "1,4 km²",
    img: "https://images.unsplash.com/photo-1683506684881-efbb5203eacf?w=800&h=500&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1683506684881-efbb5203eacf?w=400&h=300&fit=crop&auto=format",
    desc: "Kawasan pertanian organik unggulan Desa Getas.",
    detail: "Mambang dikenal sebagai lumbung pangan Desa Getas. Sistem pertanian organik diterapkan secara konsisten sejak 2015. Produk beras organiknya telah merambah pasar Kabupaten Kendal.",
    keunggulan: ["Sentra beras organik", "Kelompok tani aktif", "Irigasi teknis terbaik"],
    galeri: ["https://images.unsplash.com/photo-1683506684881-efbb5203eacf?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1627796863235-2dddce3e862d?w=600&h=400&fit=crop&auto=format"],
  },
  {
    name: "Jolinggo", rw: "RW 03", rt: 2, penduduk: 387, luas: "1,6 km²",
    img: "https://images.unsplash.com/photo-1672128558402-8e03471c8779?w=800&h=500&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1672128558402-8e03471c8779?w=400&h=300&fit=crop&auto=format",
    desc: "Dikelilingi hutan pinus dengan udara sejuk sepanjang hari.",
    detail: "Jolinggo terletak di ketinggian paling tinggi di Desa Getas, dikelilingi hutan pinus dan tanaman kopi. Udaranya paling sejuk dan cocok untuk agrowisata perkebunan. Warganya aktif mengembangkan kopi robusta lokal.",
    keunggulan: ["Hutan pinus dan kopi", "Agrowisata perkebunan", "Udara pegunungan segar"],
    galeri: ["https://images.unsplash.com/photo-1672128558402-8e03471c8779?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1637993921206-cae1c2cbba20?w=600&h=400&fit=crop&auto=format"],
  },
  {
    name: "Genting", rw: "RW 04", rt: 2, penduduk: 356, luas: "1,1 km²",
    img: "https://images.unsplash.com/photo-1546845776-dcdf70fd09e3?w=800&h=500&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1546845776-dcdf70fd09e3?w=400&h=300&fit=crop&auto=format",
    desc: "Dusun yang terkenal dengan kerajinan bambu tradisional.",
    detail: "Genting adalah pusat kerajinan tangan Desa Getas. Anyaman bambu buatan warga Genting dikenal hingga tingkat provinsi. Setiap rumah tangga rata-rata menghasilkan kerajinan sebagai sumber penghasilan tambahan.",
    keunggulan: ["Pusat kerajinan anyaman bambu", "Workshop batik tulis", "Pasar seni mingguan"],
    galeri: ["https://images.unsplash.com/photo-1546845776-dcdf70fd09e3?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format"],
  },
  {
    name: "Metep", rw: "RW 05", rt: 2, penduduk: 398, luas: "1,8 km²",
    img: "https://images.unsplash.com/photo-1637993921206-cae1c2cbba20?w=800&h=500&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1637993921206-cae1c2cbba20?w=400&h=300&fit=crop&auto=format",
    desc: "Dekat air terjun alami, destinasi hiking favorit warga.",
    detail: "Metep menjadi pintu masuk utama menuju Air Terjun Getas yang tersembunyi di balik bukit. Jalur hiking sepanjang 3 km melewati dusun ini menjadi favorit wisatawan alam. Komunitas pemandu lokal aktif beroperasi di sini.",
    keunggulan: ["Gerbang air terjun tersembunyi", "Jalur hiking 3 km", "Pemandu wisata lokal"],
    galeri: ["https://images.unsplash.com/photo-1637993921206-cae1c2cbba20?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1582583088753-afb19907963a?w=600&h=400&fit=crop&auto=format"],
  },
  {
    name: "Bleder", rw: "RW 06", rt: 2, penduduk: 421, luas: "1,3 km²",
    img: "https://images.unsplash.com/photo-1719380959727-b240fc7c77de?w=800&h=500&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1719380959727-b240fc7c77de?w=400&h=300&fit=crop&auto=format",
    desc: "Titik awal jalur tubing Sungai Blukar yang terkenal.",
    detail: "Bleder adalah titik start utama wisata tubing Sungai Blukar. Pengelola wisata tubing terbesar bermarkas di dusun ini. Infrastruktur wisata seperti gazebo, toilet, dan area parkir telah tersedia lengkap.",
    keunggulan: ["Start point tubing Sungai Blukar", "Fasilitas wisata terlengkap", "Penginapan warga tersedia"],
    galeri: ["https://images.unsplash.com/photo-1719380959727-b240fc7c77de?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1546058914-5000137323f0?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1709025876683-b252a617ab17?w=600&h=400&fit=crop&auto=format"],
  },
  {
    name: "Getas", rw: "RW 07", rt: 3, penduduk: 478, luas: "1,0 km²",
    img: "https://images.unsplash.com/photo-1646928232133-8b2e82546057?w=800&h=500&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1646928232133-8b2e82546057?w=400&h=300&fit=crop&auto=format",
    desc: "Pusat pemerintahan dan balai desa berada di sini.",
    detail: "Dusun Getas adalah jantung Desa Getas — lokasi balai desa, kantor pelayanan, dan pusat kegiatan masyarakat. Dusun ini menjadi titik pusat seluruh aktivitas administratif dan sosial kemasyarakatan.",
    keunggulan: ["Pusat pemerintahan desa", "Pasar desa setiap Minggu", "Lapangan olahraga utama"],
    galeri: ["https://images.unsplash.com/photo-1646928232133-8b2e82546057?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&auto=format"],
  },
  {
    name: "Truko", rw: "RW 08", rt: 2, penduduk: 362, luas: "1,2 km²",
    img: "https://images.unsplash.com/photo-1709025876683-b252a617ab17?w=800&h=500&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1709025876683-b252a617ab17?w=400&h=300&fit=crop&auto=format",
    desc: "Dusun nelayan kecil di bantaran sungai yang tenang.",
    detail: "Truko berbatasan langsung dengan sungai dan dikenal sebagai dusun dengan pemandangan sungai paling indah. Aktivitas warga di tepi sungai menciptakan suasana pedesaan autentik yang menjadi daya tarik tersendiri.",
    keunggulan: ["Tepi sungai paling indah", "Spot foto sunset terbaik", "Kuliner pecel lele khas"],
    galeri: ["https://images.unsplash.com/photo-1709025876683-b252a617ab17?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1561774711-b0fa364863b7?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1643215721864-cd4c354ac298?w=600&h=400&fit=crop&auto=format"],
  },
  {
    name: "Sanggar", rw: "RW 09", rt: 2, penduduk: 334, luas: "1,3 km²",
    img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=500&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format",
    desc: "Sentra seni budaya dan pertunjukan tradisional desa.",
    detail: "Sanggar adalah dusun dengan tradisi seni budaya paling kuat. Kelompok seni kuda lumping, rebana, dan wayang kulit aktif berlatih di sini. Setiap malam Jumat diadakan pentas seni kecil yang terbuka untuk umum.",
    keunggulan: ["Kelompok seni kuda lumping", "Pentas budaya rutin", "Sanggar tari tradisional"],
    galeri: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&auto=format"],
  },
  {
    name: "Banjaran", rw: "RW 10", rt: 3, penduduk: 694, luas: "1,5 km²",
    img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=500&fit=crop&auto=format",
    thumb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=300&fit=crop&auto=format",
    desc: "Dusun paling hijau — dikelilingi kebun kopi dan cengkeh.",
    detail: "Banjaran adalah dusun terbesar sekaligus terhijau di Desa Getas. Kebun kopi arabika dan cengkeh menyelimuti hampir seluruh wilayahnya. Produk kopi arabika Banjaran sudah dikenal di tingkat nasional.",
    keunggulan: ["Kebun kopi arabika terluas", "Produksi cengkeh terbesar", "Dusun terbesar berpenduduk"],
    galeri: ["https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&auto=format","https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&h=400&fit=crop&auto=format"],
  },
];

function DusunSlider({ onSelect }: { onSelect: (d: typeof DUSUN[0]) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const CARD_W = 252;

  const updateState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    setActiveIdx(Math.min(Math.round(el.scrollLeft / CARD_W), DUSUN.length - 1));
  };

  const slide = (dir: "prev" | "next") => {
    trackRef.current?.scrollBy({ left: dir === "next" ? CARD_W * 3 : -CARD_W * 3, behavior: "smooth" });
  };

  const goTo = (idx: number) => {
    trackRef.current?.scrollTo({ left: idx * CARD_W, behavior: "smooth" });
  };

  return (
    <div className="mt-7">
      <style>{`
        .dusun-track::-webkit-scrollbar { display: none; }
        .dusun-card { transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease, border-color 0.25s ease; }
        .dusun-card:hover { transform: translateY(-8px) scale(1.03); }
        .dusun-card .card-img { transition: height 0.35s cubic-bezier(.22,1,.36,1); }
        .dusun-card:hover .card-img { height: 11rem; }
        .dusun-card .reveal { max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(.22,1,.36,1), opacity 0.3s ease; opacity: 0; }
        .dusun-card:hover .reveal { max-height: 120px; opacity: 1; }
        .dusun-card .tag-row { transition: opacity 0.2s ease; opacity: 0; }
        .dusun-card:hover .tag-row { opacity: 1; }
      `}</style>

      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#16a34a]" style={{ fontFamily: "Inter, sans-serif" }}>Wilayah Desa</p>
          <h3 className="text-lg font-bold text-[#052e16]" style={{ fontFamily: "Poppins, sans-serif" }}>Dusun di Desa Getas</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => slide("prev")} disabled={!canPrev}
            className="w-9 h-9 rounded-full border border-[#bbf7d0] bg-white flex items-center justify-center text-[#4b7a55] hover:border-[#16a34a] hover:text-[#16a34a] disabled:opacity-30 transition shadow-sm">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => slide("next")} disabled={!canNext}
            className="w-9 h-9 rounded-full bg-[#16a34a] flex items-center justify-center text-white hover:bg-[#15803d] disabled:opacity-30 transition shadow-sm">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* track */}
      <div ref={trackRef} onScroll={updateState}
        className="dusun-track flex gap-3 overflow-x-auto pb-4"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>

        {DUSUN.map((d) => (
          <div key={d.name}
            className="dusun-card flex-shrink-0 w-60 rounded-2xl overflow-hidden border border-[#bbf7d0] bg-white shadow-md hover:shadow-2xl hover:border-[#16a34a]/50 cursor-pointer"
            style={{ scrollSnapAlign: "start" }}
            onClick={() => onSelect(d)}>

            {/* image — grows on hover via CSS */}
            <div className="card-img relative h-32 overflow-hidden bg-[#dcfce7]">
              <img src={d.thumb} alt={d.name}
                className="w-full h-full object-cover"
                style={{ transition: "transform 0.5s ease" }}
              />
              {/* darker overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/70 via-[#052e16]/10 to-transparent" />

              {/* RW badge */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#16a34a] text-[10px] font-bold shadow">
                {d.rw}
              </div>

              {/* "Lihat Detail" pill — appears on hover */}
              <div className="tag-row absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#16a34a] text-white text-[10px] font-bold shadow flex items-center gap-1">
                <Eye size={9} /> Detail
              </div>

              {/* name */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                <span className="text-white font-black text-lg leading-none drop-shadow" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {d.name}
                </span>
              </div>
            </div>

            {/* body */}
            <div className="p-3.5">
              {/* always-visible stats row */}
              <div className="flex items-center gap-3 mb-2">
                {[
                  { icon: Users, val: d.penduduk + " jiwa" },
                  { icon: Home, val: d.rt + " RT" },
                ].map(s => (
                  <div key={s.val} className="flex items-center gap-1 text-[10px] text-[#4b7a55]" style={{ fontFamily: "Inter, sans-serif" }}>
                    <s.icon size={10} className="text-[#16a34a]" /> {s.val}
                  </div>
                ))}
                <div className="flex items-center gap-1 text-[10px] text-[#4b7a55] ml-auto">
                  <Leaf size={10} className="text-[#16a34a]" /> {d.luas}
                </div>
              </div>

              <p className="text-[#4b7a55] text-xs leading-relaxed line-clamp-2 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>{d.desc}</p>

              {/* reveal section — slides in on hover */}
              <div className="reveal">
                <div className="pt-2 space-y-1">
                  {d.keunggulan.slice(0, 2).map(k => (
                    <div key={k} className="flex items-center gap-1.5 text-[11px] text-[#166534]" style={{ fontFamily: "Inter, sans-serif" }}>
                      <CheckCircle size={10} className="text-[#16a34a] flex-shrink-0" /> {k}
                    </div>
                  ))}
                </div>
                <button className="mt-2.5 w-full py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  style={{ fontFamily: "Poppins, sans-serif" }}>
                  <ArrowRight size={11} /> Lihat Selengkapnya
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* dots */}
      <div className="flex justify-center gap-1.5 mt-1">
        {DUSUN.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${activeIdx === i ? "w-5 h-1.5 bg-[#16a34a]" : "w-1.5 h-1.5 bg-[#bbf7d0] hover:bg-green-300"}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Dusun Page ───────────────────────────────────────────────────────────────

type DusunData = typeof DUSUN[0];

function DusunPage({ dusun, onClose }: { dusun: DusunData; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col">

      {/* Hero image */}
      <div className="relative h-64 sm:h-80 flex-shrink-0 bg-[#dcfce7] overflow-hidden">
        <img src={dusun.galeri[activeImg]} alt={dusun.name}
          className="w-full h-full object-cover transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/80 via-[#052e16]/20 to-transparent" />

        {/* back button */}
        <button onClick={onClose}
          className="absolute top-4 left-4 flex items-center gap-2 px-3.5 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-[#052e16] text-sm font-semibold hover:bg-white transition shadow-lg">
          <ChevronLeft size={16} /> Kembali
        </button>

        {/* gallery dots */}
        <div className="absolute top-4 right-4 flex gap-1.5">
          {dusun.galeri.map((_, i) => (
            <button key={i} onClick={() => setActiveImg(i)}
              className={`rounded-full transition-all ${activeImg === i ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`} />
          ))}
        </div>

        {/* title block */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10 bg-gradient-to-t from-[#052e16]/90 to-transparent">
          <div className="flex items-end justify-between">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#16a34a]/80 backdrop-blur-sm">
                <TreePine size={12} className="text-white" />
                <span className="text-white text-xs font-bold uppercase tracking-wide">Desa Getas · {dusun.rw}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>
                {dusun.name}
              </h1>
            </div>
            {/* quick stats */}
            <div className="hidden sm:flex gap-4 pb-1">
              {[
                { icon: Users, label: "Penduduk", val: dusun.penduduk.toLocaleString("id-ID") },
                { icon: Home,  label: "RT",        val: String(dusun.rt) },
                { icon: Leaf,  label: "Luas",      val: dusun.luas },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-white font-black text-lg leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>{s.val}</div>
                  <div className="text-white/60 text-[10px] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex-shrink-0 flex gap-2 px-6 py-3 bg-[#f0fdf4] border-b border-[#bbf7d0] overflow-x-auto">
        {dusun.galeri.map((src, i) => (
          <button key={i} onClick={() => setActiveImg(i)}
            className={`flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? "border-[#16a34a] shadow-md" : "border-transparent opacity-60 hover:opacity-90"}`}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_280px] gap-8">

          {/* Left */}
          <div>
            {/* mobile stats */}
            <div className="sm:hidden grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Users, label: "Penduduk", val: dusun.penduduk.toLocaleString("id-ID") + " jiwa" },
                { icon: Home,  label: "RT",       val: dusun.rt + " RT · " + dusun.rw },
                { icon: Leaf,  label: "Luas",     val: dusun.luas },
              ].map(s => (
                <div key={s.label} className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-3 text-center">
                  <s.icon size={16} className="text-[#16a34a] mx-auto mb-1" />
                  <div className="font-bold text-[#052e16] text-xs leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>{s.val}</div>
                  <div className="text-[#4b7a55] text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#052e16] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                Tentang Dusun {dusun.name}
              </h2>
              <p className="text-[#4b7a55] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                {dusun.detail}
              </p>
            </div>

            {/* Keunggulan */}
            <div className="mb-6">
              <h3 className="text-base font-bold text-[#052e16] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                Keunggulan & Daya Tarik
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {dusun.keunggulan.map((k) => (
                  <div key={k} className="bg-white border border-[#bbf7d0] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-green-300 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-[#dcfce7] flex items-center justify-center mb-3">
                      <Star size={14} className="text-[#16a34a]" />
                    </div>
                    <p className="text-[#052e16] text-sm font-medium leading-snug" style={{ fontFamily: "Inter, sans-serif" }}>{k}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-base font-bold text-[#052e16] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Lokasi</h3>
              <div className="rounded-2xl overflow-hidden border border-[#bbf7d0] h-48 shadow-sm">
                <iframe
                  title={`Peta Dusun ${dusun.name}`}
                  src={`https://maps.google.com/maps?q=Dusun+${dusun.name},+Desa+Getas,+Singorojo,+Kendal&output=embed&z=14`}
                  className="w-full h-full border-0"
                  allowFullScreen loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4 lg:sticky lg:top-4 self-start">
            {/* info card */}
            <div className="bg-white rounded-2xl border border-[#bbf7d0] p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-widest text-[#4b7a55] mb-4">Info Dusun</div>
              {[
                { label: "Nama Dusun",   val: dusun.name },
                { label: "Wilayah RW",  val: dusun.rw },
                { label: "Jumlah RT",   val: dusun.rt + " RT" },
                { label: "Penduduk",    val: dusun.penduduk.toLocaleString("id-ID") + " jiwa" },
                { label: "Luas",        val: dusun.luas },
                { label: "Desa",        val: "Getas, Singorojo" },
                { label: "Kabupaten",   val: "Kendal, Jawa Tengah" },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2 border-b border-[#f0fdf4] last:border-0 text-sm gap-3">
                  <span className="text-[#4b7a55]" style={{ fontFamily: "Inter, sans-serif" }}>{r.label}</span>
                  <span className="text-[#052e16] font-medium text-right" style={{ fontFamily: "Poppins, sans-serif" }}>{r.val}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button onClick={onClose}
              className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-200"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              <ChevronLeft size={16} /> Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── tour packages ────────────────────────────────────────────────────────────

const PACKAGES = [
  {
    name: "Tubing Adventure", duration: "±2 jam", price: "Rp 75.000", priceNum: 75000,
    badge: "Terpopuler", minPerson: 1, maxPerson: 10, perPerson: true,
    img: "https://images.unsplash.com/photo-1546058914-5000137323f0?w=500&h=320&fit=crop&auto=format",
    desc: "Menyusuri Sungai Blukar sepanjang 1,5 km dengan arus alami.",
    includes: ["Pelampung & helm", "Pemandu lokal", "Air minum"],
  },
  {
    name: "River Exploration", duration: "±3 jam", price: "Rp 95.000", priceNum: 95000,
    badge: "", minPerson: 1, maxPerson: 8, perPerson: true,
    img: "https://images.unsplash.com/photo-1561774711-b0fa364863b7?w=500&h=320&fit=crop&auto=format",
    desc: "Eksplorasi sungai bersama guide berpengalaman dan safety equipment lengkap.",
    includes: ["Full safety gear", "Pemandu senior", "Foto dokumentasi", "Air minum"],
  },
  {
    name: "Family Package", duration: "½ hari", price: "Rp 250.000", priceNum: 250000,
    badge: "Promo", minPerson: 2, maxPerson: 6, perPerson: false,
    img: "https://images.unsplash.com/photo-1520329612326-d6038d1395a1?w=500&h=320&fit=crop&auto=format",
    desc: "Paket keluarga lengkap — tubing, makan siang, foto dokumentasi.",
    includes: ["Full safety gear", "Pemandu keluarga", "Makan siang", "Foto & video", "Suvenir"],
  },
  {
    name: "Group Package", duration: "½ hari", price: "Rp 65.000", priceNum: 65000,
    badge: "", minPerson: 20, maxPerson: 100, perPerson: true,
    img: "https://images.unsplash.com/photo-1643215721864-cd4c354ac298?w=500&h=320&fit=crop&auto=format",
    desc: "Paket rombongan minimal 20 orang dengan guide dan makan siang.",
    includes: ["Safety equipment", "Multiple guide", "Makan siang", "Area gathering"],
  },
];

function TourPackages({ onBook }: { onBook: (pkg: typeof PACKAGES[0]) => void }) {
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
            <button onClick={() => onBook(PACKAGES[0])}
              className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition shadow-md shadow-green-200"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              <Ticket size={16} /> Pesan Sekarang
            </button>
          </div>

          {/* Right cards — 2×2 grid showing all 4 packages */}
          <div className="grid sm:grid-cols-2 gap-4">
            {PACKAGES.map(p => (
              <div key={p.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#bbf7d0] group hover:shadow-lg hover:border-green-300 transition-all cursor-pointer"
                onClick={() => onBook(p)}>
                <div className="relative h-40 bg-[#bbf7d0] overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {p.badge && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16a34a] text-white shadow">
                      {p.badge}
                    </span>
                  )}
                  <div className="absolute bottom-2 left-3">
                    <span className="text-white font-bold text-sm drop-shadow" style={{ fontFamily: "Poppins, sans-serif" }}>{p.name}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[#4b7a55] text-xs mb-3 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{p.desc}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[#16a34a] font-bold text-sm">{p.price}</span>
                      <span className="text-[#4b7a55] text-[10px] ml-1">{p.perPerson ? "/orang" : "/grup"} · {p.duration}</span>
                    </div>
                    <span className="text-[10px] text-[#4b7a55] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-full">
                      {p.minPerson === p.maxPerson ? `Min. ${p.minPerson}` : `${p.minPerson}–${p.maxPerson} org`}
                    </span>
                  </div>
                  <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                    style={{ fontFamily: "Poppins, sans-serif" }}>
                    <Ticket size={12} /> Pesan Paket Ini
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── UMKM ─────────────────────────────────────────────────────────────────────

const CATS = ["Semua", "Makanan", "Kerajinan", "Pertanian", "Oleh-Oleh"];
const PRODUCTS = [
  { name: "Tempe Besem Bu Kartini", cat: "Makanan", price: "Rp 5.000", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format", wa: "62812345001" },
  { name: "Keripik Singkong Aneka Rasa", cat: "Makanan", price: "Rp 15.000", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop&auto=format", wa: "62812345002" },
  { name: "Anyaman Bambu Pak Rejo", cat: "Kerajinan", price: "Rp 45.000+", img: "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&h=300&fit=crop&auto=format", wa: "62812345003" },
  { name: "Beras Organik Pak Triyono", cat: "Pertanian", price: "Rp 18.000/kg", img: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=300&fit=crop&auto=format", wa: "62812345005" },
  { name: "Kopi Arabika Getas", cat: "Oleh-Oleh", price: "Rp 65.000/200g", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&auto=format", wa: "62812345007" },
  { name: "Sirup Jahe Madu Bu Endang", cat: "Oleh-Oleh", price: "Rp 30.000", img: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=300&fit=crop&auto=format", wa: "62812345008" },
];

function UMKMSection() {
  const [cat, setCat] = useState("Semua");
  const filtered = PRODUCTS.filter(p => cat === "Semua" || p.cat === cat);

  return (
    <section id="umkm" className="py-16 px-4 sm:px-8 bg-[#f0fdf4]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green-600" style={{ fontFamily: "Inter, sans-serif" }}>Marketplace Desa</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1f0f] mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>UMKM Desa Getas</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${cat === c ? "bg-[#052e16] text-white" : "bg-white border border-[#bbf7d0] text-[#166534] hover:border-[#16a34a]"}`}
                style={{ fontFamily: "Inter, sans-serif" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => (
            <div key={p.name} className="bg-white rounded-2xl overflow-hidden border border-[#bbf7d0] shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="h-44 overflow-hidden bg-[#bbf7d0]">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <div className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mb-2 ${p.cat === "Pertanian" ? "bg-green-50 text-green-700" : "bg-[#dcfce7] text-[#16a34a]"}`}>
                  {p.cat === "Pertanian" && <Leaf size={8} className="inline mr-1" />}{p.cat}
                </div>
                <h4 className="font-bold text-[#0a1f0f] text-sm mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{p.name}</h4>
                <div className="text-[#16a34a] font-bold text-sm mb-3">{p.price}</div>
                <a href={`https://wa.me/${p.wa}?text=Halo, saya tertarik dengan produk ${encodeURIComponent(p.name)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5">
                  <MessageSquare size={12} /> Hubungi WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── kebudayaan ───────────────────────────────────────────────────────────────

const BUDAYA_ITEMS = [
  {
    judul: "Kuda Lumping",
    cat: "Seni Pertunjukan",
    desc: "Tarian tradisional kuda lumping yang digelar setiap peringatan hari besar dan acara adat desa.",
    img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=700&h=460&fit=crop&auto=format",
    span: "col-span-2 row-span-2",
  },
  {
    judul: "Batik Tulis Getas",
    cat: "Kerajinan Tradisional",
    desc: "Batik tulis tangan bermotif sungai dan alam, warisan leluhur yang terus dilestarikan.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format",
    span: "",
  },
  {
    judul: "Anyaman Bambu",
    cat: "Kerajinan Tradisional",
    desc: "Kerajinan anyaman bambu turun-temurun yang menjadi sumber penghidupan warga Dusun Genting.",
    img: "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&h=300&fit=crop&auto=format",
    span: "",
  },
  {
    judul: "Pesta Panen & Sedekah Bumi",
    cat: "Upacara Adat",
    desc: "Tradisi syukur atas hasil bumi yang digelar setiap tahun dengan arak-arakan dan doa bersama.",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop&auto=format",
    span: "",
  },
  {
    judul: "Sanggar Tari Tradisional",
    cat: "Seni Pertunjukan",
    desc: "Sanggar aktif melatih generasi muda dalam tari-tarian Jawa, rebana, dan seni wayang.",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&auto=format",
    span: "",
  },
  {
    judul: "Perkebun & Agraris",
    cat: "Kearifan Lokal",
    desc: "Sistem pertanian organik berbasis kearifan lokal yang diwariskan secara turun-temurun.",
    img: "https://images.unsplash.com/photo-1683506684881-efbb5203eacf?w=400&h=300&fit=crop&auto=format",
    span: "",
  },
];

function KebudayaanSection() {
  const [lb, setLb] = useState<{ img: string; judul: string; desc: string; cat: string } | null>(null);

  return (
    <section id="budaya" className="py-16 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#16a34a]" style={{ fontFamily: "Inter, sans-serif" }}>Seni & Budaya</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1f0f] mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>Kebudayaan Desa Getas</h2>
          </div>
          <p className="text-[#4b7a55] text-sm max-w-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Warisan seni, tradisi, dan kearifan lokal yang terus hidup di tengah masyarakat.
          </p>
        </div>

        {/* masonry grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[360px] sm:h-[460px]">
          {BUDAYA_ITEMS.map((item, i) => (
            <div key={i} onClick={() => setLb(item)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group bg-[#dcfce7] ${item.span}`}>
              <img src={item.img} alt={item.judul}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              {/* always-visible category pill */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#16a34a] text-[10px] font-bold shadow">
                  {item.cat}
                </span>
              </div>
              {/* hover reveal */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="font-bold text-white text-sm leading-tight drop-shadow mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}>{item.judul}</div>
                {item.span && (
                  <p className="text-white/80 text-xs leading-relaxed line-clamp-2"
                    style={{ fontFamily: "Inter, sans-serif" }}>{item.desc}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* cards below grid */}
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: "🥁", title: "Kuda Lumping", jadwal: "Setiap bulan Suro & hari nasional" },
            { icon: "🎨", title: "Workshop Batik Tulis", jadwal: "Sabtu–Minggu, 08.00–12.00 WIB" },
            { icon: "🎭", title: "Pentas Seni Malam Jumat", jadwal: "Setiap Jumat malam di Dusun Sanggar" },
          ].map(c => (
            <div key={c.title} className="flex items-center gap-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 hover:border-[#16a34a]/40 hover:shadow-md transition-all">
              <div className="text-3xl flex-shrink-0">{c.icon}</div>
              <div>
                <div className="font-bold text-[#052e16] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{c.title}</div>
                <div className="text-[#4b7a55] text-xs mt-0.5 flex items-center gap-1" style={{ fontFamily: "Inter, sans-serif" }}>
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
            <div className="relative h-64 bg-[#dcfce7]">
              <img src={lb.img} alt={lb.judul} className="w-full h-full object-cover" />
              <button onClick={() => setLb(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-[#052e16] hover:bg-white transition shadow">
                <X size={16} />
              </button>
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#16a34a] text-white text-xs font-bold">
                {lb.cat}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#052e16] text-lg mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                {lb.judul}
              </h3>
              <p className="text-[#4b7a55] text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                {lb.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── App Component ────────────────────────────────────────────────────────────

export default function App() {
  const [selectedDusun, setSelectedDusun] = useState<DusunData | null>(null);
  const [bookingPkg, setBookingPkg] = useState<typeof PACKAGES[0] | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-200">
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
      
      {selectedDusun ? (
        <DusunPage dusun={selectedDusun} onClose={() => setSelectedDusun(null)} />
      ) : (
        <main>
          <Hero onSelectDusun={setSelectedDusun} />
          <TourPackages onBook={(pkg) => setBookingPkg(pkg)} />
          <UMKMSection />
          <KebudayaanSection />
        </main>
      )}

      {/* Booking Modal Dummy */}
      {(isBookingOpen || bookingPkg) && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative">
            <button onClick={() => { setIsBookingOpen(false); setBookingPkg(null); }} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition">
              <X size={16} />
            </button>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#052e16] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Form Pemesanan
            </h3>
            <p className="text-[#4b7a55] text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Silakan hubungi admin via WhatsApp untuk memproses pesanan {bookingPkg ? <strong className="text-green-700">{bookingPkg.name}</strong> : "paket wisata"}.
            </p>
            <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20pesan%20paket%20wisata"
               target="_blank" rel="noopener noreferrer"
               className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition"
               style={{ fontFamily: "Poppins, sans-serif" }}>
              <MessageSquare size={16} />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#052e16] text-white pt-16 pb-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-2xl tracking-wide" style={{ fontFamily: "Poppins, sans-serif" }}>
                DESA<span className="text-[#16a34a]">GETAS</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Desa Wisata unggulan di Kabupaten Kendal dengan keindahan alam, budaya yang kaya, dan kearifan lokal yang terjaga.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-5 text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>Kontak Kami</h4>
            <ul className="text-white/70 text-sm space-y-3" style={{ fontFamily: "Inter, sans-serif" }}>
              <li className="flex items-center gap-3"><Phone size={16} className="text-green-500" /> +62 812-3456-7890</li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-green-500" /> kontak@desagetas.id</li>
              <li className="flex items-center gap-3"><MapPin size={16} className="text-green-500" /> Kec. Singorojo, Kab. Kendal</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-5 text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>Jelajahi</h4>
            <ul className="text-white/70 text-sm space-y-3" style={{ fontFamily: "Inter, sans-serif" }}>
              <li><button onClick={() => scrollTo("#hero")} className="hover:text-white hover:translate-x-1 transition flex items-center gap-2"><ArrowRight size={14} className="text-green-500" /> Beranda</button></li>
              <li><button onClick={() => scrollTo("#paket")} className="hover:text-white hover:translate-x-1 transition flex items-center gap-2"><ArrowRight size={14} className="text-green-500" /> Paket Wisata</button></li>
              <li><button onClick={() => scrollTo("#umkm")} className="hover:text-white hover:translate-x-1 transition flex items-center gap-2"><ArrowRight size={14} className="text-green-500" /> UMKM Desa</button></li>
              <li><button onClick={() => scrollTo("#budaya")} className="hover:text-white hover:translate-x-1 transition flex items-center gap-2"><ArrowRight size={14} className="text-green-500" /> Seni Budaya</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-5 text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>Sosial Media</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-xs font-bold">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-xs font-bold">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition text-white text-xs font-bold">
                YT
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            &copy; {new Date().getFullYear()} Pemerintah Desa Getas. Hak Cipta Dilindungi.
          </p>
          <p className="text-white/50 text-xs flex items-center gap-1" style={{ fontFamily: "Inter, sans-serif" }}>
            Dibuat dengan <Heart size={12} className="text-red-500" /> di Kendal, Jawa Tengah
          </p>
        </div>
      </footer>
    </div>
  );
}