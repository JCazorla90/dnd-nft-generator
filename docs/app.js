// ==========================================
// 🎲 D&D CHARACTER FORGE - SISTEMA COMPLETO FINAL
// Versión con progresión de habilidades y bestiario funcional
// ==========================================

'use strict';

// ===== ESTADO GLOBAL =====
let currentCharacter = null;
let currentCreature = null;
let currentEncounter = [];
let currentEdition = '5e';
const STORAGE_KEY = 'dnd_character_history';

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

// ===== 📊 GENERADOR DE ESTADÍSTICAS =====
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

// ===== ✨ GENERADOR DE NOMBRES ÉPICOS =====
function generateRandomName(race, charClass) {
  const names = {
    'Humano': {
      'Guerrero': ['Aric Valorheart', 'Brendan Stormborn', 'Marcus Ironforge'],
      'Mago': ['Cassandra Moonshadow', 'Eldrin Starweaver', 'Lysander Flameheart'],
      'Pícaro': ['Diana Nightblade', 'Raven Shadowstep', 'Silas Quickfingers'],
      'Clérigo': ['Helena Lightbringer', 'Thomas Dawnkeeper', 'Althea Holyshield'],
      'default': ['Erik Dragonbane', 'Fiona Lightbringer', 'Gareth Stormwind']
    },
    'Elfo': {
      'Mago': ['Aelrindel Starweaver', 'Eldacar Moonwhisper', 'Galadriel Silvermoon'],
      'Explorador': ['Legolas Greenleaf', 'Thranduil Oakenshield', 'Faelyn Windrunner'],
      'default': ['Elaria Dawnstrider', 'Thalorien Sunseeker', 'Sylvanas Whisperwind']
    },
    'Enano': {
      'Guerrero': ['Balin Ironhelm', 'Dwalin Stonebreaker', 'Thorin Oakenshield'],
      'Clérigo': ['Gimli Axebearer', 'Bruenor Battlehammer', 'Tordek Ironfoot'],
      'default': ['Dolgrin Forgehammer', 'Harbek Stonemender', 'Rurik Goldbeard']
    },
    'Orco': ['Grunk Skullcrusher', 'Thrak Bloodfist', 'Urgak Bonegrinder', 'Mog the Terrible'],
    'Mediano': ['Bilbo Baggins', 'Frodo Underhill', 'Samwise Gamgee', 'Pippin Took'],
    'Tiefling': ['Akta Hellborn', 'Damakos Nightfire', 'Iados Darkflame', 'Kairon Shadowhorn'],
    'Dracónido': ['Arjhan Firebreath', 'Balasar Dragonheart', 'Donaar Scalebane'],
    'Gnomo': ['Eldon Tinkertop', 'Brocc Nackle', 'Sindri Fastspring'],
    'Semielfo': ['Tanis Half-Elven', 'Solamnia Brightblade', 'Laurana Kanan'],
    'Semiorco': ['Grog Strongjaw', 'Durotan', 'Orgrim Doomhammer']
  };
  
  if (names[race] && typeof names[race] === 'object' && !Array.isArray(names[race])) {
    const classNames = names[race][charClass] || names[race]['default'];
    return randomFromArray(classNames);
  }
  
  if (names[race] && Array.isArray(names[race])) {
    return randomFromArray(names[race]);
  }
  
  return randomFromArray(names['Humano']['default']);
}

// ===== 🎨 GENERADOR DE PERSONAJES =====
function generateCharacter(customData = {}) {
  console.log('🎲 Generando personaje épico...');
  
  const race = customData.race || randomFromArray(Object.keys(DND_DATA.races));
  const charClass = customData.class || randomFromArray(Object.keys(DND_DATA.classes));
  const background = customData.background || randomFromArray(Object.keys(DND_DATA.backgrounds));
  const alignment = customData.alignment || randomFromArray(DND_DATA.alignments);
  
  const stats = generateStats();
  const classData = DND_DATA.classes[charClass];
  
  let raceData = DND_DATA.races[race];
  if (raceData.subraces) {
    const subraceKey = randomFromArray(Object.keys(raceData.subraces));
    raceData = { ...raceData, ...raceData.subraces[subraceKey] };
  }
  
  const backgroundData = DND_DATA.backgrounds[background];
  
  const hp = classData.hitDie + calculateModifier(stats.constitution);
  const ac = 10 + calculateModifier(stats.dexterity);
  
  const character = {
    name: customData.name || generateRandomName(race, charClass),
    race,
    class: charClass,
    background,
    alignment,
    level: 1,
    edition: currentEdition,
    stats,
    hp,
    ac,
    speed: raceData.speed,
    racialTraits: raceData.traits,
    classProficiencies: formatProficiencies(classData.proficiencies),
    classFeatures: classData.features || (classData.progression && classData.progression[1]?.features) || [],
    savingThrows: classData.proficiencies.savingThrows,
    skills: classData.skills.from ? 
      `Elige ${classData.skills.choose}: ${classData.skills.from.join(', ')}` : 
      'Ver clase',
    equipment: classData.equipment,
    backgroundData: backgroundData,
    progression: classData.progression // 🆕 Sistema de progresión
  };
  
  console.log('✅ Personaje generado:', character.name);
  return character;
}

function formatProficiencies(prof) {
  const parts = [];
  if (prof.armor && prof.armor.length) parts.push(`Armaduras: ${prof.armor.join(', ')}`);
  if (prof.weapons && prof.weapons.length) parts.push(`Armas: ${prof.weapons.join(', ')}`);
  if (prof.tools && prof.tools.length) parts.push(`Herramientas: ${prof.tools.join(', ')}`);
  return parts;
}

