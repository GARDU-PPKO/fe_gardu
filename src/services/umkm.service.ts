import api from './api';
import type { UmkmProduct } from '../types';
import type { ApiPagination } from './api';
import type { AxiosResponse } from 'axios';

interface UmkmResponse extends AxiosResponse<UmkmProduct[]> {
  pagination?: ApiPagination;
}

export const getUmkmProducts = (params?: {
  kategori?: string;
  page?: number;
  limit?: number;
}) => api.get<UmkmProduct[]>('/umkm-products', { params }) as Promise<UmkmResponse>;
