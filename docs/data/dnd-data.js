/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎲 D&D CHARACTER FORGE - CORE DATA
 * Copyright (c) 2025 José Cazorla
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

// ===== UTILIDADES GLOBALES =====
// Estas funciones están aquí para que estén disponibles en toda la app
function randomFromArray(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function generateStats() {
  const roll = () => {
    const r = [rollDice(6), rollDice(6), rollDice(6), rollDice(6)];
    r.sort((a, b) => a - b);
    return r.slice(1).reduce((a, b) => a + b, 0);
  };
  return {
    strength: roll(), dexterity: roll(), constitution: roll(),
    intelligence: roll(), wisdom: roll(), charisma: roll()
  };
}

function generateRandomName(race, charClass) {
    const names = ["Valerius", "Aerion", "Thoric", "Grom", "Lyra", "Elara", "Sylas", "Vex"];
    const titles = ["el Valiente", "de las Sombras", "Rompehuesos", "Caminante", "Luz del Alba"];
    return randomFromArray(names) + " " + randomFromArray(titles);
}

// ===== DATOS DE JUEGO =====
const DND_DATA = {
    races: {
        'Humano': { speed: 30, traits: ["Versátil", "+1 a todo"] },
        'Elfo': { speed: 30, traits: ["Visión en la Oscuridad", "Trance", "Linaje Feérico"] },
        'Enano': { speed: 25, traits: ["Resistencia Enana", "Visión en la Oscuridad", "Afinidad con Piedra"] },
        'Mediano': { speed: 25, traits: ["Afortunado", "Valiente", "Agilidad Mediana"] },
        'Orco': { speed: 30, traits: ["Ataques Salvajes", "Resistencia Implacable"] },
        'Tiefling': { speed: 30, traits: ["Legado Infernal", "Resistencia al Fuego"] },
        'Dracónido': { speed: 30, traits: ["Aliento de Dragón", "Resistencia Elemental"] },
        'Gnomo': { speed: 25, traits: ["Astucia Gnómica", "Visión en la Oscuridad"] }
    },
    classes: {
        'Guerrero': { hitDie: 10, features: ["Estilo de Combate", "Segunda Oportunidad"], equipment: ["Cota de malla", "Espada larga", "Escudo"] },
        'Mago': { hitDie: 6, features: ["Lanzamiento de Conjuros", "Recuperación Arcana"], equipment: ["Libro de conjuros", "Bastón", "Componentes"] },
        'Pícaro': { hitDie: 8, features: ["Ataque Furtivo", "Acción Astuta"], equipment: ["Cuero tachonado", "Dagas (2)", "Herramientas de ladrón"] },
        'Clérigo': { hitDie: 8, features: ["Dominio Divino", "Canalizar Divinidad"], equipment: ["Maza", "Escudo", "Símbolo sagrado"] },
        'Bárbaro': { hitDie: 12, features: ["Furia", "Defensa sin Armadura"], equipment: ["Gran hacha", "Jabalinas (4)"] },
        'Bardo': { hitDie: 8, features: ["Inspiración de Bardo", "Magia"], equipment: ["Laúd", "Espada ropera", "Armadura de cuero"] },
        'Druida': { hitDie: 8, features: ["Druídico", "Forma Salvaje"], equipment: ["Escudo de madera", "Cimitarra", "Foco druídico"] },
        'Paladín': { hitDie: 10, features: ["Sentido Divino", "Imponer Manos"], equipment: ["Cota de malla", "Espada larga", "Símbolo sagrado"] }
    },
    backgrounds: {
        'Acólito': { feature: "Refugio del Fiel", skills: ["Perspicacia", "Religión"], equipment: ["Símbolo sagrado", "Incienso"] },
        'Criminal': { feature: "Contacto Criminal", skills: ["Engaño", "Sigilo"], equipment: ["Palanca", "Ropa oscura"] },
        'Soldado': { feature: "Rango Militar", skills: ["Atletismo", "Intimidación"], equipment: ["Insignia de rango", "Trofeo de guerra"] },
        'Sabio': { feature: "Investigador", skills: ["Arcana", "Historia"], equipment: ["Pluma y tinta", "Carta de un colega muerto"] },
        'Noble': { feature: "Posición de Privilegio", skills: ["Historia", "Persuasión"], equipment: ["Anillo de sello", "Ropa fina"] },
        'Héroe del Pueblo': { feature: "Hospitalidad Rústica", skills: ["Trato con Animales", "Supervivencia"], equipment: ["Herramientas de artesano", "Pala"] }
    },
    alignments: [
        "Legal Bueno", "Neutral Bueno", "Caótico Bueno", 
        "Legal Neutral", "Neutral", "Caótico Neutral", 
        "Legal Malvado", "Neutral Malvado", "Caótico Malvado"
    ]
};
