
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
  Sparkles
} from 'lucide-react';

const ThematicBible: React.FC = () => {
  const [mosaic, setMosaic] = useState<PropheticMosaic | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const propheticThreads = [
    { id: "cordeiro", title: "O Cordeiro: Da Páscoa ao Trono", icon: "🐑" },
    { id: "tabernaculo", title: "O Tabernáculo: Padrão do Céu", icon: "🏛️" },
    { id: "noivo", title: "O Noivo: De Adão às Bodas", icon: "👑" },
    { id: "alianca", title: "As Alianças: Do Sinai ao Calvário", icon: "📜" },
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

  const VerseFlow: React.FC<{ verse: MosaicVerse; isFirst: boolean }> = ({ verse, isFirst }) => (
    <div className="relative mb-16 animate-in slide-in-from-bottom-8 duration-700">
      {/* Book Transition Marker */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-slate-800"></div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
           <BookMarked size={14} className="text-amber-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
             {verse.book} {verse.chapter}:{verse.verse}
           </span>
        </div>
        <div className="h-px flex-1 bg-slate-800"></div>
      </div>

      <div className="flex gap-6 md:gap-10">
        {/* Margin for Verse Number and Era Icon */}
        <div className="hidden md:flex flex-col items-center w-12 pt-2">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center border text-xs font-black mb-4 ${
             verse.era.includes('Sombra') ? 'bg-blue-900/10 border-blue-500/30 text-blue-400' :
             verse.era.includes('Realidade') ? 'bg-indigo-900/10 border-indigo-500/30 text-indigo-400' :
             'bg-amber-900/10 border-amber-500/30 text-amber-500'
           }`}>
              {verse.book.substring(0, 1)}
           </div>
           <div className="w-px flex-1 bg-gradient-to-b from-slate-800 to-transparent"></div>
        </div>

        {/* Main Text Area */}
        <div className="flex-1 space-y-6">
           <p className="font-serif-biblical text-2xl md:text-3xl text-slate-200 leading-relaxed first-letter:text-5xl first-letter:font-cinzel first-letter:mr-3 first-letter:float-left first-letter:text-amber-500">
             {verse.text}
           </p>

           {/* Revelation Key - Now integrated as a "Translator Note" */}
           <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600/30 group-hover:bg-amber-500 transition-all"></div>
              <div className="pl-6 py-2">
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase text-amber-600 tracking-widest mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Zap size={10} /> Conexão Teológica
                 </div>
                 <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors italic leading-relaxed">
                   {verse.connectionNote}
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-32 space-y-12">
      {/* Prophetic Index Header */}
      {!mosaic && !loading && (
        <div className="space-y-10 animate-in fade-in duration-700">
          <div className="text-center space-y-4">
             <div className="inline-flex items-center justify-center p-4 bg-amber-600/10 rounded-full border border-amber-600/20 mb-4">
                <Scroll size={48} className="text-amber-500" />
             </div>
             <h1 className="text-5xl md:text-6xl font-cinzel font-bold gold-gradient">Bíblia Temática</h1>
             <p className="text-slate-400 text-lg md:text-xl font-serif-biblical italic max-w-2xl mx-auto">
               "A reorganização do Cânon Sagrado para que o Mistério de Deus se revele em um único fluxo de leitura."
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {propheticThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => fetchMosaic(thread.title)}
                className="group p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] text-left transition-all hover:border-amber-500/40 hover:bg-slate-800/50 hover:-translate-y-1 active:scale-95 shadow-xl"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                  {thread.icon}
                </div>
                <h3 className="text-lg font-cinzel font-bold text-white mb-2">{thread.title}</h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest opacity-60 group-hover:opacity-100">
                  Abrir Fluxo <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-[3rem] p-12 text-center space-y-6">
             <Search size={32} className="mx-auto text-slate-700" />
             <div className="space-y-2">
                <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs">Busca por Mistério Específico</h4>
                <div className="relative max-w-md mx-auto">
                   <input 
                     type="text" 
                     placeholder="Ex: As Festas de Israel, O Tabernáculo..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-slate-200 outline-none focus:border-amber-500/50"
                   />
                   <button 
                    onClick={() => fetchMosaic(searchTerm)}
                    className="absolute right-2 top-2 bottom-2 bg-amber-600 hover:bg-amber-500 text-white px-4 rounded-xl transition-colors"
                   >
                     <ChevronRight size={18} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-48 gap-8">
          <div className="relative">
             <Loader2 size={64} className="text-amber-500 animate-spin opacity-20" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={32} className="text-amber-600 animate-pulse" />
             </div>
          </div>
          <div className="text-center space-y-2">
             <p className="text-slate-400 font-cinzel text-xl tracking-widest uppercase">Costurando as Escrituras...</p>
             <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em]">A Bíblia está se interpretando...</p>
          </div>
        </div>
      )}

      {mosaic && !loading && (
        <article className="animate-in fade-in duration-1000">
          {/* Navigation/Back Button */}
          <div className="flex items-center justify-between mb-12">
             <button 
              onClick={() => setMosaic(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-amber-500 transition-colors font-bold uppercase text-[10px] tracking-widest"
             >
                <ChevronLeft size={16} /> Voltar ao Índice do Cânon
             </button>
             <div className="flex items-center gap-2 px-3 py-1 bg-amber-600/10 border border-amber-600/20 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-widest">
                <Hash size={12} /> Fluxo Ativo
             </div>
          </div>

          {/* Mosaic Reading Area */}
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden min-h-[80vh]">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
               <div className="absolute top-0 right-0 p-12 text-[400px] font-cinzel font-bold rotate-12">Noiva</div>
            </div>

            <header className="text-center mb-24 relative">
               <div className="inline-flex items-center gap-2 mb-6 text-amber-500">
                  <BookOpen size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Leitura Interconectada</span>
               </div>
               <h2 className="text-5xl md:text-7xl font-cinzel font-bold gold-gradient mb-8 leading-tight">
                 {mosaic.title}
               </h2>
               <div className="max-w-2xl mx-auto">
                 <p className="text-xl md:text-2xl font-serif-biblical italic text-slate-400 leading-relaxed border-l-4 border-amber-600/20 pl-6 text-left">
                   "{mosaic.mystery}"
                 </p>
               </div>
            </header>

            <div className="relative">
               {/* Vertical Flow Line */}
               <div className="absolute left-6 md:left-[2.25rem] top-0 bottom-0 w-px bg-gradient-to-b from-amber-600/40 via-slate-800 to-transparent"></div>

               <div className="space-y-4">
                  {mosaic.chains.map((verse, idx) => (
                    <VerseFlow 
                      key={idx} 
                      verse={verse} 
                      isFirst={idx === 0} 
                    />
                  ))}
               </div>
            </div>

            <footer className="mt-32 pt-20 border-t border-slate-800/60 text-center">
               <div className="max-w-2xl mx-auto space-y-8">
                  <div className="flex items-center justify-center gap-3 text-amber-500/50 mb-2">
                     <ArrowDownCircle size={32} className="animate-bounce" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Conclusão da Revelação</h3>
                  <p className="text-2xl md:text-3xl font-serif-biblical italic text-slate-300 leading-relaxed">
                    {mosaic.conclusion}
                  </p>
                  <div className="pt-12">
                     <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
                     >
                       Subir para o Início
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
