
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Calculator, ClipboardCheck, 
  MessageSquare, User, ShieldCheck, LogOut, Menu, X,
  History, BarChart3, Phone, Award, RefreshCw,
  Shield, AlertTriangle, ArrowRight, Mail, Key,
  ChevronRight, Activity, Droplets, CheckCircle2
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Calculators from './components/Calculators';
import Checklists from './components/Checklists';
import Forum from './components/Forum';
import Profile from './components/Profile';
import Admin from './components/Admin';
import Conversions from './components/Conversions';
import Contact from './components/Contact';
import ProfessionalLevel from './components/ProfessionalLevel';
import ReadingHistory from './components/ReadingHistory';
import StudyAnalytics from './components/StudyAnalytics';
import LGPD from './components/LGPD';

import { authService } from './services/authService';
import { UserProfile, UserRole, UserPlan } from './types';

// Tech Pro Custom Logo Component
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
        {/* Hexagon Base */}
        <path 
          d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" 
          fill="url(#blueGrad)" 
          className="opacity-90"
        />
        {/* Inner Border */}
        <path 
          d="M50 15 L82 33 L82 67 L50 85 L18 67 L18 33 Z" 
          fill="none" 
          stroke="url(#goldGrad)" 
          strokeWidth="3" 
          className="opacity-50"
        />
        {/* Stylized 'Tp' */}
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
        {/* Decorative dots */}
        <circle cx="50" cy="95" r="3" fill="#fbbf24" />
        <circle cx="90" cy="27.5" r="2" fill="#fbbf24" />
        <circle cx="10" cy="27.5" r="2" fill="#fbbf24" />
      </svg>
    </div>
  );
};

