import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Users,
  Kanban,
  MailCheck,
  Megaphone,
  BarChart3,
  BookOpen,
  Headphones,
  CalendarCheck,
  Settings,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  leadCount: number;
  taskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  leadCount,
  taskCount,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'Agent' },
    { id: 'leads', label: 'Lead Management', icon: Users, badge: leadCount.toString() },
    { id: 'pipeline', label: 'Visual Pipeline', icon: Kanban, badge: 'Kanban' },
    { id: 'sales-tools', label: 'Sales & Objections', icon: MailCheck, badge: 'Drafts' },
    { id: 'marketing', label: 'Marketing & Copy', icon: Megaphone, badge: 'GenAI' },
    { id: 'analytics', label: 'Analytics & Funnel', icon: BarChart3, badge: '11 KPIs' },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, badge: 'RAG' },
    { id: 'meetings', label: 'Meeting Intel', icon: Headphones, badge: 'Audio/CRM' },
    { id: 'daily-plan', label: 'Day Plan & Tasks', icon: CalendarCheck, badge: taskCount.toString() },
    { id: 'reports-settings', label: 'Reports & Settings', icon: Settings, badge: 'Postgres' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 flex flex-col justify-between shrink-0 select-none min-h-[calc(100vh-61px)]">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Workspaces
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
                active
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    active
                      ? 'bg-indigo-700/60 text-indigo-100 border border-indigo-400/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Info Banner */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-200">Owner Identity</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Active</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Niteesh Pandey
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            Niteesh AI Growth Labs &bull; Mumbai, IN
          </p>
        </div>
      </div>
    </aside>
  );
};
