// Declare global variables from script tags to satisfy TypeScript
declare const html2canvas: any;

export const generateImageReport = async (
  reportElement: HTMLElement,
  educatorName: string
): Promise<void> => {
  if (!reportElement) {
    console.error("Image generation failed: report element not found.");
    return Promise.reject("Element for image not found.");
  }

  try {
    const canvas = await html2canvas(reportElement, {
      scale: 2, // for higher resolution
      backgroundColor: '#f8fafc', // Match the body background color (slate-50)
      useCORS: true,
      // The default window-size based capture should be sufficient.
    });
    
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `تقرير-${educatorName.replace(/\s/g, '_')}.png`;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error("Error generating image: ", error);
    throw new Error("Failed to generate image due to an unexpected error.");
  }
};
