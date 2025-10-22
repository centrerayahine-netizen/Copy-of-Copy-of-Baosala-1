import React, { useState, useEffect } from 'react';
import { KeyIcon } from './icons/KeyIcon';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
  const [key, setKey] = useState(currentApiKey);

  useEffect(() => {
    // Sync the local state if the prop changes while the modal is open,
    // or to reset it when it opens again.
    setKey(currentApiKey);
  }, [currentApiKey, isOpen]);


  if (!isOpen) return null;

  const handleSaveClick = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" dir="rtl" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <KeyIcon className="w-7 h-7 text-slate-500" />
          <h2 className="text-2xl font-bold text-slate-800">إعداد مفتاح Gemini API</h2>
        </div>
        <p className="text-slate-600 mb-4">
          لاستخدام هذا التطبيق بشكل مستقل، تحتاج إلى مفتاح API الخاص بك من Google.
        </p>
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cyan-600 hover:text-cyan-700 font-semibold mb-6 block"
        >
          اذهب إلى Google AI Studio للحصول على مفتاح &rarr;
        </a>
        <div>
          <label htmlFor="apiKey" className="block text-md font-bold text-slate-700 mb-2">
            مفتاح API الخاص بك
          </label>
          <input
            type="password"
            id="apiKey"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="أدخل مفتاح API هنا"
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            autoComplete="off"
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
          >
            إغلاق
          </button>
          <button
            onClick={handleSaveClick}
            className="py-2 px-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-slate-400"
            disabled={!key.trim()}
          >
            حفظ المفتاح
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
