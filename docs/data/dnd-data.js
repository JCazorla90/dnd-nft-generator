'use strict';
const DND_DATA = {
  races: {
    Humano: { description: 'Versátiles y adaptativos.', speed: 30, size: 'Mediano', traits: ['+1 a todas las características', 'Idiomas: común'], },
    Elfo: { description: 'Ágiles y perceptivos.', speed: 30, size: 'Mediano', traits: ['Visión en la oscuridad', '+2 Destreza'], },
    // Añade más razas aquí
  },
  classes: {
    Guerrero: { description: 'Maestro en armas y defensa.', hitDie: 10, primaryAbility: 'Fuerza / Destreza', spellcasting: false, },
    Mago: { description: 'Dominio del arcano.', hitDie: 6, primaryAbility: 'Inteligencia', spellcasting: true, },
    // Añade más clases aquí
  },
  backgrounds: {
    Noble: { feature: 'Contactos privilegiados', skills: ['Historia', 'Persuasión'] },
    Forajido: { feature: 'Refugio secreto', skills: ['Sigilo', 'Juego de manos'] },
    // Añade más trasfondos
  },
  alignments: ['Legal Bueno', 'Neutral Bueno', 'Caótico Bueno', 'Legal Neutral', 'Neutral', 'Caótico Neutral', 'Legal Malvado', 'Neutral Malvado', 'Caótico Malvado'],
  pointBuyCosts: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
};
function randomFromArray(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rollDice(sides) { return Math.floor(Math.random() * sides) + 1; }
function calculateModifier(stat) { return Math.floor((stat - 10) / 2); }
