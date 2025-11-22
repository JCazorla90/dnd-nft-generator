// ===========================================
// 🎲 D&D CHARACTER FORGE - SISTEMA COMPLETO FINAL
// Versión con todos los enlaces de botones e IDs corregidos
// ===========================================

'use strict';

// Las utilidades (randomFromArray, rollDice, calculateModifier) y las funciones
// principales de generación (generateStats, generateCharacter, displayCharacter, 
// saveToHistory, openHistoryModal) se asumen cargadas desde 'dnd-data.js'.
// Los datos (DND_MONSTERS) se asumen cargados desde 'dnd-monsters.js'.
// La lógica del bestiario (displayCreature, displayEncounter) se asume cargada desde 'bestiary.js'.
// Las APIs (DND_API) se asumen cargadas desde 'dnd-apis.js'.

// ===== ESTADO GLOBAL (Necesario para el seguimiento) =====
let currentCharacter = null;
let currentCreature = null;
let currentEncounter = [];
let currentEdition = '5e';
const STORAGE_KEY = 'dnd_character_history';


// ===========================================
// 🧍 LÓGICA DE PERSONAJE AVANZADA
// ===========================================

/**
 * Función para generar un personaje de Caos con stats muy altos.
 * Se asume que generateStats está definida en dnd-data.js
 */
function generateChaosCharacter() {
    console.log('🌀 Generando personaje CHAOS...');
    
    // Función de tirada muy alta para Caos: Tira 4d6, quita el más bajo, y suma un bonus
    const rollChaosStat = () => {
        const rolls = [rollDice(6), rollDice(6), rollDice(6), rollDice(6)];
        rolls.sort((a, b) => a - b);
        // Sumar el resultado de 3 dados más altos + un bonus (ej: 5)
        return rolls.slice(1).reduce((a, b) => a + b, 0) + rollDice(5); 
    };
    
    // Generar stats usando la tirada de caos
    const chaosStats = {
        strength: rollChaosStat(),
        dexterity: rollChaosStat(),
        constitution: rollChaosStat(),
        intelligence: rollChaosStat(),
        wisdom: rollChaosStat(),
        charisma: rollChaosStat()
    };
    
    // Si la función generateCharacter (en dnd-data.js) está disponible, la usamos
    if (typeof generateCharacter !== 'undefined') {
        // Llama a la función de generación normal, forzando los stats de caos
        generateCharacter({ 
            stats: chaosStats,
            name: `${generateRandomName('Random', 'Chaos')} el Innombrable`
        });
    } else {
        console.error("Error: Función 'generateCharacter' no definida en dnd-data.js.");
    }
}

/**
 * Función para generar personaje con opciones personalizadas (customGenerateBtn)
 * Asume que generateCharacter (en dnd-data.js) está disponible
 */
function generateCustomCharacter() {
    const customOptions = {
        name: document.getElementById('charName').value || null,
        race: document.getElementById('raceSelect').value || null,
        charClass: document.getElementById('classSelect').value || null,
        background: document.getElementById('backgroundSelect').value || null,
        alignment: document.getElementById('alignmentSelect').value || null,
    };

    if (typeof generateCharacter !== 'undefined') {
        generateCharacter(customOptions);
    } else {
        console.error("Error: Función 'generateCharacter' no definida en dnd-data.js.");
    }
}


// ===========================================
// 👹 LÓGICA DEL BESTIARIO
// ===========================================

/**
 * Genera una criatura aleatoria de la lista LOCAL (dnd-monsters.js)
 */
function generateRandomMonster() {
    console.log('🐺 Generando criatura aleatoria LOCAL...');
    // Verificar si DND_MONSTERS está cargado desde dnd-monsters.js
    if (typeof DND_MONSTERS === 'undefined' || DND_MONSTERS.length === 0) {
        console.error("Error: El array DND_MONSTERS no está definido o está vacío. Asegúrate de que 'dnd-monsters.js' se cargue ANTES de 'app.js'.");
        return;
    }

    const randomCreatureData = randomFromArray(DND_MONSTERS);
    
    // Mapear los datos al formato de criatura (asumiendo que displayCreature lo maneja)
    const creature = {
        name: randomCreatureData.name,
        type: randomCreatureData.type,
        cr: randomCreatureData.cr,
        xp: randomCreatureData.xp,
        hp: randomCreatureData.hp,
        ac: randomCreatureData.ac,
        speed: randomCreatureData.speed,
        stats: randomCreatureData.stats,
        traits: randomCreatureData.traits || [],
        actions: randomCreatureData.actions || [],
        description: `Un ${randomCreatureData.name} de tipo ${randomCreatureData.type}.`,
        environment: randomCreatureData.environments || [],
        rarity: randomFromArray(['Común', 'Raro', 'Épico']) 
    };

    currentCreature = creature;
    if (typeof displayCreature !== 'undefined') {
        displayCreature(creature);
    } else {
        console.error("Error: Función 'displayCreature' no definida. (Verifica bestiary.js)");
        document.getElementById('creatureSheet').innerHTML = `<h2>${creature.name}</h2><pre>${JSON.stringify(creature, null, 2)}</pre>`;
        document.getElementById('creatureSheet').classList.remove('hidden');
    }
}

