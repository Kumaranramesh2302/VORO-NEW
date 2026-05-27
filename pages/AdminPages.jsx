import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, UserCheck, UserX, Mail, Building2, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, Avatar, Button, Input, Select, StatusBadge, Modal, Alert } from '../components/common';
import { MOCK_PROJECTS } from '../utils/mockData';
import { formatDate, formatCurrency, cn } from '../utils/helpers';

const MOCK_USERS = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@techcorp.com', company: 'TechCorp Inc', role: 'CLIENT', isActive: true, projects: 2, createdAt: '2024-11-01' },
  { id: 2, name: 'Marcus Williams', email: 'marcus@brandstudio.io', company: 'Brand Studio', role: 'CLIENT', isActive: true, projects: 1, createdAt: '2024-10-25' },
  { id: 3, name: 'Priya Patel', email: 'priya@startupx.com', company: 'StartupX', role: 'CLIENT', isActive: false, projects: 3, createdAt: '2024-10-18' },
  { id: 4, name: 'James Chen', email: 'james@retailers.com', company: 'Chen Retailers', role: 'CLIENT', isActive: true, projects: 1, createdAt: '2024-10-05' },
  { id: 5, name: 'Voro Admin', email: 'admin@vorowebcreator.com', company: '—', role: 'ADMIN', isActive: true, projects: 0, createdAt: '2024-01-01' },
];

// ─── Admin Users Page ─────────────────────────────────────────────────────────
export function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { document.title = 'Users — Admin'; }, []);

  const filtered = users.filter(u =>
    (roleFilter === '' || u.role === roleFilter) &&
    (search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    const user = users.find(u => u.id === id);
    toast.success(`${user.name} has been ${user.isActive ? 'deactivated' : 'activated'}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Users</h1>
        <p className="text-[var(--muted)] mt-1">{users.length} registered users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search users..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          wrapperClass="flex-1"
        />
        <Select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          options={[{ value: '', label: 'All roles' }, { value: 'CLIENT', label: 'Client' }, { value: 'ADMIN', label: 'Admin' }]}
          className="sm:w-40"
        />
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Company</th>
              <th>Role</th>
              <th>Projects</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} size="sm" />
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-[var(--muted)]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="text-sm text-[var(--muted)]">{user.company}</td>
                <td>
                  <span className={cn('badge', user.role === 'ADMIN' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400')}>
                    {user.role}
                  </span>
                </td>
                <td className="text-sm">{user.projects}</td>
                <td>
                  <span className={cn('badge', user.isActive ? 'badge-completed' : 'badge-cancelled')}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="text-sm text-[var(--muted)]">{formatDate(user.createdAt)}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={cn('btn btn-sm', user.isActive ? 'btn-danger' : 'btn-secondary')}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {user.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                    <a href={`mailto:${user.email}`} className="btn btn-sm btn-secondary">
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Admin Projects Page ──────────────────────────────────────────────────────
export function AdminProjectsPage() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editProject, setEditProject] = useState(null);

  useEffect(() => { document.title = 'Projects — Admin'; }, []);

  const filtered = projects.filter(p =>
    (statusFilter === '' || p.status === statusFilter) &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id, status) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    setEditProject(null);
    toast.success('Project status updated');
  };

  const updateProgress = (id, progress) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, progress: parseInt(progress) } : p));
    toast.success('Progress updated');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">All Projects</h1>
        <p className="text-[var(--muted)] mt-1">{projects.length} total projects</p>
      </div>

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

      <div className="space-y-4">
        {filtered.map(project => (
          <Card key={project.id} className="!p-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  <StatusBadge status={project.status} />
                  <span className={cn('text-xs font-medium', project.priority === 'URGENT' ? 'text-red-500' : project.priority === 'HIGH' ? 'text-orange-500' : 'text-[var(--muted)]')}>
                    {project.priority}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-[var(--muted)] mb-3">
                  {project.budget && <span>💰 {formatCurrency(project.budget)}</span>}
                  {project.deadline && <span>📅 {formatDate(project.deadline)}</span>}
                  <span>📦 {project.packageItem?.name || 'No package'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 max-w-xs">
                    <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                      <span>Progress</span><span>{project.progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0" max="100"
                      value={project.progress}
                      onChange={e => updateProgress(project.id, e.target.value)}
                      className="w-full accent-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Select
                  value={project.status}
                  onChange={e => updateStatus(project.id, e.target.value)}
                  options={[
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'IN_REVIEW', label: 'In Review' },
                    { value: 'IN_PROGRESS', label: 'In Progress' },
                    { value: 'REVIEW', label: 'Under Review' },
                    { value: 'COMPLETED', label: 'Completed' },
                    { value: 'CANCELLED', label: 'Cancelled' },
                  ]}
                  className="w-40"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
