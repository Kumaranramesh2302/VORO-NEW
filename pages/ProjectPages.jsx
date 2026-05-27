import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, Search, Filter, MessageSquare, FileUp, CheckSquare, Calendar, DollarSign, Clock, ArrowLeft } from 'lucide-react';
import { MOCK_PROJECTS } from '../utils/mockData';
import { Card, StatusBadge, Progress, Button, Input, EmptyState, Select } from '../components/common';
import { formatDate, formatCurrency, getStatusColor, getPriorityColor, cn } from '../utils/helpers';

// ─── Projects List ────────────────────────────────────────────────────────────
export function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { document.title = 'My Projects — VoroWebCreator'; }, []);

  const filtered = MOCK_PROJECTS.filter(p =>
    (statusFilter === '' || p.status === statusFilter) &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">My Projects</h1>
          <p className="text-[var(--muted)] mt-1">{MOCK_PROJECTS.length} total projects</p>
        </div>
        <Link to="/dashboard/projects/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>New Project</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search projects..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          wrapperClass="flex-1"
        />
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'All statuses' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'IN_REVIEW', label: 'In Review' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'REVIEW', label: 'Under Review' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
          className="sm:w-48"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No projects found"
          description={search ? `No projects matching "${search}"` : 'You haven\'t submitted any projects yet.'}
          action={<Link to="/dashboard/projects/new"><Button leftIcon={<Plus className="w-4 h-4" />}>Submit Your First Project</Button></Link>}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map(project => (
            <Link key={project.id} to={`/dashboard/projects/${project.id}`}>
              <Card hover className="!p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold truncate">{project.title}</h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-[var(--muted)]">
                      {project.packageItem && <span>📦 {project.packageItem.name}</span>}
                      {project.budget && <span>💰 {formatCurrency(project.budget)}</span>}
                      {project.deadline && <span>📅 Due {formatDate(project.deadline)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:min-w-[180px]">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                        <span>Progress</span>
                        <span className="font-medium text-[var(--fg)]">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Project Detail ───────────────────────────────────────────────────────────
export function ProjectDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const project = MOCK_PROJECTS.find(p => p.id === parseInt(id)) || MOCK_PROJECTS[0];

  useEffect(() => { document.title = `${project?.title} — VoroWebCreator`; }, [project]);

  const TABS = ['overview', 'milestones', 'files', 'messages'];

  const MILESTONES = [
    { id: 1, title: 'Initial Design Mockups', completed: true, dueDate: '2024-10-10' },
    { id: 2, title: 'Frontend Development', completed: project.progress > 30, dueDate: '2024-11-01' },
    { id: 3, title: 'Backend Integration', completed: project.progress > 60, dueDate: '2024-11-20' },
    { id: 4, title: 'Testing & QA', completed: project.progress > 80, dueDate: '2024-12-10' },
    { id: 5, title: 'Final Delivery & Launch', completed: project.status === 'COMPLETED', dueDate: project.deadline },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link to="/dashboard/projects" className="btn btn-secondary btn-sm !p-2 mt-1">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl font-display font-bold">{project.title}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-sm text-[var(--muted)]">Submitted {formatDate(project.createdAt)}</p>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: 'Status', value: project.status.replace('_', ' ') },
          { icon: DollarSign, label: 'Budget', value: project.budget ? formatCurrency(project.budget) : '—' },
          { icon: Calendar, label: 'Deadline', value: formatDate(project.deadline) },
          { icon: CheckSquare, label: 'Progress', value: `${project.progress}%` },
        ].map(s => (
          <Card key={s.label} className="!p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <s.icon className="w-4 h-4 text-brand-500" />
              <span className="text-xs text-[var(--muted)]">{s.label}</span>
            </div>
            <p className="font-semibold">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <Card>
        <div className="flex justify-between text-sm mb-3">
          <span className="font-semibold">Overall Progress</span>
          <span className="font-bold text-brand-500">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-3" />
        <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
          <span>Started {formatDate(project.startDate)}</span>
          <span>Est. completion {formatDate(project.deadline)}</span>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-[var(--border)]">
        <div className="flex gap-1 overflow-x-auto pb-px">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-5 py-3 text-sm font-medium capitalize border-b-2 transition-all whitespace-nowrap',
                activeTab === tab
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--fg)]'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{project.description}</p>
          </Card>
          {project.packageItem && (
            <Card>
              <h3 className="font-semibold mb-3">Package</h3>
              <p className="text-sm text-[var(--muted)]">{project.packageItem.name}</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'milestones' && (
        <div className="space-y-3 animate-fade-in">
          {MILESTONES.map((m, i) => (
            <div key={m.id} className={cn('card !p-4 flex items-start gap-4 transition-all', m.completed ? 'opacity-70' : '')}>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold',
                m.completed ? 'bg-green-500 text-white' : 'bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--muted)]'
              )}>
                {m.completed ? <CheckSquare className="w-4 h-4" /> : i + 1}
              </div>
              <div className="flex-1">
                <p className={cn('font-medium text-sm', m.completed && 'line-through text-[var(--muted)]')}>{m.title}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">Due: {formatDate(m.dueDate)}</p>
              </div>
              <span className={cn('badge', m.completed ? 'badge-completed' : 'badge-pending')}>
                {m.completed ? 'Done' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'files' && (
        <div className="animate-fade-in">
          <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-12 text-center hover:border-brand-500/30 transition-colors cursor-pointer">
            <FileUp className="w-10 h-10 text-[var(--muted)] mx-auto mb-3" />
            <p className="font-medium mb-1">Drop files here or click to upload</p>
            <p className="text-sm text-[var(--muted)]">Supports PDF, PNG, JPG, ZIP — max 10MB per file</p>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <ChatPanel projectId={project.id} />
      )}
    </div>
  );
}

// ─── Simple inline chat panel ─────────────────────────────────────────────────
function ChatPanel({ projectId }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'admin', name: 'Voro Team', content: 'Hi! We\'ve received your project request and are reviewing it now. We\'ll have an update within 24 hours.', time: '2 days ago' },
    { id: 2, sender: 'client', name: 'You', content: 'Thanks! I\'ve added some additional requirements to the project description. Please let me know if you need anything else.', time: '1 day ago' },
    { id: 3, sender: 'admin', name: 'Voro Team', content: 'Perfect, we\'ve reviewed your requirements. We\'re starting on the initial design mockups today. You\'ll receive a preview link within 48 hours!', time: '12 hours ago' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: prev.length + 1, sender: 'client', name: 'You', content: input.trim(), time: 'Just now' }]);
    setInput('');
  };

  return (
    <div className="card !p-0 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-[var(--border)] flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-brand-500" />
        <h3 className="font-semibold text-sm">Project Chat</h3>
        <span className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-xs text-green-500">Online</span>
      </div>
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={cn('flex gap-3', m.sender === 'client' && 'flex-row-reverse')}>
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0',
              m.sender === 'admin' ? 'bg-gradient-to-br from-brand-500 to-accent' : 'bg-gradient-to-br from-gray-400 to-gray-600'
            )}>
              {m.name[0]}
            </div>
            <div className={cn('max-w-[75%]', m.sender === 'client' && 'items-end flex flex-col')}>
              <div className={cn('px-4 py-2.5 rounded-2xl text-sm', m.sender === 'admin' ? 'bg-[var(--surface)] rounded-tl-none' : 'bg-brand-500 text-white rounded-tr-none')}>
                {m.content}
              </div>
              <span className="text-xs text-[var(--muted)] mt-1 px-1">{m.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-[var(--border)] flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="input flex-1"
        />
        <Button onClick={send} disabled={!input.trim()}>Send</Button>
      </div>
    </div>
  );
}
