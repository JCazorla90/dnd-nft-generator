/**
 * ═══════════════════════════════════════════════════════════════════
 * 🧙 D&D CHARACTER FORGE - CORE APPLICATION LOGIC (FIXED)
 * * Lógica central para la generación de personajes, bestiario y encuentros.
 * * Ahora con integración de APIs real y sistema de rareza NFT robusto.
 * * Copyright (c) 2025 José Cazorla
 * https://github.com/JCazorla90/DnD-Character-Forge
 * Licensed under MIT License
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

// DND_DATA, currentCharacter, randomFromArray, rollDice, etc. vienen de dnd-data.js

// ===== 💎 CONSTANTES NFT Y RAREZA MEJORADA =====
const NFT_RARITIES = {
    'Legendaria': { probability: 0.01, specialChance: 0.60, statBoost: 4, label: "Legendario", color: "rarity-legendaria" },
    'Épica': { probability: 0.04, specialChance: 0.30, statBoost: 2, label: "Épico", color: "rarity-epica" },
    'Rara': { probability: 0.15, specialChance: 0.15, statBoost: 1, label: "Rara", color: "rarity-rara" },
    'Infrecuente': { probability: 0.30, specialChance: 0.05, statBoost: 0, label: "Infrecuente", color: "rarity-infrecuente" },
    'Común': { probability: 0.50, specialChance: 0.01, statBoost: 0, label: "Común", color: "rarity-comun" },
};
const RARITY_KEYS = Object.keys(NFT_RARITIES).reverse(); 

// ===== INICIO (Setup y Listeners) =====
document.addEventListener('DOMContentLoaded', () => {
  console.log("⚔️ Forja inicializada. Conectando eventos.");
  
  if (typeof DND_DATA === 'undefined' || typeof DND_API === 'undefined') {
    console.error("❌ Error: Faltan scripts de datos/API. Revisa las rutas.");
    return;
  }

  setupListeners();
  fillSelectors();
  loadHistory();
});

function setupListeners() {
  document.getElementById('randomBtn').addEventListener('click', () => createCharacter('random'));
  document.getElementById('customGenerateBtn').addEventListener('click', () => createCharacter('custom'));
  document.getElementById('chaosBtn').addEventListener('click', () => createCharacter('chaos'));
  document.getElementById('toggleCustomBtn').addEventListener('click', () => {
    document.getElementById('customPanel').classList.toggle('hidden');
  });

  document.getElementById('regenPortrait').addEventListener('click', () => {
    if (currentCharacter) fetchAIPortrait(currentCharacter.race, currentCharacter.class);
  });
  document.getElementById('downloadBtn').addEventListener('click', downloadPDF);
  document.getElementById('historyBtn').addEventListener('click', toggleHistory);
  document.querySelector('.close-modal').addEventListener('click', toggleHistory);
  document.getElementById('mintNFTBtn').addEventListener('click', () => {
    if (currentCharacter && !currentCharacter.nft.minted) mintNFT(currentCharacter);
  });
  document.getElementById('exportJSONBtn').addEventListener('click', exportJSON);

  // Bestiario
  document.getElementById('generateCreatureBtn').addEventListener('click', generateLocalCreature);
  document.getElementById('generateFromAPIBtn').addEventListener('click', generateAPICreature);
  document.getElementById('chaosBeastBtn').addEventListener('click', generateChaosBeast);
  document.getElementById('newCreatureBtn').addEventListener('click', () => document.getElementById('creatureSheet').classList.add('hidden'));

  // Encuentros
  document.getElementById('generateEncounterBtn').addEventListener('click', generateAPIEncounter); 
  document.getElementById('newEncounterBtn').addEventListener('click', () => document.getElementById('encounterSheet').classList.add('hidden'));
  
  // UI
  document.getElementById('toggleTheme').addEventListener('click', () => document.body.classList.toggle('dark-mode'));
}

// Rellena los selectores de Raza, Clase, etc.
function fillSelectors() {
    Object.keys(DND_DATA.races).forEach(race => {
        document.getElementById('raceSelect').innerHTML += `<option value="${race}">${race}</option>`;
    });
    Object.keys(DND_DATA.classes).forEach(cls => {
        document.getElementById('classSelect').innerHTML += `<option value="${cls}">${cls}</option>`;
    });
    Object.keys(DND_DATA.backgrounds).forEach(bg => {
        document.getElementById('backgroundSelect').innerHTML += `<option value="${bg}">${bg}</option>`;
    });
    DND_DATA.alignments.forEach(align => {
        document.getElementById('alignmentSelect').innerHTML += `<option value="${align}">${align}</option>`;
    });
}

// ===== LÓGICA DE PERSONAJES (Integración API) =====

/**
 * Genera un personaje completo, obteniendo datos enriquecidos de la API.
 * @param {string} type - 'random', 'custom', o 'chaos'.
 */
