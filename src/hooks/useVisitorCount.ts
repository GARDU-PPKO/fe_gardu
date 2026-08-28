import { useState, useEffect } from 'react';
import { getVisitorStats, trackVisitor } from '../services/visitor.service';

const STORAGE_KEY = 'pesonagetas_total_visitors';
const SESSION_KEY = 'pesonagetas_session_recorded';
const SESSION_ID_KEY = 'pesonagetas_session_id';

/**
 * Hook to track real website visitors via Laravel backend API.
 * Automatically records new visitor sessions into the database.
 */
export function useVisitorCount() {
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return 0;
  });

  useEffect(() => {
    let cancelled = false;

    // Helper untuk session id unik di browser tab/session
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }

    const hasRecorded = sessionStorage.getItem(SESSION_KEY);

    if (!hasRecorded) {
      // Catat kunjungan baru ke backend
      trackVisitor(sessionId)
        .then((res) => {
          if (cancelled) return;
          const total = res?.data?.total_visitors;
          if (typeof total === 'number' && total > 0) {
            setVisitorCount(total);
            sessionStorage.setItem(SESSION_KEY, 'true');
            localStorage.setItem(STORAGE_KEY, total.toString());
          }
        })
        .catch(() => {
          // Jika backend offline, gunakan data cache local
          if (cancelled) return;
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const count = parseInt(saved, 10) + 1;
            setVisitorCount(count);
            sessionStorage.setItem(SESSION_KEY, 'true');
            localStorage.setItem(STORAGE_KEY, count.toString());
          }
        });
    } else {
      // Jika sesi sudah tercatat, ambil total terbaru
      getVisitorStats()
        .then((res) => {
          if (cancelled) return;
          const total = res?.data?.total_visitors;
          if (typeof total === 'number' && total > 0) {
            setVisitorCount(total);
            localStorage.setItem(STORAGE_KEY, total.toString());
          }
        })
        .catch(() => {
          // ignore error and keep existing state
        });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return { visitorCount };
}
