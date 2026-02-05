
import React from 'react';
import { INITIAL_ARTICLES } from '../constants';
import { History, Search, BookOpen, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
// Added Link to imports from react-router-dom to fix "Cannot find name 'Link'" error
import { useNavigate, Link } from 'react-router-dom';
import { UserProfile } from '../types';

const ReadingHistory: React.FC<{ user: UserProfile }> = ({ user }) => {
  const navigate = useNavigate();
  
  // Mapeia os artigos reais lidos a partir dos IDs no perfil do usuário
  const readArticles = INITIAL_ARTICLES
    .filter(art => user.readArticlesIds.includes(art.id))
    .map(art => ({
      ...art,
      readDate: 'Recentemente', // Em um sistema real, salvaríamos a data da leitura
      rating: 5
    }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <History className="text-violet-500" size={32} /> Histórico de Leitura
          </h2>
          <p className="text-slate-500 text-sm mt-1">Todos os artigos técnicos que você completou.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2">
           <CheckCircle2 className="text-emerald-500" size={16} />
           <span className="text-xs font-bold text-white uppercase tracking-widest">{readArticles.length} Artigos Lidos</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Pesquisar no seu histórico..." 
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="divide-y divide-slate-800">
          {readArticles.map((article) => (
            <div 
              key={article.id} 
              onClick={() => navigate(`/library/article/${article.id}`)}
              className="p-6 flex items-center justify-between hover:bg-slate-800/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shrink-0">
                  <img src={article.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{article.title}</h4>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {article.category}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime} min</span>
                    <span className="text-emerald-500">Concluído</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
        
        {readArticles.length === 0 && (
          <div className="p-20 text-center">
            <BookOpen size={48} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">Você ainda não completou nenhum artigo técnico.</p>
            <Link to="/library" className="inline-block mt-4 text-blue-500 font-bold hover:underline">Ir para a Biblioteca</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingHistory;
