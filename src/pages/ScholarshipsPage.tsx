import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { COURSES } from '../data/catalogue';
import { SCHOLARSHIP_CONTENT } from '../data/pagesContent';
import { useAuth } from '../context/AuthContext';
import { apiFetch, ApiError } from '../lib/api';

export function ScholarshipsPage() {
  const [searchParams] = useSearchParams();
  const initialCourse = searchParams.get('course') || COURSES[0].code;
  const { user, profile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [educationLevel, setEducationLevel] = useState(profile?.education_level || '');
  const [professionRole, setProfessionRole] = useState(profile?.profession_role || '');
  const [institutionOrg, setInstitutionOrg] = useState(profile?.organization || '');
  const [cityDistrict, setCityDistrict] = useState(profile?.city_district || '');
  const [courseCode, setCourseCode] = useState(
    COURSES.some((c) => c.code === initialCourse.toUpperCase()) ? initialCourse.toUpperCase() : COURSES[0].code
  );
  const [learningMotivation, setLearningMotivation] = useState('');
  const [financialNeed, setFinancialNeed] = useState('');
  const [educationalRelevance, setEducationalRelevance] = useState('');
  const [commitmentStatement, setCommitmentStatement] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch('/api/learner/scholarships', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({
          fullName: fullName || profile?.full_name,
          email: email || user?.email,
          phone,
          educationLevel,
          professionRole,
          institutionOrg,
          cityDistrict,
          courseCode,
          learningMotivation,
          financialNeed,
          educationalRelevance,
          commitmentStatement,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to submit scholarship application.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white text-[#0F172A]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16 space-y-10 lg:space-y-12">
        <section className="border-b border-[#E3E8EF] pb-8 space-y-4">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
            Financial Assistance · Paid Programmes
          </p>
          <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-[#0F172A] tracking-[-0.02em]">
            {SCHOLARSHIP_CONTENT.heading}
          </h1>
          <p className="text-[17px] font-medium text-[#1D4ED8]">{SCHOLARSHIP_CONTENT.subheading}</p>
          <p className="text-[15px] text-[#334155] max-w-[68ch] leading-[1.6]">
            {SCHOLARSHIP_CONTENT.intro}
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Flat editorial left column (no nested boxes) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#0F172A]">Selection Criteria</h2>
              <div className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF]">
                {SCHOLARSHIP_CONTENT.selectionCriteria.map((c) => (
                  <div key={c.title} className="py-4">
                    <p className="text-sm font-semibold text-[#0F172A]">{c.title}</p>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E3E8EF] space-y-2 text-xs text-[#92400E]">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="w-4 h-4 text-[#B45309]" strokeWidth={1.5} />
                <span>Responsible Application Data Handling</span>
              </div>
              <p className="leading-relaxed text-[#334155]">{SCHOLARSHIP_CONTENT.dataProtectionNotice}</p>
            </div>

            <div className="pt-6 border-t border-[#E3E8EF] space-y-2.5 text-xs text-[#334155]">
              <h3 className="font-semibold text-[#0F172A] text-sm">Important Disclosures</h3>
              <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                {SCHOLARSHIP_CONTENT.disclosures.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Single-level Application Form Card */}
          <div className="lg:col-span-7 bg-white border border-[#E3E8EF] rounded-[12px] p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Scholarship Application Form</h2>
              <p className="text-sm text-[#64748B] mt-1">
                Eligible across paid AI Literacy, Applied AI, Professional Development, and Governance courses.
              </p>
            </div>

            {!user ? (
              <div className="py-4 border-y border-[#E3E8EF] space-y-4">
                <p className="text-sm text-[#334155] leading-relaxed">
                  Please sign in to submit a scholarship application so you can track review decisions and fee waivers in your Student Dashboard.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/login?redirect=${encodeURIComponent('/scholarships')}`}
                    className="inline-flex items-center min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px]"
                  >
                    Sign In to Apply
                  </Link>
                  <Link
                    to={`/signup?redirect=${encodeURIComponent('/scholarships')}`}
                    className="inline-flex items-center min-h-[44px] px-5 py-2.5 text-sm font-medium text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F7F9FC] rounded-[8px]"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            ) : submitted ? (
              <div className="space-y-4">
                <div className="p-4 rounded-[8px] bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3 text-sm text-[#14532D]">
                  <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="font-semibold">Scholarship Application Submitted</p>
                    <p className="mt-1">
                      Your application is saved and queued for committee review. Check status and approved waivers inside Dashboard → Scholarships.
                    </p>
                  </div>
                </div>
                <Link
                  to="/dashboard/scholarships"
                  className="inline-flex items-center min-h-[44px] px-4 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] rounded-[8px]"
                >
                  View Application Status
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-[8px] bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-xs text-[#991B1B]">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Eligible Paid Course *
                  </label>
                  <select
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  >
                    {COURSES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.title} (Fee: BDT {c.discountedFeeBdt.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
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
                    <label className="block text-xs font-medium text-[#334155] mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">Location (City / District) *</label>
                    <input
                      type="text"
                      required
                      value={cityDistrict}
                      onChange={(e) => setCityDistrict(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">Education Level *</label>
                    <input
                      type="text"
                      required
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      placeholder="e.g. Undergraduate / Masters"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">Profession / Role *</label>
                    <input
                      type="text"
                      required
                      value={professionRole}
                      onChange={(e) => setProfessionRole(e.target.value)}
                      placeholder="e.g. Student / Analyst"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1">Institution (Optional)</label>
                    <input
                      type="text"
                      value={institutionOrg}
                      onChange={(e) => setInstitutionOrg(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Learning Motivation — Why do you want to participate in this programme? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={learningMotivation}
                    onChange={(e) => setLearningMotivation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Financial Need — Briefly explain fee affordability barriers (do NOT share bank/card/OTP details) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={financialNeed}
                    onChange={(e) => setFinancialNeed(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Educational or Professional Relevance *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={educationalRelevance}
                    onChange={(e) => setEducationalRelevance(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Commitment to Attendance &amp; Assignments *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={commitmentStatement}
                    onChange={(e) => setCommitmentStatement(e.target.value)}
                    placeholder="Confirm your ability to attend live sessions and complete exercises..."
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 rounded-[8px] transition-colors"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Scholarship Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
