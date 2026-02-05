
import React, { useState, useEffect } from 'react';
import { INITIAL_ARTICLES, CATEGORIES_FREE, CATEGORIES_PREMIUM, INITIAL_CATALOGS, LEVELS } from '../constants';
import { Search, Lock, BookOpen, Clock, Tag, FileText, ChevronRight, Folder, Crown, Droplets, ArrowLeft, CheckCircle2, MessageSquare, Download, Circle } from 'lucide-react';
import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

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
          <h2 className="text-xl md:text-2xl font-black text-white">Conteúdo Premium</h2>
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
            <span className="bg-blue-600/20 border border-blue-600/30 text-blue-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{article.category}</span>
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
          
          <div className="flex flex-col sm:flex-row gap-3 pt-8 md:pt-10 border-t border-slate-800">
            <button 
              onClick={handleMarkAsRead}
              disabled={isRead}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all touch-manipulation ${isRead ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/30' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-95'}`}
            >
              <CheckCircle2 size={18} /> {isRead ? 'Artigo Concluído' : 'Marcar como Lido (+50 XP)'}
            </button>
            <button 
              onClick={handleOpenForum}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest text-[10px] md:text-xs transition-all border border-slate-700 active:scale-95 touch-manipulation"
            >
              <MessageSquare size={18} /> Abrir Tópico no Fórum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LibraryHome: React.FC<{ isPremium: boolean, user: UserProfile }> = ({ isPremium, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeTab, setActiveTab] = useState<'articles' | 'catalogs'>('articles');

  const filteredArticles = INITIAL_ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'Todas' || art.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const filteredCatalogs = INITIAL_CATALOGS.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'Todas' || cat.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const allCategories = ['Todas', ...CATEGORIES_FREE, ...CATEGORIES_PREMIUM];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Biblioteca Técnica</h2>
          <p className="text-slate-500 text-sm">Base de conhecimento profunda para o campo.</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
          <button onClick={() => setActiveTab('articles')} className={`px-4 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'articles' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Artigos</button>
          <button onClick={() => setActiveTab('catalogs')} className={`px-4 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'catalogs' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500'}`}>Catálogos</button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder={`Buscar em ${activeTab === 'articles' ? 'artigos' : 'catálogos'}...`} 
          className="w-full bg-[#111827]/80 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all shadow-inner text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 pt-1 touch-pan-x">
        {allCategories.map(cat => {
          const isCatPremium = CATEGORIES_PREMIUM.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all touch-manipulation ${
                activeCategory === cat 
                  ? 'bg-blue-600/20 border-blue-600/50 text-blue-400' 
                  : 'bg-[#111827] border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              {isCatPremium && <Crown size={12} className="text-amber-500" />}
              {cat}
            </button>
          );
        })}
      </div>

      {activeTab === 'catalogs' && !isPremium ? (
        <div className="bg-slate-900 border border-amber-500/20 rounded-[32px] p-10 md:p-16 text-center">
          <Lock size={40} className="text-amber-500 mx-auto mb-6" />
          <h3 className="text-xl md:text-2xl font-black text-white mb-3">Acesso Restrito</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm">Catálogos e manuais técnicos de fabricantes são exclusivos para assinantes Premium.</p>
          <Link to="/profile" className="bg-amber-500 text-slate-950 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] w-full md:w-auto inline-block">Upgrade Agora</Link>
        </div>
      ) : activeTab === 'catalogs' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCatalogs.map(cat => (
            <div key={cat.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] group hover:border-blue-500/50 transition-all">
              <Folder size={32} className="text-blue-500 mb-4" />
              <h4 className="font-bold text-white mb-1">{cat.name}</h4>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-6">{cat.category}</p>
              <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95 touch-manipulation">
                <Download size={16} /> Baixar PDF
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredArticles.map(article => {
            const isLocked = article.isPremium && !isPremium;
            const isRead = user.readArticlesIds.includes(article.id);
            const isStarted = user.startedArticlesIds?.includes(article.id);
            
            return (
              <Link 
                to={isLocked ? '/profile' : `/library/article/${article.id}`} 
                key={article.id}
                className="bg-slate-900 border border-slate-800 rounded-[28px] overflow-hidden group hover:border-blue-500/50 transition-all shadow-xl flex flex-col h-full active:scale-[0.98] touch-manipulation"
              >
                <div className="h-40 relative overflow-hidden shrink-0">
                  <img src={article.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" alt="" />
                  {isLocked && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="text-center">
                        <Lock size={20} className="text-amber-500 mx-auto mb-2" />
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Premium</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-slate-950/80 text-blue-400 text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded border border-blue-500/20">{article.category}</span>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800/50">
                    <div 
                      className={`h-full transition-all duration-700 ease-out ${
                        isRead ? 'bg-emerald-500 w-full' : isStarted ? 'bg-blue-600 w-[35%]' : 'bg-slate-700 w-0'
                      }`} 
                    />
                  </div>
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h4 className="font-bold text-white text-base md:text-lg group-hover:text-blue-400 transition-colors leading-tight mb-4 line-clamp-2">{article.title}</h4>
                  <div className="mt-auto flex items-center justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="flex items-center gap-1.5 text-slate-500"><Clock size={14} /> {article.readTime}m</span>
                      {isRead ? (
                        <span className="flex items-center gap-1.5 text-emerald-500">
                          <CheckCircle2 size={14} /> Lido
                        </span>
                      ) : isStarted ? (
                        <span className="flex items-center gap-1.5 text-blue-400">
                           Lendo...
                        </span>
                      ) : null}
                    </div>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-all text-blue-500" />
                  </div>
                </div>
              </Link>
            );
          })}
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
      <Route path="/" element={<LibraryHome isPremium={isPremium} user={user} />} />
      <Route path="/article/:articleId" element={<ArticleDetail isPremium={isPremium} user={user} onUpdateUser={onUpdateUser} />} />
    </Routes>
  );
};

export default Library;
