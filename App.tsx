
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Calculator, ClipboardCheck, 
  MessageSquare, User, ShieldCheck, LogOut, Menu, X,
  History, BarChart3, Phone, Award, RefreshCw,
  Shield, AlertTriangle, ArrowRight, Mail, Key,
  ChevronRight, ChevronDown, Activity, Droplets, CheckCircle2, Briefcase,
  Eye, EyeOff, Star, Crown, LayoutGrid, Users, Trophy, ChevronLeft
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

const TechProLogo = ({ size = "md", className = "", isMinimized = false }: { size?: "sm" | "md" | "lg" | "xl", className?: string, isMinimized?: boolean }) => {
  const pixelSizes = {
    sm: "32px",
    md: "40px",
    lg: "64px",
    xl: "96px"
  };

  return (
    <div className={`${className} flex items-center gap-3`}>
      <div style={{ width: pixelSizes[size], height: pixelSizes[size] }} className="shrink-0 relative flex items-center justify-center">
        {/* SVG Recreating the Hexagon Logo precisely from the provided image */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          {/* Blue Hexagon Background */}
          <path d="M50 5 L93.3 30 L93.3 70 L50 95 L6.7 70 L6.7 30 Z" fill="#2563eb" />
          
          {/* Grey Inner Decorative Line */}
          <path d="M50 14 L85 34 L85 66 L50 86 L15 34 L15 34 Z" fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.3" />
          
          {/* White Stylized TP Symbol from image */}
          <path 
            d="M32 38 H68 M50 38 V65 M50 50 C62 50 68 55 68 62 C68 69 62 74 50 74" 
            fill="none" 
            stroke="white" 
            strokeWidth="10" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Yellow Decorative Dots at vertices */}
          <circle cx="6.7" cy="30" r="4.5" fill="#fbbf24" />
          <circle cx="93.3" cy="30" r="4.5" fill="#fbbf24" />
          <circle cx="50" cy="95" r="4.5" fill="#fbbf24" />
        </svg>
      </div>
      {!isMinimized && (
        <div className="flex flex-col animate-in fade-in duration-500">
          <h1 className="font-black text-white tracking-tighter leading-none text-lg">TechPro</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Industrial Ecosystem</p>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ to, icon: Icon, label, active, onClick, isSpecial, isMinimized }: any) => (
  <Link 
    to={to} 
    onClick={onClick}
    title={isMinimized ? label : ""}
    className={`flex items-center ${isMinimized ? 'justify-center' : 'justify-between'} w-full px-4 py-3.5 rounded-xl transition-all mb-1 ${
      active 
        ? 'bg-[#1e293b]/60 text-blue-400 border border-slate-700/30' 
        : isSpecial 
          ? 'text-amber-500 border border-red-900/10 hover:bg-red-950/5'
          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} className={active ? "text-blue-500" : isSpecial ? "text-amber-500" : "text-slate-400"} />
      {!isMinimized && <span className="text-sm font-medium animate-in fade-in duration-300">{label}</span>}
    </div>
    {!isMinimized && <ChevronRight size={16} className={active ? "text-blue-500" : "text-slate-600"} />}
  </Link>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [gender, setGender] = useState<'Masculino' | 'Feminino' | 'Não Aplicável (N/A)' | ''>('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('techpro_user');
    if (savedUser && authService.validateSession()) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (location.pathname === '/login' || location.pathname === '/') {
          navigate('/', { replace: true });
        }
      } catch (e) {
        localStorage.removeItem('techpro_user');
      }
    }
    setLoading(false);
  }, [navigate]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let d = e.target.value.replace(/\D/g, '');
    if (d.length > 11) d = d.slice(0, 11);
    let m = d;
    if (d.length > 0) m = `(${d.slice(0, 2)}`;
    if (d.length > 2) m = `(${d.slice(0, 2)}) ${d.slice(2, 7)}`;
    if (d.length > 7) m = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
    setPhone(m);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authMode === 'login') {
      const res = authService.login(email, password);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('techpro_user', JSON.stringify(res.user));
        navigate('/', { replace: true });
      } else {
        setErrorMsg(res.message);
      }
    } else if (authMode === 'register') {
      if (!name || !email || !phone || !area || !gender || !password) {
        setErrorMsg('Preencha todos os campos obrigatórios.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('As senhas não coincidem.');
        return;
      }
      const res = authService.register({ name, email, phone, password, area, gender: gender as any });
      if (res.success) {
        setAuthMode('login');
        setSuccessMsg('Cadastro realizado! Faça seu login.');
        setName(''); setEmail(''); setPhone(''); setArea(''); setGender(''); setPassword(''); setConfirmPassword('');
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/', { replace: true });
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        {/* Theme-compliant Background Image: Industrial/Engineering Drawings */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop)' }}
        />
        {/* Dark Overlay with Blur to ensure legibility */}
        <div className="absolute inset-0 z-0 bg-slate-950/80 backdrop-blur-[2px]" />

        <div className="w-full max-w-md space-y-8 flex flex-col items-center relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {/* Logo updated to official hexagon design */}
          <TechProLogo size="xl" />

          <div className="bg-slate-900/90 p-8 rounded-[40px] border border-slate-800 shadow-2xl w-full max-h-[85vh] overflow-y-auto no-scrollbar backdrop-blur-md">
            <div className="text-center pb-4 border-b border-slate-800/50 mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {authMode === 'login' ? 'Acesso Industrial' : authMode === 'register' ? 'Novo Especialista' : 'Recuperar Senha'}
              </h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1.5">Ecossistema de Alta Performance</p>
            </div>

            {errorMsg && <div className="p-4 bg-red-500/10 text-red-400 text-xs rounded-2xl border border-red-500/20 flex items-center gap-3 mb-4 animate-in shake duration-300"><AlertTriangle size={16} /> {errorMsg}</div>}
            {successMsg && <div className="p-4 bg-emerald-500/10 text-emerald-400 text-xs rounded-2xl border border-emerald-500/20 flex items-center gap-3 mb-4"><CheckCircle2 size={16} /> {successMsg}</div>}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" placeholder="Nome Completo" required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 transition-all" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="relative"><Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="text" placeholder="Área de Atuação" required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 transition-all" value={area} onChange={e => setArea(e.target.value)} />
                  </div>
                </>
              )}

              <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="email" placeholder="E-mail" required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              {authMode === 'register' && (
                <>
                  <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input type="tel" placeholder="Telefone" required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 transition-all" value={phone} onChange={handlePhoneChange} />
                  </div>
                  <div className="relative"><Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <select required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-10 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 appearance-none" value={gender} onChange={e => setGender(e.target.value as any)}>
                      <option value="" disabled>Sexo</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Não Aplicável (N/A)">Não Aplicável (N/A)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                  </div>
                </>
              )}

              <div className="relative"><Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type={showPassword ? "text" : "password"} placeholder="Senha" required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-12 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>

              {authMode === 'register' && (
                <div className="relative"><Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirmar Senha" required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-12 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 transition-all" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-white">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-blue-900/30 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 uppercase tracking-widest text-xs">
                {authMode === 'login' ? 'Entrar' : 'Cadastrar'} <ArrowRight size={18} />
              </button>
            </form>
            <div className="pt-6 text-center">
              <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] transition-all hover:text-blue-400">
                {authMode === 'login' ? 'Não possui conta? Registre-se' : 'Já possui conta? Faça login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex font-sans overflow-x-hidden">
      {/* Header Mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0f1e]/90 backdrop-blur-md border-b border-slate-800/40 flex items-center justify-between px-4 z-40">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400 active:bg-slate-800 rounded-lg transition-colors">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <TechProLogo size="sm" isMinimized={true} />
          <span className="font-bold text-white text-sm">TechPro</span>
        </div>
        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-800 shadow-md">
           <img src={user.avatar} className="w-full h-full object-cover" alt="" />
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0f172a] border-r border-slate-800/40 z-[70] transform transition-all duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} ${isMinimized ? 'w-[80px]' : 'w-[285px]'}`}>
        
        {/* Minimize Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white transition-all z-[80] shadow-md"
        >
          {isMinimized ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`h-full flex flex-col p-6 overflow-y-auto no-scrollbar ${isMinimized ? 'items-center px-4' : ''}`}>
          <div className={`flex items-center justify-between mb-8 ${isMinimized ? 'justify-center' : ''}`}>
            <TechProLogo isMinimized={isMinimized} size="md" />
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500"><X size={20} /></button>
          </div>

          {/* Profile Card Sidebar */}
          <div className={`mb-6 p-4 bg-slate-900/30 rounded-2xl border border-slate-800/20 flex items-center gap-4 transition-all ${isMinimized ? 'justify-center p-2' : ''}`}>
             <div className={`w-12 h-12 rounded-full overflow-hidden border border-slate-700 shrink-0 ${isMinimized ? 'w-10 h-10' : ''}`}>
               <img src={user.avatar} className="w-full h-full object-cover" alt="" />
             </div>
             {!isMinimized && (
               <div className="min-w-0 animate-in fade-in duration-300">
                 <p className="text-sm font-bold text-white truncate">{user.name}</p>
                 <div className="flex items-center gap-1.5 mt-0.5">
                   <Trophy size={12} className="text-amber-500" />
                   <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Nível {user.level}</span>
                 </div>
               </div>
             )}
          </div>

          <nav className="space-y-1 mb-8">
            <NavItem to="/" icon={LayoutGrid} label="Dashboard" active={location.pathname === '/'} onClick={() => setIsSidebarOpen(false)} isMinimized={isMinimized} />
            <NavItem to="/level" icon={Trophy} label="Carreira" active={location.pathname === '/level'} onClick={() => setIsSidebarOpen(false)} isMinimized={isMinimized} />
            <NavItem to="/library" icon={BookOpen} label="Conteúdos" active={location.pathname.startsWith('/library')} onClick={() => setIsSidebarOpen(false)} isMinimized={isMinimized} />
            <NavItem to="/forum" icon={MessageSquare} label="Fórum" active={location.pathname === '/forum'} onClick={() => setIsSidebarOpen(false)} isMinimized={isMinimized} />
            <NavItem to="/calculators" icon={Calculator} label="Calculadoras" active={location.pathname === '/calculators'} onClick={() => setIsSidebarOpen(false)} isMinimized={isMinimized} />
            <NavItem to="/conversions" icon={RefreshCw} label="Conversões" active={location.pathname === '/conversions'} onClick={() => setIsSidebarOpen(false)} isMinimized={isMinimized} />
            <NavItem to="/checklists" icon={ClipboardCheck} label="Checklists" active={location.pathname === '/checklists'} onClick={() => setIsSidebarOpen(false)} isMinimized={isMinimized} />
            <NavItem to="/profile" icon={User} label="Perfil" active={location.pathname === '/profile'} onClick={() => setIsSidebarOpen(false)} isMinimized={isMinimized} />
            {user.role === UserRole.ADMIN && <NavItem to="/admin" icon={ShieldCheck} label="Admin" active={location.pathname === '/admin'} onClick={() => setIsSidebarOpen(false)} isSpecial={true} isMinimized={isMinimized} />}
          </nav>

          <div className={`mt-auto pt-6 border-t border-slate-800/40 ${isMinimized ? 'w-full flex justify-center' : ''}`}>
            <button onClick={handleLogout} className={`flex items-center gap-3 w-full px-4 py-3.5 text-slate-400 hover:text-red-400 font-medium rounded-xl hover:bg-red-500/5 transition-all ${isMinimized ? 'justify-center px-0' : ''}`}>
              <LogOut size={20} />
              {!isMinimized && <span className="text-sm animate-in fade-in duration-300">Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 min-h-screen pt-24 lg:pt-8 pb-8 px-4 md:px-8 lg:px-10 overflow-y-auto custom-scrollbar relative z-10 transition-all duration-300 ${isMinimized ? 'lg:pl-[80px]' : 'lg:pl-[285px]'}`}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/library/*" element={<Library isPremium={user.plan !== UserPlan.FREE} isAdmin={user.role === UserRole.ADMIN} user={user} onUpdateUser={setUser} />} />
          <Route path="/calculators" element={<Calculators isPremium={user.plan !== UserPlan.FREE} user={user} onUpdateUser={setUser} />} />
          <Route path="/conversions" element={<Conversions isPremium={user.plan !== UserPlan.FREE} user={user} onUpdateUser={setUser} />} />
          <Route path="/checklists" element={<Checklists user={user} onUpdateUser={setUser} />} />
          <Route path="/forum" element={<Forum user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/level" element={<ProfessionalLevel user={user} />} />
          <Route path="/admin" element={user.role === UserRole.ADMIN ? <Admin user={user} /> : <Navigate to="/" />} />
          <Route path="/contact" element={<Contact user={user} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
