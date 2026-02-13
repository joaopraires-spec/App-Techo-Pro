
import React, { useState, useEffect, useRef } from 'react';
// Fix: Added missing Link import to fix "Cannot find name 'Link'" error.
import { Link } from 'react-router-dom';
import { UserProfile, UserPlan } from '../types';
import { PRICING, MERCADO_PAGO_LINKS, INITIAL_ARTICLES, LEVELS } from '../constants';
import { 
  Shield, Gem, Star, Check, Camera, Mail, Briefcase, CreditCard, 
  ExternalLink, CheckCircle2, Award, Zap, Edit2, Save, X, 
  BarChart, History, Target, MessageSquare, BookOpen, 
  Calculator, RefreshCw, ChevronRight, User as UserIcon,
  Trophy, TrendingUp, Layout, Crown, CheckSquare, Upload, Image as ImageIcon,
  Lock
} from 'lucide-react';

const Profile: React.FC<{ user: UserProfile; setUser: (u: UserProfile) => void }> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name || '',
    area: user.area || '',
    avatar: user.avatar || ''
  });
  
  const [savedChecklistsCount, setSavedChecklistsCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentLevelInfo = LEVELS.find(l => l.level === user.level) || LEVELS[0];

  useEffect(() => {
    const saved = localStorage.getItem('techpro_saved_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSavedChecklistsCount(parsed.length);
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    setUser({ ...user, name: editData.name, area: editData.area, avatar: editData.avatar });
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

  const isPremium = user.plan === UserPlan.ANNUAL || user.plan === UserPlan.MONTHLY || user.plan === UserPlan.ADMIN;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 page-fade-in">
      {/* Header Profile */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-[48px] p-8 md:p-12 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
          <div className="relative group">
            <div className="w-44 h-44 rounded-[40px] border-8 border-slate-800/50 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <img src={editData.avatar || 'https://i.pravatar.cc/150?u=techpro'} className="w-full h-full object-cover" alt="Profile" />
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-slate-950/90 rounded-[40px] flex items-center justify-center p-4 backdrop-blur-sm">
                <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Upload size={20} /></button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageProcessing} />
              </div>
            )}
            <div className="absolute -bottom-3 -right-3 bg-blue-600 p-3 rounded-2xl shadow-xl text-white">
              <Trophy size={24} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            {isEditing ? (
              <div className="space-y-4 max-w-md">
                <input className="bg-slate-950 border border-slate-800 text-2xl font-black text-white px-5 py-3 rounded-2xl w-full" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
                <input className="bg-slate-950 border border-slate-800 text-blue-400 font-bold px-5 py-3 rounded-2xl w-full" value={editData.area} onChange={e => setEditData({...editData, area: e.target.value})} />
                <div className="flex gap-3"><button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest">Salvar</button></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{user.name}</h2>
                    <button onClick={() => setIsEditing(true)} className="p-2.5 bg-slate-800 text-slate-400 rounded-2xl"><Edit2 size={18} /></button>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      {currentLevelInfo.medal} {currentLevelInfo.title} Specialist
                    </span>
                    <span className="px-4 py-1.5 bg-blue-600/10 text-blue-500 rounded-full border border-blue-600/20 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Zap size={14} className="fill-blue-500" /> {user.xp} XP
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50">
                    <Mail size={18} className="text-blue-500" /> <span className="text-sm truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50">
                    <Briefcase size={18} className="text-blue-500" /> <span className="text-sm truncate">{user.area}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3"><TrendingUp size={24} className="text-blue-500" /> Atividade de Campo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Checklists</p>
                <p className="text-3xl font-black text-white">{savedChecklistsCount}</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Cálculos</p>
                <p className="text-3xl font-black text-white">{user.calculationsCount || 0}</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-[32px] border border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Conversões</p>
                <p className="text-3xl font-black text-white">{user.conversionsCount || 0}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-6">Minha Carreira</h3>
             <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-center space-y-4">
                <div className="text-5xl">{currentLevelInfo.medal}</div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">{currentLevelInfo.title}</h4>
                <Link to="/level" className="block w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Ver Evolução</Link>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
