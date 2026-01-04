
import React from 'react';
import { Home, BookOpen, Heart, MessageSquare, Book, BookMarked, Layers, Menu, Bell } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView }) => {
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
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900 sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <h1 className="font-cinzel text-2xl gold-gradient font-bold tracking-wider">BÍBLIA DA NOIVA</h1>
          <p className="text-xs text-amber-500 mt-1 uppercase tracking-tighter opacity-70">Até que Ele venha</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === item.id 
                  ? 'bg-amber-600/20 text-amber-500 border border-amber-600/30 shadow-[0_0_15px_rgba(217,119,6,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 text-center uppercase tracking-widest">
          Prophetic Intelligence System
        </div>
      </aside>

      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <h1 className="font-cinzel text-xl gold-gradient font-bold">BÍBLIA DA NOIVA</h1>
        <button className="p-2 text-slate-400">
          <Menu />
        </button>
      </div>

      <main className="flex-1 relative pb-24 md:pb-0 overflow-y-auto h-screen">
        <header className="hidden md:flex items-center justify-end p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-bold text-sm">
              N
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 flex justify-around p-2 z-50">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1 p-2 ${
              activeView === item.id ? 'text-amber-500' : 'text-slate-500'
            }`}
          >
            <item.icon size={18} />
            <span className="text-[9px] font-medium uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
