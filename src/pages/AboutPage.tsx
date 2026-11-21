import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ABOUT_CONTENT } from '../data/pagesContent';
import { SITE_MEDIA } from '../data/media';

export function AboutPage() {
  return (
    <div className="bg-white text-[#0F172A]">
      <section className="bg-white border-b border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                {ABOUT_CONTENT.subtitle}
              </p>
              <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-[#0F172A] tracking-[-0.02em] leading-[1.15]">
                {ABOUT_CONTENT.title}
              </h1>
              <p className="text-[17px] lg:text-[19px] font-medium text-[#334155]">
                {ABOUT_CONTENT.heroHeading}
              </p>
              <p className="bangla-text text-[15px] leading-[1.75] text-[#334155] max-w-[68ch]">
                {ABOUT_CONTENT.introBn}
              </p>
              <p className="text-[15px] text-[#334155] leading-[1.6] max-w-[68ch]">
                {ABOUT_CONTENT.introEn}
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[16/9] w-full rounded-[16px] overflow-hidden border border-[#E3E8EF] bg-[#F7F9FC]">
                <img
                  src={SITE_MEDIA.heroLearning.src}
                  alt={SITE_MEDIA.heroLearning.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F9FC] border-b border-[#E3E8EF]">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {ABOUT_CONTENT.pillars.map((pillar) => (
              <div key={pillar.title} className="pt-5 border-t border-[#E3E8EF] space-y-2">
                <h2 className="text-lg font-bold text-[#0F172A]">{pillar.title}</h2>
                <p className="text-sm sm:text-[15px] text-[#334155] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 lg:py-16 space-y-6">
          <h2 className="text-[22px] lg:text-[32px] font-bold text-[#0F172A]">What Learners Master at Atlas</h2>
          <ul className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF] max-w-[68ch] text-[15px] text-[#334155]">
            {ABOUT_CONTENT.whatLearnersMaster.map((item) => (
              <li key={item} className="py-3.5 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
          <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              to="/programmes"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] transition-colors duration-150"
            >
              Explore All Programmes
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
            <Link
              to="/institutional-training"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 text-sm font-semibold text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F7F9FC] rounded-[8px] transition-colors duration-150"
            >
              Institutional Training
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
