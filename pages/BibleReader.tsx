
import React, { useState, useEffect } from 'react';
import { getBibleChapter } from '../services/geminiService';
import { BibleContent } from '../types';
import { Loader2, ChevronLeft, ChevronRight, Settings, BookMarked } from 'lucide-react';

const BibleReader: React.FC = () => {
  const [book, setBook] = useState('Gênesis');
  const [chapter, setChapter] = useState(1);
  const [content, setContent] = useState<BibleContent | null>(null);
  const [loading, setLoading] = useState(true);

  const books = ["Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos", "Apocalipse"];

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
    fetchBible(book, chapter);
  }, [book, chapter]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <select 
            value={book} 
            onChange={(e) => setBook(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:border-amber-500 outline-none"
          >
            {books.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <button onClick={() => setChapter(Math.max(1, chapter - 1))} className="p-2 hover:bg-slate-800 rounded-lg"><ChevronLeft size={18}/></button>
            <span className="font-bold text-amber-500 w-8 text-center">{chapter}</span>
            <button onClick={() => setChapter(chapter + 1)} className="p-2 hover:bg-slate-800 rounded-lg"><ChevronRight size={18}/></button>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-widest"><Settings size={14}/> NVI</button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 size={40} className="text-amber-500 animate-spin" />
          <p className="text-slate-500 font-serif-biblical">Abrindo as Sagradas Escrituras...</p>
        </div>
      ) : content && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl">
          <header className="text-center mb-12 border-b border-slate-800 pb-8">
            <h1 className="text-3xl font-cinzel font-bold gold-gradient mb-2">{content.book}</h1>
            <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-bold">Capítulo {content.chapter}</p>
          </header>
          
          <div className="space-y-6">
            {content.verses.map((v) => (
              <p key={v.number} className="font-serif-biblical text-xl text-slate-300 leading-relaxed group">
                <sup className="text-amber-600 font-bold mr-2 text-xs opacity-50 group-hover:opacity-100 transition-opacity">{v.number}</sup>
                {v.text}
              </p>
            ))}
          </div>
          
          <footer className="mt-16 pt-8 border-t border-slate-800 flex justify-between">
            <button onClick={() => setChapter(Math.max(1, chapter - 1))} className="flex items-center gap-2 text-slate-500 hover:text-amber-500">
               <ChevronLeft size={20}/> Anterior
            </button>
            <button onClick={() => setChapter(chapter + 1)} className="flex items-center gap-2 text-slate-500 hover:text-amber-500">
               Próximo <ChevronRight size={20}/>
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default BibleReader;
