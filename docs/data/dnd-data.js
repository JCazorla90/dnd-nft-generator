/**
 * ═══════════════════════════════════════════════════════════════════
 * 🐉 D&D CHARACTER FORGE - DATA MODULE
 * Copyright (c) 2025 José Cazorla
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

const DnDData = {
  
  // === RAZAS CON DETALLES ===
  races: {
    'Humano': { 
      description: "Los humanos son ambiciosos, diversos y adaptables.",
      traits: ["Todos los stats +1", "Idioma extra"], speed: 30 
    },
    'Elfo': { 
      description: "Seres mágicos de gracia sobrenatural y larga vida.",
      traits: ["Visión en la oscuridad", "Sentidos Agudos", "Ancestros Feéricos"], speed: 30 
    },
    'Enano': { 
      description: "Audaces y resistentes guerreros y mineros.",
      traits: ["Resistencia Enana", "Visión en la oscuridad", "Afinidad con la piedra"], speed: 25 
    },
    'Mediano': { 
      description: "Gente pequeña que ama la paz, la comida y la comodidad.",
      traits: ["Afortunado", "Valiente", "Agilidad de mediano"], speed: 25 
    },
    'Orco': { 
      description: "Guerreros feroces que viven por el combate.",
      traits: ["Ataques salvajes", "Resistencia implacable"], speed: 30 
    },
    'Dracónido': { 
      description: "Nacidos de dragones, con aliento elemental.",
      traits: ["Aliento de Dragón", "Resistencia al daño"], speed: 30 
    },
    'Tiefling': { 
      description: "Herederos de un linaje infernal.",
      traits: ["Visión en la oscuridad", "Resistencia Infernal", "Reprensión Infernal"], speed: 30 
    }
  },
  
  // === CLASES CON DETALLES ===
  classes: {
    'Guerrero': { description: "Maestro del combate marcial.", hitDie: 10 },
    'Mago': { description: "Erudito capaz de manipular la realidad.", hitDie: 6 },
    'Pícaro': { description: "Experto en sigilo y astucia.", hitDie: 8 },
    'Clérigo': { description: "Canalizador de magia divina.", hitDie: 8 },
    'Bardo': { description: "Inspirador a través de la música y la magia.", hitDie: 8 },
    'Paladín': { description: "Guerrero sagrado bajo juramento.", hitDie: 10 },
    'Bárbaro': { description: "Furia primitiva en combate.", hitDie: 12 },
    'Druida': { description: "Protector de la naturaleza.", hitDie: 8 },
    'Monje': { description: "Maestro de las artes marciales.", hitDie: 8 },
    'Hechicero': { description: "Magia innata por linaje.", hitDie: 6 },
    'Brujo': { description: "Pacta con entidades extraplanares.", hitDie: 8 }
  },
  
  // === TRASFONDOS ===
  backgrounds: {
    'Acólito': { feature: "Refugio del Fiel", skills: ["Perspicacia", "Religión"] },
    'Criminal': { feature: "Contacto Criminal", skills: ["Engaño", "Sigilo"] },
    'Héroe del Pueblo': { feature: "Hospitalidad Rústica", skills: ["Trato con Animales", "Supervivencia"] },
    'Noble': { feature: "Posición Privilegiada", skills: ["Historia", "Persuasión"] },
    'Sabio': { feature: "Investigador", skills: ["Arcana", "Historia"] },
    'Soldado': { feature: "Rango Militar", skills: ["Atletismo", "Intimidación"] },
    'Huérfano': { feature: "Secretos de la Ciudad", skills: ["Juego de Manos", "Sigilo"] }
  },

  alignments: ['Legal Bueno', 'Neutral Bueno', 'Caótico Bueno', 'Legal Neutral', 'Neutral', 'Caótico Neutral', 'Legal Malvado', 'Neutral Malvado', 'Caótico Malvado'],

  pointBuyCosts: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 },

  names: {
    'Humano': ['Aragorn', 'Boromir', 'Eowyn', 'Geralt', 'Ciri'],
    'Elfo': ['Legolas', 'Galadriel', 'Elrond', 'Fëanor', 'Arwen'],
    'Enano': ['Gimli', 'Thorin', 'Balin', 'Bruenor', 'Magni'],
    'default': ['Héroe Anónimo', 'Viajero', 'Aventurero', 'Vagabundo']
  },

  // === FUNCIONES UTILITARIAS ===
  
  // Obtiene una clave aleatoria de un objeto (para compatibilidad)
  getRandomKey: function(obj) {
    const keys = Object.keys(obj);
    return keys[Math.floor(Math.random() * keys.length)];
  },

  getRandomRace: function() { return this.getRandomKey(this.races); },
  getRandomClass: function() { return this.getRandomKey(this.classes); },
  getRandomBackground: function() { return this.getRandomKey(this.backgrounds); },

  generateName: function(race) {
    const list = this.names[race] || this.names['default'];
    return list[Math.floor(Math.random() * list.length)];
  },

  generateStats: function() {
    // Generación 4d6 drop lowest
    const roll = () => {
      const r = [0,0,0,0].map(() => Math.floor(Math.random()*6)+1).sort((a,b)=>a-b);
      return r.slice(1).reduce((a,b)=>a+b,0);
    };
    return { strength: roll(), dexterity: roll(), constitution: roll(), intelligence: roll(), wisdom: roll(), charisma: roll() };
  },

  getModifier: function(stat) {
    return Math.floor((stat - 10) / 2);
  }
};
