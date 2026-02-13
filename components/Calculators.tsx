
import React, { useState, useEffect } from 'react';
import { CALCULATORS, LEVELS } from '../constants';
import { Lock, Calculator as CalcIcon, Info, ChevronRight, Crown, Droplets, Zap, Activity, Cylinder, RotateCw, Waves, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../types';

const SimulationDisplay: React.FC<{ calcId: string; inputs: Record<string, number> }> = ({ calcId, inputs }) => {
  const renderSimulation = () => {
    switch (calcId) {
      case 'h-press':
        const pressureScale = Math.min(2, Math.max(0.2, (inputs.force / inputs.area) / 10000));
        return (
          <div className="flex flex-col items-center justify-center h-20 sm:h-24 w-full">
            <div className="w-14 sm:w-16 h-4 bg-slate-700 rounded-t-lg relative overflow-hidden">
               <div className="absolute inset-0 bg-blue-600/30 animate-pulse"></div>
            </div>
            <div className="w-14 sm:w-16 h-10 sm:h-12 border-x-2 border-b-2 border-slate-700 relative flex items-end">
               <div 
                 className="w-full bg-blue-500/40 transition-all duration-500" 
                 style={{ height: `${Math.min(100, pressureScale * 40)}%` }}
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-bounce"><ChevronRight size={18} className="rotate-90 text-blue-400" /></div>
               </div>
            </div>
          </div>
        );
      case 'mag-force':
        return (
          <div className="flex flex-col items-center justify-center h-20 sm:h-24 w-full overflow-hidden">
            <div className="relative w-28 sm:w-32 h-1 bg-slate-700">
               <div 
                 className="absolute top-[-10px] left-0 h-6 w-1.5 bg-purple-500 transition-all duration-500"
                 style={{ transform: `translateX(${Math.sin(Date.now() / 200) * 40 + 60}px)` }}
               />
               <div className="absolute inset-0 flex justify-between px-2 text-[8px] text-purple-400 font-bold opacity-30 uppercase tracking-widest">
                  <span>N</span><span>S</span>
               </div>
            </div>
            <div className="mt-3 text-[8px] font-black text-purple-500 uppercase animate-pulse">Fluxo Magnético</div>
          </div>
        );
      case 'flow-rate':
        const flowSpeed = Math.min(5, Math.max(0.5, inputs.v / inputs.t));
        return (
          <div className="flex items-center justify-center h-20 sm:h-24 w-full">
            <div className="w-28 sm:w-32 h-5 sm:h-6 border-y-2 border-slate-700 relative overflow-hidden rounded-lg">
               <div className="absolute inset-0 flex gap-4 animate-scroll-left" style={{ animationDuration: `${2/flowSpeed}s` }}>
                  {[1,2,3,4,5,6].map(i => <div key={i} className="h-full w-4 bg-cyan-500/30 skew-x-12 shrink-0" />)}
               </div>
            </div>
            <style>{`
              @keyframes scroll-left {
                from { transform: translateX(0); }
                to { transform: translateX(-40px); }
              }
              .animate-scroll-left { animation: scroll-left linear infinite; }
            `}</style>
          </div>
        );
      case 'cyl-force':
        const ext = Math.min(100, Math.max(10, (inputs.p * inputs.a) / 1000));
        return (
          <div className="flex items-center justify-center h-20 sm:h-24 w-full px-2 sm:px-4">
            <div className="w-14 sm:w-16 h-8 sm:h-10 bg-slate-800 border-2 border-slate-700 rounded-lg relative z-10" />
            <div 
              className="h-3 sm:h-4 bg-slate-600 rounded-r-lg transition-all duration-500 border-y border-r border-slate-500"
              style={{ width: `${ext}%`, maxWidth: '80px' }}
            />
            <div className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          </div>
        );
      case 'torque':
        const tVal = inputs.f * inputs.d;
        return (
          <div className="flex items-center justify-center h-20 sm:h-24 w-full">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
               <div className="absolute inset-0 border-4 border-dashed border-orange-500/20 rounded-full animate-spin" style={{ animationDuration: `${10/Math.max(1, tVal/10)}s` }} />
               <div className="absolute inset-0 flex items-center justify-center">
                  <RotateCw size={24} className="text-orange-500 opacity-60" />
               </div>
            </div>
          </div>
        );
      case 'pot-mec':
        return (
          <div className="flex items-center justify-center h-20 sm:h-24 w-full">
            <div className="relative">
               <Zap size={32} className="text-yellow-500 animate-pulse" />
               <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 animate-pulse" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-4 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
      {renderSimulation()}
    </div>
  );
};

const getCalcIcon = (id: string, active: boolean) => {
  const iconSize = 20;
  
  switch (id) {
    case 'h-press': 
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600/20 text-blue-400 ${active ? 'bg-blue-600 text-white' : 'group-hover:bg-blue-600 group-hover:text-white'}`}>
          <Droplets size={iconSize} />
        </div>
      );
    case 'mag-force':
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-purple-600/20 text-purple-400 ${active ? 'bg-purple-600 text-white' : 'group-hover:bg-purple-600 group-hover:text-white'}`}>
          <Activity size={iconSize} />
        </div>
      );
    case 'flow-rate':
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-600/20 text-cyan-400 ${active ? 'bg-cyan-600 text-white' : 'group-hover:bg-cyan-600 group-hover:text-white'}`}>
          <Waves size={iconSize} />
        </div>
      );
    case 'cyl-force':
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20 text-blue-300 ${active ? 'bg-blue-500 text-white' : 'group-hover:bg-blue-500 group-hover:text-white'}`}>
          <Cylinder size={iconSize} />
        </div>
      );
    case 'torque':
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-orange-600/20 text-orange-400 ${active ? 'bg-orange-600 text-white' : 'group-hover:bg-orange-600 group-hover:text-white'}`}>
          <RotateCw size={iconSize} />
        </div>
      );
    case 'pot-mec':
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-600/20 text-yellow-400 ${active ? 'bg-yellow-600 text-white' : 'group-hover:bg-yellow-600 group-hover:text-white'}`}>
          <Zap size={iconSize} />
        </div>
      );
    default:
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800 text-slate-400`}>
          <CalcIcon size={iconSize} />
        </div>
      );
  }
};

const Calculators: React.FC<{ isPremium: boolean; user: UserProfile; onUpdateUser: (u: UserProfile) => void }> = ({ isPremium, user, onUpdateUser }) => {
  const [activeCalc, setActiveCalc] = useState(CALCULATORS[0]);
  const [inputs, setInputs] = useState<Record<string, number>>(
    CALCULATORS[0].inputs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.defaultValue }), {})
  );

  const handleInputChange = (key: string, val: string) => {
    const newVal = parseFloat(val) || 0;
    setInputs(prev => ({ ...prev, [key]: newVal }));
    
    if (user && newVal !== 0) {
      const currentCount = user.calculationsCount || 0;
      const newXp = user.xp + 1;
      let newLevel = user.level;
      LEVELS.forEach(l => { if (newXp >= l.minXp) newLevel = l.level; });
      
      onUpdateUser({
        ...user,
        calculationsCount: currentCount + 1,
        xp: newXp,
        level: newLevel
      });
    }
  };

  const calculateResult = () => {
    switch (activeCalc.id) {
      case 'h-press': return inputs.force / inputs.area;
      case 'mag-force': return inputs.b * inputs.i * inputs.l;
      case 'flow-rate': return inputs.v / inputs.t;
      case 'cyl-force': return inputs.p * inputs.a;
      case 'torque': return inputs.f * inputs.d;
      case 'pot-mec': return inputs.w / inputs.t;
      default: return 0;
    }
  };

  const freeCalcs = CALCULATORS.filter(c => !c.isPremium);
  const premiumCalcs = CALCULATORS.filter(c => c.isPremium);

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Calculadoras Técnicas</h2>
          <p className="text-slate-500 text-sm">Dimensionamento rápido verificado.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-4 space-y-6">
          {/* Gratuitas Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1 mb-3">
               <CalcIcon size={14} className="text-slate-500" />
               <h3 className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Gratuitas</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {freeCalcs.map(calc => (
                <button
                  key={calc.id}
                  onClick={() => {
                    setActiveCalc(calc);
                    setInputs(calc.inputs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.defaultValue }), {}));
                  }}
                  className={`w-full text-left p-4 rounded-[24px] transition-all flex items-center gap-4 group border shadow-md active:scale-95 touch-manipulation ${
                    activeCalc.id === calc.id 
                      ? 'bg-slate-800 border-blue-600 shadow-blue-900/10' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {getCalcIcon(calc.id, activeCalc.id === calc.id)}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm md:text-base truncate">{calc.name}</p>
                    <p className="text-[9px] text-slate-500 line-clamp-1 mb-1 font-medium">{calc.description}</p>
                    <p className="text-[10px] font-mono text-blue-500 font-bold">{calc.formula}</p>
                  </div>
                  <ChevronRight size={16} className={`shrink-0 transition-transform ${activeCalc.id === calc.id ? 'text-blue-500 translate-x-1' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Premium Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
               <Crown size={14} className="text-amber-500" />
               <h3 className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Premium</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {premiumCalcs.map(calc => (
                <button
                  key={calc.id}
                  onClick={() => {
                    setActiveCalc(calc);
                    setInputs(calc.inputs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.defaultValue }), {}));
                  }}
                  className={`w-full text-left p-4 rounded-[24px] transition-all flex items-center gap-4 group border shadow-md active:scale-95 touch-manipulation ${
                    activeCalc.id === calc.id 
                      ? 'bg-slate-800 border-amber-600 shadow-amber-900/10' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {getCalcIcon(calc.id, activeCalc.id === calc.id)}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm md:text-base truncate">{calc.name}</p>
                    <p className="text-[9px] text-slate-500 line-clamp-1 mb-1 font-medium">{calc.description}</p>
                    <p className="text-[10px] font-mono text-blue-500 font-bold">{calc.formula}</p>
                  </div>
                  {!isPremium ? (
                    <Lock size={14} className="text-amber-500 shrink-0" />
                  ) : (
                    <ChevronRight size={16} className={`shrink-0 transition-transform ${activeCalc.id === calc.id ? 'text-blue-500 translate-x-1' : 'text-slate-700'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {activeCalc.isPremium && !isPremium ? (
            <div className="bg-slate-900 border border-amber-500/20 rounded-[32px] p-8 sm:p-12 md:p-16 text-center shadow-xl h-full flex flex-col justify-center items-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Lock size={32} className="text-amber-500" />
                <Crown size={32} className="text-amber-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-3">Cálculo Avançado</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">Esta ferramenta avançada de dimensionamento requer assinatura Premium para acesso total.</p>
              <Link to="/profile" className="bg-amber-500 text-slate-950 px-8 py-4.5 rounded-2xl font-black uppercase tracking-widest text-xs w-full sm:w-auto inline-block active:scale-95 shadow-lg shadow-amber-500/20">Liberar Agora</Link>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-5 sm:p-7 md:p-10 flex flex-col h-full shadow-2xl animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8 md:mb-10">
                <div className="order-2 sm:order-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">{activeCalc.name}</h3>
                    {activeCalc.isPremium && <Crown size={22} className="text-amber-500" />}
                  </div>
                  <p className="text-blue-500 font-mono text-xs font-bold bg-blue-600/10 border border-blue-600/20 px-4 py-1.5 rounded-full inline-block">
                    {activeCalc.formula}
                  </p>
                </div>
                <div className="order-1 sm:order-2 self-start sm:self-auto bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl text-blue-400 font-black uppercase tracking-[0.2em] text-[9px] border border-blue-600/20 shadow-lg">
                  {activeCalc.illustration}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-10 items-stretch">
                <div className="bg-slate-950/40 p-5 sm:p-6 md:p-8 rounded-[32px] border border-slate-800/50 space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings2 size={16} className="text-blue-500" />
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Variáveis de Entrada</h4>
                  </div>
                  {activeCalc.inputs.map(input => (
                    <div key={input.key} className="relative group/input">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">{input.label}</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          inputMode="decimal"
                          value={inputs[input.key]}
                          onChange={(e) => handleInputChange(input.key, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-5 pr-14 py-4 text-white font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all text-xl shadow-inner placeholder:text-slate-800"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 text-[9px] font-black text-blue-500 uppercase tracking-widest pointer-events-none group-focus-within/input:border-blue-600/50 transition-colors">
                          {input.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 border-2 border-slate-800/80 rounded-[40px] p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500" />
                  
                  <div className="mb-6 w-full">
                    <SimulationDisplay calcId={activeCalc.id} inputs={inputs} />
                  </div>

                  <span className="text-[9px] font-black text-slate-500 uppercase mb-3 tracking-[0.3em] relative z-10">Resultado Calculado</span>
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-3 relative z-10 tracking-tighter drop-shadow-2xl">
                    {calculateResult().toLocaleString('pt-BR', { maximumFractionDigits: 3 })}
                  </div>
                  <div className="bg-blue-600/10 border border-blue-600/30 px-5 py-2 rounded-full relative z-10">
                    <span className="text-blue-500 font-black uppercase text-xs tracking-[0.2em]">{activeCalc.resultUnit}</span>
                  </div>
                  
                  <div className="absolute inset-0 bg-blue-600 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none" />
                </div>
              </div>

              <div className="mt-auto p-5 bg-slate-800/30 rounded-2xl border border-slate-700/40 flex items-start gap-4 shadow-lg">
                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                  <Info size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest opacity-80">Nota Técnica</p>
                  <p className="text-[11px] text-slate-400 italic leading-relaxed">{activeCalc.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculators;
