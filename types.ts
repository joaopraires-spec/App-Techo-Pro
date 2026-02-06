
export enum UserPlan {
  FREE = 'Gratuito',
  MONTHLY = 'Mensal',
  ANNUAL = 'Anual',
  ADMIN = 'Admin'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  area: string;
  plan: UserPlan;
  joinedAt: string;
  xp: number; 
  level: number;
  readArticlesIds: string[]; 
  startedArticlesIds: string[];
  calculationsCount?: number;
  conversionsCount?: number;
  checklistsCount?: number;
  readingGoals: {
    dailyMinutes: number;
    currentMinutesToday: number;
    streak: number;
  };
}

export interface Article {
  id: string;
  title: string;
  category: string;
  isPremium: boolean;
  content: string;
  readTime: number; 
  imageUrl: string;
}

export interface Catalog {
  id: string;
  name: string;
  category: string;
  fileUrl: string;
}

export interface Calculator {
  id: string;
  name: string;
  category: string;
  isPremium: boolean;
  formula: string;
  illustration: string;
  inputs: { label: string; unit: string; key: string; defaultValue: number }[];
  resultUnit: string;
  description: string;
}

export interface Checklist {
  id: string;
  title: string;
  category: string;
  items: { id: string; text: string; completed: boolean }[];
  lastUpdated: string;
  location?: string;
  inspectorName?: string;
  role?: string;
  images?: string[];
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  replies: number;
}
