import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { getUmkmProducts } from "../../services/umkm.service";
import type { UmkmProduct } from "../../types";

const CATS = ["Semua", "Makanan", "Kerajinan", "Pertanian", "Oleh-Oleh"];

const FALLBACK_PRODUCTS: UmkmProduct[] = [
  { id: 1, nama: "Tempe Besem Bu Kartini", kategori: "Makanan", harga: 5000, deskripsi: "Tempe besem tradisional khas Getas", gambar: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format", no_wa_penjual: "62812345001", is_active: true },
  { id: 2, nama: "Keripik Singkong Aneka Rasa", kategori: "Makanan", harga: 15000, deskripsi: "Keripik singkong renyah gurih", gambar: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop&auto=format", no_wa_penjual: "62812345002", is_active: true },
  { id: 3, nama: "Anyaman Bambu Pak Rejo", kategori: "Kerajinan", harga: 45000, deskripsi: "Kerajinan bambu berkualitas tinggi", gambar: "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&h=300&fit=crop&auto=format", no_wa_penjual: "62812345003", is_active: true },
  { id: 4, nama: "Beras Organik Pak Triyono", kategori: "Pertanian", harga: 18000, deskripsi: "Beras organik sehat tanpa pestisida", gambar: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=300&fit=crop&auto=format", no_wa_penjual: "62812345005", is_active: true },
  { id: 5, nama: "Kopi Arabika Getas", kategori: "Oleh-Oleh", harga: 65000, deskripsi: "Kopi asli buatan petani lokal Getas (200g)", gambar: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&auto=format", no_wa_penjual: "62812345007", is_active: true },
  { id: 6, nama: "Sirup Jahe Madu Bu Endang", kategori: "Oleh-Oleh", harga: 30000, deskripsi: "Minuman herbal hangat penambah imunitas", gambar: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=300&fit=crop&auto=format", no_wa_penjual: "62812345008", is_active: true },
];

export default function UMKMSection() {
  const [cat, setCat] = useState("Semua");
  const [products, setProducts] = useState<UmkmProduct[]>(FALLBACK_PRODUCTS);

  useEffect(() => {
    getUmkmProducts()
      .then(res => {
        if (res?.data && res.data.length > 0) {
          setProducts(res.data);
        }
      })
      .catch(() => {
        // Gunakan data fallback
      });
  }, []);

  const filtered = products.filter(p => cat === "Semua" || p.kategori === cat);

  return (
    <section id="umkm" className="py-16 px-4 sm:px-8 bg-[#eef2ff]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#182cc1]" style={{ fontFamily: "Inter, sans-serif" }}>Marketplace Desa</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#091540] mt-1" style={{ fontFamily: "Poppins, sans-serif" }}>UMKM Desa Getas</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${cat === c ? "bg-[#8b5a2b] text-white" : "bg-[#fef3e7] border border-[#e8c99a] text-[#8b5a2b] hover:bg-[#f5dfc0]"}`}
                style={{ fontFamily: "Inter, sans-serif" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => (
            <a 
              key={p.id} 
              href={`https://wa.me/${p.no_wa_penjual}?text=Halo, saya tertarik dengan produk ${encodeURIComponent(p.nama)}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-2xl overflow-hidden border border-[#c5d0ff] shadow-sm hover:shadow-lg hover:border-[#25D366] transition-all group cursor-pointer flex flex-col relative"
            >
              <div className="h-44 overflow-hidden bg-[#c5d0ff] relative">
                <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                  <div className="text-[#182cc1] font-black text-sm">{`Rp ${Number(p.harga).toLocaleString('id-ID')}`}</div>
                  <div className="w-8 h-8 rounded-full bg-[#e8edff] flex items-center justify-center text-[#182cc1] group-hover:bg-[#25D366] group-hover:text-white transition-colors shadow-sm">
                    <MessageSquare size={14} className="group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}