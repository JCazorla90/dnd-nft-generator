// ==========================================
// 👹 BESTIARIO BÁSICO PARA GENERACIÓN LOCAL
// ==========================================

const DND_MONSTERS = [
  {
    name: "Goblin",
    type: "Humanoide",
    cr: "1/4",
    xp: 50,
    ac: 15,
    hp: 7,
    speed: "30 ft",
    stats: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    environment: ["Bosque", "Mazmorra"],
    traits: ["Nimble Escape"],
    actions: ["Hoja curva: +4, 1d6 + 2 daño cortante."],
    legendaryActions: []
  },
  {
    name: "Ogro",
    type: "Gigante",
    cr: "2",
    xp: 450,
    ac: 11,
    hp: 59,
    speed: "40 ft",
    stats: { str: 19, dex: 8, con: 17, int: 5, wis: 7, cha: 7 },
    environment: ["Montaña", "Bosque"],
    traits: [],
    actions: ["Garrote grande: +6, 2d8 + 4 daño contundente."],
    legendaryActions: []
  },
  {
    name: "Espectro",
    type: "No-muerto",
    cr: "1",
    xp: 200,
    ac: 12,
    hp: 22,
    speed: "0 ft, fly 50 ft",
    stats: { str: 1, dex: 14, con: 11, int: 10, wis: 10, cha: 16 },
    environment: ["Tumba", "Ruinas"],
    traits: ["Incorpóreo"],
    actions: ["Toque Espectral: +5, 3d6+3 de daño necrótico."],
    legendaryActions: []
  },
  {
    name: "Joven Dragón Rojo",
    type: "Dragón",
    cr: "10",
    xp: 5900,
    ac: 18,
    hp: 178,
    speed: "40 ft, fly 80 ft",
    stats: { str: 23, dex: 10, con: 21, int: 14, wis: 11, cha: 19 },
    environment: ["Montaña", "Volcán"],
    traits: ["Resistencia al Fuego"],
    actions: ["Mordida: +10, 2d6+6", "Aliento de Fuego (60 ft Cone)"],
    legendaryActions: []
  }
];
