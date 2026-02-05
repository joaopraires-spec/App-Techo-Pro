
import { GoogleGenAI } from "@google/genai";

// Fix: Initialized GoogleGenAI with API_KEY directly as per the @google/genai SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyTip = async (category: string = "Engenharia Mecânica") => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma dica técnica curta (máximo 3 linhas) para profissionais de campo sobre ${category}. Seja extremamente profissional e prático.`,
    });
    return response.text || "Mantenha sempre suas ferramentas limpas e calibradas.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Verifique sempre a integridade dos EPIs antes de iniciar qualquer operação técnica.";
  }
};

export const getArticleSummary = async (articleTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Resuma em 3 linhas os principais pontos técnicos de um artigo com o título: "${articleTitle}". Foco em aplicação prática.`,
    });
    return response.text || "Resumo indisponível no momento.";
  } catch (error) {
    return "Resumo técnico padrão para fins de visualização rápida de campo.";
  }
};
