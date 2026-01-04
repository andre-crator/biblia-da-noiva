
import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Encyclopedia from './pages/Encyclopedia';
import GlossaryPage from './pages/GlossaryPage';
import ChatPage from './pages/ChatPage';
import BibleReader from './pages/BibleReader';
import ThematicBible from './pages/ThematicBible';
import { AppView } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);

  const renderContent = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Home onNavigate={setActiveView} />;
      case AppView.BIBLE:
        return <BibleReader />;
      case AppView.THEMATIC_BIBLE:
        return <ThematicBible />;
      case AppView.ENCYCLOPEDIA:
        return <Encyclopedia />;
      case AppView.GLOSSARY:
        return <GlossaryPage />;
      case AppView.CHAT:
        return <ChatPage />;
      case AppView.DEVOTIONAL:
        return (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-amber-600/10 rounded-full flex items-center justify-center text-amber-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.236 1.1-3.123 1.053 1.341 2.247 2.123 3.4 3.123z"/></svg>
            </div>
            <h1 className="text-3xl font-cinzel font-bold">Planos de Devocionais Proféticos</h1>
            <p className="text-slate-400 max-w-md mx-auto">
              Prepare seu coração com nossos planos de 7, 14 e 21 dias focados nas 7 Igrejas do Apocalipse.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
               {[
                 { days: 7, title: "O Despertar da Noiva", status: "Inativo" },
                 { days: 14, title: "As Sete Lâmpadas", status: "Inativo" },
                 { days: 21, title: "Consagração do Óleo", status: "Em Breve" },
               ].map((plan, i) => (
                 <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl grayscale opacity-50 cursor-not-allowed">
                   <span className="text-xs font-bold text-amber-500 uppercase">{plan.days} DIAS</span>
                   <h3 className="text-lg font-bold my-2">{plan.title}</h3>
                   <span className="text-[10px] bg-slate-800 px-2 py-1 rounded uppercase tracking-tighter">{plan.status}</span>
                 </div>
               ))}
            </div>
            <p className="text-sm text-amber-600 font-bold animate-pulse mt-8">Disponível na próxima atualização ministerial.</p>
          </div>
        );
      default:
        return <Home onNavigate={setActiveView} />;
    }
  };

  return (
    <Layout activeView={activeView} setView={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
