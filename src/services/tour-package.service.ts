import api from './api';
import type { TourPackage } from '../types';

export const getTourPackages = () => api.get<TourPackage[]>('/tour-packages');
export const getTourPackageDetail = (id: number) => api.get<TourPackage>(`/tour-packages/${id}`);
