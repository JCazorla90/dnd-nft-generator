// ==========================================
// 🎲 D&D CHARACTER FORGE - SISTEMA COMPLETO
// Hecho con ❤️ para la comunidad de D&D
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
    'Mediano': ['Bilbo Baggins', 'Frodo Underhill', 'Samwise Gamgee', 'Pippin Took', 'Merry Brandybuck'],
    'Tiefling': ['Akta Hellborn', 'Damakos Nightfire', 'Iados Darkflame', 'Kairon Shadowhorn'],
    'Dracónido': ['Arjhan Firebreath', 'Balasar Dragonheart', 'Donaar Scalebane', 'Heskan Wyrmclaw'],
    'Gnomo': ['Eldon Tinkertop', 'Brocc Nackle', 'Sindri Fastspring', 'Zook Beren'],
    'Semielfo': ['Tanis Half-Elven', 'Solamnia Brightblade', 'Laurana Kanan'],
    'Semiorco': ['Grog Strongjaw', 'Durotan', 'Orgrim Doomhammer']
  };
  
  // Intentar obtener nombre específico por raza y clase
  if (names[race] && typeof names[race] === 'object' && !Array.isArray(names[race])) {
    const classNames = names[race][charClass] || names[race]['default'];
    return randomFromArray(classNames);
  }
  
  // Nombre por raza genérico
  if (names[race] && Array.isArray(names[race])) {
    return randomFromArray(names[race]);
  }
  
  // Fallback a humano
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
  
  // Manejar subrazas
  let raceData = DND_DATA.races[race];
  if (raceData.subraces) {
    const subraceKey = randomFromArray(Object.keys(raceData.subraces));
    raceData = { ...raceData, ...raceData.subraces[subraceKey] };
  }
  
  const backgroundData = DND_DATA.backgrounds[background];
  
  // Calcular HP y AC
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
    classFeatures: classData.features,
    savingThrows: classData.proficiencies.savingThrows,
    skills: classData.skills.from ? 
      `Elige ${classData.skills.choose}: ${classData.skills.from.join(', ')}` : 
      'Ver clase',
    equipment: classData.equipment,
    backgroundData: backgroundData
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

