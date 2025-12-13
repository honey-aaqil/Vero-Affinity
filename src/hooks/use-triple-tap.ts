'use client';

import { useRef, useCallback } from 'react';

export const useTripleTap = (callback: () => void, timeout = 500) => {
  const tapCount = useRef(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handler = useCallback(() => {
    tapCount.current += 1;

    if (tapCount.current === 3) {
      callback();
      tapCount.current = 0;
      if (timer.current) clearTimeout(timer.current);
      return;
    }

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      tapCount.current = 0;
    }, timeout);
  }, [callback, timeout]);

  return { onClick: handler };
};
