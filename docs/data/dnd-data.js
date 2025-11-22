// ==========================================
// 🎲 D&D CHARACTER FORGE - DATA BASE Y UTILIDADES
// ==========================================

'use strict';

// ===== 🎲 UTILIDADES BÁSICAS =====
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

// ===== ✨ GENERADOR DE NOMBRES ÉPICOS (Mínimo) =====
function generateRandomName(race, charClass) {
    const names = {
        'Humano': ["Valerius", "Kaelen", "Seraphina", "Thorn", "Isadora"],
        'Elfo': ["Aerion", "Lyra", "Faelar", "Nyssa", "Elara"],
        'Enano': ["Gimli", "Thoric", "Gretchen", "Bifur", "Durin"],
        'Tiefling': ["Malphas", "Nox", "Vex", "Zar", "Ember"],
        'default': ["Héroe", "Aventurero", "Forjado"]
    };
    
    const nameList = names[race] || names['default'];
    return `${randomFromArray(nameList)} ${charClass}`;
}


// ===== 📚 D&D CORE DATA (Mínimo para el funcionamiento) =====
const DND_DATA = {
    // Razas
    races: {
        'Humano': { speed: 30, traits: ["Versátil (Elige una habilidad extra)", "Bonus +1 a todos los atributos"] },
        'Elfo': { speed: 30, traits: ["Trance", "Visión en la Oscuridad"] },
        'Enano': { speed: 25, traits: ["Resistencia Enana", "Manejo de armas Enanas"] },
        'Tiefling': { speed: 30, traits: ["Herencia Infernal", "Resistencia al Fuego"] },
    },
    // Clases
    classes: {
        'Guerrero': { hitDie: 10, features: ["Estilo de Combate", "Impulso de Acción"] },
        'Mago': { hitDie: 6, features: ["Lanzamiento de Conjuros", "Recuperación Arcana"] },
        'Clérigo': { hitDie: 8, features: ["Dominio Divino", "Lanzamiento de Conjuros"] },
        'Pícaro': { hitDie: 8, features: ["Ataque Furtivo", "Competencia Extra"] },
    },
    // Trasfondos
    backgrounds: {
        'Acólito': { feature: "Refugio del Fiel", equipment: ["Libro de oraciones", "Incienso (5)", "15 po"] },
        'Criminal': { feature: "Contacto Criminal", equipment: ["Palanca", "Herramientas de ladrón", "15 po"] },
        'Noble': { feature: "Posición de Privilegio", equipment: ["Ropas de Lujo", "Anillo de sello", "25 po"] },
    },
    // Alineamientos
    alignments: [
        "Legal Bueno", "Neutral Bueno", "Caótico Bueno", 
        "Legal Neutral", "Neutral", "Caótico Neutral", 
        "Legal Malvado", "Neutral Malvado", "Caótico Malvado"
    ],
    // Habilidades
    skills: [
        "Acrobacias", "Arcanos", "Atletismo", "Engaño", "Historia", 
        "Interpretación", "Intimidación", "Investigación", "Juego de Manos", 
        "Medicina", "Naturaleza", "Percepción", "Perspicacia", "Persuasión", 
        "Religión", "Supervivencia", "Trato con Animales"
    ]
};
