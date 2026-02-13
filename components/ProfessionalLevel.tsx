
import React from 'react';
import { UserProfile } from '../types';
import { LEVELS } from '../constants';
// Fix: Added missing CheckCircle2 import to fix "Cannot find name 'CheckCircle2'" error.
import { Award, Zap, BookOpen, Calculator, MessageSquare, CheckSquare, Target, ChevronRight, Info, ShieldCheck, Trophy, TrendingUp, CheckCircle2 } from 'lucide-react';

const ProfessionalLevel: React.FC<{ user: UserProfile }> = ({ user }) => {
  const currentLevelInfo = LEVELS.find(l => l.level === user.level) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.level === user.level + 1);
  
  const currentLevelXp = currentLevelInfo.minXp;
  const nextLevelXp = nextLevelInfo ? nextLevelInfo.minXp : user.xp;
  
  const xpInLevel = user.xp - currentLevelXp;
  const xpNeededForNext = nextLevelXp - currentLevelXp;
  const progressPercent = nextLevelInfo ? Math.min(100, (xpInLevel / Math.max(1, xpNeededForNext)) * 100) : 100;

  const actions = [
    { icon: CheckSquare, label: 'Finalize um checklist de inspeção', xp: '+150 XP', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: MessageSquare, label: 'Participe de discussões no fórum', xp: '+100 XP', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: BookOpen, label: 'Leia novos artigos técnicos', xp: '+50 XP', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { icon: Calculator, label: 'Utilize calculadoras de campo', xp: '+20 XP', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const levelsList = [...LEVELS].reverse();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <Trophy className="text-amber-500" size={32} /> Desenvolvimento Profissional
          </h2>
          <p className="text-slate-500 text-sm mt-1">Sua trajetória rumo à excelência na manutenção industrial.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 flex items-center gap-6 shadow-xl">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Experiência Total</p>
            <p className="text-xl font-black text-white">{user.xp} <span className="text-blue-500 text-xs font-bold uppercase">XP</span></p>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="flex flex-col items-center">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Cargo Atual</p>
            <p className="text-lg font-black text-blue-500 flex items-center gap-2">
              {currentLevelInfo.medal} {currentLevelInfo.title}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progression Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#111827] border border-slate-800 rounded-[40px] p-8 sm:p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none rotate-12">
              <Trophy size={300} className="text-white" />
            </div>

            <div className="relative z-10 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-blue-600/20">
                    Nível de Proficiência {user.level}
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-black text-white mt-6 tracking-tight flex items-center gap-4">
                    {currentLevelInfo.medal} {currentLevelInfo.title}
                  </h3>
                  <p className="text-slate-400 mt-4 leading-relaxed max-w-md text-lg italic opacity-80">
                    "{currentLevelInfo.message}"
                  </p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl min-w-[200px]">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <ShieldCheck size={14} className="text-blue-500" /> Competências Ativas
                   </h4>
                   <ul className="space-y-3">
                     {currentLevelInfo.features.map((f, i) => (
                       <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> {f}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-slate-500">Progresso para {nextLevelInfo ? nextLevelInfo.title : 'Nível Máximo'}</span>
                  <span className="text-blue-500">{Math.round(progressPercent)}% Concluído</span>
                </div>
                <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {nextLevelInfo && (
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Início: {currentLevelXp} XP</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                      Faltam {nextLevelXp - user.xp} XP para promoção
                    </p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Meta: {nextLevelXp} XP</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3 px-2">
               <TrendingUp size={22} className="text-blue-500" /> Como impulsionar sua carreira?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {actions.map((action, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] flex items-center gap-5 group cursor-pointer hover:border-blue-500/50 transition-all hover:bg-slate-800/40 active:scale-95 shadow-lg">
                  <div className={`w-14 h-14 ${action.bg} rounded-2xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform shadow-inner`}>
                    <action.icon size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white leading-tight mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{action.label}</p>
                    <div className="flex items-center gap-1.5">
                      <Zap size={12} className="text-amber-500 fill-amber-500" />
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{action.xp}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Hierarchy Overview */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                 <ShieldCheck size={24} />
               </div>
               <h3 className="text-lg font-bold text-white tracking-tight">Cargos Técnicos</h3>
             </div>

             <div className="space-y-4 relative">
                {/* Timeline Line */}
                <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-slate-800"></div>
                
                {levelsList.map((l) => (
                  <div 
                    key={l.level} 
                    className={`relative flex items-center gap-5 p-4 rounded-3xl border transition-all ${
                      user.level === l.level 
                        ? 'bg-blue-600/10 border-blue-500/30 shadow-lg shadow-blue-900/10' 
                        : user.level > l.level 
                          ? 'bg-slate-950/50 border-emerald-500/10 grayscale-[0.5] opacity-60' 
                          : 'bg-slate-950/30 border-slate-800 opacity-40 grayscale'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-xl z-10 shadow-md ${
                      user.level === l.level ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {l.medal}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white tracking-widest uppercase flex items-center gap-2">
                        {l.title} 
                        {user.level === l.level && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{l.minXp} XP Mínimo</p>
                    </div>
                    {user.level > l.level && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      </div>
                    )}
                  </div>
                ))}
             </div>

             <div className="mt-8 p-6 bg-slate-950/50 border border-slate-800 rounded-3xl flex gap-4 items-start">
               <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
               <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                 Seu nível técnico é exibido publicamente no fórum e em todos os relatórios gerados por você, conferindo credibilidade às suas inspeções.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLevel;
