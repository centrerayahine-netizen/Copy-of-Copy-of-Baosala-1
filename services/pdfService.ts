import { cairoFont } from '../font/Cairo-Regular-normal';
import { AnalysisResult } from '../types';

declare const jspdf: any;
declare const html2canvas: any;

export const generatePdf = async (
  chartElement: HTMLElement,
  analysis: AnalysisResult,
  educatorName: string
): Promise<void> => {
  if (!chartElement || !analysis) {
    console.error("PDF generation failed: elements or analysis data were not found.");
    return Promise.reject("Elements or data for PDF not found.");
  }

  try {
    const { jsPDF } = jspdf;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    // 1. Setup Font and Page
    doc.addFileToVFS('Cairo-Regular.ttf', cairoFont);
    doc.addFont('Cairo-Regular.ttf', 'Cairo', 'normal');
    doc.setFont('Cairo');
    doc.setR2L(true);

    // FIX: Define contentWidth during page object initialization to fix TypeScript type inference error.
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageMargin = 15;
    const page = {
      width: pageWidth,
      height: doc.internal.pageSize.getHeight(),
      margin: pageMargin,
      contentWidth: pageWidth - 2 * pageMargin,
    };

    let yPos = page.margin;

    // 2. Add Cover Page Header
    doc.setFontSize(22);
    doc.text('تقرير أداء المربية', page.width - page.margin, yPos + 5, { align: 'right' });
    yPos += 10;
    doc.setFontSize(16);
    doc.text(educatorName, page.width - page.margin, yPos + 5, { align: 'right' });
    yPos += 7;
    doc.setFontSize(10);
    doc.text(`تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-EG')}`, page.width - page.margin, yPos + 5, { align: 'right' });
    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(page.margin, yPos, page.width - page.margin, yPos);
    yPos += 10;

    // 3. Add Chart Image
    const chartCanvas = await html2canvas(chartElement, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    const chartImgData = chartCanvas.toDataURL('image/png');
    const chartImgHeight = (chartCanvas.height * page.contentWidth) / chartCanvas.width;
    if (yPos + chartImgHeight > page.height - page.margin) {
      doc.addPage();
      yPos = page.margin;
    }
    doc.addImage(chartImgData, 'PNG', page.margin, yPos, page.contentWidth, chartImgHeight);

    // 4. Add Analysis Text Content
    doc.addPage();
    yPos = page.margin;

    // Helper function to render text sections with page breaks
    const renderSection = (title: string, content: string | string[], isList = false) => {
      // Check for page break before title
      if (yPos + 20 > page.height - page.margin) {
        doc.addPage();
        yPos = page.margin;
      }
      doc.setFontSize(16);
      doc.text(title, page.width - page.margin, yPos, { align: 'right' });
      yPos += 8;

      doc.setFontSize(11);

      if (isList && Array.isArray(content)) {
        content.forEach(item => {
          const lines = doc.splitTextToSize(`- ${item}`, page.contentWidth);
          const sectionHeight = doc.getTextDimensions(lines).h;
          if (yPos + sectionHeight > page.height - page.margin) {
            doc.addPage();
            yPos = page.margin;
          }
          doc.text(lines, page.width - page.margin, yPos, { align: 'right' });
          yPos += sectionHeight + 2;
        });
      } else if (!isList && typeof content === 'string') {
        const lines = doc.splitTextToSize(content, page.contentWidth);
        const sectionHeight = doc.getTextDimensions(lines).h;
        if (yPos + sectionHeight > page.height - page.margin) {
          doc.addPage();
          yPos = page.margin;
        }
        doc.text(lines, page.width - page.margin, yPos, { align: 'right' });
        yPos += sectionHeight;
      }
      yPos += 10; // Spacing after section
    };
    
    // Render all analysis sections
    renderSection('التحليل الشامل والملخص', analysis.summary);
    renderSection('نقاط القوة', analysis.strengths, true);
    renderSection('جوانب للتطوير', analysis.areasForImprovement, true);
    renderSection('توصيات عملية', analysis.suggestions, true);
    
    const belbinAnalysis = analysis.belbinRolesAnalysis;
    if (belbinAnalysis) {
        // Simple markdown parsing for Belbin text
        const belbinContent = belbinAnalysis
            .replace(/###\s*(.*)/g, '$1') // remove h3
            .replace(/##\s*(.*)/g, '$1') // remove h2
            .replace(/\*\*(.*)\*\*/g, '$1') // remove bold
            .replace(/\*\s/g, '- '); // change bullets
        renderSection('تحليل أدوار الفريق (Belbin)', belbinContent);
    }


    // 5. Save PDF
    doc.save(`تقرير-${educatorName.replace(/\s/g, '_')}.pdf`);

  } catch (error) {
    console.error("Error generating PDF: ", error);
    throw new Error("Failed to generate PDF due to an unexpected error.");
  }
};