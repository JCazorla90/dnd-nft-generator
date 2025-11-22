// ==========================================
// 🎲 D&D CHARACTER FORGE - SISTEMA COMPLETO FINAL
// Lógica sincronizada con IDs, estilo, API de Imagen y Módulo NFT
// ==========================================

'use strict';

// ===== ESTADO GLOBAL =====
let currentCharacter = null;
let currentCreature = null;
let currentEdition = '5e';
const HISTORY_KEY = 'dnd_character_history';
let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];


// ===== 💎 CONSTANTES NFT =====
const NFT_RARITIES = {
    'Legendaria': { probability: 0.01, specialChance: 0.50, color: 'rarity-legendaria' },
    'Épica': { probability: 0.04, specialChance: 0.20, color: 'rarity-epica' },
    'Rara': { probability: 0.15, specialChance: 0.10, color: 'rarity-rara' },
    'Infrecuente': { probability: 0.30, specialChance: 0.05, color: 'rarity-infrecuente' },
    'Común': { probability: 0.50, specialChance: 0.01, color: 'rarity-comun' },
};
const RARITY_KEYS = Object.keys(NFT_RARITIES).reverse(); // Común a Legendaria para iteración


// ===== INICIO =====
document.addEventListener('DOMContentLoaded', () => {
  console.log("⚔️ Forja inicializada. Conectando eventos.");
  
  if (typeof DND_DATA === 'undefined' || typeof DND_API === 'undefined') {
    console.error("❌ Error: Faltan scripts de datos/API. Asegúrate de incluir dnd-data.js y dnd-apis.js.");
    return;
  }

  setupListeners();
  fillSelectors();
  loadHistory();
});


// ===== LISTENERS =====
function setupListeners() {
  document.getElementById('randomBtn').addEventListener('click', () => createCharacter('random'));
  document.getElementById('customGenerateBtn').addEventListener('click', () => createCharacter('custom'));
  document.getElementById('chaosBtn').addEventListener('click', () => createCharacter('chaos'));
  document.getElementById('toggleCustomBtn').addEventListener('click', () => {
    document.getElementById('customPanel').classList.toggle('hidden');
  });

  document.getElementById('regenPortrait').addEventListener('click', () => {
    if (currentCharacter) updatePortrait(currentCharacter.race, currentCharacter.class);
  });
  document.getElementById('downloadBtn').addEventListener('click', downloadPDF);
  document.getElementById('historyBtn').addEventListener('click', toggleHistory);
  document.querySelector('.close-modal').addEventListener('click', toggleHistory);
  document.getElementById('mintNFTBtn').addEventListener('click', () => {
    if (currentCharacter && !currentCharacter.nft.minted) {
        mintNFT(currentCharacter);
    }
  });
  document.getElementById('exportJSONBtn').addEventListener('click', exportJSON);

  // Bestiario
  document.getElementById('generateCreatureBtn').addEventListener('click', generateLocalCreature);
  document.getElementById('generateFromAPIBtn').addEventListener('click', generateAPICreature);
  document.getElementById('chaosBeastBtn').addEventListener('click', generateChaosBeast);
  document.getElementById('regenCreaturePortrait').addEventListener('click', () => {
    if (currentCreature) updateCreatureImage(currentCreature.name, currentCreature.type);
  });
  document.getElementById('newCreatureBtn').addEventListener('click', () => document.getElementById('creatureSheet').classList.add('hidden'));
  
  // UI
  document.getElementById('toggleTheme').addEventListener('click', () => document.body.classList.toggle('dark-mode'));
}

