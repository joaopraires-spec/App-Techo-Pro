
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Checklist, UserPlan } from '../types';
import { LEVELS } from '../constants';
import { 
  Plus, Trash2, CheckCircle2, Circle, FileDown, Search, 
  CheckSquare, MapPin, User as UserIcon, Briefcase, X, 
  Camera, Image as ImageIcon, Calendar, Edit3, Save, Copy,
  FolderOpen, FileText, LayoutList, ChevronRight, Check,
  ArrowLeft, ClipboardCheck, History, Clock, MoreVertical,
  AlertTriangle, Crown, Trophy
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
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setView('selection');
    setActiveChecklist(null);
  };

  const startInspection = (template: Partial<Checklist>) => {
    const newCl: Checklist = {
      id: Date.now().toString(),
      title: template.title || '',
      category: template.category || '',
      location: template.location || '',
      inspectorName: user.name,
      role: user.area,
      lastUpdated: new Date().toISOString(),
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

  return (
    <div className="max-w-7xl mx-auto pb-20 page-fade-in">
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
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 hover:border-blue-500 transition-all group active:scale-95 cursor-pointer flex flex-col h-full" onClick={() => startInspection(model)}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map(doc => (
                <div key={doc.id} onClick={() => { setActiveChecklist(doc); setView('inspection'); }} className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 group hover:border-emerald-500/50 transition-all flex flex-col relative active:scale-95 cursor-pointer shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-md"><FileText size={22} /></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1.5">{doc.category}</p>
                    <h4 className="text-lg font-bold text-white truncate">{doc.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-10 duration-500 px-1 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-5 no-print">
            <button onClick={() => setView('selection')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
              <ArrowLeft size={16} /> Voltar
            </button>
            <div className="flex items-center gap-3">
               <button onClick={handleSaveReport} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2">
                 <Save size={16} /> Salvar Relatório
               </button>
               <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2">
                 <FileDown size={16} /> Exportar PDF
               </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 md:p-12 shadow-2xl print:bg-white print:text-black print:border-none print:p-0">
            <header className="mb-10 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white print:text-black mb-2">{activeChecklist?.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500 print:text-slate-600">
                    <span className="flex items-center gap-2"><UserIcon size={12} /> {activeChecklist?.inspectorName}</span>
                    <span className="flex items-center gap-2 font-bold text-blue-500"><Trophy size={12} /> {currentLevelInfo.title}</span>
                    <span className="flex items-center gap-2"><Clock size={12} /> {new Date(activeChecklist?.lastUpdated || '').toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="hidden print:block text-right">
                   <p className="font-black text-xl tracking-tighter">TECH PRO INDUSTRIAL</p>
                   <p className="text-[8px] uppercase tracking-widest">Auditoria de Manutenção</p>
                </div>
              </div>
            </header>

            <section className="space-y-4 mb-10">
              {activeChecklist?.items.map(item => (
                <div key={item.id} className={`flex items-center gap-4 p-4 rounded-2xl border ${item.completed ? 'bg-emerald-600/5 border-emerald-600/20' : 'bg-slate-950 border-slate-800'} print:bg-transparent print:border-slate-200`}>
                  <button onClick={() => toggleItem(item.id)} className="no-print">
                    {item.completed ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-700" />}
                  </button>
                  <span className={`text-sm font-bold flex-1 ${item.completed ? 'text-slate-500 line-through' : 'text-slate-200'} print:text-black print:no-underline`}>{item.text}</span>
                </div>
              ))}
            </section>

            <footer className="hidden print:block mt-20 pt-10 border-t border-slate-300">
               <div className="grid grid-cols-2 gap-10">
                 <div className="text-center">
                    <div className="border-b-2 border-slate-900 mb-2 h-10"></div>
                    <p className="text-[10px] font-black uppercase">{activeChecklist?.inspectorName}</p>
                    <p className="text-[8px] text-slate-500 uppercase">{currentLevelInfo.title} Specialist</p>
                 </div>
                 <div className="text-center">
                    <div className="border-b-2 border-slate-900 mb-2 h-10"></div>
                    <p className="text-[10px] font-black uppercase">Visto da Supervisão</p>
                 </div>
               </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklists;
