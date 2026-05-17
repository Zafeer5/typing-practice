/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSound } from '../hooks/useSound';

const TARGET_SENTENCE = "The quick brown fox jumps over the lazy dog";

interface TypingEngineProps {
  onComplete: (stats: { wpm: number; accuracy: number; streak: number }) => void;
  onManualReset: () => void;
}

export const TypingEngine: React.FC<TypingEngineProps> = ({ onComplete, onManualReset }) => {
  const [input, setInput] = useState("");
  const [isError, setIsError] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorsCount, setErrorsCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const { playKeySound, playErrorSound, playSuccessSound, initContext } = useSound();

  const characters = useMemo(() => TARGET_SENTENCE.split(''), []);
  const currentIndex = input.length;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    
    // If finished, don't handle keys here (App handles Enter)
    if (currentIndex >= characters.length) return;

    if (!startTime) {
      setStartTime(Date.now());
      initContext();
    }

    const expectedChar = characters[currentIndex];

    if (e.key === expectedChar) {
      const newInput = input + e.key;
      setInput(newInput);
      playKeySound();
      setIsError(false);
      
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
      
      if (newInput.length === characters.length) {
        const timeElapsed = (Date.now() - (startTime || Date.now())) / 1000 / 60; // minutes
        const wpm = Math.round((characters.length / 5) / (timeElapsed || 0.01));
        const accuracy = Math.round(((characters.length) / (characters.length + errorsCount)) * 100);
        playSuccessSound();
        onComplete({ wpm, accuracy, streak: maxStreak });
      }
    } else if (e.key.length === 1) {
      setIsError(true);
      playErrorSound();
      setErrorsCount(prev => prev + 1);
      setCurrentStreak(0);
      setTimeout(() => setIsError(false), 100);
    }
  }, [currentIndex, characters, input, startTime, currentStreak, maxStreak, errorsCount, initContext, playKeySound, playErrorSound, playSuccessSound, onComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const progress = (currentIndex / characters.length) * 100;

  return (
    <div className="flex flex-col items-center w-full space-y-8">
      {/* Top Controls */}
      <div className="w-full flex justify-between items-center px-2">
        <h3 className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase">Practice_Protocol</h3>
        <button 
          onClick={onManualReset}
          className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/50 hover:text-tech-green hover:border-tech-green/40 hover:bg-tech-green/10 transition-all duration-300 group"
        >
          <RotateCcw className="w-3 h-3 group-hover:rotate-[-90deg] transition-transform duration-500" />
          Restart
        </button>
      </div>

      {/* Progress Monitor */}
      <div className="w-full h-1 bg-tech-accent relative">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-tech-green shadow-[0_0_10px_#00ff41]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Primary Input Array */}
      <div 
        className={`relative p-8 bg-black/40 border border-tech-accent w-full transition-colors duration-150 ${isError ? 'border-tech-red bg-tech-red/5' : 'border-tech-accent'}`}
      >
        <motion.div 
          animate={isError ? { x: [-2, 2, -1, 1, 0] } : {}}
          className="text-3xl md:text-4xl font-mono tracking-wider flex flex-wrap justify-center gap-x-0.5 leading-relaxed"
        >
          {characters.map((char, index) => {
            const isTyped = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <span 
                key={index}
                className={`relative ${
                  isTyped ? 'text-tech-green drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]' : 
                  isCurrent ? 'text-white' : 'text-white/10'
                }`}
              >
                {char === ' ' ? '\u00A0' : char}
                {isCurrent && (
                  <motion.span 
                    layoutId="caret"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-tech-green animate-blink"
                  />
                )}
              </span>
            );
          })}
        </motion.div>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-3 gap-1 w-full text-center">
        <TelemetryBox label="ACCURACY" value={Math.round(((currentIndex) / (currentIndex + errorsCount)) * 100) || 100} unit="%" />
        <TelemetryBox label="STREAK" value={currentStreak} unit="X" />
        <TelemetryBox label="ERRORS" value={errorsCount} unit="!" />
      </div>
    </div>
  );
};

const TelemetryBox: React.FC<{ label: string; value: number; unit: string }> = ({ label, value, unit }) => (
  <div className="bg-tech-gray border border-tech-accent px-4 py-2 flex flex-col items-center">
    <span className="text-[9px] text-white/30 uppercase tracking-[0.2em]">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-bold font-mono">{value}</span>
      <span className="text-[8px] opacity-30">{unit}</span>
    </div>
  </div>
);
