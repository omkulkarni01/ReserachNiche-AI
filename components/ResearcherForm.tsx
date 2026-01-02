
import React, { useState } from 'react';
import { ResearchPaper } from '../types';

interface ResearcherFormProps {
  onAnalyze: (name: string, papers: ResearchPaper[], history: string) => void;
  isLoading: boolean;
}

const ResearcherForm: React.FC<ResearcherFormProps> = ({ onAnalyze, isLoading }) => {
  const [name, setName] = useState('');
  const [history, setHistory] = useState('');
  const [papers, setPapers] = useState<ResearchPaper[]>([
    { id: '1', title: '', abstract: '' }
  ]);

  const addPaper = () => {
    setPapers([...papers, { id: Math.random().toString(36).substr(2, 9), title: '', abstract: '' }]);
  };

  const removePaper = (id: string) => {
    if (papers.length > 1) {
      setPapers(papers.filter(p => p.id !== id));
    }
  };

  const updatePaper = (id: string, field: 'title' | 'abstract', value: string) => {
    setPapers(papers.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAnalyze(name, papers, history);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Researcher Name */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800 uppercase tracking-tight">Researcher Identity</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Dr. Elena Vance"
            className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all text-xl text-slate-900 font-semibold placeholder-slate-400 outline-none"
            required
          />
        </div>

        {/* Professional History / Roles */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-slate-800 uppercase tracking-tight">Career Context (Optional)</label>
            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">Enhanced Study</span>
          </div>
          <textarea
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            placeholder="Describe current/previous positions, labs, or industry experience. This helps the AI connect your career path to your research themes."
            rows={3}
            className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-500 transition-all text-base text-slate-900 placeholder-slate-400 outline-none resize-none"
          />
        </div>

        {/* Publications */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Publications & Findings</h3>
            <span className="text-[11px] text-slate-400 font-medium italic">At least one paper is recommended</span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {papers.map((paper, index) => (
              <div key={paper.id} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-200 relative group hover:border-indigo-200 transition-all">
                {papers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePaper(paper.id)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-white text-slate-400 border border-slate-200 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm z-10"
                  >
                    <span className="text-lg leading-none">&times;</span>
                  </button>
                )}
                <div className="space-y-4">
                  <input
                    type="text"
                    value={paper.title}
                    onChange={(e) => updatePaper(paper.id, 'title', e.target.value)}
                    placeholder={`Title of Publication #${index + 1}`}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-indigo-400 text-slate-900 font-bold placeholder-slate-400 outline-none transition-all"
                  />
                  <textarea
                    value={paper.abstract}
                    onChange={(e) => updatePaper(paper.id, 'abstract', e.target.value)}
                    placeholder="Abstract, key summary, or core technical contribution..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-indigo-400 text-slate-900 text-sm leading-relaxed placeholder-slate-400 outline-none resize-none transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addPaper}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all font-bold text-sm flex items-center justify-center gap-2 group"
          >
            <span className="text-xl group-hover:scale-125 transition-transform">+</span> Add Publication Context
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 disabled:bg-indigo-300 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transform active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mapping Neural Patterns...
            </>
          ) : 'Execute Deep Study'}
        </button>
      </form>
    </div>
  );
};

export default ResearcherForm;
