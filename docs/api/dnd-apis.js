// ==========================================
// 🌐 INTEGRACIÓN DE APIs D&D - SISTEMA COMPLETO
// APIs: DnD5eAPI.co + Open5e + Lexica (Arte) + Pollinations (Generación IA)
// ==========================================

const DND_API = {
  // URLs base de las APIs
  dnd5e: 'https://www.dnd5eapi.co/api',
  open5e: 'https://api.open5e.com',
  
  // Cache para optimizar llamadas y no saturar la red
  cache: {
    monsters: {},
    spells: {},
    equipment: {},
    classes: {},
    races: {},
    feats: {},
    images: {} // Cache de imágenes
  },

  // ============================================================
  // 🎨 MÓDULO DE IMÁGENES (NUEVO)
  // ============================================================
  Images: {
    /**
     * Busca o genera una imagen épica para personaje o monstruo
     * @param {string} query - Descripción (ej: "Elf Wizard fireball fantasy art")
     * @param {string} type - 'character' o 'monster'
     */
    async getEpicImage(query, type = 'character') {
      const cacheKey = `img_${query.replace(/\s/g, '_')}`;
      if (DND_API.cache.images[cacheKey]) return DND_API.cache.images[cacheKey];

      console.log(`🎨 Buscando arte para: ${query}`);

      // 1. INTENTO PRINCIPAL: Lexica (Busca arte de Stable Diffusion existente - Calidad Ultra)
      try {
        // Añadimos palabras clave para asegurar estilo D&D
        const searchPrompt = `${query} fantasy dnd character portrait detailed 8k masterpiece artstation`;
        const res = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(searchPrompt)}`);
        
        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images.length > 0) {
            // Seleccionamos una aleatoria de las primeras 20 para variedad
            const img = data.images[Math.floor(Math.random() * Math.min(data.images.length, 20))].src;
            DND_API.cache.images[cacheKey] = img;
            return img;
          }
        }
      } catch (e) {
        console.warn('⚠️ Lexica API no disponible, probando generador...');
      }

      // 2. INTENTO SECUNDARIO: Pollinations.ai (Genera imagen nueva al vuelo - Gratis)
      try {
        const seed = Math.floor(Math.random() * 10000);
        const genPrompt = `${query} fantasy painting, rpg portrait, dnd style, detailed, 4k`;
        // URL directa de imagen generada
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(genPrompt)}?width=512&height=768&seed=${seed}&nologo=true`;
        
        DND_API.cache.images[cacheKey] = imgUrl;
        return imgUrl;
      } catch (e) {
        console.warn('⚠️ Error generando imagen');
      }

      // 3. FALLBACK: Placeholder temático
      const fallbackUrl = `https://placehold.co/400x600/2a1a0f/d4af37?text=${encodeURIComponent(query)}`;
      return fallbackUrl;
    }
  },
  
  // ============================================================
  // 🏃 RAZAS (DATOS)
  // ============================================================
  async getRaceDetails(raceName) {
    console.log(`📡 Obteniendo detalles de raza: ${raceName}`);
    
    try {
      const raceMap = {
        'Humano': 'human', 'Elfo': 'elf', 'Enano': 'dwarf', 
        'Mediano': 'halfling', 'Orco': 'half-orc', 'Semiorco': 'half-orc',
        'Tiefling': 'tiefling', 'Dracónido': 'dragonborn', 
        'Gnomo': 'gnome', 'Semielfo': 'half-elf'
      };
      
      const apiName = raceMap[raceName] || raceName.toLowerCase();
      
      // Intentar DnD5eAPI
      const res = await fetch(`${this.dnd5e}/races/${apiName}`);
      if (res.ok) {
        const data = await res.json();
        return {
          name: data.name,
          speed: data.speed,
          abilityBonuses: data.ability_bonuses,
          traits: data.traits.map(t => t.name),
          languages: data.languages.map(l => l.name),
          proficiencies: data.starting_proficiencies?.map(p => p.name) || [],
          subraces: data.subraces?.map(s => s.name) || []
        };
      }
      
      // Fallback a Open5e
      const open5eRes = await fetch(`${this.open5e}/races/?search=${apiName}`);
      if (open5eRes.ok) {
        const data = await open5eRes.json();
        if (data.results && data.results.length > 0) {
          const race = data.results[0];
          return {
            name: race.name,
            speed: race.speed,
            traits: race.traits ? [race.traits] : [],
            languages: [race.languages || 'Común'],
            proficiencies: []
          };
        }
      }
      
    } catch (e) {
      console.warn(`⚠️ Error obteniendo raza: ${e.message}`);
    }
    return null;
  },
  
  // ============================================================
  // ⚔️ CLASES (DATOS)
  // ============================================================
  async getClassDetails(className) {
    console.log(`📡 Obteniendo detalles de clase: ${className}`);
    
    try {
      const classMap = {
        'Guerrero': 'fighter', 'Mago': 'wizard', 'Pícaro': 'rogue',
        'Clérigo': 'cleric', 'Paladín': 'paladin', 'Bárbaro': 'barbarian',
        'Druida': 'druid', 'Bardo': 'bard', 'Monje': 'monk',
        'Explorador': 'ranger', 'Brujo': 'warlock', 'Hechicero': 'sorcerer'
      };
      
      const apiName = classMap[className] || className.toLowerCase();
      
      const res = await fetch(`${this.dnd5e}/classes/${apiName}`);
      if (res.ok) {
        const data = await res.json();
        
        // Obtener niveles de progresión
        const levelsRes = await fetch(`${this.dnd5e}/classes/${apiName}/levels`);
        const levelsData = levelsRes.ok ? await levelsRes.json() : [];
        
        return {
          name: data.name,
          hitDie: data.hit_die,
          proficiencies: {
            armor: data.proficiencies.filter(p => p.type === 'Armor').map(p => p.name),
            weapons: data.proficiencies.filter(p => p.type === 'Weapons').map(p => p.name),
            savingThrows: data.saving_throws.map(s => s.name)
          },
          spellcasting: data.spellcasting ? {
            ability: data.spellcasting.spellcasting_ability.name,
            level: data.spellcasting.level
          } : null,
          levels: levelsData
        };
      }
    } catch (e) {
      console.warn(`⚠️ Error obteniendo clase: ${e.message}`);
    }
    return null;
  },
  
  // ============================================================
  // 🐉 MONSTRUOS (DATOS)
  // ============================================================
  async getMonsterDetails(monsterName) {
    if (this.cache.monsters[monsterName]) return this.cache.monsters[monsterName];
    
    try {
      const apiName = monsterName.toLowerCase().replace(/\s+/g, '-');
      
      // DnD5eAPI
      const res = await fetch(`${this.dnd5e}/monsters/${apiName}`);
      if (res.ok) {
        const data = await res.json();
        const monster = this._formatMonsterData(data);
        
        // Obtener imagen para el monstruo
        const image = await this.Images.getEpicImage(`${monster.name} ${monster.type} dnd monster`);
        monster.image = image;

        this.cache.monsters[monsterName] = monster;
        return monster;
      }
      
      // Fallback a Open5e
      const open5eRes = await fetch(`${this.open5e}/monsters/?search=${encodeURIComponent(monsterName)}`);
      if (open5eRes.ok) {
        const data = await open5eRes.json();
        if (data.results && data.results.length > 0) {
          const m = data.results[0];
          const monster = {
            name: m.name,
            type: m.type,
            cr: m.challenge_rating?.toString() || "0",
            xp: this.calculateXP(m.challenge_rating),
            size: m.size,
            hp: `${m.hit_points} (${m.hit_dice})`,
            ac: m.armor_class,
            speed: m.speed?.walk || "30 ft",
            stats: { str: m.strength, dex: m.dexterity, con: m.constitution, int: m.intelligence, wis: m.wisdom, cha: m.charisma },
            traits: m.special_abilities ? [m.special_abilities] : [],
            actions: m.actions ? [m.actions] : [],
            environment: ["Varios"]
          };
          
          // Imagen
          monster.image = await this.Images.getEpicImage(`${monster.name} monster fantasy`);
          
          this.cache.monsters[monsterName] = monster;
          return monster;
        }
      }
    } catch (e) {
      console.warn(`⚠️ Error API Monstruo: ${e.message}`);
    }
    return null;
  },

  // Helper para formatear datos de DnD5eAPI
  _formatMonsterData(data) {
    return {
      name: data.name,
      type: data.type,
      cr: data.challenge_rating.toString(),
      xp: data.xp || 0,
      size: data.size,
      hp: `${data.hit_points} (${data.hit_dice})`,
      ac: data.armor_class[0]?.value || 10,
      speed: Object.entries(data.speed).map(([k, v]) => `${k} ${v}`).join(', '),
      stats: {
        str: data.strength, dex: data.dexterity, con: data.constitution,
        int: data.intelligence, wis: data.wisdom, cha: data.charisma
      },
      skills: data.proficiencies?.map(p => p.proficiency.name) || [],
      traits: data.special_abilities?.map(a => `${a.name}: ${a.desc}`) || [],
      actions: data.actions?.map(a => `${a.name}: ${a.desc.substring(0, 150)}...`) || [],
      legendaryActions: data.legendary_actions?.map(a => a.name) || [],
      immunities: data.damage_immunities || [],
      resistances: data.damage_resistances || [],
      vulnerabilities: data.damage_vulnerabilities || [],
      environment: ["Varios"]
    };
  },
  
  // ============================================================
  // 🗡️ EQUIPO
  // ============================================================
  async getEquipmentDetails(equipmentName) {
    try {
      const apiName = equipmentName.toLowerCase().replace(/\s+/g, '-');
      const res = await fetch(`${this.dnd5e}/equipment/${apiName}`);
      if (res.ok) {
        const data = await res.json();
        return {
          name: data.name,
          type: data.equipment_category.name,
          cost: `${data.cost.quantity} ${data.cost.unit}`,
          weight: `${data.weight} lbs`,
          description: data.desc ? data.desc.join(' ') : '',
          damage: data.damage ? `${data.damage.damage_dice} ${data.damage.damage_type.name}` : null,
          armorClass: data.armor_class ? data.armor_class.base : null,
          properties: data.properties?.map(p => p.name) || []
        };
      }
    } catch (e) { console.warn(`⚠️ Error equipo: ${e.message}`); }
    return null;
  },
  
  // ============================================================
  // ✨ HECHIZOS
  // ============================================================
  async getSpellDetails(spellName) {
    if (this.cache.spells[spellName]) return this.cache.spells[spellName];
    
    try {
      const apiName = spellName.toLowerCase().replace(/\s+/g, '-');
      const res = await fetch(`${this.dnd5e}/spells/${apiName}`);
      if (res.ok) {
        const data = await res.json();
        const spell = {
          name: data.name,
          level: data.level,
          school: data.school.name,
          castingTime: data.casting_time,
          range: data.range,
          components: data.components.join(', '),
          duration: data.duration,
          description: data.desc.join('\n'),
          higherLevel: data.higher_level ? data.higher_level.join('\n') : null,
          classes: data.classes.map(c => c.name)
        };
        this.cache.spells[spellName] = spell;
        return spell;
      }
    } catch (e) { console.warn(`⚠️ Error hechizo: ${e.message}`); }
    return null;
  },
  
  // ============================================================
  // 📊 LISTADOS Y UTILIDADES
  // ============================================================
  async listMonsters(options = {}) {
    try {
      let url = `${this.dnd5e}/monsters`;
      if (options.cr) url = `${this.open5e}/monsters/?challenge_rating=${options.cr}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.results || data;
      }
    } catch (e) { console.warn(`⚠️ Error listando monstruos: ${e.message}`); }
    return [];
  },
  
  calculateXP(cr) {
    const xpTable = {
      "0": 10, "1/8": 25, "1/4": 50, "1/2": 100, "1": 200, "2": 450, "3": 700, 
      "4": 1100, "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900,
      "11": 7200, "12": 8400, "13": 10000, "14": 11500, "15": 13000, "16": 15000, 
      "17": 18000, "18": 20000, "19": 22000, "20": 25000
    };
    return xpTable[cr?.toString()] || 0;
  },
  
  // Generar Encuentro
  async generateRandomEncounter(partyLevel, partySize) {
    console.log(`📡 Generando encuentro: Nivel ${partyLevel}, ${partySize} jugadores`);
    const targetXP = partyLevel * partySize * 200;
    const monsters = await this.listMonsters();
    
    if (!monsters || monsters.length === 0) return null;
    
    const encounter = [];
    let currentXP = 0;
    let attempts = 0;
    
    while (currentXP < targetXP * 0.7 && attempts < 20) {
      const randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
      const monsterDetails = await this.getMonsterDetails(randomMonster.name || randomMonster.index);
      
      if (monsterDetails) {
        const monsterXP = this.calculateXP(monsterDetails.cr);
        if (currentXP + monsterXP <= targetXP * 1.3) {
          encounter.push(monsterDetails);
          currentXP += monsterXP;
        }
      }
      attempts++;
    }
    
    return {
      monsters: encounter,
      totalXP: currentXP,
      targetXP: targetXP,
      difficulty: this.calculateDifficulty(currentXP, targetXP)
    };
  },
  
  calculateDifficulty(currentXP, targetXP) {
    const ratio = currentXP / targetXP;
    if (ratio < 0.5) return 'Fácil';
    if (ratio < 0.75) return 'Moderado';
    if (ratio < 1.0) return 'Desafiante';
    if (ratio < 1.5) return 'Difícil';
    return 'Mortal';
  }
};

// Exportar globalmente
if (typeof window !== 'undefined') {
  window.DND_API = DND_API;
  console.log('✅ Sistema de APIs D&D cargado: Reglas + Imágenes + Datos');
}