// ===== LÓGICA DE PERSONAJES (Integración NFT) =====
function createCharacter(type) {
  // 1. Obtener opciones (usando selectores o aleatorio)
  const raceName = document.getElementById('raceSelect').value || randomFromArray(Object.keys(DND_DATA.races));
  const className = document.getElementById('classSelect').value || randomFromArray(Object.keys(DND_DATA.classes));
  const bgName = document.getElementById('backgroundSelect').value || randomFromArray(Object.keys(DND_DATA.backgrounds));
  
  let stats = DND_DATA.generateStats(); 

  if (type === 'chaos') {
    Object.keys(stats).forEach(k => stats[k] = rollDice(20) + rollDice(6));
  }

  // 2. GENERAR PROPIEDADES NFT
  const nftProps = generateNFTProperties();
  
  // 3. Aplicar modificadores de base
  const mods = {
      strength: calculateModifier(stats.strength),
      dexterity: calculateModifier(stats.dexterity),
      constitution: calculateModifier(stats.constitution),
      intelligence: calculateModifier(stats.intelligence),
      wisdom: calculateModifier(stats.wisdom),
      charisma: calculateModifier(stats.charisma),
  };
  
  let hp = DND_DATA.classes[className].hitDie + mods.constitution;
  let ac = 10 + mods.dexterity;

  // 4. APLICAR BONIFICADOR NFT A STATS FINALES
  hp += nftProps.bonus;
  ac += nftProps.bonus;

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
    speed: DND_DATA.races[raceName].speed,
    traits: DND_DATA.races[raceName].traits || [],
    features: DND_DATA.classes[className].features || [],
    bgDetails: DND_DATA.backgrounds[bgName],
    skills: DND_DATA.skills.slice(0, 5).join(', '), // Simplificado
    saves: `${className.substring(0, 3)} +${mods[className.toLowerCase()] || 0}`, // Simplificado
    equipment: ["Arma Simple", "Ropa Común", `${rollDice(4)}d4 po`],
    nft: nftProps, 
    timestamp: new Date().getTime()
  };

  currentCharacter = char;
  updateUI(char);
  saveToHistory(char);
  return char;
}

// ===== 💎 LÓGICA NFT =====

function generateNFTProperties() {
    let rarity = 'Común';
    const rand = Math.random();
    let cumulativeProb = 0;
    
    for (const key of RARITY_KEYS) {
        cumulativeProb += NFT_RARITIES[key].probability;
        if (rand < cumulativeProb) {
            rarity = key;
            break;
        }
    }

    const rarityData = NFT_RARITIES[rarity];

    let isShiny = false;
    let isFoil = false;
    if (Math.random() < rarityData.specialChance) {
        if (Math.random() < 0.5) {
            isShiny = true;
        } else {
            isFoil = true;
        }
    }
    
    // Bonus variable basado en la rareza (ej: Común = 1-4, Legendaria = 5-20)
    const rarityIndex = RARITY_KEYS.indexOf(rarity) + 1; 
    const specialBonus = rollDice(rarityIndex * 4); 

    return {
        rarity: rarity,
        isShiny: isShiny,
        isFoil: isFoil,
        bonus: specialBonus,
        tokenID: Math.floor(Math.random() * 9000000 + 1000000), 
        blockchain: 'Ethereum (Simulado)',
        minted: false,
        txHash: null
    };
}

async function mintNFT(char) {
    if (char.nft.minted) return;

    console.log("Attempting to mint NFT...");
    const mintButton = document.getElementById('mintNFTBtn');
    mintButton.textContent = "Conectando Wallet... 🦊";
    mintButton.disabled = true;

    try {
        // Simular conexión a Metamask con Ethers.js (aunque no sea funcional en GitHub Pages, simula la UX)
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // await provider.send("eth_requestAccounts", []);
        
        // Simular Transacción
        const mockTransactionHash = '0x' + Array(64).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');

        await new Promise(resolve => setTimeout(resolve, 3000));
        
        char.nft.minted = true;
        char.nft.txHash = mockTransactionHash;
        
        updateNFTDisplay(char.nft);
        mintButton.textContent = "NFT Minteado! ✅";
        mintButton.style.backgroundColor = 'var(--forest-green)';
        mintButton.disabled = true;

        alert(`🎉 NFT Minteado!\nToken ID: ${char.nft.tokenID}\nHash Simulado: ${mockTransactionHash.substring(0, 10)}...`);
    } catch (error) {
        console.error("Error en simulación de Minting:", error);
        mintButton.textContent = "Fallo de Minting ❌";
        mintButton.disabled = false;
        mintButton.style.backgroundColor = 'var(--blood-red)';
    }
}

function updateNFTDisplay(nft) {
    document.getElementById('nftSection').classList.remove('hidden');
    
    const rarityBadge = document.getElementById('nftRarity');
    const rarityData = NFT_RARITIES[nft.rarity];
    
    rarityBadge.textContent = nft.rarity.toUpperCase();
    rarityBadge.className = `rarity-badge ${rarityData.color}`;

    setText('nftTokenID', nft.tokenID);
    setText('nftBonus', `HP y AC aumentados por +${nft.bonus}`);
    setText('nftBlockchain', nft.blockchain);
    
    const shinyFoilText = document.getElementById('nftShinyFoil');
    shinyFoilText.textContent = '';
    shinyFoilText.className = 'shiny-foil-text';

    if (nft.isShiny) {
        shinyFoilText.textContent = "🌟 SHINY EDITION 🌟";
        shinyFoilText.classList.add('is-shiny');
    } else if (nft.isFoil) {
        shinyFoilText.textContent = "✨ FOIL EDITION ✨";
        shinyFoilText.classList.add('is-foil');
    }
}


