import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  BarChart2,
  Clock,
  Globe,
  Video,
} from 'lucide-react';
import {
  extractCourseSubtitle,
  extractCourseSummary,
  extractSpecializedSummary,
  getCategoryRouteForCourse,
  getCourseByParam,
  getRelatedCourses,
  getSpecializedByParam,
  hasBangla,
  parseCurriculumDocument,
  SPECIALIZED_PROGRAMMES,
  type CourseItem,
  type SpecializedProgrammeItem,
} from '../data/catalogue';
import { getCourseImage, getSpecializedImage } from '../data/media';
import { CurriculumViewer } from '../components/CurriculumViewer';
import { EnrolmentModal } from '../components/EnrolmentModal';
import { PaidCourseCard, SpecializedProgrammeCard } from '../components/CourseCard';

const SECTION_ANCHORS = [
  { id: 'section-info', label: 'Course Info', categories: ['info'] },
  { id: 'section-overview', label: 'Overview', categories: ['overview'] },
  { id: 'section-outcomes', label: 'What You Will Learn', categories: ['outcomes'] },
  { id: 'section-curriculum', label: 'Curriculum', categories: ['curriculum'] },
  { id: 'section-sessions', label: 'Session Plan', categories: ['sessions'] },
  { id: 'section-practical', label: 'Activities & Assessment', categories: ['practical', 'assessment'] },
  { id: 'section-certificate', label: 'Certificate', categories: ['certificate'] },
  { id: 'section-eligibility', label: 'Who Should Enrol', categories: ['eligibility', 'other'] },
  { id: 'section-faq', label: 'FAQ', categories: ['faq'] },
  { id: 'section-enrolment', label: 'Enrolment', categories: ['enrolment'] },
];

function getVisibleAnchors(rawText: string) {
  const cats = new Set(parseCurriculumDocument(rawText).map((s) => s.category));
  return SECTION_ANCHORS.filter(
    (tab) => tab.id === 'section-certificate' || tab.categories.some((c) => cats.has(c as never))
  );
}

interface SummaryCardProps {
  isFreeSpecialized: boolean;
  regularFeeBdt: number;
  discountedFeeBdt: number;
  savingsBdt?: number;
  duration: string;
  sessions: string;
  cohortOrEligibilityLabel: string;
  cohortOrEligibilityValue: string;
  certificateType: string;
  certificateNote: string;
  onEnrolClick: () => void;
}

function EnrolmentSummaryCard({
  isFreeSpecialized,
  regularFeeBdt,
  discountedFeeBdt,
  savingsBdt = 0,
  duration,
  sessions,
  cohortOrEligibilityLabel,
  cohortOrEligibilityValue,
  certificateType,
  certificateNote,
  onEnrolClick,
}: SummaryCardProps) {
  return (
    <div className="bg-white border border-[#E3E8EF] rounded-[12px] shadow-[0_1px_2px_rgba(16,24,40,0.05)] p-6 space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
          Enrolment Summary
        </p>
        <div className="flex flex-wrap items-baseline gap-2.5 pt-0.5">
          {isFreeSpecialized ? (
            <span className="text-2xl sm:text-[26px] font-bold text-[#0F766E]">
              FREE (BDT 0)
            </span>
          ) : (
            <>
              <span className="text-2xl sm:text-[26px] font-bold text-[#0F172A]">
                BDT {discountedFeeBdt.toLocaleString()}
              </span>
              {regularFeeBdt > discountedFeeBdt && (
                <span className="text-sm text-[#64748B] line-through">
                  BDT {regularFeeBdt.toLocaleString()}
                </span>
              )}
            </>
          )}
        </div>
        {!isFreeSpecialized && savingsBdt > 0 && (
          <p className="text-xs font-medium text-[#0F766E]">
            Cohort tuition waiver: Save BDT {savingsBdt.toLocaleString()}
          </p>
        )}
      </div>

      <dl className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF] text-sm">
        <div className="py-3 flex items-center justify-between gap-4">
          <dt className="text-[#64748B] shrink-0">Course Fee</dt>
          <dd className="font-semibold text-[#0F172A] text-right">
            {isFreeSpecialized ? (
              <span className="text-[#0F766E]">BDT 0 (Free)</span>
            ) : (
              <span>
                BDT {discountedFeeBdt.toLocaleString()}{' '}
                {regularFeeBdt > discountedFeeBdt && (
                  <span className="text-xs font-normal text-[#64748B] line-through ml-1">
                    BDT {regularFeeBdt.toLocaleString()}
                  </span>
                )}
              </span>
            )}
          </dd>
        </div>

        <div className="py-3 flex items-center justify-between gap-4">
          <dt className="text-[#64748B] shrink-0">Duration</dt>
          <dd className="font-medium text-[#0F172A] text-right">{duration}</dd>
        </div>

        <div className="py-3 flex items-center justify-between gap-4">
          <dt className="text-[#64748B] shrink-0">Sessions</dt>
          <dd className="font-medium text-[#0F172A] text-right">{sessions}</dd>
        </div>

        <div className="py-3 flex items-center justify-between gap-4">
          <dt className="text-[#64748B] shrink-0">{cohortOrEligibilityLabel}</dt>
          <dd className="font-medium text-[#0F172A] text-right">{cohortOrEligibilityValue}</dd>
        </div>

        <div className="py-3 flex items-center justify-between gap-4">
          <dt className="text-[#64748B] shrink-0">Certificate</dt>
          <dd className="font-medium text-[#1D4ED8] text-right">{certificateType}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onEnrolClick}
        className="w-full min-h-[48px] px-4 py-3 text-sm sm:text-[15px] font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] inline-flex items-center justify-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D4ED8]"
      >
        {isFreeSpecialized
          ? 'Enrol for Free (BDT 0)'
          : `Enrol Now — BDT ${discountedFeeBdt.toLocaleString()}`}
        <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
      </button>

      <p className="text-xs text-[#64748B] leading-relaxed">{certificateNote}</p>
    </div>
  );
}

