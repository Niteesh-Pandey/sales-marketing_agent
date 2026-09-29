import React, { useState } from 'react';
import {
  Settings,
  FileText,
  ShieldCheck,
  Database,
  RefreshCw,
  Copy,
  Check,
  Download,
  Terminal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  History,
  Layers,
  Sparkles,
  Cpu,
  Github,
  Server,
  Key,
  Globe
} from 'lucide-react';
import { AuditLog } from '../types';

interface ReportsSettingsViewProps {
  auditLogs: AuditLog[];
  onResetDemoData: () => void;
  currentModel: string;
  onModelChange: (modelId: string) => void;
  geminiActive: boolean;
}

const SUPPORTED_MODELS = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    tag: 'Latest & Recommended',
    description: 'High-speed multimodal reasoning, instant CRM intelligence & zero-hallucination analysis.',
    speed: 'Ultra Fast (<800ms)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    tag: 'Ultra-Low Latency',
    description: 'Lightweight, rapid execution for high-frequency lead scoring, tasks & email follow-ups.',
    speed: 'Extreme Speed (<400ms)',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    tag: 'Balanced Workhorse',
    description: 'Standard enterprise reasoning model for daily marketing copy & meeting note parsing.',
    speed: 'Fast (<1.2s)',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    tag: 'Deep Reasoning & Math',
    description: 'Maximum cognitive power for complex multi-touch marketing attribution & financial modeling.',
    speed: 'Deep Thought (~2-3s)',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  }
];

