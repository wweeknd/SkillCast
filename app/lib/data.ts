export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ProjectStatus = 'recruiting' | 'in-progress' | 'completed';
export type AvailabilityStatus = 'looking' | 'leading' | 'unavailable';
export type ProjectCategory = 'Software' | 'Video Game' | 'Startup' | 'AI/ML' | 'Creative' | 'Research';
export type CommitmentLevel = 'casual' | 'part-time' | 'full-time';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarColor: string;
  bio: string;
  skills: string[];
  level: SkillLevel;
  availability: AvailabilityStatus;
  reputation: number;
  projectsCompleted: number;
  githubUrl?: string;
  websiteUrl?: string;
  hoursPerWeek: number;
  location: string;
  timezone: string;
  joinedAt: string;
  collaborationHistory: CollabHistory[];
  isOnline: boolean;
}

export interface CollabHistory {
  projectId: string;
  projectName: string;
  role: string;
  teamSize: number;
  status: ProjectStatus;
  rating: number;
  category: ProjectCategory;
  year: number;
}

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  creatorId: string;
  teamSize: number;
  maxTeamSize: number;
  roles: Role[];
  tags: string[];
  timeline: string;
  commitment: CommitmentLevel;
  compensation: 'paid' | 'unpaid' | 'equity';
  remote: boolean;
  createdAt: string;
  matchScore?: number;
  memberIds: string[];
  applicantIds: string[];
}

export interface Role {
  id: string;
  title: string;
  skills: string[];
  count: number;
  filled: number;
  level: SkillLevel;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  projectId?: string;
  recipientId?: string;
}

export interface Notification {
  id: string;
  type: 'join_request' | 'accepted' | 'message' | 'project_match' | 'rating' | 'invite';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  userId: string;
  actionUrl?: string;
  fromUserId?: string;
}

