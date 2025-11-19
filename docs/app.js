// ==========================================
// ESTADO GLOBAL Y CONFIGURACIÓN
// ==========================================
let currentCharacter = null;
let currentEdition = '5e'; // Nueva: versión de D&D activa
const STORAGE_KEY = 'dnd_character_history';

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
}

function generateRandomName(race, charClass) {
  const names = {
    'Humano': ['Aric Valorheart', 'Brendan Stormborn', 'Cassandra Moonshadow', 'Diana Ironforge', 'Erik Dragonbane', 'Fiona Lightbringer'],
    'Elfo': ['Aelrindel Starweaver', 'Eldacar Moonwhisper', 'Galadriel Silvermoon', 'Legolas Greenleaf', 'Thranduil Oakenshield'],
    'Enano': ['Balin Ironhelm', 'Dwalin Stonebreaker', 'Thorin Oakenshield', 'Gimli Axebearer', 'Bruenor Battlehammer'],
    'Orco': ['Grunk Skullcrusher', 'Thrak Bloodfist', 'Urgak Bonegrinder', 'Mog the Terrible'],
    'Mediano': ['Bilbo Baggins', 'Frodo Underhill', 'Samwise Gamgee', 'Pippin Took', 'Merry Brandybuck'],
    'Tiefling': ['Akta Hellborn', 'Damakos Nightfire', 'Iados Darkflame', 'Kairon Shadowhorn'],
    'Dracónido': ['Arjhan Firebreath', 'Balasar Dragonheart', 'Donaar Scalebane', 'Heskan Wyrmclaw']
  };
  
  return randomFromArray(names[race] || names['Humano']);
}

function formatProficiencies(prof) {
  const parts = [];
  if (prof.armor && prof.armor.length) parts.push(`Armaduras: ${prof.armor.join(', ')}`);
  if (prof.weapons && prof.weapons.length) parts.push(`Armas: ${prof.weapons.join(', ')}`);
  if (prof.tools && prof.tools.length) parts.push(`Herramientas: ${prof.tools.join(', ')}`);
  return parts;
}

