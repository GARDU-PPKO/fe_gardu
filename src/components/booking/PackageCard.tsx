import React from 'react';
import type { Package } from '../../types/booking';
import { CheckCircle } from "lucide-react";

interface PackageCardProps {
  pkg: Package;
  isSelected: boolean;
  onSelect: (pkg: Package) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, isSelected, onSelect }) => {
  return (
    <button 
      type="button"
      onClick={() => onSelect(pkg)}
      className={`relative rounded-2xl overflow-hidden border-2 text-left transition-all group w-full ${
        isSelected
          ? "border-[#182cc1] shadow-lg shadow-[#e8edff]"
          : "border-[#c5d0ff] hover:border-[#abd2fa]"
      }`}
    >
      <div className="relative h-28 bg-[#e8edff] overflow-hidden">
        {pkg.image && (
          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {pkg.tag && (
          <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#182cc1] text-white">
            {pkg.tag}
          </span>
        )}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
            <CheckCircle size={14} className="text-[#182cc1]" />
          </div>
        )}
      </div>
      <div className={`p-3 ${isSelected ? "bg-[#eef2ff]" : "bg-white"}`}>
        <div className="font-bold text-[#091540] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{pkg.name}</div>
        <div className="text-[#3d518c] text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{pkg.description}</div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#1d2e80] font-bold text-sm">Rp {pkg.price.toLocaleString('id-ID')}</span>
          <span className="text-[10px] text-[#3d518c]">/{pkg.unit === 'orang' ? "orang" : "grup"}</span>
        </div>
      </div>
    </button>
  );
};

export default PackageCard;



