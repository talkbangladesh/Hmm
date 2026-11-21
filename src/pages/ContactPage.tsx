import React, { useState } from 'react';
import { Mail, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { OFFICIAL_CONTACT } from '../data/pagesContent';
import { apiFetch, ApiError } from '../lib/api';
import { ConfigChecklistBanner } from '../components/ConfigChecklistBanner';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const res = await apiFetch<{ message: string }>('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          phone,
          organization,
          subject,
          message,
          website: honeypot,
        }),
      });
      setSuccess(res.message);
      setName('');
      setEmail('');
      setPhone('');
      setOrganization('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to send your message.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white text-[#0F172A]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="space-y-3 border-b border-[#E3E8EF] pb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
            Atlas AI Education
          </p>
          <h1 className="text-3xl sm:text-[40px] font-bold text-[#0F172A] tracking-[-0.02em]">
            Contact Us
          </h1>
          <p className="text-base text-[#334155] max-w-2xl leading-relaxed">
            Reach our academic coordination and support team regarding programmes, admissions, scholarships, certificate verification, or institutional partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 divide-y divide-[#E3E8EF] border-y border-[#E3E8EF]">
            <div className="py-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-[#0F172A] font-semibold">
                <Mail className="w-5 h-5 text-[#1D4ED8]" strokeWidth={1.5} aria-hidden="true" />
                <span>Official Email</span>
              </div>
              <p className="text-sm font-medium text-[#334155]">{OFFICIAL_CONTACT.email}</p>
              <a
                href={`mailto:${OFFICIAL_CONTACT.email}`}
                className="inline-flex items-center min-h-[44px] text-sm font-semibold text-[#1D4ED8] hover:underline"
              >
                Send an Email →
              </a>
            </div>

            <div className="py-6 space-y-3">
              <div className="flex items-center gap-2.5 text-[#0F172A] font-semibold">
                <MessageSquare className="w-5 h-5 text-[#0F766E]" strokeWidth={1.5} aria-hidden="true" />
                <span>WhatsApp Only Support</span>
              </div>
              <p className="text-base font-bold text-[#0F172A]">
                {OFFICIAL_CONTACT.whatsappDisplay}
              </p>
              <p className="text-sm text-[#334155] leading-relaxed">{OFFICIAL_CONTACT.whatsappNotice}</p>
              <a
                href={OFFICIAL_CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-[8px] transition-colors"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#E3E8EF] rounded-[12px] p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-bold text-[#0F172A]">Send an Enquiry</h2>
            <ConfigChecklistBanner context="enquiry" />

            {success && (
              <div className="p-4 rounded-[8px] bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3 text-sm text-[#14532D]">
                <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" strokeWidth={1.5} />
                <p>{success}</p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-[8px] bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-sm text-[#991B1B]">
                <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" strokeWidth={1.5} />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">Phone / WhatsApp (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">Organisation (Optional)</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="min-h-[48px] px-6 py-3 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 rounded-[8px] transition-colors"
              >
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
