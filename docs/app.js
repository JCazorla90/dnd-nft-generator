// ==========================================
// ESTADO GLOBAL Y CONFIGURACIÓN
// ==========================================
let currentCharacter = null;
const STORAGE_KEY = 'dnd_character_history';
const NFT_CONTRACT = "0x5FbDB2315678afccb333f8a9c6122f65991e6F61"; // Contrato demo Sepolia
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

/// ==========================================
// AVATAR SVG ÉPICO D&D PROFESIONAL
// ==========================================
function drawAvatar(name, race, charClass) {
  const avatarSvg = document.getElementById('charAvatar');
  if (!avatarSvg) return;

  // Estilos por CLASE (armaduras, armas, atuendos épicos)
  const classVisuals = {
    'Guerrero': {
      armor: `
        <g id="armor-guerrero">
          <!-- Casco medieval -->
          <ellipse cx="60" cy="32" rx="24" ry="20" fill="#696969" stroke="#2f2f2f" stroke-width="2"/>
          <rect x="48" y="40" width="24" height="6" fill="#696969" stroke="#2f2f2f" stroke-width="1"/>
          <!-- Visera -->
          <rect x="52" y="35" width="16" height="4" fill="#4a4a4a"/>
          <!-- Cuernos/Adornos -->
          <path d="M 48,32 L 42,25 L 45,30" fill="#c0c0c0" stroke="#696969" stroke-width="1"/>
          <path d="M 72,32 L 78,25 L 75,30" fill="#c0c0c0" stroke="#696969" stroke-width="1"/>
          <!-- Pecho de acero -->
          <path d="M 40,50 L 60,48 L 80,50 L 80,85 L 40,85 Z" fill="#8b8b8b" stroke="#4a4a4a" stroke-width="2"/>
          <!-- Cruz del pecho -->
          <line x1="60" y1="55" x2="60" y2="75" stroke="#c0c0c0" stroke-width="2"/>
          <line x1="50" y1="65" x2="70" y2="65" stroke="#c0c0c0" stroke-width="2"/>
        </g>
      `,
      weapon: '<line x1="80" y1="70" x2="95" y2="50" stroke="#8b4513" stroke-width="4" stroke-linecap="round"/>'
    },
    'Mago': {
      armor: `
        <g id="armor-mago">
          <!-- Sombrero de mago cónico -->
          <path d="M 60,15 L 50,35 L 70,35 Z" fill="#4169e1" stroke="#2d4d9e" stroke-width="2"/>
          <ellipse cx="60" cy="35" rx="12" ry="4" fill="#4169e1" stroke="#2d4d9e" stroke-width="1"/>
          <!-- Robe azul arcana -->
          <ellipse cx="60" cy="55" rx="28" ry="32" fill="#4169e1" stroke="#2d4d9e" stroke-width="2" opacity="0.9"/>
          <!-- Símbolos arcanos en robe -->
          <circle cx="50" cy="60" r="2" fill="#ffd700" opacity="0.7"/>
          <circle cx="70" cy="65" r="2" fill="#ffd700" opacity="0.7"/>
          <circle cx="60" cy="75" r="2" fill="#ffd700" opacity="0.7"/>
          <!-- Staff -->
          <line x1="75" y1="50" x2="85" y2="30" stroke="#8b4513" stroke-width="3" stroke-linecap="round"/>
          <circle cx="85" cy="28" r="5" fill="#ffd700" stroke="#c0c0c0" stroke-width="1"/>
        </g>
      `,
      weapon: '<circle cx="85" cy="28" r="5" fill="#ffd700" stroke="#c0c0c0" stroke-width="2"/>'
    },
    'Pícaro': {
      armor: `
        <g id="armor-picaro">
          <!-- Hood/Capucha oscura -->
          <ellipse cx="60" cy="35" rx="22" ry="24" fill="#1a1a1a" stroke="#0a0a0a" stroke-width="2"/>
          <!-- Ojos en sombra -->
          <circle cx="52" cy="32" r="3" fill="#ff6b35"/>
          <circle cx="68" cy="32" r="3" fill="#ff6b35"/>
          <!-- Armadura de cuero -->
          <path d="M 38,50 L 60,48 L 82,50 L 82,80 L 38,80 Z" fill="#2d2d2d" stroke="#1a1a1a" stroke-width="2"/>
          <!-- Hebillas de cuero -->
          <rect x="55" y="55" width="3" height="3" fill="#c0c0c0"/>
          <rect x="60" y="60" width="3" height="3" fill="#c0c0c0"/>
          <rect x="55" y="68" width="3" height="3" fill="#c0c0c0"/>
          <!-- Capas/Capa -->
          <path d="M 45,50 Q 35,70 40,85" fill="none" stroke="#1a1a1a" stroke-width="3" opacity="0.6"/>
          <path d="M 75,50 Q 85,70 80,85" fill="none" stroke="#1a1a1a" stroke-width="3" opacity="0.6"/>
        </g>
      `,
      weapon: '<path d="M 80,65 L 95,55" stroke="#c0c0c0" stroke-width="3" stroke-linecap="round"/>'
    },
    'Clérigo': {
      armor: `
        <g id="armor-clerigo">
          <!-- Mitra/Corona sagrada -->
          <path d="M 55,18 L 60,10 L 65,18" fill="#daa520" stroke="#b8860b" stroke-width="2"/>
          <ellipse cx="60" cy="20" rx="8" ry="5" fill="#daa520" stroke="#b8860b" stroke-width="1"/>
          <!-- Ropa sagrada blanca -->
          <path d="M 35,45 L 60,40 L 85,45 L 85,85 L 35,85 Z" fill="#f5f5dc" stroke="#daa520" stroke-width="2"/>
          <!-- Cruz dorada del pecho -->
          <g transform="translate(60,65)">
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#daa520" stroke-width="3" stroke-linecap="round"/>
            <line x1="-6" y1="0" x2="6" y2="0" stroke="#daa520" stroke-width="3" stroke-linecap="round"/>
          </g>
          <!-- Símbolo divino -->
          <circle cx="60" cy="50" r="4" fill="#daa520" opacity="0.6"/>
        </g>
      `,
      weapon: '<path d="M 75,70 L 90,40" stroke="#daa520" stroke-width="2" stroke-linecap="round"/>'
    },
    'Paladín': {
      armor: `
        <g id="armor-paladin">
          <!-- Casco de oro reluciente -->
          <ellipse cx="60" cy="32" rx="24" ry="22" fill="#ffd700" stroke="#b8860b" stroke-width="2"/>
          <circle cx="60" cy="25" r="6" fill="#ffed4e" opacity="0.7"/>
          <!-- Armadura dorada completa -->
          <path d="M 38,48 L 60,45 L 82,48 L 82,85 L 38,85 Z" fill="#ffd700" stroke="#b8860b" stroke-width="2"/>
          <!-- Escudo del pecho -->
          <path d="M 50,60 L 60,52 L 70,60 L 70,75 L 50,75 Z" fill="#ff6b35" stroke="#b8860b" stroke-width="1"/>
          <!-- Aura sagrada -->
          <circle cx="60" cy="60" r="35" fill="none" stroke="#ffed4e" stroke-width="1" stroke-dasharray="5,5" opacity="0.4"/>
        </g>
      `,
      weapon: '<path d="M 75,65 L 98,30" stroke="#ffd700" stroke-width="3" stroke-linecap="round"/>'
    },
    'Bárbaro': {
      armor: `
        <g id="armor-barbaro">
          <!-- Cabello/Barba salvaje -->
          <ellipse cx="60" cy="30" rx="26" ry="22" fill="#654321" stroke="#3d2817" stroke-width="2"/>
          <path d="M 50,40 Q 45,50 48,60" fill="none" stroke="#654321" stroke-width="2" opacity="0.7"/>
          <path d="M 70,40 Q 75,50 72,60" fill="none" stroke="#654321" stroke-width="2" opacity="0.7"/>
          <!-- Pecho desnudo/Tatuajes -->
          <ellipse cx="60" cy="70" rx="26" ry="18" fill="#d4a574" stroke="#8b6f47" stroke-width="2"/>
          <!-- Tatuajes tribales -->
          <path d="M 45,70 Q 50,65 55,70" fill="none" stroke="#dc143c" stroke-width="2" opacity="0.6"/>
          <path d="M 65,70 Q 70,65 75,70" fill="none" stroke="#dc143c" stroke-width="2" opacity="0.6"/>
          <!-- Pieles/Armadura primitiva -->
          <path d="M 35,65 L 40,85 M 80,65 L 85,85" stroke="#8b4513" stroke-width="3" opacity="0.5"/>
        </g>
      `,
      weapon: '<path d="M 80,75 L 105,50" stroke="#8b4513" stroke-width="5" stroke-linecap="round"/>'
    },
    'Druida': {
      armor: `
        <g id="armor-druida">
          <!-- Cabello/Hojas naturales -->
          <ellipse cx="60" cy="32" rx="24" ry="22" fill="#228b22" stroke="#1a6b1a" stroke-width="2"/>
          <path d="M 45,30 Q 42,25 45,20" fill="#7cb342" stroke="#558b2f" stroke-width="1"/>
          <path d="M 75,30 Q 78,25 75,20" fill="#7cb342" stroke="#558b2f" stroke-width="1"/>
          <!-- Ropa natural de lino/cuero -->
          <path d="M 38,48 L 60,45 L 82,48 L 82,85 L 38,85 Z" fill="#8b7355" stroke="#654321" stroke-width="2"/>
          <!-- Símbolos naturales -->
          <circle cx="50" cy="60" r="3" fill="#7cb342"/>
          <circle cx="70" cy="60" r="3" fill="#7cb342"/>
          <circle cx="60" cy="72" r="3" fill="#7cb342"/>
          <!-- Animal companion (pequeño) -->
          <circle cx="75" cy="50" r="4" fill="#8b4513" stroke="#654321" stroke-width="1"/>
          <path d="M 77,48 L 80,45" stroke="#654321" stroke-width="1" stroke-linecap="round"/>
        </g>
      `,
      weapon: '<path d="M 75,50 L 90,30" stroke="#8b7355" stroke-width="2" stroke-linecap="round"/>'
    },
    'Explorador': {
      armor: `
        <g id="armor-explorador">
          <!-- Capucha/Capucha de cazador -->
          <ellipse cx="60" cy="32" rx="24" ry="23" fill="#8b6f47" stroke="#6b5437" stroke-width="2"/>
          <!-- Armadura de cuero reforzada -->
          <path d="M 38,48 L 60,45 L 82,48 L 82,85 L 38,85 Z" fill="#a0826d" stroke="#6b5437" stroke-width="2"/>
          <!-- Correas y bolsas -->
          <rect x="45" y="60" width="3" height="20" fill="#654321"/>
          <rect x="72" y="60" width="3" height="20" fill="#654321"/>
          <!-- Arco (pequeño) -->
          <path d="M 75,55 Q 85,65 75,75" fill="none" stroke="#8b6f47" stroke-width="2"/>
          <line x1="80" y1="60" x2="80" y2="70" stroke="#ffd700" stroke-width="1" opacity="0.7"/>
        </g>
      `,
      weapon: '<path d="M 80,70 L 100,50" stroke="#8b6f47" stroke-width="2" stroke-linecap="round"/>'
    },
    'Bardo': {
      armor: `
        <g id="armor-bardo">
          <!-- Cabello elegante -->
          <ellipse cx="60" cy="32" rx="24" ry="22" fill="#d4af37" stroke="#b8860b" stroke-width="2"/>
          <!-- Ropa elegante/Ropas nobles -->
          <path d="M 35,48 L 60,42 L 85,48 L 85,85 L 35,85 Z" fill="#8b3a8b" stroke="#5a246b" stroke-width="2"/>
          <!-- Capa -->
          <path d="M 40,55 Q 30,70 35,85" fill="none" stroke="#8b3a8b" stroke-width="3" opacity="0.7"/>
          <path d="M 80,55 Q 90,70 85,85" fill="none" stroke="#8b3a8b" stroke-width="3" opacity="0.7"/>
          <!-- Instrumento musical (pequeño) -->
          <ellipse cx="75" cy="65" rx="5" ry="8" fill="#d4af37" stroke="#b8860b" stroke-width="1"/>
        </g>
      `,
      weapon: '<circle cx="75" cy="65" r="5" fill="#d4af37" stroke="#b8860b" stroke-width="1"/>'
    },
    'Monje': {
      armor: `
        <g id="armor-monje">
          <!-- Cabeza rapada/Monje -->
          <circle cx="60" cy="30" r="22" fill="#d4a574" stroke="#8b6f47" stroke-width="2"/>
          <!-- Ropa de monje -->
          <path d="M 35,50 L 60,45 L 85,50 L 85,85 L 35,85 Z" fill="#8b6914" stroke="#654321" stroke-width="2"/>
          <!-- Símbolo espiritual -->
          <circle cx="60" cy="65" r="6" fill="none" stroke="#ffd700" stroke-width="1"/>
          <line x1="60" y1="59" x2="60" y2="71" stroke="#ffd700" stroke-width="1"/>
          <line x1="54" y1="65" x2="66" y2="65" stroke="#ffd700" stroke-width="1"/>
          <!-- Banda del cinturón -->
          <rect x="50" y="68" width="20" height="3" fill="#654321" stroke="#3d2817" stroke-width="1"/>
        </g>
      `,
      weapon: ''
    },
    'Brujo': {
      armor: `
        <g id="armor-brujo">
          <!-- Cabello oscuro misterioso -->
          <ellipse cx="60" cy="32" rx="24" ry="22" fill="#1a0033" stroke="#0a0019" stroke-width="2"/>
          <!-- Ropa oscura mágica -->
          <path d="M 35,48 L 60,42 L 85,48 L 85,85 L 35,85 Z" fill="#2d0a4e" stroke="#1a0033" stroke-width="2"/>
          <!-- Símbolos arcanos -->
          <circle cx="50" cy="65" r="2" fill="#9370db" opacity="0.8"/>
          <circle cx="70" cy="60" r="2" fill="#9370db" opacity="0.8"/>
          <circle cx="60" cy="75" r="2" fill="#9370db" opacity="0.8"/>
          <!-- Aura oscura -->
          <circle cx="60" cy="60" r="32" fill="none" stroke="#8b008b" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
        </g>
      `,
      weapon: '<path d="M 75,65 L 95,40" stroke="#9370db" stroke-width="2" stroke-linecap="round"/>'
    },
    'Hechicero': {
      armor: `
        <g id="armor-hechicero">
          <!-- Cabello con energía -->
          <ellipse cx="60" cy="32" rx="24" ry="22" fill="#4b0082" stroke="#2d0052" stroke-width="2"/>
          <path d="M 45,25 Q 50,15 50,25" fill="#9370db" opacity="0.5"/>
          <path d="M 75,25 Q 70,15 70,25" fill="#9370db" opacity="0.5"/>
          <!-- Ropa mágica -->
          <path d="M 38,48 L 60,42 L 82,48 L 82,85 L 38,85 Z" fill="#663399" stroke="#4b0082" stroke-width="2"/>
          <!-- Energía mágica que brota -->
          <circle cx="40" cy="55" r="2" fill="#9370db" opacity="0.7"/>
          <circle cx="80" cy="55" r="2" fill="#9370db" opacity="0.7"/>
          <circle cx="60" cy="72" r="2" fill="#9370db" opacity="0.7"/>
          <!-- Aura de poder -->
          <circle cx="60" cy="60" r="34" fill="none" stroke="#9370db" stroke-width="1" opacity="0.6"/>
        </g>
      `,
      weapon: '<circle cx="60" cy="60" r="34" fill="none" stroke="#9370db" stroke-width="1" opacity="0.8"/>'
    }
  };

  // Paletas de piel por RAZA
  const raceSkins = {
    'Humano': { skin: '#d4a574', outline: '#8b6f47' },
    'Elfo': { skin: '#c8b5a0', outline: '#6b5b4e' },
    'Enano': { skin: '#a8926a', outline: '#6b5a42' },
    'Mediano': { skin: '#e8d4b8', outline: '#b8926a' },
    'Orco': { skin: '#7a9a5a', outline: '#3a501e' },
    'Tiefling': { skin: '#d4a8c8', outline: '#8b3a6b' },
    'Dracónido': { skin: '#d4c747', outline: '#aa8a21' },
    'Gnomo': { skin: '#e8c4a0', outline: '#c49060' },
    'Semielfo': { skin: '#d8c4a8', outline: '#9b8868' },
    'Semiorco': { skin: '#8aaa7a', outline: '#4a6a2a' }
  };

  const classStyle = classVisuals[charClass] || classVisuals['Guerrero'];
  const raceSkin = raceSkins[race] || raceSkins['Humano'];

  const svg = `
    <defs>
      <filter id="shadow-d">
        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.5"/>
      </filter>
      <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f5f5f5;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#c0c0c0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#808080;stop-opacity:1" />
      </linearGradient>
    </defs>

    <!-- Fondo circulo personaje -->
    <circle cx="60" cy="60" r="58" fill="#f8f5ee" stroke="#b8860b" stroke-width="2" opacity="0.3"/>

    <!-- Cara base (bajo armadura) -->
    <ellipse cx="60" cy="60" rx="20" ry="22" fill="${raceSkin.skin}" stroke="${raceSkin.outline}" stroke-width="1" opacity="0.6"/>

    <!-- ARMADURA/CLASE VISUAL -->
    ${classStyle.armor}

    <!-- ARMA -->
    ${classStyle.weapon}

    <!-- Nombre/Raza (etiqueta inferior) -->
    <rect x="20" y="98" width="80" height="16" rx="4" fill="${raceSkin.outline}" opacity="0.15" stroke="${raceSkin.outline}" stroke-width="1"/>
    <text x="60" y="110" text-anchor="middle" font-size="10" font-weight="bold" fill="${raceSkin.outline}" font-family="Arial">${charClass.substring(0,10)}</text>
  `;

  avatarSvg.innerHTML = svg;
  avatarSvg.setAttribute('viewBox', '0 0 120 120');
}

  
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
// RETRATO IA D&D PROFESIONAL
// ==========================================
async function fetchAIPortrait(race, charClass) {
  const portraitImg = document.getElementById('aiPortrait');
  if (!portraitImg) return;

  portraitImg.src = "https://placehold.co/180x220/667eea/ffffff?text=⚔️+D&D";
  portraitImg.alt = "Generando...";

  // Prompts PROFESIONALES con estilos artísticos D&D
  const prompts = {
    // GUERREROS
    'Guerrero-Humano': 'human knight with full plate armor sword shield, oil painting style like Greg Staley, fantasy medieval',
    'Guerrero-Enano': 'dwarf warrior axe beard ornate armor, realistic painting, forgotten realms d&d art style',
    'Guerrero-Elfo': 'elven warrior elegant armor longsword, fine art fantasy illustration',
    
    // MAGOS
    'Mago-Humano': 'human wizard blue robes staff glowing arcane symbols, magic aura, fantasy art like Luis Royo',
    'Mago-Elfo': 'elven mage long hair robes spell casting, mystical fantasy illustration',
    'Mago-Gnomo': 'gnome wizard spectacles robes magic wand, fantasy character art',
    
    // PÍCAROS
    'Pícaro-Mediano': 'halfling rogue daggers leather armor sneaking shadow, dark fantasy art',
    'Pícaro-Elfo': 'elven rogue bow dark armor mysterious, fantasy illustration',
    
    // CLÉRIGOS
    'Clérigo-Humano': 'human cleric holy symbol divine light armor, religious fantasy art like Keith Parkinson',
    'Clérigo-Enano': 'dwarf cleric mace shield gold armor holy, fantasy medieval painting',
    
    // PALADINES
    'Paladín-Humano': 'human paladin golden full plate armor holy sword glowing, epic fantasy art',
    'Paladín-Elfo': 'elven paladin celestial armor divine power, fantasy illustration',
    
    // BÁRBAROS
    'Bárbaro-Humano': 'human barbarian muscular axes furs rage expression, gritty fantasy art',
    'Bárbaro-Orco': 'orc barbarian tusks massive axe tribal tattoos fierce, dark fantasy',
    
    // DRUIDAS
    'Druida-Humano': 'human druid nature magic green aura animal companion, mystical fantasy art',
    'Druida-Elfo': 'elven druid forest communion wild shape, organic fantasy illustration',
    
    // BARDOS
    'Bardo-Humano': 'human bard lute magical performance charismatic, colorful fantasy art',
    'Bardo-Mediano': 'halfling bard musical instrument stage presence, fantasy character',
    
    // MONJES
    'Monje-Humano': 'human monk martial arts robes meditation calm, spiritual fantasy art',
    
    // EXPLORADORES
    'Explorador-Humano': 'human ranger wilderness bow animal companion tracking, fantasy art',
    'Explorador-Elfo': 'elven ranger bow beast companion hunting, nature fantasy illustration',
    
    // HECHICEROS
    'Hechicero-Humano': 'human sorcerer wild magic draconic power chaos aura, dark fantasy art',
    'Hechicero-Tiefling': 'tiefling sorcerer red skin horns arcane power, demonic fantasy',
    
    // BRUJOS
    'Brujo-Humano': 'human warlock eldritch power dark magic mysterious, gothic fantasy art',
    'Brujo-Tiefling': 'tiefling warlock dark pact sinister power, dark fantasy illustration'
  };

  const key = `${charClass}-${race}`;
  const prompt = prompts[key] || `${race} ${charClass} fantasy d&d character portrait, professional fantasy art`;

  // Intentar Lexica primero
  try {
    const res = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.images && data.images.length > 0) {
        const idx = Math.floor(Math.random() * Math.min(data.images.length, 15));
        portraitImg.src = data.images[idx].src;
        portraitImg.alt = `${race} ${charClass}`;
        console.log('✅ Retrato profesional D&D cargado');
        return;
      }
    }
  } catch(e) {
    console.warn('Lexica falló');
  }

  // Fallback: DiceBear adventure style
  try {
    const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(race+charClass)}&backgroundColor=667eea`;
    portraitImg.src = url;
    console.log('✅ Avatar D&D generado');
  } catch(e) {
    portraitImg.src = "https://placehold.co/180x220/8b4513/ffd700?text=D&D+Portrait";
  }
}
  
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
// MINTEAR NFT (VERSIÓN MEJORADA)
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
    // 1. Verificar que estamos en testnet
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    
    // Redes soportadas
    const supportedNetworks = {
      11155111: { name: 'Sepolia', rpc: 'https://sepolia.infura.io/v3/' },
      80002: { name: 'Polygon Amoy', rpc: 'https://rpc-amoy.polygon.technology/' },
      1: { name: 'Ethereum Mainnet', rpc: 'https://eth-mainnet.g.alchemy.com/v2/' }
    };
    
    if (!supportedNetworks[network.chainId]) {
      alert(`⚠️ Red no soportada (Chain ID: ${network.chainId})\n\nUsa Sepolia (11155111) o Polygon Amoy (80002)`);
      return;
    }
    
    console.log(`✅ Conectado a ${supportedNetworks[network.chainId].name}`);
    
    // 2. Seleccionar contrato según la red
    let nftContract, nftAbi;
    
    if (network.chainId === 11155111) {
      // Sepolia
      nftContract = "0x5FbDB2315678afccb333f8a9c6122f65991e6F61";
      nftAbi = [
        "function safeMint(address to, string memory tokenURI) public",
        "function balanceOf(address owner) public view returns (uint256)"
      ];
    } else if (network.chainId === 80002) {
      // Polygon Amoy
      nftContract = "0x2279B7A0a67DB372996c5d4401fFFd7a6f19b0c1";
      nftAbi = [
        "function safeMint(address to, string memory tokenURI) public",
        "function balanceOf(address owner) public view returns (uint256)"
      ];
    } else {
      alert('Red no soportada para minteo');
      return;
    }
    
    // 3. Validar dirección del contrato
    if (!ethers.isAddress(nftContract)) {
      console.error('❌ Dirección del contrato inválida:', nftContract);
      alert('Error: Dirección del contrato no válida');
      return;
    }
    
    // 4. Generar metadata y URI
    const svgData = document.getElementById("charAvatar").outerHTML;
    const svg64 = btoa(unescape(encodeURIComponent(svgData)));
    const image = `data:image/svg+xml;base64,${svg64}`;
    
    const metadata = {
      name: currentCharacter.name,
      description: `Personaje D&D: ${currentCharacter.race} ${currentCharacter.class} Nivel ${currentCharacter.level}`,
      image,
      external_url: "https://jcazorla90.github.io/dnd-nft-generator/",
      attributes: [
        { trait_type: "Raza", value: currentCharacter.race },
        { trait_type: "Clase", value: currentCharacter.class },
        { trait_type: "Nivel", value: currentCharacter.level.toString() },
        { trait_type: "Fuerza", value: currentCharacter.stats.strength.toString() },
        { trait_type: "Destreza", value: currentCharacter.stats.dexterity.toString() },
        { trait_type: "Constitución", value: currentCharacter.stats.constitution.toString() },
        { trait_type: "Inteligencia", value: currentCharacter.stats.intelligence.toString() },
        { trait_type: "Sabiduría", value: currentCharacter.stats.wisdom.toString() },
        { trait_type: "Carisma", value: currentCharacter.stats.charisma.toString() },
        { trait_type: "CA", value: currentCharacter.ac.toString() },
        { trait_type: "HP", value: currentCharacter.hp.toString() }
      ]
    };
    
    const jsonB64 = btoa(unescape(encodeURIComponent(JSON.stringify(metadata))));
    const tokenURI = `data:application/json;base64,${jsonB64}`;
    
    // 5. Conectar billetera
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    console.log(`✅ Billetera conectada: ${address}`);
    
    // 6. Crear instancia del contrato
    const contract = new ethers.Contract(nftContract, nftAbi, signer);
    
    // 7. Mintear NFT
    console.log('🔄 Minteando NFT...');
    const tx = await contract.safeMint(address, tokenURI);
    
    console.log(`✅ Transacción enviada: ${tx.hash}`);
    
    // 8. Esperar confirmación
    const receipt = await tx.wait();
    console.log(`✅ NFT minteado exitosamente en bloque ${receipt.blockNumber}`);
    
    // 9. Mostrar éxito
    const explorerUrl = network.chainId === 11155111 
      ? `https://sepolia.etherscan.io/tx/${tx.hash}`
      : `https://amoy.polygonscan.com/tx/${tx.hash}`;
    
    alert(
      `🎉 ¡NFT MINTEADO EXITOSAMENTE!\n\n` +
      `Personaje: ${currentCharacter.name}\n` +
      `Red: ${supportedNetworks[network.chainId].name}\n` +
      `Hash: ${tx.hash}\n\n` +
      `Ver en explorer: ${explorerUrl}`
    );
    
  } catch(err) {
    console.error('❌ Error completo:', err);
    
    // Mensajes de error más específicos
    if (err.code === 'ACTION_REJECTED') {
      alert('❌ Transacción cancelada por el usuario');
    } else if (err.message.includes('insufficient funds')) {
      alert('❌ Fondos insuficientes para pagar gas\n\nObtén testnet ETH/MATIC en un faucet');
    } else if (err.message.includes('bad address checksum')) {
      alert('❌ Error de checksum en la dirección del contrato\n\nContacta al desarrollador');
    } else if (err.message.includes('network')) {
      alert('❌ Error de conexión de red\n\nVerifica tu conexión y que estés en testnet');
    } else {
      alert('❌ Error al mintear NFT:\n\n' + (err.message || err.toString()));
    }
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
