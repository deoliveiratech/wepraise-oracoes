export interface RosaryStep {
  id: string;
  title: string;
  description: string;
  prayer: string;
  prePrayer?: string;
  postPrayer?: string;
  type: 'initial' | 'mystery' | 'decade' | 'closing';
  subStepCount?: number;
}

export const prayers = {
  creio: {
    title: "Creio",
    text: "Creio em Deus Pai todo-poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém."
  },
  paiNosso: {
    title: "Pai Nosso",
    text: "Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino, seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém."
  },
  aveMaria: {
    title: "Ave Maria",
    text: "Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém."
  },
  gloria: {
    title: "Glória ao Pai",
    text: "Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém."
  },
  ohMeuJesus: {
    title: "Ó meu Jesus",
    text: "Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno, levai as almas todas para o céu e socorrei principalmente as que mais precisarem. Amém."
  },
  salveRainha: {
    title: "Salve Rainha",
    text: "Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus. Para que sejamos dignos das promessas de Cristo. Amém."
  },
  agradecimento: {
    title: "Agradecimento",
    text: "Infinitas graças vos damos, Soberana Rainha, pelos benefícios que todos os dias recebemos de vossas mãos liberais. Dignai-vos, agora e para sempre, tomar-nos debaixo do vosso poderoso amparo e, para mais vos obrigar, vos saudamos com uma Salve Rainha."
  }
};

export const allMysteries = {
  gozosos: {
    name: "Mistérios Gozosos",
    days: [1, 6], // Segunda e Sábado
    items: [
      "A Anunciação do Anjo Gabriel a Maria",
      "A Visitação de Maria a sua prima Santa Isabel",
      "O Nascimento de Jesus em Belém",
      "A Apresentação de Jesus no Templo",
      "A Perda e o Encontro de Jesus no Templo"
    ]
  },
  dolorosos: {
    name: "Mistérios Dolorosos",
    days: [2, 5], // Terça e Sexta
    items: [
      "A Agonia de Jesus no Horto das Oliveiras",
      "A Flagelação de Jesus atado à coluna",
      "A Coroação de Espinhos",
      "Jesus carrega a Cruz a caminho do Calvário",
      "A Crucifixão e Morte de Jesus"
    ]
  },
  gloriosos: {
    name: "Mistérios Gloriosos",
    days: [3, 0], // Quarta e Domingo
    items: [
      "A Ressurreição de Jesus",
      "A Ascensão de Jesus ao Céu",
      "A Vinda do Espírito Santo (Pentecostes)",
      "A Assunção de Nossa Senhora ao Céu",
      "A Coroação de Nossa Senhora no Céu"
    ]
  },
  luminosos: {
    name: "Mistérios Luminosos",
    days: [4], // Quinta
    items: [
      "O Batismo de Jesus no Jordão",
      "A Auto-revelação de Jesus nas Bodas de Caná",
      "O Anúncio do Reino de Deus e o convite à conversão",
      "A Transfiguração de Jesus",
      "A Instituição da Eucaristia"
    ]
  }
};

export const getMysteriesByDay = (date: Date = new Date()) => {
  const day = date.getDay();
  if (allMysteries.gozosos.days.includes(day)) return allMysteries.gozosos;
  if (allMysteries.dolorosos.days.includes(day)) return allMysteries.dolorosos;
  if (allMysteries.gloriosos.days.includes(day)) return allMysteries.gloriosos;
  if (allMysteries.luminosos.days.includes(day)) return allMysteries.luminosos;
  return allMysteries.gozosos;
};

export const getInitialSteps = (mysteryType?: keyof typeof allMysteries): RosaryStep[] => {
  const selectedMystery = mysteryType ? allMysteries[mysteryType] : getMysteriesByDay();
  
  const steps: RosaryStep[] = [
    {
      id: 'sign-cross',
      title: 'Sinal da Cruz',
      description: 'Inicie sua oração',
      prayer: 'Pelo sinal da Santa Cruz, livrai-nos Deus nosso Senhor, dos nossos inimigos. Em nome do Pai, do Filho e do Espírito Santo. Amém.',
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
      id: 'intro-pai-nosso',
      title: 'Pai Nosso',
      description: 'Oração inicial',
      prayer: prayers.paiNosso.text,
      type: 'initial'
    },
    {
      id: 'intro-ave-marias',
      title: '3x Ave Marias',
      description: 'Fé, Esperança e Caridade',
      prayer: prayers.aveMaria.text,
      type: 'initial',
      subStepCount: 3
    },
    {
      id: 'intro-gloria',
      title: 'Glória',
      description: 'Doxologia',
      prayer: `${prayers.gloria.text}\n\n${prayers.ohMeuJesus.text}`,
      type: 'initial'
    }
  ];

  // Add 5 Mysteries/Decades
  selectedMystery.items.forEach((mystery, i) => {
    steps.push({
      id: `mystery-${i+1}`,
      title: `${i+1}º Mistério`,
      description: mystery,
      prayer: prayers.aveMaria.text,
      prePrayer: prayers.paiNosso.text,
      postPrayer: `${prayers.gloria.text}\n\n${prayers.ohMeuJesus.text}`,
      type: 'mystery',
      subStepCount: 10
    });
  });

  // Closing
  steps.push({
    id: 'agradecimento',
    title: 'Agradecimento',
    description: 'Oração Final',
    prayer: prayers.agradecimento.text,
    type: 'closing'
  });

  steps.push({
    id: 'salve-rainha',
    title: 'Salve Rainha',
    description: 'Encerramento',
    prayer: prayers.salveRainha.text,
    type: 'closing'
  });

  return steps;
};
