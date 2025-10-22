// FIX: Replaced placeholder content with a valid SVG logo component.
import React from 'react';

export const RayahinLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="rayahin-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <g transform="translate(50,50)">
      {/* Central leaf */}
      <path d="M0 -45 C 20 -25, 20 25, 0 45 C -20 25, -20 -25, 0 -45 Z" fill="url(#rayahin-gradient)" />

      {/* Side leaves */}
      <g transform="rotate(45)">
        <path d="M0 -35 C 15 -20, 15 20, 0 35 C -15 20, -15 -20, 0 -35 Z" fill="url(#rayahin-gradient)" fillOpacity="0.8" />
      </g>
      <g transform="rotate(-45)">
        <path d="M0 -35 C 15 -20, 15 20, 0 35 C -15 20, -15 -20, 0 -35 Z" fill="url(#rayahin-gradient)" fillOpacity="0.8" />
      </g>
    </g>
  </svg>
);
