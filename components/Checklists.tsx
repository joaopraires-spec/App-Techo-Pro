
import React, { useState } from 'react';
import { UserProfile, Checklist } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, FileDown, Search, CheckSquare, MapPin, User as UserIcon, Briefcase } from 'lucide-react';

const Checklists: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [checklists, setChecklists] = useState<Checklist[]>([
    {
      id: '1',
      title: 'Inspeção Semanal Britador HP400',
      category: 'Mecânica',
      location: 'Planta de Britagem 01',
      inspectorName: user.name,
      role: user.area,
      items: [
        { id: 'i1', text: 'Verificar nível de óleo do reservatório', completed: true },
        { id: 'i2', text: 'Checar pressão de lubrificação', completed: false },
        { id: 'i3', text: 'Limpeza dos filtros de ar', completed: false },
      ],
      lastUpdated: new Date().toISOString()
    }
  ]);
  const [activeChecklist, setActiveChecklist] = useState<Checklist | null>(checklists[0]);

  const toggleItem = (checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(cl => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: cl.items.map(it => it.id === itemId ? { ...it, completed: !it.completed } : it)
        };
      }
      return cl;
    }));
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-3xl font-bold text-white">Checklists Operacionais</h2>
          <p className="text-slate-400">Registro profissional com exportação para auditoria.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
          <Plus size={20} /> Novo Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4 no-print">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" placeholder="Buscar inspeção..." className="w-full bg-slate-800 border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none" />
            </div>
            <div className="space-y-2">
              {checklists.map(cl => (
                <button
                  key={cl.id}
                  onClick={() => setActiveChecklist(cl)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${activeChecklist?.id === cl.id ? 'bg-blue-600/10 border-blue-600' : 'bg-slate-800/30 border-slate-800'}`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">{cl.category}</p>
                  <h4 className="font-bold text-white text-sm">{cl.title}</h4>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {activeChecklist && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 print:bg-white print:text-black print:border-none print:shadow-none">
              <div className="flex items-center justify-between mb-8">
                <div className="hidden print:block">
                  <h1 className="text-2xl font-black mb-1">RELATÓRIO TÉCNICO DE INSPEÇÃO</h1>
                  <p className="text-xs uppercase font-bold text-slate-600">Documento Gerado via Tech Pro v2.5</p>
                </div>
                <h3 className="text-2xl font-bold text-white print:hidden">{activeChecklist.title}</h3>
                <button onClick={handleExportPDF} className="no-print flex items-center gap-2 text-blue-400 font-bold text-sm bg-blue-600/10 px-4 py-2 rounded-lg border border-blue-600/20"><FileDown size={18} /> Exportar Relatório</button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserIcon size={16} className="text-blue-500 print:text-slate-600" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">Inspetor</p>
                      <p className="text-sm font-bold text-slate-200 print:text-black">{activeChecklist.inspectorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-blue-500 print:text-slate-600" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">Cargo/Função</p>
                      <p className="text-sm font-bold text-slate-200 print:text-black">{activeChecklist.role}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-blue-500 print:text-slate-600" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">Localização</p>
                      <p className="text-sm font-bold text-slate-200 print:text-black">{activeChecklist.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckSquare size={16} className="text-blue-500 print:text-slate-600" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">Data e Hora</p>
                      <p className="text-sm font-bold text-slate-200 print:text-black">{new Date(activeChecklist.lastUpdated).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {activeChecklist.items.map(item => (
                  <div key={item.id} onClick={() => toggleItem(activeChecklist.id, item.id)} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-800 cursor-pointer transition-all hover:bg-slate-800 print:border-b print:bg-transparent print:border-slate-100">
                    <div className="no-print">{item.completed ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-600" />}</div>
                    <div className="hidden print:block font-bold">{item.completed ? "[OK]" : "[  ]"}</div>
                    <span className={`flex-1 text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-200'} print:text-black print:no-underline`}>{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="no-print mt-10">
                 <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 font-bold hover:border-blue-500 transition-all">+ Adicionar Item de Verificação</button>
              </div>

              <div className="hidden print:block mt-20 pt-10 border-t">
                <div className="flex justify-between">
                  <div className="text-center w-64">
                    <div className="border-b border-black mb-2"></div>
                    <p className="text-xs font-bold uppercase">Assinatura do Inspetor</p>
                  </div>
                  <div className="text-center w-64">
                    <div className="border-b border-black mb-2"></div>
                    <p className="text-xs font-bold uppercase">Aprovação Supervisão</p>
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

export default Checklists;
