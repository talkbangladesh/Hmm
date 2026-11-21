import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  FAQ_ITEMS,
  FREE_SESSION_CONTENT,
  POLICY_PAGES,
  OFFICIAL_CONTACT,
} from '../data/pagesContent';
import { SPECIALIZED_PROGRAMMES } from '../data/catalogue';

export function FaqPage() {
  return (
    <div className="bg-white text-[#0F172A]">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="space-y-2 border-b border-[#E3E8EF] pb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
            Information
          </p>
          <h1 className="text-3xl sm:text-[40px] font-bold text-[#0F172A] tracking-[-0.02em]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
            Answers on admissions, bKash/Nagad payments, scholarships, certificates, and Member Access resources.
          </p>
        </div>

        <div className="divide-y divide-[#E3E8EF] border-b border-[#E3E8EF]">
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} className="py-6 first:pt-2 space-y-2 max-w-[68ch]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
                {item.category}
              </p>
              <h2 className="text-lg font-bold text-[#0F172A]">{item.q}</h2>
              <p className="text-sm sm:text-[15px] text-[#334155] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#0F172A]">Still have questions?</p>
            <p className="text-sm text-[#64748B] mt-0.5">
              Email {OFFICIAL_CONTACT.email} or message WhatsApp Only at {OFFICIAL_CONTACT.whatsappDisplay}.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] whitespace-nowrap transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FreeSessionPage() {
  return (
    <div className="bg-white text-[#0F172A]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="border-b border-[#E3E8EF] pb-10 space-y-4 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
            Open Learning Access · BDT 0
          </p>
          <h1 className="text-3xl sm:text-[40px] font-bold text-[#0F172A] tracking-[-0.02em]">
            {FREE_SESSION_CONTENT.heading}
          </h1>
          <p className="text-lg font-medium text-[#334155]">{FREE_SESSION_CONTENT.subheading}</p>
          <p className="text-base text-[#334155] leading-relaxed">{FREE_SESSION_CONTENT.intro}</p>
          <ul className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF] text-sm sm:text-[15px] text-[#334155]">
            {FREE_SESSION_CONTENT.highlights.map((h) => (
              <li key={h} className="py-3">{h}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0F172A]">
            Available Tuition-Free Specialized Programmes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SPECIALIZED_PROGRAMMES.map((prog) => (
              <div
                key={prog.id}
                className="bg-white border border-[#E3E8EF] rounded-[12px] p-6 flex flex-col justify-between gap-4"
              >
                <div>
                  <p className="text-xs text-[#0F766E] font-bold uppercase tracking-wide">
                    {prog.code} · FREE (BDT 0) · {prog.eligibility}
                  </p>
                  <h3 className="text-lg font-bold text-[#0F172A] mt-1.5">{prog.title}</h3>
                  <p className="text-sm text-[#334155] mt-1 leading-relaxed">{prog.focus}</p>
                </div>
                <Link
                  to={prog.route}
                  className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]"
                >
                  Explore &amp; Enrol Free
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PolicyPage({
  type,
}: {
  type: 'privacy' | 'terms' | 'certificate' | 'accessibility';
}) {
  const doc = POLICY_PAGES[type];
  return (
    <div className="bg-white text-[#0F172A]">
      <article className="max-w-[900px] mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="border-b border-[#E3E8EF] pb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
            Atlas AI Education · Policy Document
          </p>
          <h1 className="text-3xl sm:text-[36px] font-bold text-[#0F172A] tracking-[-0.02em]">
            {doc.title}
          </h1>
          <p className="text-xs text-[#64748B]">Effective Year: {doc.updated}</p>
        </div>

        <div className="divide-y divide-[#E3E8EF] max-w-[68ch]">
          {doc.sections.map((s) => (
            <section key={s.heading} className="py-6 first:pt-0 space-y-2">
              <h2 className="text-lg font-bold text-[#0F172A]">{s.heading}</h2>
              <p className="text-sm sm:text-base text-[#334155] leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
