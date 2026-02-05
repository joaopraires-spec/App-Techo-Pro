
import { GoogleGenAI } from "@google/genai";

/**
 * Gets a daily technical tip based on the professional area using Gemini.
 * @param category The technical area of the professional.
 * @returns A short technical tip.
 */
export const getDailyTip = async (category: string = "Engenharia Mecânica") => {
  // Always initialize GoogleGenAI with the API_KEY from process.env right before use.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma dica técnica curta (máximo 3 linhas) para profissionais de campo sobre ${category}. Seja extremamente profissional e prático.`,
    });
    // Access .text property directly as per guidelines.
    return response.text || "Mantenha sempre suas ferramentas limpas e calibradas.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Verifique sempre a integridade dos EPIs antes de iniciar qualquer operação técnica.";
  }
};

/**
 * Gets a summary of a technical article using Gemini.
 * @param articleTitle The title of the article to summarize.
 * @returns A 3-line technical summary.
 */
export const getArticleSummary = async (articleTitle: string) => {
  // Always initialize GoogleGenAI with the API_KEY from process.env right before use.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Resuma em 3 linhas os principais pontos técnicos de um artigo com o título: "${articleTitle}". Foco em aplicação prática.`,
    });
    // Access .text property directly as per guidelines.
    return response.text || "Resumo indisponível no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Resumo técnico padrão para fins de visualização rápida de campo.";
  }
};
