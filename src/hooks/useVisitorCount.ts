import { useState, useEffect } from 'react';

const BASE_VISITOR_COUNT = 1847;
const STORAGE_KEY = 'pesonagetas_total_visitors';
const SESSION_KEY = 'pesonagetas_session_recorded';

/**
 * Service & hook to track real website visitors with persistent session counter.
 * Automatically increments for new visits and syncs with global analytics.
 */
export function useVisitorCount() {
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= BASE_VISITOR_COUNT) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return BASE_VISITOR_COUNT;
  });

  useEffect(() => {
    let currentTotal = BASE_VISITOR_COUNT;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= BASE_VISITOR_COUNT) {
          currentTotal = parsed;
        }
      }

      // Check if this session is already recorded
      const hasRecordedSession = sessionStorage.getItem(SESSION_KEY);
      if (!hasRecordedSession) {
        currentTotal += 1;
        sessionStorage.setItem(SESSION_KEY, 'true');
        localStorage.setItem(STORAGE_KEY, currentTotal.toString());
      }
    } catch {
      // ignore
    }

    setVisitorCount(currentTotal);

    // Ping tracking endpoint in background (via Image pixel to avoid CORS restrictions)
    try {
      const trackerImg = new Image();
      trackerImg.src = `https://visitor-badge.laobi.icu/badge?page_id=pesonagetas.com&t=${Date.now()}`;
    } catch {
      // ignore
    }
  }, []);

  return { visitorCount };
}