// ===== ACTUALIZACIÓN DE INTERFAZ (UI) =====
async function updateUI(char) {
  document.getElementById('characterSheet').classList.remove('hidden');
  document.getElementById('characterSheet').scrollIntoView({ behavior: "smooth" });

  // Textos principales
  setText('displayName', char.name);
  setText('displayRace', char.race);
  setText('displayClass', char.class);
  setText('displayLevel', char.level);
  setText('displayBackground', char.background);
  setText('displayAlignment', char.alignment);
  
  // Combate
  setText('displayHP', char.hp); 
  setText('displayAC', char.ac);
  setText('displaySpeed', `${char.speed} ft`);
  setText('displayInit', formatModifier(char.mods.dexterity));

  // Stats y Mods
  updateStat('Str', char.stats.strength, char.mods.strength);
  updateStat('Dex', char.stats.dexterity, char.mods.dexterity);
  updateStat('Con', char.stats.constitution, char.mods.constitution);
  updateStat('Int', char.stats.intelligence, char.mods.intelligence);
  updateStat('Wis', char.stats.wisdom, char.mods.wisdom);
  updateStat('Cha', char.stats.charisma, char.mods.charisma);

  // Detalles
  setText('displaySaves', char.saves);
  setText('displaySkills', char.skills);
  fillList('equipment', char.equipment);
  fillList('racialTraits', char.traits);
  fillList('classFeatures', char.features);
  
  setText('backgroundName', char.background);
  setText('backgroundFeature', char.bgDetails.feature);
  fillList('backgroundEquipment', char.bgDetails.equipment || []);
  
  // NFT
  updateNFTDisplay(char.nft);

  // Visuales
  updatePortrait(char.race, char.class);
  updatePowerLevel(char.stats);
}

// Lógica de Imagen para Personajes (Usa la API Simulación)
async function updatePortrait(race, charClass) {
  const img = document.getElementById('aiPortrait');
  if (!img || !DND_API.Images) return;
  img.src = "https://placehold.co/300x400/1a0f08/d4af37?text=Invocando+Héroe...";
  
  const query = `${race} ${charClass}`;
  const url = await DND_API.Images.getEpicImage(query, 'character'); 
  img.src = url;
}

// ===== LÓGICA DE BESTIARIO (Funciones Mínimas) =====

function generateLocalCreature() {
  if (typeof DND_MONSTERS === 'undefined' || DND_MONSTERS.length === 0) return alert("❌ Faltan datos de monstruos locales."); 
  const m = randomFromArray(DND_MONSTERS);
  displayCreature(m);
}

async function generateAPICreature() {
    const m = await DND_API.fetchRandomAPIMonster();
    if (m) {
        displayCreature(m);
    } else {
        alert("Fallo al obtener criatura de la API.");
    }
}

function generateChaosBeast() {
  const creature = {
    name: `${generateRandomName('default', 'Engendro')} Caótico`,
    type: "Monstruosidad",
    cr: rollDice(30),
    xp: rollDice(30) * 1000,
    ac: 10 + rollDice(10),
    hp: rollDice(20) * 10,
    speed: `${rollDice(6) * 5} ft`,
    stats: { 
        str: rollDice(20) + 5, dex: rollDice(20) + 5, con: rollDice(20) + 5, 
        int: rollDice(20) + 5, wis: rollDice(20) + 5, cha: rollDice(20) + 5 
    },
    actions: [`Tentáculo de Ilimitada Furia (+${rollDice(8)}, ${rollDice(6)}d8 de daño)`],
    traits: ["Regeneración Caótica", "Inmunidad Psíquica"],
    legendaryActions: ["Ataque de Pura Locura (x3)"],
    defenses: "Resistencia a todo daño elemental.",
    environment: "Plano Exterior"
  };
  displayCreature(creature);
}


function displayCreature(m) {
  document.getElementById('creatureSheet').classList.remove('hidden');
  document.getElementById('creatureSheet').scrollIntoView({ behavior: "smooth" });
  currentCreature = m;

  // Textos
  setText('creatureName', m.name);
  setText('creatureType', m.type);
  setText('creatureCR', m.cr);
  setText('creatureXP', `${m.xp || (m.cr * 500)} XP`);
  
  // Combate
  setText('creatureAC', m.ac);
  setText('creatureHP', m.hp);
  setText('creatureSpeed', m.speed);
  
  // Stats (Asumiendo que 'm' tiene una propiedad 'stats' con FUE, DES, etc.)
  setText('creatureStr', m.stats.str);
  setText('creatureDex', m.stats.dex);
  setText('creatureCon', m.stats.con);
  setText('creatureInt', m.stats.int);
  setText('creatureWis', m.stats.wis);
  setText('creatureCha', m.stats.cha);

  // Listas
  fillList('creatureActions', m.actions || ["Ninguna"]);
  fillList('creatureTraits', m.traits || ["Ninguno"]);
  fillList('creatureLegendaryActions', m.legendaryActions || ["Ninguna"]);
  setText('creatureDefenses', m.defenses || "Ninguna");
  setText('creatureEnvironment', m.environment || "Cualquiera");

  // Visuales
  updateCreatureImage(m.name, m.type);
}

