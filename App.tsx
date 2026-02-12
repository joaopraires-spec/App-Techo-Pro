
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
  FileShield,
  Instagram,
  AlertTriangle,
  CheckCircle,
  FileText,
  ShieldAlert,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { UserPlan, UserProfile, UserRole, UserStatus } from './types.ts';
import { ADMIN_EMAIL, LEVELS } from './constants.ts';
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
import { authService } from './services/authService.ts';
import { GoogleGenAI } from "@google/genai";

const TechProLogo = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" | "xl", className?: string }) => {
  const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12", xl: "w-16 h-16" };
  return (
    <div className={`${sizes[size]} ${className} relative flex items-center justify-center shrink-0`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" fill="url(#blueGrad)" className="opacity-90"/>
        <path d="M50 15 L82 33 L82 67 L50 85 L18 67 L18 33 Z" fill="none" stroke="url(#goldGrad)" strokeWidth="3" className="opacity-50"/>
        <path d="M35 35 H65 M50 35 V65" stroke="white" strokeWidth="8" strokeLinecap="round" />
        <path d="M58 45 C65 45 65 55 58 55 H50" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="95" r="3" fill="#fbbf24" /><circle cx="90" cy="27.5" r="2" fill="#fbbf24" /><circle cx="10" cy="27.5" r="2" fill="#fbbf24" />
      </svg>
    </div>
  );
};

const SidebarItem = ({ to, icon: Icon, label, active, onClick, badge, premium, external }: any) => {
  const content = (
    <>
      <Icon size={20} className={active ? 'text-blue-400' : 'group-hover:text-blue-400'} />
      <span className="font-medium text-sm flex-1">{label}</span>
      {premium && <Crown size={12} className="text-amber-500 absolute top-2 right-2" />}
      {badge && (
        <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold shadow-md">{badge}</span>
      )}
    </>
  );

  const className = `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative active:scale-95 ${
    active 
      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
  } ${premium ? 'border-amber-500/20 hover:border-amber-500/40' : ''}`;

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={to} onClick={onClick} className={className}>
      {content}
    </Link>
  );
};

