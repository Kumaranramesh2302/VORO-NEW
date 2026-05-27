import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Check, ArrowRight, ArrowLeft, Package, FileText, Calendar } from 'lucide-react';
import { MOCK_PACKAGES } from '../utils/mockData';
import { Input, Textarea, Button, Alert } from '../components/common';
import { cn, formatCurrency } from '../utils/helpers';

const STEPS = ['Package', 'Details', 'Review'];

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();

  useEffect(() => { document.title = 'New Project — VoroWebCreator'; }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // In production: await projectApi.create({ ...data, packageId: selectedPkg?.id });
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Project submitted successfully! We\'ll review it shortly.');
      navigate('/dashboard/projects');
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Submit a New Project</h1>
        <p className="text-[var(--muted)]">Tell us about your vision and we'll make it a reality.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={cn(
              'flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-medium transition-all',
              step === i ? 'bg-brand-500 text-white' : step > i ? 'bg-green-500 text-white' : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]'
            )}>
              {step > i ? <Check className="w-4 h-4" /> : <span>{i + 1}</span>}
              {s}
            </div>
            {i < STEPS.length - 1 && <div className={cn('flex-1 h-px transition-colors', step > i ? 'bg-green-500' : 'bg-[var(--border)]')} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 0: Package selection */}
        {step === 0 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-xl font-display font-semibold mb-1 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-500" /> Choose a Package
              </h2>
              <p className="text-sm text-[var(--muted)]">Select the package that best fits your needs. You can also skip this and we'll recommend one after consultation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_PACKAGES.map(pkg => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPkg(pkg)}
                  className={cn(
                    'card text-left transition-all hover:-translate-y-1',
                    selectedPkg?.id === pkg.id
                      ? 'border-brand-500 bg-brand-500/5 shadow-lg shadow-brand-500/15'
                      : 'hover:border-brand-500/30 hover:shadow-lg'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{pkg.name}</h3>
                      {pkg.isFeatured && <span className="tag text-xs mt-1">Popular</span>}
                    </div>
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
                      selectedPkg?.id === pkg.id ? 'border-brand-500 bg-brand-500' : 'border-[var(--border)]'
                    )}>
                      {selectedPkg?.id === pkg.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <p className="text-2xl font-display font-bold mb-3">${pkg.price.toLocaleString()}</p>
                  <ul className="space-y-1.5 text-xs text-[var(--muted)]">
                    {pkg.features.slice(0, 4).map(f => (
                      <li key={f} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-accent flex-shrink-0" /> {f}
                      </li>
                    ))}
                    {pkg.features.length > 4 && <li className="text-brand-500">+{pkg.features.length - 4} more features</li>}
                  </ul>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => { setSelectedPkg(null); setStep(1); }}
              className="text-sm text-[var(--muted)] hover:text-[var(--fg)] underline underline-offset-2"
            >
              Skip package selection — I'll discuss during consultation
            </button>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={() => setStep(1)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Project details */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-xl font-display font-semibold mb-1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-500" /> Project Details
              </h2>
              <p className="text-sm text-[var(--muted)]">The more detail you provide, the better we can plan your project.</p>
            </div>

            {selectedPkg && (
              <Alert type="info">
                Selected package: <strong>{selectedPkg.name}</strong> — ${selectedPkg.price.toLocaleString()} · {selectedPkg.deliveryDays} day delivery
              </Alert>
            )}

            <Input
              label="Project Title *"
              placeholder="e.g. E-Commerce Website for My Clothing Brand"
              error={errors.title?.message}
              {...register('title', { required: 'Project title is required', minLength: { value: 5, message: 'Title too short' } })}
            />

            <Textarea
              label="Project Description *"
              placeholder="Describe what you want to build. What's the purpose? Who is your target audience?"
              className="min-h-[130px]"
              error={errors.description?.message}
              {...register('description', { required: 'Description is required', minLength: { value: 30, message: 'Please provide at least 30 characters' } })}
            />

            <Textarea
              label="Technical Requirements (optional)"
              placeholder="Any specific technologies, integrations, or features you need? e.g. Shopify integration, specific payment gateways, multilingual support..."
              className="min-h-[100px]"
              {...register('requirements')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Budget (USD)"
                type="number"
                placeholder="e.g. 1500"
                hint="Leave blank to use package price"
                {...register('budget', { min: { value: 100, message: 'Minimum $100' } })}
              />
              <Input
                label="Desired Deadline"
                type="date"
                hint="Realistic timeline helps us plan"
                {...register('deadline')}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(0)} leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
              <Button type="button" onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />}>Review & Submit</Button>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-xl font-display font-semibold mb-1 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-500" /> Review Your Request
              </h2>
              <p className="text-sm text-[var(--muted)]">Check all details before submitting.</p>
            </div>

            <div className="card space-y-4">
              <ReviewRow label="Package" value={selectedPkg ? `${selectedPkg.name} — $${selectedPkg.price.toLocaleString()}` : 'No package selected'} />
              <ReviewRow label="Title" value={getValues('title')} />
              <ReviewRow label="Description" value={getValues('description')} multiline />
              <ReviewRow label="Requirements" value={getValues('requirements') || '—'} multiline />
              <ReviewRow label="Budget" value={getValues('budget') ? `$${Number(getValues('budget')).toLocaleString()}` : selectedPkg ? `$${selectedPkg.price.toLocaleString()} (package price)` : '—'} />
              <ReviewRow label="Deadline" value={getValues('deadline') || '—'} />
            </div>

            <Alert type="info">
              After submission, our team will review your request within 24 hours and reach out via your registered email to discuss next steps.
            </Alert>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
              <Button type="submit" loading={loading} leftIcon={<Check className="w-4 h-4" />}>Submit Project Request</Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function ReviewRow({ label, value, multiline }) {
  return (
    <div className={cn('flex gap-4', multiline ? 'flex-col' : 'items-start justify-between')}>
      <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide min-w-[120px]">{label}</span>
      <span className={cn('text-sm', multiline ? 'whitespace-pre-wrap' : 'text-right')}>{value}</span>
    </div>
  );
}
