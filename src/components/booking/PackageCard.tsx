import React from 'react';
import type { Package } from '../../types/booking';

interface PackageCardProps {
  pkg: Package;
  isSelected: boolean;
  onSelect: (pkg: Package) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(pkg)}
      className={`relative rounded-xl border-2 cursor-pointer overflow-hidden transition-all duration-200 bg-white ${
        isSelected
          ? 'border-primary shadow-md shadow-primary/20'
          : 'border-transparent shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top Gradient Background */}
      <div className="h-28 bg-gradient-to-b from-green-200/80 to-gray-300/40 relative">
        {pkg.tag && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {pkg.tag}
          </span>
        )}
        
        {isSelected && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-0.5 shadow-sm">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-gray-800 text-lg leading-tight">{pkg.name}</h3>
        <p className="text-gray-500 text-sm leading-snug line-clamp-2 min-h-[40px]">
          {pkg.description}
        </p>
        
        <div className="flex items-end justify-between pt-2">
          <span className="font-bold text-primary text-lg">
            Rp {pkg.price.toLocaleString('id-ID')}
          </span>
          <span className="text-gray-400 text-xs font-medium">
            /{pkg.unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
