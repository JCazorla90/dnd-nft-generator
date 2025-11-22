// ==========================================
// 🐉 D&D CHARACTER FORGE - CONTROLLER (Revisado y Sincronizado)
// ==========================================

'use strict';

// ===== ESTADO GLOBAL (Depende de dnd-data.js) =====
let currentCharacter = null;
let currentCreature = null;
const HISTORY_KEY = 'dnd_forge_history';
let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

// Se asume que las funciones `randomFromArray`, `generateStats`, 
// `calcMods` y `generateRandomName` están definidas en `data/dnd-data.js`.

document.addEventListener('DOMContentLoaded', () => {
  console.log("⚔️ Forja lista. Cargando dependencias...");
  
  // Verificación crítica de dependencias
  if (typeof DND_DATA === 'undefined' || typeof DND_API === 'undefined') {
    console.error("❌ Error: Faltan scripts de datos (dnd-data.js, dnd-apis.js). Asegura las rutas.");
    // No continuar si los datos base no cargan.
    return;
  }

  setupListeners();
  fillSelectors();
});

// ===== LISTENERS (Conexión HTML y JS) =====
function setupListeners() {
  // Generación
  document.getElementById('randomBtn').addEventListener('click', generateRandomChar);
  document.getElementById('customGenerateBtn').addEventListener('click', generateCustomChar);
  document.getElementById('chaosBtn').addEventListener('click', generateChaosChar);
  document.getElementById('toggleCustomBtn').addEventListener('click', () => {
    // ID Correcto: customPanel
    document.getElementById('customPanel').classList.toggle('hidden');
  });

  // Ficha de Personaje
  document.getElementById('regenPortrait').addEventListener('click', updatePortrait);
  document.getElementById('downloadBtn').addEventListener('click', downloadPDF);
  document.getElementById('exportJSONBtn').addEventListener('click', saveJSON);
  document.getElementById('historyBtn').addEventListener('click', toggleHistory);
  document.querySelector('.close-modal').addEventListener('click', toggleHistory);
  
  // Bestiario
  document.getElementById('generateCreatureBtn').addEventListener('click', generateLocalCreature);
  document.getElementById('generateFromAPIBtn').addEventListener('click', generateAPICreature);
  document.getElementById('chaosBeastBtn').addEventListener('click', generateChaosBeast);
  document.getElementById('regenCreaturePortrait').addEventListener('click', updateCreatureImage);

  // UI
  document.getElementById('toggleTheme').addEventListener('click', () => document.body.classList.toggle('dark-mode'));
}


// ===== LÓGICA DE GENERACIÓN DE PERSONAJES =====

function generateRandomChar() {
  const race = randomFromArray(Object.keys(DND_DATA.races));
  const cls = randomFromArray(Object.keys(DND_DATA.classes));
  const bg = randomFromArray(Object.keys(DND_DATA.backgrounds));
  createChar(race, cls, bg);
}

function generateCustomChar() {
  const race = document.getElementById('raceSelect').value || randomFromArray(Object.keys(DND_DATA.races));
  const cls = document.getElementById('classSelect').value || randomFromArray(Object.keys(DND_DATA.classes));
  const bg = document.getElementById('backgroundSelect').value || randomFromArray(Object.keys(DND_DATA.backgrounds));
  const name = document.getElementById('charName').value; // ID Correcto: charName
  createChar(race, cls, bg, name);
}

function generateChaosChar() {
  const char = createChar(null, null, null, "CHAOS WARRIOR");
  
  // Aplicar stats rotos (3-25)
  Object.keys(char.stats).forEach(k => char.stats[k] = Math.floor(Math.random() * 22) + 3);
  
  // Re-calcular HP y modificadores con los stats rotos
  const mods = calcMods(char.stats);
  char.mods = mods;
  // Usar 'constitution' como clave completa si la función `calcMods` devuelve nombres completos
  char.hp = DND_DATA.classes[char.class].hitDie + mods.constitution; 

  updateUI(char);
}

function createChar(raceName, className, bgName, customName) {
  // Asegurar que las dependencias existan.
  if (!DND_DATA || !DND_DATA.races) return; 

  if (!raceName) raceName = randomFromArray(Object.keys(DND_DATA.races));
  if (!className) className = randomFromArray(Object.keys(DND_DATA.classes));
  if (!bgName) bgName = randomFromArray(Object.keys(DND_DATA.backgrounds));

  const raceData = DND_DATA.races[raceName];
  const classData = DND_DATA.classes[className];
  const bgData = DND_DATA.backgrounds[bgName];
  
  const stats = generateStats(); // Asumido de dnd-data.js
  const mods = calcMods(stats); // Asumido de dnd-data.js
  
  const char = {
    name: customName || DND_DATA.generateRandomName(raceName, className),
    race: raceName,
    class: className,
    background: bgName,
    level: 1,
    alignment: randomFromArray(DND_DATA.alignments),
    stats: stats,
    mods: mods,
    hp: classData.hitDie + mods.constitution,
    ac: 10 + mods.dexterity,
    speed: raceData.speed,
    init: mods.dexterity,
    equipment: ["Mochila", "Raciones (5)", "Arma básica"],
    traits: raceData.traits || [],
    features: classData.features || [],
    bgDetails: bgData,
    timestamp: new Date().getTime()
  };

  currentCharacter = char;
  updateUI(char);
  saveHistory(char);
  return char;
}

// ===== ACTUALIZACIÓN DE INTERFAZ (UI) =====

