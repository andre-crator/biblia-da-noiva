
import React, { useState, useRef, useEffect } from 'react';
import { getPropheticMosaic, generatePropheticImage, generateNarration, generatePropheticVideo } from '../services/geminiService';
import { PropheticMosaic, MosaicVerse } from '../types';
import { decodeBase64, decodeAudioData } from '../utils/audioUtils';
import { 
  Loader2, Scroll, BookMarked, ChevronRight, ChevronLeft, Search, Zap, BookOpen, Hash,
  ArrowDownCircle, Sparkles, Clock, Shield, Globe, Sword, Eye, Info,
  Calendar, Image as ImageIcon, Video, Play, Volume2, Square, Sparkle, Target, Map as MapIcon,
  Activity, Radio, History, AlertTriangle, Flame
} from 'lucide-react';

const ThematicBible: React.FC = () => {
  const [mosaic, setMosaic] = useState<PropheticMosaic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const propheticThreads = [
    { id: "daniel_war_room", title: "Daniel e a Geopolítica Final", icon: "📡" },
    { id: "estatua_reinos", title: "A Estátua de Nabucodonosor", icon: "🏆" },
    { id: "bestas_mar", title: "As Quatro Bestas de Daniel 7", icon: "🦁" },
    { id: "70_semanas", title: "As 70 Semanas de Daniel", icon: "⏳" },
    { id: "batalha_ceus", title: "Conflitos nas Regiões Celestiais", icon: "⚔️" },
    { id: "rei_norte_sul", title: "O Rei do Norte e do Sul", icon: "🧭" }
  ];

  const fetchMosaic = async (theme: string) => {
    console.log("Iniciando Protocolo de Inteligência para:", theme);
    setLoading(true);
    setError(null);
    try {
      const data = await getPropheticMosaic(theme);
      if (!data || !data.chains || data.chains.length === 0) {
        throw new Error("A transmissão foi interrompida ou os dados estão incompletos.");
      }
      setMosaic(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      console.error("Erro no Hub Profético:", e);
      setError(e.message || "Interferência na Sala de Guerra. O Atalaia encontrou um erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const PropheticStation: React.FC<{ verse: MosaicVerse }> = ({ verse }) => {
    const [image, setImage] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isGeneratingImg, setIsGeneratingImg] = useState(false);
    const [isGeneratingVid, setIsGeneratingVid] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioLoading, setAudioLoading] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    // Gera a visão visual assim que a estação é montada
    useEffect(() => {
      let isMounted = true;
      if (!image && !isGeneratingImg) {
        setIsGeneratingImg(true);
        generatePropheticImage(verse.imagePrompt)
          .then(url => { if (isMounted) setImage(url); })
          .catch(e => console.error("Falha visual:", e))
          .finally(() => { if (isMounted) setIsGeneratingImg(false); });
      }
      return () => { isMounted = false; };
    }, [verse.imagePrompt]);

    const handlePlayAudio = async () => {
      if (isPlaying) {
        audioSourceRef.current?.stop();
        setIsPlaying(false);
        return;
      }
      setAudioLoading(true);
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
      } catch (e) { console.error("Falha sonora:", e); }
      finally { setAudioLoading(false); }
    };

    const handleGenerateVideo = async () => {
      if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) await (window as any).aistudio.openSelectKey();
      }
      setIsGeneratingVid(true);
      try {
        const url = await generatePropheticVideo(verse.videoPrompt);
        setVideoUrl(url);
      } catch (e) { console.error("Falha cinemática:", e); }
      finally { setIsGeneratingVid(false); }
    };

    return (
      <div className="relative mb-64 animate-in slide-in-from-bottom-12 duration-1000 group">
        {/* Backdrop Visual Integrado */}
        <div className="absolute inset-0 -top-40 -bottom-40 opacity-15 pointer-events-none overflow-hidden blur-3xl transition-opacity duration-1000 group-hover:opacity-25">
           {image && <img src={image} className="w-full h-full object-cover scale-150" alt="" />}
        </div>

        {/* Tactical HUD Header */}
        <div className="flex flex-wrap items-center gap-4 mb-12 relative z-10">
           <div className="px-5 py-2 bg-amber-600/10 border border-amber-600/30 rounded-full flex items-center gap-2 shadow-xl backdrop-blur-md">
              <Clock size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">{verse.dateRange}</span>
           </div>
           <div className="px-5 py-2 bg-blue-600/10 border border-blue-600/30 rounded-full flex items-center gap-2 backdrop-blur-md">
              <MapIcon size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{verse.locationMarker}</span>
           </div>
           <div className="h-px flex-1 bg-slate-800/40"></div>
           <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-500 tracking-widest uppercase">
              ESTAÇÃO: {verse.book.toUpperCase()} {verse.chapter}:{verse.verse}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
           {/* Visual Media Column */}
           <div className="lg:col-span-6 space-y-8">
              <div className="relative rounded-[3rem] overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-950 aspect-[16/10] group/media">
                 {isGeneratingImg ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900/60 backdrop-blur-md">
                      <Loader2 size={48} className="text-amber-500 animate-spin" />
                      <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Sintonizando Visão...</span>
                   </div>
                 ) : image ? (
                    <img src={image} className="w-full h-full object-cover transition-transform duration-1000 group-hover/media:scale-110" alt="Visão" />
                 ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
                       <ImageIcon size={48} className="text-slate-800" />
                    </div>
                 )}
                 
                 {!videoUrl && !isGeneratingVid && (
                   <button 
                    onClick={handleGenerateVideo}
                    className="absolute bottom-8 right-8 flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-6 py-4 rounded-3xl shadow-2xl transition-all hover:scale-105 active:scale-95"
                   >
                     <Video size={20} className="animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Ver Dinâmica (Veo)</span>
                   </button>
                 )}
              </div>

              {videoUrl && (
                <div className="rounded-[3rem] overflow-hidden border border-red-500/30 shadow-2xl bg-black aspect-video animate-in zoom-in-95">
                  <video src={videoUrl} controls className="w-full h-full" autoPlay loop />
                </div>
              )}
              {isGeneratingVid && (
                <div className="aspect-video bg-slate-950 rounded-[3rem] border border-red-900/30 flex flex-col items-center justify-center gap-6">
                   <Video size={48} className="text-red-500 animate-bounce" />
                   <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Processando Inteligência Veo...</span>
                </div>
              )}

              <button 
                onClick={handlePlayAudio}
                className={`w-full p-8 rounded-[2.5rem] border transition-all duration-500 flex items-center justify-between ${
                  isPlaying ? 'bg-indigo-600 border-indigo-400 shadow-2xl' : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 backdrop-blur-md'
                }`}
              >
                 <div className="flex items-center gap-6 text-left">
                    <div className={`p-4 rounded-2xl ${isPlaying ? 'bg-white text-indigo-600' : 'bg-indigo-600/20 text-indigo-400'}`}>
                       {audioLoading ? <Loader2 className="animate-spin" /> : isPlaying ? <Square size={24} fill="currentColor" /> : <Volume2 size={24} />}
                    </div>
                    <div>
                       <p className={`text-xs font-black uppercase tracking-[0.3em] ${isPlaying ? 'text-white' : 'text-slate-200'}`}>
                         {isPlaying ? 'Narração Ativa' : 'Des-selar com Áudio'}
                       </p>
                       <p className="text-[10px] italic font-serif-biblical text-slate-500">Protocolo de Áudio Atalaia</p>
                    </div>
                 </div>
                 {isPlaying && (
                    <div className="flex gap-1 items-end h-8 pr-4">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="w-1 bg-white/60 animate-bounce" style={{ height: `${20 + Math.random()*80}%`, animationDelay: `${i*0.1}s` }}></div>
                      ))}
                    </div>
                 )}
              </button>
           </div>

           {/* Data and Insights Column */}
           <div className="lg:col-span-6 space-y-12">
              <div className="space-y-8">
                 <div className="flex items-center gap-3 text-amber-500/60">
                    <Radio size={20} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Transmissão Codificada</span>
                 </div>
                 <h3 className="text-4xl md:text-6xl font-cinzel font-bold text-white leading-none">
                   {verse.book} {verse.chapter}:{verse.verse}
                 </h3>
                 <p className="font-serif-biblical text-3xl md:text-5xl text-slate-100 leading-tight italic border-l-8 border-amber-600/30 pl-10 py-2">
                   "{verse.text}"
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-8 rounded-[2.5rem] bg-blue-950/20 border border-blue-900/30 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3 text-blue-500">
                       <History size={18} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Base Histórica</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{verse.historicalContext}</p>
                 </div>
                 <div className="p-8 rounded-[2.5rem] bg-red-950/20 border border-red-900/30 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3 text-red-500">
                       <Sword size={18} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Geopolítica Atual</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{verse.geopoliticalAnalysis}</p>
                 </div>
                 <div className="p-8 rounded-[2.5rem] bg-amber-950/20 border border-amber-900/30 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3 text-amber-500">
                       <Eye size={18} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Mistério Espiritual</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{verse.spiritualMystery}</p>
                 </div>
                 <div className="p-8 rounded-[2.5rem] bg-green-950/20 border border-green-900/30 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3 text-green-500">
                       <Globe size={18} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Status de Agora</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{verse.currentRelevance}</p>
                 </div>
              </div>

              <div className="p-10 rounded-[3rem] bg-slate-900 border border-amber-600/20 flex items-start gap-8 shadow-2xl">
                 <div className="p-4 bg-amber-600/10 rounded-3xl text-amber-500">
                    <Target size={28} />
                 </div>
                 <div>
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-[0.4em] block mb-2">Conexão da Cadeia Profética</span>
                    <p className="text-xl md:text-2xl text-slate-300 font-serif-biblical italic leading-relaxed">{verse.connectionNote}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-64 space-y-20 px-4">
      {/* Visualização Principal: Hubs de Hubs */}
      {!mosaic && !loading && (
        <div className="space-y-20 animate-in fade-in duration-1000">
          <div className="text-center space-y-10">
             <div className="inline-flex items-center justify-center p-10 bg-slate-900 rounded-[4rem] border border-amber-600/20 mb-4 shadow-2xl relative">
                <div className="absolute inset-0 bg-amber-500/10 blur-[80px] animate-pulse"></div>
                <Radio size={100} className="text-amber-500 relative z-10" />
             </div>
             <h1 className="text-7xl md:text-9xl font-cinzel font-bold gold-gradient leading-none tracking-tighter">SALA DE GUERRA</h1>
             <p className="text-slate-400 text-2xl md:text-4xl font-serif-biblical italic max-w-6xl mx-auto leading-tight">
               "Sintonize a frequência profética para des-selar os mistérios geopolíticos e espirituais do fim."
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {propheticThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => fetchMosaic(thread.title)}
                className="group p-14 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[5rem] text-left transition-all hover:border-amber-500/50 hover:bg-slate-800 hover:-translate-y-5 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -right-20 -top-20 opacity-[0.05] group-hover:opacity-[0.2] transition-all duration-1000 scale-150">
                   <Target size={320} />
                </div>
                <div className="text-8xl mb-12 group-hover:scale-125 transition-transform inline-block drop-shadow-2xl">
                  {thread.icon}
                </div>
                <h3 className="text-3xl font-cinzel font-bold text-white mb-6 leading-tight group-hover:gold-gradient transition-all">{thread.title}</h3>
                <div className="flex items-center gap-4 text-[12px] font-black text-amber-600 uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100">
                  Acessar Hub de Dados <ChevronRight size={20} />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-slate-900/60 border-2 border-slate-800 border-dashed rounded-[7rem] p-24 text-center space-y-12">
             <h4 className="text-slate-500 font-bold uppercase tracking-[0.8em] text-sm">Pesquisa Personalizada por Frequência</h4>
             <div className="relative max-w-4xl mx-auto">
                <input 
                  type="text" 
                  placeholder="Ex: Daniel 11 e o Rei do Norte..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-full px-16 py-12 text-3xl text-slate-200 outline-none focus:border-amber-500/50 shadow-inner font-serif-biblical"
                />
                <button 
                  onClick={() => fetchMosaic(searchTerm)}
                  className="absolute right-8 top-8 bottom-8 bg-amber-600 hover:bg-amber-500 text-white px-16 rounded-full transition-all font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 flex items-center gap-3"
                >
                  Processar <Zap size={18} />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Tela de Processamento Imersiva */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-80 gap-16">
          <div className="relative">
             <div className="absolute inset-0 bg-amber-500/30 blur-[250px] animate-pulse"></div>
             <div className="w-48 h-48 border-[6px] border-amber-600/20 border-t-amber-500 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <Radio size={64} className="text-amber-500 animate-pulse" />
             </div>
          </div>
          <div className="text-center space-y-8">
             <p className="text-slate-400 font-cinzel text-5xl md:text-7xl tracking-[0.5em] uppercase leading-none">Des-selando Arquivos...</p>
             <p className="text-sm text-slate-600 uppercase font-black tracking-[0.8em]">Buscando dados no Trono da Revelação e Grounding Global</p>
          </div>
        </div>
      )}

      {/* Alerta de Falha Técnica */}
      {error && !loading && (
        <div className="py-40 flex flex-col items-center gap-10 text-center animate-in zoom-in-95">
           <AlertTriangle size={80} className="text-red-500" />
           <p className="text-3xl text-slate-400 font-serif-biblical italic max-w-2xl">{error}</p>
           <button 
             onClick={() => { setMosaic(null); setError(null); }} 
             className="px-12 py-5 bg-slate-800 rounded-3xl text-white font-black uppercase tracking-widest hover:bg-slate-700 transition-all"
           >
             Tentar Nova Sintonização
           </button>
        </div>
      )}

      {/* Conteúdo Gerado do Mosaico */}
      {mosaic && !loading && (
        <article className="animate-in fade-in duration-1000">
          <header className="text-center mb-80 relative">
             <button onClick={() => setMosaic(null)} className="absolute -top-32 left-0 flex items-center gap-4 text-slate-500 hover:text-amber-500 font-black uppercase text-xs tracking-widest group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Voltar à Central
             </button>
             <h2 className="text-8xl md:text-[14rem] font-cinzel font-bold gold-gradient mb-20 leading-none tracking-tighter drop-shadow-2xl">{mosaic.title}</h2>
             <div className="max-w-7xl mx-auto p-20 bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-[5rem] shadow-2xl">
               <p className="text-4xl md:text-7xl font-serif-biblical italic text-slate-100 leading-tight text-center">{mosaic.mystery}</p>
             </div>
          </header>

          <div className="space-y-96">
             {mosaic.chains.map((verse, idx) => (
               <PropheticStation key={idx} verse={verse} />
             ))}
          </div>

          <footer className="mt-96 pb-64 text-center">
             <div className="max-w-6xl mx-auto space-y-16">
               <Target size={120} className="text-amber-500/10 animate-spin-slow mx-auto" />
               <p className="text-5xl md:text-[5.5rem] font-serif-biblical italic text-white leading-none bg-slate-950/90 p-32 rounded-[6rem] border border-amber-900/20 shadow-2xl">
                 {mosaic.conclusion}
               </p>
               <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mx-auto bg-slate-900 hover:bg-amber-600 text-slate-400 hover:text-white px-24 py-12 rounded-[5rem] text-sm font-black uppercase tracking-[0.8em] transition-all border border-slate-800 active:scale-95">
                 Retornar ao Topo da Torre
               </button>
             </div>
          </footer>
        </article>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ThematicBible;
