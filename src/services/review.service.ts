import api from './api';
import type { PackageReview } from '../types';

export interface CheckReviewTokenResponse {
  booking_code: string;
  customer_name: string;
  tanggal_kunjungan?: string;
  tanggal_kunjungan_formatted?: string;
  sesi: string;
  package?: {
    id: number;
    nama: string;
    gambar: string;
    durasi: string;
    tag?: string | null;
  };
  has_reviewed: boolean;
  review?: {
    id: number;
    rating: number;
    komentar: string;
    created_at?: string;
  };
}

export interface SubmitReviewPayload {
  token?: string;
  booking_code?: string;
  rating: number;
  komentar: string;
  nama_pengulas?: string;
}

export const checkReviewToken = (token: string) =>
  api.get<CheckReviewTokenResponse>(`/reviews/check/${token}`);

export const submitReview = (payload: SubmitReviewPayload) =>
  api.post<PackageReview>('/reviews', payload);

export const getPackageReviews = (packageId: number) =>
  api.get<{
    rating_avg: number | null;
    reviews_count: number;
    reviews: PackageReview[];
  }>(`/tour-packages/${packageId}/reviews`);
