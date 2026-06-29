import api from './api';
import type { Dusun } from '../types';

export const getDusun = () => api.get<Dusun[]>('/dusun');
export const getDusunDetail = (id: number) => api.get<Dusun>(`/dusun/${id}`);
