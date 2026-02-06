
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

interface UserFeedback {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  date: string;
  rating?: number;
}

interface ChatMessage {
  id: string;
  sender: 'admin' | 'user';
  text: string;
  timestamp: string;
}

const Admin: React.FC<{ user: UserProfile }> = ({ user }) => {
  const isAdmin = user.plan === UserPlan.ADMIN;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUserView | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [userChats, setUserChats] = useState<Record<string, ChatMessage[]>>({
    '1': [
      { id: '1', sender: 'user', text: 'Olá, gostaria de saber sobre o curso de hidráulica.', timestamp: '10:30' },
      { id: '2', sender: 'admin', text: 'Olá João! Já está disponível na aba biblioteca.', timestamp: '10:35' }
    ]
  });
  
  // Lista simulada de todos os usuários cadastrados
  const [allUsers, setAllUsers] = useState<AdminUserView[]>([
    { 
      id: '1', name: 'João Mecânico', email: 'joao.mecanica@gmail.com', avatar: 'https://i.pravatar.cc/150?u=1', area: 'Mecânica Pesada', plan: UserPlan.MONTHLY, joinedAt: '2024-04-15', xp: 450, level: 1, readArticlesIds: ['h-1', 'h-2'], startedArticlesIds: [], readingGoals: { dailyMinutes: 30, currentMinutesToday: 0, streak: 0 },
      expiryDate: '2024-05-15', planStatus: 'Expirando', phone: '(11) 98877-6655', lastLogin: '21/05/2024 14:30', topInterest: 'Mecânica Pesada'
    },
    { 
      id: '2', name: 'Eng. Roberto', email: 'roberto.eng@tech.com', avatar: 'https://i.pravatar.cc/150?u=2', area: 'Hidráulica', plan: UserPlan.ANNUAL, joinedAt: '2023-12-01', xp: 2800, level: 3, readArticlesIds: ['h-1', 'h-5', 'h-10'], startedArticlesIds: [], readingGoals: { dailyMinutes: 45, currentMinutesToday: 10, streak: 5 },
      expiryDate: '2024-12-01', planStatus: 'Ativo', phone: '(21) 97766-5544', lastLogin: '22/05/2024 09:15', topInterest: 'Hidráulica de Potência'
    },
    { 
      id: '3', name: 'Ricardo Santos', email: 'ricardo.eng@gmail.com', avatar: 'https://i.pravatar.cc/150?u=3', area: 'Eletromecânica', plan: UserPlan.FREE, joinedAt: '2024-05-10', xp: 120, level: 1, readArticlesIds: [], startedArticlesIds: [], readingGoals: { dailyMinutes: 30, currentMinutesToday: 5, streak: 2 },
      expiryDate: 'N/A', planStatus: 'Ativo', phone: '(31) 96655-4433', lastLogin: '22/05/2024 11:00', topInterest: 'Inversores de Frequência'
    },
    { 
      id: '4', name: 'Ana Inspetora', email: 'ana.insp@mineracao.com', avatar: 'https://i.pravatar.cc/150?u=4', area: 'Inspeção', plan: UserPlan.MONTHLY, joinedAt: '2024-04-10', xp: 1200, level: 2, readArticlesIds: ['i-1', 'i-2'], startedArticlesIds: [], readingGoals: { dailyMinutes: 30, currentMinutesToday: 0, streak: 12 },
      expiryDate: '2024-05-12', planStatus: 'Expirado', phone: '(41) 95544-3322', lastLogin: '20/05/2024 17:45', topInterest: 'Inspeção de Britadores'
    }
  ]);

  // Dados simulados de performance
  const analyticsData = {
    totalChecklistsCreated: 1542,
    topCategories: [
      { name: 'Hidráulica', count: 450, color: 'bg-blue-500' },
      { name: 'Mecânica', count: 380, color: 'bg-emerald-500' },
      { name: 'Segurança', count: 290, color: 'bg-orange-500' },
      { name: 'Inspeção', count: 210, color: 'bg-purple-500' }
    ],
    topArticles: [
      { title: 'Estudo Avançado: Hidráulica - Módulo 1', reads: 124 },
      { title: 'Melhores Práticas: Lubrificação Centralizada', reads: 98 },
      { title: 'Análise de Falhas: Fadiga em Redutores', reads: 87 },
      { title: 'Guia: Bloqueio LOTO em Alta Tensão', reads: 76 }
    ]
  };

  // Feedbacks simulados
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([
    {
      id: 'f1',
      userName: 'Carlos Silva',
      userEmail: 'carlos.eng@gmail.com',
      subject: 'Sugestão de Artigo',
      message: 'Seria excelente ter mais materiais sobre alinhamento de eixos verticais e turbinas.',
      date: '20/05/2024',
      rating: 5
    },
    {
      id: 'f2',
      userName: 'Marcos Oliveira',
      userEmail: 'marcos.tech@outlook.com',
      subject: 'Problema com Checkout',
      message: 'Tive uma dúvida sobre a renovação anual, mas o suporte foi rápido em responder.',
      date: '19/05/2024',
      rating: 4
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
    if (selectedUser?.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, plan: newPlan, planStatus: 'Ativo' } : null);
    }
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('TEM CERTEZA? Esta ação excluirá permanentemente todos os dados do usuário.')) {
        setAllUsers(prev => prev.filter(u => u.id !== userId));
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

  const steps = [
    "Confirmar recebimento no extrato Mercado Pago",
    "Validar ID da transação e Email do usuário",
    "Conferir validade do plano (Mensal vs Anual)"
  ];

  const canRelease = (uid: string) => releaseCheck[uid]?.every(v => v);

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-blue-500/50 transition-all">
          <Users className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Usuários</p>
          <h3 className="text-2xl font-black text-white">{allUsers.length}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-amber-500/50 transition-all">
          <CreditCard className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Premium</p>
          <h3 className="text-2xl font-black text-white">{allUsers.filter(u => u.plan !== UserPlan.FREE).length}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-emerald-500/50 transition-all">
          <Clock className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Pendentes</p>
          <h3 className="text-2xl font-black text-white">{pendingRequests.length}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-violet-500/50 transition-all">
          <CheckSquare className="text-violet-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Checklists</p>
          <h3 className="text-2xl font-black text-white">{analyticsData.totalChecklistsCreated}</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-red-500/50 transition-all">
          <AlertTriangle className="text-red-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Alertas</p>
          <h3 className="text-2xl font-black text-white">{expiringSoon.length}</h3>
        </div>
      </div>

      {/* Seção de Performance da Plataforma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Categorias mais Acessadas</h3>
          </div>
          <div className="space-y-6">
            {analyticsData.topCategories.map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-white">{cat.name}</span>
                  <span className="text-xs text-slate-500 font-mono">{cat.count} acessos</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full ${cat.color} transition-all duration-1000`} 
                    style={{ width: `${(cat.count / 500) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-amber-600/10 rounded-xl flex items-center justify-center text-amber-500">
              <Flame size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Artigos mais Lidos</h3>
          </div>
          <div className="space-y-4">
            {analyticsData.topArticles.map((art, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-xs font-black text-slate-700 w-4">#{i+1}</div>
                  <h4 className="text-sm font-bold text-white truncate">{art.title}</h4>
                </div>
                <div className="flex items-center gap-1.5 text-blue-500 shrink-0">
                  <TrendingUp size={14} />
                  <span className="text-xs font-black">{art.reads}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedbacks dos Usuários */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500">
            <MessageSquare size={20} />
          </div>
          <h3 className="text-xl font-bold text-white">Feedbacks e Solicitações Recentes</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {feedbacks.map(fb => (
            <div key={fb.id} className="p-8 hover:bg-slate-950/50 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{fb.userName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{fb.date}</span>
                    <div className="flex gap-0.5">
                      {[...Array(fb.rating || 5)].map((_, i) => (
                        <Star key={i} size={10} className="fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </div>
                  <div className="inline-block px-2 py-0.5 bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase rounded border border-blue-600/20">
                    {fb.subject}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                    "{fb.message}"
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors border border-slate-800 px-3 py-1.5 rounded-lg">Arquivar</button>
                  <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:bg-blue-600/10 transition-colors border border-blue-600/30 px-3 py-1.5 rounded-lg">Responder</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gestão de Usuários */}
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
              placeholder="Pesquisar usuário..." 
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vencimento</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => setSelectedUser(u)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} className="w-9 h-9 rounded-xl border border-slate-700" alt="" />
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
                    <span className={`text-xs font-mono ${u.planStatus === 'Expirado' ? 'text-red-500' : u.planStatus === 'Expirando' ? 'text-amber-500' : 'text-slate-400'}`}>
                      {u.expiryDate}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <select 
                      onChange={(e) => updatePlan(u.id, e.target.value as UserPlan)}
                      value={u.plan}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold text-white outline-none cursor-pointer"
                    >
                      <option value={UserPlan.FREE}>Tornar Free</option>
                      <option value={UserPlan.MONTHLY}>Tornar Mensal</option>
                      <option value={UserPlan.ANNUAL}>Tornar Anual</option>
                      {isAdmin && <option value={UserPlan.ADMIN}>Admin</option>}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhamento de Usuário */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-10">
            <div className="flex flex-col lg:flex-row">
              {/* Lado Esquerdo: Info e Ações */}
              <div className="lg:w-1/2 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-10">
                <div className="flex items-center justify-between">
                  <button onClick={() => setSelectedUser(null)} className="p-2 text-slate-500 hover:text-white bg-slate-800/50 rounded-full transition-all">
                    <X size={20} />
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => deleteUser(selectedUser.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl font-bold text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all"
                    >
                      <UserMinus size={14} /> Excluir Perfil
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <img src={selectedUser.avatar} className="w-24 h-24 rounded-3xl border-4 border-slate-800 shadow-2xl" alt="" />
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
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Telefone</p>
                    <p className="text-xs font-bold text-white">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Cadastro</p>
                    <p className="text-xs font-bold text-white">{new Date(selectedUser.joinedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Último Login</p>
                    <p className="text-xs font-bold text-white">{selectedUser.lastLogin || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Star size={14} className="text-amber-500" /> Atividade e Interesses
                  </h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Principal Interesse:</span>
                      <span className="text-xs font-bold text-blue-400">{selectedUser.topInterest}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Artigos Lidos:</span>
                      <span className="text-xs font-bold text-white">{selectedUser.readArticlesIds.length} concluídos</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Nível Atual:</span>
                      <span className="px-2 py-0.5 bg-blue-600/20 text-blue-500 rounded font-black text-[10px]">NV {selectedUser.level}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Alterar Plano de Assinatura</label>
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

              {/* Lado Direito: Chat Individual */}
              <div className="lg:w-1/2 bg-slate-950/50 flex flex-col h-[700px] lg:h-auto">
                <div className="p-8 border-b border-slate-800 bg-slate-900/50">
                   <h4 className="text-lg font-bold text-white flex items-center gap-3">
                     <MessageSquare className="text-blue-500" /> Chat Direto com o Usuário
                   </h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Mensagens de suporte e consultoria individual</p>
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
                       <p className="text-sm italic">Inicie uma conversa privada com {selectedUser.name.split(' ')[0]}.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-8 bg-slate-900/50 border-t border-slate-800">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Escreva sua mensagem aqui..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-6 pr-14 py-4 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!chatMessage.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90"
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
