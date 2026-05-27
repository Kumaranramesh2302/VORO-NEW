import React, { forwardRef, Fragment } from 'react';
import { cn, getStatusColor, getStatusLabel } from '../../utils/helpers';
import { Loader2, X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// ─── Button ───────────────────────────────────────────────────────────────────
export const Button = forwardRef(({
  children, variant = 'primary', size = 'md', loading, leftIcon, rightIcon, className, ...props
}, ref) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    accent: 'btn-accent',
  };
  const sizes = { sm: 'btn-sm', md: '', lg: 'btn-lg' };
  return (
    <button
      ref={ref}
      className={cn(variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
Button.displayName = 'Button';

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = forwardRef(({ label, error, hint, leftIcon, rightIcon, className, wrapperClass, ...props }, ref) => (
  <div className={cn('w-full', wrapperClass)}>
    {label && <label className="label">{label}</label>}
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">{leftIcon}</div>
      )}
      <input
        ref={ref}
        className={cn('input', leftIcon && 'pl-10', rightIcon && 'pr-10', error && 'input-error', className)}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">{rightIcon}</div>
      )}
    </div>
    {error && <p className="error-text">{error}</p>}
    {hint && !error && <p className="text-xs text-[var(--muted)] mt-1">{hint}</p>}
  </div>
));
Input.displayName = 'Input';

// ─── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = forwardRef(({ label, error, hint, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <textarea
      ref={ref}
      className={cn('input resize-none min-h-[120px]', error && 'input-error', className)}
      {...props}
    />
    {error && <p className="error-text">{error}</p>}
    {hint && !error && <p className="text-xs text-[var(--muted)] mt-1">{hint}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

// ─── Select ───────────────────────────────────────────────────────────────────
export const Select = forwardRef(({ label, error, options = [], className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <select ref={ref} className={cn('input', error && 'input-error', className)} {...props}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="error-text">{error}</p>}
  </div>
));
Select.displayName = 'Select';

// ─── StatusBadge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  return <span className={getStatusColor(status)}>{getStatusLabel(status)}</span>;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ name, src, size = 'md', className }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' };
  const initials = (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  if (src) {
    return <img src={src} alt={name} className={cn('rounded-full object-cover', sizes[size], className)} />;
  }
  return (
    <div className={cn('rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-semibold text-white', sizes[size], className)}>
      {initials}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, hover, glass, className, ...props }) {
  return (
    <div className={cn(hover ? 'card-hover' : glass ? 'card-glass' : 'card', className)} {...props}>
      {children}
    </div>
  );
}

// ─── Progress ─────────────────────────────────────────────────────────────────
export function Progress({ value = 0, className }) {
  return (
    <div className={cn('progress-bar', className)}>
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return <Loader2 className={cn('animate-spin text-brand-500', sizes[size], className)} />;
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg)] z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center animate-pulse">
          <span className="text-white font-display font-bold text-xl">V</span>
        </div>
        <Spinner size="md" />
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative card w-full animate-slide-up', sizes[size])}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-semibold">{title}</h3>
          <button onClick={onClose} className="btn-ghost btn-sm p-2 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-[var(--muted)]" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-[var(--muted)] text-sm max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

// ─── Alert ────────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', title, children, onClose }) {
  const config = {
    info:    { icon: Info, cls: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' },
    success: { icon: CheckCircle, cls: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' },
    warning: { icon: AlertTriangle, cls: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300' },
    error:   { icon: AlertCircle, cls: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300' },
  };
  const { icon: Icon, cls } = config[type];
  return (
    <div className={cn('flex gap-3 p-4 rounded-xl border text-sm', cls)}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-medium mb-1">{title}</p>}
        <div>{children}</div>
      </div>
      {onClose && <button onClick={onClose} className="flex-shrink-0"><X className="w-4 h-4" /></button>}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className, ...props }) {
  return <div className={cn('skeleton', className)} {...props} />;
}

export function SkeletonCard() {
  return (
    <Card>
      <Skeleton className="h-4 w-3/4 mb-3" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-2/3 mb-4" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </Card>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
export function StarRating({ rating, max = 5, size = 'md', onChange }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={cn(sizes[size], i < rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600',
            onChange && 'cursor-pointer hover:text-amber-300 transition-colors')}
          fill="currentColor" viewBox="0 0 20 20"
          onClick={() => onChange?.(i + 1)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
