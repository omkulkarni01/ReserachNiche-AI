
import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { AnalysisResult, TopicInsight, ResearchPaper, ComparisonResult } from '../types';
import { compareWithUser } from '../services/geminiService';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onBack: () => void;
}

const TopicCard: React.FC<{ topic: TopicInsight }> = ({ topic }) => {
  const [showLogic, setShowLogic] = useState(false);

  return (
    <div className="group p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-slate-800">{topic.topic}</span>
        <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
          {Math.round(topic.strength)}%
        </span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full mb-3 overflow-hidden">
         <div 
          className="h-full bg-indigo-600 transition-all duration-1000" 
          style={{ width: `${topic.strength}%` }}
         ></div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        {topic.reasoning}
      </p>
      
      <button 
        onClick={() => setShowLogic(!showLogic)}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors"
      >
        <svg className={`w-3 h-3 transition-transform ${showLogic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
        {showLogic ? 'Hide Internal Logic' : 'View Way of Thinking'}
      </button>

      {showLogic && (
        <div className="mt-3 p-4 bg-slate-900 rounded-lg border-l-4 border-indigo-500 animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-mono text-indigo-300 uppercase">AI Pattern Analysis Pipeline</span>
            </div>
            <p className="text-xs font-mono text-slate-300 leading-relaxed italic">
              {topic.internalLogic}
            </p>
          </div>

          {topic.relatedPapers && topic.relatedPapers.length > 0 && (
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block mb-2">Primary Evidence Source(s)</span>
              <ul className="space-y-2">
                {topic.relatedPapers.map((paperTitle, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-indigo-500 font-mono text-[10px] mt-0.5">▸</span>
                    <span className="text-[10px] font-mono text-slate-400 leading-tight">
                      {paperTitle}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SelfComparisonModule: React.FC<{ target: AnalysisResult }> = ({ target }) => {
  const [isComparing, setIsComparing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [compResult, setCompResult] = useState<ComparisonResult | null>(null);
  const [userData, setUserData] = useState({ name: '', history: '', papers: [{ id: '1', title: '', abstract: '' }] });

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await compareWithUser(target, userData);
      setCompResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (compResult) {
    return (
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-indigo-500/30 shadow-2xl animate-in zoom-in-95 duration-700">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-black mb-1">Synergy Report</h3>
            <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest">Self vs. {target.researcherName}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-indigo-400 leading-none">{compResult.overlapScore}%</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Domain Overlap</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">Thematic Synergy</span>
              <p className="text-sm leading-relaxed text-slate-300 italic">"{compResult.thematicSynergy}"</p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">Competitive Advantages</span>
              <ul className="space-y-2">
                {compResult.competitiveAdvantages.map((adv, i) => (
                  <li key={i} className="text-xs text-slate-300 flex gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> {adv}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-indigo-600/20 p-5 rounded-2xl border border-indigo-500/30">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block mb-2">Collaborative Potential</span>
              <p className="text-sm leading-relaxed text-indigo-50 font-medium">{compResult.collaborativePotential}</p>
            </div>
            <div className="bg-pink-600/20 p-5 rounded-2xl border border-pink-500/30">
              <span className="text-[10px] font-bold text-pink-300 uppercase tracking-widest block mb-2">Niche Differentiation</span>
              <p className="text-sm leading-relaxed text-pink-50 font-medium">{compResult.nicheDifferentiation}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setCompResult(null)}
          className="mt-8 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
        >
          Modify Comparison Data
        </button>
      </div>
    );
  }

  if (isComparing) {
    return (
      <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-xl animate-in slide-in-from-bottom-4 duration-500">
        <h3 className="text-2xl font-black text-slate-900 mb-6">Enter Your Research Profile</h3>
        <form onSubmit={handleCompare} className="space-y-6">
          <input 
            type="text" 
            placeholder="Your Name" 
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold placeholder-slate-400 outline-none"
            value={userData.name}
            onChange={e => setUserData({...userData, name: e.target.value})}
            required
          />
          <textarea 
            placeholder="Your background/experience..." 
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none resize-none"
            rows={2}
            value={userData.history}
            onChange={e => setUserData({...userData, history: e.target.value})}
          />
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <span className="text-[10px] font-bold text-indigo-600 uppercase mb-2 block">Your Core Finding/Paper Title</span>
            <input 
              type="text" 
              placeholder="Primary Publication Title" 
              className="w-full px-3 py-2 rounded-lg bg-white border border-indigo-200 text-slate-800 text-sm font-medium"
              value={userData.papers[0].title}
              onChange={e => {
                const newPapers = [...userData.papers];
                newPapers[0].title = e.target.value;
                setUserData({...userData, papers: newPapers});
              }}
              required
            />
            <textarea 
              placeholder="Brief abstract/contribution..." 
              className="w-full mt-2 px-3 py-2 rounded-lg bg-white border border-indigo-200 text-slate-700 text-xs placeholder-slate-400 outline-none resize-none"
              rows={3}
              value={userData.papers[0].abstract}
              onChange={e => {
                const newPapers = [...userData.papers];
                newPapers[0].abstract = e.target.value;
                setUserData({...userData, papers: newPapers});
              }}
            />
          </div>
          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-grow py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Calculating Synergy...' : 'Generate Comparison Report'}
            </button>
            <button 
              type="button" 
              onClick={() => setIsComparing(false)}
              className="px-6 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100 relative overflow-hidden group">
      <div className="relative z-10">
        <h3 className="text-2xl font-black mb-2">Wondering how you measure up?</h3>
        <p className="text-indigo-100 max-w-md">Our AI can perform a structural comparison between your research and {target.researcherName}'s identity to find gaps or partnership opportunities.</p>
      </div>
      <button 
        onClick={() => setIsComparing(true)}
        className="relative z-10 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
      >
        Run Self-Comparison
      </button>
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mb-32 group-hover:scale-125 transition-transform duration-1000"></div>
    </div>
  );
};

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onBack }) => {
  const chartData = result.topicDistribution.map(t => ({
    topic: t.topic,
    value: t.strength,
    fullMark: 100,
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button */}
      <div className="flex justify-start">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-indigo-600 font-bold transition-all text-sm bg-white border border-slate-200 rounded-xl hover:border-indigo-200 shadow-sm"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </button>
      </div>

      {/* Hero Result Section */}
      <div className="bg-indigo-900 text-white rounded-3xl p-8 md:p-12 overflow-hidden relative shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-block px-3 py-1 bg-indigo-500/30 backdrop-blur-sm border border-indigo-400/30 rounded-full text-xs font-bold tracking-widest uppercase">
              Specialized Academic Identity
            </span>
            <span className="inline-block px-3 py-1 bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/30 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Current: {result.currentAffiliation}
            </span>
          </div>
          
          <h2 className="serif text-4xl md:text-6xl mb-4 italic leading-tight">
            "{result.specializedTitle}"
          </h2>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl mb-8 max-w-3xl">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">Researcher Profile</h4>
            <p className="text-lg text-indigo-50 font-light leading-relaxed mb-4">
              {result.briefBio}
            </p>
            <hr className="border-white/10 mb-4" />
            <p className="text-indigo-100 font-light leading-relaxed">
              {result.executiveSummary}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
             {result.methodologicalFocus.map((m, idx) => (
               <span key={idx} className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium border border-white/10">
                 {m}
               </span>
             ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600 rounded-full blur-[100px] -ml-32 -mb-32 opacity-30"></div>
      </div>

      {/* Deep Technical Synthesis Section */}
      <div className="bg-slate-900 text-slate-300 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
           <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
           </svg>
        </div>
        <div className="relative z-10">
          <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
            <span className="w-12 h-px bg-indigo-500"></span>
            Pattern Synthesis & Technical Core
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-xl leading-relaxed font-light text-slate-100 italic first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-indigo-500">
              {result.deepTechnicalSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Domain Peer Comparison */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </span>
          Domain Peer Landscape & Linkages
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.peerComparison.map((peer, i) => (
            <div key={i} className="flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden group hover:border-indigo-300 transition-all duration-300">
              <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-white">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{peer.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{peer.coreResearchFocus}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  peer.relationshipType === 'Complementary' ? 'bg-green-100 text-green-700' :
                  peer.relationshipType === 'Competing' ? 'bg-red-100 text-red-700' :
                  peer.relationshipType === 'Pioneer' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {peer.relationshipType}
                </span>
              </div>
              <div className="p-5 flex-grow space-y-4 text-sm text-slate-600">
                <p>{peer.linkageReasoning}</p>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 font-medium">
                   {peer.distinctiveEdge}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Focus Density</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Focus" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Insights with Way of Thinking Reveal */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
            Thematic Reasoning
          </h3>
          <div className="space-y-4">
            {result.topicDistribution.map((topic, i) => (
              <TopicCard key={i} topic={topic} />
            ))}
          </div>
        </div>
      </div>

      {/* Self Comparison Module */}
      <SelfComparisonModule target={result} />

      {/* Sources */}
      {result.sources && result.sources.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Grounded Verification Sources</h4>
          <div className="flex flex-wrap gap-4">
            {result.sources.map((source, idx) => (
              <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 transition-all">
                {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
