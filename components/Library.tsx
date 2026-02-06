
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

const LibraryList: React.FC<{ isPremium: boolean }> = ({ isPremium }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredArticles = INITIAL_ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? art.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(INITIAL_ARTICLES.map(a => a.category))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Biblioteca Técnica</h2>
          <p className="text-slate-500">Acesse o conhecimento industrial mais avançado.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar artigo ou norma..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${!activeCategory ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
        >
          Todos
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
          >
            {cat}
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
    </div>
  );
};

// Fix for default export error in App.tsx
const Library: React.FC<{ 
  isPremium: boolean; 
  isAdmin: boolean; 
  user: UserProfile; 
  onUpdateUser: (u: UserProfile) => void 
}> = ({ isPremium, isAdmin, user, onUpdateUser }) => {
  return (
    <Routes>
      <Route path="/" element={<LibraryList isPremium={isPremium} />} />
      <Route path="/article/:articleId" element={<ArticleDetail isPremium={isPremium} user={user} onUpdateUser={onUpdateUser} />} />
    </Routes>
  );
};

export default Library;
