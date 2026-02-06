
import React, { useState, useRef } from 'react';
import { UserProfile, Checklist } from '../types';
import { 
  Plus, Trash2, CheckCircle2, Circle, FileDown, Search, 
  CheckSquare, MapPin, User as UserIcon, Briefcase, X, 
  Camera, Image as ImageIcon, Calendar, Edit3, Save, Copy
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

const Checklists: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [checklists, setChecklists] = useState<Checklist[]>([
    {
      id: '1',
      title: 'Inspeção Britador HP400',
      category: 'Mecânica',
      location: 'Planta 01',
      inspectorName: user.name,
      role: user.area,
      items: [
        { id: 'i1', text: 'Verificar nível de óleo do reservatório', completed: true },
        { id: 'i2', text: 'Checar pressão de lubrificação', completed: false },
        { id: 'i3', text: 'Limpeza dos filtros de ar', completed: false },
      ],
      lastUpdated: new Date().toISOString(),
      images: []
    }
  ]);
  
  const [activeChecklist, setActiveChecklist] = useState<Checklist | null>(checklists[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditHeaderMode, setIsEditHeaderMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newChecklistData, setNewChecklistData] = useState({
    title: '',
    category: '',
    location: '',
    items: ['']
  });

  const toggleItem = (checklistId: string, itemId: string) => {
    const updated = checklists.map(cl => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: cl.items.map(it => it.id === itemId ? { ...it, completed: !it.completed } : it)
        };
      }
      return cl;
    });
    setChecklists(updated);
    if (activeChecklist?.id === checklistId) {
      setActiveChecklist(updated.find(c => c.id === checklistId) || null);
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
        const updated = checklists.map(cl => {
          if (cl.id === activeChecklist.id) {
            return { ...cl, images: [...(cl.images || []), base64] };
          }
          return cl;
        });
        setChecklists(updated);
        setActiveChecklist(updated.find(c => c.id === activeChecklist.id) || null);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteImage = (index: number) => {
    if (activeChecklist && window.confirm('Remover esta imagem do relatório?')) {
      const updated = checklists.map(cl => {
        if (cl.id === activeChecklist.id) {
          const newImages = [...(cl.images || [])];
          newImages.splice(index, 1);
          return { ...cl, images: newImages };
        }
        return cl;
      });
      setChecklists(updated);
      setActiveChecklist(updated.find(c => c.id === activeChecklist.id) || null);
    }
  };

  const updateHeaderField = (field: keyof Checklist, value: string) => {
    if (!activeChecklist) return;
    const updated = checklists.map(cl => {
      if (cl.id === activeChecklist.id) {
        return { ...cl, [field]: value, lastUpdated: new Date().toISOString() };
      }
      return cl;
    });
    setChecklists(updated);
    setActiveChecklist(updated.find(c => c.id === activeChecklist.id) || null);
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
    setChecklists([newCl, ...checklists]);
    setActiveChecklist(newCl);
    setIsModalOpen(false);
  };

  const handleCreateChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    const newCl: Checklist = {
      id: Date.now().toString(),
      title: newChecklistData.title,
      category: newChecklistData.category,
      location: newChecklistData.location,
      inspectorName: user.name,
      role: user.area,
      lastUpdated: new Date().toISOString(),
      items: newChecklistData.items
        .filter(text => text.trim() !== '')
        .map((text, idx) => ({ id: `new-item-${idx}-${Date.now()}`, text, completed: false })),
      images: []
    };
    setChecklists([newCl, ...checklists]);
    setActiveChecklist(newCl);
    setIsModalOpen(false);
    setNewChecklistData({ title: '', category: '', location: '', items: [''] });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 page-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Checklists Operacionais</h2>
          <p className="text-slate-400">Modelos prontos e relatórios de evidência visual.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-blue-900/20 transition-all active:scale-95"
        >
          <Plus size={18} /> Novo Relatório / Modelos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4 no-print">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 shadow-2xl">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Search size={14} /> Histórico de Inspeções
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
              {checklists.map(cl => (
                <button
                  key={cl.id}
                  onClick={() => { setActiveChecklist(cl); setIsEditHeaderMode(false); }}
                  className={`w-full text-left p-5 rounded-2xl transition-all border group active:scale-[0.98] ${activeChecklist?.id === cl.id ? 'bg-blue-600/10 border-blue-600 shadow-lg' : 'bg-slate-800/30 border-slate-800 hover:border-slate-600'}`}
                >
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${activeChecklist?.id === cl.id ? 'text-blue-400' : 'text-slate-500'}`}>{cl.category}</p>
                  <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{cl.title}</h4>
                  <div className="mt-2 flex items-center gap-2 text-[8px] font-bold text-slate-600 uppercase">
                    <Calendar size={10} /> {new Date(cl.lastUpdated).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {activeChecklist ? (
            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 md:p-10 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="hidden print:block">
                  <h1 className="text-3xl font-black mb-1 text-slate-900 tracking-tighter uppercase">Relatório de Inspeção Técnica</h1>
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Plataforma Tech Pro Industrial v2.5 • Auditoria Verificada</p>
                </div>
                
                <div className="flex-1 print:hidden">
                  {isEditHeaderMode ? (
                    <input 
                      autoFocus
                      className="bg-slate-800 border-none text-2xl font-black text-white px-2 py-1 rounded-xl w-full focus:ring-2 focus:ring-blue-600"
                      value={activeChecklist.title}
                      onChange={(e) => updateHeaderField('title', e.target.value)}
                      onBlur={() => setIsEditHeaderMode(false)}
                    />
                  ) : (
                    <h3 onClick={() => setIsEditHeaderMode(true)} className="text-2xl font-black text-white hover:text-blue-400 cursor-pointer flex items-center gap-3 group">
                      {activeChecklist.title} <Edit3 size={18} className="opacity-0 group-hover:opacity-100 text-slate-500" />
                    </h3>
                  )}
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button onClick={handleExportPDF} className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest bg-blue-600/10 px-5 py-3 rounded-xl border border-blue-600/20 hover:bg-blue-600/20 transition-all active:scale-95"><FileDown size={16} /> Exportar PDF</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-950/50 p-6 rounded-[24px] border border-slate-800 print:bg-slate-50 print:border-slate-200 print:rounded-none">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserIcon size={16} className="text-blue-500 print:text-slate-400" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Responsável</p>
                      <p className="text-xs font-bold text-slate-200 print:text-black">{activeChecklist.inspectorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-blue-500 print:text-slate-400" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Área Técnica</p>
                      {isEditHeaderMode ? (
                        <input className="bg-slate-800 text-xs font-bold text-white px-1 py-0.5 rounded" value={activeChecklist.category} onChange={(e) => updateHeaderField('category', e.target.value)} />
                      ) : (
                        <p className="text-xs font-bold text-slate-200 print:text-black">{activeChecklist.category}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-blue-500 print:text-slate-400" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Unidade / Local</p>
                      {isEditHeaderMode ? (
                        <input className="bg-slate-800 text-xs font-bold text-white px-1 py-0.5 rounded" value={activeChecklist.location || ''} onChange={(e) => updateHeaderField('location', e.target.value)} />
                      ) : (
                        <p className="text-xs font-bold text-slate-200 print:text-black">{activeChecklist.location || 'Não informado'}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-blue-500 print:text-slate-400" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Data do Registro</p>
                      <p className="text-xs font-bold text-slate-200 print:text-black">{new Date(activeChecklist.lastUpdated).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-10">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 no-print">Itens de Verificação Técnica</h4>
                {activeChecklist.items.map(item => (
                  <div key={item.id} onClick={() => toggleItem(activeChecklist.id, item.id)} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800 cursor-pointer transition-all hover:bg-slate-800 active:scale-[0.99] print:border-b print:bg-transparent print:border-slate-100 print:rounded-none">
                    <div className="no-print">{item.completed ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-slate-600" />}</div>
                    <div className="hidden print:block font-black text-xs">{item.completed ? "[OK]" : "[  ]"}</div>
                    <span className={`flex-1 text-sm font-medium ${item.completed ? 'text-slate-500 line-through' : 'text-slate-200'} print:text-black print:no-underline`}>{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Evidências Visuais (Fotos)</h4>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="no-print flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                  >
                    <Camera size={14} /> Anexar Foto
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
                  {(!activeChecklist.images || activeChecklist.images.length === 0) && (
                    <div className="col-span-full py-8 border-2 border-dashed border-slate-800 rounded-[24px] flex flex-col items-center justify-center gap-2 no-print">
                      <ImageIcon className="text-slate-700" size={32} />
                      <p className="text-xs text-slate-600 font-bold uppercase">Nenhuma evidência fotográfica anexada</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden print:block mt-16 pt-10 border-t border-slate-200">
                <div className="flex justify-between items-center px-10">
                  <div className="text-center w-64">
                    <div className="border-b border-slate-900 mb-2 h-10"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Assinatura do Inspetor</p>
                    <p className="text-[8px] text-slate-500 mt-1">{activeChecklist.inspectorName}</p>
                  </div>
                  <div className="text-center w-64">
                    <div className="border-b border-slate-900 mb-2 h-10"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Visto Supervisão / Gestão</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 p-10 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[40px]">
               <CheckSquare size={64} className="opacity-10 mb-4" />
               <p className="text-center italic">Selecione uma inspeção lateral ou crie um novo relatório utilizando modelos técnicos.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-[40px] p-6 md:p-10 relative shadow-2xl my-8 animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-all p-2 active:scale-90"><X size={24} /></button>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3"><CheckSquare className="text-blue-500" /> Modelos Oficiais</h3>
                  <p className="text-slate-500 text-sm">Use templates verificados para ganhar agilidade.</p>
                </div>
                <div className="space-y-3">
                  {TEMPLATE_MODELS.map((model, idx) => (
                    <button 
                      key={idx}
                      onClick={() => useTemplate(model)}
                      className="w-full text-left p-4 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-blue-500 hover:bg-blue-600/5 transition-all group flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">{model.category}</p>
                        <h4 className="font-bold text-white text-sm group-hover:text-blue-400">{model.title}</h4>
                      </div>
                      <Copy size={16} className="text-slate-600 group-hover:text-blue-500" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 border-l border-slate-800 lg:pl-10">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3"><Plus className="text-emerald-500" /> Relatório Livre</h3>
                  <p className="text-slate-500 text-sm">Crie um checklist totalmente customizado.</p>
                </div>
                
                <form onSubmit={handleCreateChecklist} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Título do Checklist</label>
                    <input required value={newChecklistData.title} onChange={(e) => setNewChecklistData({...newChecklistData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Categoria Técnica</label>
                      <input required value={newChecklistData.category} onChange={(e) => setNewChecklistData({...newChecklistData, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Local Padrão</label>
                      <input required value={newChecklistData.location} onChange={(e) => setNewChecklistData({...newChecklistData, location: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-blue-600" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-xl transition-all uppercase tracking-widest text-xs active:scale-95">Iniciar Inspeção Livre</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklists;
