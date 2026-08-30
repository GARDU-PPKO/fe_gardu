import type { Package, PackageTier } from '../types/booking';
import type { TourPackage } from '../types';

export interface PriceCalculationResult {
  unitPrice: number;
  unitCount: number;
  unitLabel: string;
  packageTotal: number;
  activeTier: PackageTier | null;
  tierDescription?: string;
  isTierPricing: boolean;
  tiers: PackageTier[];
}

type PackageLike = Partial<Package> & Partial<TourPackage> & {
  tiers?: Array<Partial<PackageTier>>;
  tipe_harga?: string;
  kapasitas_per_unit?: number;
  unit?: string;
  satuan?: string;
  price?: number;
  harga?: number;
};

/**
 * Hitung harga paket wisata berdasarkan jumlah peserta dan tier/tipe harga yang berlaku.
 */
export function calculatePackagePrice(
  pkg: Package | TourPackage | null | undefined,
  participants: number
): PriceCalculationResult {
  if (!pkg) {
    return {
      unitPrice: 0,
      unitCount: 0,
      unitLabel: 'orang',
      packageTotal: 0,
      activeTier: null,
      isTierPricing: false,
      tiers: [],
    };
  }

  const p = pkg as PackageLike;
  const count = Math.max(1, participants || 1);
  const rawTiers = p.tiers || [];
  const tiers: PackageTier[] = rawTiers.map((t, idx) => ({
    id: t.id ?? idx + 1,
    min_peserta: Number(t.min_peserta || 1),
    harga_per_orang: Number(t.harga_per_orang || 0),
  }));

  const tipeHarga =
    p.tipe_harga ||
    (tiers.length > 0 ? 'per_orang_tier' : 'per_paket_fixed');

  // Case 1: Per Orang dengan Tier
  if (tipeHarga === 'per_orang_tier' && tiers.length > 0) {
    // Sort descending by min_peserta to match highest eligible tier
    const sortedDesc = [...tiers].sort((a, b) => b.min_peserta - a.min_peserta);
    const matchedTier = sortedDesc.find(t => count >= t.min_peserta) || sortedDesc[sortedDesc.length - 1];
    const unitPrice = Number(matchedTier.harga_per_orang);

    return {
      unitPrice,
      unitCount: count,
      unitLabel: 'orang',
      packageTotal: unitPrice * count,
      activeTier: matchedTier,
      tierDescription: `Tier ≥ ${matchedTier.min_peserta} orang`,
      isTierPricing: true,
      tiers: [...tiers].sort((a, b) => a.min_peserta - b.min_peserta),
    };
  }

  // Case 2: Per Paket Fixed (e.g. tenda camping berkapasitas tertentu)
  const isPaketFixed =
    tipeHarga === 'per_paket_fixed' ||
    p.unit === 'paket' ||
    p.satuan === 'paket';

  if (isPaketFixed) {
    const rawCap = Number(p.kapasitas_per_unit);
    const cap = !isNaN(rawCap) && rawCap > 0 ? rawCap : 1;
    const units = Math.ceil(count / cap);
    const basePrice = Number(p.price ?? p.harga ?? 0);

    return {
      unitPrice: basePrice,
      unitCount: units,
      unitLabel: 'paket',
      packageTotal: units * basePrice,
      activeTier: null,
      tierDescription: `${units} paket (@${cap} org)`,
      isTierPricing: false,
      tiers: [],
    };
  }

  // Case 3: Default per orang standar
  const basePrice = Number(p.price ?? p.harga ?? 0);
  return {
    unitPrice: basePrice,
    unitCount: count,
    unitLabel: 'orang',
    packageTotal: basePrice * count,
    activeTier: null,
    isTierPricing: false,
    tiers: [],
  };
}

/**
 * Dapatkan rentang harga atau harga terendah dari sebuah paket.
 */
export function getPackagePriceDisplay(pkg: Package | TourPackage | null | undefined): {
  displayText: string;
  minPrice: number;
  maxPrice: number;
  hasTiers: boolean;
} {
  if (!pkg) {
    return { displayText: 'Rp 0', minPrice: 0, maxPrice: 0, hasTiers: false };
  }

  const p = pkg as PackageLike;
  const rawTiers = p.tiers || [];
  const tiers: PackageTier[] = rawTiers.map((t, idx) => ({
    id: t.id ?? idx + 1,
    min_peserta: Number(t.min_peserta || 1),
    harga_per_orang: Number(t.harga_per_orang || 0),
  }));

  if (tiers.length > 0) {
    const prices = tiers.map(t => Number(t.harga_per_orang));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return {
      displayText: `Mulai Rp ${minPrice.toLocaleString('id-ID')}`,
      minPrice,
      maxPrice,
      hasTiers: true,
    };
  }

  const basePrice = Number(p.price ?? p.harga ?? 0);
  return {
    displayText: `Rp ${basePrice.toLocaleString('id-ID')}`,
    minPrice: basePrice,
    maxPrice: basePrice,
    hasTiers: false,
  };
}
