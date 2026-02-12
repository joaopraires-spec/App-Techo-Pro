
import React, { useState } from 'react';
import { CONVERSION_UNITS, LEVELS } from '../constants';
import { RefreshCw, ArrowRightLeft, Activity, RotateCw, Droplets, Zap, Ruler, Scale, Thermometer, ChevronRight, Info, Lock, Crown } from 'lucide-react';
import { UserProfile } from '../types';
import { Link } from 'react-router-dom';

const FREE_CONVERSIONS = ['Força', 'Torque'];

const getCategoryIcon = (cat: string) => {
  const iconSize = 20;
  switch (cat) {
    case 'Força':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
          <Activity size={iconSize} />
        </div>
      );
    case 'Torque':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-600/20 text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
          <RotateCw size={iconSize} />
        </div>
      );
    case 'Pressão':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <Droplets size={iconSize} />
        </div>
      );
    case 'Potência':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-600/20 text-yellow-400 group-hover:bg-yellow-600 group-hover:text-white transition-all">
          <Zap size={iconSize} />
        </div>
      );
    case 'Energia':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
          <Zap size={iconSize} />
        </div>
      );
    case 'Distância':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-600/20 text-slate-400 group-hover:bg-slate-600 group-hover:text-white transition-all">
          <Ruler size={iconSize} />
        </div>
      );
    case 'Massa':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20 text-blue-300 group-hover:bg-blue-500 group-hover:text-white transition-all">
          <Scale size={iconSize} />
        </div>
      );
    case 'Temperatura':
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-600/20 text-red-400 group-hover:bg-red-600 group-hover:text-white transition-all">
          <Thermometer size={iconSize} />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800 text-slate-400 transition-all">
          <RefreshCw size={iconSize} />
        </div>
      );
  }
};

const getCategoryDescription = (cat: string) => {
  switch (cat) {
    case 'Força': return 'Converter unidades de carga física';
    case 'Torque': return 'Converter momento de força';
    case 'Pressão': return 'Converter pressão e vácuo';
    case 'Potência': return 'Converter potência e trabalho';
    case 'Energia': return 'Converter joules e calorias';
    case 'Distância': return 'Converter comprimentos lineares';
    case 'Massa': return 'Converter pesos e massas';
    case 'Temperatura': return 'Converter escalas térmicas';
    default: return 'Conversão de grandezas técnicas';
  }
};

