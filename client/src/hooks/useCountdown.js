import { useEffect, useState } from 'react';

/**
 * Formats milliseconds into a human-readable countdown string.
 * > 1 hour  → "1h 23m"
 * 1–60 min  → "45m 30s"
 * < 60 sec  → "59s"
 * expired   → null (caller can show "Scanning now...")
 */
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

/**
 * useCountdown
 * @param {Date|string|number|null} targetTimestamp
 * @returns {string|null} formatted countdown string, or null when expired/unset
 */
export const useCountdown = (targetTimestamp) => {
  const target = targetTimestamp ? new Date(targetTimestamp).getTime() : null;
  const [remaining, setRemaining] = useState(
    target ? Math.max(0, target - Date.now()) : 0
  );

  useEffect(() => {
    if (!target) { setRemaining(0); return; }
    // tick immediately so display is correct on mount
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