// ==========================================
// AVATAR SVG ÉPICO Y DETALLADO
// ==========================================
function drawAvatar(name, race, charClass) {
  const avatarSvg = document.getElementById('charAvatar');
  if (!avatarSvg) return;

  // Estilos artísticos detallados por clase
  const classArt = {
    'Guerrero': `
      <!-- Casco de caballero detallado -->
      <defs>
        <radialGradient id="metalShine">
          <stop offset="0%" stop-color="#e8e8e8"/>
          <stop offset="50%" stop-color="#969696"/>
          <stop offset="100%" stop-color="#4a4a4a"/>
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="28" rx="26" ry="24" fill="url(#metalShine)" stroke="#2a2a2a" stroke-width="2"/>
      <rect x="48" y="35" width="24" height="8" rx="2" fill="#3a3a3a"/>
      <path d="M 45,28 L 40,22 L 43,26" fill="#d4d4d4" stroke="#2a2a2a" stroke-width="1"/>
      <path d="M 75,28 L 80,22 L 77,26" fill="#d4d4d4" stroke="#2a2a2a" stroke-width="1"/>
      <!-- Armadura de placas -->
      <path d="M 38,48 L 60,44 L 82,48 L 82,90 L 60,95 L 38,90 Z" fill="url(#metalShine)" stroke="#2a2a2a" stroke-width="2"/>
      <circle cx="60" cy="65" r="8" fill="#c0c0c0" stroke="#2a2a2a" stroke-width="1"/>
      <line x1="60" y1="55" x2="60" y2="80" stroke="#e8e8e8" stroke-width="2"/>
      <line x1="50" y1="65" x2="70" y2="65" stroke="#e8e8e8" stroke-width="2"/>
      <!-- Espada en fondo -->
      <path d="M 85,60 L 105,30 L 108,33 L 88,63" fill="#d4d4d4" stroke="#2a2a2a" stroke-width="2"/>
    `,
    'Mago': `
      <!-- Sombrero de mago épico -->
      <defs>
        <linearGradient id="magicGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6a5acd"/>
          <stop offset="100%" stop-color="#483d8b"/>
        </linearGradient>
      </defs>
      <path d="M 60,8 L 48,38 L 72,38 Z" fill="url(#magicGlow)" stroke="#2e1f5e" stroke-width="2"/>
      <ellipse cx="60" cy="38" rx="14" ry="5" fill="url(#magicGlow)" stroke="#2e1f5e" stroke-width="1"/>
      <circle cx="60" cy="20" r="3" fill="#ffd700" opacity="0.8">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
      </circle>
      <!-- Túnica con símbolos arcanos -->
      <path d="M 35,45 L 60,40 L 85,45 L 85,92 L 35,92 Z" fill="url(#magicGlow)" stroke="#2e1f5e" stroke-width="2"/>
      <circle cx="50" cy="60" r="3" fill="#ffd700" opacity="0.6"/>
      <circle cx="70" cy="65" r="3" fill="#ffd700" opacity="0.6"/>
      <circle cx="60" cy="75" r="3" fill="#ffd700" opacity="0.6"/>
      <path d="M 48,58 L 52,62 L 48,66" stroke="#ffd700" stroke-width="1" fill="none" opacity="0.7"/>
      <!-- Bastón mágico -->
      <line x1="80" y1="45" x2="95" y2="20" stroke="#8b4513" stroke-width="3"/>
      <circle cx="95" cy="18" r="6" fill="#9370db" stroke="#6a5acd" stroke-width="2">
        <animate attributeName="fill" values="#9370db;#ba55d3;#9370db" dur="3s" repeatCount="indefinite"/>
      </circle>
    `,
    'Pícaro': `
      <!-- Capucha misteriosa -->
      <path d="M 60,15 L 40,40 L 80,40 Z" fill="#1a1a1a" stroke="#0a0a0a" stroke-width="2"/>
      <ellipse cx="60" cy="35" rx="24" ry="18" fill="#1a1a1a" stroke="#0a0a0a" stroke-width="1"/>
      <!-- Rostro en sombra -->
      <ellipse cx="52" cy="32" rx="4" ry="5" fill="#ff4500" opacity="0.9"/>
      <ellipse cx="68" cy="32" rx="4" ry="5" fill="#ff4500" opacity="0.9"/>
      <path d="M 56,38 Q 60,40 64,38" stroke="#ff4500" stroke-width="1" fill="none" opacity="0.7"/>
      <!-- Armadura de cuero oscura -->
      <path d="M 38,45 L 60,42 L 82,45 L 82,88 L 38,88 Z" fill="#2d2d2d" stroke="#1a1a1a" stroke-width="2"/>
      <rect x="54" y="55" width="4" height="4" fill="#8b8b8b" rx="1"/>
      <rect x="60" y="62" width="4" height="4" fill="#8b8b8b" rx="1"/>
      <rect x="54" y="70" width="4" height="4" fill="#8b8b8b" rx="1"/>
      <!-- Dagas cruzadas -->
      <line x1="50" y1="75" x2="45" y2="85" stroke="#c0c0c0" stroke-width="2"/>
      <line x1="70" y1="75" x2="75" y2="85" stroke="#c0c0c0" stroke-width="2"/>
    `,
    'Clérigo': `
      <!-- Mitra sagrada -->
      <defs>
        <linearGradient id="holyGlow">
          <stop offset="0%" stop-color="#ffd700"/>
          <stop offset="100%" stop-color="#daa520"/>
        </linearGradient>
      </defs>
      <path d="M 52,12 L 60,5 L 68,12" fill="url(#holyGlow)" stroke="#b8860b" stroke-width="2"/>
      <ellipse cx="60" cy="14" rx="10" ry="5" fill="url(#holyGlow)" stroke="#b8860b" stroke-width="1"/>
      <circle cx="60" cy="10" r="3" fill="#ffffff" opacity="0.9">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </circle>
      <!-- Vestimentas sacerdotales -->
      <path d="M 32,42 L 60,38 L 88,42 L 88,92 L 32,92 Z" fill="#f5f5dc" stroke="#daa520" stroke-width="2"/>
      <!-- Cruz sagrada grande -->
      <g transform="translate(60,65)">
        <rect x="-2" y="-12" width="4" height="24" fill="url(#holyGlow)" rx="1"/>
        <rect x="-10" y="-2" width="20" height="4" fill="url(#holyGlow)" rx="1"/>
      </g>
      <!-- Aura divina -->
      <circle cx="60" cy="60" r="38" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.4" stroke-dasharray="5,5">
        <animate attributeName="r" values="38;42;38" dur="3s" repeatCount="indefinite"/>
      </circle>
    `,
    'Paladín': `
      <!-- Casco real dorado -->
      <ellipse cx="60" cy="28" rx="26" ry="24" fill="#ffd700" stroke="#b8860b" stroke-width="2"/>
      <circle cx="60" cy="22" r="7" fill="#ffffff" opacity="0.8"/>
      <path d="M 46,26 L 42,20" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>
      <path d="M 74,26 L 78,20" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>
      <!-- Armadura dorada completa -->
      <path d="M 36,46 L 60,42 L 84,46 L 84,92 L 36,92 Z" fill="#ffd700" stroke="#b8860b" stroke-width="2"/>
      <!-- Emblema del pecho -->
      <path d="M 50,58 L 60,50 L 70,58 L 70,75 L 50,75 Z" fill="#ff6b35" stroke="#b8860b" stroke-width="2"/>
      <circle cx="60" cy="65" r="6" fill="#ffffff" opacity="0.9"/>
      <!-- Aura sagrada expansiva -->
      <circle cx="60" cy="60" r="42" fill="none" stroke="#ffed4e" stroke-width="2" opacity="0.5" stroke-dasharray="8,4">
        <animate attributeName="r" values="40;45;40" dur="2s" repeatCount="indefinite"/>
      </circle>
    `,
    'Bárbaro': `
      <!-- Cabeza salvaje con cicatrices -->
      <circle cx="60" cy="35" r="24" fill="#d4a574" stroke="#8b6f47" stroke-width="2"/>
      <!-- Cabello/Barba salvaje -->
      <path d="M 40,30 Q 35,20 40,15" fill="#3d2817" stroke="#2a1a0f" stroke-width="1"/>
      <path d="M 80,30 Q 85,20 80,15" fill="#3d2817" stroke="#2a1a0f" stroke-width="1"/>
      <path d="M 50,45 Q 45,55 48,65" stroke="#3d2817" stroke-width="3" stroke-linecap="round"/>
      <path d="M 70,45 Q 75,55 72,65" stroke="#3d2817" stroke-width="3" stroke-linecap="round"/>
      <!-- Tatuajes tribales -->
      <path d="M 50,32 Q 55,28 60,32" stroke="#dc143c" stroke-width="2" fill="none"/>
      <circle cx="68" cy="35" r="2" fill="#dc143c"/>
      <!-- Torso musculoso -->
      <ellipse cx="60" cy="72" rx="28" ry="20" fill="#d4a574" stroke="#8b6f47" stroke-width="2"/>
      <path d="M 45,72 Q 50,68 55,72" stroke="#8b6f47" stroke-width="2" fill="none"/>
      <path d="M 65,72 Q 70,68 75,72" stroke="#8b6f47" stroke-width="2" fill="none"/>
      <!-- Hacha gigante -->
      <line x1="85" y1="70" x2="108" y2="45" stroke="#8b4513" stroke-width="5"/>
      <path d="M 105,40 L 115,35 L 115,50 L 105,45 Z" fill="#969696" stroke="#2a2a2a" stroke-width="2"/>
    `,
    'Druida': `
      <!-- Corona de hojas naturales -->
      <circle cx="60" cy="32" r="24" fill="#7cb342" stroke="#558b2f" stroke-width="2"/>
      <path d="M 45,28 Q 42,22 45,18" fill="#9ccc65" stroke="#689f38" stroke-width="1"/>
      <path d="M 55,25 Q 52,19 55,15" fill="#9ccc65" stroke="#689f38" stroke-width="1"/>
      <path d="M 65,25 Q 68,19 65,15" fill="#9ccc65" stroke="#689f38" stroke-width="1"/>
      <path d="M 75,28 Q 78,22 75,18" fill="#9ccc65" stroke="#689f38" stroke-width="1"/>
      <!-- Rostro sereno -->
      <ellipse cx="55" cy="32" rx="3" ry="4" fill="#558b2f"/>
      <ellipse cx="65" cy="32" rx="3" ry="4" fill="#558b2f"/>
      <!-- Túnica de lino natural -->
      <path d="M 36,45 L 60,42 L 84,45 L 84,92 L 36,92 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>
      <!-- Símbolos naturales -->
      <circle cx="50" cy="60" r="4" fill="#7cb342" opacity="0.8"/>
      <circle cx="70" cy="65" r="4" fill="#7cb342" opacity="0.8"/>
      <circle cx="60" cy="75" r="4" fill="#7cb342" opacity="0.8"/>
      <path d="M 48,58 L 52,62 M 68,63 L 72,67" stroke="#9ccc65" stroke-width="2"/>
      <!-- Bastón de madera con enredaderas -->
      <line x1="78" y1="50" x2="92" y2="25" stroke="#6d4c41" stroke-width="4"/>
      <path d="M 80,45 Q 85,40 90,35" stroke="#7cb342" stroke-width="2" fill="none"/>
    `,
    'Bardo': `
      <!-- Sombrero elegante con pluma -->
      <ellipse cx="60" cy="28" rx="26" ry="20" fill="#8b3a8b" stroke="#5a246b" stroke-width="2"/>
      <path d="M 70,20 Q 80,10 85,15" stroke="#ff6b9d" stroke-width="2" fill="none"/>
      <circle cx="85" cy="15" r="3" fill="#ff6b9d"/>
      <!-- Rostro carismático -->
      <ellipse cx="55" cy="32" rx="3" ry="4" fill="#2a1a3a"/>
      <ellipse cx="65" cy="32" rx="3" ry="4" fill="#2a1a3a"/>
      <path d="M 56,38 Q 60,42 64,38" stroke="#2a1a3a" stroke-width="1.5" fill="none"/>
      <!-- Ropa noble elegante -->
      <path d="M 32,45 L 60,40 L 88,45 L 88,92 L 32,92 Z" fill="#8b3a8b" stroke="#5a246b" stroke-width="2"/>
      <!-- Detalles dorados -->
      <line x1="45" y1="55" x2="45" y2="85" stroke="#ffd700" stroke-width="2"/>
      <line x1="75" y1="55" x2="75" y2="85" stroke="#ffd700" stroke-width="2"/>
      <!-- Laúd -->
      <ellipse cx="78" cy="70" rx="8" ry="12" fill="#d4a574" stroke="#8b6f47" stroke-width="2"/>
      <line x1="78" y1="58" x2="78" y2="68" stroke="#8b6f47" stroke-width="1"/>
      <circle cx="78" cy="70" r="4" fill="#4a4a4a"/>
    `,
    'Monje': `
      <!-- Cabeza rapada con símbolo -->
      <circle cx="60" cy="32" r="22" fill="#d4a574" stroke="#8b6f47" stroke-width="2"/>
      <circle cx="60" cy="28" r="5" fill="#ff8c00" opacity="0.7"/>
      <path d="M 60,23 L 60,33" stroke="#ff8c00" stroke-width="2"/>
      <path d="M 55,28 L 65,28" stroke="#ff8c00" stroke-width="2"/>
      <!-- Ojos serenos -->
      <ellipse cx="55" cy="34" rx="2" ry="3" fill="#2a1a0f"/>
      <ellipse cx="65" cy="34" rx="2" ry="3" fill="#2a1a0f"/>
      <!-- Túnica de monje -->
      <path d="M 35,48 L 60,44 L 85,48 L 85,92 L 35,92 Z" fill="#8b6914" stroke="#654321" stroke-width="2"/>
      <!-- Banda del cinturón -->
      <rect x="45" y="70" width="30" height="4" fill="#3d2817" rx="1"/>
      <!-- Símbolo espiritual en pecho -->
      <circle cx="60" cy="60" r="8" fill="none" stroke="#ff8c00" stroke-width="2"/>
      <circle cx="60" cy="60" r="3" fill="#ff8c00"/>
      <!-- Postura de meditación -->
      <path d="M 40,75 Q 35,80 40,85" stroke="#654321" stroke-width="2" fill="none"/>
      <path d="M 80,75 Q 85,80 80,85" stroke="#654321" stroke-width="2" fill="none"/>
    `,
    'Explorador': `
      <!-- Capucha de cazador -->
      <path d="M 60,12 L 42,38 L 78,38 Z" fill="#5d4037" stroke="#3e2723" stroke-width="2"/>
      <ellipse cx="60" cy="35" rx="22" ry="16" fill="#5d4037" stroke="#3e2723" stroke-width="1"/>
      <!-- Rostro alerta -->
      <ellipse cx="55" cy="34" rx="3" ry="4" fill="#2a1a0f"/>
      <ellipse cx="65" cy="34" rx="3" ry="4" fill="#2a1a0f"/>
      <!-- Armadura de cuero reforzada -->
      <path d="M 36,45 L 60,42 L 84,45 L 84,88 L 36,88 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>
      <!-- Correas y bolsas -->
      <rect x="45" y="58" width="3" height="25" fill="#3e2723"/>
      <rect x="72" y="58" width="3" height="25" fill="#3e2723"/>
      <rect x="52" y="75" width="16" height="6" fill="#6d4c41" stroke="#3e2723" stroke-width="1"/>
      <!-- Arco largo -->
      <path d="M 80,50 Q 92,65 80,80" stroke="#6d4c41" stroke-width="3" fill="none"/>
      <line x1="85" y1="55" x2="85" y2="75" stroke="#daa520" stroke-width="1"/>
      <!-- Flecha -->
      <line x1="85" y1="65" x2="95" y2="65" stroke="#8b6f47" stroke-width="2"/>
      <path d="M 95,65 L 98,62 L 98,68 Z" fill="#969696"/>
    `,
    'Brujo': `
      <!-- Capucha oscura con cuernos -->
      <ellipse cx="60" cy="32" rx="24" ry="22" fill="#1a0033" stroke="#0a0019" stroke-width="2"/>
      <path d="M 48,28 Q 45,18 42,22" stroke="#8b008b" stroke-width="2"/>
      <path d="M 72,28 Q 75,18 78,22" stroke="#8b008b" stroke-width="2"/>
      <!-- Ojos brillantes siniestros -->
      <ellipse cx="55" cy="32" rx="4" ry="5" fill="#9370db" opacity="0.9">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="65" cy="32" rx="4" ry="5" fill="#9370db" opacity="0.9">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </ellipse>
      <!-- Túnica oscura de pacto -->
      <path d="M 32,45 L 60,40 L 88,45 L 88,92 L 32,92 Z" fill="#2d0a4e" stroke="#1a0033" stroke-width="2"/>
      <!-- Símbolos de pacto oscuro -->
      <circle cx="48" cy="62" r="3" fill="#9370db" opacity="0.8"/>
      <circle cx="72" cy="62" r="3" fill="#9370db" opacity="0.8"/>
      <circle cx="60" cy="75" r="3" fill="#9370db" opacity="0.8"/>
      <path d="M 48,60 L 52,64 L 48,68" stroke="#ba55d3" stroke-width="1" fill="none"/>
      <!-- Aura oscura pulsante -->
      <circle cx="60" cy="60" r="36" fill="none" stroke="#8b008b" stroke-width="2" opacity="0.5" stroke-dasharray="4,4">
        <animate attributeName="r" values="34;38;34" dur="2.5s" repeatCount="indefinite"/>
      </circle>
    `,
    'Hechicero': `
      <!-- Cabello con energía arcana -->
      <ellipse cx="60" cy="32" rx="24" ry="22" fill="#4b0082" stroke="#2d0052" stroke-width="2"/>
      <path d="M 48,28 Q 45,18 48,24" stroke="#9370db" stroke-width="2">
        <animate attributeName="d" values="M 48,28 Q 45,18 48,24;M 48,28 Q 42,16 48,24;M 48,28 Q 45,18 48,24" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M 72,28 Q 75,18 72,24" stroke="#9370db" stroke-width="2">
        <animate attributeName="d" values="M 72,28 Q 75,18 72,24;M 72,28 Q 78,16 72,24;M 72,28 Q 75,18 72,24" dur="2s" repeatCount="indefinite"/>
      </path>
      <!-- Ojos brillantes mágicos -->
      <ellipse cx="55" cy="34" rx="3" ry="4" fill="#ba55d3" opacity="0.9"/>
      <ellipse cx="65" cy="34" rx="3" ry="4" fill="#ba55d3" opacity="0.9"/>
      <!-- Túnica de poder innato -->
      <path d="M 35,45 L 60,40 L 85,45 L 85,92 L 35,92 Z" fill="#663399" stroke="#4b0082" stroke-width="2"/>
      <!-- Energía mágica que brota -->
      <circle cx="42" cy="55" r="3" fill="#9370db" opacity="0.8">
        <animate attributeName="cy" values="55;50;55" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="78" cy="55" r="3" fill="#9370db" opacity="0.8">
        <animate attributeName="cy" values="55;50;55" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="60" cy="72" r="3" fill="#9370db" opacity="0.8"/>
      <!-- Aura de magia salvaje -->
      <circle cx="60" cy="60" r="38" fill="none" stroke="#ba55d3" stroke-width="2" opacity="0.6">
        <animate attributeName="r" values="36;42;36" dur="2s" repeatCount="indefinite"/>
      </circle>
    `
  };

  const raceColors = {
    'Humano': '#d4a574',
    'Elfo': '#c8b5a0',
    'Enano': '#a8926a',
    'Mediano': '#e8d4b8',
    'Orco': '#7a9a5a',
    'Tiefling': '#d4a8c8',
    'Dracónido': '#d4c747',
    'Gnomo': '#e8c4a0',
    'Semielfo': '#d8c4a8',
    'Semiorco': '#8aaa7a'
  };

  const artwork = classArt[charClass] || classArt['Guerrero'];
  const skinColor = raceColors[race] || raceColors['Humano'];

  const svg = `
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Fondo pergamino -->
    <circle cx="60" cy="60" r="58" fill="#f4e9d8" stroke="#8b7355" stroke-width="3" opacity="0.3"/>
    
    <!-- Arte épico por clase -->
    ${artwork}
    
    <!-- Marco decorativo -->
    <circle cx="60" cy="60" r="58" fill="none" stroke="#8b7355" stroke-width="2" opacity="0.7"/>
    <circle cx="60" cy="60" r="56" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.5" stroke-dasharray="5,5"/>
    
    <!-- Etiqueta de clase -->
    <rect x="18" y="98" width="84" height="18" rx="4" fill="#1a1a1a" opacity="0.7"/>
    <text x="60" y="110" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffd700" font-family="'Georgia', serif">${charClass}</text>
  `;

  avatarSvg.innerHTML = svg;
  avatarSvg.setAttribute('viewBox', '0 0 120 120');
}

