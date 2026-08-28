import api from './api';

export interface VisitorStatsResponse {
  total_visitors: number;
  today_visitors: number;
}

/**
 * Mengambil total pengunjung website dari backend.
 */
export const getVisitorStats = () =>
  api.get<VisitorStatsResponse>('/visitor-stats');

/**
 * Mencatat kunjungan unik pengunjung baru ke database backend.
 */
export const trackVisitor = (sessionId?: string) =>
  api.post<VisitorStatsResponse>('/visitor-stats/track', {
    session_id: sessionId,
  });
