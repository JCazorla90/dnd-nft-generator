// ==========================================
// 🌐 INTEGRACIÓN DE APIs D&D - SISTEMA COMPLETO
// APIs: DnD5eAPI.co + Open5e + Lexica (imágenes)
// ==========================================

const DND_API = {
  // URLs base de las APIs
  dnd5e: 'https://www.dnd5eapi.co/api',
  open5e: 'https://api.open5e.com',
  
  // Cache para optimizar llamadas
  cache: {
    monsters: {},
    spells: {},
    equipment: {},
    classes: {},
    races: {},
    feats: {},
    magicItems: {}
  },
  
  // ===== 🏃 RAZAS ENRIQUECIDAS =====
  async getRaceDetails(raceName) {
    console.log(`📡 Obteniendo detalles de raza: ${raceName}`);
    
    try {
      // Mapeo de nombres
      const raceMap = {
        'Humano': 'human',
        'Elfo': 'elf',
        'Enano': 'dwarf',
        'Mediano': 'halfling',
        'Orco': 'half-orc',
        'Semiorco': 'half-orc',
        'Tiefling': 'tiefling',
        'Dracónido': 'dragonborn',
        'Gnomo': 'gnome',
        'Semielfo': 'half-elf'
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
      console.warn(`⚠️ Error obteniendo raza desde API: ${e.message}`);
    }
    
    return null;
  },
  
  // ===== ⚔️ CLASES ENRIQUECIDAS =====
  async getClassDetails(className) {
    console.log(`📡 Obteniendo detalles de clase: ${className}`);
    
    try {
      const classMap = {
        'Guerrero': 'fighter',
        'Mago': 'wizard',
        'Pícaro': 'rogue',
        'Clérigo': 'cleric',
        'Paladín': 'paladin',
        'Bárbaro': 'barbarian',
        'Druida': 'druid',
        'Bardo': 'bard',
        'Monje': 'monk',
        'Explorador': 'ranger',
        'Brujo': 'warlock',
        'Hechicero': 'sorcerer'
      };
      
      const apiName = classMap[className] || className.toLowerCase();
      
      // DnD5eAPI
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
      console.warn(`⚠️ Error obteniendo clase desde API: ${e.message}`);
    }
    
    return null;
  },
  
  // ===== 🐉 MONSTRUOS/CRIATURAS ENRIQUECIDOS =====
  async getMonsterDetails(monsterName) {
    console.log(`📡 Obteniendo monstruo: ${monsterName}`);
    
    // Buscar en cache
    if (this.cache.monsters[monsterName]) {
      return this.cache.monsters[monsterName];
    }
    
    try {
      // Normalizar nombre
      const apiName = monsterName.toLowerCase().replace(/\s+/g, '-');
      
      // DnD5eAPI
      const res = await fetch(`${this.dnd5e}/monsters/${apiName}`);
      if (res.ok) {
        const data = await res.json();
        
        const monster = {
          name: data.name,
          type: data.type,
          cr: data.challenge_rating.toString(),
          xp: data.xp || 0,
          size: data.size,
          hp: `${data.hit_points} (${data.hit_dice})`,
          ac: data.armor_class[0]?.value || 10,
          speed: Object.entries(data.speed).map(([k, v]) => `${k} ${v}`).join(', '),
          str: data.strength,
          dex: data.dexterity,
          con: data.constitution,
          int: data.intelligence,
          wis: data.wisdom,
          cha: data.charisma,
          skills: data.proficiencies?.map(p => p.proficiency.name) || [],
          traits: data.special_abilities?.map(a => `${a.name}: ${a.desc}`) || [],
          actions: data.actions?.map(a => `${a.name}: ${a.desc.substring(0, 150)}...`) || [],
          legendaryActions: data.legendary_actions?.map(a => a.name) || [],
          immunities: data.damage_immunities || [],
          resistances: data.damage_resistances || [],
          vulnerabilities: data.damage_vulnerabilities || [],
          environment: ["Varios"]
        };
        
        // Guardar en cache
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
            str: m.strength,
            dex: m.dexterity,
            con: m.constitution,
            int: m.intelligence,
            wis: m.wisdom,
            cha: m.charisma,
            traits: m.special_abilities ? [m.special_abilities] : [],
            actions: m.actions ? [m.actions] : [],
            environment: ["Varios"]
          };
          
          this.cache.monsters[monsterName] = monster;
          return monster;
        }
      }
      
    } catch (e) {
      console.warn(`⚠️ Error obteniendo monstruo desde API: ${e.message}`);
    }
    
    return null;
  },
  
  // ===== 🗡️ EQUIPO ENRIQUECIDO =====
  async getEquipmentDetails(equipmentName) {
    console.log(`📡 Obteniendo equipo: ${equipmentName}`);
    
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
      
    } catch (e) {
      console.warn(`⚠️ Error obteniendo equipo: ${e.message}`);
    }
    
    return null;
  },
  
  // ===== ✨ HECHIZOS ENRIQUECIDOS =====
  async getSpellDetails(spellName) {
    console.log(`📡 Obteniendo hechizo: ${spellName}`);
    
    if (this.cache.spells[spellName]) {
      return this.cache.spells[spellName];
    }
    
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
      
    } catch (e) {
      console.warn(`⚠️ Error obteniendo hechizo: ${e.message}`);
    }
    
    return null;
  },
  
  // ===== 🎁 OBJETOS MÁGICOS =====
  async getMagicItemDetails(itemName) {
    console.log(`📡 Obteniendo objeto mágico: ${itemName}`);
    
    try {
      const res = await fetch(`${this.open5e}/magicitems/?search=${encodeURIComponent(itemName)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const item = data.results[0];
          return {
            name: item.name,
            type: item.type,
            rarity: item.rarity,
            requiresAttunement: item.requires_attunement,
            description: item.desc
          };
        }
      }
    } catch (e) {
      console.warn(`⚠️ Error obteniendo objeto mágico: ${e.message}`);
    }
    
    return null;
  },
  
  // ===== 🏆 DOTES (FEATS) =====
  async getFeatDetails(featName) {
    console.log(`📡 Obteniendo dote: ${featName}`);
    
    try {
      const apiName = featName.toLowerCase().replace(/\s+/g, '-');
      
      const res = await fetch(`${this.dnd5e}/feats/${apiName}`);
      if (res.ok) {
        const data = await res.json();
        return {
          name: data.name,
          prerequisites: data.prerequisites || [],
          description: data.desc.join('\n')
        };
      }
    } catch (e) {
      console.warn(`⚠️ Error obteniendo dote: ${e.message}`);
    }
    
    return null;
  },
  
  // ===== 📊 LISTAR CATEGORÍAS =====
  async listMonsters(options = {}) {
    console.log('📡 Listando monstruos desde API...');
    
    try {
      let url = `${this.dnd5e}/monsters`;
      if (options.cr) {
        url = `${this.open5e}/monsters/?challenge_rating=${options.cr}`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.results || data;
      }
    } catch (e) {
      console.warn(`⚠️ Error listando monstruos: ${e.message}`);
    }
    
    return [];
  },
  
  async listSpells(classFilter = null) {
    console.log('📡 Listando hechizos desde API...');
    
    try {
      let url = `${this.dnd5e}/spells`;
      if (classFilter) {
        url = `${this.dnd5e}/classes/${classFilter}/spells`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.results || data;
      }
    } catch (e) {
      console.warn(`⚠️ Error listando hechizos: ${e.message}`);
    }
    
    return [];
  },
  
  // ===== 🧮 UTILIDADES =====
  calculateXP(cr) {
    const xpTable = {
      "0": 10, "1/8": 25, "1/4": 50, "1/2": 100,
      "1": 200, "2": 450, "3": 700, "4": 1100, "5": 1800,
      "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900,
      "11": 7200, "12": 8400, "13": 10000, "14": 11500, "15": 13000,
      "16": 15000, "17": 18000, "18": 20000, "19": 22000, "20": 25000
    };
    return xpTable[cr?.toString()] || 0;
  },
  
  // ===== 🎲 GENERAR ENCUENTRO ALEATORIO =====
  async generateRandomEncounter(partyLevel, partySize) {
    console.log(`📡 Generando encuentro para nivel ${partyLevel}, ${partySize} jugadores`);
    
    const targetXP = partyLevel * partySize * 200;
    const monsters = await this.listMonsters();
    
    if (!monsters || monsters.length === 0) {
      return null;
    }
    
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
  console.log('✅ Sistema de APIs D&D cargado y listo');
}
