export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  tag?: string;
  minParticipants?: number;
  maxParticipants?: number;
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
  userDetails: UserDetails;
}

export const INITIAL_BOOKING_STATE: BookingState = {
  selectedPackage: null,
  date: '',
  session: '',
  participants: 1,
  userDetails: {
    fullName: '',
    whatsapp: '',
    email: '',
    city: '',
    notes: '',
  }
};
