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
          ? 'border-2 border-[#16a34a] shadow-lg shadow-green-100/50 scale-[1.02] ring-4 ring-green-50'
          : 'border border-gray-200 hover:shadow-xl hover:border-green-400 hover:-translate-y-1'
        }`}
    >
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        {pkg.image ? (
          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-green-300 to-green-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {pkg.tag && pkg.tag.toLowerCase() !== "promo" && (
          <span className={`absolute top-4 left-4 text-xs font-extrabold px-3 py-1 rounded-full shadow-md ${
            pkg.tag.toLowerCase() === "terpopuler" ? "bg-amber-500 text-white" : 
            "bg-[#16a34a] text-white"
          }`}>
            {pkg.tag}
          </span>
        )}

        {isSelected && (
          <div className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md text-[#16a34a] transition-transform animate-in zoom-in duration-300">
            <CheckCircle2 size={28} className="fill-[#16a34a] text-white" />
          </div>
        )}

        <div className="absolute bottom-4 left-4 pr-4">
          <span className="text-white font-black text-2xl drop-shadow-lg leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            {pkg.name}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2 min-h-[40px]" style={{ fontFamily: "Inter, sans-serif" }}>
          {pkg.description}
        </p>

        {pkg.includes && pkg.includes.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 mt-1 border-t border-dashed border-gray-200 pt-4">
            {pkg.includes.slice(0, 3).map((inc, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {inc}
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#16a34a] font-black text-2xl sm:text-3xl leading-none" style={{ fontFamily: "Poppins, sans-serif" }}>
                Rp {pkg.price.toLocaleString('id-ID')}
              </div>
              <div className="text-gray-500 text-xs mt-2 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                {pkg.unit === 'orang' ? "per orang" : "per grup"} {pkg.duration ? `· ${pkg.duration}` : ''}
              </div>
            </div>
            {(pkg.minParticipants || pkg.maxParticipants) && (
              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full whitespace-nowrap">
                {pkg.minParticipants === pkg.maxParticipants
                  ? `Min. ${pkg.minParticipants}`
                  : `${pkg.minParticipants}–${pkg.maxParticipants} org`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
