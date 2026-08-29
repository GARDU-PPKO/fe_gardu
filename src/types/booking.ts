export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  description: string;
  satuan?: string;
  isFree?: boolean;
  quantity: number;
}

export interface PackageTier {
  id?: number;
  min_peserta: number;
  harga_per_orang: number;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  tipe_harga?: 'per_orang_tier' | 'per_paket_fixed';
  kapasitas_per_unit?: number | null;
  tiers?: PackageTier[];
  unit: string;
  tag?: string;
  minParticipants?: number;
  maxParticipants?: number;
  image?: string;
  duration?: string;
  includes?: string[];
  checkIn?: string;
  checkOut?: string;
  cancelPolicy?: string;
  nightCurfew?: string;
}

export interface UserDetails {
  fullName: string;
  whatsapp: string;
  kontakDarurat: string;
  email?: string;
  city: string;
  notes: string;
}

export interface BookingState {
  selectedPackage: Package | null;
  date: string;
  session: string;
  participants: number;
  selectedAddOns: AddOnItem[];
  userDetails: UserDetails;
}

export const INITIAL_BOOKING_STATE: BookingState = {
  selectedPackage: null,
  date: '',
  session: '',
  participants: 1,
  selectedAddOns: [],
  userDetails: {
    fullName: '',
    whatsapp: '',
    kontakDarurat: '',
    city: '',
    notes: '',
  }
};
