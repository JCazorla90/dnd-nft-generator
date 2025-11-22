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

// ===== ESTADO GLOBAL =====
let currentCharacter = null;
let currentCreature = null;
let currentEncounter = [];
let currentEdition = '5e';
const STORAGE_KEY = 'dnd_character_history';

// ===== 🎲 UTILIDADES BÁSICAS =====
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function calculateModifier(stat) {
  return Math.floor((stat - 10) / 2);
}

// ===== 📊 GENERADOR DE ESTADÍSTICAS (4d6, quita el más bajo) =====
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

// ===== ✨ GENERADOR DE NOMBRES ÉPICOS (Depende de dnd-data.js) =====
function generateEpicName() {
    const prefixes = ['Elfo', 'Orco', 'Dragón', 'Guerrero', 'Mago', 'Sacerdote', 'El', 'La'];
    const suffixes = ['de la Luz', 'de las Sombras', 'Dorado', 'Férreo', 'Impredecible', 'del Sur', 'del Norte'];
    
    const namePart1 = randomFromArray(prefixes);
    const namePart2 = randomFromArray(suffixes);
    
    return `${namePart1} ${namePart2}`;
}

// ===== 🧑 GENERADOR DE PERSONAJES (Función principal, detallada en dnd-data.js) =====
function generateCharacter() {
    console.log('⚔️ Generando personaje...');
    
    // Obtener valores de la UI (si están disponibles)
    const selectedRace = document.getElementById('raceSelect') ? document.getElementById('raceSelect').value : randomFromArray(Object.keys(DND_DATA.races));
    const selectedClass = document.getElementById('classSelect') ? document.getElementById('classSelect').value : randomFromArray(Object.keys(DND_DATA.classes));
    const selectedLevel = document.getElementById('levelSelect') ? parseInt(document.getElementById('levelSelect').value) : 1;
    
    // 1. Generar estadísticas base
    const stats = generateStats();

    // 2. Aplicar ajustes raciales
    const racialBonus = DND_DATA.races[selectedRace].stats;
    const finalStats = {
        strength: stats.strength + (racialBonus.str || 0),
        dexterity: stats.dexterity + (racialBonus.dex || 0),
        constitution: stats.constitution + (racialBonus.con || 0),
        intelligence: stats.intelligence + (racialBonus.int || 0),
        wisdom: stats.wisdom + (racialBonus.wis || 0),
        charisma: stats.charisma + (racialBonus.cha || 0)
    };
    
    // 3. Simular progresión (simplificado para este ejemplo)
    let hp = 0;
    const hitDie = DND_DATA.classes[selectedClass].hitDie;
    const conMod = calculateModifier(finalStats.constitution);
    
    // Nivel 1: Máximo de Hit Die + Con Mod
    hp += hitDie + conMod;
    
    // Niveles 2+: Promedio de Hit Die + Con Mod
    for (let i = 2; i <= selectedLevel; i++) {
        hp += Math.floor(hitDie / 2) + 1 + conMod;
    }

    // 4. Crear el objeto final del personaje
    const character = {
        id: Date.now(),
        name: generateRandomName(selectedRace, selectedClass), // Nombre aleatorio
        race: selectedRace,
        class: selectedClass,
        level: selectedLevel,
        stats: finalStats,
        hp: Math.max(1, hp), // Asegurarse de que el HP no sea negativo
        ac: 10 + calculateModifier(finalStats.dexterity) + DND_DATA.classes[selectedClass].armorBonus,
        profBonus: Math.floor((selectedLevel - 1) / 4) + 2,
        // ... otros datos (completados en dnd-data.js)
        racialTraits: DND_DATA.races[selectedRace].traits,
        classFeatures: DND_DATA.classes[selectedClass].features,
        equipment: DND_DATA.classes[selectedClass].equipment,
        background: randomFromArray(Object.keys(DND_DATA.backgrounds)),
        rarity: randomFromArray(['Común', 'Raro', 'Épico', 'Legendario'])
    };
    
    // Guardar estado global y mostrar
    currentCharacter = character;
    // La función 'displayCharacter' se asume que está en 'dnd-data.js'
    if (typeof displayCharacter !== 'undefined') {
        displayCharacter(character);
    } else {
        console.error("Error: Función 'displayCharacter' no definida.");
        // Mostrar datos básicos en consola si la función no existe.
        document.getElementById('characterSheet').innerHTML = `<h2>${character.name}</h2><pre>${JSON.stringify(character, null, 2)}</pre>`;
        document.getElementById('characterSheet').classList.remove('hidden');
    }
}

