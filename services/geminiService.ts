
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { BibleStudy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getEncyclopediaVolume = async (volumeNumber: number): Promise<BibleStudy> => {
  const prompt = `Gere o Volume ${volumeNumber} da Enciclopédia Escatológica "Bíblia da Noiva".
  Siga rigorosamente esta estrutura JSON:
  {
    "title": "Título Profético",
    "bibleText": "Texto bíblico base com referências",
    "context": "Contexto histórico e espiritual",
    "theology": "Análise teológica profunda",
    "typology": "Tipologia profética (ex: Noivo/Noiva, Óleo, etc)",
    "apocalypseConnection": "Conexões com o livro de Apocalipse",
    "practicalApplication": "Aplicação prática para a Igreja hoje",
    "devotionalActivation": "Ativação espiritual e oração",
    "reflectiveQuestions": ["Pergunta 1", "Pergunta 2"],
    "visualSuggestion": "Descrição de um mapa ou quadro comparativo",
    "qrCodeLink": "Sugestão de tema para vídeo/áudio complementar"
  }
  Assunto sugerido para este volume: Escatologia e preparação da Noiva.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          bibleText: { type: Type.STRING },
          context: { type: Type.STRING },
          theology: { type: Type.STRING },
          typology: { type: Type.STRING },
          apocalypseConnection: { type: Type.STRING },
          practicalApplication: { type: Type.STRING },
          devotionalActivation: { type: Type.STRING },
          reflectiveQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          visualSuggestion: { type: Type.STRING },
          qrCodeLink: { type: Type.STRING },
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const chatWithAtalaia = async (message: string, history: { role: string, parts: string }[] = []) => {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `Você é o "Atalaia", a IA central do app Bíblia da Noiva.
      Sua missão é ensinar Teologia Bíblica Avançada, Escatologia e Tipologia.
      Sempre cite as Escrituras. Seja profundo, fiel e exortativo.
      Não invente doutrinas. Foque na preparação da Noiva (Igreja) para a volta do Noivo (Cristo).`,
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const getGlossaryTerms = async (letters: string): Promise<any[]> => {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gere 3 termos escatológicos começando com as letras ${letters} para o Glossário Bíblia da Noiva.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        term: { type: Type.STRING },
                        definition: { type: Type.STRING },
                        bibleBase: { type: Type.STRING },
                        propheticApplication: { type: Type.STRING },
                        icon: { type: Type.STRING, description: "Nome de um ícone Lucide" }
                    }
                }
            }
        }
    });
    return JSON.parse(response.text);
}
