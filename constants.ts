
import { UserPlan, Article, Calculator, Catalog } from './types';

export const ADMIN_EMAIL = 'suporte.techproapp@gmail.com';
export const ADMIN_PASS = '@Continuar13';

export const PRICING = {
  [UserPlan.FREE]: 'R$ 0,00',
  [UserPlan.MONTHLY]: 'R$ 14,90',
  [UserPlan.ANNUAL]: 'R$ 119,90'
};

export const MERCADO_PAGO_LINKS = {
  MONTHLY: 'https://mpago.la/2Bv3ciS',
  ANNUAL: 'https://mpago.la/1FnF6qV'
};

export const CATEGORIES_FREE = ['Hidráulica', 'Mecânica', 'Informática', 'Britagem / Mineração', 'Segurança', 'Inspeção e Confiabilidade'];
export const CATEGORIES_PREMIUM = ['Sistemas Térmicos', 'Elétrica', 'Pneumática', 'Automação', 'Instrumentação', 'Fadiga dos Materiais', 'Magnetismo', 'Metalografia'];

const categoryImages: Record<string, string> = {
  'Hidráulica': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop',
  'Mecânica': 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=2070&auto=format&fit=crop',
  'Informática': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop',
  'Britagem / Mineração': 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=2070&auto=format&fit=crop',
  'Segurança': 'https://images.unsplash.com/photo-1590486803833-ffc6f98629e8?q=80&w=2070&auto=format&fit=crop',
  'Inspeção e Confiabilidade': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop',
  'Sistemas Térmicos': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop',
  'Elétrica': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop',
  'Pneumática': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
  'Automação': 'https://images.unsplash.com/photo-1558444479-c84851727d60?q=80&w=2070&auto=format&fit=crop',
  'Instrumentação': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop',
  'Fadiga dos Materiais': 'https://images.unsplash.com/photo-1535813543269-7328cf139544?q=80&w=2070&auto=format&fit=crop',
  'Magnetismo': 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=2069&auto=format&fit=crop',
  'Metalografia': 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2070&auto=format&fit=crop'
};

const generateArticles = () => {
  const articles: Article[] = [];
  const allCats = [...CATEGORIES_FREE, ...CATEGORIES_PREMIUM];
  
  allCats.forEach(cat => {
    for (let i = 1; i <= 17; i++) {
      const imageUrl = categoryImages[cat] || `https://loremflickr.com/800/600/industrial?lock=${cat.length + i}`;
      articles.push({
        id: `${cat.toLowerCase().replace(/ /g, '-')}-${i}`,
        title: `Estudo Avançado: ${cat} - Módulo ${i}`,
        category: cat,
        isPremium: CATEGORIES_PREMIUM.includes(cat),
        readTime: 25,
        imageUrl: imageUrl,
        content: `Este é um artigo técnico profundo sobre ${cat}. A manutenção industrial moderna exige conhecimentos específicos sobre variáveis de campo, termodinâmica e análise de falhas...`
      });
    }
  });
  return articles;
};

export const INITIAL_ARTICLES: Article[] = generateArticles();

export const INITIAL_CATALOGS: Catalog[] = [
  { id: 'c1', name: 'Catálogo Bombas Rexroth', category: 'Hidráulica', fileUrl: '#' },
  { id: 'c2', name: 'Manual Redutores SEW', category: 'Mecânica', fileUrl: '#' },
  { id: 'c3', name: 'Guia de Sensores IFM', category: 'Automação', fileUrl: '#' },
];