export interface JoinRequest {
  id: string;
  projectId: string;
  userId: string;
  roleId: string;
  introduction: string;
  relevantSkills: string[];
  whyJoin: string;
  portfolioLinks: string[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// ─── CURRENT USER ────────────────────────────────────────────────────────────
export const CURRENT_USER_ID = 'user-1';

// ─── USERS ────────────────────────────────────────────────────────────────────
export const USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    username: 'alexrivera',
    avatar: '',
    avatarColor: '#7c5cfc',
    bio: 'Full-stack developer passionate about building impactful products. Love working at the intersection of great UX and robust systems.',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
    level: 'advanced',
    availability: 'looking',
    reputation: 4.8,
    projectsCompleted: 7,
    githubUrl: 'https://github.com/alexrivera',
    websiteUrl: 'https://alexrivera.dev',
    hoursPerWeek: 20,
    location: 'San Francisco, CA',
    timezone: 'PST',
    joinedAt: '2024-01-15',
    isOnline: true,
    collaborationHistory: [
      { projectId: 'p-old-1', projectName: 'OpenHealth Dashboard', role: 'Frontend Developer', teamSize: 4, status: 'completed', rating: 4.9, category: 'Software', year: 2024 },
      { projectId: 'p-old-2', projectName: 'EduBot AI', role: 'Full Stack Dev', teamSize: 6, status: 'completed', rating: 4.7, category: 'AI/ML', year: 2023 },
    ],
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    username: 'priyasharma',
    avatar: '',
    avatarColor: '#ec4899',
    bio: 'UI/UX Designer & Researcher. I craft beautiful, user-centered digital experiences. 5+ years making complex things simple.',
    skills: ['Figma', 'UI Design', 'User Research', 'Prototyping', 'Design Systems', 'Framer'],
    level: 'expert',
    availability: 'looking',
    reputation: 4.9,
    projectsCompleted: 12,
    githubUrl: undefined,
    websiteUrl: 'https://priyasharma.design',
    hoursPerWeek: 15,
    location: 'New York, NY',
    timezone: 'EST',
    joinedAt: '2023-11-20',
    isOnline: true,
    collaborationHistory: [
      { projectId: 'p-old-3', projectName: 'Luminary Notes', role: 'Lead Designer', teamSize: 3, status: 'completed', rating: 5.0, category: 'Software', year: 2024 },
    ],
  },
  {
    id: 'user-3',
    name: 'Marcus Chen',
    username: 'marcuschen',
    avatar: '',
    avatarColor: '#22d3ee',
    bio: 'ML Engineer building the next generation of intelligent systems. Passionate about NLP and making AI accessible.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'LLMs', 'FastAPI', 'MLOps'],
    level: 'expert',
    availability: 'leading',
    reputation: 4.7,
    projectsCompleted: 5,
    githubUrl: 'https://github.com/marcuschen',
    hoursPerWeek: 30,
    location: 'Austin, TX',
    timezone: 'CST',
    joinedAt: '2024-02-10',
    isOnline: false,
    collaborationHistory: [],
  },
  {
    id: 'user-4',
    name: 'Sofia Torres',
    username: 'sofiatorres',
    avatar: '',
    avatarColor: '#f97316',
    bio: 'Indie game developer & pixel artist. Currently building my dream RPG. Always up for creative collaborations!',
    skills: ['Unity', 'C#', 'Pixel Art', 'Game Design', 'Aseprite', 'FMOD'],
    level: 'advanced',
    availability: 'looking',
    reputation: 4.6,
    projectsCompleted: 3,
    githubUrl: 'https://github.com/sofiatorres',
    websiteUrl: 'https://sofiatorres.art',
    hoursPerWeek: 25,
    location: 'Remote',
    timezone: 'MST',
    joinedAt: '2024-03-05',
    isOnline: true,
    collaborationHistory: [],
  },
  {
    id: 'user-5',
    name: 'Jordan Kim',
    username: 'jordankim',
    avatar: '',
    avatarColor: '#22c55e',
    bio: 'Serial founder, growth hacker and startup strategist. Turned 2 side projects into real businesses. Here for the next one.',
    skills: ['Product Strategy', 'Marketing', 'Go-to-Market', 'Fundraising', 'Sales', 'SEO'],
    level: 'expert',
    availability: 'leading',
    reputation: 4.5,
    projectsCompleted: 8,
    linkedinUrl: 'https://linkedin.com/in/jordankim',
    hoursPerWeek: 40,
    location: 'Los Angeles, CA',
    timezone: 'PST',
    joinedAt: '2023-09-01',
    isOnline: false,
    collaborationHistory: [],
  },
  {
    id: 'user-6',
    name: 'Nadia Okonkwo',
    username: 'nadiaokonkwo',
    avatar: '',
    avatarColor: '#a855f7',
    bio: 'Backend wizard. I make systems that scale. Loves distributed systems, databases and making things blazing fast.',
    skills: ['Rust', 'Go', 'Kubernetes', 'PostgreSQL', 'Redis', 'Kafka', 'System Design'],
    level: 'expert',
    availability: 'looking',
    reputation: 4.9,
    projectsCompleted: 9,
    githubUrl: 'https://github.com/nadiaokonkwo',
    hoursPerWeek: 20,
    location: 'London, UK',
    timezone: 'GMT',
    joinedAt: '2024-01-02',
    isOnline: true,
    collaborationHistory: [],
  },
];

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Nexus AI Study Tool',
    shortDescription: 'AI-powered adaptive learning platform that personalizes curriculum for each student.',
    fullDescription: 'Nexus is building the next generation of AI-driven education. Our platform analyzes learning patterns, identifies knowledge gaps, and generates hyper-personalized study plans. We use LLMs to create dynamic quizzes, summaries, and explanations tailored to each student\'s level and pace. We\'re targeting university students initially, with plans to expand to K-12.',
    category: 'AI/ML',
    status: 'recruiting',
    creatorId: 'user-3',
    teamSize: 2,
    maxTeamSize: 6,
    roles: [
      { id: 'r1', title: 'React Frontend Developer', skills: ['React', 'TypeScript', 'TailwindCSS'], count: 2, filled: 0, level: 'intermediate' },
      { id: 'r2', title: 'Backend Engineer', skills: ['Node.js', 'PostgreSQL', 'REST APIs'], count: 1, filled: 0, level: 'advanced' },
      { id: 'r3', title: 'UI/UX Designer', skills: ['Figma', 'User Research', 'Prototyping'], count: 1, filled: 0, level: 'intermediate' },
    ],
    tags: ['Python', 'React', 'Machine Learning', 'Education', 'SaaS', 'TypeScript'],
    timeline: '6 months',
    commitment: 'part-time',
    compensation: 'equity',
    remote: true,
    createdAt: '2025-03-01',
    matchScore: 87,
    memberIds: ['user-3', 'user-6'],
    applicantIds: [],
  },
  {
    id: 'proj-2',
    name: 'Echoes of the Abyss',
    shortDescription: 'Atmospheric indie horror game with procedurally generated dungeons and a compelling narrative.',
    fullDescription: 'A top-down horror RPG with Lovecraftian themes. Players explore procedurally generated dungeons, uncover cosmic secrets, and fight for their sanity. We want tight gameplay mechanics combined with an emotionally heavy story. Inspired by Darkest Dungeon and Disco Elysium.',
    category: 'Video Game',
    status: 'recruiting',
    creatorId: 'user-4',
    teamSize: 1,
    maxTeamSize: 5,
    roles: [
      { id: 'r4', title: 'Unity Developer', skills: ['Unity', 'C#', 'Shader Programming'], count: 1, filled: 0, level: 'advanced' },
      { id: 'r5', title: 'Narrative Writer', skills: ['Storytelling', 'Dialogue Writing', 'World Building'], count: 1, filled: 0, level: 'intermediate' },
      { id: 'r6', title: 'Sound Designer', skills: ['FMOD', 'Audio Design', 'Ableton'], count: 1, filled: 0, level: 'intermediate' },
    ],
    tags: ['Unity', 'Pixel Art', 'Horror', 'RPG', 'Indie', 'C#'],
    timeline: '12 months',
    commitment: 'part-time',
    compensation: 'equity',
    remote: true,
    createdAt: '2025-02-20',
    matchScore: 75,
    memberIds: ['user-4'],
    applicantIds: [],
  },
  {
    id: 'proj-3',
    name: 'Greenwave Carbon Tracker',
    shortDescription: 'B2B SaaS for companies to measure, track, and reduce their carbon footprint.',
    fullDescription: 'Greenwave helps mid-sized companies meet ESG reporting requirements. We aggregate supply chain data, utility bills, and travel records to produce accurate Scope 1, 2, and 3 emissions reports. We then provide actionable reduction roadmaps. The market is exploding with new legislation mandating carbon disclosures globally.',
    category: 'Startup',
    status: 'recruiting',
    creatorId: 'user-5',
    teamSize: 2,
    maxTeamSize: 5,
    roles: [
      { id: 'r7', title: 'Full Stack Developer', skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'], count: 2, filled: 1, level: 'advanced' },
      { id: 'r8', title: 'Data Engineer', skills: ['Python', 'ETL', 'Data Pipelines', 'SQL'], count: 1, filled: 0, level: 'intermediate' },
    ],
    tags: ['Sustainability', 'SaaS', 'React', 'Data', 'B2B', 'Climate'],
    timeline: '4 months to MVP',
    commitment: 'part-time',
    compensation: 'equity',
    remote: true,
    createdAt: '2025-02-15',
    matchScore: 82,
    memberIds: ['user-5', 'user-2'],
    applicantIds: ['user-1'],
  },
  {
    id: 'proj-4',
    name: 'DevDeck',
    shortDescription: 'The developer\'s personal dashboard — track your GitHub stats, leetcode, and learning goals in one place.',
    fullDescription: 'DevDeck is an open-source personal developer dashboard. Connect GitHub, LeetCode, Wakatime, and more. See your coding streaks, language breakdowns, PR velocity, and set personalized learning goals. Think Notion + GitHub Insights for developers.',
    category: 'Software',
    status: 'in-progress',
    creatorId: 'user-1',
    teamSize: 4,
    maxTeamSize: 4,
    roles: [],
    tags: ['React', 'TypeScript', 'Open Source', 'Developer Tools', 'API Integration'],
    timeline: '3 months',
    commitment: 'casual',
    compensation: 'unpaid',
    remote: true,
    createdAt: '2025-01-10',
    matchScore: 95,
    memberIds: ['user-1', 'user-2', 'user-3', 'user-6'],
    applicantIds: [],
  },
  {
    id: 'proj-5',
    name: 'Luminary Notes',
    shortDescription: 'Intelligent note-taking app that links your ideas with a beautiful knowledge graph.',
    fullDescription: 'Luminary is a second-brain knowledge management tool. It uses AI to auto-link related notes, surface forgotten ideas, and generate summaries. Similar to Obsidian but with built-in AI and team collaboration features. Targeting researchers, writers, and knowledge workers.',
    category: 'Software',
    status: 'completed',
    creatorId: 'user-2',
    teamSize: 3,
    maxTeamSize: 3,
    roles: [],
    tags: ['React', 'AI', 'Knowledge Management', 'Electron', 'TypeScript'],
    timeline: '8 months',
    commitment: 'part-time',
    compensation: 'equity',
    remote: true,
    createdAt: '2024-06-01',
    memberIds: ['user-2', 'user-3', 'user-1'],
    applicantIds: [],
  },
  {
    id: 'proj-6',
    name: 'QuantumScript Lang',
    shortDescription: 'An experimental programming language designed for quantum computing algorithms.',
    fullDescription: 'QuantumScript is a high-level DSL for expressing quantum algorithms in a readable, Python-like syntax. It compiles to QASM (Quantum Assembly) and supports IBM Quantum, Google Cirq, and Amazon Braket backends. We\'re targeting researchers and quantum computing enthusiasts.',
    category: 'Research',
    status: 'recruiting',
    creatorId: 'user-6',
    teamSize: 1,
    maxTeamSize: 4,
    roles: [
      { id: 'r9', title: 'Compiler Engineer', skills: ['Rust', 'LLVM', 'Compilers', 'Language Design'], count: 1, filled: 0, level: 'expert' },
      { id: 'r10', title: 'Quantum Physicist', skills: ['Quantum Computing', 'Linear Algebra', 'Physics'], count: 1, filled: 0, level: 'advanced' },
    ],
    tags: ['Rust', 'Quantum Computing', 'Research', 'Compilers', 'Programming Languages'],
    timeline: '18+ months',
    commitment: 'part-time',
    compensation: 'unpaid',
    remote: true,
    createdAt: '2025-03-01',
    matchScore: 60,
    memberIds: ['user-6'],
    applicantIds: [],
  },
];

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
export const MESSAGES: Message[] = [
  { id: 'm1', senderId: 'user-3', recipientId: 'user-1', content: 'Hey Alex! Saw your profile — your stack is perfect for Nexus. Would love to chat about joining!', timestamp: '2025-03-07T14:23:00Z' },
  { id: 'm2', senderId: 'user-1', recipientId: 'user-3', content: 'Hey Marcus! Nexus looks awesome. I\'d be super interested. What\'s the tech stack like on the backend?', timestamp: '2025-03-07T14:45:00Z' },
  { id: 'm3', senderId: 'user-3', recipientId: 'user-1', content: 'FastAPI + PostgreSQL + Redis for caching. LLM orchestration via LangChain. It\'s a pretty sweet stack.', timestamp: '2025-03-07T14:50:00Z' },
  { id: 'm4', senderId: 'user-1', recipientId: 'user-3', content: 'Love it. I can definitely contribute on the Node API side and own the frontend architecture. Let me send a formal request!', timestamp: '2025-03-07T15:00:00Z' },
  { id: 'm5', senderId: 'user-2', recipientId: 'user-1', content: 'Alex, the design system for DevDeck is basically done. Can you review the Figma?', timestamp: '2025-03-06T09:12:00Z' },
  { id: 'm6', senderId: 'user-1', recipientId: 'user-2', content: 'On it! It looks stunning btw. The component library is insane.', timestamp: '2025-03-06T09:30:00Z' },
  { id: 'm7', senderId: 'user-4', recipientId: 'user-1', content: 'Hey! Are you by chance interested in game dev? I\'m looking for a backend dev for Echoes of the Abyss!', timestamp: '2025-03-05T16:00:00Z' },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'project_match', title: 'New Match Found!', body: 'Nexus AI Study Tool matches 87% of your skills. Check it out!', timestamp: '2025-03-08T09:00:00Z', read: false, userId: 'user-1', actionUrl: '/projects/proj-1' },
  { id: 'n2', type: 'message', title: 'Marcus Chen sent you a message', body: 'FastAPI + PostgreSQL + Redis for caching...', timestamp: '2025-03-07T14:50:00Z', read: false, userId: 'user-1', fromUserId: 'user-3' },
  { id: 'n3', type: 'accepted', title: 'Your request was accepted!', body: 'Jordan Kim accepted you into Greenwave Carbon Tracker.', timestamp: '2025-03-06T12:00:00Z', read: false, userId: 'user-1', actionUrl: '/projects/proj-3' },
  { id: 'n4', type: 'rating', title: 'New rating received', body: 'Your work on EduBot AI was rated 4.7 ⭐', timestamp: '2025-03-05T08:00:00Z', read: true, userId: 'user-1' },
  { id: 'n5', type: 'project_match', title: 'New Match Found!', body: 'DevDeck matches 95% of your skills!', timestamp: '2025-03-04T10:00:00Z', read: true, userId: 'user-1', actionUrl: '/projects/proj-4' },
  { id: 'n6', type: 'invite', title: 'Team Invite from Priya Sharma', body: 'You\'ve been invited to join DevDeck as Full Stack Dev', timestamp: '2025-03-03T14:00:00Z', read: true, userId: 'user-1' },
];

