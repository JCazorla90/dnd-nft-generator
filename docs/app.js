/**
 * ═══════════════════════════════════════════════════════════════════
 * 🐉 D&D CHARACTER FORGE - MAIN CONTROLLER
 * Copyright (c) 2025 José Cazorla
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

let appState = { character: null, history: [] };

function init() {
  console.log("🛠️ Inicializando Sistema...");
  
  // Event Listeners
  document.getElementById('generateBtn').addEventListener('click', generateRandomCharacter);
  document.getElementById('customCharBtn').addEventListener('click', () => window.wizard.start());
  document.getElementById('historyBtn').addEventListener('click', toggleHistory);
  document.getElementById('newCreatureBtn').addEventListener('click', generateCreature);
  document.getElementById('chaosBtn').addEventListener('click', generateChaosBeast);
  document.getElementById('exportPdfBtn').addEventListener('click', exportPDF);
  document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
  document.getElementById('toggleTheme').addEventListener('click', () => document.body.classList.toggle('dark-mode'));
  
  document.querySelectorAll('.close-modal').forEach(el => el.addEventListener('click', toggleHistory));
  
  loadHistory();
}

// === CALLBACK DEL WIZARD ===
window.onWizardFinish = function(character) {
  console.log("✨ Personaje Recibido del Wizard:", character);
  appState.character = character;
  updateUI(character);
  saveToHistory(character);
};

// === GENERACIÓN ALEATORIA ===
function generateRandomCharacter() {
  const race = DnDData.getRandomRace();
  const cls = DnDData.getRandomClass();
  const bg = DnDData.getRandomBackground();
  const stats = DnDData.generateStats();
  
  const mods = {
    str: DnDData.getModifier(stats.strength),
    dex: DnDData.getModifier(stats.dexterity),
    con: DnDData.getModifier(stats.constitution),
    int: DnDData.getModifier(stats.intelligence),
    wis: DnDData.getModifier(stats.wisdom),
    cha: DnDData.getModifier(stats.charisma)
  };

  const char = {
    name: DnDData.generateName(race),
    race: race,
    class: cls,
    background: bg,
    alignment: DnDData.alignments[Math.floor(Math.random() * DnDData.alignments.length)],
    level: 1,
    stats: stats,
    modifiers: mods,
    hp: DnDData.classes[cls].hitDie + mods.con,
    ac: 10 + mods.dex,
    initiative: mods.dex,
    equipment: ["Equipo Aleatorio de Aventurero"],
    traits: DnDData.races[race].traits || []
  };

  appState.character = char;
  updateUI(char);
  saveToHistory(char);
}

// === ACTUALIZAR UI ===
function updateUI(char) {
  document.getElementById('characterSheet').classList.remove('hidden');
  
  setText('charName', char.name);
  setText('charRace', char.race);
  setText('charClass', char.class);
  setText('charBackground', char.background);
  setText('charAlignment', char.alignment);

  setText('hpVal', char.hp);
  setText('acVal', char.ac);
  setText('initVal', char.initiative >= 0 ? `+${char.initiative}` : char.initiative);

  // Actualizar Stats
  updateStat('str', char.stats.strength, char.modifiers.str);
  updateStat('dex', char.stats.dexterity, char.modifiers.dex);
  updateStat('con', char.stats.constitution, char.modifiers.con);
  updateStat('int', char.stats.intelligence, char.modifiers.int);
  updateStat('wis', char.stats.wisdom, char.modifiers.wis);
  updateStat('cha', char.stats.charisma, char.modifiers.cha);

  renderList('equipmentList', char.equipment);
  renderList('traitsList', char.traits);
}

function updateStat(prefix, val, mod) {
  setText(`${prefix}Val`, val);
  setText(`${prefix}Mod`, mod >= 0 ? `+${mod}` : mod);
}

// === BESTIARIO ===
function generateCreature() {
  const monsters = (typeof DND_MONSTERS !== 'undefined') ? DND_MONSTERS : [];
  if (monsters.length === 0) return alert("No se encontraron monstruos.");
  
  const monster = monsters[Math.floor(Math.random() * monsters.length)];
  displayCreature(monster);
}

function generateChaosBeast() {
  const types = ["Aberración", "Horror Cósmico", "Mutante", "Sombra"];
  const cr = Math.floor(Math.random() * 10) + 1;
  const chaosMonster = {
    name: "Engendro del Caos #" + Math.floor(Math.random() * 999),
    type: types[Math.floor(Math.random() * types.length)],
    cr: cr,
    hp: cr * 10 + Math.floor(Math.random() * 20),
    ac: 10 + Math.floor(Math.random() * 8),
    description: "Una forma cambiante e inestable de pura entropía.",
    actions: ["Rayo de Locura", "Teletransporte", "Grito Psíquico"]
  };
  displayCreature(chaosMonster);
}

function displayCreature(m) {
  document.getElementById('creatureDisplay').classList.remove('hidden');
  setText('creatureName', m.name);
  setText('creatureType', m.type);
  setText('creatureCR', `CR ${m.cr}`);
  setText('creatureHP', m.hp);
  setText('creatureAC', m.ac);
  setText('creatureDesc', m.description);
  renderList('creatureActions', m.actions || []);
}

// === UTILIDADES ===
function setText(id, txt) { 
    const el = document.getElementById(id);
    if(el) el.textContent = txt; 
}

function renderList(id, items) {
    const ul = document.getElementById(id);
    if(ul) {
        ul.innerHTML = '';
        items.forEach(i => {
            const li = document.createElement('li');
            li.textContent = i;
            ul.appendChild(li);
        });
    }
}

// === HISTORIAL & EXPORT ===
function saveToHistory(char) {
    appState.history.unshift(char);
    if (appState.history.length > 5) appState.history.pop();
    localStorage.setItem('dnd_history', JSON.stringify(appState.history));
}

function loadHistory() {
    const saved = localStorage.getItem('dnd_history');
    if (saved) appState.history = JSON.parse(saved);
}

function toggleHistory() {
    const modal = document.getElementById('historyModal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) renderHistoryList();
}

function renderHistoryList() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    appState.history.forEach(char => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.style.padding = "10px";
        div.style.borderBottom = "1px solid #555";
        div.innerHTML = `<strong>${char.name}</strong> - ${char.race} ${char.class}`;
        div.onclick = () => {
            appState.character = char;
            updateUI(char);
            toggleHistory();
        };
        list.appendChild(div);
    });
}

function clearHistory() {
    appState.history = [];
    localStorage.removeItem('dnd_history');
    renderHistoryList();
}

function exportPDF() {
    if (!appState.character) return alert("Genera un personaje primero.");
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(appState.character.name, 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Raza: ${appState.character.race} | Clase: ${appState.character.class}`, 20, 30);
    doc.text(`Fuerza: ${appState.character.stats.strength} | Destreza: ${appState.character.stats.dexterity}`, 20, 40);
    doc.text(`Constitución: ${appState.character.stats.constitution} | Inteligencia: ${appState.character.stats.intelligence}`, 20, 50);
    
    doc.save(`${appState.character.name}_ficha.pdf`);
}

document.addEventListener('DOMContentLoaded', init);