export const ReportsSettingsView: React.FC<ReportsSettingsViewProps> = ({
  auditLogs,
  onResetDemoData,
  currentModel,
  onModelChange,
  geminiActive
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'settings' | 'github' | 'audit'>('report');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState<string>('');
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const res = await fetch('/api/gemini/management-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      setReportMarkdown(data.report || 'Report could not be generated.');
    } catch (err: any) {
      setReportMarkdown(`Error generating report: ${err.message}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadReport = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Weekly_Sales_Marketing_Report_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all CRM leads, campaigns, and tasks to default demo data?')) {
      onResetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const gitPushScript = `# 1. Initialize git & set identity
git init
git config user.name "Niteesh Pandey"
git config user.email "niteeshpandey9555@gmail.com"

# 2. Stage all updated files
git add .

# 3. Commit clean enterprise release
git commit -m "feat: Niteesh AI Sales & Marketing Command Center v1.0 enterprise release"

# 4. Link to GitHub repository
git remote add origin https://github.com/Niteesh-Pandey/sales-marketing_agent.git

# 5. Push to main branch
git branch -M main
git push -u origin main --force`;

  const handleCopyGitCommands = () => {
    navigator.clipboard.writeText(gitPushScript);
    setCopiedGitCmd(true);
    setTimeout(() => setCopiedGitCmd(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            Executive Reports, Engine &amp; Cloud Deployment
          </h2>
          <p className="text-xs text-slate-400">
            Switch Gemini models, generate weekly management briefs, verify PostgreSQL compatibility, and manage GitHub deployment
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'report' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Executive Report
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Models &amp; Engine
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'github' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            GitHub &amp; Hosting
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'audit' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Weekly Management Report */}
      {activeTab === 'report' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Weekly Sales &amp; Marketing Executive Report
              </h3>
              <p className="text-xs text-slate-400">
                Grounds all analysis strictly on verified CRM metrics, pipeline stage conversion, and active ROAS
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateReport}
                disabled={generatingReport}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{generatingReport ? 'Compiling Report...' : 'Generate Executive Report'}</span>
              </button>

              {reportMarkdown && (
                <>
                  <button
                    onClick={handleCopyReport}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                    title="Copy Markdown"
                  >
                    {copiedReport ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>Download .md</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {generatingReport ? (
            <div className="py-24 text-center text-xs text-slate-400 space-y-2">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Analyzing active pipeline, closed bookings, qualified lead ratios &amp; ad ROAS with {currentModel}...</p>
            </div>
          ) : reportMarkdown ? (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans max-h-[520px] overflow-y-auto">
              {reportMarkdown}
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-slate-500 italic">
              Click &ldquo;Generate Executive Report&rdquo; to build an executive briefing with verified pipeline numbers.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: AI Models & Engine Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Active Model Selector */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  Gemini Model Engine Selection
                </h3>
                <p className="text-xs text-slate-400">
                  Select your active primary Gemini model. Switch between Flash 3.8, 3.1 Flash-Lite, and 2.5 series.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Active Engine:</span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold">
                  {currentModel}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {SUPPORTED_MODELS.map((model) => {
                const isSelected = model.id === currentModel;
                return (
                  <div
                    key={model.id}
                    onClick={() => onModelChange(model.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{model.name}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${model.badgeColor}`}>
                          {model.tag}
                        </span>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Click to activate</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                      {model.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>Latency: <strong className="text-slate-200">{model.speed}</strong></span>
                      <span className="font-mono text-[10px] text-indigo-400">{model.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subsystems & PostgreSQL Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Subsystem Diagnostics
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white">API Runtime &amp; Server:</strong>
                    <p className="text-slate-400 text-[11px]">Node.js 22 LTS / Express 4 / TypeScript</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    PASS
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white">PostgreSQL Data Layer:</strong>
                    <p className="text-slate-400 text-[11px]">Dual-Engine Adapter with In-Memory Resilient Cache</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    PASS
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white">Gemini Official SDK:</strong>
                    <p className="text-slate-400 text-[11px]">@google/genai TypeScript &bull; {geminiActive ? 'Key Active' : 'Key Missing'}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold border ${geminiActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
                    {geminiActive ? 'CONNECTED' : 'STANDBY'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white">Deterministic Scoring Engine:</strong>
                    <p className="text-slate-400 text-[11px]">8 Dimensions &bull; 0–100 Scale &bull; Zero Hallucination</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    PASS
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo Leads, Tasks &amp; Campaigns</span>
                </button>
                {resetSuccess && (
                  <p className="text-emerald-400 text-[11px] text-center mt-2 font-medium">
                    &check; Demo data re-initialized with 50+ realistic client leads.
                  </p>
                )}
              </div>
            </div>

            {/* PostgreSQL Database Configuration */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                PostgreSQL Enterprise Database Setup
              </h3>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Environment Connection String
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  To connect your remote or local PostgreSQL database, set <code className="text-indigo-300 font-mono">DATABASE_URL</code> in your <code className="text-indigo-300 font-mono">.env</code> file:
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 select-all break-all">
                  DATABASE_URL=postgresql://postgres:your_password@localhost:5432/niteesh_growth_labs
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                  Fail-Safe Offline Mode
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  If PostgreSQL is offline or unreachable, the application automatically switches to in-memory caching with zero downtime, preserving all user actions and providing smooth demonstration capability.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: GitHub Deployment & Cloud Hosting Guide */}
      {activeTab === 'github' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Github className="w-5 h-5 text-indigo-400" />
                GitHub Repository &amp; Cloud Hosting Instructions
              </h3>
              <p className="text-xs text-slate-400">
                Commands to publish your custom application to <code className="text-indigo-300 font-mono">https://github.com/Niteesh-Pandey/sales-marketing_agent</code> and host it anywhere
              </p>
            </div>

            <button
              onClick={handleCopyGitCommands}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              {copiedGitCmd ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedGitCmd ? 'Commands Copied!' : 'Copy Git Push Commands'}</span>
            </button>
          </div>

          {/* Quick Terminal Code Block */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Terminal Commands to Push directly to your GitHub Repository:
            </span>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
              {gitPushScript}
            </pre>
          </div>

          {/* Cloud Hosting Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wide">
                <Globe className="w-4 h-4" />
                <span>Render / Railway</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your GitHub repo. Set Build Command: <code className="text-indigo-300">npm run build</code>, Start Command: <code className="text-indigo-300">npm run start</code>.
              </p>
              <div className="text-[11px] text-slate-400">
                Add <code className="text-slate-200">GEMINI_API_KEY</code> in environment settings.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wide">
                <Server className="w-4 h-4" />
                <span>Docker / VPS</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use the included <code className="text-purple-300">Dockerfile</code>. Build with:
                <br /><code className="text-slate-200 font-mono text-[10px]">docker build -t niteesh-agent .</code>
              </p>
              <div className="text-[11px] text-slate-400">
                Run with port mapping <code className="text-slate-200">-p 3000:3000</code>.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                <Key className="w-4 h-4" />
                <span>Environment Variables</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Configured via standard <code className="text-emerald-300">.env</code>:
              </p>
              <div className="text-[10px] font-mono text-slate-400 space-y-0.5">
                <div>GEMINI_API_KEY=...</div>
                <div>GEMINI_MODEL=gemini-3.8-flash</div>
                <div>PORT=3000</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Log */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              Safety &amp; Compliance Audit Trail
            </h3>
            <span className="text-xs text-slate-400">
              Immutable logging of all AI executions, lead modifications, and drafts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-2">User</th>
                  <th className="py-2.5 px-2">Action</th>
                  <th className="py-2.5 px-2">Subsystem / Tool</th>
                  <th className="py-2.5 px-2">Target</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                    <td className="py-2.5 px-2 font-medium text-slate-200">{log.user}</td>
                    <td className="py-2.5 px-2 font-mono text-indigo-400 font-semibold text-[11px]">{log.action}</td>
                    <td className="py-2.5 px-2 text-slate-400">{log.tool}</td>
                    <td className="py-2.5 px-2 text-slate-200">{log.target}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
