import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, Building2, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../context/store';
import { Input, Button, Alert } from '../components/common';

// ─── Login ────────────────────────────────────────────────────────────────────
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
  }, [isAuthenticated]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const u = await login(data.email, data.password);
      toast.success(`Welcome back, ${u.name}!`);
      navigate(u.role === 'ADMIN' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account"
      alt={{ text: "Don't have an account?", link: '/signup', label: 'Sign up free' }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && <Alert type="error">{error}</Alert>}

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          })}
        />

        <Input
          label="Password"
          type={showPass ? 'text' : 'password'}
          placeholder="Your password"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-[var(--muted)]">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-brand-500 hover:text-brand-600">Forgot password?</Link>
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Sign In <ArrowRight className="w-4 h-4" />
        </Button>

        <DemoCredentials />
      </form>
    </AuthLayout>
  );
}

// ─── Signup ───────────────────────────────────────────────────────────────────
export function SignupPage() {
  const navigate = useNavigate();
  const { register: authRegister, isAuthenticated } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await authRegister({ name: data.name, email: data.email, password: data.password, company: data.company, phone: data.phone });
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start building your dream website today"
      alt={{ text: 'Already have an account?', link: '/login', label: 'Sign in' }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <Alert type="error">{error}</Alert>}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Full name"
            placeholder="John Doe"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
          />
          <Input
            label="Company (optional)"
            placeholder="ACME Inc"
            leftIcon={<Building2 className="w-4 h-4" />}
            {...register('company')}
          />
        </div>

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          })}
        />

        <Input
          label="Phone (optional)"
          type="tel"
          placeholder="+1 555 000 0000"
          leftIcon={<Phone className="w-4 h-4" />}
          {...register('phone')}
        />

        <Input
          label="Password"
          type={showPass ? 'text' : 'password'}
          placeholder="Min 8 chars, uppercase, number"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={<button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
          error={errors.password?.message}
          hint="Must contain uppercase, lowercase, and a number"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Minimum 8 characters' },
            pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Must include uppercase, lowercase & number' },
          })}
        />

        <p className="text-xs text-[var(--muted)]">
          By signing up you agree to our{' '}
          <Link to="/terms" className="text-brand-500 hover:underline">Terms of Service</Link> and{' '}
          <Link to="/privacy" className="text-brand-500 hover:underline">Privacy Policy</Link>.
        </p>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create Account <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </AuthLayout>
  );
}

// ─── Shared layout ────────────────────────────────────────────────────────────
function AuthLayout({ title, subtitle, alt, children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 items-center justify-center overflow-hidden p-12">
        <div className="absolute inset-0 bg-grid opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-500/30 rounded-full blur-3xl" />
        <div className="relative z-10 text-white max-w-md">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="font-display font-bold text-xl">V</span>
            </div>
            <span className="font-display font-bold text-2xl">VoroWebCreator</span>
          </Link>
          <blockquote className="text-2xl font-display font-medium leading-snug mb-6">
            "Voro transformed our online presence completely. Results in the first month were incredible."
          </blockquote>
          <div className="flex items-center gap-3">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-10 h-10 rounded-full bg-white/10" alt="Sarah" />
            <div>
              <p className="font-semibold text-sm">Sarah Johnson</p>
              <p className="text-white/60 text-xs">CEO, TechCorp Inc</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/10">
            {[['150+', 'Projects'], ['98%', 'Satisfaction'], ['4yr', 'Experience']].map(([v, l]) => (
              <div key={l}><div className="text-2xl font-display font-bold">{v}</div><div className="text-white/60 text-xs mt-1">{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center">
              <span className="text-white font-display font-bold">V</span>
            </div>
            <span className="font-display font-bold text-lg">VoroWebCreator</span>
          </Link>
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold">{title}</h1>
            <p className="text-[var(--muted)] mt-2">{subtitle}</p>
          </div>
          {children}
          <p className="text-center text-sm text-[var(--muted)] mt-6">
            {alt.text}{' '}
            <Link to={alt.link} className="text-brand-500 font-medium hover:text-brand-600">{alt.label}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function DemoCredentials() {
  return (
    <div className="border border-dashed border-[var(--border)] rounded-xl p-4 text-xs text-[var(--muted)] space-y-1.5">
      <p className="font-medium text-[var(--fg)]">Demo credentials</p>
      <p>Client: <code className="bg-[var(--surface)] px-1.5 py-0.5 rounded text-brand-500">sarah@techcorp.com</code> / <code className="bg-[var(--surface)] px-1.5 py-0.5 rounded text-brand-500">Client@123</code></p>
      <p>Admin: <code className="bg-[var(--surface)] px-1.5 py-0.5 rounded text-brand-500">admin@vorowebcreator.com</code> / <code className="bg-[var(--surface)] px-1.5 py-0.5 rounded text-brand-500">Admin@123</code></p>
    </div>
  );
}
