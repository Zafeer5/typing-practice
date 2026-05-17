/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useRef } from 'react';

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
  }, []);

  const playOscillator = useCallback((freq: number, type: OscillatorType, duration: number, volume: number) => {
    initContext();
    const ctx = audioContextRef.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [initContext]);

  const playKeySound = useCallback(() => {
    // Sharp click sound
    playOscillator(800, 'square', 0.05, 0.05);
  }, [playOscillator]);

  const playErrorSound = useCallback(() => {
    // Low glitchy buzz
    playOscillator(150, 'sawtooth', 0.15, 0.1);
    setTimeout(() => playOscillator(100, 'sawtooth', 0.1, 0.05), 50);
  }, [playOscillator]);

  const playSuccessSound = useCallback(() => {
    // Uplifting sweep
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((f, i) => {
      setTimeout(() => {
        playOscillator(f, 'sine', 0.4, 0.1);
      }, i * 100);
    });
  }, [playOscillator]);

  return {
    playKeySound,
    playErrorSound,
    playSuccessSound,
    initContext
  };
}
