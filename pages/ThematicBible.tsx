
import React, { useState } from 'react';
import { getPropheticMosaic } from '../services/geminiService';
import { PropheticMosaic, MosaicVerse } from '../types';
import { 
  Loader2, 
  Layers, 
  Sparkles, 
  Puzzle, 
  Link2, 
  ChevronRight, 
  ArrowDown,
  Quote,
  Scroll,
  Zap,
  ShieldCheck
} from 'lucide-react';

const ThematicBible: React.FC = () => {
  const [mosaic, setMosaic] = useState<PropheticMosaic | null>(null);
  const [loading, setLoading] = useState(false);

  const mysteries = [
    "O Cordeiro: Da Páscoa ao Trono", 
    "O Tabernáculo: Sombra do Santuário Celestial", 
    "O Noivo: De Adão às Bodas do Cordeiro", 
    "As Duas Oliveiras: O Testemunho Profético",
    "O Rei que Vem: Da Tribo de Judá ao Reino Milenar"
  ];

  const fetchMosaic = async (theme: string) => {
    setLoading(true);
    try {
      const data = await getPropheticMosaic(theme);
      setMosaic(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const MosaicPiece: React.FC<{ verse: MosaicVerse; isLast: boolean }> = ({ verse, isLast }) => (
    <div className="relative group">
      {/* Visual Connector Line */}
      {!isLast && (
        <div className="absolute left-1/2 bottom-[-4rem] -translate-x-1/2 w-px h-16 bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent z-0">
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 p-1 bg-amber-600 rounded-full animate-bounce shadow-[0_0_10px_rgba(217,119,6,0.5)]">
              <ArrowDown size={12} className="text-white" />
           </div>
        </div>
      )}

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all hover:border-amber-500/40 relative z-10 group-hover:-translate-y-1">
        {/* Era Tag */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 border ${
          verse.era.includes('Sombra') 
          ? 'bg-blue-900/20 border-blue-500/30 text-blue-400' 
          : verse.era.includes('Realidade') 
          ? 'bg-indigo-900/20 border-indigo-500/30 text-indigo-400' 
          : 'bg-amber-900/20 border-amber-500/30 text-amber-500'
        }`}>
           <Scroll size={12} /> {verse.era}
        </div>

        <div className="space-y-6">
           <p className="text-2xl md:text-3xl font-serif-biblical italic text-slate-100 leading-relaxed">
             "{verse.text}"
           </p>
           
           <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                 <Link2 size={16} className="text-amber-600" />
                 <span>{verse.book} {verse.chapter}:{verse.verse}</span>
              </div>
           </div>

           {/* The "Stitch" - Why this verse connects to the mystery */}
           <div className="mt-6 p-5 bg-slate-950/60 rounded-2xl border border-slate-800/40 border-l-4 border-l-amber-600 italic text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase text-amber-600 tracking-widest mb-2">
                 <Zap size={10} /> Chave da Revelação
              </div>
              {verse.connectionNote}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 text-amber-500 mb-3">
             <Puzzle size={32} />
             <h1 className="text-4xl md:text-5xl font-cinzel font-bold gold-gradient leading-none">Bíblia de Mosaico</h1>
          </div>
          <p className="text-slate-400 text-lg font-serif-biblical italic">
            "A Bíblia não é uma coleção de livros, é uma única revelação costurada pelo Espírito."
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {mysteries.map(m => (
            <button 
              key={m}
              onClick={() => fetchMosaic(m)}
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-amber-500 hover:text-amber-500 transition-all shadow-lg active:scale-95"
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      {!mosaic && !loading && (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 bg-slate-900/30 border border-slate-800 border-dashed rounded-[4rem]">
          <div className="relative">
             <Puzzle size={100} className="text-slate-800" />
             <Sparkles size={32} className="text-amber-600 absolute -top-4 -right-4 animate-pulse" />
          </div>
          <div className="max-w-md space-y-4 px-8">
            <h2 className="text-2xl font-cinzel font-bold text-white uppercase tracking-widest leading-tight">Escolha um Mistério para Revelar</h2>
            <p className="text-slate-500 text-sm leading-relaxed italic">
              Nesta Bíblia, os livros se dobram um sobre o outro para que você leia a profecia e o seu cumprimento em uma única respiração.
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-48 gap-8">
          <div className="relative">
             <Loader2 size={64} className="text-amber-600 animate-spin" />
             <Puzzle size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" />
          </div>
          <div className="text-center space-y-2">
             <p className="text-slate-300 font-cinzel text-xl tracking-widest animate-pulse uppercase">Costurando a Revelação...</p>
             <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.4em]">O Gemini Pro está meditando sobre as Escrituras</p>
          </div>
        </div>
      )}

      {mosaic && !loading && (
        <article className="space-y-20 max-w-4xl mx-auto animate-in slide-in-from-bottom-12 duration-1000">
          {/* Mystery Intro Card */}
          <section className="bg-gradient-to-br from-slate-900 via-amber-950/10 to-slate-950 border border-slate-800 rounded-[3rem] p-12 md:p-20 text-center shadow-[0_0_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <Scroll size={400} />
             </div>
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
             
             <div className="flex items-center justify-center gap-2 text-amber-500 mb-6 font-black text-xs uppercase tracking-[0.5em]">
                <Quote size={16} fill="currentColor" /> Mosaico Profético
             </div>
             
             <h2 className="text-4xl md:text-6xl font-cinzel font-bold mb-8 tracking-tight gold-gradient leading-tight">
                {mosaic.title}
             </h2>
             
             <p className="text-xl md:text-2xl font-serif-biblical italic text-slate-300 leading-relaxed">
                "{mosaic.mystery}"
             </p>
          </section>

          {/* Verses Chain */}
          <section className="space-y-24">
             {mosaic.chains.map((v, idx) => (
               <MosaicPiece 
                 key={idx} 
                 verse={v} 
                 isLast={idx === mosaic.chains.length - 1} 
               />
             ))}
          </section>

          {/* Conclusion */}
          <footer className="mt-32 pt-16 border-t border-slate-800">
             <div className="bg-amber-600 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                   <ShieldCheck size={300} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                   <Sparkles size={16} /> Revelação Final
                </h3>
                <p className="text-2xl md:text-3xl font-serif-biblical italic leading-relaxed relative z-10">
                   {mosaic.conclusion}
                </p>
             </div>
             <div className="mt-8 text-center">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em]">
                   Até que Ele venha • Bíblia da Noiva 2025
                </p>
             </div>
          </footer>
        </article>
      )}
    </div>
  );
};

export default ThematicBible;
