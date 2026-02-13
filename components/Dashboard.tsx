
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, CheckSquare, Flame, TrendingUp, 
  ChevronRight, Target, Clock, Star, Calculator
} from 'lucide-react';
import { getDailyTip } from '../services/gemini';

const StatCard = ({ icon: Icon, label, value, colorClass, iconBg }: any) => (
  <div className="bg-[#1e293b]/40 border border-slate-800/30 p-4 rounded-2xl flex flex-col gap-3 group active:scale-[0.98] transition-all shadow-md">
    <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center text-white shadow-sm`}>
      <Icon size={22} className={colorClass} />
    </div>
    <div className="flex flex-col">
      <h3 className="text-2xl font-black text-white leading-none tracking-tight">{value}</h3>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">{label}</p>
    </div>
  </div>
);

const SuggestionItem = ({ icon: Icon, title, time, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800/30 hover:bg-slate-800/50 active:scale-[0.99] transition-all group cursor-pointer mb-2 last:mb-0"
  >
    <div className="flex items-center gap-4 min-w-0">
      <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-bold text-slate-100 truncate pr-2">{title}</h4>
        <div className="flex items-center gap-1.5 mt-0.5 text-slate-500">
           <Clock size={12} />
           <span className="text-[10px] font-bold uppercase tracking-tighter">{time} min</span>
        </div>
      </div>
    </div>
    <ChevronRight size={16} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
  </div>
);

const Dashboard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const navigate = useNavigate();
  const [tip, setTip] = useState("Carregando dicas de campo...");

  useEffect(() => {
    getDailyTip(user.area).then(setTip);
  }, [user.area]);

  const readCount = user.readArticlesIds?.length || 5;
  const streak = user.readingGoals?.streak || 0;

  return (
    <div className="space-y-7 max-w-2xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
      
      {/* Welcome Header */}
      <div className="space-y-1 px-1">
        <h2 className="text-[28px] font-black text-white flex items-center gap-2 tracking-tighter">
          Olá, Tech! <span className="animate-bounce">👋</span>
        </h2>
        <p className="text-slate-500 text-sm font-medium">Bem-vindo ao seu painel de estudos</p>
      </div>

      {/* Stats Grid 2x2 - Screenshot 2 */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={BookOpen} label="Artigos Lidos" value={readCount} iconBg="bg-blue-600/10" colorClass="text-blue-500" />
        <StatCard icon={CheckSquare} label="Checklists" value={0} iconBg="bg-emerald-600/10" colorClass="text-emerald-500" />
        <StatCard icon={Flame} label="Dias Seguidos" value={streak} iconBg="bg-amber-600/10" colorClass="text-amber-500" />
        <StatCard icon={TrendingUp} label="Progresso" value="2%" iconBg="bg-violet-600/10" colorClass="text-violet-500" />
      </div>

      {/* Meta Diária Card - Screenshot 2 */}
      <div className="bg-[#1e293b]/40 border border-slate-800/50 p-6 rounded-[32px] space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/5 blur-[50px] pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-blue-400">
            <Target size={20} className="fill-blue-400/10" />
            <h3 className="text-lg font-black tracking-tight uppercase tracking-widest text-sm">Meta Diária</h3>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/30">Atividade</span>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-300">Leitura de hoje</span>
            <span className="text-sm font-black text-blue-400">3 / 3 artigos</span>
          </div>
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
            <div className="h-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="space-y-4 pt-5 border-t border-slate-800/50">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Sugestões de leitura:</p>
          <div className="space-y-1">
            <SuggestionItem icon={BookOpen} title="Desenho de Fabricação" time="12" onClick={() => navigate('/library')} />
            <SuggestionItem icon={BookOpen} title="Leitura e Interpretação de Des..." time="11" onClick={() => navigate('/library')} />
            <SuggestionItem icon={BookOpen} title="CAD - Desenho Auxiliado por ..." time="13" onClick={() => navigate('/library')} />
          </div>
        </div>
      </div>

      {/* Dica do Dia */}
      <div className="mt-4 bg-blue-600/5 border border-blue-500/10 p-5 rounded-3xl flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
          <Star size={20} className="fill-blue-400/20" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Dica Profissional</p>
          <p className="text-sm text-slate-400 italic leading-relaxed">"{tip}"</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
