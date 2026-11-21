import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock } from 'lucide-react';
import type { CourseItem, SpecializedProgrammeItem } from '../data/catalogue';
import { extractCourseSummary, extractSpecializedSummary, hasBangla } from '../data/catalogue';
import { getCourseImage, getSpecializedImage } from '../data/media';
import { EnrolmentModal } from './EnrolmentModal';

function CardMedia({
  imageSrc,
  imageAlt,
  code,
  fallbackLabel,
}: {
  imageSrc: string;
  imageAlt: string;
  code: string;
  fallbackLabel: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-[12px] border-b border-[#E3E8EF] bg-[#F7F9FC]">
      {!failed ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover transition-transform duration-150 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#F7F9FC]">
          <BookOpen className="w-6 h-6 text-[#1D4ED8] mb-1.5" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-xs font-bold text-[#0F172A]">{code}</p>
          <p className="text-xs text-[#64748B] mt-0.5">{fallbackLabel}</p>
        </div>
      )}
    </div>
  );
}

export function PaidCourseCard({ course }: { course: CourseItem }) {
  const summary = extractCourseSummary(course);
  const media = getCourseImage(course.code, course.title);
  const [enrolOpen, setEnrolOpen] = useState(false);

  const hasDiscount = course.regularFeeBdt > course.discountedFeeBdt && course.regularFeeBdt > 0;
  const discountPercent = hasDiscount
    ? Math.round(((course.regularFeeBdt - course.discountedFeeBdt) / course.regularFeeBdt) * 100)
    : 0;
  const summaryIsBangla = hasBangla(summary);

  return (
    <>
      <article className="group bg-white border border-[#E3E8EF] rounded-[12px] shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[#CBD5E1] hover:shadow-[0_6px_16px_rgba(16,24,40,0.08)] overflow-hidden flex flex-col h-full transition-all duration-150">
        {/* Image: 16:9 */}
        <Link
          to={course.route}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1D4ED8]"
        >
          <CardMedia
            imageSrc={media.src}
            imageAlt={media.alt}
            code={course.code}
            fallbackLabel={course.categoryName}
          />
        </Link>

        {/* Body: 16px padding, 12px gaps */}
        <div className="p-4 flex-1 flex flex-col gap-3">
          {/* Row 1: code pill + full track pill + 12px muted level text */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-[11.5px] font-semibold whitespace-nowrap shrink-0">
              {course.code}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] text-[11.5px] font-medium leading-snug">
              {course.categoryName}
            </span>
            <span className="text-xs text-[#64748B] font-medium">{course.level}</span>
          </div>

          {/* Row 2: Clock 14px + duration/sessions/language */}
          <p className="inline-flex items-center gap-1.5 text-[12.5px] text-[#64748B]">
            <Clock className="w-3.5 h-3.5 text-[#64748B] shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span>
              {course.duration} · {course.sessions.split('(')[0].trim()} · Bilingual
            </span>
          </p>

          {/* Title: 17px semibold, line-height 1.35, max 2 lines */}
          <h3
            className={`text-[17px] font-semibold text-[#0F172A] leading-[1.35] line-clamp-2 ${
              hasBangla(course.title) ? 'bangla-text' : ''
            }`}
          >
            <Link
              to={course.route}
              className="hover:text-[#1D4ED8] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
            >
              {course.title}
            </Link>
          </h3>

          {/* Description: 13.5px (Bangla 14px line-height 1.7), line-clamp 3 */}
          <p
            className={
              summaryIsBangla
                ? 'bangla-text text-[14px] leading-[1.7] text-[#475569] line-clamp-3'
                : 'text-[13.5px] leading-[1.6] text-[#475569] line-clamp-3'
            }
          >
            {summary}
          </p>

          {/* Footer pinned to bottom: hairline divider, Fee row, Buttons row */}
          <div className="mt-auto pt-3 border-t border-[#E3E8EF] space-y-3">
            <div>
              <p className="text-[11.5px] font-medium uppercase tracking-wide text-[#64748B] mb-1">
                Course Fee
              </p>
              <div className="flex items-baseline gap-2 flex-nowrap max-[340px]:flex-wrap">
                <span className="text-[20px] font-bold text-[#0F172A] tabular-nums whitespace-nowrap leading-none">
                  BDT {course.discountedFeeBdt.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-[13px] text-[#64748B] line-through tabular-nums whitespace-nowrap">
                    BDT {course.regularFeeBdt.toLocaleString()}
                  </span>
                )}
                {hasDiscount && discountPercent > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#0F766E] text-[11.5px] font-semibold tabular-nums whitespace-nowrap">
                    {discountPercent}% off
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to={course.route}
                className="inline-flex items-center justify-center h-[44px] min-h-[44px] px-3 text-sm font-semibold text-[#1D4ED8] bg-white border border-[#1D4ED8] hover:bg-[#EFF6FF] rounded-[8px] whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              >
                View Details
              </Link>
              <button
                type="button"
                onClick={() => setEnrolOpen(true)}
                className="inline-flex items-center justify-center h-[44px] min-h-[44px] px-3 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D4ED8]"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </article>

      <EnrolmentModal
        isOpen={enrolOpen}
        onClose={() => setEnrolOpen(false)}
        programmeCode={course.code}
        programmeTitle={course.title}
        isFreeSpecialized={false}
        regularFeeBdt={course.regularFeeBdt}
        discountedFeeBdt={course.discountedFeeBdt}
      />
    </>
  );
}

export function SpecializedProgrammeCard({ programme }: { programme: SpecializedProgrammeItem }) {
  const summary = extractSpecializedSummary(programme);
  const media = getSpecializedImage(programme.code, programme.title);
  const [enrolOpen, setEnrolOpen] = useState(false);
  const summaryIsBangla = hasBangla(summary);

  return (
    <>
      <article className="group bg-white border border-[#E3E8EF] rounded-[12px] shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-[#CBD5E1] hover:shadow-[0_6px_16px_rgba(16,24,40,0.08)] overflow-hidden flex flex-col h-full transition-all duration-150">
        {/* Image: 16:9 */}
        <Link
          to={programme.route}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1D4ED8]"
        >
          <CardMedia
            imageSrc={media.src}
            imageAlt={media.alt}
            code={programme.code}
            fallbackLabel="Specialized Foundation"
          />
        </Link>

        {/* Body: 16px padding, 12px gaps */}
        <div className="p-4 flex-1 flex flex-col gap-3">
          {/* Row 1: code pill + full track pill + 12px muted eligibility text */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-[11.5px] font-semibold whitespace-nowrap shrink-0">
              {programme.code}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] text-[11.5px] font-medium leading-snug">
              Specialized Foundation
            </span>
            <span className="text-xs text-[#64748B] font-medium">{programme.eligibility}</span>
          </div>

          {/* Row 2: Clock 14px + duration/sessions/certificate */}
          <p className="inline-flex items-center gap-1.5 text-[12.5px] text-[#64748B]">
            <Clock className="w-3.5 h-3.5 text-[#64748B] shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span>
              {programme.duration} · 4 Live Classes · {programme.certificateType}
            </span>
          </p>

          {/* Title: 17px semibold, line-height 1.35, max 2 lines */}
          <h3
            className={`text-[17px] font-semibold text-[#0F172A] leading-[1.35] line-clamp-2 ${
              hasBangla(programme.title) ? 'bangla-text' : ''
            }`}
          >
            <Link
              to={programme.route}
              className="hover:text-[#1D4ED8] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
            >
              {programme.title}
            </Link>
          </h3>

          {/* Description: 13.5px (Bangla 14px line-height 1.7), line-clamp 3 */}
          <p
            className={
              summaryIsBangla
                ? 'bangla-text text-[14px] leading-[1.7] text-[#475569] line-clamp-3'
                : 'text-[13.5px] leading-[1.6] text-[#475569] line-clamp-3'
            }
          >
            {summary}
          </p>

          {/* Footer pinned to bottom: hairline divider, Fee row, Buttons row */}
          <div className="mt-auto pt-3 border-t border-[#E3E8EF] space-y-3">
            <div>
              <p className="text-[11.5px] font-medium uppercase tracking-wide text-[#64748B] mb-1">
                Course Fee
              </p>
              <div className="flex items-baseline gap-2 flex-nowrap max-[340px]:flex-wrap">
                <span className="text-[20px] font-bold text-[#0F766E] tabular-nums whitespace-nowrap leading-none">
                  FREE (BDT 0)
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#0F766E] text-[11.5px] font-semibold whitespace-nowrap">
                  Tuition-Free
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to={programme.route}
                className="inline-flex items-center justify-center h-[44px] min-h-[44px] px-3 text-sm font-semibold text-[#1D4ED8] bg-white border border-[#1D4ED8] hover:bg-[#EFF6FF] rounded-[8px] whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              >
                View Details
              </Link>
              <button
                type="button"
                onClick={() => setEnrolOpen(true)}
                className="inline-flex items-center justify-center h-[44px] min-h-[44px] px-3 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D4ED8]"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </article>

      <EnrolmentModal
        isOpen={enrolOpen}
        onClose={() => setEnrolOpen(false)}
        programmeCode={programme.code}
        programmeTitle={programme.title}
        isFreeSpecialized
        eligibilityLabel={programme.eligibility}
        regularFeeBdt={0}
        discountedFeeBdt={0}
      />
    </>
  );
}
