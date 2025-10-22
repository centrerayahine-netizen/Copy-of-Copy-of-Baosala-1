
import React from 'react';

export const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m10.5 12-1.5-1.5 4.5-4.5 1.5 1.5-4.5 4.5Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 13.5 15 15l-4.5 4.5-1.5-1.5 4.5-4.5Z"
    />
  </svg>
);