// ===== 👹 GENERADOR DE BESTIARIO CHAOS =====
// Esta función se activará con el botón de acento (CHAOS)
function generateChaosBeast() {
  console.log('🌀 Generando criatura CHAOS...');
  
  const allTypes = ['Aberración', 'Bestia', 'Dragón', 'Demonio', 'Gigante', 'Humanoide', 'No-muerto', 'Monstruosidad'];
  const allEnvironments = ['Mazmorra', 'Bosque', 'Montaña', 'Pantano', 'Subterráneo'];
  
  const randomType = randomFromArray(allTypes);
  const randomEnvironment = randomFromArray(allEnvironments);
  const randomCR = rollDice(30); // CR aleatorio de 1 a 30
  
  const creature = {
    name: `${generateEpicName()} el Terrible (CAOS)`,
    type: randomType,
    cr: randomCR,
    environment: randomEnvironment,
    hp: rollDice(20) * randomCR,
    ac: 10 + rollDice(10),
    attacks: [
      `Ataque Caótico ${rollDice(6)}d${rollDice(12)} (Daño puro)`,
      `Habilidad Especial: Desintegración (${rollDice(4)}d${rollDice(8)} de fuerza)`
    ],
    description: `Una criatura ${randomType} de CR ${randomCR} que habita en ${randomEnvironment}. Su forma es ${randomFromArray(['cambiante', 'horrible', 'multicolor'])} y ¡TOTALMENTE IMPREDECIBLE!`,
    // Añadir stats aleatorios de criatura para consistencia
    stats: { 
        str: rollDice(25), dex: rollDice(25), con: rollDice(25), 
        int: rollDice(25), wis: rollDice(25), cha: rollDice(25) 
    },
    actions: [], // Se llenan con los ataques
    traits: [`Aura de Miedo (CD ${10 + Math.floor(randomCR / 2)})`],
    editions: { "5e": true }
  };
  
  // Guardar estado global y mostrar
  currentCreature = creature;
  if (typeof displayCreature !== 'undefined') {
    displayCreature(creature);
  } else {
    document.getElementById('bestiarySheet').innerHTML = `<h2>${creature.name}</h2><pre>${JSON.stringify(creature, null, 2)}</pre>`;
    document.getElementById('bestiarySheet').classList.remove('hidden');
  }
  
  console.log('✅ Criatura CHAOS generada:', creature);
}


