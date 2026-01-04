
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAtalaia } from '../services/geminiService';
import { Send, Loader2, Bot, User, Trash2, Sparkles } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'atalaia', text: string}[]>([
    { role: 'atalaia', text: 'Saudações, Noiva de Cristo. Sou o Atalaia, sua voz profética para estudos das Escrituras. Qual mistério bíblico deseja desvendar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
      const response = await chatWithAtalaia(userMsg);
      setMessages(prev => [...prev, { role: 'atalaia', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'atalaia', text: "Houve um erro na comunicação celestial. Tente novamente mais tarde." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]">
             <Bot size={24} />
           </div>
           <div>
             <h1 className="text-xl font-cinzel font-bold text-white leading-none">Atalaia AI</h1>
             <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online • Teologia Avançada</span>
           </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-slate-500 hover:text-red-500 transition-colors"
          title="Limpar conversa"
        >
          <Trash2 size={20} />
        </button>
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
              <div className={`p-4 rounded-2xl ${
                m.role === 'user' 
                  ? 'bg-slate-800 text-slate-100 rounded-tr-none' 
                  : 'bg-slate-900 border border-amber-900/30 text-slate-200 rounded-tl-none leading-relaxed'
              }`}>
                <p className="whitespace-pre-wrap text-sm md:text-base">{m.text}</p>
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
               <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none italic text-slate-500 flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin" />
                 O Atalaia está perscrutando as profundezas...
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
            placeholder="Pergunte sobre escatologia, tipologia ou um versículo..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 pr-14 text-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none h-16 md:h-20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-amber-600 text-white rounded-xl flex items-center justify-center hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 transition-all shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center uppercase tracking-widest font-bold">
          As respostas são baseadas em interpretação canônica e bíblica.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
