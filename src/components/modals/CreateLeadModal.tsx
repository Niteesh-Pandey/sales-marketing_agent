import React, { useState } from 'react';
import { X, Plus, Sparkles, Building, User, Mail, Phone, DollarSign, MapPin } from 'lucide-react';
import { Lead, LeadStage, LeadStatus } from '../../types';
import { calculateDeterministicLeadScore } from '../../services/scoring';

interface CreateLeadModalProps {
  onClose: () => void;
  onCreateLead: (newLead: Partial<Lead>) => void;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  onClose,
  onCreateLead
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState<'Mumbai' | 'Thane' | 'Pune'>('Mumbai');
  const [productInterest, setProductInterest] = useState('UrbanNest Prime Residences');
  const [budget, setBudget] = useState(15000000);
  const [source, setSource] = useState('Website');
  const [stage, setStage] = useState<LeadStage>('NEW');
  const [status, setStatus] = useState<LeadStatus>('ACTIVE');
  const [notes, setNotes] = useState('');

  // Live scoring preview
  const liveScore = calculateDeterministicLeadScore({
    budget,
    product_interest: productInterest,
    city,
    job_title: jobTitle,
    notes,
    stage
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onCreateLead({
      name,
      email,
      phone,
      company: company || 'Private Individual',
      job_title: jobTitle || 'Professional',
      city,
      product_interest: productInterest,
      budget: Number(budget),
      source,
      stage,
      status,
      notes: notes || 'New inquiry logged via Command Center.',
      last_contact_date: new Date().toISOString().slice(0, 10),
      next_followup_date: new Date().toISOString().slice(0, 10)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Create New Lead Profile</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Live Score Preview Banner */}
          <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="font-semibold text-slate-300">Live Deterministic Score:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                {liveScore.lead_score}/100 ({liveScore.ai_priority} Priority)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Singhal"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">City Market</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Thane">Thane</option>
                <option value="Pune">Pune</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Infosys / Self-employed"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Job Title / Role</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Director of Engineering"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Product Line</label>
              <select
                value={productInterest}
                onChange={(e) => setProductInterest(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
              >
                <option value="UrbanNest Prime Residences">UrbanNest Prime Residences (₹1.2Cr–₹2.5Cr)</option>
                <option value="UrbanNest Select Homes">UrbanNest Select Homes (₹75L–₹1.35Cr)</option>
                <option value="UrbanNest Investor Units">UrbanNest Investor Units (₹90L–₹1.8Cr)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Budget (₹ INR)</label>
              <input
                type="number"
                step="500000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Notes &amp; Purchasing Urgency</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Looking for ready possession in 60 days, pre-approved loan from HDFC..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
