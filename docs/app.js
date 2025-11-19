// ==========================================
// ESTADO GLOBAL Y CONFIGURACIÓN
// ==========================================
let currentCharacter = null;
const STORAGE_KEY = 'dnd_character_history';
const NFT_CONTRACT = "0x3Dd267B885777b2Fe60C63Fc59B2a45a4fD1Dd58"; // Testnet
const NFT_ABI = ["function safeMint(address to, string memory tokenURI) public"];

// ==========================================
// UTILIDADES BÁSICAS
// ==========================================
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function calculateModifier(stat) {
  return Math.floor((stat - 10) / 2);
}

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

// ==========================================
// GENERACIÓN DE PERSONAJES
// ==========================================
function generateCharacter(customData = {}) {
  const race = customData.race || randomFromArray(Object.keys(DND_DATA.races));
  const charClass = customData.class || randomFromArray(Object.keys(DND_DATA.classes));
  const background = customData.background || randomFromArray(Object.keys(DND_DATA.backgrounds));
  const alignment = customData.alignment || randomFromArray(DND_DATA.alignments);
  
  const stats = generateStats();
  const classData = DND_DATA.classes[charClass];
  
  // Obtener datos de raza (manejando subrazas)
  let raceData = DND_DATA.races[race];
  if (raceData.subraces) {
    const subraceKey = randomFromArray(Object.keys(raceData.subraces));
    raceData = { ...raceData, ...raceData.subraces[subraceKey] };
  }
  
  const backgroundData = DND_DATA.backgrounds[background];
  
  const hp = classData.hitDie + calculateModifier(stats.constitution);
  const ac = 10 + calculateModifier(stats.dexterity);
  
  return {
    name: customData.name || generateRandomName(race, charClass),
    race,
    class: charClass,
    background,
    alignment,
    level: 1,
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
}

function generateRandomName(race, charClass) {
  const names = {
    'Humano': ['Aric', 'Brendan', 'Cassandra', 'Diana', 'Erik', 'Fiona', 'Gareth', 'Helena'],
    'Elfo': ['Aelrindel', 'Eldacar', 'Galadriel', 'Legolas', 'Thranduil', 'Arwen', 'Elrond'],
    'Alto Elfo': ['Aelrindel', 'Elenwe', 'Finrod', 'Gildor', 'Glorfindel'],
    'Elfo Oscuro (Drow)': ['Drizzt', 'Zaknafein', 'Jarlaxle', 'Liriel', 'Quenthel'],
    'Elfo de los Bosques': ['Tanis', 'Laurana', 'Gilthanas', 'Silvara'],
    'Enano': ['Balin', 'Dwalin', 'Thorin', 'Gimli', 'Dain', 'Thrain', 'Bruenor'],
    'Enano de las Montañas': ['Thorin', 'Dain', 'Thrain', 'Balin'],
    'Enano de las Colinas': ['Flint', 'Bruenor', 'Wulfgar'],
    'Orco': ['Grunk', 'Thrak', 'Urgak', 'Mog', 'Grul', 'Drak', 'Ugoth'],
    'Semiorco': ['Obould', 'Gruumsh', 'Shargaas', 'Yurtrus'],
    'Mediano': ['Bilbo', 'Frodo', 'Sam', 'Pippin', 'Merry', 'Rosie', 'Regis'],
    'Mediano Piesligeros': ['Frodo', 'Bilbo', 'Merry', 'Pippin'],
    'Mediano Fornido': ['Sam', 'Rosie', 'Lobelia'],
    'Tiefling': ['Akta', 'Damakos', 'Ekemon', 'Iados', 'Kairon', 'Leucis', 'Melech'],
    'Dracónido': ['Arjhan', 'Balasar', 'Bharash', 'Donaar', 'Ghesh', 'Heskan', 'Kriv'],
    'Gnomo': ['Alston', 'Brocc', 'Burgell', 'Dimble', 'Eldon', 'Fonkin'],
    'Gnomo de las Rocas': ['Alston', 'Boddynock', 'Dimble'],
    'Gnomo de los Bosques': ['Brocc', 'Eldon', 'Fonkin'],
    'Semielfo': ['Tanis', 'Goldmoon', 'Raistlin', 'Caramon']
  };
  
  const raceNames = names[race] || names['Humano'];
  const firstName = randomFromArray(raceNames);
  const titles = [
    'el Valiente', 'el Sabio', 'el Rápido', 'el Fuerte', 'la Astuta', 'el Noble',
    'Puño de Hierro', 'Corazón de León', 'Sombra Oscura', 'Luz Estelar',
    'Cazador de Dragones', 'Guardián del Bosque', 'Mata Orcos', 'Rompe Muros'
  ];
  
  return `${firstName} ${randomFromArray(titles)}`;
}

function formatProficiencies(prof) {
  const parts = [];
  if (prof.armor && prof.armor.length) parts.push(`Armaduras: ${prof.armor.join(', ')}`);
  if (prof.weapons && prof.weapons.length) parts.push(`Armas: ${prof.weapons.join(', ')}`);
  if (prof.tools && prof.tools.length) parts.push(`Herramientas: ${prof.tools.join(', ')}`);
  return parts;
}

// ==========================================
// AVATAR SVG ÉPICO D&D
// ==========================================
function drawAvatar(name, race, charClass) {
  const avatarSvg = document.getElementById('charAvatar');
  if (!avatarSvg) return;
  
  // Paletas de colores épicas por raza (tonos medievales)
  const racePalettes = {
    'Humano': { skin: '#d4a574', outline: '#8b6f47', hair: '#3d2817', armor: '#4a4a4a' },
    'Elfo': { skin: '#c8b5a0', outline: '#6b5b4e', hair: '#d4af37', armor: '#2d5a3d' },
    'Alto Elfo': { skin: '#c8b5a0', outline: '#6b5b4e', hair: '#d4af37', armor: '#1a3a52' },
    'Elfo Oscuro (Drow)': { skin: '#5a4a6a', outline: '#2a1a3a', hair: '#e8e8e8', armor: '#8b008b' },
    'Elfo de los Bosques': { skin: '#b8a080', outline: '#6b5a42', hair: '#8b6914', armor: '#2d5a2d' },
    'Enano': { skin: '#a8926a', outline: '#6b5a42', hair: '#654321', armor: '#696969' },
    'Enano de las Montañas': { skin: '#a8926a', outline: '#6b5a42', hair: '#8b4513', armor: '#404040' },
    'Enano de las Colinas': { skin: '#a8926a', outline: '#6b5a42', hair: '#d2691e', armor: '#8b7355' },
    'Mediano': { skin: '#e8d4b8', outline: '#b8926a', hair: '#8b4513', armor: '#3d3d3d' },
    'Mediano Piesligeros': { skin: '#e8d4b8', outline: '#b8926a', hair: '#d2691e', armor: '#2d2d2d' },
    'Mediano Fornido': { skin: '#d8b8a8', outline: '#9b7f5f', hair: '#8b6f47', armor: '#4a4a4a' },
    'Orco': { skin: '#7a9a5a', outline: '#3a501e', hair: '#1a3a1a', armor: '#8b4513' },
    'Semiorco': { skin: '#8aaa7a', outline: '#4a6a2a', hair: '#2d5a2d', armor: '#8b6f47' },
    'Tiefling': { skin: '#d4a8c8', outline: '#8b3a6b', hair: '#4b0082', armor: '#8b008b' },
    'Dracónido': { skin: '#d4c747', outline: '#aa8a21', hair: '#b8860b', armor: '#cd5c5c' },
    'Gnomo': { skin: '#e8c4a0', outline: '#c49060', hair: '#ff6347', armor: '#3d5a3d' },
    'Gnomo de las Rocas': { skin: '#e8c4a0', outline: '#c49060', hair: '#ff4500', armor: '#696969' },
    'Gnomo de los Bosques': { skin: '#d8b8a0', outline: '#a89878', hair: '#8b6914', armor: '#4a7c4e' },
    'Semielfo': { skin: '#d8c4a8', outline: '#9b8868', hair: '#b8860b', armor: '#2d4a52' }
  };
  
  // Símbolos y colores por clase
  const classStyles = {
    'Guerrero': { crest: '⚔️', color: '#8b4513', badge: '🛡️' },
    'Mago': { crest: '✨', color: '#4169e1', badge: '📜' },
    'Pícaro': { crest: '🗡️', color: '#2d5a2d', badge: '🗝️' },
    'Clérigo': { crest: '✞', color: '#daa520', badge: '⛪' },
    'Paladín': { crest: '✦', color: '#ffd700', badge: '⚡' },
    'Bardo': { crest: '🎵', color: '#8b3a8b', badge: '🎸' },
    'Bárbaro': { crest: '🔥', color: '#dc143c', badge: '💥' },
    'Druida': { crest: '🌿', color: '#228b22', badge: '🍃' },
    'Monje': { crest: '☯️', color: '#ff8c00', badge: '🤝' },
    'Explorador': { crest: '🏹', color: '#8fbc8f', badge: '🦌' },
    'Hechicero': { crest: '⚡', color: '#9370db', badge: '🔮' },
    'Brujo': { crest: '🌙', color: '#8b008b', badge: '👁️' }
  };
  
  const palette = racePalettes[race] || racePalettes['Humano'];
  const classStyle = classStyles[charClass] || { crest: '⚔️', color: '#696969', badge: '🎯' };
  
  // Hash para consistencia
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }
  hash = Math.abs(hash) % 100;
  
  // SVG Épico
  const svg = `
    <defs>
      <radialGradient id="skinGrad" cx="40%" cy="40%">
        <stop offset="0%" style="stop-color:${palette.skin};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${palette.outline};stop-opacity:0.5" />
      </radialGradient>
      <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${classStyle.color};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:${palette.armor};stop-opacity:0.6" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.4"/>
      </filter>
    </defs>
    
    <!-- Fondo escudo heráldico -->
    <g filter="url(#shadow)">
      <path d="M 60,10 L 100,40 L 100,95 Q 60,115 20,95 L 20,40 Z" 
            fill="${classStyle.color}" opacity="0.15"/>
      <path d="M 60,10 L 100,40 L 100,95 Q 60,115 20,95 L 20,40 Z" 
            fill="none" stroke="${classStyle.color}" stroke-width="2" opacity="0.5"/>
    </g>
    
    <!-- Cabello/Cabeza -->
    <ellipse cx="60" cy="35" rx="25" ry="28" fill="${palette.hair}" opacity="0.9"/>
    <path d="M 35,30 Q 60,15 85,30" fill="${palette.hair}" opacity="0.7" stroke="${palette.outline}" stroke-width="0.5"/>
    
    <!-- Cara -->
    <ellipse cx="60" cy="50" rx="22" ry="24" fill="url(#skinGrad)" stroke="${palette.outline}" stroke-width="1.5"/>
    
    <!-- Ojos expresivos -->
    <ellipse cx="52" cy="48" rx="4" ry="5" fill="white" opacity="0.9"/>
    <ellipse cx="68" cy="48" rx="4" ry="5" fill="white" opacity="0.9"/>
    <circle cx="52" cy="49" r="2.5" fill="#1a1a1a"/>
    <circle cx="68" cy="49" r="2.5" fill="#1a1a1a"/>
    <circle cx="53" cy="47.5" r="1" fill="white" opacity="0.7"/>
    <circle cx="69" cy="47.5" r="1" fill="white" opacity="0.7"/>
    
    <!-- Cejas -->
    <path d="M 48,44 Q 52,42 56,44" fill="none" stroke="${palette.hair}" stroke-width="1" stroke-linecap="round"/>
    <path d="M 64,44 Q 68,42 72,44" fill="none" stroke="${palette.hair}" stroke-width="1" stroke-linecap="round"/>
    
    <!-- Nariz -->
    <path d="M 60,48 L 60,58" stroke="${palette.outline}" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
    
    <!-- Boca -->
    <path d="M 55,60 Q 60,63 65,60" fill="none" stroke="${palette.outline}" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    
    <!-- Armadura/Pecho épica -->
    <path d="M 40,70 L 60,65 L 80,70 L 80,90 Q 60,95 40,90 Z" 
          fill="url(#armorGrad)" stroke="${palette.armor}" stroke-width="2"/>
    
    <!-- Detalles de armadura -->
    <circle cx="60" cy="78" r="4" fill="none" stroke="${classStyle.color}" stroke-width="1" opacity="0.7"/>
    <line x1="55" y1="85" x2="65" y2="85" stroke="${palette.armor}" stroke-width="1" opacity="0.5"/>
    
    <!-- Cuello/Capa -->
    <ellipse cx="60" cy="65" rx="15" ry="8" fill="${palette.outline}" opacity="0.4"/>
    
    <!-- Badge de clase -->
    <circle cx="60" cy="12" r="8" fill="${classStyle.color}" stroke="white" stroke-width="1.5" opacity="0.9"/>
    <text x="60" y="15" text-anchor="middle" font-size="12" fill="white" font-weight="bold" opacity="0.9">${classStyle.crest}</text>
    
    <!-- Etiqueta de raza -->
    <rect x="25" y="100" width="70" height="14" rx="3" fill="${palette.outline}" opacity="0.2" stroke="${palette.outline}" stroke-width="1"/>
    <text x="60" y="109" text-anchor="middle" font-size="11" font-weight="bold" fill="${palette.outline}">${race.substring(0, 12)}</text>
  `;
  
  avatarSvg.innerHTML = svg;
  avatarSvg.setAttribute('viewBox', '0 0 120 120');
}

