import { CheckCircle, Ticket } from "lucide-react";
import { PACKAGES } from "../../data/mockData";




export default function TourPackages({ onBook }: { onBook: (pkg: typeof PACKAGES[0]) => void }) {
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