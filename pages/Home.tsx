
import React from 'react';
import { Flame, BookOpen, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { AppView } from '../types';

interface HomeProps {
  onNavigate: (view: AppView) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/20 border border-slate-800 p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 border border-amber-600/30 text-amber-500 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} />
            Devocional do Dia
          </div>
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-4 leading-tight">
            "Vigiai, pois, porque não sabeis o dia nem a hora."
          </h1>
          <p className="text-slate-400 text-lg mb-8 font-serif-biblical italic">
            Como as virgens prudentes, mantenha sua lâmpada cheia de óleo. A noite está avançada, e o dia está próximo.
          </p>
          <button 
            onClick={() => onNavigate(AppView.DEVOTIONAL)}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
          >
            Começar Preparação de Hoje
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="absolute right-[-50px] bottom-[-50px] opacity-10 pointer-events-none">
          <Flame size={400} />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:border-amber-500/50 transition-colors group">
          <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Enciclopédia</h3>
          <p className="text-slate-400 text-sm mb-4">Explore 300 volumes de profundidade teológica e escatológica.</p>
          <button onClick={() => onNavigate(AppView.ENCYCLOPEDIA)} className="text-amber-500 font-semibold text-sm flex items-center gap-1 hover:underline">
            Ver Volumes <ArrowRight size={14} />
          </button>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:border-amber-500/50 transition-colors group">
          <div className="w-12 h-12 bg-amber-600/10 rounded-lg flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Glossário Profético</h3>
          <p className="text-slate-400 text-sm mb-4">Entenda os símbolos bíblicos: do Óleo à Sétima Trombeta.</p>
          <button onClick={() => onNavigate(AppView.GLOSSARY)} className="text-amber-500 font-semibold text-sm flex items-center gap-1 hover:underline">
            Explorar Termos <ArrowRight size={14} />
          </button>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:border-amber-500/50 transition-colors group">
          <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center text-green-500 mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Atalaia AI</h3>
          <p className="text-slate-400 text-sm mb-4">Tire suas dúvidas sobre arrebatamento, milênio e juízo final.</p>
          <button onClick={() => onNavigate(AppView.CHAT)} className="text-amber-500 font-semibold text-sm flex items-center gap-1 hover:underline">
            Falar com a IA <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-cinzel font-bold">Progresso da Noiva</h2>
          <span className="text-amber-500 text-sm font-bold">42% Preparada</span>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { label: "Estudo sobre as Dez Virgens", done: true },
              { label: "Vigília da Madrugada (7 dias)", done: false },
              { label: "Conhecimento do Glossário 'A'", done: true },
              { label: "Compreensão da Tipologia do Óleo", done: false },
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border ${task.done ? 'bg-green-600 border-green-600 flex items-center justify-center' : 'border-slate-700'}`}>
                  {task.done && <ShieldCheck size={14} className="text-white" />}
                </div>
                <span className={task.done ? 'text-slate-400 line-through' : 'text-slate-200'}>{task.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-600 h-full w-[42%]"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
