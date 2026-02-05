
import React from 'react';
import { UserProfile, UserPlan } from '../types';
import { PRICING, MERCADO_PAGO_LINKS } from '../constants';
import { Shield, Gem, Star, Check, Camera, Mail, Briefcase, CreditCard, ExternalLink, CheckCircle2, Award, Zap } from 'lucide-react';

const Profile: React.FC<{ user: UserProfile; setUser: (u: UserProfile) => void }> = ({ user, setUser }) => {
  const isPremium = user.plan !== UserPlan.FREE && user.plan !== UserPlan.ADMIN;
  
  const handlePaymentClick = () => {
    alert("Redirecionando para o Mercado Pago. Após o pagamento, seu acesso será liberado manualmente pelo administrador via protocolo de conferência.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><Zap size={180} className="text-white" /></div>
        <div className="relative group shrink-0">
          <img src={user.avatar} className="w-32 h-32 rounded-3xl border-4 border-slate-800 object-cover shadow-xl" alt="Avatar" />
          <button className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-3xl transition-all"><Camera className="text-white" /></button>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-black text-white mb-2">{user.name}</h2>
          <div className="space-y-1 text-slate-400 font-medium">
            <p className="flex items-center justify-center md:justify-start gap-2"><Mail size={16} className="text-blue-500" /> {user.email}</p>
            <p className="flex items-center justify-center md:justify-start gap-2"><Briefcase size={16} className="text-blue-500" /> {user.area}</p>
          </div>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center min-w-[120px]">
           <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">XP Atual</p>
           <p className="text-2xl font-black text-blue-500">{user.xp}</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2"><Gem size={24} className="text-amber-500" /> Planos de Assinatura Profissional</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col relative overflow-hidden transition-all hover:border-slate-700">
            <h4 className="text-xl font-bold text-white mb-2">Gratuito</h4>
            <div className="text-3xl font-black text-white mb-6">R$ 0,00</div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-xs text-slate-400"><Check size={14} className="text-emerald-500" /> Artigos Básicos</li>
              <li className="flex items-center gap-2 text-xs text-slate-400"><Check size={14} className="text-emerald-500" /> Fórum Comunitário</li>
            </ul>
            {user.plan === UserPlan.FREE ? (
              <div className="w-full bg-slate-800 text-slate-500 py-3 rounded-xl text-center font-bold text-sm">Plano Atual</div>
            ) : <button disabled className="w-full bg-slate-800/30 text-slate-700 py-3 rounded-xl font-bold text-sm">Disponível</button>}
          </div>

          <div className={`bg-slate-900 border p-8 rounded-3xl flex flex-col relative overflow-hidden transition-all hover:scale-[1.02] shadow-2xl ${user.plan === UserPlan.MONTHLY ? 'border-amber-500 shadow-amber-500/10' : 'border-slate-800'}`}>
            <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 px-3 py-1 text-[9px] font-black uppercase rounded-bl-xl">Mais Flexível</div>
            <h4 className="text-xl font-bold text-white mb-2">Mensal</h4>
            <div className="text-3xl font-black text-white mb-6">R$ 14,90<span className="text-xs text-slate-500 font-normal">/mês</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-xs text-slate-300"><Check size={14} className="text-amber-500" /> Conteúdo Especialista</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><Check size={14} className="text-amber-500" /> Calculadoras de Campo</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><Check size={14} className="text-amber-500" /> Catálogos Diversos</li>
            </ul>
            <a 
              href={MERCADO_PAGO_LINKS.MONTHLY} 
              target="_blank" 
              onClick={handlePaymentClick}
              className={`w-full py-4 rounded-xl text-center font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${user.plan === UserPlan.MONTHLY ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'}`}
            >
              {user.plan === UserPlan.MONTHLY ? 'Assinatura Ativa' : 'Assinar com Mercado Pago'} <ExternalLink size={14} />
            </a>
          </div>

          <div className={`bg-slate-900 border p-8 rounded-3xl flex flex-col relative overflow-hidden transition-all hover:scale-[1.02] shadow-2xl ${user.plan === UserPlan.ANNUAL ? 'border-amber-500 shadow-amber-500/10' : 'border-slate-800'}`}>
            <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 text-[9px] font-black uppercase rounded-bl-xl">Melhor Valor</div>
            <h4 className="text-xl font-bold text-white mb-2">Anual</h4>
            <div className="text-3xl font-black text-white mb-6">R$ 119,90<span className="text-xs text-slate-500 font-normal">/ano</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-xs text-slate-300"><Check size={14} className="text-amber-500" /> Tudo do Mensal</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><Check size={14} className="text-amber-500" /> Exportação PDF Ilimitada</li>
              <li className="flex items-center gap-2 text-xs text-slate-300"><Check size={14} className="text-amber-500" /> Badge de Especialista</li>
            </ul>
            <a 
              href={MERCADO_PAGO_LINKS.ANNUAL} 
              target="_blank" 
              onClick={handlePaymentClick}
              className={`w-full py-4 rounded-xl text-center font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${user.plan === UserPlan.ANNUAL ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'}`}
            >
              {user.plan === UserPlan.ANNUAL ? 'Assinatura Ativa' : 'Assinar com Mercado Pago'} <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/5 border border-blue-600/20 p-8 rounded-3xl flex items-center gap-6">
        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0"><CheckCircle2 size={32} /></div>
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-white">Confirmação Pós-Pagamento</h4>
          <p className="text-sm text-slate-400 leading-relaxed">Pagamento recebido via Mercado Pago. Seu acesso premium será liberado manualmente pelo administrador em breve, após a conferência automática do protocolo de segurança.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
