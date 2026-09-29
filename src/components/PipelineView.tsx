import React from 'react';
import { Kanban, Flame, ChevronLeft, ChevronRight, Eye, Mail, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lead, LeadStage } from '../types';

interface PipelineViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
  onNavigateToSales: (leadId: string) => void;
}

const STAGES_ORDER: { key: LeadStage; label: string; color: string }[] = [
  { key: 'NEW', label: 'New', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
  { key: 'CONTACTED', label: 'Contacted', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' },
  { key: 'QUALIFIED', label: 'Qualified', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
  { key: 'MEETING', label: 'Meeting / Visit', color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300' },
  { key: 'PROPOSAL', label: 'Proposal', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
  { key: 'NEGOTIATION', label: 'Negotiation', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
  { key: 'WON', label: 'Closed Won', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  { key: 'LOST', label: 'Lost / Dormant', color: 'border-slate-600/40 bg-slate-800/40 text-slate-400' },
];

export const PipelineView: React.FC<PipelineViewProps> = ({
  leads,
  onSelectLead,
  onUpdateLeadStage,
  onNavigateToSales
}) => {
  const handleMove = (leadId: string, currentStage: LeadStage, direction: 'prev' | 'next') => {
    const currentIndex = STAGES_ORDER.findIndex((s) => s.key === currentStage);
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < STAGES_ORDER.length) {
      const newStage = STAGES_ORDER[targetIndex].key;
      onUpdateLeadStage(leadId, newStage);
      if (newStage === 'WON') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Kanban className="w-5 h-5 text-indigo-400" />
            Visual CRM Sales Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Drag, prioritize, and advance UrbanNest Properties prospects through 8 pipeline milestones
          </p>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-6 pt-1 select-none min-h-[calc(100vh-210px)]">
        {STAGES_ORDER.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.key);
          const colTotal = colLeads.reduce((acc, l) => acc + (Number(l.budget) || 0), 0);

          return (
            <div
              key={col.key}
              className="w-72 shrink-0 flex flex-col rounded-xl bg-slate-900/70 border border-slate-800 shadow-md overflow-hidden"
            >
              {/* Column Header */}
              <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-xs font-bold text-white">({colLeads.length})</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                    ₹{(colTotal / 10000000).toFixed(2)} Cr pipeline
                  </div>
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-2 space-y-2.5 overflow-y-auto flex-1 max-h-[calc(100vh-290px)]">
                {colLeads.map((lead) => (
                  <div
                    key={lead.lead_id}
                    className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/90 hover:border-indigo-500/50 hover:bg-slate-950 transition-all shadow-sm group space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-xs group-hover:text-indigo-300 transition-colors">
                          {lead.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {lead.company} &bull; {lead.city}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          lead.lead_score >= 80
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : lead.lead_score >= 60
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {lead.lead_score}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 font-medium">
                      ₹{(lead.budget / 10000000).toFixed(2)} Cr
                      <span className="text-[10px] text-slate-400 block truncate font-normal">
                        {lead.product_interest}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-2 italic bg-slate-900/70 p-1.5 rounded border border-slate-800/60">
                      &ldquo;{lead.notes}&rdquo;
                    </p>

                    {/* Actions and Stage Movement */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(lead.lead_id, lead.stage, 'prev')}
                          disabled={col.key === 'NEW'}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 cursor-pointer"
                          title="Move Previous Stage"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMove(lead.lead_id, lead.stage, 'next')}
                          disabled={col.key === 'LOST'}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 cursor-pointer"
                          title="Advance Next Stage"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onSelectLead(lead)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onNavigateToSales(lead.lead_id)}
                          className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1 cursor-pointer"
                          title="Draft Email"
                        >
                          <Mail className="w-2.5 h-2.5" />
                          <span>Draft</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="p-4 text-center text-slate-600 text-[11px] italic">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