async function createCharacter(type) {
  // 1. Obtener opciones iniciales y slugs (índices de API)
  const availableRaces = Object.keys(DND_DATA.races);
  const availableClasses = Object.keys(DND_DATA.classes);
  const raceName = document.getElementById('raceSelect').value || randomFromArray(availableRaces);
  const className = document.getElementById('classSelect').value || randomFromArray(availableClasses);
  const bgName = document.getElementById('backgroundSelect').value || randomFromArray(Object.keys(DND_DATA.backgrounds));
  
  // Usar el índice de DND_DATA para asegurar la compatibilidad con la API
  const raceIndex = DND_DATA.races[raceName].index;
  const classIndex = DND_DATA.classes[className].index;

  // 2. FETCH DE DATOS ENRIQUECIDOS
  console.log(`📡 Fetcheando detalles de ${raceName} (${raceIndex}) y ${className} (${classIndex}) de la API...`);
  const [raceAPI, classAPI] = await Promise.all([
      DND_API.getRaceDetails(raceIndex),
      DND_API.getClassDetails(classIndex)
  ]);

  // Si fallan las APIs, usar datos locales
  const localRace = DND_DATA.races[raceName];
  const localClass = DND_DATA.classes[className];
  const finalRace = raceAPI || localRace;
  const finalClass = classAPI || localClass;
  const bgDetails = DND_DATA.backgrounds[bgName];
  
  // 3. Generar stats y aplicar CHAOS si es necesario
  let stats = generateStats(); 
  if (type === 'chaos') { 
    Object.keys(stats).forEach(k => stats[k] = rollDice(20) + rollDice(6)); 
  }

  // 4. Generar propiedades NFT y aplicar bonus
  const nftProps = generateNFTProperties(raceName, className);
  const primaryStatKey = finalClass.primaryStat || 'strength'; // Usar stat de la API o local
  
  if (nftProps.statBoost > 0) {
      stats[nftProps.statToBoost] += nftProps.statBoost;
      console.log(`✨ Rareza aplicada: Bonus +${nftProps.statBoost} a ${nftProps.statToBoost.toUpperCase()}`);
  }
  
  // 5. Calcular stats finales y HP
  const mods = Object.fromEntries(
      DND_DATA.stats.map(stat => [stat, calculateModifier(stats[stat])])
  );
  
  let hp = (finalClass.hitDie || 6) + mods.constitution;
  let ac = 10 + mods.dexterity; // Armadura base

  // 6. Compilar personaje
  const char = {
    name: document.getElementById('charName').value || generateRandomName(raceName, className),
    race: raceName,
    class: className,
    background: bgName,
    level: 1,
    alignment: document.getElementById('alignmentSelect').value || randomFromArray(DND_DATA.alignments),
    stats: stats,
    mods: mods,
    hp: hp, 
    ac: ac, 
    speed: finalRace.speed || 30,
    // Usar datos enriquecidos o locales
    racialTraits: finalRace.racialTraits || localRace.traits, 
    classFeatures: finalClass.features || localClass.features,
    bgDetails: bgDetails,
    skills: bgDetails.skills.join(', '), 
    saves: `${primaryStatKey.substring(0, 3).toUpperCase()} +${mods[primaryStatKey]}`,
    equipment: ["Arma Simple", "Ropa Común", `${rollDice(4)}d4 po`].concat(bgDetails.equipment || []),
    nft: nftProps, 
    timestamp: new Date().getTime()
  };
  
  // Añadir rasgos NFT al personaje
  if (char.nft.specialTrait) char.racialTraits.push(`NFT (Rareza): ${char.nft.specialTrait}`);
  if (char.nft.visualTrait) char.classFeatures.push(`NFT (Visual): ${char.nft.visualTrait}`);
  
  currentCharacter = char;
  updateUI(char);
  saveToHistory(char);
  return char;
}

