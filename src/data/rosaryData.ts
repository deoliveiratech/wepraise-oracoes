export interface RosaryStep {
  id: string;
  title: string;
  description: string;
  prayer: string;
  type: 'initial' | 'mystery' | 'decade' | 'closing';
}

export const prayers = {
  creio: {
    title: "Creio",
    text: "Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra..."
  },
  paiNosso: {
    title: "Pai Nosso",
    text: "Pai nosso, que estais no céu, santificado seja o Vosso nome..."
  },
  aveMaria: {
    title: "Ave Maria",
    text: "Ave Maria, cheia de graça, o Senhor é convosco..."
  },
  gloria: {
    title: "Glória ao Pai",
    text: "Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio..."
  },
  salveRainha: {
    title: "Salve Rainha",
    text: "Salve Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve!..."
  }
};

export const mysteries = {
  gozosos: [
    "A Anunciação do Anjo Gabriel a Maria",
    "A Visitação de Maria a sua prima Isabel",
    "O Nascimento de Jesus em Belém",
    "A Apresentação de Jesus no Templo",
    "O Reencontro de Jesus no Templo"
  ],
  // ... more mysteries can be added here
};

export const getInitialSteps = (): RosaryStep[] => [
  {
    id: 'sign-cross',
    title: 'Sinal da Cruz',
    description: 'Inicie em nome do Pai, do Filho e do Espírito Santo.',
    prayer: 'Pelo sinal da Santa Cruz, livrai-nos Deus nosso Senhor, dos nossos inimigos...',
    type: 'initial'
  },
  {
    id: 'creio',
    title: 'Creio',
    description: 'Profissão de Fé',
    prayer: prayers.creio.text,
    type: 'initial'
  },
  {
    id: 'pai-nosso-1',
    title: 'Pai Nosso',
    description: 'Oração inicial',
    prayer: prayers.paiNosso.text,
    type: 'initial'
  },
  {
    id: 'ave-maria-1',
    title: '3x Ave Marias',
    description: 'Pelas virtudes da Fé, Esperança e Caridade',
    prayer: prayers.aveMaria.text,
    type: 'initial'
  },
  {
    id: 'gloria-1',
    title: 'Glória',
    description: 'Glória ao Pai',
    prayer: prayers.gloria.text,
    type: 'initial'
  }
];
