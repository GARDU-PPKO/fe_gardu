import { useState, useEffect } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { getUmkmProducts } from "../../services/umkm.service";
import { resolveImageUrl } from "../../utils/image";
import type { UmkmProduct } from "../../types";

export default function UMKMSection() {
  const [cat, setCat] = useState("Semua");
  const [products, setProducts] = useState<UmkmProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getUmkmProducts()
      .then(res => {
        if (cancelled) return;
        setProducts(res?.data ?? []);
        setHasError(false);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const categories = ["Semua", ...Array.from(new Set(products.map(p => p.kategori).filter(Boolean))) as string[]];
  const filtered = products.filter(p => cat === "Semua" || p.kategori?.toLowerCase() === cat.toLowerCase());

  return (
    <section id="umkm" className="py-16 px-4 sm:px-8 bg-[#eef2ff]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#182cc1]" style={{ fontFamily: "Inter, sans-serif" }}>Marketplace Desa</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#091540] mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>UMKM Desa Getas</h2>
          </div>
          {/* Filter Pills — Symmetrical & Responsive */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border ${
                  cat === c
                    ? "bg-[#182cc1] text-white border-[#182cc1] shadow-md shadow-[#182cc1]/20"
                    : "bg-white text-[#3d518c] border-[#c5d0ff] hover:border-[#182cc1] hover:bg-[#e8edff]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>


        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 text-[#3d518c]" style={{ fontFamily: "Inter, sans-serif" }}>
              <Loader2 className="w-8 h-8 animate-spin text-[#182cc1]" />
              <span className="text-sm font-medium">Memuat produk UMKM...</span>
            </div>
          ) : hasError ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 text-center">
              <p className="text-[#3d518c] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Gagal memuat produk UMKM.</p>
              <button onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#182cc1] hover:bg-[#1524a3] text-white text-sm font-bold rounded-full transition"
                style={{ fontFamily: "Poppins, sans-serif" }}>
                Coba Lagi
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-[#3d518c] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Belum ada produk UMKM tersedia.</p>
            </div>
          ) : filtered.map(p => {
            const cleanWa = (p.no_wa_penjual || '').replace(/\D/g, '').replace(/^0/, '62');
            return (
            <a 
              key={p.id} 
              href={`https://wa.me/${cleanWa}?text=Halo, saya tertarik dengan produk ${encodeURIComponent(p.nama)}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-2xl overflow-hidden border border-[#c5d0ff] shadow-sm hover:shadow-lg hover:border-[#25D366] transition-all group cursor-pointer flex flex-col relative"
            >
              <div className="h-44 overflow-hidden bg-[#c5d0ff] relative">
                <img src={resolveImageUrl(p.gambar)} alt={p.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div>
                  <div className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mb-2 bg-[#fef3e7] text-[#8b5a2b]">
                    {p.kategori}
                  </div>
                  <h4 className="font-bold text-[#091540] text-sm mb-1 line-clamp-1" style={{ fontFamily: "Poppins, sans-serif" }}>{p.nama}</h4>
                  <p className="text-[#3d518c] text-xs mb-3 line-clamp-2" style={{ fontFamily: "Inter, sans-serif" }}>{p.deskripsi}</p>
                </div>
                
                <div className="flex items-end justify-between mt-auto pt-2">
                  <div>
                    <span className="block text-[10px] font-semibold text-[#3d518c]/80 uppercase tracking-wider">Mulai dari</span>
                    <div className="text-[#182cc1] font-black text-sm sm:text-base leading-tight">
                      {`Rp ${Number(p.harga).toLocaleString('id-ID')}`}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#e8edff] flex items-center justify-center text-[#182cc1] group-hover:bg-[#25D366] group-hover:text-white transition-colors shadow-sm shrink-0">
                    <MessageSquare size={14} className="group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
        </div>
      </div>
    </section>
  );
}