/**
 * Función para generar un Monstruo de la API (Open5e)
 * Asume que DND_API está definido en dnd-apis.js
 */
async function generateMonsterFromAPI() {
    console.log('📡 Generando criatura de API (Open5e)...');
    
    if (typeof DND_API === 'undefined' || typeof DND_API.getMonsterDetails === 'undefined') {
        console.error("Error: DND_API no está disponible. Revisa la carga de `dnd-apis.js`.");
        document.getElementById('creatureName').textContent = 'Error de API';
        document.getElementById('creatureSheet').classList.remove('hidden');
        return;
    }
    
    try {
        // Llama a la API para obtener un monstruo aleatorio (simulación simple)
        const monsterList = await DND_API.listMonsters();
        const randomIndex = rollDice(monsterList.length) - 1;
        const randomMonsterIndex = monsterList[randomIndex].index;
        
        const creature = await DND_API.getMonsterDetails(randomMonsterIndex);
        
        if (creature && typeof displayCreature !== 'undefined') {
            currentCreature = creature;
            displayCreature(creature);
        } else {
            document.getElementById('creatureName').textContent = 'Fallo al obtener datos de API';
            document.getElementById('creatureSheet').classList.remove('hidden');
        }

    } catch (error) {
        console.error("Error al generar monstruo con API:", error);
        document.getElementById('creatureName').textContent = 'Error de conexión a la API';
        document.getElementById('creatureSheet').classList.remove('hidden');
    }
}


/**
 * Función para generar una criatura CHAOS (Engendro Chaos)
 * Se asume que randomFromArray y rollDice están definidas en dnd-data.js
 */
function generateChaosBeast() {
  console.log('🌀 Generando criatura CHAOS...');
  
  const allTypes = ['Aberración', 'Bestia', 'Dragón', 'Demonio', 'Gigante', 'Humanoide', 'No-muerto', 'Monstruosidad'];
  const allEnvironments = ['Mazmorra', 'Bosque', 'Montaña', 'Pantano', 'Subterráneo'];
  
  const randomType = randomFromArray(allTypes);
  const randomEnvironment = randomFromArray(allEnvironments);
  const randomCR = rollDice(30); 
  
  // Generar stats aleatorios altos para el Caos
  const chaosStats = { 
      str: rollDice(25), dex: rollDice(25), con: rollDice(25), 
      int: rollDice(25), wis: rollDice(25), cha: rollDice(25) 
  };
  
  const creature = {
    name: `${generateRandomName(randomType, 'Chaos')} el Innombrable`, 
    type: randomType,
    cr: randomCR,
    environment: [randomEnvironment],
    hp: rollDice(20) * randomCR,
    ac: 10 + rollDice(10),
    speed: "40 ft",
    stats: chaosStats,
    actions: [
      { name: "Ataque Caótico", desc: `El enemigo es golpeado por energía pura. +${rollDice(10)} al impacto, daño ${rollDice(6)}d${rollDice(12)} (Daño puro)`},
      { name: "Desintegración", desc: `El enemigo debe superar una tirada de salvación de CON CD ${10 + Math.floor(randomCR / 2)} o sufrir ${rollDice(4)}d${rollDice(8)} de fuerza.`}
    ],
    description: `Una abominación ${randomType} de CR ${randomCR} que opera fuera de las leyes de la física. ¡TOTALMENTE IMPREDECIBLE!`,
    traits: [`Aura de Miedo (CD ${10 + Math.floor(randomCR / 2)})`, 'Inmunidad a todo daño mundano'],
    rarity: 'Legendario'
  };
  
  currentCreature = creature;
  if (typeof displayCreature !== 'undefined') {
    displayCreature(creature);
  } else {
    document.getElementById('creatureSheet').innerHTML = `<h2>${creature.name}</h2><pre>${JSON.stringify(creature, null, 2)}</pre>`;
    document.getElementById('creatureSheet').classList.remove('hidden');
  }
}


/**
 * Función para generar un encuentro (usa la lógica de dnd-apis.js)
 * Asume que DND_API y displayEncounter están definidos.
 */
async function generateEncounter() {
    const level = parseInt(document.getElementById('partyLevel').value) || 1;
    const size = parseInt(document.getElementById('partySize').value) || 4;
    
    // Verificar si la API está disponible globalmente
    if (typeof DND_API !== 'undefined' && DND_API.generateEncounter && typeof displayEncounter !== 'undefined') {
        try {
            const encounter = await DND_API.generateEncounter(level, size);
            displayEncounter(encounter);
        } catch (error) {
            console.error("Error al generar encuentro con DND_API:", error);
            document.getElementById('encounterMonstersList').innerHTML = '<li class="trait-description">Error de conexión o datos en la API. Intenta más tarde.</li>';
            document.getElementById('encounterSheet').classList.remove('hidden');
        }
    } else {
        document.getElementById('encounterMonstersList').innerHTML = '<li class="trait-description">Error: DND_API o displayEncounter no están disponibles. Revisa la carga de `dnd-apis.js` y `bestiary.js` o que sus funciones estén definidas.</li>';
        document.getElementById('encounterSheet').classList.remove('hidden');
    }
}

