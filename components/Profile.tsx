
import React, { useState, useEffect } from 'react';
import { UserProfile, UserPlan } from '../types';
import { PRICING, MERCADO_PAGO_LINKS, INITIAL_ARTICLES } from '../constants';
// Added Crown and CheckSquare to the lucide-react imports
import { 
  Shield, Gem, Star, Check, Camera, Mail, Briefcase, CreditCard, 
  ExternalLink, CheckCircle2, Award, Zap, Edit2, Save, X, 
  BarChart, History, Target, MessageSquare, BookOpen, 
  Calculator, RefreshCw, ChevronRight, User as UserIcon,
  Trophy, TrendingUp, Layout, Crown, CheckSquare
} from 'lucide-react';

const Profile: React.FC<{ user: UserProfile; setUser: (u: UserProfile) => void }> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    area: user.area,
    avatar: user.avatar
  });
  
  const [savedChecklistsCount, setSavedChecklistsCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('techpro_saved_reports');
    if (saved) {
      setSavedChecklistsCount(JSON.parse(saved).length);
    }
  }, []);

  const handleSave = () => {
    setUser({
      ...user,
      name: editData.name,
      area: editData.area,
      avatar: editData.avatar
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      area: user.area,
      avatar: user.avatar
    });
    setIsEditing(false);
  };

  const readArticles = INITIAL_ARTICLES.filter(art => user.readArticlesIds.includes(art.id));

  const xpTips = [
    { text: 'Complete um Checklist técnico de inspeção', xp: '+150 XP', icon: CheckCircle2, color: 'text-emerald-500' },
    { text: 'Participe de discussões no fórum comunitário', xp: '+100 XP', icon: MessageSquare, color: 'text-blue-500' },
    { text: 'Leia novos artigos da biblioteca avançada', xp: '+50 XP', icon: BookOpen, color: 'text-violet-500' },
    { text: 'Utilize calculadoras de dimensionamento', xp: '+20 XP', icon: Calculator, color: 'text-amber-500' },
    { text: 'Realize conversões de unidades técnicas', xp: '+10 XP', icon: RefreshCw, color: 'text-cyan-500' },
  ];

  const isPremium = user.plan === UserPlan.ANNUAL || user.plan === UserPlan.MONTHLY || user.plan === UserPlan.ADMIN;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 page-fade-in">
      {/* Header Section / Identity */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-[48px] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-amber-500/5 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="w-44 h-44 rounded-[40px] border-8 border-slate-800/50 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <img src={editData.avatar} className="w-full h-full object-cover" alt="Profile Avatar" />
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-slate-950/80 rounded-[40px] flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in-95">
                <Camera className="text-blue-500 mb-2" size={28} />
                <input 
                  type="text" 
                  placeholder="Link da Imagem" 
                  className="w-full bg-slate-900 border border-slate-700 text-[10px] text-white p-2.5 rounded-xl outline-none focus:ring-1 focus:ring-blue-600" 
                  value={editData.avatar}
                  onChange={e => setEditData({...editData, avatar: e.target.value})}
                />
              </div>
            )}
            <div className="absolute -bottom-3 -right-3 bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-900/40 text-white">
              <Award size={24} />
            </div>
          </div>

          {/* Info Area */}
          <div className="flex-1 text-center md:text-left space-y-6">
            {isEditing ? (
              <div className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    className="bg-slate-950 border border-slate-800 text-2xl font-black text-white px-5 py-3 rounded-2xl w-full focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    value={editData.name}
                    onChange={e => setEditData({...editData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cargo / Especialidade</label>
                  <input 
                    className="bg-slate-950 border border-slate-800 text-blue-400 font-bold px-5 py-3 rounded-2xl w-full focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    value={editData.area}
                    onChange={e => setEditData({...editData, area: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                    <Save size={16} /> Salvar Alterações
                  </button>
                  <button onClick={handleCancel} className="px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{user.name}</h2>
                    <button onClick={() => setIsEditing(true)} className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-90 shadow-lg">
                      <Edit2 size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className="px-4 py-1.5 bg-blue-600/10 text-blue-500 rounded-full border border-blue-600/20 text-xs font-black uppercase tracking-widest">Nível {user.level}</span>
                    <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Zap size={14} className="fill-amber-500" /> {user.xp} XP Totais
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-400 font-medium">
                  <div className="flex items-center justify-center md:justify-start gap-3 bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50 group hover:border-blue-500/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500"><Mail size={18} /></div>
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50 group hover:border-blue-500/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500"><Briefcase size={18} /></div>
                    <span className="text-sm truncate">{user.area}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Status / Badges */}
          <div className="hidden lg:flex flex-col gap-4 shrink-0">
             <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-[32px] text-center min-w-[200px] shadow-xl relative group">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-4">Membro desde</p>
                <p className="text-lg font-bold text-white mb-1">{new Date(user.joinedAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                <p className="text-[9px] text-blue-500 font-black uppercase">Conta Verificada</p>
                <div className="absolute inset-0 bg-blue-600/5 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
             {isPremium && (
               <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 p-6 rounded-[32px] text-center shadow-xl shadow-amber-900/10">
                  <Crown size={32} className="text-amber-500 mx-auto mb-3" />
                  <p className="text-[10px] text-amber-600 uppercase font-black tracking-widest">Selo Especialista</p>
                  <p className="text-sm font-bold text-white mt-1">Acesso Premium</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Main Content Grid (Bento Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & Performance */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-xl relative overflow-hidden h-full">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500"><TrendingUp size={24} /></div>
                 <div>
                   <h3 className="text-xl font-bold text-white tracking-tight">Performance Profissional</h3>
                   <p className="text-xs text-slate-500">Métricas de interação na plataforma</p>
                 </div>
               </div>
               <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Dados em tempo real</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 group hover:border-blue-500/50 transition-all text-center">
                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <CheckSquare size={20} />
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Checklists</p>
                <p className="text-3xl font-black text-white">{savedChecklistsCount}</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 group hover:border-emerald-500/50 transition-all text-center">
                <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500 mx-auto mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Calculator size={20} />
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Cálculos</p>
                <p className="text-3xl font-black text-white">{user.calculationsCount || 0}</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 group hover:border-cyan-500/50 transition-all text-center">
                <div className="w-10 h-10 bg-cyan-600/10 rounded-xl flex items-center justify-center text-cyan-500 mx-auto mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                  <RefreshCw size={20} />
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Conversões</p>
                <p className="text-3xl font-black text-white">{user.conversionsCount || 0}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-500"><History size={20} /></div>
                   <h3 className="text-lg font-bold text-white">Artigos Concluídos</h3>
                 </div>
                 <span className="text-[10px] font-black text-violet-500 bg-violet-500/10 px-3 py-1 rounded-full uppercase">{readArticles.length} Artigos</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {readArticles.slice(0, 4).map((art, idx) => (
                   <div key={idx} className="bg-slate-950 p-4 rounded-[20px] border border-slate-800 flex items-center justify-between group hover:bg-slate-900 transition-all cursor-default">
                     <div className="flex items-center gap-3 min-w-0">
                       <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:text-white transition-colors">0{idx+1}</div>
                       <p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors truncate">{art.title}</p>
                     </div>
                     <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                   </div>
                 ))}
                 {readArticles.length === 0 && (
                   <div className="col-span-2 py-10 text-center text-slate-600 italic text-sm">
                     Nenhum artigo técnico concluído na jornada.
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tips & Level Up */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-xl h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-500"><Target size={24} /></div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Próximos Passos</h3>
                <p className="text-xs text-slate-500">Dicas para evoluir seu XP</p>
              </div>
            </div>

            <div className="space-y-3 flex-1">
               {xpTips.map((tip, idx) => (
                 <div key={idx} className="flex items-center gap-4 p-4 bg-slate-950 rounded-[24px] border border-slate-800 group hover:border-blue-500/30 transition-all hover:bg-slate-900 active:scale-[0.98] cursor-pointer">
                   <div className={`w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center ${tip.color} group-hover:scale-110 transition-transform`}>
                     <tip.icon size={20} />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold text-slate-200 leading-tight mb-1">{tip.text}</p>
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{tip.xp}</p>
                   </div>
                   <ChevronRight size={14} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                 </div>
               ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-600/20 rounded-[32px] text-center">
               <Trophy className="text-blue-500 mx-auto mb-3" size={28} />
               <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Desafio da Semana</h4>
               <p className="text-[11px] text-slate-400 leading-relaxed italic">"Gere 3 relatórios de inspeção PDF e ganhe 500 XP extras!"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Section */}
      <div className="space-y-8 pt-12 border-t border-slate-800">
        <div className="text-center space-y-2">
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter flex items-center justify-center gap-4">
            <Gem size={32} className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" /> 
            Plataforma Specialist Pro
          </h3>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Desbloqueie todo o potencial da ferramenta com planos de suporte e consultoria.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[48px] flex flex-col relative overflow-hidden transition-all hover:border-slate-700 shadow-xl group">
            <div className="mb-8">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4">Iniciante</p>
              <h4 className="text-3xl font-black text-white mb-2">Gratuito</h4>
              <div className="text-slate-400 font-medium">Básico para consulta de campo rápida.</div>
            </div>
            <div className="text-4xl font-black text-white mb-8">R$ 0<span className="text-lg text-slate-600 font-bold">/mês</span></div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-xs text-slate-400"><CheckCircle2 size={18} className="text-emerald-500/50" /> Artigos Básicos de Campo</li>
              <li className="flex items-center gap-3 text-xs text-slate-400"><CheckCircle2 size={18} className="text-emerald-500/50" /> Comunidade no Fórum</li>
              <li className="flex items-center gap-3 text-xs text-slate-400/50 line-through"><X size={18} /> Calculadoras Avançadas</li>
            </ul>
            {user.plan === UserPlan.FREE ? (
              <div className="w-full bg-slate-800 text-slate-500 py-5 rounded-[24px] text-center font-black uppercase text-xs tracking-widest border border-slate-700">Seu Plano Atual</div>
            ) : (
              <button disabled className="w-full bg-slate-800/30 text-slate-700 py-5 rounded-[24px] font-black uppercase text-xs tracking-widest">Incluso</button>
            )}
          </div>

          {/* Monthly Plan */}
          <div className={`bg-slate-900 border p-1 rounded-[48px] flex flex-col relative overflow-hidden transition-all hover:scale-[1.02] shadow-2xl ${user.plan === UserPlan.MONTHLY ? 'border-amber-500 shadow-amber-500/20' : 'border-slate-800'}`}>
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 px-6 py-2.5 text-[10px] font-black uppercase rounded-bl-[24px] tracking-widest shadow-lg">Popular</div>
            <div className="bg-slate-900 p-8 flex-1 flex flex-col h-full rounded-[47px]">
              <div className="mb-8">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em] mb-4">Acesso Total</p>
                <h4 className="text-3xl font-black text-white mb-2">Mensal</h4>
                <div className="text-slate-400 font-medium">Flexibilidade total para sua empresa.</div>
              </div>
              <div className="text-4xl font-black text-white mb-8">R$ 14,90<span className="text-lg text-slate-600 font-bold">/mês</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold"><CheckCircle2 size={18} className="text-amber-500" /> Todas as 600+ Calculadoras</li>
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold"><CheckCircle2 size={18} className="text-amber-500" /> Catálogos e Manuais Premium</li>
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold"><CheckCircle2 size={18} className="text-amber-500" /> Histórico de Relatórios Salvos</li>
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold"><CheckCircle2 size={18} className="text-amber-500" /> Suporte Prioritário</li>
              </ul>
              <a 
                href={MERCADO_PAGO_LINKS.MONTHLY} 
                target="_blank" 
                rel="noreferrer"
                className={`w-full py-5 rounded-[24px] text-center font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${user.plan === UserPlan.MONTHLY ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/30'}`}
              >
                {user.plan === UserPlan.MONTHLY ? 'Plano Ativo' : 'Quero Ser Specialist'} <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Annual Plan */}
          <div className={`bg-slate-900 border p-1 rounded-[48px] flex flex-col relative overflow-hidden transition-all hover:scale-[1.02] shadow-2xl ${user.plan === UserPlan.ANNUAL ? 'border-blue-500 shadow-blue-500/20' : 'border-slate-800'}`}>
            <div className="absolute top-0 right-0 bg-emerald-600 text-white px-6 py-2.5 text-[10px] font-black uppercase rounded-bl-[24px] tracking-widest shadow-lg">Economia 33%</div>
            <div className="bg-slate-900 p-8 flex-1 flex flex-col h-full rounded-[47px]">
              <div className="mb-8">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] mb-4">Investimento</p>
                <h4 className="text-3xl font-black text-white mb-2">Anual</h4>
                <div className="text-slate-400 font-medium">O melhor custo-benefício profissional.</div>
              </div>
              <div className="text-4xl font-black text-white mb-8">R$ 119,90<span className="text-lg text-slate-600 font-bold">/ano</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold"><CheckCircle2 size={18} className="text-blue-500" /> Tudo do Plano Mensal</li>
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold"><CheckCircle2 size={18} className="text-blue-500" /> Exportação Ilimitada em PDF</li>
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold"><CheckCircle2 size={18} className="text-blue-500" /> Badge de "Master Specialist"</li>
                <li className="flex items-center gap-3 text-xs text-slate-200 font-bold"><CheckCircle2 size={18} className="text-blue-500" /> Descontos em Treinamentos</li>
              </ul>
              <a 
                href={MERCADO_PAGO_LINKS.ANNUAL} 
                target="_blank" 
                rel="noreferrer"
                className={`w-full py-5 rounded-[24px] text-center font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${user.plan === UserPlan.ANNUAL ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/30'}`}
              >
                {user.plan === UserPlan.ANNUAL ? 'Plano Ativo' : 'Garantir Plano Anual'} <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-10 opacity-40">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
             <Shield size={16} className="text-blue-500" /> Pagamento Seguro via Mercado Pago
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
             <CheckCircle2 size={16} className="text-blue-500" /> Renovação Automática Opcional
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
             <Lock size={16} className="text-blue-500" /> Dados Protegidos (LGPD)
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