// ==========================================
// RETRATO AI FANTASY D&D MEJORADO
// ==========================================
async function fetchAIPortrait(race, charClass) {
  const portraitImg = document.getElementById('aiPortrait');
  if (!portraitImg) return;
  
  portraitImg.src = "https://placehold.co/180x220/667eea/ffffff?text=Generando...";
  portraitImg.alt = "Generando retrato...";
  
  // Prompts específicos por combinación raza/clase
  const specificPrompts = {
    'Mago-Humano': 'human wizard with blue robes magical aura fantasy dnd art',
    'Mago-Elfo': 'elven mage with arcane symbols long hair fantasy dnd',
    'Guerrero-Humano': 'human knight with armor and sword medieval fantasy dnd',
    'Guerrero-Enano': 'dwarf warrior with axe and beard fantasy dnd art',
    'Pícaro-Mediano': 'halfling rogue with daggers sneaky expression dnd fantasy',
    'Pícaro-Elfo': 'elven rogue with bow dark leather armor fantasy dnd',
    'Clérigo-Humano': 'human priest with holy symbol divine aura dnd fantasy',
    'Paladín-Humano': 'human paladin with golden armor holy sword dnd art',
    'Bárbaro-Orco': 'orc barbarian with massive axe fierce dnd fantasy',
    'Druida-Elfo': 'elven druid with animal companion mystical dnd art',
    'Tiefling-Brujo': 'tiefling warlock with dark magic red skin dnd fantasy'
  };
  
  const promptKey = `${charClass}-${race}`;
  const prompt = specificPrompts[promptKey] || 
                 `${race} ${charClass} fantasy dungeons and dragons character portrait detailed epic art`;
  
  // API 1: Lexica.art con prompt mejorado
  try {
    const encodedPrompt = encodeURIComponent(prompt);
    const res = await fetch(`https://lexica.art/api/v1/search?q=${encodedPrompt}`);
    if (res.ok) {
      const data = await res.json();
      if (data.images && data.images.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(data.images.length, 20));
        portraitImg.src = data.images[randomIndex].src;
        portraitImg.alt = `${race} ${charClass} - D&D Fantasy Art`;
        console.log('✅ Retrato D&D cargado desde Lexica.art');
        return;
      }
    }
  } catch(e) {
    console.warn('Lexica.art falló, intentando siguiente API...');
  }
  
  // API 2: DiceBear con estilo fantasy
  try {
    const styles = ['avataaars', 'adventurer', 'big-ears'];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const seed = encodeURIComponent(`${race}-${charClass}-dnd-${Date.now()}`);
    const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=667eea&scale=85`;
    
    const testRes = await fetch(avatarUrl);
    if (testRes.ok) {
      portraitImg.src = avatarUrl;
      portraitImg.alt = `${race} ${charClass} - Avatar Fantasy`;
      console.log('✅ Avatar fantasy generado desde DiceBear');
      return;
    }
  } catch(e) {
    console.warn('DiceBear falló, usando placeholder...');
  }
  
  // API 3: Fallback con estilo D&D
  try {
    const classEmojis = {
      'Mago': '✨', 'Guerrero': '⚔️', 'Pícaro': '🗡️', 'Clérigo': '✞',
      'Paladín': '✦', 'Bardo': '🎵', 'Bárbaro': '🔥', 'Druida': '🌿',
      'Monje': '☯️', 'Explorador': '🏹', 'Hechicero': '⚡', 'Brujo': '🌙'
    };
    
    const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(race + ' ' + charClass)}&size=180&background=667eea&color=fff&bold=true&fontSize=0.4&format=svg`;
    
    portraitImg.src = placeholderUrl;
    portraitImg.alt = `${race} ${charClass} - D&D`;
    console.log('✅ Placeholder D&D generado');
  } catch(error) {
    console.error('Error en todas las APIs:', error);
    portraitImg.src = "https://placehold.co/180x220/8b4513/ffd700?text=⚔️+D%26D";
    portraitImg.alt = "D&D Character";
  }
}

