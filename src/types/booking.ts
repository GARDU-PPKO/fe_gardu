export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  isFree?: boolean;
  quantity?: number;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
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
  email: string;
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
    email: '',
    city: '',
    notes: '',
  }
};

export const AVAILABLE_ADD_ONS: AddOnItem[] = [
  {
    id: 'snack',
    name: 'Paket Snack & Camilan',
    price: 15000,
    description: 'Aneka camilan khas Getas + kopi/teh hangat',
  },
  {
    id: 'bbq',
    name: 'Alat Bakaran & Arang',
    price: 25000,
    description: 'Set panggangan BBQ lengkap arang & penjepit',
  },
  {
    id: 'atv',
    name: 'Sewa ATV (30 Menit)',
    price: 35000,
    description: 'Jelajah jalur offroad ringan dengan ATV 150cc',
  },
  {
    id: 'archery',
    name: 'Sesi Panahan (Archery)',
    price: 0,
    isFree: true,
    description: 'Fasilitas memanah gratis (10 anak panah per peserta)',
  },
];
