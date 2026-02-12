
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

export const CATEGORIES_FREE = ['Hidráulica', 'Mecânica', 'Informática', 'Segurança'];
export const CATEGORIES_PREMIUM = ['Britagem / Mineração', 'Inspeção e Confiabilidade', 'Sistemas Térmicos', 'Elétrica', 'Pneumática', 'Automação', 'Instrumentação', 'Fadiga dos Materiais', 'Magnetismo', 'Metalografia'];

const categoryImages: Record<string, string> = {
  'Hidráulica': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  'Mecânica': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
  'Informática': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  'Britagem / Mineração': 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=2071&auto=format&fit=crop',
  'Segurança': 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=2070&auto=format&fit=crop',
  'Inspeção e Confiabilidade': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop',
  'Sistemas Térmicos': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop',
  'Elétrica': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop',
  'Pneumática': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
  'Automação': 'https://images.unsplash.com/photo-1518314916301-73c119885cb1?q=80&w=2070&auto=format&fit=crop',
  'Instrumentação': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop',
  'Fadiga dos Materiais': 'https://images.unsplash.com/photo-1531944352104-aa3b02393211?q=80&w=2071&auto=format&fit=crop',
  'Magnetismo': 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=2069&auto=format&fit=crop',
  'Metalografia': 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2070&auto=format&fit=crop'
};

const TECHNICAL_CONTENT: Record<string, string> = {
  'Hidráulica': "Este módulo aborda os fundamentos da mecânica dos fluidos aplicada a sistemas de potência. Estudaremos o Princípio de Pascal e como a multiplicação de força ocorre em circuitos fechados. Analisaremos a diferença entre fluxo laminar e turbulento (Número de Reynolds) e o impacto da viscosidade (ISO VG) na eficiência volumétrica de bombas de pistão. Discutiremos também a cavitação, o efeito 'diesel' em cilindros e as técnicas avançadas de contagem de partículas (ISO 4406) para garantir a longevidade dos componentes.",
  'Mecânica': "Foco em elementos de máquinas e sistemas de transmissão. Discutiremos o cálculo de vida útil de rolamentos (L10h) sob diferentes cargas radiais e axiais. Abordaremos o alinhamento de precisão (comparador centesimal e laser) e a importância da compensação térmica. O estudo inclui análise de lubrificantes, aditivação EP (Extrema Pressão) e técnicas de montagem por interferência térmica, garantindo que o ajuste entre eixo e furo atenda às tolerâncias ISO.",
  'Informática': "Convergência entre TI (Tecnologia da Informação) e TO (Tecnologia de Operação). Este módulo detalha a arquitetura de redes industriais, comparando protocolos determinísticos como Profinet e EtherNet/IP com Modbus TCP. Exploraremos a segurança cibernética em ambientes fabris, o uso de firewalls industriais e a implementação de gateways IIoT para coleta de dados em nuvem via MQTT ou OPC-UA, visando a Manutenção Preditiva 4.0.",
  'Segurança': "Gestão de riscos e conformidade com as normas regulamentadoras (NR-12, NR-10 e NR-35). Analisaremos o método HRN (Hazard Rating Number) para quantificação de riscos em máquinas. Detalharemos os protocolos de bloqueio e etiquetagem (LOTO - Lockout Tagout), a especificação técnica de dispositivos de intertravamento categoria 4 e a importância da análise ergonômica do posto de trabalho para prevenir doenças ocupacionais.",
  'Britagem / Mineração': "Engenharia de processamento mineral. Estudaremos o ciclo de vida de mandíbulas e mantos de britadores cônicos, focando na dureza Brinell e tenacidade ao impacto. Analisaremos a curva granulométrica resultante do ajuste do CSS (Closed Side Setting) e como o 'tramping' de metais pode causar falhas catastróficas. Discutiremos também a eficiência de peneiramento e o cálculo de carga circulante em circuitos fechados de moagem.",
  'Inspeção e Confiabilidade': "Metodologias de manutenção de classe mundial. Abordaremos a RCM (Manutenção Centrada em Confiabilidade) e a condução de FMEA (Análise de Modos de Falha e Efeitos). Detalharemos técnicas de monitoramento de condição: análise de vibrações (envelope de aceleração), termografia infravermelha para detecção de pontos quentes em subestações e análise de óleo por ferrografia analítica para identificação de desgaste severo.",
  'Sistemas Térmicos': "Termodinâmica aplicada e troca de calor. Estudaremos o Ciclo de Rankine em usinas térmicas e o balanceamento calórico em caldeiras a vapor. Analisaremos a eficiência de trocadores de calor de placas vs casco e tubos, focando no coeficiente global de transferência (U) e no 'fouling' (incrustação). O estudo inclui tratamento químico de água de alimentação e recuperação de condensado para otimização energética.",
  'Elétrica': "Sistemas de potência e máquinas elétricas. Analisaremos o triângulo de potências (Ativa, Reativa e Aparente) e as técnicas de correção de fator de potência via bancos de capacitores automáticos. Estudaremos o funcionamento de inversores de frequência (VFDs) e o controle vetorial de torque em motores de indução. Abordaremos também a coordenação de proteção e o cálculo de energia incidente para vestimentas de arco elétrico.",
  'Pneumática': "Automação pneumática avançada. Focaremos na preparação de ar comprimido (Unidade FRL) seguindo a norma ISO 8573-1 de pureza. Analisaremos o funcionamento de válvulas direcionais de 5/2 vias e lógica pneumática pura. Estudaremos a redução de consumo de ar via detecção de vazamentos ultrassônica e a otimização de circuitos através de reservatórios locais para compensação de picos de demanda.",
  'Automação': "Lógica de controle industrial. Estudaremos a programação de CLPs (Controladores Lógicos Programáveis) conforme a norma IEC 61131-3, com foco em Ladder e Texto Estruturado. Analisaremos o ajuste de malhas PID (Proporcional-Integral-Derivativo) usando o método de Ziegler-Nichols e o design de interfaces IHM (Interface Homem-Máquina) baseado em padrões de alta performance para redução de carga cognitiva.",
  'Instrumentação': "Medição e controle de processos. Detalharemos a calibração de transmissores de pressão e nível usando protocolos HART e loops de 4-20mA. Estudaremos a incerteza de medição e a rastreabilidade metrológica. Analisaremos medidores de vazão eletromagnéticos e de massa (Coriolis), focando na precisão e nos efeitos de perfil de velocidade do fluido no processo industrial.",
  'Fadiga dos Materiais': "Mecânica da fratura e vida em fadiga. Analisaremos as curvas S-N (Wöhler) e o limite de resistência à fadiga para aços e ligas não-ferrosas. Estudaremos os fatores de concentração de tensão (Kt) em entalhes e furos. Abordaremos a iniciação e propagação de trincas (Lei de Paris) e as técnicas de ensaios não destrutivos (Líquido Penetrante e Partícula Magnética) para detecção precoce de falhas cíclicas.",
  'Magnetismo': "Eletromagnetismo aplicado à inspeção. Estudaremos a indução magnética e as leis de Faraday e Lenz em aplicações industriais. Detalharemos o ensaio de Partículas Magnéticas e a técnica MFL (Magnetic Flux Leakage) para inspeção de dutos e cabos de aço. Analisaremos também o funcionamento de separadores magnéticos de alta intensidade usados no beneficiamento de minérios de ferro.",
  'Metalografia': "Ciência dos materiais e microestrutura. Abordaremos o preparo de amostras (corte, embutimento, lixamento e polimento) e o ataque químico para revelação de contornos de grão. Analisaremos diagramas de fase Ferro-Carbono (Fe-C) e o impacto dos tratamentos térmicos (têmpera, revenimento e normalização) nas fases perlita, martensita e austenita retida."
};

