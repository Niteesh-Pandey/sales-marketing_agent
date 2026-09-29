import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  HelpCircle,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AiAssistantViewProps {
  onExecuteToolAction?: (action: string, payload: any) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ onExecuteToolAction }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Hello Niteesh. I am your AI Sales & Marketing Command Center Agent for Niteesh AI Growth Labs and UrbanNest Properties.

I have direct access to your 50+ CRM leads in Mumbai, Thane, and Pune, deterministic lead scoring models, 10 active marketing campaigns, RAG knowledge documents, and sales objection frameworks.

How would you like to direct operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptPills = [
    'Which leads should I contact today?',
    'Write a follow-up for Vikram Malhotra',
    'Analyze Q3 Worli campaign performance',
    'Why are conversions falling between Qualified and Meeting?',
    'Prepare today\'s sales plan',
    'Summarize this week\'s pipeline value',
    'Search product pricing and 10:90 scheme',
    'Prepare me for my meeting with Amitabh Joshi'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.slice(-6)
        })
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `Connection error: ${err.message || 'Unable to communicate with Gemini server'}. Please ensure GEMINI_API_KEY is active in your environment.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
      {/* Header with status */}
      <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Niteesh AI Growth Agent
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Grounding Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Free-first local context &bull; Multi-turn reasoning &bull; Zero hallucination discipline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setMessages([
                {
                  id: 'msg-init-reset',
                  role: 'assistant',
                  content: 'Chat context cleared. Ready for your next query, Niteesh.',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ])
            }
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
            title="Reset Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Scenarios:
        </span>
        {promptPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill)}
            className="text-[11px] font-medium px-3 py-1 rounded-full bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700/80 transition-all shrink-0 cursor-pointer"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 border border-slate-700 text-indigo-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-950/80 border border-slate-800/90 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="font-bold text-[11px] opacity-75">
                    {isUser ? 'Niteesh Pandey (Owner)' : 'Niteesh AI Agent'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] opacity-60">{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-white"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* If assistant response mentions actions, show Safety Notice */}
                {!isUser && msg.content.toLowerCase().includes('recommend') && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-amber-300/80">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Free-first safety: AI proposals remain in DRAFT status until explicitly approved.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="rounded-2xl p-4 bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Analyzing CRM leads, campaigns &amp; knowledge base...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Niteesh AI (e.g., 'Which leads should I contact today?', 'Draft an email for Vikram', 'Find funnel bottleneck')..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
