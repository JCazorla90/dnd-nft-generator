// ==========================================
// 🐉 BESTIARIO D&D COMPLETO - TODAS LAS EDICIONES
// ==========================================

const DND_BESTIARY = {
  version: "5e",
  
  creatureTypes: [
    "Aberración", "Bestia", "Celestial", "Constructo", "Dragón", 
    "Elemental", "Feérico", "Demonio", "Gigante", "Humanoide", 
    "Monstruosidad", "Cieno", "Planta", "No-muerto"
  ],
  
  environments: [
    "Mazmorra", "Bosque", "Montaña", "Pantano", "Desierto", 
    "Subterráneo", "Ciudad", "Costa", "Ártico", "Plano Abismal",
    "Caverna", "Fortaleza", "Ruinas", "Torre"
  ],
  
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
    { cr: "20", xp: 25000 }
  ],
  
  creatures: {
    // ===== CR 0-1/4 =====
    "Goblin": {
      type: "Humanoide",
      cr: "1/4",
      xp: 50,
      size: "Pequeño",
      hp: "7 (2d6)",
      ac: 15,
      speed: "30 ft",
      str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8,
      skills: ["Sigilo +6"],
      traits: ["Escapista ágil", "Ventaja furtiva"],
      actions: ["Cimitarra: +4, 1d6+2 cortante", "Arco corto: +4, 1d6+2 perforante"],
      environment: ["Bosque", "Montaña", "Mazmorra", "Caverna"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Esqueleto": {
      type: "No-muerto",
      cr: "1/4",
      xp: 50,
      size: "Mediano",
      hp: "13 (2d8+4)",
      ac: 13,
      speed: "30 ft",
      str: 10, dex: 14, con: 15, int: 6, wis: 8, cha: 5,
      immunities: ["Veneno", "Agotamiento"],
      vulnerabilities: ["Contundente"],
      traits: ["Visión en la oscuridad 60 ft", "Frágil"],
      actions: ["Espada corta: +4, 1d6+2 perforante", "Arco corto: +4, 1d6+2 perforante"],
      environment: ["Mazmorra", "Subterráneo", "Pantano", "Ruinas"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Lobo": {
      type: "Bestia",
      cr: "1/4",
      xp: 50,
      size: "Mediano",
      hp: "11 (2d8+2)",
      ac: 13,
      speed: "40 ft",
      str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6,
      skills: ["Percepción +3", "Sigilo +4"],
      traits: ["Oído y olfato agudo", "Táctica de manada"],
      actions: ["Mordida: +4, 2d4+2 perforante, derribar CD 11"],
      environment: ["Bosque", "Montaña", "Ártico", "Llanura"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Rata Grande": {
      type: "Bestia",
      cr: "1/8",
      xp: 25,
      size: "Pequeño",
      hp: "7 (2d6)",
      ac: 12,
      speed: "20 ft, nadar 20 ft",
      str: 6, dex: 14, con: 10, int: 2, wis: 11, cha: 4,
      traits: ["Olfato agudo"],
      actions: ["Mordida: +4, 1d4+2 perforante"],
      environment: ["Ciudad", "Mazmorra", "Subterráneo"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Bandido": {
      type: "Humanoide",
      cr: "1/8",
      xp: 25,
      size: "Mediano",
      hp: "11 (2d8+2)",
      ac: 12,
      speed: "30 ft",
      str: 11, dex: 13, con: 12, int: 10, wis: 10, cha: 10,
      skills: ["Engaño +2", "Intimidación +2"],
      traits: ["Armas simples"],
      actions: ["Espada corta: +3, 1d6+1 cortante", "Arco corto: +3, 1d6+1 perforante"],
      environment: ["Ciudad", "Bosque", "Caminos"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Aprendiz de Mago": {
      type: "Humanoide",
      cr: "1/4",
      xp: 50,
      size: "Mediano",
      hp: "9 (2d8)",
      ac: 12,
      speed: "30 ft",
      str: 10, dex: 14, con: 10, int: 14, wis: 11, cha: 11,
      traits: ["Lanzamiento de conjuros (INT)", "Truco: Explosión mágica"],
      actions: ["Daga: +4, 1d4+2 perforante", "Explosión mágica: +4, 1d4 fuego"],
      environment: ["Ciudad", "Torre", "Mazmorra"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    // ===== CR 1/2 - 1 =====
    "Orco": {
      type: "Humanoide",
      cr: "1/2",
      xp: 100,
      size: "Mediano",
      hp: "15 (2d8+6)",
      ac: 13,
      speed: "30 ft",
      str: 16, dex: 12, con: 16, int: 7, wis: 11, cha: 10,
      skills: ["Intimidación +2"],
      traits: ["Agresivo", "Visión en la oscuridad 60 ft"],
      actions: ["Hacha de batalla: +5, 1d12+3 cortante", "Jabalina: +5, 1d6+3 perforante"],
      environment: ["Montaña", "Mazmorra", "Desierto", "Bosque"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Zombi": {
      type: "No-muerto",
      cr: "1/4",
      xp: 50,
      size: "Mediano",
      hp: "22 (3d8+3)",
      ac: 8,
      speed: "20 ft",
      str: 13, dex: 6, con: 16, int: 3, wis: 6, cha: 5,
      immunities: ["Veneno"],
      traits: ["Vigor no-muerto"],
      actions: ["Golpe: +3, 1d6+1 contundente"],
      environment: ["Mazmorra", "Pantano", "Ciudad", "Ruinas"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Archero Veterano": {
      type: "Humanoide",
      cr: "3",
      xp: 700,
      size: "Mediano",
      hp: "27 (5d8+5)",
      ac: 16,
      speed: "30 ft",
      str: 11, dex: 16, con: 12, int: 11, wis: 13, cha: 10,
      skills: ["Percepción +4"],
      traits: ["Puntería"],
      actions: ["Arco largo: +5, 1d8+3 perforante", "Espada corta: +4, 1d6+2 cortante"],
      environment: ["Ciudad", "Castillo", "Bosque"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    // ===== CR 2-3 =====
    "Ogro": {
      type: "Gigante",
      cr: "2",
      xp: 450,
      size: "Grande",
      hp: "59 (7d10+21)",
      ac: 11,
      speed: "40 ft",
      str: 19, dex: 8, con: 16, int: 5, wis: 7, cha: 7,
      traits: ["Visión en la oscuridad 60 ft", "Brutal"],
      actions: ["Maza: +6, 2d8+4 contundente", "Jabalina: +6, 2d6+4 perforante"],
      environment: ["Montaña", "Bosque", "Mazmorra", "Pantano"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Gelatina Ocre": {
      type: "Cieno",
      cr: "2",
      xp: 450,
      size: "Grande",
      hp: "45 (6d10+12)",
      ac: 8,
      speed: "10 ft, trepar 10 ft",
      str: 15, dex: 6, con: 14, int: 2, wis: 6, cha: 1,
      immunities: ["Relámpago", "Cortante"],
      resistances: ["Ácido", "Frío", "Fuego"],
      traits: ["Amorfo", "Araña", "Corroe metal"],
      actions: ["Pseudópodo: +4, 2d6+2 contundente + 1d6 ácido"],
      environment: ["Mazmorra", "Subterráneo", "Caverna"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Mago Oscuro": {
      type: "Humanoide",
      cr: "3",
      xp: 700,
      size: "Mediano",
      hp: "22 (4d8+4)",
      ac: 12,
      speed: "30 ft",
      str: 10, dex: 14, con: 12, int: 16, wis: 13, cha: 11,
      skills: ["Arcana +5", "Insight +3"],
      traits: ["Resistencia mágica", "Lanzamiento de conjuros"],
      actions: ["Daga: +4, 1d4+2", "Rayo: +5, 2d6 relámpago", "Esfera de fuego (1/día): 7d6 fuego"],
      environment: ["Torre", "Ciudad", "Mazmorra"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    // ===== CR 4-5 =====
    "Troll": {
      type: "Gigante",
      cr: "5",
      xp: 1800,
      size: "Grande",
      hp: "84 (8d10+40)",
      ac: 15,
      speed: "30 ft",
      str: 18, dex: 13, con: 20, int: 7, wis: 9, cha: 7,
      skills: ["Percepción +2"],
      traits: ["Regeneración 10 HP/turno", "Olfato agudo", "Visión en la oscuridad 60 ft"],
      actions: ["Mordida: +7, 1d6+4 perforante", "Garra: +7, 2d6+4 cortante (2 ataques)"],
      environment: ["Pantano", "Montaña", "Bosque", "Caverna"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Vampiro Engendro": {
      type: "No-muerto",
      cr: "5",
      xp: 1800,
      size: "Mediano",
      hp: "82 (11d8+33)",
      ac: 15,
      speed: "30 ft",
      str: 16, dex: 16, con: 16, int: 11, wis: 10, cha: 12,
      skills: ["Percepción +3", "Sigilo +6"],
      resistances: ["Nigromancia", "Daño no mágico"],
      traits: ["Regeneración 10 HP", "Trepar arañas", "Debilidades vampíricas"],
      actions: ["Garra: +6, 2d4+3 cortante", "Mordida: +6, 1d6+3 + 2d6 nigromancia"],
      environment: ["Mazmorra", "Subterráneo", "Ciudad", "Castillo"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Sapo Gigante": {
      type: "Bestia",
      cr: "1/4",
      xp: 50,
      size: "Grande",
      hp: "22 (3d10+6)",
      ac: 11,
      speed: "20 ft, nadar 20 ft",
      str: 15, dex: 13, con: 14, int: 2, wis: 10, cha: 3,
      traits: ["Salto acrobático", "Lengua pegajosa"],
      actions: ["Mordida: +4, 1d8+2 perforante", "Lengua: +4, 1d6+2 contundente, agarrar"],
      environment: ["Pantano", "Bosque", "Caverna"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    // ===== CR 6-8 =====
    "Hidra": {
      type: "Monstruosidad",
      cr: "8",
      xp: 3900,
      size: "Enorme",
      hp: "172 (15d12+75)",
      ac: 15,
      speed: "30 ft, nadar 30 ft",
      str: 20, dex: 12, con: 20, int: 2, wis: 10, cha: 7,
      skills: ["Percepción +6"],
      traits: ["Múltiples cabezas (5)", "Cabezas reactivas", "Cabezas regeneran"],
      actions: ["Mordida: +8, 1d10+5 perforante (5 ataques)"],
      environment: ["Pantano", "Costa", "Caverna acuática"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Medusa": {
      type: "Monstruosidad",
      cr: "6",
      xp: 2300,
      size: "Mediano",
      hp: "127 (17d8+51)",
      ac: 15,
      speed: "30 ft",
      str: 10, dex: 15, con: 16, int: 12, wis: 13, cha: 15,
      skills: ["Engaño +5", "Percepción +4"],
      traits: ["Mirada petrificante", "Visión en la oscuridad 60 ft"],
      actions: ["Serpiente: +5, 1d4+2 + 3d6 veneno", "Arco corto: +5, 1d6+2 + 2d6 veneno"],
      environment: ["Mazmorra", "Ruinas", "Caverna"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    // ===== CR 10+ (JEFES ÉPICOS) =====
    "Dragón Rojo Joven": {
      type: "Dragón",
      cr: "10",
      xp: 5900,
      size: "Grande",
      hp: "178 (17d10+85)",
      ac: 18,
      speed: "40 ft, trepar 40 ft, volar 80 ft",
      str: 23, dex: 10, con: 21, int: 14, wis: 11, cha: 19,
      savingThrows: ["DES +4", "CON +9", "SAB +4", "CAR +8"],
      skills: ["Percepción +8", "Sigilo +4"],
      immunities: ["Fuego"],
      traits: ["Visión ciega 30 ft", "Visión en la oscuridad 120 ft"],
      actions: ["Multitataque", "Mordida: +10, 2d10+6 + 1d6 fuego", "Aliento fuego: 16d6 fuego, CON CD 17"],
      legendaryActions: ["Detectar", "Ataque cola", "Ataque ala (cuesta 2)"],
      environment: ["Montaña", "Desierto"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Beholder": {
      type: "Aberración",
      cr: "13",
      xp: 10000,
      size: "Grande",
      hp: "180 (19d10+76)",
      ac: 18,
      speed: "0 ft, volar 20 ft (levitar)",
      str: 10, dex: 14, con: 18, int: 17, wis: 15, cha: 17,
      savingThrows: ["INT +8", "SAB +7", "CAR +8"],
      skills: ["Percepción +12"],
      immunities: ["Tendido"],
      traits: ["Cono antimagia 150 ft", "Levitar"],
      actions: ["Mordida: +5, 4d6 perforante", "Rayos oculares (3d6 tipos)"],
      legendaryActions: ["Rayo ocular"],
      environment: ["Mazmorra", "Subterráneo"],
      editions: { "5e": true, "3.5e": false, "4e": true }
    },
    
    "Balor": {
      type: "Demonio",
      cr: "19",
      xp: 22000,
      size: "Enorme",
      hp: "262 (21d12+126)",
      ac: 19,
      speed: "40 ft, volar 80 ft",
      str: 26, dex: 15, con: 22, int: 20, wis: 16, cha: 22,
      savingThrows: ["FUE +14", "CON +13", "SAB +10", "CAR +13"],
      immunities: ["Fuego", "Veneno"],
      resistances: ["Frío", "Relámpago", "Daño no mágico"],
      traits: ["Aura de fuego 5 ft", "Muerte explosiva", "Resistencia mágica"],
      actions: ["Espada larga: +14, 3d8+8 + 3d8 relámpago", "Látigo: +14, 2d6+8 + 3d6 fuego"],
      environment: ["Plano Abismal", "Mazmorra"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    },
    
    "Liche": {
      type: "No-muerto",
      cr: "21",
      xp: 33000,
      size: "Mediano",
      hp: "135 (18d8+54)",
      ac: 17,
      speed: "30 ft",
      str: 11, dex: 16, con: 16, int: 20, wis: 14, cha: 16,
      savingThrows: ["CON +10", "INT +12", "SAB +9"],
      skills: ["Arcana +19", "Historia +12", "Percepción +9"],
      immunities: ["Veneno", "Nigromancia"],
      resistances: ["Frío", "Relámpago", "Daño no mágico"],
      traits: ["Rejuvenecimiento (filacteria)", "Resistencia mágica"],
      actions: ["Toque paralizante: +12, 3d6 frío + parálisis", "Lanzar hechizos"],
      legendaryActions: ["Truco arcano", "Toque paralizante", "Mirada asustadora"],
      environment: ["Torre", "Mazmorra", "Ruinas"],
      editions: { "5e": true, "3.5e": true, "4e": true }
    }
  }
};

// Exportar globalmente
if (typeof window !== 'undefined') {
  window.DND_BESTIARY = DND_BESTIARY;
  console.log('✅ Bestiario cargado:', Object.keys(DND_BESTIARY.creatures).length, 'criaturas disponibles');
}