// ===== 🎨 AVATAR ÉPICO SVG (MEJORADO) =====
function drawAvatar(name, race, charClass) {
  console.log('🎨 Dibujando avatar épico...');
  const avatarSvg = document.getElementById('charAvatar');
  if (!avatarSvg) return;

  // Paletas de color épicas por clase
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

  // SVG épico con detalles por clase
  const svg = `
    <defs>
      <radialGradient id="bgGrad">
        <stop offset="0%" stop-color="${colors.primary}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${colors.primary}" stop-opacity="0.8"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f5f5f5"/>
        <stop offset="50%" stop-color="${colors.secondary}"/>
        <stop offset="100%" stop-color="${colors.primary}"/>
      </linearGradient>
    </defs>

    <!-- Fondo circular épico -->
    <circle cx="60" cy="60" r="58" fill="url(#bgGrad)" filter="url(#glow)"/>
    <circle cx="60" cy="60" r="55" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.5"/>

    <!-- Cabeza/Rostro base -->
    <ellipse cx="60" cy="55" rx="20" ry="24" fill="#d4a574" stroke="${colors.primary}" stroke-width="2"/>

    <!-- Clase: Guerrero - Casco -->
    ${charClass === 'Guerrero' ? `
      <ellipse cx="60" cy="45" rx="22" ry="20" fill="url(#metalGrad)" stroke="#2a2a2a" stroke-width="2"/>
      <rect x="52" y="50" width="16" height="6" rx="2" fill="#3a3a3a"/>
      <path d="M 45,45 L 40,38" stroke="#c0c0c0" stroke-width="2"/>
      <path d="M 75,45 L 80,38" stroke="#c0c0c0" stroke-width="2"/>
    ` : ''}

    <!-- Clase: Mago - Sombrero -->
    ${charClass === 'Mago' ? `
      <path d="M 60,25 L 50,50 L 70,50 Z" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/>
      <ellipse cx="60" cy="50" rx="12" ry="4" fill="${colors.primary}"/>
      <circle cx="60" cy="35" r="3" fill="${colors.accent}">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
      </circle>
    ` : ''}

    <!-- Clase: Pícaro - Capucha -->
    ${charClass === 'Pícaro' ? `
      <path d="M 60,30 L 42,55 L 78,55 Z" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/>
      <ellipse cx="55" cy="52" rx="3" ry="4" fill="${colors.accent}"/>
      <ellipse cx="65" cy="52" rx="3" ry="4" fill="${colors.accent}"/>
    ` : ''}

    <!-- Clase: Clérigo - Corona santa -->
    ${charClass === 'Clérigo' ? `
      <path d="M 52,35 L 60,25 L 68,35" fill="${colors.primary}" stroke="${colors.accent}" stroke-width="2"/>
      <circle cx="60" cy="30" r="4" fill="${colors.accent}" opacity="0.8"/>
    ` : ''}

    <!-- Clase: Paladín - Halo -->
    ${charClass === 'Paladín' ? `
      <circle cx="60" cy="40" r="30" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.5">
        <animate attributeName="r" values="28;32;28" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="60" cy="38" r="6" fill="${colors.accent}" opacity="0.6"/>
    ` : ''}

    <!-- Clase: Bárbaro - Pelo salvaje -->
    ${charClass === 'Bárbaro' ? `
      <path d="M 42,45 Q 38,35 40,30" stroke="${colors.primary}" stroke-width="3" fill="none"/>
      <path d="M 78,45 Q 82,35 80,30" stroke="${colors.primary}" stroke-width="3" fill="none"/>
      <path d="M 50,60 Q 48,68 50,75" stroke="${colors.primary}" stroke-width="2" fill="none"/>
      <path d="M 70,60 Q 72,68 70,75" stroke="${colors.primary}" stroke-width="2" fill="none"/>
    ` : ''}

    <!-- Clase: Druida - Hojas -->
    ${charClass === 'Druida' ? `
      <circle cx="60" cy="50" rx="22" ry="20" fill="${colors.primary}" opacity="0.5"/>
      <path d="M 45,45 Q 42,38 45,32" fill="${colors.secondary}" stroke="${colors.accent}" stroke-width="1"/>
      <path d="M 55,42 Q 52,35 55,30" fill="${colors.secondary}" stroke="${colors.accent}" stroke-width="1"/>
      <path d="M 65,42 Q 68,35 65,30" fill="${colors.secondary}" stroke="${colors.accent}" stroke-width="1"/>
      <path d="M 75,45 Q 78,38 75,32" fill="${colors.secondary}" stroke="${colors.accent}" stroke-width="1"/>
    ` : ''}

    <!-- Torso/Cuerpo -->
    <path d="M 38,70 L 60,65 L 82,70 L 82,100 L 38,100 Z" fill="url(#metalGrad)" stroke="${colors.primary}" stroke-width="2" opacity="0.9"/>

    <!-- Símbolo de clase en el pecho -->
    <circle cx="60" cy="82" r="8" fill="${colors.accent}" opacity="0.7"/>
    <text x="60" y="87" text-anchor="middle" font-size="12" fill="${colors.primary}" font-weight="bold">
      ${charClass.charAt(0)}
    </text>

    <!-- Marco ornamental -->
    <circle cx="60" cy="60" r="58" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.7"/>
    <circle cx="60" cy="60" r="56" fill="none" stroke="${colors.primary}" stroke-width="1" stroke-dasharray="5,5" opacity="0.5"/>

    <!-- Etiqueta inferior -->
    <rect x="25" y="100" width="70" height="14" rx="4" fill="${colors.primary}" opacity="0.8"/>
    <text x="60" y="110" text-anchor="middle" font-size="9" font-weight="bold" fill="${colors.accent}" font-family="serif">
      ${charClass.toUpperCase()}
    </text>
  `;

  avatarSvg.innerHTML = svg;
  avatarSvg.setAttribute('viewBox', '0 0 120 120');
  console.log('✅ Avatar dibujado con amor');
}

