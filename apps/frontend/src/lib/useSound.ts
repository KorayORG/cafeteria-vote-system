// useSound: simple hook to play sound if enabled
import { useCallback } from 'react';

export function useSound(src: string, enabled: boolean) {
  return useCallback(() => {
    if (!enabled) return;
    const audio = new Audio(src);
    audio.volume = 0.18;
    audio.play();
  }, [src, enabled]);
}
