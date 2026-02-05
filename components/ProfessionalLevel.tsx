
import React from 'react';
import { UserProfile } from '../types';
import { LEVELS } from '../constants';
import { Award, Zap, BookOpen, Calculator, MessageSquare, CheckSquare, Target, ChevronRight, Info } from 'lucide-react';

const ProfessionalLevel: React.FC<{ user: UserProfile }> = ({ user }) => {
  const currentLevelInfo = LEVELS.find(l => l.level === user.level) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.level === user.level + 1);
  
  const currentLevelXp = currentLevelInfo.minXp;
  const nextLevelXp = nextLevelInfo ? nextLevelInfo.minXp : user.xp;
  
  const xpInLevel = user.xp - currentLevelXp;
  const xpNeededForNext = nextLevelXp - currentLevelXp;
  const progressPercent = nextLevelInfo ? Math.min(100, (xpInLevel / xpNeededForNext) * 100) : 100;

  const badges = [
    { name: 'Leitor Voraz', desc: 'Leu 10 artigos técnicos', unlocked: user.xp > 500 },
    { name: 'Calculista', desc: 'Realizou 50 cálculos reais', unlocked: user.xp > 1500 },
    { name: 'Líder de Fórum', desc: 'Contribuiu com 20 respostas', unlocked: user.xp > 3500 },
    { name: 'Mestre Mantenedor', desc: 'Uso total da plataforma', unlocked: user.xp > 7000 },
  ];

  const actions = [
    { icon: BookOpen, label: 'Leia um novo artigo técnico', xp: '+50 XP', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Calculator, label: 'Utilize uma calculadora de campo', xp: '+20 XP', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: MessageSquare, label: 'Participe de uma discussão no fórum', xp: '+100 XP', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: CheckSquare, label: 'Finalize um checklist de inspeção', xp: '+150 XP', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Award className="text-blue-500" size={32} /> Nível Profissional
          </h2>
          <p className="text-slate-500 text-sm mt-1">Sua trajetória de especialização técnica no Tech Pro.</p>
        </div>
        <div className="bg-[#111827] border border-slate-800 rounded-xl px-5 py-3 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">XP Acumulado</p>
            <p className="text-lg font-black text-white">{user.xp} <span className="text-blue-500 text-xs font-bold">XP</span></p>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="flex flex-col items-center">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Nível</p>
            <p className="text-lg font-black text-blue-500">{user.level}</p>
          </div>
        </div>
      </div>

      {/* Main Status Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
          <Award size={240} className="text-white" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-6">
            <div>
              <span className="bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">Status: {currentLevelInfo.title}</span>
              <h3 className="text-4xl font-black text-white mt-4 tracking-tight">Nível {user.level}</h3>
              <p className="text-slate-400 mt-4 leading-relaxed max-w-md italic">
                "{currentLevelInfo.message}"
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-400">Progresso para o {nextLevelInfo ? `nível ${user.level + 1}` : 'nível máximo'}</span>
                <span className="text-blue-500">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {nextLevelInfo && (
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-right">Faltam {nextLevelXp - user.xp} XP</p>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> Vantagens do Nível {user.level}
            </h4>
            <ul className="space-y-3">
              {currentLevelInfo.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-slate-800">
               <p className="text-[10px] text-slate-500 italic">Suba de nível para desbloquear recursos avançados e maior autoridade na comunidade.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actions List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
             <Target size={20} className="text-blue-500" /> Como Subir de Nível?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((action, i) => (
              <div key={i} className="bg-[#111827] border border-slate-800 p-5 rounded-2xl flex items-center gap-4 group cursor-pointer hover:border-blue-500/50 transition-all">
                <div className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{action.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{action.xp}</p>
                </div>
                <ChevronRight size={16} className="text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Badges / Selos */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
             <Award size={20} className="text-amber-500" /> Selos Conquistados
          </h3>
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
            {badges.map((badge, i) => (
              <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border ${badge.unlocked ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-900/30 border-slate-800/50 grayscale opacity-40'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${badge.unlocked ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-600'}`}>
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{badge.name}</p>
                  <p className="text-[10px] text-slate-500">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-600/5 border border-blue-600/20 p-4 rounded-xl flex gap-3">
             <Info size={16} className="text-blue-400 shrink-0" />
             <p className="text-[10px] text-slate-500 leading-relaxed">Selos são exibidos no seu perfil público e garantem credibilidade nos fóruns de discussão.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLevel;
