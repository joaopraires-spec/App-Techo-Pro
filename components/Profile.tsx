
import React, { useState, useEffect } from 'react';
import { UserProfile, UserPlan } from '../types';
import { PRICING, MERCADO_PAGO_LINKS, INITIAL_ARTICLES } from '../constants';
// Added missing icons to the import list: MessageSquare, BookOpen, Calculator, RefreshCw, ChevronRight
import { Shield, Gem, Star, Check, Camera, Mail, Briefcase, CreditCard, ExternalLink, CheckCircle2, Award, Zap, Edit2, Save, X, BarChart, History, Target, MessageSquare, BookOpen, Calculator, RefreshCw, ChevronRight } from 'lucide-react';

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
    { text: 'Complete um Checklist técnico de inspeção', xp: '+150 XP', icon: CheckCircle2 },
    { text: 'Participe de discussões no fórum comunitário', xp: '+100 XP', icon: MessageSquare },
    { text: 'Leia novos artigos da biblioteca avançada', xp: '+50 XP', icon: BookOpen },
    { text: 'Utilize calculadoras de dimensionamento', xp: '+20 XP', icon: Calculator },
    { text: 'Realize conversões de unidades técnicas', xp: '+10 XP', icon: RefreshCw },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><Zap size={220} className="text-white" /></div>
        
        <div className="relative group shrink-0">
          <img src={editData.avatar} className="w-40 h-40 rounded-[32px] border-4 border-slate-800 object-cover shadow-2xl transition-all group-hover:scale-105" alt="Avatar" />
          {isEditing && (
            <div className="absolute inset-0 bg-slate-950/70 rounded-[32px] flex flex-col items-center justify-center p-4">
              <Camera className="text-white mb-2" size={24} />
              <input 
                type="text" 
                placeholder="URL da Foto" 
                className="w-full bg-slate-900 border border-slate-700 text-[10px] text-white p-2 rounded outline-none" 
                value={editData.avatar}
                onChange={e => setEditData({...editData, avatar: e.target.value})}
              />
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          {isEditing ? (
            <div className="space-y-4">
              <input 
                className="bg-slate-950 border border-slate-800 text-3xl font-black text-white px-4 py-2 rounded-2xl w-full focus:ring-2 focus:ring-blue-600 outline-none"
                value={editData.name}
                onChange={e => setEditData({...editData, name: e.target.value})}
                placeholder="Seu Nome"
              />
              <input 
                className="bg-slate-950 border border-slate-800 text-blue-500 font-bold px-4 py-2 rounded-2xl w-full focus:ring-2 focus:ring-blue-600 outline-none"
                value={editData.area}
                onChange={e => setEditData({...editData, area: e.target.value})}
                placeholder="Seu Cargo/Área"
              />
              <div className="flex gap-3 justify-center md:justify-start">
                <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-black uppercase text-[10px] flex items-center gap-2"><Save size={16} /> Salvar Alterações</button>
                <button onClick={handleCancel} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl font-black uppercase text-[10px] flex items-center gap-2"><X size={16} /> Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h2 className="text-4xl font-black text-white tracking-tight">{user.name}</h2>
                <button onClick={() => setIsEditing(true)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all active:scale-90"><Edit2 size={18} /></button>
              </div>
              <div className="space-y-1 text-slate-400 font-medium text-lg">
                <p className="flex items-center justify-center md:justify-start gap-3"><Mail size={18} className="text-blue-500" /> {user.email}</p>
                <p className="flex items-center justify-center md:justify-start gap-3"><Briefcase size={18} className="text-blue-500" /> {user.area}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-[32px] text-center min-w-[140px] shadow-inner">
             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Nível Profissional</p>
             <p className="text-3xl font-black text-blue-500">{user.level}</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-[32px] text-center min-w-[140px] shadow-inner">
             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">XP Total</p>
             <p className="text-3xl font-black text-amber-500">{user.xp}</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500"><BarChart size={20} /></div>
               <h3 className="text-xl font-bold text-white tracking-tight">Estatísticas de Atividade</h3>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-slate-950 p-6 rounded-[28px] border border-slate-800 text-center group hover:border-blue-500/50 transition-all">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Checklists</p>
                  <p className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">{savedChecklistsCount}</p>
                </div>
                <div className="bg-slate-950 p-6 rounded-[28px] border border-slate-800 text-center group hover:border-blue-500/50 transition-all">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Cálculos</p>
                  <p className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">{user.calculationsCount || 0}</p>
                </div>
                <div className="bg-slate-950 p-6 rounded-[28px] border border-slate-800 text-center group hover:border-blue-500/50 transition-all">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Conversões</p>
                  <p className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">{user.conversionsCount || 0}</p>
                </div>
             </div>

             <div className="mt-10 pt-8 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-500"><History size={20} /></div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Principais Artigos Lidos</h3>
                </div>
                <div className="space-y-3">
                  {readArticles.slice(0, 3).map((art, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between group hover:bg-slate-900 transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-700">0{idx+1}</span>
                        <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{art.title}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-700" />
                    </div>
                  ))}
                  {readArticles.length === 0 && <p className="text-sm text-slate-600 italic px-4">Nenhum artigo concluído ainda.</p>}
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-amber-600/10 rounded-xl flex items-center justify-center text-amber-500"><Target size={20} /></div>
               <h3 className="text-xl font-bold text-white tracking-tight">Como subir de Nível?</h3>
             </div>
             <div className="space-y-4">
                {xpTips.map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 group hover:border-blue-500/30 transition-all">
                    <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <tip.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-300 leading-tight">{tip.text}</p>
                      <p className="text-[10px] font-black text-blue-500 mt-1 uppercase tracking-widest">{tip.xp}</p>
                    </div>
                  </div>
                ))}
             </div>
           </div>

           <div className="bg-blue-600/5 border border-blue-600/20 p-8 rounded-[40px] flex items-start gap-6">
             <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 shadow-lg"><Award size={28} /></div>
             <div className="space-y-2">
               <h4 className="text-lg font-black text-white tracking-tight uppercase">Mestre de Campo</h4>
               <p className="text-xs text-slate-400 leading-relaxed italic">"A maestria técnica não é o fim da jornada, mas o início de uma nova visão sobre a engenharia de precisão."</p>
             </div>
           </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="space-y-6 pt-10 border-t border-slate-800">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3"><Gem size={28} className="text-amber-500" /> Planos de Assinatura Profissional</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] flex flex-col relative overflow-hidden transition-all hover:border-slate-700 shadow-xl">
            <h4 className="text-xl font-bold text-white mb-2">Gratuito</h4>
            <div className="text-3xl font-black text-white mb-6">R$ 0,00</div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-xs text-slate-400"><Check size={16} className="text-emerald-500" /> Artigos Básicos</li>
              <li className="flex items-center gap-3 text-xs text-slate-400"><Check size={16} className="text-emerald-500" /> Fórum Comunitário</li>
            </ul>
            {user.plan === UserPlan.FREE ? (
              <div className="w-full bg-slate-800 text-slate-500 py-4 rounded-2xl text-center font-black uppercase text-[10px] tracking-widest">Plano Atual</div>
            ) : <button disabled className="w-full bg-slate-800/30 text-slate-700 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Disponível</button>}
          </div>

          <div className={`bg-slate-900 border p-8 rounded-[40px] flex flex-col relative overflow-hidden transition-all hover:scale-[1.02] shadow-2xl ${user.plan === UserPlan.MONTHLY ? 'border-amber-500 shadow-amber-500/10' : 'border-slate-800'}`}>
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 px-4 py-2 text-[10px] font-black uppercase rounded-bl-2xl">Mais Flexível</div>
            <h4 className="text-xl font-bold text-white mb-2">Mensal</h4>
            <div className="text-3xl font-black text-white mb-6">R$ 14,90<span className="text-xs text-slate-500 font-normal ml-1">/mês</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-xs text-slate-300"><Check size={16} className="text-amber-500" /> Conteúdo Especialista</li>
              <li className="flex items-center gap-3 text-xs text-slate-300"><Check size={16} className="text-amber-500" /> Calculadoras de Campo</li>
              <li className="flex items-center gap-3 text-xs text-slate-300"><Check size={16} className="text-amber-500" /> Catálogos Diversos</li>
            </ul>
            <a 
              href={MERCADO_PAGO_LINKS.MONTHLY} 
              target="_blank" 
              className={`w-full py-5 rounded-2xl text-center font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${user.plan === UserPlan.MONTHLY ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/20'}`}
            >
              {user.plan === UserPlan.MONTHLY ? 'Assinatura Ativa' : 'Assinar Agora'} <ExternalLink size={14} />
            </a>
          </div>

          <div className={`bg-slate-900 border p-8 rounded-[40px] flex flex-col relative overflow-hidden transition-all hover:scale-[1.02] shadow-2xl ${user.plan === UserPlan.ANNUAL ? 'border-amber-500 shadow-amber-500/10' : 'border-slate-800'}`}>
            <div className="absolute top-0 right-0 bg-emerald-600 text-white px-4 py-2 text-[10px] font-black uppercase rounded-bl-2xl">Melhor Valor</div>
            <h4 className="text-xl font-bold text-white mb-2">Anual</h4>
            <div className="text-3xl font-black text-white mb-6">R$ 119,90<span className="text-xs text-slate-500 font-normal ml-1">/ano</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-xs text-slate-300"><Check size={16} className="text-amber-500" /> Tudo do Mensal</li>
              <li className="flex items-center gap-3 text-xs text-slate-300"><Check size={16} className="text-amber-500" /> Exportação PDF Ilimitada</li>
              <li className="flex items-center gap-3 text-xs text-slate-300"><Check size={16} className="text-amber-500" /> Badge de Especialista</li>
            </ul>
            <a 
              href={MERCADO_PAGO_LINKS.ANNUAL} 
              target="_blank" 
              className={`w-full py-5 rounded-2xl text-center font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${user.plan === UserPlan.ANNUAL ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl'}`}
            >
              {user.plan === UserPlan.ANNUAL ? 'Assinatura Ativa' : 'Assinar Plano Anual'} <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
