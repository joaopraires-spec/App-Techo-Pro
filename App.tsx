
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calculator as CalcIcon, 
  RefreshCw, 
  CheckSquare, 
  MessageSquare, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  Bell,
  LogOut,
  ChevronRight,
  Gem,
  Send,
  Crown,
  ChevronDown,
  TrendingUp,
  Award,
  History,
  BarChart3,
  Info,
  Mail,
  Lock,
  UserPlus,
  Briefcase,
  KeyRound,
  ArrowLeft,
  Eye,
  EyeOff,
  FileShield
} from 'lucide-react';
import { UserPlan, UserProfile } from './types.ts';
import { ADMIN_EMAIL } from './constants.ts';
import Dashboard from './components/Dashboard.tsx';
import Library from './components/Library.tsx';
import Calculators from './components/Calculators.tsx';
import Conversions from './components/Conversions.tsx';
import Checklists from './components/Checklists.tsx';
import Forum from './components/Forum.tsx';
import Profile from './components/Profile.tsx';
import Admin from './components/Admin.tsx';
import Contact from './components/Contact.tsx';
import ProfessionalLevel from './components/ProfessionalLevel.tsx';
import ReadingHistory from './components/ReadingHistory.tsx';
import StudyAnalytics from './components/StudyAnalytics.tsx';
import LGPD from './components/LGPD.tsx';
import { getDailyTip } from './services/gemini.ts';

declare global {
  interface Window {
    google: any;
  }
}

// Novo componente de Logo Profissional
const TechProLogo = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" | "xl", className?: string }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`${sizes[size]} ${className} relative flex items-center justify-center shrink-0`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        {/* Hexágono de Fundo - Engenharia */}
        <path 
          d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" 
          fill="url(#blueGrad)" 
          className="opacity-90"
        />
        {/* Acentuação em Ouro - Avanço Profissional */}
        <path 
          d="M50 15 L82 33 L82 67 L50 85 L18 67 L18 33 Z" 
          fill="none" 
          stroke="url(#goldGrad)" 
          strokeWidth="3" 
          className="opacity-50"
        />
        {/* Letras Estilizadas */}
        <path 
          d="M35 35 H65 M50 35 V65" 
          stroke="white" 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        <path 
          d="M58 45 C65 45 65 55 58 55 H50" 
          stroke="white" 
          strokeWidth="6" 
          fill="none" 
          strokeLinecap="round" 
        />
        {/* Detalhe de Tecnologia/Circuito */}
        <circle cx="50" cy="95" r="3" fill="#fbbf24" />
        <circle cx="90" cy="27.5" r="2" fill="#fbbf24" />
        <circle cx="10" cy="27.5" r="2" fill="#fbbf24" />
      </svg>
    </div>
  );
};

