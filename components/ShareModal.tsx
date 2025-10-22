import React, { useState } from 'react';
import { ShareIcon } from './icons/ShareIcon';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, link }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" dir="rtl" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <ShareIcon className="w-7 h-7 text-slate-500" />
          <h2 className="text-2xl font-bold text-slate-800">مشاركة التقرير</h2>
        </div>
        <p className="text-slate-600 mb-4">
          يمكن لأي شخص لديه هذا الرابط عرض التقرير. لن يتمكنوا من تعديل البيانات.
        </p>
        <div className="relative">
          <input
            type="text"
            value={link}
            readOnly
            className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 text-sm ltr text-left"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </div>
        <div className="mt-6 flex justify-between items-center gap-3">
           <button
            onClick={handleCopy}
            className="py-2 px-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors w-full"
          >
            {copied ? 'تم النسخ!' : 'نسخ الرابط'}
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
