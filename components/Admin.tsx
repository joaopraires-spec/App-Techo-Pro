
import React, { useState } from 'react';
import { UserProfile, UserPlan } from '../types';
import { ShieldCheck, Users, CreditCard, ClipboardCheck, Trash2, CheckCircle, Clock } from 'lucide-react';

const Admin: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'u2', name: 'Ricardo Santos', email: 'ricardo.eng@gmail.com', plan: 'Premium Anual', status: 'Aguardando' }
  ]);

  const [releaseCheck, setReleaseCheck] = useState<Record<string, boolean[]>>({
    'u2': [false, false, false]
  });

  const handleToggle = (uid: string, idx: number) => {
    setReleaseCheck(prev => ({
      ...prev,
      [uid]: prev[uid].map((v, i) => i === idx ? !v : v)
    }));
  };

  const steps = [
    "Confirmar recebimento no extrato Mercado Pago",
    "Validar ID da transação e Email do usuário",
    "Conferir validade do plano (Mensal vs Anual)"
  ];

  const canRelease = (uid: string) => releaseCheck[uid]?.every(v => v);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3"><ShieldCheck size={32} className="text-blue-500" /> Gestão Administrativa</h2>
          <p className="text-slate-400">Liberação de planos, controle de acesso e auditoria.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <Users className="text-blue-500 mb-4" />
          <p className="text-slate-500 text-xs font-bold uppercase">Usuários Ativos</p>
          <h3 className="text-3xl font-black text-white">1.452</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <CreditCard className="text-amber-500 mb-4" />
          <p className="text-slate-500 text-xs font-bold uppercase">Assinantes Premium</p>
          <h3 className="text-3xl font-black text-white">428</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <Clock className="text-emerald-500 mb-4" />
          <p className="text-slate-500 text-xs font-bold uppercase">Aguardando Liberação</p>
          <h3 className="text-3xl font-black text-white">{pendingRequests.length}</h3>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-800/20">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><ClipboardCheck size={20} className="text-blue-500" /> Checklist de Liberação Manual</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {pendingRequests.map(req => (
            <div key={req.id} className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-white mb-2">{req.name}</h4>
                <p className="text-sm text-slate-500 mb-4">{req.email}</p>
                <div className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-full border border-amber-500/20">{req.plan}</div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Protocolo de Liberação</p>
                {steps.map((step, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
                    <input 
                      type="checkbox" 
                      checked={releaseCheck[req.id]?.[idx]}
                      onChange={() => handleToggle(req.id, idx)}
                      className="w-5 h-5 bg-slate-800 border-slate-700 text-blue-600 rounded" 
                    />
                    <span className={`text-sm ${releaseCheck[req.id]?.[idx] ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{step}</span>
                  </label>
                ))}
                <button 
                  disabled={!canRelease(req.id)}
                  onClick={() => setPendingRequests(prev => prev.filter(r => r.id !== req.id))}
                  className={`w-full mt-4 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${canRelease(req.id) ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                >
                  <CheckCircle size={20} /> Liberar Acesso Premium
                </button>
              </div>
            </div>
          ))}
          {pendingRequests.length === 0 && <div className="p-20 text-center text-slate-500 italic">Nenhuma solicitação pendente.</div>}
        </div>
      </div>
    </div>
  );
};

export default Admin;
