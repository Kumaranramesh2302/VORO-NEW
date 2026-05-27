import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, MessageSquare, Bell, User, CreditCard, Plus, ChevronLeft, ChevronRight, BarChart3, Users, Package, Briefcase, FileText, Star } from 'lucide-react';
import { useAuthStore, useThemeStore } from '../../context/store';
import { Avatar } from '../common';
import { cn } from '../../utils/helpers';
import Navbar from './Navbar';

const CLIENT_MENU = [
  { icon: LayoutDashboard, label: 'Overview', to: '/dashboard' },
  { icon: FolderKanban, label: 'My Projects', to: '/dashboard/projects' },
  { icon: Plus, label: 'New Project', to: '/dashboard/projects/new' },
  { icon: MessageSquare, label: 'Messages', to: '/dashboard/messages' },
  { icon: CreditCard, label: 'Billing', to: '/dashboard/billing' },
  { icon: Bell, label: 'Notifications', to: '/dashboard/notifications' },
  { icon: User, label: 'Profile', to: '/dashboard/profile' },
];

const ADMIN_MENU = [
  { icon: BarChart3, label: 'Dashboard', to: '/admin' },
  { icon: Users, label: 'Users', to: '/admin/users' },
  { icon: Briefcase, label: 'Projects', to: '/admin/projects' },
  { icon: Package, label: 'Packages', to: '/admin/packages' },
  { icon: Star, label: 'Reviews', to: '/admin/reviews' },
  { icon: FileText, label: 'Messages', to: '/admin/messages' },
  { icon: FolderKanban, label: 'Portfolio', to: '/admin/portfolio' },
];

export default function DashboardLayout({ isAdmin = false }) {
  const location = useLocation();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const menu = isAdmin ? ADMIN_MENU : CLIENT_MENU;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className={cn(
          'fixed left-0 top-16 bottom-0 z-30 flex flex-col bg-[var(--bg)] border-r border-[var(--border)] transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}>
          {/* User info */}
          {!collapsed && (
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <Avatar name={user?.name} src={user?.avatarUrl} size="md" />
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-[var(--muted)] truncate">{user?.company || user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {menu.map(item => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    active
                      ? 'bg-brand-500/10 text-brand-500 dark:text-brand-400'
                      : 'text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)]',
                    collapsed && 'justify-center'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.label === 'Notifications' && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">3</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Collapse toggle */}
          <div className="p-2 border-t border-[var(--border)]">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--muted)] hover:bg-[var(--surface)] transition-all', collapsed && 'justify-center')}
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <><ChevronLeft className="w-5 h-5" /><span>Collapse</span></>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className={cn('flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)]', collapsed ? 'ml-16' : 'ml-64')}>
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
