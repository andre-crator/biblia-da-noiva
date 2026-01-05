
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BibleStudy, PropheticMosaic, BibleContent, DevotionalDayContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ChatResponse {
  text: string;
  groundingChunks?: any[];
  isThinking?: boolean;
}

/**
 * Gera um Mosaico Profético: Versículos de diferentes livros que se completam.
 * Usa Gemini 3 Pro com Meditação Profunda para garantir a conexão teológica perfeita.
 */
export const getPropheticMosaic = async (mysteryTheme: string): Promise<PropheticMosaic> => {
  const prompt = `Você é o "Escriba Celestial". Sua tarefa é montar um MOSAICO PROFÉTICO sobre o tema: "${mysteryTheme}".
  
  O que é um Mosaico Profético?
  É uma sequência de leitura onde os versículos de livros DIFERENTES se completam como se fossem um único texto.
  Exemplo: Se o tema é "O Cordeiro", você deve unir Êxodo 12 (O Cordeiro da Páscoa), Isaías 53 (O Cordeiro Mudo), João 1 (O Cordeiro de Deus) e Apocalipse 5 (O Cordeiro no Trono).
  
  REGRAS:
  1. No campo 'chains', forneça o TEXTO BÍBLICO INTEGRAL de cada versículo chave.
  2. Cada versículo deve ter uma 'connectionNote' que explica como ele se "encaixa" no anterior para formar a revelação completa.
  3. A ordem deve ser cronológica da revelação (AT -> NT -> Apocalipse).
  4. Use traduções tradicionais e solenes (Almeida).
  
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
                connectionNote: { type: Type.STRING }
              },
              required: ["book", "chapter", "verse", "text", "era", "connectionNote"]
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
