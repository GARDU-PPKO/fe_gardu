import React from 'react';
import type { Package } from '../../types/booking';
import { CheckCircle2 } from "lucide-react";

interface PackageCardProps {
  pkg: Package;
  isSelected: boolean;
  onSelect: (pkg: Package) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(pkg)}
      className={`bg-white rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full group ${isSelected
          ? 'border-2 border-[#182CC1] shadow-xl shadow-[#182CC1]/15 scale-[1.02] ring-4 ring-blue-50'
          : 'border border-gray-200/80 hover:shadow-xl hover:border-[#182CC1]/50 hover:-translate-y-1'
        }`}
    >
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {pkg.image ? (
          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-blue-400 to-blue-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {pkg.tag && (
          <span className={`absolute top-4 left-4 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md ${
            pkg.tag.toLowerCase() === "terpopuler" ? "bg-[#182CC1] text-white" : 
            pkg.tag.toLowerCase() === "promo" ? "bg-[#0E1B85] text-white" :
            "bg-[#182CC1] text-white"
          }`} style={{ fontFamily: "Poppins, sans-serif" }}>
            {pkg.tag}
          </span>
        )}

        {isSelected && (
          <div className="absolute top-4 right-4 bg-white rounded-full p-0.5 shadow-md text-[#182CC1] transition-transform animate-in zoom-in duration-300">
            <CheckCircle2 size={26} className="fill-[#182CC1] text-white" />
          </div>
        )}

        <div className="absolute bottom-3.5 left-4 pr-4">
          <span className="text-white font-black text-xl sm:text-2xl drop-shadow-md leading-tight block" style={{ fontFamily: "Poppins, sans-serif" }}>
            {pkg.name}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed font-normal min-h-[40px]" style={{ fontFamily: "Inter, sans-serif" }}>
          {pkg.description}
        </p>

        {pkg.includes && pkg.includes.length > 0 && (
          <div className="flex flex-wrap gap-x-3.5 gap-y-2 mb-5 mt-1 border-t border-dashed border-gray-200/80 pt-3.5">
            {pkg.includes.slice(0, 3).map((inc, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#182CC1]" />
                {inc}
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-2">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[#182CC1] font-black text-xl sm:text-2xl leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>
                Rp {pkg.price.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="text-gray-400 text-xs font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
              /{pkg.unit === 'orang' ? "orang" : "grup"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;

