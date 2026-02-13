
import React from 'react';
import { UserProfile } from '../types';
import { LEVELS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Zap, BookOpen, Calculator, MessageSquare, CheckSquare, 
  Target, ChevronRight, Info, ShieldCheck, Trophy, TrendingUp, 
  CheckCircle2, Medal, Star, Flame, RefreshCw, FileText,
  Lock, Layout
} from 'lucide-react';

const AchievementCard = ({ icon: Icon, title, description, isUnlocked, colorClass }: any) => (
  <div className={`relative p-5 rounded-3xl border transition-all duration-500 overflow-hidden ${
    isUnlocked 
      ? `bg-slate-900 border-slate-700/50 shadow-lg ${colorClass}` 
      : 'bg-slate-950/40 border-slate-800 grayscale opacity-40'
  }`}>
    <div className="flex items-center gap-4 relative z-10">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
        isUnlocked ? 'bg-white/10' : 'bg-slate-900'
      }`}>
        {isUnlocked ? <Icon size={24} /> : <Lock size={20} className="text-slate-700" />}
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-black text-white uppercase tracking-tighter">{title}</h4>
        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 leading-tight">{description}</p>
      </div>
      {isUnlocked && <CheckCircle2 size={16} className="text-emerald-500 absolute top-0 right-0" />}
    </div>
    {isUnlocked && <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />}
  </div>
);

const ProfessionalLevel: React.FC<{ user: UserProfile }> = ({ user }) => {
  const navigate = useNavigate();
  const currentLevelInfo = LEVELS.find(l => l.level === user.level) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.level === user.level + 1);
  
  const currentLevelXp = currentLevelInfo.minXp;
  const nextLevelXp = nextLevelInfo ? nextLevelInfo.minXp : user.xp;
  
  const xpInLevel = user.xp - currentLevelXp;
  const xpNeededForNext = nextLevelXp - currentLevelXp;
  const progressPercent = nextLevelInfo ? Math.min(100, (xpInLevel / Math.max(1, xpNeededForNext)) * 100) : 100;

  // Lógica de Conquistas Reais
  const achievements = [
    {
      id: 'first-read',
      icon: BookOpen,
      title: 'Iniciante Técnico',
      description: 'Realizou a primeira leitura técnica',
      isUnlocked: user.readArticlesIds.length > 0,
      colorClass: 'text-blue-400 group-hover:shadow-blue-900/20'
    },
    {
      id: 'inspector-verified',
      icon: CheckSquare,
      title: 'Inspetor de Campo',
      description: 'Completou o primeiro checklist',
      isUnlocked: (user.checklistsCount || 0) > 0,
      colorClass: 'text-emerald-400'
    },
    {
      id: 'math-precision',
      icon: Calculator,
      title: 'Mestre dos Cálculos',
      description: 'Executou mais de 10 dimensionamentos',
      isUnlocked: (user.calculationsCount || 0) >= 10,
      colorClass: 'text-amber-400'
    },
    {
      id: 'fluent-converter',
      icon: RefreshCw,
      title: 'Conversor Fluente',
      description: 'Realizou 5 conversões de unidades',
      isUnlocked: (user.conversionsCount || 0) >= 5,
      colorClass: 'text-cyan-400'
    },
    {
      id: 'active-member',
      icon: MessageSquare,
      title: 'Voz da Comunidade',
      description: 'XP superior a 500 no fórum',
      isUnlocked: user.xp >= 500,
      colorClass: 'text-indigo-400'
    },
    {
      id: 'streak-week',
      icon: Flame,
      title: 'Alta Disponibilidade',
      description: 'Manteve ofensiva de 7 dias',
      isUnlocked: user.readingGoals.streak >= 7,
      colorClass: 'text-orange-400'
    }
  ];

  const actionButtons = [
    { icon: CheckSquare, label: 'Finalize um checklist de inspeção', xp: '+150 XP', color: 'text-emerald-500', bg: 'bg-emerald-500/10', to: '/checklists' },
    { icon: MessageSquare, label: 'Participe de discussões no fórum', xp: '+100 XP', color: 'text-blue-500', bg: 'bg-blue-500/10', to: '/forum' },
    { icon: BookOpen, label: 'Leia novos artigos técnicos', xp: '+50 XP', color: 'text-violet-500', bg: 'bg-violet-500/10', to: '/library' },
    { icon: Calculator, label: 'Utilize calculadoras de campo', xp: '+20 XP', color: 'text-amber-500', bg: 'bg-amber-500/10', to: '/calculators' },
  ];

  const levelsList = [...LEVELS].reverse();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* 1. Header de Carreira */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <span className="bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md shadow-lg shadow-blue-900/20">Progresso Operacional</span>
             <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest font-mono">Dossier: {user.name.split(' ')[0]}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter flex items-center gap-3">
            Evolução de <span className="text-blue-500">Especialista</span>
          </h2>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-[32px] px-8 py-5 flex items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
          <div className="text-right">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Score Técnico</p>
            <p className="text-2xl font-black text-white">{user.xp} <span className="text-blue-500 text-xs">XP</span></p>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="flex flex-col">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Patente Atual</p>
            <p className="text-xl font-black text-white flex items-center gap-2 tracking-tighter">
              {currentLevelInfo.medal} {currentLevelInfo.title}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-10">
          {/* 2. Barra de Progressão de Nível */}
          <div className="bg-[#111827] border border-slate-800 rounded-[40px] p-8 sm:p-10 relative overflow-hidden shadow-2xl group">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/5 blur-[120px] pointer-events-none group-hover:bg-blue-600/10 transition-all duration-1000" />
            <div className="relative z-10 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="space-y-4">
                  <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
                    {currentLevelInfo.medal} {currentLevelInfo.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed max-w-sm text-lg italic opacity-80 border-l-2 border-slate-800 pl-4">
                    "{currentLevelInfo.message}"
                  </p>
                </div>
                <div className="bg-slate-950/60 backdrop-blur-md p-6 rounded-[32px] border border-slate-800/50 shadow-inner min-w-[220px]">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <ShieldCheck size={14} className="text-blue-500" /> Atribuições Ativas
                   </h4>
                   <ul className="space-y-2.5">
                     {currentLevelInfo.features.map((f, i) => (
                       <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-300">
                         <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div> {f}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">Status da Promoção: {nextLevelInfo ? nextLevelInfo.title : 'Especialista Máximo'}</span>
                  <span className="text-blue-500">{Math.round(progressPercent)}% de Aptidão</span>
                </div>
                <div className="w-full bg-slate-950 h-5 rounded-full overflow-hidden border border-slate-800 p-1 shadow-inner relative">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {nextLevelInfo && (
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Patamar: {currentLevelXp} XP</p>
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] bg-blue-500/5 px-4 py-1.5 rounded-full border border-blue-500/10">
                      Faltam {nextLevelXp - user.xp} XP para subir de nível
                    </p>
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Objetivo: {nextLevelXp} XP</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. NOVO: QUADRO DE CONQUISTAS (Achievements) */}
          <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">
                   <Medal size={24} className="text-amber-500" /> Conquistas de Campo
                </h3>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                   {achievements.filter(a => a.isUnlocked).length} / {achievements.length} Desbloqueadas
                </span>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((ach) => (
                  <AchievementCard key={ach.id} {...ach} />
                ))}
             </div>
          </div>

          {/* 4. Botões de Impulso de Carreira (Funcionais) */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-3 px-2 tracking-tight">
               <TrendingUp size={22} className="text-blue-500" /> Ações de Impulso Profissional
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {actionButtons.map((action, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(action.to)}
                  className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] flex items-center gap-5 group cursor-pointer hover:border-blue-500/50 transition-all hover:bg-slate-800/40 active:scale-95 shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 blur-xl pointer-events-none" />
                  <div className={`w-14 h-14 ${action.bg} rounded-2xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform shadow-inner border border-white/5`}>
                    <action.icon size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white leading-tight mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{action.label}</p>
                    <div className="flex items-center gap-1.5">
                      <Zap size={12} className="text-amber-500 fill-amber-500" />
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{action.xp}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Hierarquia Industrial (Sidebar) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-[40px] p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm sticky top-10">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner">
                 <ShieldCheck size={24} />
               </div>
               <h3 className="text-lg font-black text-white uppercase tracking-tighter">Ranking Industrial</h3>
             </div>

             <div className="space-y-4 relative">
                <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-slate-800/50"></div>
                
                {levelsList.map((l) => (
                  <div 
                    key={l.level} 
                    className={`relative flex items-center gap-5 p-4 rounded-[24px] border transition-all duration-500 ${
                      user.level === l.level 
                        ? 'bg-blue-600/10 border-blue-500/30 shadow-2xl shadow-blue-900/10 scale-[1.05] z-20' 
                        : user.level > l.level 
                          ? 'bg-slate-950/50 border-emerald-500/10 grayscale-[0.5] opacity-60' 
                          : 'bg-slate-950/30 border-slate-800 opacity-40 grayscale'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl z-10 shadow-lg ${
                      user.level === l.level ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {l.medal}
                    </div>
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${user.level === l.level ? 'text-white' : 'text-slate-500'}`}>
                        {l.title} 
                        {user.level === l.level && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>}
                      </h4>
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-0.5">{l.minXp} XP Mínimo</p>
                    </div>
                    {user.level > l.level && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 size={16} className="text-emerald-500/60" />
                      </div>
                    )}
                  </div>
                ))}
             </div>

             <div className="mt-8 p-6 bg-slate-950 border border-slate-800 rounded-3xl flex gap-4 items-start shadow-inner">
               <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
               <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest opacity-80">
                 Seu ranking técnico reflete sua autoridade em auditorias e fóruns. Subir de nível libera ferramentas de dimensionamento avançado.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLevel;
