
import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_ARTICLES, CATEGORIES_FREE, CATEGORIES_PREMIUM, INITIAL_CATALOGS, LEVELS } from '../constants';
// Added X to the import list below to resolve the "Cannot find name 'X'" error
import { Search, Lock, BookOpen, Clock, Tag, FileText, ChevronRight, Folder, Crown, Droplets, ArrowLeft, CheckCircle2, MessageSquare, Download, Circle, Plus, Upload, Trash2, FolderPlus, File as FileIcon, X } from 'lucide-react';
import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { UserProfile, Catalog } from '../types';

const ArticleDetail: React.FC<{ 
  isPremium: boolean; 
  user: UserProfile; 
  onUpdateUser: (u: UserProfile) => void 
}> = ({ isPremium, user, onUpdateUser }) => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const article = INITIAL_ARTICLES.find(a => a.id === articleId);
  const isRead = user.readArticlesIds.includes(articleId || '');
  const isStarted = user.startedArticlesIds?.includes(articleId || '');

  useEffect(() => {
    if (articleId && !isRead && !isStarted) {
      onUpdateUser({
        ...user,
        startedArticlesIds: [...(user.startedArticlesIds || []), articleId]
      });
    }
  }, [articleId]);

  if (!article) return <div className="p-10 text-center text-slate-500">Artigo não encontrado.</div>;

  const handleMarkAsRead = () => {
    if (!isRead && articleId) {
      const newXp = user.xp + 50;
      let newLevel = user.level;
      LEVELS.forEach(l => { if (newXp >= l.minXp) newLevel = l.level; });
      
      onUpdateUser({
        ...user,
        xp: newXp,
        level: newLevel,
        readArticlesIds: [...user.readArticlesIds, articleId],
        startedArticlesIds: (user.startedArticlesIds || []).filter(id => id !== articleId),
        readingGoals: {
          ...user.readingGoals,
          currentMinutesToday: user.readingGoals.currentMinutesToday + article.readTime
        }
      });
    }
  };

  const handleOpenForum = () => {
    navigate('/forum', { state: { initialTitle: `Dúvida: ${article.title}` } });
  };

  const isLocked = article.isPremium && !isPremium;

  if (isLocked) {
    return (
      <div className="max-w-2xl mx-auto py-12 md:py-20 text-center space-y-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 mx-4">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto border border-amber-500/20">
          <Lock size={32} className="text-amber-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center justify-center gap-2">
            Conteúdo Premium <Crown size={24} className="text-amber-500" />
          </h2>
          <p className="text-slate-500 text-sm md:text-base">Este artigo faz parte da base de conhecimento avançada exclusiva para assinantes.</p>
        </div>
        <Link to="/profile" className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-xl font-black transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest text-[10px] md:text-xs w-full md:w-auto">
          Assinar Premium Agora
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-[10px] md:text-sm uppercase tracking-widest px-2">
        <ArrowLeft size={18} /> Voltar para Biblioteca
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl mx-1 md:mx-0">
        <div className="h-48 md:h-64 relative">
          <img src={article.imageUrl} className="w-full h-full object-cover opacity-50" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600/20 border border-blue-600/30 text-blue-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{article.category}</span>
              {article.isPremium && <Crown size={14} className="text-amber-500" />}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white mt-3 md:mt-4 tracking-tight leading-tight">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-3 md:mt-4 text-slate-500 text-[10px] md:text-sm font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock size={14} /> {article.readTime} min</span>
              <span className="flex items-center gap-1.5"><Tag size={14} /> Especialista</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-12 space-y-6 text-slate-300 leading-relaxed text-base md:text-lg">
          <p className="font-bold text-white text-lg md:text-xl border-l-4 border-blue-600 pl-4 italic bg-blue-600/5 py-2">
            "A análise correta das variáveis de campo é o primeiro passo para uma manutenção de alta performance."
          </p>
          <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed opacity-90">{article.content}</div>
          
          <div className="flex flex-col md:flex-row gap-4 pt-8">
            <button 
              onClick={handleMarkAsRead}
              disabled={isRead}
              className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isRead ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20'}`}
            >
              {isRead ? <><CheckCircle2 size={20} /> Concluído</> : 'Marcar como Lido (+50 XP)'}
            </button>
            <button 
              onClick={handleOpenForum}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare size={20} /> Discutir no Fórum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LibraryList: React.FC<{ isPremium: boolean; isAdmin: boolean }> = ({ isPremium, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'articles' | 'catalogs'>('articles');
  
  // Catalogs State
  const [catalogs, setCatalogs] = useState<Catalog[]>(INITIAL_CATALOGS);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  
  // Dynamic Categories for Catalogs
  const [catalogCategories, setCatalogCategories] = useState<string[]>([...new Set(INITIAL_CATALOGS.map(c => c.category))]);

  const filteredArticles = INITIAL_ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? art.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const articleCategories = [...new Set(INITIAL_ARTICLES.map(a => a.category))];

  // Logic for Admin upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAddCatalog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    
    // Simulate upload
    setUploadProgress(10);
    const interval = setInterval(() => {
        setUploadProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                const newCatalog: Catalog = {
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    category,
                    fileUrl: '#'
                };
                setCatalogs([...catalogs, newCatalog]);
                setIsCatalogModalOpen(false);
                setUploadProgress(0);
                return 100;
            }
            return prev + 30;
        });
    }, 400);
  };

  const handleAddFolder = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const name = formData.get('folderName') as string;
      if (name && !catalogCategories.includes(name)) {
          setCatalogCategories([...catalogCategories, name]);
      }
      setIsFolderModalOpen(false);
  };

  const deleteCatalog = (id: string) => {
      if (window.confirm('Excluir este catálogo permanentemente?')) {
          setCatalogs(catalogs.filter(c => c.id !== id));
      }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Biblioteca Técnica</h2>
          <p className="text-slate-500">Acesse o conhecimento industrial mais avançado.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder={viewTab === 'articles' ? "Buscar artigo ou norma..." : "Buscar nos catálogos..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 w-full max-w-md mx-auto">
        <button 
          onClick={() => setViewTab('articles')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${viewTab === 'articles' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
        >
          <BookOpen size={16} /> Artigos Técnicos
        </button>
        <button 
          onClick={() => setViewTab('catalogs')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${viewTab === 'catalogs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
        >
          <Folder size={16} /> Catálogos Diversos
        </button>
      </div>

      {viewTab === 'articles' ? (
        <>
          <div className="flex overflow-x-auto gap-2 pb-4 custom-scrollbar whitespace-nowrap">
            <button 
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border shrink-0 ${!activeCategory ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
            >
              Todos
            </button>
            {articleCategories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border shrink-0 flex items-center gap-2 ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
              >
                {cat}
                {CATEGORIES_PREMIUM.includes(cat) && <Crown size={12} className={activeCategory === cat ? 'text-blue-200' : 'text-amber-500'} />}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <Link 
                key={article.id}
                to={`/library/article/${article.id}`}
                className="bg-slate-900 border border-slate-800 rounded-[24px] overflow-hidden group hover:border-blue-500 transition-all active:scale-95 touch-manipulation flex flex-col"
              >
                <div className="h-40 relative overflow-hidden">
                  <img src={article.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  {article.isPremium && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 p-1.5 rounded-lg shadow-lg">
                      <Crown size={14} />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4">
                     <span className="bg-blue-600/20 border border-blue-600/30 text-blue-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{article.category}</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-bold text-white text-base leading-tight mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">{article.title}</h4>
                  <div className="mt-auto flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {article.readTime} min</span>
                    <span className="flex items-center gap-1 text-blue-500">Ler Agora <ChevronRight size={12} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {selectedFolder && (
                    <button 
                        onClick={() => setSelectedFolder(null)}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h3 className="text-xl font-bold text-white">
                    {selectedFolder ? `Pasta: ${selectedFolder}` : 'Pastas de Catálogos'}
                </h3>
              </div>
              
              {isAdmin && (
                  <div className="flex items-center gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => setIsFolderModalOpen(true)}
                        className="flex-1 md:flex-none px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-700"
                      >
                          <FolderPlus size={18} /> Nova Pasta
                      </button>
                      <button 
                        onClick={() => setIsCatalogModalOpen(true)}
                        className="flex-1 md:flex-none px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20"
                      >
                          <Upload size={18} /> Upload PDF
                      </button>
                  </div>
              )}
          </div>

          {!selectedFolder ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {catalogCategories.map(cat => {
                      const count = catalogs.filter(c => c.category === cat).length;
                      return (
                        <button 
                            key={cat}
                            onClick={() => setSelectedFolder(cat)}
                            className="bg-slate-900 border border-slate-800 p-6 rounded-[24px] flex flex-col items-center justify-center gap-3 hover:border-blue-500 transition-all group active:scale-95 touch-manipulation"
                        >
                            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <Folder size={32} />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-white text-sm line-clamp-1">{cat}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{count} Arquivos</p>
                            </div>
                        </button>
                      );
                  })}
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catalogs.filter(c => c.category === selectedFolder).map(cat => (
                      <div 
                        key={cat.id}
                        className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between group hover:border-emerald-500/50 transition-all"
                      >
                          <div className="flex items-center gap-4 min-w-0">
                              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                                  <FileText size={24} />
                              </div>
                              <div className="min-w-0">
                                  <h4 className="font-bold text-white text-sm truncate">{cat.name}</h4>
                                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Documento PDF • Verificado</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              {isAdmin && (
                                  <button 
                                    onClick={() => deleteCatalog(cat.id)}
                                    className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                                  >
                                      <Trash2 size={16} />
                                  </button>
                              )}
                              <a 
                                href={cat.fileUrl} 
                                className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
                                title="Download"
                              >
                                  <Download size={18} />
                              </a>
                          </div>
                      </div>
                  ))}
                  {catalogs.filter(c => c.category === selectedFolder).length === 0 && (
                      <div className="col-span-full py-20 text-center text-slate-500 flex flex-col items-center gap-4">
                          <Folder size={48} className="opacity-20" />
                          <p>Nenhum catálogo nesta pasta ainda.</p>
                      </div>
                  )}
              </div>
          )}
        </div>
      )}

      {/* Upload Catalog Modal */}
      {isCatalogModalOpen && (
          <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[32px] p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                  <button onClick={() => setIsCatalogModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                      <X size={24} />
                  </button>
                  <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                      <Upload className="text-blue-500" /> Upload de Catálogo
                  </h3>
                  <p className="text-slate-500 text-sm mb-8">O arquivo será processado e disponibilizado na pasta selecionada.</p>
                  
                  <form onSubmit={handleAddCatalog} className="space-y-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome do Equipamento/Catálogo</label>
                          <input 
                            name="name" 
                            required 
                            placeholder="Ex: Catálogo Bombas Rexroth V4" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                          />
                      </div>
                      
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pasta de Destino (Categoria)</label>
                          <select 
                            name="category" 
                            required 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none"
                          >
                              {catalogCategories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Arquivo PDF</label>
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all group"
                          >
                              <FileIcon size={32} className="text-slate-700 group-hover:text-blue-500" />
                              <p className="text-sm font-bold text-slate-500">Clique para selecionar PDF</p>
                              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" />
                          </div>
                      </div>

                      {uploadProgress > 0 && (
                          <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                  <span>Fazendo Upload...</span>
                                  <span>{uploadProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                              </div>
                          </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={uploadProgress > 0}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs active:scale-95"
                      >
                          {uploadProgress > 0 ? 'Processando Arquivo...' : 'Finalizar Upload'}
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* Add Folder Modal */}
      {isFolderModalOpen && (
          <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[32px] p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                  <button onClick={() => setIsFolderModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                      <X size={24} />
                  </button>
                  <h3 className="text-xl font-black text-white mb-2 flex items-center gap-3">
                      <FolderPlus className="text-blue-500" /> Nova Pasta
                  </h3>
                  <p className="text-slate-500 text-xs mb-6">Crie um novo assunto para organizar seus catálogos.</p>
                  
                  <form onSubmit={handleAddFolder} className="space-y-4">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome da Categoria/Assunto</label>
                          <input 
                            name="folderName" 
                            required 
                            autoFocus
                            placeholder="Ex: Britagem Secundária" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all" 
                          />
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs active:scale-95"
                      >
                          Criar Pasta Agora
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

const Library: React.FC<{ 
  isPremium: boolean; 
  isAdmin: boolean; 
  user: UserProfile; 
  onUpdateUser: (u: UserProfile) => void 
}> = ({ isPremium, isAdmin, user, onUpdateUser }) => {
  return (
    <Routes>
      <Route path="/" element={<LibraryList isPremium={isPremium} isAdmin={isAdmin} />} />
      <Route path="/article/:articleId" element={<ArticleDetail isPremium={isPremium} user={user} onUpdateUser={onUpdateUser} />} />
    </Routes>
  );
};

export default Library;
