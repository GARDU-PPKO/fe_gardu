import api from './api';
import type { VillageProfile, VillageStat, Setting } from '../types';

export const getVillageProfile = () => api.get<VillageProfile[]>('/village-profile');
export const getVillageStats = () => api.get<VillageStat[]>('/village-stats');
export const getSettings = (keys?: string) =>
  api.get<Setting[]>('/settings', { params: { keys } });
