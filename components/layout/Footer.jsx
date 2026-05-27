import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const LINKS = {
  Company:  [{ label: 'About', to: '/#about' }, { label: 'Portfolio', to: '/portfolio' }, { label: 'Pricing', to: '/pricing' }, { label: 'Contact', to: '/contact' }],
  Services: [{ label: 'Web Design', to: '/' }, { label: 'E-Commerce', to: '/' }, { label: 'SEO', to: '/' }, { label: 'Maintenance', to: '/' }],
  Legal:    [{ label: 'Privacy Policy', to: '/' }, { label: 'Terms of Service', to: '/' }, { label: 'Cookie Policy', to: '/' }],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">V</span>
              </div>
              <span className="font-display font-bold text-xl">VoroWeb<span className="text-brand-500">Creator</span></span>
            </Link>
            <p className="text-[var(--muted)] text-sm leading-relaxed max-w-sm mb-6">
              We craft exceptional digital experiences. From concept to launch, your vision is our mission.
            </p>
            <div className="space-y-2 text-sm text-[var(--muted)]">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-500" /> hello@vorowebcreator.com</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-500" /> +1 (555) 123-4567</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-500" /> San Francisco, CA</div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="font-semibold text-sm mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm text-[var(--muted)] hover:text-brand-500 transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border)] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">© {new Date().getFullYear()} VoroWebCreator. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {[
              { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              { icon: Github, href: 'https://github.com', label: 'GitHub' },
              { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-brand-500 hover:bg-brand-500/10 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
