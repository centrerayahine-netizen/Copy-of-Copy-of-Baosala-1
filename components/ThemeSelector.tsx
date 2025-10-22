import React, { useState, useRef, useEffect } from 'react';
import { Theme, themes } from '../themes';
import { PaletteIcon } from './icons/PaletteIcon';

interface ThemeSelectorProps {
  setTheme: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);


  const handleThemeSelect = (theme: Theme) => {
    setTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
        aria-label="تغيير اللون"
      >
        <PaletteIcon className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-slate-200">
          {themes.map(theme => (
            <button
              key={theme.colorName}
              onClick={() => handleThemeSelect(theme)}
              className="w-full text-right px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>{theme.name}</span>
              <span className={`w-4 h-4 rounded-full ${theme.classes.bg}`}></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
