
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">ResearchNiche AI</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1">Analyze</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Documentation</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-4">
             <button className="text-sm px-4 py-2 text-slate-600 hover:text-slate-900 font-medium">Log In</button>
             <button className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">Get Started</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
