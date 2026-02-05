
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
  Info
} from 'lucide-react';
import { UserPlan, UserProfile } from './types';
import { ADMIN_EMAIL } from './constants';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Calculators from './components/Calculators';
import Conversions from './components/Conversions';
import Checklists from './components/Checklists';
import Forum from './components/Forum';
import Profile from './components/Profile';
import Admin from './components/Admin';
import Contact from './components/Contact';
import ProfessionalLevel from './components/ProfessionalLevel';
import ReadingHistory from './components/ReadingHistory';
import StudyAnalytics from './components/StudyAnalytics';
import { getDailyTip } from './services/gemini';

const SidebarItem = ({ to, icon: Icon, label, active, onClick, hasSubmenu, badge, premium }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative ${
      active 
        ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
    } ${premium ? 'border-amber-500/20 hover:border-amber-500/40' : ''}`}
  >
    <Icon size={18} className={active ? 'text-blue-400' : 'group-hover:text-blue-400'} />
    <span className="font-medium text-sm flex-1">{label}</span>
    {premium && <Crown size={12} className="text-amber-500 absolute -top-1 -right-1" />}
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
    <div className="fixed bottom-6 right-6 z-[60] max-w-xs bg-slate-900 border border-blue-600/30 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase">
          <Info size={14} /> Dica de Campo
        </div>
        <button onClick={() => setVisible(false)} className="text-slate-500 hover:text-white">
          <X size={14} />
        </button>
      </div>
      <p className="text-xs text-slate-300 italic">"{tip}"</p>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-blue-900/40 font-bold text-white text-2xl">
              TP
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Tech Pro</h1>
            <p className="text-slate-400 text-sm mt-2">Login Profissional</p>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const email = formData.get('email') as string;
            const isAdm = email === ADMIN_EMAIL;
            const newUser: UserProfile = {
              id: '1',
              name: isAdm ? 'Administrador' : 'Usuário Tech',
              email,
              avatar: isAdm ? 'https://picsum.photos/seed/admin/200' : 'https://i.pravatar.cc/150?u=techpro',
              area: isAdm ? 'Suporte Técnico' : 'Manutenção Industrial',
              plan: isAdm ? UserPlan.ADMIN : UserPlan.FREE,
              joinedAt: new Date().toISOString(),
              xp: 1850,
              level: 3,
              readArticlesIds: [],
              startedArticlesIds: [],
              readingGoals: { dailyMinutes: 30, currentMinutesToday: 12, streak: 5 }
            };
            setUser(newUser);
            localStorage.setItem('techpro_user', JSON.stringify(newUser));
          }}>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
              <input name="email" type="email" required className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="exemplo@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Senha</label>
              <input name="password" type="password" required className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
              Entrar <ChevronRight size={18} />
            </button>
            <div className="text-center mt-4">
              <p className="text-slate-500 text-xs">Admin: suporte.techproapp@gmail.com / @Continuar13</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const isAdmin = user.plan === UserPlan.ADMIN;
  const isPremium = user.plan === UserPlan.ANNUAL || user.plan === UserPlan.MONTHLY || isAdmin;

  return (
    <div className="flex min-h-screen bg-[#0a0f1e] text-slate-200">
      <DailyTipNotification area={user.area} />
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#111827]/80 backdrop-blur-xl border-r border-slate-800/50 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/40">
                TP
              </div>
              <div>
                <span className="block text-lg font-bold text-white tracking-tight leading-none">TechPro</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{user.area}</span>
              </div>
            </div>

            <Link to="/profile" className={`flex items-center gap-3 mb-6 p-2 rounded-xl bg-slate-800/20 border transition-all group ${isPremium ? 'border-amber-500/30' : 'border-slate-700/30'}`}>
              <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-700" alt="Avatar" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate group-hover:text-blue-400">{user.name}</p>
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

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-10">
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
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-all w-full text-sm font-medium">
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="lg:hidden p-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400">
            <Menu size={24} />
          </button>
          <div className="font-bold text-white">TechPro</div>
          <div className="w-10"></div>
        </div>

        {!isPremium && location.pathname !== '/profile' && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between no-print">
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Gem size={14} /> Desbloqueie calculadoras e catálogos avançados
            </p>
            <Link to="/profile" className="text-[10px] bg-amber-500 text-slate-950 px-3 py-1 rounded font-black uppercase tracking-tighter">Upgrade Premium</Link>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/level" element={<ProfessionalLevel user={user} />} />
            <Route path="/library/*" element={<Library isPremium={isPremium} isAdmin={isAdmin} user={user} onUpdateUser={handleUpdateUpdate} />} />
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

const handleUpdateUpdate = (updatedUser: any) => {
  localStorage.setItem('techpro_user', JSON.stringify(updatedUser));
  window.location.reload(); 
};

const WrappedApp: React.FC = () => (
  <HashRouter>
    <App />
  </HashRouter>
);

export default WrappedApp;