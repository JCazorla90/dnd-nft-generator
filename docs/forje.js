/**
 * ═══════════════════════════════════════════════════════════════════
 * 🧙 D&D CHARACTER FORGE - MAIN LOGIC
 * Soporta Multiverso, Mapas y NFT
 * Copyright (c) 2025 José Cazorla
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

let currentUniverse = 'DND';
let activeCharacter = null;

// 1. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    console.log("⚔️ Sistema Forge V2 Iniciado");
    
    // Rellenar selector de universo con opciones
    const multiverseSelect = document.getElementById('multiverseSelect');
    multiverseSelect.innerHTML = ''; // Limpiar opciones por defecto
    
    for (const key in MULTIVERSE_DATA) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = MULTIVERSE_DATA[key].name;
        multiverseSelect.appendChild(option);
    }
    
    updateUniverse(); // Carga datos iniciales y llena selects de Raza/Clase
    MapEngine.init('mapCanvas'); // Inicia motor de mapas
});

// 2. SISTEMA DE MULTIVERSO
function updateUniverse() {
    currentUniverse = document.getElementById('multiverseSelect').value;
    const raceSelect = document.getElementById('raceSelect');
    const classSelect = document.getElementById('classSelect');
    
    // Limpiar
    raceSelect.innerHTML = '';
    classSelect.innerHTML = '';
    
    let data;
    
    if (currentUniverse === 'DND') {
        data = { 
            races: Object.keys(DND_DATA.races), 
            classes: Object.keys(DND_DATA.classes) 
        };
    } else {
        // Cargar de MULTIVERSE_DATA
        data = MULTIVERSE_DATA[currentUniverse];
    }
    
    // Opciones por defecto para personalización
    raceSelect.innerHTML += '<option value="">(Aleatorio)</option>';
    classSelect.innerHTML += '<option value="">(Aleatorio)</option>';

    // Llenar selects
    data.races.forEach(r => raceSelect.innerHTML += `<option value="${r}">${r}</option>`);
    data.classes.forEach(c => classSelect.innerHTML += `<option value="${c}">${c}</option>`);
    
    console.log(`🌌 Universo cambiado a: ${currentUniverse}`);
}

// 3. GENERACIÓN DE PERSONAJE
async function forgeCharacter(mode) {
    const output = document.getElementById('outputArea');
    output.style.display = 'block';
    
    // Obtener datos base
    let race, charClass, name;
    
    if (mode === 'custom') {
        race = document.getElementById('raceSelect').value || MULTIVERSE_DATA[currentUniverse].races[Math.floor(Math.random() * MULTIVERSE_DATA[currentUniverse].races.length)];
        charClass = document.getElementById('classSelect').value || MULTIVERSE_DATA[currentUniverse].classes[Math.floor(Math.random() * MULTIVERSE_DATA[currentUniverse].classes.length)];
        name = document.getElementById('customName').value || `Héroe Anónimo de ${currentUniverse}`;
    } else if (mode === 'random') {
        // Elegir aleatorio del universo actual
        const options = MULTIVERSE_DATA[currentUniverse];
            
        race = options.races[Math.floor(Math.random() * options.races.length)];
        charClass = options.classes[Math.floor(Math.random() * options.classes.length)];
    } else if (mode === 'chaos') {
        // Fusión loca de universos (Romper las reglas)
        race = "Híbrido Mutante";
        charClass = "Hechicero de los Puños";
    }
    
    if (mode !== 'custom') {
        // Generar nombre solo si no es modo custom o el campo estaba vacío
        name = DND_DATA.generateRandomName(race, charClass); 
    }

    // Generar Stats
    const stats = generateStats(mode); // Modificado para aceptar el modo
    
    // Calcular Rareza NFT
    const nftData = calculateNFTRarity();
    
    // Guardar Objeto Personaje
    activeCharacter = {
        name, race, class: charClass, universe: currentUniverse,
        stats, nft: nftData,
        hp: 10 + Math.floor((stats.con - 10)/2),
        ac: 10 + Math.floor((stats.dex - 10)/2)
    };

    // Renderizar UI
    renderCharacter(activeCharacter);
    
    // Generar Imagen IA (Simulada o API)
    const imgQuery = `${race} ${charClass} ${currentUniverse} fantasy portrait`;
    
    // Asumiendo que DND_API está cargado
    if (typeof DND_API !== 'undefined' && DND_API.Images && DND_API.Images.getEpicImage) {
        const imgUrl = await DND_API.Images.getEpicImage(imgQuery, 'character');
        document.getElementById('charImage').src = imgUrl;
    }
}

// 4. RENDERIZADO
function renderCharacter(char) {
    document.getElementById('charName').textContent = char.name;
    document.getElementById('charMeta').textContent = `${char.race} | ${char.class} | Nivel 1`;
    document.getElementById('charUniverse').textContent = MULTIVERSE_DATA[char.universe]?.name || "D&D Estándar";
    
    // Stats HTML
    const statsDiv = document.getElementById('statsDisplay');
    statsDiv.innerHTML = '';
    for (const [key, val] of Object.entries(char.stats)) {
        const mod = Math.floor((val - 10) / 2);
        statsDiv.innerHTML += `
            <div class="stat-box">
                <div class="stat-name">${key.toUpperCase()}</div>
                <div class="stat-value">${val}</div>
                <div class="stat-modifier">${mod >= 0 ? '+' : ''}${mod}</div>
            </div>
        `;
    }
    
    // NFT Card Visuals
    const card = document.getElementById('nftCard');
    const badge = document.getElementById('nftRarity');
    
    // Reset clases
    card.className = 'nft-card'; // Clase base
    
    if (char.nft.isFoil) card.classList.add('nft-foil');
    if (char.nft.rarity === 'Legendaria') card.classList.add('border-legendary');
    
    badge.textContent = char.nft.rarity.toUpperCase();
    badge.style.backgroundColor = getRarityColor(char.nft.rarity); // Usar background para el badge
    
    document.getElementById('tokenId').textContent = char.nft.tokenId; // Usar el ID del objeto
}

// 5. LÓGICA NFT Y RAREZA
function calculateNFTRarity() {
    const roll = Math.random();
    let rarity = 'Común';
    
    if (roll > 0.99) rarity = 'Mítica'; // Añadida Mítica para mayor exclusividad
    else if (roll > 0.95) rarity = 'Legendaria';
    else if (roll > 0.85) rarity = 'Épica';
    else if (roll > 0.65) rarity = 'Rara';
    
    return {
        rarity,
        isFoil: Math.random() > 0.8, // 20% chance de ser foil
        value: Math.floor(Math.random() * 5000) + 100,
        tokenId: Math.floor(Math.random() * 999999) // Generar Token ID
    };
}

function getRarityColor(rarity) {
    // Coincide con tu sistema de colores
    if (rarity === 'Mítica') return '#ff1493'; // Deep Pink
    if (rarity === 'Legendaria') return '#d4af37'; // Gold
    if (rarity === 'Épica') return '#9b59b6'; // Purple
    if (rarity === 'Rara') return '#3498db'; // Blue
    return '#95a5a6'; // Grey
}

function mintNFT() {
    if (!activeCharacter) {
        return alert("❌ ¡Debes generar un personaje primero!");
    }
    alert(`🔗 Conectando a Wallet...\n\n¡NFT "${activeCharacter.name}" acuñado en la Blockchain!\nRareza: ${activeCharacter.nft.rarity}\nToken: #${activeCharacter.nft.tokenId}\nValor Estimado: ${activeCharacter.nft.value} Gold Pieces`);
}

// 6. MAPA (Utiliza el objeto MapEngine que asumimos está en un archivo de apoyo)
function generateMap() {
    MapEngine.generateDungeon();
}

function addTokens() {
    // Dibuja tokens simples sobre el mapa
    if(!MapEngine.ctx) return;
    const ctx = MapEngine.ctx;
    
    // Limpiar tokens viejos antes de dibujar
    MapEngine.generateDungeon(); 
    
    for(let i=0; i<5; i++) {
        const x = Math.floor(Math.random() * 18) * 40 + 40; // Ajustado para un grid de 20x15
        const y = Math.floor(Math.random() * 13) * 40 + 40;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2*Math.PI);
        ctx.fillStyle = i===0 ? 'blue' : 'red'; // 1 Heroe, 4 Enemigos
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
    console.log("🗺️ Tokens añadidos al mapa.");
}

// 7. UTILIDADES
function generateStats(mode) {
    let stats = {
        str: roll(20), dex: roll(20), con: roll(20),
        int: roll(20), wis: roll(20), cha: roll(20)
    };
    
    if (mode === 'chaos') {
        // Stats aún más ridículos para el modo Chaos
        Object.keys(stats).forEach(k => stats[k] = roll(30) + roll(30)); // Rango de 2 a 60
    }
    
    return stats;
}

function roll(sides) { return Math.floor(Math.random() * sides) + 1; }

function downloadPDF() {
    if (!activeCharacter) {
        return alert("❌ ¡Genera un personaje para poder exportarlo!");
    }
    const doc = new window.jspdf.jsPDF();
    doc.setFont("times", "bold");
    doc.text(`FICHA DE PERSONAJE: ${activeCharacter.name}`, 10, 20);
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`Universo: ${activeCharacter.universe}`, 10, 30);
    doc.text(`Raza: ${activeCharacter.race}`, 10, 35);
    doc.text(`Clase: ${activeCharacter.class}`, 10, 40);
    
    let y = 50;
    doc.setFont("times", "bold");
    doc.text('Estadísticas:', 10, y);
    doc.setFont("times", "normal");
    for (const [key, val] of Object.entries(activeCharacter.stats)) {
        const mod = Math.floor((val - 10) / 2);
        doc.text(`${key.toUpperCase()}: ${val} (${mod >= 0 ? '+' : ''}${mod})`, 10, y + 5);
        y += 5;
    }
    
    y += 10;
    doc.setFont("times", "bold");
    doc.text('Datos NFT:', 10, y);
    doc.setFont("times", "normal");
    doc.text(`Rareza: ${activeCharacter.nft.rarity}`, 10, y + 5);
    doc.text(`Token ID: #${activeCharacter.nft.tokenId}`, 10, y + 10);
    doc.save(`${activeCharacter.name.replace(/ /g, '_')}_ficha.pdf`);
}
