
export enum AppView {
  DASHBOARD = 'dashboard',
  ENCYCLOPEDIA = 'encyclopedia',
  DEVOTIONAL = 'devotional',
  GLOSSARY = 'glossary',
  CHAT = 'chat',
  STUDY = 'study'
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

export interface GlossaryTerm {
  term: string;
  definition: string;
  bibleBase: string;
  propheticApplication: string;
  icon: string;
}

export interface Devotional {
  day: number;
  title: string;
  scripture: string;
  reflection: string;
  action: string;
  completed: boolean;
}
