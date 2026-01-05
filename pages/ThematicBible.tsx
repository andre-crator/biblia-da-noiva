
import React, { useState } from 'react';
import { getPropheticMosaic } from '../services/geminiService';
import { PropheticMosaic, MosaicVerse } from '../types';
import { 
  Loader2, 
  Scroll, 
  BookMarked, 
  ChevronRight, 
  ChevronLeft,
  Search,
  Zap,
  BookOpen,
  Hash,
  ArrowDownCircle,
  Sparkles,
  Clock,
  Shield,
  Plus,
  Megaphone,
  Globe,
  Sword,
  Eye,
  Info,
  Calendar
} from 'lucide-react';

const ThematicBible: React.FC = () => {
  const [mosaic, setMosaic] = useState<PropheticMosaic | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const propheticThreads = [
    { id: "daniel_tempo", title: "Daniel: O Relógio de Deus e as 70 Semanas", icon: "⏳" },
    { id: "estatua_reinos", title: "Daniel 2 e 7: A Sucessão de Impérios", icon: "🦁" },
    { id: "besta_daniel", title: "Daniel e a Ascensão do Anticristo", icon: "🐉" },
    { id: "tabernaculo", title: "O Tabernáculo: Padrão do Céu", icon: "🏛️" },
    { id: "cordeiro", title: "O Cordeiro: Da Páscoa ao Trono", icon: "🐑" },
    { id: "oliveiras", title: "As Duas Oliveiras: O Testemunho", icon: "🌿" }
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

  const getEraIcon = (era: string) => {
    if (era.includes('Sombra')) return <Scroll size={16} />;
    if (era.includes('Realidade')) return <Plus size={18} />;
    if (era.includes('Revelação')) return <Megaphone size={16} />;
    return <Sparkles size={16} />;
  };

  const VerseInsight: React.FC<{ verse: MosaicVerse }> = ({ verse }) => {
    const [activeTab, setActiveTab] = useState<'history' | 'politics' | 'mystery' | 'current'>('mystery');

    const tabs = [
      { id: 'history', label: 'História', icon: Calendar, color: 'text-blue-500', content: verse.historicalContext },
      { id: 'politics', label: 'Geopolítica', icon: Sword, color: 'text-red-500', content: verse.geopoliticalAnalysis },
      { id: 'mystery', label: 'Mistério', icon: Eye, color: 'text-amber-500', content: verse.spiritualMystery },
      { id: 'current', label: 'Atualidade', icon: Globe, color: 'text-green-500', content: verse.currentRelevance }
    ];

    return (
      <div className="mt-8 rounded-3xl bg-slate-950/80 border border-slate-800/80 overflow-hidden shadow-2xl">
        {/* Date & Location Header */}
        <div className="bg-slate-900/60 px-6 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
             <Clock size={12} className="text-amber-600" /> {verse.dateRange}
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
             <Globe size={12} className="text-blue-600" /> {verse.locationMarker}
           </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
                 activeTab === tab.id ? 'bg-slate-800/50' : 'hover:bg-slate-900/40'
               }`}
             >
                <tab.icon size={16} className={activeTab === tab.id ? tab.color : 'text-slate-600'} />
                <span className={`text-[8px] font-black uppercase tracking-widest ${
                  activeTab === tab.id ? 'text-white' : 'text-slate-600'
                }`}>{tab.label}</span>
                {activeTab === tab.id && <div className={`h-1 w-8 rounded-full mt-1 ${tab.color.replace('text-', 'bg-')}`}></div>}
             </button>
           ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
           <div className="animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-center gap-3 mb-4">
                <Info size={14} className="text-slate-600" />
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Análise Profunda</h4>
             </div>
             <p className="text-sm md:text-base text-slate-400 leading-relaxed font-serif-biblical italic">
               {tabs.find(t => t.id === activeTab)?.content}
             </p>
           </div>
        </div>
      </div>
    );
  };

  const VerseFlow: React.FC<{ verse: MosaicVerse; isFirst: boolean }> = ({ verse, isFirst }) => (
    <div className="relative mb-24 animate-in slide-in-from-bottom-8 duration-700">
      {/* Book Transition Marker */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-slate-800"></div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full shadow-lg">
           <BookMarked size={14} className="text-amber-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
             {verse.book} {verse.chapter}:{verse.verse}
           </span>
        </div>
        <div className="h-px flex-1 bg-slate-800"></div>
      </div>

      <div className="flex gap-6 md:gap-10">
        <div className="hidden md:flex flex-col items-center w-12 pt-2 gap-3">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center border text-xs font-black transition-all duration-500 ${
             verse.era.includes('Sombra') ? 'bg-blue-900/10 border-blue-500/30 text-blue-400' :
             verse.era.includes('Realidade') ? 'bg-indigo-900/10 border-indigo-500/30 text-indigo-400' :
             'bg-amber-900/10 border-amber-500/30 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
           }`}>
              {verse.book.substring(0, 1)}
           </div>
           
           <div className={`p-2.5 rounded-full border transition-all duration-500 ${
             verse.era.includes('Sombra') ? 'text-blue-500/60 border-blue-900/30 bg-blue-950/20' :
             verse.era.includes('Realidade') ? 'text-indigo-500/60 border-indigo-900/30 bg-indigo-950/20' :
             'text-amber-500 border-amber-900/30 bg-amber-950/30'
           }`}>
              {getEraIcon(verse.era)}
           </div>
           <div className="w-px flex-1 bg-gradient-to-b from-slate-800 to-transparent min-h-[100px]"></div>
        </div>

        <div className="flex-1">
           <div className="relative">
              <p className="font-serif-biblical text-3xl md:text-4xl text-slate-100 leading-tight first-letter:text-6xl first-letter:font-cinzel first-letter:mr-3 first-letter:float-left first-letter:text-amber-500 transition-colors">
                {verse.text}
              </p>
           </div>

           {/* Deep Insight UI */}
           <VerseInsight verse={verse} />
           
           {/* Primary Connection Note */}
           <div className="mt-6 flex items-start gap-4 p-4 rounded-2xl bg-amber-600/5 border border-amber-600/10">
              <Zap size={18} className="text-amber-500 shrink-0 mt-1" />
              <div>
                 <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest block mb-1">Ponto de Costura Canônica</span>
                 <p className="text-sm text-slate-400 italic">
                   {verse.connectionNote}
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-32 space-y-12">
      {/* Header index permanece o mesmo, focado em Daniel agora */}
      {!mosaic && !loading && (
        <div className="space-y-10 animate-in fade-in duration-700">
          <div className="text-center space-y-4">
             <div className="inline-flex items-center justify-center p-4 bg-amber-600/10 rounded-full border border-amber-600/20 mb-4 shadow-[0_0_30px_rgba(217,119,6,0.1)]">
                <Scroll size={48} className="text-amber-500" />
             </div>
             <h1 className="text-5xl md:text-7xl font-cinzel font-bold gold-gradient">Estação Daniel</h1>
             <p className="text-slate-400 text-lg md:text-2xl font-serif-biblical italic max-w-3xl mx-auto">
               "Nenhuma limitação física de papel. Sincronização em tempo real entre Arqueologia, Geopolítica e Revelação Profética."
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propheticThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => fetchMosaic(thread.title)}
                className="group p-10 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-[3rem] text-left transition-all hover:border-amber-500/40 hover:bg-slate-800/50 hover:-translate-y-2 active:scale-95 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700">
                   <Shield size={160} />
                </div>
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform inline-block">
                  {thread.icon}
                </div>
                <h3 className="text-xl font-cinzel font-bold text-white mb-3 leading-tight">{thread.title}</h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest opacity-60 group-hover:opacity-100">
                  Revelar Camadas <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>

          {/* Busca por Mistério permanece igual */}
          <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-[4rem] p-16 text-center space-y-6">
             <div className="flex items-center justify-center gap-4 text-slate-700">
                <Globe size={40} />
                <Search size={40} />
             </div>
             <div className="space-y-6">
                <h4 className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs">Consulta ao Banco de Dados do Atalaia</h4>
                <div className="relative max-w-xl mx-auto">
                   <input 
                     type="text" 
                     placeholder="Ex: O Império Otomano em Daniel, IA e a Marca da Besta..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] px-8 py-6 text-base text-slate-200 outline-none focus:border-amber-500/50 shadow-inner"
                   />
                   <button 
                    onClick={() => fetchMosaic(searchTerm)}
                    className="absolute right-3 top-2.5 bottom-2.5 bg-amber-600 hover:bg-amber-500 text-white px-8 rounded-2xl transition-all font-black text-xs uppercase tracking-widest shadow-xl"
                   >
                     Processar
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-64 gap-10">
          <div className="relative">
             <div className="absolute inset-0 bg-amber-500/10 blur-[100px] animate-pulse"></div>
             <Loader2 size={100} className="text-amber-500 animate-spin opacity-20" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={48} className="text-amber-600 animate-pulse" />
             </div>
          </div>
          <div className="text-center space-y-4">
             <p className="text-slate-400 font-cinzel text-3xl tracking-[0.2em] uppercase">Sincronizando Eras...</p>
             <p className="text-xs text-slate-600 uppercase font-black tracking-[0.5em]">Cruzando dados históricos de Daniel com Geopolítica Atual</p>
          </div>
        </div>
      )}

      {mosaic && !loading && (
        <article className="animate-in fade-in duration-1000">
          <div className="flex items-center justify-between mb-16">
             <button 
              onClick={() => setMosaic(null)}
              className="flex items-center gap-3 text-slate-500 hover:text-amber-500 transition-colors font-black uppercase text-xs tracking-[0.2em] group"
             >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Retornar à Estação
             </button>
             <div className="flex items-center gap-3 px-6 py-2 bg-amber-600/10 border border-amber-600/20 rounded-full text-amber-500 text-xs font-black uppercase tracking-[0.2em] shadow-lg">
                <Hash size={14} /> Cânon Multidimensional
             </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[4rem] p-10 md:p-24 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden min-h-[90vh]">
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none">
               <div className="absolute top-0 right-0 p-12 text-[500px] font-cinzel font-bold rotate-12">DANIEL</div>
            </div>

            <header className="text-center mb-32 relative">
               <div className="inline-flex items-center gap-4 mb-8 text-amber-500/60">
                  <div className="h-px w-12 bg-amber-900/20"></div>
                  <BookOpen size={24} />
                  <span className="text-xs font-black uppercase tracking-[0.5em]">Arquivos Des selados</span>
                  <div className="h-px w-12 bg-amber-900/20"></div>
               </div>
               <h2 className="text-6xl md:text-8xl font-cinzel font-bold gold-gradient mb-10 leading-none">
                 {mosaic.title}
               </h2>
               <div className="max-w-4xl mx-auto">
                 <p className="text-2xl md:text-3xl font-serif-biblical italic text-slate-400 leading-relaxed border-l-8 border-amber-600/20 pl-12 text-left">
                   {mosaic.mystery}
                 </p>
               </div>
            </header>

            <div className="relative">
               <div className="absolute left-6 md:left-[2.25rem] top-0 bottom-0 w-px bg-gradient-to-b from-amber-600/60 via-slate-800/40 to-transparent"></div>

               <div className="space-y-32">
                  {mosaic.chains.map((verse, idx) => (
                    <VerseFlow 
                      key={idx} 
                      verse={verse} 
                      isFirst={idx === 0} 
                    />
                  ))}
               </div>
            </div>

            <footer className="mt-48 pt-24 border-t border-slate-800/60 text-center relative">
               <div className="max-w-3xl mx-auto space-y-12">
                  <div className="flex items-center justify-center gap-4 text-amber-500/20">
                     <ArrowDownCircle size={56} className="animate-bounce" />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.6em] text-amber-600/60">Síntese Profética do Atalaia</h3>
                    <p className="text-3xl md:text-4xl font-serif-biblical italic text-slate-100 leading-tight bg-slate-950/40 p-16 rounded-[3rem] border border-amber-900/10 shadow-inner">
                      {mosaic.conclusion}
                    </p>
                  </div>
                  <div className="pt-16">
                     <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="group flex items-center gap-4 mx-auto bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white px-12 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95"
                     >
                       Vigiar do Topo
                       <ArrowDownCircle size={20} className="rotate-180 group-hover:-translate-y-1 transition-transform" />
                     </button>
                  </div>
               </div>
            </footer>
          </div>
        </article>
      )}
    </div>
  );
};

export default ThematicBible;
