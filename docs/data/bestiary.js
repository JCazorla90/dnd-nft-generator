// ==========================================
// BESTIARIO D&D - BASE DE DATOS
// ==========================================
const DND_BESTIARY = {
  version: "5e",
  
  // Tipos de criaturas
  creatureTypes: [
    "Aberración", "Bestia", "Celestial", "Constructo", "Dragón", 
    "Elemental", "Feérico", "Demonio", "Gigante", "Humanoide", 
    "Monstruosidad", "Cieno", "Planta", "No-muerto"
  ],
  
  // Ambientes
  environments: [
    "Mazmorra", "Bosque", "Montaña", "Pantano", "Desierto", 
    "Subterráneo", "Ciudad", "Costa", "Ártico", "Plano Abismal"
  ],
  
  // Challenge Ratings (niveles de dificultad)
  challengeRatings: [
    { cr: "0", xp: 10 },
    { cr: "1/8", xp: 25 },
    { cr: "1/4", xp: 50 },
    { cr: "1/2", xp: 100 },
    { cr: "1", xp: 200 },
    { cr: "2", xp: 450 },
    { cr: "3", xp: 700 },
    { cr: "4", xp: 1100 },
    { cr: "5", xp: 1800 },
    { cr: "6", xp: 2300 },
    { cr: "7", xp: 2900 },
    { cr: "8", xp: 3900 },
    { cr: "9", xp: 5000 },
    { cr: "10", xp: 5900 },
    { cr: "11", xp: 7200 },
    { cr: "12", xp: 8400 },
    { cr: "13", xp: 10000 },
    { cr: "14", xp: 11500 },
    { cr: "15", xp: 13000 },
    { cr: "16", xp: 15000 },
    { cr: "17", xp: 18000 },
    { cr: "18", xp: 20000 },
    { cr: "19", xp: 22000 },
    { cr: "20", xp: 25000 },
    { cr: "21", xp: 33000 },
    { cr: "22", xp: 41000 },
    { cr: "23", xp: 50000 },
    { cr: "24", xp: 62000 },
    { cr: "30", xp: 155000 }
  ],
  
  // Bestiario básico (expandible)
  creatures: {
    // CR 1/8 - 1/2
    "Goblin": {
      type: "Humanoide",
      cr: "1/4",
      size: "Pequeño",
      hp: "7 (2d6)",
      ac: 15,
      speed: "30 ft",
      str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8,
      skills: ["Sigilo +6"],
      traits: ["Escapista ágil", "Ventaja furtiva"],
      actions: ["Cimitarra: +4, 1d6+2 cortante", "Arco corto: +4, 1d6+2 perforante"],
      environment: ["Bosque", "Montaña", "Mazmorra"]
    },
    "Esqueleto": {
      type: "No-muerto",
      cr: "1/4",
      size: "Mediano",
      hp: "13 (2d8+4)",
      ac: 13,
      speed: "30 ft",
      str: 10, dex: 14, con: 15, int: 6, wis: 8, cha: 5,
      immunities: ["Veneno", "Agotamiento"],
      vulnerabilities: ["Contundente"],
      traits: ["Visión en la oscuridad 60 ft"],
      actions: ["Espada corta: +4, 1d6+2 perforante", "Arco corto: +4, 1d6+2 perforante"],
      environment: ["Mazmorra", "Subterráneo", "Pantano"]
    },
    "Lobo": {
      type: "Bestia",
      cr: "1/4",
      size: "Mediano",
      hp: "11 (2d8+2)",
      ac: 13,
      speed: "40 ft",
      str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6,
      skills: ["Percepción +3", "Sigilo +4"],
      traits: ["Oído y olfato agudo", "Táctica de manada"],
      actions: ["Mordida: +4, 2d4+2 perforante, derribar"],
      environment: ["Bosque", "Montaña", "Ártico"]
    },
    
    // CR 1-3
    "Ogro": {
      type: "Gigante",
      cr: "2",
      size: "Grande",
      hp: "59 (7d10+21)",
      ac: 11,
      speed: "40 ft",
      str: 19, dex: 8, con: 16, int: 5, wis: 7, cha: 7,
      traits: ["Visión en la oscuridad 60 ft"],
      actions: ["Maza: +6, 2d8+4 contundente", "Jabalina: +6, 2d6+4 perforante"],
      environment: ["Montaña", "Bosque", "Mazmorra"]
    },
    "Orco": {
      type: "Humanoide",
      cr: "1/2",
      size: "Mediano",
      hp: "15 (2d8+6)",
      ac: 13,
      speed: "30 ft",
      str: 16, dex: 12, con: 16, int: 7, wis: 11, cha: 10,
      skills: ["Intimidación +2"],
      traits: ["Agresivo", "Visión en la oscuridad 60 ft"],
      actions: ["Hacha de batalla: +5, 1d12+3 cortante", "Jabalina: +5, 1d6+3 perforante"],
      environment: ["Montaña", "Mazmorra", "Desierto"]
    },
    "Gelatina Ocre": {
      type: "Cieno",
      cr: "2",
      size: "Grande",
      hp: "45 (6d10+12)",
      ac: 8,
      speed: "10 ft, trepar 10 ft",
      str: 15, dex: 6, con: 14, int: 2, wis: 6, cha: 1,
      immunities: ["Relámpago", "Cortante"],
      resistances: ["Ácido", "Frío", "Fuego"],
      traits: ["Amorfo", "Araña", "Corroe metal"],
      actions: ["Pseudópodo: +4, 2d6+2 contundente + 1d6 ácido"],
      environment: ["Mazmorra", "Subterráneo"]
    },
    
    // CR 4-8
    "Troll": {
      type: "Gigante",
      cr: "5",
      size: "Grande",
      hp: "84 (8d10+40)",
      ac: 15,
      speed: "30 ft",
      str: 18, dex: 13, con: 20, int: 7, wis: 9, cha: 7,
      skills: ["Percepción +2"],
      traits: ["Regeneración 10 HP/turno", "Olfato agudo", "Visión en la oscuridad 60 ft"],
      actions: ["Mordida: +7, 1d6+4 perforante", "Garra: +7, 2d6+4 cortante (2 ataques)"],
      environment: ["Pantano", "Montaña", "Bosque"]
    },
    "Hidra": {
      type: "Monstruosidad",
      cr: "8",
      size: "Enorme",
      hp: "172 (15d12+75)",
      ac: 15,
      speed: "30 ft, nadar 30 ft",
      str: 20, dex: 12, con: 20, int: 2, wis: 10, cha: 7,
      skills: ["Percepción +6"],
      traits: ["Contener aliento 1 hora", "Múltiples cabezas (5)", "Cabezas reactivas", "Cabezas que vuelven a crecer"],
      actions: ["Mordida: +8, 1d10+5 perforante (5 ataques)"],
      environment: ["Pantano", "Costa"]
    },
    "Vampiro Engendro": {
      type: "No-muerto",
      cr: "5",
      size: "Mediano",
      hp: "82 (11d8+33)",
      ac: 15,
      speed: "30 ft",
      str: 16, dex: 16, con: 16, int: 11, wis: 10, cha: 12,
      skills: ["Percepción +3", "Sigilo +6"],
      resistances: ["Nigromancia", "Daño no mágico"],
      traits: ["Regeneración 10 HP", "Trepar arañas", "Vampiro debilidades", "Visión en la oscuridad 60 ft"],
      actions: ["Multitataque (2)", "Garra: +6, 2d4+3 cortante + agarrar", "Mordida: +6, 1d6+3 perforante + 2d6 nigromancia"],
      environment: ["Mazmorra", "Subterráneo", "Ciudad"]
    },
    
    // CR 10-15 (Jefes)
    "Dragón Rojo Joven": {
      type: "Dragón",
      cr: "10",
      size: "Grande",
      hp: "178 (17d10+85)",
      ac: 18,
      speed: "40 ft, trepar 40 ft, volar 80 ft",
      str: 23, dex: 10, con: 21, int: 14, wis: 11, cha: 19,
      savingThrows: ["DES +4", "CON +9", "SAB +4", "CAR +8"],
      skills: ["Percepción +8", "Sigilo +4"],
      immunities: ["Fuego"],
      traits: ["Visión ciega 30 ft", "Visión en la oscuridad 120 ft", "Sentidos agudos"],
      actions: [
        "Multitataque (3 ataques)",
        "Mordida: +10, 2d10+6 perforante + 1d6 fuego",
        "Garra: +10, 2d6+6 cortante (2 ataques)",
        "Aliento de fuego (Recarga 5-6): Cono 30 ft, 16d6 fuego, CON CD 17"
      ],
      legendaryActions: [
        "Detectar",
        "Ataque de cola: +10, 2d8+6 contundente",
        "Ataque de ala (Cuesta 2): Empujar + volar"
      ],
      environment: ["Montaña", "Desierto"]
    },
    "Beholder": {
      type: "Aberración",
      cr: "13",
      size: "Grande",
      hp: "180 (19d10+76)",
      ac: 18,
      speed: "0 ft, volar 20 ft (levitar)",
      str: 10, dex: 14, con: 18, int: 17, wis: 15, cha: 17,
      savingThrows: ["INT +8", "SAB +7", "CAR +8"],
      skills: ["Percepción +12"],
      immunities: ["Tendido"],
      traits: ["Visión en la oscuridad 120 ft", "Cono antimagia", "Levitar"],
      actions: [
        "Mordida: +5, 4d6 perforante",
        "Rayos oculares (3 aleatorios): Rayo de encanto, Rayo paralizante, Rayo de miedo, Rayo ralentizador, Rayo enervante, Rayo de teletransporte, Rayo de petrificación, Rayo de desintegración, Rayo de muerte"
      ],
      legendaryActions: [
        "Rayo ocular (1 aleatorio)"
      ],
      environment: ["Mazmorra", "Subterráneo"]
    },
    "Balor": {
      type: "Demonio",
      cr: "19",
      size: "Enorme",
      hp: "262 (21d12+126)",
      ac: 19,
      speed: "40 ft, volar 80 ft",
      str: 26, dex: 15, con: 22, int: 20, wis: 16, cha: 22,
      savingThrows: ["FUE +14", "CON +13", "SAB +10", "CAR +13"],
      immunities: ["Fuego", "Veneno"],
      resistances: ["Frío", "Relámpago", "Daño no mágico"],
      traits: ["Aura de fuego 5 ft (10 daño fuego)", "Muerte explosiva", "Resistencia mágica", "Visión real 120 ft"],
      actions: [
        "Multitataque (2 ataques)",
        "Espada larga: +14, 3d8+8 cortante + 3d8 relámpago",
        "Látigo: +14, 2d6+8 cortante + 3d6 fuego, alcance 30 ft, arrastrar"
      ],
      environment: ["Plano Abismal", "Mazmorra"]
    }
  }
};
