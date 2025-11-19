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
    'Humano': ['Aric', 'Brendan', 'Cassandra', 'Diana', 'Erik', 'Fiona'],
    'Elfo': ['Aelrindel', 'Eldacar', 'Galadriel', 'Legolas', 'Thranduil', 'Arwen'],
    'Enano': ['Balin', 'Dwalin', 'Thorin', 'Gimli', 'Dain', 'Thrain'],
    'Orco': ['Grunk', 'Thrak', 'Urgak', 'Mog', 'Grul', 'Drak'],
    'Mediano': ['Bilbo', 'Frodo', 'Sam', 'Pippin', 'Merry', 'Rosie'],
    'Tiefling': ['Akta', 'Damakos', 'Ekemon', 'Iados', 'Kairon', 'Leucis'],
    'Dracónido': ['Arjhan', 'Balasar', 'Bharash', 'Donaar', 'Ghesh', 'Heskan']
  };
  
  const raceNames = names[race] || names['Humano'];
  const firstName = randomFromArray(raceNames);
  const titles = ['el Valiente', 'el Sabio', 'el Rápido', 'el Fuerte', 'la Astuta', 'el Noble'];
  
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
// AVATAR SVG MEJORADO
// ==========================================
function drawAvatar(name, race, charClass) {
  const avatarSvg = document.getElementById('charAvatar');
  if (!avatarSvg) return;
  
  const races = {
    'Humano': { skin: '#ffe5c0', outline: '#c1946a', hair: '#8b4513' },
    'Elfo': { skin: '#bce4d7', outline: '#325254', hair: '#ffd700' },
    'Alto Elfo': { skin: '#bce4d7', outline: '#325254', hair: '#ffd700' },
    'Elfo Oscuro (Drow)': { skin: '#4a4a6a', outline: '#2a2a4a', hair: '#ffffff' },
    'Elfo de los Bosques': { skin: '#d4e7c5', outline: '#5a7247', hair: '#8b6914' },
    'Enano': { skin: '#d8a867', outline: '#855e29', hair: '#654321' },
    'Enano de las Montañas': { skin: '#d8a867', outline: '#855e29', hair: '#654321' },
    'Enano de las Colinas': { skin: '#d8a867', outline: '#855e29', hair: '#8b4513' },
    'Mediano': { skin: '#fdeec7', outline: '#d19c52', hair: '#d2691e' },
    'Mediano Piesligeros': { skin: '#fdeec7', outline: '#d19c52', hair: '#d2691e' },
    'Mediano Fornido': { skin: '#f5deb3', outline: '#c9a961', hair: '#a0522d' },
    'Orco': { skin: '#94b869', outline: '#3a501e', hair: '#2f4f2f' },
    'Semiorco': { skin: '#b5c49a', outline: '#5a6e3d', hair: '#556b2f' },
    'Tiefling': { skin: '#e1adc8', outline: '#7b2670', hair: '#4b0082' },
    'Dracónido': { skin: '#e6d773', outline: '#aa8a21', hair: '#daa520' },
    'Gnomo': { skin: '#f5c6a5', outline: '#d4915d', hair: '#ff6347' },
    'Gnomo de las Rocas': { skin: '#f5c6a5', outline: '#d4915d', hair: '#ff6347' },
    'Gnomo de los Bosques': { skin: '#e5d5a5', outline: '#c4a56d', hair: '#8b7355' },
    'Semielfo': { skin: '#f0d5b5', outline: '#c9a581', hair: '#cd853f' }
  };
  
  const classColors = {
    'Guerrero': '#7972a9',
    'Mago': '#b5d0e2',
    'Pícaro': '#a2b39c',
    'Clérigo': '#f0e68c',
    'Paladín': '#ffd700',
    'Bardo': '#dda0dd',
    'Bárbaro': '#dc143c',
    'Druida': '#228b22',
    'Monje': '#ff8c00',
    'Explorador': '#8fbc8f',
    'Hechicero': '#9370db',
    'Brujo': '#8b008b'
  };
  
  const eyes = ['#372502','#365f63','#3a276d','#375514','#8b4513','#4a90e2'];
  
  // Hash basado en nombre para consistencia
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }
  hash = Math.abs(hash) / 1000000;
  
  const raceColors = races[race] || races['Humano'];
  const classColor = classColors[charClass] || '#e5b6ac';
  const eyeColor = eyes[Math.floor(hash * eyes.length)];
  
  // Crear SVG
  const svg = `
    <!-- Fondo del avatar -->
    <circle cx="60" cy="60" r="58" fill="${raceColors.skin}" stroke="${raceColors.outline}" stroke-width="3"/>
    
    <!-- Cabello/Casco (parte superior) -->
    <ellipse cx="60" cy="30" rx="35" ry="25" fill="${classColor}" opacity="0.7"/>
    <path d="M 25,35 Q 60,15 95,35" fill="${raceColors.hair}" opacity="0.6"/>
    
    <!-- Cara -->
    <ellipse cx="60" cy="65" rx="30" ry="35" fill="${raceColors.skin}" stroke="${raceColors.outline}" stroke-width="2"/>
    
    <!-- Ojos -->
    <ellipse cx="50" cy="60" rx="6" ry="8" fill="white"/>
    <ellipse cx="70" cy="60" rx="6" ry="8" fill="white"/>
    <circle cx="${50 + hash * 2}" cy="${60 + hash}" r="3" fill="${eyeColor}"/>
    <circle cx="${70 - hash * 2}" cy="${60 + hash}" r="3" fill="${eyeColor}"/>
    
    <!-- Nariz -->
    <line x1="60" y1="65" x2="60" y2="75" stroke="${raceColors.outline}" stroke-width="1.5" stroke-linecap="round"/>
    
    <!-- Boca -->
    <path d="M 52,82 Q 60,85 68,82" fill="none" stroke="${raceColors.outline}" stroke-width="1.5" stroke-linecap="round"/>
    
    <!-- Cuello/Armadura -->
    <rect x="45" y="95" width="30" height="10" rx="3" fill="${classColor}" opacity="0.8"/>
    
    <!-- Detalles de clase (símbolos) -->
    ${charClass === 'Mago' || charClass === 'Hechicero' || charClass === 'Brujo' ? 
      '<circle cx="60" cy="40" r="4" fill="#ffd700" opacity="0.8"/>' : ''}
    ${charClass === 'Guerrero' || charClass === 'Paladín' ? 
      '<rect x="58" y="38" width="4" height="8" fill="#c0c0c0"/>' : ''}
    ${charClass === 'Clérigo' ? 
      '<path d="M 58,35 L 62,35 M 60,33 L 60,37" stroke="#ffd700" stroke-width="2"/>' : ''}
    
    <!-- Etiqueta de raza -->
    <text x="60" y="115" text-anchor="middle" font-size="12" font-weight="bold" fill="${raceColors.outline}">${race.substring(0, 3).toUpperCase()}</text>
  `;
  
  avatarSvg.innerHTML = svg;
  avatarSvg.setAttribute('viewBox', '0 0 120 120');
}

