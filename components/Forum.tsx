
import React, { useState } from 'react';
import { UserProfile, UserPlan, ForumPost } from '../types';
import { MessageSquare, Plus, Search, User as UserIcon, Calendar, ArrowRight, X, Trash2, Pencil, ShieldAlert, ArrowLeft, Send, Check, Trophy, AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { LEVELS } from '../constants';

interface PostReply {
  id: string;
  postId: string;
  author: string;
  authorEmail: string;
  date: string;
  content: string;
  isEdited: boolean;
  editedBy?: string;
  authorLevel?: string;
}

const Forum: React.FC<{ user: UserProfile }> = ({ user }) => {
  const location = useLocation();
  const isAdmin = user.role === 'admin';
  
  // Função para pegar o título do nível baseado no XP (simulado para outros autores)
  const getAuthorLevelTitle = (xp: number = 0) => {
    let title = LEVELS[0].title;
    let medal = LEVELS[0].medal;
    LEVELS.forEach(l => { if (xp >= l.minXp) { title = l.title; medal = l.medal; } });
    return { title, medal };
  };

  const userLevelInfo = getAuthorLevelTitle(user.xp);

  const [posts, setPosts] = useState<ForumPost[]>([
    { 
      id: '1', 
      title: 'Dúvida: Desgaste excessivo em camisas de britador primário', 
      author: 'João Mecânico', 
      date: '15/05/2024', 
      content: 'Estamos notando um desgaste 30% mais rápido que o normal na britagem primária. Alguém já testou ligas de manganês customizadas ou ajustou o setting de fechamento para mitigar isso?', 
      replies: 12 
    },
    { 
      id: '2', 
      title: 'Melhores práticas em lubrificação centralizada', 
      author: 'Eng. Roberto', 
      date: '14/05/2024', 
      content: 'Qual a periodicidade ideal para inspeção de bicos em sistemas de graxa automática em ambientes de alta poeira? Estamos tendo entupimentos frequentes nos distribuidores progressivos.', 
      replies: 8 
    },
    { 
      id: '3', 
      title: 'Falha catastrófica em redutores SEW - Análise de óleo', 
      author: 'Téc. Marcos Silva', 
      date: '02/05/2024', 
      content: 'A última análise de óleo indicou alta concentração de partículas de ferro (PQ Index acima de 500). Suspeitamos de fadiga nos dentes do pinhão. Alguém já utilizou aditivos de extrema pressão para prolongar a vida útil antes do shutdown?', 
      replies: 24 
    }
  ]);

  const [replies, setReplies] = useState<PostReply[]>([
    { id: 'r1', postId: '1', author: 'Eng. Carlos', authorEmail: 'carlos@tech.com', date: '16/05/2024', content: 'Eu recomendo verificar se a granulometria do material de alimentação não mudou drasticamente.', isEdited: false, authorLevel: 'Técnico I' },
    { id: 'r2', postId: '1', author: 'Sérgio Manut', authorEmail: 'sergio@manut.com', date: '17/05/2024', content: 'Manganês com 18-20% costuma durar mais em britagem de granito.', isEdited: false, authorLevel: 'Especialista' },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ title: location.state?.initialTitle || '', content: '' });
  const [replyText, setReplyText] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const activePost = posts.find(p => p.id === selectedPostId);
  const activeReplies = replies.filter(r => r.postId === selectedPostId);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      author: user.name,
      date: new Date().toLocaleDateString('pt-BR'),
      content: newPost.content,
      replies: 0
    };
    setPosts([p, ...posts]);
    setShowForm(false);
    setNewPost({ title: '', content: '' });
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedPostId) return;

    const newReply: PostReply = {
      id: Date.now().toString(),
      postId: selectedPostId,
      author: user.name,
      authorEmail: user.email,
      date: new Date().toLocaleDateString('pt-BR'),
      content: replyText,
      isEdited: false,
      authorLevel: userLevelInfo.title
    };

    setReplies([...replies, newReply]);
    setReplyText('');
    setPosts(posts.map(p => p.id === selectedPostId ? { ...p, replies: p.replies + 1 } : p));
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim() || !editingReplyId) return;
    setReplies(replies.map(r => r.id === editingReplyId ? { ...r, content: editText, isEdited: true, editedBy: user.name } : r));
    setEditingReplyId(null);
    setEditText('');
  };

  const deletePost = (id: string) => {
    if (window.confirm('Excluir este tópico permanentemente?')) {
      setPosts(posts.filter(p => p.id !== id));
      if (selectedPostId === id) setSelectedPostId(null);
    }
  };

  const deleteReply = (replyId: string) => {
    if (window.confirm('Deseja excluir esta mensagem permanentemente?')) {
      const replyToDelete = replies.find(r => r.id === replyId);
      if (replyToDelete) {
        setReplies(replies.filter(r => r.id !== replyId));
        setPosts(posts.map(p => p.id === replyToDelete.postId ? { ...p, replies: Math.max(0, p.replies - 1) } : p));
      }
    }
  };

  const clearForum = () => {
    if (window.confirm('AVISO: Você está prestes a apagar TODOS os tópicos e mensagens do fórum. Esta ação é irreversível. Deseja continuar?')) {
      setPosts([]);
      setReplies([]);
      setSelectedPostId(null);
    }
  };

  if (selectedPostId && activePost) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button onClick={() => setSelectedPostId(null)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
          <ArrowLeft size={18} /> Voltar
        </button>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] shadow-2xl relative">
          {isAdmin && (
            <button 
              onClick={() => deletePost(activePost.id)}
              className="absolute top-6 right-6 p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg"
              title="Excluir Tópico"
            >
              <Trash2 size={20} />
            </button>
          )}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-xl">
              {activePost.author.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">{activePost.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  Publicado por {activePost.author} • {activePost.date}
                </span>
                <span className="text-[8px] bg-blue-600/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                   Especialista
                </span>
              </div>
            </div>
          </div>
          <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap mb-8">{activePost.content}</div>
          <div className="pt-6 border-t border-slate-800 text-blue-400 text-xs font-bold flex items-center gap-2">
            <MessageSquare size={16} /> {activePost.replies} Respostas na discussão
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white px-2">Comentários Técnicos</h3>
          <div className="space-y-4">
            {activeReplies.map(reply => (
              <div key={reply.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl relative group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">
                      {reply.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{reply.author}</p>
                        {reply.authorLevel && (
                          <span className="text-[8px] font-black uppercase tracking-widest bg-blue-600/10 text-blue-500 px-2 py-0.5 rounded-full border border-blue-500/10">
                            {reply.authorLevel}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">{reply.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {(reply.authorEmail === user.email || isAdmin) && (
                      <button onClick={() => { setEditingReplyId(reply.id); setEditText(reply.content); }} className="p-2 text-slate-500 hover:text-blue-400 transition-all">
                        <Pencil size={16} />
                      </button>
                    )}
                    {isAdmin && (
                      <button onClick={() => deleteReply(reply.id)} className="p-2 text-slate-500 hover:text-red-500 transition-all">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                {editingReplyId === reply.id ? (
                  <form onSubmit={saveEdit} className="space-y-3">
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-slate-950 border border-blue-600/50 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:ring-1 min-h-[100px]" />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                        <Check size={14} /> Salvar
                      </button>
                      <button onClick={() => setEditingReplyId(null)} className="text-slate-500 hover:text-white px-4 py-2 text-xs font-bold">Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <p className="text-sm text-slate-300 leading-relaxed">{reply.content}</p>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleReplySubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] shadow-xl mt-8">
            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Sua Resposta como {userLevelInfo.title}</h4>
            <div className="relative">
              <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Digite sua contribuição técnica..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all min-h-[120px] pb-14" />
              <button type="submit" disabled={!replyText.trim()} className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white p-3 rounded-xl shadow-lg transition-all flex items-center gap-2 font-bold text-xs uppercase">
                Enviar <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Comunidade Tech Pro {isAdmin && <ShieldAlert size={24} className="text-blue-500" />}
          </h2>
          <p className="text-slate-400">Troca de experiências e suporte técnico entre profissionais.</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button 
              onClick={clearForum}
              className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              <AlertTriangle size={18} /> Limpar Fórum
            </button>
          )}
          <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
            <Plus size={20} /> Nova Discussão
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-blue-500 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white border border-slate-700">{post.author.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{post.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{post.author} • {post.date}</p>
                      <span className="text-[8px] font-black uppercase tracking-widest bg-blue-600/5 text-blue-500 px-2 py-0.5 rounded-full border border-blue-500/10">
                        {getAuthorLevelTitle().title}
                      </span>
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button onClick={() => deletePost(post.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">{post.content}</p>
              <div className="flex items-center justify-between">
                <div className="text-blue-400 text-xs font-bold flex items-center gap-1"><MessageSquare size={14} /> {post.replies} Respostas</div>
                <button onClick={() => setSelectedPostId(post.id)} className="text-slate-500 hover:text-white flex items-center gap-1 text-xs font-bold uppercase">
                  Participar <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="py-20 text-center space-y-4 bg-slate-900/50 border border-dashed border-slate-800 rounded-[40px]">
              <MessageSquare size={48} className="mx-auto text-slate-800" />
              <p className="text-slate-500">O fórum está vazio no momento.</p>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Sua Autoridade Técnica</h4>
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
               <Trophy className="mx-auto text-amber-500" size={32} />
               <p className="text-xs font-black text-white uppercase tracking-widest">{userLevelInfo.title} {userLevelInfo.medal}</p>
               <p className="text-[9px] text-slate-500 leading-relaxed">Suas contribuições no fórum ajudam outros técnicos e aumentam seu XP profissional.</p>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-8 relative shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24} /></button>
            <h3 className="text-2xl font-bold text-white mb-6">Novo Tópico Técnico</h3>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Assunto da Discussão</label>
                <input required value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-blue-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Detalhamento Técnico</label>
                <textarea required rows={6} value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-blue-600" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all">Publicar no Fórum</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
