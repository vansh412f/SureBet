import { useEffect, useState } from 'react';

function formatMMSS(msRemaining) {
  if (msRemaining <= 0 || Number.isNaN(msRemaining)) return '00:00';
  const totalSeconds = Math.floor(msRemaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${mm}:${ss}`;
}

/**
 * useCountdown
 * @param {Date|string|number|null} targetTimestamp
 * @returns {string} formatted MM:SS
 */
export const useCountdown = (targetTimestamp) => {
  const target = targetTimestamp ? new Date(targetTimestamp).getTime() : null;
  const [remaining, setRemaining] = useState(
    target ? Math.max(0, target - Date.now()) : 0
  );

  useEffect(() => {
    if (!target) {
      setRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      setRemaining(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  return formatMMSS(remaining);
};
