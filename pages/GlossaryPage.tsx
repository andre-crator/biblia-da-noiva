
import React, { useState, useEffect } from 'react';
import { getGlossaryTerms } from '../services/geminiService';
import * as LucideIcons from 'lucide-react';
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
  Hash,
  ChevronRight,
  BookOpen
} from 'lucide-react';

// Componente para renderizar ícones dinamicamente baseado no nome enviado pela IA
const DynamicIcon = ({ name, size = 24, className = "" }: { name: string, size?: number, className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Sparkles;
  return <IconComponent size={size} className={className} />;
};

const GlossaryPage: React.FC = () => {
  const [terms, setTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState('A, B, C');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredTerms = terms.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 text-amber-500 mb-4">
            <div className="p-3 bg-amber-600/10 rounded-2xl border border-amber-600/20 shadow-[0_0_15px_rgba(217,119,6,0.1)]">
              <BookOpen size={40} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold gold-gradient leading-none">Léxico da Revelação</h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Dicionário de Símbolos e Tipos Proféticos</p>
            </div>
          </div>
          <p className="text-slate-400 text-lg font-serif-biblical italic leading-relaxed">
            "Para que o povo de Deus não pereça por falta de conhecimento, cada símbolo é uma chave para a eternidade."
          </p>
        </div>
        
        <div className="relative group w-full lg:w-72">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
           <input 
             type="text" 
             placeholder="Buscar termo..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-200 focus:border-amber-500/50 outline-none shadow-inner placeholder:text-slate-600 transition-all"
           />
        </div>
      </div>

      {/* Seletor de Letras Estilizado */}
      <div className="p-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="flex overflow-x-auto no-scrollbar p-2 gap-2 scroll-smooth">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                const group = `${letter}, ${alphabet[alphabet.indexOf(letter)+1] || ''}, ${alphabet[alphabet.indexOf(letter)+2] || ''}`;
                setSelectedLetters(group);
                fetchTerms(group);
              }}
              className={`min-w-[3rem] h-12 flex items-center justify-center rounded-2xl font-black transition-all duration-300 ${
                selectedLetters.includes(letter) 
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40 scale-105 ring-4 ring-amber-600/10' 
                  : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-8">
          <div className="relative">
            <Loader2 size={80} className="text-amber-500 animate-spin opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
               <Book size={32} className="text-amber-500 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-slate-400 font-cinzel text-xl tracking-[0.2em]">Perscrutando Manuscritos...</p>
            <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em]">Traduzindo mistérios do Hebraico e Grego</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTerms.map((t, i) => (
            <div 
              key={i} 
              className="group bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-[3rem] overflow-hidden flex flex-col hover:border-amber-500/30 transition-all duration-500 shadow-xl hover:shadow-amber-900/10 hover:-translate-y-1"
            >
              {/* Header do Card com Ícone Visual sugerido pela IA */}
              <div className="relative p-10 pb-6 overflow-hidden">
                <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                   <DynamicIcon name={t.icon} size={180} />
                </div>
                
                <div className="relative z-10 flex justify-between items-start">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-amber-600/60 font-black text-[10px] uppercase tracking-[0.3em]">
                         <Hash size={12} /> Entrada Digital
                      </div>
                      <h3 className="text-3xl font-cinzel font-bold text-white group-hover:text-amber-500 transition-colors">
                        {t.term}
                      </h3>
                   </div>
                   <div className="w-16 h-16 bg-gradient-to-br from-amber-600/20 to-amber-900/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <DynamicIcon name={t.icon} size={32} />
                   </div>
                </div>
              </div>

              {/* Seções Visuais Distintas */}
              <div className="px-8 pb-8 flex-1 space-y-6">
                
                {/* Seção: Definição */}
                <div className="bg-slate-950/40 rounded-3xl p-6 border-l-4 border-blue-600 shadow-inner group/section">
                  <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                    <Info size={14} className="group-hover/section:scale-110 transition-transform" /> Definição
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {t.definition}
                  </p>
                </div>

                {/* Seção: Base Bíblica - Com ícone Scroll à esquerda conforme solicitado */}
                <div className="bg-slate-950/40 rounded-3xl p-6 border-l-4 border-indigo-500 shadow-inner group/section">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                    <Scroll size={14} className="group-hover/section:scale-110 transition-transform" /> Base Bíblica
                  </div>
                  <p className="text-amber-500 italic font-serif-biblical text-lg leading-snug">
                    "{t.bibleBase}"
                  </p>
                </div>

                {/* Seção: Aplicação Profética */}
                <div className="bg-amber-950/10 rounded-3xl p-6 border-l-4 border-amber-600 shadow-inner group/section">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                    <Flame size={14} className="group-hover/section:scale-110 animate-pulse transition-transform" /> Aplicação Profética
                  </div>
                  <p className="text-slate-400 text-xs italic leading-relaxed">
                    {t.propheticApplication}
                  </p>
                </div>

                {/* Seção: Ícone Visual (Sugerido pela IA) */}
                <div className="pt-2 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-500 font-bold text-[9px] uppercase tracking-[0.2em]">
                      <Sparkles size={12} /> Ícone Sugerido
                   </div>
                   <span className="text-[10px] font-mono text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">
                      {t.icon}
                   </span>
                </div>
              </div>

              {/* Footer com Registro */}
              <div className="px-8 pb-10">
                <div className="bg-slate-950/60 border border-slate-800/40 rounded-2xl p-4 flex items-center justify-between group/footer hover:bg-slate-950 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg text-slate-400">
                        <QrCode size={20} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em]">ID Profético</span>
                         <span className="text-[10px] text-amber-600/80 font-bold font-mono">#{t.term.substring(0,3).toUpperCase()}-{Math.floor(Math.random() * 9000) + 1000}</span>
                      </div>
                   </div>
                   <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-500 hover:bg-amber-600 hover:text-white transition-all">
                      <ChevronRight size={16} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTerms.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[4rem]">
           <Layers size={64} className="text-slate-700 opacity-20" />
           <div className="space-y-2">
             <h3 className="text-xl font-cinzel font-bold text-slate-500">Termo não Catalogado</h3>
             <p className="text-slate-600 text-sm">O Atalaia ainda não perscrutou esta expressão.</p>
           </div>
        </div>
      )}

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
