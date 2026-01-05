
import React, { useState, useEffect, useMemo } from 'react';
import { getBibleChapter } from '../services/geminiService';
import { BibleContent } from '../types';
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  BookMarked, 
  Search,
  Book,
  Scroll,
  Hash,
  ChevronDown
} from 'lucide-react';

const BIBLE_BOOKS = {
  "Antigo Testamento": {
    "Pentateuco": ["Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio"],
    "Históricos": ["Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras", "Neemias", "Ester"],
    "Poéticos": ["Jó", "Salmos", "Provérbios", "Eclesiastes", "Cantares"],
    "Profetas Maiores": ["Isaías", "Jeremias", "Lamentações", "Ezequiel", "Daniel"],
    "Profetas Menores": ["Oseias", "Joel", "Amós", "Obadias", "Jonas", "Miqueias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias"]
  },
  "Novo Testamento": {
    "Evangelhos": ["Mateus", "Marcos", "Lucas", "João"],
    "Histórico": ["Atos"],
    "Epístolas Paulinas": ["Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios", "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses", "1 Timóteo", "2 Timóteo", "Tito", "Filemon"],
    "Epístolas Gerais": ["Hebreus", "Tiago", "1 Pedro", "2 Pedro", "1 João", "2 João", "3 João", "Judas"],
    "Profético": ["Apocalipse"]
  }
};

const BibleReader: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState('Gênesis');
  const [chapter, setChapter] = useState(1);
  const [content, setContent] = useState<BibleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBible = async (b: string, c: number) => {
    setLoading(true);
    try {
      const data = await getBibleChapter(b, c);
      setContent(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBible(selectedBook, chapter);
  }, [selectedBook, chapter]);

  const allBooksList = useMemo(() => {
    const list: string[] = [];
    Object.values(BIBLE_BOOKS).forEach(testament => {
      Object.values(testament).forEach(category => {
        list.push(...category);
      });
    });
    return list;
  }, []);

  const filteredBooks = allBooksList.filter(b => b.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setChapter(1);
    setIsSelectorOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Custom Selector Bar */}
      <div className="relative z-50">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl">
          <div className="flex flex-1 items-center gap-2">
            <button 
              onClick={() => setIsSelectorOpen(!isSelectorOpen)}
              className="flex-1 md:flex-none flex items-center justify-between gap-4 px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all text-sm font-bold text-slate-100 group"
            >
              <div className="flex items-center gap-3">
                <BookMarked size={18} className="text-amber-500" />
                <span>{selectedBook}</span>
              </div>
              <ChevronDown size={16} className={`text-slate-500 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
              <button 
                onClick={() => setChapter(Math.max(1, chapter - 1))} 
                className="p-2.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Capítulo Anterior"
              >
                <ChevronLeft size={20}/>
              </button>
              <div className="px-4 font-black text-amber-500 text-lg min-w-[3rem] text-center">
                {chapter}
              </div>
              <button 
                onClick={() => setChapter(chapter + 1)} 
                className="p-2.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Próximo Capítulo"
              >
                <ChevronRight size={20}/>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <button className="hidden md:flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 transition-colors">
               <Settings size={14}/> Almeida
             </button>
          </div>
        </div>

        {/* Book Selector Dropdown */}
        {isSelectorOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 h-[500px] flex flex-col">
            <div className="p-6 border-b border-slate-800">
               <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar livro da Bíblia..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-200 focus:border-amber-500/50 outline-none shadow-inner"
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {searchTerm ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredBooks.map(b => (
                    <button 
                      key={b} 
                      onClick={() => handleBookSelect(b)}
                      className={`p-4 rounded-2xl text-left transition-all border ${
                        selectedBook === b 
                        ? 'bg-amber-600 border-amber-500 text-white shadow-lg' 
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-amber-500/30 hover:text-slate-100'
                      }`}
                    >
                      <span className="text-sm font-bold">{b}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-10">
                   {Object.entries(BIBLE_BOOKS).map(([testament, categories]) => (
                     <div key={testament} className="space-y-6">
                        <h3 className="text-xs font-black text-amber-600 uppercase tracking-[0.4em] flex items-center gap-3">
                           <div className="h-px flex-1 bg-amber-900/30"></div>
                           {testament}
                           <div className="h-px flex-1 bg-amber-900/30"></div>
                        </h3>
                        <div className="space-y-8">
                           {Object.entries(categories).map(([category, books]) => (
                             <div key={category} className="space-y-3">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">{category}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                  {books.map(b => (
                                    <button 
                                      key={b} 
                                      onClick={() => handleBookSelect(b)}
                                      className={`px-4 py-3 rounded-xl text-left transition-all border text-xs font-bold ${
                                        selectedBook === b 
                                        ? 'bg-amber-600 border-amber-500 text-white' 
                                        : 'bg-slate-800/30 border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-100'
                                      }`}
                                    >
                                      {b}
                                    </button>
                                  ))}
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-48 gap-8">
          <div className="relative">
             <Loader2 size={64} className="text-amber-500 animate-spin opacity-20" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Scroll size={32} className="text-amber-600 animate-pulse" />
             </div>
          </div>
          <div className="text-center space-y-2">
             <p className="text-slate-400 font-cinzel text-xl tracking-widest uppercase">Perscrutando os Manuscritos...</p>
             <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em]">Acessando {selectedBook} {chapter}</p>
          </div>
        </div>
      ) : content && (
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
             <Book size={400} />
          </div>

          <header className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-amber-950/10 border border-amber-900/20 rounded-full text-amber-600 text-[10px] font-black uppercase tracking-widest mb-6">
               <Hash size={12} /> Cânon Sagrado
            </div>
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold gold-gradient mb-4 drop-shadow-2xl">{content.book}</h1>
            <div className="flex items-center justify-center gap-4">
               <div className="h-px w-12 bg-slate-800"></div>
               <p className="text-slate-500 uppercase tracking-[0.4em] text-xs font-black">Capítulo {content.chapter}</p>
               <div className="h-px w-12 bg-slate-800"></div>
            </div>
          </header>
          
          <div className="space-y-10 relative z-10">
            {content.verses.map((v) => (
              <div key={v.number} className="group relative pl-10 md:pl-0">
                <sup className="absolute -left-0 md:-left-12 top-2 text-amber-600 font-black text-xs opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all inline-block w-8 text-right">
                  {v.number}
                </sup>
                <p className="font-serif-biblical text-xl md:text-2xl text-slate-300 leading-relaxed group-hover:text-slate-100 transition-colors">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
          
          <footer className="mt-24 pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <button 
              onClick={() => setChapter(Math.max(1, chapter - 1))} 
              className="group flex items-center gap-4 text-slate-500 hover:text-amber-500 transition-all font-black uppercase tracking-widest text-xs"
            >
               <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <ChevronLeft size={20}/>
               </div>
               Capítulo Anterior
            </button>

            <div className="flex flex-col items-center">
               <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-1">Você está lendo</span>
               <span className="text-sm font-bold text-slate-400">{selectedBook} {chapter}</span>
            </div>

            <button 
              onClick={() => setChapter(chapter + 1)} 
              className="group flex flex-row-reverse items-center gap-4 text-slate-500 hover:text-amber-500 transition-all font-black uppercase tracking-widest text-xs"
            >
               <div className="p-3 bg-slate-800 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <ChevronRight size={20}/>
               </div>
               Próximo Capítulo
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default BibleReader;