// ===== 🎨 AVATAR ÉPICO SVG =====
function drawAvatar(name, race, charClass) {
  console.log('🎨 Dibujando avatar épico...');
  const avatarSvg = document.getElementById('charAvatar');
  if (!avatarSvg) return;

  const classColors = {
    'Guerrero': { primary: '#8b0000', secondary: '#c0c0c0', accent: '#d4af37' },
    'Mago': { primary: '#4169e1', secondary: '#9370db', accent: '#ffd700' },
    'Pícaro': { primary: '#1a1a1a', secondary: '#696969', accent: '#ff4500' },
    'Clérigo': { primary: '#daa520', secondary: '#f5f5dc', accent: '#ffffff' },
    'Paladín': { primary: '#ffd700', secondary: '#ffffff', accent: '#4169e1' },
    'Bárbaro': { primary: '#654321', secondary: '#dc143c', accent: '#d4a574' },
    'Druida': { primary: '#228b22', secondary: '#7cb342', accent: '#8b4513' },
    'Bardo': { primary: '#8b3a8b', secondary: '#ff69b4', accent: '#ffd700' },
    'Monje': { primary: '#8b6914', secondary: '#ff8c00', accent: '#654321' },
    'Explorador': { primary: '#5d4037', secondary: '#8d6e63', accent: '#7cb342' },
    'Brujo': { primary: '#1a0033', secondary: '#9370db', accent: '#8b008b' },
    'Hechicero': { primary: '#4b0082', secondary: '#9370db', accent: '#ba55d3' }
  };

  const colors = classColors[charClass] || classColors['Guerrero'];

  const svg = `
    <defs>
      <radialGradient id="bgGrad">
        <stop offset="0%" stop-color="${colors.primary}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${colors.primary}" stop-opacity="0.8"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f5f5f5"/>
        <stop offset="50%" stop-color="${colors.secondary}"/>
        <stop offset="100%" stop-color="${colors.primary}"/>
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="58" fill="url(#bgGrad)" filter="url(#glow)"/>
    <circle cx="60" cy="60" r="55" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.5"/>
    <ellipse cx="60" cy="55" rx="20" ry="24" fill="#d4a574" stroke="${colors.primary}" stroke-width="2"/>
    ${charClass === 'Guerrero' ? `<ellipse cx="60" cy="45" rx="22" ry="20" fill="url(#metalGrad)" stroke="#2a2a2a" stroke-width="2"/><rect x="52" y="50" width="16" height="6" rx="2" fill="#3a3a3a"/>` : ''}
    ${charClass === 'Mago' ? `<path d="M 60,25 L 50,50 L 70,50 Z" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/><circle cx="60" cy="35" r="3" fill="${colors.accent}"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/></circle>` : ''}
    ${charClass === 'Pícaro' ? `<path d="M 60,30 L 42,55 L 78,55 Z" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/><ellipse cx="55" cy="52" rx="3" ry="4" fill="${colors.accent}"/>` : ''}
    ${charClass === 'Clérigo' ? `<path d="M 52,35 L 60,25 L 68,35" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/><circle cx="60" cy="30" r="4" fill="${colors.accent}" opacity="0.8"/>` : ''}
    ${charClass === 'Bárbaro' ? `<path d="M 42,45 Q 38,35 40,30" stroke="${colors.primary}" stroke-width="3" fill="none"/><path d="M 78,45 Q 82,35 80,30" stroke="${colors.primary}" stroke-width="3" fill="none"/>` : ''}
    <path d="M 38,70 L 60,65 L 82,70 L 82,100 L 38,100 Z" fill="url(#metalGrad)" stroke="${colors.primary}" stroke-width="2" opacity="0.9"/>
    <circle cx="60" cy="82" r="8" fill="${colors.accent}" opacity="0.7"/>
    <text x="60" y="87" text-anchor="middle" font-size="12" fill="${colors.primary}" font-weight="bold">${charClass.charAt(0)}</text>
    <circle cx="60" cy="60" r="58" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.7"/>
    <rect x="25" y="100" width="70" height="14" rx="4" fill="${colors.primary}" opacity="0.8"/>
    <text x="60" y="110" text-anchor="middle" font-size="9" font-weight="bold" fill="${colors.accent}" font-family="serif">${charClass.toUpperCase()}</text>
  `;

  avatarSvg.innerHTML = svg;
  avatarSvg.setAttribute('viewBox', '0 0 120 120');
  console.log('✅ Avatar dibujado');
}

// ===== 🖼️ SISTEMA DE RETRATOS IA MEJORADO =====
async function fetchAIPortrait(race, charClass) {
  console.log(`🎨 Buscando retrato épico para ${race} ${charClass}...`);
  const portraitImg = document.getElementById('aiPortrait');
  if (!portraitImg) return;

  portraitImg.src = "https://placehold.co/320x420/3e2723/ffd700?text=⚔️+Generando...";
  portraitImg.alt = "Generando retrato épico...";

  const epicPrompts = {
    'Guerrero-Humano': 'human knight ornate plate armor longsword fantasy portrait oil painting Larry Elmore heroic dnd 5e',
    'Guerrero-Enano': 'dwarf warrior braided beard battleaxe heavy armor fantasy portrait Keith Parkinson',
    'Guerrero-Elfo': 'elven warrior elegant mithril armor silver hair fantasy portrait Todd Lockwood',
    'Mago-Humano': 'human wizard blue robes arcane staff glowing spell fantasy portrait Clyde Caldwell',
    'Mago-Elfo': 'elven archmage spellbook mystical runes fantasy portrait Jeff Easley high elf',
    'Pícaro-Mediano': 'halfling rogue leather armor daggers sneaking fantasy portrait Wayne Reynolds',
    'Pícaro-Elfo': 'elven rogue dark hood bow arrows fantasy portrait stealth',
    'Clérigo-Humano': 'human cleric holy vestments divine light fantasy portrait Keith Parkinson priest',
    'Paladín-Humano': 'human paladin golden plate armor holy sword divine aura fantasy portrait Larry Elmore',
    'Bárbaro-Humano': 'human barbarian muscular greataxe tribal tattoos fantasy portrait Wayne Reynolds',
    'Druida-Elfo': 'elven druid forest communion wild shape fantasy portrait Todd Lockwood',
    'Bardo-Humano': 'human bard elegant lute magical performance fantasy portrait colorful',
    'Monje-Humano': 'human monk martial arts robes ki energy fantasy portrait eastern style',
    'Explorador-Elfo': 'elven ranger forest hunter bow hawk companion fantasy portrait',
    'Hechicero-Tiefling': 'tiefling sorcerer red skin horns infernal magic fantasy portrait',
    'Brujo-Humano': 'human warlock eldritch power dark pact gothic fantasy portrait'
  };

  const key = `${charClass}-${race}`;
  let prompt = epicPrompts[key] || `${race} ${charClass} fantasy character portrait dnd art Larry Elmore heroic detailed`;

  console.log(`🔍 Prompt: ${prompt}`);

  try {
    const res = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.images && data.images.length > 0) {
        const idx = Math.floor(Math.random() * Math.min(data.images.length, 15));
        portraitImg.src = data.images[idx].src;
        portraitImg.alt = `${race} ${charClass} - Arte épico D&D`;
        console.log('✅ Retrato cargado desde Lexica');
        return;
      }
    }
  } catch(e) {
    console.warn('⚠️ Lexica no disponible');
  }

  try {
    const styles = ['avataaars', 'adventurer', 'big-smile'];
    const style = randomFromArray(styles);
    const seed = encodeURIComponent(`${race}-${charClass}-${Date.now()}`);
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=3e2723&radius=12`;
    portraitImg.src = url;
    portraitImg.alt = `${race} ${charClass} - Avatar`;
    console.log('✅ Avatar generado');
  } catch(e) {
    const emojis = { 'Guerrero': '⚔️', 'Mago': '🧙', 'Pícaro': '🗡️', 'Clérigo': '✝️', 'Paladín': '🛡️', 'Bárbaro': '⚡', 'Druida': '🌿', 'Bardo': '🎵', 'Monje': '☯️', 'Explorador': '🏹', 'Brujo': '🌙', 'Hechicero': '✨' };
    const emoji = emojis[charClass] || '⚔️';
    portraitImg.src = `https://placehold.co/320x420/3e2723/ffd700?text=${encodeURIComponent(emoji + ' ' + race)}`;
  }
}

function regeneratePortrait() {
  if (!currentCharacter) {
    alert('❌ Primero genera un personaje');
    return;
  }
  fetchAIPortrait(currentCharacter.race, currentCharacter.class);
}

