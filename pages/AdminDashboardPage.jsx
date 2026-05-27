import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FolderKanban, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, UserCheck, MoreVertical } from 'lucide-react';
import { ADMIN_STATS, MOCK_PROJECTS, MOCK_USER } from '../utils/mockData';
import { Card, StatusBadge, Avatar, Progress, Button, Select } from '../components/common';
import { formatDate, formatCurrency, cn } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';

const REVENUE_DATA = [
  { month: 'Jul', revenue: 4200 }, { month: 'Aug', revenue: 6800 }, { month: 'Sep', revenue: 5100 },
  { month: 'Oct', revenue: 8900 }, { month: 'Nov', revenue: 7200 }, { month: 'Dec', revenue: 9400 },
];

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#6366f1', '#a855f7', '#22c55e', '#ef4444'];

export default function AdminDashboardPage() {
  useEffect(() => { document.title = 'Admin Dashboard — VoroWebCreator'; }, []);

  const stats = [
    { icon: Users, label: 'Total Users', value: ADMIN_STATS.totalUsers, sub: `+${ADMIN_STATS.newUsersThisMonth} this month`, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { icon: FolderKanban, label: 'Total Projects', value: ADMIN_STATS.totalProjects, sub: `${ADMIN_STATS.activeProjects} active`, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: DollarSign, label: 'Total Revenue', value: formatCurrency(ADMIN_STATS.totalRevenue), sub: 'All time', color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: AlertCircle, label: 'Pending Review', value: ADMIN_STATS.pendingProjects, sub: 'Needs attention', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-[var(--muted)] mt-1">Overview of your platform's performance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
            <p className="text-2xl font-display font-bold">{s.value}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{s.label}</p>
            <p className="text-xs text-green-500 mt-1">{s.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2">
          <h3 className="font-semibold mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" /> Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_DATA} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v) => [formatCurrency(v), 'Revenue']}
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="revenue" fill="url(#brandGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Project status donut */}
        <Card>
          <h3 className="font-semibold mb-5">Projects by Status</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={ADMIN_STATS.projectsByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
              >
                {ADMIN_STATS.projectsByStatus.map((entry, i) => (
                  <Cell key={entry.status} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {ADMIN_STATS.projectsByStatus.map((d, i) => (
              <div key={d.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-[var(--muted)]">{d.status.replace('_', ' ')}</span>
                </div>
                <span className="font-semibold">{d.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent projects table */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Recent Projects</h3>
            <Link to="/admin/projects" className="text-sm text-brand-500 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {MOCK_PROJECTS.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <FolderKanban className="w-4 h-4 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-[var(--muted)]">{formatDate(p.createdAt)}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent users */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Recent Users</h3>
            <Link to="/admin/users" className="text-sm text-brand-500 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Sarah Johnson', email: 'sarah@techcorp.com', company: 'TechCorp Inc', joined: '2024-11-01', projects: 2 },
              { name: 'Marcus Williams', email: 'marcus@brandstudio.io', company: 'Brand Studio', joined: '2024-10-25', projects: 1 },
              { name: 'Priya Patel', email: 'priya@startupx.com', company: 'StartupX', joined: '2024-10-18', projects: 3 },
              { name: 'James Chen', email: 'james@retailers.com', company: 'Chen Retailers', joined: '2024-10-05', projects: 1 },
            ].map(u => (
              <div key={u.email} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface)] transition-colors">
                <Avatar name={u.name} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.name}</p>
                  <p className="text-xs text-[var(--muted)]">{u.company} · {u.projects} projects</p>
                </div>
                <span className="text-xs text-[var(--muted)]">{formatDate(u.joined)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
