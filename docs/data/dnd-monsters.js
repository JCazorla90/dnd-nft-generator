/**
 * ═══════════════════════════════════════════════════════════════════
 * 🐉 D&D CHARACTER FORGE - MONSTERS
 * Copyright (c) 2025 José Cazorla
 * ═══════════════════════════════════════════════════════════════════
 */

const DND_MONSTERS = [
  {
    name: "Goblin Explorador", type: "Humanoide", cr: "1/4", hp: 7, ac: 15,
    description: "Pequeño, verde y malicioso.",
    actions: ["Cimitarra +4 (1d6+2)", "Arco corto +4 (1d6+2)"]
  },
  {
    name: "Orco Guerrero", type: "Humanoide", cr: "1/2", hp: 15, ac: 13,
    description: "Un bruto salvaje con un hacha enorme.",
    actions: ["Gran Hacha +5 (1d12+3)", "Jabalina +5 (1d6+3)"]
  },
  {
    name: "Ogro", type: "Gigante", cr: "2", hp: 59, ac: 11,
    description: "Enorme, tonto y hambriento.",
    actions: ["Gran Garrote +6 (2d8+4)"]
  },
  {
    name: "Lobo Huargo", type: "Bestia", cr: "1", hp: 37, ac: 14,
    description: "Un lobo monstruoso del tamaño de un caballo.",
    actions: ["Mordisco +5 (2d6+3) + Derribo"]
  },
  {
    name: "Cubo Gelatinoso", type: "Cieno", cr: "2", hp: 84, ac: 6,
    description: "Un cubo transparente que disuelve materia orgánica.",
    actions: ["Pseudópodo +4 (3d6 ácido)", "Engullir"]
  },
  {
    name: "Dragón Rojo Joven", type: "Dragón", cr: "10", hp: 178, ac: 18,
    description: "Una furia alada de escamas carmesí.",
    actions: ["Aliento de Fuego (16d6)", "Multiataque"]
  }
];