const SidebarItem = ({ to, icon: Icon, label, active, onClick, hasSubmenu, badge, premium }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative active:scale-95 ${
      active 
        ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
    } ${premium ? 'border-amber-500/20 hover:border-amber-500/40' : ''}`}
  >
    <Icon size={20} className={active ? 'text-blue-400' : 'group-hover:text-blue-400'} />
    <span className="font-medium text-sm flex-1">{label}</span>
    {premium && <Crown size={12} className="text-amber-500 absolute top-2 right-2" />}
    {badge && (
      <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold shadow-md">{badge}</span>
    )}
    {hasSubmenu && <ChevronRight size={14} className="text-slate-600" />}
  </Link>
);

const DailyTipNotification = ({ area }: { area: string }) => {
  const [tip, setTip] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    getDailyTip(area).then(setTip);
  }, [area]);

  if (!visible || !tip) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-xs z-[60] bg-slate-900 border border-blue-600/30 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 md:slide-in-from-right-full duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase">
          <Info size={14} /> Dica de Campo
        </div>
        <button onClick={() => setVisible(false)} className="text-slate-500 hover:text-white p-1 active:scale-90 transition-all">
          <X size={16} />
        </button>
      </div>
      <p className="text-xs text-slate-300 italic">"{tip}"</p>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('techpro_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (!user && (authMode === 'login' || authMode === 'register')) {
      const initGoogle = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: "61427508688-66qf0062n3v3a863j8c8n14264789.apps.googleusercontent.com",
            callback: handleGoogleResponse,
          });
          window.google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),
            { 
              theme: "filled_blue", 
              size: "large", 
              width: 280, 
              shape: "pill",
              text: authMode === 'login' ? 'signin_with' : 'signup_with'
            }
          );
        }
      };

      if (window.google) {
        initGoogle();
      } else {
        const interval = setInterval(() => {
          if (window.google) {
            initGoogle();
            clearInterval(interval);
          }
        }, 500);
        return () => clearInterval(interval);
      }
    }
  }, [authMode, user]);

  const handleGoogleResponse = (response: any) => {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Adição de padding para evitar erro no atob()
      const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      
      const jsonPayload = decodeURIComponent(atob(paddedBase64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const payload = JSON.parse(jsonPayload);

      const isAdm = payload.email === ADMIN_EMAIL;
      
      // Sincronizar com a lista global de usuários reais
      const registeredUsers = JSON.parse(localStorage.getItem('techpro_registered_users') || '[]');
      const userExists = registeredUsers.some((u: any) => u.email === payload.email);
      
      if (!userExists) {
        const googleUserRecord = { 
          email: payload.email, 
          name: payload.name, 
          avatar: payload.picture,
          area: 'Engenharia de Campo',
          joinedAt: new Date().toISOString()
        };
        localStorage.setItem('techpro_registered_users', JSON.stringify([...registeredUsers, googleUserRecord]));
      }

      const newUser: UserProfile = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        area: 'Engenharia de Campo',
        plan: isAdm ? UserPlan.ADMIN : UserPlan.FREE,
        joinedAt: new Date().toISOString(),
        xp: isAdm ? 1850 : 0,
        level: isAdm ? 3 : 1,
        readArticlesIds: [],
        startedArticlesIds: [],
        calculationsCount: 0,
        conversionsCount: 0,
        checklistsCount: 0,
        readingGoals: { dailyMinutes: 30, currentMinutesToday: isAdm ? 12 : 0, streak: isAdm ? 5 : 0 }
      };
      setUser(newUser);
      localStorage.setItem('techpro_user', JSON.stringify(newUser));
    } catch (err) {
      console.error("Erro ao autenticar com Google:", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('techpro_user');
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('techpro_user', JSON.stringify(updatedUser));
  };

  const validateEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuthSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    if (!validateEmailFormat(email)) {
      alert("Por favor, insira um e-mail em formato válido.");
      return;
    }

    const password = formData.get('password') as string;
    const name = (formData.get('name') as string) || (email === ADMIN_EMAIL ? 'Administrador' : 'Usuário Tech');
    const area = (formData.get('area') as string) || 'Manutenção Industrial';
    const isAdm = email === ADMIN_EMAIL;
    
    const registeredUsers = JSON.parse(localStorage.getItem('techpro_registered_users') || '[]');
    if (authMode === 'register') {
      const newUserRecord = { email, name, password, area, joinedAt: new Date().toISOString() };
      localStorage.setItem('techpro_registered_users', JSON.stringify([...registeredUsers, newUserRecord]));
    }

    const newUser: UserProfile = {
      id: Date.now().toString(),
      name,
      email,
      password,
      avatar: isAdm ? 'https://picsum.photos/seed/admin/200' : 'https://i.pravatar.cc/150?u=techpro',
      area,
      plan: isAdm ? UserPlan.ADMIN : UserPlan.FREE,
      joinedAt: new Date().toISOString(),
      xp: isAdm ? 1850 : 0,
      level: isAdm ? 3 : 1,
      readArticlesIds: [],
      startedArticlesIds: [],
      calculationsCount: 0,
      conversionsCount: 0,
      checklistsCount: 0,
      readingGoals: { dailyMinutes: 30, currentMinutesToday: isAdm ? 12 : 0, streak: isAdm ? 5 : 0 }
    };
    setUser(newUser);
    localStorage.setItem('techpro_user', JSON.stringify(newUser));
  };

  const handleRecoverySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;

    if (!validateEmailFormat(email)) {
      alert("Por favor, insira um e-mail em formato válido.");
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('techpro_registered_users') || '[]');
    const foundUser = registeredUsers.find((u: any) => u.email === email && u.name.toLowerCase().includes(name.toLowerCase()));

    if (foundUser || email === ADMIN_EMAIL) {
      setRecoveryStatus('success');
    } else {
      setRecoveryStatus('error');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-0 md:p-6 overflow-x-hidden">
        <div className="w-full max-w-6xl min-h-screen md:min-h-0 md:h-[700px] bg-slate-900 md:rounded-[40px] border-none md:border md:border-slate-800 shadow-2xl flex flex-col md:flex-row overflow-hidden">
          <div className="md:hidden w-full h-48 relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-60"
              alt="Industrial"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
               <TechProLogo size="md" />
               <h1 className="text-2xl font-black text-white">TechPro Industrial</h1>
            </div>
          </div>

          <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-blue-900">
            <img 
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              alt="Industrial Tech"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/40" />
            <div className="relative z-10 p-12 flex flex-col justify-end h-full">
              <TechProLogo size="xl" className="mb-6 shadow-2xl" />
              <h1 className="text-5xl font-black text-white leading-tight mb-4 tracking-tighter">Evolua sua <br /><span className="text-blue-500">carreira técnica.</span></h1>
              <p className="text-slate-300 text-lg font-medium max-w-sm">A plataforma definitiva para engenheiros e técnicos que buscam excelência em manutenção industrial.</p>
            </div>
          </div>

          <div className="flex-1 md:w-1/2 p-6 md:p-16 flex flex-col justify-center bg-slate-900 overflow-y-auto no-scrollbar">
            {authMode === 'forgot' ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="mb-8 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3 justify-center md:justify-start">
                    <KeyRound className="text-blue-500" /> Recuperar Senha
                  </h2>
                </div>

                {recoveryStatus === 'success' ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto"><Send size={24} /></div>
                    <button onClick={() => { setAuthMode('login'); setRecoveryStatus('idle'); }} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95">Voltar ao Login</button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleRecoverySubmit}>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input name="name" type="text" required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-600 text-base" placeholder="Seu nome registrado" />
                    </div>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input name="email" type="email" required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-600 text-base" placeholder="Seu e-mail de cadastro" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 active:scale-95">Recuperar Senha <Send size={18} /></button>
                    <button type="button" onClick={() => { setAuthMode('login'); setRecoveryStatus('idle'); }} className="w-full text-slate-500 hover:text-white text-sm font-bold flex items-center justify-center gap-2 p-2"><ArrowLeft size={16} /> Voltar para o Login</button>
                  </form>
                )}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="mb-8 text-center md:text-left"><h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">{authMode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2></div>
                <div className="space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <div id="google-signin-button" className="w-full flex justify-center overflow-hidden rounded-full h-[50px]"></div>
                    <div className="flex items-center gap-4 w-full text-slate-700 px-4">
                      <div className="h-px bg-slate-800 flex-1"></div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">ou e-mail</span>
                      <div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                  </div>

                  <form className="space-y-4" onSubmit={handleAuthSubmit}>
                    {authMode === 'register' && (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="relative">
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input name="name" type="text" required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-600 text-base" placeholder="Nome completo" />
                        </div>
                        <div className="relative">
                          <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input name="area" type="text" required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-600 text-base" placeholder="Área de atuação (Ex: Mecânica)" />
                        </div>
                      </div>
                    )}
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input name="email" type="email" required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-600 text-base" placeholder="E-mail profissional" />
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input name="password" type={showPassword ? "text" : "password"} required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-12 py-4 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-600 text-base" placeholder="Sua senha" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors active:scale-90">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 active:scale-95">{authMode === 'login' ? 'Acessar Plataforma' : 'Criar Conta Agora'} <ChevronRight size={18} /></button>
                  </form>

                  <div className="text-center pb-8 md:pb-0 flex flex-col items-center gap-2">
                    <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-2 p-2 active:scale-95">{authMode === 'login' ? <><UserPlus size={16} /> Não tem uma conta? Cadastre-se</> : <>Já tem uma conta? Entre aqui</>}</button>
                    {authMode === 'login' && <button type="button" onClick={() => setAuthMode('forgot')} className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors p-2 active:scale-95">Esqueci a minha Senha</button>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user.plan === UserPlan.ADMIN;
  const isPremium = user.plan === UserPlan.ANNUAL || user.plan === UserPlan.MONTHLY || isAdmin;

  return (
    <div className="flex min-h-screen bg-[#0a0f1e] text-slate-200 overflow-x-hidden">
      <DailyTipNotification area={user.area} />
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#111827]/95 backdrop-blur-xl border-r border-slate-800/50 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TechProLogo size="md" />
                <div><span className="block text-lg font-bold text-white tracking-tight leading-none">TechPro</span><span className="text-[10px] text-slate-500 uppercase tracking-wider">{user.area}</span></div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white active:scale-90 transition-all"><X size={20} /></button>
            </div>

            <Link to="/profile" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 mb-6 p-3 rounded-2xl bg-slate-800/20 border transition-all active:scale-[0.98] group ${isPremium ? 'border-amber-500/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'border-slate-700/30'}`}>
              <img src={user.avatar} className="w-11 h-11 rounded-full border border-slate-700" alt="Avatar" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-blue-400">{user.name}</p>
                <div className="flex items-center gap-1">{isPremium ? (<><Crown size={10} className="text-amber-500" /><span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">Premium</span></>) : (<span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Plano Grátis</span>)}</div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-10">
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/level" icon={TrendingUp} label="Nível Profissional" active={location.pathname.startsWith('/level')} onClick={() => setIsSidebarOpen(false)} badge={`NV ${user.level}`} />
            <SidebarItem to="/library" icon={BookOpen} label="Biblioteca" active={location.pathname.startsWith('/library')} onClick={() => setIsSidebarOpen(false)} hasSubmenu={true} />
            <SidebarItem to="/forum" icon={MessageSquare} label="Fórum" active={location.pathname.startsWith('/forum')} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/calculators" icon={CalcIcon} label="Calculadoras" active={location.pathname.startsWith('/calculators')} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/conversions" icon={RefreshCw} label="Conversões" active={location.pathname.startsWith('/conversions')} onClick={() => setIsSidebarOpen(false)} premium={!isAdmin} />
            <SidebarItem to="/checklists" icon={CheckSquare} label="Checklists" active={location.pathname.startsWith('/checklists')} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/profile" icon={User} label="Perfil & Assinatura" active={location.pathname.startsWith('/profile')} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/contact" icon={Send} label="Contato" active={location.pathname.startsWith('/contact')} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/lgpd" icon={ShieldCheck} label="Privacidade & LGPD" active={location.pathname.startsWith('/lgpd')} onClick={() => setIsSidebarOpen(false)} />
            {isAdmin && <SidebarItem to="/admin" icon={ShieldCheck} label="Admin" active={location.pathname.startsWith('/admin')} onClick={() => setIsSidebarOpen(false)} />}
          </nav>

          <div className="p-4 border-t border-slate-800/50">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-4 text-slate-500 hover:text-red-400 transition-all w-full text-sm font-bold active:scale-95"><LogOut size={20} /><span>Sair da Conta</span></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="lg:hidden p-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors active:scale-90"><Menu size={24} /></button>
          <div className="flex items-center gap-2">
            <TechProLogo size="sm" />
            <div className="font-black text-white tracking-tighter">TECHPRO</div>
          </div>
          <div className="w-10"></div>
        </header>

        {!isPremium && location.pathname !== '/profile' && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 md:px-6 py-3 flex items-center justify-between no-print sticky top-[57px] lg:top-0 z-20 backdrop-blur-md">
            <p className="text-[9px] md:text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-2"><Gem size={14} className="shrink-0" /><span className="truncate">Desbloqueie ferramentas avançadas</span></p>
            <Link to="/profile" className="text-[9px] bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg font-black uppercase tracking-tighter shrink-0 hover:bg-amber-400 transition-colors active:scale-95 shadow-lg shadow-amber-500/20">Upgrade</Link>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 no-scrollbar page-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/level" element={<ProfessionalLevel user={user} />} />
            <Route path="/library/*" element={<Library isPremium={isPremium} isAdmin={isAdmin} user={user} onUpdateUser={handleUpdateUser} />} />
            <Route path="/history" element={<ReadingHistory user={user} />} />
            <Route path="/analytics" element={<StudyAnalytics />} />
            <Route path="/calculators" element={<Calculators isPremium={isPremium} user={user} onUpdateUser={handleUpdateUser} />} />
            <Route path="/conversions" element={isPremium ? <Conversions user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/profile" />} />
            <Route path="/checklists" element={<Checklists user={user} onUpdateUser={handleUpdateUser} />} />
            <Route path="/forum" element={<Forum user={user} />} />
            <Route path="/profile" element={<Profile user={user} setUser={handleUpdateUser} />} />
            <Route path="/contact" element={<Contact user={user} />} />
            <Route path="/lgpd" element={<LGPD />} />
            {isAdmin && <Route path="/admin" element={<Admin user={user} />} />}
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
