
export enum AppView {
  DASHBOARD = 'dashboard',
  ENCYCLOPEDIA = 'encyclopedia',
  DEVOTIONAL = 'devotional',
  GLOSSARY = 'glossary',
  CHAT = 'chat',
  BIBLE = 'bible',
  THEMATIC_BIBLE = 'thematic_bible',
  DEVOTIONAL_READER = 'devotional_reader'
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

export interface PuzzleConnection {
  originText: string;
  originRef: string;
  destinyText: string;
  destinyRef: string;
  revelationKey: string;
}

export interface ThematicChapter {
  title: string;
  centralDeclaration: string;
  puzzleConnections: PuzzleConnection[];
  sections: {
    era: 'Antigo Testamento' | 'Evangelhos' | 'Igreja Primitiva' | 'Revelação Final (Apocalipse)';
    verses: string;
    context: string;
  }[];
  timeline: string;
  convergence: string;
  application: string;
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
