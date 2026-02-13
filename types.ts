
export enum UserPlan {
  FREE = 'Gratuito',
  MONTHLY = 'Mensal',
  ANNUAL = 'Anual',
  ADMIN = 'Admin'
}

export enum UserStatus {
  ACTIVE = 'ativo',
  SUSPENDED = 'suspenso',
  EXPIRED = 'expirado'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'usuário'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string; // Telefone com DDD
  gender?: 'Masculino' | 'Feminino' | 'Não Aplicável (N/A)'; // Novo campo solicitado
  password?: string; // Senha original para recuperação conforme solicitado
  passwordHash?: string; // Hash para validação de segurança
  avatar: string;
  area: string; // Cargo / Especialidade
  plan: UserPlan;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  lastLogin: string;
  xp: number; 
  level: number;
  readArticlesIds: string[]; 
  startedArticlesIds: string[];
  calculationsCount?: number;
  conversionsCount?: number;
  checklistsCount?: number;
  planExpiryDate?: string;
  readingGoals: {
    dailyMinutes: number;
    currentMinutesToday: number;
    streak: number;
  };
}

export interface PlanDefinition {
  id: string;
  name: UserPlan;
  maxLevel: string;
  features: string[];
  simulationLimit: number;
  hasAuditAccess: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  isPremium: boolean;
  content: string;
  readTime: number; 
  imageUrl: string;
  isNew?: boolean; // Campo para identificar conteúdos recentes
  updatedAt?: string; // Data de atualização/publicação
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
