import generatedData from './generatedCatalogue.json';

export interface CourseItem {
  id: string;
  code: string;
  title: string;
  fullTitle: string;
  slug: string;
  route: string;
  altSlugRoute: string;
  categoryId: string;
  categoryName: string;
  level: string;
  duration: string;
  sessions: string;
  language: string;
  cohortMax: number;
  certificateType: string;
  certificateStatus: string;
  regularFeeBdt: number;
  discountedFeeBdt: number;
  savingsBdt: number;
  scholarshipEligible: boolean;
  rawSourceContent: string;
}

export interface SpecializedProgrammeItem {
  id: string;
  number: number;
  code: string;
  title: string;
  focus: string;
  route: string;
  slug: string;
  duration: string;
  sessions: string;
  level: string;
  feeBdt: number;
  feeLabel: string;
  eligibility: string;
  language: string;
  certificateType: string;
  scholarshipEligible: boolean;
  rawSourceContent: string;
}

export interface ProgrammeCategoryMeta {
  id: string;
  slug: string;
  route: string;
  name: string;
  shortLabel: string;
  summary: string;
  badgeText: string;
  courseCodes: string[];
}

export const COURSES: CourseItem[] = generatedData.courses as CourseItem[];
export const SPECIALIZED_PROGRAMMES: SpecializedProgrammeItem[] =
  generatedData.specialized as SpecializedProgrammeItem[];

export const PROGRAMME_CATEGORIES: ProgrammeCategoryMeta[] = [
  {
    id: 'ai_literacy_foundation',
    slug: 'foundation',
    route: '/programmes/foundation',
    name: 'AI Literacy & Foundation',
    shortLabel: 'Foundation',
    summary:
      'Beginner-friendly 1-month live cohorts covering Generative AI, Prompt Engineering, everyday productivity, and AI ethics & safety.',
    badgeText: '1 Month · 8 Live Classes · BDT 999 (Reg. BDT 1,500)',
    courseCodes: ['AL-101', 'AL-102', 'AL-103', 'AL-104'],
  },
  {
    id: 'applied_ai',
    slug: 'applied-ai',
    route: '/programmes/applied-ai',
    name: 'Applied AI',
    shortLabel: 'Applied AI',
    summary:
      'Hands-on 2-month applied cohorts focused on content creation, business workflows, automation, web development, data analysis, research, and prototyping.',
    badgeText: '2 Months · 14 Sessions · BDT 1,200 (Reg. BDT 1,900)',
    courseCodes: ['AAI-201', 'AAI-202', 'AAI-203', 'AAI-204', 'AAI-205', 'AAI-206', 'AAI-207'],
  },
  {
    id: 'professional_development',
    slug: 'professional-development',
    route: '/programmes/professional-development',
    name: 'Professional Development',
    shortLabel: 'Professional',
    summary:
      'Executive and practitioner-focused 2-month programmes spanning workplace productivity, leadership, project management, marketing, HR, and finance.',
    badgeText: '2 Months · 18 Sessions · BDT 2,200 (Reg. BDT 3,000)',
    courseCodes: ['PD-301', 'PD-302', 'PD-303', 'PD-304', 'PD-305', 'PD-306', 'PD-307'],
  },
  {
    id: 'specialized_catalogue',
    slug: 'governance-public-sector',
    route: '/programmes/foundation',
    name: 'AI Governance & Public Sector Track',
    shortLabel: 'Governance & Policy',
    summary:
      'Specialised paid governance, public administration transformation, and justice/legal sector programmes (AG-101 to AG-104).',
    badgeText: '6 Weeks – 2 Months · BDT 1,800 – 4,200',
    courseCodes: ['AG-101', 'AG-102', 'AG-103', 'AG-104'],
  },
];

// Map explicit education.atlasai.institute target URL slugs where shortened
const SLUG_ALIASES: Record<string, string> = {
  'ai-business-entrepreneurship': 'AAI-202',
  'ai-automation-workflow-design': 'AAI-203',
  'ai-powered-website-development': 'AAI-204',
  'ai-powered-content-creation': 'AAI-201',
  'al-100': 'AG-101',
};

