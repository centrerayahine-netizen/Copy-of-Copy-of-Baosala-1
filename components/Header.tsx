import React from 'react';
import { Theme } from '../themes';
import ThemeSelector from './ThemeSelector';
import { KeyIcon } from './icons/KeyIcon';

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onOpenApiKeySettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, onOpenApiKeySettings }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              بوصلة عمل المربية في مركز رياحين لذوي الاحتياجات الخاصة
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
                onClick={onOpenApiKeySettings}
                className="flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
                aria-label="إعداد مفتاح API"
                title="إعداد مفتاح API"
            >
                <KeyIcon className="w-6 h-6" />
            </button>
            <ThemeSelector setTheme={setTheme} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;