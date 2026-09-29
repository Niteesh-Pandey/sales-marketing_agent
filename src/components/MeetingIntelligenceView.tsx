import React, { useState } from 'react';
import {
  Headphones,
  Sparkles,
  Copy,
  Check,
  Calendar,
  AlertTriangle,
  UserCheck,
  Target,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { MeetingAnalysis } from '../types';

interface MeetingIntelligenceViewProps {
  onCreateTaskFromMeeting: (title: string, desc: string, dueDate: string) => void;
}

export const MeetingIntelligenceView: React.FC<MeetingIntelligenceViewProps> = ({
  onCreateTaskFromMeeting
}) => {
  const SAMPLE_TRANSCRIPT_1 = `Call Transcript - Vikram Malhotra (CTO Fintech Solutions) with Niteesh Pandey
Date: September 28, 2026
Location: Worli Sales Suite & Phone Follow-up

Niteesh: "Good afternoon Vikram. Thank you for visiting the Worli site this past Saturday with your architect. How did the 4 BHK layout review go?"
Vikram: "Hi Niteesh. The layout is genuinely impressive, especially the 11-foot clear ceiling height and unobstructed sea view from the master bedroom. My architect was particularly pleased with the structural column placement which allows us to merge the study into an open lounge."
Niteesh: "That's fantastic. We can certainly accommodate that non-load-bearing wall modification."
Vikram: "Here is where we stand: We have already secured an in-principle home loan sanction from HDFC Bank for ₹1.8 Crore against our budget of ₹2.2 Crore. However, my wife and I have two concerns. First, the competitor project by Lodha nearby is throwing in two automated basement parking slots at no extra charge, whereas your proposal only allocates one standard slot. Second, we want to know if the 10:90 subvention scheme applies to this specific 14th floor unit."
Niteesh: "Understood on both counts. For the parking, since you are looking at the 4 BHK luxury suite, I will speak with our project director today to seek approval for allocating tandem covered parking. Regarding the 10:90 milestone, because your credit score is pre-approved through HDFC, Flat 1402 qualifies under our subvention scheme."
Vikram: "If you can confirm the two parking slots in writing and send the revised payment milestone breakdown by tomorrow evening, I am prepared to sign the booking application and release the ₹10 Lakh token cheque before this Friday."
Niteesh: "I commit to having the revised allotment letter and parking addendum on your desk by 4:00 PM tomorrow, Tuesday. Let's schedule a brief follow-up call on Wednesday morning at 11:00 AM."
Vikram: "Agreed. Send it across to my corporate email."`;

  const SAMPLE_TRANSCRIPT_2 = `Call Notes - Dr. Pooja Deshmukh (Apollo Clinic Network) with Niteesh Pandey
Subject: Discussion on Hinjawadi & Kharadi Investor Units (2 Suites)

Dr. Pooja joined the video conference from Pune. She is evaluating passive investment opportunities to deploy ₹1.5 Crore.
Main objective: Stable rental income without active property management hassles.
She reviewed our 6.2% gross assured rental yield documentation. She raised a valid question: "What happens after the initial 3-year guarantee expires? Does UrbanNest continue managing corporate leasing or is the owner left to find individual tenants?"
Niteesh explained the long-term corporate lease tie-up with IT multinationals in EON Free Zone Kharadi, which guarantees renewal priority.
Dr. Pooja also mentioned comparing this with a commercial retail shop in Baner, but is worried about liquidity and higher maintenance.
Commitments made: Niteesh to send tenant occupancy audit report and sample 3-party lease agreement by Wednesday.
Recommended next step: Coordinate with Dr. Pooja's chartered accountant on depreciation benefits.`;

  const [inputText, setInputText] = useState<string>(SAMPLE_TRANSCRIPT_1);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  const [taskCreated, setTaskCreated] = useState(false);

  const handleExtract = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setTaskCreated(false);
    try {
      const res = await fetch('/api/gemini/analyze-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: inputText })
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    if (!analysis) return;
    const taskTitle = analysis.next_steps[0] || 'Follow up with meeting commitments';
    const taskDesc = `Auto-generated from meeting with ${analysis.participants.join(', ')}. Need: ${analysis.customer_need}`;
    const dueDate = analysis.follow_up_date || new Date().toISOString().slice(0, 10);
    onCreateTaskFromMeeting(taskTitle, taskDesc, dueDate);
    setTaskCreated(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-indigo-400" />
            Meeting Intelligence &amp; CRM Extraction
          </h2>
          <p className="text-xs text-slate-400">
            Paste sales call transcripts, site walkthrough notes, or meeting audio records to extract CRM intelligence
          </p>
        </div>

        {/* Demo Samples */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Demo Transcripts:</span>
          <button
            onClick={() => setInputText(SAMPLE_TRANSCRIPT_1)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
          >
            Vikram (Worli 4BHK)
          </button>
          <button
            onClick={() => setInputText(SAMPLE_TRANSCRIPT_2)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
          >
            Dr. Pooja (Investor Suites)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input: Transcript text (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Meeting Transcript or Notes
          </h3>

          <textarea
            rows={15}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw conversation notes, call transcription text, or meeting minutes..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono leading-relaxed"
          />

          <button
            onClick={handleExtract}
            disabled={loading || !inputText.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{loading ? 'Synthesizing CRM Intelligence...' : 'Extract CRM Intelligence'}</span>
          </button>
        </div>

        {/* Right Output: Structured CRM Intelligence (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Extracted CRM Intelligence</h3>
              </div>

              {analysis && (
                <button
                  onClick={handleCreateTask}
                  disabled={taskCreated}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {taskCreated ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Task Added to CRM</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-3.5 h-3.5" />
                      <span>Create CRM Task</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-28 text-center text-xs text-slate-400 space-y-2">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Extracting participants, pain points, budget, objections &amp; commitments...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-3.5 text-xs">
                {/* Executive Summary */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-indigo-300 text-[11px] uppercase tracking-wider mb-1">
                    Executive CRM Summary
                  </div>
                  <p className="text-slate-200 leading-relaxed">{analysis.summary}</p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Budget</span>
                    <strong className="text-white text-xs">{analysis.budget}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Timeline</span>
                    <strong className="text-amber-400 text-xs">{analysis.timeline}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Follow-up</span>
                    <strong className="text-indigo-300 text-xs">{analysis.follow_up_date}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Attendees</span>
                    <strong className="text-slate-300 text-xs truncate block">{analysis.participants.join(', ')}</strong>
                  </div>
                </div>

                {/* Pain Points & Objections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-rose-400 text-[11px] block mb-1">
                      Customer Pain Points
                    </span>
                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                      {analysis.pain_points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-amber-400 text-[11px] block mb-1">
                      Objections / Hesitations
                    </span>
                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                      {analysis.objections.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Commitments & Next Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                    <span className="font-bold text-emerald-400 text-[11px] block mb-1">
                      Niteesh / Sales Commitments
                    </span>
                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                      {analysis.commitments.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                    <span className="font-bold text-indigo-300 text-[11px] block mb-1">
                      Recommended Next Steps
                    </span>
                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                      {analysis.next_steps.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Risk Factors */}
                {analysis.risk_factors && analysis.risk_factors.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Deal Risks Detected: </span>
                      <span>{analysis.risk_factors.join('; ')}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-28 text-center text-xs text-slate-500 italic">
                Paste meeting transcript or select a demo call on the left, then click &ldquo;Extract CRM Intelligence&rdquo;.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
