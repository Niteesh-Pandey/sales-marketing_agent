import React, { useState } from 'react';
import {
  Megaphone,
  Sparkles,
  Copy,
  Check,
  Download,
  Share2,
  Layers,
  Users,
  Calendar,
  SplitSquareVertical
} from 'lucide-react';

export const MarketingView: React.FC = () => {
  const [platform, setPlatform] = useState<string>('LinkedIn');
  const [contentType, setContentType] = useState<string>('Post');
  const [goal, setGoal] = useState<string>('High-Intent Lead Generation');
  const [audience, setAudience] = useState<string>('Tech Founders & CXOs in Mumbai/Pune');
  const [offer, setOffer] = useState<string>('10:90 Payment Subvention + 82% Usable Carpet Area Guarantee');
  const [tone, setTone] = useState<string>('Executive & Credible');
  const [cta, setCta] = useState<string>('Schedule Private Site Tour');

  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const platforms = ['LinkedIn', 'Instagram', 'Email', 'Website', 'WhatsApp', 'Blog'];
  const contentTypes = ['Post', 'Campaign Ad', 'Newsletter', 'Landing Page Hero', 'WhatsApp Broadcast', 'Short Copy'];
  const audiences = [
    'Tech Founders & CXOs in Mumbai/Pune',
    'First-time Homebuyers & Young IT Couples (Thane)',
    'NRI Investors in Singapore & Dubai (Worli/Bandra)',
    'Senior Doctors & Medical Specialists (Hinjawadi/Pune)',
    'Real Estate Investors seeking 6.2% Assured Yield'
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/marketing-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          contentType,
          goal,
          audience,
          offer,
          tone,
          cta
        })
      });
      const data = await res.json();
      setGeneratedContent(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            Marketing Strategy &amp; Content Engine
          </h2>
          <p className="text-xs text-slate-400">
            Generate omni-channel campaigns, high-converting ad copy, and evidence-grounded copy variants for UrbanNest Properties
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Configuration (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Campaign Parameters
          </h3>

          {/* Platform Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Platform</label>
            <div className="grid grid-cols-3 gap-1.5">
              {platforms.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                    platform === p
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Format</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
            >
              {contentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Persona / ICP</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 cursor-pointer"
            >
              {audiences.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Offer & Value Prop */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Core Hook / Verified Offer</label>
            <input
              type="text"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tone & CTA */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
              >
                <option value="Executive & Credible">Executive &amp; Credible</option>
                <option value="Inspiring & Warm">Inspiring &amp; Warm</option>
                <option value="Analytical & ROI-Driven">Analytical &amp; ROI-Driven</option>
                <option value="Urgent / Limited Release">Urgent &amp; Exclusive</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Primary CTA</label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{loading ? 'Synthesizing Content Variants...' : 'Generate Marketing Copy & Variants'}</span>
          </button>
        </div>

        {/* Right Output: Hook, Narrative, Proof, A/B Variants (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Generated Campaign Collateral</h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-semibold">
                  {platform} &bull; {contentType}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="py-24 text-center text-xs text-slate-400 space-y-2">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Generating hook, body narrative, verified data evidence &amp; A/B variations...</p>
              </div>
            ) : generatedContent ? (
              <div className="space-y-3.5 text-xs">
                {/* Hook */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-300 text-xs uppercase tracking-wider">
                      Hook / Headline
                    </span>
                    <button
                      onClick={() => handleCopy('hook', generatedContent.hook)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {copiedKey === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-white font-bold text-sm leading-snug">{generatedContent.hook}</p>
                </div>

                {/* Main Message */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-indigo-300 text-xs uppercase tracking-wider">
                      Body Narrative
                    </span>
                    <button
                      onClick={() => handleCopy('body', generatedContent.mainMessage)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {copiedKey === 'body' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{generatedContent.mainMessage}</p>
                </div>

                {/* Proof & CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                    <span className="font-bold text-emerald-400 text-[11px] block mb-1">
                      Proof / Evidence Grounding
                    </span>
                    <p className="text-slate-300 text-[11px]">{generatedContent.proofEvidence}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
                    <span className="font-bold text-purple-300 text-[11px] block mb-1">
                      Call To Action (CTA)
                    </span>
                    <p className="text-white font-semibold text-[11px]">{generatedContent.cta}</p>
                  </div>
                </div>

                {/* A/B Test Variants */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-sky-400 text-xs uppercase tracking-wider">
                    <SplitSquareVertical className="w-3.5 h-3.5" />
                    <span>A/B Creative Test Angles</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <strong className="text-slate-200 block mb-1">Angle A (Financial ROI / Subvention):</strong>
                      <p className="text-slate-400">{generatedContent.variantA}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <strong className="text-slate-200 block mb-1">Angle B (Family Space &amp; Carpet Efficiency):</strong>
                      <p className="text-slate-400">{generatedContent.variantB}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-xs text-slate-500 italic">
                Choose platform and target audience parameters on the left, then click &ldquo;Generate Marketing Copy&rdquo;.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
