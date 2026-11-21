export type ResourceCategoryId =
  | 'ebooks'
  | 'prompt-library'
  | 'guides-toolkits'
  | 'templates-worksheets'
  | 'research-reference';

export interface ResourceCategoryTab {
  id: ResourceCategoryId;
  label: string;
  countLabel: string;
  isPublished: boolean;
}

export interface ResourceItem {
  id: string;
  code: string;
  type: 'eBook' | 'Prompt';
  categoryId: 'ebooks' | 'prompt-library';
  topicCategory: string;
  title: string;
  language: 'Bangla' | 'English' | 'Bilingual (BN / EN)';
  level: 'Beginner' | 'Beginner to Intermediate' | 'Intermediate' | 'Advanced';
  description: string;
  intendedAudience: string;
  whatYouWillLearn: string[];
  format: string;
  publicationStatus: 'published';
  accessStatus: 'locked';
  previewAvailable: boolean;
  previewExcerpt: string;
}

export interface UpcomingCollection {
  categoryId: 'guides-toolkits' | 'templates-worksheets' | 'research-reference';
  categoryTitle: string;
  status: 'Coming Soon';
  items: string[];
}

export const RESOURCE_CATEGORIES: ResourceCategoryTab[] = [
  { id: 'ebooks', label: 'eBooks', countLabel: '10 Resources', isPublished: true },
  { id: 'prompt-library', label: 'Prompt Library', countLabel: '15 Resources', isPublished: true },
  { id: 'guides-toolkits', label: 'Guides & Toolkits', countLabel: 'Coming Soon', isPublished: false },
  { id: 'templates-worksheets', label: 'Templates & Worksheets', countLabel: 'Coming Soon', isPublished: false },
  { id: 'research-reference', label: 'Research & Reference Materials', countLabel: 'Coming Soon', isPublished: false },
];

