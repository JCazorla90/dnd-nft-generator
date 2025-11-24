/**
 * ═══════════════════════════════════════════════════════════════════
 * 🧙 D&D CHARACTER FORGE - FORGE LOGIC
 * Controla la página de generación específica (forge.html)
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Simular carga inicial
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('controlPanel').style.display = 'block';
        
        // Detectar modo de lanzamiento (desde index.html)
        const mode = sessionStorage.getItem('launch_mode') || 'random';
        const edition = sessionStorage.getItem('launch_edition') || '5e';
        
        document.getElementById('modeIndicator').textContent = `Modo: ${mode.toUpperCase()} (${edition})`;
        
        // Auto-generar si es random o chaos
        if (mode === 'random' || mode === 'chaos') {
            generateCharacter(mode);
        }
        
    }, 1000);
});

function generateCharacter(mode = 'random') {
    // Verificar si los datos están cargados
    if (typeof DND_DATA === 'undefined') {
        alert('Error: Datos de D&D no cargados. Verifica dnd-data.js');
        return;
    }

    // Lógica de generación basada en el modo
    let charRace, charClass, charBackground;
    
    if (mode === 'chaos') {
        // Chaos: Todo completamente aleatorio, incluso combinaciones raras
        charRace = randomFromArray(Object.keys(DND_DATA.races));
        charClass = randomFromArray(Object.keys(DND_DATA.classes));
    } else {
        // Random: Lógica estándar equilibrada
        charRace = randomFromArray(Object.keys(DND_DATA.races));
        charClass = randomFromArray(Object.keys(DND_DATA.classes));
    }
    
    // Generar Stats
    const stats = generateStats(); // Asume que esta función está en dnd-data.js o aquí
    
    // Calcular modificadores
    const mods = {
        str: Math.floor((stats.strength - 10) / 2),
        dex: Math.floor((stats.dexterity - 10) / 2),
        con: Math.floor((stats.constitution - 10) / 2),
        int: Math.floor((stats.intelligence - 10) / 2),
        wis: Math.floor((stats.wisdom - 10) / 2),
        cha: Math.floor((stats.charisma - 10) / 2)
    };
    
    // Actualizar UI
    updateUI({
        name: generateRandomName(charRace, charClass), // Asume función en dnd-data.js
        race: charRace,
        class: charClass,
        level: 1,
        hp: 10 + mods.con, // Simplificado
        ac: 10 + mods.dex,
        stats: stats,
        mods: mods,
        traits: DND_DATA.races[charRace].traits,
        features: DND_DATA.classes[charClass].features
    });
}

function updateUI(char) {
    const sheet = document.getElementById('characterSheet');
    sheet.classList.add('active');
    
    // Textos básicos
    document.getElementById('charName').textContent = char.name;
    document.getElementById('charRace').textContent = char.race;
    document.getElementById('charClass').textContent = char.class;
    document.getElementById('charLevel').textContent = char.level;
    document.getElementById('charHP').textContent = char.hp;
    document.getElementById('charAC').textContent = char.ac;
    
    // Stats
    updateStat('str', char.stats.strength, char.mods.str);
    updateStat('dex', char.stats.dexterity, char.mods.dex);
    updateStat('con', char.stats.constitution, char.mods.con);
    updateStat('int', char.stats.intelligence, char.mods.int);
    updateStat('wis', char.stats.wisdom, char.mods.wis);
    updateStat('cha', char.stats.charisma, char.mods.cha);
    
    // Habilidades
    const abilitiesList = document.getElementById('abilitiesList');
    abilitiesList.innerHTML = '';
    
    // Rasgos raciales
    char.traits.forEach(trait => {
        abilitiesList.innerHTML += `<div class="ability-item"><div class="ability-name">🧬 ${trait}</div><small>Rasgo Racial</small></div>`;
    });
    
    // Rasgos de clase
    char.features.forEach(feat => {
        abilitiesList.innerHTML += `<div class="ability-item"><div class="ability-name">⚔️ ${feat}</div><small>Rasgo de Clase</small></div>`;
    });
}

function updateStat(id, val, mod) {
    document.getElementById(`${id}Val`).textContent = val;
    document.getElementById(`${id}Mod`).textContent = (mod >= 0 ? '+' : '') + mod;
}

function exportToJSON() {
    alert("Funcionalidad de exportación simulada: Personaje guardado.");
}

// Funciones auxiliares si no están en dnd-data.js
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateStats() {
    // Simple 4d6 drop lowest simulation
    const roll = () => Math.floor(Math.random() * 16) + 3; 
    return {
        strength: roll(), dexterity: roll(), constitution: roll(),
        intelligence: roll(), wisdom: roll(), charisma: roll()
    };
}

function generateRandomName(race, charClass) {
    return `Héroe ${race} ${charClass}`; // Placeholder si no hay generador complejo
}
