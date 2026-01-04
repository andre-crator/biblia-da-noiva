
import React, { useState } from 'react';
import { getThematicChapter } from '../services/geminiService';
import { ThematicChapter, PuzzleConnection } from '../types';
import { Loader2, Layers, Sparkles, MapPin, Target, Shield, Link2, Key, ChevronRight, Info } from 'lucide-react';

const ThematicBible: React.FC = () => {
  const [theme, setTheme] = useState<ThematicChapter | null>(null);
  const [loading, setLoading] = useState(false);

  const themes = [
    "O Noivo que Vem", 
    "A Voz da Trombeta", 
    "O Óleo da Vigilância", 
    "Daniel 7 & Apocalipse 13", 
    "O Mistério da Babilônia", 
    "O Dia do Senhor", 
    "O Arrebatamento"
  ];

  const fetchTheme = async (t: string) => {
    setLoading(true);
    try {
      const data = await getThematicChapter(t);
      setTheme(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const PuzzlePiece: React.FC<{ connection: PuzzleConnection }> = ({ connection }) => (
    <div className="flex flex-col space-y-0 group">
      {/* Chave da Revelação - Agora como um Cabeçalho de Conexão */}
      <div className="relative z-20 flex justify-center -mb-4">
        <div className="bg-amber-600 text-white rounded-2xl shadow-xl px-6 py-3 border border-amber-400/50 transform group-hover:scale-105 transition-transform flex items-center gap-3 max-w-[90%] md:max-w-md">
           <div className="bg-amber-500/30 p-1.5 rounded-lg">
              <Key size={18} fill="currentColor" />
           </div>
           <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] block leading-none mb-1 opacity-80">Chave da Revelação</span>
              <p className="text-xs font-bold leading-tight">{connection.revelationKey}</p>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-0 border border-slate-800 rounded-[2rem] overflow-hidden bg-slate-900/50 shadow-2xl transition-all hover:border-amber-500/30 relative">
        {/* Antigo Testamento / Semente */}
        <div className="p-8 md:p-12 border-r border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Semente Profética (AT)
          </div>
          <p className="text-xl md:text-2xl font-serif-biblical italic text-slate-100 mb-6 leading-relaxed">
            "{connection.originText}"
          </p>
          <div className="mt-auto">
            <span className="px-3 py-1 bg-blue-900/20 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-800/30">
              {connection.originRef}
            </span>
          </div>
        </div>

        {/* Novo Testamento / Revelação */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-amber-950/10 to-slate-900 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Cumprimento (NT/Apocalipse)
          </div>
          <p className="text-xl md:text-2xl font-serif-biblical italic text-white mb-6 leading-relaxed">
            "{connection.destinyText}"
          </p>
          <div className="mt-auto">
            <span className="px-3 py-1 bg-amber-900/20 text-amber-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-800/30">
              {connection.destinyRef}
            </span>
          </div>
        </div>

        {/* Ícone de Conexão Visual de Fundo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
           <Link2 size={200} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 text-amber-500 mb-3">
             <Layers size={32} />
             <h1 className="text-4xl md:text-5xl font-cinzel font-bold gold-gradient leading-none">Bíblia Temática</h1>
          </div>
          <p className="text-slate-400 text-lg font-serif-biblical italic">
            "A Bíblia é um quebra-cabeça montado pela mão do Autor Eterno."
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {themes.map(t => (
            <button 
              key={t}
              onClick={() => fetchTheme(t)}
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-amber-500 hover:text-amber-500 transition-all shadow-lg active:scale-95"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {!theme && !loading && (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 bg-slate-900/30 border border-slate-800 border-dashed rounded-[3rem]">
          <div className="relative">
             <Layers size={100} className="text-slate-800" />
             <Sparkles size={32} className="text-amber-600 absolute -top-4 -right-4 animate-pulse" />
          </div>
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-cinzel font-bold text-white uppercase tracking-widest">Inicie a Montagem</h2>
            <p className="text-slate-500 text-sm leading-relaxed px-8">
              Selecione um selo profético acima para ver como as Escrituras se unem em uma harmonia perfeita de Gênesis a Apocalipse.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-48 gap-8">
          <div className="relative">
             <Loader2 size={64} className="text-amber-600 animate-spin" />
             <Link2 size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" />
          </div>
          <div className="text-center space-y-2">
             <p className="text-slate-300 font-cinzel text-xl tracking-widest animate-pulse">Unindo as Peças da Revelação...</p>
             <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em]">Buscando conexões em Daniel e Apocalipse</p>
          </div>
        </div>
      )}

      {theme && !loading && (
        <article className="space-y-20 animate-in slide-in-from-bottom-8 duration-1000">
          <section className="bg-gradient-to-br from-slate-900 via-amber-950/10 to-slate-950 border border-slate-800 rounded-[3rem] p-10 md:p-20 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
             <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-amber-600/20 rounded-2xl flex items-center justify-center border border-amber-600/30 text-amber-500">
                   <Target size={32} />
                </div>
             </div>
             <h2 className="text-4xl md:text-6xl font-cinzel font-bold mb-8 tracking-tight">{theme.title}</h2>
             <div className="max-w-4xl mx-auto relative">
                <div className="absolute -left-8 top-0 text-amber-900/40 text-8xl font-serif">"</div>
                <p className="text-2xl md:text-3xl font-serif-biblical italic text-slate-200 leading-relaxed px-4">
                  {theme.centralDeclaration}
                </p>
                <div className="absolute -right-8 bottom-0 text-amber-900/40 text-8xl font-serif">"</div>
             </div>
          </section>

          {/* Puzzle Pieces Section */}
          <section className="space-y-12">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-px flex-1 bg-slate-800"></div>
               <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.4em]">O Quebra-Cabeça Montado</h3>
               <div className="h-px flex-1 bg-slate-800"></div>
            </div>
            
            <div className="space-y-20">
               {theme.puzzleConnections.map((conn, idx) => (
                 <PuzzlePiece key={idx} connection={conn} />
               ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] shadow-xl">
               <h3 className="flex items-center gap-3 text-amber-500 font-bold mb-8 uppercase text-xs tracking-[0.2em]">
                 <MapPin size={20}/> Linha do Tempo
               </h3>
               <div className="space-y-6">
                 {theme.timeline.split('\n').map((line, i) => (
                    <div key={i} className="flex gap-4 group">
                       <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                       <p className="text-slate-400 text-sm leading-relaxed">{line}</p>
                    </div>
                 ))}
               </div>
            </div>

            <div className="lg:col-span-1 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] shadow-xl">
               <h3 className="flex items-center gap-3 text-amber-500 font-bold mb-8 uppercase text-xs tracking-[0.2em]">
                 <Target size={20}/> Convergência
               </h3>
               <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 italic text-slate-300 text-sm leading-relaxed">
                  {theme.convergence}
               </div>
            </div>

            <div className="lg:col-span-1 bg-amber-600 border border-amber-500 p-10 rounded-[2.5rem] text-white shadow-[0_20px_40px_rgba(217,119,6,0.3)] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                  <Shield size={120} />
               </div>
               <h3 className="flex items-center gap-3 font-bold mb-8 uppercase text-xs tracking-[0.2em] relative z-10">
                 <Shield size={20}/> Para a Noiva
               </h3>
               <p className="text-amber-50 font-serif-biblical text-xl leading-relaxed italic relative z-10">
                 "{theme.application}"
               </p>
               <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors relative z-10">
                  Aprofundar Estudo <ChevronRight size={14} />
               </button>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex items-center gap-6">
             <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0">
                <Info size={24} />
             </div>
             <div>
                <h4 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Nota Hermenêutica</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  As conexões apresentadas foram processadas através da comparação de termos originais no Hebraico e Grego, unindo visões proféticas que se complementam através das dispensações.
                </p>
             </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default ThematicBible;
