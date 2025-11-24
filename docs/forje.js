/**
 * ═══════════════════════════════════════════════════════════════════
 * 🧙 D&D CHARACTER FORGE - FORGE LOGIC (ROBUST)
 * Controla la página de generación específica (forge.html)
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

// ===== INICIALIZACIÓN SEGURA =====
window.addEventListener('load', () => {
    console.log("🔨 Forge cargada. Iniciando sistemas...");

    // Pequeño retardo para ver la animación (estético) y asegurar carga de datos
    setTimeout(() => {
        try {
            // 1. Ocultar Loader
            const loader = document.getElementById('loader');
            const panel = document.getElementById('controlPanel');
            
            if (loader) loader.style.display = 'none';
            if (panel) panel.style.display = 'block';

            // 2. Verificar Datos Críticos
            if (typeof DND_DATA === 'undefined') {
                throw new Error("El archivo 'dnd-data.js' no se ha cargado correctamente.");
            }

            // 3. Configurar UI Inicial
            setupForgeUI();

            // 4. Detectar Modo Automático (si venimos del index)
            const mode = sessionStorage.getItem('launch_mode');
            if (mode === 'random' || mode === 'chaos') {
                console.log(`🚀 Auto-lanzando modo: ${mode}`);
                generateCharacter(mode);
                // Limpiar para que no se ejecute al recargar
                sessionStorage.removeItem('launch_mode');
            }

        } catch (error) {
            console.error("❌ Error crítico en Forge:", error);
            alert("Error iniciando la Forja: " + error.message + "\n\nVerifica que todos los archivos .js estén en la misma carpeta.");
            // Intentar mostrar la interfaz de todos modos
            if(document.getElementById('loader')) document.getElementById('loader').style.display = 'none';
            if(document.getElementById('controlPanel')) document.getElementById('controlPanel').style.display = 'block';
        }
    }, 800);
});

// ===== CONFIGURACIÓN UI =====
function setupForgeUI() {
    const edition = sessionStorage.getItem('launch_edition') || '5e';
    const indicator = document.getElementById('modeIndicator');
    if(indicator) indicator.textContent = `Forja Activa: D&D ${edition}`;

    // Poblar selectores del panel personalizado
    populateSelect('raceSelect', Object.keys(DND_DATA.races));
    populateSelect('classSelect', Object.keys(DND_DATA.classes));
    populateSelect('backgroundSelect', Object.keys(DND_DATA.backgrounds));
    populateSelect('alignmentSelect', DND_DATA.alignments);
}

function populateSelect(id, options) {
    const select = document.getElementById(id);
    if (!select) return;
    
    // Limpiar excepto la primera opción (Aleatorio)
    select.innerHTML = '<option value="">Aleatorio</option>';
    
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
}

// ===== LÓGICA DE GENERACIÓN =====
function generateCharacter(mode = 'custom') {
    // Validar datos
    if (typeof DND_DATA === 'undefined') {
        alert("Error crítico: Datos no cargados.");
        return;
    }

    let charRace, charClass, charBg, charAlign, charName;

    // A. MODO CAOS
    if (mode === 'chaos') {
        charRace = randomFromArray(Object.keys(DND_DATA.races));
        charClass = randomFromArray(Object.keys(DND_DATA.classes));
        charBg = randomFromArray(Object.keys(DND_DATA.backgrounds));
        charAlign = randomFromArray(DND_DATA.alignments);
    } 
    // B. MODO CUSTOM (Lee los inputs)
    else if (mode === 'custom') {
        charName = document.getElementById('charName').value;
        charRace = document.getElementById('raceSelect').value || randomFromArray(Object.keys(DND_DATA.races));
        charClass = document.getElementById('classSelect').value || randomFromArray(Object.keys(DND_DATA.classes));
        charBg = document.getElementById('backgroundSelect').value || randomFromArray(Object.keys(DND_DATA.backgrounds));
        charAlign = document.getElementById('alignmentSelect').value || randomFromArray(DND_DATA.alignments);
    }
    // C. MODO RANDOM (Por defecto)
    else {
        charRace = randomFromArray(Object.keys(DND_DATA.races));
        charClass = randomFromArray(Object.keys(DND_DATA.classes));
        charBg = randomFromArray(Object.keys(DND_DATA.backgrounds));
        charAlign = randomFromArray(DND_DATA.alignments);
    }

    // Generar Stats
    let stats;
    if (mode === 'chaos') {
        // Stats rotos para modo caos (3d20)
        stats = {
            strength: rollDice(20) + 5, dexterity: rollDice(20) + 5, constitution: rollDice(20) + 5,
            intelligence: rollDice(20) + 5, wisdom: rollDice(20) + 5, charisma: rollDice(20) + 5
        };
    } else {
        stats = generateStats(); // De dnd-data.js
    }

    // Calcular Mods
    const mods = {
        str: Math.floor((stats.strength - 10) / 2),
        dex: Math.floor((stats.dexterity - 10) / 2),
        con: Math.floor((stats.constitution - 10) / 2),
        int: Math.floor((stats.intelligence - 10) / 2),
        wis: Math.floor((stats.wisdom - 10) / 2),
        cha: Math.floor((stats.charisma - 10) / 2)
    };

    // Datos derivados
    const raceData = DND_DATA.races[charRace];
    const classData = DND_DATA.classes[charClass];
    const bgData = DND_DATA.backgrounds[charBg];

    // Construir Personaje
    const char = {
        name: charName || generateRandomName(charRace, charClass),
        race: charRace,
        class: charClass,
        background: charBg,
        alignment: charAlign,
        level: 1,
        hp: classData.hitDie + mods.con,
        ac: 10 + mods.dex,
        stats: stats,
        mods: mods,
        traits: raceData.traits || [],
        features: classData.features || [],
        equipment: ["Equipo de Aventurero"].concat(bgData.equipment || []),
        bgFeature: bgData.feature,
        skills: bgData.skills
    };

    updateUI(char);
}

// ===== ACTUALIZAR INTERFAZ =====
function updateUI(char) {
    const sheet = document.getElementById('characterSheet');
    sheet.classList.add('active'); // Mostrar ficha
    sheet.style.display = 'block'; // Forzar display
    
    // Scroll suave hacia la ficha
    sheet.scrollIntoView({ behavior: 'smooth' });

    // Textos
    setText('charName', char.name);
    setText('charRace', char.race);
    setText('charClass', char.class);
    setText('charHP', char.hp);
    setText('charAC', char.ac);

    // Stats
    updateStat('str', char.stats.strength, char.mods.str);
    updateStat('dex', char.stats.dexterity, char.mods.dex);
    updateStat('con', char.stats.constitution, char.mods.con);
    updateStat('int', char.stats.intelligence, char.mods.int);
    updateStat('wis', char.stats.wisdom, char.mods.wis);
    updateStat('cha', char.stats.charisma, char.mods.cha);

    // Listas
    const listContainer = document.getElementById('abilitiesList');
    listContainer.innerHTML = '';

    // Helper para añadir items
    const addItem = (title, text, icon) => {
        listContainer.innerHTML += `
            <div class="ability-item">
                <div class="ability-name">${icon} ${title}</div>
                <div style="font-size:0.9rem; color:#2a1a0f;">${text}</div>
            </div>
        `;
    };

    // Llenar listas
    char.traits.forEach(t => addItem(t, "Rasgo Racial", "🧬"));
    char.features.forEach(f => addItem(f, "Rasgo de Clase", "⚔️"));
    addItem(char.bgFeature, `Trasfondo: ${char.background}`, "📜");
    
    // Equipo
    const equipList = char.equipment.join(', ');
    addItem("Equipo", equipList, "🎒");

    // Imagen (Si existe la función en dnd-apis.js)
    if (typeof fetchAIPortrait === 'function') {
        fetchAIPortrait(char.race, char.class);
    } else {
        // Fallback simple si la API no está
        const img = document.getElementById('aiPortrait');
        if(img) img.src = `https://placehold.co/320x420/3e2723/ffd700?text=${char.race}`;
    }
}

// ===== UTILIDADES DOM =====
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updateStat(id, val, mod) {
    setText(`${id}Val`, val);
    setText(`${id}Mod`, (mod >= 0 ? '+' : '') + mod);
}

function exportToJSON() {
    alert("Funcionalidad de guardar JSON simulada.");
}

// Helpers locales por si dnd-data.js falla
function randomFromArray(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rollDice(sides) { return Math.floor(Math.random() * sides) + 1; }