// ===== LÓGICA DE BESTIARIO Y ENCUENTROS (API REAL) =====

/**
 * Genera un monstruo aleatorio con detalles completos de la API (Open5e).
 */
async function generateAPICreature() {
    console.log("📡 Buscando monstruo aleatorio en Open5e...");
    
    // 1. Obtener la lista de monstruos
    const monsterList = await DND_API.listAllMonsters();
    if (monsterList.length === 0) {
        alert("No se pudo obtener la lista de monstruos de la API. Usando monstruo local.");
        generateLocalCreature();
        return;
    }

    // 2. Elegir un monstruo al azar de CR decente para detalles
    const filteredList = monsterList.filter(m => DND_API.calculateXP(m.cr) >= 200 || m.cr === "0.5");
    const randomMonster = randomFromArray(filteredList.length > 0 ? filteredList : monsterList);

    // 3. Obtener detalles completos
    const monsterDetails = await DND_API.getMonsterDetails(randomMonster.index);

    if (monsterDetails) {
        displayCreature(monsterDetails);
    } else {
        alert("Fallo al obtener detalles del monstruo de la API. Usando monstruo local.");
        generateLocalCreature();
    }
}


/**
 * Genera un encuentro basándose en la dificultad, el nivel del grupo y los monstruos de la API.
 */
async function generateAPIEncounter() {
    console.log("🔥 Generando encuentro usando la lista de monstruos de Open5e...");
    
    const partyLevel = parseInt(document.getElementById('partyLevel').value) || 3;
    const partySize = parseInt(document.getElementById('partySize').value) || 4;
    const desiredDifficulty = document.getElementById('difficultySelect').value || 'moderado';

    if (partyLevel < 1 || partySize < 1) {
        alert("El nivel y tamaño del grupo deben ser al menos 1.");
        return;
    }

    // 1. Calcular XP Objetivo
    const difficultyThresholds = DND_DATA.difficultyThresholds; 
    const levelXP = difficultyThresholds[partyLevel] || difficultyThresholds[5];
    const targetXP = levelXP[desiredDifficulty] * partySize;
    let currentXP = 0;
    const encounterMonsters = [];
    let attempts = 0;

    const monsterList = await DND_API.listAllMonsters();
    if (monsterList.length === 0) {
        alert("No se pudo obtener la lista de monstruos de la API. No se puede generar el encuentro.");
        return;
    }

    // 2. Algoritmo para generar el encuentro (greedy approach)
    const availableMonsters = monsterList.filter(m => DND_API.calculateXP(m.cr) > 0);

    while (currentXP < targetXP * 0.9 && attempts < 50) {
        const monster = randomFromArray(availableMonsters);
        const monsterXP = DND_API.calculateXP(monster.cr);
        
        // Evita monstruos que excedan demasiado el límite
        if (monsterXP * 1.5 < targetXP || currentXP === 0) {
             encounterMonsters.push(monster);
             currentXP += monsterXP;
        }
        attempts++;
    }

    // 3. Cálculo del multiplicador de dificultad por grupo (según DMG)
    let difficultyMultiplier = 1;
    if (encounterMonsters.length >= 15) difficultyMultiplier = 4;
    else if (encounterMonsters.length >= 7) difficultyMultiplier = 3;
    else if (encounterMonsters.length >= 3) difficultyMultiplier = 2;
    
    const effectiveXP = Math.round(currentXP * difficultyMultiplier);
    
    let finalDifficultyLabel = desiredDifficulty.toUpperCase();
    if (effectiveXP > targetXP * 1.5) finalDifficultyLabel = '¡MORTAL EXTREMO!';
    else if (effectiveXP > targetXP * 1.25) finalDifficultyLabel = 'DESAFIANTE PESADO';


    currentEncounter = {
        name: `Encuentro de Nivel ${partyLevel}`,
        difficulty: finalDifficultyLabel,
        totalXP: effectiveXP,
        monsters: encounterMonsters
    };

    displayEncounter(currentEncounter);
}

// ----------------------------------------------------------------------
// RESTO DE FUNCIONES (UI/UX, NFT, Local Fallback)
// ----------------------------------------------------------------------

