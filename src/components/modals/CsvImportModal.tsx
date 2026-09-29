import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Lead } from '../../types';

interface CsvImportModalProps {
  onClose: () => void;
  onImportLeads: (leads: Partial<Lead>[]) => Promise<{ totalRows: number; validRows: number; duplicateRows: number }>;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  onClose,
  onImportLeads
}) => {
  const SAMPLE_CSV = `name,email,phone,company,city,job_title,product_interest,budget,notes
Sameer Singhania,sameer@singhanias.com,+91 98200 44551,Singhania Fin,Mumbai,Managing Director,UrbanNest Prime Residences,24000000,Looking for Worli 4BHK. Ready token.
Dr. Aarti Kulkarni,dr.aarti@healthcenter.in,+91 98221 88992,Ruby Hall Clinic,Pune,Chief Surgeon,UrbanNest Investor Units,14000000,Interested in 2 investor units in Kharadi.
Karan Malhotra,karan.m@techstart.io,+91 98110 55667,TechStart Labs,Thane,VP Product,UrbanNest Select Homes,11000000,Upgrading from Mulund rental.`;

  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<{ totalRows: number; validRows: number; duplicateRows: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!csvText.trim()) return;
    setParsing(true);
    setError(null);
    setResult(null);

    try {
      const lines = csvText.split('\n').filter(l => l.trim().length > 0);
      if (lines.length < 2) throw new Error('CSV must contain a header row and at least one data row.');

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
      const parsedRows: Partial<Lead>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        const row: any = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx];
        });
        if (row.name && row.email) {
          parsedRows.push({
            name: row.name,
            email: row.email,
            phone: row.phone || '+91 98000 00000',
            company: row.company || 'Private Entity',
            city: row.city || 'Mumbai',
            job_title: row.job_title || 'Professional',
            product_interest: row.product_interest || 'UrbanNest Select Homes',
            budget: Number(row.budget) || 10000000,
            notes: row.notes || 'Imported via CSV batch'
          });
        }
      }

      if (parsedRows.length === 0) {
        throw new Error('No valid lead rows found with name and email.');
      }

      const res = await onImportLeads(parsedRows);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Error parsing CSV');
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Import Leads via CSV (Batch)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Paste CSV rows below or edit the sample data. Automatic deduplication and deterministic scoring will be executed.
        </p>

        <textarea
          rows={9}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono leading-relaxed"
        />

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Import Successful!</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Found: <strong className="text-white">{result.totalRows}</strong> &bull; Imported:{' '}
              <strong className="text-emerald-400">{result.validRows}</strong> &bull; Duplicates Skipped:{' '}
              <strong className="text-amber-400">{result.duplicateRows}</strong>
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            {result ? 'Done' : 'Cancel'}
          </button>
          {!result && (
            <button
              onClick={handleImport}
              disabled={parsing || !csvText.trim()}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>{parsing ? 'Processing...' : 'Run Import & Score'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
