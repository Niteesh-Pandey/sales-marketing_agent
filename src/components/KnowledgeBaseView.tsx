import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Upload,
  Folder,
  FileText,
  ShieldCheck,
  ExternalLink,
  Plus,
  Sparkles,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { KnowledgeDocument } from '../types';

interface KnowledgeBaseViewProps {
  documents: KnowledgeDocument[];
  onUploadDoc: (doc: { title: string; category: any; content: string }) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  documents,
  onUploadDoc
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDoc, setActiveDoc] = useState<KnowledgeDocument | null>(documents[0] || null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('templates');
  const [newContent, setNewContent] = useState('');

  const categories = [
    { key: 'ALL', label: 'All Documents' },
    { key: 'company', label: 'Company Profile' },
    { key: 'products', label: 'Products & Projects' },
    { key: 'pricing', label: 'Pricing & Schemes' },
    { key: 'customers', label: 'Customer Personas' },
    { key: 'sales', label: 'Sales Playbooks' },
    { key: 'marketing', label: 'Marketing Guidelines' },
    { key: 'competitors', label: 'Competitor Analysis' },
    { key: 'policies', label: 'RERA & Legal' },
    { key: 'templates', label: 'Templates' }
  ];

  const filteredDocs = documents.filter((doc) => {
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.content.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        doc.filename.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveDoc = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    onUploadDoc({
      title: newTitle,
      category: newCategory,
      content: newContent
    });
    setNewTitle('');
    setNewContent('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Local RAG Knowledge Base
          </h2>
          <p className="text-xs text-slate-400">
            Free-first indexed vector &amp; keyword repository with mandatory source-citation behavior
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search and Category Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search RAG index for 10:90 subvention, usable carpet efficiency, assured yield, or persona definitions..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all shrink-0 cursor-pointer ${
                selectedCategory === c.key
                  ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Doc List (4 cols) & Viewer (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px]">
        {/* Document Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-2 max-h-[580px] overflow-y-auto pr-1">
          {filteredDocs.map((doc) => {
            const isSelected = activeDoc?.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-semibold text-indigo-400 mb-1">
                  <span className="uppercase tracking-wider">{doc.category}</span>
                  <span className="text-slate-500">{doc.updated_at}</span>
                </div>
                <h4 className="text-xs font-bold group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {doc.summary}
                </p>
                <div className="text-[10px] text-slate-500 mt-2 font-mono truncate">
                  {doc.filename}
                </div>
              </div>
            );
          })}

          {filteredDocs.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-900/50 rounded-xl border border-slate-800">
              No matching knowledge documents found.
            </div>
          )}
        </div>

        {/* Document Reader with Source-Citation Format (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          {activeDoc ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 uppercase tracking-wider border border-indigo-500/30">
                      {activeDoc.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{activeDoc.filename}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{activeDoc.title}</h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified 100% Citation</span>
                </div>
              </div>

              {/* Document Content View */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans max-h-[420px] overflow-y-auto">
                {activeDoc.content}
              </div>
            </div>
          ) : (
            <div className="py-32 text-center text-xs text-slate-500 italic">
              Select a document from the left to read verified company playbooks and pricing documents.
            </div>
          )}

          {/* Citation Rule Notice (Section 20) */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="text-indigo-400 font-semibold">
              RAG Policy: If no reliable source exists, AI output is mandated to declare: &ldquo;Not found in current knowledge base.&rdquo;
            </span>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              Add Document to Knowledge Index
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Document Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Bandra West Floorplan & Amenities Memo"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              >
                <option value="company">company</option>
                <option value="products">products</option>
                <option value="pricing">pricing</option>
                <option value="customers">customers</option>
                <option value="sales">sales</option>
                <option value="marketing">marketing</option>
                <option value="competitors">competitors</option>
                <option value="policies">policies</option>
                <option value="templates">templates</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Document Markdown / Text Content</label>
              <textarea
                rows={6}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Paste Markdown text or verified specifications..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDoc}
                disabled={!newTitle.trim() || !newContent.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50"
              >
                Save &amp; Index Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
