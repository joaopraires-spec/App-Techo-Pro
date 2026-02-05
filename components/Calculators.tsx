
import React, { useState } from 'react';
import { CALCULATORS } from '../constants';
// Fixing react-router-dom imports to ensure all members are correctly exported
import { Lock, Calculator as CalcIcon, Info, ChevronRight, Settings2 } from 'lucide-react';
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Calculadoras Técnicas</h2>
          <p className="text-slate-400">Resultados verificados com memória de cálculo interativa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          {CALCULATORS.map(calc => (
            <button
              key={calc.id}
              onClick={() => {
                setActiveCalc(calc);
                setInputs(calc.inputs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.defaultValue }), {}));
              }}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between border ${
                activeCalc.id === calc.id 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="font-bold">{calc.name}</p>
                <p className={`text-[10px] uppercase font-medium ${activeCalc.id === calc.id ? 'text-blue-200' : 'text-slate-500'}`}>{calc.category}</p>
              </div>
              {calc.isPremium && !isPremium ? <Lock size={14} className="text-amber-500" /> : <ChevronRight size={16} />}
            </button>
          ))}
        </div>

        <div className="lg:col-span-8">
          {activeCalc.isPremium && !isPremium ? (
            <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-16 text-center">
              <Lock size={48} className="text-amber-500 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-white mb-4">Cálculo Exclusivo Premium</h3>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">Esta ferramenta avançada de dimensionamento requer assinatura mensal ou anual.</p>
              <Link to="/profile" className="bg-amber-500 text-slate-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs">Upgrade</Link>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col h-full shadow-2xl">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{activeCalc.name}</h3>
                  <p className="text-blue-500 font-mono text-sm font-bold">Fórmula: {activeCalc.formula}</p>
                </div>
                <div className="bg-slate-800 px-4 py-2 rounded-xl text-blue-400 font-bold border border-blue-600/20">
                  {activeCalc.illustration}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  {activeCalc.inputs.map(input => (
                    <div key={input.key}>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">{input.label} ({input.unit})</label>
                      <input 
                        type="number" 
                        value={inputs[input.key]}
                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                        className="w-full bg-slate-950 border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-600 uppercase mb-4 tracking-widest">Resultado</span>
                  <div className="text-5xl font-black text-white mb-2">{calculateResult().toLocaleString('pt-BR', { maximumFractionDigits: 4 })}</div>
                  <span className="text-blue-500 font-bold uppercase text-xs">{activeCalc.resultUnit}</span>
                </div>
              </div>

              <div className="mt-auto p-4 bg-slate-800/50 rounded-2xl border border-slate-800 flex items-center gap-4">
                <Info size={20} className="text-blue-500 shrink-0" />
                <p className="text-xs text-slate-500 italic leading-relaxed">{activeCalc.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculators;
