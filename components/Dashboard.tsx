
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, CheckSquare, Flame, TrendingUp, 
  ChevronRight, Target, Clock, Star, Calculator,
  Zap, Cpu, Globe, Signal, ShieldCheck, Activity,
  Gauge, Award, Radio, Settings2
} from 'lucide-react';
import { getDailyTip } from '../services/gemini';

const StatCard = ({ icon: Icon, label, value, trend, colorClass, iconBg }: any) => (
  <div className="bg-[#111827]/60 border border-slate-800/50 p-5 rounded-[24px] flex flex-col gap-4 group active:scale-[0.97] transition-all shadow-xl relative overflow-hidden">
    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    <div className="flex items-center justify-between">
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center text-white shadow-lg border border-white/5`}>
        <Icon size={24} className={colorClass} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <TrendingUp size={10} className="text-emerald-500" />
          <span className="text-[9px] font-black text-emerald-500">{trend}</span>
        </div>
      )}
    </div>
    <div className="flex flex-col">
      <h3 className="text-2xl font-black text-white leading-none tracking-tight">{value}</h3>
      <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">{label}</p>
    </div>
  </div>
);

const OperationalStatus = () => (
  <div className="flex items-center gap-4 px-4 py-2 bg-slate-900/50 border border-slate-800/40 rounded-2xl mb-6 overflow-x-auto no-scrollbar">
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sistemas: Online</span>
    </div>
    <div className="h-4 w-px bg-slate-800 shrink-0" />
    <div className="flex items-center gap-2 shrink-0">
      <Signal size={12} className="text-blue-500" />
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sincronização: 100%</span>
    </div>
    <div className="h-4 w-px bg-slate-800 shrink-0" />
    <div className="flex items-center gap-2 shrink-0">
      <Globe size={12} className="text-amber-500" />
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Região: BR-SUL</span>
    </div>
  </div>
);

const MissionItem = ({ icon: Icon, title, time, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800/30 hover:border-blue-500/50 hover:bg-slate-900/60 active:scale-[0.99] transition-all group cursor-pointer mb-2 last:mb-0"
  >
    <div className="flex items-center gap-4 min-w-0">
      <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-600/10 transition-all">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-bold text-slate-200 truncate pr-2 group-hover:text-white transition-colors">{title}</h4>
        <div className="flex items-center gap-2 mt-1">
           <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md">Missão Técnica</span>
           <div className="flex items-center gap-1 text-slate-500">
             <Clock size={10} />
             <span className="text-[9px] font-bold">{time} min</span>
           </div>
        </div>
      </div>
    </div>
    <ChevronRight size={16} className="text-slate-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
  </div>
);

const Dashboard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const navigate = useNavigate();
  const [tip, setTip] = useState("Sincronizando telemetria de campo...");

  useEffect(() => {
    getDailyTip(user.area).then(setTip);
  }, [user.area]);

  const readCount = user.readArticlesIds?.length || 0;
  const streak = user.readingGoals?.streak || 0;
  const xp = user.xp || 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* 1. Header Operativo */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <span className="bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md shadow-lg shadow-blue-900/20">Modo Ativo</span>
             <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest font-mono">ID: TP-{user.id.slice(-4).toUpperCase()}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight">
            Bem-vindo, <span className="text-blue-500">{user.name.split(' ')[0]}</span>.
          </h2>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <Radio size={14} className="text-emerald-500" /> Consola Operativa Industrial • {user.area}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md">
           <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
              <Award size={26} />
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status de Carreira</p>
              <h4 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                Especialista Nível {user.level}
              </h4>
           </div>
        </div>
      </div>

      {/* 2. System Health Row */}
      <OperationalStatus />

      {/* 3. Stats Grid 2x2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Artigos Lidos" value={readCount} trend="+3" iconBg="bg-blue-600/10" colorClass="text-blue-500" />
        <StatCard icon={CheckSquare} label="Checklists" value={user.checklistsCount || 0} iconBg="bg-emerald-600/10" colorClass="text-emerald-500" />
        <StatCard icon={Flame} label="Ofensiva" value={`${streak}d`} trend="Recorde" iconBg="bg-amber-600/10" colorClass="text-amber-500" />
        <StatCard icon={TrendingUp} label="Total XP" value={xp} iconBg="bg-violet-600/10" colorClass="text-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 4. Eficiência de Campo (Meta Diária) */}
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800/80 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                <Gauge size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Performance de Hoje</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">KPI: Eficiência de Leitura</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-2xl font-black text-blue-500 tracking-tighter">100%</p>
               <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Eficiência</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
               <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-900" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={226} strokeDashoffset={0} className="text-blue-600 transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Target size={18} className="text-blue-500" />
                  </div>
               </div>
               <div className="flex-1 space-y-2">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Progresso de Missões</span>
                    <span className="text-[10px] font-black text-blue-400 uppercase">3 / 3 Completas</span>
                 </div>
                 <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: '100%' }} />
                 </div>
               </div>
            </div>

            <div className="pt-6 border-t border-slate-800/50 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <Activity size={12} className="text-blue-500" /> Próximas Missões Recomendadas
                </p>
                <button onClick={() => navigate('/library')} className="text-[9px] font-black text-blue-500 uppercase hover:text-blue-400 transition-colors">Ver Biblioteca</button>
              </div>
              <div className="space-y-1">
                <MissionItem icon={Cpu} title="Desenho de Fabricação e Montagem" time="12" onClick={() => navigate('/library')} />
                {/* Fix: Added missing Settings2 import from lucide-react */}
                <MissionItem icon={Settings2} title="Leitura e Interpretação de Desenho Técnico" time="11" onClick={() => navigate('/library')} />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Central de Dicas & Alertas (Gemini) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 flex-1 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/5 blur-[50px] pointer-events-none group-hover:bg-amber-500/10 transition-all" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shadow-inner">
                  <Star size={20} className="fill-amber-500/20" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Tech Insight IA</h3>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Conselho Técnico de Hoje</p>
                </div>
              </div>
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/50 italic text-sm text-slate-300 leading-relaxed min-h-[100px] flex items-center">
                "{tip}"
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/40">
               <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-emerald-500" />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocolo Validado</span>
               </div>
               <Zap size={16} className="text-amber-500 animate-pulse" />
            </div>
          </div>

          <div className="bg-blue-600 rounded-[32px] p-6 shadow-2xl shadow-blue-900/40 group hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative" onClick={() => navigate('/calculators')}>
            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
              <Calculator size={80} />
            </div>
            <div className="relative z-10 space-y-1">
               <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Ferramentas de Campo</p>
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Calculadoras</h3>
               <p className="text-xs text-blue-100 font-medium pt-2 max-w-[150px]">Dimensionamento rápido verificado por especialistas.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
