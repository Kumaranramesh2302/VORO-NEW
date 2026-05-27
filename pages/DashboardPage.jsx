import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Plus, Clock, CheckCircle, AlertCircle, TrendingUp, ArrowRight, Activity } from 'lucide-react';
import { useAuthStore } from '../context/store';
import { Card, Progress, StatusBadge, Button } from '../components/common';
import { MOCK_PROJECTS, MOCK_PACKAGES } from '../utils/mockData';
import { formatDate, formatCurrency } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CHART_DATA = [
  { month: 'Jul', projects: 1 }, { month: 'Aug', projects: 2 }, { month: 'Sep', projects: 1 },
  { month: 'Oct', projects: 3 }, { month: 'Nov', projects: 2 }, { month: 'Dec', projects: 1 },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  useEffect(() => { document.title = 'Dashboard — VoroWebCreator'; }, []);

  const stats = [
    { icon: FolderKanban, label: 'Total Projects', value: MOCK_PROJECTS.length, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { icon: Activity, label: 'In Progress', value: MOCK_PROJECTS.filter(p => p.status === 'IN_PROGRESS').length, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: CheckCircle, label: 'Completed', value: MOCK_PROJECTS.filter(p => p.status === 'COMPLETED').length, color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: AlertCircle, label: 'Pending', value: MOCK_PROJECTS.filter(p => p.status === 'PENDING').length, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">
            Good morning, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-[var(--muted)] mt-1">Here's what's happening with your projects.</p>
        </div>
        <Link to="/dashboard/projects/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>New Project</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{s.value}</p>
              <p className="text-xs text-[var(--muted)]">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">Recent Projects</h2>
            <Link to="/dashboard/projects" className="text-sm text-brand-500 flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_PROJECTS.map(p => (
              <Link to={`/dashboard/projects/${p.id}`} key={p.id}>
                <Card hover className="!p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-sm">{p.title}</h3>
                      <p className="text-xs text-[var(--muted)] mt-0.5">{p.packageItem?.name} · Due {formatDate(p.deadline)}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[var(--muted)]">
                      <span>Progress</span>
                      <span className="font-medium text-[var(--fg)]">{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-4">
          {/* Activity chart */}
          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" /> Project Activity
            </h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="projects" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Quick actions */}
          <Card>
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Submit new project', icon: Plus, to: '/dashboard/projects/new', color: 'text-brand-500' },
                { label: 'View all projects', icon: FolderKanban, to: '/dashboard/projects', color: 'text-blue-500' },
                { label: 'Check messages', icon: Clock, to: '/dashboard/messages', color: 'text-green-500' },
              ].map(a => (
                <Link key={a.label} to={a.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface)] transition-colors group">
                  <a.icon className={`w-4 h-4 ${a.color}`} />
                  <span className="text-sm">{a.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </Card>

          {/* Recommended package */}
          <Card className="bg-gradient-to-br from-brand-500/5 to-accent/5 border-brand-500/20">
            <div className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-2">Upgrade</div>
            <h3 className="font-semibold mb-2">Professional Package</h3>
            <p className="text-xs text-[var(--muted)] mb-4">Get advanced SEO, CMS, and 5 revisions with faster delivery.</p>
            <div className="text-2xl font-display font-bold mb-4">$1,299</div>
            <Link to="/pricing" className="btn btn-primary w-full text-sm">See Packages</Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
