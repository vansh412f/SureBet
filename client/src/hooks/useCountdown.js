import { useEffect, useState } from 'react';

function formatCountdown(ms) {
  if (ms <= 0 || Number.isNaN(ms)) return null;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`;
  return `${s}s`;
}

export const useCountdown = (targetTimestamp) => {
  const target = targetTimestamp ? new Date(targetTimestamp).getTime() : null;
  const [remaining, setRemaining] = useState(
    target ? Math.max(0, target - Date.now()) : 0
  );

  useEffect(() => {
    if (!target) { setRemaining(0); return; }
    setRemaining(Math.max(0, target - Date.now()));
    const interval = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      setRemaining(diff);
      if (diff === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  return formatCountdown(remaining);
};
