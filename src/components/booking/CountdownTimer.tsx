import React, { useEffect, useRef, useState } from 'react';

interface CountdownTimerProps {
  expiredAt?: string;
  onExpire?: () => void;
}

function formatRemaining(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiredAt, onExpire }) => {
  const [remaining, setRemaining] = useState<number>(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!expiredAt) return;
    const target = new Date(expiredAt).getTime();
    if (Number.isNaN(target)) return;

    const tick = () => {
      const diff = target - Date.now();
      setRemaining(diff);
      if (diff <= 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire?.();
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiredAt, onExpire]);

  if (!expiredAt) return null;

  const isExpired = remaining <= 0;

  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-[#ffe082] bg-[#fff9e6] px-4 py-3 text-center">
      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-700">
        {isExpired ? 'Waktu pembayaran habis' : 'Sisa waktu pembayaran'}
      </span>
      <span
        className={`font-black text-2xl tabular-nums tracking-tight ${isExpired ? 'text-red-600' : 'text-orange-700'}`}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {formatRemaining(remaining)}
      </span>
    </div>
  );
};

export default CountdownTimer;