// ===========================================
// 💡 INICIALIZACIÓN DE EVENTOS (El punto CLAVE)
// ===========================================

function initEventListeners() {

    // 1. PERSONAJES: Botón RANDOM (Usando el nuevo ID randomBtn)
    const randomBtn = document.getElementById('randomBtn');
    if (randomBtn && typeof generateCharacter !== 'undefined') {
        randomBtn.addEventListener('click', () => generateCharacter());
    } else {
        console.error("Error: Botón 'randomBtn' o función 'generateCharacter' no encontrados.");
    }
    
    // 2. PERSONAJES: Botón CHAOS (Usando el nuevo ID chaosCharacterBtn)
    const chaosCharacterBtn = document.getElementById('chaosCharacterBtn');
    if (chaosCharacterBtn) chaosCharacterBtn.addEventListener('click', generateChaosCharacter);

    // 3. PERSONAJES: Botón FORJAR HÉROE (CUSTOM)
    const customGenerateBtn = document.getElementById('customGenerateBtn');
    if (customGenerateBtn) customGenerateBtn.addEventListener('click', generateCustomCharacter);
    
    // 4. BESTIARIO: Monstruo LOCAL (generateCreatureBtn)
    const generateCreatureBtn = document.getElementById('generateCreatureBtn');
    if (generateCreatureBtn) generateCreatureBtn.addEventListener('click', generateRandomMonster);

    // 5. BESTIARIO: Monstruo API (generateFromAPIBtn)
    const generateFromAPIBtn = document.getElementById('generateFromAPIBtn');
    if (generateFromAPIBtn) generateFromAPIBtn.addEventListener('click', generateMonsterFromAPI);

    // 6. BESTIARIO: Engendro CHAOS (chaosBeastBtn)
    const chaosBeastBtn = document.getElementById('chaosBeastBtn');
    if (chaosBeastBtn) chaosBeastBtn.addEventListener('click', generateChaosBeast);
    
    // 7. BESTIARIO: OCULTAR FICHA (newCreatureBtn renombrado a hideCreatureBtn en el HTML corregido)
    const hideCreatureBtn = document.getElementById('hideCreatureBtn');
    if (hideCreatureBtn) hideCreatureBtn.addEventListener('click', () => {
        document.getElementById('creatureSheet').classList.add('hidden');
    });

    // 8. ENCUENTRO: Generar
    const generateEncounterBtn = document.getElementById('generateEncounterBtn');
    if (generateEncounterBtn) generateEncounterBtn.addEventListener('click', generateEncounter);
    
    // 9. ENCUENTRO: Nuevo Encuentro (Botón de la ficha de encuentro)
    const newEncounterBtn = document.getElementById('newEncounterBtn');
    if (newEncounterBtn) newEncounterBtn.addEventListener('click', generateEncounter);
    
    // 10. BOTÓN DE HISTORIAL
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn && typeof openHistoryModal !== 'undefined') {
        historyBtn.addEventListener('click', openHistoryModal);
    } else {
        console.error("Error: Botón 'historyBtn' o función 'openHistoryModal' no encontrados.");
    }
    
    // 11. CUSTOM PANEL TOGGLE
    const toggleCustomBtn = document.getElementById('toggleCustomBtn');
    const customPanel = document.getElementById('customPanel');
    if (toggleCustomBtn && customPanel) {
        toggleCustomBtn.addEventListener('click', () => {
            customPanel.classList.toggle('hidden');
            toggleCustomBtn.textContent = customPanel.classList.contains('hidden') ? '⚙️ Personalizar Opciones' : '❌ Ocultar Opciones';
        });
    }

    // 12. TEMA y MODAL (Lógica de cierre y tema)
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
        document.getElementById('historyModal').classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('historyModal');
        if (event.target === modal) {
            document.getElementById('historyModal').classList.add('hidden');
        }
    });
    
    const themeToggleBtn = document.getElementById('toggleTheme');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            themeToggleBtn.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
        });
    }
    
    // Inicializar el tema al cargar
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️ Modo Claro';
    } else if (themeToggleBtn) {
        themeToggleBtn.textContent = '🌙 Modo Oscuro';
    }
}


// ===== 🚀 INICIO DE LA APLICACIÓN (Aseguramos la llamada) =====
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    
    // Generar personaje inicial si la función está disponible
    if (typeof generateCharacter !== 'undefined') {
        generateCharacter(); 
    } else {
        console.warn("Advertencia: No se pudo generar el personaje inicial. Verifique la carga de 'dnd-data.js'.");
    }
});
