
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
// Fixing react-router-dom imports to ensure all members are correctly exported
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Clock, BookOpen, Star, ArrowRight, CheckSquare, Calculator as CalcIcon, MessageSquare, Award, X } from 'lucide-react';
import { getDailyTip } from '../services/gemini';

const StatCard = ({ icon: Icon, label, value, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-slate-900 border border-slate-800 p-6 rounded-3xl cursor-pointer hover:border-blue-500/50 transition-all group active:scale-95"
  >
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg`}>
      <Icon size={24} className="text-white" />
    </div>
    <p className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors">{label}</p>
    <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">{value}</h3>
  </div>
);

const Dashboard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const navigate = useNavigate();
  const [tip, setTip] = useState("Carregando dica técnica do dia...");
  const [isTipVisible, setIsTipVisible] = useState(true);

  useEffect(() => {
    getDailyTip(user.area).then(setTip);
  }, [user.area]);

  const progress = (user.readingGoals.currentMinutesToday / user.readingGoals.dailyMinutes) * 100;

  const handleTipClick = () => {
    // Redireciona para um artigo técnico relevante (simulado)
    navigate('/library');
  };

  const handleCloseTip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTipVisible(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard Operacional</h2>
          <p className="text-slate-400">Visão geral do seu progresso técnico e atividades.</p>
        </div>
        <div className="text-sm font-medium text-slate-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          Último acesso: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Daily Tip - Gemini Powered */}
      {isTipVisible && (
        <div 
          onClick={handleTipClick}
          className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-800/50 p-6 rounded-3xl relative overflow-hidden group cursor-pointer transition-all hover:shadow-2xl hover:shadow-blue-900/10 active:scale-[0.99]"
        >
          <button 
            onClick={handleCloseTip}
            className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all z-20"
            title="Fechar dica"
          >
            <X size={16} />
          </button>

          <div className="relative z-10 pr-12">
            <div className="flex items-center gap-2 text-blue-400 mb-2 font-bold text-sm uppercase tracking-widest">
              <Star size={14} className="fill-blue-400" /> Dica Técnica de Hoje
            </div>
            <p className="text-lg text-slate-100 italic leading-relaxed">"{tip}"</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Clock size={12} /> Sugerido com base em sua área: {user.area} • Clique para ver o artigo completo
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-700" />
        </div>
      )}

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Clock} 
          label="Meta de Leitura Diária" 
          value={`${user.readingGoals.currentMinutesToday}/${user.readingGoals.dailyMinutes} min`} 
          color="bg-blue-600"
          onClick={() => navigate('/library')}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Ofensiva de Estudos" 
          value={`${user.readingGoals.streak} Dias`} 
          color="bg-emerald-600"
          onClick={() => navigate('/analytics')}
        />
        <StatCard 
          icon={BookOpen} 
          label="Artigos Lidos" 
          value="12" 
          color="bg-violet-600"
          onClick={() => navigate('/history')}
        />
        <StatCard 
          icon={Award} 
          label="Nível Profissional" 
          value={`Especialista ${6 - user.level}`} 
          color="bg-amber-600"
          onClick={() => navigate('/level')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reading Progress */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Progresso de Capacitação</h3>
            <span className="text-blue-500 font-bold">{Math.round(progress)}% Concluído</span>
          </div>
          
          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-10">
            <div 
              className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => navigate('/library')}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between group cursor-pointer hover:border-blue-500 transition-all"
            >
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Próxima Trilha</p>
                <p className="text-sm font-bold text-white">Conceitos de Pressão II</p>
              </div>
              <ArrowRight size={18} className="text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
            <div 
              onClick={() => navigate('/level')}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between group cursor-pointer hover:border-blue-500 transition-all"
            >
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Evolução Técnica</p>
                <p className="text-sm font-bold text-white">Ver Nível Profissional</p>
              </div>
              <Award size={18} className="text-slate-600 group-hover:text-blue-500 transition-all" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-6">Ações Rápidas</h3>
          <div className="space-y-3">
            <Link to="/checklists" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-3">
              <CheckSquare size={20} /> Iniciar Checklist
            </Link>
            <Link to="/calculators" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-3">
              <CalcIcon size={20} /> Nova Calculadora
            </Link>
            <Link to="/forum" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-3">
              <MessageSquare size={20} /> Abrir Fórum
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
