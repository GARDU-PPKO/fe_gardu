import api from './api';
import type { BookingSession } from '../types';

export const getBookingSessions = (params?: { package_id?: number; tanggal?: string }) =>
  api.get<BookingSession[]>('/booking-sessions', { params });
