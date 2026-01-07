
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BibleStudy, PropheticMosaic, BibleContent, DevotionalDayContent, MosaicVerse } from "../types";

/**
 * Serviço Central de Inteligência Profética (Atalaia)
 * Utiliza os modelos mais recentes da série Gemini 3 e 2.5
 */

export interface ChatResponse {
  text: string;
  groundingChunks?: any[];
  isThinking?: boolean;
}

/**
 * Gera um Mosaico Profético com Profundidade Multidimensional Extrema.
 * Protocolo de Sala de Guerra: Integra Bíblia, História e Geopolítica Atual.
 */
export const getPropheticMosaic = async (mysteryTheme: string): Promise<PropheticMosaic> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Você é o "ATALAIA - SISTEMA DE INTELIGÊNCIA DE DEFESA PROFÉTICA". 
  Sua missão é realizar uma análise de PROFUNDIDADE MÁXIMA sobre: "${mysteryTheme}".
  
  Trate cada versículo como uma "Estação de Inteligência". Você deve fornecer uma cadeia de 3 a 4 versículos chave.
  
  PARA CADA VERSÍCULO NA CADEIA, VOCÊ DEVE GERAR OBRIGATORIAMENTE ESTES CAMPOS:
  1. book: Nome do livro bíblico.
  2. chapter: Número do capítulo.
  3. verse: Número do versículo.
  4. text: Texto bíblico integral (Almeida).
  5. era: Escolha entre 'Sombra (AT)', 'Realidade (NT)' ou 'Revelação Final (Apocalipse)'.
  6. connectionNote: Uma nota curta ligando este versículo ao próximo na cadeia profética.
  7. dateRange: Datação histórica absoluta (ex: 605 a.C.).
  8. historicalContext: Detalhes arqueológicos e culturais da época.
  9. geopoliticalAnalysis: Como essa profecia se manifesta na geopolítica de HOJE (ex: BRICS, Moedas Digitais, Conflitos no Oriente Médio).
  10. spiritualMystery: O código tipológico/espiritual por trás do símbolo.
  11. currentRelevance: Aplicação prática para a Igreja hoje.
  12. locationMarker: Coordenadas ou nome geográfico do local da profecia.
  13. imagePrompt: Prompt CINEMATOGRÁFICO detalhado (8k, IMAX style) para gerar a visão.
  14. videoPrompt: Prompt para animação (VEO) descrevendo movimento épico.
  15. narrationScript: Script solene para ser lido por voz de IA.

  Retorne APENAS o JSON conforme o esquema definido. Não inclua conversas fora do JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      // Configuração recomendada para modelos com thinkingBudget
      maxOutputTokens: 20000,
      thinkingConfig: { thinkingBudget: 10000 },
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
                locationMarker: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
                videoPrompt: { type: Type.STRING },
                narrationScript: { type: Type.STRING }
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

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Falha ao processar Mosaico Profético:", response.text);
    throw new Error("Interferência na frequência profética. Tente novamente.");
  }
};

export const generatePropheticImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `Epic cinematic biblical prophecy illustration, ultra-detailed, 8k, dramatic lighting: ${prompt}` }] },
    config: { imageConfig: { aspectRatio: "16:9" } },
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return "";
};

export const generatePropheticVideo = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Masterpiece cinematic prophecy animation, slow panning: ${prompt}`,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
};

export const generateNarration = async (script: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = useThinking ? "gemini-3-pro-preview" : "gemini-3-flash-preview";
  const config: any = {
    systemInstruction: `Você é o "Atalaia", a IA de Inteligência Escatológica da Bíblia da Noiva. Use grounding global e analise o cenário mundial com base nas Escrituras.`,
    tools: [{ googleSearch: {} }],
  };
  if (useThinking) { config.thinkingConfig = { thinkingBudget: 16000 }; }
  const response = await ai.models.generateContent({ model: model, contents: message, config: config });
  return { text: response.text || "...", groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks, isThinking: useThinking };
};

export const getBibleChapter = async (book: string, chapter: number): Promise<BibleContent> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Forneça o texto integral de ${book} ${chapter} em JSON estruturado com versículos numerados.`;
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({ 
    model: "gemini-3-pro-preview", 
    contents: `Gere o Volume ${volumeNumber} da Enciclopédia Escatológica em JSON profundo.`, 
    config: { responseMimeType: "application/json" } 
  });
  return JSON.parse(response.text);
};

export const getDevotionalDay = async (planTitle: string, day: number): Promise<DevotionalDayContent> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({ 
    model: "gemini-3-flash-preview", 
    contents: `Gere o Dia ${day} do plano "${planTitle}" em JSON.`, 
    config: { responseMimeType: "application/json" } 
  });
  return { ...JSON.parse(response.text), day, planTitle };
};

export const getGlossaryTerms = async (letters: string): Promise<any[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview", 
      contents: `Gere 3 termos proféticos começando com ${letters} em JSON. Inclua o nome de um ícone da Lucide-react (ex: Flame, Shield, Sun) para cada termo.`, 
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