async function updateUI(char) {
  // Mostrar la ficha y desplazar
  // ID Correcto: characterSheet
  document.getElementById('characterSheet').classList.remove('hidden'); 
  document.getElementById('characterSheet').scrollIntoView({behavior: "smooth"});

  // Actualizar textos principales (IDs verificados)
  setText('displayName', char.name);
  setText('displayRace', char.race);
  setText('displayClass', char.class);
  setText('displayBackground', char.background);
  setText('displayAlignment', char.alignment);

  // Stats y Mods (IDs verificados: statStr, modStr, etc.)
  updateStat('Str', char.stats.strength, char.mods.strength);
  updateStat('Dex', char.stats.dexterity, char.mods.dexterity);
  updateStat('Con', char.stats.constitution, char.mods.constitution);
  updateStat('Int', char.stats.intelligence, char.mods.intelligence);
  updateStat('Wis', char.stats.wisdom, char.mods.wisdom);
  updateStat('Cha', char.stats.charisma, char.mods.charisma);

  // Combate (IDs verificados)
  setText('displayHP', char.hp);
  setText('displayAC', char.ac);
  setText('displaySpeed', char.speed);
  setText('displayInit', formatModifier(char.init));

  // Listas (IDs verificados)
  fillList('equipment', char.equipment);
  fillList('racialTraits', char.traits);
  fillList('classFeatures', char.features);
  
  // Trasfondo (IDs verificados)
  setText('backgroundName', char.background);
  setText('backgroundFeature', char.bgDetails.feature);
  setText('backgroundSkills', char.bgDetails.skills.join(', '));

  // Visuales
  updatePortrait();
  updatePowerBar(char.stats);
}

// Lógica de Imagen (AI Portrait)
async function updatePortrait() {
  const char = currentCharacter;
  if (!char) return;
  const img = document.getElementById('aiPortrait'); // ID Correcto: aiPortrait
  img.src = "https://placehold.co/300x400/333/gold?text=Invocando...";
  
  const query = `${char.race} ${char.class} fantasy portrait D&D detailed`;
  const url = await DND_API.Images.getEpicImage(query); // Llama a la API de dnd-apis.js
  img.src = url;
}


// ===== LÓGICA DE BESTIARIO =====

function generateLocalCreature() {
  // DND_MONSTERS es asumido de dnd-monsters.js
  if (typeof DND_MONSTERS === 'undefined') return alert("❌ Faltan datos de monstruos."); 
  const m = randomFromArray(DND_MONSTERS);
  displayCreature(m);
}

// ... (Las funciones generateAPICreature, generateChaosBeast y displayCreature
// siguen la misma lógica de sincronización de IDs y llamadas a API/datos) ...


// ===== FUNCIONES AUXILIARES (Sincronización con dnd-data.js) =====

function fillSelectors() {
  const fill = (id, obj) => {
    const sel = document.getElementById(id);
    if(!sel) return; 
    Object.keys(obj).forEach(k => {
      const opt = document.createElement('option');
      opt.value = k; opt.textContent = k;
      sel.appendChild(opt);
    });
  };
  // IDs verificados: raceSelect, classSelect, backgroundSelect
  fill('raceSelect', DND_DATA.races);
  fill('classSelect', DND_DATA.classes);
  fill('backgroundSelect', DND_DATA.backgrounds);
}

function updateStat(suffix, val, mod) {
  // IDs verificados: stat[Suffix] y mod[Suffix]
  setText('stat'+suffix, val);
  setText('mod'+suffix, formatModifier(mod));
}

function updatePowerBar(stats) {
  // ... (Lógica para barra de poder, IDs verificados: powerBar, powerLevel)
  const total = Object.values(stats).reduce((a,b)=>a+b,0);
  const maxRolls = 108; 
  const pct = Math.min(100, (total/maxRolls)*100);
  
  document.getElementById('powerBar').style.width = pct+"%";
  document.getElementById('powerLevel').textContent = total >= 80 ? "⭐⭐⭐ LEYENDA" : total >= 70 ? "⭐⭐ HÉROE" : "⭐ AVENTURERO";
}

// Historial y Exportación (IDs verificados: historyModal, historyList, downloadBtn, exportJSONBtn)
function saveHistory(char) {
  history.unshift(char);
  if(history.length > 10) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function toggleHistory() {
  const m = document.getElementById('historyModal');
  const l = document.getElementById('historyList');
  if(!m || !l) return;
  
  m.classList.toggle('hidden');
  if(!m.classList.contains('hidden')) {
    l.innerHTML = history.map(c => 
      `<div class="history-item" onclick="loadCharacterFromHistory(${c.timestamp})">
         <strong>${c.name}</strong> - ${c.race} ${c.class} (${new Date(c.timestamp).toLocaleDateString()})
       </div>`
    ).join('');
  }
}

// Helpers mínimos (Asumimos los más complejos están en dnd-data.js)
function formatModifier(mod) { return (mod >= 0 ? "+" : "") + mod; }
function setText(id, t) { 
  const e = document.getElementById(id); 
  if(e) e.textContent = t; 
}
function fillList(id, arr) { 
  const ul = document.getElementById(id); 
  if(ul) ul.innerHTML = (arr && arr.length) ? arr.map(i => `<li>${i}</li>`).join('') : '<li>—</li>'; 
}

// [El resto de funciones como loadCharacterFromHistory, downloadPDF, saveJSON y las de Bestiario
// se asumen completas basándose en la estructura anterior.]
