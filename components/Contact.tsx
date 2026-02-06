
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Send, CheckCircle2, Phone, ListFilter, AlertCircle } from 'lucide-react';

const Contact: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: '',
    subject: '',
    area: user.area,
    message: ''
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      area: user.area
    }));
  }, [user]);

  const applyPhoneMask = (value: string) => {
    // Remove tudo que não for dígito
    const digits = value.replace(/\D/g, '').slice(0, 11);
    
    let masked = digits;
    if (digits.length > 0) {
      masked = `(${digits.slice(0, 2)}`;
    }
    if (digits.length > 2) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}`;
    }
    if (digits.length > 7) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
    return masked;
  };

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return null;
    
    // Validação básica brasileira: Celulares tem 11 dígitos e começam com 9 após o DDD
    if (digits.length === 11) {
      if (digits[2] !== '9') {
        return "Celulares devem começar com o dígito 9.";
      }
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
    // Simulação de envio
    setTimeout(() => setStatus('sent'), 1500);
  };

  if (status === 'sent') {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white">Mensagem Enviada!</h2>
        <p className="text-slate-400">Recebemos sua solicitação técnica. Nossa equipe de suporte responderá em até 24 horas úteis no seu email cadastrado.</p>
        <button 
          onClick={() => {
            setStatus('idle');
            setFormData(prev => ({ ...prev, message: '', subject: '', phone: '' }));
          }} 
          className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
        >
          Enviar Nova Mensagem
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Suporte Técnico</h2>
        <p className="text-slate-400">Dúvidas, sugestões de melhoria ou problemas com o plano? Estamos aqui.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Nome Completo</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required 
              className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email de Contato</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
              className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <Phone size={14} className="text-blue-500" /> Telefone
            </label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required 
              className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all ${phoneError ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-700'}`}
              placeholder="(00) 00000-0000"
            />
            {phoneError && (
              <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> {phoneError}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
              <ListFilter size={14} className="text-blue-500" /> Tipo de Solicitação
            </label>
            <select 
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required 
              className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all appearance-none"
            >
              <option value="" disabled>Selecione uma opção</option>
              <option value="duvida">Dúvida</option>
              <option value="sugestao">Sugestão</option>
              <option value="problema_tecnico">Problema Técnico</option>
              <option value="financeiro">Financeiro / Plano</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Profissão / Área de Atuação</label>
          <input 
            type="text" 
            name="area"
            value={formData.area}
            onChange={handleChange}
            required 
            className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Mensagem Técnica (Até 3000 caracteres)</label>
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            required 
            rows={6} 
            maxLength={3000}
            className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
            placeholder="Descreva detalhadamente sua necessidade..."
          />
        </div>

        <button 
          type="submit"
          disabled={status === 'sending' || !!phoneError}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3"
        >
          {status === 'sending' ? 'Enviando...' : 'Enviar Mensagem para o Desenvolvedor'} <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Contact;