function regeneratePortrait() {
  if (!currentCharacter) {
    alert('Primero genera un personaje');
    return;
  }
  fetchAIPortrait(currentCharacter.race, currentCharacter.class);
}

// ==========================================
// POWER LEVEL
// ==========================================
function updatePowerLevel(stats) {
  const powerBar = document.getElementById('powerBar');
  const powerLevel = document.getElementById('powerLevel');
  if (!powerBar || !powerLevel) return;
  
  const avg = Object.values(stats).reduce((a,b)=>a+b,0)/6;
  let lvl = "⭐ Novato";
  let gradient = "linear-gradient(90deg,#eeeeda,#b89560)";
  
  if(avg > 16){
    lvl="⭐⭐⭐⭐⭐ Legendario";
    gradient="linear-gradient(90deg,#ffefd6,gold)";
  } else if(avg>=14){
    lvl="⭐⭐⭐⭐ Épico";
    gradient="linear-gradient(90deg,#fff0c0,#d89341)";
  } else if(avg>=12){
    lvl="⭐⭐⭐ Heroico";
    gradient="linear-gradient(90deg,#f8e9c0 65%,#b89560)";
  } else if(avg>=10){
    lvl="⭐⭐ Promedio";
    gradient="linear-gradient(90deg,#ece7bc,#caa87a)";
  }
  
  powerLevel.textContent = lvl;
  powerBar.style.background = gradient;
}

