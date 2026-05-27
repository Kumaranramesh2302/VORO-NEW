import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Lock, Search, Sparkles } from 'lucide-react';
import { MOCK_TEMPLATES } from '../utils/mockData';
import { Input } from '../components/common';
import { cn } from '../utils/helpers';

const TEMPLATE_CATEGORIES = ['All', 'SaaS', 'E-Commerce', 'Portfolio', 'Restaurant', 'Healthcare', 'Agency'];

export default function TemplatesPage() {
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => { document.title = 'Templates — VoroWebCreator'; }, []);

  const filtered = MOCK_TEMPLATES.filter(t =>
    (active === 'All' || t.category === active) &&
    (search === '' || t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="tag mb-4 inline-block">Template Library</span>
          <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6">
            Start with a <span className="gradient-text">Beautiful Template</span>
          </h1>
          <p className="text-[var(--muted)] text-lg mb-8">
            Professional, fully-customizable templates built for your industry. We'll tailor any template to match your brand perfectly.
          </p>
        </div>
      </section>

      <section className="px-4 pb-6 sticky top-16 z-20 bg-[var(--bg)]/90 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  active === cat
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                    : 'bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--fg)] border border-[var(--border)]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search templates..."
              leftIcon={<Search className="w-4 h-4" />}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center card bg-gradient-to-br from-brand-500/5 to-accent/5 border-brand-500/20">
          <Sparkles className="w-10 h-10 text-brand-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-3">Want a Fully Custom Design?</h2>
          <p className="text-[var(--muted)] mb-6">
            None of these fit your vision? We build fully custom designs from scratch — no templates, just pure creativity.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/dashboard/projects/new" className="btn btn-primary">Start Custom Project</Link>
            <Link to="/contact" className="btn btn-secondary">Book Free Consultation</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function TemplateCard({ template, index }) {
  return (
    <div
      className="group card p-0 overflow-hidden hover:shadow-2xl hover:shadow-brand-500/15 hover:-translate-y-2 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)]">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {template.isPremium && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
            <Lock className="w-3 h-3" /> Premium
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          <a href="#" className="btn btn-sm bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm">
            <ExternalLink className="w-3.5 h-3.5" /> Preview
          </a>
          <Link to="/dashboard/projects/new" className="btn btn-sm btn-accent">Use Template</Link>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <span className="tag text-xs">{template.category}</span>
          {template.isPremium && <span className="text-xs text-amber-600 font-medium">Premium</span>}
        </div>
        <h3 className="font-display font-semibold mt-2 group-hover:text-brand-500 transition-colors">{template.name}</h3>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {template.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-[var(--surface)] border border-[var(--border)] text-xs rounded-md text-[var(--muted)]">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
