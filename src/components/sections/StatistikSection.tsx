import { useEffect, useState } from "react";
import { Users, Home, Briefcase, Mountain, TreePine } from "lucide-react";
import { getVillageStats } from "../../services/village.service";
import type { VillageStat } from "../../types";

const ICON_MAP: Record<string, typeof Users> = {
  users: Users, home: Home, briefcase: Briefcase, mountain: Mountain, treepine: TreePine,
};

export default function StatistikSection() {
  const [stats, setStats] = useState<VillageStat[]>([]);

  useEffect(() => {
    getVillageStats().then(res => setStats(res.data));
  }, []);

  if (stats.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-8 bg-white border-t border-[#bbf7d0]/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2 block" style={{ fontFamily: "Inter, sans-serif" }}>Data Desa</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#052e16]" style={{ fontFamily: "Poppins, sans-serif" }}>Statistik Desa Getas</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => {
            const Icon = (stat.icon && ICON_MAP[stat.icon.toLowerCase()]) || Users;
            return (
              <div key={stat.id} className="bg-green-50/20 border border-[#bbf7d0]/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-green-400/50 transition-all duration-300 hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-full bg-green-100/50 flex items-center justify-center mb-4 text-[#16a34a]">
                  <Icon size={20} />
                </div>
                <div className="font-bold text-[#052e16] text-xl sm:text-2xl mb-1 flex items-baseline gap-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {stat.nilai}
                  {stat.satuan && <span className="text-green-600 text-xs sm:text-sm font-semibold">{stat.satuan}</span>}
                </div>
                <div className="text-[#4b7a55] text-xs sm:text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
