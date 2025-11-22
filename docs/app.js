// ===========================================
// 🎲 D&D CHARACTER FORGE - SISTEMA COMPLETO FINAL
// Versión con rutas corregidas y bestiario funcional
// ===========================================

'use strict';

// La mayoría de las utilidades, DND_DATA y DND_BESTIARY se asumen cargadas
// desde los scripts externos (dnd-data.js, bestiary.js, dnd-apis.js).

// ===== ESTADO GLOBAL (Necesario para el seguimiento) =====
let currentCharacter = null;
let currentCreature = null;
let currentEncounter = [];
let currentEdition = '5e';
const STORAGE_KEY = 'dnd_character_history';

// NOTA IMPORTANTE: Las funciones generateStats, randomFromArray, calculateModifier,
// displayCharacter, saveToHistory y openHistoryModal se asumen accesibles globalmente
// desde 'dnd-data.js' y las utilidades. Si no existen, causarán un fallo.
// Por ahora, solo incluiremos la lógica principal del bestiario que faltaba.

// ===========================================
// 👹 LÓGICA DEL BESTIARIO
// ===========================================

// Esta función usa el array DND_MONSTERS del archivo dnd-monsters.js
function generateRandomMonster() {
    console.log('👹 Generando criatura aleatoria...');
    // Verificar si DND_MONSTERS está cargado desde dnd-monsters.js
    if (typeof DND_MONSTERS === 'undefined' || DND_MONSTERS.length === 0) {
        console.error("Error: El array DND_MONSTERS no está definido o está vacío. Asegúrate de que 'dnd-monsters.js' se cargue ANTES de 'app.js'.");
        return;
    }

    const randomCreature = randomFromArray(DND_MONSTERS);
    
    // Convertir el objeto simple en un formato más completo para la visualización
    const creature = {
        name: randomCreature.name,
        type: randomCreature.type,
        cr: randomCreature.cr,
        hp: randomCreature.hp,
        ac: randomCreature.ac,
        speed: randomCreature.speed,
        stats: randomCreature.stats,
        traits: randomCreature.traits || [],
        actions: randomCreature.actions || [],
        description: `Un ${randomCreature.name} de tipo ${randomCreature.type}, se encuentra habitualmente en ${randomCreature.environments.join(', ')}.`,
        environment: randomCreature.environments || [],
        // Usar la función de utilidad si existe, si no, usar un valor simple
        rarity: typeof randomFromArray !== 'undefined' ? randomFromArray(['Común', 'Raro', 'Épico', 'Legendario']) : 'Raro'
    };

    currentCreature = creature;
    // Asumimos que displayCreature está en 'bestiary.js' o es global.
    if (typeof displayCreature !== 'undefined') {
        displayCreature(creature);
    } else {
        console.error("Error: Función 'displayCreature' no definida.");
        document.getElementById('bestiarySheet').innerHTML = `<h2>${creature.name}</h2><pre>${JSON.stringify(creature, null, 2)}</pre>`;
        document.getElementById('bestiarySheet').classList.remove('hidden');
    }
}

// Función para generar una criatura CHAOS (Se mantiene la que definiste antes)
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
    stats: chaosStats,
    attacks: [
      `Ataque Caótico ${rollDice(6)}d${rollDice(12)} (Daño puro)`,
      `Habilidad Especial: Desintegración (${rollDice(4)}d${rollDice(8)} de fuerza)`
    ],
    description: `Una abominación ${randomType} de CR ${randomCR} que opera fuera de las leyes de la física. ¡TOTALMENTE IMPREDECIBLE!`,
    traits: [`Aura de Miedo (CD ${10 + Math.floor(randomCR / 2)})`, 'Inmunidad a todo daño mundano'],
    rarity: 'Legendario'
  };
  
  currentCreature = creature;
  if (typeof displayCreature !== 'undefined') {
    displayCreature(creature);
  } else {
    document.getElementById('bestiarySheet').innerHTML = `<h2>${creature.name}</h2><pre>${JSON.stringify(creature, null, 2)}</pre>`;
    document.getElementById('bestiarySheet').classList.remove('hidden');
  }
}

// Función para generar un encuentro (usa la lógica de dnd-apis.js)
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
            document.getElementById('encounterList').innerHTML = '<p class="trait-description">Error de conexión o datos en la API. Intenta más tarde.</p>';
            document.getElementById('encounterSheet').classList.remove('hidden');
        }
    } else {
        document.getElementById('encounterList').innerHTML = '<p class="trait-description">Error: DND_API o displayEncounter no están disponibles. Revisa la carga de `dnd-apis.js` y `bestiary.js`.</p>';
        document.getElementById('encounterSheet').classList.remove('hidden');
    }
}


// ===========================================
// 💡 INICIALIZACIÓN DE EVENTOS (El punto CLAVE)
// ===========================================

function initEventListeners() {
    // 1. SELECTOR DE PESTAÑAS (Funciona en todos los casos)
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

            e.currentTarget.classList.add('active');
            const target = e.currentTarget.getAttribute('data-tab');
            document.getElementById(target).classList.remove('hidden');
        });
    });

    // 2. BOTÓN PRINCIPAL DE PERSONAJE
    const generateBtn = document.getElementById('generateBtn');
    // Revisión de la función: Si 'generateCharacter' no está en 'app.js', debe ser global.
    if (generateBtn && typeof generateCharacter !== 'undefined') {
        generateBtn.addEventListener('click', generateCharacter);
    } else {
        console.error("Error: Botón 'generateBtn' o función 'generateCharacter' no encontrados.");
    }
    
    // 3. BOTÓN DE HISTORIAL
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn && typeof openHistoryModal !== 'undefined') {
        historyBtn.addEventListener('click', openHistoryModal);
    } else {
        console.error("Error: Botón 'historyBtn' o función 'openHistoryModal' no encontrados.");
    }

    // 4. BESTIARIO: Nueva Criatura (CORREGIDO)
    const newCreatureBtn = document.getElementById('newCreatureBtn');
    if (newCreatureBtn) newCreatureBtn.addEventListener('click', generateRandomMonster);

    // 5. BESTIARIO: Botón de Caos (CORREGIDO)
    const chaosBtn = document.getElementById('chaosBtn');
    if (chaosBtn) chaosBtn.addEventListener('click', generateChaosBeast);

    // 6. ENCUENTRO: Generar (CORREGIDO)
    const generateEncounterBtn = document.getElementById('generateEncounterBtn');
    if (generateEncounterBtn) generateEncounterBtn.addEventListener('click', generateEncounter);

    // 7. MODAL: Cerrar (Asegura el cierre)
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

    // 8. TEMA
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
    
    // Si la función de generación está disponible, llama a la función principal al inicio
    if (typeof generateCharacter !== 'undefined') {
        generateCharacter(); 
    } else {
        console.warn("Advertencia: No se pudo generar el personaje inicial. Verifique la carga de 'dnd-data.js'.");
    }

    // Abrir la pestaña de Personajes por defecto
    const defaultTab = document.querySelector('.tab-btn[data-tab="characterTab"]');
    if(defaultTab) defaultTab.click();
});
