
import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Layers, 
  BookOpen, 
  MessageSquare, 
  Flame, 
  ShieldCheck,
  Check
} from 'lucide-react';

interface GuideStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps: GuideStep[] = [
  {
    title: "Bem-vinda, Noiva",
    description: "Esta não é apenas uma Bíblia, é uma plataforma de preparação. Aqui, cada detalhe foi desenhado para despertar o espírito e encher a lâmpada com o óleo da revelação.",
    icon: <Flame size={48} />,
    color: "text-amber-500"
  },
  {
    title: "O Quebra-Cabeça Montado",
    description: "Na Bíblia Temática, conectamos Daniel e Apocalipse como peças de um quebra-cabeça. Veja a 'Semente Profética' no AT encontrar seu 'Cumprimento' no NT através da Chave da Revelação.",
    icon: <Layers size={48} />,
    color: "text-blue-500"
  },
  {
    title: "300 Volumes de Profundidade",
    description: "Nossa Enciclopédia contém séculos de saber teológico destilados. Do volume 1 ao 300, mergulhe em tipologia, história e escatologia avançada.",
    icon: <BookOpen size={48} />,
    color: "text-indigo-500"
  },
  {
    title: "O Atalaia está de Vigília",
    description: "Dúvidas sobre o Milênio, as Trombetas ou o Arrebatamento? O Atalaia AI está disponível 24h para perscrutar as profundezas das Escrituras com você.",
    icon: <MessageSquare size={48} />,
    color: "text-green-500"
  },
  {
    title: "Pronta para a Jornada?",
    description: "A noite está avançada, e o Noivo se aproxima. Comece seu devocional diário e acompanhe seu 'Progresso da Noiva' em sua página inicial.",
    icon: <ShieldCheck size={48} />,
    color: "text-amber-600"
  }
];

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(217,119,6,0.15)] relative flex flex-col md:flex-row h-[600px] md:h-auto">
        
        {/* Lado Esquerdo - Visual/Ícone */}
        <div className={`w-full md:w-1/3 bg-slate-950 p-8 flex flex-col items-center justify-center relative overflow-hidden ${step.color}`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-current via-transparent to-transparent"></div>
          <div className="relative z-10 transition-transform duration-500 transform scale-125 md:scale-150">
            {step.icon}
          </div>
          <div className="mt-8 flex gap-1.5 relative z-10">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-current' : 'w-1.5 bg-slate-800'}`} 
              />
            ))}
          </div>
        </div>

        {/* Lado Direito - Conteúdo */}
        <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-between bg-slate-900">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-[0.3em]">
              <Sparkles size={12} /> Guia do Vigilante
            </div>
            <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-white leading-tight">
              {step.title}
            </h2>
            <p className="text-slate-400 text-lg font-serif-biblical italic leading-relaxed">
              {step.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-12">
            <button 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-opacity ${currentStep === 0 ? 'opacity-0' : 'text-slate-500 hover:text-white'}`}
            >
              <ChevronLeft size={18} /> Anterior
            </button>
            
            <button 
              onClick={handleNext}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all transform hover:scale-105 active:scale-95 ${
                isLastStep 
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' 
                : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              {isLastStep ? (
                <>Começar Agora <Check size={18} /></>
              ) : (
                <>Próximo <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