// ==========================================
// RETRATO AI CON MULTI-API FALLBACK
// ==========================================
async function fetchAIPortrait(race, charClass) {
  const portraitImg = document.getElementById('aiPortrait');
  if (!portraitImg) return;
  
  // Placeholder mientras carga
  portraitImg.src = "https://placehold.co/180x220/667eea/ffffff?text=Generando...";
  portraitImg.alt = "Generando retrato...";
  
  const prompt = `${race} ${charClass} fantasy dnd character portrait`.toLowerCase();
  
  // API 1: Lexica.art (Stable Diffusion búsqueda)
  try {
    const res = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.images && data.images.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(data.images.length, 20));
        portraitImg.src = data.images[randomIndex].src;
        portraitImg.alt = `${race} ${charClass} - Generado por IA`;
        console.log('✅ Imagen cargada desde Lexica.art');
        return;
      }
    }
  } catch (error) {
    console.warn('Lexica.art falló, intentando siguiente API...', error);
  }
  
  // API 2: Fallback - DiceBear Avatars (avatares procedurales)
  try {
    const style = 'avataaars';
    const seed = encodeURIComponent(`${race}-${charClass}-${Date.now()}`);
    const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4`;
    
    const testRes = await fetch(avatarUrl);
    if (testRes.ok) {
      portraitImg.src = avatarUrl;
      portraitImg.alt = `${race} ${charClass} - Avatar generado`;
      console.log('✅ Avatar cargado desde DiceBear');
      return;
    }
  } catch (error) {
    console.warn('DiceBear falló, intentando siguiente opción...', error);
  }
  
  // API 3: Fallback final - UI Avatars
  try {
    const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(race + ' ' + charClass)}&size=180&background=667eea&color=fff&bold=true&format=svg`;
    portraitImg.src = placeholderUrl;
    portraitImg.alt = `${race} ${charClass}`;
    console.log('✅ Placeholder generado');
  } catch (error) {
    console.error('Error en todas las APIs de imagen:', error);
    portraitImg.src = "https://placehold.co/180x220/f56565/ffffff?text=Error";
    portraitImg.alt = "Error al generar imagen";
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
