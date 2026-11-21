import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import {
  COURSES,
  SPECIALIZED_PROGRAMMES,
  PROGRAMME_CATEGORIES,
  getCoursesByCategory,
  extractCourseSummary,
} from '../data/catalogue';
import { PaidCourseCard, SpecializedProgrammeCard } from '../components/CourseCard';

export function ProgrammesPage({ categorySlug }: { categorySlug?: string }) {
  const [search, setSearch] = useState('');

  if (categorySlug === 'specialized') {
    const filteredSpec = SPECIALIZED_PROGRAMMES.filter((p) =>
      `${p.title} ${p.focus} ${p.eligibility}`.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="bg-white text-[#0F172A]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16 space-y-10">
          <div className="space-y-3 border-b border-[#E3E8EF] pb-8">
            <nav aria-label="Breadcrumb" className="text-xs text-[#64748B] flex items-center gap-2">
              <Link to="/" className="hover:text-[#0F172A]">Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/programmes" className="hover:text-[#0F172A]">Programmes</Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#0F172A] font-medium">Specialized Programmes</span>
            </nav>
            <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#0F766E]">
              100% Tuition-Free · 1 Month · 4 Live Classes
            </p>
            <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-[#0F172A] tracking-[-0.02em]">
              Specialized Foundation Programmes
            </h1>
            <p className="text-[15px] text-[#334155] max-w-3xl leading-[1.6]">
              Six accessible tuition-free programmes covering AI Governance, Public Sector Transformation, Justice &amp; Judiciary, NGOs, Women’s Digital Safety (Women Only 18+), and Academic Research for Students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredSpec.map((prog) => (
              <SpecializedProgrammeCard key={prog.id} programme={prog} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (categorySlug) {
    const courses = getCoursesByCategory(categorySlug);
    const meta = PROGRAMME_CATEGORIES.find((c) => c.slug === categorySlug);
    const filtered = courses.filter((c) =>
      `${c.code} ${c.title} ${extractCourseSummary(c)}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="bg-white text-[#0F172A]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16 space-y-10">
          <div className="space-y-3 border-b border-[#E3E8EF] pb-8">
            <nav aria-label="Breadcrumb" className="text-xs text-[#64748B] flex items-center gap-2">
              <Link to="/" className="hover:text-[#0F172A]">Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/programmes" className="hover:text-[#0F172A]">Programmes</Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#0F172A] font-medium">{meta?.name || 'Category'}</span>
            </nav>
            <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
              {meta?.badgeText}
            </p>
            <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-[#0F172A] tracking-[-0.02em]">
              {meta?.name || 'Programmes'}
            </h1>
            <p className="text-[15px] text-[#334155] max-w-3xl leading-[1.6]">{meta?.summary}</p>

            <div className="pt-2 max-w-md relative">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter courses by code or topic..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2 text-sm bg-white border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filtered.map((course) => (
              <PaidCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredAll = COURSES.filter((c) =>
    `${c.code} ${c.title} ${c.categoryName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white text-[#0F172A]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16 space-y-10 lg:space-y-12">
        <div className="space-y-4 border-b border-[#E3E8EF] pb-8">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
            Complete Programme Directory
          </p>
          <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-[#0F172A] tracking-[-0.02em]">
            All Learning Programmes
          </h1>
          <p className="text-[15px] text-[#334155] max-w-3xl leading-[1.6]">
            Browse our 22 structured paid cohorts across AI Literacy &amp; Foundation, Applied AI, Professional Development, and Governance tracks, alongside 6 free Specialized Foundation Programmes and customised Institutional Training.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <Link
              to="/programmes/foundation"
              className="inline-flex items-center min-h-[44px] px-3.5 py-2 text-xs font-semibold bg-white border border-[#E3E8EF] hover:border-[#1D4ED8] rounded-[8px] text-[#0F172A] transition-colors"
            >
              AI Literacy &amp; Foundation
            </Link>
            <Link
              to="/programmes/applied-ai"
              className="inline-flex items-center min-h-[44px] px-3.5 py-2 text-xs font-semibold bg-white border border-[#E3E8EF] hover:border-[#1D4ED8] rounded-[8px] text-[#0F172A] transition-colors"
            >
              Applied AI
            </Link>
            <Link
              to="/programmes/professional-development"
              className="inline-flex items-center min-h-[44px] px-3.5 py-2 text-xs font-semibold bg-white border border-[#E3E8EF] hover:border-[#1D4ED8] rounded-[8px] text-[#0F172A] transition-colors"
            >
              Professional Development
            </Link>
            <Link
              to="/programmes/specialized"
              className="inline-flex items-center min-h-[44px] px-3.5 py-2 text-xs font-semibold bg-[#F0FDF4] border border-[#BBF7D0] hover:border-[#0F766E] rounded-[8px] text-[#0F766E] transition-colors"
            >
              Specialized Programmes (Free)
            </Link>
            <Link
              to="/institutional-training"
              className="inline-flex items-center min-h-[44px] px-3.5 py-2 text-xs font-semibold bg-[#1D4ED8] text-white rounded-[8px] hover:bg-[#1E40AF] transition-colors"
            >
              Institutional Training
            </Link>
          </div>

          <div className="pt-2 max-w-md relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses (e.g. AL-101, Governance, Marketing)..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2 text-sm bg-white border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            />
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <h2 className="text-[22px] lg:text-[32px] font-bold text-[#0F172A] tracking-[-0.015em]">
              Free Specialized Programmes ({SPECIALIZED_PROGRAMMES.length})
            </h2>
            <Link
              to="/programmes/specialized"
              className="inline-flex items-center gap-1 min-h-[44px] text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] self-start sm:self-auto"
            >
              Open Dedicated View
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {SPECIALIZED_PROGRAMMES.map((prog) => (
              <SpecializedProgrammeCard key={prog.id} programme={prog} />
            ))}
          </div>
        </section>

        <section className="space-y-6 pt-10 border-t border-[#E3E8EF]">
          <h2 className="text-[22px] lg:text-[32px] font-bold text-[#0F172A] tracking-[-0.015em]">
            Structured Cohort Courses ({filteredAll.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredAll.map((course) => (
              <PaidCourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
