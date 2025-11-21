// Bestiario básico para el generador de criaturas y encuentros
// CR y XP aproximados según DMG, más que suficientes para uso rápido.

const DND_MONSTERS = [
  {
    name: "Goblin",
    type: "Humanoide",
    size: "Pequeño",
    alignment: "Malvado neutral",
    cr: 0.25,
    xp: 50,
    ac: 15,
    hp: 7,
    speed: "30 ft",
    stats: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    environments: ["Bosque", "Mazmorra", "Urbano"],
    traits: [
      "Nimble Escape: puede Desengancharse o Esconderse como acción adicional en cada uno de sus turnos."
    ],
    actions: [
      "Hoja curva: Ataque cuerpo a cuerpo +4 al impacto, alcance 1,5 m, 1 objetivo. Impacto: 1d6 + 2 daño cortante.",
      "Arco corto: Ataque a distancia +4 al impacto, alcance 24/96 m, 1 objetivo. Impacto: 1d6 + 2 daño perforante."
    ]
  },
  {
    name: "Bandido",
    type: "Humanoide",
    size: "Mediano",
    alignment: "Cualquier no legal",
    cr: 0.125,
    xp: 25,
    ac: 12,
    hp: 11,
    speed: "30 ft",
    stats: { str: 11, dex: 12, con: 12, int: 10, wis: 10, cha: 10 },
    environments: ["Urbano", "Llanura", "Bosque"],
    traits: [],
    actions: [
      "Simitarra: ataque cuerpo a cuerpo +3 al impacto, 1d6 + 1 daño cortante.",
      "Ballesta ligera: ataque a distancia +3 al impacto, 1d8 + 1 daño perforante."
    ]
  },
  {
    name: "Orco",
    type: "Humanoide",
    size: "Mediano",
    alignment: "Caótico malvado",
    cr: 0.5,
    xp: 100,
    ac: 13,
    hp: 15,
    speed: "30 ft",
    stats: { str: 16, dex: 12, con: 16, int: 7, wis: 11, cha: 10 },
    environments: ["Montaña", "Bosque", "Llanura"],
    traits: [
      "Carga agresiva: como acción adicional, puede moverse hasta su velocidad hacia un enemigo que pueda ver."
    ],
    actions: [
      "Hacha grande: +5 al impacto, 1d12 + 3 daño cortante.",
      "Jabalina (cuerpo a cuerpo o a distancia): +5 al impacto, 1d6 + 3 daño perforante."
    ]
  },
  {
    name: "Lobo",
    type: "Bestia",
    size: "Mediano",
    alignment: "Sin alineamiento",
    cr: 0.25,
    xp: 50,
    ac: 13,
    hp: 11,
    speed: "40 ft",
    stats: { str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6 },
    environments: ["Bosque", "Llanura", "Montaña"],
    traits: [
      "Olfato agudo: tiene ventaja en las pruebas de Sabiduría (Percepción) que dependan del olfato.",
      "Tácticas de manada: tiene ventaja en las tiradas de ataque contra una criatura si al menos un aliado está a 1,5 m de ella."
    ],
    actions: [
      "Mordisco: +4 al impacto, 2d4 + 2 daño perforante. Si el objetivo es una criatura, debe superar una salvación de Fuerza o caer derribado."
    ]
  },
  {
    name: "Esqueleto",
    type: "No-muerto",
    size: "Mediano",
    alignment: "Malvado neutral",
    cr: 0.25,
    xp: 50,
    ac: 13,
    hp: 13,
    speed: "30 ft",
    stats: { str: 10, dex: 14, con: 15, int: 6, wis: 8, cha: 5 },
    environments: ["Mazmorra", "Cripta"],
    traits: [
      "Inmunidad al veneno. Resistencia al daño perforante y cortante de ataques no mágicos."
    ],
    actions: [
      "Espada corta: +4 al impacto, 1d6 + 2 daño perforante.",
      "Arco corto: +4 al impacto, 1d6 + 2 daño perforante."
    ]
  },
  {
    name: "Zombi",
    type: "No-muerto",
    size: "Mediano",
    alignment: "Malvado neutral",
    cr: 0.25,
    xp: 50,
    ac: 8,
    hp: 22,
    speed: "20 ft",
    stats: { str: 13, dex: 6, con: 16, int: 3, wis: 6, cha: 5 },
    environments: ["Mazmorra", "Cripta", "Pantano"],
    traits: [
      "Resistencia a la muerte: cuando llega a 0 PG, tira un d20; con 5+ se queda a 1 PG."
    ],
    actions: [
      "Golpe: +3 al impacto, 1d6 + 1 daño contundente."
    ]
  },
  {
    name: "Ogro",
    type: "Gigante",
    size: "Grande",
    alignment: "Caótico malvado",
    cr: 2,
    xp: 450,
    ac: 11,
    hp: 59,
    speed: "40 ft",
    stats: { str: 19, dex: 8, con: 16, int: 5, wis: 7, cha: 7 },
    environments: ["Montaña", "Bosque", "Llanura"],
    traits: [],
    actions: [
      "Garrote grande: +6 al impacto, 2d8 + 4 daño contundente.",
      "Jabalina: +6 al impacto, 2d6 + 4 daño perforante."
    ]
  },
  {
    name: "Trol",
    type: "Gigante",
    size: "Grande",
    alignment: "Caótico malvado",
    cr: 5,
    xp: 1800,
    ac: 15,
    hp: 84,
    speed: "30 ft",
    stats: { str: 18, dex: 13, con: 20, int: 7, wis: 9, cha: 7 },
    environments: ["Pantano", "Cueva", "Montaña"],
    traits: [
      "Regeneración: recupera PG al inicio de su turno si no ha recibido daño de fuego o ácido."
    ],
    actions: [
      "Multiataque: tres ataques: una mordida y dos zarpazos.",
      "Mordida: +7 al impacto, 1d6 + 4 daño perforante.",
      "Zarpazo: +7 al impacto, 2d6 + 4 daño cortante."
    ]
  },
  {
    name: "Joven dragón rojo",
    type: "Dragón",
    size: "Grande",
    alignment: "Caótico malvado",
    cr: 10,
    xp: 5900,
    ac: 18,
    hp: 178,
    speed: "40 ft, volar 80 ft",
    stats: { str: 23, dex: 10, con: 21, int: 14, wis: 11, cha: 19 },
    environments: ["Montaña", "Caverna"],
    traits: [
      "Sentidos agudos: ventaja en Percepción.",
      "Resistencia al fuego."
    ],
    actions: [
      "Multiataque: un ataque de mordisco y dos de garra.",
      "Aliento de fuego (Recarga 5-6): cono de 9 m, daño de fuego alto a los que fallen la salvación de DEX."
    ]
  }
];
