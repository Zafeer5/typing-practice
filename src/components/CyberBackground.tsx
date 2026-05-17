/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-tech-bg pointer-events-none">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00ff41 1px, transparent 1px),
            linear-gradient(to bottom, #00ff41 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black, transparent 90%)'
        }}
      />

      {/* Main Scanline */}
      <div className="scanline" />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Subtle Side Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-tech-bg via-transparent to-tech-bg opacity-60" />
    </div>
  );
};
