/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AiAssistantView } from './components/AiAssistantView';
import { LeadsView } from './components/LeadsView';
import { PipelineView } from './components/PipelineView';
import { SalesToolsView } from './components/SalesToolsView';
import { MarketingView } from './components/MarketingView';
import { AnalyticsView } from './components/AnalyticsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { MeetingIntelligenceView } from './components/MeetingIntelligenceView';
import { DailyPlanView } from './components/DailyPlanView';
import { ReportsSettingsView } from './components/ReportsSettingsView';
import { LeadDetailModal } from './components/modals/LeadDetailModal';
import { CreateLeadModal } from './components/modals/CreateLeadModal';
import { CsvImportModal } from './components/modals/CsvImportModal';
import { INITIAL_LEADS, INITIAL_CAMPAIGNS, INITIAL_TASKS, INITIAL_KNOWLEDGE_DOCUMENTS, INITIAL_AUDIT_LOGS } from './data/demoData';
import { Lead, Campaign, Task, KnowledgeDocument, AuditLog, LeadStage } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(INITIAL_KNOWLEDGE_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [geminiActive, setGeminiActive] = useState<boolean>(true);
  const [currentModel, setCurrentModel] = useState<string>('gemini-3.8-flash');

  // Modals & Selection
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [salesLeadId, setSalesLeadId] = useState<string | undefined>(undefined);
  const [showCreateLeadModal, setShowCreateLeadModal] = useState<boolean>(false);
  const [showImportCsvModal, setShowImportCsvModal] = useState<boolean>(false);

  // Fetch initial data from Express backend if running
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings?.primary_model) {
          setCurrentModel(data.settings.primary_model);
        }
      })
      .catch(() => {});
    fetch('/api/leads')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.leads) {
          setLeads(data.leads);
        }
      })
      .catch(() => {
        // Fallback to demo data
      });

    fetch('/api/campaigns')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setCampaigns(data);
      })
      .catch(() => {});

    fetch('/api/tasks')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setTasks(data);
      })
      .catch(() => {});

    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setGeminiActive(data.gemini_configured);
      })
      .catch(() => {});
  }, []);

  // Handlers
  const handleUpdateLeadStage = async (leadId: string, newStage: LeadStage) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.lead_id === leadId ? { ...l, stage: newStage } : l))
    );

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads((prev) =>
          prev.map((l) => (l.lead_id === leadId ? updated : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLead = async (updated: Partial<Lead>) => {
    if (!updated.lead_id) return;
    try {
      const res = await fetch(`/api/leads/${updated.lead_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const finalLead = await res.json();
        setLeads((prev) =>
          prev.map((l) => (l.lead_id === updated.lead_id ? finalLead : l))
        );
        setSelectedLead(finalLead);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLead = async (newLeadData: Partial<Lead>) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeadData)
      });
      if (res.ok) {
        const created = await res.json();
        setLeads((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      setLeads((prev) => prev.filter((l) => l.lead_id !== leadId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportLeads = async (importedList: Partial<Lead>[]) => {
    const res = await fetch('/api/leads/bulk-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads: importedList })
    });
    const data = await res.json();
    // Refresh leads list
    const leadsRes = await fetch('/api/leads');
    if (leadsRes.ok) {
      const d = await leadsRes.json();
      setLeads(d.leads);
    }
    return data;
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    setTasks((prev) =>
      prev.map((t) => (t.task_id === taskId ? { ...t, status: newStatus as any } : t))
    );

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (res.ok) {
        const created = await res.json();
        setTasks((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadDoc = async (doc: { title: string; category: any; content: string }) => {
    try {
      const res = await fetch('/api/knowledge/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
      if (res.ok) {
        const created = await res.json();
        setKnowledgeDocs((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDemoData = async () => {
    try {
      const res = await fetch('/api/settings/reset-demo', { method: 'POST' });
      if (res.ok) {
        setLeads([...INITIAL_LEADS]);
        setCampaigns([...INITIAL_CAMPAIGNS]);
        setTasks([...INITIAL_TASKS]);
        setKnowledgeDocs([...INITIAL_KNOWLEDGE_DOCUMENTS]);
        setAuditLogs([...INITIAL_AUDIT_LOGS]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigateToSales = (leadId: string) => {
    setSalesLeadId(leadId);
    setCurrentTab('sales-tools');
  };

  const handleNavigation = (tab: string, meta?: any) => {
    if (meta?.leadId) {
      setSalesLeadId(meta.leadId);
    }
    setCurrentTab(tab);
  };

  const handleModelChange = async (newModel: string) => {
    setCurrentModel(newModel);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primary_model: newModel })
      });
      if (res.ok) {
        // Refresh audit logs
        const auditRes = await fetch('/api/audit-logs');
        if (auditRes.ok) {
          const logs = await auditRes.json();
          if (Array.isArray(logs)) setAuditLogs(logs);
        }
      }
    } catch (err) {
      console.error('Failed to change model:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header */}
      <Header
        onQuickAction={(tab) => setCurrentTab(tab)}
        geminiActive={geminiActive}
        currentModel={currentModel}
        onModelChange={handleModelChange}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (11 modules) */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          leadCount={leads.length}
          taskCount={tasks.filter((t) => t.status !== 'DONE').length}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentTab === 'dashboard' && (
            <DashboardView
              leads={leads}
              campaigns={campaigns}
              onNavigate={handleNavigation}
              onSelectLead={(l) => setSelectedLead(l)}
            />
          )}

          {currentTab === 'ai-assistant' && (
            <AiAssistantView />
          )}

          {currentTab === 'leads' && (
            <LeadsView
              leads={leads}
              onSelectLead={(l) => setSelectedLead(l)}
              onOpenCreateModal={() => setShowCreateLeadModal(true)}
              onOpenImportModal={() => setShowImportCsvModal(true)}
              onNavigateToSales={handleNavigateToSales}
              onUpdateLeadStage={handleUpdateLeadStage}
            />
          )}

          {currentTab === 'pipeline' && (
            <PipelineView
              leads={leads}
              onSelectLead={(l) => setSelectedLead(l)}
              onUpdateLeadStage={handleUpdateLeadStage}
              onNavigateToSales={handleNavigateToSales}
            />
          )}

          {currentTab === 'sales-tools' && (
            <SalesToolsView
              leads={leads}
              preselectedLeadId={salesLeadId}
            />
          )}

          {currentTab === 'marketing' && (
            <MarketingView />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              campaigns={campaigns}
            />
          )}

          {currentTab === 'knowledge' && (
            <KnowledgeBaseView
              documents={knowledgeDocs}
              onUploadDoc={handleUploadDoc}
            />
          )}

          {currentTab === 'meetings' && (
            <MeetingIntelligenceView
              onCreateTaskFromMeeting={(title, desc, dueDate) => {
                handleCreateTask({
                  title,
                  description: desc,
                  due_date: dueDate,
                  priority: 'HIGH',
                  type: 'CALL',
                  status: 'TODO'
                });
              }}
            />
          )}

          {currentTab === 'daily-plan' && (
            <DailyPlanView
              tasks={tasks}
              leads={leads}
              onToggleTaskStatus={handleToggleTaskStatus}
              onCreateTask={handleCreateTask}
              onNavigateToSales={handleNavigateToSales}
            />
          )}

          {currentTab === 'reports-settings' && (
            <ReportsSettingsView
              auditLogs={auditLogs}
              onResetDemoData={handleResetDemoData}
              currentModel={currentModel}
              onModelChange={handleModelChange}
              geminiActive={geminiActive}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateLead={handleUpdateLead}
          onDeleteLead={handleDeleteLead}
          onNavigateToSales={handleNavigateToSales}
        />
      )}

      {showCreateLeadModal && (
        <CreateLeadModal
          onClose={() => setShowCreateLeadModal(false)}
          onCreateLead={handleCreateLead}
        />
      )}

      {showImportCsvModal && (
        <CsvImportModal
          onClose={() => setShowImportCsvModal(false)}
          onImportLeads={handleImportLeads}
        />
      )}
    </div>
  );
}
