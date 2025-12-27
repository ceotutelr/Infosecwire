
import React from 'react';
import { Category, UserRole, Article, Author } from './types';

export const APP_NAME = "InfosecWire";
export const TAGLINE = "Real-Time Cybersecurity News & Threat Intelligence";

export const MOCK_AUTHORS: Author[] = [
  {
    id: 'a1',
    name: 'Elena Vance',
    bio: 'Cybersecurity analyst and forensic expert with over 12 years of experience in incident response.',
    avatar: 'https://picsum.photos/id/64/150/150',
    role: UserRole.EDITOR
  },
  {
    id: 'a2',
    name: 'Marcus Thorne',
    bio: 'Threat hunter specialized in APT groups and nation-state level cyber warfare.',
    avatar: 'https://picsum.photos/id/91/150/150',
    role: UserRole.ADMIN
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Massive Data Breach Exposes Millions of Financial Records at Global Fintech Firm',
    slug: 'massive-data-breach-fintech-records',
    excerpt: 'A previously unknown vulnerability in a cloud storage configuration has led to the exposure of sensitive data belonging to over 4.5 million users.',
    content: `## Overview of the Incident\n\nA critical data breach has been reported at one of the world's leading fintech providers. Investigators believe the breach occurred over a three-week window during which an unprotected database was accessible via the public internet.\n\n### Technical Analysis\n\nThe root cause was identified as a misconfigured S3 bucket. Security researchers at InfosecWire noted that the misconfiguration was likely introduced during a routine infrastructure update.\n\n### Impact\n\nData exposed includes:\n* Full Names\n* Hashed Passwords\n* Transaction Histories\n* Partial Credit Card Numbers\n\nCompanies are urged to review their cloud IAM policies immediately.`,
    category: Category.DATA_BREACHES,
    authorId: 'a1',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    featuredImage: 'https://picsum.photos/id/201/1200/600',
    tags: ['Data Breach', 'Fintech', 'Cloud Security'],
    isFeatured: true,
    isSponsored: false,
    status: 'published'
  },
  {
    id: '2',
    title: 'New Zero-Day Vulnerability Found in Popular Open Source Web Server',
    slug: 'new-zero-day-web-server-vulnerability',
    excerpt: 'A critical vulnerability (CVE-2025-0012) allows for Remote Code Execution on millions of servers worldwide.',
    content: `Researchers have discovered a critical zero-day vulnerability in a widely used open-source web server. The flaw, tracked as **CVE-2025-0012**, allows an unauthenticated attacker to execute arbitrary code with root privileges.`,
    category: Category.VULNERABILITIES,
    authorId: 'a2',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    featuredImage: 'https://picsum.photos/id/202/1200/600',
    tags: ['CVE', 'Web Security', 'Zero-Day'],
    isFeatured: false,
    isSponsored: false,
    status: 'published',
    cveId: 'CVE-2025-0012'
  },
  {
    id: '3',
    title: 'State-Sponsored Hackers Targeting Critical Infrastructure via Phishing',
    slug: 'state-sponsored-hackers-phishing-infrastructure',
    excerpt: 'A new campaign linked to the "Volt Typhoon" group has been detected targeting energy grids across North America.',
    content: `Evidence suggests that threat actors are using highly sophisticated phishing emails to gain initial access to employee workstations within critical infrastructure providers.`,
    category: Category.CYBER_ATTACKS,
    authorId: 'a2',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    featuredImage: 'https://picsum.photos/id/203/1200/600',
    tags: ['APT', 'Phishing', 'National Security'],
    isFeatured: false,
    isSponsored: false,
    status: 'published'
  },
  {
    id: '4',
    title: 'The Future of AI in Threat Detection: A Double-Edged Sword',
    slug: 'future-ai-threat-detection',
    excerpt: 'While AI offers unprecedented speed in identifying anomalies, it also gives attackers new tools for automated exploitation.',
    content: `Large Language Models are being repurposed for both defense and offense. In this deep dive, we look at how security teams are keeping up.`,
    category: Category.AI_CLOUD_SECURITY,
    authorId: 'a1',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    featuredImage: 'https://picsum.photos/id/204/1200/600',
    tags: ['AI', 'Cyber Defense', 'Machine Learning'],
    isFeatured: false,
    isSponsored: true,
    status: 'published'
  }
];
