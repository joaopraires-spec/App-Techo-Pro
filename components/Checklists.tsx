
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Checklist, UserPlan } from '../types';
import { LEVELS } from '../constants';
import { 
  Plus, Trash2, CheckCircle2, Circle, FileDown, Search, 
  CheckSquare, MapPin, User as UserIcon, Briefcase, X, 
  Camera, Image as ImageIcon, Calendar, Edit3, Save, Copy,
  FolderOpen, FileText, LayoutList, ChevronRight, Check
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
  },
  {
    title: 'Preventiva: Unidade Hidráulica de Potência',
    category: 'Hidráulica',
    location: 'Setor de Prensas',
    items: [
      { id: 'th1', text: 'Análise visual de vazamentos em mangueiras e conexões', completed: false },
      { id: 'th2', text: 'Checar pressão de trabalho e pressão de alívio', completed: false },
      { id: 'th3', text: 'Verificar nível e saturação do filtro de retorno', completed: false }
    ]
  }
];

const Checklists: React.FC<{ user: UserProfile, onUpdateUser: (u: UserProfile) => void }> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'checklists' | 'docs'>('checklists');
  const [savedReports, setSavedReports] = useState<Checklist[]>(() => {
    const saved = localStorage.getItem('techpro_saved_reports');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeChecklist, setActiveChecklist] = useState<Checklist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditHeaderMode, setIsEditHeaderMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('techpro_saved_reports', JSON.stringify(savedReports));
  }, [savedReports]);

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
    const updated = {
      ...activeChecklist,
      items: [...activeChecklist.items, newItem],
      lastUpdated: new Date().toISOString()
    };
    setActiveChecklist(updated);
    setNewItemText('');
  };

  const deleteItem = (itemId: string) => {
    if (!activeChecklist) return;
    const updated = {
      ...activeChecklist,
      items: activeChecklist.items.filter(it => it.id !== itemId),
      lastUpdated: new Date().toISOString()
    };
    setActiveChecklist(updated);
  };

  const editItemText = (itemId: string, newText: string) => {
    if (!activeChecklist) return;
    const updated = {
      ...activeChecklist,
      items: activeChecklist.items.map(it => it.id === itemId ? { ...it, text: newText } : it),
      lastUpdated: new Date().toISOString()
    };
    setActiveChecklist(updated);
  };

  const handleSaveReport = () => {
    if (!activeChecklist) return;
    
    const exists = savedReports.find(r => r.id === activeChecklist.id);
    let newReports;
    if (exists) {
      newReports = savedReports.map(r => r.id === activeChecklist.id ? activeChecklist : r);
      alert("Relatório atualizado com sucesso!");
    } else {
      newReports = [activeChecklist, ...savedReports];
      
      // Grant XP only for new saves
      const xpReward = 100;
      const newXp = user.xp + xpReward;
      let newLevel = user.level;
      LEVELS.forEach(l => { if (newXp >= l.minXp) newLevel = l.level; });
      
      onUpdateUser({
        ...user,
        xp: newXp,
        level: newLevel
      });
      alert(`Relatório salvo em Docs Salvos! Você ganhou ${xpReward} XP.`);
    }
    
    setSavedReports(newReports);
    setActiveTab('docs');
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChecklist) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setActiveChecklist({ ...activeChecklist, images: [...(activeChecklist.images || []), base64] });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteImage = (index: number) => {
    if (activeChecklist && window.confirm('Remover esta imagem?')) {
      const newImages = [...(activeChecklist.images || [])];
      newImages.splice(index, 1);
      setActiveChecklist({ ...activeChecklist, images: newImages });
    }
  };

  const useTemplate = (template: Partial<Checklist>) => {
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
    setIsModalOpen(false);
  };

  const updateHeaderField = (field: keyof Checklist, value: string) => {
    if (!activeChecklist) return;
    setActiveChecklist({ ...activeChecklist, [field]: value });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 page-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Operações & Relatórios</h2>
          <p className="text-slate-400">Preencha checklists técnicos e organize seus documentos salvos.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-lg">
          <button 
            onClick={() => setActiveTab('checklists')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'checklists' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-500 hover:text-white'}`}
          >
            <LayoutList size={16} /> Checklists
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'docs' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-500 hover:text-white'}`}
          >
            <FolderOpen size={16} /> Docs Salvos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4 no-print">
          {activeTab === 'checklists' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 shadow-2xl">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <LayoutList size={14} /> Modelos de Checklist
              </h3>
              <div className="space-y-3">
                {TEMPLATE_MODELS.map((model, idx) => (
                  <button 
                    key={idx}
                    onClick={() => useTemplate(model)}
                    className="w-full text-left p-4 bg-slate-800/30 border border-slate-800 rounded-2xl hover:border-blue-500 hover:bg-blue-600/5 transition-all group flex items-center justify-between active:scale-95"
                  >
                    <div>
                      <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">{model.category}</p>
                      <h4 className="font-bold text-white text-sm group-hover:text-blue-400">{model.title}</h4>
                    </div>
                    <ChevronRight size={16} className="text-slate-700 group-hover:text-blue-500" />
                  </button>
                ))}
                <button 
                  onClick={() => useTemplate({ title: 'Novo Checklist Customizado', category: 'Geral', items: [] })}
                  className="w-full p-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-blue-400 hover:border-blue-500/50 transition-all flex flex-col items-center gap-2 text-xs font-black uppercase tracking-widest mt-4"
                >
                  <Plus size={20} /> Criar do Zero
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 shadow-2xl">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FolderOpen size={14} /> Pasta: Relatórios Salvos
              </h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
                {savedReports.map(cl => (
                  <button
                    key={cl.id}
                    onClick={() => setActiveChecklist(cl)}
                    className={`w-full text-left p-5 rounded-2xl transition-all border group active:scale-[0.98] ${activeChecklist?.id === cl.id ? 'bg-blue-600/10 border-blue-600 shadow-lg' : 'bg-slate-800/30 border-slate-800 hover:border-slate-600'}`}
                  >
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${activeChecklist?.id === cl.id ? 'text-blue-400' : 'text-slate-500'}`}>{cl.category}</p>
                    <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors truncate">{cl.title}</h4>
                    <div className="mt-2 flex items-center justify-between">
                       <div className="flex items-center gap-2 text-[8px] font-bold text-slate-600 uppercase">
                         <Calendar size={10} /> {new Date(cl.lastUpdated).toLocaleDateString()}
                       </div>
                       <div className="text-[8px] font-black text-emerald-500 uppercase">Salvo</div>
                    </div>
                  </button>
                ))}
                {savedReports.length === 0 && (
                  <div className="text-center py-10 text-slate-600 italic text-sm">Nenhum documento salvo.</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {activeChecklist ? (
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-6 md:p-10 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="hidden print:block">
                  <h1 className="text-3xl font-black mb-1 text-slate-900 tracking-tighter uppercase">Relatório de Inspeção Técnica</h1>
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Plataforma Tech Pro Industrial • Doc: {activeChecklist.id}</p>
                </div>
                
                <div className="flex-1 print:hidden">
                  <div className="flex items-center gap-3">
                    <input 
                      className="bg-slate-800/50 border-none text-2xl font-black text-white px-3 py-2 rounded-2xl w-full focus:ring-2 focus:ring-blue-600 placeholder:text-slate-700"
                      value={activeChecklist.title}
                      placeholder="Título do Relatório"
                      onChange={(e) => updateHeaderField('title', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button onClick={handleSaveReport} className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest bg-emerald-600/10 px-5 py-3 rounded-xl border border-emerald-600/20 hover:bg-emerald-600/20 transition-all active:scale-95"><Save size={16} /> Salvar Doc</button>
                  <button onClick={handleExportPDF} className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest bg-blue-600/10 px-5 py-3 rounded-xl border border-blue-600/20 hover:bg-blue-600/20 transition-all active:scale-95"><FileDown size={16} /> Exportar</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-950/50 p-6 rounded-[24px] border border-slate-800 print:bg-slate-50 print:border-slate-200 print:rounded-none">
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Responsável</p>
                    <p className="text-xs font-bold text-slate-200 print:text-black">{activeChecklist.inspectorName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Área Técnica</p>
                    <input className="bg-transparent text-xs font-bold text-blue-400 border-none p-0 focus:ring-0 w-full" value={activeChecklist.category} onChange={(e) => updateHeaderField('category', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Local / Unidade</p>
                    <input className="bg-transparent text-xs font-bold text-white border-none p-0 focus:ring-0 w-full" value={activeChecklist.location || ''} placeholder="Digite o local..." onChange={(e) => updateHeaderField('location', e.target.value)} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Data</p>
                    <p className="text-xs font-bold text-slate-200 print:text-black">{new Date(activeChecklist.lastUpdated).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-10">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                  Itens de Verificação
                  <span className="text-blue-500 no-print">{activeChecklist.items.filter(i => i.completed).length} / {activeChecklist.items.length} Concluídos</span>
                </h4>
                
                {activeChecklist.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/40 border border-slate-800 group transition-all hover:bg-slate-800 print:bg-transparent print:border-slate-100">
                    <button onClick={() => toggleItem(item.id)} className="no-print">
                      {item.completed ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-600" />}
                    </button>
                    <div className="hidden print:block font-black text-xs">{item.completed ? "[OK]" : "[  ]"}</div>
                    
                    {editingItemId === item.id ? (
                      <input 
                        autoFocus
                        className="flex-1 bg-slate-950 px-2 py-1 rounded text-sm text-white border-blue-500 border outline-none"
                        value={item.text}
                        onChange={(e) => editItemText(item.id, e.target.value)}
                        onBlur={() => setEditingItemId(null)}
                      />
                    ) : (
                      <span onClick={() => setEditingItemId(item.id)} className={`flex-1 text-sm font-medium cursor-text ${item.completed ? 'text-slate-500 line-through' : 'text-slate-200'} print:text-black print:no-underline`}>
                        {item.text}
                      </span>
                    )}
                    
                    <button onClick={() => deleteItem(item.id)} className="no-print opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-500 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 no-print pt-4">
                  <input 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-blue-600 outline-none"
                    placeholder="Novo item de inspeção..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  />
                  <button onClick={addItem} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all shadow-lg active:scale-95">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Evidências Visuais</h4>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="no-print flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                  >
                    <Camera size={14} /> Foto
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {activeChecklist.images?.map((img, idx) => (
                    <div key={idx} className="aspect-video bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden relative group shadow-lg">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteImage(idx); }}
                        className="no-print absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden print:block mt-16 pt-10 border-t border-slate-200">
                <div className="flex justify-between items-center px-10">
                  <div className="text-center w-64">
                    <div className="border-b border-slate-900 mb-2 h-10"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Assinatura Responsável</p>
                  </div>
                  <div className="text-center w-64 text-slate-400 font-black italic">TECH PRO INDUSTRIAL</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 p-20 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[40px] text-center">
               <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 opacity-20">
                  <FileText size={40} />
               </div>
               <h3 className="text-xl font-bold text-slate-400 mb-2">Pronto para inspecionar?</h3>
               <p className="text-sm italic max-w-xs">Selecione um modelo à esquerda ou crie um relatório do zero para começar a documentar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checklists;
