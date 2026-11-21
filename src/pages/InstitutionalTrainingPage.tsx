import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { INSTITUTIONAL_TRAINING_CONTENT } from '../data/pagesContent';
import { SITE_MEDIA } from '../data/media';
import { apiFetch, ApiError } from '../lib/api';
import { ConfigChecklistBanner } from '../components/ConfigChecklistBanner';

export function InstitutionalTrainingPage() {
  const [organizationName, setOrganizationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sectorType, setSectorType] = useState('Corporate / Private Enterprise');
  const [participantCount, setParticipantCount] = useState('15–30 Participants');
  const [deliveryFormat, setDeliveryFormat] = useState('Live Online Workshops');
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');
  const [objectives, setObjectives] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  function toggleArea(title: string) {
    setAreasOfInterest((prev) =>
      prev.includes(title) ? prev.filter((a) => a !== title) : [...prev, title]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setConfirmation(null);
    setSubmitting(true);
    try {
      const res = await apiFetch<{ message: string }>('/api/institutional-training', {
        method: 'POST',
        body: JSON.stringify({
          organizationName,
          contactName,
          roleTitle,
          email,
          phone,
          sectorType,
          participantCount,
          deliveryFormat,
          areasOfInterest,
          timeline,
          objectives,
          website: honeypot,
        }),
      });
      setConfirmation(res.message);
      setOrganizationName('');
      setContactName('');
      setRoleTitle('');
      setEmail('');
      setPhone('');
      setTimeline('');
      setObjectives('');
      setAreasOfInterest([]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to submit training enquiry.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white text-[#0F172A]">
      {/* Hero Band */}
      <section className="bg-white border-b border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                <Building2 className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                <span>Consultation-Led Custom Training</span>
              </div>
              <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.15]">
                {INSTITUTIONAL_TRAINING_CONTENT.heading}
              </h1>
              <p className="text-[17px] lg:text-[18px] font-medium text-[#334155]">
                {INSTITUTIONAL_TRAINING_CONTENT.subheading}
              </p>
              <p className="text-[15px] text-[#334155] max-w-[68ch] leading-[1.6]">
                {INSTITUTIONAL_TRAINING_CONTENT.intro}
              </p>
              <div className="pt-1">
                <a
                  href="#enquiry-form"
                  className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] transition-colors duration-150"
                >
                  Request a Custom Proposal
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[16/9] w-full rounded-[16px] overflow-hidden border border-[#E3E8EF] bg-[#F7F9FC]">
                <img
                  src={SITE_MEDIA.institutionalWorkshop.src}
                  alt={SITE_MEDIA.institutionalWorkshop.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Areas Band */}
      <section className="bg-[#F7F9FC] border-b border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16 space-y-8">
          <h2 className="text-[22px] lg:text-[32px] font-bold text-[#0F172A]">Core Institutional Training Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INSTITUTIONAL_TRAINING_CONTENT.trainingAreas.map((area) => (
              <div
                key={area.code}
                className="bg-white border border-[#E3E8EF] rounded-[12px] p-6 space-y-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
                  Area {area.code}
                </p>
                <h3 className="text-lg font-bold text-[#0F172A]">{area.title}</h3>
                <p className="text-sm text-[#334155] leading-relaxed">{area.description}</p>
                <ul className="list-disc pl-5 text-xs text-[#334155] space-y-1.5 pt-3 border-t border-[#E3E8EF]">
                  {area.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process + Enquiry Form */}
      <section className="bg-white">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Flat editorial left column (no nested boxes) */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#0F172A]">Delivery Formats</h2>
                <div className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF]">
                  {INSTITUTIONAL_TRAINING_CONTENT.deliveryFormats.map((df) => (
                    <div key={df.format} className="py-4">
                      <p className="font-semibold text-sm text-[#0F172A]">{df.format}</p>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{df.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#E3E8EF]">
                <h2 className="text-xl font-bold text-[#0F172A]">How Consultation Works</h2>
                <div className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF]">
                  {INSTITUTIONAL_TRAINING_CONTENT.processSteps.map((st) => (
                    <div key={st.step} className="py-3.5 flex items-start gap-3">
                      <span className="text-xs font-bold text-[#1D4ED8] pt-0.5 shrink-0">
                        {st.step}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{st.title}</p>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#E3E8EF]">
                <h2 className="text-xl font-bold text-[#0F172A]">Frequently Asked Questions</h2>
                <div className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF]">
                  {INSTITUTIONAL_TRAINING_CONTENT.faqs.map((faq) => (
                    <div key={faq.q} className="py-4">
                      <p className="text-sm font-semibold text-[#0F172A]">{faq.q}</p>
                      <p className="text-xs text-[#334155] mt-1 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Single-level Enquiry Form Card */}
            <div
              id="enquiry-form"
              className="lg:col-span-7 bg-white border border-[#E3E8EF] rounded-[12px] p-6 sm:p-8 space-y-6 scroll-mt-6"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
                  Proposal Request
                </p>
                <h2 className="text-2xl font-bold text-[#0F172A] mt-1">
                  Institutional Training Enquiry Form
                </h2>
                <p className="text-sm text-[#64748B] mt-1">
                  Programme scope, delivery format, and commercial terms are prepared individually after needs assessment.
                </p>
              </div>

              <ConfigChecklistBanner context="enquiry" />

              {confirmation && (
                <div className="p-4 rounded-[8px] bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3 text-sm text-[#14532D]">
                  <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p>{confirmation}</p>
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
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Organisation / Institution Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Role / Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">Sector *</label>
                    <select
                      value={sectorType}
                      onChange={(e) => setSectorType(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    >
                      <option>Corporate / Private Enterprise</option>
                      <option>Government / Public Sector</option>
                      <option>NGO / Development Organisation</option>
                      <option>University / Academic Institution</option>
                      <option>Legal / Judiciary / Regulatory</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Estimated Participants *
                    </label>
                    <select
                      value={participantCount}
                      onChange={(e) => setParticipantCount(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    >
                      <option>Under 15 Participants</option>
                      <option>15–30 Participants</option>
                      <option>31–75 Participants</option>
                      <option>75+ Participants</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">
                      Delivery Format *
                    </label>
                    <select
                      value={deliveryFormat}
                      onChange={(e) => setDeliveryFormat(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    >
                      <option>Live Online Workshops</option>
                      <option>In-Person Institutional Briefings</option>
                      <option>Hybrid Training</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-medium text-[#334155] mb-2">
                    Training Focus Areas
                  </span>
                  <div className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF]">
                    {INSTITUTIONAL_TRAINING_CONTENT.trainingAreas.map((area) => (
                      <label
                        key={area.code}
                        className="flex items-center gap-3 text-xs sm:text-sm text-[#334155] py-2.5 min-h-[44px] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={areasOfInterest.includes(area.title)}
                          onChange={() => toggleArea(area.title)}
                          className="rounded border-[#CBD5E1] text-[#1D4ED8] focus:ring-[#1D4ED8]"
                        />
                        <span>{area.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Preferred Timeline (Optional)
                  </label>
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="e.g. Q2 2026 / Next 6 weeks"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Training Objectives &amp; Learner Context *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    placeholder="Describe your department teams, current digital readiness, and key goals..."
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 rounded-[8px] transition-colors"
                >
                  {submitting ? 'Submitting Enquiry...' : 'Submit Training Enquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