function generateNFTProperties(race, charClass) {
    let roll = Math.random();
    let rarity = 'Común';
    let cumulative = 0;

    for (const key of RARITY_KEYS) {
        cumulative += NFT_RARITIES[key].probability;
        if (roll <= cumulative) {
            rarity = key;
            break;
        }
    }

    const rarityData = NFT_RARITIES[rarity];
    const stats = DND_DATA.stats;
    const statToBoost = randomFromArray(stats);
    let specialTrait = null;
    let visualTrait = null;

    if (Math.random() < rarityData.specialChance) {
        const traits = [
            `Aura de ${rarity} (${rarityData.statBoost} daño elemental extra)`,
            `Vínculo Mítico (${rarityData.statBoost} a la CA)`,
            `Ascenso Astral (Una vez por día, ignorar daño letal)`,
        ];
        specialTrait = randomFromArray(traits);
    }
    
    if (rarityData.statBoost > 0 && rarityData.statBoost <= 2) {
        visualTrait = 'Capa de Polvo de Estrellas';
    } else if (rarityData.statBoost > 2) {
        visualTrait = 'Armadura de Energía Pura (Shiny)';
    }


    return {
        rarity: rarity,
        color: rarityData.color,
        statBoost: rarityData.statBoost,
        statToBoost: statToBoost,
        specialTrait: specialTrait,
        visualTrait: visualTrait,
        tokenID: Math.floor(Math.random() * 10000000),
        minted: false
    };
}

// Simulación de minteo NFT
function mintNFT(character) {
    console.log("💰 Minteando NFT...");
    const mintBtn = document.getElementById('mintNFTBtn');
    mintBtn.disabled = true;
    mintBtn.textContent = 'Minteando... (Simulado)';
    
    setTimeout(() => {
        character.nft.minted = true;
        mintBtn.textContent = '✅ NFT Minteado en Blockchain';
        mintBtn.classList.remove('btn-gold');
        mintBtn.classList.add('btn-success');
        updateNFTDisplay(character.nft);
        alert(`¡Felicidades! Tu personaje ha sido minteado con el Token ID: ${character.nft.tokenID}`);
        saveToHistory(character);
    }, 2000);
}

// Actualiza la visualización de la ficha del personaje
function updateUI(character) {
    const setText = (id, text) => document.getElementById(id).textContent = text;
    const updateStat = (statId, modId, statVal, modVal) => {
        setText(statId, statVal);
        setText(modId, formatModifier(modVal));
    };
    const fillList = (id, items) => {
        const ul = document.getElementById(id);
        ul.innerHTML = items.map(item => `<li>${item}</li>`).join('');
    };

    setText('displayName', character.name);
    setText('displayRace', character.race);
    setText('displayClass', character.class);
    setText('displayLevel', character.level);
    setText('displayBackground', character.background);
    setText('displayAlignment', character.alignment);

    updateStat('statStr', 'modStr', character.stats.strength, character.mods.strength);
    updateStat('statDex', 'modDex', character.stats.dexterity, character.mods.dexterity);
    updateStat('statCon', 'modCon', character.stats.constitution, character.mods.constitution);
    updateStat('statInt', 'modInt', character.stats.intelligence, character.mods.intelligence);
    updateStat('statWis', 'modWis', character.stats.wisdom, character.mods.wisdom);
    updateStat('statCha', 'modCha', character.stats.charisma, character.mods.charisma);

    setText('displayHP', character.hp);
    setText('displayAC', character.ac);
    setText('displaySpeed', `${character.speed} ft`);
    setText('displayInit', formatModifier(character.mods.dexterity));
    
    setText('displaySaves', character.saves);
    setText('displaySkills', character.skills);
    
    fillList('equipment', character.equipment);
    fillList('racialTraits', character.racialTraits);
    fillList('classFeatures', character.classFeatures);
    
    setText('backgroundName', character.background);
    setText('backgroundFeature', character.bgDetails.feature);
    fillList('backgroundEquipment', character.bgDetails.equipment);
    
    updatePowerLevel(character.stats);
    updateNFTDisplay(character.nft);
    fetchAIPortrait(character.race, character.class);

    document.getElementById('characterSheet').classList.remove('hidden');
    document.getElementById('characterSheet').scrollIntoView({ behavior: 'smooth' });
}

