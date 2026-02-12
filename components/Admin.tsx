
import React, { useState, useEffect } from 'react';
import { UserProfile, UserPlan, UserStatus, UserRole } from '../types';
import { 
  ShieldCheck, Users, CreditCard, Trash2, UserCog, Search, 
  BarChart3, MessageSquare, TrendingUp, CheckSquare, X, Send, 
  UserMinus, Calculator as CalcIcon, BookOpen, Activity, AlertTriangle,
  Lock, CheckCircle, Calendar, ShieldAlert
} from 'lucide-react';

interface AdminUserView extends UserProfile {}

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

  const loadRealUsers = () => {
    const stored = localStorage.getItem('techpro_registered_users');
    if (stored) {
      setAllUsers(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadRealUsers();
  }, []);

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
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map(u => (
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
              ))}
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

                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plano & Expiração</p>
                       <Calendar size={16} className="text-amber-500" />
                    </div>
                    <div className="flex gap-2">
                       <select 
                        value={selectedUser.plan} 
                        onChange={e => updateUserData(selectedUser.id, { plan: e.target.value as UserPlan })}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none"
                      >
                        <option value={UserPlan.FREE}>Free</option>
                        <option value={UserPlan.MONTHLY}>Mensal</option>
                        <option value={UserPlan.ANNUAL}>Anual</option>
                      </select>
                      <input 
                        type="date" 
                        value={selectedUser.planExpiryDate || ''} 
                        onChange={e => updateUserData(selectedUser.id, { planExpiryDate: e.target.value })}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
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
                  <button 
                    onClick={() => deleteUser(selectedUser.id)}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-600 hover:text-red-500 hover:border-red-500/50 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="lg:w-1/2 bg-slate-950/50 flex flex-col h-[600px] lg:h-auto">
                 <div className="p-8 border-b border-slate-800 bg-slate-900/50">
                    <h4 className="text-lg font-bold text-white flex items-center gap-3">
                      <MessageSquare className="text-blue-500" /> Histórico de Consultoria
                    </h4>
                 </div>

                 <div className="flex-1 p-8 overflow-y-auto space-y-4 no-scrollbar">
                    {(userChats[selectedUser.id] || []).map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.sender === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                          <p>{msg.text}</p>
                          <p className={`text-[9px] mt-2 font-black ${msg.sender === 'admin' ? 'text-blue-200' : 'text-slate-500'}`}>{msg.timestamp}</p>
                        </div>
                      </div>
                    ))}
                    {(!userChats[selectedUser.id] || userChats[selectedUser.id].length === 0) && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-700 text-center space-y-4">
                        <MessageSquare size={64} className="opacity-5" />
                        <p className="text-xs font-black uppercase tracking-widest">Sem mensagens recentes</p>
                      </div>
                    )}
                 </div>

                 <form onSubmit={handleSendMessage} className="p-8 border-t border-slate-800">
                    <div className="relative">
                       <input 
                         type="text" 
                         value={chatMessage}
                         onChange={e => setChatMessage(e.target.value)}
                         placeholder="Enviar comando ou mensagem suporte..."
                         className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600"
                       />
                       <button type="submit" disabled={!chatMessage.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50">
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