// ==========================================
// RETRATO IA ULTRA PROFESIONAL D&D
// ==========================================
async function fetchAIPortrait(race, charClass) {
  const portraitImg = document.getElementById('aiPortrait');
  if (!portraitImg) return;

  portraitImg.src = "https://placehold.co/180x220/3e2723/ffd700?text=⚔️+LOADING";
  portraitImg.alt = "Generando retrato épico...";

  // Prompts ULTRA específicos con estilos de artistas profesionales D&D
  const epicPrompts = {
    'Guerrero-Humano': 'human knight in full plate armor wielding longsword and shield, heroic pose, oil painting by Larry Elmore, dungeons and dragons fantasy art, epic medieval',
    'Guerrero-Enano': 'dwarf warrior with battleaxe massive beard ornate armor, realistic painting by Keith Parkinson, forgotten realms art style, fantasy dwarf',
    'Guerrero-Elfo': 'elven warrior elegant mithril armor graceful longsword, fine art by Todd Lockwood, high fantasy elf knight',
    
    'Mago-Humano': 'human wizard in blue robes casting arcane spell glowing hands staff, dramatic lighting by Clyde Caldwell, dungeons dragons magic art',
    'Mago-Elfo': 'elven archmage ancient spellbook mystical runes floating, epic fantasy art by Jeff Easley, high elf wizard',
    'Mago-Gnomo': 'gnome wizard with spectacles pointy hat magical laboratory, whimsical fantasy art style d&d',
    
    'Pícaro-Mediano': 'halfling rogue leather armor twin daggers sneaking shadows, dark fantasy by Wayne Reynolds, dungeons dragons thief',
    'Pícaro-Elfo': 'elven rogue dark hood bow arrows nimble pose, stealth art by Larry Elmore, fantasy assassin',
    'Pícaro-Humano': 'human assassin hooded cloak daggers mysterious shadows, noir fantasy art d&d rogue',
    
    'Clérigo-Humano': 'human cleric in holy vestments divine light blessing gesture, religious fantasy art by Keith Parkinson, d&d priest',
    'Clérigo-Enano': 'dwarf cleric war hammer holy symbol divine power, epic fantasy by Jeff Easley, battle cleric',
    
    'Paladín-Humano': 'human paladin shining golden plate armor holy avenger sword divine aura, heroic fantasy by Larry Elmore, righteous knight',
    'Paladín-Elfo': 'elven paladin celestial armor radiant sword divine champion, high fantasy art style d&d',
    'Paladín-Dracónido': 'dragonborn paladin scaled golden armor holy power breath weapon, epic d&d art',
    
    'Bárbaro-Humano': 'human barbarian muscular wielding greataxe battle rage tribal tattoos, savage fantasy by Wayne Reynolds, d&d warrior',
    'Bárbaro-Orco': 'orc barbarian tusks massive muscles brutal axe fierce expression, dark fantasy art dungeons dragons',
    'Bárbaro-Semiorco': 'half-orc barbarian powerful build rage tribal warrior, gritty fantasy by Keith Parkinson',
    
    'Druida-Humano': 'human druid nature magic green aura animal companions staff mystical, organic fantasy art d&d',
    'Druida-Elfo': 'elven druid forest communion wild shape deer companion, natural fantasy by Todd Lockwood',
    
    'Bardo-Humano': 'human bard elegant clothes lute magical performance charismatic, colorful fantasy art by Larry Elmore',
    'Bardo-Mediano': 'halfling bard cheerful musician instrument stage presence, whimsical d&d art',
    'Bardo-Semielfo': 'half-elf bard charismatic performer magical music, fantasy illustration style',
    
    'Monje-Humano': 'human monk martial arts robes meditation focused ki energy, spiritual fantasy art d&d',
    'Monje-Semielfo': 'half-elf monk oriental robes martial stance mystical energy, eastern fantasy dungeons dragons',
    
    'Explorador-Humano': 'human ranger wilderness gear longbow wolf companion tracking, adventure fantasy by Keith Parkinson',
    'Explorador-Elfo': 'elven ranger forest hunter bow animal companion hawk, nature fantasy art d&d',
    
    'Hechicero-Humano': 'human sorcerer wild magic draconic bloodline chaos energy, dramatic fantasy by Clyde Caldwell',
    'Hechicero-Tiefling': 'tiefling sorcerer red skin horns infernal magic fire, demonic fantasy art d&d',
    
    'Brujo-Humano': 'human warlock eldritch power dark pact mysterious entity, gothic fantasy by Wayne Reynolds',
    'Brujo-Tiefling': 'tiefling warlock horns tail dark magic sinister patron, infernal fantasy art dungeons dragons'
  };

  const key = `${charClass}-${race}`;
  const epicPrompt = epicPrompts[key] || 
    `${race} ${charClass} heroic fantasy character portrait, professional dungeons and dragons art style by Larry Elmore and Keith Parkinson, epic detailed`;

  console.log(`🎨 Buscando: ${epicPrompt}`);

  // Intentar Lexica con prompt épico
  try {
    const res = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(epicPrompt)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.images && data.images.length > 0) {
        const idx = Math.floor(Math.random() * Math.min(data.images.length, 12));
        portraitImg.src = data.images[idx].src;
        portraitImg.alt = `${race} ${charClass} - Epic D&D Art`;
        console.log('✅ Retrato épico D&D profesional cargado');
        return;
      }
    }
  } catch(e) {
    console.warn('⚠️ Lexica no disponible, intentando fallback...');
  }

  // Fallback: Avatar artístico
  try {
    const seed = encodeURIComponent(`${race}-${charClass}-fantasy-${Date.now()}`);
    const styles = ['avataaars', 'adventurer', 'big-smile', 'micah'];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=8b7355`;
    
    portraitImg.src = url;
    portraitImg.alt = `${race} ${charClass} - Fantasy Avatar`;
    console.log('✅ Avatar artístico D&D generado');
  } catch(e) {
    portraitImg.src = "https://placehold.co/180x220/3e2723/ffd700?text=⚔️+D%26D";
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
// CAMBIAR EDICIÓN D&D
// ==========================================
function changeEdition(edition) {
  currentEdition = edition;
  console.log(`📖 Edición cambiada a: ${edition}`);
  
  const editionSelect = document.getElementById('editionSelect');
  if (editionSelect) {
    editionSelect.value = edition;
  }
  
  // Notificar al usuario
  const versionNames = {
    '5e': 'D&D 5ta Edición',
    '3.5e': 'D&D 3.5 Edición',
    '4e': 'D&D 4ta Edición'
  };
  
  alert(`✅ Sistema cambiado a: ${versionNames[edition] || edition}\n\nGenerando personaje con reglas ${edition}...`);
}

// ... (continúa con displayCharacter, populateSelects, historial, etc. - mantén las funciones anteriores)

// ==========================================
// MOSTRAR PERSONAJE
// ==========================================
function displayCharacter(character) {
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
    document.getElementById(`mod${stat.id}`).textContent = 
      (modifier >= 0 ? '+' : '') + modifier;
  });
  
  document.getElementById('displayHP').textContent = character.hp;
  document.getElementById('displayAC').textContent = character.ac;
  document.getElementById('displaySpeed').textContent = `${character.speed} ft`;
  document.getElementById('displayInit').textContent = 
    (calculateModifier(character.stats.dexterity) >= 0 ? '+' : '') + 
    calculateModifier(character.stats.dexterity);
  
  document.getElementById('displaySavingThrows').textContent = 
    Array.isArray(character.savingThrows) ? character.savingThrows.join(', ') : character.savingThrows;
  document.getElementById('displaySkills').textContent = character.skills;
  
  document.getElementById('equipment').innerHTML = character.equipment
    .map(item => `<li>• ${item}</li>`).join('');
  
  document.getElementById('backgroundName').textContent = character.background;
  document.getElementById('backgroundSkills').textContent = character.backgroundData.skills.join(', ');
  document.getElementById('backgroundFeature').textContent = character.backgroundData.feature;
  document.getElementById('backgroundEquipment').innerHTML = character.backgroundData.equipment
    .map(item => `<li>• ${item}</li>`).join('');
  
  document.getElementById('racialTraits').innerHTML = character.racialTraits
    .map(trait => `<li>• ${trait}</li>`).join('');
  
  document.getElementById('classProficiencies').innerHTML = character.classProficiencies
    .map(prof => `<li>• ${prof}</li>`).join('');
  
  document.getElementById('classFeatures').innerHTML = character.classFeatures
    .map(feature => `<li>• ${feature}</li>`).join('');
  
  updatePowerLevel(character.stats);
  drawAvatar(character.name, character.race, character.class);
  fetchAIPortrait(character.race, character.class);
  
  document.getElementById('characterSheet').classList.remove('hidden');
  document.getElementById('characterSheet').scrollIntoView({ behavior: 'smooth' });
  
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
  const a = document.createElement('element');
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
// MINTEAR NFT (SIMULACIÓN)
// ==========================================
async function mintNFT() {
  if(!currentCharacter) {
    alert('Primero genera un personaje');
    return;
  }
  
  try {
    alert('🔄 Minteando NFT... (modo demo)');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const nftId = Math.floor(Math.random() * 1000000);
    const mockHash = '0x' + Math.random().toString(16).substr(2, 64);
    
    alert(
      `🎉 ¡NFT MINTEADO (DEMO)!\n\n` +
      `Personaje: ${currentCharacter.name}\n` +
      `Token ID: #${nftId}\n` +
      `Hash: ${mockHash}\n\n` +
      `⚠️ NOTA: Modo demostración.\n` +
      `Para mintear real, conecta Metamask a Sepolia testnet.`
    );
    
  } catch(err) {
    alert('❌ Error: ' + err.message);
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
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generado en D&D Character Forge', 105, 285, { align: 'center' });
  
  doc.save(`${currentCharacter.name.replace(/\s/g, '_')}.pdf`);
}
// ==========================================
// GENERADOR DE BESTIAS Y ENEMIGOS
// ==========================================
let currentCreature = null;
let currentEncounter = [];