// ==========================================
// MOSTRAR PERSONAJE
// ==========================================
function displayCharacter(character) {
  currentCharacter = character;
  
  // Info básica
  document.getElementById('displayName').textContent = character.name;
  document.getElementById('displayRace').textContent = character.race;
  document.getElementById('displayClass').textContent = character.class;
  document.getElementById('displayLevel').textContent = character.level;
  document.getElementById('displayBackground').textContent = character.background;
  document.getElementById('displayAlignment').textContent = character.alignment;
  
  // Stats
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
    .map(item => `<li>• ${item}</li>`).join('');
  
  // Trasfondo
  document.getElementById('backgroundName').textContent = character.background;
  document.getElementById('backgroundSkills').textContent = character.backgroundData.skills.join(', ');
  document.getElementById('backgroundFeature').textContent = character.backgroundData.feature;
  document.getElementById('backgroundEquipment').innerHTML = character.backgroundData.equipment
    .map(item => `<li>• ${item}</li>`).join('');
  
  // Rasgos raciales
  document.getElementById('racialTraits').innerHTML = character.racialTraits
    .map(trait => `<li>• ${trait}</li>`).join('');
  
  // Competencias de clase
  document.getElementById('classProficiencies').innerHTML = character.classProficiencies
    .map(prof => `<li>• ${prof}</li>`).join('');
  
  // Características de clase
  document.getElementById('classFeatures').innerHTML = character.classFeatures
    .map(feature => `<li>• ${feature}</li>`).join('');
  
  // Power Level
  updatePowerLevel(character.stats);
  
  // Avatar y Retrato AI
  drawAvatar(character.name, character.race, character.class);
  fetchAIPortrait(character.race, character.class);
  
  // Mostrar ficha
  document.getElementById('characterSheet').classList.remove('hidden');
  document.getElementById('characterSheet').scrollIntoView({ behavior: 'smooth' });
  
  // Guardar en historial
  saveToHistory(character);
}

