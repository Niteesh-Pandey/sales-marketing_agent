import React from 'react';
import { Sparkles, Database, ShieldCheck, Zap, Building2, UserCheck } from 'lucide-react';

interface HeaderProps {
  onQuickAction: (tab: string) => void;
  geminiActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onQuickAction, geminiActive }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Niteesh AI Sales &amp; Marketing Command Center
              </h1>
              <span className="text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                AI Growth Labs
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Founder: <strong className="text-slate-200">Niteesh Pandey</strong> &bull; Client:{' '}
              <span className="text-slate-300 font-medium">UrbanNest Properties</span> (Mumbai, Thane, Pune)
            </p>
          </div>
        </div>

        {/* Center / Right Badges & Quick Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL Ready</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <span className={`w-2 h-2 rounded-full ${geminiActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>Gemini 3.8 Flash</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Free-First Local RAG</span>
          </div>

          <button
            onClick={() => onQuickAction('daily-plan')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Create Day Plan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
