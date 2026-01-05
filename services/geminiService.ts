
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BibleStudy, PropheticMosaic, BibleContent, DevotionalDayContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ChatResponse {
  text: string;
  groundingChunks?: any[];
  isThinking?: boolean;
}

/**
 * Gera um Mosaico Profético com Profundidade Multidimensional.
 */
export const getPropheticMosaic = async (mysteryTheme: string): Promise<PropheticMosaic> => {
  const prompt = `Você é o "CONSELHO SUPERIOR DE ESCATOLOGIA E HISTÓRIA BÍBLICA". 
  Sua tarefa é dissecar o tema: "${mysteryTheme}" com profundidade acadêmica e espiritual absoluta.
  
  O foco deve ser o livro de DANIEL e suas conexões canônicas, mas com uma análise que ignore as limitações de uma bíblia de papel.
  
  PARA CADA VERSÍCULO, VOCÊ DEVE FORNECER:
  1. O TEXTO INTEGRAL (Almeida).
  2. DATAÇÃO: O ano exato ou período (ex: 605 a.C., 539 a.C.).
  3. CONTEXTO HISTÓRICO: O que estava acontecendo no mundo secular (ex: Batalha de Carquemis).
  4. ANÁLISE GEOPOLÍTICA: Quem eram as potências mundiais e como isso se conecta com o sistema político ATUAL.
  5. MISTÉRIO ESPIRITUAL: A tipologia e o significado oculto dos símbolos.
  6. RELEVÂNCIA ATUAL: Como essa profecia de Daniel se manifesta HOJE (Tecnologia, Globalismo, Israel).
  7. LOCALIZAÇÃO: Nome do lugar geográfico para mapeamento mental.

  REGRAS:
  - Se Daniel citar a Estátua, ligue Daniel 2 com Daniel 7, Daniel 8 e Apocalipse 13 e 17.
  - Não seja genérico. Traga nomes de reis (Nabucodonosor, Ciro, Antíoco Epifânio).
  - Use tom solene e revelador.
  
  Retorne em JSON rigoroso.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          mystery: { type: Type.STRING },
          chains: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                book: { type: Type.STRING },
                chapter: { type: Type.INTEGER },
                verse: { type: Type.INTEGER },
                text: { type: Type.STRING },
                era: { type: Type.STRING },
                connectionNote: { type: Type.STRING },
                dateRange: { type: Type.STRING },
                historicalContext: { type: Type.STRING },
                geopoliticalAnalysis: { type: Type.STRING },
                spiritualMystery: { type: Type.STRING },
                currentRelevance: { type: Type.STRING },
                locationMarker: { type: Type.STRING }
              },
              required: ["book", "chapter", "verse", "text", "era", "connectionNote", "dateRange", "historicalContext", "geopoliticalAnalysis", "spiritualMystery", "currentRelevance", "locationMarker"]
            }
          },
          conclusion: { type: Type.STRING }
        },
        required: ["title", "mystery", "chains", "conclusion"]
      }
    }
  });

  return JSON.parse(response.text);
};

// ... restante das funções (chatWithAtalaia, getBibleChapter, etc. permanecem iguais)
export const chatWithAtalaia = async (message: string, useThinking: boolean = false): Promise<ChatResponse> => {
  const isSimpleTask = message.length < 20 && (message.toLowerCase().includes("olá") || message.toLowerCase().includes("bom dia"));
  const model = useThinking ? "gemini-3-pro-preview" : (isSimpleTask ? "gemini-2.5-flash-lite-latest" : "gemini-3-flash-preview");
  
  const config: any = {
    systemInstruction: `Você é o "Atalaia", a IA central do app Bíblia da Noiva. 
    Sua missão é prover orientação teológica, escatológica e tipológica avançada. 
    Sempre mostre como um texto bíblico interpreta o outro.`,
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

export const getBibleChapter = async (book: string, chapter: number): Promise<BibleContent> => {
  const prompt = `Forneça o texto bíblico integral de ${book} capítulo ${chapter}. Use Almeida Revista e Atualizada. Retorne JSON.`;
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
          verses: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { number: { type: Type.INTEGER }, text: { type: Type.STRING } } } }
        },
        required: ["book", "chapter", "verses"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateDevotionalAudio = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Leia com voz solene: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};

export const getEncyclopediaVolume = async (volumeNumber: number): Promise<BibleStudy> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Volume ${volumeNumber} da Enciclopédia Escatológica em JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING }, bibleText: { type: Type.STRING }, context: { type: Type.STRING },
          theology: { type: Type.STRING }, typology: { type: Type.STRING }, apocalypseConnection: { type: Type.STRING },
          practicalApplication: { type: Type.STRING }, devotionalActivation: { type: Type.STRING },
          reflectiveQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }, visualSuggestion: { type: Type.STRING }, qrCodeLink: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const getDevotionalDay = async (planTitle: string, day: number): Promise<DevotionalDayContent> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Dia ${day} de ${planTitle} em JSON.`,
    config: { responseMimeType: "application/json" }
  });
  return { ...JSON.parse(response.text), day, planTitle };
};

export const getGlossaryTerms = async (letters: string): Promise<any[]> => {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Termos proféticos para ${letters} em JSON.`,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text);
}

export const getPropheticMaps = async (location: string): Promise<any> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Geografia escatológica de ${location}.`,
    config: { tools: [{ googleMaps: {} }] }
  });
  return { text: response.text, groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks };
};
