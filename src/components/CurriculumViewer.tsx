import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import {
  hasBangla,
  parseCurriculumDocument,
  type ParsedBlock,
} from '../data/catalogue';

function textToneClass(text: string, extra = ''): string {
  return `${hasBangla(text) ? 'bangla-text' : ''} ${extra}`.trim();
}

function renderFlatTable(
  headers: string[],
  rows: string[][],
  keyPrefix: string | number
) {
  const isTwoColSpec =
    headers.length === 2 &&
    (/^(attribute|parameter|field|item|course detail)/i.test(headers[0]) ||
      /^(detail|value|specification|description)/i.test(headers[1]) ||
      rows.length <= 15);

  if (isTwoColSpec && headers.length === 2) {
    return (
      <table
        key={keyPrefix}
        className="w-full text-left border-collapse table-fixed border-y border-[#E3E8EF]"
      >
        <thead>
          <tr className="border-b border-[#E3E8EF]">
            <th className="w-[42%] sm:w-[36%] py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              {headers[0]}
            </th>
            <th className="w-[58%] sm:w-[64%] py-3 pl-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              {headers[1]}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E3E8EF]">
          {rows.map((row, ri) => (
            <tr key={ri}>
              <td
                className={textToneClass(
                  row[0] || '',
                  'py-3 pr-4 text-[13px] sm:text-sm font-medium text-[#64748B] align-top break-words'
                )}
              >
                {row[0]}
              </td>
              <td
                className={textToneClass(
                  row[1] || '',
                  'py-3 pl-2 text-sm sm:text-[15px] font-medium text-[#0F172A] align-top break-words'
                )}
              >
                {row[1]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div key={keyPrefix} className="overflow-x-auto border-y border-[#E3E8EF]">
      <table className="min-w-[640px] sm:min-w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#E3E8EF]">
            {headers.map((h, hi) => (
              <th
                key={hi}
                className={textToneClass(
                  h,
                  'py-3 pr-4 first:pl-0 pl-2 text-xs font-semibold uppercase tracking-wide text-[#0F172A] align-top'
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E3E8EF]">
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={textToneClass(
                    cell,
                    `py-3.5 pr-4 first:pl-0 pl-2 text-sm align-top ${
                      ci === 0
                        ? 'font-semibold text-[#0F172A] whitespace-nowrap'
                        : ci === 1
                        ? 'font-medium text-[#0F172A]'
                        : 'text-[#334155]'
                    }`
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderFlatBlock(block: ParsedBlock, idx: number) {
  if (block.type === 'paragraph') {
    return (
      <p
        key={idx}
        className={textToneClass(
          block.text,
          'text-[15px] text-[#334155] leading-[1.6]'
        )}
      >
        {block.text}
      </p>
    );
  }

  if (block.type === 'subheading') {
    return (
      <h3
        key={idx}
        className={textToneClass(
          block.text,
          'text-base sm:text-[17px] font-semibold text-[#0F172A] pt-2'
        )}
      >
        {block.text}
      </h3>
    );
  }

  if (block.type === 'chapter') {
    return (
      <div key={idx} className="py-4 first:pt-2 last:pb-1 space-y-1.5">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#2563EB] shrink-0">
            {block.code}
          </span>
          <h4 className={textToneClass(block.title, 'text-[15px] sm:text-base font-semibold text-[#0F172A]')}>
            {block.title}
          </h4>
        </div>
        {block.description && (
          <p
            className={textToneClass(
              block.description,
              'text-[15px] text-[#334155] leading-[1.6]'
            )}
          >
            {block.description}
          </p>
        )}
      </div>
    );
  }

  if (block.type === 'list') {
    return (
      <ul key={idx} className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF]">
        {block.items.map((item, k) => (
          <li key={k} className="py-3.5 flex items-start gap-3">
            <CheckCircle2
              className="w-[18px] h-[18px] text-[#2563EB] shrink-0 mt-0.5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span
              className={textToneClass(
                item,
                'text-[15px] text-[#334155] leading-[1.6]'
              )}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return renderFlatTable(block.headers, block.rows, idx);
}

function renderFaqItems(blocks: ParsedBlock[]) {
  const entries: Array<{ q: string; a: string[] }> = [];
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const m = block.text.match(/^(\d+\.\s+[^?]+\??)\s*(.*)$/);
      if (m) {
        entries.push({ q: m[1].trim(), a: m[2] ? [m[2].trim()] : [] });
      } else if (entries.length > 0) {
        entries[entries.length - 1].a.push(block.text);
      } else {
        entries.push({ q: 'Course FAQ', a: [block.text] });
      }
    } else if (block.type === 'list') {
      if (entries.length > 0) {
        entries[entries.length - 1].a.push(...block.items);
      }
    }
  }
  return entries;
}

function cleanHeading(title: string): string {
  return title.replace(/^[A-Z]\.\s+/, '').replace(/^\d+\.\s+/, '').trim();
}

export function CurriculumViewer({
  rawSourceContent,
  certificateType,
  certificateStatus,
  onOpenEnrolModal,
  discountedFeeBdt,
  isFreeSpecialized = false,
}: {
  rawSourceContent: string;
  certificateType: string;
  certificateStatus?: string;
  onOpenEnrolModal?: () => void;
  courseCode?: string;
  discountedFeeBdt?: number;
  isFreeSpecialized?: boolean;
}) {
  const sections = parseCurriculumDocument(rawSourceContent);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [expandAllModules, setExpandAllModules] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true });

  if (sections.length === 0) return null;

  const infoSections = sections.filter((s) => s.category === 'info');
  const overviewSections = sections.filter((s) => s.category === 'overview');
  const outcomeSections = sections.filter((s) => s.category === 'outcomes');
  const curriculumSections = sections.filter((s) => s.category === 'curriculum');
  const sessionSections = sections.filter((s) => s.category === 'sessions');
  const practicalSections = sections.filter(
    (s) => s.category === 'practical' || s.category === 'assessment'
  );
  const certificateSections = sections.filter((s) => s.category === 'certificate');
  const eligibilitySections = sections.filter(
    (s) => s.category === 'eligibility' || s.category === 'other'
  );
  const faqSections = sections.filter((s) => s.category === 'faq');
  const enrolmentSections = sections.filter((s) => s.category === 'enrolment');

  function isModuleOpen(id: string, idx: number) {
    if (expandAllModules) return true;
    if (expandedModules[id] !== undefined) return expandedModules[id];
    return idx === 0;
  }

  const infoCertStatus = (() => {
    for (const sec of infoSections) {
      for (const b of sec.blocks) {
        if (b.type === 'table') {
          const found = b.rows.find((r) => /certificate\s*status/i.test(r[0] || ''));
          if (found?.[1]) return found[1];
        }
      }
    }
    return certificateStatus || 'Non-accredited';
  })();

  const flatSectionClass =
    'pt-12 sm:pt-14 border-t border-[#E3E8EF] first:pt-0 first:border-t-0 scroll-mt-[68px]';

  return (
    <div className="space-y-12 sm:space-y-14">
      {/* Course Information */}
      {infoSections.length > 0 && (
        <section id="section-info" className={`${flatSectionClass} space-y-5`}>
          <div className="space-y-1.5">
            <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
              Programme Specifications
            </p>
            <h2 className="text-[22px] lg:text-[28px] font-bold text-[#0F172A]">
              {cleanHeading(infoSections[0].title)}
            </h2>
          </div>

          <div className="space-y-4">
            {infoSections.map((sec) => (
              <div key={sec.id} className="space-y-4">
                {sec.blocks.map((b, i) => renderFlatBlock(b, i))}
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-start gap-2.5 text-sm text-[#334155] max-w-[68ch]">
            <ShieldCheck
              className="w-[18px] h-[18px] text-[#2563EB] shrink-0 mt-0.5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="leading-relaxed">
              <strong className="font-semibold text-[#0F172A]">
                {certificateType} ({infoCertStatus}):
              </strong>{' '}
              This programme issues an institutional {certificateType} ({infoCertStatus}) by Atlas AI Education upon meeting cohort completion criteria.
            </p>
          </div>
        </section>
      )}

      {/* Course Overview */}
      {overviewSections.length > 0 && (
        <section id="section-overview" className={`${flatSectionClass} space-y-5`}>
          <div className="space-y-1.5">
            <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
              About This Course
            </p>
            <h2 className="text-[22px] lg:text-[28px] font-bold text-[#0F172A]">
              {cleanHeading(overviewSections[0].title)}
            </h2>
          </div>

          <div className="space-y-4 max-w-[68ch]">
            {overviewSections.map((sec) =>
              sec.blocks.map((b, i) => renderFlatBlock(b, i))
            )}
          </div>
        </section>
      )}

      {/* What You Will Learn */}
      {outcomeSections.length > 0 && (
        <section id="section-outcomes" className={`${flatSectionClass} space-y-8`}>
          {outcomeSections.map((sec, sIdx) => {
            const nonListBlocks = sec.blocks.filter((b) => b.type !== 'list');
            const listItems = sec.blocks
              .filter((b): b is Extract<ParsedBlock, { type: 'list' }> => b.type === 'list')
              .flatMap((b) => b.items);

            return (
              <div
                key={sec.id}
                className={sIdx > 0 ? 'pt-8 border-t border-[#E3E8EF] space-y-4' : 'space-y-4'}
              >
                <div className="space-y-1.5">
                  {sIdx === 0 && (
                    <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                      Learning Outcomes
                    </p>
                  )}
                  <h2 className="text-[22px] lg:text-[28px] font-bold text-[#0F172A]">
                    {cleanHeading(sec.title)}
                  </h2>
                </div>

                {nonListBlocks.length > 0 && (
                  <div className="space-y-3 max-w-[68ch]">
                    {nonListBlocks.map((b, bi) => renderFlatBlock(b, bi))}
                  </div>
                )}

                {listItems.length > 0 && (
                  <ul className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF]">
                    {listItems.map((item, k) => (
                      <li key={k} className="py-3.5 flex items-start gap-3">
                        <CheckCircle2
                          className="w-[18px] h-[18px] text-[#2563EB] shrink-0 mt-0.5"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span
                          className={textToneClass(
                            item,
                            'text-[15px] text-[#334155] leading-[1.6]'
                          )}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Curriculum Single Accordion List */}
      {curriculumSections.length > 0 && (
        <section id="section-curriculum" className={`${flatSectionClass} space-y-6`}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1.5">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                Structured Syllabus
              </p>
              <h2 className="text-[22px] lg:text-[28px] font-bold text-[#0F172A]">
                Complete Curriculum &amp; Modules
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setExpandAllModules((p) => !p)}
              className="inline-flex items-center min-h-[44px] text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded self-start sm:self-auto"
            >
              {expandAllModules ? 'Collapse All Modules' : 'Expand All Modules'}
            </button>
          </div>

          <div className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF]">
            {curriculumSections.map((sec, idx) => {
              const open = isModuleOpen(sec.id, idx);
              const moduleNum = String(idx + 1).padStart(2, '0');
              const panelId = `curriculum-panel-${sec.id}`;

              const introBlocks = sec.blocks.filter((b) => b.type !== 'chapter' && b.type !== 'list');
              const chapterBlocks = sec.blocks.filter(
                (b): b is Extract<ParsedBlock, { type: 'chapter' }> => b.type === 'chapter'
              );
              const otherListBlocks = sec.blocks.filter((b) => b.type === 'list');

              return (
                <div
                  key={sec.id}
                  className={`transition-colors duration-150 ${
                    open ? 'border-l-[3px] border-l-[#1D4ED8] pl-4 sm:pl-5' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setExpandAllModules(false);
                      setExpandedModules((prev) => ({ ...prev, [sec.id]: !open }));
                    }}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="w-full py-4 min-h-[56px] flex items-center justify-between gap-4 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
                  >
                    <div className="flex items-baseline gap-3.5 min-w-0">
                      <span className="text-sm font-semibold text-[#2563EB] shrink-0">
                        {moduleNum}
                      </span>
                      <h3
                        className={textToneClass(
                          cleanHeading(sec.title),
                          'text-base sm:text-[17px] font-semibold text-[#0F172A] leading-snug'
                        )}
                      >
                        {cleanHeading(sec.title)}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#64748B] shrink-0 transition-transform duration-200 ${
                        open ? 'rotate-180 text-[#1D4ED8]' : ''
                      }`}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={panelId}
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                      open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-6 pt-1 space-y-4">
                        {introBlocks.length > 0 && (
                          <div className="space-y-3 max-w-[68ch]">
                            {introBlocks.map((b, bi) => renderFlatBlock(b, bi))}
                          </div>
                        )}

                        {chapterBlocks.length > 0 && (
                          <div className="divide-y divide-[#E3E8EF] border-t border-[#E3E8EF]">
                            {chapterBlocks.map((ch, ci) => renderFlatBlock(ch, ci))}
                          </div>
                        )}

                        {otherListBlocks.length > 0 && (
                          <div className="space-y-3 pt-1">
                            {otherListBlocks.map((b, li) => renderFlatBlock(b, li))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Session-by-Session Learning Plan */}
      {sessionSections.length > 0 && (
        <section id="section-sessions" className={`${flatSectionClass} space-y-5`}>
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
            Live Cohort Roadmap
          </p>
          {sessionSections.map((sec, idx) => (
            <div
              key={sec.id}
              className={idx > 0 ? 'pt-6 border-t border-[#E3E8EF] space-y-4' : 'space-y-4'}
            >
              <h2 className="text-[22px] lg:text-[28px] font-bold text-[#0F172A]">
                {cleanHeading(sec.title)}
              </h2>
              <div className="space-y-4">{sec.blocks.map((b, i) => renderFlatBlock(b, i))}</div>
            </div>
          ))}
        </section>
      )}

      {/* Practical Activities, Case Studies, Assessment & Resources */}
      {practicalSections.length > 0 && (
        <section id="section-practical" className={`${flatSectionClass} space-y-8`}>
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
            Applied Learning &amp; Evaluation
          </p>
          {practicalSections.map((sec, idx) => (
            <div
              key={sec.id}
              className={idx > 0 ? 'pt-8 border-t border-[#E3E8EF] space-y-4' : 'space-y-4'}
            >
              <h2 className="text-[22px] lg:text-[28px] font-bold text-[#0F172A]">
                {cleanHeading(sec.title)}
              </h2>
              <div className="space-y-4">
                {sec.blocks.map((b, i) => renderFlatBlock(b, i))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Certificate Information */}
      <section id="section-certificate" className={`${flatSectionClass} space-y-4`}>
        <div className="space-y-1.5">
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
            Institutional Recognition
          </p>
          <h2 className="text-[22px] lg:text-[28px] font-bold text-[#0F172A]">
            {certificateType}
          </h2>
        </div>

        <div className="space-y-3 max-w-[68ch]">
          {certificateSections.length > 0 ? (
            certificateSections.map((sec) =>
              sec.blocks.map((b, idx) => renderFlatBlock(b, idx))
            )
          ) : (
            <p className="text-[15px] sm:text-base text-[#334155] leading-relaxed">
              Participants who fulfil attendance and practical completion requirements receive an institutional {certificateType} issued by Atlas AI Education.
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-[#E3E8EF] flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-[#64748B]">
            {infoCertStatus} institutional credential · Unique verification ID
          </span>
          <Link
            to="/verify-certificate"
            className="text-[#1D4ED8] hover:text-[#1E40AF] font-semibold inline-flex items-center gap-1.5 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
          >
            Verify Certificate Authenticity
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Who Should Enrol & Prerequisites */}
      {eligibilitySections.length > 0 && (
        <section id="section-eligibility" className={`${flatSectionClass} space-y-8`}>
          <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
            Participant Fit &amp; Requirements
          </p>
          {eligibilitySections.map((sec, idx) => (
            <div
              key={sec.id}
              className={idx > 0 ? 'pt-8 border-t border-[#E3E8EF] space-y-4' : 'space-y-4'}
            >
              <h2 className="text-[22px] lg:text-[28px] font-bold text-[#0F172A]">
                {cleanHeading(sec.title)}
              </h2>
              <div className="space-y-4">
                {sec.blocks.map((b, i) => renderFlatBlock(b, i))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Frequently Asked Questions */}
      {faqSections.length > 0 && (
        <section id="section-faq" className={`${flatSectionClass} space-y-5`}>
          <div className="space-y-1.5">
            <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
              Course Q&amp;A
            </p>
            <h2 className="text-[22px] lg:text-[28px] font-bold text-[#0F172A]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF]">
            {faqSections
              .flatMap((sec) => renderFaqItems(sec.blocks))
              .map((item, idx) => {
                const isOpen = Boolean(openFaqs[idx]);
                const panelId = `faq-panel-${idx}`;
                return (
                  <div
                    key={idx}
                    className={`transition-colors duration-150 ${
                      isOpen ? 'border-l-[3px] border-l-[#1D4ED8] pl-4 sm:pl-5' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="w-full py-4 min-h-[52px] flex items-center justify-between gap-4 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
                    >
                      <span
                        className={textToneClass(
                          item.q,
                          'font-semibold text-[15px] sm:text-base text-[#0F172A]'
                        )}
                      >
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#64748B] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#1D4ED8]' : ''
                        }`}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={panelId}
                      className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        {item.a.length > 0 && (
                          <div className="pb-4 space-y-2 max-w-[68ch]">
                            {item.a.map((ans, ai) => (
                              <p
                                key={ai}
                                className={textToneClass(
                                  ans,
                                  'text-[15px] text-[#334155] leading-[1.6]'
                                )}
                              >
                                {ans}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Final Enrolment Section */}
      {enrolmentSections.length > 0 && (
        <section id="section-enrolment" className={`${flatSectionClass} space-y-5`}>
          <div className="space-y-1.5">
            <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
              Cohort Enrolment
            </p>
            <h2 className="text-[22px] lg:text-[28px] font-bold text-[#0F172A]">
              {cleanHeading(enrolmentSections[0].title)}
            </h2>
          </div>

          <div className="space-y-3 max-w-[68ch]">
            {enrolmentSections.map((sec) =>
              sec.blocks.map((b, i) => renderFlatBlock(b, i))
            )}
          </div>

          {onOpenEnrolModal && (
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3">
              <button
                type="button"
                onClick={onOpenEnrolModal}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D4ED8]"
              >
                {isFreeSpecialized
                  ? 'Enrol for Free (BDT 0)'
                  : `Enrol Now — BDT ${(discountedFeeBdt ?? 0).toLocaleString()}`}
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
              {isFreeSpecialized && (
                <Link
                  to="/contact"
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 inline-flex items-center justify-center gap-2 text-sm sm:text-[15px] font-semibold text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F7F9FC] rounded-[8px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                >
                  Contact for Enquiries
                </Link>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