// Obtener criatura aleatoria
function getRandomCreature(filters = {}) {
  const creatures = Object.entries(DND_BESTIARY.creatures);
  let filtered = creatures;
  
  if (filters.type) {
    filtered = filtered.filter(([name, data]) => data.type === filters.type);
  }
  
  if (filters.cr) {
    filtered = filtered.filter(([name, data]) => data.cr === filters.cr);
  }
  
  if (filters.environment) {
    filtered = filtered.filter(([name, data]) => 
      data.environment && data.environment.includes(filters.environment)
    );
  }
  
  if (filtered.length === 0) return null;
  
  const [name, data] = randomFromArray(filtered);
  return { name, ...data };
}

// Generar criatura desde API oficial D&D 5e
async function generateCreatureFromAPI(index = null) {
  try {
    // Si no hay índice, obtener uno aleatorio
    if (!index) {
      const listRes = await fetch('https://www.dnd5eapi.co/api/monsters');
      const listData = await listRes.json();
      const randomMonster = randomFromArray(listData.results);
      index = randomMonster.index;
    }
    
    // Obtener detalles completos
    const res = await fetch(`https://www.dnd5eapi.co/api/monsters/${index}`);
    const data = await res.json();
    
    return {
      name: data.name,
      type: data.type,
      cr: data.challenge_rating,
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
      skills: Object.entries(data.proficiencies)
        .filter(([k, v]) => k.includes('skill'))
        .map(([k, v]) => v.proficiency.name),
      traits: data.special_abilities?.map(a => a.name) || [],
      actions: data.actions?.map(a => `${a.name}: ${a.desc}`) || [],
      legendaryActions: data.legendary_actions?.map(a => `${a.name}: ${a.desc}`) || [],
      immunities: data.damage_immunities || [],
      resistances: data.damage_resistances || [],
      vulnerabilities: data.damage_vulnerabilities || [],
      senses: data.senses,
      languages: data.languages || "—",
      xp: DND_BESTIARY.challengeRatings.find(cr => cr.cr == data.challenge_rating)?.xp || 0
    };
  } catch (error) {
    console.error('Error obteniendo criatura de API:', error);
    return getRandomCreature();
  }
}

