
import React, { useState } from 'react';
import { CONVERSION_UNITS } from '../constants';
import { RefreshCw, ArrowRightLeft } from 'lucide-react';

const Conversions: React.FC = () => {
  const [category, setCategory] = useState(Object.keys(CONVERSION_UNITS)[0]);
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState(CONVERSION_UNITS[category as keyof typeof CONVERSION_UNITS][0]);
  const [toUnit, setToUnit] = useState(CONVERSION_UNITS[category as keyof typeof CONVERSION_UNITS][1]);

  // Simplified conversion logic for prototype
  const getConvertedValue = () => {
    if (fromUnit === toUnit) return value;
    // Real logic would use a proper conversion library/matrix
    return value * 1.5; // Mock factor
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white">Conversor Técnico</h2>
        <p className="text-slate-400">Transformação rápida de unidades para cálculos precisos.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-8 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Grandeza Física</label>
            <select 
              value={category}
              onChange={(e) => {
                const cat = e.target.value;
                setCategory(cat);
                const units = CONVERSION_UNITS[cat as keyof typeof CONVERSION_UNITS];
                setFromUnit(units[0]);
                setToUnit(units[1]);
              }}
              className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {Object.keys(CONVERSION_UNITS).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">De</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white text-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <select 
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-32 bg-slate-800 border-slate-700 rounded-xl px-3 py-3 text-white text-sm"
              >
                {CONVERSION_UNITS[category as keyof typeof CONVERSION_UNITS].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-800 rounded-full text-blue-500 shadow-lg border border-slate-700">
            <ArrowRightLeft size={24} />
          </div>

          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Para</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-emerald-500 text-xl font-bold flex items-center">
                {getConvertedValue().toLocaleString('pt-BR', { maximumFractionDigits: 5 })}
              </div>
              <select 
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-32 bg-slate-800 border-slate-700 rounded-xl px-3 py-3 text-white text-sm"
              >
                {CONVERSION_UNITS[category as keyof typeof CONVERSION_UNITS].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
          <h4 className="font-bold text-white mb-4 flex items-center gap-2">
            <RefreshCw size={18} className="text-blue-500" /> Referência Rápida
          </h4>
          <div className="space-y-2 text-sm text-slate-400">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>1 bar</span>
              <span className="text-white font-mono">14.503 psi</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>1 kN</span>
              <span className="text-white font-mono">101.97 kgf</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>1 HP</span>
              <span className="text-white font-mono">0.7457 kW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversions;
