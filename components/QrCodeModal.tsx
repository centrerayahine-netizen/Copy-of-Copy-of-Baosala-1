import React, { useEffect, useRef } from 'react';

// We no longer need to declare the global QRCode type,
// as we will be accessing it directly from the window object.

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const url = window.location.href;

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      // Access QRCode library from the global window object.
      // This is a more robust way to ensure the script has loaded.
      const QRCode = (window as any).QRCode;
      
      if (QRCode) {
        QRCode.toCanvas(canvasRef.current, url, { width: 256, margin: 2, errorCorrectionLevel: 'H' }, (error: any) => {
          if (error) console.error("QR Code generation failed:", error);
        });
      } else {
        // Log an error if the library isn't found. This helps with debugging.
        console.error("QRCode library not found. Make sure the script is loaded correctly in index.html.");
      }
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url).then(() => {
        // Maybe show a temporary "Copied!" message inside the button
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" dir="rtl" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4 text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">افتح على هاتفك</h2>
        <p className="text-slate-600 mb-4">
          امسح رمز الاستجابة السريعة (QR) بكاميرا هاتفك لفتح هذا التطبيق على جهازك المحمول.
        </p>
        <div className="flex justify-center p-4 bg-slate-100 rounded-lg">
            <canvas ref={canvasRef} />
        </div>
        <div className="mt-4">
            <label htmlFor="appUrl" className="block text-sm font-medium text-slate-700 mb-1">
                أو انسخ الرابط
            </label>
            <div className="relative">
                <input
                    id="appUrl"
                    type="text"
                    value={url}
                    readOnly
                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 text-sm ltr text-left"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                 <button 
                    onClick={handleCopyUrl}
                    className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 bg-slate-200 hover:bg-slate-300 rounded"
                    aria-label="نسخ الرابط"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                 </button>
            </div>
        </div>
        <div className="mt-6 flex justify-end">
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

export default QrCodeModal;