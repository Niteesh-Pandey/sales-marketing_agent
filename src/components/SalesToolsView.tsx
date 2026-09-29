import React, { useState } from 'react';
import {
  MailCheck,
  Send,
  Copy,
  Check,
  Download,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  MessageSquare,
  FileCheck,
  BookOpen
} from 'lucide-react';
import { Lead, ObjectionResponse } from '../types';

interface SalesToolsViewProps {
  leads: Lead[];
  preselectedLeadId?: string;
}

export const SalesToolsView: React.FC<SalesToolsViewProps> = ({
  leads,
  preselectedLeadId
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'objections' | 'scripts'>('email');

  // Email Generator State
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    preselectedLeadId || (leads[0]?.lead_id || '')
  );
  const [emailType, setEmailType] = useState<string>('Follow-up Email');
  const [tone, setTone] = useState<string>('Consultative');
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Objection Handling State
  const [objectionCategory, setObjectionCategory] = useState<string>('Price');
  const [customerQuote, setCustomerQuote] = useState<string>(
    'Your price per sqft is higher than other developers in the same locality.'
  );
  const [objectionResult, setObjectionResult] = useState<ObjectionResponse | null>(null);
  const [loadingObjection, setLoadingObjection] = useState(false);

  const emailTypes = [
    'Follow-up Email',
    'Cold Outreach',
    'Warm Outreach',
    'Meeting Request',
    'Re-engagement Message',
    'Proposal Follow-up',
    'Lost-lead Reactivation'
  ];

  const tones = [
    'Consultative',
    'Professional',
    'Executive',
    'Short & Direct',
    'Persuasive'
  ];

  const objectionCategories = [
    { key: 'Price', label: 'Price & Per SqFt Rate' },
    { key: 'Budget', label: 'Budget Ceiling & Loan Fit' },
    { key: 'Timing', label: 'Timing & Market Waiting' },
    { key: 'Trust', label: 'Trust & Construction Delivery' },
    { key: 'Competition', label: 'Competitor Comparison' },
    { key: 'Need more information', label: 'Need More Information' },
    { key: 'Partner approval', label: 'Spouse / Family Approval' },
    { key: 'Location concern', label: 'Location & Traffic' },
    { key: 'ROI concern', label: 'Rental Yield & ROI' },
    { key: 'Already working with another', label: 'Evaluating Alternate Builder' },
    { key: 'Not interested', label: 'Low Intent / Just Browsing' }
  ];

  const handleGenerateEmail = async () => {
    if (!selectedLeadId) return;
    setLoadingEmail(true);
    try {
      const res = await fetch('/api/gemini/sales-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLeadId,
          emailType,
          tone
        })
      });
      const data = await res.json();
      setGeneratedDraft(data.draft || 'Failed to generate content.');
    } catch (err: any) {
      setGeneratedDraft(`Error generating draft: ${err.message}`);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([generatedDraft], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales_draft_${selectedLeadId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAnalyzeObjection = async () => {
    setLoadingObjection(true);
    try {
      const res = await fetch('/api/gemini/objection-handler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: objectionCategory,
          customerQuote,
          productContext: 'UrbanNest Prime Residences & Select Homes'
        })
      });
      const data = await res.json();
      setObjectionResult(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingObjection(false);
    }
  };

  const currentLead = leads.find((l) => l.lead_id === selectedLeadId);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MailCheck className="w-5 h-5 text-indigo-400" />
            Sales Assistant &amp; Objection Engine
          </h2>
          <p className="text-xs text-slate-400">
            Generate evidence-grounded consultative sales correspondence and structured objection handling
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'email' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Email &amp; Outreach
          </button>
          <button
            onClick={() => setActiveTab('objections')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'objections' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Objection Playbook (11)
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'scripts' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Discovery &amp; Closing Scripts
          </button>
        </div>
      </div>

      {/* Tab 1: Email Generator */}
      {activeTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Config (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Configure Sales Message
            </h3>

            {/* Select Lead */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Lead (from CRM)</label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
              >
                {leads.map((l) => (
                  <option key={l.lead_id} value={l.lead_id}>
                    {l.name} — {l.company} ({l.city}, ₹{(l.budget / 10000000).toFixed(2)}Cr, {l.stage})
                  </option>
                ))}
              </select>
            </div>

            {/* Lead Context Snippet */}
            {currentLead && (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{currentLead.name}</span>
                  <span className="text-[10px] font-semibold text-indigo-400">{currentLead.product_interest}</span>
                </div>
                <p className="text-slate-400 text-[11px] italic">&ldquo;{currentLead.notes}&rdquo;</p>
                <div className="text-[10px] text-slate-500">
                  Stage: <strong className="text-slate-300">{currentLead.stage}</strong> &bull; Score:{' '}
                  <strong className="text-emerald-400">{currentLead.lead_score}/100</strong>
                </div>
              </div>
            )}

            {/* Email Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Message Objective</label>
              <select
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
              >
                {emailTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tone of Voice</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tones.map((tn) => (
                  <button
                    key={tn}
                    type="button"
                    onClick={() => setTone(tn)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      tone === tn
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tn}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateEmail}
              disabled={loadingEmail}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loadingEmail ? 'Generating Evidence-Backed Copy...' : 'Generate Sales Draft'}</span>
            </button>
          </div>

          {/* Right Output (7 cols) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between min-h-[420px]">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Generated Sales Copy</h3>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-semibold">
                    {tone}
                  </span>
                </div>

                {generatedDraft && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyDraft}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedDraft ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleDownloadTxt}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Download .txt</span>
                    </button>
                  </div>
                )}
              </div>

              {loadingEmail ? (
                <div className="py-20 text-center text-xs text-slate-400 space-y-2">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Synthesizing lead requirements, carpet efficiency &amp; payment milestones...</p>
                </div>
              ) : generatedDraft ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                  {generatedDraft}
                </div>
              ) : (
                <div className="py-20 text-center text-xs text-slate-500 italic">
                  Select a lead and click &ldquo;Generate Sales Draft&rdquo; to prepare a consultative message.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-amber-300/80">
                <ShieldCheck className="w-3.5 h-3.5" />
                Free-first: Stored locally in Draft mode. No automated external sending without approval.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Objection Handling Playbook */}
      {activeTab === 'objections' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Objection Taxonomy (11 Types)
            </h3>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {objectionCategories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => {
                    setObjectionCategory(c.key);
                    if (c.key === 'Price') {
                      setCustomerQuote('Your price per sqft is higher than other developers in the same locality.');
                    } else if (c.key === 'Timing') {
                      setCustomerQuote('We want to wait 6 months for interest rates or market prices to soften.');
                    } else if (c.key === 'Trust') {
                      setCustomerQuote('How do I know delivery won\'t be delayed beyond the promised timeline?');
                    } else if (c.key === 'ROI concern') {
                      setCustomerQuote('Is the 6.2% gross rental yield realistically achievable in Kharadi?');
                    } else {
                      setCustomerQuote(`Client expressed hesitation regarding ${c.label}.`);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    objectionCategory === c.key
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800/60'
                  }`}
                >
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Customer Quote / Context</label>
              <textarea
                rows={3}
                value={customerQuote}
                onChange={(e) => setCustomerQuote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleAnalyzeObjection}
              disabled={loadingObjection}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loadingObjection ? 'Analyzing Playbook...' : 'Get Structured Response'}</span>
            </button>
          </div>

          <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Consultative Resolution Framework ({objectionCategory})
            </h3>

            {loadingObjection ? (
              <div className="py-20 text-center text-xs text-slate-400">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span>Formulating evidence-based response...</span>
              </div>
            ) : objectionResult ? (
              <div className="space-y-3.5 text-xs">
                {/* 1. Underlying Concern */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-1">
                    1. Likely Root Concern
                  </div>
                  <p className="text-slate-200">{objectionResult.likelyConcern}</p>
                </div>

                {/* 2. Suggested Response */}
                <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                  <div className="font-bold text-indigo-300 text-xs uppercase tracking-wider mb-1">
                    2. Suggested Consultative Response
                  </div>
                  <p className="text-slate-100 font-medium leading-relaxed italic">
                    &ldquo;{objectionResult.suggestedResponse}&rdquo;
                  </p>
                </div>

                {/* 3. Proof / Evidence Needed */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-1">
                    3. Proof / Evidence Required
                  </div>
                  <p className="text-slate-300">{objectionResult.proofEvidenceNeeded}</p>
                </div>

                {/* 4. Follow-up Question & Next Step */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-purple-300 text-xs uppercase tracking-wider mb-1">
                      4. Follow-up Question
                    </div>
                    <p className="text-slate-200">&ldquo;{objectionResult.followUpQuestion}&rdquo;</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-sky-300 text-xs uppercase tracking-wider mb-1">
                      5. Recommended Next Step
                    </div>
                    <p className="text-slate-200">{objectionResult.nextStep}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-slate-500 italic">
                Select an objection category from the left and click &ldquo;Get Structured Response&rdquo;.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Scripts & Discovery Framework */}
      {activeTab === 'scripts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs leading-relaxed">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Discovery Questions (Consultative Diagnostic)
            </h3>
            <div className="space-y-2 text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-white">Living Space Efficiency:</strong>
                <p className="text-slate-400 mt-0.5">
                  &ldquo;When comparing your current residence, what specific pain point are you prioritizing: quiet home-office acoustics, natural cross-ventilation, or dedicated children&apos;s activity zones?&rdquo;
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-white">Timeline &amp; Financing:</strong>
                <p className="text-slate-400 mt-0.5">
                  &ldquo;Are you looking to optimize your tax outflow under 54EC / capital gains exemption this financial year, or are you operating under bank pre-approved sanctions?&rdquo;
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-white">Decision Stakeholders:</strong>
                <p className="text-slate-400 mt-0.5">
                  &ldquo;Besides yourself and your spouse, will your parents or architect be evaluating the structural floorplan prior to allotment?&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs leading-relaxed">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              High-Integrity Closing Questions
            </h3>
            <div className="space-y-2 text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-white">Carpet Area Confirmation:</strong>
                <p className="text-slate-400 mt-0.5">
                  &ldquo;If the RERA-certified carpet plan confirms our 82% usable efficiency gives you an extra 180 sq ft of interior room over the competitor, would you feel comfortable reserving the floor today?&rdquo;
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-white">Price Revision Shield:</strong>
                <p className="text-slate-400 mt-0.5">
                  &ldquo;Our pre-slab rate revision goes live on Monday. Shall we block Flat 1402 with a refundable ₹50,000 expression-of-interest token so your price remains locked?&rdquo;
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <strong className="text-white">Investor Yield Lock:</strong>
                <p className="text-slate-400 mt-0.5">
                  &ldquo;With corporate tenant pre-leases already signed for Phase 1, shall we prepare the tripartite lease-guarantee paperwork for your legal counsel?&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