function StickyTabNav({
  tabs,
  activeId,
  onSelectTab,
}: {
  tabs: Array<{ id: string; label: string }>;
  activeId: string;
  onSelectTab: (id: string) => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onSelectTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-[#E3E8EF]">
      <nav
        aria-label="Course sections"
        className="max-w-[1120px] mx-auto px-4 sm:px-6 flex items-center gap-6 overflow-x-auto no-scrollbar"
      >
        {tabs.map((tab) => {
          const isActive = activeId === tab.id;
          return (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              onClick={(e) => handleClick(e, tab.id)}
              aria-current={isActive ? 'location' : undefined}
              className={`py-3.5 min-h-[44px] inline-flex items-center text-[13px] sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
                isActive
                  ? 'border-[#1D4ED8] text-[#1D4ED8]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function HeroMetaGrid({
  duration,
  sessions,
  level,
  delivery = 'Live Online',
}: {
  duration: string;
  sessions: string;
  level: string;
  delivery?: string;
}) {
  const items = [
    { Icon: Clock, text: duration },
    { Icon: Video, text: sessions },
    { Icon: BarChart2, text: level },
    { Icon: Globe, text: delivery },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 py-3.5 border-y border-[#E3E8EF]">
      {items.map(({ Icon, text }, idx) => (
        <div key={idx} className="flex items-center gap-2 min-w-0 text-left">
          <Icon
            className="w-[18px] h-[18px] text-[#2563EB] shrink-0"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="text-[14px] sm:text-[15px] font-medium text-[#334155] truncate leading-none">
            {text}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CourseDetailPage({ mode }: { mode: 'course' | 'specialized' }) {
  const params = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [showStickyMobileBar, setShowStickyMobileBar] = useState(false);
  const heroCtaRef = useRef<HTMLDivElement>(null);

  const paramKey = mode === 'specialized' ? params.slug : params.code || params.slug;

  const course: CourseItem | undefined =
    mode === 'course' ? getCourseByParam(paramKey) : undefined;
  const prog: SpecializedProgrammeItem | undefined =
    mode === 'specialized' ? getSpecializedByParam(paramKey) : undefined;

  const rawSource = mode === 'specialized' ? prog?.rawSourceContent || '' : course?.rawSourceContent || '';
  const visibleTabs = useMemo(() => getVisibleAnchors(rawSource), [rawSource]);
  const [activeTabId, setActiveTabId] = useState<string>(visibleTabs[0]?.id || 'section-info');

  useEffect(() => {
    if (visibleTabs.length > 0) {
      setActiveTabId(visibleTabs[0].id);
    }
  }, [paramKey, visibleTabs]);

  useEffect(() => {
    if (visibleTabs.length === 0) return;

    const sectionEls = visibleTabs
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveTabId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-72px 0px -60% 0px',
        threshold: [0, 0.1, 0.25],
      }
    );

    for (const el of sectionEls) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [visibleTabs]);

  useEffect(() => {
    const sentinel = heroCtaRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setShowStickyMobileBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [paramKey]);

  if (mode === 'specialized') {
    if (!prog) {
      return (
        <div className="bg-white min-h-[60vh] flex items-center justify-center px-4 py-16">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-bold text-[#0F172A]">Programme Not Found</h1>
            <Link
              to="/programmes/specialized"
              className="inline-flex min-h-[44px] items-center px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px]"
            >
              Return to Specialized Programmes
            </Link>
          </div>
        </div>
      );
    }

    const summary = extractSpecializedSummary(prog);
    const siblingProgrammes = SPECIALIZED_PROGRAMMES.filter((p) => p.code !== prog.code).slice(0, 3);
    const media = getSpecializedImage(prog.code, prog.title);
    const showSubtitle =
      Boolean(prog.focus) &&
      prog.focus.trim().toLowerCase() !== prog.title.trim().toLowerCase();
    const showSummary =
      Boolean(summary) &&
      summary.trim().toLowerCase() !== prog.focus.trim().toLowerCase() &&
      summary.trim().toLowerCase() !== prog.title.trim().toLowerCase();

    const summaryCardProps: SummaryCardProps = {
      isFreeSpecialized: true,
      regularFeeBdt: 0,
      discountedFeeBdt: 0,
      duration: prog.duration,
      sessions: prog.sessions,
      cohortOrEligibilityLabel: 'Eligibility',
      cohortOrEligibilityValue: prog.eligibility,
      certificateType: prog.certificateType,
      certificateNote:
        'Non-accredited institutional Certificate of Participation issued upon meeting cohort attendance requirements.',
      onEnrolClick: () => setModalOpen(true),
    };

    return (
      <div className="bg-white text-[#0F172A] pb-24 md:pb-0">
        {/* Hero Band */}
        <section className="bg-white border-b border-[#E3E8EF]">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-5 pb-10 sm:pt-8 sm:pb-12 space-y-6">
            <nav
              aria-label="Breadcrumb"
              className="text-xs sm:text-[13px] text-[#64748B] flex items-center gap-1.5 min-w-0"
            >
              <Link to="/" className="hover:text-[#0F172A] shrink-0">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link to="/programmes/specialized" className="hover:text-[#0F172A] truncate">
                Specialized Programmes
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#0F172A] font-semibold shrink-0">{prog.code}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-semibold">
                  {prog.code} · Specialized Foundation · Free (BDT 0)
                </span>

                <h1
                  className={`text-[28px] sm:text-[34px] lg:text-[44px] font-bold text-[#0F172A] leading-[1.15] ${
                    hasBangla(prog.title) ? 'bangla-text' : 'tracking-[-0.02em]'
                  }`}
                >
                  {prog.title}
                </h1>

                {showSubtitle && (
                  <p
                    className={`text-base sm:text-lg font-medium text-[#334155] leading-snug ${
                      hasBangla(prog.focus) ? 'bangla-text' : ''
                    }`}
                  >
                    {prog.focus}
                  </p>
                )}

                <HeroMetaGrid
                  duration={prog.duration}
                  sessions={prog.sessions}
                  level={prog.level}
                />

                {showSummary && (
                  <p
                    className={`text-base text-[#334155] leading-relaxed max-w-[68ch] ${
                      hasBangla(summary) ? 'bangla-text' : ''
                    }`}
                  >
                    {summary}
                  </p>
                )}

                <div ref={heroCtaRef} className="pt-1">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3 text-sm sm:text-[15px] font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] inline-flex items-center justify-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D4ED8]"
                  >
                    Enrol for Free (BDT 0)
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="aspect-[16/9] w-full rounded-[16px] overflow-hidden border border-[#E3E8EF] bg-[#F7F9FC]">
                  <img
                    src={media.src}
                    alt={media.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Inline Enrolment Card on Mobile */}
            <div className="lg:hidden pt-2">
              <EnrolmentSummaryCard {...summaryCardProps} />
            </div>
          </div>
        </section>

        {/* Sticky Tab Navigation */}
        <StickyTabNav
          tabs={visibleTabs}
          activeId={activeTabId}
          onSelectTab={setActiveTabId}
        />

        {/* Flat Editorial Syllabus + Sticky Enrolment Card */}
        <main className="bg-white">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-8 min-w-0">
                <CurriculumViewer
                  rawSourceContent={prog.rawSourceContent}
                  certificateType={prog.certificateType}
                  certificateStatus="Non-accredited"
                  onOpenEnrolModal={() => setModalOpen(true)}
                  courseCode={prog.code}
                  isFreeSpecialized
                />
              </div>

              <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-[68px]">
                <EnrolmentSummaryCard {...summaryCardProps} />
              </aside>
            </div>
          </div>
        </main>

        {/* Alternating #F7F9FC Band: Related Specialized Programmes */}
        <section className="bg-[#F7F9FC] border-t border-[#E3E8EF]">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[22px] sm:text-2xl font-bold text-[#0F172A]">
                More Specialized Programmes
              </h2>
              <Link
                to="/programmes/specialized"
                className="text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] inline-flex items-center gap-1 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
              >
                View All 6 Free Programmes
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {siblingProgrammes.map((p) => (
                <SpecializedProgrammeCard key={p.id} programme={p} />
              ))}
            </div>
          </div>
        </section>

        {showStickyMobileBar && (
          <div className="md:hidden fixed inset-x-0 bottom-[60px] z-30 bg-white border-t border-[#E3E8EF] px-4 py-2.5 shadow-[0_-2px_8px_rgba(16,24,40,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#64748B] truncate">{prog.code}</p>
                <p className="text-base font-bold text-[#0F766E]">FREE (BDT 0)</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] shrink-0 inline-flex items-center gap-1.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              >
                Enrol for Free
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <EnrolmentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          programmeCode={prog.code}
          programmeTitle={prog.title}
          isFreeSpecialized
          eligibilityLabel={prog.eligibility}
          regularFeeBdt={0}
          discountedFeeBdt={0}
        />
      </div>
    );
  }

  // Paid / Catalogue Course Detail Page
  if (!course) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-[#0F172A]">Course Not Found</h1>
          <p className="text-sm text-[#334155]">
            The requested course code or URL could not be matched in the Atlas AI Education catalogue.
          </p>
          <Link
            to="/programmes"
            className="inline-flex min-h-[44px] items-center px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px]"
          >
            Browse All Programmes
          </Link>
        </div>
      </div>
    );
  }

  const summary = extractCourseSummary(course);
  const subtitle = extractCourseSubtitle(course);
  const categoryCrumb = getCategoryRouteForCourse(course);
  const relatedCourses = getRelatedCourses(course, 3);
  const media = getCourseImage(course.code, course.title);

  const showSubtitle =
    Boolean(subtitle) &&
    subtitle.trim().toLowerCase() !== course.title.trim().toLowerCase() &&
    subtitle.trim().toLowerCase() !== course.categoryName.trim().toLowerCase();

  const showSummary =
    Boolean(summary) &&
    summary.trim().toLowerCase() !== subtitle.trim().toLowerCase() &&
    summary.trim().toLowerCase() !== course.title.trim().toLowerCase();

  const summaryCardProps: SummaryCardProps = {
    isFreeSpecialized: false,
    regularFeeBdt: course.regularFeeBdt,
    discountedFeeBdt: course.discountedFeeBdt,
    savingsBdt: course.savingsBdt,
    duration: course.duration,
    sessions: course.sessions,
    cohortOrEligibilityLabel: 'Cohort Cap',
    cohortOrEligibilityValue: `Max ${course.cohortMax} Learners`,
    certificateType: course.certificateType,
    certificateNote: `${course.certificateStatus}. Course access activates upon manual bKash or Nagad payment verification.`,
    onEnrolClick: () => setModalOpen(true),
  };

  return (
    <div className="bg-white text-[#0F172A] pb-24 md:pb-0">
      {/* Hero Band */}
      <section className="bg-white border-b border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-5 pb-10 sm:pt-8 sm:pb-12 space-y-6">
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-[13px] text-[#64748B] flex items-center gap-1.5 min-w-0"
          >
            <Link to="/" className="hover:text-[#0F172A] shrink-0">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link to="/programmes" className="hover:text-[#0F172A] shrink-0">
              Programmes
            </Link>
            <span aria-hidden="true">/</span>
            <Link to={categoryCrumb.to} className="hover:text-[#0F172A] truncate">
              {categoryCrumb.label}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0F172A] font-semibold shrink-0">{course.code}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-semibold">
                {course.code} · {course.categoryName}
              </span>

              <h1
                className={`text-[28px] sm:text-[34px] lg:text-[44px] font-bold text-[#0F172A] leading-[1.15] ${
                  hasBangla(course.title) ? 'bangla-text' : 'tracking-[-0.02em]'
                }`}
              >
                {course.title}
              </h1>

              {showSubtitle && (
                <p
                  className={`text-base sm:text-lg font-medium text-[#334155] leading-snug ${
                    hasBangla(subtitle) ? 'bangla-text' : ''
                  }`}
                >
                  {subtitle}
                </p>
              )}

              <HeroMetaGrid
                duration={course.duration}
                sessions={course.sessions}
                level={course.level}
              />

              {showSummary && (
                <p
                  className={`text-base text-[#334155] leading-relaxed max-w-[68ch] ${
                    hasBangla(summary) ? 'bangla-text' : ''
                  }`}
                >
                  {summary}
                </p>
              )}

              <div ref={heroCtaRef} className="pt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 text-sm sm:text-[15px] font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] inline-flex items-center justify-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D4ED8]"
                >
                  Enrol Now — BDT {course.discountedFeeBdt.toLocaleString()}
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[16/9] w-full rounded-[16px] overflow-hidden border border-[#E3E8EF] bg-[#F7F9FC]">
                <img
                  src={media.src}
                  alt={media.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Inline Enrolment Card on Mobile */}
          <div className="lg:hidden pt-2">
            <EnrolmentSummaryCard {...summaryCardProps} />
          </div>
        </div>
      </section>

      {/* Sticky In-Page Tab Navigation */}
      <StickyTabNav
        tabs={visibleTabs}
        activeId={activeTabId}
        onSelectTab={setActiveTabId}
      />

      {/* Flat Editorial Syllabus + Sticky Enrolment Card */}
      <main className="bg-white">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-8 min-w-0">
              <CurriculumViewer
                rawSourceContent={course.rawSourceContent}
                certificateType={course.certificateType}
                certificateStatus={course.certificateStatus}
                onOpenEnrolModal={() => setModalOpen(true)}
                courseCode={course.code}
                discountedFeeBdt={course.discountedFeeBdt}
              />
            </div>

            <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-[68px]">
              <EnrolmentSummaryCard {...summaryCardProps} />
            </aside>
          </div>
        </div>
      </main>

      {/* Alternating #F7F9FC Band: Related Courses */}
      <section className="bg-[#F7F9FC] border-t border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[22px] sm:text-2xl font-bold text-[#0F172A]">
              Explore More in {categoryCrumb.label}
            </h2>
            <Link
              to={categoryCrumb.to}
              className="text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] inline-flex items-center gap-1 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
            >
              View Track
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {relatedCourses.map((rc) => (
              <PaidCourseCard key={rc.id} course={rc} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom CTA */}
      {showStickyMobileBar && (
        <div className="md:hidden fixed inset-x-0 bottom-[60px] z-30 bg-white border-t border-[#E3E8EF] px-4 py-2.5 shadow-[0_-2px_8px_rgba(16,24,40,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#64748B] truncate">{course.code}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-[#0F172A]">
                  BDT {course.discountedFeeBdt.toLocaleString()}
                </span>
                {course.regularFeeBdt > course.discountedFeeBdt && (
                  <span className="text-xs text-[#64748B] line-through">
                    BDT {course.regularFeeBdt.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] shrink-0 inline-flex items-center gap-1.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
            >
              Enrol Now
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <EnrolmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        programmeCode={course.code}
        programmeTitle={course.title}
        isFreeSpecialized={false}
        regularFeeBdt={course.regularFeeBdt}
        discountedFeeBdt={course.discountedFeeBdt}
      />
    </div>
  );
}
