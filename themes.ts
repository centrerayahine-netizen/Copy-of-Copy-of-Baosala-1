export interface Theme {
  name: string;
  colorName: 'cyan' | 'indigo' | 'emerald' | 'rose';
  primaryHex: string;
  strokeHex: string;
  classes: {
    text: string;
    textLighter: string;
    textDarker: string;
    hoverTextDarker: string;
    bg: string;
    hoverBg: string;
    ring: string;
    border: string;
    accent: string;
  };
}

export const themes: Theme[] = [
  {
    name: 'أزرق سيان',
    colorName: 'cyan',
    primaryHex: '#06b6d4',
    strokeHex: '#0891b2',
    classes: {
      text: 'text-cyan-700',
      textLighter: 'text-cyan-600',
      textDarker: 'text-cyan-800',
      hoverTextDarker: 'hover:text-cyan-800',
      bg: 'bg-cyan-600',
      hoverBg: 'hover:bg-cyan-700',
      ring: 'focus:ring-cyan-500',
      border: 'focus:border-cyan-500',
      accent: 'accent-cyan-600',
    },
  },
  {
    name: 'بنفسجي',
    colorName: 'indigo',
    primaryHex: '#6366f1',
    strokeHex: '#4f46e5',
    classes: {
      text: 'text-indigo-700',
      textLighter: 'text-indigo-600',
      textDarker: 'text-indigo-800',
      hoverTextDarker: 'hover:text-indigo-800',
      bg: 'bg-indigo-600',
      hoverBg: 'hover:bg-indigo-700',
      ring: 'focus:ring-indigo-500',
      border: 'focus:border-indigo-500',
      accent: 'accent-indigo-600',
    },
  },
  {
    name: 'زمردي',
    colorName: 'emerald',
    primaryHex: '#10b981',
    strokeHex: '#059669',
    classes: {
      text: 'text-emerald-700',
      textLighter: 'text-emerald-600',
      textDarker: 'text-emerald-800',
      hoverTextDarker: 'hover:text-emerald-800',
      bg: 'bg-emerald-600',
      hoverBg: 'hover:bg-emerald-700',
      ring: 'focus:ring-emerald-500',
      border: 'focus:border-emerald-500',
      accent: 'accent-emerald-600',
    },
  },
  {
    name: 'وردي',
    colorName: 'rose',
    primaryHex: '#f43f5e',
    strokeHex: '#e11d48',
    classes: {
      text: 'text-rose-700',
      textLighter: 'text-rose-600',
      textDarker: 'text-rose-800',
      hoverTextDarker: 'hover:text-rose-800',
      bg: 'bg-rose-600',
      hoverBg: 'hover:bg-rose-700',
      ring: 'focus:ring-rose-500',
      border: 'focus:border-rose-500',
      accent: 'accent-rose-600',
    },
  },
];
