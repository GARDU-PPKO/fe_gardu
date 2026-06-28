import { CheckCircle, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PACKAGES } from "../../data/mockData";

export default function TourPackages() {
  const navigate = useNavigate();

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
            {PACKAGES.map(p => (
              <div key={p.name} className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 cursor-pointer flex flex-col h-full group ${p.badge === "Terpopuler" ? "border-2 border-green-500 shadow-md shadow-green-100/50 hover:shadow-xl hover:border-green-500 scale-[1.01]" : "border border-[#bbf7d0] hover:shadow-lg hover:border-green-300"}`}
                onClick={() => navigate('/booking/package')}>
                <div className="relative h-40 bg-[#bbf7d0] overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {p.badge && (
                    <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow ${p.badge === "Terpopuler" ? "bg-amber-500 text-white" : "bg-[#16a34a] text-white"}`}>
                      {p.badge}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white font-black text-base drop-shadow" style={{ fontFamily: "Poppins, sans-serif" }}>{p.name}</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[#4b7a55] text-xs mb-3 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{p.desc}</p>

                  {/* Included items checklist */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4 mt-1 border-t border-dashed border-[#bbf7d0]/40 pt-3">
                    {p.includes.slice(0, 3).map(inc => (
                      <div key={inc} className="flex items-center gap-1 text-[9px] text-[#4b7a55]" style={{ fontFamily: "Inter, sans-serif" }}>
                        <div className="w-1 h-1 rounded-full bg-green-500" />
                        {inc}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3.5">
                      <div>
                        <div className="text-[#16a34a] font-black text-lg sm:text-xl leading-none">{p.price}</div>
                        <div className="text-[#4b7a55] text-[9px] mt-1">{p.perPerson ? "per orang" : "per grup"} · {p.duration}</div>
                      </div>
                      <span className="text-[9px] font-semibold text-[#4b7a55] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-0.5 rounded-full">
                        {p.minPerson === p.maxPerson ? `Min. ${p.minPerson}` : `${p.minPerson}–${p.maxPerson} org`}
                      </span>
                    </div>
                    <button className="w-full py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-full transition duration-300 flex items-center justify-center gap-1.5 group/btn active:scale-95"
                      style={{ fontFamily: "Poppins, sans-serif" }}>
                      <Ticket size={12} className="group-hover/btn:rotate-12 transition-transform" /> 
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
