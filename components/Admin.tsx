
import React, { useState, useEffect } from 'react';
import { UserProfile, UserPlan } from '../types';
import { ShieldCheck, Users, CreditCard, ClipboardCheck, Trash2, CheckCircle, Clock, AlertTriangle, MoreVertical, Calendar, UserCog, Search, Filter } from 'lucide-react';

interface AdminUserView extends UserProfile {
  planStatus: 'Ativo' | 'Expirando' | 'Expirado';
  expiryDate: string;
}

const Admin: React.FC<{ user: UserProfile }> = ({ user }) => {
  // Define isAdmin locally based on the user plan to resolve naming error.
  const isAdmin = user.plan === UserPlan.ADMIN;
  const [searchTerm, setSearchTerm] = useState('');
  
  // Lista simulada de todos os usuários cadastrados
  const [allUsers, setAllUsers] = useState<AdminUserView[]>([
    { 
      id: '1', name: 'João Mecânico', email: 'joao.mecanica@gmail.com', avatar: 'https://i.pravatar.cc/150?u=1', area: 'Mecânica Pesada', plan: UserPlan.MONTHLY, joinedAt: '2024-04-15', xp: 450, level: 1, readArticlesIds: [], startedArticlesIds: [], readingGoals: { dailyMinutes: 30, currentMinutesToday: 0, streak: 0 },
      expiryDate: '2024-05-15', planStatus: 'Expirando'
    },
    { 
      id: '2', name: 'Eng. Roberto', email: 'roberto.eng@tech.com', avatar: 'https://i.pravatar.cc/150?u=2', area: 'Hidráulica', plan: UserPlan.ANNUAL, joinedAt: '2023-12-01', xp: 2800, level: 3, readArticlesIds: [], startedArticlesIds: [], readingGoals: { dailyMinutes: 45, currentMinutesToday: 10, streak: 5 },
      expiryDate: '2024-12-01', planStatus: 'Ativo'
    },
    { 
      id: '3', name: 'Ricardo Santos', email: 'ricardo.eng@gmail.com', avatar: 'https://i.pravatar.cc/150?u=3', area: 'Eletromecânica', plan: UserPlan.FREE, joinedAt: '2024-05-10', xp: 120, level: 1, readArticlesIds: [], startedArticlesIds: [], readingGoals: { dailyMinutes: 30, currentMinutesToday: 5, streak: 2 },
      expiryDate: 'N/A', planStatus: 'Ativo'
    },
    { 
      id: '4', name: 'Ana Inspetora', email: 'ana.insp@mineracao.com', avatar: 'https://i.pravatar.cc/150?u=4', area: 'Inspeção', plan: UserPlan.MONTHLY, joinedAt: '2024-04-10', xp: 1200, level: 2, readArticlesIds: [], startedArticlesIds: [], readingGoals: { dailyMinutes: 30, currentMinutesToday: 0, streak: 12 },
      expiryDate: '2024-05-12', planStatus: 'Expirado'
    }
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    { id: 'u2', name: 'Ricardo Santos', email: 'ricardo.eng@gmail.com', plan: 'Premium Anual', status: 'Aguardando' }
  ]);

  const [releaseCheck, setReleaseCheck] = useState<Record<string, boolean[]>>({
    'u2': [false, false, false]
  });

  const handleToggle = (uid: string, idx: number) => {
    setReleaseCheck(prev => ({
      ...prev,
      [uid]: prev[uid].map((v, i) => i === idx ? !v : v)
    }));
  };

  const updatePlan = (userId: string, newPlan: UserPlan) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const today = new Date();
        let newExpiry = 'N/A';
        if (newPlan === UserPlan.MONTHLY) {
          today.setDate(today.getDate() + 30);
          newExpiry = today.toISOString().split('T')[0];
        } else if (newPlan === UserPlan.ANNUAL) {
          today.setFullYear(today.getFullYear() + 1);
          newExpiry = today.toISOString().split('T')[0];
        }
        return { ...u, plan: newPlan, expiryDate: newExpiry, planStatus: 'Ativo' };
      }
      return u;
    }));
  };

  const steps = [
    "Confirmar recebimento no extrato Mercado Pago",
    "Validar ID da transação e Email do usuário",
    "Conferir validade do plano (Mensal vs Anual)"
  ];

  const canRelease = (uid: string) => releaseCheck[uid]?.every(v => v);

  // Filtros de usuários
  const expiringSoon = allUsers.filter(u => u.planStatus === 'Expirando' || u.planStatus === 'Expirado');
  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldCheck size={32} className="text-blue-500" /> Painel de Controle Admin
          </h2>
          <p className="text-slate-400">Gestão de usuários, faturamento e auditoria de segurança.</p>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-blue-500/50 transition-all">
          <Users className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total de Usuários</p>
          <h3 className="text-3xl font-black text-white">{allUsers.length}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-amber-500/50 transition-all">
          <CreditCard className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Premium Ativos</p>
          <h3 className="text-3xl font-black text-white">{allUsers.filter(u => u.plan !== UserPlan.FREE).length}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-emerald-500/50 transition-all">
          <Clock className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Aguardando Liberação</p>
          <h3 className="text-3xl font-black text-white">{pendingRequests.length}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-red-500/50 transition-all">
          <AlertTriangle className="text-red-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Alertas de Vencimento</p>
          <h3 className="text-3xl font-black text-white">{expiringSoon.length}</h3>
        </div>
      </div>

      {/* Seção de Notificações Críticas */}
      {expiringSoon.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-6 space-y-4">
          <h3 className="text-sm font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle size={16} /> Atenção: Planos Próximos do Vencimento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiringSoon.map(u => (
              <div key={u.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} className="w-10 h-10 rounded-full border border-slate-700" alt="" />
                  <div>
                    <p className="text-xs font-bold text-white">{u.name}</p>
                    <p className="text-[9px] text-red-400 font-black uppercase tracking-widest">Vence em: {u.expiryDate}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSearchTerm(u.email)}
                  className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg font-bold uppercase"
                >
                  Gerenciar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gestão Completa de Usuários */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
              <UserCog size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Administração de Contas</h3>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Usuário</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Área / Cargo</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Plano Atual</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vencimento</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} className="w-9 h-9 rounded-xl border border-slate-700" alt="" />
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{u.name}</p>
                        <p className="text-[10px] text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400">{u.area}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase border ${
                        u.plan === UserPlan.FREE ? 'bg-slate-800 text-slate-500 border-slate-700' :
                        u.plan === UserPlan.ADMIN ? 'bg-blue-600/10 text-blue-500 border-blue-600/30' :
                        'bg-amber-500/10 text-amber-500 border-amber-500/30'
                      }`}>
                        {u.plan}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-slate-600" />
                      <span className={`text-xs font-mono ${u.planStatus === 'Expirado' ? 'text-red-500' : u.planStatus === 'Expirando' ? 'text-amber-500' : 'text-slate-400'}`}>
                        {u.expiryDate}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      onChange={(e) => updatePlan(u.id, e.target.value as UserPlan)}
                      value={u.plan}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold text-white outline-none focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer"
                    >
                      <option value={UserPlan.FREE}>Tornar Free</option>
                      <option value={UserPlan.MONTHLY}>Tornar Mensal</option>
                      <option value={UserPlan.ANNUAL}>Tornar Anual</option>
                      {/* Fixed reference to isAdmin locally defined in the component. */}
                      {isAdmin && <option value={UserPlan.ADMIN}>Admin</option>}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protocolo de Liberação (Original mantido) */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-800/20">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><ClipboardCheck size={20} className="text-blue-500" /> Liberação Manual de Novos Assinantes</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {pendingRequests.map(req => (
            <div key={req.id} className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-white mb-2">{req.name}</h4>
                <p className="text-sm text-slate-500 mb-4">{req.email}</p>
                <div className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-full border border-amber-500/20">{req.plan}</div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Protocolo de Auditoria</p>
                {steps.map((step, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                    <input 
                      type="checkbox" 
                      checked={releaseCheck[req.id]?.[idx]}
                      onChange={() => handleToggle(req.id, idx)}
                      className="w-5 h-5 bg-slate-800 border-slate-700 text-blue-600 rounded" 
                    />
                    <span className={`text-sm ${releaseCheck[req.id]?.[idx] ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{step}</span>
                  </label>
                ))}
                <button 
                  disabled={!canRelease(req.id)}
                  onClick={() => {
                    updatePlan(req.id === 'u2' ? '3' : '99', UserPlan.ANNUAL);
                    setPendingRequests(prev => prev.filter(r => r.id !== req.id));
                  }}
                  className={`w-full mt-4 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${canRelease(req.id) ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                >
                  <CheckCircle size={20} /> Liberar Acesso Premium
                </button>
              </div>
            </div>
          ))}
          {pendingRequests.length === 0 && <div className="p-20 text-center text-slate-500 italic">Nenhuma solicitação de liberação pendente.</div>}
        </div>
      </div>
    </div>
  );
};

export default Admin;
