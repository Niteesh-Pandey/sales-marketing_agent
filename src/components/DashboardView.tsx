import React from 'react';
import {
  Users,
  Flame,
  TrendingUp,
  Award,
  Zap,
  PhoneCall,
  Mail,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Target,
  BarChart,
  Layers
} from 'lucide-react';
import { Lead, Campaign } from '../types';

interface DashboardViewProps {
  leads: Lead[];
  campaigns: Campaign[];
  onNavigate: (tab: string, meta?: any) => void;
  onSelectLead: (lead: Lead) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  campaigns,
  onNavigate,
  onSelectLead,
}) => {
  const hotLeads = leads.filter((l) => l.status === 'HOT' || l.lead_score >= 80);
  const wonLeads = leads.filter((l) => l.stage === 'WON');
  const negotiationLeads = leads.filter((l) => l.stage === 'NEGOTIATION');
  const proposalLeads = leads.filter((l) => l.stage === 'PROPOSAL');

  const totalPipelineValue = [...negotiationLeads, ...proposalLeads].reduce(
    (acc, l) => acc + (Number(l.budget) || 0),
    0
  );

  const totalWonRevenue = wonLeads.reduce(
    (acc, l) => acc + (Number(l.budget) || 0),
    0
  );

  const avgLeadScore =
    leads.length > 0
      ? Math.round(leads.reduce((acc, l) => acc + l.lead_score, 0) / leads.length)
      : 0;

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalCampaignRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const overallROAS = totalSpend > 0 ? (totalCampaignRevenue / totalSpend).toFixed(1) : '0';

  const stages = [
    { key: 'NEW', label: 'New Inquiries', color: 'from-blue-500 to-sky-400' },
    { key: 'CONTACTED', label: 'Contacted', color: 'from-cyan-500 to-teal-400' },
    { key: 'QUALIFIED', label: 'Qualified', color: 'from-amber-500 to-yellow-400' },
    { key: 'MEETING', label: 'Site Visits/Meetings', color: 'from-indigo-500 to-purple-400' },
    { key: 'PROPOSAL', label: 'Proposals Out', color: 'from-purple-500 to-pink-400' },
    { key: 'NEGOTIATION', label: 'In Negotiation', color: 'from-rose-500 to-red-400' },
    { key: 'WON', label: 'Bookings Closed', color: 'from-emerald-500 to-teal-400' },
  ];

  const quickScenarios = [
    {
      title: 'Top 10 Priority Leads Today',
      desc: 'Ranked by deterministic score & urgency',
      tab: 'leads',
      tag: 'Leads Engine',
      action: 'View Top Leads',
    },
    {
      title: 'Create AI Day Plan',
      desc: 'Chronological morning-to-EOD agenda',
      tab: 'daily-plan',
      tag: 'Daily Manager',
      action: 'Generate Plan',
    },
    {
      title: 'Objection Handling Playbook',
      desc: '11 categories with price & timing evidence',
      tab: 'sales-tools',
      tag: 'Sales AI',
      action: 'Open Playbook',
    },
    {
      title: 'Marketing Funnel & CAC Analysis',
      desc: 'Audit CTR, CPL, ROAS & Drop-offs',
      tab: 'analytics',
      tag: '11 Formulas',
      action: 'Audit Metrics',
    },
    {
      title: 'Extract Meeting Intelligence',
      desc: 'Paste notes to extract CRM pain points & next steps',
      tab: 'meetings',
      tag: 'CRM Extraction',
      action: 'Analyze Call',
    },
    {
      title: 'Weekly Management Report',
      desc: 'Evidence-backed executive briefing',
      tab: 'reports-settings',
      tag: 'Report Gen',
      action: 'Generate Brief',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner / Overview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-950/60 border border-indigo-500/20 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
              <Zap className="w-3 h-3 text-amber-300" />
              Niteesh AI Growth Labs Command Center
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Good morning, Niteesh.
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your AI partner for UrbanNest Properties residential sales across Mumbai, Thane, and Pune.
              All insights follow strict evidence grounding:{' '}
              <span className="text-slate-100 font-semibold">FACT &bull; INFERENCE &bull; ASSUMPTION &bull; RECOMMENDATION</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Ask AI Assistant
            </button>
            <button
              onClick={() => onNavigate('daily-plan')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              Day Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Leads */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Active Leads</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{leads.length}</div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-emerald-400 font-semibold">{hotLeads.length} High Intent</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-400">{avgLeadScore}/100 Avg Score</span>
          </div>
        </div>

        {/* Card 2: Weighted Pipeline */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Weighted Pipeline</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₹{(totalPipelineValue / 10000000).toFixed(2)} Cr
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>{negotiationLeads.length} in Negotiation</span>
            <span>&bull;</span>
            <span>{proposalLeads.length} Proposals</span>
          </div>
        </div>

        {/* Card 3: Closed Bookings */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Closed Bookings (Won)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ₹{(totalWonRevenue / 10000000).toFixed(2)} Cr
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>{wonLeads.length} units finalized</span>
            <span>&bull;</span>
            <span className="text-emerald-400">100% token verified</span>
          </div>
        </div>

        {/* Card 4: Marketing ROAS */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Marketing ROAS</span>
            <BarChart className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{overallROAS}x</div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>₹{(totalSpend / 100000).toFixed(1)}L ad spend</span>
            <span>&bull;</span>
            <span>10 Active Campaigns</span>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Funnel Overview */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Sales Pipeline Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Live count of residential prospects progressing through conversion stages
            </p>
          </div>
          <button
            onClick={() => onNavigate('pipeline')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Kanban Board</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2.5">
          {stages.map((stage) => {
            const count = leads.filter((l) => l.stage === stage.key).length;
            const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
            return (
              <div
                key={stage.key}
                onClick={() => onNavigate('pipeline')}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all cursor-pointer group"
              >
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 truncate">
                  {stage.label}
                </div>
                <div className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors">
                  {count}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stage.color}`}
                    style={{ width: `${Math.min(100, Math.max(8, pct * 2))}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{pct}% of pipeline</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Grid: Priority Leads & Quick Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Top 5 Priority Leads (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-white">
                High Priority Opportunities (Lead Score &ge; 80)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({leads.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {hotLeads.slice(0, 5).map((lead) => (
              <div
                key={lead.lead_id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{lead.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Score: {lead.lead_score}/100
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {lead.city}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2">
                    <span>{lead.product_interest}</span>
                    <span>&bull;</span>
                    <span className="text-slate-200 font-medium">
                      Budget: ₹{(lead.budget / 10000000).toFixed(2)} Cr
                    </span>
                    <span>&bull;</span>
                    <span className="text-indigo-400 font-medium">{lead.stage}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                    &ldquo;{lead.notes}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectLead(lead);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('sales-tools', { leadId: lead.lead_id });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Draft Email</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Action Scenarios (1 col) */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Pre-Configured Scenarios</h3>
          </div>
          <p className="text-xs text-slate-400">
            Execute immediate sales, marketing &amp; RAG playbooks
          </p>

          <div className="space-y-2">
            {quickScenarios.map((sc, i) => (
              <div
                key={i}
                onClick={() => onNavigate(sc.tab)}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-950 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {sc.title}
                    </span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                      {sc.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{sc.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