// ===== 🖼️ SISTEMA DE RETRATOS IA MEJORADO (CON AMOR) =====
async function fetchAIPortrait(race, charClass) {
  console.log(`🎨 Buscando retrato épico para ${race} ${charClass}...`);
  const portraitImg = document.getElementById('aiPortrait');
  if (!portraitImg) return;

  // Placeholder mientras carga
  portraitImg.src = "https://placehold.co/320x420/3e2723/ffd700?text=⚔️+Generando...";
  portraitImg.alt = "Generando retrato épico...";

  // Prompts ULTRA específicos estilo Baldur's Gate 3 / Pathfinder
  const epicPrompts = {
    // GUERREROS
    'Guerrero-Humano': 'human knight in ornate plate armor wielding longsword fantasy portrait oil painting by Larry Elmore dramatic lighting heroic pose dnd 5e character art',
    'Guerrero-Enano': 'dwarf warrior massive braided beard battleaxe heavy armor fantasy portrait realistic painting by Keith Parkinson forgotten realms art style',
    'Guerrero-Elfo': 'elven warrior elegant mithril armor graceful longsword silver hair fantasy portrait by Todd Lockwood high fantasy',
    'Guerrero-Orco': 'orc warrior brutal armor war paint fierce expression battleaxe fantasy portrait by Wayne Reynolds',
    
    // MAGOS
    'Mago-Humano': 'human wizard blue robes arcane staff glowing spell casting fantasy portrait dramatic lighting by Clyde Caldwell magic aura',
    'Mago-Elfo': 'elven archmage ancient spellbook mystical runes ethereal beauty fantasy portrait by Jeff Easley high elf wizard',
    'Mago-Gnomo': 'gnome wizard spectacles pointy hat magical laboratory fantasy portrait whimsical art style',
    
    // PÍCAROS
    'Pícaro-Mediano': 'halfling rogue leather armor twin daggers sneaking shadows dark fantasy portrait by Wayne Reynolds thief',
    'Pícaro-Elfo': 'elven rogue dark hood bow arrows mysterious fantasy portrait stealth by Larry Elmore',
    'Pícaro-Humano': 'human assassin hooded cloak daggers mysterious shadows noir fantasy portrait',
    
    // CLÉRIGOS
    'Clérigo-Humano': 'human cleric holy vestments divine light blessing gesture religious fantasy portrait by Keith Parkinson priest',
    'Clérigo-Enano': 'dwarf cleric war hammer holy symbol divine radiance fantasy portrait battle priest',
    
    // PALADINES
    'Paladín-Humano': 'human paladin shining golden plate armor holy avenger sword divine aura heroic fantasy portrait by Larry Elmore righteous knight',
    'Paladín-Dracónido': 'dragonborn paladin scaled golden armor holy power breath weapon fantasy portrait epic',
    
    // BÁRBAROS
    'Bárbaro-Humano': 'human barbarian muscular wielding greataxe rage tribal tattoos savage fantasy portrait by Wayne Reynolds',
    'Bárbaro-Orco': 'orc barbarian tusks massive muscles brutal fury fantasy portrait dark gritty',
    'Bárbaro-Semiorco': 'half-orc barbarian powerful build rage tribal warrior fantasy portrait',
    
    // DRUIDAS
    'Druida-Humano': 'human druid nature magic green aura animal companions staff mystical fantasy portrait organic',
    'Druida-Elfo': 'elven druid forest communion wild shape deer companion fantasy portrait by Todd Lockwood',
    
    // BARDOS
    'Bardo-Humano': 'human bard elegant clothes lute magical performance charismatic fantasy portrait colorful by Larry Elmore',
    'Bardo-Semielfo': 'half-elf bard charismatic performer musical magic fantasy portrait',
    
    // MONJES
    'Monje-Humano': 'human monk martial arts robes meditation ki energy spiritual fantasy portrait eastern style',
    
    // EXPLORADORES
    'Explorador-Humano': 'human ranger wilderness gear longbow wolf companion tracking fantasy portrait by Keith Parkinson',
    'Explorador-Elfo': 'elven ranger forest hunter bow hawk companion nature fantasy portrait',
    
    // HECHICEROS
    'Hechicero-Humano': 'human sorcerer wild magic draconic bloodline chaos energy fantasy portrait dramatic by Clyde Caldwell',
    'Hechicero-Tiefling': 'tiefling sorcerer red skin horns tail infernal magic fire fantasy portrait demonic',
    
    // BRUJOS
    'Brujo-Humano': 'human warlock eldritch power dark pact mysterious entity gothic fantasy portrait by Wayne Reynolds',
    'Brujo-Tiefling': 'tiefling warlock horns dark magic sinister patron infernal fantasy portrait'
  };

  const key = `${charClass}-${race}`;
  let prompt = epicPrompts[key];
  
  // Fallback genérico pero épico
  if (!prompt) {
    prompt = `${race} ${charClass} fantasy character portrait professional dnd art style by Larry Elmore Keith Parkinson dramatic lighting heroic detailed face armor weapons`;
  }

  console.log(`🔍 Prompt: ${prompt}`);

  // INTENTO 1: Lexica.art (Stable Diffusion - MEJOR CALIDAD)
  try {
    const res = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.images && data.images.length > 0) {
        // Elegir imagen aleatoria de las primeras 15
        const idx = Math.floor(Math.random() * Math.min(data.images.length, 15));
        portraitImg.src = data.images[idx].src;
        portraitImg.alt = `${race} ${charClass} - Arte épico D&D`;
        console.log('✅ Retrato épico cargado desde Lexica');
        return;
      }
    }
  } catch(e) {
    console.warn('⚠️ Lexica no disponible:', e.message);
  }

  // INTENTO 2: DiceBear Avataaars (Estilo cartoon pero temático)
  try {
    const styles = ['avataaars', 'adventurer', 'big-smile'];
    const style = randomFromArray(styles);
    const seed = encodeURIComponent(`${race}-${charClass}-${name}-${Date.now()}`);
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=3e2723,5d4037,8b7355&radius=12&size=96`;
    
    portraitImg.src = url;
    portraitImg.alt = `${race} ${charClass} - Avatar artístico`;
    console.log('✅ Avatar artístico generado');
  } catch(e) {
    console.warn('⚠️ DiceBear falló:', e.message);
    
    // FALLBACK FINAL: Placeholder temático
    const emojis = {
      'Guerrero': '⚔️',
      'Mago': '🧙',
      'Pícaro': '🗡️',
      'Clérigo': '✝️',
      'Paladín': '🛡️',
      'Bárbaro': '⚡',
      'Druida': '🌿',
      'Bardo': '🎵',
      'Monje': '☯️',
      'Explorador': '🏹',
      'Brujo': '🌙',
      'Hechicero': '✨'
    };
    
    const emoji = emojis[charClass] || '⚔️';
    portraitImg.src = `https://placehold.co/320x420/3e2723/ffd700?text=${encodeURIComponent(emoji + ' ' + race + ' ' + charClass)}`;
  }
}