export const CALCULATORS: Calculator[] = [
  {
    id: 'h-press',
    name: 'Pressão Hidráulica',
    category: 'Hidráulica',
    isPremium: false,
    formula: 'P = F / A',
    illustration: '⚡ Esquema: Pressão em Área',
    inputs: [
      { key: 'force', label: 'Força (F)', unit: 'N', defaultValue: 1000 },
      { key: 'area', label: 'Área (A)', unit: 'm²', defaultValue: 0.05 }
    ],
    resultUnit: 'Pa',
    description: 'Calcular pressão com base na força e área'
  },
  {
    id: 'mag-force',
    name: 'Magnética',
    category: 'Magnetismo',
    isPremium: false,
    formula: 'F = B x I x L',
    illustration: '🧲 Esquema: Força de Lorentz',
    inputs: [
      { key: 'b', label: 'Campo (B)', unit: 'T', defaultValue: 1.2 },
      { key: 'i', label: 'Corrente (I)', unit: 'A', defaultValue: 5 },
      { key: 'l', label: 'Comp. (L)', unit: 'm', defaultValue: 0.5 }
    ],
    resultUnit: 'N',
    description: 'Força em condutores sem campo magnético'
  },
  {
    id: 'flow-rate',
    name: 'Vazão',
    category: 'Hidráulica',
    isPremium: true,
    formula: 'Q = V / t',
    illustration: '💧 Esquema: Fluxo Volumétrico',
    inputs: [
      { key: 'v', label: 'Volume (V)', unit: 'm³', defaultValue: 10 },
      { key: 't', label: 'Tempo (t)', unit: 's', defaultValue: 60 }
    ],
    resultUnit: 'm³/s',
    description: 'Calcular volumétrica'
  },
  {
    id: 'cyl-force',
    name: 'em Cilindros',
    category: 'Hidráulica',
    isPremium: true,
    formula: 'F = P x A',
    illustration: '🔧 Esquema: Atuador',
    inputs: [
      { key: 'p', label: 'Pressão (P)', unit: 'Pa', defaultValue: 200000 },
      { key: 'a', label: 'Área (A)', unit: 'm²', defaultValue: 0.01 }
    ],
    resultUnit: 'N',
    description: 'Calcular força em cilindros hidráulicos/pneumáticos'
  },
  {
    id: 'torque',
    name: 'Torque',
    category: 'Mecânica',
    isPremium: true,
    formula: 'τ = F x d',
    illustration: '⚙️ Esquema: Momento de Força',
    inputs: [
      { key: 'f', label: 'Força (F)', unit: 'N', defaultValue: 50 },
      { key: 'd', label: 'Distância (d)', unit: 'm', defaultValue: 0.25 }
    ],
    resultUnit: 'Nm',
    description: 'Calcular torque'
  },
  {
    id: 'pot-mec',
    name: 'Potência Mecânica',
    category: 'Mecânica',
    isPremium: true,
    formula: 'P = W / t',
    illustration: '⚡ Esquema: Trabalho por Tempo',
    inputs: [
      { key: 'w', label: 'Trabalho (W)', unit: 'J', defaultValue: 5000 },
      { key: 't', label: 'Tempo (t)', unit: 's', defaultValue: 10 }
    ],
    resultUnit: 'W',
    description: 'Calcular potência em sistemas mecânicos'
  }
];

export const CONVERSION_UNITS = {
  Força: ['N', 'kN', 'kgf', 'lbf'],
  Torque: ['Nm', 'kgfm', 'lbft'],
  Pressão: ['Pa', 'bar', 'psi', 'kgf/cm²'],
  Potência: ['W', 'kW', 'HP', 'CV'],
  Energia: ['J', 'cal', 'kWh', 'BTU'],
  Distância: ['mm', 'cm', 'm', 'pol', 'ft'],
  Massa: ['g', 'kg', 'ton', 'lb'],
  Temperatura: ['°C', '°F', 'K']
};

export const LEVELS = [
  { level: 1, minXp: 0, title: 'Assistente Técnico', message: 'Iniciando a jornada profissional.', features: ['Artigos Free', 'Calculadoras Básicas'] },
  { level: 2, minXp: 1000, title: 'Técnico de Manutenção', message: 'Habilidades básicas consolidadas.', features: ['Checklists Customizados'] },
  { level: 3, minXp: 2500, title: 'Técnico Especialista', message: 'Referência em diagnósticos de campo.', features: ['Relatórios PDF'] },
  { level: 4, minXp: 5000, title: 'Inspetor de Confiabilidade', message: 'Foco em análise de falhas e RCM.', features: ['Acesso Avançado'] },
  { level: 5, minXp: 10000, title: 'Engenheiro de Campo Pro', message: 'Nível máximo de proficiência técnica.', features: ['Consultoria Interna'] }
];
