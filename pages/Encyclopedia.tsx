
import React, { useState, useEffect } from 'react';
import { getEncyclopediaVolume } from '../services/geminiService';
import { BibleStudy } from '../types';
import { 
  Loader2, 
  Book, 
  ChevronLeft, 
  Calendar, 
  Share2, 
  Printer, 
  QrCode, 
  Check, 
  History, 
  GraduationCap, 
  Flame, 
  ScrollText, 
  Zap, 
  Heart,
  Star
} from 'lucide-react';

const Encyclopedia: React.FC = () => {
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const [study, setStudy] = useState<BibleStudy | null>(null);
  const [loading, setLoading] = useState(false);
  const [shared, setShared] = useState(false);

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

  const handleShare = async () => {
    if (!study || !selectedVolume) return;

    const shareData = {
      title: `Bíblia da Noiva - Volume ${selectedVolume}: ${study.title}`,
      text: `Estudo Profético: ${study.title}\n"${study.bibleText}"`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\nExplore mais em: ${shareData.url}`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  };

  if (selectedVolume && (loading || study)) {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
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
          <article className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header Section */}
            <div className="p-8 md:p-12 border-b border-slate-800 bg-gradient-to-b from-slate-800/50 to-transparent">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-amber-600/20 text-amber-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-600/30">
                  Volume {selectedVolume}
                </span>
                <div className="flex gap-2">
                   <button 
                    onClick={handleShare}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-amber-500 transition-all flex items-center gap-2"
                    title="Compartilhar Estudo"
                   >
                     {shared ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
                     {shared && <span className="text-[10px] font-bold uppercase">Copiado</span>}
                   </button>
                   <button 
                    onClick={() => window.print()}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-amber-500 transition-all"
                    title="Imprimir"
                   >
                     <Printer size={18} />
                   </button>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-6 text-white leading-tight">
                {study.title}
              </h1>
              <div className="flex items-center gap-6 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                 <div className="flex items-center gap-2"><Book size={14} className="text-amber-600" /> Bíblia da Noiva</div>
                 <div className="flex items-center gap-2"><Calendar size={14} className="text-amber-600" /> Profetic Insight</div>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-16">
              {/* Texto Sagrado Section */}
              <section className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-amber-600 rounded-full opacity-50"></div>
                <h2 className="text-sm font-bold text-amber-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                  <ScrollText size={18}/> Texto Sagrado de Base
                </h2>
                <div className="bg-amber-950/10 p-8 rounded-2xl italic font-serif-biblical text-2xl text-slate-100 leading-relaxed shadow-inner border border-amber-900/10">
                  "{study.bibleText}"
                </div>
              </section>

              {/* Two Column Section: Context & Theology */}
              <div className="grid md:grid-cols-2 gap-12">
                <section className="space-y-4">
                  <h3 className="text-lg font-cinzel font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                    <History size={20} className="text-blue-500" /> Contexto Histórico
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {study.context}
                  </p>
                </section>
                <section className="space-y-4">
                  <h3 className="text-lg font-cinzel font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                    <GraduationCap size={20} className="text-indigo-500" /> Análise Teológica
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {study.theology}
                  </p>
                </section>
              </div>

              {/* Full Width: Tipologia Profética */}
              <section className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Flame size={120} />
                </div>
                <h3 className="text-xl font-cinzel font-bold text-amber-500 mb-6 flex items-center gap-3">
                  <Flame size={24} className="text-amber-500" /> Tipologia Profética
                </h3>
                <p className="text-slate-200 leading-relaxed italic text-lg relative z-10">
                  {study.typology}
                </p>
              </section>

              {/* Full Width: Conexão com Apocalipse */}
              <section className="space-y-4">
                <h3 className="text-lg font-cinzel font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Zap size={20} className="text-amber-500" /> Conexão com Apocalipse
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {study.apocalypseConnection}
                </p>
              </section>

              {/* Application & Activation Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <section className="border border-green-900/30 bg-green-950/10 p-8 rounded-2xl group hover:bg-green-950/20 transition-colors">
                  <h3 className="text-lg font-bold text-green-500 mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <Check size={16} /> Aplicação Prática
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {study.practicalApplication}
                  </p>
                </section>
                <section className="border border-amber-900/30 bg-amber-950/10 p-8 rounded-2xl group hover:bg-amber-950/20 transition-colors">
                  <h3 className="text-lg font-bold text-amber-500 mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <Heart size={16} /> Ativação Devocional
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {study.devotionalActivation}
                  </p>
                </section>
              </div>

              {/* Footer Section: Questions & QR */}
              <section className="pt-12 border-t border-slate-800 flex flex-col md:flex-row gap-12 items-start justify-between">
                <div className="flex-1 space-y-6">
                   <h4 className="font-cinzel font-bold text-white uppercase tracking-widest text-xs">Perguntas Reflexivas</h4>
                   <ul className="space-y-4">
                     {study.reflectiveQuestions.map((q, i) => (
                       <li key={i} className="text-slate-400 text-sm flex gap-4 italic group">
                         <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            {i+1}
                         </span>
                         <span className="pt-0.5">{q}</span>
                       </li>
                     ))}
                   </ul>
                </div>
                <div className="w-full md:w-auto p-6 bg-white rounded-3xl flex flex-col items-center gap-3 shadow-xl">
                   <div className="bg-slate-100 p-2 rounded-xl">
                      <QrCode size={100} className="text-black" />
                   </div>
                   <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Recurso Digital</span>
                   <span className="text-[10px] text-amber-600 font-bold uppercase">{study.qrCodeLink}</span>
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
          <button className="bg-amber-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-500 transition-colors shadow-lg shadow-amber-900/20">Acessar</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((vol) => (
          <button
            key={vol}
            onClick={() => fetchVolume(vol)}
            className={`aspect-square flex flex-col items-center justify-center gap-3 border rounded-2xl transition-all group relative overflow-hidden ${
              vol === 1 
                ? 'bg-amber-950/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                : 'bg-slate-900 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50'
            }`}
          >
            {vol === 1 && (
              <div className="absolute top-2 right-2 text-amber-500">
                <Star size={14} fill="currentColor" className="animate-pulse" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/0 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-colors ${
              vol === 1 ? 'text-amber-500' : 'text-slate-500 group-hover:text-amber-500/70'
            }`}>
              Volume
            </span>
            <span className={`text-2xl font-cinzel font-bold transition-colors ${
              vol === 1 ? 'text-white' : 'text-slate-300 group-hover:text-white'
            }`}>
              {vol}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Encyclopedia;
