
import { GoogleGenAI, Type } from "@google/genai";
import { BibleStudy, ThematicChapter, BibleContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getEncyclopediaVolume = async (volumeNumber: number): Promise<BibleStudy> => {
  const prompt = `Gere o Volume ${volumeNumber} da Enciclopédia Escatológica "Bíblia da Noiva".
  Siga rigorosamente a estrutura JSON com foco em profundidade teológica.`;

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

export const getThematicChapter = async (theme: string): Promise<ThematicChapter> => {
  const prompt = `Organize a Bíblia Temática para o tema: "${theme}". 
  Reúna versículos da Lei, Profetas, Evangelhos e Apocalipse que convergem para este assunto.
  Mantenha o tom de mestre bíblico fiel.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          centralDeclaration: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                era: { type: Type.STRING },
                verses: { type: Type.STRING },
                context: { type: Type.STRING }
              }
            }
          },
          timeline: { type: Type.STRING },
          convergence: { type: Type.STRING },
          application: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const getBibleChapter = async (book: string, chapter: number): Promise<BibleContent> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Forneça o texto bíblico integral de ${book} capítulo ${chapter} (Versão Almeida Fiel). 
    Retorne apenas os versículos em formato JSON estruturado.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          book: { type: Type.STRING },
          chapter: { type: Type.INTEGER },
          verses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                number: { type: Type.INTEGER },
                text: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const chatWithAtalaia = async (message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `Você é o "Atalaia", a IA central do app Bíblia da Noiva. 
      Sua missão é preparar a Noiva para o Noivo através da Palavra. 
      Use Teologia Bíblica Avançada e Escatologia Profética.`,
    }
  });
  const response = await chat.sendMessage({ message });
  return response.text;
};

export const getGlossaryTerms = async (letters: string): Promise<any[]> => {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gere 3 termos escatológicos para as letras ${letters}.`,
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
                        icon: { type: Type.STRING }
                    }
                }
            }
        }
    });
    return JSON.parse(response.text);
}
