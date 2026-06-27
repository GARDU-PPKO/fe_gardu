import { Users, Home, Briefcase, Mountain, TreePine } from "lucide-react";

export default function StatistikSection() {
  const stats = [
    { icon: Users, value: "4.287", unit: "jiwa", label: "Total Penduduk" },
    { icon: Home, value: "1.156", unit: "KK", label: "Jumlah KK" },
    { icon: Briefcase, value: "62", unit: "unit", label: "UMKM Aktif" },
    { icon: Mountain, value: "8.500+", unit: "", label: "Wisatawan/Tahun" },
    { icon: TreePine, value: "12,4", unit: "km²", label: "Luas Wilayah" },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 bg-[#052e16]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-green-400 mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>Data Desa</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Statistik Desa Getas</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#124225] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
              <div className="w-12 h-12 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center mb-4">
                <stat.icon size={20} className="text-green-400" />
              </div>
              <div className="font-bold text-white text-xl sm:text-2xl mb-1 flex items-baseline gap-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                {stat.value}
                {stat.unit && <span className="text-green-400 text-xs sm:text-sm font-semibold">{stat.unit}</span>}
              </div>
              <div className="text-white/70 text-xs sm:text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
