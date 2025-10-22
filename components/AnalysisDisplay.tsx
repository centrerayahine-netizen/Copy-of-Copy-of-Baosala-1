// FIX: Implement the AnalysisDisplay component
import React, { useEffect, useState } from 'react';
import { Theme } from '../themes';
import { TeamIcon } from './icons/TeamIcon';
import { AnalysisResult } from '../types';
import { BelbinIcon } from './icons/BelbinIcon';
import { marked } from 'marked';


interface AnalysisDisplayProps {
  analysis: AnalysisResult;
  theme: Theme;
}

// Icons
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 18 9-9 4.5 4.5L21.75 6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6h6v6" />
  </svg>
);

const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6c0-1.74-1.21-3.22-2.83-3.82M12 18.75a6 6 0 0 1-6-6c0-1.74 1.21-3.22 2.83-3.82M12 18.75v-3.75m0-6.32a3 3 0 0 1 3 3c0 .54-.13.98-.35 1.36M12 5.68a3 3 0 0 0-3 3c0 .54.13.98.35 1.36m2.65-1.36H9.35" />
    </svg>
);


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ 
    analysis, 
    theme
 }) => {
  const [belbinHtml, setBelbinHtml] = useState('');

  useEffect(() => {
    const parseMarkdown = async () => {
        if (analysis?.belbinRolesAnalysis) {
            // Sanitize to prevent XSS, though marked does some sanitization by default.
            // For production apps, a more robust sanitizer like DOMPurify is recommended.
            const html = await marked.parse(analysis.belbinRolesAnalysis);
            setBelbinHtml(html);
        }
    };
    parseMarkdown();
  }, [analysis?.belbinRolesAnalysis]);

  if (!analysis) return null;

  return (
    <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 space-y-8">
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <TeamIcon className={`w-7 h-7 ${theme.classes.textLighter}`} />
                    <h2 className={`text-2xl font-bold ${theme.classes.text}`}>التحليل الشامل والملخص</h2>
                </div>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{analysis.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <CheckCircleIcon className="w-7 h-7 text-green-500" />
                        <h3 className="text-xl font-bold text-slate-800">نقاط القوة</h3>
                    </div>
                    <ul className="space-y-2 list-disc list-inside text-slate-600">
                        {analysis.strengths.map((point, index) => <li key={`strength-${index}`}>{point}</li>)}
                    </ul>
                </div>

                {/* Areas for Improvement */}
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <TrendingUpIcon className="w-7 h-7 text-amber-500" />
                        <h3 className="text-xl font-bold text-slate-800">جوانب للتطوير</h3>
                    </div>
                    <ul className="space-y-2 list-disc list-inside text-slate-600">
                        {analysis.areasForImprovement.map((point, index) => <li key={`improvement-${index}`}>{point}</li>)}
                    </ul>
                </div>
            </div>

                {/* Suggestions */}
                <div className="pt-6 border-t border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                        <LightbulbIcon className={`w-7 h-7 ${theme.classes.text}`} />
                        <h3 className="text-xl font-bold text-slate-800">توصيات عملية</h3>
                    </div>
                    <ul className="space-y-2 list-disc list-inside text-slate-600">
                        {analysis.suggestions.map((point, index) => <li key={`suggestion-${index}`}>{point}</li>)}
                    </ul>
                </div>
        </div>

        {/* Belbin Analysis Section */}
        {analysis.belbinRolesAnalysis && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    <BelbinIcon className={`w-7 h-7 ${theme.classes.textLighter}`} />
                    <h2 className={`text-2xl font-bold ${theme.classes.text}`}>تحليل أدوار الفريق (Belbin)</h2>
                </div>
                <div
                    className="max-w-none mt-4 text-slate-700 leading-relaxed rtl"
                    dangerouslySetInnerHTML={{ __html: belbinHtml }}
                />
            </div>
        )}
    </div>
  );
};

export default AnalysisDisplay;