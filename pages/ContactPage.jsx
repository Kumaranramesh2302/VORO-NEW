import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Input, Textarea, Button, Select, Alert } from '../components/common';

const SUBJECTS = [
  { value: '', label: 'Select a subject...' },
  { value: 'New Project', label: 'New Project Inquiry' },
  { value: 'Pricing', label: 'Pricing Question' },
  { value: 'Support', label: 'Technical Support' },
  { value: 'Partnership', label: 'Partnership Opportunity' },
  { value: 'Other', label: 'Other' },
];

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: 'hello@vorowebcreator.com', href: 'mailto:hello@vorowebcreator.com' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, label: 'Location', value: 'San Francisco, CA, USA', href: null },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri, 9am–6pm PST', href: null },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => { document.title = 'Contact — VoroWebCreator'; }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // In production: await contactApi.submit(data);
      await new Promise(r => setTimeout(r, 1200)); // simulate
      setSent(true);
      reset();
      toast.success('Message sent! We\'ll be in touch within 24 hours.');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="tag mb-4 inline-block">Get in Touch</span>
          <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6">
            Let's Start a <span className="gradient-text">Conversation</span>
          </h1>
          <p className="text-[var(--muted)] text-lg">
            Whether you have a project in mind or just want to explore possibilities — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="card">
            {sent ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Message Sent!</h3>
                <p className="text-[var(--muted)] mb-6">We've received your message and will respond within 24 hours.</p>
                <Button variant="secondary" onClick={() => setSent(false)}>Send Another Message</Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-display font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Your name"
                      placeholder="John Doe"
                      error={errors.name?.message}
                      {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
                    />
                    <Input
                      label="Email address"
                      type="email"
                      placeholder="you@example.com"
                      error={errors.email?.message}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                      })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Phone (optional)"
                      type="tel"
                      placeholder="+1 555 000 0000"
                      {...register('phone')}
                    />
                    <Select
                      label="Subject"
                      options={SUBJECTS}
                      error={errors.subject?.message}
                      {...register('subject', { required: 'Please select a subject' })}
                    />
                  </div>

                  <Textarea
                    label="Message"
                    placeholder="Tell us about your project, goals, timeline, and any other details..."
                    className="min-h-[150px]"
                    error={errors.message?.message}
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: 20, message: 'Please provide more detail (at least 20 characters)' },
                    })}
                  />

                  <Button type="submit" loading={loading} className="w-full" size="lg" leftIcon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                </form>
              </>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold mb-2">Contact Information</h2>
              <p className="text-[var(--muted)]">
                We're a remote-first team available across time zones. Reach us through any of the channels below.
              </p>
            </div>

            <div className="space-y-4">
              {CONTACT_INFO.map(item => (
                <div key={item.label} className="card !p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)] mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="font-medium text-sm hover:text-brand-500 transition-colors">{item.value}</a>
                    ) : (
                      <p className="font-medium text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Response time */}
            <Alert type="info" title="Quick Response Guarantee">
              We respond to all inquiries within 24 hours on business days. For urgent matters, call us directly.
            </Alert>

            {/* Social */}
            <div>
              <p className="text-sm font-semibold mb-3">Follow our work</p>
              <div className="flex gap-3">
                {['Twitter', 'LinkedIn', 'Dribbble', 'GitHub'].map(s => (
                  <a key={s} href="#" className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-[var(--muted)] hover:text-brand-500 hover:border-brand-500/30 transition-all">
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
