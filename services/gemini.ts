
import { GoogleGenAI } from "@google/genai";

/**
 * Obtém uma dica técnica diária baseada na área do profissional.
 */
export const getDailyTip = async (category: string = "Engenharia Mecânica") => {
  // Inicialização interna para garantir resiliência e capturar a chave no momento certo
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma dica técnica curta (máximo 3 linhas) para profissionais de campo sobre ${category}. Seja extremamente profissional e prático. Não use markdown nem hashtags.`,
    });
    return response.text?.trim() || "Mantenha sempre suas ferramentas limpas e calibradas.";
  } catch (error) {
    console.error("Gemini Connection Error:", error);
    return "Verifique sempre a integridade dos EPIs antes de iniciar qualquer operação técnica.";
  }
};

/**
 * Gera um resumo técnico de um artigo.
 */
export const getArticleSummary = async (articleTitle: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Resuma em 3 linhas os principais pontos técnicos do artigo: "${articleTitle}". Foco em aplicação prática de campo.`,
    });
    return response.text?.trim() || "Resumo indisponível no momento.";
  } catch (error) {
    console.error("Gemini Connection Error:", error);
    return "Resumo técnico padrão para fins de visualização rápida de campo.";
  }
};
