
import React from 'react';
import { Flame, Star, Calendar, ChevronRight, CheckCircle2, Trophy } from 'lucide-react';
import { AppView, DevotionalPlan } from '../types';

interface DevotionalPageProps {
  onSelectPlan: (plan: DevotionalPlan) => void;
}

const DevotionalPage: React.FC<DevotionalPageProps> = ({ onSelectPlan }) => {
  const plans: DevotionalPlan[] = [
    {
      id: 'plan_3',
      title: "A Voz do Sétimo Anjo",
      description: "21 dias de consagração e entendimento profundo sobre as trombetas finais e o mistério de Deus consumado.",
      totalDays: 21,
      category: "Profecia",
      active: true
    },
    {
      id: 'plan_1',
      title: "As Sete Igrejas do Apocalipse",
      description: "Uma jornada de 7 dias de arrependimento e despertamento para a Noiva.",
      totalDays: 7,
      category: "Escatologia",
      active: true
    },
    {
      id: 'plan_4',
      title: "O Chamado Urgente",
      description: "7 dias de imersão na promessa do Arrebatamento, fundamentada na gloriosa esperança de 1 Tessalonicenses 4:16-17.",
      totalDays: 7,
      category: "Escatologia",
      active: true
    },
    {
      id: 'plan_2',
      title: "O Mistério das Dez Virgens",
      description: "14 dias focados na vigilância e no acúmulo de óleo espiritual para o encontro com o Noivo.",
      totalDays: 14,
      category: "Preparação",
      active: true
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-cinzel font-bold gold-gradient mb-2">Devocionais Proféticos</h1>
          <p className="text-slate-400">Jornadas de ativação espiritual para o despertamento da Noiva.</p>
        </div>
        <div className="flex items-center gap-2 text-amber-500 font-bold bg-amber-600/10 px-4 py-2 rounded-full border border-amber-600/20">
           <Star size={16} fill="currentColor" />
           <span className="text-sm">520 Meditantes Hoje</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`group relative overflow-hidden bg-slate-900 border ${plan.active ? 'border-slate-800 hover:border-amber-500/50' : 'border-slate-800/50 opacity-60'} rounded-2xl transition-all shadow-xl flex flex-col`}
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-600/10 px-2 py-1 rounded">
                  {plan.category}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                   <Calendar size={12}/> {plan.totalDays} Dias
                </span>
              </div>
              
              {plan.totalDays > 14 && (
                <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                  <Trophy size={14} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Jornada de Alta Consagração</span>
                </div>
              )}

              <h3 className="text-xl font-cinzel font-bold mb-2 text-white group-hover:text-amber-500 transition-colors">
                {plan.title}
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed flex-1">
                {plan.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                {plan.active ? (
                  <button 
                    onClick={() => onSelectPlan(plan)}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                  >
                    Iniciar Jornada <ChevronRight size={14}/>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 uppercase italic">Em Breve</span>
                )}
                
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800"></div>
                   ))}
                </div>
              </div>
            </div>
            {plan.active && (
               <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
                  <Flame size={48} className="text-amber-500" />
               </div>
            )}
          </div>
        ))}
      </div>

      <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
         <h2 className="text-2xl font-cinzel font-bold mb-6 flex items-center gap-3">
           <CheckCircle2 size={24} className="text-green-500"/> Suas Conquistas
         </h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Vigilante Nível 1", desc: "Completou 3 dias" },
              { label: "Cheia de Óleo", desc: "7 dias seguidos" },
              { label: "Atalaia Fiel", desc: "14 devocionais" },
              { label: "Lâmpada Acesa", desc: "Iniciou 1 plano" },
            ].map((badge, i) => (
              <div key={i} className="bg-slate-800/50 p-4 rounded-xl text-center border border-slate-700/50">
                <div className="w-10 h-10 bg-amber-600/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                   <Star size={20} className="text-amber-600"/>
                </div>
                <h4 className="text-xs font-bold mb-1">{badge.label}</h4>
                <p className="text-[10px] text-slate-500">{badge.desc}</p>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default DevotionalPage;
