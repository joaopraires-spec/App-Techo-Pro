
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, UserPlan } from '../types';
import { PRICING, MERCADO_PAGO_LINKS, INITIAL_ARTICLES, LEVELS, CATEGORIES_PREMIUM } from '../constants';
import { 
  Shield, Gem, Star, Check, Camera, Mail, Briefcase, CreditCard, 
  ExternalLink, CheckCircle2, Award, Zap, Edit2, Save, X, 
  BarChart, History, Target, MessageSquare, BookOpen, 
  Calculator, RefreshCw, ChevronRight, User as UserIcon,
  Trophy, TrendingUp, Layout, Crown, CheckSquare, Upload, Image as ImageIcon,
  Lock, Phone, Calendar, AlertCircle, Instagram
} from 'lucide-react';

const Profile: React.FC<{ user: UserProfile; setUser: (u: UserProfile) => void }> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name || '',
    area: user.area || '',
    avatar: user.avatar || '',
    phone: user.phone || ''
  });
  
  const [savedChecklistsCount, setSavedChecklistsCount] = useState(0);
  const [mostReadCategory, setMostReadCategory] = useState<string>('Nenhuma');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const currentLevelInfo = LEVELS.find(l => l.level === user.level) || LEVELS[0];

  useEffect(() => {
    // Carregar contagem de checklists
    const saved = localStorage.getItem('techpro_saved_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSavedChecklistsCount(parsed.length);
      } catch (e) {}
    }

    // Calcular categoria mais lida
    if (user.readArticlesIds && user.readArticlesIds.length > 0) {
      const readArts = INITIAL_ARTICLES.filter(a => user.readArticlesIds.includes(a.id));
      const counts: Record<string, number> = {};
      readArts.forEach(a => {
        counts[a.category] = (counts[a.category] || 0) + 1;
      });
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (top) setMostReadCategory(top[0]);
    }
  }, [user.readArticlesIds]);

  const handleSave = () => {
    const updatedUser = { 
      ...user, 
      name: editData.name, 
      area: editData.area, 
      avatar: editData.avatar,
      phone: editData.phone 
    };
    setUser(updatedUser);
    localStorage.setItem('techpro_user', JSON.stringify(updatedUser));
    
    // Atualizar no banco de usuários registrados também
    const allUsers = JSON.parse(localStorage.getItem('techpro_registered_users') || '[]');
    const updatedUsers = allUsers.map((u: UserProfile) => u.id === user.id ? updatedUser : u);
    localStorage.setItem('techpro_registered_users', JSON.stringify(updatedUsers));
    
    setIsEditing(false);
  };

  const handleImageProcessing = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditData({ ...editData, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Erro ao acessar câmera", err);
      alert("Não foi possível acessar a câmera.");
      setShowCamera(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const data = canvas.toDataURL('image/png');
      setEditData({ ...editData, avatar: data });
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const isPremium = user.plan !== UserPlan.FREE;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 page-fade-in animate-in fade-in duration-700">
      
      {/* Header Profile */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-[48px] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
          <div className="relative group">
            <div className="w-44 h-44 rounded-[48px] border-8 border-slate-800/50 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 bg-slate-800 flex items-center justify-center">
              {editData.avatar ? (
                <img src={editData.avatar} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <UserIcon size={64} className="text-slate-600" />
              )}
            </div>
            
            <div className="absolute -bottom-3 -right-3 flex gap-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 p-3 rounded-2xl shadow-xl text-white hover:bg-blue-500 transition-all active:scale-90"
              >
                <Edit2 size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            {isEditing ? (
              <div className="space-y-4 max-w-md mx-auto md:mx-0">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nome Completo</label>
                  <input className="bg-slate-950 border border-slate-800 text-xl font-bold text-white px-5 py-3.5 rounded-2xl w-full focus:ring-2 focus:ring-blue-600 outline-none" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Especialidade / Cargo</label>
                  <input className="bg-slate-950 border border-slate-800 text-blue-400 font-bold px-5 py-3.5 rounded-2xl w-full focus:ring-2 focus:ring-blue-600 outline-none" value={editData.area} onChange={e => setEditData({...editData, area: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Telefone com DDD</label>
                  <input className="bg-slate-950 border border-slate-800 text-slate-300 font-bold px-5 py-3.5 rounded-2xl w-full focus:ring-2 focus:ring-blue-600 outline-none" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95 transition-all">Salvar Dados</button>
                  <button onClick={() => setIsEditing(false)} className="bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Cancelar</button>
                </div>
                
                <div className="flex gap-2 pt-2">
                   <button onClick={startCamera} className="flex-1 bg-slate-950 border border-slate-800 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white transition-all"><Camera size={16}/> Tirar Foto</button>
                   <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-slate-950 border border-slate-800 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white transition-all"><Upload size={16}/> Galeria</button>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageProcessing} />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{user.name}</h2>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="px-4 py-2 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                      {currentLevelInfo.medal} {currentLevelInfo.title}
                    </span>
                    <span className="px-4 py-2 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-600/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                      <Zap size={14} className="fill-blue-500" /> {user.xp} XP acumulados
                    </span>
                    <span className="px-4 py-2 bg-slate-800 text-slate-400 rounded-2xl border border-slate-700/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                      <Phone size={14} /> {user.phone || 'Telefone não cadastrado'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-4 bg-slate-950/50 p-5 rounded-[28px] border border-slate-800/50 flex-1 shadow-inner">
                    <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                      <Mail size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Acesso Principal</p>
                      <p className="text-sm font-bold text-slate-200 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-950/50 p-5 rounded-[28px] border border-slate-800/50 flex-1 shadow-inner">
                    <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500">
                      <Briefcase size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Especialidade</p>
                      <p className="text-sm font-bold text-slate-200 truncate">{user.area}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas e Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3"><TrendingUp size={24} className="text-blue-500" /> Performance Operacional</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 text-center shadow-inner group hover:border-blue-500/30 transition-all">
                <p className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-widest">Checklists</p>
                <p className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">{savedChecklistsCount}</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 text-center shadow-inner group hover:border-blue-500/30 transition-all">
                <p className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-widest">Artigos Lidos</p>
                <p className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">{user.readArticlesIds?.length || 0}</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 text-center shadow-inner group hover:border-blue-500/30 transition-all">
                <p className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-widest">Cálculos</p>
                <p className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">{user.calculationsCount || 0}</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 text-center shadow-inner group hover:border-blue-500/30 transition-all">
                <p className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-widest">Conversões</p>
                <p className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">{user.conversionsCount || 0}</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-600/5 border border-blue-600/10 rounded-[32px] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Star size={24} className="fill-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tópico de Maior Interesse</p>
                  <h4 className="text-lg font-black text-white uppercase tracking-tighter">{mostReadCategory}</h4>
                </div>
              </div>
              <Link to="/library" className="p-3 bg-slate-900 text-blue-500 rounded-xl hover:bg-slate-800 transition-all">
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3"><Gem size={24} className="text-amber-500" /> Detalhes da Assinatura</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 flex items-center gap-5">
                  <div className={`w-14 h-14 ${isPremium ? 'bg-amber-500' : 'bg-slate-800'} rounded-2xl flex items-center justify-center text-slate-900 shadow-xl`}>
                    <Crown size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plano Ativo</p>
                    <h4 className="text-xl font-black text-white">{user.plan}</h4>
                  </div>
               </div>
               <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 shadow-xl">
                    <Calendar size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data de Validade</p>
                    <h4 className="text-xl font-black text-white">{user.planExpiryDate || 'Vitalício'}</h4>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           {/* Carreira Sidebar */}
           <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-xl flex flex-col h-full relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/5 blur-[50px] pointer-events-none" />
             <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
               <Award size={24} className="text-blue-500" /> Evolução de Nível
             </h3>
             <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="text-7xl mb-2 drop-shadow-2xl animate-bounce duration-3000">{currentLevelInfo.medal}</div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Patente Atual</p>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{currentLevelInfo.title}</h4>
                </div>
                <div className="w-full space-y-2">
                   <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                     <span>Próximo Nível</span>
                     <span>{user.xp} XP</span>
                   </div>
                   <div className="h-2 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden shadow-inner">
                      <div className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${Math.min(100, (user.xp / 10000) * 100)}%` }} />
                   </div>
                </div>
                <Link to="/level" className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 border border-slate-700">Ver Jornada Completa</Link>
             </div>
           </div>

           {/* Convite Instagram */}
           <div 
             onClick={() => window.open('https://www.instagram.com/techproapp?igsh=dmNwOGluMWw2b3N6&utm_source=qr', '_blank')}
             className="bg-gradient-to-br from-pink-600 to-orange-500 p-6 rounded-[32px] shadow-xl cursor-pointer hover:scale-[1.02] transition-all group relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-2 -translate-y-2">
                <Instagram size={48} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    <Instagram size={24} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Siga a Tech Pro</h4>
                    <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest">@techproapp</p>
                 </div>
                 <ExternalLink size={16} className="text-white/50 ml-auto group-hover:text-white transition-colors" />
              </div>
           </div>
        </div>
      </div>

      {/* Opções de Planos (Upgrade) */}
      {!isPremium && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
             <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Upgrade para <span className="text-amber-500">Specialist Pro</span></h3>
             <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">Desbloqueie todas as calculadoras avançadas, catálogos técnicos e categorias restritas para elevar sua precisão de campo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="bg-slate-900 border border-slate-800 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group hover:border-blue-600/50 transition-all">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 text-blue-500 group-hover:scale-110 transition-transform">
                  <CreditCard size={80} />
                </div>
                <div className="space-y-6 relative z-10">
                   <div>
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Assinatura Mensal</p>
                     <h4 className="text-4xl font-black text-white tracking-tighter">{PRICING[UserPlan.MONTHLY]}</h4>
                   </div>
                   <ul className="space-y-4">
                      {['Calculadoras Premium', 'Pastas de Catálogos', 'Todos os Artigos', 'Suporte Especialista'].map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                           <div className="w-5 h-5 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500"><Check size={14} /></div>
                           {f}
                        </li>
                      ))}
                   </ul>
                   <a href={MERCADO_PAGO_LINKS.MONTHLY} target="_blank" rel="noopener noreferrer" className="block w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl text-center font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-900/30 active:scale-95 transition-all">Assinar Mensal</a>
                </div>
             </div>

             <div className="bg-slate-900 border-2 border-amber-500/30 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group hover:border-amber-500 transition-all">
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">Melhor Valor</div>
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 text-amber-500 group-hover:scale-110 transition-transform">
                  <Crown size={80} />
                </div>
                <div className="space-y-6 relative z-10">
                   <div>
                     <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Plano Anual Specialist</p>
                     <h4 className="text-4xl font-black text-white tracking-tighter">{PRICING[UserPlan.ANNUAL]}</h4>
                   </div>
                   <ul className="space-y-4">
                      {['Acesso Vitalício Anual', 'Pastas e Documentos', 'Consultoria Prioritária', 'Certificação TechPro'].map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                           <div className="w-5 h-5 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500"><Check size={14} /></div>
                           {f}
                        </li>
                      ))}
                   </ul>
                   <a href={MERCADO_PAGO_LINKS.ANNUAL} target="_blank" rel="noopener noreferrer" className="block w-full py-5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-3xl text-center font-black uppercase text-xs tracking-widest shadow-xl shadow-amber-900/30 active:scale-95 transition-all">Assinar Anual (Economize)</a>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Modal de Câmera */}
      {showCamera && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
           <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                 <h3 className="text-xl font-bold text-white flex items-center gap-3"><Camera className="text-blue-500" /> Captura de Perfil</h3>
                 <button onClick={stopCamera} className="p-2 bg-slate-800 text-slate-400 rounded-xl active:scale-90"><X size={20}/></button>
              </div>
              <div className="aspect-square bg-black relative">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                 <div className="absolute inset-0 border-[20px] border-slate-900/50 rounded-full scale-[0.85] pointer-events-none" />
              </div>
              <div className="p-8 flex items-center justify-center gap-4">
                 <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-blue-600 active:scale-90 transition-all group">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:scale-95 transition-all">
                      <Camera size={28} className="text-blue-600" />
                    </div>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
