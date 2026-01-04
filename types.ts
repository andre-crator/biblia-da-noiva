
export enum AppView {
  DASHBOARD = 'dashboard',
  ENCYCLOPEDIA = 'encyclopedia',
  DEVOTIONAL = 'devotional',
  GLOSSARY = 'glossary',
  CHAT = 'chat',
  BIBLE = 'bible',
  THEMATIC_BIBLE = 'thematic_bible'
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

export interface ThematicChapter {
  title: string;
  centralDeclaration: string;
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
