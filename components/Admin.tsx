
import React, { useState, useEffect } from 'react';
import { UserProfile, UserPlan } from '../types';
import { 
  ShieldCheck, Users, CreditCard, ClipboardCheck, Trash2, CheckCircle, 
  Clock, AlertTriangle, MoreVertical, Calendar, UserCog, Search, Filter,
  BarChart3, MessageSquare, Flame, TrendingUp, CheckSquare, Star, 
  Phone, LogIn, User as UserIcon, X, Send, UserMinus
} from 'lucide-react';

interface AdminUserView extends UserProfile {
  planStatus: 'Ativo' | 'Expirando' | 'Expirado';
  expiryDate: string;
  phone?: string;
  lastLogin?: string;
  topInterest?: string;
}

interface ChatMessage {
  id: string;
  sender: 'admin' | 'user';
  text: string;
  timestamp: string;
}

const Admin: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUserView | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [userChats, setUserChats] = useState<Record<string, ChatMessage[]>>({});
  const [allUsers, setAllUsers] = useState<AdminUserView[]>([]);

  // Função para carregar usuários reais do localStorage
  const loadRealUsers = () => {
    const stored = localStorage.getItem('techpro_registered_users');
    if (stored) {
      const parsed = JSON.parse(stored);
      const mapped: AdminUserView[] = parsed.map((u: any, idx: number) => ({
        id: u.id || `real-${idx}`,
        name: u.name || 'Usuário Sem Nome',
        email: u.email || 'sem@email.com',
        avatar: u.avatar || 'https://i.pravatar.cc/150?u=' + encodeURIComponent(u.email || idx),
        area: u.area || 'Manutenção Industrial',
        plan: u.plan || UserPlan.FREE,
        joinedAt: u.joinedAt || new Date().toISOString(),
        xp: u.xp || 0,
        level: u.level || 1,
        readArticlesIds: u.readArticlesIds || [],
        startedArticlesIds: u.startedArticlesIds || [],
        readingGoals: u.readingGoals || { dailyMinutes: 30, currentMinutesToday: 0, streak: 0 },
        expiryDate: 'Vitalício',
        planStatus: 'Ativo',
        phone: u.phone || 'Não informado',
        lastLogin: 'Verificando...',
        topInterest: u.area || 'Geral'
      }));
      setAllUsers(mapped);
    }
  };

  useEffect(() => {
    loadRealUsers();
  }, []);

  // Estatísticas Reais
  const stats = {
    totalUsers: allUsers.length,
    premiumUsers: allUsers.filter(u => u.plan !== UserPlan.FREE).length,
    totalChecklists: JSON.parse(localStorage.getItem('techpro_saved_reports') || '[]').length,
    activeToday: allUsers.length > 0 ? Math.ceil(allUsers.length * 0.4) : 0 // Estimativa baseada em cadastros reais
  };

  const updatePlan = (userId: string, newPlan: UserPlan) => {
    const stored = JSON.parse(localStorage.getItem('techpro_registered_users') || '[]');
    const updatedStored = stored.map((su: any) => {
      // Usamos e-mail como identificador único para sincronizar Google/E-mail
      const currentUser = allUsers.find(u => u.id === userId);
      return su.email === currentUser?.email ? { ...su, plan: newPlan } : su;
    });
    localStorage.setItem('techpro_registered_users', JSON.stringify(updatedStored));
    loadRealUsers();
    
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, plan: newPlan } : null);
    }
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('TEM CERTEZA? Esta ação excluirá permanentemente este usuário da base de dados.')) {
      const currentUser = allUsers.find(u => u.id === userId);
      const stored = JSON.parse(localStorage.getItem('techpro_registered_users') || '[]');
      const updatedStored = stored.filter((su: any) => su.email !== currentUser?.email);
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
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setUserChats(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage]
    }));
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
            <ShieldCheck size={32} className="text-blue-500" /> Painel Admin Profissional
          </h2>
          <p className="text-slate-400">Dados reais de usuários e métricas de engajamento.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-blue-500/50 transition-all">
          <Users className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Cadastros Reais</p>
          <h3 className="text-2xl font-black text-white">{stats.totalUsers}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-amber-500/50 transition-all">
          <CreditCard className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Assinantes Premium</p>
          <h3 className="text-2xl font-black text-white">{stats.premiumUsers}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-emerald-500/50 transition-all">
          <CheckSquare className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Relatórios Salvos</p>
          <h3 className="text-2xl font-black text-white">{stats.totalChecklists}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-violet-500/50 transition-all">
          <TrendingUp className="text-violet-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Atividade Diária (Est.)</p>
          <h3 className="text-2xl font-black text-white">{stats.activeToday}</h3>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
              <UserCog size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Gestão de Usuários Registrados</h3>
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Plano</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Especialidade</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => setSelectedUser(u)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} className="w-9 h-9 rounded-xl border border-slate-700 object-cover" alt="" />
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-blue-400">{u.name}</p>
                        <p className="text-[10px] text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase border ${
                      u.plan === UserPlan.FREE ? 'bg-slate-800 text-slate-500 border-slate-700' :
                      u.plan === UserPlan.ADMIN ? 'bg-blue-600/10 text-blue-500 border-blue-600/30' :
                      'bg-amber-500/10 text-amber-500 border-amber-500/30'
                    }`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-400">{u.area}</span>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                       <select 
                        onChange={(e) => updatePlan(u.id, e.target.value as UserPlan)}
                        value={u.plan}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold text-white outline-none cursor-pointer"
                      >
                        <option value={UserPlan.FREE}>Free</option>
                        <option value={UserPlan.MONTHLY}>Mensal</option>
                        <option value={UserPlan.ANNUAL}>Anual</option>
                        <option value={UserPlan.ADMIN}>Admin</option>
                      </select>
                      <button onClick={() => deleteUser(u.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-20 text-center text-slate-500 italic">Nenhum usuário cadastrado encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-10">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-10">
                <div className="flex items-center justify-between">
                  <button onClick={() => setSelectedUser(null)} className="p-2 text-slate-500 hover:text-white bg-slate-800/50 rounded-full transition-all">
                    <X size={20} />
                  </button>
                  <button 
                    onClick={() => deleteUser(selectedUser.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl font-bold text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all"
                  >
                    <UserMinus size={14} /> Excluir Perfil
                  </button>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <img src={selectedUser.avatar} className="w-24 h-24 rounded-3xl border-4 border-slate-800 shadow-2xl object-cover" alt="" />
                  <div>
                    <h3 className="text-2xl font-black text-white">{selectedUser.name}</h3>
                    <p className="text-blue-500 text-xs font-bold uppercase tracking-widest">{selectedUser.area}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">E-mail</p>
                    <p className="text-xs font-bold text-white truncate">{selectedUser.email}</p>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">XP Atual</p>
                    <p className="text-xs font-bold text-white">{selectedUser.xp} pontos</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Alterar Plano Especialista</label>
                  <select 
                    value={selectedUser.plan}
                    onChange={(e) => updatePlan(selectedUser.id, e.target.value as UserPlan)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:ring-1 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
                  >
                    <option value={UserPlan.FREE}>Gratuito (Free)</option>
                    <option value={UserPlan.MONTHLY}>Premium Mensal</option>
                    <option value={UserPlan.ANNUAL}>Premium Anual</option>
                    <option value={UserPlan.ADMIN}>Administrador (Admin)</option>
                  </select>
                </div>
              </div>

              <div className="lg:w-1/2 bg-slate-950/50 flex flex-col h-[600px] lg:h-auto">
                <div className="p-8 border-b border-slate-800 bg-slate-900/50">
                   <h4 className="text-lg font-bold text-white flex items-center gap-3">
                     <MessageSquare className="text-blue-500" /> Chat de Consultoria Admin
                   </h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Suporte direto ao profissional</p>
                </div>

                <div className="flex-1 p-8 overflow-y-auto space-y-4 no-scrollbar">
                  {(userChats[selectedUser.id] || []).map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                        msg.sender === 'admin' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                        <p className={`text-[9px] mt-2 font-bold ${msg.sender === 'admin' ? 'text-blue-200' : 'text-slate-500'}`}>{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  {(!userChats[selectedUser.id] || userChats[selectedUser.id].length === 0) && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center space-y-4">
                       <MessageSquare size={48} className="opacity-10" />
                       <p className="text-sm italic">Inicie uma conversa privada com o especialista.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-8 bg-slate-900/50 border-t border-slate-800">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Enviar mensagem suporte..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-6 pr-14 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!chatMessage.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90"
                    >
                      <Send size={18} />
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
