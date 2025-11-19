// Estado global
let currentCharacter = null;
const STORAGE_KEY = 'dnd_character_history';

// Utilidades
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

function generateCharacter(customData = {}) {
  const race = customData.race || randomFromArray(Object.keys(DND_DATA.races));
  const charClass = customData.class || randomFromArray(Object.keys(DND_DATA.classes));
  const background = customData.background || randomFromArray(Object.keys(DND_DATA.backgrounds));
  const alignment = customData.alignment || randomFromArray(DND_DATA.alignments);
  
  const stats = generateStats();
  const classData = DND_DATA.classes[charClass];
  const raceData = DND_DATA.races[race];
  const backgroundData = DND_DATA.backgrounds[background];
  
  const hp = classData.hitDie + calculateModifier(stats.constitution);
  const ac = 10 + calculateModifier(stats.dexterity);
  
  return {
    name: customData.name || `${race} el ${charClass}`,
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
    classProficiencies: classData.proficiencies,
    classFeatures: classData.features,
    savingThrows: classData.savingThrows,
    skills: classData.skills,
    equipment: classData.equipment,
    backgroundData: backgroundData
  };
}

// ========== AVATAR SVG ==========
function drawAvatar(name, race, charClass) {
  const races = {
    'Elfo': ['#bce4d7','#325254'],
    'Enano': ['#d8a867','#855e29'],
    'Mediano': ['#fdeec7','#d19c52'],
    'Orco': ['#94b869','#3a501e'],
    'Humano': ['#ffe5c0','#c1946a'],
    'Dracónido': ['#e6d773','#aa8a21'],
    'Tiefling': ['#e1adc8','#7b2670']
  };
  const eyes = ['#372502','#365f63','#3a276d','#375514'];
  let hash = (Array.from(name+race+charClass).reduce((a,c)=>a+c.charCodeAt(0),0)%1000)/1000;
  let raceColors = races[race] || ['#ffe4bc','#947855'];
  let svg = `
    <ellipse cx="60" cy="75" rx="40" ry="45" fill="${raceColors[0]}" stroke="${raceColors[1]}" stroke-width="4"/>
    <ellipse cx="60" cy="61" rx="10" ry="15" fill="${eyes[Math.floor(hash*eyes.length)]}" />
    <ellipse cx="${47+hash*8}" cy="62" rx="5" ry="6" fill="white"/>
    <ellipse cx="${73-hash*8}" cy="62" rx="5" ry="6" fill="white"/>
    <rect x="40" y="100" width="40" height="9" rx="4" fill="${raceColors[1]}" opacity="0.7"/>
    <ellipse cx="60" cy="31" rx="22" ry="18" fill="#${charClass==="Mago"?"b5d0e2":charClass==="Pícaro"?"a2b39c":charClass==="Guerrero"?"7972a9":"e5b6ac"}" opacity="0.5"/>
    <text x="60" y="115" text-anchor="middle" font-size="18" fill="#7a3913">${race[0]}</text>
  `;
  document.getElementById('charAvatar').innerHTML = svg;
}

// ========== RETRATO AI ==========
async function fetchAIPortrait(race, charClass) {
  const prompt = encodeURIComponent([race, charClass, "fantasy dnd portrait"].filter(Boolean).join(" "));
  document.getElementById("aiPortrait").src = "https://placehold.co/180x220/ffe3b1/7a3a13?text=Cargando...";
  
  try {
    const res = await fetch(`https://lexica.art/api/v1/search?q=${prompt}`);
    const data = await res.json();
    const img = data.images && data.images.length ? 
      data.images[Math.floor(Math.random()*data.images.length)].srcSmall : null;
    document.getElementById("aiPortrait").src = img || "https://placehold.co/180x220/edd8cc/7a3a13?text=Sin+retrato";
  } catch(e) {
    document.getElementById("aiPortrait").src = "https://placehold.co/180x220/edd8cc/7a3a13?text=Error";
  }
}

// ========== POWER LEVEL ==========
function updatePowerLevel(stats) {
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
  
  document.getElementById('powerLevel').textContent = lvl;
  document.getElementById('powerBar').style.background = gradient;
}

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
  document.getElementById('displaySavingThrows').textContent = character.savingThrows.join(', ');
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

// ========== HISTORIAL ==========
function saveToHistory(character) {
  let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  history.unshift({
    ...character,
    savedAt: new Date().toISOString()
  });
  history = history.slice(0, 10); // Máximo 10
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

// ========== EXPORT/IMPORT JSON ==========
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

// ========== MINTEAR NFT ==========
const NFT_CONTRACT = "0x3Dd267B885777b2Fe60C63Fc59B2a45a4fD1Dd58"; // Testnet
const NFT_ABI = ["function safeMint(address to, string memory tokenURI) public"];

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
    // Generar metadata
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
    
    // Conectar wallet
    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(NFT_CONTRACT, NFT_ABI, signer);
    
    // Mintear
    const tx = await contract.safeMint(await signer.getAddress(), tokenURI);
    alert(`NFT minteado en testnet!\n\nHash: ${tx.hash}\n\nPuedes verlo en testnets.opensea.io`);
    
  } catch(err) {
    console.error(err);
    alert('Error al mintear NFT: ' + (err.message || err));
  }
}

// ========== MODO OSCURO ==========
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// ========== PDF ==========
async function generatePDF() {
  if (!currentCharacter) return;
  
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
  
  // Más contenido...
  y += 15;
  doc.text(`HP: ${currentCharacter.hp} | CA: ${currentCharacter.ac} | Velocidad: ${currentCharacter.speed} ft`, 20, y);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generado en D&D Character Forge', 105, 285, { align: 'center' });
  
  doc.save(`${currentCharacter.name.replace(/\s/g, '_')}.pdf`);
}

// ========== EVENT LISTENERS ==========
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
  document.getElementById('regenPortrait').addEventListener('click', () => {
    if(currentCharacter) {
      fetchAIPortrait(currentCharacter.race, currentCharacter.class);
    }
  });
  
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
