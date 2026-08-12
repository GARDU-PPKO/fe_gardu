import api from './api';
import type { Setting, VillageStat, Dusun } from '../types';

export interface HomeData {
  settings: Setting[];
  village_stats: VillageStat[];
  dusun: Dusun[];
}

/** Agregat landing page: settings + stats + dusun dalam 1 request */
export const getHomeData = () => api.get<HomeData>('/home');
