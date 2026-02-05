
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

// Mapeamento de palavras-chave para busca de imagens temáticas por categoria
const categoryKeywords: Record<string, string> = {
  'Hidráulica': 'hydraulic,pipes',
  'Mecânica': 'industrial,maintenance',
  'Informática': 'laptop,computer',
  'Britagem / Mineração': 'mining,quarry',
  'Segurança': 'safety,industrial',
  'Inspeção e Confiabilidade': 'inspection,quality',
  'Sistemas Térmicos': 'thermal,heat',
  'Elétrica': 'electrical,power',
  'Pneumática': 'pneumatic,valves',
  'Automação': 'automation,robotics',
  'Instrumentação': 'instrumentation,tools',
  'Fadiga dos Materiais': 'metal,fracture',
  'Magnetismo': 'magnetism,physics',
  'Metalografia': 'metallurgy,microscope'
};

const generateArticles = () => {
  const articles: Article[] = [];
  const allCats = [...CATEGORIES_FREE, ...CATEGORIES_PREMIUM];
  
  // Imagens específicas solicitadas para padronização das categorias
  const hydraulicImage = "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop"; // Tubulação Hidráulica
  const mechanicalImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"; // Manutenção Industrial
  const computerImage = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2070&auto=format&fit=crop"; // Notebook
  
  // URLs Corrigidas para Britagem, Segurança e Inspeção
  // Atualizado: Jazida a céu aberto com equipamentos
  const miningImage = "https://images.unsplash.com/photo-1520052205165-909ea982ccf4?q=80&w=2070&auto=format&fit=crop"; 
  const safetyImage = "https://images.unsplash.com/photo-1582653280644-873d5f14e76d?q=80&w=2070&auto=format&fit=crop"; // Segurança (Capacete e EPIs)
  const inspectionImage = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop"; // Inspeção e Confiabilidade (Análise técnica)
  
  const thermalImage = "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop"; // Peça de metal sendo aquecida
  
  // Novas imagens solicitadas
  const electricalImage = "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop"; // Torre de distribuição elétrica
  const pneumaticImage = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"; // Compressor de ar
  const automationImage = "https://images.unsplash.com/photo-1558444479-c84851727d60?q=80&w=2070&auto=format&fit=crop"; // Painel de controle elétrico
  const instrumentationImage = "https://images.unsplash.com/photo-1530124560676-4fbc912f22c8?q=80&w=2070&auto=format&fit=crop"; // Ferramentas de manutenção industrial

  allCats.forEach(cat => {
    const keyword = categoryKeywords[cat] || 'industrial';
    for (let i = 1; i <= 17; i++) {
      let imageUrl = `https://loremflickr.com/800/600/${keyword.split(',')[0]}?lock=${cat.length + i}`;
      
      // Mapeamento de imagens para categorias específicas
      if (cat === 'Hidráulica') {
        imageUrl = hydraulicImage;
      } else if (cat === 'Mecânica') {
        imageUrl = mechanicalImage;
      } else if (cat === 'Informática') {
        imageUrl = computerImage;
      } else if (cat === 'Britagem / Mineração') {
        imageUrl = miningImage;
      } else if (cat === 'Segurança') {
        imageUrl = safetyImage;
      } else if (cat === 'Inspeção e Confiabilidade') {
        imageUrl = inspectionImage;
      } else if (cat === 'Sistemas Térmicos') {
        imageUrl = thermalImage;
      } else if (cat === 'Elétrica') {
        imageUrl = electricalImage;
      } else if (cat === 'Pneumática') {
        imageUrl = pneumaticImage;
      } else if (cat === 'Automação') {
        imageUrl = automationImage;
      } else if (cat === 'Instrumentação') {
        imageUrl = instrumentationImage;
      }

      articles.push({
        id: `${cat.toLowerCase().replace(/ /g, '-')}-${i}`,
        title: `Estudo Avançado: ${cat} - Módulo ${i}`,
        category: cat,
        isPremium: CATEGORIES_PREMIUM.includes(cat),
        readTime: 25,
        imageUrl: imageUrl,
        content: `Este é um artigo técnico profundo sobre ${cat}. A manutenção industrial moderna exige conhecimentos específicos sobre variáveis de campo, termodinâmica e análise de falhas. Durante estes 25 minutos de leitura, exploraremos a fundo os componentes, as normas técnicas ISO aplicáveis e os KPIs de performance fundamentais para a disponibilidade física dos ativos. Discutiremos casos reais de aplicação, diagnósticos preditivos e procedimentos operacionais padrão (POP) para garantir a segurança e a eficiência máxima nos processos produtivos de alta complexidade.`
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
    illustration: '⚡ Esquema: Cilindro em Carga',
    inputs: [
      { key: 'force', label: 'Força (F)', unit: 'N', defaultValue: 1000 },
      { key: 'area', label: 'Área (A)', unit: 'm²', defaultValue: 0.05 }
    ],
    resultUnit: 'Pa (Pascal)',
    description: 'Calcula a pressão exercida por uma força sobre uma área específica.'
  },
  {
    id: 'cyl-force',
    name: 'Força em Cilindros',
    category: 'Hidráulica',
    isPremium: true,
    formula: 'F = P × A',
    illustration: '🔧 Esquema: Atuador Linear',
    inputs: [
      { key: 'pressure', label: 'Pressão (P)', unit: 'bar', defaultValue: 210 },
      { key: 'diameter', label: 'Diâmetro (D)', unit: 'mm', defaultValue: 100 }
    ],
    resultUnit: 'kN',
    description: 'Calcula a força de saída de um cilindro baseada na pressão e diâmetro do êmbolo.'
  },
  {
    id: 'pot-mec',
    name: 'Potência Mecânica',
    category: 'Mecânica',
    isPremium: true,
    formula: 'P = (T × n) / 9550',
    illustration: '⚙️ Esquema: Eixo de Transmissão',
    inputs: [
      { key: 'torque', label: 'Torque (T)', unit: 'Nm', defaultValue: 200 },
      { key: 'rpm', label: 'Rotação (n)', unit: 'RPM', defaultValue: 1750 }
    ],
    resultUnit: 'kW',
    description: 'Calcula a potência disponível em um eixo rotativo.'
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
