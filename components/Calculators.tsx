
import React, { useState, useEffect } from 'react';
import { CALCULATORS, LEVELS } from '../constants';
import { Lock, Calculator as CalcIcon, Info, ChevronRight, Crown, Droplets, Zap, Activity, Cylinder, RotateCw, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../types';

const SimulationDisplay: React.FC<{ calcId: string; inputs: Record<string, number> }> = ({ calcId, inputs }) => {
  const renderSimulation = () => {
    switch (calcId) {
      case 'h-press':
        const pressureScale = Math.min(2, Math.max(0.2, (inputs.force / inputs.area) / 10000));
        return (
          <div className="flex flex-col items-center justify-center h-24 w-full">
            <div className="w-16 h-4 bg-slate-700 rounded-t-lg relative overflow-hidden">
               <div className="absolute inset-0 bg-blue-600/30 animate-pulse"></div>
            </div>
            <div className="w-16 h-12 border-x-2 border-b-2 border-slate-700 relative flex items-end">
               <div 
                 className="w-full bg-blue-500/40 transition-all duration-500" 
                 style={{ height: `${Math.min(100, pressureScale * 40)}%` }}
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-bounce"><ChevronRight size={20} className="rotate-90 text-blue-400" /></div>
               </div>
            </div>
          </div>
        );
      case 'mag-force':
        const magForce = inputs.b * inputs.i * inputs.l;
        return (
          <div className="flex flex-col items-center justify-center h-24 w-full overflow-hidden">
            <div className="relative w-32 h-1 bg-slate-700">
               <div 
                 className="absolute top-[-10px] left-0 h-6 w-1.5 bg-purple-500 transition-all duration-500"
                 style={{ transform: `translateX(${Math.sin(Date.now() / 200) * 40 + 60}px)` }}
               />
               <div className="absolute inset-0 flex justify-between px-2 text-[8px] text-purple-400 font-bold opacity-30 uppercase tracking-widest">
                  <span>N</span><span>S</span>
               </div>
            </div>
            <div className="mt-4 text-[8px] font-black text-purple-500 uppercase animate-pulse">Fluxo Magnético Ativo</div>
          </div>
        );
      case 'flow-rate':
        const flowSpeed = Math.min(5, Math.max(0.5, inputs.v / inputs.t));
        return (
          <div className="flex items-center justify-center h-24 w-full">
            <div className="w-32 h-6 border-y-2 border-slate-700 relative overflow-hidden rounded-lg">
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
          <div className="flex items-center justify-center h-24 w-full px-4">
            <div className="w-16 h-10 bg-slate-800 border-2 border-slate-700 rounded-lg relative z-10" />
            <div 
              className="h-4 bg-slate-600 rounded-r-lg transition-all duration-500 border-y border-r border-slate-500"
              style={{ width: `${ext}%`, maxWidth: '100px' }}
            />
            <div className="ml-2 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          </div>
        );
      case 'torque':
        const tVal = inputs.f * inputs.d;
        return (
          <div className="flex items-center justify-center h-24 w-full">
            <div className="relative w-16 h-16">
               <div className="absolute inset-0 border-4 border-dashed border-orange-500/20 rounded-full animate-spin" style={{ animationDuration: `${10/Math.max(1, tVal/10)}s` }} />
               <div className="absolute inset-0 flex items-center justify-center">
                  <RotateCw size={32} className="text-orange-500 opacity-60" />
               </div>
            </div>
          </div>
        );
      case 'pot-mec':
        return (
          <div className="flex items-center justify-center h-24 w-full">
            <div className="relative">
               <Zap size={40} className="text-yellow-500 animate-pulse" />
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
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white`}>
          <Droplets size={iconSize} />
        </div>
      );
    case 'mag-force':
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white`}>
          <Activity size={iconSize} />
        </div>
      );
    case 'flow-rate':
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-600/20 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white`}>
          <Waves size={iconSize} />
        </div>
      );
    case 'cyl-force':
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20 text-blue-300 group-hover:bg-blue-500 group-hover:text-white`}>
          <Cylinder size={iconSize} />
        </div>
      );
    case 'torque':
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-orange-600/20 text-orange-400 group-hover:bg-orange-600 group-hover:text-white`}>
          <RotateCw size={iconSize} />
        </div>
      );
    case 'pot-mec':
      return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-600/20 text-yellow-400 group-hover:bg-yellow-600 group-hover:text-white`}>
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
    
    // Incrementar contagem de cálculos (throttle para não inundar o storage)
    if (user && newVal !== 0) {
      const currentCount = user.calculationsCount || 0;
      const newXp = user.xp + 1; // Pequeno ganho de XP por interação
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
               <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">Gratuitas</h3>
            </div>
            <div className="space-y-3">
              {freeCalcs.map(calc => (
                <button
                  key={calc.id}
                  onClick={() => {
                    setActiveCalc(calc);
                    setInputs(calc.inputs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.defaultValue }), {}));
                  }}
                  className={`w-full text-left p-3 md:p-4 rounded-[20px] transition-all flex items-center gap-4 group border ${
                    activeCalc.id === calc.id 
                      ? 'bg-slate-800/80 border-blue-600/50 shadow-lg' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {getCalcIcon(calc.id, activeCalc.id === calc.id)}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm md:text-base truncate">{calc.name}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mb-1">{calc.description}</p>
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
               <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">Premium</h3>
            </div>
            <div className="space-y-3">
              {premiumCalcs.map(calc => (
                <button
                  key={calc.id}
                  onClick={() => {
                    setActiveCalc(calc);
                    setInputs(calc.inputs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.defaultValue }), {}));
                  }}
                  className={`w-full text-left p-3 md:p-4 rounded-[20px] transition-all flex items-center gap-4 group border ${
                    activeCalc.id === calc.id 
                      ? 'bg-slate-800/80 border-amber-600/30 shadow-lg' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {getCalcIcon(calc.id, activeCalc.id === calc.id)}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm md:text-base truncate">{calc.name}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mb-1">{calc.description}</p>
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
            <div className="bg-slate-900 border border-amber-500/20 rounded-[32px] p-8 md:p-16 text-center shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Lock size={32} className="text-amber-500" />
                <Crown size={32} className="text-amber-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-3">Cálculo Avançado</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">Esta ferramenta avançada de dimensionamento requer assinatura Premium.</p>
              <Link to="/profile" className="bg-amber-500 text-slate-950 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] w-full md:w-auto inline-block active:scale-95 touch-manipulation">Liberar Agora</Link>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 md:p-10 flex flex-col h-full shadow-2xl">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl md:text-2xl font-bold text-white">{activeCalc.name}</h3>
                    {activeCalc.isPremium && <Crown size={20} className="text-amber-500" />}
                  </div>
                  <p className="text-blue-500 font-mono text-xs md:text-sm font-bold bg-blue-500/10 px-3 py-1 rounded-lg inline-block">Fórmula: {activeCalc.formula}</p>
                </div>
                <div className="order-1 md:order-2 self-end md:self-auto bg-slate-800 px-4 py-2 rounded-xl text-blue-400 font-black uppercase tracking-widest text-[9px] md:text-[10px] border border-blue-600/20">
                  {activeCalc.illustration}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8 items-center">
                <div className="space-y-5">
                  {activeCalc.inputs.map(input => (
                    <div key={input.key}>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">{input.label} ({input.unit})</label>
                      <input 
                        type="number" 
                        inputMode="decimal"
                        value={inputs[input.key]}
                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all text-lg"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-600/50" />
                  
                  {/* Visual Simulation Component */}
                  <SimulationDisplay calcId={activeCalc.id} inputs={inputs} />

                  <span className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-[0.2em] relative z-10">Resultado Final</span>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 relative z-10 tracking-tighter">
                    {calculateResult().toLocaleString('pt-BR', { maximumFractionDigits: 4 })}
                  </div>
                  <span className="text-blue-500 font-black uppercase text-[10px] md:text-xs tracking-widest relative z-10">{activeCalc.resultUnit}</span>
                  <div className="absolute inset-0 bg-blue-600 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none" />
                </div>
              </div>

              <div className="mt-auto p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-start gap-4">
                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 italic leading-relaxed">{activeCalc.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculators;
