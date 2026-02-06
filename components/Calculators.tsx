
import React, { useState } from 'react';
import { CALCULATORS } from '../constants';
import { Lock, Calculator as CalcIcon, Info, ChevronRight, Settings2, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Calculators: React.FC<{ isPremium: boolean }> = ({ isPremium }) => {
  const [activeCalc, setActiveCalc] = useState(CALCULATORS[0]);
  const [inputs, setInputs] = useState<Record<string, number>>(
    CALCULATORS[0].inputs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.defaultValue }), {})
  );

  const handleInputChange = (key: string, val: string) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));
  };

  const calculateResult = () => {
    switch (activeCalc.id) {
      case 'h-press': return inputs.force / inputs.area;
      case 'cyl-force': return (inputs.pressure * 100000) * (Math.PI * Math.pow(inputs.diameter/1000, 2) / 4) / 1000;
      case 'pot-mec': return (inputs.torque * inputs.rpm) / 9550;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Calculadoras Técnicas</h2>
          <p className="text-slate-500 text-sm">Dimensionamento rápido verificado.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-4 space-y-3 md:space-y-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2 px-1">Selecione o Cálculo</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {CALCULATORS.map(calc => (
              <button
                key={calc.id}
                onClick={() => {
                  setActiveCalc(calc);
                  setInputs(calc.inputs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.defaultValue }), {}));
                  window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll on mobile
                }}
                className={`w-full text-left p-4 md:p-5 rounded-2xl transition-all flex items-center justify-between border active:scale-95 touch-manipulation ${
                  activeCalc.id === calc.id 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-900/20' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm md:text-base">{calc.name}</p>
                    {calc.isPremium && <Crown size={12} className={activeCalc.id === calc.id ? 'text-blue-200' : 'text-amber-500'} />}
                  </div>
                  <p className={`text-[9px] md:text-[10px] uppercase font-black tracking-widest mt-0.5 ${activeCalc.id === calc.id ? 'text-blue-200' : 'text-slate-500'}`}>{calc.category}</p>
                </div>
                {calc.isPremium && !isPremium ? <Lock size={14} className="text-amber-500 shrink-0" /> : <ChevronRight size={16} className="shrink-0" />}
              </button>
            ))}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8">
                <div className="space-y-5">
                  {activeCalc.inputs.map(input => (
                    <div key={input.key}>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block">{input.label} ({input.unit})</label>
                      <input 
                        type="number" 
                        inputMode="decimal"
                        value={inputs[input.key]}
                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                        className="w-full bg-slate-950 border-slate-800 rounded-2xl px-5 py-4 text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all text-lg"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-600/50" />
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
