import { useState, useEffect } from "react";
import { MessageSquare, Leaf } from "lucide-react";
import { getUmkmProducts } from "../../services/umkm.service";
import type { UmkmProduct } from "../../types";

const CATEGORIES = ["Semua", "Makanan", "Kerajinan", "Pertanian", "Oleh-Oleh"];

const CAT_ICONS: Record<string, string> = {
  "Semua": "🛍️",
  "Makanan": "☕",
  "Kerajinan": "🎨",
  "Pertanian": "🌾",
  "Oleh-Oleh": "🎁"
};

export default function UMKMSection() {
  const [cat, setCat] = useState("Semua");
  const [products, setProducts] = useState<UmkmProduct[]>([]);

  useEffect(() => {
    getUmkmProducts().then(res => setProducts(res.data));
  }, []);

  const filtered = cat === "Semua" ? products : products.filter(p => p.kategori === cat);

  return (
    <section id="umkm" className="py-16 px-4 sm:px-8 bg-[#f0fdf4]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green-600" style={{ fontFamily: "Inter, sans-serif" }}>Marketplace Desa</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1f0f] mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>UMKM Desa Getas</h2>
          </div>
          
          {/* Scrollable category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap scrollbar-none">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex-shrink-0 ${cat === c ? "bg-[#052e16] text-white scale-95" : "bg-white border border-[#bbf7d0] text-[#166534] hover:border-[#16a34a] active:scale-95"}`}
                style={{ fontFamily: "Inter, sans-serif" }}>
                <span>{CAT_ICONS[c] || "🏷️"}</span>
                <span>{c}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => {
            const priceStr = `Rp ${Number(p.harga).toLocaleString('id-ID')}`;
            const waMessage = encodeURIComponent(`Halo Admin, saya tertarik untuk membeli produk "${p.nama}" seharga ${priceStr} yang saya lihat di website Desa Wisata Getas.`);
            return (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-[#bbf7d0]/60 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300 group cursor-pointer flex flex-col justify-between">
                <div className="relative h-44 overflow-hidden bg-[#bbf7d0]">
                  <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-3 right-3 px-3.5 py-1 rounded-full bg-[#052e16] text-white text-xs font-black shadow-md z-10" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {priceStr}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-3 ${p.kategori === "Pertanian" ? "bg-green-50 text-green-700" : "bg-[#dcfce7] text-[#16a34a]"}`}>
                      {p.kategori === "Pertanian" && <Leaf size={9} />}{p.kategori}
                    </div>
                    <h4 className="font-bold text-[#0a1f0f] text-sm mb-4 line-clamp-2" style={{ fontFamily: "Poppins, sans-serif" }}>{p.nama}</h4>
                  </div>
                  
                  <a href={`https://wa.me/${p.no_wa_penjual}?text=${waMessage}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-full transition flex items-center justify-center gap-1.5 group/btn active:scale-95 shadow-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}>
                    <MessageSquare size={12} className="group-hover/btn:scale-110 transition-transform" /> 
                    Beli via WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}