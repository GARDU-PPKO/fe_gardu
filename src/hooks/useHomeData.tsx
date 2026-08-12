/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getHomeData } from '../services/home.service';
import { getDusun } from '../services/dusun.service';
import { getSettings, getVillageStats } from '../services/village.service';
import type { Setting, VillageStat, Dusun } from '../types';

interface HomeDataState {
  settings: Record<string, string>;
  settingsRaw: Setting[];
  stats: VillageStat[];
  dusunList: Dusun[];
  isLoading: boolean;
}

const FALLBACK_SETTINGS: Record<string, string> = {
  nama_desa: 'Desa Wisata Getas',
  wa_admin: '6281234567890',
  alamat_desa: 'Jl. Raya Getas No. 1, Kec. Singorojo, Kab. Kendal 51382',
  email_desa: 'desagetas@kendalkab.go.id',
  jam_pelayanan: 'Senin\u2013Jumat: 08.00\u201315.00 WIB',
};

const HomeDataContext = createContext<HomeDataState | undefined>(undefined);

export const HomeDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<HomeDataState>({
    settings: FALLBACK_SETTINGS,
    settingsRaw: [],
    stats: [],
    dusunList: [],
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        // Try aggregate endpoint first
        const res = await getHomeData();
        if (cancelled) return;

        const data = res.data;
        const settingsMap = Object.fromEntries(
          (data.settings || []).map((s: Setting) => [s.key, s.value]),
        );

        setState({
          settings: { ...FALLBACK_SETTINGS, ...settingsMap },
          settingsRaw: data.settings || [],
          stats: data.village_stats || [],
          dusunList: data.dusun || [],
          isLoading: false,
        });
      } catch {
        // Aggregate endpoint not available — fallback to individual calls
        if (cancelled) return;
        try {
          const [settingsRes, statsRes, dusunRes] = await Promise.allSettled([
            getSettings('nama_desa,wa_admin,alamat_desa,email_desa,jam_pelayanan'),
            getVillageStats(),
            getDusun(),
          ]);

          if (cancelled) return;

          const rawSettings =
            settingsRes.status === 'fulfilled' ? settingsRes.value.data : [];
          const settingsArr = Array.isArray(rawSettings) ? rawSettings : [];
          const settingsMap = Object.fromEntries(
            settingsArr.map((s: Setting) => [s.key, s.value]),
          );

          setState({
            settings: { ...FALLBACK_SETTINGS, ...settingsMap },
            settingsRaw: settingsArr,
            stats:
              statsRes.status === 'fulfilled'
                ? Array.isArray(statsRes.value.data)
                  ? statsRes.value.data
                  : []
                : [],
            dusunList:
              dusunRes.status === 'fulfilled'
                ? Array.isArray(dusunRes.value.data)
                  ? dusunRes.value.data
                  : []
                : [],
            isLoading: false,
          });
        } catch {
          if (!cancelled) {
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <HomeDataContext.Provider value={state}>{children}</HomeDataContext.Provider>
  );
};

export const useHomeData = (): HomeDataState => {
  const context = useContext(HomeDataContext);
  if (!context) {
    throw new Error('useHomeData must be used within a HomeDataProvider');
  }
  return context;
};