// ===== ⚡ POWER LEVEL =====
function updatePowerLevel(stats) {
  const powerBar = document.getElementById('powerBar');
  const powerLevel = document.getElementById('powerLevel');
  if (!powerBar || !powerLevel) return;
  
  const avg = Object.values(stats).reduce((a,b)=>a+b,0)/6;
  let lvl = "⭐ Novato";
  let gradient = "linear-gradient(90deg, #e8d5b7, #b89560)";
  
  if(avg >= 17) {
    lvl="⭐⭐⭐⭐⭐ Legendario";
    gradient="linear-gradient(90deg, #ffd700, #ff8c00, #ffd700)";
  } else if(avg >= 15) {
    lvl="⭐⭐⭐⭐ Épico";
    gradient="linear-gradient(90deg, #d4af37, #f4d03f, #d4af37)";
  } else if(avg >= 13) {
    lvl="⭐⭐⭐ Heroico";
    gradient="linear-gradient(90deg, #c0c0c0, #e8e8e8, #c0c0c0)";
  } else if(avg >= 11) {
    lvl="⭐⭐ Promedio";
    gradient="linear-gradient(90deg, #cd7f32, #e8a87c, #cd7f32)";
  }
  
  powerLevel.textContent = lvl;
  powerBar.style.background = gradient;
}

// ===== 📋 MOSTRAR PERSONAJE EN UI =====
function displayCharacter(character) {
  console.log('📋 Mostrando ficha...');
  currentCharacter = character;
  
  document.getElementById('displayName').textContent = character.name;
  document.getElementById('displayRace').textContent = character.race;
  document.getElementById('displayClass').textContent = character.class;
  document.getElementById('displayLevel').textContent = character.level;
  document.getElementById('displayBackground').textContent = character.background;
  document.getElementById('displayAlignment').textContent = character.alignment;
  
  const stats = [
    { id: 'Str', value: character.stats.strength },
    { id: 'Dex', value: character.stats.dexterity },
    { id: 'Con', value: character.stats.constitution },
    { id: 'Int', value: character.stats.intelligence },
    { id: 'Wis', value: character.stats.wisdom },
    { id: 'Cha', value: character.stats.charisma }
  ];
  
  stats.forEach(stat => {
    const modifier = calculateModifier(stat.value);
    document.getElementById(`stat${stat.id}`).textContent = stat.value;
    document.getElementById(`mod${stat.id}`).textContent = (modifier >= 0 ? '+' : '') + modifier;
  });
  
  document.getElementById('displayHP').textContent = character.hp;
  document.getElementById('displayAC').textContent = character.ac;
  document.getElementById('displaySpeed').textContent = `${character.speed} ft`;
  document.getElementById('displayInit').textContent = 
    (calculateModifier(character.stats.dexterity) >= 0 ? '+' : '') + calculateModifier(character.stats.dexterity);
  
  document.getElementById('displaySavingThrows').textContent = 
    Array.isArray(character.savingThrows) ? character.savingThrows.join(', ') : character.savingThrows;
  document.getElementById('displaySkills').textContent = character.skills;
  
  document.getElementById('equipment').innerHTML = character.equipment.map(item => `<li>${item}</li>`).join('');
  
  document.getElementById('backgroundName').textContent = character.background;
  document.getElementById('backgroundSkills').textContent = character.backgroundData.skills.join(', ');
  document.getElementById('backgroundFeature').textContent = character.backgroundData.feature;
  document.getElementById('backgroundEquipment').innerHTML = character.backgroundData.equipment.map(item => `<li>${item}</li>`).join('');
  
  document.getElementById('racialTraits').innerHTML = character.racialTraits.map(trait => `<li>${trait}</li>`).join('');
  document.getElementById('classProficiencies').innerHTML = character.classProficiencies.map(prof => `<li>${prof}</li>`).join('');
  document.getElementById('classFeatures').innerHTML = character.classFeatures.map(feature => `<li>${feature}</li>`).join('');
  
  updatePowerLevel(character.stats);
  drawAvatar(character.name, character.race, character.class);
  fetchAIPortrait(character.race, character.class);
  
  document.getElementById('characterSheet').classList.remove('hidden');
  document.getElementById('characterSheet').scrollIntoView({ behavior: 'smooth' });
  
  saveToHistory(character);
  console.log('✅ Ficha mostrada');
}

// ===== 🐉 SISTEMA DE BESTIARIO COMPLETO =====

// Obtener criatura aleatoria con filtros
function getRandomCreature(filters = {}) {
  if (!window.DND_BESTIARY || !window.DND_BESTIARY.creatures) {
    console.error('❌ Bestiario no cargado');
    alert('Error: El bestiario no está cargado. Verifica que bestiary.js esté incluido.');
    return null;
  }
  
  let filtered = window.DND_BESTIARY.creatures;
  
  if (filters.type && filters.type !== '') {
    filtered = filtered.filter(c => c.type === filters.type);
  }
  
  if (filters.cr && filters.cr !== '') {
    const maxCR = parseFloat(filters.cr);
    filtered = filtered.filter(c => {
      const crNum = c.cr === '1/8' ? 0.125 : c.cr === '1/4' ? 0.25 : c.cr === '1/2' ? 0.5 : parseFloat(c.cr);
      return crNum <= maxCR;
    });
  }
  
  if (filters.environment && filters.environment !== '') {
    filtered = filtered.filter(c => 
      c.environment && c.environment.includes(filters.environment)
    );
  }
  
  if (filtered.length === 0) {
    console.warn('⚠️ No se encontraron criaturas con esos filtros');
    return null;
  }
  
  return randomFromArray(filtered);
}

// Generar criatura desde API D&D 5e
async function generateCreatureFromAPI() {
  console.log('📡 Conectando con API D&D 5e...');
  
  try {
    const listRes = await fetch('https://www.dnd5eapi.co/api/monsters');
    if (!listRes.ok) throw new Error('API no responde');
    
    const listData = await listRes.json();
    const randomMonster = randomFromArray(listData.results);
    
    const res = await fetch(`https://www.dnd5eapi.co${randomMonster.url}`);
    if (!res.ok) throw new Error('No se pudo obtener detalles');
    
    const data = await res.json();
    
    const creature = {
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
      traits: data.special_abilities?.map(a => a.name) || [],
      actions: data.actions?.map(a => `${a.name}: ${a.desc.substring(0, 100)}...`) || [],
      legendaryActions: data.legendary_actions?.map(a => a.name) || [],
      immunities: data.damage_immunities || [],
      resistances: data.damage_resistances || [],
      vulnerabilities: data.damage_vulnerabilities || [],
      environment: ["Varios"]
    };
    
    console.log('✅ Criatura obtenida de API:', creature.name);
    return creature;
    
  } catch (error) {
    console.error('❌ Error en API:', error);
    alert('⚠️ No se pudo conectar con la API. Generando criatura local...');
    return getRandomCreature();
  }
}