// ─── JOIN REQUESTS ────────────────────────────────────────────────────────────
export const JOIN_REQUESTS: JoinRequest[] = [
  {
    id: 'jr1',
    projectId: 'proj-3',
    userId: 'user-1',
    roleId: 'r7',
    introduction: 'Hi Jordan! I\'m Alex, a full-stack developer with 5+ years of experience in React and Node.js.',
    relevantSkills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript'],
    whyJoin: 'Greenwave is tackling a problem I deeply care about. I have experience building complex data dashboards and would love to bring that to an ESG-focused product.',
    portfolioLinks: ['https://github.com/alexrivera', 'https://alexrivera.dev'],
    status: 'accepted',
    createdAt: '2025-03-05T10:00:00Z',
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export function getUserById(id: string): User | undefined {
  return USERS.find(u => u.id === id);
}

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find(p => p.id === id);
}

export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getMatchColor(score: number): string {
  if (score >= 80) return '#4ade80';
  if (score >= 60) return '#fbbf24';
  return '#f87171';
}

export function getAvatarInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export const SKILL_COLORS: Record<string, string> = {
  'React': '#61dafb',
  'Vue': '#42b883',
  'Angular': '#dd0031',
  'TypeScript': '#3178c6',
  'JavaScript': '#f7df1e',
  'Node.js': '#68a063',
  'Python': '#3572a5',
  'Rust': '#dea584',
  'Go': '#00add8',
  'Unity': '#000000',
  'C#': '#178600',
  'Figma': '#f24e1e',
  'UI Design': '#ec4899',
  'Machine Learning': '#ff6b6b',
  'PostgreSQL': '#336791',
  'Docker': '#2496ed',
  'AWS': '#ff9900',
};