// Generar imagen IA para criatura
async function fetchCreatureImage(creatureName, creatureType) {
  const portraitImg = document.getElementById('creaturePortrait');
  if (!portraitImg) return;
  
  portraitImg.src = "https://placehold.co/280x320/3e2723/ffd700?text=🐉+LOADING";
  
  const prompts = {
    // Aberraciones
    'Beholder': 'beholder floating eyeball tentacles dnd monster horror art, fantasy illustration',
    'Mind Flayer': 'mind flayer illithid tentacle face purple robes, dark fantasy dnd',
    
    // Dragones
    'Red Dragon': 'red dragon breathing fire scales wings, epic fantasy art by Todd Lockwood',
    'Black Dragon': 'black dragon acidic swamp creature, dark fantasy dnd art',
    'Ancient Dragon': 'ancient dragon enormous powerful majestic, legendary fantasy artwork',
    
    // No-muertos
    'Vampire': 'vampire aristocrat fangs pale skin elegant, gothic fantasy art dnd',
    'Lich': 'lich undead sorcerer phylactery glowing eyes, dark magic fantasy',
    'Skeleton': 'skeleton warrior undead bones armor sword, fantasy dnd monster',
    'Zombie': 'zombie undead rotting flesh horror, dark fantasy creature',
    
    // Demonios
    'Balor': 'balor demon fire wings whip sword enormous, abyssal fantasy art',
    'Demon': 'demon abyssal creature horns claws fire, dark fantasy dnd',
    
    // Gigantes
    'Ogre': 'ogre brutal giant club primitive, fantasy monster art dnd',
    'Troll': 'troll regenerating monster claws green skin, forest fantasy creature',
    'Giant': 'giant enormous humanoid powerful, epic fantasy artwork',
    
    // Bestias
    'Wolf': 'dire wolf predator fangs fur fierce, realistic fantasy beast',
    'Bear': 'dire bear massive claws powerful, nature fantasy creature',
    
    // Humanoides
    'Goblin': 'goblin sneaky green skin pointed ears, fantasy dnd monster',
    'Orc': 'orc warrior tusks brutal armor, savage fantasy art',
    
    // Monstruosidades
    'Hydra': 'hydra multiple heads serpent water, epic fantasy monster dnd',
    'Chimera': 'chimera lion goat dragon hybrid, mythical fantasy creature'
  };
  
  // Buscar prompt específico o genérico
  let prompt = prompts[creatureName];
  if (!prompt) {
    const typePrompts = {
      'Aberración': 'aberration horror creature tentacles eyes',
      'Bestia': 'beast animal predator wild',
      'Celestial': 'celestial angel divine wings light',
      'Constructo': 'construct golem magical animated',
      'Dragón': 'dragon scales wings fire breathing',
      'Elemental': 'elemental magic fire water earth air',
      'Feérico': 'fey fairy magical forest creature',
      'Demonio': 'fiend demon devil horns',
      'Gigante': 'giant enormous humanoid powerful',
      'Humanoide': 'humanoid warrior tribal',
      'Monstruosidad': 'monstrosity monster hybrid creature',
      'Cieno': 'ooze slime amorphous blob',
      'Planta': 'plant creature vine animated',
      'No-muerto': 'undead zombie skeleton horror'
    };
    prompt = `${creatureName} ${typePrompts[creatureType] || 'fantasy monster'} dungeons and dragons art`;
  }
  
  prompt += ' fantasy dnd monster manual art professional illustration';
  
  try {
    const res = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.images && data.images.length > 0) {
        const idx = Math.floor(Math.random() * Math.min(data.images.length, 10));
        portraitImg.src = data.images[idx].src;
        console.log(`✅ Imagen de ${creatureName} cargada`);
        return;
      }
    }
  } catch(e) {
    console.warn('Error cargando imagen de criatura');
  }
  
  // Fallback
  const monsterEmojis = {
    'Dragón': '🐉',
    'No-muerto': '💀',
    'Demonio': '😈',
    'Bestia': '🐺',
    'Aberración': '👁️',
    'Gigante': '🗿'
  };
  
  const emoji = monsterEmojis[creatureType] || '👹';
  portraitImg.src = `https://placehold.co/280x320/3e2723/ffd700?text=${encodeURIComponent(emoji + ' ' + creatureName)}`;
}

