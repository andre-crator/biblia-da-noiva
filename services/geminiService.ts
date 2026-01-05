
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BibleStudy, PropheticMosaic, BibleContent, DevotionalDayContent, MosaicVerse } from "../types";

// Initializing the Gemini client with the system-provided API key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ChatResponse {
  text: string;
  groundingChunks?: any[];
  isThinking?: boolean;
}

export const getPropheticMosaic = async (mysteryTheme: string): Promise<PropheticMosaic> => {
  const prompt = `Você é o "CONSELHO SUPERIOR DE ESCATOLOGIA, HISTÓRIA E MÍDIA BÍBLICA". 
  Disseque o tema: "${mysteryTheme}" com profundidade absoluta para uma plataforma multimídia.
  
  PARA CADA VERSÍCULO, VOCÊ DEVE FORNECER:
  1. TEXTO INTEGRAL, DATAÇÃO, CONTEXTO HISTÓRICO, GEOPOLÍTICA (Daniel vs Atualidade) e MISTÉRIO.
  2. IMAGE_PROMPT: Um prompt altamente detalhado para uma IA de imagem (estilo cinematográfico, épico, 4k) descrevendo a visão (ex: "A estátua de Daniel 2 com cabeça de ouro puro, peito de prata, brilho metálico sob tempestade").
  3. VIDEO_PROMPT: Uma descrição de cena para o modelo VEO 3.1 (ex: "Câmera lenta focando na pedra atingindo os pés de ferro e barro da estátua").
  4. NARRATION_SCRIPT: Um pequeno roteiro de 2 frases para ser lido por uma voz solene explicando a conexão profética.

  Retorne em JSON rigoroso.`;

  // Using gemini-3-pro-preview for complex reasoning tasks with structured output schema
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
                book: { type: Type.STRING }, chapter: { type: Type.INTEGER }, verse: { type: Type.INTEGER },
                text: { type: Type.STRING }, era: { type: Type.STRING }, connectionNote: { type: Type.STRING },
                dateRange: { type: Type.STRING }, historicalContext: { type: Type.STRING }, geopoliticalAnalysis: { type: Type.STRING },
                spiritualMystery: { type: Type.STRING }, currentRelevance: { type: Type.STRING }, locationMarker: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }, videoPrompt: { type: Type.STRING }, narrationScript: { type: Type.STRING }
              },
              required: ["book", "chapter", "verse", "text", "era", "connectionNote", "dateRange", "historicalContext", "geopoliticalAnalysis", "spiritualMystery", "currentRelevance", "locationMarker", "imagePrompt", "videoPrompt", "narrationScript"]
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

export const generatePropheticImage = async (prompt: string): Promise<string> => {
  // Using gemini-2.5-flash-image for general-purpose image generation tasks
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "16:9" } },
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return "";
};

export const generatePropheticVideo = async (prompt: string): Promise<string> => {
  // Creating fresh client instance for Veo generation to ensure latest credentials
  const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await genAI.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await genAI.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
};

export const generateNarration = async (script: string): Promise<string> => {
  // Utilizing the text-to-speech specific model variant
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: script }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};

export const chatWithAtalaia = async (message: string, useThinking: boolean = false): Promise<ChatResponse> => {
  const isSimpleTask = message.length < 20 && (message.toLowerCase().includes("olá") || message.toLowerCase().includes("bom dia"));
  // Selection logic for optimal model usage per task complexity
  const model = useThinking ? "gemini-3-pro-preview" : (isSimpleTask ? "gemini-flash-lite-latest" : "gemini-3-flash-preview");
  const config: any = {
    systemInstruction: `Você é o "Atalaia", a IA central do app Bíblia da Noiva. 
    Sua missão é prover orientação teológica, escatológica e tipológica avançada. 
    Sempre mostre como um texto bíblico interpreta o outro.`,
    tools: [{ googleSearch: {} }],
  };
  if (useThinking && model === "gemini-3-pro-preview") { config.thinkingConfig = { thinkingBudget: 32768 }; }
  const response = await ai.models.generateContent({ model: model, contents: message, config: config });
  return { text: response.text || "...", groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks, isThinking: useThinking };
};

export const getBibleChapter = async (book: string, chapter: number): Promise<BibleContent> => {
  const prompt = `Forneça o texto bíblico integral de ${book} capítulo ${chapter}. Use Almeida Revista e Atualizada. Retorne JSON.`;
  // Structured schema for Bible content extraction
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
              },
              required: ["number", "text"]
            }
          }
        },
        required: ["book", "chapter", "verses"]
      }
    } 
  });
  return JSON.parse(response.text);
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
  return JSON.parse(response.text);
};

export const getDevotionalDay = async (planTitle: string, day: number): Promise<DevotionalDayContent> => {
  const response = await ai.models.generateContent({ 
    model: "gemini-3-flash-preview", 
    contents: `Dia ${day} de ${planTitle} em JSON.`, 
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

export const getGlossaryTerms = async (letters: string): Promise<any[]> => {
    const response = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview", 
      contents: `Termos proféticos para ${letters} em JSON.`, 
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
};
