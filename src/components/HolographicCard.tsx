/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import React from 'react';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      {/* Container with sharp border */}
      <div className="relative bg-tech-gray border border-tech-accent p-8 tech-glow-green overflow-hidden">
        {/* Decorative corner brackets */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-tech-green opacity-40" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-tech-green opacity-40" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-tech-green opacity-40" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-tech-green opacity-40" />

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
};