function updateNFTDisplay(nft) {
    document.getElementById('nftSection').classList.remove('hidden');
    document.getElementById('nftRarity').textContent = nft.rarity.toUpperCase();
    document.getElementById('nftRarity').className = `rarity-badge ${nft.color}`;
    document.getElementById('nftTokenID').textContent = nft.tokenID;
    document.getElementById('nftBonus').textContent = nft.statBoost > 0 ? `+${nft.statBoost} a ${nft.statToBoost.toUpperCase()}` : 'Ninguno';
    document.getElementById('nftSpecialTrait').textContent = nft.specialTrait || 'Ninguno';
    document.getElementById('nftShinyFoil').textContent = nft.visualTrait || 'Estándar';

    const mintBtn = document.getElementById('mintNFTBtn');
    if (nft.minted) {
        mintBtn.disabled = true;
        mintBtn.textContent = '✅ NFT Minteado';
        mintBtn.classList.remove('btn-gold');
        mintBtn.classList.add('btn-success');
    } else {
        mintBtn.disabled = false;
        mintBtn.textContent = '✨ Mint NFT';
        mintBtn.classList.remove('btn-success');
        mintBtn.classList.add('btn-gold');
    }
}

function updatePowerLevel(stats) {
    const totalScore = Object.values(stats).reduce((sum, val) => sum + val, 0);
    const maxScore = 108; // 6 * 18
    const percentage = Math.min(100, (totalScore / maxScore) * 100);
    const powerBar = document.getElementById('powerBar');
    const powerLevel = document.getElementById('powerLevel');

    powerBar.style.width = `${percentage}%`;

    let levelText = '⭐ Novato';
    if (percentage > 90) levelText = '👑 Legendario';
    else if (percentage > 75) levelText = '🔥 Épico';
    else if (percentage > 50) levelText = '💪 Veterano';
    else if (percentage > 30) levelText = '🔨 Aprendiz';
    
    powerLevel.textContent = levelText;
}

// Simulación de obtención de imagen por IA
function fetchAIPortrait(race, charClass) {
    DND_API.Images.getEpicImage(`${race} ${charClass} NFT`, 'character').then(url => {
        document.getElementById('aiPortrait').src = url;
    });
}

// Lógica de bestiario local (fallback)
function generateLocalCreature() {
    const m = {
        name: "Guerrero Esqueleto (Local)",
        type: "No-muerto",
        cr: "1/4",
        xp: 50,
        ac: 13,
        hp: 13,
        speed: "30 ft",
        stats: { str: 10, dex: 14, con: 15, int: 6, wis: 8, cha: 5 },
        environments: ["Mazmorra", "Cementerio"],
        traits: ["Inmunidad a veneno", "Vision en la oscuridad"],
        actions: ["Espada Corta: +4, 1d6 + 2 cortante"],
        defenses: "Vulnerabilidad a Daño Contundente.",
        legendaryActions: ["Ninguna"]
    };
    displayCreature(m);
}

// Función para generar una criatura CHAOS
function generateChaosBeast() {
    const allTypes = ['Aberración', 'Dragón', 'Gigante', 'Feérico', 'Cieno'];
    const allEnvironments = ['Plano Abismal', 'Bosque', 'Montaña', 'Ciudad'];
    const randomCR = Math.floor(Math.random() * 20) + 1; // Hasta CR 20
    const randomXP = DND_API.calculateXP(String(randomCR));

    const creature = {
      name: `${generateRandomName('Orco', 'Bárbaro')} el Desquiciado`,
      type: randomFromArray(allTypes),
      cr: String(randomCR),
      xp: randomXP,
      ac: 10 + rollDice(10),
      hp: rollDice(10) * randomCR,
      speed: `${rollDice(6) * 5} ft`,
      stats: { str: rollDice(20), dex: rollDice(20), con: rollDice(20), int: rollDice(20), wis: rollDice(20), cha: rollDice(20) },
      environments: [randomFromArray(allEnvironments)],
      traits: [`Piel Caótica (AC variable)`, `Ataque Elemental (2d10 daño extra de fuego)`],
      actions: [`Ataque de Púas: +${calculateModifier(rollDice(20))}, ${rollDice(6)}d${rollDice(12)} de daño perforante.`],
      defenses: "Resistencia Total (50%) a todos los daños.",
      legendaryActions: [`Aliento de Caos: 3/día.`],
    };
    displayCreature(creature);
}