const NavItem = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-bold' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm">{label}</span>
  </Link>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover'>('login');
  
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [recoveryPass, setRecoveryPass] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('techpro_user');
    if (savedUser && authService.validateSession()) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('techpro_user');
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authMode === 'login') {
      const res = authService.login(email, password);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('techpro_user', JSON.stringify(res.user));
      } else {
        setErrorMsg(res.message);
      }
    } else if (authMode === 'register') {
      const res = authService.register({ name, email, phone, password });
      if (res.success) {
        setAuthMode('login');
        setSuccessMsg('Cadastro realizado com sucesso! Faça login para continuar.');
      } else {
        setErrorMsg(res.message);
      }
    } else if (authMode === 'recover') {
      const res = authService.recoverPassword(email, name);
      if (res.success) {
        setRecoveryPass(res.password || '');
        setSuccessMsg('Usuário validado com sucesso.');
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('techpro_user', JSON.stringify(updatedUser));
    const users = JSON.parse(localStorage.getItem('techpro_registered_users') || '[]');
    const index = users.findIndex((u: any) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('techpro_registered_users', JSON.stringify(users));
    }
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-0 md:p-6 overflow-x-hidden">
        <div className="w-full max-w-6xl min-h-screen md:min-h-0 md:h-[700px] bg-slate-900 md:rounded-[40px] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-800/50">
          
          {/* Lado Esquerdo - Branding (Oculto no Mobile) */}
          <div className="hidden md:flex md:w-1/2 bg-[#020617] relative p-16 flex-col justify-between overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-full h-full bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <TechProLogo size="lg" />
                <h1 className="text-2xl font-black text-white tracking-tighter">TECH PRO</h1>
              </div>
              <h2 className="text-5xl font-black text-white leading-tight tracking-tighter">
                A Revolução da <br />
                <span className="text-blue-500">Engenharia de Campo</span>
              </h2>
              <p className="text-slate-500 mt-6 text-lg font-medium max-w-sm leading-relaxed">
                Acesse ferramentas críticas, bibliotecas técnicas e suporte especializado em uma única plataforma industrial.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-10 h-10 rounded-full border-2 border-[#020617]" alt="" />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                +2.500 Especialistas <br /> conectados hoje
              </p>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute center inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <TechProLogo size="xl" className="scale-[8] rotate-12" />
            </div>
          </div>

          {/* Lado Direito - Formulários */}
          <div className="flex-1 md:w-1/2 p-6 md:p-16 flex flex-col justify-center bg-slate-900 overflow-y-auto">
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
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2 mt-4 animate-pulse">
                    {/* Fix: Added missing CheckCircle2 component from lucide-react */}
                    <CheckCircle2 size={14} /> {successMsg}
                  </div>
                )}
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Nome Completo" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    placeholder="E-mail Corporativo" 
                    required 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>

                {authMode === 'register' && (
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="tel" 
                      placeholder="Telefone (DDD + Número)" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                    />
                  </div>
                )}

                {(authMode === 'login' || authMode === 'register') && (
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="password" 
                      placeholder="Senha de Acesso" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                    />
                  </div>
                )}

                {authMode === 'recover' && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Confirme seu Nome" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-700"
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                    />
                  </div>
                )}

                {recoveryPass && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl text-center space-y-2">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sua Senha Recuperada</p>
                    <p className="text-2xl font-black text-white">{recoveryPass}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {authMode === 'login' ? 'Entrar na Plataforma' : authMode === 'register' ? 'Criar Minha Conta' : 'Solicitar Senha'}
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-8 flex flex-col gap-4 text-center">
                {authMode === 'login' ? (
                  <>
                    <button onClick={() => { setAuthMode('recover'); setErrorMsg(''); setSuccessMsg(''); }} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Esqueci minha senha</button>
                    <div className="h-px bg-slate-800 w-1/2 mx-auto" />
                    <p className="text-sm text-slate-500">
                      Ainda não tem acesso? 
                      <button onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }} className="text-blue-500 font-bold ml-1 hover:underline">Cadastre-se</button>
                    </p>
                  </>
                ) : (
                  <button onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); setRecoveryPass(''); }} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Voltar para o Login</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === UserRole.ADMIN;
  const isPremium = user.plan !== UserPlan.FREE;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-blue-600/30 selection:text-blue-400">
      {/* Mobile Nav Header */}
      <header className="lg:hidden p-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors">
          <Menu size={24} />
        </button>
        <TechProLogo size="sm" />
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700">
          <img src={user.avatar} className="w-full h-full object-cover" alt="" />
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 z-[70] transform transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
               <TechProLogo size="md" />
               <h1 className="text-xl font-black tracking-tighter">TECH PRO</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500"><X size={20} /></button>
          </div>

          <nav className="space-y-1 mb-8">
            <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Menu Principal</p>
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/library" icon={BookOpen} label="Biblioteca Técnica" active={location.pathname.startsWith('/library')} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/calculators" icon={Calculator} label="Calculadoras" active={location.pathname === '/calculators'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/conversions" icon={RefreshCw} label="Conversores" active={location.pathname === '/conversions'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/checklists" icon={ClipboardCheck} label="Inspeções / Check" active={location.pathname === '/checklists'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/forum" icon={MessageSquare} label="Fórum Comunitário" active={location.pathname === '/forum'} onClick={() => setIsSidebarOpen(false)} />
          </nav>

          <nav className="space-y-1 mb-8">
            <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Sua Carreira</p>
            <NavItem to="/level" icon={Award} label="Nível Profissional" active={location.pathname === '/level'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/history" icon={History} label="Histórico" active={location.pathname === '/history'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/analytics" icon={BarChart3} label="Performance" active={location.pathname === '/analytics'} onClick={() => setIsSidebarOpen(false)} />
          </nav>

          <div className="mt-auto space-y-4 pt-6 border-t border-slate-800">
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border ${location.pathname === '/admin' ? 'bg-blue-600 text-white border-blue-500' : 'bg-blue-600/10 text-blue-400 border-blue-600/20 hover:bg-blue-600/20'}`}>
                <ShieldCheck size={20} />
                <span className="text-sm font-bold">Painel Admin</span>
              </Link>
            )}
            
            <div className="bg-slate-950 p-4 rounded-[24px] border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                  <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[9px] text-slate-500 font-black uppercase truncate">{user.plan}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* Fix: Changed UserIcon to User, which is the imported name from lucide-react */}
                <Link to="/profile" className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center transition-all">
                  <User size={18} />
                </Link>
                <button onClick={handleLogout} className="p-2.5 bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-all">
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 text-[8px] font-black text-slate-700 uppercase tracking-widest">
              <Link to="/lgpd" className="hover:text-slate-500">Privacidade</Link>
              <Link to="/contact" className="hover:text-slate-500">Suporte</Link>
              <span>v1.0.2</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 lg:p-10">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/library/*" element={<Library isPremium={isPremium} isAdmin={isAdmin} user={user} onUpdateUser={handleUpdateUser} />} />
          <Route path="/calculators" element={<Calculators isPremium={isPremium} user={user} onUpdateUser={handleUpdateUser} />} />
          <Route path="/conversions" element={<Conversions isPremium={isPremium} user={user} onUpdateUser={handleUpdateUser} />} />
          <Route path="/checklists" element={<Checklists user={user} onUpdateUser={handleUpdateUser} />} />
          <Route path="/forum" element={<Forum user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={handleUpdateUser} />} />
          <Route path="/level" element={<ProfessionalLevel user={user} />} />
          <Route path="/history" element={<ReadingHistory user={user} />} />
          <Route path="/analytics" element={<StudyAnalytics />} />
          <Route path="/admin" element={isAdmin ? <Admin user={user} /> : <Navigate to="/" />} />
          <Route path="/contact" element={<Contact user={user} />} />
          <Route path="/lgpd" element={<LGPD />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
