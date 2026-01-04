
import React, { useState, useEffect, useRef } from 'react';
import { getDevotionalDay, generateDevotionalAudio } from '../services/geminiService';
import { DevotionalDayContent, DevotionalPlan } from '../types';
import { Loader2, ChevronLeft, QrCode, Sparkles, Book, CheckCircle, Share2, Play, Square, Volume2 } from 'lucide-react';
import { decodeBase64, decodeAudioData } from '../utils/audioUtils';

interface DevotionalReaderProps {
  plan: DevotionalPlan;
  onBack: () => void;
}

const DevotionalReader: React.FC<DevotionalReaderProps> = ({ plan, onBack }) => {
  const [day, setDay] = useState(1);
  const [content, setContent] = useState<DevotionalDayContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Persistence Key
  const progressKey = `noiva_progress_${plan.id}`;

  const fetchDay = async (d: number) => {
    setLoading(true);
    stopAudio();
    try {
      const data = await getDevotionalDay(plan.title, d);
      setContent(data);
      
      // Load completion status
      const savedProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
      setCompleted(!!savedProgress[d]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = () => {
    const newStatus = !completed;
    setCompleted(newStatus);
    const savedProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    savedProgress[day] = newStatus;
    localStorage.setItem(progressKey, JSON.stringify(savedProgress));
  };

  const playAudio = async () => {
    if (!content) return;
    if (isPlaying) {
      stopAudio();
      return;
    }

    setAudioLoading(true);
    try {
      const base64 = await generateDevotionalAudio(`${content.theology}. Aplicação prática: ${content.practicalApplication}`);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const audioData = decodeBase64(base64);
      const buffer = await decodeAudioData(audioData, audioContextRef.current);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        audioSourceRef.current = null;
      };

      source.start(0);
      audioSourceRef.current = source;
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio error:", error);
    } finally {
      setAudioLoading(false);
    }
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    fetchDay(day);
    return () => stopAudio();
  }, [day]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div className="relative">
           <Loader2 size={64} className="text-amber-600 animate-spin" />
           <FlameIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 animate-pulse" />
        </div>
        <div className="text-center">
           <p className="text-slate-400 font-cinzel text-xl mb-2 animate-pulse">Preparando o Óleo do Dia {day}...</p>
           <p className="text-xs text-slate-600 uppercase tracking-widest">Ouvindo a voz do Mestre</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Voltar aos Planos
        </button>
        <div className="flex items-center gap-6">
           {day > 1 && (
             <button onClick={() => setDay(day-1)} className="text-[10px] font-black text-slate-500 hover:text-amber-500 uppercase tracking-widest">Anterior</button>
           )}
           <div className="flex flex-col items-center">
             <span className="text-amber-500 font-cinzel font-bold text-lg">DIA {day} / {plan.totalDays}</span>
             <div className="w-24 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-amber-600 transition-all duration-500" style={{ width: `${(day/plan.totalDays)*100}%` }}></div>
             </div>
           </div>
           {day < plan.totalDays && (
             <button onClick={() => setDay(day+1)} className="text-[10px] font-black text-slate-500 hover:text-amber-500 uppercase tracking-widest">Próximo</button>
           )}
        </div>
      </div>

      {content && (
        <article className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
          <header className="p-8 md:p-12 border-b border-slate-800 bg-gradient-to-br from-amber-950/20 to-slate-900 relative">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles size={14}/> Devocional Profético
               </div>
               
               {/* Audio Action */}
               <button 
                  onClick={playAudio}
                  disabled={audioLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    isPlaying 
                    ? 'bg-amber-600 text-white animate-pulse' 
                    : 'bg-slate-800 text-slate-400 hover:text-amber-500 border border-slate-700'
                  }`}
               >
                 {audioLoading ? (
                   <Loader2 size={14} className="animate-spin" />
                 ) : isPlaying ? (
                   <Square size={14} fill="currentColor" />
                 ) : (
                   <Play size={14} fill="currentColor" />
                 )}
                 {isPlaying ? 'Ouvindo Narração' : 'Ouvir Revelação'}
               </button>
             </div>
             
             <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-6 leading-tight">
               {content.title}
             </h1>
             <p className="text-slate-400 font-serif-biblical italic text-lg opacity-80 border-l-2 border-amber-800/50 pl-4">
                "{plan.title}"
             </p>
          </header>

          <div className="p-8 md:p-12 space-y-16">
            <section className="bg-amber-950/5 border-l-4 border-amber-600 p-10 rounded-r-3xl shadow-inner">
               <h2 className="text-amber-600 font-cinzel font-bold text-xs mb-6 flex items-center gap-3 tracking-[0.2em] uppercase">
                 <Book size={18}/> Palavra de Hoje
               </h2>
               <p className="text-slate-100 font-serif-biblical text-3xl leading-relaxed">
                 "{content.bibleText}"
               </p>
            </section>

            <div className="grid md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <h3 className="text-amber-500 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <Volume2 size={16}/> Contexto e Teologia
                  </h3>
                  <div className="space-y-4 text-slate-400 text-base leading-relaxed">
                    <p>{content.context}</p>
                    <p className="text-slate-300">{content.theology}</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <h3 className="text-amber-500 font-bold text-xs uppercase tracking-[0.2em]">Tipologia Profética</h3>
                  <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <FlameIcon size={80} />
                    </div>
                    <p className="text-slate-200 text-lg leading-relaxed italic relative z-10">"{content.typology}"</p>
                  </div>
               </div>
            </div>

            <section className="p-10 bg-green-950/10 border border-green-900/30 rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full"></div>
               <h3 className="text-green-500 font-bold text-xs uppercase tracking-[0.2em] mb-6">Ativação Prática e Espiritual</h3>
               <p className="text-slate-200 text-lg leading-relaxed mb-8">{content.practicalApplication}</p>
               <div className="bg-green-600/10 p-8 rounded-2xl italic text-green-50 text-base border border-green-600/20 shadow-lg">
                 <strong className="text-green-400 block mb-2 uppercase text-[10px] tracking-widest">Ativação de Hoje:</strong> 
                 {content.devotionalActivation}
               </div>
            </section>

            <section className="pt-12 border-t border-slate-800 grid md:grid-cols-2 gap-12 items-center">
               <div>
                  <h4 className="text-white font-cinzel font-bold mb-6 uppercase tracking-widest text-xs">Perguntas para Meditação</h4>
                  <ul className="space-y-4">
                    {content.reflectiveQuestions.map((q, i) => (
                      <li key={i} className="flex gap-4 text-slate-400 italic text-base group">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-500 flex items-center justify-center font-bold text-[10px] flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          {i+1}
                        </span>
                        <span className="pt-0.5">{q}</span>
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="flex flex-col items-center gap-4 bg-slate-800/30 p-10 rounded-3xl border border-slate-700/50">
                  <div className="bg-white p-2 rounded-xl">
                    <QrCode size={100} className="text-slate-900" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase text-center tracking-widest leading-relaxed">
                    Escaneie para acessar o material<br/>exclusivo de apoio (PDF/Áudio)
                  </p>
               </div>
            </section>
          </div>

          <footer className="p-8 bg-slate-800/30 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex gap-4">
                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors">
                   <Share2 size={16}/> Compartilhar Revelação
                </button>
             </div>
             <button 
                onClick={toggleCompletion}
                className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 ${
                  completed 
                  ? 'bg-green-600 text-white shadow-[0_0_30px_rgba(22,163,74,0.3)]' 
                  : 'bg-amber-600 text-white shadow-[0_0_30px_rgba(217,119,6,0.3)] hover:bg-amber-500'
                }`}
             >
                {completed ? <CheckCircle size={22}/> : <FlameIcon size={22}/>}
                <span className="uppercase tracking-widest text-sm">
                  {completed ? 'Dia Concluído' : 'Marcar como Meditado'}
                </span>
             </button>
          </footer>
        </article>
      )}
      
      {/* Mini Progress bar at top of screen for scroll depth context */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[100] pointer-events-none">
         <div className="h-full bg-amber-500/50" id="reading-progress"></div>
      </div>
      
      <script>{`
        window.onscroll = function() {
          var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          var scrolled = (winScroll / height) * 100;
          document.getElementById("reading-progress").style.width = scrolled + "%";
        };
      `}</script>
    </div>
  );
};

const FlameIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.236 1.1-3.123 1.053 1.341 2.247 2.123 3.4 3.123z"/></svg>
);

export default DevotionalReader;