export function hasBangla(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

// Repairs PDF-extracted mid-word glyph spaces in Bangla words without altering any wording or phrasing
const BANGLA_SPLIT_FIXES: ReadonlyArray<[RegExp, string]> = [
  [/কৃ ত্রিম/g, 'কৃত্রিম'],
  [/প্রকৃ তি/g, 'প্রকৃতি'],
  [/প্রকৃ ত/g, 'প্রকৃত'],
  [/নির্ভু ল/g, 'নির্ভুল'],
  [/ভু ল/g, 'ভুল'],
  [/ভু য়া/g, 'ভুয়া'],
  [/ভু ক্তভ/g, 'ভুক্তভ'],
  [/নতু ন/g, 'নতুন'],
  [/ভূ মিকা/g, 'ভূমিকা'],
  [/পটভূ মি/g, 'পটভূমি'],
  [/কেন্দ্রীভূ ত/g, 'কেন্দ্রীভূত'],
  [/বহির্ভূ ত/g, 'বহির্ভূত'],
  [/অন্তর্ভু ক্তি/g, 'অন্তর্ভুক্তি'],
  [/অন্তর্ভু ক্ত/g, 'অন্তর্ভুক্ত'],
  [/তালিকাভু ক্ত/g, 'তালিকাভুক্ত'],
  [/নথিভু ক্ত/g, 'নথিভুক্ত'],
  [/যাচাইকৃ ত/g, 'যাচাইকৃত'],
  [/ইচ্ছাকৃ ত/g, 'ইচ্ছাকৃত'],
  [/অনিচ্ছাকৃ ত/g, 'অনিচ্ছাকৃত'],
  [/ব্যক্তিগতকৃ ত/g, 'ব্যক্তিগতকৃত'],
  [/স্বীকৃ তি/g, 'স্বীকৃতি'],
  [/কৃ তিত্/g, 'কৃতিত্'],
  [/বিকৃ ত/g, 'বিকৃত'],
  [/সংস্কৃ তি/g, 'সংস্কৃতি'],
  [/সাংস্কৃ তিক/g, 'সাংস্কৃতিক'],
  [/উদ্ধৃ তি/g, 'উদ্ধৃতি'],
  [/অন্তর্দৃ ষ্টি/g, 'অন্তর্দৃষ্টি'],
  [/নেতৃ ত্ব/g, 'নেতৃত্ব'],
  [/ডকু মেন্/g, 'ডকুমেন্'],
  [/রিক্রু টমেন/g, 'রিক্রুটমেন'],
  [/ডু প্লি/g, 'ডুপ্লি'],
  [/কু ইজ/g, 'কুইজ'],
  [/তৃ তীয়/g, 'তৃতীয়'],
  [/চতু র্থ/g, 'চতুর্থ'],
  [/কর্তৃ পক্ষ/g, 'কর্তৃপক্ষ'],
  [/অক্ষু ণ্ণ/g, 'অক্ষুণ্ণ'],
  [/আকৃ ষ্ট/g, 'আকৃষ্ট'],
  [/তু লনা/g, 'তুলনা'],
  [/তু লতে/g, 'তুলতে'],
  [/তু লবেন/g, 'তুলবেন'],
  [/তু লনাম/g, 'তুলনাম'],
  [/তু লে/g, 'তুলে'],
  [/দিকনির্দে শনা/g, 'দিকনির্দেশনা'],
  [/নির্দে শনা/g, 'নির্দেশনা'],
  [/নির্দে শিকা/g, 'নির্দেশিকা'],
  [/সুনির্দি ষ্ট/g, 'সুনির্দিষ্ট'],
  [/নির্দি ষ্ট/g, 'নির্দিষ্ট'],
  [/নির্ভ র/g, 'নির্ভর'],
  [/মার্কে টিং/g, 'মার্কেটিং'],
  [/মার্কে টার/g, 'মার্কেটার'],
  [/মার্কে ট/g, 'মার্কেট'],
  [/সার্ভি স/g, 'সার্ভিস'],
  [/সম্পর্কি ত/g, 'সম্পর্কিত'],
  [/অর্ডি নেটর/g, 'অর্ডিনেটর'],
  [/অ্যাকর্ডি য়ন/g, 'অ্যাকর্ডিয়ন'],
  [/আর্কি টেকচা/g, 'আর্কিটেকচা'],
  [/বর্ত মান/g, 'বর্তমান'],
  [/আন্তর্জা তিক/g, 'আন্তর্জাতিক'],
  [/পরিবর্ত ন/g, 'পরিবর্তন'],
  [/বিবর্ত ন/g, 'বিবর্তন'],
  [/বিতর্কি ত/g, 'বিতর্কিত'],
  [/সতর্ক তা/g, 'সতর্কতা'],
  [/সতর্ক ভাবে/g, 'সতর্কভাবে'],
  [/শর্ত গুলো/g, 'শর্তগুলো'],
  [/শর্ত পূরণ/g, 'শর্তপূরণ'],
  [/মুহূর্তে ই/g, 'মুহূর্তেই'],
  [/কার্ডে র/g, 'কার্ডের'],
  [/ওয়ার্ক ফ্লো/g, 'ওয়ার্কফ্লো'],
  [/ওয়ার্ক শিট/g, 'ওয়ার্কশিট'],
  [/রিপোর্টি ং/g, 'রিপোর্টিং'],
  [/প্ল্যাটফর্মে/g, 'প্ল্যাটফর্মে'],
  [/বুঝু ন/g, 'বুঝুন'],
  [/তু লুন/g, 'তুলুন'],
  [/যু ক্ত/g, 'যুক্ত'],
  [/মুল্য/g, 'মূল্য'],
];

export function fixBanglaText(text: string): string {
  if (!text || !hasBangla(text)) return text;
  let out = text;
  for (const [pattern, replacement] of BANGLA_SPLIT_FIXES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function getCourseByParam(param: string | undefined): CourseItem | undefined {
  if (!param) return undefined;
  const normalized = param.toLowerCase().replace(/\/$/, '');
  const aliasCode = SLUG_ALIASES[normalized];
  if (aliasCode) {
    return COURSES.find((c) => c.code === aliasCode);
  }
  return COURSES.find(
    (c) =>
      c.code.toLowerCase() === normalized ||
      c.slug.toLowerCase() === normalized ||
      c.id.toLowerCase() === normalized
  );
}

export function getSpecializedByParam(param: string | undefined): SpecializedProgrammeItem | undefined {
  if (!param) return undefined;
  const normalized = param.toLowerCase().replace(/\/$/, '');
  return SPECIALIZED_PROGRAMMES.find(
    (p) =>
      p.slug.toLowerCase() === normalized ||
      p.code.toLowerCase() === normalized ||
      p.id.toLowerCase() === normalized
  );
}

export function getCoursesByCategory(categorySlug: string): CourseItem[] {
  if (categorySlug === 'foundation') {
    return COURSES.filter((c) => c.categoryId === 'ai_literacy_foundation' || c.code === 'AG-101');
  }
  if (categorySlug === 'applied-ai') {
    return COURSES.filter((c) => c.categoryId === 'applied_ai');
  }
  if (categorySlug === 'professional-development') {
    return COURSES.filter(
      (c) =>
        c.categoryId === 'professional_development' ||
        ['AG-102', 'AG-103', 'AG-104'].includes(c.code)
    );
  }
  return COURSES;
}

export function getCategoryRouteForCourse(course: CourseItem): { label: string; to: string } {
  if (course.categoryId === 'applied_ai') {
    return { label: 'Applied AI', to: '/programmes/applied-ai' };
  }
  if (course.categoryId === 'professional_development') {
    return { label: 'Professional Development', to: '/programmes/professional-development' };
  }
  if (['AG-102', 'AG-103', 'AG-104'].includes(course.code)) {
    return { label: 'Professional & Public Sector', to: '/programmes/professional-development' };
  }
  return { label: 'AI Literacy & Foundation', to: '/programmes/foundation' };
}

export function getRelatedCourses(course: CourseItem, limit = 3): CourseItem[] {
  const sameCategory = COURSES.filter(
    (c) => c.categoryId === course.categoryId && c.code !== course.code
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = COURSES.filter((c) => c.code !== course.code && !sameCategory.includes(c));
  return [...sameCategory, ...others].slice(0, limit);
}

export type SectionCategory =
  | 'info'
  | 'overview'
  | 'outcomes'
  | 'curriculum'
  | 'sessions'
  | 'practical'
  | 'assessment'
  | 'certificate'
  | 'eligibility'
  | 'faq'
  | 'enrolment'
  | 'other';

export interface ParsedSection {
  id: string;
  title: string;
  category: SectionCategory;
  blocks: ParsedBlock[];
}

export type ParsedBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'chapter'; code: string; title: string; description: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'table'; headers: string[]; rows: string[][] };

const SKIP_SECTION_PATTERN =
  /^(A\.\s*Course Hero(?:\s*Section)?|Course Hero|1\.\s*Hero Section|C\.\s*Course Fee|Course Fee)$/i;

const KNOWN_TOP_HEADINGS = [
  'Course Hero',
  'A. Course Hero Section',
  'A. Course Hero',
  '1. Hero Section',
  'Course Information',
  'B. Course Information',
  '3. Programme Information',
  'C. Course Fee',
  'Course Fee',
  'Course Overview',
  'D. Course Overview',
  '2. Programme Overview',
  'Who This Course Is For',
  'Who Should Enrol',
  'Who Should Enrol?',
  'E. Who This Course Is For',
  '4. Target Audience',
  'L. Who Should Enrol?',
  'M. Who Should Enrol?',
  'What You Will Learn',
  'E. What You Will Learn',
  '5. Learning Objectives',
  '6. Learning Outcomes',
  'Learning Outcomes',
  'F. Learning Outcomes',
  'Complete Curriculum',
  'F. Curriculum & Modules',
  'G. Complete Curriculum',
  '7. Four-Class Detailed Curriculum',
  'Session-by-Session Breakdown',
  'Eight-Class Learning Plan',
  'G. Complete Session Plan',
  'G. 14-Session Learning Plan',
  'G. Complete 18-Session Learning Plan',
  'G. Complete 14-Session Learning Plan',
  'H. Session-by-Session Breakdown',
  'Practical Learning Activities',
  'H. Practical Learning Activities',
  '8. Practical Learning Activities',
  'I. Practical Activities & Exercises',
  'Case Studies',
  'I. Case Studies',
  'I. Case Studies & Professional Scenarios',
  'Skills You Will Explore',
  '9. Skills You Will Explore',
  'Assessment & Learning Evaluation',
  'I. Assessment & Learning Evaluation',
  'J. Assessment & Learning Evaluation',
  'J. Assessment & Completion Requirements',
  'Practical Applications',
  'J. Practical Applications',
  'K. Practical Applications',
  'K. Professional Applications',
  '10. Learning Applications',
  '11. Safety, Trauma-Informed Principles & Bangladesh Support References',
  'Bangladesh Legal & Support Directory',
  'Certificate Information',
  'K. Certificate Information',
  'L. Certificate Information',
  '11. Certificate Information',
  '12. Certificate Information',
  'Prerequisites',
  'M. Prerequisites',
  'N. Prerequisites',
  'K. Tools or Resources Required',
  'Frequently Asked Questions',
  'N. Frequently Asked Questions',
  'O. Frequently Asked Questions',
  '13. Frequently Asked Questions',
  'Final Enrolment Section',
  'O. Enrolment Section',
  '14. Enrolment Section',
  'Enrolment Section',
];

function classifySection(title: string): SectionCategory {
  const t = title.toLowerCase();
  if (/^(?:[a-z]\.\s*)?(?:curriculum|complete curriculum|four-class)|^module\s*\d+|^class\s*\d+\s*[—–-]/.test(t))
    return 'curriculum';
  if (/certificate/.test(t)) return 'certificate';
  if (/course information|programme information|^\d+\.\s*programme information|^[a-z]\.\s*course information/.test(t) || /\binformation\b/.test(t))
    return 'info';
  if (/overview/.test(t)) return 'overview';
  if (/what you will learn|outcome|objective|skills you will/.test(t)) return 'outcomes';
  if (/session.*plan|session-by-session|learning plan/.test(t)) return 'sessions';
  if (/practical|case stud|application|resources library|skill library/.test(t)) return 'practical';
  if (/assessment|evaluation/.test(t)) return 'assessment';
  if (/who should|target audience|who this|prerequisite|tools|support|safety|confidentiality/.test(t))
    return 'eligibility';
  if (/frequently asked|faq/.test(t)) return 'faq';
  if (/enrolment section|registration/.test(t)) return 'enrolment';
  return 'other';
}

const NUMBERED_TOP_HEADING_RE =
  /^\d+\.\s+(?:Hero|Programme|Target|Learning\s+(?:Objectives|Outcomes)|Four-Class|Practical|Skills|Safety|Bangladesh|Certificate|Frequently|Enrolment)/i;

function isMajorHeading(line: string): boolean {
  const trimmed = line.trim().replace(/^#+\s*/, '').replace(/\*\*/g, '');
  if (!trimmed || trimmed.length > 115 || trimmed.includes('|')) return false;
  if (/^(?:Section\s+\d+|[A-Z]\.\s+[A-Z]|(?:Module|Week)\s+\d+\s*:|Class\s+\d+\s*[—–-])/.test(trimmed)) {
    return true;
  }
  if (/^(?:Eight|Six|Twelve|Fourteen|Eighteen|\d+)-Class\s+Learning\s+Plan$/i.test(trimmed)) {
    return true;
  }
  if (NUMBERED_TOP_HEADING_RE.test(trimmed)) {
    return true;
  }
  return KNOWN_TOP_HEADINGS.some((h) => h.toLowerCase() === trimmed.toLowerCase());
}

const CHAPTER_LINE_RE = /^(?:[-*•]\s+)?(Chapter\s+\d+\.\d+)\s*[—–-]\s*(.+)$/i;

function parseChapterHeader(text: string): { code: string; title: string; inlineDesc: string } | null {
  const m = text.match(CHAPTER_LINE_RE);
  if (!m) return null;
  const code = m[1].trim();
  const rest = m[2].trim();
  const colonIdx = rest.indexOf(':');
  if (colonIdx > 0 && colonIdx < 110) {
    return {
      code,
      title: fixBanglaText(rest.slice(0, colonIdx).trim()),
      inlineDesc: fixBanglaText(rest.slice(colonIdx + 1).trim()),
    };
  }
  return {
    code,
    title: fixBanglaText(rest),
    inlineDesc: '',
  };
}

function splitUnescapedPipes(line: string): string[] {
  const cells: string[] = [];
  let buf = '';
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '\\' && line[i + 1] === '|') {
      buf += '|';
      i++;
    } else if (line[i] === '|') {
      cells.push(buf);
      buf = '';
    } else {
      buf += line[i];
    }
  }
  cells.push(buf);
  return cells;
}

function countUnescapedPipes(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && s[i + 1] === '|') {
      i++;
    } else if (s[i] === '|') {
      n++;
    }
  }
  return n;
}

