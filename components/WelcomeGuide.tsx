import React from 'react';
import { KeyIcon } from './icons/KeyIcon';

interface WelcomeGuideProps {
  onOpenApiKeySettings: () => void;
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ onOpenApiKeySettings }) => {
  return (
    <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded-l-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <KeyIcon className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="mr-3">
          <p className="text-md font-bold text-yellow-800">
            مرحبًا بك في بوصلة عمل المربية!
          </p>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              للبدء وتحليل بيانات التقييم، يجب عليك أولاً إعداد مفتاح Google Gemini API الخاص بك. هذا المفتاح ضروري لتمكين قدرات الذكاء الاصطناعي في التطبيق.
            </p>
            <button
              onClick={onOpenApiKeySettings}
              className="mt-3 font-semibold text-yellow-800 hover:text-yellow-900 underline"
            >
              انقر هنا لإضافة مفتاح API الخاص بك &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide;
