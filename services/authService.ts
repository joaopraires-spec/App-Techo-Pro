
import { UserProfile, UserStatus, UserRole, UserPlan } from '../types';
import { ADMIN_EMAIL } from '../constants';

// Simulação de Hash
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'tp_hash_' + Math.abs(hash).toString(16);
};

const SESSION_KEY = 'techpro_session_token';
const USERS_DB_KEY = 'techpro_registered_users';

export const authService = {
  register: (data: Partial<UserProfile & { passwordRaw?: string }>): { success: boolean; message: string } => {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    if (users.find((u: any) => u.email === data.email)) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    const isSystemAdmin = data.email === ADMIN_EMAIL;
    const rawPassword = data.password || '';

    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: data.name || '',
      email: data.email || '',
      password: rawPassword, // Armazena senha para recuperação
      passwordHash: simpleHash(rawPassword),
      avatar: data.avatar || `https://i.pravatar.cc/150?u=${data.email}`,
      area: data.area || 'Manutenção Industrial',
      plan: isSystemAdmin ? UserPlan.ADMIN : UserPlan.FREE,
      role: isSystemAdmin ? UserRole.ADMIN : UserRole.USER,
      status: UserStatus.ACTIVE,
      joinedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      xp: 0,
      level: 1,
      readArticlesIds: [],
      startedArticlesIds: [],
      calculationsCount: 0,
      conversionsCount: 0,
      checklistsCount: 0,
      readingGoals: { dailyMinutes: 30, currentMinutesToday: 0, streak: 0 }
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    return { success: true, message: 'Cadastro realizado com sucesso!' };
  },

  login: (email: string, password: string): { success: boolean; user?: UserProfile; message: string } => {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const userIndex = users.findIndex((u: any) => u.email === email);
    const user = users[userIndex];

    if (!user) {
      return { success: false, message: 'Usuário não encontrado. Cadastre-se primeiro.' };
    }

    if (user.status === UserStatus.SUSPENDED) {
      return { success: false, message: 'Sua conta está suspensa.' };
    }

    if (user.passwordHash !== simpleHash(password)) {
      return { success: false, message: 'Senha incorreta.' };
    }

    if (email === ADMIN_EMAIL && user.role !== UserRole.ADMIN) {
      user.role = UserRole.ADMIN;
      user.plan = UserPlan.ADMIN;
      users[userIndex] = user;
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }

    const session = { userId: user.id, expiresAt: Date.now() + 86400000 };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    user.lastLogin = new Date().toISOString();
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

    return { success: true, user, message: 'Login bem-sucedido!' };
  },

  recoverPassword: (email: string, name: string): { success: boolean; message: string; password?: string } => {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const user = users.find((u: any) => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.name.toLowerCase().includes(name.toLowerCase())
    );

    if (!user) {
      return { success: false, message: 'Dados não conferem. Verifique o e-mail e nome.' };
    }

    return { 
      success: true, 
      message: 'Usuário validado com sucesso.', 
      password: user.password 
    };
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('techpro_user');
  },

  validateSession: (): boolean => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return false;
    const session = JSON.parse(sessionStr);
    return Date.now() < session.expiresAt;
  }
};
