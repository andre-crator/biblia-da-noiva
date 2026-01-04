
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { BibleStudy, ThematicChapter, BibleContent, DevotionalDayContent } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getThematicChapter = async (theme: string): Promise<ThematicChapter> => {
  const prompt = `Você é o "Mestre do Quebra-Cabeça Profético". Sua tarefa é montar a revelação bíblica sobre o tema: "${theme}".
  
  REGRAS DE MONTAGEM:
  1. Identifique textos que são "espelhos" um do outro (Ex: Daniel 7 e Apocalipse 13, Gênesis 2 e Apocalipse 21).
  2. Una a Lei, os Profetas, os Evangelhos e o Apocalipse.
  3. No campo 'puzzleConnections', você deve criar pares de versículos: um do Antigo Testamento (origin) e seu correspondente revelado no Novo Testamento/Apocalipse (destiny). Explique a "Chave da Revelação" que os une.
  4. Traga profundidade máxima, não apenas liste versículos, mas conecte as peças.
  
  Retorne em JSON seguindo rigorosamente o schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
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

export const getDevotionalDay = async (planTitle: string, day: number): Promise<DevotionalDayContent> => {
  const isHighConsecration = planTitle.includes("Sétimo Anjo") || planTitle.includes("Trombeta");
  const prompt = `Você é um Pastor e Mestre Bíblico especializado em Escatologia Profética e Tipologia. Gere o conteúdo do Dia ${day} do plano de devocional: "${planTitle}". ${isHighConsecration ? "Este é um plano de ALTA CONSAGRAÇÃO. Foque no mistério de Deus, no soar das trombetas, no julgamento e na glória final. Use linguagem solene e profunda." : "Foco: Despertamento da Noiva, Arrebatamento e Santificação."} Siga a estrutura rigorosa da Bíblia da Noiva (11 pontos). Retorne em JSON.`;
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
          qrCodeLink: { type: Type.STRING }
        },
        required: ["title", "bibleText", "context", "theology", "typology", "apocalypseConnection", "practicalApplication", "devotionalActivation", "reflectiveQuestions", "visualSuggestion", "qrCodeLink"]
      }
    }
  });
  const data = JSON.parse(response.text);
  return { ...data, day, planTitle };
};

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

export const getEncyclopediaVolume = async (volumeNumber: number): Promise<BibleStudy> => {
  const isVolumeOne = volumeNumber === 1;
  const prompt = `Gere o Volume ${volumeNumber} da Enciclopédia Escatológica "Bíblia da Noiva". ${isVolumeOne ? "TEMA OBRIGATÓRIO: 'A Aliança Eterna: O Mistério do Noivo e da Noiva'. Este é o volume fundamental. Deve conectar Adão e Eva, Isaque e Rebeca, Cristo e a Igreja, e as Bodas do Cordeiro." : "Siga a sequência lógica de revelação profunda."} Siga rigorosamente a estrutura JSON com foco em profundidade teológica, tipológica e escatológica.`;
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
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
        },
        required: ["title", "bibleText", "context", "theology", "typology", "apocalypseConnection", "practicalApplication", "devotionalActivation", "reflectiveQuestions", "visualSuggestion", "qrCodeLink"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const getBibleChapter = async (book: string, chapter: number): Promise<BibleContent> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Forneça o texto bíblico integral de ${book} capítulo ${chapter}.`,
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
      systemInstruction: `Você é o "Atalaia", a IA central do app Bíblia da Noiva.`,
    }
  });
  const response = await chat.sendMessage({ message });
  return response.text;
};

export const getGlossaryTerms = async (letters: string): Promise<any[]> => {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gere 3 termos escatológicos, tipológicos ou proféticos para as letras ${letters}. 
        Para cada termo, forneça uma definição profunda, a base bíblica chave, a aplicação profética para os dias atuais e uma sugestão de ícone visual (nome de um ícone do Lucide como 'Flame', 'Anchor', 'Sun', etc).`,
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
