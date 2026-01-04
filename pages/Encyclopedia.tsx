
import React, { useState, useEffect } from 'react';
import { getEncyclopediaVolume } from '../services/geminiService';
import { BibleStudy } from '../types';
import { Loader2, Book, ChevronLeft, Calendar, Share2, Printer, QrCode } from 'lucide-react';

const Encyclopedia: React.FC = () => {
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [study, setStudy] = useState<BibleStudy | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchVolume = async (vol: number) => {
    setLoading(true);
    setSelectedVolume(vol);
    try {
      const data = await getEncyclopediaVolume(vol);
      setStudy(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedVolume && (loading || study)) {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => { setSelectedVolume(null); setStudy(null); }}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          Voltar para Volumes
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={48} className="text-amber-500 animate-spin" />
            <p className="text-slate-400 font-serif-biblical animate-pulse">Consultando os manuscritos proféticos...</p>
          </div>
        ) : study ? (
          <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-8 md:p-12 border-b border-slate-800 bg-gradient-to-b from-slate-800/50 to-transparent">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-amber-600/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-600/30">
                  Volume {selectedVolume}
                </span>
                <div className="flex gap-2">
                   <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg"><Share2 size={18} /></button>
                   <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg"><Printer size={18} /></button>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-6 text-white leading-tight">
                {study.title}
              </h1>
              <div className="flex items-center gap-4 text-slate-400 text-sm">
                 <div className="flex items-center gap-1"><Book size={16} /> Bíblia da Noiva</div>
                 <div className="flex items-center gap-1"><Calendar size={16} /> Profetic Insight</div>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-12">
              <section>
                <h2 className="text-xl font-cinzel font-bold text-amber-500 mb-4 flex items-center gap-2">
                  <div className="w-8 h-[1px] bg-amber-500"></div> Texto Sagrado
                </h2>
                <div className="bg-amber-950/20 border-l-4 border-amber-500 p-6 italic font-serif-biblical text-xl text-slate-200 leading-relaxed">
                  "{study.bibleText}"
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-12">
                <section>
                  <h3 className="text-lg font-bold text-white mb-3">Contexto Histórico-Espiritual</h3>
                  <p className="text-slate-400 leading-relaxed">{study.context}</p>
                </section>
                <section>
                  <h3 className="text-lg font-bold text-white mb-3">Análise Teológica</h3>
                  <p className="text-slate-400 leading-relaxed">{study.theology}</p>
                </section>
              </div>

              <section className="bg-slate-800/30 p-8 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-amber-400 mb-4">Tipologia Profética</h3>
                <p className="text-slate-300 leading-relaxed">{study.typology}</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">Conexão com Apocalipse</h3>
                <p className="text-slate-400 leading-relaxed">{study.apocalypseConnection}</p>
              </section>

              <div className="grid md:grid-cols-2 gap-8">
                <section className="border border-green-900/30 bg-green-950/10 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-green-500 mb-3">Aplicação Prática</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{study.practicalApplication}</p>
                </section>
                <section className="border border-amber-900/30 bg-amber-950/10 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-amber-500 mb-3">Ativação Devocional</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{study.devotionalActivation}</p>
                </section>
              </div>

              <section className="pt-8 border-t border-slate-800 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex-1">
                   <h4 className="font-bold mb-4">Perguntas Reflexivas</h4>
                   <ul className="space-y-2">
                     {study.reflectiveQuestions.map((q, i) => (
                       <li key={i} className="text-slate-400 text-sm flex gap-3 italic">
                         <span className="text-amber-500 font-bold">{i+1}.</span>
                         {q}
                       </li>
                     ))}
                   </ul>
                </div>
                <div className="w-full md:w-auto p-4 bg-white rounded-lg flex flex-col items-center gap-2">
                   <QrCode size={120} className="text-black" />
                   <span className="text-[10px] text-slate-500 font-bold uppercase">{study.qrCodeLink}</span>
                </div>
              </section>
            </div>
          </article>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-cinzel font-bold gold-gradient mb-2">Enciclopédia Escatológica</h1>
          <p className="text-slate-400">Volumes 1 a 300 de revelação bíblica profunda.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Ir para volume..." 
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:border-amber-500 outline-none w-32"
          />
          <button className="bg-amber-600 px-4 py-2 rounded-lg font-bold text-sm">Acessar</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((vol) => (
          <button
            key={vol}
            onClick={() => fetchVolume(vol)}
            className="aspect-square flex flex-col items-center justify-center gap-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-amber-500/50 hover:bg-slate-800/50 transition-all group"
          >
            <span className="text-xs font-bold text-slate-500 group-hover:text-amber-500 transition-colors">VOLUME</span>
            <span className="text-4xl font-cinzel font-bold text-white">{vol}</span>
            <div className="w-8 h-1 bg-amber-600/20 rounded-full group-hover:bg-amber-600 transition-colors"></div>
          </button>
        ))}
      </div>
      
      <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl italic">
        "E este evangelho do reino será pregado em todo o mundo... e então virá o fim."
      </div>
    </div>
  );
};

export default Encyclopedia;
