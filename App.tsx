
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Encyclopedia from './pages/Encyclopedia';
import GlossaryPage from './pages/GlossaryPage';
import ChatPage from './pages/ChatPage';
import BibleReader from './pages/BibleReader';
import ThematicBible from './pages/ThematicBible';
import DevotionalPage from './pages/DevotionalPage';
import DevotionalReader from './pages/DevotionalReader';
import SettingsPage from './pages/SettingsPage';
import GuideModal from './components/GuideModal';
import { AppView, DevotionalPlan } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedPlan, setSelectedPlan] = useState<DevotionalPlan | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    // Verificar se é o primeiro acesso
    const hasSeenGuide = localStorage.getItem('noiva_guide_seen');
    if (!hasSeenGuide) {
      // Pequeno delay para a página carregar visualmente antes do modal
      setTimeout(() => setIsGuideOpen(true), 1500);
    }
  }, []);

  const closeGuide = () => {
    setIsGuideOpen(false);
    localStorage.setItem('noiva_guide_seen', 'true');
  };

  const openGuide = () => {
    setIsGuideOpen(true);
  };

  const handleSelectPlan = (plan: DevotionalPlan) => {
    setSelectedPlan(plan);
    setActiveView(AppView.DEVOTIONAL_READER);
  };

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
      case AppView.SETTINGS:
        return <SettingsPage />;
      case AppView.DEVOTIONAL:
        return <DevotionalPage onSelectPlan={handleSelectPlan} />;
      case AppView.DEVOTIONAL_READER:
        return selectedPlan ? (
          <DevotionalReader plan={selectedPlan} onBack={() => setActiveView(AppView.DEVOTIONAL)} />
        ) : <DevotionalPage onSelectPlan={handleSelectPlan} />;
      default:
        return <Home onNavigate={setActiveView} />;
    }
  };

  return (
    <Layout activeView={activeView} setView={setActiveView} onOpenGuide={openGuide}>
      {renderContent()}
      <GuideModal isOpen={isGuideOpen} onClose={closeGuide} />
    </Layout>
  );
};

export default App;