function isSeparatorFragment(line: string): boolean {
  const t = line.trim();
  return t.length > 0 && /^[\s:|*-]+$/.test(t) && /-/.test(t);
}

function normalizeMarkdownTables(rawLines: string[]): string[] {
  const out: string[] = [];
  let idx = 0;

  while (idx < rawLines.length) {
    const trimmed = rawLines[idx].trim();
    if (!trimmed.startsWith('|')) {
      out.push(rawLines[idx]);
      idx++;
      continue;
    }

    // Look ahead up to 12 lines for a Markdown separator row starting with "| :---" or "|---"
    let sepStart = -1;
    for (let k = idx + 1; k < Math.min(rawLines.length, idx + 14); k++) {
      const kt = rawLines[k].trim();
      if (/^\|\s*:?-{2,}/.test(kt)) {
        sepStart = k;
        break;
      }
      if (isMajorHeading(kt)) break;
    }

    if (sepStart === -1) {
      out.push(rawLines[idx]);
      idx++;
      continue;
    }

    // 1. Join header lines from idx .. sepStart - 1
    const headerParts: string[] = [];
    for (let k = idx; k < sepStart; k++) {
      const kt = rawLines[k].trim();
      if (kt) headerParts.push(kt);
    }
    const headerLine = headerParts.join(' ').replace(/\s+/g, ' ').trim();

    // 2. Skip wrapped separator lines starting at sepStart (including an isolated blank line mid-separator)
    let sepEnd = sepStart;
    while (sepEnd < rawLines.length) {
      if (isSeparatorFragment(rawLines[sepEnd])) {
        sepEnd++;
      } else if (
        rawLines[sepEnd].trim() === '' &&
        sepEnd + 1 < rawLines.length &&
        isSeparatorFragment(rawLines[sepEnd + 1])
      ) {
        sepEnd++;
      } else {
        break;
      }
    }
    const sepLine = rawLines
      .slice(sepStart, sepEnd)
      .map((l) => l.trim())
      .join(' ');

    const headerCols = splitUnescapedPipes(headerLine.replace(/^\|/, '').replace(/\|$/, '')).length;
    const sepCols = splitUnescapedPipes(sepLine.replace(/^\|/, '').replace(/\|$/, '')).length;
    const numCols = Math.max(headerCols, sepCols);
    const expectedPipes = numCols + 1;

    out.push(headerLine);
    out.push(`| ${Array.from({ length: numCols }, () => '---').join(' | ')} |`);

    // 3. Rejoin each data row until it reaches expectedPipes unescaped pipes
    idx = sepEnd;
    while (idx < rawLines.length) {
      const curTrim = rawLines[idx].trim();
      if (!curTrim) {
        // Peek ahead past blanks to see if another table row follows immediately
        let nextNonBlank = idx + 1;
        while (nextNonBlank < rawLines.length && rawLines[nextNonBlank].trim() === '') {
          nextNonBlank++;
        }
        if (
          nextNonBlank < rawLines.length &&
          rawLines[nextNonBlank].trim().startsWith('|') &&
          !isMajorHeading(rawLines[nextNonBlank].trim())
        ) {
          idx = nextNonBlank;
          continue;
        }
        break;
      }

      if (!curTrim.startsWith('|') || isMajorHeading(curTrim)) {
        break;
      }

      let rowStr = curTrim;
      while (countUnescapedPipes(rowStr) < expectedPipes && idx + 1 < rawLines.length) {
        let nextIdx = idx + 1;
        if (rawLines[nextIdx].trim() === '') {
          if (
            nextIdx + 1 < rawLines.length &&
            rawLines[nextIdx + 1].trim() !== '' &&
            !isMajorHeading(rawLines[nextIdx + 1].trim())
          ) {
            nextIdx++;
          } else {
            break;
          }
        }
        const nextLine = rawLines[nextIdx].trim();
        if (!nextLine || isMajorHeading(nextLine)) break;
        // Stop if the next line appears to start a brand-new row cleanly while our row is only missing 1 edge
        rowStr = `${rowStr} ${nextLine}`;
        idx = nextIdx;
      }

      out.push(rowStr);
      idx++;
    }
  }

  return out;
}

