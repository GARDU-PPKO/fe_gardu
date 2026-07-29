import api from './api';
import type { BookingSession } from '../types';

export interface CreateBookingPayload {
  package_id?: number | string;
  customer_name?: string;
  phone?: string;
  email?: string;
  date?: string;
  session_time?: string;
  participants?: number;
  notes?: string;
  [key: string]: unknown;
}

export const getBookingSessions = (params?: { package_id?: number; tanggal?: string }) =>
  api.get<BookingSession[]>('/booking-sessions', { params });

export const createBooking = (data: CreateBookingPayload) =>
  api.post('/bookings', data);
