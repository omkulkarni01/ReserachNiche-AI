
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ResearcherForm from './components/ResearcherForm';
import AnalysisResults from './components/AnalysisResults';
import { analyzeResearch } from './services/geminiService';
import { ResearchPaper, AnalysisResult, AnalysisStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (name: string, papers: ResearchPaper[], history: string) => {
    setStatus(AnalysisStatus.LOADING);
    setError(null);
    try {
      const data = await analyzeResearch(name, papers, history);
      setResult(data);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("We encountered an error while synthesizing the research data. Please check your connection and try again.");
      setStatus(AnalysisStatus.ERROR);
    }
  }, []);

  const reset = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setError(null);
  };

  const handleBack = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        {status === AnalysisStatus.IDLE && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2 space-y-8 py-8">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-[0.15em]">
                  Neural Study Module
                </span>
                <h2 className="serif text-5xl text-slate-900 leading-[1.1]">
                  Uncover your <span className="text-indigo-600 italic">specialized</span> research niche.
                </h2>
                <p className="text-lg text-slate-600 font-light leading-relaxed">
                  Provide your career background and publication history. Our engine identifies hidden structural patterns, methodological bridges, and your unique scientific signature.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 group hover:border-indigo-300 transition-all">
                  <div className="text-indigo-600 font-black text-3xl mb-1 group-hover:scale-110 transition-transform origin-left">8K+</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Semantic Nodes</div>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 group hover:border-pink-300 transition-all">
                  <div className="text-pink-600 font-black text-3xl mb-1 group-hover:scale-110 transition-transform origin-left">Real-time</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grounded Verification</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <div className="mt-1">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold italic text-sm shadow-lg shadow-indigo-200">i</div>
                </div>
                <p className="text-sm text-indigo-900/80 leading-relaxed">
                  <strong>Analyst Note:</strong> Merging career milestones with publication abstracts allows the model to map your "Research Trajectory" more accurately.
                </p>
              </div>
            </div>

            <div className="lg:col-span-3">
              <ResearcherForm onAnalyze={handleAnalyze} isLoading={status === AnalysisStatus.LOADING} />
            </div>
          </div>
        )}

        {status === AnalysisStatus.LOADING && (
          <div className="flex flex-col items-center justify-center py-24 space-y-10 animate-in fade-in duration-700">
            <div className="relative">
              <div className="w-32 h-32 border-8 border-slate-200 rounded-full"></div>
              <div className="w-32 h-32 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0 shadow-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-indigo-600 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Synthesizing Domain Identity</h3>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">Cross-referencing global academic databases, mapping thematic clusters, and calculating latent methodological dependencies...</p>
              <div className="flex justify-center gap-1.5 pt-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`w-1 h-4 bg-indigo-600 rounded-full animate-bounce`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {status === AnalysisStatus.SUCCESS && result && (
          <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-slate-200 pb-8">
               <div>
                  <h2 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-2">Deep Study Dossier</h2>
                  <p className="text-4xl font-black text-slate-900 leading-none">{result.researcherName}</p>
               </div>
               <button 
                onClick={reset}
                className="px-8 py-3 bg-white border-2 border-slate-200 rounded-2xl hover:border-indigo-600 hover:text-indigo-600 transition-all text-slate-700 font-bold text-sm shadow-sm active:scale-95"
               >
                 Start New Analysis
               </button>
            </div>
            <AnalysisResults result={result} onBack={handleBack} />
          </div>
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="max-w-2xl mx-auto py-24 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Synthesis Interrupted</h3>
            <p className="text-slate-500 mb-10 text-lg leading-relaxed">{error}</p>
            <button 
              onClick={reset}
              className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-100 active:scale-95"
            >
              Restart Module
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center items-center gap-3 grayscale opacity-40">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold">R</div>
            <span className="font-black text-slate-900 uppercase tracking-tighter text-xl">ResearchNiche</span>
          </div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">© 2025 Neural Synthesis Protocol • Powered by Gemini 3 Pro</p>
          <div className="flex justify-center gap-8 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors underline decoration-slate-200 underline-offset-4">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors underline decoration-slate-200 underline-offset-4">Legal</a>
            <a href="#" className="hover:text-indigo-600 transition-colors underline decoration-slate-200 underline-offset-4">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
