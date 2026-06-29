import api from './api';
import type { VillageProfile, VillageStat } from '../types';

export const getVillageProfile = () => api.get<VillageProfile[]>('/village-profile');
export const getVillageStats = () => api.get<VillageStat[]>('/village-stats');
export const getSettings = (keys?: string) =>
  api.get('/settings', { params: { keys } });
