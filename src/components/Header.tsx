import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Database,
  ShieldCheck,
  Zap,
  ChevronDown,
  Check,
  Github,
  Cpu
} from 'lucide-react';

interface HeaderProps {
  onQuickAction: (tab: string) => void;
  geminiActive: boolean;
  currentModel: string;
  onModelChange: (modelId: string) => void;
}

const MODEL_OPTIONS = [
  { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', tag: 'Fastest / Latest' },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite', tag: 'Ultra-Low Latency' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', tag: 'Balanced Reasoning' },
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', tag: 'Deep Strategy & Math' }
];

export const Header: React.FC<HeaderProps> = ({
  onQuickAction,
  geminiActive,
  currentModel,
  onModelChange
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeModelObj = MODEL_OPTIONS.find((m) => m.id === currentModel) || MODEL_OPTIONS[0];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3">
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
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Enterprise v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Architect: <strong className="text-slate-200">Niteesh Pandey</strong> &bull; Client:{' '}
              <span className="text-slate-300 font-medium">UrbanNest Properties</span> (Mumbai, Thane, Pune)
            </p>
          </div>
        </div>

        {/* Center / Right Badges & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* GitHub Repo Link */}
          <a
            href="https://github.com/Niteesh-Pandey/sales-marketing_agent"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="GitHub Repository"
          >
            <Github className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* PostgreSQL Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL Dual-Engine</span>
          </div>

          {/* Interactive Model Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-all cursor-pointer shadow-sm"
              title="Change active Gemini Model"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  geminiActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium">{activeModelObj.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${modelDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {modelDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select Active Gemini Model
                </div>
                <div className="py-1 space-y-0.5">
                  {MODEL_OPTIONS.map((m) => {
                    const isSelected = m.id === currentModel;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          onModelChange(m.id);
                          setModelDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-semibold flex items-center gap-1.5">
                            <span>{m.label}</span>
                            {isSelected && <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.2 rounded font-normal">Active</span>}
                          </div>
                          <div className="text-[10px] text-slate-400">{m.tag}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="p-2 border-t border-slate-800 text-[10px] text-slate-400 bg-slate-950/60 rounded-b-lg">
                  Powered by Google GenAI SDK &bull; Zero prompt telemetry
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Button */}
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
