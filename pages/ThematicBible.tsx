
import React, { useState, useRef } from 'react';
import { getPropheticMosaic, generatePropheticImage, generateNarration, generatePropheticVideo } from '../services/geminiService';
import { PropheticMosaic, MosaicVerse } from '../types';
import { decodeBase64, decodeAudioData } from '../utils/audioUtils';
import { 
  Loader2, Scroll, BookMarked, ChevronRight, ChevronLeft, Search, Zap, BookOpen, Hash,
  ArrowDownCircle, Sparkles, Clock, Shield, Plus, Megaphone, Globe, Sword, Eye, Info,
  Calendar, Image as ImageIcon, Video, Play, Volume2, Square, Sparkle
} from 'lucide-react';

const ThematicBible: React.FC = () => {
  const [mosaic, setMosaic] = useState<PropheticMosaic | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const propheticThreads = [
    { id: "daniel_tempo", title: "Daniel: O Relógio de Deus e as 70 Semanas", icon: "⏳" },
    { id: "estatua_reinos", title: "Daniel 2: A Estátua e os Reinos do Mundo", icon: "🦁" },
    { id: "bestas_mar", title: "Daniel 7: As Quatro Bestas do Mar", icon: "🐉" },
    { id: "cordeiro", title: "O Cordeiro: Da Páscoa ao Trono", icon: "🐑" },
    { id: "tabernaculo", title: "O Tabernáculo: Padrão do Céu", icon: "🏛️" },
    { id: "apocalipse_daniel", title: "Sincronia Daniel-Apocalipse", icon: "⚡" }
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

  const MediaGallery: React.FC<{ verse: MosaicVerse }> = ({ verse }) => {
    const [image, setImage] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isGeneratingImg, setIsGeneratingImg] = useState(false);
    const [isGeneratingVid, setIsGeneratingVid] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    const handleGenerateImage = async () => {
      setIsGeneratingImg(true);
      try {
        const url = await generatePropheticImage(verse.imagePrompt);
        setImage(url);
      } catch (e) { console.error(e); }
      finally { setIsGeneratingImg(false); }
    };

    const handleGenerateVideo = async () => {
      // Verificação de Chave Veo
      if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
           alert("Para gerar Vídeos Cinematográficos (Veo), é necessária uma chave de API paga. Por favor, selecione sua chave.");
           await (window as any).aistudio.openSelectKey();
        }
      }
      setIsGeneratingVid(true);
      try {
        const url = await generatePropheticVideo(verse.videoPrompt);
        setVideoUrl(url);
      } catch (e) { console.error(e); }
      finally { setIsGeneratingVid(false); }
    };

    const handlePlayAudio = async () => {
      if (isPlaying) {
        audioSourceRef.current?.stop();
        setIsPlaying(false);
        return;
      }
      setIsAudioLoading(true);
      try {
        const base64 = await generateNarration(verse.narrationScript);
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const buffer = await decodeAudioData(decodeBase64(base64), audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsPlaying(false);
        source.start(0);
        audioSourceRef.current = source;
        setIsPlaying(true);
      } catch (e) { console.error(e); }
      finally { setIsAudioLoading(false); }
    };

    return (
      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleGenerateImage}
            disabled={isGeneratingImg}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600/10 border border-amber-600/30 rounded-xl text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all disabled:opacity-50"
          >
            {isGeneratingImg ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
            {image ? 'Regerar Visão' : 'Manifestar Visão (IA)'}
          </button>

          <button 
            onClick={handlePlayAudio}
            disabled={isAudioLoading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              isPlaying ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse' : 'bg-indigo-600/10 text-indigo-400 border-indigo-900/30 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            {isAudioLoading ? <Loader2 size={14} className="animate-spin" /> : isPlaying ? <Square size={14} /> : <Volume2 size={14} />}
            {isPlaying ? 'Ouvindo Interpretação' : 'Ouvir Profecia'}
          </button>

          <button 
            onClick={handleGenerateVideo}
            disabled={isGeneratingVid}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-950/20 border border-red-900/30 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
          >
            {isGeneratingVid ? <Loader2 size={14} className="animate-spin" /> : <Video size={14} />}
            {videoUrl ? 'Cinemática Pronta' : 'Gerar Cinemática Veo'}
          </button>
        </div>

        {/* Display de Mídia Gerada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {isGeneratingImg && (
             <div className="aspect-video bg-slate-950 rounded-2xl flex flex-col items-center justify-center gap-4 border border-amber-900/20">
               <Sparkles size={32} className="text-amber-500 animate-pulse" />
               <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pintando a Visão Profética...</p>
             </div>
           )}
           {image && !isGeneratingImg && (
             <div className="relative group overflow-hidden rounded-2xl border border-amber-500/30 shadow-2xl">
                <img src={image} alt="Visão Profética" className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                   <p className="text-[10px] text-amber-500 font-bold italic leading-tight">Representação gerada por IA da visão de Daniel</p>
                </div>
             </div>
           )}

           {isGeneratingVid && (
             <div className="aspect-video bg-slate-950 rounded-2xl flex flex-col items-center justify-center gap-4 border border-red-900/20">
               <div className="flex items-center gap-2">
                  <Video size={24} className="text-red-500 animate-bounce" />
                  <Loader2 size={24} className="text-red-500 animate-spin" />
               </div>
               <p className="text-[10px] font-black text-red-600 uppercase tracking-widest text-center px-4">
                 Modelando Cinemática Veo...<br/>(Isso pode levar alguns minutos)
               </p>
             </div>
           )}
           {videoUrl && !isGeneratingVid && (
             <div className="rounded-2xl border border-red-500/30 shadow-2xl overflow-hidden bg-black aspect-video">
                <video src={videoUrl} controls className="w-full h-full" poster={image || ''} />
             </div>
           )}
        </div>
      </div>
    );
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
        <div className="bg-slate-900/60 px-6 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
             <Clock size={12} className="text-amber-600" /> {verse.dateRange}
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
             <Globe size={12} className="text-blue-600" /> {verse.locationMarker}
           </div>
        </div>
        <div className="flex border-b border-slate-800">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'bg-slate-800/50' : 'hover:bg-slate-900/40'}`}
             >
                <tab.icon size={16} className={activeTab === tab.id ? tab.color : 'text-slate-600'} />
                <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'text-white' : 'text-slate-600'}`}>{tab.label}</span>
             </button>
           ))}
        </div>
        <div className="p-8">
           <div className="animate-in fade-in slide-in-from-top-2 duration-300">
             <p className="text-sm md:text-base text-slate-400 leading-relaxed font-serif-biblical italic">
               {tabs.find(t => t.id === activeTab)?.content}
             </p>
           </div>
        </div>
      </div>
    );
  };

  const VerseFlow: React.FC<{ verse: MosaicVerse }> = ({ verse }) => (
    <div className="relative mb-32 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-slate-800"></div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full shadow-lg">
           <BookMarked size={14} className="text-amber-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{verse.book} {verse.chapter}:{verse.verse}</span>
        </div>
        <div className="h-px flex-1 bg-slate-800"></div>
      </div>

      <div className="flex gap-6 md:gap-10">
        <div className="hidden md:flex flex-col items-center w-12 pt-2 gap-3">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center border text-xs font-black transition-all duration-500 ${verse.era.includes('Sombra') ? 'bg-blue-900/10 border-blue-500/30 text-blue-400' : verse.era.includes('Realidade') ? 'bg-indigo-900/10 border-indigo-500/30 text-indigo-400' : 'bg-amber-900/10 border-amber-500/30 text-amber-500'}`}>
              {verse.book.substring(0, 1)}
           </div>
           <div className="w-px flex-1 bg-gradient-to-b from-slate-800 to-transparent min-h-[150px]"></div>
        </div>

        <div className="flex-1">
           <div className="relative">
              <p className="font-serif-biblical text-3xl md:text-5xl text-slate-100 leading-tight first-letter:text-7xl first-letter:font-cinzel first-letter:mr-3 first-letter:float-left first-letter:text-amber-500">
                {verse.text}
              </p>
           </div>

           {/* Camada Multimedia */}
           <MediaGallery verse={verse} />

           {/* Camada Analítica */}
           <VerseInsight verse={verse} />
           
           <div className="mt-6 flex items-start gap-4 p-5 rounded-2xl bg-amber-600/5 border border-amber-600/10">
              <Zap size={20} className="text-amber-500 shrink-0 mt-1" />
              <div>
                 <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest block mb-1">Unificação de Mistérios</span>
                 <p className="text-sm text-slate-400 italic leading-relaxed">{verse.connectionNote}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-32 space-y-12">
      {!mosaic && !loading && (
        <div className="space-y-12 animate-in fade-in duration-700">
          <div className="text-center space-y-6">
             <div className="inline-flex items-center justify-center p-6 bg-amber-600/10 rounded-full border border-amber-600/20 mb-4 shadow-[0_0_50px_rgba(217,119,6,0.15)]">
                <Scroll size={64} className="text-amber-500" />
             </div>
             <h1 className="text-6xl md:text-8xl font-cinzel font-bold gold-gradient">Estação Daniel 4.0</h1>
             <p className="text-slate-400 text-xl md:text-3xl font-serif-biblical italic max-w-4xl mx-auto leading-relaxed">
               "A primeira Bíblia Multidimensional. Veja as visões de Daniel, ouça a interpretação do Atalaia e presencie a cinemática do Reino."
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propheticThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => fetchMosaic(thread.title)}
                className="group p-12 bg-slate-900 border border-slate-800 rounded-[4rem] text-left transition-all hover:border-amber-500/50 hover:bg-slate-800/80 hover:-translate-y-3 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -right-12 -top-12 opacity-[0.05] group-hover:opacity-[0.12] transition-all duration-700">
                   <Shield size={220} />
                </div>
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform inline-block">
                  {thread.icon}
                </div>
                <h3 className="text-2xl font-cinzel font-bold text-white mb-4 leading-tight">{thread.title}</h3>
                <div className="flex items-center gap-3 text-[12px] font-black text-amber-600 uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100">
                  Acessar Hub de Mídia <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-slate-900/40 border-2 border-slate-800 border-dashed rounded-[5rem] p-20 text-center space-y-8">
             <div className="flex items-center justify-center gap-6 text-slate-700">
                <ImageIcon size={48} />
                <Video size={48} />
                <Volume2 size={48} />
             </div>
             <div className="space-y-6">
                <h4 className="text-slate-500 font-bold uppercase tracking-[0.5em] text-sm">Pesquisa Multidimensional Customizada</h4>
                <div className="relative max-w-2xl mx-auto">
                   <input 
                     type="text" 
                     placeholder="Ex: Daniel 10 e a Batalha no Segundo Céu..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-800 rounded-full px-10 py-8 text-xl text-slate-200 outline-none focus:border-amber-500/50 shadow-2xl"
                   />
                   <button 
                    onClick={() => fetchMosaic(searchTerm)}
                    className="absolute right-4 top-4 bottom-4 bg-amber-600 hover:bg-amber-500 text-white px-10 rounded-full transition-all font-black text-sm uppercase tracking-widest shadow-xl"
                   >
                     Gerar Hub
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-72 gap-12">
          <div className="relative">
             <div className="absolute inset-0 bg-amber-500/20 blur-[150px] animate-pulse"></div>
             <Loader2 size={120} className="text-amber-500 animate-spin opacity-20" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={64} className="text-amber-600 animate-pulse" />
             </div>
          </div>
          <div className="text-center space-y-6">
             <p className="text-slate-400 font-cinzel text-4xl tracking-[0.3em] uppercase">Construindo Hub Multimedia...</p>
             <p className="text-sm text-slate-600 uppercase font-black tracking-[0.6em]">Gerando visões, áudios e cinemáticas proféticas</p>
          </div>
        </div>
      )}

      {mosaic && !loading && (
        <article className="animate-in fade-in duration-1000">
          <div className="flex items-center justify-between mb-16">
             <button onClick={() => setMosaic(null)} className="flex items-center gap-4 text-slate-500 hover:text-amber-500 transition-colors font-black uppercase text-sm tracking-[0.3em] group">
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> Retornar à Estação
             </button>
             <div className="flex items-center gap-4 px-8 py-3 bg-amber-600/10 border border-amber-600/20 rounded-full text-amber-500 text-sm font-black uppercase tracking-[0.3em] shadow-2xl">
                <Hash size={18} /> Arquivos Multimedia Des-selados
             </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-[5rem] p-12 md:p-32 shadow-[0_0_150px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <header className="text-center mb-48 relative">
               <div className="inline-flex items-center gap-6 mb-12 text-amber-500/60">
                  <div className="h-px w-20 bg-amber-900/30"></div>
                  <Sparkle size={32} />
                  <span className="text-sm font-black uppercase tracking-[0.6em]">Revelação Visual & Sonora</span>
                  <div className="h-px w-20 bg-amber-900/30"></div>
               </div>
               <h2 className="text-7xl md:text-9xl font-cinzel font-bold gold-gradient mb-12 leading-none">{mosaic.title}</h2>
               <div className="max-w-5xl mx-auto">
                 <p className="text-3xl md:text-5xl font-serif-biblical italic text-slate-300 leading-tight border-l-[12px] border-amber-600/20 pl-16 text-left">{mosaic.mystery}</p>
               </div>
            </header>

            <div className="relative">
               <div className="absolute left-6 md:left-[2.25rem] top-0 bottom-0 w-px bg-gradient-to-b from-amber-600/60 via-slate-800/40 to-transparent"></div>
               <div className="space-y-64">
                  {mosaic.chains.map((verse, idx) => (
                    <VerseFlow key={idx} verse={verse} />
                  ))}
               </div>
            </div>

            <footer className="mt-64 pt-32 border-t border-slate-800/60 text-center">
               <div className="max-w-4xl mx-auto space-y-16">
                  <div className="flex items-center justify-center gap-6 text-amber-500/20">
                     <ArrowDownCircle size={80} className="animate-bounce" />
                  </div>
                  <div className="space-y-8">
                    <h3 className="text-sm font-black uppercase tracking-[0.8em] text-amber-600/60">Síntese Multimedia do Atalaia</h3>
                    <p className="text-4xl md:text-6xl font-serif-biblical italic text-slate-100 leading-none bg-slate-950/60 p-24 rounded-[4rem] border border-amber-900/20 shadow-inner">{mosaic.conclusion}</p>
                  </div>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group flex items-center gap-6 mx-auto bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white px-16 py-8 rounded-[3rem] text-sm font-black uppercase tracking-[0.4em] transition-all shadow-2xl">
                    Subir ao Topo da Torre <ArrowDownCircle size={24} className="rotate-180 group-hover:-translate-y-2 transition-transform" />
                  </button>
               </div>
            </footer>
          </div>
        </article>
      )}
    </div>
  );
};

export default ThematicBible;
