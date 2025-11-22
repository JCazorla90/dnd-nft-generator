/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎲 D&D CHARACTER FORGE - CORE DATA
 * * Datos base para la generación de personajes (Razas, Clases, etc.)
 * * Copyright (c) 2025 José Cazorla
 * https://github.com/JCazorla90/DnD-Character-Forge
 * Licensed under MIT License
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

// ===== ESTADO GLOBAL (Necesario para app.js) =====
let currentCharacter = null;
let currentCreature = null;
let currentEncounter = null;
let currentEdition = '5e';
const STORAGE_KEY = 'dnd_character_history';

// ===== 🎲 UTILIDADES BÁSICAS (Necesario para app.js) =====
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function calculateModifier(stat) {
  return Math.floor((stat - 10) / 2);
}

function formatModifier(mod) {
    return (mod >= 0 ? "+" : "") + mod;
}

// ===== 📊 GENERADOR DE ESTADÍSTICAS =====
function generateStats() {
  const rollStat = () => {
    // Tirar 4d6, quitar el más bajo
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

// ===== ✨ GENERADOR DE NOMBRES ÉPICOS =====
function generateRandomName(race, charClass) {
    const names = {
        'Humano': ["Valerius", "Kaelen", "Seraphina", "Thorn", "Isadora", "Elara"],
        'Elfo': ["Aerion", "Lyra", "Faelar", "Nyssa", "Drizzt", "Legolas"],
        'Enano': ["Gimli", "Thoric", "Gretchen", "Bifur", "Durin", "Brunor"],
        'Tiefling': ["Malphas", "Nox", "Vex", "Zar", "Ember", "Diablo"],
        'Orco': ["Grom", "Ugrok", "Shauna", "Griz", "Thark"],
        'Dracónido': ["Ignis", "Veridian", "Onyx", "Tiamat", "Bahamut"],
        'default': ["Héroe", "Aventurero", "Forjado"]
    };
    
    const nameList = names[race] || names['default'];
    return `${randomFromArray(nameList)} ${charClass}`;
}


// ===== 📚 D&D CORE DATA (Base) =====
const DND_DATA = {
    // Definición de las 6 stats para uso genérico
    stats: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],

    // Razas (Añadido 'index' para la API de DND5E)
    races: {
        // Los índices deben ser slugs de la API dnd5eapi.co
        'Humano': { index: 'human', speed: 30, traits: ["Versátil"], primaryStat: 'strength' },
        'Elfo': { index: 'elf', speed: 30, traits: ["Trance"], primaryStat: 'dexterity' },
        'Enano': { index: 'dwarf', speed: 25, traits: ["Resistencia Enana"], primaryStat: 'constitution' },
        'Tiefling': { index: 'tiefling', speed: 30, traits: ["Herencia Infernal"], primaryStat: 'charisma' },
        'Orco': { index: 'half-orc', speed: 30, traits: ["Furia"], primaryStat: 'strength' },
        'Dracónido': { index: 'dragonborn', speed: 30, traits: ["Aliento Dracónico"], primaryStat: 'strength' },
    },
    // Clases (Añadido 'index' para la API de DND5E)
    classes: {
        // Los índices deben ser slugs de la API dnd5eapi.co
        'Guerrero': { index: 'fighter', hitDie: 10, features: ["Estilo de Combate"], primaryStat: 'strength' },
        'Mago': { index: 'wizard', hitDie: 6, features: ["Lanzamiento de Conjuros"], primaryStat: 'intelligence' },
        'Clérigo': { index: 'cleric', hitDie: 8, features: ["Dominio Divino"], primaryStat: 'wisdom' },
        'Pícaro': { index: 'rogue', hitDie: 8, features: ["Ataque Furtivo"], primaryStat: 'dexterity' },
        'Bárbaro': { index: 'barbarian', hitDie: 12, features: ["Furia"], primaryStat: 'strength' },
        'Paladín': { index: 'paladin', hitDie: 10, features: ["Sentido Divino"], primaryStat: 'charisma' },
    },
    // Trasfondos
    backgrounds: {
        'Acólito': { feature: "Refugio del Fiel", equipment: ["Libro de oraciones", "Incienso (5)", "15 po"], skills: ["Perspicacia", "Religión"] },
        'Criminal': { feature: "Contacto Criminal", equipment: ["Palanca", "Herramientas de ladrón", "15 po"], skills: ["Engaño", "Juego de Manos"] },
        'Noble': { feature: "Posición de Privilegio", equipment: ["Ropas de Lujo", "Anillo de sello", "25 po"], skills: ["Historia", "Persuasión"] },
        'Sabio': { feature: "Investigador", equipment: ["Pluma", "Botella de tinta", "10 po"], skills: ["Arcanos", "Historia"] },
    },
    // Alineamientos
    alignments: [
        "Legal Bueno", "Neutral Bueno", "Caótico Bueno", 
        "Legal Neutral", "Neutral", "Caótico Neutral", 
        "Legal Malvado", "Neutral Malvado", "Caótico Malvado"
    ],
    // Umbrales de XP para dificultad (Para 1 PJ, según DMG)
    difficultyThresholds: {
        1: { facil: 25, moderado: 50, desafiante: 75, mortal: 100 },
        2: { facil: 50, moderado: 100, desafiante: 150, mortal: 200 },
        3: { facil: 75, moderado: 150, desafiante: 225, mortal: 400 },
        4: { facil: 125, moderado: 250, desafiante: 375, mortal: 500 },
        5: { facil: 250, moderado: 500, desafiante: 750, mortal: 1100 },
        10: { facil: 600, moderado: 1200, desafiante: 1900, mortal: 2800 },
        15: { facil: 1100, moderado: 2100, desafiante: 3200, mortal: 4800 },
        20: { facil: 2100, moderado: 4200, desafiante: 6300, mortal: 9500 }
    }
};
