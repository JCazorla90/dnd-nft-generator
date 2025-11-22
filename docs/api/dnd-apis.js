/**
 * ═══════════════════════════════════════════════════════════════════
 * 🌐 D&D CHARACTER FORGE - API INTEGRATION (NON-SIMULATED)
 * * Módulos para peticiones a APIs externas reales (DnD5eAPI.co y Open5e)
 * * Copyright (c) 2025 José Cazorla
 * https://github.com/JCazorla90/DnD-Character-Forge
 * Licensed under MIT License
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

const DND_API = {
  // URLs base de las APIs reales
  dnd5e: 'https://www.dnd5eapi.co/api',
  open5e: 'https://api.open5e.com/v1',
  
  // Cache para optimizar llamadas y evitar peticiones repetidas
  cache: {
    details: {},
    lists: {}
  },

  // ===================================
  // 📚 UTILIDADES GENERALES
  // ===================================

  /**
   * Ejecuta una petición FETCH a la URL proporcionada.
   * @param {string} url - URL completa de la API.
   * @returns {Promise<Object|null>} - Datos JSON o null si falla.
   */
  async fetchData(url) {
    if (this.cache.details[url]) {
      // console.log(`[CACHE] Usando cache para: ${url}`);
      return this.cache.details[url];
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la API: ${response.status}`);
      }
      const data = await response.json();
      this.cache.details[url] = data; // Cachear el resultado
      return data;
    } catch (error) {
      console.error(`❌ Fallo al obtener datos de ${url}:`, error);
      return null;
    }
  },

  // ===================================
  // 🏃 CARACTERÍSTICAS DE PERSONAJE
  // ===================================

  /**
   * Obtiene detalles enriquecidos de una Raza.
   * @param {string} index - Índice de la raza (ej: 'elf', 'human').
   */
  async getRaceDetails(index) {
    const url = `${this.dnd5e}/races/${index}`;
    const data = await this.fetchData(url);

    if (data) {
        // Se extrae información relevante
        const bonusStat = data.ability_score_bonuses ? (data.ability_score_bonuses[0] || {}).ability_score.name.toLowerCase() : 'dexterity';
        
        return {
            racialTraits: data.traits ? data.traits.map(t => t.name) : ['Sin rasgos detallados'],
            speed: data.speed || 30,
            primaryStat: bonusStat // Usar la estadística con bonus
        };
    }
    return null;
  },

  /**
   * Obtiene detalles enriquecidos de una Clase.
   * @param {string} index - Índice de la clase (ej: 'fighter', 'wizard').
   */
  async getClassDetails(index) {
    const url = `${this.dnd5e}/classes/${index}`;
    const data = await this.fetchData(url);
    const spellcasting = await this.fetchData(`${this.dnd5e}/classes/${index}/spellcasting`);

    if (data) {
        let primaryStat = 'strength'; // Default
        if (data.spellcasting && data.spellcasting.spellcasting_ability) {
            primaryStat = data.spellcasting.spellcasting_ability.name.toLowerCase();
        } else if (spellcasting && spellcasting.spellcasting_ability) {
             primaryStat = spellcasting.spellcasting_ability.name.toLowerCase();
        }
        
        return {
            // Esto es un placeholder, lo ideal sería hacer fetch de starting_equipment
            features: data.features ? data.features.map(f => f.name).slice(0, 3) : ['Habilidad de Clase Base'], 
            hitDie: data.hit_die || 6,
            primaryStat: primaryStat
        };
    }
    return null;
  },
  
  // ===================================
  // 👹 BESTIARIO Y ENCUENTROS
  // ===================================

  /**
   * Lista todos los monstruos disponibles de Open5e para el generador de encuentros.
   * @returns {Promise<Array<Object>>} - Lista de monstruos (solo índice y CR).
   */
  async listAllMonsters() {
    // Usar caché si la lista ya fue cargada
    if (this.cache.lists.monsters) {
        return this.cache.lists.monsters;
    }
    
    const url = `${this.open5e}/monsters/?limit=300`;
    const data = await this.fetchData(url); // fetchData maneja el cacheo

    if (data && data.results) {
        const monsterList = data.results.map(m => ({
            index: m.slug,
            name: m.name,
            cr: m.challenge_rating,
            type: m.type
        }));
        this.cache.lists.monsters = monsterList; // Cachear la lista grande
        return monsterList;
    } 
    return [];
  },

  /**
   * Obtiene detalles completos de un monstruo por su índice (slug).
   * @param {string} index - El slug del monstruo (ej: 'goblin', 'adult-red-dragon').
   */
  async getMonsterDetails(index) {
    const url = `${this.open5e}/monsters/${index}`;
    const data = await this.fetchData(url);

    if (data) {
        return {
            name: data.name,
            type: data.type,
            cr: data.challenge_rating,
            xp: DND_API.calculateXP(data.challenge_rating), // Usar función local
            ac: data.armor_class,
            hp: data.hit_points,
            speed: data.speed,
            stats: { 
                str: data.strength, dex: data.dexterity, con: data.constitution, 
                int: data.intelligence, wis: data.wisdom, cha: data.charisma 
            },
            environments: data.environment ? data.environment.split(', ').map(e => e.trim()).filter(e => e) : ["Desconocido"],
            traits: data.special_abilities ? data.special_abilities.map(a => `${a.name}: ${a.desc}`) : ['Ninguno'],
            actions: data.actions ? data.actions.map(a => `${a.name}: ${a.desc}`) : ['Ataque Básico'],
            defenses: `Saves: ${data.saving_throws || 'N/A'}. Inmunidades: ${data.damage_immunities || 'N/A'}.`,
            legendaryActions: data.legendary_actions ? data.legendary_actions.map(a => `${a.name}: ${a.desc}`) : ['Ninguna']
        };
    }
    return null;
  },
  
  // ===================================
  // 📸 MÓDULO DE IMÁGENES (Placeholder)
  // ===================================
  Images: {
    async getEpicImage(query, type) {
        console.log(`🔎 Simulación de AI: Buscando arte para: ${query}`);
        
        // Colores dinámicos para el placeholder
        const color1 = type === 'character' ? '5c0000' : '1a0f08';
        const color2 = type === 'character' ? 'd4af37' : 'f4e9d8';

        // Retraso para simular la latencia de la API de imagen
        await new Promise(resolve => setTimeout(resolve, 800));

        // Placeholder con texto descriptivo que simula el resultado de la IA
        const text = encodeURIComponent(`NFT | ${query.split(' ')[0]} ${type.toUpperCase()}`).substring(0, 30);

        return `https://placehold.co/300x400/${color1}/${color2}?text=${text}`; 
    }
  },

  // ===================================
  // ⚙️ UTILIDADES CR/XP
  // ===================================

  /**
   * Convierte un CR string (ej: "1/4", "5") a un valor numérico XP.
   * Implementa la lógica básica de la DMG.
   * @param {string|number} cr - El CR del monstruo.
   * @returns {number} - Puntos de Experiencia (XP).
   */
  calculateXP(cr) {
    if (typeof cr === 'number') cr = String(cr);
    const crMap = {
        "0": 10, "1/8": 25, "1/4": 50, "1/2": 100, 
        "1": 200, "2": 450, "3": 700, "4": 1100, 
        "5": 1800, "6": 2300, "7": 2900, "8": 3900, 
        "9": 5000, "10": 5900, "11": 7200, "12": 8400,
        "13": 10000, "14": 11500, "15": 13000, "16": 15000,
        "17": 18000, "18": 20000, "19": 22000, "20": 25000,
        "21": 33000, "22": 41000, "23": 50000, "24": 62000,
        "25": 75000, "26": 90000, "27": 105000, "28": 120000,
        "29": 135000, "30": 155000
    };
    return crMap[cr] || 0;
  }
};