// ==========================================
// POBLAR SELECTORES
// ==========================================
function populateSelects() {
  const raceSelect = document.getElementById('raceSelect');
  const classSelect = document.getElementById('classSelect');
  const backgroundSelect = document.getElementById('backgroundSelect');
  const alignmentSelect = document.getElementById('alignmentSelect');
  
  Object.keys(DND_DATA.races).forEach(race => {
    const option = document.createElement('option');
    option.value = race;
    option.textContent = race;
    raceSelect.appendChild(option);
  });
  
  Object.keys(DND_DATA.classes).forEach(cls => {
    const option = document.createElement('option');
    option.value = cls;
    option.textContent = cls;
    classSelect.appendChild(option);
  });
  
  Object.keys(DND_DATA.backgrounds).forEach(bg => {
    const option = document.createElement('option');
    option.value = bg;
    option.textContent = bg;
    backgroundSelect.appendChild(option);
  });
  
  DND_DATA.alignments.forEach(align => {
    const option = document.createElement('option');
    option.value = align;
    option.textContent = align;
    alignmentSelect.appendChild(option);
  });
}

// ==========================================
// HISTORIAL
// ==========================================
function saveToHistory(character) {
  let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  history.unshift({
    ...character,
    savedAt: new Date().toISOString()
  });
  history = history.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function loadHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function showHistory() {
  const history = loadHistory();
  const modal = document.getElementById('historyModal');
  const list = document.getElementById('historyList');
  
  if(history.length === 0) {
    list.innerHTML = '<p>No hay personajes guardados.</p>';
  } else {
    list.innerHTML = history.map((char, index) => `
      <div class="history-item" onclick="loadCharacterFromHistory(${index})">
        <h4>${char.name}</h4>
        <p>${char.race} ${char.class} - Nivel ${char.level}</p>
        <small>${new Date(char.savedAt).toLocaleString()}</small>
      </div>
    `).join('');
  }
  
  modal.classList.remove('hidden');
}

function loadCharacterFromHistory(index) {
  const history = loadHistory();
  const character = history[index];
  delete character.savedAt;
  displayCharacter(character);
  document.getElementById('historyModal').classList.add('hidden');
}

// ==========================================
// EXPORT/IMPORT JSON
// ==========================================
function exportJSON() {
  if(!currentCharacter) {
    alert('Primero genera un personaje');
    return;
  }
  
  const dataStr = JSON.stringify(currentCharacter, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentCharacter.name.replace(/\s/g, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON() {
  const input = document.getElementById('fileImport');
  const file = input.files[0];
  if(!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const character = JSON.parse(e.target.result);
      displayCharacter(character);
      alert('Personaje importado correctamente');
    } catch(err) {
      alert('Error al importar: archivo JSON inválido');
    }
  };
  reader.readAsText(file);
  input.value = '';
}

// ==========================================
// MINTEAR NFT
// ==========================================
async function mintNFT() {
  if(!currentCharacter) {
    alert('Primero genera un personaje');
    return;
  }
  
  if(!window.ethereum) {
    alert('Necesitas Metamask instalada\n\nDescárgala desde: https://metamask.io');
    return;
  }
  
  try {
    const svgData = document.getElementById("charAvatar").outerHTML;
    const svg64 = btoa(unescape(encodeURIComponent(svgData)));
    const image = `data:image/svg+xml;base64,${svg64}`;
    
    const metadata = {
      name: currentCharacter.name,
      description: `Personaje D&D: ${currentCharacter.race} ${currentCharacter.class}`,
      image,
      attributes: [
        { trait_type: "Raza", value: currentCharacter.race },
        { trait_type: "Clase", value: currentCharacter.class },
        { trait_type: "Nivel", value: currentCharacter.level },
        { trait_type: "Fuerza", value: currentCharacter.stats.strength },
        { trait_type: "Destreza", value: currentCharacter.stats.dexterity },
        { trait_type: "Constitución", value: currentCharacter.stats.constitution },
        { trait_type: "Inteligencia", value: currentCharacter.stats.intelligence },
        { trait_type: "Sabiduría", value: currentCharacter.stats.wisdom },
        { trait_type: "Carisma", value: currentCharacter.stats.charisma }
      ]
    };
    
    const jsonB64 = btoa(unescape(encodeURIComponent(JSON.stringify(metadata))));
    const tokenURI = `data:application/json;base64,${jsonB64}`;
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, signer);
    
    const tx = await contract.safeMint(await signer.getAddress(), tokenURI);
    alert(`NFT minteado en testnet!\n\nHash: ${tx.hash}\n\nPuedes verlo en testnets.opensea.io`);
    
  } catch(err) {
    console.error(err);
    alert('Error al mintear NFT: ' + (err.message || err));
  }
}

// ==========================================
// MODO OSCURO
// ==========================================
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// ==========================================
// GENERAR PDF
// ==========================================
async function generatePDF() {
  if (!currentCharacter) {
    alert('Primero genera un personaje');
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  let y = 20;
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(102, 126, 234);
  doc.text(currentCharacter.name, 105, y, { align: 'center' });
  
  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(118, 75, 162);
  doc.text(`${currentCharacter.race} ${currentCharacter.class} - Nivel ${currentCharacter.level}`, 105, y, { align: 'center' });
  
  y += 15;
  doc.setLineWidth(0.5);
  doc.setDrawColor(102, 126, 234);
  doc.line(20, y, 190, y);
  
  // Stats
  y += 15;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('CARACTERÍSTICAS', 20, y);
  
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
    doc.text(`${name}: ${value} (${mod >= 0 ? '+' : ''}${mod})`, x, y);
    x += 30;
  });
  
  y += 15;
  doc.text(`HP: ${currentCharacter.hp} | CA: ${currentCharacter.ac} | Velocidad: ${currentCharacter.speed} ft`, 20, y);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generado en D&D Character Forge', 105, 285, { align: 'center' });
  
  doc.save(`${currentCharacter.name.replace(/\s/g, '_')}.pdf`);
}

// ==========================================
// EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  populateSelects();
  
  // Cargar modo oscuro
  if(localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
  
  // Generar aleatorio
  document.getElementById('randomBtn').addEventListener('click', () => {
    const character = generateCharacter();
    displayCharacter(character);
  });
  
  // Toggle panel personalizado
  document.getElementById('toggleCustom').addEventListener('click', () => {
    document.getElementById('customPanel').classList.toggle('hidden');
  });
  
  // Generar personalizado
  document.getElementById('customGenerateBtn').addEventListener('click', () => {
    const customData = {
      name: document.getElementById('charName').value,
      race: document.getElementById('raceSelect').value,
      class: document.getElementById('classSelect').value,
      background: document.getElementById('backgroundSelect').value,
      alignment: document.getElementById('alignmentSelect').value
    };
    
    const character = generateCharacter(customData);
    displayCharacter(character);
  });
  
  // Botones de ficha
  document.getElementById('downloadBtn').addEventListener('click', generatePDF);
  document.getElementById('mintNFTBtn').addEventListener('click', mintNFT);
  document.getElementById('exportJSONBtn').addEventListener('click', exportJSON);
  document.getElementById('importJSONBtn').addEventListener('click', () => {
    document.getElementById('fileImport').click();
  });
  document.getElementById('fileImport').addEventListener('change', importJSON);
  document.getElementById('historyBtn').addEventListener('click', showHistory);
  document.getElementById('newCharBtn').addEventListener('click', () => {
    document.getElementById('characterSheet').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Regenerar retrato
  document.getElementById('regenPortrait').addEventListener('click', regeneratePortrait);
  
  // Compartir
  document.getElementById('shareBtn').addEventListener('click', () => {
    if (!currentCharacter) return;
    
    const shareText = `¡He creado un personaje D&D!\n\n${currentCharacter.name}\n${currentCharacter.race} ${currentCharacter.class}\n\nCrea el tuyo en: https://jcazorla90.github.io/dnd-nft-generator/`;
    
    if (navigator.share) {
      navigator.share({ title: 'Mi personaje D&D', text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('¡Texto copiado al portapapeles!');
    }
  });
  
  // Modo oscuro
  document.getElementById('toggleTheme').addEventListener('click', toggleDarkMode);
  
  // Cerrar modal
  document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('historyModal').classList.add('hidden');
  });
  
  // Atajos de teclado
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      document.getElementById('randomBtn').click();
    }
  });
});

// Función global para historial
window.loadCharacterFromHistory = loadCharacterFromHistory;
