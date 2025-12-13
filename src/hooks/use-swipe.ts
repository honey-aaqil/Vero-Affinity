'use client';

import { useRef } from 'react';

const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe

export const useSwipe = ({ onSwipeRight }: { onSwipeRight?: () => void }) => {
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null; // a new swipe starts
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchEnd.current - touchStart.current;
    
    if (distance > SWIPE_THRESHOLD) {
      onSwipeRight?.();
    }
    
    touchStart.current = null;
    touchEnd.current = null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
