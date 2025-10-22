import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Theme, themes } from './themes';
import { EvaluationData, AnalysisResult, ChartData, EvaluationRecord } from './types';
import { generateEvaluationAnalysis } from './services/geminiService';
import { generateImageReport } from './services/exportService';
import Header from './components/Header';
import EvaluationForm from './components/EvaluationForm';
import CompassChart from './components/CompassChart';
import AnalysisDisplay from './components/AnalysisDisplay';
import { ImageIcon } from './components/icons/ImageIcon';
import ApiKeyModal from './components/ApiKeyModal';
import WelcomeGuide from './components/WelcomeGuide';

const initialEvaluationData: EvaluationData = {
  educatorName: 'مربية ملهمة',
  domains: [
    { name: 'التخطيط التربوي', axes: [{ name: 'تحديد الأهداف التعليمية', score: 8 }, { name: 'تنويع الأنشطة والخبرات', score: 7 }] },
    { name: 'التفاعل مع الأطفال', axes: [{ name: 'بناء علاقات إيجابية وداعمة', score: 9 }, { name: 'الاستجابة للاحتياجات الفردية', score: 8 }] },
    { name: 'إدارة البيئة الصفية', axes: [{ name: 'تنظيم المساحات والمواد', score: 7 }, { name: 'تطبيق روتين يومي واضح', score: 9 }] },
    { name: 'التقييم والمتابعة', axes: [{ name: 'ملاحظة وتقييم تقدم الأطفال', score: 8 }, { name: 'توثيق الملاحظات والتقارير', score: 6 }] },
    { name: 'التطور المهني والشخصي', axes: [{ name: 'المبادرة للتعلم والتطور', score: 9 }, { name: 'التعاون الفعّال مع الزملاء وأولياء الأمور', score: 8 }] },
  ],
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(themes[0]);
  const [evaluationData, setEvaluationData] = useState<EvaluationData>(initialEvaluationData);
  const [activeAnalysisData, setActiveAnalysisData] = useState<EvaluationData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [loadedRecordDate, setLoadedRecordDate] = useState<string | null>(null);

  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);
  
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [downloadAfterAnalysis, setDownloadAfterAnalysis] = useState(false);
  
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const reportContainerRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load last saved data on initial render
    const lastData = localStorage.getItem('evaluationData_last');
    if (lastData) {
      setEvaluationData(JSON.parse(lastData));
    }
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    // Auto-save on change
    localStorage.setItem('evaluationData_last', JSON.stringify(evaluationData));
  }, [evaluationData]);

  useEffect(() => {
    // This effect triggers the download after analysis has been successfully generated and rendered.
    if (downloadAfterAnalysis && analysisResult && !isAnalysisLoading) {
        // A small delay to ensure the DOM is painted before canvas capture
        setTimeout(() => {
            handleDownloadReport();
            setDownloadAfterAnalysis(false); // Reset the flag
        }, 100);
    }
  }, [downloadAfterAnalysis, analysisResult, isAnalysisLoading]);
  
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const handleSetData = (newData: EvaluationData) => {
    setEvaluationData(newData);
    setLoadedRecordDate(null);
  };

  const handleSaveToHistory = () => {
    try {
      const history: EvaluationRecord[] = JSON.parse(localStorage.getItem('evaluationHistory') || '[]');
      const newRecord: EvaluationRecord = {
        date: new Date().toISOString(),
        data: evaluationData,
      };
      history.push(newRecord);
      localStorage.setItem('evaluationHistory', JSON.stringify(history));
      showNotification('تم حفظ التقييم بنجاح في السجل.', 'success');
    } catch (e) {
      console.error(e);
      showNotification('فشل حفظ التقييم.', 'error');
    }
  };

  const handleLoadLastFromHistory = () => {
    try {
      const history: EvaluationRecord[] = JSON.parse(localStorage.getItem('evaluationHistory') || '[]');
      if (history.length > 0) {
        const lastRecord = history[history.length - 1];
        setEvaluationData(lastRecord.data);
        setLoadedRecordDate(lastRecord.date);
        showNotification('تم تحميل آخر تقييم من السجل.', 'success');
      } else {
        showNotification('لا يوجد تقييمات محفوظة في السجل.', 'info');
      }
    } catch (e)
{
      console.error(e);
      showNotification('فشل تحميل التقييم.', 'error');
    }
  };
  
  const handleMergeEvaluations = () => {
    try {
      const history: EvaluationRecord[] = JSON.parse(localStorage.getItem('evaluationHistory') || '[]');
      if (history.length < 2) {
        showNotification('يجب وجود تقييمين على الأقل في السجل للقيام بالدمج.', 'info');
        return;
      }

      const scoreMap = new Map<string, { total: number; count: number }>();
      
      history.forEach(record => {
        record.data.domains.forEach(domain => {
          domain.axes.forEach(axis => {
            const current = scoreMap.get(axis.name) || { total: 0, count: 0 };
            scoreMap.set(axis.name, {
              total: current.total + axis.score,
              count: current.count + 1,
            });
          });
        });
      });

      const lastEvaluation = history[history.length - 1].data;
      const mergedData: EvaluationData = JSON.parse(JSON.stringify(lastEvaluation));

      mergedData.educatorName = `تقييم مدمج لـ ${lastEvaluation.educatorName}`;
      mergedData.domains.forEach(domain => {
        domain.axes.forEach(axis => {
          const stats = scoreMap.get(axis.name);
          if (stats) {
            axis.score = Math.round(stats.total / stats.count);
          }
        });
      });

      setEvaluationData(mergedData);
      setLoadedRecordDate(null);
      showNotification(`تم دمج ${history.length} تقييمات بنجاح.`, 'success');

    } catch (e) {
      console.error(e);
      showNotification('حدث خطأ أثناء دمج التقييمات.', 'error');
    }
  };

  const handleShowCompass = (data: EvaluationData) => {
    setActiveAnalysisData(data);
    setAnalysisResult(null); // Clear previous analysis
    setAnalysisError(null);
    setTimeout(() => {
      reportContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGenerateTextAnalysis = async (data: EvaluationData) => {
    setIsAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    setActiveAnalysisData(data);

    try {
      const result = await generateEvaluationAnalysis(data, apiKey);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      setAnalysisError('حدث خطأ أثناء إنشاء التحليل. تأكد من صحة مفتاح API وحاول مرة أخرى.');
      setDownloadAfterAnalysis(false); // Reset flag on error
    } finally {
      setIsAnalysisLoading(false);
    }
  };
  
  const handleDownloadReport = async () => {
    if (!reportContainerRef.current || !activeAnalysisData) {
        showNotification('لا يمكن إنشاء الملف، البيانات غير جاهزة.', 'error');
        return;
    }

    setIsExportLoading(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        await generateImageReport(reportContainerRef.current, activeAnalysisData.educatorName);
    } catch (error) {
        console.error(error);
        showNotification('فشل في إنشاء ملف الصورة.', 'error');
    } finally {
        setIsExportLoading(false);
    }
  };
  
  const handleCombinedAnalysisAndDownload = () => {
      if (!apiKey) {
        setIsApiKeyModalOpen(true);
        showNotification('الرجاء إدخال مفتاح API أولاً.', 'info');
        return;
      }
      if (!activeAnalysisData) {
          showNotification('البيانات غير جاهزة للتحميل.', 'error');
          return;
      }

      if (analysisResult) {
          handleDownloadReport(); // Just download if analysis exists
      } else {
          setDownloadAfterAnalysis(true); // Set flag to trigger download after analysis
          handleGenerateTextAnalysis(activeAnalysisData);
      }
  };

  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('gemini_api_key', newKey);
    setIsApiKeyModalOpen(false);
    showNotification('تم حفظ مفتاح API بنجاح.', 'success');
  };

  const chartData = useMemo<ChartData[]>(() => {
    const data = activeAnalysisData || evaluationData;
    if (!data) return [];
    
    return data.domains.flatMap(domain => 
        domain.axes.map(axis => ({
            subject: axis.name,
            score: axis.score,
            fullMark: 10
        }))
    );
  }, [activeAnalysisData, evaluationData]);


  const showReport = activeAnalysisData !== null;


  return (
    <div className="bg-slate-50 min-h-screen" style={{ backgroundColor: theme.primaryHex + '10' }}>
      <Header 
        theme={theme} 
        setTheme={setTheme} 
        onOpenApiKeySettings={() => setIsApiKeyModalOpen(true)}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <ApiKeyModal 
            isOpen={isApiKeyModalOpen} 
            onClose={() => setIsApiKeyModalOpen(false)}
            onSave={handleSaveApiKey}
            currentApiKey={apiKey}
        />

        {!apiKey && !showReport && (
            <WelcomeGuide onOpenApiKeySettings={() => setIsApiKeyModalOpen(true)} />
        )}

        <EvaluationForm 
          data={evaluationData} 
          setData={handleSetData} 
          onGenerate={handleShowCompass} 
          isLoading={isAnalysisLoading}
          theme={theme}
          onSave={handleSaveToHistory}
          onLoad={handleLoadLastFromHistory}
          onMerge={handleMergeEvaluations}
          loadedDate={loadedRecordDate}
        />

        {showReport && (
            <div id="report-container" ref={reportContainerRef} className="bg-slate-50 p-4 sm:p-6 rounded-xl">
                 <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <h2 className={`text-2xl font-bold ${theme.classes.text}`}>
                        نتائج التحليل
                    </h2>
                    <div className="flex items-center gap-2">
                         <button onClick={handleCombinedAnalysisAndDownload} disabled={isAnalysisLoading || isExportLoading} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-200 hover:bg-slate-300 font-semibold py-2 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait">
                            {(isAnalysisLoading || isExportLoading) ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <ImageIcon className="w-4 h-4" />
                            )}
                            <span>
                                {isAnalysisLoading ? 'جاري التحليل...' : isExportLoading ? 'جاري التحميل...' : 'تحميل التقرير كصورة'}
                            </span>
                        </button>
                    </div>
                 </div>

                <div className="space-y-6">
                    <div ref={chartContainerRef}>
                        <CompassChart data={chartData} theme={theme} />
                    </div>
                    
                    {isAnalysisLoading && <div className="text-center p-8"><p className="text-lg font-semibold text-slate-700">جاري إنشاء التحليل...</p></div>}
                    {analysisError && <div className="text-center p-8 bg-red-100 rounded-lg"><p className="text-lg font-semibold text-red-700">{analysisError}</p></div>}
                    
                    {analysisResult && (
                        <AnalysisDisplay 
                            analysis={analysisResult} 
                            theme={theme} 
                        />
                    )}
                </div>
            </div>
        )}

        {notification && (
          <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
            {notification.message}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;