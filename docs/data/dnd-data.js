/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎲 D&D CHARACTER FORGE - CORE DATA
 * Copyright (c) 2025 José Cazorla
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

// ===== ESTADO GLOBAL (Compartido por módulos) =====
let currentCharacter = null;
let currentCreature = null;
let currentEncounter = [];
const STORAGE_KEY = 'dnd_character_history';

// ===== 🎲 UTILIDADES BÁSICAS =====
function randomFromArray(arr) {
  if (!arr || arr.length === 0) return 'Desconocido';
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function calculateModifier(stat) {
  return Math.floor((stat - 10) / 2);
}

// ===== 📊 GENERADOR DE ESTADÍSTICAS (4d6 drop lowest) =====
function generateStats() {
  const rollStat = () => {
    const rolls = [rollDice(6), rollDice(6), rollDice(6), rollDice(6)];
    rolls.sort((a, b) => a - b);
    return rolls.slice(1).reduce((a, b) => a + b, 0);
  };
  
  return {
    strength: rollStat(),
    dexterity: rollStat(),
    constitution: rollStat(),
    intelligence: rollStat(),
    wisdom: rollStat(),
    charisma: rollStat()
  };
}

// ===== ✨ GENERADOR DE NOMBRES ÉPICOS (EXPANDIDO) =====
function generateRandomName(race, charClass, universe = 'DND') {
  const dndNames = {
    'Humano': ['Aric', 'Elara', 'Tiberius', 'Seraphina'],
    'Elfo': ['Faen', 'Lia', 'Rolan', 'Sylvana'],
    'Enano': ['Gimli', 'Durin', 'Helga', 'Rurik'],
    'Tiefling': ['Akmenos', 'Iados', 'Leucis', 'Zaltar']
  };

  const multiverseNames = {
    'ELDRING': ['Malenia', 'Godrick', 'Ranni', 'Blaidd', 'Melina', 'Radahn'],
    'ESDLA': ['Aragorn', 'Legolas', 'Gandalf', 'Galadriel', 'Gimli', 'Eowyn'],
    'STRANGERTHINGS': ['Eleven', 'Mike', 'Dustin', 'Hopper', 'Will', 'Max'],
    'HARRYPOTTER': ['Harry', 'Hermione', 'Ron', 'Snape', 'Voldemort'],
    'SPARK': ['Kenny', 'Stan', 'Kyle', 'Cartman', 'Tweek', 'Butters', 'New Kid']
  };

  let namePool;
  if (multiverseNames[universe]) {
    namePool = multiverseNames[universe];
  } else if (dndNames[race]) {
    namePool = dndNames[race];
  } else {
    namePool = dndNames['Humano'];
  }
  
  const baseName = randomFromArray(namePool);
  const titles = ['el Valiente', 'el Profundo', 'el Caótico', 'el Indomable', 'la Sabia', 'la Feroz', 'el Nuevo'];
  return `${baseName} ${randomFromArray(titles)}`;
}

// ==========================================
// 🌐 DATOS DEL MULTIVERSO - UNIFICADOS
// ==========================================
const MULTIVERSE_DATA = {
    'DND': {
        name: "Dungeons & Dragons 5e",
        races: ["Humano", "Elfo", "Enano", "Tiefling", "Dracónido"],
        classes: ["Guerrero", "Mago", "Pícaro", "Clérigo", "Bárbaro"],
        api: 'dnd5e'
    },
    'ELDRING': {
        name: "Elden Ring: Tierras Intermedias",
        races: ["Sinluz", "Semi-Dios", "Albinauric", "Vagante"],
        classes: ["Samurái", "Confesor", "Astrólogo", "Guerrero"],
        api: 'eldenring'
    },
    'ESDLA': {
        name: "ESDLA: Tierra Media",
        races: ["Hobbit", "Elfo Silvano", "Dúnedain", "Uruk-hai"],
        classes: ["Montaraz", "Mago de la Orden", "Bardo", "Guerrero"],
        api: 'lotr'
    },
    'STRANGERTHINGS': {
        name: "Stranger Things: Hawkins/Upside Down",
        races: ["Chico de Hawkins", "Sujeto de Prueba", "Demogorgon"],
        classes: ["Jugador de rol", "Psíquico", "Vigilante", "Científico"],
        api: 'strangerthings'
    },
    'HARRYPOTTER': {
        name: "Harry Potter: Mundo Mágico",
        races: ["Humano Mago", "Elfo Doméstico", "Hombre Lobo", "Gigante"],
        classes: ["Auror", "Profesor", "Magizoólogo", "Estudiante"],
        api: 'harrypotter'
    },
    'SPARK': { // ¡NUEVO UNIVERSO SOUTH PARK!
        name: "South Park: La Vara de la Verdad",
        races: ["Niño Nuevo (Humano)", "Elfo (Kyle)", "Mago (Cartman)", "Gnomo de Ropa Interior"],
        classes: ["Luchador", "Mago", "Ladrón", "Judío"],
        api: 'southpark'
    }
};

// ==========================================
// 📚 HISTORIAL (Unificado y funcional)
// ==========================================
function saveToHistory(character) {
    let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Limitar historial a 20 entradas
    if (history.length >= 20) {
        history.pop(); 
    }
    history.unshift({
        id: Date.now(),
        name: character.name,
        universe: character.universe,
        race: character.race,
        class: character.class,
        rarity: character.nft.rarity,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
