
import { UserProfile, UserStatus, UserRole, UserPlan } from '../types';
import { ADMIN_EMAIL } from '../constants';

// Simulação de Hash (em um app real usaria WebCrypto API ou bcrypt no backend)
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
  // Registrar novo usuário
  register: (data: Partial<UserProfile>): { success: boolean; message: string } => {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    if (users.find((u: any) => u.email === data.email)) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    // Verifica se é o e-mail administrativo mestre
    const isSystemAdmin = data.email === ADMIN_EMAIL;

    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: data.name || '',
      email: data.email || '',
      passwordHash: data.passwordHash ? simpleHash(data.passwordHash) : undefined,
      avatar: data.avatar || `https://i.pravatar.cc/150?u=${data.email}`,
      area: data.area || 'Manutenção Industrial',
      plan: isSystemAdmin ? UserPlan.ADMIN : (data.plan || UserPlan.FREE),
      role: isSystemAdmin ? UserRole.ADMIN : (data.role || UserRole.USER),
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

  // Login com e-mail e senha
  login: (email: string, password: string): { success: boolean; user?: UserProfile; message: string } => {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const userIndex = users.findIndex((u: any) => u.email === email);
    const user = users[userIndex];

    if (!user) {
      return { success: false, message: 'Usuário não encontrado. Cadastre-se primeiro.' };
    }

    if (user.status === UserStatus.SUSPENDED) {
      return { success: false, message: 'Sua conta está suspensa. Entre em contato com o suporte.' };
    }

    if (user.passwordHash !== simpleHash(password)) {
      return { success: false, message: 'Senha incorreta. Verifique suas credenciais.' };
    }

    // Ativação forçada do Admin se for o e-mail mestre e ainda não tiver o cargo
    if (email === ADMIN_EMAIL && user.role !== UserRole.ADMIN) {
      user.role = UserRole.ADMIN;
      user.plan = UserPlan.ADMIN;
      users[userIndex] = user;
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }

    // Criar Sessão
    const session = {
      userId: user.id,
      expiresAt: Date.now() + (1000 * 60 * 60 * 24) // 24 horas
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    
    // Atualizar último login
    user.lastLogin = new Date().toISOString();
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

    return { success: true, user, message: 'Login bem-sucedido!' };
  },

  // Logout
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('techpro_user');
  },

  // Validar sessão ativa
  validateSession: (): boolean => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return false;
    const session = JSON.parse(sessionStr);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  }
};
