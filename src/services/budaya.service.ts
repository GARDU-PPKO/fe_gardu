import api from './api';
import type { Budaya } from '../types';

export const getBudaya = () => api.get<Budaya[]>('/budaya');
export const getBudayaDetail = (id: number | string) => api.get<Budaya>(`/budaya/${id}`);

