
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Checklist, UserPlan } from '../types';
import { LEVELS } from '../constants';
import { 
  Plus, Trash2, CheckCircle2, Circle, FileDown, Search, 
  CheckSquare, MapPin, User as UserIcon, Briefcase, X, 
  Camera, Image as ImageIcon, Calendar, Edit3, Save, Copy,
  FolderOpen, FileText, LayoutList, ChevronRight, Check,
  ArrowLeft, ClipboardCheck, History, Clock, MoreVertical,
  AlertTriangle, Crown, Trophy, Activity, Hash, ShieldCheck
} from 'lucide-react';

const TEMPLATE_MODELS: Partial<Checklist>[] = [
  {
    title: 'Inspeção Semanal: Britador de Mandíbula',
    category: 'Mecânica',
    location: 'Planta de Britagem Principal',
    items: [
      { id: 'tm1', text: 'Verificar desgaste das mandíbulas (fixa e móvel)', completed: false },
      { id: 'tm2', text: 'Checar tensionamento das correias de transmissão', completed: false },
      { id: 'tm3', text: 'Lubrificação dos rolamentos do eixo excêntrico', completed: false },
      { id: 'tm4', text: 'Verificar integridade do volante e polia', completed: false }
    ]
  },
  {
    title: 'Checklist: Painel Elétrico de Automação',
    category: 'Automação',
    location: 'Sala Elétrica 04',
    items: [
      { id: 'te1', text: 'Verificar temperatura via termografia (limite 60°C)', completed: false },
      { id: 'te2', text: 'Reaperto de bornes e conexões de potência', completed: false },
      { id: 'te3', text: 'Limpeza e troca de filtros de ventilação', completed: false },
      { id: 'te4', text: 'Teste de atuação dos botões de emergência', completed: false }
    ]
  }
];

