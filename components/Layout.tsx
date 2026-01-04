
import React from 'react';
import { Home, BookOpen, Heart, MessageSquare, Book, BookMarked, Layers, Menu, Bell, HelpCircle } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setView: (view: AppView) => void;
  onOpenGuide: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, onOpenGuide }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Início', icon: Home },
    { id: AppView.BIBLE, label: 'Bíblia Sagrada', icon: BookMarked },
    { id: AppView.THEMATIC_BIBLE, label: 'Bíblia Temática', icon: Layers },
    { id: AppView.ENCYCLOPEDIA, label: 'Enciclopédia', icon: BookOpen },
    { id: AppView.DEVOTIONAL, label: 'Devocional', icon: Heart },
    { id: AppView.GLOSSARY, label: 'Glossário', icon: Book },
    { id: AppView.CHAT, label: 'Atalaia AI', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 border-r border-slate-800/60 bg-slate-900/80 backdrop-blur-xl sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-800/60">
          <h1 className="font-cinzel text-2xl gold-gradient font-bold tracking-widest">BÍBLIA DA NOIVA</h1>
          <p className="text-[10px] text-amber-500/80 mt-1 uppercase tracking-[0.2em] font-semibold">Prepara-te para o Noivo</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`group w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'bg-amber-600/15 text-amber-400 border border-amber-600/20 shadow-[0_4px_20px_rgba(217,119,6,0.08)]' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full" />
                )}
                
                <item.icon 
                  size={20} 
                  className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-amber-500/70'}`} 
                />
                <span className={`font-semibold text-sm tracking-wide transition-colors duration-300 ${isActive ? 'text-amber-400' : 'group-hover:text-slate-100'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800/60 flex flex-col gap-2">
          <button 
            onClick={onOpenGuide}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-600/5 transition-all text-sm font-bold uppercase tracking-widest"
          >
            <HelpCircle size={18} /> Manual do Atalaia
          </button>
          <div className="p-2 text-[10px] text-slate-500 text-center uppercase tracking-[0.25em] font-bold opacity-60">
            Até que Ele venha
          </div>
        </div>
      </aside>

      {/* Header - Mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <h1 className="font-cinzel text-xl gold-gradient font-bold">BÍBLIA DA NOIVA</h1>
        <div className="flex items-center gap-2">
          <button onClick={onOpenGuide} className="p-2 text-amber-500">
            <HelpCircle size={22} />
          </button>
          <button className="p-2 text-slate-400">
            <Bell size={20} />
          </button>
          <button className="p-2 text-slate-400">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative pb-24 md:pb-0 overflow-y-auto h-screen scroll-smooth">
        {/* Header - Desktop */}
        <header className="hidden md:flex items-center justify-end p-5 border-b border-slate-800/40 bg-slate-950/20 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Atalaia Online</span>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-amber-500 transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-slate-950"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-200 uppercase tracking-tighter leading-none">Usuário</p>
                <p className="text-[9px] font-medium text-amber-500/70 uppercase tracking-widest mt-1">Nível Vigilante</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-900/20 border border-white/10">
                N
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-4 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800/80 flex justify-around p-1.5 z-50">
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isActive ? 'text-amber-500 scale-110' : 'text-slate-500'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[9px] font-bold uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-amber-500 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default Layout;
