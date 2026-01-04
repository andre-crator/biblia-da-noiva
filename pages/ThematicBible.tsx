
import React, { useState } from 'react';
import { getThematicChapter } from '../services/geminiService';
import { ThematicChapter } from '../types';
import { Loader2, Layers, Sparkles, MapPin, Target, Shield } from 'lucide-react';

const ThematicBible: React.FC = () => {
  const [theme, setTheme] = useState<ThematicChapter | null>(null);
  const [loading, setLoading] = useState(false);

  const themes = ["O Noivo que Vem", "A Voz da Trombeta", "O Óleo da Vigilância", "O Dia do Senhor", "O Arrebatamento", "As Dez Virgens"];

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

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-cinzel font-bold gold-gradient mb-2">Bíblia Temática</h1>
          <p className="text-slate-400">As Escrituras reunidas por revelação e convergência profética.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {themes.map(t => (
            <button 
              key={t}
              onClick={() => fetchTheme(t)}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold hover:border-amber-500 hover:text-amber-500 transition-all"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 size={40} className="text-amber-500 animate-spin" />
          <p className="text-slate-500 italic">Organizando as camadas da revelação...</p>
        </div>
      ) : theme ? (
        <article className="space-y-12">
          <section className="bg-gradient-to-br from-slate-900 to-amber-950/20 border border-slate-800 rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
             <Sparkles className="mx-auto text-amber-500 mb-6" size={40} />
             <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6">{theme.title}</h2>
             <p className="text-xl font-serif-biblical italic text-slate-300 max-w-3xl mx-auto leading-relaxed">
               "{theme.centralDeclaration}"
             </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {theme.sections.map((s, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-amber-900/50 transition-colors">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4 block">{s.era}</span>
                <p className="font-serif-biblical text-lg text-slate-200 mb-6 border-l-2 border-amber-600/30 pl-4">
                  {s.verses}
                </p>
                <div className="text-sm text-slate-500">
                  <strong className="text-slate-300 block mb-1">Contexto Profético:</strong>
                  {s.context}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-8 rounded-2xl">
               <h3 className="flex items-center gap-2 text-amber-500 font-bold mb-6 uppercase text-sm tracking-widest">
                 <MapPin size={18}/> Linha do Tempo Espiritual
               </h3>
               <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{theme.timeline}</p>
            </div>
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-8 rounded-2xl">
               <h3 className="flex items-center gap-2 text-amber-500 font-bold mb-6 uppercase text-sm tracking-widest">
                 <Target size={18}/> Convergência Profética
               </h3>
               <p className="text-slate-400 text-sm leading-relaxed">{theme.convergence}</p>
            </div>
            <div className="lg:col-span-1 bg-amber-600 border border-amber-500 p-8 rounded-2xl text-white">
               <h3 className="flex items-center gap-2 font-bold mb-6 uppercase text-sm tracking-widest">
                 <Shield size={18}/> Aplicação para a Noiva
               </h3>
               <p className="text-amber-50 font-medium leading-relaxed italic">"{theme.application}"</p>
            </div>
          </div>
        </article>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
          <Layers size={80} className="mb-6" />
          <h2 className="text-xl font-cinzel font-bold">Selecione um Tema Profético</h2>
          <p className="text-sm">Explore como a Palavra converge para a vinda de Cristo.</p>
        </div>
      )}
    </div>
  );
};

export default ThematicBible;
