export interface MediaAsset {
  src: string;
  alt: string;
}

export const SITE_MEDIA = {
  heroLearning: {
    src: '/src/assets/images/hero_atlas_learning_1795292976839.jpg',
    alt: 'Learners collaborating in a bright modern AI seminar studio at Atlas AI Education',
  },
  institutionalWorkshop: {
    src: '/src/assets/images/institutional_workshop_1795292977042.jpg',
    alt: 'Executive workshop and corporate AI training session in a sunlit glass conference room',
  },
  aiFoundations: {
    src: '/src/assets/images/course_ai_foundations_1795292977190.jpg',
    alt: 'Minimalist sunlit study workspace with laptop and AI foundations notebook',
  },
  contentDesign: {
    src: '/src/assets/images/course_content_design_1795292977140.jpg',
    alt: 'Bright creative studio desk with editorial layouts and product design wireframes',
  },
  businessFinance: {
    src: '/src/assets/images/course_business_finance_1795292977349.jpg',
    alt: 'Light-filled executive strategy table with financial analytics charts and laptops',
  },
  automationData: {
    src: '/src/assets/images/course_automation_data_1795292977445.jpg',
    alt: 'Modern light workstation showing data visualization graphs and workflow architecture',
  },
  governanceJustice: {
    src: '/src/assets/images/course_governance_justice_1795292977189.jpg',
    alt: 'Sunlit policy and legal research library reading table with bound governance briefs',
  },
  communityWomen: {
    src: '/src/assets/images/course_community_women_1795292977075.jpg',
    alt: 'Bright collaborative workshop for women digital safety, NGO teams, and university students',
  },
} as const;

const COURSE_IMAGE_MAP: Record<string, keyof typeof SITE_MEDIA> = {
  'AL-101': 'aiFoundations',
  'AL-102': 'aiFoundations',
  'AL-103': 'governanceJustice',
  'AL-104': 'aiFoundations',

  'AAI-201': 'contentDesign',
  'AAI-202': 'businessFinance',
  'AAI-203': 'automationData',
  'AAI-204': 'automationData',
  'AAI-205': 'automationData',
  'AAI-206': 'governanceJustice',
  'AAI-207': 'contentDesign',

  'PD-301': 'businessFinance',
  'PD-302': 'businessFinance',
  'PD-303': 'institutionalWorkshop',
  'PD-304': 'businessFinance',
  'PD-305': 'contentDesign',
  'PD-306': 'communityWomen',
  'PD-307': 'businessFinance',

  'AG-101': 'governanceJustice',
  'AG-102': 'governanceJustice',
  'AG-103': 'institutionalWorkshop',
  'AG-104': 'governanceJustice',
};

const SPECIALIZED_IMAGE_MAP: Record<string, keyof typeof SITE_MEDIA> = {
  'SP-01': 'governanceJustice',
  'SP-02': 'institutionalWorkshop',
  'SP-03': 'governanceJustice',
  'SP-04': 'communityWomen',
  'SP-05': 'communityWomen',
  'SP-06': 'heroLearning',
};

export function getCourseImage(code: string, title?: string): MediaAsset {
  const key = COURSE_IMAGE_MAP[code.toUpperCase()] || 'aiFoundations';
  const asset = SITE_MEDIA[key];
  return {
    src: asset.src,
    alt: title ? `${title} — ${asset.alt}` : asset.alt,
  };
}

export function getSpecializedImage(code: string, title?: string): MediaAsset {
  const key = SPECIALIZED_IMAGE_MAP[code.toUpperCase()] || 'communityWomen';
  const asset = SITE_MEDIA[key];
  return {
    src: asset.src,
    alt: title ? `${title} — ${asset.alt}` : asset.alt,
  };
}

export function getResourceImage(id: string, topicCategory?: string, title?: string): MediaAsset {
  const topic = (topicCategory || '').toLowerCase();
  let key: keyof typeof SITE_MEDIA = 'aiFoundations';

  if (topic.includes('governance') || topic.includes('public sector') || topic.includes('policy')) {
    key = 'governanceJustice';
  } else if (topic.includes('digital safety') || topic.includes('ngo') || topic.includes('development')) {
    key = 'communityWomen';
  } else if (topic.includes('data') || topic.includes('automation') || topic.includes('web')) {
    key = 'automationData';
  } else if (topic.includes('content') || topic.includes('design') || topic.includes('product')) {
    key = 'contentDesign';
  } else if (topic.includes('business') || topic.includes('professional')) {
    key = 'businessFinance';
  } else if (topic.includes('research') || topic.includes('education')) {
    key = id.endsWith('01') || id.endsWith('05') ? 'heroLearning' : 'aiFoundations';
  }

  const asset = SITE_MEDIA[key];
  return {
    src: asset.src,
    alt: title ? `${title} — ${asset.alt}` : asset.alt,
  };
}