export function parseCurriculumDocument(rawText: string): ParsedSection[] {
  if (!rawText) return [];
  const normalized = rawText.replace(/\r\n/g, '\n');
  const appendixIdx = normalized.search(
    /\nInstitutional Quality & Implementation Note:|\nBelow is the complete, publication-ready/i
  );
  const clipped = appendixIdx !== -1 ? normalized.slice(0, appendixIdx) : normalized;
  const rawLines = clipped.split('\n');
  const lines = normalizeMarkdownTables(rawLines);

  const sections: ParsedSection[] = [];
  let current: ParsedSection = {
    id: 'sec-0',
    title: 'Course Hero',
    category: 'other',
    blocks: [],
  };

  let i = 0;
  let paragraphBuf: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuf.length > 0) {
      const joined = fixBanglaText(
        paragraphBuf
          .join(' ')
          .replace(/\[(?:Enrol Now|Contact for Enquiries|Explore Curriculum|Explore Enrolment Availability)\]/gi, '')
          .replace(/\s+/g, ' ')
          .trim()
      );
      if (
        joined &&
        !joined.startsWith('Target URL:') &&
        !joined.startsWith('Existing URL:') &&
        !joined.startsWith('Suggested URL Slug:') &&
        !joined.startsWith('SEO Page Title:') &&
        !joined.startsWith('SEO Meta Description:') &&
        !/^Course\s+\d+:/.test(joined) &&
        !/^Programme\s+\d+:/.test(joined) &&
        !/^\d+\.\s+[A-Z]{2,4}-\d+/.test(joined)
      ) {
        current.blocks.push({ type: 'paragraph', text: joined });
      }
      paragraphBuf = [];
    }
  };

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      i++;
      continue;
    }

    // Markdown table
    if (line.startsWith('|') && line.includes('|', 1)) {
      flushParagraph();
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const parsedRows = tableLines
        .filter((l) => !/^\|[\s:-]+\|/.test(l) && !/^(?:\|\s*-+\s*)+\|$/.test(l))
        .map((l) =>
          splitUnescapedPipes(l.replace(/^\|/, '').replace(/\|$/, '')).map((cell) =>
            fixBanglaText(cell.replace(/\*\*/g, '').replace(/`/g, '').trim())
          )
        );
      if (parsedRows.length >= 2) {
        current.blocks.push({
          type: 'table',
          headers: parsedRows[0],
          rows: parsedRows.slice(1),
        });
      }
      continue;
    }

    // Major heading starts a new section
    if (isMajorHeading(line)) {
      flushParagraph();
      if (current.blocks.length > 0 && !SKIP_SECTION_PATTERN.test(current.title)) {
        sections.push(current);
      }
      const cleanTitle = fixBanglaText(
        line.replace(/^#{1,4}\s*/, '').replace(/\*\*/g, '').trim()
      );
      current = {
        id: `sec-${sections.length + 1}`,
        title: cleanTitle,
        category: classifySection(cleanTitle),
        blocks: [],
      };
      i++;
      continue;
    }

    // Chapter item (both standalone "Chapter 1.1 — Title" and bullet "- Chapter 1.1 — Title: desc")
    const chParsed = parseChapterHeader(line.replace(/\*\*/g, ''));
    if (chParsed) {
      flushParagraph();
      const isBulletChapter = /^[-*•]\s+/.test(line);
      const descParts: string[] = chParsed.inlineDesc ? [chParsed.inlineDesc] : [];
      i++;

      // Skip at most one blank line if a standalone chapter heading has its description after a blank line
      if (!isBulletChapter && descParts.length === 0 && i < lines.length && lines[i].trim() === '') {
        const peek = lines[i + 1]?.trim() || '';
        if (
          peek &&
          !peek.startsWith('|') &&
          !isMajorHeading(peek) &&
          !CHAPTER_LINE_RE.test(peek.replace(/\*\*/g, '')) &&
          !/^[-*•]\s+/.test(peek)
        ) {
          i++;
        }
      }

      while (i < lines.length) {
        const nextRaw = lines[i];
        const nextTrim = nextRaw.trim();
        if (!nextTrim) {
          const afterBlank = lines[i + 1]?.trim() || '';
          if (
            !isBulletChapter &&
            afterBlank &&
            !afterBlank.startsWith('|') &&
            !isMajorHeading(afterBlank) &&
            !CHAPTER_LINE_RE.test(afterBlank.replace(/\*\*/g, '')) &&
            !/^[-*•]\s+/.test(afterBlank) &&
            !/^\d+\.\s+/.test(afterBlank) &&
            !/^(?:Module|Class|Session)\s+\d+/i.test(afterBlank)
          ) {
            i++;
            continue;
          }
          i++;
          break;
        }
        if (
          nextTrim.startsWith('|') ||
          isMajorHeading(nextTrim) ||
          CHAPTER_LINE_RE.test(nextTrim.replace(/\*\*/g, '')) ||
          /^[-*•]\s+/.test(nextTrim)
        ) {
          break;
        }
        if (isBulletChapter && !/^\s{2,}/.test(nextRaw)) {
          break;
        }
        descParts.push(nextTrim.replace(/\*\*/g, ''));
        i++;
      }

      current.blocks.push({
        type: 'chapter',
        code: chParsed.code,
        title: chParsed.title,
        description: fixBanglaText(descParts.join(' ').replace(/\s+/g, ' ').trim()),
      });
      continue;
    }

    // Bullet list (preserving multi-line continuations)
    if (/^[-*•]\s+/.test(line)) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length) {
        const curRaw = lines[i];
        const cur = curRaw.trim();
        if (CHAPTER_LINE_RE.test(cur.replace(/\*\*/g, ''))) {
          break;
        }
        if (/^[-*•]\s+/.test(cur)) {
          items.push(fixBanglaText(cur.replace(/^[-*•]\s+/, '').replace(/\*\*/g, '')));
          i++;
        } else if (
          cur &&
          !cur.startsWith('|') &&
          !isMajorHeading(cur) &&
          items.length > 0 &&
          !/^\d+\.\s+/.test(cur)
        ) {
          items[items.length - 1] = fixBanglaText(
            `${items[items.length - 1]} ${cur.replace(/\*\*/g, '')}`
          );
          i++;
        } else {
          break;
        }
      }
      const cleanItems = items.filter(
        (it) => !/^(CTA:|Target URL:|Existing URL:|Suggested URL Slug:|SEO Page|SEO Meta)/i.test(it)
      );
      if (cleanItems.length > 0) {
        current.blocks.push({ type: 'list', ordered: false, items: cleanItems });
      }
      continue;
    }

    // Numbered list items inside non-FAQ, non-Hero sections (e.g. Learning Outcomes "1. Generative AI...", "2. ...")
    if (
      current.category !== 'faq' &&
      !SKIP_SECTION_PATTERN.test(current.title) &&
      /^\d+\.\s+/.test(line) &&
      !/^\d+\.\s+[A-Z]{2,4}-\d+/.test(line)
    ) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length) {
        const cur = lines[i].trim();
        if (!cur) {
          i++;
          break;
        }
        if (
          cur.startsWith('|') ||
          isMajorHeading(cur) ||
          /^[-*•]\s+/.test(cur) ||
          CHAPTER_LINE_RE.test(cur.replace(/\*\*/g, ''))
        ) {
          break;
        }
        if (/^\d+\.\s+/.test(cur)) {
          items.push(fixBanglaText(cur.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim()));
          i++;
        } else if (items.length > 0) {
          items[items.length - 1] = fixBanglaText(
            `${items[items.length - 1]} ${cur.replace(/\*\*/g, '')}`
          );
          i++;
        } else {
          break;
        }
      }
      if (items.length > 0) {
        current.blocks.push({ type: 'list', ordered: true, items });
      }
      continue;
    }

    // Subheading
    if (/^#{1,4}\s+/.test(line) || /^(Session\s+\d+|Class\s+\d+|Topic\s+\d+)/i.test(line)) {
      flushParagraph();
      current.blocks.push({
        type: 'subheading',
        text: fixBanglaText(line.replace(/^#{1,4}\s*/, '').replace(/\*\*/g, '')),
      });
      i++;
      continue;
    }

    paragraphBuf.push(line.replace(/\*\*/g, ''));
    i++;
  }

  flushParagraph();
  if (current.blocks.length > 0 && !SKIP_SECTION_PATTERN.test(current.title)) {
    sections.push(current);
  }
  return sections;
}

function extractHeroParagraphs(course: CourseItem): string[] {
  const txt = (course.rawSourceContent || '').replace(/\r\n/g, '\n');
  const heroMatch = txt.match(/\nCourse Hero\n([\s\S]*?)(?=\nCourse Information\b)/i);
  if (!heroMatch) return [];
  return heroMatch[1]
    .split(/\n\s*\n/)
    .map((p) => fixBanglaText(p.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()))
    .filter(
      (p) =>
        p.length > 0 &&
        !/^\[(?:Enrol Now|View Curriculum|Explore)/i.test(p)
    );
}

export function extractCourseSubtitle(course: CourseItem): string {
  const txt = course.rawSourceContent || '';
  const multiMatch = txt.match(/-\s*Course Subtitle:\s*([\s\S]*?)(?=\n\s*-\s*Course|\n\n)/i);
  if (multiMatch) {
    return fixBanglaText(multiMatch[1].replace(/\s+/g, ' ').trim());
  }
  const heroParagraphs = extractHeroParagraphs(course);
  if (heroParagraphs.length >= 2) {
    return heroParagraphs[1];
  }
  return course.categoryName;
}

export function extractCourseSummary(course: CourseItem): string {
  const txt = course.rawSourceContent || '';
  const descMatch = txt.match(/Course Description:\s*([\s\S]*?)(?=\n\s*-\s*(?:Duration|Total|Course Fee|CTA))/i);
  if (descMatch) return fixBanglaText(descMatch[1].replace(/\s+/g, ' ').trim());
  const heroParagraphs = extractHeroParagraphs(course);
  if (heroParagraphs.length >= 3) {
    return heroParagraphs[2];
  }
  const subtitle = extractCourseSubtitle(course).trim().toLowerCase();
  const titleLower = course.title.trim().toLowerCase();
  const lines = txt
    .split('\n')
    .map((l) => fixBanglaText(l.trim()))
    .filter(
      (l) =>
        l.length > 55 &&
        !l.startsWith('|') &&
        !l.startsWith('Target URL') &&
        !l.startsWith('Existing URL') &&
        !l.startsWith('- Course') &&
        l.toLowerCase() !== subtitle &&
        l.toLowerCase() !== titleLower
    );
  return lines[0] || '';
}

export function extractSpecializedSummary(prog: SpecializedProgrammeItem): string {
  const txt = prog.rawSourceContent || '';
  const match = txt.match(/Short Description:\s*([\s\S]*?)(?=\n\s*-\s*CTA|\n\n)/i);
  if (match) return fixBanglaText(match[1].replace(/\s+/g, ' ').trim());
  return fixBanglaText(prog.focus);
}
