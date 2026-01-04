
import React, { useState, useEffect } from 'react';
import { getGlossaryTerms } from '../services/geminiService';
import { 
  Loader2, 
  Search, 
  QrCode, 
  Book, 
  Flame, 
  Info, 
  Sparkles, 
  Layers, 
  Scroll,
  Hash
} from 'lucide-react';

const GlossaryPage: React.FC = () => {
  const [terms, setTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState('A, B, C');

  const fetchTerms = async (letters: string) => {
    setLoading(true);
    try {
      const data = await getGlossaryTerms(letters);
      setTerms(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms(selectedLetters);
  }, []);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 text-amber-500 mb-2">
            <Book size={32} />
            <h1 className="text-4xl font-cinzel font-bold gold-gradient leading-none">Glossário Escatológico</h1>
          </div>
          <p className="text-slate-400 text-lg font-serif-biblical italic">
            Descifrando os mistérios, símbolos e tipos da Revelação Divina.
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner">
           <Search size={18} className="text-slate-500" />
           <input 
             type="text" 
             placeholder="Buscar termo..." 
             className="bg-transparent border-none outline-none text-sm text-slate-200 w-48 placeholder:text-slate-600"
           />
        </div>
      </div>

      {/* Seletor de Letras Estilizado */}
      <div className="p-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-[2rem] shadow-2xl overflow-x-auto no-scrollbar">
        <div className="flex gap-1 min-w-max p-2">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                const group = `${letter}, ${alphabet[alphabet.indexOf(letter)+1] || ''}, ${alphabet[alphabet.indexOf(letter)+2] || ''}`;
                setSelectedLetters(group);
                fetchTerms(group);
              }}
              className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold transition-all duration-300 ${
                selectedLetters.includes(letter) 
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40 scale-110 z-10' 
                  : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="relative">
            <Loader2 size={60} className="text-amber-500 animate-spin" />
            <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" />
          </div>
          <p className="text-slate-400 font-serif-biblical text-xl animate-pulse">Consultando as raízes do hebraico e grego...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {terms.map((t, i) => (
            <div 
              key={i} 
              className="group bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col hover:border-amber-500/40 transition-all duration-500 shadow-xl hover:shadow-amber-900/10"
            >
              {/* Header do Card com Ícone Visual */}
              <div className="p-8 border-b border-slate-800 flex justify-between items-start bg-gradient-to-br from-slate-900 to-slate-950">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-600/60 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                       <Hash size={12} /> Termo Revelado
                    </div>
                    <h3 className="text-2xl font-cinzel font-bold text-white group-hover:text-amber-500 transition-colors">
                      {t.term}
                    </h3>
                 </div>
                 <div className="w-14 h-14 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-600/20 shadow-inner transform group-hover:rotate-12 transition-transform">
                    {/* Aqui renderizamos um ícone genérico mas o prompt retornará uma string de ícone ou descrição */}
                    <Sparkles size={28} />
                 </div>
              </div>

              {/* Conteúdo Seccionado */}
              <div className="p-8 flex-1 space-y-8">
                {/* Seção: Definição */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-widest">
                    <Info size={14} /> Definição Fundamental
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed border-l border-slate-800 pl-4">
                    {t.definition}
                  </p>
                </div>

                {/* Seção: Base Bíblica */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-indigo-500 font-bold text-[10px] uppercase tracking-widest">
                    <Scroll size={14} /> Base Bíblica & Tipologia
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                    <span className="text-amber-400 italic font-serif-biblical text-sm block leading-relaxed">
                      "{t.bibleBase}"
                    </span>
                  </div>
                </div>

                {/* Seção: Aplicação Profética */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase tracking-widest">
                    <Flame size={14} /> Revelação para a Noiva
                  </div>
                  <p className="text-slate-400 text-xs italic leading-relaxed bg-amber-950/10 p-4 rounded-xl border border-amber-900/10">
                    {t.propheticApplication}
                  </p>
                </div>
              </div>

              {/* Footer de Acesso Digital */}
              <div className="px-8 py-5 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white rounded-lg">
                      <QrCode size={24} className="text-slate-900" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Código Digital</span>
                       <span className="text-[10px] text-amber-600/80 font-bold font-mono">#{t.term.substring(0,3).toUpperCase()}</span>
                    </div>
                 </div>
                 <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                    Aprofundar <Layers size={12} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estilo para esconder scrollbar mantendo funcionalidade */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GlossaryPage;