// ===== 👹 MUESTRA UNA CRIATURA (asumida en bestiary.js, pero la definimos aquí para el botón) =====
function displayCreature(creature) {
    if (!creature) return;

    document.getElementById('creatureName').textContent = creature.name;
    document.getElementById('creatureCR').textContent = creature.cr;
    document.getElementById('creatureType').textContent = creature.type;
    document.getElementById('creatureHP').textContent = creature.hp;
    document.getElementById('creatureAC').textContent = creature.ac;
    document.getElementById('creatureSpeed').textContent = creature.speed || '30 ft';

    // Estadísticas
    document.getElementById('creatureSTR').textContent = `${creature.stats.str} (${calculateModifier(creature.stats.str)})`;
    document.getElementById('creatureDEX').textContent = `${creature.stats.dex} (${calculateModifier(creature.stats.dex)})`;
    document.getElementById('creatureCON').textContent = `${creature.stats.con} (${calculateModifier(creature.stats.con)})`;
    document.getElementById('creatureINT').textContent = `${creature.stats.int} (${calculateModifier(creature.stats.int)})`;
    document.getElementById('creatureWIS').textContent = `${creature.stats.wis} (${calculateModifier(creature.stats.wis)})`;
    document.getElementById('creatureCHA').textContent = `${creature.stats.cha} (${calculateModifier(creature.stats.cha)})`;

    // Rasgos
    const traitsList = document.getElementById('creatureTraits');
    traitsList.innerHTML = '';
    const traits = creature.traits || [];
    traits.forEach(trait => {
        const li = document.createElement('li');
        li.textContent = trait;
        traitsList.appendChild(li);
    });

    // Acciones/Ataques
    const actionsList = document.getElementById('creatureActions');
    actionsList.innerHTML = '';
    const actions = creature.actions || creature.attacks || [];
    actions.forEach(action => {
        const li = document.createElement('li');
        li.textContent = action;
        actionsList.appendChild(li);
    });
    
    // Otros detalles
    document.getElementById('creatureDefenses').textContent = 
        `Inmunidades: ${(creature.immunities || []).join(', ') || 'Ninguna'} / Resistencias: ${(creature.resistances || []).join(', ') || 'Ninguna'}`;
    document.getElementById('creatureEnvironment').textContent = (creature.environment || []).join(', ');
    document.getElementById('creatureDescription').textContent = creature.description || '';

    document.getElementById('bestiarySheet').classList.remove('hidden');
    document.getElementById('bestiarySheet').scrollIntoView({ behavior: 'smooth' });
    console.log('✅ Ficha de Criatura mostrada');
}

// ===== 🌐 MUESTRA ENCUENTRO (asumida en dnd-apis.js) =====
function displayEncounter(encounter) {
    if (!encounter || encounter.monsters.length === 0) {
        document.getElementById('encounterList').innerHTML = '<p class="trait-description">No se pudo generar un encuentro. Intenta con un nivel diferente.</p>';
        document.getElementById('encounterDifficulty').textContent = '—';
        document.getElementById('encounterXP').textContent = '—';
        document.getElementById('encounterSheet').classList.remove('hidden');
        return;
    }

    const list = document.getElementById('encounterList');
    list.innerHTML = '';
    encounter.monsters.forEach(monster => {
        const li = document.createElement('li');
        li.className = 'encounter-monster-item';
        li.innerHTML = `
            <strong>${monster.name}</strong> 
            <span class="cr-badge">CR ${monster.cr}</span>
            <span class="type-text">(${monster.type})</span>
        `;
        list.appendChild(li);
    });

    document.getElementById('encounterDifficulty').textContent = encounter.difficulty;
    document.getElementById('encounterXP').textContent = `${encounter.totalXP} XP (Objetivo: ${encounter.targetXP} XP)`;
    
    currentEncounter = encounter.monsters;
    document.getElementById('encounterSheet').classList.remove('hidden');
    document.getElementById('encounterSheet').scrollIntoView({ behavior: 'smooth' });
    console.log('✅ Encuentro mostrado');
}

// ===== 📖 HISTORIAL Y MODALES =====

