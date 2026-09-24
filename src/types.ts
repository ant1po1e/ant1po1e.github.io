export interface MetaLabel {
  label: string;
  value: string;
}

export interface PageItem {
  id: string;
  slug: string;
  path: string;
  title: string;
  catalogueNumber: string;
  cover: string;
  source: string;
  accentColor: string;
  secondaryAccent?: string;
  metaLabels: MetaLabel[];
  highlights: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  image: string;
  alt: string;
  link: string;
  stack: string[];
  icon: 'link' | 'lock' | 'store' | 'code';
  linkText: string;
}

export interface ArticleLog {
  id: string;
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string[];
}

export interface StaffingRecord {
  id: string;
  title: string;
  date: string;
  link: string;
  roles: string[];
}

export interface MappingGuideSection {
  id: string;
  title: string;
  category: 'Fundamentals' | 'Pattern Theory' | 'Long Notes (LN)' | 'Scroll Velocity (SV)' | 'Hitsounding & Modding';
  readTime: string;
  summary: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  exampleVisual?: string;
}

export interface PortfolioProfile {
  handle: string;
  displayName: string;
  role: string;
  location: string;
  avatar: string;
  statement: string;
  bioParagraphs: string[];
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    period: string;
    role: string;
    company: string;
    description: string;
  }[];
  socials: {
    github: string;
    x: string;
    youtube: string;
    itchio: string;
    osu: string;
    twitch: string;
    discord: string;
    email: string;
  };
}

