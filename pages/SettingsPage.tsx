
import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Moon, 
  BrainCircuit, 
  Type, 
  Trash2, 
  ShieldAlert, 
  Info,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  Globe,
  Database
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [thinkingMode, setThinkingMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearData = () => {
    if (confirm("Deseja realmente limpar todo o progresso de devocionais e enciclopédia?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-cinzel font-bold gold-gradient mb-2">Configurações</h1>
          <p className="text-slate-400">Personalize sua experiência profética no Bíblia da Noiva.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          {saved ? <Check size={18} /> : <Zap size={18} />}
          {saved ? 'Salvo' : 'Salvar Alterações'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo - Perfil */}
        <aside className="lg:col-span-1 space-y-8">
          <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-center shadow-xl">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-white text-3xl shadow-lg border-4 border-slate-900 overflow-hidden">
                N
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center text-white">
                <Check size={14} strokeWidth={3} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Usuário Vigilante</h2>
            <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em]">Nível de Consagração I</p>
            
            <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500 font-bold uppercase tracking-wider">Progresso</span>
                 <span className="text-amber-500 font-bold">42%</span>
               </div>
               <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[42%]"></div>
               </div>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Info size={14} /> Sobre a Plataforma
             </h3>
             <div className="space-y-4 text-xs text-slate-400">
               <div className="flex justify-between">
                 <span>Versão Core</span>
                 <span className="text-slate-200">2.5.0-native</span>
               </div>
               <div className="flex justify-between">
                 <span>IA Atalaia</span>
                 <span className="text-slate-200">Gemini 3 Pro</span>
               </div>
               <div className="flex justify-between">
                 <span>Base Teológica</span>
                 <span className="text-slate-200">Biblical Orthodox</span>
               </div>
             </div>
          </section>
        </aside>

        {/* Lado Direito - Ajustes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Seção IA */}
          <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl space-y-8">
            <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-3">
              <BrainCircuit size={20} /> Inteligência Atalaia
            </h3>
            
            <div className="flex items-center justify-between gap-4 p-6 bg-slate-950/50 rounded-3xl border border-slate-800/60">
               <div className="space-y-1">
                 <h4 className="font-bold text-slate-100 flex items-center gap-2">
                   Meditação Profunda
                   <span className="bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">Thinking Mode</span>
                 </h4>
                 <p className="text-xs text-slate-500 leading-relaxed">Respostas mais lentas, porém extremamente fundamentadas e analíticas.</p>
               </div>
               <button 
                onClick={() => setThinkingMode(!thinkingMode)}
                className={`w-14 h-7 rounded-full transition-all relative ${thinkingMode ? 'bg-purple-600' : 'bg-slate-800'}`}
               >
                 <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${thinkingMode ? 'left-8' : 'left-1'}`}></div>
               </button>
            </div>

            <div className="flex items-center justify-between gap-4 p-6 bg-slate-950/50 rounded-3xl border border-slate-800/60">
               <div className="space-y-1">
                 <h4 className="font-bold text-slate-100 flex items-center gap-2">
                   Grounding Global (Real-time)
                   <Globe size={14} className="text-blue-500" />
                 </h4>
                 <p className="text-xs text-slate-500">Sempre buscar eventos atuais no Google Search e Maps.</p>
               </div>
               <div className="text-[10px] text-green-500 font-black uppercase bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                 Ativado
               </div>
            </div>
          </section>

          {/* Seção Interface e Leitura */}
          <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl space-y-8">
            <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-3">
              <Type size={20} /> Experiência de Leitura
            </h3>
            
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tamanho da Fonte das Escrituras</label>
              <div className="grid grid-cols-3 gap-4">
                {['small', 'medium', 'large'].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`py-3 rounded-2xl border transition-all text-xs font-bold capitalize ${
                      fontSize === size 
                        ? 'bg-amber-600 border-amber-500 text-white shadow-lg' 
                        : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    {size === 'small' ? 'Compacta' : size === 'medium' ? 'Equilibrada' : 'Magnânima'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 p-6 bg-slate-950/50 rounded-3xl border border-slate-800/60">
               <div className="space-y-1">
                 <h4 className="font-bold text-slate-100 flex items-center gap-2">
                   Notificações do Atalaia
                   <Bell size={14} className="text-amber-500" />
                 </h4>
                 <p className="text-xs text-slate-500 leading-relaxed">Alertas de devocionais e novos sinais dos tempos.</p>
               </div>
               <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-7 rounded-full transition-all relative ${notifications ? 'bg-amber-600' : 'bg-slate-800'}`}
               >
                 <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${notifications ? 'left-8' : 'left-1'}`}></div>
               </button>
            </div>
          </section>

          {/* Seção Crítica */}
          <section className="bg-red-950/10 border border-red-900/30 rounded-[2.5rem] p-8 md:p-10 shadow-xl space-y-6">
            <h3 className="text-sm font-black text-red-500 uppercase tracking-widest flex items-center gap-3">
              <ShieldAlert size={20} /> Zona de Segurança
            </h3>
            <p className="text-xs text-slate-500 italic">Cuidado: As ações abaixo são irreversíveis e afetam o histórico da sua jornada.</p>
            
            <button 
              onClick={clearData}
              className="w-full flex items-center justify-between p-6 bg-red-900/10 border border-red-900/20 hover:bg-red-900/20 rounded-3xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={20} className="text-red-500" />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-red-500">Limpar Registros</h4>
                  <p className="text-[10px] text-red-900/60 font-black uppercase">Progresso e Devocionais</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-red-900 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>
        </div>
      </div>

      <footer className="text-center pt-10">
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Até que Ele Venha — Bíblia da Noiva 2025</span>
         </div>
      </footer>
    </div>
  );
};

export default SettingsPage;
