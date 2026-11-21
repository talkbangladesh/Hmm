import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  GraduationCap,
  Languages,
  ShieldCheck,
  Users,
  Video,
} from 'lucide-react';
import { COURSES, SPECIALIZED_PROGRAMMES, getCourseByParam } from '../data/catalogue';
import { SITE_MEDIA } from '../data/media';
import { PaidCourseCard, SpecializedProgrammeCard } from '../components/CourseCard';

export function HomePage() {
  const featuredCodes = ['AL-101', 'AAI-201', 'PD-303'];
  const featuredCourses = featuredCodes
    .map((code) => getCourseByParam(code))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const foundationCards = ['AG-101', 'AL-101', 'AL-102']
    .map((code) => getCourseByParam(code))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const appliedCards = COURSES.filter((c) => ['AAI-201', 'AAI-202', 'AAI-203'].includes(c.code));
  const professionalCards = COURSES.filter((c) => ['PD-301', 'PD-302', 'PD-303'].includes(c.code));

  function scrollToSpecialized() {
    const el = document.getElementById('specialized-programmes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <main className="bg-white text-[#0F172A]">
      {/* Hero + Stats Strip + 4 Feature Items */}
      <section className="bg-white border-b border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Copy Column */}
            <div className="lg:col-span-6 space-y-5">
              {/* Eyebrow with 24px x 2px gold rule, one line on mobile */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-[2px] bg-[#B8892B] shrink-0" aria-hidden="true" />
                <p className="text-[12px] font-semibold uppercase tracking-[0.03em] sm:tracking-[0.14em] text-[#1D4ED8] whitespace-nowrap">
                  Atlas AI Institute · Education Initiative
                </p>
              </div>

              {/* Three deliberate lines + 48px x 3px blue underline accent */}
              <div className="space-y-4">
                <h1 className="text-[34px] sm:text-[44px] lg:text-[56px] font-bold tracking-[-0.02em] leading-[1.1] text-[#0F172A]">
                  <span className="block">Understand AI.</span>
                  <span className="block">Apply AI.</span>
                  <span className="block text-[#1D4ED8]">Advance Responsibly.</span>
                </h1>
                <div className="w-12 h-[3px] bg-[#1D4ED8]" aria-hidden="true" />
              </div>

              {/* Bangla Tagline */}
              <p className="bangla-text text-[17px] lg:text-[19px] font-medium leading-[1.7] text-[#334155] max-w-[520px]">
                বাংলা ভাষায় কাঠামোবদ্ধ ডিজিটাল লিটারেসি ও AI শিক্ষা — বাংলাদেশ ও এর বাইরের সবার জন্য।
              </p>

              {/* Exactly TWO Hero Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link
                  to="/programmes"
                  className="inline-flex items-center justify-center gap-2 h-12 min-h-[48px] w-full sm:w-auto px-6 text-[15px] font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D4ED8]"
                >
                  View All Programmes
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={scrollToSpecialized}
                  className="inline-flex items-center justify-center h-12 min-h-[48px] w-full sm:w-auto px-6 text-[15px] font-semibold text-[#1D4ED8] bg-white border border-[#1D4ED8] hover:bg-[#EFF6FF] rounded-[8px] transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                >
                  Specialized Programmes
                </button>
              </div>

              {/* Three Trust Lines as Neat Line-Icon Chips */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F9FC] border border-[#E3E8EF] text-xs font-medium text-[#334155]">
                  <Video className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <span>Live Instructor-Led Cohorts</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F9FC] border border-[#E3E8EF] text-xs font-medium text-[#334155]">
                  <Languages className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <span>Bilingual Bangla &amp; English</span>
                </span>
                <Link
                  to="/verify-certificate"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F9FC] border border-[#E3E8EF] hover:border-[#93C5FD] text-xs font-medium text-[#1D4ED8] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <span>Verify Certificate ID</span>
                </Link>
              </div>
            </div>

            {/* Hero Image Card + Stats Strip Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-[16/9] w-full rounded-[12px] overflow-hidden border border-[#E3E8EF] shadow-[0_1px_2px_rgba(16,24,40,0.04)] bg-[#F7F9FC]">
                <img
                  src={SITE_MEDIA.heroLearning.src}
                  alt={SITE_MEDIA.heroLearning.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <dl className="grid grid-cols-3 divide-x divide-[#E3E8EF] bg-white border border-[#E3E8EF] rounded-[12px] shadow-[0_1px_2px_rgba(16,24,40,0.04)] text-left">
                <div className="px-3 py-3 sm:px-4 sm:py-3.5 min-w-0">
                  <dt className="text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] truncate">
                    Programmes
                  </dt>
                  <dd className="text-[13px] sm:text-[15px] font-bold text-[#0F172A] tabular-nums whitespace-nowrap mt-0.5">
                    22 Paid + 6 Free
                  </dd>
                </div>
                <div className="px-3 py-3 sm:px-4 sm:py-3.5 min-w-0">
                  <dt className="text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] truncate">
                    Financial Aid
                  </dt>
                  <dd className="text-[13px] sm:text-[15px] font-bold text-[#1D4ED8] tabular-nums whitespace-nowrap mt-0.5">
                    Up to 50%
                  </dd>
                </div>
                <div className="px-3 py-3 sm:px-4 sm:py-3.5 min-w-0">
                  <dt className="text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] truncate">
                    Delivery
                  </dt>
                  <dd className="text-[13px] sm:text-[15px] font-bold text-[#0F172A] whitespace-nowrap mt-0.5">
                    BN &amp; EN
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Four Feature Items (2x2 on tablet/desktop, stacked on mobile) */}
          <div className="mt-10 pt-8 lg:mt-12 lg:pt-10 border-t border-[#E3E8EF] grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0F172A]">Structured Tracks</h3>
                <p className="text-[13.5px] text-[#334155] mt-1 leading-[1.55]">
                  Foundation, Applied AI, Professional &amp; Governance pathways.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0F172A]">Focused Cohort Sizes</h3>
                <p className="text-[13.5px] text-[#334155] mt-1 leading-[1.55]">
                  Capped live cohorts ensuring guided faculty interaction.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0F172A]">Verifiable Credentials</h3>
                <p className="text-[13.5px] text-[#334155] mt-1 leading-[1.55]">
                  Institutional certificates authenticated via unique ID registry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0F172A]">Responsible AI First</h3>
                <p className="text-[13.5px] text-[#334155] mt-1 leading-[1.55]">
                  Grounded in human oversight, safety, and academic integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-[#F7F9FC] border-b border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 lg:mb-8">
            <div className="space-y-1.5">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                Featured Courses
              </p>
              <h2 className="text-[22px] lg:text-[32px] font-bold text-[#0F172A] tracking-[-0.015em] leading-[1.2]">
                Explore Our Learning Opportunities
              </h2>
            </div>
            <Link
              to="/programmes"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] whitespace-nowrap self-start sm:self-auto transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
            >
              Browse Full Directory
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {featuredCourses.map((course) => (
              <PaidCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Programmes */}
      <section id="specialized-programmes" className="bg-white border-b border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 lg:mb-8">
            <div className="space-y-1.5">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#0F766E]">
                100% Tuition-Free · 1 Month · 4 Live Classes
              </p>
              <h2 className="text-[22px] lg:text-[32px] font-bold text-[#0F172A] tracking-[-0.015em] leading-[1.2]">
                Specialized Foundation Programmes
              </h2>
            </div>
            <Link
              to="/programmes/specialized"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] whitespace-nowrap self-start sm:self-auto transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
            >
              View All 6 Free Programmes
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {SPECIALIZED_PROGRAMMES.map((prog) => (
              <SpecializedProgrammeCard key={prog.id} programme={prog} />
            ))}
          </div>
        </div>
      </section>

      {/* Foundation Programme */}
      <section className="bg-[#F7F9FC] border-b border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 lg:mb-8">
            <div className="space-y-1.5">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                Track 01 · Beginner Friendly
              </p>
              <h2 className="text-[22px] lg:text-[32px] font-bold text-[#0F172A] tracking-[-0.015em] leading-[1.2]">
                Foundation Programme
              </h2>
            </div>
            <Link
              to="/programmes/foundation"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] whitespace-nowrap self-start sm:self-auto transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
            >
              View All Foundation Courses
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {foundationCards.map((course) => (
              <PaidCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Applied AI Programme */}
      <section className="bg-white border-b border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 lg:mb-8">
            <div className="space-y-1.5">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                Track 02 · 2 Months · 14 Sessions
              </p>
              <h2 className="text-[22px] lg:text-[32px] font-bold text-[#0F172A] tracking-[-0.015em] leading-[1.2]">
                Applied AI Programme
              </h2>
            </div>
            <Link
              to="/programmes/applied-ai"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] whitespace-nowrap self-start sm:self-auto transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
            >
              View All Applied AI Courses
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {appliedCards.map((course) => (
              <PaidCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Professional Development Programme */}
      <section className="bg-[#F7F9FC] border-b border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 lg:mb-8">
            <div className="space-y-1.5">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                Track 03 · 2 Months · 18 Sessions
              </p>
              <h2 className="text-[22px] lg:text-[32px] font-bold text-[#0F172A] tracking-[-0.015em] leading-[1.2]">
                Professional Development Programme
              </h2>
            </div>
            <Link
              to="/programmes/professional-development"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] whitespace-nowrap self-start sm:self-auto transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
            >
              View All Professional Courses
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {professionalCards.map((course) => (
              <PaidCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Institutional & Corporate Training */}
      <section className="bg-white py-10 lg:py-16">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                <Building2 className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                <span>Consultation-Led Custom Programmes</span>
              </div>

              <h2 className="text-[22px] lg:text-[32px] font-bold text-[#0F172A] tracking-[-0.015em] leading-[1.2]">
                Institutional &amp; Corporate Training
              </h2>

              <p className="text-[15px] text-[#334155] leading-[1.6] max-w-2xl">
                Dedicated AI literacy, governance, digital safety, workflow automation, and public sector transformation programmes tailored around your organisation’s workforce and operational priorities. Delivered via live online, in-person, or hybrid workshops.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
                <Link
                  to="/institutional-training"
                  className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] w-full sm:w-auto px-5 text-sm font-semibold bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-[8px] transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D4ED8]"
                >
                  Explore Institutional Training
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 h-11 min-h-[44px] w-full sm:w-auto px-5 text-sm font-semibold bg-white hover:bg-[#F7F9FC] text-[#0F172A] border border-[#CBD5E1] hover:border-[#94A3B8] rounded-[8px] transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[16/9] w-full rounded-[12px] overflow-hidden border border-[#E3E8EF] shadow-[0_1px_2px_rgba(16,24,40,0.04)] bg-[#F7F9FC]">
                <img
                  src={SITE_MEDIA.institutionalWorkshop.src}
                  alt={SITE_MEDIA.institutionalWorkshop.alt}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E3E8EF] grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0F172A]">Custom Syllabus &amp; Scoping</h3>
                <p className="text-[13.5px] text-[#334155] mt-1 leading-[1.55]">
                  Aligned to departmental roles, compliance policies, and technical readiness.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0F172A]">Governance &amp; Digital Hygiene</h3>
                <p className="text-[13.5px] text-[#334155] mt-1 leading-[1.55]">
                  Human oversight, privacy protection, and responsible workplace policies.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[10px] bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0F172A]">
                  Scholarships for Individual Learners
                </h3>
                <p className="text-[13.5px] text-[#334155] mt-1 leading-[1.55]">
                  Up to 50% waiver available on core paid courses via{' '}
                  <Link
                    to="/scholarships"
                    className="text-[#1D4ED8] font-semibold underline underline-offset-2 hover:text-[#1E40AF]"
                  >
                    Scholarships
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
