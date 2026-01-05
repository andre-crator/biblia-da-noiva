
export enum AppView {
  DASHBOARD = 'dashboard',
  ENCYCLOPEDIA = 'encyclopedia',
  DEVOTIONAL = 'devotional',
  GLOSSARY = 'glossary',
  CHAT = 'chat',
  BIBLE = 'bible',
  THEMATIC_BIBLE = 'thematic_bible',
  DEVOTIONAL_READER = 'devotional_reader',
  SETTINGS = 'settings'
}

export interface MosaicVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  era: 'Sombra (AT)' | 'Realidade (NT)' | 'Revelação Final (Apocalipse)';
  connectionNote: string;
  dateRange: string;
  historicalContext: string;
  geopoliticalAnalysis: string;
  spiritualMystery: string;
  currentRelevance: string;
  locationMarker: string;
  // Prompts para geração de mídia
  imagePrompt: string;
  videoPrompt: string;
  narrationScript: string;
}

export interface PropheticMosaic {
  title: string;
  mystery: string;
  chains: MosaicVerse[];
  conclusion: string;
}

export interface BibleStudy {
  title: string;
  bibleText: string;
  context: string;
  theology: string;
  typology: string;
  apocalypseConnection: string;
  practicalApplication: string;
  devotionalActivation: string;
  reflectiveQuestions: string[];
  visualSuggestion: string;
  qrCodeLink: string;
}

export interface BibleContent {
  book: string;
  chapter: number;
  verses: { number: number; text: string }[];
}

export interface DevotionalPlan {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  category: string;
  active: boolean;
}

export interface DevotionalDayContent extends BibleStudy {
  day: number;
  planTitle: string;
}
