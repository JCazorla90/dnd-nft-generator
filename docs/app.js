// ==========================================
// 🐉 D&D CHARACTER FORGE - CONTROLLER
// ==========================================

'use strict';

// ===== ESTADO =====
const AppState = {
  character: null,
  creature: null,
  history: JSON.parse(localStorage.getItem('dnd_forge_history')) || []
};

// ===== INICIO =====
document.addEventListener('DOMContentLoaded', () => {
  console.log("⚔️ Iniciando Forja...");
  
  // Validar APIs
  if (typeof DND_DATA === 'undefined' || typeof DND_API === 'undefined') {
    console.error("❌ Faltan scripts de datos (data/ o api/).");
    return;
  }

  setupListeners();
  fillSelectors();
});

function setupListeners() {
  // Generación
  document.getElementById('randomBtn').addEventListener('click', generateRandomChar);
  document.getElementById('customGenerateBtn').addEventListener('click', generateCustomChar);
  document.getElementById('chaosBtn').addEventListener('click', generateChaosChar);
  document.getElementById('toggleCustomBtn').addEventListener('click', () => {
    document.getElementById('customPanel').classList.toggle('hidden');
  });

  // Ficha
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

// ===== PERSONAJES =====

function generateRandomChar() {
  const race = getRandomKey(DND_DATA.races);
  const cls = getRandomKey(DND_DATA.classes);
  const bg = getRandomKey(DND_DATA.backgrounds);
  createChar(race, cls, bg);
}

function generateCustomChar() {
  const race = document.getElementById('raceSelect').value || getRandomKey(DND_DATA.races);
  const cls = document.getElementById('classSelect').value || getRandomKey(DND_DATA.classes);
  const bg = document.getElementById('backgroundSelect').value || getRandomKey(DND_DATA.backgrounds);
  const name = document.getElementById('charName').value;
  createChar(race, cls, bg, name);
}

function generateChaosChar() {
  const char = createChar(null, null, null, "CHAOS WARRIOR");
  // Stats rotos (3-25)
  Object.keys(char.stats).forEach(k => char.stats[k] = Math.floor(Math.random() * 22) + 3);
  char.hp = Math.floor(Math.random() * 200);
  updateUI(char);
}

function createChar(raceName, className, bgName, customName) {
  if (!raceName) raceName = getRandomKey(DND_DATA.races);
  if (!className) className = getRandomKey(DND_DATA.classes);
  if (!bgName) bgName = getRandomKey(DND_DATA.backgrounds);

  const raceData = DND_DATA.races[raceName];
  const classData = DND_DATA.classes[className];
  const bgData = DND_DATA.backgrounds[bgName];
  
  const stats = generateStats();
  const mods = calcMods(stats);
  
  const char = {
    name: customName || DND_DATA.generateName(raceName),
    race: raceName,
    class: className,
    background: bgName,
    level: 1,
    alignment: DND_DATA.alignments[Math.floor(Math.random() * DND_DATA.alignments.length)],
    stats: stats,
    mods: mods,
    hp: classData.hitDie + mods.con,
    ac: 10 + mods.dex,
    speed: raceData.speed,
    init: mods.dex,
    equipment: ["Mochila", "Raciones (5)", "Arma básica"],
    traits: raceData.traits || [],
    features: classData.features || [],
    bgDetails: bgData,
    timestamp: new Date()
  };

  AppState.character = char;
  updateUI(char);
  saveHistory(char);
  return char;
}

async function updateUI(char) {
  document.getElementById('characterSheet').classList.remove('hidden');
  document.getElementById('characterSheet').scrollIntoView({behavior: "smooth"});

  setText('displayName', char.name);
  setText('displayRace', char.race);
  setText('displayClass', char.class);
  setText('displayBackground', char.background);
  setText('displayAlignment', char.alignment);

  // Stats
  updateStat('Str', char.stats.strength, char.mods.str);
  updateStat('Dex', char.stats.dexterity, char.mods.dex);
  updateStat('Con', char.stats.constitution, char.mods.con);
  updateStat('Int', char.stats.intelligence, char.mods.int);
  updateStat('Wis', char.stats.wisdom, char.mods.wis);
  updateStat('Cha', char.stats.charisma, char.mods.cha);

  // Combat
  setText('displayHP', char.hp);
  setText('displayAC', char.ac);
  setText('displaySpeed', char.speed);
  setText('displayInit', (char.init >= 0 ? "+" : "") + char.init);

  // Lists
  fillList('equipment', char.equipment);
  fillList('racialTraits', char.traits);
  fillList('classFeatures', char.features);
  
  // Background
  setText('backgroundName', char.background);
  setText('backgroundFeature', char.bgDetails.feature);
  setText('backgroundSkills', char.bgDetails.skills.join(', '));

  // Images
  updatePortrait();
  if (typeof drawAvatar === 'function') drawAvatar(char.name, char.race, char.class);
  updatePowerBar(char.stats);
}

// ===== IMAGENES =====
async function updatePortrait() {
  const char = AppState.character;
  if (!char) return;
  const img = document.getElementById('aiPortrait');
  img.src = "https://placehold.co/300x400/333/gold?text=Invocando...";
  
  const query = `${char.race} ${char.class} fantasy portrait D&D detailed`;
  // Usamos la API que te di antes
  const url = await DND_API.Images.getEpicImage(query);
  img.src = url;
}

// ===== BESTIARIO =====
function generateLocalCreature() {
  if (typeof DND_MONSTERS === 'undefined') return alert("Faltan datos monstruos.");
  const m = DND_MONSTERS[Math.floor(Math.random() * DND_MONSTERS.length)];
  displayCreature(m);
}

async function generateAPICreature() {
  alert("Consultando archivos arcanos (API)...");
  const list = await DND_API.listMonsters();
  if(!list.length) return;
  const rnd = list[Math.floor(Math.random() * list.length)];
  const details = await DND_API.getMonsterDetails(rnd.index);
  displayCreature(details);
}

function generateChaosBeast() {
  const m = {
    name: "Aberración del Vacío",
    type: "Aberración",
    cr: "???", xp: "99999",
    ac: Math.floor(Math.random()*10)+10,
    hp: Math.floor(Math.random()*200)+50,
    stats: {str:20, dex:15, con:20, int:3, wis:10, cha:5},
    actions: ["Grito Psíquico", "Devorar Alma"]
  };
  displayCreature(m);
}

function displayCreature(m) {
  document.getElementById('creatureSheet').classList.remove('hidden');
  document.getElementById('creatureSheet').scrollIntoView({behavior: "smooth"});
  AppState.creature = m;

  setText('creatureName', m.name);
  setText('creatureType', m.type);
  setText('creatureCR', m.cr);
  setText('creatureXP', m.xp);
  
  setText('creatureAC', m.ac);
  setText('creatureHP', m.hp);
  
  // Mapeo stats API vs Local
  const s = m.stats || {str: m.str, dex: m.dex, con: m.con, int: m.int, wis: m.wis, cha: m.cha};
  if(s) {
    setText('creatureStr', s.str || s.strength);
    setText('creatureDex', s.dex || s.dexterity);
    setText('creatureCon', s.con || s.constitution);
    setText('creatureInt', s.int || s.intelligence);
    setText('creatureWis', s.wis || s.wisdom);
    setText('creatureCha', s.cha || s.charisma);
  }

  fillList('creatureActions', m.actions || ["Ataque básico"]);
  fillList('creatureTraits', m.traits || []);
  updateCreatureImage();
}

async function updateCreatureImage() {
  if(!AppState.creature) return;
  const img = document.getElementById('creaturePortrait');
  img.src = "https://placehold.co/300x300/333/red?text=Bestia...";
  const url = await DND_API.Images.getEpicImage(`${AppState.creature.name} monster D&D art`, 'monster');
  img.src = url;
}

// ===== UTILIDADES =====
function generateStats() {
  const roll = () => [r(6),r(6),r(6),r(6)].sort((a,b)=>a-b).slice(1).reduce((a,b)=>a+b,0);
  return {strength: roll(), dexterity: roll(), constitution: roll(), intelligence: roll(), wisdom: roll(), charisma: roll()};
}

function calcMods(stats) {
  const m = {};
  for (let k in stats) m[k.substring(0,3)] = Math.floor((stats[k]-10)/2);
  return m;
}

function updateStat(suffix, val, mod) {
  setText('stat'+suffix, val);
  setText('mod'+suffix, (mod>=0?"+":"")+mod);
}

function updatePowerBar(stats) {
  const total = Object.values(stats).reduce((a,b)=>a+b,0);
  const pct = Math.min(100, (total/108)*100);
  document.getElementById('powerBar').style.width = pct+"%";
  document.getElementById('powerLevel').textContent = total > 80 ? "⭐⭐⭐ LEYENDA" : total > 70 ? "⭐⭐ HÉROE" : "⭐ AVENTURERO";
}

function fillSelectors() {
  const fill = (id, obj) => {
    const sel = document.getElementById(id);
    Object.keys(obj).forEach(k => {
      const opt = document.createElement('option');
      opt.value = k; opt.textContent = k;
      sel.appendChild(opt);
    });
  };
  fill('raceSelect', DND_DATA.races);
  fill('classSelect', DND_DATA.classes);
  fill('backgroundSelect', DND_DATA.backgrounds);
}

function saveHistory(char) {
  AppState.history.unshift(char);
  if(AppState.history.length > 10) AppState.history.pop();
  localStorage.setItem('dnd_forge_history', JSON.stringify(AppState.history));
}

function toggleHistory() {
  const m = document.getElementById('historyModal');
  const l = document.getElementById('historyList');
  m.classList.toggle('hidden');
  if(!m.classList.contains('hidden')) {
    l.innerHTML = AppState.history.map(c => 
      `<div class="history-item" onclick="updateUI(AppState.history.find(h=>h.timestamp=='${c.timestamp}')); document.getElementById('historyModal').classList.add('hidden')">
         <strong>${c.name}</strong> - ${c.race} ${c.class}
       </div>`
    ).join('');
  }
}

function downloadPDF() {
  if(!AppState.character) return;
  const doc = new window.jspdf.jsPDF();
  doc.text(AppState.character.name, 10, 10);
  doc.save("pj.pdf");
}

function saveJSON() {
  if(!AppState.character) return;
  const b = new Blob([JSON.stringify(AppState.character)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = "pj.json";
  a.click();
}

// Helpers
function r(n) { return Math.floor(Math.random()*n)+1; }
function getRandomKey(obj) { const k=Object.keys(obj); return k[Math.floor(Math.random()*k.length)]; }
function setText(id, t) { const e = document.getElementById(id); if(e) e.textContent = t; }
function fillList(id, arr) { 
  const ul = document.getElementById(id); 
  if(ul) ul.innerHTML = arr.map(i => `<li>${i}</li>`).join(''); 
}