// Mostrar criatura en UI
function displayCreature(creature) {
  currentCreature = creature;
  
  document.getElementById('creatureName').textContent = creature.name;
  document.getElementById('creatureType').textContent = `${creature.size} ${creature.type}`;
  document.getElementById('creatureCR').textContent = `CR ${creature.cr}`;
  document.getElementById('creatureXP').textContent = `${creature.xp || '—'} XP`;
  
  // Stats de combate
  document.getElementById('creatureAC').textContent = creature.ac;
  document.getElementById('creatureHP').textContent = creature.hp;
  document.getElementById('creatureSpeed').textContent = creature.speed;
  
  // Características
  document.getElementById('creatureStr').textContent = `${creature.str} (${calculateModifier(creature.str) >= 0 ? '+' : ''}${calculateModifier(creature.str)})`;
  document.getElementById('creatureDex').textContent = `${creature.dex} (${calculateModifier(creature.dex) >= 0 ? '+' : ''}${calculateModifier(creature.dex)})`;
  document.getElementById('creatureCon').textContent = `${creature.con} (${calculateModifier(creature.con) >= 0 ? '+' : ''}${calculateModifier(creature.con)})`;
  document.getElementById('creatureInt').textContent = `${creature.int} (${calculateModifier(creature.int) >= 0 ? '+' : ''}${calculateModifier(creature.int)})`;
  document.getElementById('creatureWis').textContent = `${creature.wis} (${calculateModifier(creature.wis) >= 0 ? '+' : ''}${calculateModifier(creature.wis)})`;
  document.getElementById('creatureCha').textContent = `${creature.cha} (${calculateModifier(creature.cha) >= 0 ? '+' : ''}${calculateModifier(creature.cha)})`;
  
  // Habilidades y rasgos
  document.getElementById('creatureSkills').innerHTML = (creature.skills || [])
    .map(skill => `<li>• ${skill}</li>`).join('') || '<li>Ninguna</li>';
  
  document.getElementById('creatureTraits').innerHTML = (creature.traits || [])
    .map(trait => `<li>• ${trait}</li>`).join('') || '<li>Ninguno</li>';
  
  document.getElementById('creatureActions').innerHTML = (creature.actions || [])
    .map(action => `<li>• ${action}</li>`).join('') || '<li>Ninguna</li>';
  
  if (creature.legendaryActions && creature.legendaryActions.length > 0) {
    document.getElementById('creatureLegendaryActions').innerHTML = creature.legendaryActions
      .map(action => `<li>• ${action}</li>`).join('');
    document.getElementById('legendarySection').classList.remove('hidden');
  } else {
    document.getElementById('legendarySection').classList.add('hidden');
  }
  
  // Resistencias/Inmunidades
  const defensesHtml = [];
  if (creature.immunities && creature.immunities.length > 0) {
    defensesHtml.push(`<strong>Inmunidades:</strong> ${creature.immunities.join(', ')}`);
  }
  if (creature.resistances && creature.resistances.length > 0) {
    defensesHtml.push(`<strong>Resistencias:</strong> ${creature.resistances.join(', ')}`);
  }
  if (creature.vulnerabilities && creature.vulnerabilities.length > 0) {
    defensesHtml.push(`<strong>Vulnerabilidades:</strong> ${creature.vulnerabilities.join(', ')}`);
  }
  document.getElementById('creatureDefenses').innerHTML = defensesHtml.join('<br>') || 'Ninguna';
  
  // Ambiente
  if (creature.environment) {
    document.getElementById('creatureEnvironment').textContent = creature.environment.join(', ');
  }
  
  // Generar imagen
  fetchCreatureImage(creature.name, creature.type);
  
  // Mostrar panel
  document.getElementById('creatureSheet').classList.remove('hidden');
  document.getElementById('creatureSheet').scrollIntoView({ behavior: 'smooth' });
}

