
import React, { useState, useEffect } from 'react';
import { getGlossaryTerms } from '../services/geminiService';
import { Loader2, Search, QrCode } from 'lucide-react';

const GlossaryPage: React.FC = () => {
  const [terms, setTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState('A, B, C');

  const fetchTerms = async (letters: string) => {
    setLoading(true);
    try {
      const data = await getGlossaryTerms(letters);
      setTerms(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms(selectedLetters);
  }, []);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-cinzel font-bold gold-gradient mb-2">Glossário Escatológico</h1>
        <p className="text-slate-400">Termos, símbolos e tipologias da Revelação.</p>
      </div>

      <div className="flex flex-wrap gap-2 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => {
              const group = `${letter}, ${alphabet[alphabet.indexOf(letter)+1] || ''}, ${alphabet[alphabet.indexOf(letter)+2] || ''}`;
              setSelectedLetters(group);
              fetchTerms(group);
            }}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
              selectedLetters.includes(letter) 
                ? 'bg-amber-600 text-white' 
                : 'text-slate-500 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <Loader2 size={40} className="text-amber-500 animate-spin" />
          <p className="text-slate-400 italic">Pesquisando as raízes do hebraico e grego...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {terms.map((t, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-amber-500/30 transition-colors shadow-lg">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                 <h3 className="text-xl font-cinzel font-bold text-amber-500">{t.term}</h3>
                 <div className="text-amber-600/50">
                    <Search size={18} />
                 </div>
              </div>
              <div className="p-6 flex-1 space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">{t.definition}</p>
                <div className="text-xs">
                   <span className="text-slate-500 font-bold block mb-1">BASE BÍBLICA:</span>
                   <span className="text-amber-400 italic font-serif-biblical">{t.bibleBase}</span>
                </div>
                <div className="pt-4 border-t border-slate-800">
                   <span className="text-xs text-slate-500 font-bold block mb-2 uppercase">Aplicação Profética</span>
                   <p className="text-xs text-slate-400 italic">{t.propheticApplication}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 flex items-center justify-between">
                 <QrCode size={30} className="text-slate-400" />
                 <span className="text-[10px] text-slate-500">DIGITAL ACCESS</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlossaryPage;