function displayCreature(m) {
    document.getElementById('creatureSheet').classList.remove('hidden');
    document.getElementById('creatureSheet').scrollIntoView({ behavior: "smooth" });
    currentCreature = m;

    const setText = (id, text) => document.getElementById(id).textContent = text;
    const fillList = (id, items) => {
        const ul = document.getElementById(id);
        ul.innerHTML = items.map(item => `<li>${item}</li>`).join('');
    };

    setText('creatureName', m.name);
    setText('creatureType', m.type);
    setText('creatureCR', m.cr);
    setText('creatureXP', `${m.xp} XP`);
    
    setText('creatureAC', m.ac);
    setText('creatureHP', m.hp);
    setText('creatureSpeed', m.speed);
    
    setText('creatureStr', m.stats.str);
    setText('creatureDex', m.stats.dex);
    setText('creatureCon', m.stats.con);
    setText('creatureInt', m.stats.int);
    setText('creatureWis', m.stats.wis);
    setText('creatureCha', m.stats.cha);

    fillList('creatureActions', m.actions || ["Ninguna"]);
    fillList('creatureTraits', m.traits || ["Ninguno"]);
    fillList('creatureLegendaryActions', m.legendaryActions || ["Ninguna"]);
    setText('creatureDefenses', m.defenses || "Ninguna");
    setText('creatureEnvironment', m.environments.join(', ') || "Cualquiera");

    updateCreatureImage(m.name, m.type);
}

function updateCreatureImage(name, type) {
     DND_API.Images.getEpicImage(`${name} ${type} monster`, 'monster').then(url => {
        document.getElementById('creaturePortrait').src = url;
    });
}

function displayEncounter(encounter) {
    document.getElementById('encounterSheet').classList.remove('hidden');
    document.getElementById('encounterSheet').scrollIntoView({ behavior: "smooth" });

    document.getElementById('encounterName').textContent = encounter.name;
    document.getElementById('encounterDifficulty').textContent = encounter.difficulty;
    document.getElementById('encounterXP').textContent = encounter.totalXP;

    const ul = document.getElementById('encounterMonstersList');
    ul.innerHTML = '';
    
    // Contar duplicados
    const monsterCounts = encounter.monsters.reduce((acc, m) => {
        const key = `${m.name} (CR ${m.cr})`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    Object.keys(monsterCounts).forEach(key => {
        const count = monsterCounts[key];
        ul.innerHTML += `<li>${count} x ${key}</li>`;
    });
}

// Funciones de historial, descarga y JSON (Simplificadas)

function saveToHistory(character) {
    let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Reemplazar si ya existe (por minteo NFT) o añadir
    const existingIndex = history.findIndex(c => c.timestamp === character.timestamp);
    if (existingIndex > -1) {
        history[existingIndex] = character;
    } else {
        history.push(character);
    }
    
    // Limitar historial a 10 entradas
    if (history.length > 10) history = history.slice(history.length - 10);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    loadHistory(); // Recargar el modal
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    if (history.length === 0) {
        historyList.innerHTML = '<p>Aún no hay personajes guardados.</p>';
        return;
    }

    history.sort((a, b) => b.timestamp - a.timestamp); // Más reciente primero

    history.forEach(char => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <h4>${char.name}</h4>
            <p>${char.race} ${char.class} (Nivel ${char.level})</p>
            <p>Rareza: <span class="rarity-badge ${char.nft.color}">${char.nft.rarity}</span></p>
            <button class="btn btn-secondary btn-small" onclick="loadCharacterFromHistory(${char.timestamp})">Cargar</button>
        `;
        historyList.appendChild(item);
    });
}

function loadCharacterFromHistory(timestamp) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const char = history.find(c => c.timestamp === timestamp);
    if (char) {
        currentCharacter = char;
        updateUI(char);
        toggleHistory();
    }
}

function toggleHistory() {
    document.getElementById('historyModal').classList.toggle('hidden');
}

function downloadPDF() {
    if (!currentCharacter) {
        alert("Primero genera un personaje.");
        return;
    }
    alert("Simulación de Descarga PDF: Lógica de jsPDF Omitida por Brevedad. Usa Exportar JSON.");
}

function exportJSON() {
    if (!currentCharacter) {
        alert("Primero genera un personaje.");
        return;
    }
    const filename = `${currentCharacter.name.replace(/ /g, '_')}_NFT_DND5e.json`;
    const jsonString = JSON.stringify(currentCharacter, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`¡Personaje exportado a ${filename}!`);
}
