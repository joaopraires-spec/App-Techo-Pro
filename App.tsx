
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Calculator, ClipboardCheck, 
  MessageSquare, User, ShieldCheck, LogOut, Menu, X,
  History, BarChart3, Phone, Award, RefreshCw,
  Shield, AlertTriangle, ArrowRight, Mail, Key,
  ChevronRight, ChevronDown, Activity, Droplets, CheckCircle2, Briefcase,
  Eye, EyeOff, Star, Crown, LayoutGrid, Users
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

// Tech Pro Branding Component
const TechProLogo = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" | "xl", className?: string }) => {
  const sizes = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-12 h-12 text-sm",
    xl: "w-14 h-14 text-base"
  };

  return (
    <div className={`${className} flex items-center gap-3`}>
      <div className={`${sizes[size]} bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/30`}>
        TP
      </div>
      <div className="flex flex-col">
        <h1 className="font-bold text-white tracking-tight leading-none text-base">TechPro</h1>
        <p className="text-[9px] text-slate-500 font-medium tracking-tight mt-0.5">Manutenção Industrial</p>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon: Icon, label, active, onClick, isSpecial, hasChevron = true }: any) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all mb-1 ${
      active 
        ? 'bg-[#1e293b]/60 text-blue-400 border border-slate-700/30' 
        : isSpecial 
          ? 'text-amber-500 border border-red-900/20 hover:bg-red-950/10'
          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} className={active ? "text-blue-500" : isSpecial ? "text-amber-500" : "text-slate-400"} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {hasChevron && <ChevronRight size={16} className={active ? "text-blue-500" : "text-slate-600"} />}
  </Link>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover'>('login');
  
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [gender, setGender] = useState<'Masculino' | 'Feminino' | 'Não Aplicável (N/A)' | ''>('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [recoveryPass, setRecoveryPass] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('techpro_user');
    if (savedUser && authService.validateSession()) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (!parsedUser.readingGoals) {
          parsedUser.readingGoals = { dailyMinutes: 30, currentMinutesToday: 0, streak: 0 };
        }
        setUser(parsedUser);
        if (location.pathname === '/login' || location.pathname === '/') {
          navigate('/', { replace: true });
        }
      } catch (e) {
        localStorage.removeItem('techpro_user');
      }
    }
    setLoading(false);
  }, [navigate, location.pathname]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    
    let formatted = val;
    if (val.length > 0) {
      formatted = `(${val.slice(0, 2)}`;
      if (val.length > 2) {
        formatted += `) ${val.slice(2, 7)}`;
        if (val.length > 7) {
          formatted += `-${val.slice(7, 11)}`;
        }
      }
    }
    setPhone(maskedValue(val));
  };

  const maskedValue = (val: string) => {
    let d = val.replace(/\D/g, '');
    if (d.length > 11) d = d.slice(0, 11);
    let m = d;
    if (d.length > 0) m = `(${d.slice(0, 2)}`;
    if (d.length > 2) m = `(${d.slice(0, 2)}) ${d.slice(2, 7)}`;
    if (d.length > 7) m = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
    return m;
  }

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
        setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('As senhas não coincidem.');
        return;
      }
      const res = authService.register({ name, email, phone, password, area, gender: gender as any });
      if (res.success) {
        setAuthMode('login');
        setSuccessMsg('Cadastro realizado com sucesso! Faça login para continuar.');
        setName(''); setEmail(''); setPhone(''); setArea(''); setGender(''); setPassword(''); setConfirmPassword('');
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
    navigate('/', { replace: true });
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-md space-y-6 flex flex-col items-center">
          <TechProLogo size="lg" />

          <div className="bg-slate-900 p-6 sm:p-8 rounded-[32px] border border-slate-800 space-y-5 shadow-2xl w-full max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="text-center sticky top-0 bg-slate-900 pt-2 pb-4 z-10 border-b border-slate-800/50 mb-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {authMode === 'login' ? 'Login Specialist' : authMode === 'register' ? 'Novo Cadastro' : 'Recuperar Senha'}
              </h2>
              <p className="text-slate-500 text-xs mt-1">Acesse a plataforma industrial definitiva.</p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20 flex items-center gap-2 animate-in fade-in duration-300">
                <AlertTriangle size={14} /> {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="p-3.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-xl border border-emerald-500/20 flex items-center gap-2 animate-in fade-in duration-300">
                <CheckCircle2 size={14} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Nome Completo" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                    />
                  </div>

                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Cargo / Especialidade" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all" 
                      value={area} 
                      onChange={e => setArea(e.target.value)} 
                    />
                  </div>
                </>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>

              {authMode === 'register' && (
                <>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="tel" 
                      placeholder="Telefone (XX) XXXXX-XXXX" 
                      required 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all" 
                      value={phone} 
                      onChange={e => setPhone(maskedValue(e.target.value))} 
                    />
                  </div>

                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <select 
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-10 py-3.5 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all appearance-none"
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                    >
                      <option value="" disabled>Selecione o Sexo</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Não Aplicável (N/A)">Não Aplicável (N/A)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                  </div>
                </>
              )}

              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Senha" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-12 py-3.5 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {authMode === 'register' && (
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirmar Senha" 
                    required 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-12 py-3.5 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}

              {recoveryPass && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Senha Recuperada</p>
                   <p className="text-xl font-black text-white">{recoveryPass}</p>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {authMode === 'login' ? 'Entrar' : authMode === 'register' ? 'Criar Conta' : 'Recuperar'}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3 text-center">
              {authMode === 'login' ? (
                <>
                  <button onClick={() => { setAuthMode('recover'); setErrorMsg(''); setSuccessMsg(''); setRecoveryPass(''); }} className="text-xs text-slate-500 hover:text-blue-400 font-medium">Esqueci minha senha</button>
                  <p className="text-xs text-slate-400">
                    Não tem conta? 
                    <button onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }} className="ml-1 text-blue-500 font-bold hover:underline">Cadastre-se</button>
                  </p>
                </>
              ) : (
                <button onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); setRecoveryPass(''); }} className="text-xs text-slate-500 hover:text-blue-400 font-medium">Voltar para Login</button>
              )}
            </div>
          </div>
          <div className="text-center opacity-30 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            v1.0.2 • Tech Pro Industrial
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex font-sans overflow-x-hidden">
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0f1e] border-b border-slate-800/40 flex items-center justify-between px-4 z-40 backdrop-blur-md">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400 active:bg-slate-800/50 rounded-lg">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-md">TP</div>
          <span className="font-bold text-white text-base">TechPro</span>
        </div>
        <div className="relative">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-800 shadow-lg">
            <img src={user.avatar} className="w-full h-full object-cover" alt="" />
          </div>
          {user.plan !== UserPlan.FREE && <div className="absolute -top-1 -right-1 bg-amber-500 p-0.5 rounded-full border border-[#0a0f1e] shadow-sm"><Crown size={10} className="text-slate-950" /></div>}
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 w-[285px] bg-[#0f172a] border-r border-slate-800/40 z-[70] transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <TechProLogo />
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
          </div>

          <div className="mb-6 p-4 bg-slate-900/30 rounded-2xl border border-slate-800/30 flex items-center gap-4">
             <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-700 shrink-0 shadow-inner">
               <img src={user.avatar} className="w-full h-full object-cover" alt="" />
             </div>
             <div className="min-w-0">
               <p className="text-sm font-bold text-white truncate">{user.name}</p>
               <div className="flex items-center gap-1.5 mt-0.5">
                 <Crown size={12} className="text-amber-500" />
                 <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Premium</span>
               </div>
             </div>
          </div>

          <nav className="space-y-1 mb-8">
            <NavItem to="/" icon={LayoutGrid} label="Dashboard" active={location.pathname === '/'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/profile" icon={Crown} label="Premium" active={location.pathname === '/profile' && user.plan !== UserPlan.ADMIN} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/library" icon={BookOpen} label="Conteúdos" active={location.pathname.startsWith('/library')} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/forum" icon={MessageSquare} label="Fórum" active={location.pathname === '/forum'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/calculators" icon={Calculator} label="Calculadoras" active={location.pathname === '/calculators'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/conversions" icon={RefreshCw} label="Conversões" active={location.pathname === '/conversions'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/checklists" icon={ClipboardCheck} label="Checklists" active={location.pathname === '/checklists'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/profile" icon={User} label="Perfil" active={location.pathname === '/profile'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem to="/contact" icon={Mail} label="Contato" active={location.pathname === '/contact'} onClick={() => setIsSidebarOpen(false)} />
            {isAdmin && <NavItem to="/admin" icon={Crown} label="Admin" active={location.pathname === '/admin'} onClick={() => setIsSidebarOpen(false)} isSpecial={true} />}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800/40">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3.5 text-slate-400 hover:text-red-400 transition-all font-medium rounded-xl hover:bg-red-500/5">
              <LogOut size={20} />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen pt-24 lg:pt-8 pb-8 px-4 md:px-8 lg:px-10 overflow-y-auto custom-scrollbar relative z-10">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/library/*" element={<Library isPremium={user.plan !== UserPlan.FREE} isAdmin={isAdmin} user={user} onUpdateUser={setUser} />} />
          <Route path="/calculators" element={<Calculators isPremium={user.plan !== UserPlan.FREE} user={user} onUpdateUser={setUser} />} />
          <Route path="/conversions" element={<Conversions isPremium={user.plan !== UserPlan.FREE} user={user} onUpdateUser={setUser} />} />
          <Route path="/checklists" element={<Checklists user={user} onUpdateUser={setUser} />} />
          <Route path="/forum" element={<Forum user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/level" element={<ProfessionalLevel user={user} />} />
          <Route path="/history" element={<ReadingHistory user={user} />} />
          <Route path="/analytics" element={<StudyAnalytics />} />
          <Route path="/admin" element={isAdmin ? <Admin user={user} /> : <Navigate to="/" />} />
          <Route path="/contact" element={<Contact user={user} />} />
          <Route path="/lgpd" element={<LGPD />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)} />
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
