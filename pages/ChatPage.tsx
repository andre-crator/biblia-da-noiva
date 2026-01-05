
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAtalaia, ChatResponse } from '../services/geminiService';
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Trash2, 
  Sparkles, 
  Link as LinkIcon, 
  Globe, 
  ExternalLink, 
  MapPin,
  BrainCircuit,
  Zap
} from 'lucide-react';

interface Message {
  role: 'user' | 'atalaia';
  text: string;
  sources?: any[];
  mapSources?: any[];
  isThinking?: boolean;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'atalaia', 
      text: 'Saudações, Noiva de Cristo. Sou o Atalaia. Com o poder do Gemini 3 Pro e ferramentas de busca global, estou pronto para perscrutar os sinais dos tempos com você. Deseja uma análise rápida ou profunda?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response: ChatResponse = await chatWithAtalaia(userMsg, useThinking);
      
      const webSources = response.groundingChunks?.filter(chunk => chunk.web).map(chunk => chunk.web);
      const mapsSources = response.groundingChunks?.filter(chunk => chunk.maps).map(chunk => chunk.maps);

      setMessages(prev => [...prev, { 
        role: 'atalaia', 
        text: response.text,
        sources: webSources,
        mapSources: mapsSources,
        isThinking: response.isThinking
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'atalaia', text: "Houve um erro na comunicação celestial. Tente novamente mais tarde." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]">
             <Bot size={24} />
           </div>
           <div>
             <h1 className="text-xl font-cinzel font-bold text-white leading-none">Atalaia AI</h1>
             <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               Grounding Ativo (Web & Maps)
             </span>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setUseThinking(!useThinking)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              useThinking 
                ? 'bg-purple-900/30 border-purple-500 text-purple-400' 
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
          >
            {useThinking ? <BrainCircuit size={14} /> : <Zap size={14} />}
            {useThinking ? 'Meditação Profunda (Thinking)' : 'Resposta Rápida (Flash)'}
          </button>
          
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
            title="Limpar conversa"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                m.role === 'user' ? 'bg-slate-700' : 'bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.2)]'
              }`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="flex flex-col gap-3">
                <div className={`p-4 rounded-2xl ${
                  m.role === 'user' 
                    ? 'bg-slate-800 text-slate-100 rounded-tr-none shadow-lg shadow-black/20' 
                    : 'bg-slate-900 border border-amber-900/30 text-slate-200 rounded-tl-none leading-relaxed shadow-xl'
                }`}>
                  {m.isThinking && m.role === 'atalaia' && (
                    <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-[9px] uppercase tracking-widest border-b border-purple-900/30 pb-2">
                      <BrainCircuit size={12} /> Perscrutando as Profundezas...
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-sm md:text-base">{m.text}</p>
                </div>
                
                {/* Maps Sources */}
                {m.mapSources && m.mapSources.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-2 mb-2 px-1">
                       <MapPin size={12} className="text-red-400" />
                       <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Locais Proféticos</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {m.mapSources.map((map, idx) => (
                         <a 
                           key={idx} 
                           href={map.uri} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center gap-2 px-3 py-1.5 bg-red-900/10 border border-red-900/20 hover:border-red-400/50 rounded-xl text-[10px] text-red-400 font-bold transition-all"
                         >
                           <MapPin size={10} />
                           <span>{map.title || "Ver Localização"}</span>
                         </a>
                       ))}
                    </div>
                  </div>
                )}

                {/* Web Sources */}
                {m.sources && m.sources.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-2 mb-2 px-1">
                       <Globe size={12} className="text-blue-400" />
                       <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Fontes Consultadas</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {m.sources.map((source, idx) => (
                         <a 
                           key={idx} 
                           href={source.uri} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/10 border border-blue-900/20 hover:border-blue-400/50 rounded-full text-[10px] text-blue-400 font-bold transition-all hover:bg-blue-900/20"
                         >
                           <LinkIcon size={10} />
                           <span className="max-w-[150px] truncate">{source.title || "Ver Fonte"}</span>
                           <ExternalLink size={10} />
                         </a>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[85%]">
               <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center animate-pulse">
                 <Sparkles size={16} className="text-white" />
               </div>
               <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none italic text-slate-500 flex flex-col gap-3">
                 <div className="flex items-center gap-3">
                   <Loader2 size={16} className="animate-spin text-amber-500" />
                   <span>O Atalaia está perscrutando as profundezas...</span>
                 </div>
                 {useThinking && (
                   <div className="flex items-center gap-2 text-[9px] text-purple-400 font-bold uppercase tracking-widest animate-pulse">
                     <BrainCircuit size={12} /> Utilizando Processamento de Meditação Profunda
                   </div>
                 )}
               </div>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="mt-6">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={useThinking ? "Descreva seu questionamento complexo para meditação profunda..." : "Pergunte sobre eventos atuais, Israel ou sinais mundiais..."}
            className={`w-full bg-slate-900 border rounded-2xl px-6 py-4 pr-14 text-slate-200 outline-none resize-none h-16 md:h-20 shadow-inner transition-colors ${
              useThinking ? 'border-purple-900/50 focus:border-purple-500' : 'border-slate-800 focus:border-amber-500'
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${
              useThinking ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20' : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20'
            } disabled:opacity-50`}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
            Respostas fundamentadas em Google Search & Maps Grounding
          </p>
          <div className="h-px flex-1 bg-slate-900"></div>
          <p className="text-[9px] text-amber-600/60 uppercase tracking-widest font-black">
            Até que Ele venha
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
