
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
  Briefcase
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
import { getDailyTip } from './services/gemini.ts';

const SidebarItem = ({ to, icon: Icon, label, active, onClick, hasSubmenu, badge, premium }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
      active 
        ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
    } ${premium ? 'border-amber-500/20 hover:border-amber-500/40' : ''}`}
  >
    <Icon size={20} className={active ? 'text-blue-400' : 'group-hover:text-blue-400'} />
    <span className="font-medium text-sm flex-1">{label}</span>
    {premium && <Crown size={12} className="text-amber-500 absolute top-2 right-2" />}
    {badge && (
      <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">{badge}</span>
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
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-xs z-[60] bg-slate-900 border border-blue-600/30 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 md:slide-in-from-right-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase">
          <Info size={14} /> Dica de Campo
        </div>
        <button onClick={() => setVisible(false)} className="text-slate-500 hover:text-white p-1">
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
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('techpro_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('techpro_user');
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('techpro_user', JSON.stringify(updatedUser));
  };

  const handleGoogleLogin = () => {
    const googleUser: UserProfile = {
      id: 'google-123',
      name: 'Usuário Google',
      email: 'usuario.google@gmail.com',
      avatar: 'https://i.pravatar.cc/150?u=google',
      area: 'Manutenção Industrial',
      plan: UserPlan.FREE,
      joinedAt: new Date().toISOString(),
      xp: 0,
      level: 1,
      readArticlesIds: [],
      startedArticlesIds: [],
      readingGoals: { dailyMinutes: 30, currentMinutesToday: 0, streak: 0 }
    };
    setUser(googleUser);
    localStorage.setItem('techpro_user', JSON.stringify(googleUser));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-0 md:p-6 overflow-x-hidden">
        <div className="w-full max-w-6xl min-h-screen md:min-h-0 md:h-[700px] bg-slate-900 md:rounded-[40px] border-none md:border md:border-slate-800 shadow-2xl flex flex-col md:flex-row overflow-hidden">
          
          {/* Mobile Only: Top Image Banner */}
          <div className="md:hidden w-full h-48 relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-60"
              alt="Industrial"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40" />
            <div className="absolute bottom-6 left-6">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-lg mb-2">TP</div>
               <h1 className="text-2xl font-black text-white">TechPro Industrial</h1>
            </div>
          </div>

          {/* Left Side: Desktop Only Content */}
          <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-blue-900">
            <img 
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              alt="Industrial Tech"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/40" />
            <div className="relative z-10 p-12 flex flex-col justify-end h-full">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-900/50 font-bold text-white text-3xl">
                TP
              </div>
              <h1 className="text-5xl font-black text-white leading-tight mb-4 tracking-tighter">
                Evolua sua <br />
                <span className="text-blue-500">carreira técnica.</span>
              </h1>
              <p className="text-slate-300 text-lg font-medium max-w-sm">
                A plataforma definitiva para engenheiros e técnicos que buscam excelência em manutenção industrial.
              </p>
              <div className="mt-10 flex gap-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">100+</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Artigos Técnicos</span>
                </div>
                <div className="w-px h-10 bg-slate-800 self-center"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">1.4k</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Profissionais</span>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Form Container */}
          <div className="flex-1 md:w-1/2 p-6 md:p-16 flex flex-col justify-center bg-slate-900 overflow-y-auto no-scrollbar">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                {authMode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
              </h2>
              <p className="text-slate-500 text-sm">
                {authMode === 'login' 
                  ? 'Acesse sua conta para continuar sua jornada técnica.' 
                  : 'Junte-se a maior comunidade técnica de manutenção.'}
              </p>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handleGoogleLogin}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-3 active:scale-95 touch-manipulation"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
                Login com Google
              </button>

              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-slate-800"></div>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">ou e-mail</span>
                <div className="flex-1 h-px bg-slate-800"></div>
              </div>

              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email') as string;
                const name = (formData.get('name') as string) || (email === ADMIN_EMAIL ? 'Administrador' : 'Usuário Tech');
                const area = (formData.get('area') as string) || 'Manutenção Industrial';
                const isAdm = email === ADMIN_EMAIL;
                
                const newUser: UserProfile = {
                  id: Date.now().toString(),
                  name,
                  email,
                  avatar: isAdm ? 'https://picsum.photos/seed/admin/200' : 'https://i.pravatar.cc/150?u=techpro',
                  area,
                  plan: isAdm ? UserPlan.ADMIN : UserPlan.FREE,
                  joinedAt: new Date().toISOString(),
                  xp: isAdm ? 1850 : 0,
                  level: isAdm ? 3 : 1,
                  readArticlesIds: [],
                  startedArticlesIds: [],
                  readingGoals: { dailyMinutes: 30, currentMinutesToday: isAdm ? 12 : 0, streak: isAdm ? 5 : 0 }
                };
                setUser(newUser);
                localStorage.setItem('techpro_user', JSON.stringify(newUser));
              }}>
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
                  <input name="password" type="password" required className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-600 text-base" placeholder="Sua senha" />
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 active:scale-95 touch-manipulation">
                  {authMode === 'login' ? 'Acessar Plataforma' : 'Criar Conta Agora'} <ChevronRight size={18} />
                </button>
              </form>

              <div className="text-center pb-8 md:pb-0">
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-2 p-2"
                >
                  {authMode === 'login' 
                    ? <><UserPlus size={16} /> Não tem uma conta? Cadastre-se</>
                    : <>Já tem uma conta? Entre aqui</>}
                </button>
              </div>
            </div>
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
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#111827]/95 backdrop-blur-xl border-r border-slate-800/50 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/40">TP</div>
                <div>
                  <span className="block text-lg font-bold text-white tracking-tight leading-none">TechPro</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{user.area}</span>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <Link to="/profile" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 mb-6 p-3 rounded-2xl bg-slate-800/20 border transition-all group ${isPremium ? 'border-amber-500/30' : 'border-slate-700/30'}`}>
              <img src={user.avatar} className="w-11 h-11 rounded-full border border-slate-700" alt="Avatar" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-blue-400">{user.name}</p>
                <div className="flex items-center gap-1">
                  {isPremium ? (
                    <>
                      <Crown size={10} className="text-amber-500" />
                      <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">Premium</span>
                    </>
                  ) : (
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Plano Grátis</span>
                  )}
                </div>
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
            {isAdmin && (
              <SidebarItem to="/admin" icon={ShieldCheck} label="Admin" active={location.pathname.startsWith('/admin')} onClick={() => setIsSidebarOpen(false)} />
            )}
          </nav>

          <div className="p-4 border-t border-slate-800/50">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-4 text-slate-500 hover:text-red-400 transition-all w-full text-sm font-bold">
              <LogOut size={20} />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="lg:hidden p-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors" aria-label="Abrir menu">
            <Menu size={24} />
          </button>
          <div className="font-black text-white tracking-tighter">TECHPRO</div>
          <div className="w-10"></div>
        </header>

        {!isPremium && location.pathname !== '/profile' && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 md:px-6 py-3 flex items-center justify-between no-print sticky top-[57px] lg:top-0 z-20 backdrop-blur-md">
            <p className="text-[9px] md:text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Gem size={14} className="shrink-0" /> <span className="truncate">Desbloqueie ferramentas avançadas</span>
            </p>
            <Link to="/profile" className="text-[9px] bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg font-black uppercase tracking-tighter shrink-0 hover:bg-amber-400 transition-colors">Upgrade</Link>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 no-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/level" element={<ProfessionalLevel user={user} />} />
            <Route path="/library/*" element={<Library isPremium={isPremium} isAdmin={isAdmin} user={user} onUpdateUser={handleUpdateUser} />} />
            <Route path="/history" element={<ReadingHistory user={user} />} />
            <Route path="/analytics" element={<StudyAnalytics />} />
            <Route path="/calculators" element={<Calculators isPremium={isPremium} />} />
            <Route path="/conversions" element={isPremium ? <Conversions /> : <Navigate to="/profile" />} />
            <Route path="/checklists" element={<Checklists user={user} />} />
            <Route path="/forum" element={<Forum user={user} />} />
            <Route path="/profile" element={<Profile user={user} setUser={handleUpdateUser} />} />
            <Route path="/contact" element={<Contact user={user} />} />
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
