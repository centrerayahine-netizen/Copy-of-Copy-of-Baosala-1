// FIX: Provide SVG content for the TeamIcon component
import React from 'react';

export const TeamIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.57-1.023 1.535-1.838 2.658-2.42m-3.097-1.253c.583-.984 1.407-1.857 2.42-2.558M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm0 0a8.949 8.949 0 0 0 5.482-1.666M12 21a8.949 8.949 0 0 1-5.482-1.666m10.964 0a8.949 8.949 0 0 1-5.482 1.666m-5.482 0a8.949 8.949 0 0 0 5.482 1.666m0 0a8.949 8.949 0 0 1 3.232-6.526m-6.464 0a8.949 8.949 0 0 0-3.232-6.526M12 6.325a3.375 3.375 0 1 1 0 6.75 3.375 3.375 0 0 1 0-6.75Z" />
  </svg>
);