const AppContent: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isValid = authService.validateSession();
    const savedUser = localStorage.getItem('techpro_user');
    if (isValid && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.email === ADMIN_EMAIL) {
        parsedUser.role = UserRole.ADMIN;
        parsedUser.plan = UserPlan.ADMIN;
      }
      setUser(parsedUser);
    } else {
      setUser(null);
      localStorage.removeItem('techpro_user');
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      if (authMode === 'register') {
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;
        const area = formData.get('area') as string;
        const res = authService.register({ name, email, password, area });
        if (res.success) {
          setAuthMode('login');
          setSuccessMsg("Conta criada! Por favor, faça login.");
        } else {
          setErrorMsg(res.message);
        }
      } else if (authMode === 'login') {
        const password = formData.get('password') as string;
        const res = authService.login(email, password);
        if (res.success && res.user) {
          if (res.user.email === ADMIN_EMAIL) {
            res.user.role = UserRole.ADMIN;
            res.user.plan = UserPlan.ADMIN;
          }
          setUser(res.user);
          localStorage.setItem('techpro_user', JSON.stringify(res.user));
        } else {
          setErrorMsg(res.message);
        }
      } else if (authMode === 'forgot') {
        const name = formData.get('name') as string;
        const res = authService.recoverPassword(email, name);
        if (res.success) {
          // Utilizar Gemini para gerar um e-mail profissional
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const prompt = `Gere um corpo de e-mail corporativo e profissional para o usuário ${name} do app Tech Pro Industrial. Informe que a senha cadastrada é: "${res.password}". O e-mail deve ser formal, curto e encorajador.`;
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
          });
          
          setSuccessMsg(`SIMULAÇÃO DE E-MAIL ENVIADO:\n\n${response.text}`);
          // Não redireciona imediatamente para o usuário ver a senha simulada
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err) {
      setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-0 md:p-6 overflow-x-hidden">
        <div className="w-full max-w-6xl min-h-screen md:min-h-0 md:h-[700px] bg-slate-900 md:rounded-[40px] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-800/50">
          <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-blue-900">
            <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Industrial Tech"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/40" />
            <div className="relative z-10 p-12 flex flex-col justify-end h-full">
              <TechProLogo size="xl" className="mb-6 shadow-2xl" />
              <h1 className="text-5xl font-black text-white leading-tight mb-4 tracking-tighter">Segurança <br /><span className="text-blue-500">e Profissionalismo.</span></h1>
              <p className="text-slate-300 text-lg font-medium max-w-sm">Acesse a maior base de conhecimento técnico verificada para engenheiros de campo.</p>
            </div>
          </div>

          <div className="flex-1 md:w-1/2 p-6 md:p-16 flex flex-col justify-center bg-slate-900">
            <div className="animate-in fade-in duration-500">
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                  {authMode === 'login' ? 'Login Specialist' : authMode === 'register' ? 'Novo Cadastro' : 'Recuperar Senha'}
                </h2>
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2 mt-4 animate-bounce">
                    <AlertTriangle size={14} /> {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-xs font-bold flex flex-col gap-3 mt-4 animate-pulse whitespace-pre-wrap">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} /> Solicitação Processada
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl font-mono text-slate-300 leading-relaxed border border-emerald-500/20">
                      {successMsg}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <form className="space-y-4" onSubmit={handleAuthSubmit}>
                  {(authMode === 'register' || authMode === 'forgot') && (
                    <>
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input name="name" type="text" required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600" placeholder="Nome completo" />
                      </div>
                      {authMode === 'register' && (
                        <div className="relative">
                          <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input name="area" type="text" required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600" placeholder="Especialidade (Ex: Mecânica)" />
                        </div>
                      )}
                    </>
                  )}
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input name="email" type="email" required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600" placeholder="E-mail profissional" />
                  </div>
                  {authMode !== 'forgot' && (
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input name="password" type={showPassword ? "text" : "password"} required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-12 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-600" placeholder="Sua senha" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  )}
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (authMode === 'login' ? 'Entrar no Sistema' : authMode === 'register' ? 'Finalizar Cadastro' : 'Enviar Dados por E-mail')} <ChevronRight size={18} />
                  </button>
                </form>

                <div className="text-center flex flex-col items-center gap-3">
                  {authMode === 'login' && (
                    <button onClick={() => { setAuthMode('forgot'); setErrorMsg(null); setSuccessMsg(null); }} className="text-sm font-semibold text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1">
                      <HelpCircle size={14} /> Esqueci minha senha
                    </button>
                  )}
                  <button onClick={() => { setAuthMode(authMode === 'login' || authMode === 'forgot' ? 'register' : 'login'); setErrorMsg(null); setSuccessMsg(null); }} className="text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors">
                    {authMode === 'login' || authMode === 'forgot' ? 'Ainda não tem conta? Registre-se aqui' : 'Já possui cadastro? Faça login'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === UserRole.ADMIN;
  const isPremium = user.plan === UserPlan.ANNUAL || user.plan === UserPlan.MONTHLY || isAdmin;
  const currentLevelMedal = LEVELS.find(l => l.level === user.level)?.medal || '🥉';

  return (
    <div className="flex min-h-screen bg-[#0a0f1e] text-slate-200 overflow-x-hidden">
      <header className="lg:hidden p-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors"><Menu size={24} /></button>
        <TechProLogo size="sm" />
        <div className="w-10"></div>
      </header>

      {isSidebarOpen && <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#111827]/95 backdrop-blur-xl border-r border-slate-800/50 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <TechProLogo size="md" />
              <div><span className="block text-lg font-bold text-white tracking-tight">TechPro</span><span className="text-[10px] text-slate-500 uppercase">{user.area}</span></div>
            </div>
            <Link to="/profile" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-slate-800/20 border border-slate-700/30 group">
              <img src={user.avatar} className="w-11 h-11 rounded-full border border-slate-700 object-cover" alt="Avatar" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <div className="flex items-center gap-1">
                  {isPremium ? <><Crown size={10} className="text-amber-500" /><span className="text-[9px] text-amber-500 font-black uppercase">Premium</span></> : <span className="text-[9px] text-slate-500 font-bold uppercase">Plano Free</span>}
                </div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-10">
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/level" icon={TrendingUp} label="Evolução Técnica" active={location.pathname === '/level'} onClick={() => setIsSidebarOpen(false)} badge={`${currentLevelMedal} NV ${user.level}`} />
            <SidebarItem to="/library" icon={BookOpen} label="Biblioteca" active={location.pathname.startsWith('/library')} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/forum" icon={MessageSquare} label="Fórum" active={location.pathname === '/forum'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/calculators" icon={CalcIcon} label="Calculadoras" active={location.pathname === '/calculators'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/conversions" icon={RefreshCw} label="Conversões" active={location.pathname === '/conversions'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/checklists" icon={CheckSquare} label="Inspeções" active={location.pathname === '/checklists'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/profile" icon={User} label="Perfil" active={location.pathname === '/profile'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/contact" icon={Mail} label="Suporte Técnico" active={location.pathname === '/contact'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/lgpd" icon={ShieldAlert} label="Privacidade & LGPD" active={location.pathname === '/lgpd'} onClick={() => setIsSidebarOpen(false)} />
            {isAdmin && <SidebarItem to="/admin" icon={ShieldCheck} label="Admin" active={location.pathname === '/admin'} onClick={() => setIsSidebarOpen(false)} />}
          </nav>

          <div className="p-4 border-t border-slate-800/50 space-y-2">
            <SidebarItem 
              to="https://instagram.com/techpro_industrial" 
              icon={Instagram} 
              label="Instagram" 
              external 
            />
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-4 text-slate-500 hover:text-red-400 transition-all w-full text-sm font-bold">
              <LogOut size={20} /> <span>Sair com Segurança</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 lg:p-10">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/level" element={<ProfessionalLevel user={user} />} />
          <Route path="/library/*" element={<Library isPremium={isPremium} isAdmin={isAdmin} user={user} onUpdateUser={setUser} />} />
          <Route path="/calculators" element={<Calculators isPremium={isPremium} user={user} onUpdateUser={setUser} />} />
          <Route path="/conversions" element={<Conversions isPremium={isPremium} user={user} onUpdateUser={setUser} />} />
          <Route path="/checklists" element={<Checklists user={user} onUpdateUser={setUser} />} />
          <Route path="/forum" element={<Forum user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/contact" element={<Contact user={user} />} />
          <Route path="/lgpd" element={<LGPD />} />
          {isAdmin && <Route path="/admin" element={<Admin user={user} />} />}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
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
