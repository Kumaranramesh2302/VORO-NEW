import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Building2, Phone, FileText, Lock, Bell, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../context/store';
import { Card, Input, Textarea, Button, Avatar, Alert } from '../components/common';
import { formatRelativeTime, cn } from '../utils/helpers';

// ─── Profile Page ─────────────────────────────────────────────────────────────
export function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { name: user?.name, company: user?.company, phone: user?.phone, bio: user?.bio } });
  const { register: regPass, handleSubmit: handlePass, formState: { errors: passErrors }, reset: resetPass, watch } = useForm();

  useEffect(() => { document.title = 'Profile — VoroWebCreator'; }, []);

  const onProfile = async (data) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      updateUser(data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const onPassword = async (data) => {
    setPassLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      toast.success('Password changed successfully');
      resetPass();
    } catch {
      toast.error('Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Profile Settings</h1>
        <p className="text-[var(--muted)] mt-1">Manage your account information</p>
      </div>

      {/* Avatar */}
      <Card>
        <div className="flex items-center gap-5">
          <Avatar name={user?.name} src={user?.avatarUrl} size="xl" />
          <div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm text-[var(--muted)]">{user?.email}</p>
            <Button variant="secondary" size="sm" className="mt-3">Change Avatar</Button>
          </div>
        </div>
      </Card>

      {/* Profile form */}
      <Card>
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2"><User className="w-4 h-4 text-brand-500" /> Personal Information</h2>
        <form onSubmit={handleSubmit(onProfile)} className="space-y-4">
          <Input
            label="Full name"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name', { required: 'Required', minLength: { value: 2, message: 'Too short' } })}
          />
          <Input
            label="Company"
            leftIcon={<Building2 className="w-4 h-4" />}
            {...register('company')}
          />
          <Input
            label="Phone"
            type="tel"
            leftIcon={<Phone className="w-4 h-4" />}
            {...register('phone')}
          />
          <Textarea
            label="Bio"
            placeholder="Tell us a bit about yourself or your business..."
            {...register('bio')}
          />
          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </Card>

      {/* Password change */}
      <Card>
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2"><Lock className="w-4 h-4 text-brand-500" /> Change Password</h2>
        <form onSubmit={handlePass(onPassword)} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            error={passErrors.current?.message}
            {...regPass('current', { required: 'Required' })}
          />
          <Input
            label="New password"
            type="password"
            error={passErrors.newPass?.message}
            hint="Must contain uppercase, lowercase, and a number"
            {...regPass('newPass', {
              required: 'Required',
              minLength: { value: 8, message: 'Min 8 characters' },
              pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Needs uppercase, lowercase & number' }
            })}
          />
          <Input
            label="Confirm new password"
            type="password"
            error={passErrors.confirm?.message}
            {...regPass('confirm', {
              required: 'Required',
              validate: v => v === watch('newPass') || 'Passwords do not match'
            })}
          />
          <Button type="submit" loading={passLoading} variant="secondary">Update Password</Button>
        </form>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200 dark:border-red-900/30">
        <h2 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">Danger Zone</h2>
        <Alert type="error">
          Deleting your account is permanent and cannot be undone. All projects and data will be lost.
        </Alert>
        <Button variant="danger" size="sm" className="mt-4">Delete Account</Button>
      </Card>
    </div>
  );
}

// ─── Notifications Page ───────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'SUCCESS', title: 'Project Update', message: 'Your project "E-Commerce Platform Redesign" progress has been updated to 65%.', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, type: 'INFO', title: 'New Message', message: 'You have a new message from the Voro Team on your project.', isRead: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, type: 'INFO', title: 'Invoice Sent', message: 'Invoice #INV-2024-001 for $1,299.00 has been sent to your email.', isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 4, type: 'SUCCESS', title: 'Project Completed!', message: '"Company Portfolio Website" has been marked as completed. Please leave a review!', isRead: true, createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: 5, type: 'WARNING', title: 'Payment Reminder', message: 'Invoice #INV-2024-002 is due in 3 days. Please ensure payment is processed.', isRead: true, createdAt: new Date(Date.now() - 345600000).toISOString() },
];

const NOTIF_ICONS = { INFO: Info, SUCCESS: CheckCircle, WARNING: AlertTriangle, ERROR: AlertCircle };
const NOTIF_COLORS = {
  INFO: 'text-blue-500 bg-blue-500/10',
  SUCCESS: 'text-green-500 bg-green-500/10',
  WARNING: 'text-amber-500 bg-amber-500/10',
  ERROR: 'text-red-500 bg-red-500/10',
};

export function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);

  useEffect(() => { document.title = 'Notifications — VoroWebCreator'; }, []);

  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  const remove = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  const unread = notifs.filter(n => !n.isRead).length;

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Notifications</h1>
          <p className="text-[var(--muted)] mt-1">{unread} unread</p>
        </div>
        {unread > 0 && (
          <Button variant="secondary" size="sm" leftIcon={<CheckCheck className="w-4 h-4" />} onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifs.map(n => {
          const Icon = NOTIF_ICONS[n.type] || Info;
          return (
            <div
              key={n.id}
              className={cn(
                'card !p-4 flex items-start gap-4 transition-all',
                !n.isRead && 'border-brand-500/20 bg-brand-500/2'
              )}
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', NOTIF_COLORS[n.type])}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn('text-sm font-semibold', !n.isRead && 'text-brand-500')}>{n.title}</p>
                  <span className="text-xs text-[var(--muted)] whitespace-nowrap">{formatRelativeTime(n.createdAt)}</span>
                </div>
                <p className="text-sm text-[var(--muted)] mt-0.5 leading-relaxed">{n.message}</p>
                {!n.isRead && (
                  <button onClick={() => markRead(n.id)} className="text-xs text-brand-500 mt-2 hover:underline">
                    Mark as read
                  </button>
                )}
              </div>
              <button onClick={() => remove(n.id)} className="text-[var(--muted)] hover:text-red-500 transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {notifs.length === 0 && (
          <div className="text-center py-16 text-[var(--muted)]">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">All caught up!</p>
            <p className="text-sm mt-1">No notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
