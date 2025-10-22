import React, { useState } from 'react';
import { EvaluationData } from '../types';
import { Theme } from '../themes';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CompassIcon } from './icons/CompassIcon';
import { SaveIcon } from './icons/SaveIcon';
import { LoadIcon } from './icons/LoadIcon';
import { MergeIcon } from './icons/MergeIcon';


interface EvaluationFormProps {
  data: EvaluationData;
  setData: (data: EvaluationData) => void;
  onGenerate: (data: EvaluationData) => void;
  isLoading: boolean;
  theme: Theme;
  onSave: () => void;
  onLoad: () => void;
  onMerge: () => void;
  loadedDate: string | null;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ data, setData, onGenerate, isLoading, theme, onSave, onLoad, onMerge, loadedDate }) => {
  const [activeDomainIndex, setActiveDomainIndex] = useState(0);

  const handleEducatorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, educatorName: e.target.value });
  };

  const handleDomainChange = (domainIndex: number, newName: string) => {
    const newDomains = [...data.domains];
    newDomains[domainIndex].name = newName;
    setData({ ...data, domains: newDomains });
  };

  const addDomain = () => {
    const newDomains = [...data.domains, { name: 'مجال جديد', axes: [{ name: 'محور جديد', score: 5 }] }];
    setData({ ...data, domains: newDomains });
    setActiveDomainIndex(newDomains.length - 1);
  };

  const removeDomain = (domainIndex: number) => {
    if (data.domains.length <= 1) return; // Don't remove the last domain
    const newDomains = data.domains.filter((_, i) => i !== domainIndex);
    setData({ ...data, domains: newDomains });
    
    if (activeDomainIndex >= domainIndex) {
      setActiveDomainIndex(Math.max(0, activeDomainIndex - 1));
    }
  };

  const handleAxisChange = (domainIndex: number, axisIndex: number, newName: string) => {
    const newDomains = [...data.domains];
    newDomains[domainIndex].axes[axisIndex].name = newName;
    setData({ ...data, domains: newDomains });
  };

  const handleScoreChange = (domainIndex: number, axisIndex: number, newScore: number) => {
    const newDomains = [...data.domains];
    newDomains[domainIndex].axes[axisIndex].score = newScore;
    setData({ ...data, domains: newDomains });
  };

  const addAxis = (domainIndex: number) => {
    const newDomains = [...data.domains];
    newDomains[domainIndex].axes.push({ name: 'محور جديد', score: 5 });
    setData({ ...data, domains: newDomains });
  };

  const removeAxis = (domainIndex: number, axisIndex: number) => {
    const newDomains = [...data.domains];
    newDomains[domainIndex].axes = newDomains[domainIndex].axes.filter((_, i) => i !== axisIndex);
    setData({ ...data, domains: newDomains });
  };

  const activeDomain = data.domains[activeDomainIndex];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${theme.classes.text}`}>بيانات التقييم</h2>
          {loadedDate && (
            <p className="text-sm text-slate-500 mt-1">
              تقييم بتاريخ: {new Date(loadedDate).toLocaleString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
            <button onClick={onLoad} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold py-2 px-3 rounded-lg transition-colors">
                <LoadIcon className="w-4 h-4" />
                <span>تحميل آخر تقييم</span>
            </button>
            <button onClick={onSave} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold py-2 px-3 rounded-lg transition-colors">
                <SaveIcon className="w-4 h-4" />
                <span>حفظ في السجل</span>
            </button>
            <button onClick={onMerge} className="flex items-center gap-2 text-sm text-white bg-slate-600 hover:bg-slate-700 font-semibold py-2 px-3 rounded-lg transition-colors">
                <MergeIcon className="w-4 h-4" />
                <span>دمج وإنشاء تقييم شهري</span>
            </button>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="educatorName" className="block text-md font-bold text-slate-700 mb-2">اسم المربية</label>
        <input
          type="text"
          id="educatorName"
          value={data.educatorName}
          onChange={handleEducatorNameChange}
          className={`w-full p-2 border border-slate-300 rounded-lg focus:ring-2 ${theme.classes.ring} ${theme.classes.border}`}
        />
      </div>

      {/* Tabbed Interface */}
      <div className="mt-6">
        <div className="flex items-center border-b border-slate-200">
          <div className="flex-grow flex items-center overflow-x-auto" role="tablist" aria-label="مجالات التقييم">
            {data.domains.map((domain, index) => (
              <button
                key={index}
                id={`tab-${index}`}
                role="tab"
                aria-selected={activeDomainIndex === index}
                aria-controls={`tabpanel-${index}`}
                onClick={() => setActiveDomainIndex(index)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-semibold transition-colors focus:outline-none whitespace-nowrap ${
                  activeDomainIndex === index
                    ? `${theme.classes.text} border-b-2 ${theme.classes.border}`
                    : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'
                }`}
              >
                {domain.name}
              </button>
            ))}
          </div>
          <button onClick={addDomain} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-semibold p-2 rounded-lg transition-colors ml-2 flex-shrink-0">
            <PlusIcon className="w-4 h-4" />
            <span>إضافة مجال</span>
          </button>
        </div>

        {/* Tab Panel */}
        {activeDomain && (
          <div 
            key={activeDomainIndex} 
            id={`tabpanel-${activeDomainIndex}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeDomainIndex}`}
            className="p-4 bg-slate-50/50 rounded-b-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={activeDomain.name}
                onChange={(e) => handleDomainChange(activeDomainIndex, e.target.value)}
                className="text-lg font-bold text-slate-800 bg-transparent focus:bg-white p-1 rounded-md w-full"
                aria-label="اسم المجال"
              />
              {data.domains.length > 1 && (
                <button 
                    onClick={() => removeDomain(activeDomainIndex)} 
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label={`حذف مجال ${activeDomain.name}`}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="space-y-4">
              {activeDomain.axes.map((axis, axisIndex) => (
                <div key={axisIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-2">
                     <input
                        type="text"
                        value={axis.name}
                        onChange={(e) => handleAxisChange(activeDomainIndex, axisIndex, e.target.value)}
                        className="w-full bg-transparent focus:bg-white p-1 rounded-md text-slate-700"
                        aria-label={`اسم المحور ${axisIndex + 1}`}
                      />
                     <button 
                        onClick={() => removeAxis(activeDomainIndex, axisIndex)} 
                        className="text-slate-400 hover:text-slate-600 p-1"
                        aria-label={`حذف محور ${axis.name}`}
                    >
                        <TrashIcon className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={axis.score}
                      onChange={(e) => handleScoreChange(activeDomainIndex, axisIndex, parseInt(e.target.value, 10))}
                      className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${theme.classes.accent}`}
                      aria-label={`تقييم ${axis.name}`}
                    />
                    <span className={`font-bold w-8 text-center ${theme.classes.textDarker}`}>{axis.score}</span>
                  </div>
                </div>
              ))}
              <button onClick={() => addAxis(activeDomainIndex)} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800 font-semibold mt-2">
                <PlusIcon className="w-4 h-4" />
                <span>إضافة محور</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end mt-6">
        <button
          onClick={() => onGenerate(data)}
          disabled={isLoading}
          title="عرض البوصلة"
          className={`flex items-center justify-center gap-2 ${theme.classes.bg} text-white font-bold py-3 px-6 rounded-lg ${theme.classes.hoverBg} focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.classes.ring} disabled:bg-slate-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>جاري التحليل...</span>
            </>
          ) : (
            <>
              <CompassIcon className="w-6 h-6" />
              <span>عرض البوصلة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EvaluationForm;