export const RESOURCES: ResourceItem[] = [
  // 10 eBooks (pages 365-368)
  {
    id: 'ebook-01',
    code: 'eBook 01',
    type: 'eBook',
    categoryId: 'ebooks',
    topicCategory: 'AI Literacy & Basics',
    title: 'AI Fundamentals: A Beginner’s Handbook in Plain Language',
    language: 'Bilingual (BN / EN)',
    level: 'Beginner',
    description:
      'একদম নতুন শিক্ষার্থীদের জন্য Artificial Intelligence, Machine Learning এবং Generative AI-এর মূল ধারণা সহজ বাংলা ও ইংরেজি উদাহরণসহ ব্যাখ্যা করা হয়েছে।',
    intendedAudience: 'First-time learners, college & university students, and non-technical readers.',
    whatYouWillLearn: [
      'Core distinction between traditional software, Machine Learning, and Generative AI',
      'Plain-language bilingual examples of real-world AI systems in Bangladesh and globally',
      'Common limitations, risks, and responsible starting habits for everyday learners',
    ],
    format: 'Digital Handbook (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt:
      'Chapter 1 Overview: Artificial Intelligence refers to computer systems designed to recognise patterns, process language, and support decisions — yet understanding what AI cannot verify is just as important as knowing how to prompt it.',
  },
  {
    id: 'ebook-02',
    code: 'eBook 02',
    type: 'eBook',
    categoryId: 'ebooks',
    topicCategory: 'Generative AI',
    title: 'Generative AI & Prompt Engineering: A Practical Introduction',
    language: 'Bilingual (BN / EN)',
    level: 'Beginner',
    description:
      'Generative AI কীভাবে কাজ করে, কার্যকর Prompt তৈরি, Prompt Structure এবং দৈনন্দিন কাজে AI ব্যবহারের ব্যবহারিক ধারণা।',
    intendedAudience: 'Beginners and early practitioners seeking reliable, structured prompt workflows.',
    whatYouWillLearn: [
      'How Large Language Models predict tokens and why instructions shape output quality',
      'Four-part structured prompt design (Role, Context, Task, Constraints)',
      'Iterative refinement, verification, and hallucination checks',
    ],
    format: 'Digital Handbook (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt:
      'Structured Prompting Principle: Instead of asking vague one-line questions, specify audience, output structure, verifiable facts, and language register to reduce ambiguity.',
  },
  {
    id: 'ebook-03',
    code: 'eBook 03',
    type: 'eBook',
    categoryId: 'ebooks',
    topicCategory: 'Responsible AI',
    title: 'Responsible AI: Ethics, Safety & Digital Responsibility',
    language: 'Bilingual (BN / EN)',
    level: 'Beginner to Intermediate',
    description:
      'AI Ethics, Bias, Privacy, Transparency, Accountability, Human Oversight এবং নিরাপদ AI ব্যবহারের মৌলিক নির্দেশনা।',
    intendedAudience: 'Educators, students, analysts, NGOs, and workplace professionals.',
    whatYouWillLearn: [
      'Sources of algorithmic and training-data bias in real applications',
      'Data privacy hygiene when using public AI tools',
      'Human-in-the-loop oversight and institutional accountability boundaries',
    ],
    format: 'Digital Handbook (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt:
      'Core Principle: Human oversight ensures that AI outputs remain advisory supports rather than unreviewed automated decisions affecting rights, education, or employment.',
  },
  {
    id: 'ebook-04',
    code: 'eBook 04',
    type: 'eBook',
    categoryId: 'ebooks',
    topicCategory: 'AI Productivity',
    title: 'AI for Everyday & Professional Productivity',
    language: 'Bilingual (BN / EN)',
    level: 'Beginner',
    description:
      'লেখা, পরিকল্পনা, গবেষণা, যোগাযোগ, ডকুমেন্ট প্রস্তুত এবং দৈনন্দিন পেশাগত কাজে AI ব্যবহারের ব্যবহারিক পদ্ধতি।',
    intendedAudience: 'Working professionals, office administrators, and university graduates.',
    whatYouWillLearn: [
      'Structuring professional emails, meeting summaries, and official briefs',
      'Planning weekly schedules and project checklists efficiently',
      'Human editing standards to retain authentic voice and accuracy',
    ],
    format: 'Digital Handbook (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt:
      'Workplace Rule: Treat generative drafts as a structured first step — always verify figures, institutional names, and tone before circulation.',
  },
  {
    id: 'ebook-05',
    code: 'eBook 05',
    type: 'eBook',
    categoryId: 'ebooks',
    topicCategory: 'Research & Education',
    title: 'AI for Research & Academic Learning',
    language: 'Bilingual (BN / EN)',
    level: 'Beginner to Intermediate',
    description:
      'Research Topic Development, Literature Search, Source Verification, Research Summarisation এবং Academic Integrity-তে AI-এর দায়িত্বশীল ব্যবহার।',
    intendedAudience: 'Undergraduate & postgraduate students, thesis writers, and academic researchers.',
    whatYouWillLearn: [
      'Scoping research questions without delegating intellectual authorship',
      'Verifying academic citations and guarding against fabricated references',
      'Maintaining strict institutional academic integrity and disclosure standards',
    ],
    format: 'Digital Handbook (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt:
      'Academic Integrity Note: Never cite a paper suggested by an AI model without independently locating and reading the primary source.',
  },
  {
    id: 'ebook-06',
    code: 'eBook 06',
    type: 'eBook',
    categoryId: 'ebooks',
    topicCategory: 'Business & Entrepreneurship',
    title: 'AI for Business & Entrepreneurship',
    language: 'English',
    level: 'Beginner to Intermediate',
    description:
      'Business Planning, Market Research, Content Development, Customer Communication এবং Business Productivity-তে AI-এর ব্যবহার।',
    intendedAudience: 'Founders, SME owners, freelancers, and business development teams.',
    whatYouWillLearn: [
      'Framing customer discovery questions and competitive landscape summaries',
      'Drafting consistent customer service communications and SOPs',
      'Evaluating where AI tools save time without introducing compliance risks',
    ],
    format: 'Digital Handbook (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt:
      'Operational Focus: Small businesses gain the strongest returns by automating repetitive documentation rather than replacing human customer relationships.',
  },
  {
    id: 'ebook-07',
    code: 'eBook 07',
    type: 'eBook',
    categoryId: 'ebooks',
    topicCategory: 'Applied AI & Automation',
    title: 'AI Automation & Workflow Design',
    language: 'English',
    level: 'Intermediate',
    description:
      'Repetitive Tasks শনাক্ত করা, AI-Assisted Workflow Design, Automation Planning এবং Productivity Improvement-এর ব্যবহারিক ধারণা।',
    intendedAudience: 'Operations leads, team coordinators, and applied AI learners.',
    whatYouWillLearn: [
      'Mapping repetitive operational steps suitable for structured automation',
      'Designing human-review checkpoints in multi-step workflows',
      'Error handling and data boundary checklists for no-code/low-code tools',
    ],
    format: 'Digital Handbook (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt:
      'Workflow Design Rule: Map inputs, decision points, and exception states on paper before connecting external automation triggers.',
  },
  {
    id: 'ebook-08',
    code: 'eBook 08',
    type: 'eBook',
    categoryId: 'ebooks',
    topicCategory: 'AI Governance',
    title: 'AI Governance: Principles, Policies & Practice',
    language: 'Bilingual (BN / EN)',
    level: 'Intermediate',
    description:
      'AI Governance Framework, Accountability, Transparency, Risk Management, Data Protection এবং Responsible AI Policy-এর প্রাথমিক ধারণা।',
    intendedAudience: 'Policy researchers, compliance officers, institutional leaders, and public sector teams.',
    whatYouWillLearn: [
      'Comparing global Responsible AI and governance principles with local needs',
      'Conducting proportional AI risk and impact assessments',
      'Drafting clear organisational AI acceptable-use policies',
    ],
    format: 'Digital Handbook (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt:
      'Governance Framework: Effective institutional AI governance defines clear ownership, permissible data categories, and escalation channels before deployment.',
  },
  {
    id: 'ebook-09',
    code: 'eBook 09',
    type: 'eBook',
    categoryId: 'ebooks',
    topicCategory: 'Digital Safety & Rights',
    title: 'Women’s Digital Safety in the Age of AI',
    language: 'Bilingual (BN / EN)',
    level: 'Beginner',
    description:
      'Online Harassment, Deepfake Awareness, Image-Based Abuse, Privacy, Account Security এবং Digital Incident Response বিষয়ে সচেতনতামূলক নির্দেশিকা।',
    intendedAudience: 'Women learners, educators, community leaders, and digital safety advocates.',
    whatYouWillLearn: [
      'Recognising AI-enabled risks including deepfakes and impersonation',
      'Strengthening account privacy, 2FA, and digital footprint security',
      'Documenting digital evidence safely and accessing verified Bangladesh support channels',
    ],
    format: 'Digital Handbook (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt:
      'Safety First: Practical digital resilience combines technical account hardening with calm evidence preservation and knowledge of formal legal remedies.',
  },
  {
    id: 'ebook-10',
    code: 'eBook 10',
    type: 'eBook',
    categoryId: 'ebooks',
    topicCategory: 'Public Sector & AI Policy',
    title: 'AI for Government & Public Sector Transformation',
    language: 'English',
    level: 'Intermediate',
    description:
      'Public Service Delivery, Institutional AI Adoption, Governance, Risk Assessment এবং Public Sector-এ Responsible AI ব্যবহারের ধারণা।',
    intendedAudience: 'Civil servants, public administrators, policy analysts, and civic technologists.',
    whatYouWillLearn: [
      'Evaluating citizen-facing AI opportunities vs administrative back-office support',
      'Safeguarding citizen data privacy, fairness, and procedural transparency',
      'Planning phased public institutional readiness and staff training',
    ],
    format: 'Digital Handbook (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt:
      'Public Sector Mandate: Public trust requires algorithmic explainability, human appeal pathways, and strict protection of citizen records.',
  },

  // 15 Prompts (pages 368-371)
  {
    id: 'prompt-01',
    code: 'Prompt 01',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Research & Education',
    title: 'AI Research Assistant',
    language: 'Bilingual (BN / EN)',
    level: 'Intermediate',
    description: 'Research Topic, Research Questions, Literature Review এবং Research Planning-এর জন্য কাঠামোবদ্ধ Prompt।',
    intendedAudience: 'University students, researchers, and academic writers.',
    whatYouWillLearn: [
      'Narrowing broad themes into testable research questions',
      'Organising literature synthesis matrices with explicit verification reminders',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Structure your topic scope, methodology options, and source-verification checklist before drafting.',
  },
  {
    id: 'prompt-02',
    code: 'Prompt 02',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Academic Research',
    title: 'Academic Literature Review',
    language: 'Bilingual (BN / EN)',
    level: 'Intermediate',
    description: 'Academic Paper বিশ্লেষণ, Theme Identification এবং Literature Mapping-এর জন্য Prompt Framework।',
    intendedAudience: 'Graduate students and research fellows.',
    whatYouWillLearn: [
      'Extracting methodology, findings, and limitations from user-provided abstracts',
      'Mapping cross-study themes cleanly without fabricating citations',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Paste verified paper excerpts to compare methods, key arguments, and evidence gaps systematically.',
  },
  {
    id: 'prompt-03',
    code: 'Prompt 03',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Productivity',
    title: 'Professional Email & Communication',
    language: 'Bilingual (BN / EN)',
    level: 'Beginner',
    description: 'Professional Email, Official Letter, Meeting Request এবং Workplace Communication তৈরি ও উন্নত করার Prompt।',
    intendedAudience: 'Professionals, coordinators, and administrative staff.',
    whatYouWillLearn: [
      'Tailoring tone for formal institutional correspondence vs internal updates',
      'Structuring concise action-oriented meeting follow-ups',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Convert bullet points into respectful, clear correspondence tailored to recipient role and context.',
  },
  {
    id: 'prompt-04',
    code: 'Prompt 04',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Content Creation',
    title: 'AI-Powered Content Creator',
    language: 'Bilingual (BN / EN)',
    level: 'Beginner',
    description: 'Social Media Content, Article, Caption, Content Calendar এবং Creative Writing-এর জন্য Prompt Collection।',
    intendedAudience: 'Content writers, communications leads, and digital educators.',
    whatYouWillLearn: [
      'Building multi-platform editorial calendars anchored to audience needs',
      'Maintaining factual accuracy and brand voice consistency',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Plan educational posts, articles, and narrative outlines with audience-first structure.',
  },
  {
    id: 'prompt-05',
    code: 'Prompt 05',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Business & Entrepreneurship',
    title: 'Business Strategy Assistant',
    language: 'English',
    level: 'Intermediate',
    description: 'Business Idea Evaluation, Market Positioning, Business Model এবং Strategic Planning-এর জন্য Prompt।',
    intendedAudience: 'Entrepreneurs, startup teams, and business analysts.',
    whatYouWillLearn: [
      'Stress-testing value propositions and customer segment assumptions',
      'Identifying operational bottlenecks and measurable milestone plans',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Evaluate product-market assumptions, risk factors, and 90-day validation experiments.',
  },
  {
    id: 'prompt-06',
    code: 'Prompt 06',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Productivity & Design',
    title: 'AI Presentation Designer',
    language: 'Bilingual (BN / EN)',
    level: 'Beginner',
    description: 'Presentation Outline, Slide Structure, Speaker Notes এবং Professional Presentation Planning-এর Prompt।',
    intendedAudience: 'Educators, managers, consultants, and students.',
    whatYouWillLearn: [
      'Designing slide-by-slide narrative arcs with clear takeaway headlines',
      'Drafting concise speaker notes and visual diagram suggestions',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Transform dense reports into clean, executive-ready slide sequences.',
  },
  {
    id: 'prompt-07',
    code: 'Prompt 07',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Data & Analytics',
    title: 'Data Analysis Assistant',
    language: 'English',
    level: 'Intermediate',
    description: 'Dataset Understanding, Data Cleaning Plan, Analytical Questions এবং Insight Generation-এর জন্য Prompt।',
    intendedAudience: 'Analysts, researchers, and monitoring & evaluation officers.',
    whatYouWillLearn: [
      'Formulating structured cleaning steps and anomaly checks for spreadsheets',
      'Translating quantitative trends into clear plain-language summaries',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Audit dataset columns, missing values, and priority analytical questions before charting.',
  },
  {
    id: 'prompt-08',
    code: 'Prompt 08',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Web Development',
    title: 'Website Development Assistant',
    language: 'English',
    level: 'Intermediate',
    description: 'Website Planning, Page Structure, UI Requirements, Content Architecture এবং Development Workflow-এর Prompt।',
    intendedAudience: 'Web builders, product designers, and applied AI learners.',
    whatYouWillLearn: [
      'Specifying information architecture, responsive breakpoints, and accessibility criteria',
      'Reviewing component hierarchies and clean acceptance checklists',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Define clear user flows, semantic sections, and component specs prior to coding.',
  },
  {
    id: 'prompt-09',
    code: 'Prompt 09',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Automation',
    title: 'AI Workflow Automation Planner',
    language: 'English',
    level: 'Intermediate',
    description: 'Repetitive Workflow Analysis, Automation Opportunities এবং Step-by-Step Workflow Design-এর Prompt।',
    intendedAudience: 'Operations staff, team leads, and workflow designers.',
    whatYouWillLearn: [
      'Breaking manual processes into triggers, validations, and human approvals',
      'Estimating maintenance effort and failure safeguards',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Document existing manual steps and pinpoint safe, high-value automation stages.',
  },
  {
    id: 'prompt-10',
    code: 'Prompt 10',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'AI Governance',
    title: 'AI Governance Policy Assistant',
    language: 'Bilingual (BN / EN)',
    level: 'Advanced',
    description: 'AI Policy Research, Governance Principles, Institutional Risk এবং Responsible AI Policy Drafting-এর Prompt।',
    intendedAudience: 'Policy specialists, compliance leads, and institutional governance teams.',
    whatYouWillLearn: [
      'Drafting organisational acceptable-use clauses, human review mandates, and risk tiers',
      'Mapping institutional accountability across departments',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Structure institutional AI policy sections covering scope, prohibited inputs, and oversight.',
  },
  {
    id: 'prompt-11',
    code: 'Prompt 11',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Digital Safety',
    title: 'Digital Safety Awareness Assistant',
    language: 'Bilingual (BN / EN)',
    level: 'Beginner',
    description: 'Online Safety Awareness, Privacy Protection, Account Security এবং Digital Risk Education-এর Prompt।',
    intendedAudience: 'Community educators, NGOs, students, and workshop facilitators.',
    whatYouWillLearn: [
      'Creating clear Bangla/English community awareness scenarios on phishing and deepfakes',
      'Drafting practical privacy-audit checklists for everyday users',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Build accessible digital safety workshops and practical security habit guides.',
  },
  {
    id: 'prompt-12',
    code: 'Prompt 12',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Development & NGOs',
    title: 'NGO & Development Project Assistant',
    language: 'Bilingual (BN / EN)',
    level: 'Intermediate',
    description: 'Project Concept Note, Logical Framework, Monitoring and Evaluation এবং Programme Reporting-এর Prompt।',
    intendedAudience: 'NGO programme officers, M&E specialists, and grant writers.',
    whatYouWillLearn: [
      'Aligning problem statements, outputs, outcomes, and measurable indicators',
      'Drafting clear donor progress updates without exposing beneficiary PII',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Structure logical frameworks and evaluation indicators while maintaining strict beneficiary privacy.',
  },
  {
    id: 'prompt-13',
    code: 'Prompt 13',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Education',
    title: 'AI-Powered Learning Assistant',
    language: 'Bilingual (BN / EN)',
    level: 'Beginner',
    description: 'Study Planning, Concept Explanation, Revision Notes এবং Responsible AI-Assisted Learning-এর Prompt।',
    intendedAudience: 'School, college, and university learners.',
    whatYouWillLearn: [
      'Generating active-recall quizzes and step-by-step concept analogies',
      'Creating realistic weekly study plans tailored to exam dates',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Use AI as a Socratic tutor that tests your understanding rather than writing answers for you.',
  },
  {
    id: 'prompt-14',
    code: 'Prompt 14',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Professional Development',
    title: 'HR & Recruitment Assistant',
    language: 'English',
    level: 'Intermediate',
    description: 'Job Description, Interview Questions, HR Documentation এবং Recruitment Workflow-এর জন্য Prompt।',
    intendedAudience: 'HR coordinators, team leads, and people operations managers.',
    whatYouWillLearn: [
      'Writing bias-checked, skills-focused role descriptions and structured interview rubrics',
      'Drafting clear onboarding checklists for new hires',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Build transparent evaluation criteria and structured onboarding guides while keeping candidate decisions human-led.',
  },
  {
    id: 'prompt-15',
    code: 'Prompt 15',
    type: 'Prompt',
    categoryId: 'prompt-library',
    topicCategory: 'Product Design',
    title: 'AI Product Design & Prototyping Assistant',
    language: 'English',
    level: 'Intermediate',
    description: 'Product Idea Development, User Persona, Feature Planning, User Journey এবং Prototype Specification-এর Prompt।',
    intendedAudience: 'Product managers, UX designers, and builders.',
    whatYouWillLearn: [
      'Mapping user pain points into testable product requirements and edge cases',
      'Defining clear interface acceptance criteria before prototyping',
    ],
    format: 'Structured Prompt Framework (Member Access)',
    publicationStatus: 'published',
    accessStatus: 'locked',
    previewAvailable: true,
    previewExcerpt: 'Prompt Objective: Clarify user journeys, accessibility considerations, and core MVP scope before design.',
  },
];

export const UPCOMING_RESOURCE_COLLECTIONS: UpcomingCollection[] = [
  {
    categoryId: 'guides-toolkits',
    categoryTitle: 'Guides & Toolkits',
    status: 'Coming Soon',
    items: [
      'AI Literacy Starter Guide',
      'Responsible AI Checklist',
      'AI Safety Checklist',
      'Prompt Engineering Quick Guide',
      'AI Governance Starter Toolkit',
      'Digital Safety Checklist',
      'AI Adoption Readiness Checklist',
      'Academic AI Use Guidelines',
    ],
  },
  {
    categoryId: 'templates-worksheets',
    categoryTitle: 'Templates & Worksheets',
    status: 'Coming Soon',
    items: [
      'Research Planning Worksheet',
      'AI Tool Evaluation Template',
      'Prompt Development Worksheet',
      'AI Risk Assessment Template',
      'AI Project Planning Template',
      'Business AI Readiness Worksheet',
      'Content Planning Template',
      'Institutional AI Policy Outline',
    ],
  },
  {
    categoryId: 'research-reference',
    categoryTitle: 'Research & Reference Materials',
    status: 'Coming Soon',
    items: [
      'AI Governance Framework References',
      'Responsible AI Principles',
      'AI Policy Reading List',
      'Bangladesh AI Governance Reference Materials',
      'AI Research Glossary',
      'Digital Rights & AI Reference Collection',
    ],
  },
];

export function getResourceById(id: string | undefined): ResourceItem | undefined {
  if (!id) return undefined;
  return RESOURCES.find((r) => r.id.toLowerCase() === id.toLowerCase());
}
