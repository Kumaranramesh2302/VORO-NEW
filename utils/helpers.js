import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatDate(dateStr, options = {}) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', ...options,
  });
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getStatusColor(status) {
  const map = {
    PENDING: 'badge-pending',
    IN_REVIEW: 'badge-review',
    IN_PROGRESS: 'badge-progress',
    REVIEW: 'badge-review',
    COMPLETED: 'badge-completed',
    CANCELLED: 'badge-cancelled',
  };
  return map[status] || 'badge';
}

export function getStatusLabel(status) {
  const map = {
    PENDING: 'Pending',
    IN_REVIEW: 'In Review',
    IN_PROGRESS: 'In Progress',
    REVIEW: 'Under Review',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };
  return map[status] || status;
}

export function getPriorityColor(priority) {
  const map = {
    LOW: 'text-gray-500',
    MEDIUM: 'text-blue-500',
    HIGH: 'text-orange-500',
    URGENT: 'text-red-500',
  };
  return map[priority] || 'text-gray-500';
}

export function truncate(str, max = 100) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max) + '…';
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function buildQueryString(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

export const PROJECT_STATUSES = ['PENDING', 'IN_REVIEW', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED'];
export const PORTFOLIO_CATEGORIES = ['All', 'E-Commerce', 'Web App', 'Business Website', 'Landing Page', 'Platform'];
export const TEMPLATE_CATEGORIES = ['All', 'SaaS', 'E-Commerce', 'Portfolio', 'Restaurant', 'Healthcare', 'Agency'];
