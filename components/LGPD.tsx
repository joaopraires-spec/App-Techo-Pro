
import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Database, UserCheck, Trash2, Mail, Info, ShieldAlert } from 'lucide-react';

const LGPDCard = ({ icon: Icon, title, content, color }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] hover:border-blue-500/50 transition-all group shadow-xl h-full">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5 transition-transform group-hover:scale-110 shadow-lg`}>
      <Icon size={24} className="text-white" />
    </div>
    <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{content}</p>
  </div>
);

const LGPD: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 page-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <ShieldCheck size={36} className="text-blue-500" /> Privacidade & LGPD
          </h2>
          <p className="text-slate-500 mt-2">Sua segurança e a transparência dos seus dados são nossa prioridade.</p>
        </div>
        <div className="text-[10px] font-black text-slate-600 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 uppercase tracking-[0.2em]">
          Versão 1.0.2 - 2024
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LGPDCard 
          icon={Database}
          title="Quais dados coletamos?"
          content="Coletamos dados básicos de identificação (nome, e-mail, cargo) e registros de atividade técnica (checklists gerados, artigos lidos e cálculos realizados) para personalizar sua experiência e evoluir seu nível profissional."
          color="bg-blue-600"
        />
        <LGPDCard 
          icon={UserCheck}
          title="Direitos do Usuário"
          content="Conforme a Lei 13.709/2018, você tem direito a confirmar a existência de tratamento, acessar seus dados, corrigir informações incompletas e solicitar a anonimização ou eliminação de dados desnecessários."
          color="bg-emerald-600"
        />
        <LGPDCard 
          icon={Lock}
          title="Segurança de Ponta"
          content="Utilizamos criptografia de ponta a ponta e protocolos de autenticação segura (como Google OAuth) para garantir que suas informações e relatórios técnicos estejam protegidos contra acessos não autorizados."
          color="bg-violet-600"
        />
        <LGPDCard 
          icon={Eye}
          title="Finalidade do Tratamento"
          content="Seus dados são utilizados exclusivamente para: (1) Gerenciar sua assinatura, (2) Calcular seu progresso de XP/Nível e (3) Permitir a geração e armazenamento de seus relatórios de inspeção técnica (Checklists)."
          color="bg-amber-600"
        />
        <LGPDCard 
          icon={Trash2}
          title="Exclusão de Dados"
          content="Você pode solicitar a exclusão total da sua conta e de todos os dados associados a qualquer momento através da aba Perfil ou entrando em contato diretamente com o nosso DPO pelo canal de suporte."
          color="bg-red-600"
        />
        <LGPDCard 
          icon={ShieldAlert}
          title="Compartilhamento"
          content="O Tech Pro não comercializa seus dados com terceiros. O compartilhamento ocorre apenas com processadores necessários (como Mercado Pago para transações) ou por obrigação legal via autoridades competentes."
          color="bg-cyan-600"
        />
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4 text-blue-500 mb-2">
            <Mail size={24} />
            <h4 className="text-xl font-bold text-white">Canal de Comunicação LGPD</h4>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
            Para exercer seus direitos ou tirar dúvidas sobre como tratamos suas informações técnicas, entre em contato com nosso Encarregado de Dados (DPO):
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex-1">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">E-mail Direto</p>
              <p className="text-lg font-bold text-blue-400">privacidade@techproapp.com.br</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex-1">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Tempo de Resposta</p>
              <p className="text-lg font-bold text-white">Até 48 horas úteis</p>
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-10 opacity-30">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
          <ShieldCheck size={16} /> Certificado Digital SSL
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
          <FileText size={16} /> Termos de Uso
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
          <Info size={16} /> Política de Cookies
        </div>
      </div>
    </div>
  );
};

export default LGPD;