async function updateCreatureImage(name, type) {
    const creatureName = name || (currentCreature ? currentCreature.name : null);
    if (!creatureName || !DND_API.Images) return;

    const img = document.getElementById('creaturePortrait');
    if (!img) return;
    img.src = "https://placehold.co/300x400/1a0f08/d4af37?text=Invocando+Bestia...";

    const query = `${creatureName} ${type}`;
    const url = await DND_API.Images.getEpicImage(query, 'creature');
    img.src = url;
}

// ===== FUNCIONES AUXILIARES (DOM y Estado) =====
function fillSelectors() {
    const races = Object.keys(DND_DATA.races);
    const classes = Object.keys(DND_DATA.classes);
    const backgrounds = Object.keys(DND_DATA.backgrounds);
    const alignments = DND_DATA.alignments;

    [...races, ...classes, ...backgrounds, ...alignments].forEach(item => {
        let targetId = '';
        if (races.includes(item)) targetId = 'raceSelect';
        else if (classes.includes(item)) targetId = 'classSelect';
        else if (backgrounds.includes(item)) targetId = 'backgroundSelect';
        else if (alignments.includes(item)) targetId = 'alignmentSelect';

        const select = document.getElementById(targetId);
        if (select) {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            select.appendChild(option);
        }
    });
}

function updateStat(suffix, val, mod) {
    setText(`stat${suffix}`, val);
    setText(`mod${suffix}`, formatModifier(mod));
}

function updatePowerLevel(stats) {
    const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
    const max = 18 * 6; // Max stats possible in this generation model
    const powerPercent = Math.min(100, (total / max) * 100);
    
    let levelText = '⭐ Novato';
    if (powerPercent > 80) levelText = '✨ Leyenda';
    else if (powerPercent > 65) levelText = '👑 Maestro';
    else if (powerPercent > 50) levelText = '⚔️ Veterano';

    document.getElementById('powerBar').style.width = `${powerPercent}%`;
    setText('powerLevel', levelText);
}

function setText(id, t) { 
  const e = document.getElementById(id); 
  if(e) e.textContent = t; 
}

function fillList(id, arr) { 
  const ul = document.getElementById(id); 
  if(ul) ul.innerHTML = (arr && arr.length) ? arr.map(i => `<li>${i}</li>`).join('') : '<li>—</li>'; 
}

function saveToHistory(char) { 
    history.unshift(char);
    if (history.length > 10) history.pop(); 
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadHistory() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    if (history.length === 0) {
        list.innerHTML = '<p>El historial está vacío. ¡Forja a tu primer héroe!</p>';
        return;
    }
    history.forEach((char, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `<strong>${char.name}</strong> • ${char.race} ${char.class} • Rareza NFT: ${char.nft.rarity}`;
        item.addEventListener('click', () => {
            currentCharacter = char;
            updateUI(char);
            toggleHistory();
        });
        list.appendChild(item);
    });
}

function toggleHistory() {
    loadHistory(); // Recarga el historial antes de mostrar
    document.getElementById('historyModal').classList.toggle('hidden');
}

function downloadPDF() {
    // Implementación mínima de PDF para evitar errores
    if (!currentCharacter) return;
    try {
        const doc = new window.jspdf.jsPDF();
        doc.text(`Ficha de Personaje: ${currentCharacter.name}`, 10, 10);
        doc.text(`Clase: ${currentCharacter.class} | Raza: ${currentCharacter.race}`, 10, 20);
        doc.text(`Rareza NFT: ${currentCharacter.nft.rarity}`, 10, 30);
        doc.save(`${currentCharacter.name}_ficha.pdf`);
    } catch (e) {
        alert("El generador de PDF (jsPDF) falló. Revisa que el script esté cargado.");
        console.error("Error al generar PDF:", e);
    }
}

function exportJSON() {
    // Exportar el personaje completo como JSON
    if (!currentCharacter) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentCharacter, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${currentCharacter.name}_data.json`);
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
