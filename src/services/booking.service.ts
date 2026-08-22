import api from './api';
import type { BookingSession, BookingDetail } from '../types';

// ── Payloads ──

export interface AddOnOption {
  id: number;
  nama: string;
  harga: number;
  satuan: string;
  deskripsi: string;
  gambar: string;
  is_free: boolean;
  is_active: boolean;
  urutan: number | null;
}

export interface CreateBookingPayload {
  package_id: number | string;
  customer_name: string;
  phone: string;
  email?: string;
  kontak_darurat?: string;
  kota_asal?: string;
  date: string;
  session_time: string;
  participants: number;
  total_harga?: number;
  notes?: string;
  addons?: { id: string | number; quantity?: number }[];
}

export interface CreateBookingResponse {
  id: number;
  kode_booking: string;
  total_harga: number;
  status: string;
  expired_at: string;
  payment_url: string;
}

export interface UploadBuktiResponse {
  id: number;
  kode_booking: string;
  status: string;
  bukti_bayar: string;
}

// ── Endpoints ──

/** Cek kuota sesi pada tanggal & paket tertentu */
export const getBookingSessions = (params: { package_id: number; tanggal: string }) =>
  api.get<BookingSession[]>('/booking-sessions', { params });

/** Ambil daftar add-on yang tersedia */
export const getAddOns = () => api.get<AddOnOption[]>('/addons');

/** Create booking draft → PENDING_PAYMENT */
export const createBooking = (data: CreateBookingPayload) =>
  api.post<CreateBookingResponse>('/bookings', data);

/** Ambil detail booking by kode (publik, untuk payment page & cek pesanan) */
export const getBookingByKode = (kode: string) =>
  api.get<BookingDetail>(`/bookings/${kode}`);

/** Cek booking by kode atau phone */
export const checkBooking = (params: { kode?: string; phone?: string }) =>
  api.get<BookingDetail>('/bookings/check', { params });

/** Upload bukti bayar (multipart) → PENDING_VERIFY */
export const uploadBuktiBayar = (kode: string, file: File) => {
  const formData = new FormData();
  formData.append('bukti_bayar', file);
  return api.post<UploadBuktiResponse>(`/bookings/${kode}/bukti`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** Batalkan booking */
export const cancelBooking = async (kode: string) => {
  try {
    return await api.patch<{ kode_booking: string; status: string }>(`/bookings/${kode}/cancel`, {
      reason: 'Dibatalkan oleh pemesan',
      alasan: 'Dibatalkan oleh pemesan',
      status: 'cancelled',
    });
  } catch (err: unknown) {
    const errorObj = err as { response?: { status?: number } };
    if (errorObj.response?.status === 422 || errorObj.response?.status === 405 || errorObj.response?.status === 404) {
      try {
        return await api.post<{ kode_booking: string; status: string }>(`/bookings/${kode}/cancel`, {
          reason: 'Dibatalkan oleh pemesan',
        });
      } catch {
        return await api.patch<BookingDetail>(`/bookings/${kode}`, { status: 'cancelled' });
      }
    }
    throw err;
  }
};

/** Kirim ulang notifikasi/WA link pembayaran */
export const resendPaymentLink = (kode: string) =>
  api.post<{ kode_booking: string }>(`/bookings/${kode}/resend-wa`);

/** Edit data diri booking (opsional) */
export const updateBooking = (kode: string, data: Partial<{
  customer_name: string;
  phone: string;
  kontak_darurat: string;
}>) =>
  api.patch<BookingDetail>(`/bookings/${kode}`, data);
