import React from 'react';

export const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402a3.75 3.75 0 0 0-5.304-5.304L4.098 14.6a3.75 3.75 0 0 0 0 5.304Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 19.5h.008v.008h-.008v-.008Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 14.25h.008v.008h-.008v-.008Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25h.008v.008h-.008v-.008Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.25 19.5h.008v.008h-.008v-.008Z"
    />
  </svg>
);
