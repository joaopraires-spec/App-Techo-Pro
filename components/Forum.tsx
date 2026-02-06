
import React, { useState } from 'react';
import { UserProfile, UserPlan, ForumPost } from '../types';
// Fixing react-router-dom imports to ensure all members are correctly exported
import { MessageSquare, Plus, Search, User as UserIcon, Calendar, ArrowRight, X, Trash2, Pencil, ShieldAlert } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Forum: React.FC<{ user: UserProfile }> = ({ user }) => {
  const location = useLocation();
  const isAdmin = user.plan === UserPlan.ADMIN;
  
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
    },
    { 
      id: '4', 
      title: 'Vibração excessiva em bombas centrífugas KSB', 
      author: 'Carlos Manutenção', 
      date: '20/04/2024', 
      content: 'Bomba apresentando pico em 1x RPM e 2x RPM no espectro. Alinhamento a laser já foi refeito duas vezes e o problema persiste. Pode ser folga mecânica no mancal ou ressonância na tubulação?', 
      replies: 15 
    },
    { 
      id: '5', 
      title: 'Configuração de inversores PowerFlex 755 via Studio 5000', 
      author: 'Eng. Amanda Costa', 
      date: '12/04/2024', 
      content: 'Dificuldade em estabelecer comunicação estável via EtherNet/IP após upgrade de firmware do PLC. O drive perde o mapa de I/O aleatoriamente. Sugestões de parametrização no módulo de comunicação?', 
      replies: 31 
    },
    { 
      id: '6', 
      title: 'Segurança: Bloqueio LOTO em subestações de 13.8kV', 
      author: 'Segurança_Industrial', 
      date: '28/03/2024', 
      content: 'Estamos revisando nosso protocolo LOTO. Qual a melhor prática para garantir a energia zero em transformadores com alimentação redundante? O uso de detectores de tensão por contato é obrigatório em todos os casos na visão de vocês?', 
      replies: 19 
    },
    { 
      id: '7', 
      title: 'Alinhamento a laser: Compensação de crescimento térmico', 
      author: 'Ricardo Especialista', 
      date: '10/04/2024', 
      content: 'Gostaria de discutir os coeficientes de dilatação para motores acima de 500kW. No alinhamento a frio, quanto vocês costumam deixar de "offset" vertical para compensar o aquecimento em regime permanente?', 
      replies: 6 
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [isTipVisible, setIsTipVisible] = useState(true);
  const [newPost, setNewPost] = useState({ title: location.state?.initialTitle || '', content: '' });

  const dailySuggestion = "Como a Indústria 4.0 está mudando o diagnóstico de falhas em tempo real?";

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

  const deletePost = (id: string) => {
    if (window.confirm('Excluir este tópico permanentemente?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">Comunidade Tech Pro {isAdmin && <ShieldAlert size={24} className="text-blue-500" />}</h2>
          <p className="text-slate-400">Troca de experiências e suporte técnico entre profissionais.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"><Plus size={20} /> Nova Discussão</button>
      </div>

      {isTipVisible && (
        <div 
          onClick={() => {
            setNewPost(prev => ({ ...prev, title: dailySuggestion }));
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-900/20 to-slate-900 border border-blue-800/30 p-6 rounded-3xl mb-8 relative overflow-hidden group cursor-pointer hover:border-blue-500/50 transition-all active:scale-[0.99] touch-manipulation"
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsTipVisible(false);
            }}
            className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all z-20"
            title="Fechar sugestão"
          >
            <X size={16} />
          </button>
          <div className="relative z-10">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Sugestão de Assunto do Dia</h3>
            <p className="text-lg font-bold text-white">"{dailySuggestion}"</p>
          </div>
          <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all duration-700" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-blue-500 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white border border-slate-700">{post.author.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{post.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{post.author} • {post.date}</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button className="text-slate-500 hover:text-blue-400"><Pencil size={18} /></button>
                    <button onClick={() => deletePost(post.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={18} /></button>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">{post.content}</p>
              <div className="flex items-center justify-between">
                <div className="text-blue-400 text-xs font-bold flex items-center gap-1"><MessageSquare size={14} /> {post.replies} Respostas</div>
                <button className="text-slate-500 hover:text-white flex items-center gap-1 text-xs font-bold uppercase">Participar <ArrowRight size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Categorias Populares</h4>
            <div className="space-y-2">
              {['Mecânica Pesada', 'Hidráulica de Potência', 'Segurança do Trabalho', 'Elétrica Industrial'].map(cat => (
                <button key={cat} className="w-full text-left text-sm text-slate-400 hover:text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-all font-medium border border-transparent hover:border-slate-700"># {cat}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-8 relative shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24} /></button>
            <h3 className="text-2xl font-bold text-white mb-6">Iniciar Nova Discussão</h3>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Título do Tópico</label>
                <input required value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-blue-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Conteúdo / Descrição do Problema</label>
                <textarea required rows={6} value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-blue-600" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all">Publicar Discussão</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