function regeneratePortrait() {
  if (!currentCharacter) {
    alert('❌ Primero genera un personaje');
    return;
  }
  console.log('🔄 Regenerando retrato...');
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
  
  if(avg >= 17){
    lvl="⭐⭐⭐⭐⭐ Legendario";
    gradient="linear-gradient(90deg, #ffd700, #ff8c00, #ffd700)";
  } else if(avg >= 15){
    lvl="⭐⭐⭐⭐ Épico";
    gradient="linear-gradient(90deg, #d4af37, #f4d03f, #d4af37)";
  } else if(avg >= 13){
    lvl="⭐⭐⭐ Heroico";
    gradient="linear-gradient(90deg, #c0c0c0, #e8e8e8, #c0c0c0)";
  } else if(avg >= 11){
    lvl="⭐⭐ Promedio";
    gradient="linear-gradient(90deg, #cd7f32, #e8a87c, #cd7f32)";
  }
  
  powerLevel.textContent = lvl;
  powerBar.style.background = gradient;
  
  console.log(`⚡ Power Level: ${lvl} (${avg.toFixed(1)} avg)`);
}

// ===== 📋 MOSTRAR PERSONAJE EN UI =====
function displayCharacter(character) {
  console.log('📋 Mostrando ficha de personaje...');
  currentCharacter = character;
  
  // Info básica
  document.getElementById('displayName').textContent = character.name;
  document.getElementById('displayRace').textContent = character.race;
  document.getElementById('displayClass').textContent = character.class;
  document.getElementById('displayLevel').textContent = character.level;
  document.getElementById('displayBackground').textContent = character.background;
  document.getElementById('displayAlignment').textContent = character.alignment;
  
  // Características
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
    document.getElementById(`mod${stat.id}`).textContent = 
      (modifier >= 0 ? '+' : '') + modifier;
  });
  
  // Combate
  document.getElementById('displayHP').textContent = character.hp;
  document.getElementById('displayAC').textContent = character.ac;
  document.getElementById('displaySpeed').textContent = `${character.speed} ft`;
  document.getElementById('displayInit').textContent = 
    (calculateModifier(character.stats.dexterity) >= 0 ? '+' : '') + 
    calculateModifier(character.stats.dexterity);
  
  // Salvaciones y habilidades
  document.getElementById('displaySavingThrows').textContent = 
    Array.isArray(character.savingThrows) ? character.savingThrows.join(', ') : character.savingThrows;
  document.getElementById('displaySkills').textContent = character.skills;
  
  // Equipo
  document.getElementById('equipment').innerHTML = character.equipment
    .map(item => `<li>${item}</li>`).join('');
  
  // Trasfondo
  document.getElementById('backgroundName').textContent = character.background;
  document.getElementById('backgroundSkills').textContent = character.backgroundData.skills.join(', ');
  document.getElementById('backgroundFeature').textContent = character.backgroundData.feature;
  document.getElementById('backgroundEquipment').innerHTML = character.backgroundData.equipment
    .map(item => `<li>${item}</li>`).join('');
  
  // Rasgos y características
  document.getElementById('racialTraits').innerHTML = character.racialTraits
    .map(trait => `<li>${trait}</li>`).join('');
  
  document.getElementById('classProficiencies').innerHTML = character.classProficiencies
    .map(prof => `<li>${prof}</li>`).join('');
  
  document.getElementById('classFeatures').innerHTML = character.classFeatures
    .map(feature => `<li>${feature}</li>`).join('');
  
  // Power level
  updatePowerLevel(character.stats);
  
  // Avatar y retrato
  drawAvatar(character.name, character.race, character.class);
  fetchAIPortrait(character.race, character.class);
  
  // Mostrar ficha
  document.getElementById('characterSheet').classList.remove('hidden');
  document.getElementById('characterSheet').scrollIntoView({ behavior: 'smooth' });
  
  // Guardar en historial
  saveToHistory(character);
  
  console.log('✅ Ficha mostrada con éxito');
}

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

// ===== 📚 CONTINÚA CON BESTIARIO Y PDF EN EL SIGUIENTE MENSAJE =====

