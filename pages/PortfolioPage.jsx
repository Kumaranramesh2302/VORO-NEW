import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Search, Filter } from 'lucide-react';
import { MOCK_PORTFOLIO, PORTFOLIO_CATEGORIES } from '../utils/mockData';
import { Input, Card } from '../components/common';
import { cn, PORTFOLIO_CATEGORIES as CATS } from '../utils/helpers';

const CATEGORIES = ['All', 'E-Commerce', 'Web App', 'Business Website', 'Landing Page', 'Platform'];

export default function PortfolioPage() {
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => { document.title = 'Portfolio — VoroWebCreator'; }, []);

  const filtered = MOCK_PORTFOLIO.filter(p =>
    (active === 'All' || p.category === active) &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="tag mb-4 inline-block">Our Work</span>
          <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6">
            Projects We're <span className="gradient-text">Proud Of</span>
          </h1>
          <p className="text-[var(--muted)] text-lg">
            A selection of websites and web applications we've crafted for ambitious clients worldwide.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 pb-6 sticky top-16 z-20 bg-[var(--bg)]/90 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
            {CATEGORIES.map(cat => (
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
              placeholder="Search projects..."
              leftIcon={<Search className="w-4 h-4" />}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-[var(--muted)]">No projects found for "{search}".</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <PortfolioCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PortfolioCard({ item, index }) {
  return (
    <div
      className="group card p-0 overflow-hidden hover:shadow-2xl hover:shadow-brand-500/15 hover:-translate-y-2 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)]">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.isFeatured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-accent text-white text-xs font-semibold rounded-full">
            Featured
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
          <div className="flex gap-2">
            <a href="#" className="btn btn-sm bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm">
              <ExternalLink className="w-3.5 h-3.5" /> Live
            </a>
            <a href="#" className="btn btn-sm bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm">
              <Github className="w-3.5 h-3.5" /> Code
            </a>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="tag text-xs">{item.category}</span>
          <span className="text-xs text-[var(--muted)]">{item.clientName}</span>
        </div>
        <h3 className="font-display font-semibold text-base mb-2 group-hover:text-brand-500 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-[var(--muted)] line-clamp-2 mb-4">{item.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {item.techStack.map(t => (
            <span key={t} className="px-2 py-0.5 bg-[var(--surface)] border border-[var(--border)] text-xs rounded-md text-[var(--muted)]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
