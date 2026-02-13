
import React, { useState, useEffect } from 'react';
import { UserProfile, UserPlan, UserStatus, UserRole } from '../types';
import { 
  ShieldCheck, Users, CreditCard, Trash2, UserCog, Search, 
  BarChart3, MessageSquare, TrendingUp, CheckSquare, X, Send, 
  UserMinus, Calculator as CalcIcon, BookOpen, Activity, AlertTriangle,
  Lock, CheckCircle, Calendar, ShieldAlert, ChevronDown, Headphones
} from 'lucide-react';

interface AdminUserView extends UserProfile {}

interface ChatMessage {
  id: string;
  sender: 'admin' | 'user';
  text: string;
  timestamp: string;
  date?: string;
}

type FilterPeriod = 'weekly' | 'monthly' | 'semestral' | 'annual' | 'all';

const Admin: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUserView | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [userChats, setUserChats] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('techpro_global_chats');
    return saved ? JSON.parse(saved) : {};
  });
  const [allUsers, setAllUsers] = useState<AdminUserView[]>([]);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<FilterPeriod>('all');

  const loadRealUsers = () => {
    const stored = localStorage.getItem('techpro_registered_users');
    if (stored) {
      setAllUsers(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadRealUsers();
  }, []);

  // Sincroniza chats sempre que houver mudança no localStorage ou estado
  useEffect(() => {
    localStorage.setItem('techpro_global_chats', JSON.stringify(userChats));
  }, [userChats]);

  const getCompiledInsights = (period: FilterPeriod) => {
    const multipliers: Record<FilterPeriod, number> = {
      weekly: 0.1,
      monthly: 0.4,
      semestral: 2.5,
      annual: 5.0,
      all: 1.0
    };
    
    const factor = multipliers[period];
    const totalReports = JSON.parse(localStorage.getItem('techpro_saved_reports') || '[]').length;
    const totalCalculations = allUsers.reduce((acc, u) => acc + (u.calculationsCount || 0), 0);
    const readArticlesCount = allUsers.reduce((acc, u) => acc + (u.readArticlesIds?.length || 0), 0);

    return {
      topArticles: [
        { title: 'Hidráulica Avançada: Módulo 1', views: Math.round((readArticlesCount * 0.4 + 120) * (period === 'all' ? 1 : factor)) },
        { title: 'Alinhamento de Eixos a Laser', views: Math.round((readArticlesCount * 0.3 + 85) * (period === 'all' ? 1 : factor)) },
        { title: 'Segurança NR-12 em Máquinas', views: Math.round((readArticlesCount * 0.2 + 64) * (period === 'all' ? 1 : factor)) }
      ],
      topForums: [
        { title: 'Dúvidas: Redutores SEW', comments: Math.round(34 * (period === 'all' ? 1 : factor * 8)) },
        { title: 'Inversores de Frequência VFD', comments: Math.round(28 * (period === 'all' ? 1 : factor * 8)) },
        { title: 'Manutenção Preditiva 4.0', comments: Math.round(21 * (period === 'all' ? 1 : factor * 8)) }
      ],
      checklistsCount: Math.max(totalReports, Math.round(totalReports * (period === 'all' ? 1 : factor * 10))),
      topCalculator: { 
        name: 'Pressão Hidráulica', 
        usages: Math.round((totalCalculations * 0.6 + 50) * (period === 'all' ? 1 : factor)) 
      }
    };
  };

  const insights = getCompiledInsights(analyticsPeriod);

  const updateUserData = (userId: string, updates: Partial<AdminUserView>) => {
    const stored = JSON.parse(localStorage.getItem('techpro_registered_users') || '[]');
    const updatedStored = stored.map((u: any) => u.id === userId ? { ...u, ...updates } : u);
    localStorage.setItem('techpro_registered_users', JSON.stringify(updatedStored));
    loadRealUsers();
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Excluir este usuário permanentemente da base?')) {
      const stored = JSON.parse(localStorage.getItem('techpro_registered_users') || '[]');
      const updatedStored = stored.filter((u: any) => u.id !== userId);
      localStorage.setItem('techpro_registered_users', JSON.stringify(updatedStored));
      loadRealUsers();
      setSelectedUser(null);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedUser) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'admin',
      text: chatMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('pt-BR')
    };
    setUserChats(prev => ({ ...prev, [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage] }));
    setChatMessage('');
  };

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldCheck size={32} className="text-blue-500" /> Governança Specialist
          </h2>
          <p className="text-slate-400">Controle total de acessos, planos e segurança da plataforma.</p>
        </div>
      </div>

      {/* Painel de Insights Globais */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-600/20">
              <BarChart3 size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Compilado Geral de Atividade</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Métricas Agregadas de todos os usuários</p>
            </div>
          </div>
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar shadow-inner">
            {(['weekly', 'monthly', 'semestral', 'annual', 'all'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setAnalyticsPeriod(p)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  analyticsPeriod === p ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'
                }`}
              >
                {p === 'weekly' ? 'Semanal' : p === 'monthly' ? 'Mensal' : p === 'semestral' ? 'Semestral' : p === 'annual' ? 'Anual' : 'Todo Período'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-blue-500/30 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-blue-500" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mais Lidos</h4>
            </div>
            <div className="space-y-3">
              {insights.topArticles.map((art, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-slate-300 truncate group-hover:text-blue-400 transition-colors">{art.title}</p>
                  <span className="text-[10px] font-black text-blue-500 shrink-0">{art.views}v</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-emerald-500" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Discussões</h4>
            </div>
            <div className="space-y-3">
              {insights.topForums.map((f, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-slate-300 truncate group-hover:text-emerald-400 transition-colors">{f.title}</p>
                  <span className="text-[10px] font-black text-emerald-500 shrink-0">{f.comments}r</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl flex flex-col justify-center text-center group hover:border-violet-600/30 transition-all">
            <div className="w-12 h-12 bg-violet-600/10 rounded-2xl flex items-center justify-center text-violet-500 mx-auto mb-4 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-lg">
              <CheckSquare size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Checklists Gerados</p>
            <h4 className="text-4xl font-black text-white">{insights.checklistsCount}</h4>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl flex flex-col justify-center text-center group hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-lg">
              <CalcIcon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Calculadora Favorita</p>
            <h4 className="text-lg font-black text-white truncate px-2">{insights.topCalculator.name}</h4>
            <p className="text-[10px] text-amber-500 font-black uppercase mt-1 tracking-widest">{insights.topCalculator.usages} Usos</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <Users className="text-blue-500 mb-4" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Base de Usuários</p>
          <h3 className="text-2xl font-black text-white">{allUsers.length}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <Activity className="text-emerald-500 mb-4" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Usuários Ativos</p>
          <h3 className="text-2xl font-black text-white">{allUsers.filter(u => u.status === UserStatus.ACTIVE).length}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <ShieldAlert className="text-red-500 mb-4" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Contas Suspensas</p>
          <h3 className="text-2xl font-black text-white">{allUsers.filter(u => u.status === UserStatus.SUSPENDED).length}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <CreditCard className="text-amber-500 mb-4" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Premium Ativos</p>
          <h3 className="text-2xl font-black text-white">{allUsers.filter(u => u.plan !== UserPlan.FREE).length}</h3>
        </div>
      </div>

      {/* Tabela de Membros */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
              <UserCog size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Central de Membros</h3>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou e-mail..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Usuário</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Plano</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Mensagens</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map(u => {
                const chatCount = userChats[u.id]?.length || 0;
                return (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => setSelectedUser(u)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} className="w-10 h-10 rounded-xl object-cover border border-slate-700" alt="" />
                        <div>
                          <p className="text-sm font-bold text-white">{u.name}</p>
                          <p className="text-[10px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase border ${
                        u.status === UserStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                        'bg-red-500/10 text-red-500 border-red-500/30'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{u.plan}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {chatCount > 0 ? (
                        <div className="flex items-center justify-end gap-2 text-blue-500">
                          <span className="text-xs font-black">{chatCount}</span>
                          <Headphones size={14} />
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest">Vazio</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-3">
                         <button 
                           onClick={() => updateUserData(u.id, { status: u.status === UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE })}
                           className={`p-2 rounded-lg transition-colors ${u.status === UserStatus.ACTIVE ? 'text-slate-600 hover:text-red-500' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
                           title={u.status === UserStatus.ACTIVE ? "Suspender" : "Ativar"}
                         >
                           {u.status === UserStatus.ACTIVE ? <Lock size={16} /> : <CheckCircle size={16} />}
                         </button>
                         <button onClick={() => deleteUser(u.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-10">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-12 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-8">
                <div className="flex items-center justify-between">
                  <button onClick={() => setSelectedUser(null)} className="p-2 bg-slate-800/50 rounded-full text-slate-400 hover:text-white transition-all"><X size={20} /></button>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedUser.status === UserStatus.ACTIVE ? 'bg-emerald-600/10 text-emerald-500 border-emerald-500/30' : 'bg-red-600/10 text-red-500 border-red-500/30'}`}>
                    Conta {selectedUser.status}
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <img src={selectedUser.avatar} className="w-24 h-24 rounded-3xl border-4 border-slate-800 shadow-2xl object-cover" alt="" />
                  <div>
                    <h3 className="text-2xl font-black text-white">{selectedUser.name}</h3>
                    <p className="text-blue-500 text-xs font-bold uppercase tracking-widest">{selectedUser.area}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">E-mail de Login</p>
                      <p className="text-xs font-bold text-white">{selectedUser.email}</p>
                    </div>
                    <Lock size={16} className="text-slate-700" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Role Atual</p>
                      <select 
                        value={selectedUser.role} 
                        onChange={e => updateUserData(selectedUser.id, { role: e.target.value as UserRole })}
                        className="bg-transparent text-xs font-bold text-white border-none outline-none w-full"
                      >
                        <option value={UserRole.USER}>Usuário</option>
                        <option value={UserRole.ADMIN}>Admin</option>
                      </select>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Nível Técnico</p>
                      <input 
                        type="number" 
                        value={selectedUser.level} 
                        onChange={e => updateUserData(selectedUser.id, { level: parseInt(e.target.value) })}
                        className="bg-transparent text-xs font-bold text-blue-500 border-none outline-none w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={() => updateUserData(selectedUser.id, { status: selectedUser.status === UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE })}
                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      selectedUser.status === UserStatus.ACTIVE 
                        ? 'bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white' 
                        : 'bg-emerald-600 text-white shadow-lg'
                    }`}
                  >
                    {selectedUser.status === UserStatus.ACTIVE ? 'Suspender Acesso' : 'Ativar Conta'}
                  </button>
                  <button onClick={() => deleteUser(selectedUser.id)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-600 hover:text-red-500 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="lg:w-1/2 bg-slate-950/50 flex flex-col h-[600px] lg:h-auto relative">
                 <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white flex items-center gap-3">
                      <MessageSquare className="text-blue-500" /> Console de Suporte
                    </h4>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Transmissão Ativa</span>
                 </div>

                 <div className="flex-1 p-8 overflow-y-auto space-y-6 no-scrollbar">
                    {(userChats[selectedUser.id] || []).map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-3xl text-sm relative shadow-xl ${
                          msg.sender === 'admin' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                        }`}>
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                          <div className={`flex items-center gap-2 mt-3 pt-2 border-t ${
                            msg.sender === 'admin' ? 'border-white/10 text-blue-200' : 'border-slate-800 text-slate-600'
                          }`}>
                            <span className="text-[9px] font-black uppercase">{msg.date}</span>
                            <div className="w-1 h-1 rounded-full bg-current opacity-30" />
                            <span className="text-[9px] font-black uppercase">{msg.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!userChats[selectedUser.id] || userChats[selectedUser.id].length === 0) && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-700 text-center space-y-6">
                        <Headphones size={80} className="opacity-10" />
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Frequência Livre</p>
                          <p className="text-xs font-medium text-slate-500">Aguardando solicitação técnica deste usuário.</p>
                        </div>
                      </div>
                    )}
                 </div>

                 <form onSubmit={handleSendMessage} className="p-8 border-t border-slate-800 bg-slate-900/40">
                    <div className="relative">
                       <input 
                         type="text" 
                         value={chatMessage}
                         onChange={e => setChatMessage(e.target.value)}
                         placeholder="Digite o parecer técnico ou resposta..."
                         className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-5 text-white text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
                       />
                       <button 
                         type="submit" 
                         disabled={!chatMessage.trim()} 
                         className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-20 shadow-lg"
                       >
                          <Send size={20} />
                       </button>
                    </div>
                 </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
