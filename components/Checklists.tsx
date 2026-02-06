
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Checklist, UserPlan } from '../types';
import { LEVELS } from '../constants';
import { 
  Plus, Trash2, CheckCircle2, Circle, FileDown, Search, 
  CheckSquare, MapPin, User as UserIcon, Briefcase, X, 
  Camera, Image as ImageIcon, Calendar, Edit3, Save, Copy,
  FolderOpen, FileText, LayoutList, ChevronRight, Check,
  ArrowLeft, ClipboardCheck, History, Clock, MoreVertical
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
    
    const existsIndex = savedReports.findIndex(r => r.id === activeChecklist.id);
    let newReports;
    if (existsIndex >= 0) {
      newReports = [...savedReports];
      newReports[existsIndex] = activeChecklist;
      alert("Relatório atualizado com sucesso!");
    } else {
      newReports = [activeChecklist, ...savedReports];
      
      const xpReward = 100;
      const newXp = user.xp + xpReward;
      let newLevel = user.level;
      LEVELS.forEach(l => { if (newXp >= l.minXp) newLevel = l.level; });
      
      onUpdateUser({
        ...user,
        xp: newXp,
        level: newLevel
      });
      alert(`Relatório salvo! Você ganhou ${xpReward} XP.`);
    }
    
    setSavedReports(newReports);
    setView('selection');
    setActiveTab('docs');
    setActiveChecklist(null);
  };

  const handleDeleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Deseja realmente excluir este documento?")) {
      setSavedReports(savedReports.filter(r => r.id !== id));
    }
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

  const editSavedReport = (report: Checklist) => {
    setActiveChecklist(report);
    setView('inspection');
  };

  const updateHeaderField = (field: keyof Checklist, value: string) => {
    if (!activeChecklist) return;
    setActiveChecklist({ ...activeChecklist, [field]: value });
  };

  const filteredDocs = savedReports.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 md:px-0 page-fade-in">
      {view === 'selection' ? (
        <div className="space-y-10 no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Inspeções Técnicas</h2>
              <p className="text-slate-400 font-medium">Crie novos registros ou gerencie seus documentos salvos.</p>
            </div>
            
            <div className="flex bg-slate-900/80 backdrop-blur-md p-1.5 rounded-[22px] border border-slate-800 shadow-xl">
              <button 
                onClick={() => setActiveTab('templates')}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'templates' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <ClipboardCheck size={18} /> Templates
              </button>
              <button 
                onClick={() => setActiveTab('docs')}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'docs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                <FolderOpen size={18} /> Docs Salvos
              </button>
            </div>
          </div>

          {activeTab === 'templates' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEMPLATE_MODELS.map((model, idx) => (
                  <div 
                    key={idx}
                    className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 hover:border-blue-500 transition-all group relative overflow-hidden flex flex-col h-full active:scale-95 cursor-pointer"
                    onClick={() => startInspection(model)}
                  >
                    <div className="mb-6 w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <LayoutList size={28} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{model.category}</p>
                      <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{model.title}</h4>
                      <p className="text-sm text-slate-500 mt-3 line-clamp-2">{model.items?.length} itens padrão de auditoria técnica.</p>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Inspecionar Agora</span>
                       <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ChevronRight size={18} />
                       </div>
                    </div>
                  </div>
                ))}
                
                <div 
                  onClick={() => startInspection({ title: 'Inspeção Customizada', category: 'Geral', items: [] })}
                  className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[32px] p-8 flex flex-col items-center justify-center text-center group hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-pointer h-full active:scale-95"
                >
                  <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 mb-4 group-hover:text-blue-500 transition-all">
                    <Plus size={32} />
                  </div>
                  <h4 className="font-black text-slate-500 uppercase tracking-widest text-xs">Criar do Zero</h4>
                  <p className="text-xs text-slate-600 mt-2">Personalize todos os campos.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Pesquisar relatório..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => editSavedReport(doc)}
                    className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 group hover:border-emerald-500/50 transition-all flex flex-col relative active:scale-95 cursor-pointer shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500">
                        <FileText size={24} />
                      </div>
                      <button 
                        onClick={(e) => handleDeleteReport(doc.id, e)}
                        className="p-2 text-slate-700 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">{doc.category}</p>
                      <h4 className="text-lg font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{doc.title}</h4>
                      <div className="flex items-center gap-3 mt-4">
                         <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                           <Calendar size={12} /> {new Date(doc.lastUpdated).toLocaleDateString()}
                         </div>
                         <div className="w-1 h-1 bg-slate-700 rounded-full" />
                         <div className="text-[10px] text-emerald-500/80 font-black uppercase tracking-widest">
                            {doc.items.filter(i => i.completed).length} / {doc.items.length} itens
                         </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredDocs.length === 0 && (
                  <div className="col-span-full py-24 text-center space-y-4 bg-slate-900/20 border border-dashed border-slate-800 rounded-[40px]">
                    <History size={48} className="mx-auto text-slate-800" />
                    <p className="text-slate-500 italic">Nenhum documento salvo encontrado.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-10 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 no-print">
            <button 
              onClick={() => setView('selection')}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar
            </button>
            <div className="flex items-center gap-3">
               <button onClick={handleSaveReport} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95 transition-all">
                 <Save size={16} /> Salvar Relatório
               </button>
               <button onClick={handleExportPDF} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                 <FileDown size={16} /> PDF
               </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-6 md:p-12 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
            {/* Report Header */}
            <header className="mb-10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <input 
                    className="bg-slate-800/40 border-none text-3xl font-black text-white px-4 py-3 rounded-2xl w-full focus:ring-2 focus:ring-blue-600 placeholder:text-slate-700 tracking-tighter print:bg-transparent print:text-black print:text-4xl print:p-0"
                    value={activeChecklist?.title}
                    placeholder="Nome da Inspeção"
                    onChange={(e) => updateHeaderField('title', e.target.value)}
                  />
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full print:bg-slate-100"><UserIcon size={12} /> {activeChecklist?.inspectorName}</span>
                    <span className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full print:bg-slate-100"><Clock size={12} /> {new Date(activeChecklist?.lastUpdated || '').toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="hidden print:block text-right">
                  <div className="font-black text-2xl tracking-tighter mb-1">TECH PRO INDUSTRIAL</div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Documento de Auditoria Técnica</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/50 p-6 rounded-[28px] border border-slate-800 print:bg-slate-50 print:border-slate-200 print:rounded-none">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5 block">Área Técnica</label>
                    <input className="bg-slate-800/30 text-sm font-bold text-blue-400 border-none px-3 py-1.5 rounded-xl focus:ring-0 w-full print:bg-transparent" value={activeChecklist?.category} onChange={(e) => updateHeaderField('category', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1.5 block">Unidade / Localização</label>
                    <input className="bg-slate-800/30 text-sm font-bold text-white border-none px-3 py-1.5 rounded-xl focus:ring-0 w-full placeholder:text-slate-700 print:bg-transparent print:text-black" value={activeChecklist?.location || ''} placeholder="Ex: Planta Principal - Setor 02" onChange={(e) => updateHeaderField('location', e.target.value)} />
                  </div>
                </div>
              </div>
            </header>

            {/* Checklist Items */}
            <section className="space-y-4 mb-12">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Verificações de Segurança e Operação</h4>
                {activeChecklist && (
                  <div className="text-[10px] font-black text-blue-500 uppercase bg-blue-600/10 px-3 py-1 rounded-full border border-blue-600/20">
                    {Math.round((activeChecklist.items.filter(i => i.completed).length / (activeChecklist.items.length || 1)) * 100)}% concluído
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {activeChecklist?.items.map(item => (
                  <div 
                    key={item.id} 
                    className={`flex items-center gap-4 p-5 rounded-[22px] transition-all border group ${item.completed ? 'bg-emerald-600/5 border-emerald-600/30' : 'bg-slate-950 border-slate-800 hover:border-slate-700'} print:bg-transparent print:border-slate-200 print:rounded-none print:py-3`}
                  >
                    <button onClick={() => toggleItem(item.id)} className="no-print">
                      {item.completed ? <CheckCircle2 className="text-emerald-500" size={24} /> : <Circle className="text-slate-700 group-hover:text-slate-500" size={24} />}
                    </button>
                    <div className="hidden print:block font-black text-sm">{item.completed ? "✓" : "□"}</div>
                    
                    {editingItemId === item.id ? (
                      <input 
                        autoFocus
                        className="flex-1 bg-slate-900 px-3 py-2 rounded-xl text-sm text-white border-blue-500 border outline-none"
                        value={item.text}
                        onChange={(e) => editItemText(item.id, e.target.value)}
                        onBlur={() => setEditingItemId(null)}
                      />
                    ) : (
                      <span onClick={() => setEditingItemId(item.id)} className={`flex-1 text-sm font-bold cursor-text transition-all ${item.completed ? 'text-slate-500 line-through' : 'text-slate-200'} print:text-black print:no-underline`}>
                        {item.text}
                      </span>
                    )}
                    
                    <button onClick={() => deleteItem(item.id)} className="no-print opacity-0 group-hover:opacity-100 p-2 text-slate-700 hover:text-red-500 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 no-print pt-4">
                  <input 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Adicionar novo item à inspeção..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  />
                  <button onClick={addItem} className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl transition-all shadow-lg active:scale-95">
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            </section>

            {/* Visual Evidences */}
            <section className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Evidências Técnicas Fotográficas</h4>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="no-print flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase bg-emerald-600/10 px-4 py-2 rounded-xl border border-emerald-600/20 hover:bg-emerald-600/20 transition-all"
                >
                  <Camera size={16} /> Capturar / Anexar
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {activeChecklist?.images?.map((img, idx) => (
                  <div key={idx} className="aspect-video bg-slate-950 rounded-[28px] border border-slate-800 overflow-hidden relative group shadow-2xl print:border-slate-300 print:rounded-none">
                    <img src={img} className="w-full h-full object-cover" alt="Evidência técnica" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteImage(idx); }}
                      className="no-print absolute top-3 right-3 p-2 bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                {(!activeChecklist?.images || activeChecklist.images.length === 0) && (
                  <div className="col-span-full py-12 border-2 border-dashed border-slate-800 rounded-[32px] flex flex-col items-center justify-center gap-4 no-print text-slate-700">
                    <ImageIcon size={48} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma foto anexada para este relatório</p>
                  </div>
                )}
              </div>
            </section>

            {/* Signature Section for Print */}
            <footer className="hidden print:block mt-24 pt-12 border-t border-slate-300">
              <div className="grid grid-cols-2 gap-20">
                <div className="text-center">
                  <div className="border-b-2 border-slate-900 mb-4 h-12"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Assinatura do Inspetor Responsável</p>
                  <p className="text-[8px] text-slate-500 mt-1 uppercase">{activeChecklist?.inspectorName}</p>
                </div>
                <div className="text-center">
                  <div className="border-b-2 border-slate-900 mb-4 h-12"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Visto da Gerência / Supervisão</p>
                </div>
              </div>
              <div className="mt-12 text-center text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                Relatório Gerado Automaticamente pela Plataforma Tech Pro Industrial
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklists;
