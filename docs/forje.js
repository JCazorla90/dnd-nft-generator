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
    updateUniverse(); // Carga datos iniciales
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
        race = document.getElementById('raceSelect').value;
        charClass = document.getElementById('classSelect').value;
    } else if (mode === 'random') {
        // Elegir aleatorio del universo actual
        const options = currentUniverse === 'DND' 
            ? { r: Object.keys(DND_DATA.races), c: Object.keys(DND_DATA.classes) }
            : { r: MULTIVERSE_DATA[currentUniverse].races, c: MULTIVERSE_DATA[currentUniverse].classes };
            
        race = options.r[Math.floor(Math.random() * options.r.length)];
        charClass = options.c[Math.floor(Math.random() * options.c.length)];
    } else if (mode === 'chaos') {
        // Fusión loca de universos
        race = "Híbrido Mutante";
        charClass = "Hechicero de los Puños";
    }
    
    name = `Héroe de ${currentUniverse}`; // Simplificado para ejemplo

    // Generar Stats
    const stats = generateStats();
    
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
    const imgUrl = await DND_API.Images.getEpicImage(imgQuery, 'character');
    document.getElementById('charImage').src = imgUrl;
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
        statsDiv.innerHTML += `
            <div style="background:#222; color:white; padding:5px; text-align:center; border-radius:4px; border:1px solid gold;">
                <div style="font-size:0.8rem; text-transform:uppercase;">${key}</div>
                <div style="font-size:1.5rem; font-weight:bold;">${val}</div>
            </div>
        `;
    }
    
    // NFT Card Visuals
    const card = document.getElementById('nftCard');
    const badge = document.getElementById('nftRarity');
    
    // Reset clases
    card.className = 'nft-card';
    
    if (char.nft.isFoil) card.classList.add('nft-foil');
    if (char.nft.rarity === 'Legendaria') card.classList.add('border-legendary');
    
    badge.textContent = char.nft.rarity.toUpperCase();
    badge.style.color = getRarityColor(char.nft.rarity);
    
    document.getElementById('tokenId').textContent = Math.floor(Math.random() * 999999);
}

// 5. LÓGICA NFT Y RAREZA
function calculateNFTRarity() {
    const roll = Math.random();
    let rarity = 'Común';
    if (roll > 0.98) rarity = 'Legendaria';
    else if (roll > 0.90) rarity = 'Épica';
    else if (roll > 0.70) rarity = 'Rara';
    
    return {
        rarity,
        isFoil: Math.random() > 0.8, // 20% chance de ser foil
        value: Math.floor(Math.random() * 1000)
    };
}

function getRarityColor(rarity) {
    if (rarity === 'Legendaria') return '#f1c40f'; // Gold
    if (rarity === 'Épica') return '#9b59b6'; // Purple
    if (rarity === 'Rara') return '#3498db'; // Blue
    return '#bdc3c7'; // Grey
}

function mintNFT() {
    alert(`🔗 Conectando a Wallet...\n\n¡NFT "${activeCharacter.name}" acuñado en la Blockchain!\nRareza: ${activeCharacter.nft.rarity}\nValor Estimado: ${activeCharacter.nft.value} Gold Pieces`);
}

// 6. MAPA
function generateMap() {
    MapEngine.generateDungeon();
}

function addTokens() {
    // Dibuja tokens simples sobre el mapa
    if(!MapEngine.ctx) return;
    const ctx = MapEngine.ctx;
    for(let i=0; i<5; i++) {
        const x = Math.floor(Math.random() * 10) * 40 + 20;
        const y = Math.floor(Math.random() * 8) * 40 + 20;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2*Math.PI);
        ctx.fillStyle = i===0 ? 'blue' : 'red'; // 1 Heroe, 4 Enemigos
        ctx.fill();
        ctx.stroke();
    }
}

// 7. UTILIDADES
function generateStats() {
    return {
        str: roll(20), dex: roll(20), con: roll(20),
        int: roll(20), wis: roll(20), cha: roll(20)
    };
}
function roll(sides) { return Math.floor(Math.random() * sides) + 1; }
function downloadPDF() {
    const doc = new window.jspdf.jsPDF();
    doc.setFont("times");
    doc.text(`FICHA DE PERSONAJE: ${activeCharacter.name}`, 10, 10);
    doc.text(`Universo: ${activeCharacter.universe}`, 10, 20);
    doc.text(`Clase: ${activeCharacter.class}`, 10, 30);
    doc.save("personaje_epico.pdf");
}
