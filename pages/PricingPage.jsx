import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import { MOCK_PACKAGES } from '../utils/mockData';
import { formatCurrency } from '../utils/helpers';
import { cn } from '../utils/helpers';

const COMPARISON = [
  { feature: 'Responsive Design', starter: true, professional: true, enterprise: true, ecommerce: true },
  { feature: 'Custom Domain Setup', starter: true, professional: true, enterprise: true, ecommerce: true },
  { feature: 'SEO Optimization', starter: 'Basic', professional: 'Advanced', enterprise: 'Full Suite', ecommerce: 'Product SEO' },
  { feature: 'CMS Integration', starter: false, professional: true, enterprise: true, ecommerce: true },
  { feature: 'E-commerce', starter: false, professional: 'Ready', enterprise: true, ecommerce: true },
  { feature: 'Custom Animations', starter: false, professional: true, enterprise: true, ecommerce: false },
  { feature: 'API Integrations', starter: false, professional: false, enterprise: true, ecommerce: 'Payment only' },
  { feature: 'PWA Support', starter: false, professional: false, enterprise: true, ecommerce: false },
  { feature: 'Support Duration', starter: '1 month', professional: '3 months', enterprise: '6 months', ecommerce: '3 months' },
  { feature: 'Source Code', starter: false, professional: false, enterprise: true, ecommerce: false },
];

const FAQS = [
  { q: 'How long does a typical project take?', a: 'Timelines vary by package: Starter (14 days), Professional (21 days), Enterprise (45 days), E-Commerce (30 days). Complex requirements may extend these.' },
  { q: 'What if I need more revisions?', a: 'Additional revisions beyond your package limit are available at $75/hour. We always aim to get it right within the included revisions.' },
  { q: 'Do you offer refunds?', a: 'We offer a full refund if we haven\'t started work. Once development begins, we offer partial refunds based on work completed.' },
  { q: 'Can I upgrade my package mid-project?', a: 'Yes, you can upgrade at any time. The price difference will be invoiced and additional features will be scoped into the remaining timeline.' },
  { q: 'Do you provide hosting?', a: 'We can deploy to your preferred host or recommend reliable options. Hosting costs are separate and managed by you.' },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => { document.title = 'Pricing — VoroWebCreator'; }, []);

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="tag mb-4 inline-block">Simple Pricing</span>
          <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6">
            Transparent Packages, <br />
            <span className="gradient-text">No Surprises</span>
          </h1>
          <p className="text-[var(--muted)] text-lg mb-8">
            Fixed-price packages so you know exactly what you're getting. Every package includes a free consultation.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {MOCK_PACKAGES.map((pkg, i) => (
              <PricingCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-10">Full Feature Comparison</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="min-w-[200px]">Feature</th>
                  {MOCK_PACKAGES.map(p => (
                    <th key={p.id} className={cn('text-center', p.isFeatured && 'text-brand-500')}>
                      {p.name}
                      {p.isFeatured && <span className="ml-1 text-xs">(Popular)</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(row => (
                  <tr key={row.feature}>
                    <td className="font-medium">{row.feature}</td>
                    {[row.starter, row.professional, row.enterprise, row.ecommerce].map((val, i) => (
                      <td key={i} className="text-center">
                        {val === true ? <Check className="w-4 h-4 text-green-500 mx-auto" />
                          : val === false ? <X className="w-4 h-4 text-gray-300 dark:text-gray-600 mx-auto" />
                          : <span className="text-xs text-[var(--muted)]">{val}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="card !p-0 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-sm">{faq.q}</span>
                  <HelpCircle className={cn('w-5 h-5 flex-shrink-0 transition-colors', openFaq === i ? 'text-brand-500' : 'text-[var(--muted)]')} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-[var(--muted)] leading-relaxed border-t border-[var(--border)] pt-4 animate-slide-up">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center card bg-gradient-to-br from-brand-500/5 to-accent/5 border-brand-500/20">
          <Zap className="w-10 h-10 text-brand-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-3">Need Something Custom?</h2>
          <p className="text-[var(--muted)] mb-6">
            Have unique requirements that don't fit our packages? Let's talk about a custom solution tailored just for you.
          </p>
          <Link to="/contact" className="btn btn-primary btn-lg mx-auto">
            Get a Custom Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function PricingCard({ pkg, index }) {
  return (
    <div
      className={cn(
        'relative card flex flex-col hover:-translate-y-2 transition-all duration-300 animate-fade-in',
        pkg.isFeatured
          ? 'border-brand-500 shadow-xl shadow-brand-500/20 bg-gradient-to-b from-brand-500/5 to-transparent'
          : 'hover:shadow-xl'
      )}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {pkg.isFeatured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-500 text-white text-xs font-bold rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-display font-bold text-xl mb-1">{pkg.name}</h3>
        <p className="text-sm text-[var(--muted)]">{pkg.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-display font-bold">${pkg.price.toLocaleString()}</span>
          <span className="text-[var(--muted)] text-sm mb-1">one-time</span>
        </div>
        <div className="flex gap-4 mt-2 text-xs text-[var(--muted)]">
          <span>⏱ {pkg.deliveryDays} day delivery</span>
          <span>✏️ {pkg.revisions} revisions</span>
        </div>
      </div>

      <ul className="space-y-2.5 mb-8 flex-1">
        {pkg.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/dashboard/projects/new"
        className={cn('btn w-full', pkg.isFeatured ? 'btn-primary' : 'btn-secondary')}
      >
        Get Started <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