// Generar encuentro balanceado
function generateEncounter(partyLevel, partySize = 4) {
  const targetXP = partyLevel * partySize * 200; // XP aproximado por nivel
  let currentXP = 0;
  const encounter = [];
  
  while (currentXP < targetXP * 0.8) {
    const creature = getRandomCreature();
    if (!creature) break;
    
    const creatureXP = DND_BESTIARY.challengeRatings.find(cr => cr.cr == creature.cr)?.xp || 100;
    
    if (currentXP + creatureXP <= targetXP * 1.2) {
      encounter.push(creature);
      currentXP += creatureXP;
    }
  }
  
  currentEncounter = encounter;
  displayEncounter(encounter, currentXP);
}

function displayEncounter(encounter, totalXP) {
  const encounterList = document.getElementById('encounterList');
  encounterList.innerHTML = encounter.map((creature, idx) => `
    <div class="encounter-creature" onclick="displayCreature(currentEncounter[${idx}])">
      <h4>${creature.name}</h4>
      <p>${creature.type} - CR ${creature.cr}</p>
    </div>
  `).join('');
  
  document.getElementById('encounterXP').textContent = `${totalXP} XP total`;
  document.getElementById('encounterPanel').classList.remove('hidden');
}

// ==========================================
// EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  populateSelects();
  
  if(localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
  
  // Selector de edición
  const editionSelect = document.getElementById('editionSelect');
  if (editionSelect) {
    editionSelect.addEventListener('change', (e) => {
      changeEdition(e.target.value);
    });
  }
  
  document.getElementById('randomBtn').addEventListener('click', () => {
    const character = generateCharacter();
    displayCharacter(character);
  });
  
  document.getElementById('toggleCustom').addEventListener('click', () => {
    document.getElementById('customPanel').classList.toggle('hidden');
  });
  
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
  
  document.getElementById('regenPortrait').addEventListener('click', regeneratePortrait);
  
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
  
  document.getElementById('toggleTheme').addEventListener('click', toggleDarkMode);
  
  document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('historyModal').classList.add('hidden');
  });
  
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      document.getElementById('randomBtn').click();
    }
  });
});

window.loadCharacterFromHistory = loadCharacterFromHistory;
