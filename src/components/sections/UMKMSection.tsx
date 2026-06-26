import { useState } from "react";
import { MessageSquare, Leaf } from "lucide-react";
import { CATS, PRODUCTS } from "../../data/mockData";




export default function UMKMSection() {
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