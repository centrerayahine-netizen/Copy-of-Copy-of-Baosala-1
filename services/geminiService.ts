// FIX: Implement the Gemini service for analysis generation
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationData, AnalysisResult } from "../types";

// Define the response schema for Gemini
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "ملخص عام لأداء المربية في جملتين إلى ثلاث جمل.",
    },
    strengths: {
      type: Type.ARRAY,
      description: "قائمة بنقاط القوة الرئيسية للمربية، بناءً على الدرجات المرتفعة. (3-4 نقاط)",
      items: { type: Type.STRING },
    },
    areasForImprovement: {
      type: Type.ARRAY,
      description: "قائمة بالجوانب التي تحتاج إلى تطوير، بناءً على الدرجات المنخفضة. (2-3 نقاط)",
      items: { type: Type.STRING },
    },
    suggestions: {
      type: Type.ARRAY,
      description: "قائمة بتوصيات عملية وقابلة للتطبيق لتحسين الجوانب التي تحتاج إلى تطوير. (2-3 توصيات)",
      items: { type: Type.STRING },
    },
    belbinRolesAnalysis: {
        type: Type.STRING,
        description: "تحليل موجز لأدوار فريق بلبين (Belbin Team Roles) بناءً على تحليل الأداء. يجب أن يتضمن الأدوار البارزة، والأدوار المحتملة للتطوير، ونصيحة ختامية. استخدم تنسيق Markdown للعرض (عناوين ونقاط)."
    }
  },
  required: ["summary", "strengths", "areasForImprovement", "suggestions", "belbinRolesAnalysis"],
};

function formatEvaluationDataForPrompt(data: EvaluationData): string {
  let prompt = `اسم المربية: ${data.educatorName}\n\n`;
  prompt += "بيانات التقييم (الدرجة من 10):\n";
  data.domains.forEach(domain => {
    prompt += `\n- المجال: ${domain.name}\n`;
    domain.axes.forEach(axis => {
      prompt += `  - ${axis.name}: ${axis.score}/10\n`;
    });
  });
  return prompt;
}

export const generateEvaluationAnalysis = async (evaluationData: EvaluationData, apiKey: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API key is missing. Please provide a valid Gemini API key.");
  }
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash";

  const formattedData = formatEvaluationDataForPrompt(evaluationData);
  
  const prompt = `
    أنت خبير في تطوير معلمات رياض الأطفال وتحليل أدائهن، ولديك خبرة في نظريات الشخصية المهنية مثل "أدوار فريق بلبين".
    الرجاء تحليل بيانات تقييم الأداء التالية للمربية وتزويدنا بتقرير شامل ومتكامل بصيغة JSON.
    التقرير يجب أن يكون باللغة العربية، احترافي، بنّاء، وداعم.
    
    بيانات التقييم:
    ${formattedData}

    المطلوب:
    1.  **ملخص عام:** قدم ملخصًا موجزًا لأداء المربية العام.
    2.  **نقاط القوة:** حدد أبرز نقاط القوة بناءً على المحاور الأعلى تقييمًا.
    3.  **جوانب للتطوير:** حدد الجوانب التي تحتاج إلى تحسين بناءً على المحاور الأقل تقييمًا.
    4.  **توصيات عملية:** قدم توصيات واقتراحات عملية ومحددة لمساعدة المربية على تطوير الجوانب المذكورة.
    5.  **تحليل أدوار بلبين:** بناءً على التحليل أعلاه، قدم تقريرًا موجزًا بتنسيق Markdown يوضح ما يلي:
        -   **الأدوار البارزة (Top Roles):** حدد 2-3 من أدوار بلبين التي تتمتع بها المربية، مع دليل من التحليل.
        -   **الأدوار المحتملة للتطوير (Roles to Develop):** حدد 1-2 من الأدوار التي قد تكون أقل بروزًا.
        -   **نصيحة ختامية:** نصيحة موجزة حول كيفية استفادة المربية من أدوارها البارزة.
        (أدوار بلبين هي: المبادر، الباحث عن المصادر، المنسق، المحفز، المقيم، المتعاون، المنفذ، المكمل، المتخصص).

    التزم تمامًا بتنسيق JSON المحدد في responseSchema. يجب أن يكون حقل "belbinRolesAnalysis" عبارة عن سلسلة نصية تحتوي على Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    let text = response.text.trim();
    
    // Fallback for responses that might still be wrapped in markdown
    if (text.startsWith('```') && text.endsWith('```')) {
        text = text.replace(/^```json\s*|```\s*$/g, '');
    }
    
    try {
        return JSON.parse(text);
    } catch (parseError) {
        console.error("Failed to parse JSON response from Gemini API:", parseError);
        console.error("Original text from Gemini:", text);
        // Throw an error with a user-friendly message
        throw new Error("Received an invalid or malformed response from the AI. Please try again.");
    }
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate analysis from Gemini API. Please check the console for more details.");
  }
};