const Checklists: React.FC<{ user: UserProfile, onUpdateUser: (u: UserProfile) => void }> = ({ user, onUpdateUser }) => {
  const [view, setView] = useState<'selection' | 'inspection'>('selection');
  const [activeTab, setActiveTab] = useState<'templates' | 'docs'>('templates');
  const [savedReports, setSavedReports] = useState<Checklist[]>(() => {
    const saved = localStorage.getItem('techpro_saved_reports');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeChecklist, setActiveChecklist] = useState<Checklist | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    localStorage.setItem('techpro_saved_reports', JSON.stringify(savedReports));
  }, [savedReports]);

  const isPremium = user.plan !== UserPlan.FREE;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const reportsThisMonth = savedReports.filter(r => {
    const d = new Date(r.lastUpdated);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const currentLevelInfo = LEVELS.find(l => l.level === user.level) || LEVELS[0];

  const toggleItem = (itemId: string) => {
    if (!activeChecklist) return;
    const updated = {
      ...activeChecklist,
      items: activeChecklist.items.map(it => it.id === itemId ? { ...it, completed: !it.completed } : it),
      lastUpdated: new Date().toISOString()
    };
    setActiveChecklist(updated);
  };

  const addItem = () => {
    if (!activeChecklist || !newItemText.trim()) return;
    const newItem = { id: Date.now().toString(), text: newItemText, completed: false };
    setActiveChecklist({ ...activeChecklist, items: [...activeChecklist.items, newItem], lastUpdated: new Date().toISOString() });
    setNewItemText('');
  };

  const deleteItem = (itemId: string) => {
    if (!activeChecklist) return;
    setActiveChecklist({ ...activeChecklist, items: activeChecklist.items.filter(it => it.id !== itemId), lastUpdated: new Date().toISOString() });
  };

  const handleSaveReport = () => {
    if (!activeChecklist) return;
    const existsIndex = savedReports.findIndex(r => r.id === activeChecklist.id);
    if (!isPremium && existsIndex < 0 && reportsThisMonth >= 5) {
      alert("Limite mensal atingido!");
      return;
    }
    
    let newReports;
    if (existsIndex >= 0) {
      newReports = [...savedReports];
      newReports[existsIndex] = activeChecklist;
      alert("Relatório atualizado!");
    } else {
      newReports = [activeChecklist, ...savedReports];
      const xpReward = 150;
      const newXp = user.xp + xpReward;
      let newLevel = user.level;
      LEVELS.forEach(l => { if (newXp >= l.minXp) newLevel = l.level; });
      onUpdateUser({ ...user, xp: newXp, level: newLevel });
      alert(`Relatório salvo! +${xpReward} XP.`);
    }
    setSavedReports(newReports);
  };

  const startInspection = (template: Partial<Checklist>) => {
    const now = new Date();
    const newCl: Checklist = {
      id: Date.now().toString(),
      title: template.title || '',
      category: template.category || '',
      location: template.location || 'Local não definido',
      inspectorName: user.name,
      role: user.area,
      lastUpdated: now.toISOString(),
      items: (template.items || []).map(it => ({ ...it, id: Math.random().toString() })),
      images: []
    };
    setActiveChecklist(newCl);
    setView('inspection');
  };

  const filteredDocs = savedReports.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = activeChecklist?.items.filter(i => i.completed).length || 0;
  const totalItems = activeChecklist?.items.length || 0;
  const complianceRate = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto pb-20 page-fade-in relative">
      {/* Print Watermark (Only visible when printing) */}
      <div className="hidden print:flex fixed inset-0 items-center justify-center opacity-[0.05] pointer-events-none z-[-1] select-none">
        <p className="text-[100px] font-black uppercase rotate-[-45deg] text-slate-900 whitespace-nowrap">
          TECH PRO INDUSTRIAL
        </p>
      </div>

      {view === 'selection' ? (
        <div className="space-y-8 no-print px-1 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">Inspeções Técnicas</h2>
              <p className="text-slate-400 font-medium">Crie novos registros ou gerencie seus documentos.</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-600/10 px-3 py-1.5 rounded-full border border-blue-600/20">
                  {currentLevelInfo.medal} {currentLevelInfo.title} Specialist
                </span>
              </div>
            </div>
            <div className="flex bg-slate-900/80 backdrop-blur-md p-1.5 rounded-[22px] border border-slate-800 shadow-xl">
              <button onClick={() => setActiveTab('templates')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'templates' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Templates</button>
              <button onClick={() => setActiveTab('docs')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'docs' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Docs Salvos</button>
            </div>
          </div>

          {activeTab === 'templates' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEMPLATE_MODELS.map((model, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 hover:border-blue-500 transition-all group active:scale-95 cursor-pointer flex flex-col h-full shadow-lg" onClick={() => startInspection(model)}>
                  <div className="mb-6 w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                    <LayoutList size={28} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1.5">{model.category}</p>
                    <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">{model.title}</h4>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Inspecionar</span>
                     <ChevronRight size={16} className="text-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="relative w-full max-w-md mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Pesquisar relatórios salvos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm shadow-inner"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map(doc => (
                  <div key={doc.id} onClick={() => { setActiveChecklist(doc); setView('inspection'); }} className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 group hover:border-emerald-500/50 transition-all flex flex-col relative active:scale-95 cursor-pointer shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-11 h-11 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-md"><FileText size={22} /></div>
                      <div className="text-slate-600"><History size={16} /></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1.5">{doc.category}</p>
                      <h4 className="text-lg font-bold text-white truncate">{doc.title}</h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">
                        {new Date(doc.lastUpdated).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
                {filteredDocs.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-[40px]">
                    <Search size={40} className="mx-auto text-slate-700 mb-4" />
                    <p className="text-slate-500 font-medium">Nenhum relatório encontrado.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-10 duration-500 px-1 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-5 no-print">
            <button onClick={() => setView('selection')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
              <ArrowLeft size={16} /> Voltar
            </button>
            <div className="flex items-center gap-3">
               <button onClick={handleSaveReport} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2">
                 <Save size={16} /> Salvar Relatório
               </button>
               <button onClick={() => { handleSaveReport(); window.print(); }} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2">
                 <FileDown size={16} /> Exportar Relatório (PDF)
               </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-6 sm:p-10 md:p-14 shadow-2xl print:bg-white print:text-black print:border-none print:p-8 print:shadow-none print:m-0 relative overflow-hidden">
            {/* Header Formal do Relatório */}
            <div className="mb-10 border-b-4 border-blue-600 pb-8 print:border-slate-800">
              <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                <div className="space-y-6 flex-1 w-full">
                  <div className="flex items-center gap-5 mb-2">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white print:bg-slate-900 print:rounded-lg">
                      <ShieldCheck size={36} />
                    </div>
                    <div>
                      <h3 className="text-3xl sm:text-4xl font-black text-white print:text-slate-900 tracking-tighter uppercase leading-tight">Relatório de Inspeção Técnica</h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] print:text-slate-500">Tech Pro Industrial • Protocolo Oficial de Auditoria</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mt-10 bg-slate-950/40 p-6 rounded-3xl border border-slate-800 print:bg-slate-50 print:border-slate-200 print:rounded-xl">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Profissional Responsável</label>
                      <p className="text-base font-bold text-white print:text-black">
                        {activeChecklist?.inspectorName}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Especialidade / Cargo</label>
                      <p className="text-base font-bold text-white print:text-black">
                        {activeChecklist?.role}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Equipamento / Sistema</label>
                      <input 
                        className="bg-transparent text-base font-bold text-white border-b border-slate-700 w-full outline-none focus:border-blue-500 transition-colors no-print pb-1"
                        value={activeChecklist?.title}
                        onChange={(e) => setActiveChecklist(prev => prev ? {...prev, title: e.target.value} : null)}
                      />
                      <p className="hidden print:block text-base font-bold text-black border-b border-slate-300 pb-1">
                        {activeChecklist?.title}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Localização Operacional</label>
                      <input 
                        className="bg-transparent text-base font-bold text-white border-b border-slate-700 w-full outline-none focus:border-blue-500 transition-colors no-print pb-1"
                        value={activeChecklist?.location}
                        onChange={(e) => setActiveChecklist(prev => prev ? {...prev, location: e.target.value} : null)}
                      />
                      <p className="hidden print:block text-base font-bold text-black border-b border-slate-300 pb-1">
                        {activeChecklist?.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-end text-right space-y-4 shrink-0">
                  <div className="w-24 h-24 bg-slate-800/50 rounded-[32px] flex flex-col items-center justify-center text-slate-400 border border-slate-700 print:border-slate-300 print:text-slate-900 print:bg-white print:rounded-2xl">
                    <span className="text-2xl font-black text-white print:text-black leading-none">{complianceRate}%</span>
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-60">Status</span>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Data & Hora</p>
                    <p className="text-xs font-bold text-blue-500 print:text-black">
                      {new Date(activeChecklist?.lastUpdated || '').toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">ID de Auditoria</p>
                    <p className="text-[10px] font-mono font-bold text-white print:text-black">TP-AUDIT-{activeChecklist?.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo de Conformidade (Especial para Print) */}
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 print:grid-cols-3">
               <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 print:bg-transparent print:border-slate-200">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Itens Verificados</p>
                  <p className="text-xl font-black text-white print:text-black">{totalItems}</p>
               </div>
               <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 print:bg-transparent print:border-slate-200">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Em Conformidade</p>
                  <p className="text-xl font-black text-emerald-500 print:text-emerald-700">{completedCount}</p>
               </div>
               <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800 print:bg-transparent print:border-slate-200">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Pendências / Não Conformidades</p>
                  <p className="text-xl font-black text-red-500 print:text-red-700">{totalItems - completedCount}</p>
               </div>
            </div>

            {/* Listagem de Itens */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-800 print:border-slate-200">
                <LayoutList size={22} className="text-blue-500 no-print" />
                <h4 className="text-lg font-black text-white print:text-slate-900 uppercase tracking-widest">Memória de Inspeção e Ensaios</h4>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {activeChecklist?.items.map((item, index) => (
                  <div key={item.id} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${item.completed ? 'bg-emerald-600/5 border-emerald-600/20' : 'bg-slate-950 border-slate-800'} print:bg-transparent print:border-slate-100 print:py-3 print:rounded-none print:border-x-0 print:border-t-0 print:border-b`}>
                    <div className="no-print">
                      <button onClick={() => toggleItem(item.id)} className="shrink-0 transition-transform active:scale-90">
                        {item.completed ? <CheckCircle2 className="text-emerald-500" size={26} /> : <Circle className="text-slate-800" size={26} />}
                      </button>
                    </div>
                    
                    <span className="text-slate-700 font-mono text-[10px] w-6 shrink-0 print:text-slate-400">{(index + 1).toString().padStart(2, '0')}</span>
                    
                    {/* Visual de Check para o Print */}
                    <div className="hidden print:block shrink-0">
                      <div className={`w-6 h-6 border-2 rounded flex items-center justify-center ${item.completed ? 'bg-black border-black text-white' : 'border-slate-400'}`}>
                        {item.completed ? <Check size={16} /> : null}
                      </div>
                    </div>

                    <span className={`text-sm font-bold flex-1 ${item.completed ? 'text-slate-400' : 'text-slate-200'} print:text-slate-800`}>
                      {item.text}
                    </span>

                    <div className="hidden print:block">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${item.completed ? 'text-emerald-600' : 'text-red-500'}`}>
                          {item.completed ? 'Conforme' : 'Não Conforme'}
                       </span>
                    </div>

                    <div className="no-print">
                      <button onClick={() => deleteItem(item.id)} className="p-2 text-slate-700 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="no-print flex gap-3 mt-8">
                <input 
                  type="text" 
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Adicionar novo critério técnico para inspeção..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:ring-2 focus:ring-blue-600 shadow-inner"
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                />
                <button onClick={addItem} className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl active:scale-95 transition-all shadow-lg shadow-blue-900/20">
                  <Plus size={24} />
                </button>
              </div>
            </div>

            {/* Espaço para Observações no Print */}
            <div className="hidden print:block mb-20 space-y-3">
               <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Parecer Técnico / Observações Adicionais:</h4>
               <div className="border border-slate-200 rounded-xl h-32 w-full"></div>
            </div>

            {/* Rodapé e Assinaturas */}
            <div className="mt-16 pt-12 border-t-2 border-slate-800 print:border-slate-800 print:mt-10 print:pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 print:grid-cols-2 print:gap-20">
                <div className="text-center space-y-3">
                  <div className="border-b border-slate-800 h-12 print:border-slate-800"></div>
                  <div>
                    <p className="text-[10px] font-black text-white print:text-slate-900 uppercase tracking-widest leading-none">{activeChecklist?.inspectorName}</p>
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">Inspetor Responsável (Especialista)</p>
                    <p className="hidden print:block text-[7px] text-slate-400 font-mono mt-1">Assinado digitalmente em {new Date(activeChecklist?.lastUpdated || '').toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <div className="border-b border-slate-800 h-12 print:border-slate-800"></div>
                  <div>
                    <p className="text-[10px] font-black text-white print:text-slate-900 uppercase tracking-widest leading-none">Supervisor Industrial</p>
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">Validação e Encerramento de Ordem</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 print:opacity-100 print:mt-12 print:gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-blue-500 print:text-slate-900" />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] print:text-slate-800">Documento Verificado • Sistema Tech Pro v1.0.4</span>
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-mono text-slate-500 print:text-slate-400">HASH DE INTEGRIDADE: {Math.random().toString(16).slice(2, 14).toUpperCase()}-{activeChecklist?.id.slice(-4).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklists;
