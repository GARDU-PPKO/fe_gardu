import api from './api';
import type { UmkmProduct } from '../types';

export const getUmkmProducts = (kategori?: string) =>
  api.get<UmkmProduct[]>('/umkm-products', { params: { kategori } });
