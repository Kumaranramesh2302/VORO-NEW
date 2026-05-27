import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Zap, Shield, Palette, Code2, BarChart, Globe, ChevronRight, Play } from 'lucide-react';
import { MOCK_REVIEWS, MOCK_PORTFOLIO } from '../utils/mockData';
import { StarRating } from '../components/common';

const STATS = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '5★', label: 'Average Rating' },
  { value: '4yr', label: 'In Business' },
];

const SERVICES = [
  { icon: Palette, title: 'UI/UX Design', desc: 'Beautiful, intuitive interfaces crafted with precision and purpose.', color: 'from-purple-500 to-pink-500' },
  { icon: Code2, title: 'Web Development', desc: 'Full-stack solutions built with modern, scalable technologies.', color: 'from-brand-500 to-cyan-500' },
  { icon: Globe, title: 'E-Commerce', desc: 'Complete online stores that convert visitors into customers.', color: 'from-green-500 to-emerald-500' },
  { icon: BarChart, title: 'SEO & Analytics', desc: 'Data-driven strategies to grow your organic presence.', color: 'from-orange-500 to-amber-500' },
  { icon: Zap, title: 'Performance', desc: 'Lightning-fast sites optimized for Core Web Vitals.', color: 'from-yellow-500 to-orange-500' },
  { icon: Shield, title: 'Maintenance', desc: 'Ongoing support to keep your site secure and up-to-date.', color: 'from-indigo-500 to-brand-500' },
];

const PROCESS = [
  { step: '01', title: 'Discovery', desc: 'We deep-dive into your goals, audience, and competition to build the perfect strategy.' },
  { step: '02', title: 'Design', desc: 'Wireframes and high-fidelity mockups crafted until you love every pixel.' },
  { step: '03', title: 'Build', desc: 'Clean, performant code with regular updates and your feedback at every stage.' },
  { step: '04', title: 'Launch', desc: 'Rigorous QA, deployment, and post-launch support to ensure a flawless go-live.' },
];

export default function HomePage() {
  const heroRef = useRef(null);

  useEffect(() => {
    document.title = 'VoroWebCreator — World-Class Web Development';
    // AOS-like scroll animation
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.aos').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-grid opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5" />
            <span>Now accepting new projects for Q1 2025</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold tracking-tight leading-[0.95] mb-8 animate-slide-up">
            We Build
            <span className="block gradient-text">Websites That</span>
            <span className="block">Convert</span>
          </h1>

          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Custom web development for ambitious brands. From startups to enterprises — we deliver exceptional digital experiences that drive real results.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/dashboard/projects/new" className="btn btn-primary btn-lg">
              Start a Project <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/portfolio" className="btn btn-secondary btn-lg">
              <Play className="w-4 h-4" /> View Our Work
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-display font-bold gradient-text">{s.value}</div>
                <div className="text-sm text-[var(--muted)] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--muted)] animate-float">
          <span className="text-xs">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[var(--muted)] to-transparent" />
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────── */}
      <section className="section bg-[var(--surface)]">
        <div className="container">
          <div className="text-center mb-16 aos">
            <span className="tag mb-4">What We Do</span>
            <h2 className="section-title">Services Built for Growth</h2>
            <p className="section-sub mx-auto">
              Everything you need to establish and scale your digital presence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <div key={s.title} className="card group hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300 aos" style={{ transitionDelay: `${i * 0.05}s` }}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio preview ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 aos">
            <div>
              <span className="tag mb-3">Recent Work</span>
              <h2 className="section-title">Featured Projects</h2>
            </div>
            <Link to="/portfolio" className="btn btn-secondary mt-4 sm:mt-0">
              View All Work <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PORTFOLIO.filter(p => p.isFeatured).map((item, i) => (
              <Link key={item.id} to={`/portfolio/${item.slug}`} className="group card p-0 overflow-hidden hover:shadow-2xl hover:shadow-brand-500/15 hover:-translate-y-2 transition-all duration-300 aos" style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="tag text-xs mb-2">{item.category}</span>
                  <h3 className="font-display font-semibold mt-2 group-hover:text-brand-500 transition-colors">{item.title}</h3>
                  <p className="text-sm text-[var(--muted)] mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.techStack.slice(0, 3).map(t => <span key={t} className="tag text-xs">{t}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────── */}
      <section className="section bg-[var(--surface)]">
        <div className="container">
          <div className="text-center mb-16 aos">
            <span className="tag mb-4">How We Work</span>
            <h2 className="section-title">Our Process</h2>
            <p className="section-sub mx-auto">Transparent. Collaborative. Proven.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <div key={p.step} className="relative aos" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="text-7xl font-display font-bold text-[var(--border)] mb-4 leading-none">{p.step}</div>
                <h3 className="font-display font-semibold text-xl mb-3">{p.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{p.desc}</p>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-10 right-0 w-8 h-px bg-[var(--border)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16 aos">
            <span className="tag mb-4">Testimonials</span>
            <h2 className="section-title">What Clients Say</h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <StarRating rating={5} size="md" />
              <span className="text-[var(--muted)] text-sm">4.9/5 from 50+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_REVIEWS.map((r, i) => (
              <div key={r.id} className="card aos" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="flex items-start gap-4 mb-4">
                  <img src={r.client.avatar} alt={r.client.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">{r.client.name}</p>
                    <p className="text-xs text-[var(--muted)]">{r.client.company}</p>
                    <StarRating rating={r.rating} size="sm" />
                  </div>
                  <div className="ml-auto">
                    <span className="text-5xl text-brand-500/20 font-display font-bold leading-none">"</span>
                  </div>
                </div>
                <h4 className="font-semibold mb-2">{r.title}</h4>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-12 lg:p-20 text-center text-white aos">
            <div className="absolute inset-0 bg-grid opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                Ready to Build <br /> Something Great?
              </h2>
              <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
                Join 150+ businesses who've transformed their online presence with us. Let's make yours next.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/dashboard/projects/new" className="btn btn-accent btn-lg">
                  Start Your Project <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/contact" className="btn btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  Let's Talk First
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white/60">
                {['No setup fees', 'Fixed pricing', '100% satisfaction', 'Free consultation'].map(item => (
                  <div key={item} className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-accent" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