const generateArticles = () => {
  const articles: Article[] = [];
  const allCats = [...CATEGORIES_FREE, ...CATEGORIES_PREMIUM];
  
  allCats.forEach(cat => {
    const baseContent = TECHNICAL_CONTENT[cat] || `Conteúdo técnico especializado sobre ${cat}.`;
    for (let i = 1; i <= 17; i++) {
      const imageUrl = categoryImages[cat] || `https://loremflickr.com/800/600/industrial?lock=${cat.length + i}`;
      articles.push({
        id: `${cat.toLowerCase().replace(/ /g, '-')}-${i}`,
        title: `Estudo Avançado: ${cat} - Módulo ${i}`,
        category: cat,
        isPremium: CATEGORIES_PREMIUM.includes(cat),
        readTime: 25,
        imageUrl: imageUrl,
        content: `${baseContent}\n\nNo Módulo ${i}, aprofundamos a aplicação prática destes conceitos em cenários reais de manutenção e engenharia de campo, focando em diagnósticos de precisão e metodologias de análise de falha raíz (RCFA).`
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

export interface LevelInfo {
  level: number;
  minXp: number;
  title: string;
  medal: string;
  message: string;
  features: string[];
}

export const LEVELS: LevelInfo[] = [
  { level: 1, minXp: 0, title: 'Assistente Técnico', medal: '🥉', message: 'Iniciando a jornada profissional.', features: ['Artigos Free', 'Calculadoras Básicas'] },
  { level: 2, minXp: 1000, title: 'Técnico de Manutenção', medal: '🥈', message: 'Habilidades básicas consolidadas.', features: ['Checklists Customizados'] },
  { level: 3, minXp: 2500, title: 'Técnico Especialista', medal: '🥇', message: 'Referência em diagnósticos de campo.', features: ['Relatórios PDF'] },
  { level: 4, minXp: 5000, title: 'Inspetor de Confiabilidade', medal: '💠', message: 'Foco em análise de falhas e RCM.', features: ['Acesso Avançado'] },
  { level: 5, minXp: 10000, title: 'Engenheiro de Campo Pro', medal: '💎', message: 'Nível máximo de proficiência técnica.', features: ['Consultoria Interna'] }
];