// Generar imágenes de criaturas
async function fetchCreatureImage(creatureName, creatureType) {
  const portraitImg = document.getElementById('creaturePortrait');
  if (!portraitImg) return;
  
  portraitImg.src = "https://placehold.co/280x320/3e2723/ffd700?text=🐉+Cargando";
  
  const creaturePrompts = {
    'Goblin': 'goblin green skin pointed ears sneaky fantasy dnd monster manual art',
    'Esqueleto': 'skeleton warrior undead bones armor sword fantasy dnd',
    'Lobo': 'dire wolf predator fangs forest beast fantasy',
    'Zombi': 'zombie undead rotting flesh horror dnd',
    'Orco': 'orc warrior tusks brutal tribal fantasy',
    'Ogro': 'ogre giant club primitive brutal fantasy',
    'Gelatina Ocre': 'ochre jelly ooze slime dungeon dnd',
    'Oso Pardo': 'brown bear massive claws forest',
    'Troll': 'troll regenerating green skin claws fantasy',
    'Mantícora': 'manticore lion dragon tail spikes fantasy',
    'Banshee': 'banshee spirit ghost wailing horror',
    'Espectro': 'wraith specter ghost ethereal fantasy',
    'Hidra': 'hydra multiple heads serpent water monster',
    'Quimera': 'chimera lion goat dragon hybrid',
    'Vampiro Engendro': 'vampire spawn undead fangs gothic',
    'Medusa': 'medusa snake hair gorgon stone gaze',
    'Dragón Rojo Joven': 'young red dragon fire breathing scales wings epic todd lockwood',
    'Beholder': 'beholder floating eye tentacles aberration dnd',
    'Liche': 'lich undead wizard phylactery dark magic',
    'Balor': 'balor demon fire wings whip sword abyssal',
    'Tarrasque': 'tarrasque kaiju colossal monster epic'
  };
  
  const prompt = creaturePrompts[creatureName] || 
    `${creatureName} ${creatureType} fantasy dnd monster manual professional art`;
  
  console.log(`🔍 Buscando imagen: ${prompt}`);
  
  try {
    const res = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.images && data.images.length > 0) {
        const idx = Math.floor(Math.random() * Math.min(data.images.length, 10));
        portraitImg.src = data.images[idx].src;
        console.log('✅ Imagen de criatura cargada');
        return;
      }
    }
  } catch(e) {
    console.warn('⚠️ Lexica no disponible para criatura');
  }
  
  try {
    const styles = ['bottts', 'identicon', 'shapes'];
    const style = randomFromArray(styles);
    const seed = encodeURIComponent(`${creatureName}-${creatureType}-${Date.now()}`);
    portraitImg.src = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=2a1a0f`;
    console.log('✅ Avatar de criatura generado');
  } catch(e) {
    const emojis = { 'Dragón': '🐉', 'No-muerto': '💀', 'Demonio': '👹', 'Bestia': '🐺', 'Aberración': '👁️', 'Gigante': '🗿', 'Humanoide': '⚔️', 'Monstruosidad': '🦎', 'Cieno': '🟢' };
    const emoji = emojis[creatureType] || '👾';
    portraitImg.src = `https://placehold.co/280x320/3e2723/ffd700?text=${encodeURIComponent(emoji + ' ' + creatureName)}`;
  }
}

// Mostrar criatura en UI
function displayCreature(creature) {
  if (!creature) {
    alert('❌ No se pudo generar la criatura');
    return;
  }
  
  console.log('📋 Mostrando criatura:', creature.name);
  currentCreature = creature;
  
  document.getElementById('creatureName').textContent = creature.name;
  document.getElementById('creatureType').textContent = `${creature.size} ${creature.type}`;
  document.getElementById('creatureCR').textContent = creature.cr;
  document.getElementById('creatureXP').textContent = `${creature.xp || 0} XP`;
  
  document.getElementById('creatureAC').textContent = creature.ac;
  document.getElementById('creatureHP').textContent = creature.hp;
  document.getElementById('creatureSpeed').textContent = creature.speed;
  
  const stats = ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'];
  stats.forEach(stat => {
    const value = creature[stat.toLowerCase()];
    const mod = calculateModifier(value);
    document.getElementById(`creature${stat}`).textContent = `${value} (${mod >= 0 ? '+' : ''}${mod})`;
  });
  
  document.getElementById('creatureSkills').innerHTML = 
    (creature.skills && creature.skills.length > 0) ? 
    creature.skills.map(s => `<li>${s}</li>`).join('') : 
    '<li>Ninguna</li>';
  
  document.getElementById('creatureTraits').innerHTML = 
    (creature.traits && creature.traits.length > 0) ? 
    creature.traits.map(t => `<li>${t}</li>`).join('') : 
    '<li>Ninguno</li>';
  
  document.getElementById('creatureActions').innerHTML = 
    (creature.actions && creature.actions.length > 0) ? 
    creature.actions.map(a => `<li>${a}</li>`).join('') : 
    '<li>Ninguna</li>';
  
  if (creature.legendaryActions && creature.legendaryActions.length > 0) {
    document.getElementById('creatureLegendaryActions').innerHTML = 
      creature.legendaryActions.map(a => `<li>${a}</li>`).join('');
    document.getElementById('legendarySection').classList.remove('hidden');
  } else {
    document.getElementById('legendarySection').classList.add('hidden');
  }
  
  const defenses = [];
  if (creature.immunities && creature.immunities.length > 0) {
    defenses.push(`<strong>Inmunidades:</strong> ${creature.immunities.join(', ')}`);
  }
  if (creature.resistances && creature.resistances.length > 0) {
    defenses.push(`<strong>Resistencias:</strong> ${creature.resistances.join(', ')}`);
  }
  if (creature.vulnerabilities && creature.vulnerabilities.length > 0) {
    defenses.push(`<strong>Vulnerabilidades:</strong> ${creature.vulnerabilities.join(', ')}`);
  }
  document.getElementById('creatureDefenses').innerHTML = 
    defenses.length > 0 ? defenses.join('<br>') : 'Ninguna';
  
  if (creature.environment && creature.environment.length > 0) {
    document.getElementById('creatureEnvironment').textContent = creature.environment.join(', ');
  } else {
    document.getElementById('creatureEnvironment').textContent = 'Cualquiera';
  }
  
  fetchCreatureImage(creature.name, creature.type);
  
  document.getElementById('creatureSheet').classList.remove('hidden');
  document.getElementById('creatureSheet').scrollIntoView({ behavior: 'smooth' });
  
  console.log('✅ Ficha de criatura mostrada');
}

// Generar encuentro balanceado
function generateEncounter(partyLevel, partySize) {
  if (!partyLevel || !partySize) {
    alert('❌ Ingresa nivel y tamaño del grupo');
    return;
  }
  
  console.log(`⚔️ Generando encuentro para nivel ${partyLevel}, ${partySize} jugadores...`);
  
  const targetXP = partyLevel * partySize * 200;
  let currentXP = 0;
  const encounter = [];
  let attempts = 0;
  const maxAttempts = 50;
  
  while (currentXP < targetXP * 0.7 && attempts < maxAttempts) {
    const creature = getRandomCreature({
      cr: Math.min(partyLevel, 13).toString()
    });
    
    if (creature) {
      const creatureXP = creature.xp || 100;
      
      if (currentXP + creatureXP <= targetXP * 1.3) {
        encounter.push(creature);
        currentXP += creatureXP;
      }
    }
    
    attempts++;
  }
  
  if (encounter.length === 0) {
    alert('❌ No se pudo generar encuentro. Intenta con otros parámetros.');
    return;
  }
  
  currentEncounter = encounter;
  displayEncounter(encounter, currentXP, targetXP);
  console.log(`✅ Encuentro generado: ${encounter.length} criaturas, ${currentXP} XP`);
}

