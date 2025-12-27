
export enum Category {
  DATA_BREACHES = 'Data Breaches',
  CYBER_ATTACKS = 'Cyber Attacks',
  VULNERABILITIES = 'Vulnerabilities',
  THREAT_INTEL = 'Threat Intelligence',
  AI_CLOUD_SECURITY = 'AI & Cloud Security',
  EXPERT_INSIGHTS = 'Expert Insights',
  COMPLIANCE_GRC = 'Compliance & GRC'
}

export enum UserRole {
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  AUTHOR = 'Author'
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  role: UserRole;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  authorId: string;
  publishedAt: string;
  featuredImage: string;
  tags: string[];
  isFeatured: boolean;
  isSponsored: boolean;
  status: 'draft' | 'published' | 'scheduled';
  metaTitle?: string;
  metaDescription?: string;
  cveId?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userName: string;
  content: string;
  createdAt: string;
  isModerated: boolean;
}
