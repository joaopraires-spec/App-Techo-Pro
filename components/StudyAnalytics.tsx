
import React, { useState } from 'react';
import { BarChart3, Calendar, TrendingUp, BookOpen, Clock, ChevronDown } from 'lucide-react';

const StudyAnalytics: React.FC = () => {
  const [filter, setFilter] = useState<'weekly' | 'monthly'>('weekly');

  const data = filter === 'weekly' 
    ? [
        { day: 'Seg', val: 45 }, { day: 'Ter', val: 30 }, { day: 'Qua', val: 60 },
        { day: 'Qui', val: 15 }, { day: 'Sex', val: 20 }, { day: 'Sáb', val: 50 }, { day: 'Dom', val: 10 }
      ]
    : [
        { day: 'Sem 1', val: 180 }, { day: 'Sem 2', val: 240 }, 
        { day: 'Sem 3', val: 150 }, { day: 'Sem 4', val: 310 }
      ];

  const maxVal = Math.max(...data.map(d => d.val));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="text-emerald-500" size={32} /> Ofensiva de Estudo
          </h2>
          <p className="text-slate-500 text-sm mt-1">Indicadores de engajamento e leitura técnica.</p>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button 
            onClick={() => setFilter('weekly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'weekly' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Semanal
          </button>
          <button 
            onClick={() => setFilter('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Mensal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total de Leitura</p>
          <h4 className="text-3xl font-black text-white">4.2h</h4>
          <p className="text-emerald-500 text-xs mt-2 flex items-center gap-1"><TrendingUp size={12} /> +12% que semana anterior</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Artigos Concluídos</p>
          <h4 className="text-3xl font-black text-white">12</h4>
          <p className="text-slate-500 text-xs mt-2">Média de 1.7 p/ dia</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Ofensiva Atual</p>
          <h4 className="text-3xl font-black text-white">5 Dias</h4>
          <p className="text-amber-500 text-xs mt-2">Recorde: 14 Dias</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar size={20} className="text-blue-500" /> Histórico de Minutos Lidos
          </h3>
          <span className="text-xs text-slate-500 font-medium">Unidade: Minutos</span>
        </div>

        <div className="flex items-end justify-between h-64 gap-2 md:gap-4 px-4 border-b border-slate-800 pb-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center group">
              <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded border border-slate-700">
                {item.val}m
              </div>
              <div 
                className={`w-full rounded-t-lg transition-all duration-700 bg-gradient-to-t from-blue-900 to-blue-500 group-hover:to-blue-400 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]`}
                style={{ height: `${(item.val / maxVal) * 100}%` }}
              />
              <span className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-600/5 border border-blue-600/20 p-8 rounded-3xl">
        <h3 className="text-lg font-bold text-white mb-4">Meta Profissional Semanal</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">Seu engajamento técnico impacta diretamente no seu nível profissional. Continue lendo pelo menos 30 minutos por dia para manter sua ofensiva.</p>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-[65%]" />
        </div>
        <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-widest">
           <span className="text-slate-500">Progresso: 156/210 min</span>
           <span className="text-blue-500">Faltam 54 min</span>
        </div>
      </div>
    </div>
  );
};

export default StudyAnalytics;
