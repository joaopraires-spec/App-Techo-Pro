
import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_ARTICLES, CATEGORIES_FREE, CATEGORIES_PREMIUM, INITIAL_CATALOGS, LEVELS } from '../constants';
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
      <div className="max-w-2xl mx-auto py-12 sm:py-20 text-center space-y-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 mx-2 sm:mx-4 shadow-2xl">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-500/10 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
          <Lock size={32} className="text-amber-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
            Conteúdo Premium <Crown size={24} className="text-amber-500" />
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">Este artigo faz parte da base de conhecimento avançada exclusiva para assinantes Specialist Pro.</p>
        </div>
        <Link to="/profile" className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4.5 rounded-2xl font-black transition-all shadow-xl shadow-amber-500/30 uppercase tracking-widest text-[10px] sm:text-xs w-full sm:w-auto active:scale-95">
          Assinar Premium Agora
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-[10px] uppercase tracking-widest px-2 bg-slate-900/50 py-2 rounded-xl border border-slate-800 w-fit">
        <ArrowLeft size={16} /> Voltar para Biblioteca
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl mx-0 sm:mx-1">
        <div className="h-48 sm:h-56 md:h-64 relative">
          <img src={article.imageUrl} className="w-full h-full object-cover opacity-50" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <span className="bg-blue-600/20 border border-blue-600/30 text-blue-400 text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">{article.category}</span>
              {article.isPremium && <Crown size={14} className="text-amber-500 drop-shadow-md" />}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-white tracking-tight leading-tight flex items-center flex-wrap gap-2">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-slate-500 text-[9px] sm:text-[10px] md:text-sm font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock size={14} /> {article.readTime} min</span>
              <span className="flex items-center gap-1.5"><Tag size={14} /> Especialista</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 md:p-12 space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base md:text-lg">
          <p className="font-bold text-white text-base sm:text-lg md:text-xl border-l-4 border-blue-600 pl-4 italic bg-blue-600/5 py-3 rounded-r-2xl shadow-sm">
            "A análise correta das variáveis de campo é o primeiro passo para uma manutenção de alta performance e disponibilidade mecânica."
          </p>
          <div className="whitespace-pre-wrap leading-relaxed opacity-90 text-sm sm:text-base">{article.content}</div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-8 no-print">
            <button 
              onClick={handleMarkAsRead}
              disabled={isRead}
              className={`flex-1 py-4.5 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${isRead ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-none' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30 border border-blue-500/50'}`}
            >
              {isRead ? <><CheckCircle2 size={18} /> Conteúdo Concluído</> : 'Marcar como Lido (+50 XP)'}
            </button>
            <button 
              onClick={handleOpenForum}
              className="flex-1 py-4.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-slate-700 shadow-md active:scale-95"
            >
              <MessageSquare size={18} /> Discutir Soluções
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LibraryList: React.FC<{ isPremium: boolean; isAdmin: boolean; user: UserProfile }> = ({ isPremium, isAdmin, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'articles' | 'catalogs'>('articles');
  
  const [catalogs, setCatalogs] = useState<Catalog[]>(INITIAL_CATALOGS);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  
  const [catalogCategories, setCatalogCategories] = useState<string[]>([...new Set(INITIAL_CATALOGS.map(c => c.category))]);

  const filteredArticles = INITIAL_ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? art.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const articleCategories = [...new Set(INITIAL_ARTICLES.map(a => a.category))];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAddCatalog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    
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
        <div className="px-1 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Biblioteca Técnica</h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1">Acesse o conhecimento industrial mais avançado.</p>
        </div>
        <div className="relative w-full md:w-96 shadow-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder={viewTab === 'articles' ? "Buscar artigo..." : "Buscar catálogos..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm shadow-inner"
          />
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 w-full max-w-md mx-auto shadow-inner">
        <button 
          onClick={() => setViewTab('articles')}
          className={`flex-1 py-3.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${viewTab === 'articles' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-white'}`}
        >
          <BookOpen size={16} /> Artigos
        </button>
        <button 
          onClick={() => setViewTab('catalogs')}
          className={`flex-1 py-3.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${viewTab === 'catalogs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-white'}`}
        >
          <Folder size={16} /> Catálogos
        </button>
      </div>

      {viewTab === 'articles' ? (
        <>
          <div className="flex overflow-x-auto gap-2.5 pb-3 no-scrollbar whitespace-nowrap px-1 sm:px-0 scroll-smooth">
            <button 
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${!activeCategory ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/10' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 shadow-sm'}`}
            >
              Todos
            </button>
            {articleCategories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 flex items-center gap-2 ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/10' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 shadow-sm'}`}
              >
                {cat}
                {CATEGORIES_PREMIUM.includes(cat) && <Crown size={12} className={activeCategory === cat ? 'text-blue-200' : 'text-amber-500'} />}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredArticles.map(article => {
              const isRead = user.readArticlesIds.includes(article.id);
              const isStarted = user.startedArticlesIds?.includes(article.id);
              
              return (
                <Link 
                  key={article.id}
                  to={`/library/article/${article.id}`}
                  className="bg-slate-900 border border-slate-800 rounded-[28px] overflow-hidden group hover:border-blue-500 transition-all active:scale-95 touch-manipulation flex flex-col shadow-lg"
                >
                  <div className="h-40 relative overflow-hidden">
                    <img src={article.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    {article.isPremium && (
                      <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 p-1.5 rounded-xl shadow-xl drop-shadow-lg">
                        <Crown size={14} />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
                       <span className="bg-blue-600/20 border border-blue-600/30 text-blue-400 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">{article.category}</span>
                       {isRead && (
                         <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-sm">
                           <CheckCircle2 size={10} /> Lido
                         </span>
                       )}
                       {(!isRead && isStarted) && (
                         <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse shadow-sm backdrop-blur-sm">
                           <Clock size={10} /> Em Curso
                         </span>
                       )}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h4 className="font-bold text-white text-base leading-tight mb-4 group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3rem]">
                      {article.title}
                    </h4>
                    <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {article.readTime} min</span>
                      <span className="flex items-center gap-1 text-blue-500">Ler Agora <ChevronRight size={12} /></span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 px-1 sm:px-0">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {selectedFolder && (
                    <button 
                        onClick={() => setSelectedFolder(null)}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all shadow-md active:scale-90"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h3 className="text-xl font-bold text-white tracking-tight truncate">
                    {selectedFolder ? selectedFolder : 'Pastas Técnicas'}
                </h3>
              </div>
              
              {isAdmin && (
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => setIsFolderModalOpen(true)}
                        className="flex-1 sm:flex-none px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all"
                      >
                          <FolderPlus size={18} /> Pasta
                      </button>
                      <button 
                        onClick={() => setIsCatalogModalOpen(true)}
                        className="flex-1 sm:flex-none px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
                      >
                          <Upload size={18} /> PDF
                      </button>
                  </div>
              )}
          </div>

          {!selectedFolder ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-1 sm:px-0">
                  {catalogCategories.map(cat => {
                      const count = catalogs.filter(c => c.category === cat).length;
                      return (
                        <button 
                            key={cat}
                            onClick={() => setSelectedFolder(cat)}
                            className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:border-blue-500 transition-all group active:scale-95 touch-manipulation shadow-lg"
                        >
                            <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                <Folder size={28} />
                            </div>
                            <div className="text-center w-full">
                                <p className="font-bold text-white text-xs sm:text-sm line-clamp-1 px-1">{cat}</p>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1.5">{count} Arquivos</p>
                            </div>
                        </button>
                      );
                  })}
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-1 sm:px-0">
                  {catalogs.filter(c => c.category === selectedFolder).map(cat => (
                      <div 
                        key={cat.id}
                        className="bg-slate-900 border border-slate-800 p-5 rounded-[24px] flex items-center justify-between group hover:border-emerald-500/50 transition-all shadow-lg active:scale-[0.99] touch-manipulation"
                      >
                          <div className="flex items-center gap-4 min-w-0">
                              <div className="w-11 h-11 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 shadow-inner">
                                  <FileText size={22} />
                              </div>
                              <div className="min-w-0">
                                  <h4 className="font-bold text-white text-sm truncate pr-1">{cat.name}</h4>
                                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Documento PDF • Verificado</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              {isAdmin && (
                                  <button 
                                    onClick={() => deleteCatalog(cat.id)}
                                    className="p-2.5 text-slate-600 hover:text-red-500 transition-colors bg-slate-950 rounded-xl"
                                  >
                                      <Trash2 size={16} />
                                  </button>
                              )}
                              <a 
                                href={cat.fileUrl} 
                                className="p-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all shadow-md active:scale-90"
                                title="Download"
                              >
                                  <Download size={18} />
                              </a>
                          </div>
                      </div>
                  ))}
                  {catalogs.filter(c => c.category === selectedFolder).length === 0 && (
                      <div className="col-span-full py-24 text-center text-slate-500 flex flex-col items-center gap-4 bg-slate-900/30 border border-dashed border-slate-800 rounded-[40px] shadow-inner">
                          <Folder size={48} className="opacity-20" />
                          <p className="text-sm font-medium">Nenhum catálogo nesta pasta técnica ainda.</p>
                      </div>
                  )}
              </div>
          )}
        </div>
      )}

      {/* Modais omitidos no resumo, mas permanecem no código original com ajustes de padding para mobile */}
      {isCatalogModalOpen && (
          <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[32px] p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
                  <button onClick={() => setIsCatalogModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors bg-slate-800 p-2 rounded-xl active:scale-90">
                      <X size={20} />
                  </button>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 flex items-center gap-3">
                      <Upload className="text-blue-500" /> Upload de Catálogo
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mb-8 leading-relaxed">O arquivo será processado e disponibilizado na pasta selecionada para toda a comunidade.</p>
                  
                  <form onSubmit={handleAddCatalog} className="space-y-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome do Catálogo</label>
                          <input 
                            name="name" 
                            required 
                            placeholder="Ex: Catálogo Bombas V4" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm shadow-inner" 
                          />
                      </div>
                      
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pasta de Destino</label>
                          <select 
                            name="category" 
                            required 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none text-sm shadow-inner"
                          >
                              {catalogCategories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Arquivo PDF</label>
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-slate-800 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all group shadow-inner"
                          >
                              <FileIcon size={32} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                              <p className="text-xs sm:text-sm font-bold text-slate-500 group-hover:text-slate-400">Clique para selecionar PDF</p>
                              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" />
                          </div>
                      </div>

                      {uploadProgress > 0 && (
                          <div className="space-y-2 px-1">
                              <div className="flex justify-between text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                  <span>Fazendo Upload...</span>
                                  <span>{uploadProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                                  <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                              </div>
                          </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={uploadProgress > 0}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-4.5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs active:scale-95"
                      >
                          {uploadProgress > 0 ? 'Processando Arquivo...' : 'Finalizar Upload'}
                      </button>
                  </form>
              </div>
          </div>
      )}

      {isFolderModalOpen && (
          <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[32px] p-7 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                  <button onClick={() => setIsFolderModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800 p-2 rounded-xl active:scale-90 transition-all">
                      <X size={18} />
                  </button>
                  <h3 className="text-lg sm:text-xl font-black text-white mb-2 flex items-center gap-3">
                      <FolderPlus className="text-blue-500" /> Nova Pasta
                  </h3>
                  <p className="text-slate-500 text-[11px] sm:text-xs mb-6 leading-relaxed">Crie um novo assunto técnico para organizar seus documentos.</p>
                  
                  <form onSubmit={handleAddFolder} className="space-y-4">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Nome da Pasta</label>
                          <input 
                            name="folderName" 
                            required 
                            autoFocus
                            placeholder="Ex: Britagem Secundária" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm shadow-inner" 
                          />
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4.5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs active:scale-95 mt-2"
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
      <Route path="/" element={<LibraryList isPremium={isPremium} isAdmin={isAdmin} user={user} />} />
      <Route path="/article/:articleId" element={<ArticleDetail isPremium={isPremium} user={user} onUpdateUser={onUpdateUser} />} />
    </Routes>
  );
};

export default Library;
