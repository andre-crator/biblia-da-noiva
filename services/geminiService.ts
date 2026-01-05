
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BibleStudy, ThematicChapter, BibleContent, DevotionalDayContent } from "../types";

// Inicialização padrão do SDK
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ChatResponse {
  text: string;
  groundingChunks?: any[];
  isThinking?: boolean;
}

/**
 * Retorna o conteúdo temático unindo passagens bíblicas.
 * Agora utiliza Gemini 3 Flash para maior velocidade e Search Grounding para notícias atuais.
 */
export const getThematicChapter = async (theme: string): Promise<ThematicChapter> => {
  const prompt = `Você é o "Mestre do Quebra-Cabeça Profético". Sua tarefa é montar a revelação bíblica sobre o tema: "${theme}".
  
  REGRAS DE MONTAGEM:
  1. Identifique textos que são "espelhos" um do outro (Ex: Daniel 7 e Apocalipse 13, Gênesis 2 e Apocalipse 21).
  2. Una a Lei, os Profetas, os Evangelhos e o Apocalipse.
  3. No campo 'puzzleConnections', você deve criar pares de versículos: um do Antigo Testamento (origin) e seu correspondente revelado no Novo Testamento/Apocalipse (destiny). Explique a "Chave da Revelação" que os une.
  4. Use o Google Search para verificar se há eventos mundiais RECENTES (notícias, tensões geopolíticas, avanços tecnológicos) que se alinham a este tema profético e inclua na 'convergence'.
  
  Retorne em JSON seguindo rigorosamente o schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          centralDeclaration: { type: Type.STRING },
          puzzleConnections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originText: { type: Type.STRING },
                originRef: { type: Type.STRING },
                destinyText: { type: Type.STRING },
                destinyRef: { type: Type.STRING },
                revelationKey: { type: Type.STRING }
              },
              required: ["originText", "originRef", "destinyText", "destinyRef", "revelationKey"]
            }
          },
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
        },
        required: ["title", "centralDeclaration", "puzzleConnections", "sections", "timeline", "convergence", "application"]
      }
    }
  });

  return JSON.parse(response.text);
};

/**
 * Gera áudio solene para o devocional usando Gemini 2.5 Flash Preview TTS.
 */
export const generateDevotionalAudio = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Leia com voz solene, inspiradora e pausada, como um mestre bíblico revelando mistérios: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Charon' },
        },
      },
    },
  });
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Falha ao gerar áudio");
  return base64Audio;
};

/**
 * Chat central "Atalaia" usando Gemini 3 Pro com suporte a Thinking Budget.
 */
export const chatWithAtalaia = async (message: string, useThinking: boolean = false): Promise<ChatResponse> => {
  const isSimpleTask = message.length < 20 && (message.toLowerCase().includes("olá") || message.toLowerCase().includes("bom dia"));
  const model = useThinking ? "gemini-3-pro-preview" : (isSimpleTask ? "gemini-2.5-flash-lite-latest" : "gemini-3-flash-preview");
  
  const config: any = {
    systemInstruction: `Você é o "Atalaia", a IA central do app Bíblia da Noiva. 
    Sua missão é prover orientação teológica, escatológica e tipológica avançada. 
    Use Google Search para eventos mundiais e Google Maps para localizações bíblicas ou tensões geopolíticas em Israel e no Oriente Médio.`,
    tools: [{ googleSearch: {} }, { googleMaps: {} }],
  };

  if (useThinking && model === "gemini-3-pro-preview") {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: message,
    config: config
  });

  return {
    text: response.text || "O Atalaia está em silêncio... Tente novamente.",
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
    isThinking: useThinking
  };
};

/**
 * Obtém localizações bíblicas ou pontos geográficos proféticos usando Maps Grounding.
 */
export const getPropheticMaps = async (locationName: string): Promise<ChatResponse> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Forneça informações geográficas e links de mapa para o local bíblico ou ponto estratégico: ${locationName}. Explique sua importância na escatologia.`,
    config: {
      tools: [{ googleMaps: {} }],
    }
  });

  return {
    text: response.text || "",
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const getDevotionalDay = async (planTitle: string, day: number): Promise<DevotionalDayContent> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gere o conteúdo do Dia ${day} do plano de devocional: "${planTitle}". Siga a estrutura JSON de 11 pontos da Bíblia da Noiva.`,
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
          qrCodeLink: { type: Type.STRING }
        },
        required: ["title", "bibleText", "context", "theology", "typology", "apocalypseConnection", "practicalApplication", "devotionalActivation", "reflectiveQuestions", "visualSuggestion", "qrCodeLink"]
      }
    }
  });
  return { ...JSON.parse(response.text), day, planTitle };
};

export const getEncyclopediaVolume = async (volumeNumber: number): Promise<BibleStudy> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Gere o Volume ${volumeNumber} da Enciclopédia Escatológica.`,
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
        },
        required: ["title", "bibleText", "context", "theology", "typology", "apocalypseConnection", "practicalApplication", "devotionalActivation", "reflectiveQuestions", "visualSuggestion", "qrCodeLink"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const getBibleChapter = async (book: string, chapter: number): Promise<BibleContent> => {
  const prompt = `Forneça o texto bíblico integral de ${book} capítulo ${chapter}. 
  Use uma tradução fiel e consagrada em português (como Almeida Revista e Atualizada ou NVI). 
  Retorne TODOS os versículos do capítulo no formato JSON especificado.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
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
        },
        required: ["book", "chapter", "verses"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const getGlossaryTerms = async (letters: string): Promise<any[]> => {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gere 3 termos proféticos para ${letters} em JSON.`,
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
                    },
                    required: ["term", "definition", "bibleBase", "propheticApplication", "icon"]
                }
            }
        }
    });
    return JSON.parse(response.text);
}