// Mostrar encuentro
function displayEncounter(encounter, totalXP, targetXP) {
  const list = document.getElementById('encounterList');
  list.innerHTML = encounter.map((creature, idx) => `
    <div class="creature-card" onclick="displayCreature(currentEncounter[${idx}])">
      <h4>${creature.name}</h4>
      <p>${creature.type} - CR ${creature.cr}</p>
      <p class="xp-small">${creature.xp} XP</p>
    </div>
  `).join('');
  
  document.getElementById('encounterXP').textContent = 
    `${totalXP} XP (objetivo: ${targetXP} XP)`;
  
  document.getElementById('encounterPanel').classList.remove('hidden');
  document.getElementById('encounterPanel').scrollIntoView({ behavior: 'smooth' });
}

// ===== 📄 GENERADOR DE PDF ÉPICO MEJORADO =====
async function generatePDF() {
  if (!currentCharacter) {
    alert('❌ Primero genera un personaje');
    return;
  }
  
  console.log('📄 Generando PDF épico...');
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = 210;
  const pageHeight = 297;
  
  // ===== PÁGINA 1: FICHA PRINCIPAL =====
  
  // Fondo pergamino
  doc.setFillColor(244, 233, 216);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Borde ornamental doble
  doc.setDrawColor(42, 26, 15);
  doc.setLineWidth(3);
  doc.rect(5, 5, 200, 287);
  doc.setLineWidth(1);
  doc.rect(8, 8, 194, 281);
  
  // Decoración esquinas
  doc.setFontSize(14);
  doc.text('💀', 12, 18);
  doc.text('💀', 192, 18);
  doc.text('⚔️', 12, 285);
  doc.text('🐉', 192, 285);
  
  // HEADER ÉPICO
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 0, 0);
  doc.text(currentCharacter.name, pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(93, 64, 55);
  doc.text(`${currentCharacter.race} ${currentCharacter.class}`, pageWidth / 2, 35, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Nivel ${currentCharacter.level} - ${currentCharacter.alignment}`, pageWidth / 2, 42, { align: 'center' });
  
  // Línea decorativa dorada
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(2);
  doc.line(20, 48, 190, 48);
  doc.setLineWidth(0.5);
  doc.line(20, 50, 190, 50);
  
  let y = 58;
  
  // CARACTERÍSTICAS EN ESCUDOS HEXAGONALES
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 0, 0);
  doc.text('⚡ CARACTERÍSTICAS', 15, y);
  y += 10;
  
  const stats = [
    ['FUE', currentCharacter.stats.strength],
    ['DES', currentCharacter.stats.dexterity],
    ['CON', currentCharacter.stats.constitution],
    ['INT', currentCharacter.stats.intelligence],
    ['SAB', currentCharacter.stats.wisdom],
    ['CAR', currentCharacter.stats.charisma]
  ];
  
  let x = 20;
  stats.forEach(([name, value]) => {
    const mod = calculateModifier(value);
    
    // Hexágono dorado
    doc.setFillColor(212, 175, 55, 0.3);
    doc.setDrawColor(42, 26, 15);
    doc.setLineWidth(2);
    doc.circle(x + 10, y + 8, 12, 'FD');
    
    // Nombre stat
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(42, 26, 15);
    doc.text(name, x + 10, y + 5, { align: 'center' });
    
    // Valor
    doc.setFontSize(16);
    doc.text(value.toString(), x + 10, y + 11, { align: 'center' });
    
    // Modificador
    doc.setFontSize(11);
    doc.setTextColor(45, 80, 22);
    doc.text(`${mod >= 0 ? '+' : ''}${mod}`, x + 10, y + 17, { align: 'center' });
    
    x += 31;
  });
  
  y += 30;
  
  // COMBATE CON ICONOS
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 0, 0);
  doc.text('⚔️ COMBATE', 15, y);
  y += 8;
  
  doc.setFillColor(232, 213, 183);
  doc.setDrawColor(42, 26, 15);
  doc.roundedRect(15, y, 180, 32, 4, 4, 'FD');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(42, 26, 15);
  
  doc.text(`❤️  HP: ${currentCharacter.hp}`, 20, y + 10);
  doc.text(`🛡️  AC: ${currentCharacter.ac}`, 70, y + 10);
  doc.text(`👟 Velocidad: ${currentCharacter.speed} ft`, 120, y + 10);
  doc.text(`⚡ Iniciativa: ${calculateModifier(currentCharacter.stats.dexterity) >= 0 ? '+' : ''}${calculateModifier(currentCharacter.stats.dexterity)}`, 20, y + 20);
  doc.text(`🎯 Salvaciones: ${currentCharacter.savingThrows}`, 20, y + 28);
  
  y += 40;
  
  // RASGOS RACIALES
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 0, 0);
  doc.text('🐉 RASGOS RACIALES', 15, y);
  y += 8;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(42, 26, 15);
  
  currentCharacter.racialTraits.slice(0, 5).forEach(trait => {
    const lines = doc.splitTextToSize(`• ${trait}`, 175);
    doc.text(lines, 20, y);
    y += lines.length * 6;
  });
  
  y += 5;
  
  // CARACTERÍSTICAS DE CLASE
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 0, 0);
  doc.text('✨ HABILIDADES DE CLASE', 15, y);
  y += 8;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(42, 26, 15);
  
  currentCharacter.classFeatures.slice(0, 6).forEach(feature => {
    const lines = doc.splitTextToSize(`• ${feature}`, 175);
    doc.text(lines, 20, y);
    y += lines.length * 6;
  });
  
  y += 5;
  
  // EQUIPO
  if (y > 220) {
    doc.addPage();
    y = 20;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 0, 0);
  doc.text('🎒 EQUIPO INICIAL', 15, y);
  y += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(42, 26, 15);
  
  currentCharacter.equipment.slice(0, 10).forEach(item => {
    doc.text(`• ${item}`, 20, y);
    y += 5;
  });
  
  // ===== PÁGINA 2: PROGRESIÓN Y TRASFONDO =====
  doc.addPage();
  doc.setFillColor(244, 233, 216);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setLineWidth(2);
  doc.setDrawColor(42, 26, 15);
  doc.rect(5, 5, 200, 287);
  
  y = 20;
  
  // PROGRESIÓN DE NIVEL
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 0, 0);
  doc.text('📈 PROGRESIÓN DE HABILIDADES', pageWidth / 2, y, { align: 'center' });
  y += 12;
  
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(1);
  doc.line(20, y, 190, y);
  y += 8;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(42, 26, 15);
  
  if (currentCharacter.progression) {
    const levels = [1, 2, 3, 5, 7, 9, 11, 13, 15, 17, 20];
    
    levels.forEach(level => {
      if (currentCharacter.progression[level]) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(139, 0, 0);
        doc.text(`NIVEL ${level}`, 15, y);
        y += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(42, 26, 15);
        
        currentCharacter.progression[level].features.forEach(feature => {
          const lines = doc.splitTextToSize(`  ⚔️ ${feature}`, 175);
          doc.text(lines, 20, y);
          y += lines.length * 5;
        });
        
        y += 3;
      }
    });
  }
  
  // TRASFONDO
  if (y > 200) {
    doc.addPage();
    y = 20;
  } else {
    y += 10;
  }
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 0, 0);
  doc.text(`📜 TRASFONDO: ${currentCharacter.background.toUpperCase()}`, 15, y);
  y += 10;
  
  doc.setFillColor(232, 213, 183);
  doc.roundedRect(15, y, 180, 35, 4, 4, 'FD');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(42, 26, 15);
  
  doc.text(`Habilidades: ${currentCharacter.backgroundData.skills.join(', ')}`, 20, y + 8);
  const featureLines = doc.splitTextToSize(`Rasgo: ${currentCharacter.backgroundData.feature}`, 170);
  doc.text(featureLines, 20, y + 15);
  
  // FOOTER DECORATIVO EN TODAS LAS PÁGINAS
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(93, 64, 55);
    doc.text('D&D Character Forge - Generado con ❤️', pageWidth / 2, 290, { align: 'center' });
    doc.text(`Edición: ${currentEdition} | Página ${i} de ${totalPages}`, pageWidth / 2, 293, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('⚔️', 20, 290);
    doc.text('🐉', 190, 290);
  }
  
  // Guardar PDF
  const fileName = `${currentCharacter.name.replace(/\s/g, '_')}_DnD_${currentEdition}.pdf`;
  doc.save(fileName);
  console.log(`✅ PDF generado: ${fileName}`);
}

// ===== 💾 SISTEMA DE HISTORIAL =====
function saveToHistory(character) {
  try {
    let history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    history.unshift({
      ...character,
      timestamp: new Date().toISOString()
    });
    
    if (history.length > 20) history = history.slice(0, 20);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    console.log('✅ Personaje guardado en historial');
  } catch (e) {
    console.warn('⚠️ No se pudo guardar en historial:', e);
  }
}

function loadHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
      historyList.innerHTML = '<p style="text-align: center; color: #8d6e63;">No hay personajes guardados aún</p>';
      return;
    }
    
    historyList.innerHTML = history.map((char, idx) => `
      <div class="history-item" onclick="loadCharacterFromHistory(${idx})">
        <h4>${char.name}</h4>
        <p>${char.race} ${char.class} - Nivel ${char.level}</p>
        <p style="font-size: 0.85rem; color: #8d6e63;">
          ${new Date(char.timestamp).toLocaleDateString('es-ES', { 
            year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
          })}
        </p>
      </div>
    `).join('');
    
    console.log(`📚 Historial cargado: ${history.length} personajes`);
  } catch (e) {
    console.error('❌ Error cargando historial:', e);
  }
}

function loadCharacterFromHistory(index) {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const character = history[index];
    
    if (character) {
      displayCharacter(character);
      document.getElementById('historyModal').classList.add('hidden');
      console.log('✅ Personaje cargado desde historial:', character.name);
    }
  } catch (e) {
    console.error('❌ Error cargando personaje:', e);
    alert('Error al cargar el personaje');
  }
}

// ===== 📤 EXPORTAR/IMPORTAR JSON =====
function exportJSON() {
  if (!currentCharacter) {
    alert('❌ Primero genera un personaje');
    return;
  }
  
  const json = JSON.stringify(currentCharacter, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentCharacter.name.replace(/\s/g, '_')}_character.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  console.log('✅ Personaje exportado a JSON');
}

function importJSON() {
  const fileInput = document.getElementById('fileImport');
  fileInput.click();
}

document.getElementById('fileImport').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const character = JSON.parse(event.target.result);
      displayCharacter(character);
      console.log('✅ Personaje importado:', character.name);
      alert(`✅ Personaje "${character.name}" cargado exitosamente`);
    } catch (error) {
      console.error('❌ Error importando:', error);
      alert('❌ Error: Archivo JSON inválido');
    }
  };
  reader.readAsText(file);
});

// ===== 🌓 MODO OSCURO =====
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  document.getElementById('toggleTheme').textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
  console.log(`🌓 Tema cambiado a: ${isDark ? 'Oscuro' : 'Claro'}`);
}

// Cargar preferencia de tema
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  document.getElementById('toggleTheme').textContent = '☀️ Modo Claro';
}

// ===== 📤 COMPARTIR =====
function shareCharacter() {
  if (!currentCharacter) {
    alert('❌ Primero genera un personaje');
    return;
  }
  
  const shareText = `🐉 ¡Mira mi personaje de D&D!\n\n` +
    `${currentCharacter.name}\n` +
    `${currentCharacter.race} ${currentCharacter.class} - Nivel ${currentCharacter.level}\n` +
    `${currentCharacter.alignment}\n\n` +
    `FUE: ${currentCharacter.stats.strength} | DES: ${currentCharacter.stats.dexterity} | CON: ${currentCharacter.stats.constitution}\n` +
    `INT: ${currentCharacter.stats.intelligence} | SAB: ${currentCharacter.stats.wisdom} | CAR: ${currentCharacter.stats.charisma}\n\n` +
    `HP: ${currentCharacter.hp} | AC: ${currentCharacter.ac}\n\n` +
    `Generado en D&D Character Forge ⚔️`;
  
  if (navigator.share) {
    navigator.share({
      title: `${currentCharacter.name} - D&D Character`,
      text: shareText
    }).then(() => {
      console.log('✅ Personaje compartido');
    }).catch(() => {
      fallbackShare(shareText);
    });
  } else {
    fallbackShare(shareText);
  }
}

function fallbackShare(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Personaje copiado al portapapeles');
    console.log('✅ Texto copiado');
  }).catch(() => {
    alert('❌ No se pudo copiar. Intenta manualmente.');
  });
}

// ===== 🎮 EVENT LISTENERS - PERSONAJES =====

// Botón generar aleatorio
document.getElementById('randomBtn').addEventListener('click', () => {
  console.log('🎲 Generando personaje aleatorio...');
  const character = generateCharacter();
  displayCharacter(character);
});

// Toggle panel personalizado
document.getElementById('toggleCustom').addEventListener('click', () => {
  const panel = document.getElementById('customPanel');

  // Botón generar CHAOS
document.getElementById('chaosBtn').addEventListener('click', () => {
  console.log('🌀 Botón CHAOS presionado...');
  generateChaosCharacter();
});
  panel.classList.toggle('hidden');
  
  // Poblar selectores si están vacíos
  if (panel.querySelector('select option').length <= 1) {
    populateCustomSelectors();
  }
});

// Generar personalizado
document.getElementById('customGenerateBtn').addEventListener('click', () => {
  const customData = {
    name: document.getElementById('charName').value || undefined,
    race: document.getElementById('raceSelect').value || undefined,
    class: document.getElementById('classSelect').value || undefined,
    background: document.getElementById('backgroundSelect').value || undefined,
    alignment: document.getElementById('alignmentSelect').value || undefined
  };
  
  const character = generateCharacter(customData);
  displayCharacter(character);
});

// Poblar selectores de personalización
function populateCustomSelectors() {
  const raceSelect = document.getElementById('raceSelect');
  const classSelect = document.getElementById('classSelect');
  const backgroundSelect = document.getElementById('backgroundSelect');
  const alignmentSelect = document.getElementById('alignmentSelect');
  
  // Razas
  Object.keys(DND_DATA.races).forEach(race => {
    const option = document.createElement('option');
    option.value = race;
    option.textContent = race;
    raceSelect.appendChild(option);
  });
  
  // Clases
  Object.keys(DND_DATA.classes).forEach(charClass => {
    const option = document.createElement('option');
    option.value = charClass;
    option.textContent = charClass;
    classSelect.appendChild(option);
  });
  
  // Trasfondos
  Object.keys(DND_DATA.backgrounds).forEach(bg => {
    const option = document.createElement('option');
    option.value = bg;
    option.textContent = bg;
    backgroundSelect.appendChild(option);
  });
  
  // Alineamientos
  DND_DATA.alignments.forEach(alignment => {
    const option = document.createElement('option');
    option.value = alignment;
    option.textContent = alignment;
    alignmentSelect.appendChild(option);
  });
  
  console.log('✅ Selectores poblados');
}

// Regenerar retrato
document.getElementById('regenPortrait').addEventListener('click', regeneratePortrait);

// Descargar PDF
document.getElementById('downloadBtn').addEventListener('click', generatePDF);

// Exportar JSON
document.getElementById('exportJSONBtn').addEventListener('click', exportJSON);

// Importar JSON
document.getElementById('importJSONBtn').addEventListener('click', importJSON);

// Compartir
document.getElementById('shareBtn').addEventListener('click', shareCharacter);

// Historial
document.getElementById('historyBtn').addEventListener('click', () => {
  loadHistory();
  document.getElementById('historyModal').classList.remove('hidden');
});

// Cerrar modal
document.querySelector('.close-modal').addEventListener('click', () => {
  document.getElementById('historyModal').classList.add('hidden');
});

// Cerrar modal haciendo clic fuera
document.getElementById('historyModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.classList.add('hidden');
  }
});

// Nuevo personaje
document.getElementById('newCharBtn').addEventListener('click', () => {
  if (confirm('¿Generar un nuevo personaje? El actual se guardará en el historial.')) {
    document.getElementById('characterSheet').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Selector de edición
document.getElementById('editionSelect').addEventListener('change', (e) => {
  currentEdition = e.target.value;
  console.log(`📖 Edición cambiada a: ${currentEdition}`);
});

// ===== 🐉 EVENT LISTENERS - BESTIARIO =====

// Generar criatura
document.getElementById('generateCreatureBtn').addEventListener('click', () => {
  const filters = {
    type: document.getElementById('creatureTypeFilter').value,
    cr: document.getElementById('crFilter').value,
    environment: document.getElementById('environmentFilter').value
  };
  
  console.log('🎲 Generando criatura con filtros:', filters);
  const creature = getRandomCreature(filters);
  if (creature) {
    displayCreature(creature);
  } else {
    alert('❌ No se encontraron criaturas con esos filtros. Intenta con otros parámetros.');
  }
});

// Botón generar criatura CHAOS
document.getElementById('chaosBeastBtn').addEventListener('click', () => {
  console.log('🌀 Botón Criatura CHAOS presionado...');
  generateChaosBeast();
});

// Generar desde API
document.getElementById('generateFromAPIBtn').addEventListener('click', async () => {
  const creature = await generateCreatureFromAPI();
  if (creature) {
    displayCreature(creature);
  }
});

// Regenerar retrato de criatura
document.getElementById('regenCreaturePortrait').addEventListener('click', () => {
  if (currentCreature) {
    fetchCreatureImage(currentCreature.name, currentCreature.type);
  }
});

// Nueva criatura
document.getElementById('newCreatureBtn').addEventListener('click', () => {
  document.getElementById('creatureSheet').classList.add('hidden');
  document.querySelector('.bestiary-section').scrollIntoView({ behavior: 'smooth' });
});

// Generar encuentro
document.getElementById('generateEncounterBtn').addEventListener('click', () => {
  const partyLevel = parseInt(document.getElementById('partyLevel').value);
  const partySize = parseInt(document.getElementById('partySize').value);
  
  if (partyLevel && partySize) {
    generateEncounter(partyLevel, partySize);
  } else {
    alert('❌ Por favor ingresa nivel y tamaño del grupo');
  }
});

// ===== 🌓 TEMA OSCURO =====
document.getElementById('toggleTheme').addEventListener('click', toggleTheme);

// ===== 🎨 MINTEAR NFT (OPCIONAL - REQUIERE WALLET) =====
document.getElementById('mintNFTBtn').addEventListener('click', async () => {
  if (!currentCharacter) {
    alert('❌ Primero genera un personaje');
    return;
  }
  
  if (!window.ethereum) {
    alert('❌ Necesitas MetaMask para mintear NFTs\n\nInstala MetaMask desde:\nhttps://metamask.io');
    return;
  }
  
  try {
    console.log('🎨 Iniciando minteo de NFT...');
    
    // Conectar wallet
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    const account = accounts[0];
    console.log('✅ Wallet conectada:', account);
    
    // Aquí iría la lógica real de minteo con tu contrato
    // Por ahora, simulamos el proceso
    
    alert(`🎨 Función de NFT en desarrollo\n\n` +
          `Personaje: ${currentCharacter.name}\n` +
          `Wallet: ${account.substring(0, 6)}...${account.substring(38)}\n\n` +
          `Esta función estará disponible próximamente con integración a blockchain.`);
    
    console.log('ℹ️ Minteo simulado exitosamente');
    
  } catch (error) {
    console.error('❌ Error en minteo:', error);
    alert('❌ Error al conectar con MetaMask: ' + error.message);
  }
});

// ===== 🎯 FUNCIONES AUXILIARES =====

// Validar que todos los datos estén cargados
function validateDataLoaded() {
  if (!window.DND_DATA) {
    console.error('❌ DND_DATA no está cargado');
    alert('Error: Los datos de D&D no se cargaron correctamente. Recarga la página.');
    return false;
  }
  
  if (!window.DND_BESTIARY) {
    console.warn('⚠️ DND_BESTIARY no está cargado. El bestiario no funcionará.');
  }
  
  return true;
}

// Inicialización al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  console.log('🎲 D&D Character Forge inicializado');
  console.log('📖 Edición actual:', currentEdition);
  
  // Validar datos
  if (!validateDataLoaded()) {
    return;
  }
  
  // Cargar preferencia de tema
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const toggleBtn = document.getElementById('toggleTheme');
    if (toggleBtn) {
      toggleBtn.textContent = '☀️ Modo Claro';
    }
  }
  
  // Log de bienvenida épico
  console.log(`
  ╔═══════════════════════════════════════╗
  ║  🐉 D&D CHARACTER FORGE v1.0 🐉      ║
  ║  Generador Épico de Personajes       ║
  ║  ────────────────────────────────    ║
  ║  ⚔️  Creado con ❤️ para la          ║
  ║     comunidad de D&D                 ║
  ║                                       ║
  ║  ✅ Sistema de progresión            ║
  ║  ✅ Bestiario completo               ║
  ║  ✅ PDF épico                        ║
  ║  ✅ Retratos IA                      ║
  ║  ✅ Historial persistente            ║
  ║  ✅ Exportar/Importar                ║
  ╚═══════════════════════════════════════╝
  `);
  
  console.log('🎲 ¡Listo para generar personajes épicos!');
});

// Prevenir pérdida de datos al cerrar
window.addEventListener('beforeunload', (e) => {
  if (currentCharacter && !localStorage.getItem(STORAGE_KEY)) {
    e.preventDefault();
    e.returnValue = '¿Seguro que quieres salir? El personaje actual no está guardado.';
  }
});

// Manejo de errores global
window.addEventListener('error', (e) => {
  console.error('❌ Error global:', e.error);
  
  // No mostrar alert para errores menores
  if (e.error && e.error.message && !e.error.message.includes('Script error')) {
    console.error('Stack:', e.error.stack);
  }
});

// ===== 🎨 ANIMACIONES Y EFECTOS =====

// Efecto de aparición suave para fichas
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '0';
      entry.target.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        entry.target.style.transition = 'all 0.6s ease-out';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 100);
    }
  });
}, { threshold: 0.1 });

// Observar fichas cuando se muestren
const observeElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    observer.observe(element);
  }
};

// ===== 🎯 ATAJOS DE TECLADO =====
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + G: Generar personaje
  if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
    e.preventDefault();
    document.getElementById('randomBtn').click();
    console.log('⌨️ Atajo: Generar personaje');
  }
  
  // Ctrl/Cmd + P: Descargar PDF
  if ((e.ctrlKey || e.metaKey) && e.key === 'p' && currentCharacter) {
    e.preventDefault();
    generatePDF();
    console.log('⌨️ Atajo: Descargar PDF');
  }
  
  // Ctrl/Cmd + H: Abrir historial
  if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
    e.preventDefault();
    document.getElementById('historyBtn').click();
    console.log('⌨️ Atajo: Abrir historial');
  }
  
  // Escape: Cerrar modales
  if (e.key === 'Escape') {
    document.getElementById('historyModal').classList.add('hidden');
  }
});

// ===== 📊 ANALYTICS (OPCIONAL) =====
function trackEvent(category, action, label) {
  console.log(`📊 Evento: ${category} - ${action} - ${label}`);
  
  // Aquí podrías integrar Google Analytics, Mixpanel, etc.
  // gtag('event', action, { 'event_category': category, 'event_label': label });
}

// Trackear generación de personajes
const originalGenerateCharacter = generateCharacter;
window.generateCharacter = function(customData) {
  const character = originalGenerateCharacter(customData);
  trackEvent('Character', 'Generate', `${character.race} ${character.class}`);
  return character;
};

// ===== 🎉 EASTER EGGS =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    console.log('🎉 ¡Código Konami activado!');
    alert('🐉 ¡MODO ÉPICO ACTIVADO! 🐉\n\nTus próximos personajes tendrán stats legendarios...');
    
    // Modificar temporalmente la función de stats
    const originalGenerateStats = generateStats;
    window.generateStats = function() {
      return {
        strength: 18,
        dexterity: 18,
        constitution: 18,
        intelligence: 18,
        wisdom: 18,
        charisma: 18
      };
    };
    
    setTimeout(() => {
      window.generateStats = originalGenerateStats;
      console.log('⏰ Modo épico desactivado');
    }, 60000); // 1 minuto
  }
});

// ===== ✅ SISTEMA COMPLETADO =====
console.log('✅ Sistema completamente inicializado');
console.log('🎮 Atajos de teclado disponibles:');
console.log('   Ctrl/Cmd + G: Generar personaje');
console.log('   Ctrl/Cmd + P: Descargar PDF');
console.log('   Ctrl/Cmd + H: Abrir historial');
console.log('   Escape: Cerrar modales');
console.log('');
console.log('🎨 Características disponibles:');
console.log('   ✅ Generación aleatoria y personalizada');
console.log('   ✅ Sistema de progresión por nivel');
console.log('   ✅ Retratos IA épicos');
console.log('   ✅ Avatares SVG detallados');
console.log('   ✅ PDF profesional con progresión');
console.log('   ✅ Bestiario con 30+ criaturas');
console.log('   ✅ Generador de encuentros balanceados');
console.log('   ✅ API D&D 5e integrada');
console.log('   ✅ Historial persistente');
console.log('   ✅ Exportar/Importar JSON');
console.log('   ✅ Compartir personajes');
console.log('   ✅ Modo oscuro');
console.log('   ✅ Responsive design');
console.log('');
console.log('🐉 ¡Que comience la aventura!');

  // ===== 🌀 GENERACIÓN CHAOS (TOTALMENTE ALEATORIA) =====

// Función para generar un personaje CHAOS (combinaciones locas)
function generateChaosCharacter() {
  console.log('🌀 Generando personaje CHAOS...');
  
  const allRaces = Object.keys(DND_DATA.races);
  const allClasses = Object.keys(DND_DATA.classes);
  const allBackgrounds = Object.keys(DND_DATA.backgrounds);
  const allAlignments = Object.keys(DND_DATA.alignments);
  
  // Selección completamente aleatoria sin restricciones
  const randomRace = allRaces[Math.floor(Math.random() * allRaces.length)];
  const randomClass = allClasses[Math.floor(Math.random() * allClasses.length)];
  const randomBackground = allBackgrounds[Math.floor(Math.random() * allBackgrounds.length)];
  const randomAlignment = allAlignments[Math.floor(Math.random() * allAlignments.length)];
  
  // Generar stats completamente aleatorios (3-18)
  const chaosStats = {
    strength: rollDice(6) + rollDice(6) + rollDice(6),
    dexterity: rollDice(6) + rollDice(6) + rollDice(6),
    constitution: rollDice(6) + rollDice(6) + rollDice(6),
    intelligence: rollDice(6) + rollDice(6) + rollDice(6),
    wisdom: rollDice(6) + rollDice(6) + rollDice(6),
    charisma: rollDice(6) + rollDice(6) + rollDice(6)
  };
  
  const character = {
    name: generateEpicName(),
    race: randomRace,
    class: randomClass,
    background: randomBackground,
    alignment: randomAlignment,
    level: Math.floor(Math.random() * 20) + 1,
    stats: chaosStats,
    hp: rollDice(20) * 10,
    description: `Un ${randomRace} ${randomClass} ${randomAlignment} con un trasfondo de ${randomBackground}. ¡Una combinación COMPLETAMENTE ALEATORIA!`
  };
  
  currentCharacter = character;
  displayCharacter(character);
  console.log('✅ Personaje CHAOS generado:', character);
}

// Función para generar una criatura CHAOS
function generateChaosBeast() {
  console.log('🌀 Generando criatura CHAOS...');
  
  const allTypes = ['Aberración', 'Bestia', 'Dragón', 'Demonio', 'Gigante', 'Humanoide', 'No-muerto', 'Monstruosidad'];
  const allEnvironments = ['Mazmorra', 'Bosque', 'Montaña', 'Pantano', 'Subterráneo'];
  
  const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
  const randomEnvironment = allEnvironments[Math.floor(Math.random() * allEnvironments.length)];
  const randomCR = Math.floor(Math.random() * 30) + 1;
  
  const creature = {
    name: `${generateEpicName()} el Terrible`,
    type: randomType,
    cr: randomCR,
    environment: randomEnvironment,
    hp: rollDice(20) * randomCR,
    ac: 10 + Math.floor(Math.random() * 10),
    attacks: [
      `Ataque Caótico ${rollDice(6)}d${rollDice(12)}`,
      `Habilidad Especial ${rollDice(4)}d${rollDice(8)}`
    ],
    description: `Una criatura ${randomType} de CR ${randomCR} que habita en ${randomEnvironment}. ¡TOTALMENTE IMPREDECIBLE!`
  };
  
  currentCreature = creature;
  displayCreature(creature);
  console.log('✅ Criatura CHAOS generada:', creature);
}

// Exportar funciones globales para debugging
window.DEBUG = {
  generateCharacter,
  displayCharacter,
  generateCreature: getRandomCreature,
  displayCreature,
  currentCharacter: () => currentCharacter,
  currentCreature: () => currentCreature,
  version: '1.0.0'
};

console.log('🔧 Modo debug disponible: window.DEBUG');