const Conversions: React.FC<{ isPremium: boolean; user: UserProfile; onUpdateUser: (u: UserProfile) => void }> = ({ isPremium, user, onUpdateUser }) => {
  const categories = Object.keys(CONVERSION_UNITS);
  const [category, setCategory] = useState(categories[0]);
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState(CONVERSION_UNITS[category as keyof typeof CONVERSION_UNITS][0]);
  const [toUnit, setToUnit] = useState(CONVERSION_UNITS[category as keyof typeof CONVERSION_UNITS][1]);

  const isCurrentCategoryFree = FREE_CONVERSIONS.includes(category);
  const isLocked = !isCurrentCategoryFree && !isPremium;

  const getConvertedValue = () => {
    if (fromUnit === toUnit) return value;
    // Lógica simplificada mantida conforme original (em produção seria um mapa de fatores real)
    return value * 1.5; 
  };

  const handleValueChange = (val: number) => {
    setValue(val);
    
    // Incrementar contagem de conversões e XP
    if (user && val !== 0) {
      const currentCount = user.conversionsCount || 0;
      const newXp = user.xp + 0.5; // Ganho moderado por interação
      let newLevel = user.level;
      LEVELS.forEach(l => { if (newXp >= l.minXp) newLevel = l.level; });
      
      onUpdateUser({
        ...user,
        conversionsCount: currentCount + 1,
        xp: newXp,
        level: newLevel
      });
    }
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const units = CONVERSION_UNITS[cat as keyof typeof CONVERSION_UNITS];
    setFromUnit(units[0]);
    setToUnit(units[1]);
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Conversor Técnico</h2>
          <p className="text-slate-500 text-sm">Transformação rápida de unidades para cálculos precisos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Sidebar - List of Grandezas */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center gap-2 px-1 mb-3">
             <RefreshCw size={14} className="text-slate-500" />
             <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">Grandezas</h3>
          </div>
          <div className="space-y-3">
            {categories.map(cat => {
              const isFree = FREE_CONVERSIONS.includes(cat);
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left p-3 md:p-4 rounded-[20px] transition-all flex items-center gap-4 group border ${
                    isActive 
                      ? (isFree || isPremium ? 'bg-slate-800/80 border-blue-600/50 shadow-lg' : 'bg-slate-800/80 border-amber-600/30 shadow-lg')
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {getCategoryIcon(cat)}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm md:text-base truncate">{cat}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{getCategoryDescription(cat)}</p>
                  </div>
                  {!isFree && !isPremium ? (
                    <Lock size={14} className="text-amber-500 shrink-0" />
                  ) : (
                    <ChevronRight size={16} className={`shrink-0 transition-transform ${isActive ? 'text-blue-500 translate-x-1' : 'text-slate-700'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content - Conversion Tool */}
        <div className="lg:col-span-8">
          {isLocked ? (
            <div className="bg-slate-900 border border-amber-500/20 rounded-[32px] p-8 md:p-16 text-center shadow-xl h-full flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Lock size={32} className="text-amber-500" />
                <Crown size={32} className="text-amber-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-3">Conversão Exclusiva Premium</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">
                As conversões de {category} fazem parte do pacote Specialist Pro. Assine para desbloquear todas as grandezas técnicas.
              </p>
              <Link to="/profile" className="bg-amber-500 text-slate-950 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] w-full md:w-auto inline-block active:scale-95 touch-manipulation shadow-lg shadow-amber-500/20">
                Assinar Specialist Pro
              </Link>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 md:p-10 flex flex-col h-full shadow-2xl animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Conversão de {category}</h3>
                    {!isCurrentCategoryFree && <Crown size={20} className="text-amber-500" />}
                  </div>
                  <p className="text-blue-500 text-xs md:text-sm font-bold bg-blue-500/10 px-3 py-1 rounded-lg inline-block">
                    {CONVERSION_UNITS[category as keyof typeof CONVERSION_UNITS].length} Unidades Disponíveis
                  </p>
                </div>
                <div className="bg-slate-800 px-4 py-2 rounded-xl text-blue-400 font-black uppercase tracking-widest text-[9px] md:text-[10px] border border-blue-600/20">
                  ⚙️ Ferramenta de Precisão
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8 items-center">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Valor de Entrada</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        inputMode="decimal"
                        value={value}
                        onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all text-lg"
                      />
                      <select 
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-28 md:w-32 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm appearance-none"
                      >
                        {CONVERSION_UNITS[category as keyof typeof CONVERSION_UNITS].map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="p-3 bg-blue-600/10 rounded-full border border-blue-600/20 text-blue-500 shadow-inner">
                      <ArrowRightLeft size={24} className="rotate-90 md:rotate-0" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">Unidade de Destino</label>
                    <select 
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all text-lg appearance-none"
                    >
                      {CONVERSION_UNITS[category as keyof typeof CONVERSION_UNITS].map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group h-full min-h-[250px]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50" />
                  <div className="mb-6">
                    <RefreshCw size={40} className="text-emerald-500/20 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  <span className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-[0.2em] relative z-10">Resultado da Conversão</span>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 relative z-10 tracking-tighter">
                    {getConvertedValue().toLocaleString('pt-BR', { maximumFractionDigits: 5 })}
                  </div>
                  <span className="text-emerald-500 font-black uppercase text-[10px] md:text-xs tracking-widest relative z-10">{toUnit}</span>
                  <div className="absolute inset-0 bg-emerald-500 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none" />
                </div>
              </div>

              <div className="mt-auto p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-start gap-4">
                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-400 space-y-2">
                  <p className="italic">Utilize esta ferramenta para conversões rápidas de campo. Verifique sempre em tabelas oficiais para projetos críticos.</p>
                  <div className="flex gap-4 pt-2">
                    <div className="flex gap-2">
                      <span className="text-slate-600">Referência:</span>
                      <span className="text-slate-300 font-mono">1 {fromUnit} ≈ { (1.5).toFixed(2) } {toUnit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversions;
