/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from 'motion/react';
import { Activity, ShieldCheck, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CyberBackground } from './components/CyberBackground';
import { HolographicCard } from './components/HolographicCard';
import { TypingEngine } from './components/TypingEngine';

export default function App() {
  const [sessionStats, setSessionStats] = useState<{ wpm: number; accuracy: number; streak: number } | null>(null);
  const [complete, setComplete] = useState(false);

  const handleComplete = (stats: { wpm: number; accuracy: number; streak: number }) => {
    setSessionStats(stats);
    setComplete(true);
  };

  const handleReset = () => {
    setComplete(false);
    setSessionStats(null);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [complete]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 select-none border-t-2 border-tech-green/20">
      <CyberBackground />
      
      {/* Header Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-0 inset-x-0 h-16 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center px-8"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-[0.3em] font-mono text-tech-green">NEON_TYPE</span>
        </div>
      </motion.div>

      {/* Main Command Center */}
      <main className="w-full max-w-4xl z-10 pt-20">
        <AnimatePresence mode="wait">
          {!complete ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <HolographicCard>
                <TypingEngine onComplete={handleComplete} onManualReset={handleReset} />
              </HolographicCard>
            </motion.div>
          ) : (
            <motion.div
              key="celebration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-12"
            >
              <div className="text-center relative">
                <motion.h2 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl md:text-8xl font-black italic text-tech-green tracking-tighter drop-shadow-[0_0_20px_#00ff41]"
                >
                  DECODED.
                </motion.h2>
                <div className="absolute -top-4 -right-4 bg-tech-red text-black px-2 py-0.5 text-[10px] font-bold skew-x-[-12deg]">
                  ACCESS_GRANTED
                </div>
              </div>

              <HolographicCard className="w-full max-w-2xl">
                <div className="space-y-10">
                  <div className="flex justify-between items-center border-b border-tech-accent pb-4">
                    <span className="text-[10px] text-white/30 uppercase tracking-[0.5em]">Session_Report_#882</span>
                    <Activity className="w-4 h-4 text-tech-green opacity-40" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FinalStat label="VELOCITY" value={sessionStats?.wpm || 0} unit="WPM" />
                    <FinalStat label="INTEGRITY" value={sessionStats?.accuracy || 0} unit="%" />
                    <FinalStat label="BUFFER" value={sessionStats?.streak || 0} unit="MAX" />
                  </div>

                  <div className="pt-6 text-center">
                    <motion.div 
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="inline-block px-8 py-3 border border-tech-green text-tech-green text-[10px] uppercase tracking-[0.4em] font-bold cursor-pointer hover:bg-tech-green hover:text-black transition-colors duration-300"
                      onClick={handleReset}
                    >
                      [ Reboot_Terminal ]
                    </motion.div>
                    <p className="mt-4 text-[9px] text-white/20 uppercase tracking-widest font-mono">
                      (Or press ENTER key to re-initiate)
                    </p>
                  </div>
                </div>
              </HolographicCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Background Static Elements */}
      <div className="fixed bottom-8 inset-x-0 flex flex-col items-center gap-1 z-50">
        <span className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase">
          Tool by Zafeer
        </span>
      </div>
    </div>
  );
}

function FinalStat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-black/20 border border-tech-accent">
      <span className="text-[9px] text-white/30 uppercase tracking-widest mb-2">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold font-mono text-white">{value}</span>
        <span className="text-[10px] text-tech-green opacity-40">{unit}</span>
      </div>
    </div>
  );
}

