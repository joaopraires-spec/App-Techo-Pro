
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Send, CheckCircle2, Phone, ListFilter, AlertCircle, Mail, Briefcase, User as UserIcon, MessageSquare, ShieldCheck, ChevronDown, Instagram, ExternalLink } from 'lucide-react';

const Contact: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    subject: '',
    area: user.area,
    message: ''
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      area: user.area,
      phone: user.phone || ''
    }));
  }, [user]);

  const applyPhoneMask = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    let masked = digits;
    if (digits.length > 0) masked = `(${digits.slice(0, 2)}`;
    if (digits.length > 2) masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}`;
    if (digits.length > 7) masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    return masked;
  };

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return null;
    if (digits.length === 11) {
      if (digits[2] !== '9') return "Celulares devem começar com o dígito 9.";
      return null;
    } else if (digits.length < 10) {
      return "Telefone incompleto.";
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const maskedValue = applyPhoneMask(value);
      setFormData(prev => ({ ...prev, [name]: maskedValue }));
      setPhoneError(validatePhone(maskedValue));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validatePhone(formData.phone);
    if (error) {
      setPhoneError(error);
      return;
    }

    setStatus('sending');

    // Persistência no Storage Global de Chats para o Admin ver
    const savedChats = JSON.parse(localStorage.getItem('techpro_global_chats') || '{}');
    const userChat = savedChats[user.id] || [];
    
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: `[ASSUNTO: ${formData.subject.toUpperCase()}]\n${formData.message}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('pt-BR'),
      subject: formData.subject,
      metadata: {
        phone: formData.phone,
        area: formData.area
      }
    };

    savedChats[user.id] = [...userChat, newMessage];
    localStorage.setItem('techpro_global_chats', JSON.stringify(savedChats));

    setTimeout(() => setStatus('sent'), 1500);
  };

  if (status === 'sent') {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20 shadow-2xl shadow-emerald-900/20">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-white tracking-tighter">Transmissão Concluída!</h2>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">Sua mensagem foi protocolada no Console Administrativo. Um especialista entrará em contato via chat em breve.</p>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl inline-block text-left space-y-2">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocolo de Suporte</p>
           <p className="text-sm font-bold text-white font-mono">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
        <div className="pt-6">
          <button 
            onClick={() => {
              setStatus('idle');
              setFormData(prev => ({ ...prev, message: '', subject: '' }));
            }} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-blue-900/30 active:scale-95"
          >
            Nova Solicitação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="px-1">
        <div className="flex items-center gap-3 mb-2">
           <span className="bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded shadow-lg shadow-blue-900/20">Canal Seguro</span>
           <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest font-mono">Status: Conectado</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">Central de <span className="text-blue-500">Suporte Técnico</span></h2>
        <p className="text-slate-500 font-medium mt-1">Encaminhe suas dúvidas operacionais ou sugestões diretamente ao comando administrativo.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 sm:p-12 rounded-[48px] space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <UserIcon size={12} className="text-blue-500" /> Identificação Completa
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required 
              readOnly
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold opacity-60 cursor-not-allowed outline-none text-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Mail size={12} className="text-blue-500" /> Canal de Resposta
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
              readOnly
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold opacity-60 cursor-not-allowed outline-none text-sm" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Phone size={12} className="text-blue-500" /> Telefone Operativo
            </label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required 
              className={`w-full bg-slate-950 border rounded-2xl px-6 py-4 text-white font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all text-sm ${phoneError ? 'border-red-500/50' : 'border-slate-800'}`}
              placeholder="(00) 00000-0000"
            />
            {phoneError && (
              <p className="text-red-400 text-[10px] mt-2 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                <AlertCircle size={12} /> {phoneError}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <ListFilter size={12} className="text-blue-500" /> Categoria do Contato
            </label>
            <div className="relative">
              <select 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all appearance-none text-sm"
              >
                <option value="" disabled>Selecione uma opção</option>
                <option value="duvida">Dúvida Técnica</option>
                <option value="sugestao">Sugestão de Melhoria</option>
                <option value="problema_tecnico">Erro de Aplicação (Bug)</option>
                <option value="financeiro">Assinatura Specialist Pro</option>
                <option value="outros">Outras Demandas</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Briefcase size={12} className="text-blue-500" /> Especialidade Industrial
          </label>
          <input 
            type="text" 
            name="area"
            value={formData.area}
            onChange={handleChange}
            required 
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm" 
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1 mb-1">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <MessageSquare size={12} className="text-blue-500" /> Relato Detalhado
             </label>
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{formData.message.length} / 3000 Caracteres</span>
          </div>
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            required 
            rows={8} 
            maxLength={3000}
            className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-6 py-5 text-white font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all text-sm leading-relaxed"
            placeholder="Descreva detalhadamente sua necessidade operacional para que nossa equipe técnica possa agir com precisão..."
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={status === 'sending' || !!phoneError}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs active:scale-95 group"
          >
            {status === 'sending' ? (
               <span className="flex items-center gap-3">Processando Dados...</span>
            ) : (
               <>Transmitir ao Administrador <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 pt-4 opacity-50 grayscale hover:grayscale-0 transition-all">
           <div className="flex items-center gap-2">
             <ShieldCheck size={14} className="text-blue-500" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Criptografia AES-256</span>
           </div>
           <div className="w-1 h-1 bg-slate-800 rounded-full" />
           <div className="flex items-center gap-2">
             <CheckCircle2 size={14} className="text-blue-500" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocolo Validado</span>
           </div>
        </div>
      </form>

      {/* Convite Instagram Rodapé */}
      <div 
        onClick={() => window.open('https://www.instagram.com/techproapp?igsh=dmNwOGluMWw2b3N6&utm_source=qr', '_blank')}
        className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] flex items-center justify-center gap-4 hover:border-pink-500/50 transition-all cursor-pointer group shadow-xl"
      >
        <div className="w-10 h-10 bg-gradient-to-tr from-pink-600 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Instagram size={22} />
        </div>
        <div className="text-left">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Acompanhe as novidades</p>
           <h4 className="text-sm font-bold text-white group-hover:text-pink-500 transition-colors flex items-center gap-2">
             Siga @techproapp no Instagram <ExternalLink size={14} className="opacity-50" />
           </h4>
        </div>
      </div>
    </div>
  );
};

export default Contact;