function saveToHistory(character) {
    let history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    // Limitar el historial para que no sea excesivamente largo
    history.unshift(character);
    history = history.slice(0, 50); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function openHistoryModal() {
    const modal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    historyList.innerHTML = '';

    if (history.length === 0) {
        historyList.innerHTML = '<p class="trait-description">Tu historial de personajes está vacío.</p>';
    } else {
        history.forEach(char => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <span class="history-name">
                    ${char.name}
                    <span class="rarity-badge rarity-${char.rarity.toLowerCase()}">${char.rarity}</span>
                </span>
                <span class="history-details">${char.race} ${char.class} (Nv. ${char.level})</span>
                <button class="btn btn-small btn-primary" data-id="${char.id}">Mostrar</button>
            `;
            // Listener para el botón "Mostrar" del historial
            item.querySelector('button').addEventListener('click', () => {
                // Encontrar el personaje por ID en el historial
                const savedChar = history.find(c => c.id === char.id);
                if (savedChar) {
                    currentCharacter = savedChar;
                    displayCharacter(savedChar);
                    modal.classList.add('hidden');
                }
            });
            historyList.appendChild(item);
        });
    }

    modal.classList.remove('hidden');
}

function closeHistoryModal() {
    document.getElementById('historyModal').classList.add('hidden');
}

// ===== 💡 INICIALIZACIÓN DE EVENTOS (El punto CLAVE para que los botones funcionen) =====
function initEventListeners() {
    // 1. SELECTOR DE PESTAÑAS
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

            button.classList.add('active');
            const target = button.getAttribute('data-tab');
            document.getElementById(target).classList.remove('hidden');
        });
    });

    // 2. BOTONES DE GENERACIÓN DE PERSONAJE
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) generateBtn.addEventListener('click', generateCharacter);
    
    // 3. BOTONES DE BESTIARIO
    const newCreatureBtn = document.getElementById('newCreatureBtn');
    if (newCreatureBtn) newCreatureBtn.addEventListener('click', () => {
        // En este contexto, se asume que esta función usa DND_BESTIARY o DND_MONSTERS
        // y selecciona una criatura aleatoria para ser mostrada por 'displayCreature'.
        // Aquí llamamos a la función genérica si está disponible, o simplemente mostramos la hoja vacía.
        if (typeof generateRandomMonster !== 'undefined') {
            generateRandomMonster(); // Asumiendo que esta función existe en 'bestiary.js' o 'dnd-monsters.js'
        } else {
             console.error("Error: Función 'generateRandomMonster' no definida.");
        }
    });

    const chaosBtn = document.getElementById('chaosBtn');
    if (chaosBtn) chaosBtn.addEventListener('click', generateChaosBeast);

    // 4. BOTONES DE ENCUENTRO
    const generateEncounterBtn = document.getElementById('generateEncounterBtn');
    if (generateEncounterBtn) generateEncounterBtn.addEventListener('click', async () => {
        const level = parseInt(document.getElementById('partyLevel').value) || 1;
        const size = parseInt(document.getElementById('partySize').value) || 4;
        
        // Asumiendo que la API está configurada en dnd-apis.js
        if (typeof DND_API !== 'undefined' && DND_API.generateEncounter) {
            const encounter = await DND_API.generateEncounter(level, size);
            displayEncounter(encounter);
        } else {
            document.getElementById('encounterList').innerHTML = '<p class="trait-description">Error: DND_API.generateEncounter no está disponible. Comprueba el archivo dnd-apis.js.</p>';
            document.getElementById('encounterSheet').classList.remove('hidden');
        }
    });

    // 5. BOTONES DE MODAL Y UTILIDADES
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) historyBtn.addEventListener('click', openHistoryModal);

    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeHistoryModal);

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('historyModal');
        if (event.target === modal) {
            closeHistoryModal();
        }
    });
    
    const themeToggleBtn = document.getElementById('toggleTheme');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            // Cambiar el texto del botón
            const isDark = document.body.classList.contains('dark-mode');
            themeToggleBtn.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
        });
    }

    // Inicializar el tema basado en la preferencia
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️ Modo Claro';
    } else if (themeToggleBtn) {
        themeToggleBtn.textContent = '🌙 Modo Oscuro';
    }
}


// ===== 🚀 INICIO DE LA APLICACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    // Inicializar el personaje si hay uno guardado o generar uno al inicio
    if (!currentCharacter) {
        generateCharacter(); 
    }
    // Abrir la pestaña de Personajes por defecto
    const defaultTab = document.querySelector('.tab-btn[data-tab="characterTab"]');
    if(defaultTab) defaultTab.click();
});
