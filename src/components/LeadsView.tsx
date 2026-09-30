import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Flame,
  Mail,
  ChevronRight,
  ArrowUpDown,
  CheckCircle,
  Eye,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import { Lead, LeadStage, LeadStatus } from '../types';

interface LeadsViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onNavigateToSales: (leadId: string) => void;
  onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onSelectLead,
  onOpenCreateModal,
  onOpenImportModal,
  onNavigateToSales,
  onUpdateLeadStage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score' | 'budget' | 'date'>('score');
  const [activePreset, setActivePreset] = useState<string>('all');

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    if (preset === 'all') {
      setStageFilter('ALL');
      setCityFilter('ALL');
      setStatusFilter('ALL');
      setMinScore(0);
    } else if (preset === 'hot') {
      setStageFilter('ALL');
      setCityFilter('ALL');
      setStatusFilter('HOT');
      setMinScore(75);
    } else if (preset === 'mumbai') {
      setCityFilter('Mumbai');
      setStageFilter('ALL');
      setStatusFilter('ALL');
      setMinScore(0);
    } else if (preset === 'thane') {
      setCityFilter('Thane');
      setStageFilter('ALL');
      setStatusFilter('ALL');
      setMinScore(0);
    } else if (preset === 'pune') {
      setCityFilter('Pune');
      setStageFilter('ALL');
      setStatusFilter('ALL');
      setMinScore(0);
    } else if (preset === 'hni') {
      setStageFilter('ALL');
      setCityFilter('ALL');
      setStatusFilter('ALL');
      setMinScore(0);
      setSearchTerm('');
    }
  };

  const filteredLeads = leads
    .filter((lead) => {
      if (activePreset === 'hni' && lead.budget < 15000000) return false;
      if (stageFilter !== 'ALL' && lead.stage !== stageFilter) return false;
      if (cityFilter !== 'ALL' && lead.city !== cityFilter) return false;
      if (statusFilter !== 'ALL' && lead.status !== statusFilter) return false;
      if (lead.lead_score < minScore) return false;
      if (searchTerm.trim()) {
        const s = searchTerm.toLowerCase();
        return (
          lead.name.toLowerCase().includes(s) ||
          lead.email.toLowerCase().includes(s) ||
          lead.company.toLowerCase().includes(s) ||
          lead.product_interest.toLowerCase().includes(s) ||
          lead.city.toLowerCase().includes(s)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.lead_score - a.lead_score;
      if (sortBy === 'budget') return b.budget - a.budget;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const exportCsv = () => {
    const headers = ['Lead ID', 'Name', 'Email', 'Phone', 'Company', 'City', 'Job Title', 'Product', 'Budget', 'Lead Score', 'Stage', 'Status', 'Notes'];
    const rows = filteredLeads.map(l => [
      l.lead_id,
      `"${l.name}"`,
      l.email,
      l.phone,
      `"${l.company}"`,
      l.city,
      `"${l.job_title}"`,
      `"${l.product_interest}"`,
      l.budget,
      l.lead_score,
      l.stage,
      l.status,
      `"${l.notes.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `niteesh_growth_labs_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <Flame className="w-3 h-3" />
          {score}/100
        </span>
      );
    }
    if (score >= 60) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          {score}/100
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
        {score}/100
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Lead Management Database
          </h2>
          <p className="text-xs text-slate-400">
            {leads.length} total client profiles with 8-dimension transparent deterministic scoring
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenCreateModal}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
          <button
            onClick={onOpenImportModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        {/* Quick Filter Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Presets:</span>
          {[
            { id: 'all', label: 'All Leads', count: leads.length },
            { id: 'hot', label: '🔥 Hot Deals (80+)', count: leads.filter((l) => l.status === 'HOT' || l.lead_score >= 80).length },
            { id: 'mumbai', label: '📍 Mumbai Prime', count: leads.filter((l) => l.city === 'Mumbai').length },
            { id: 'thane', label: '📍 Thane Select', count: leads.filter((l) => l.city === 'Thane').length },
            { id: 'pune', label: '📍 Pune Investors', count: leads.filter((l) => l.city === 'Pune').length },
            { id: 'hni', label: '💎 ₹1.5 Cr+ HNI', count: leads.filter((l) => l.budget >= 15000000).length },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activePreset === p.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {p.label} <span className="opacity-60 text-[10px]">({p.count})</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, company, email, or product..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Stage Filter */}
          <div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Stages</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="MEETING">Meeting</option>
              <option value="PROPOSAL">Proposal</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
              <option value="NURTURE">Nurture</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Thane">Thane</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="score">Sort: Highest Score</option>
              <option value="budget">Sort: Highest Budget</option>
              <option value="date">Sort: Newest Lead</option>
            </select>
          </div>
        </div>

        {/* Score threshold slider */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span>Minimum Score Filter:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="accent-indigo-500 h-1.5 w-32 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="font-bold text-white text-[11px]">{minScore}+</span>
          </div>
          <div>
            Showing <strong className="text-white">{filteredLeads.length}</strong> of {leads.length} leads
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Lead &amp; Company</th>
                <th className="py-3 px-3">City &amp; Product</th>
                <th className="py-3 px-3">Budget</th>
                <th className="py-3 px-3">Lead Score</th>
                <th className="py-3 px-3">Funnel Stage</th>
                <th className="py-3 px-3">AI Next Action</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.lead_id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Name & Company */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {lead.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {lead.job_title} &bull; {lead.company}
                    </div>
                  </td>

                  {/* City & Product */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-200">{lead.city}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                      {lead.product_interest}
                    </div>
                  </td>

                  {/* Budget */}
                  <td className="py-3 px-3 font-semibold text-slate-200">
                    ₹{(lead.budget / 10000000).toFixed(2)} Cr
                  </td>

                  {/* Lead Score */}
                  <td className="py-3 px-3">
                    {getScoreBadge(lead.lead_score)}
                  </td>

                  {/* Funnel Stage Dropdown */}
                  <td className="py-3 px-3">
                    <select
                      value={lead.stage}
                      onChange={(e) => onUpdateLeadStage(lead.lead_id, e.target.value as LeadStage)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded-md border outline-none cursor-pointer ${
                        lead.stage === 'WON'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : lead.stage === 'LOST'
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : ['NEGOTIATION', 'PROPOSAL'].includes(lead.stage)
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="QUALIFIED">QUALIFIED</option>
                      <option value="MEETING">MEETING</option>
                      <option value="PROPOSAL">PROPOSAL</option>
                      <option value="NEGOTIATION">NEGOTIATION</option>
                      <option value="WON">WON</option>
                      <option value="LOST">LOST</option>
                      <option value="NURTURE">NURTURE</option>
                    </select>
                  </td>

                  {/* AI Next Action */}
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300">
                      {lead.recommended_next_action || 'FOLLOW_UP'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${lead.name}, Niteesh Pandey here from UrbanNest Properties regarding your inquiry for ${lead.product_interest}. Would today be a good time for a brief walkthrough?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-800/80 text-emerald-400 border border-emerald-700/60 transition-colors cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors cursor-pointer"
                        title="Call Client"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onSelectLead(lead)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="View Score Breakdown & Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onNavigateToSales(lead.lead_id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer"
                        title="Draft Sales Email"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Draft</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
