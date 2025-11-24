// ==========================================
// 🧙 D&D CHARACTER FORGE - MAIN APPLICATION LOGIC (V3.0 - FINAL)
// Integra Multiverso, NFT, Mapas, Bestiario y Chaos.
// ==========================================

'use strict';

// Asegurar que las dependencias están cargadas
if (typeof CORE_API === 'undefined' || typeof MULTIVERSE_DATA === 'undefined' || typeof DND_BESTIARY === 'undefined') {
    console.error("ERROR: Dependencias 'dnd-data.js', 'dnd-apis.js' o 'bestiary.js' no cargadas.");
}

// ==========================================
// 🗺️ MAP ENGINE (Profesional, Canvas-based)
// ==========================================

const MapEngine = {
    ctx: null,
    canvas: null,
    
    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = 800;
            this.canvas.height = 600;
            this.drawInitialScreen();
        }
    },
    
    drawInitialScreen() {
        if (!this.ctx) return;
        this.ctx.fillStyle = '#1a0f08'; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = '30px Cinzel';
        this.ctx.fillStyle = '#d4af37'; 
        this.ctx.textAlign = 'center';
        this.ctx.fillText("FORJA CARTOGRÁFICA ÉPICA", this.canvas.width / 2, this.canvas.height / 2 - 30);
        this.ctx.font = '20px MedievalSharp';
        this.ctx.fillText("Pulsa 'Generar Mazmorra' para empezar", this.canvas.width / 2, this.canvas.height / 2 + 10);
    },
    
    generateDungeon() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#3a2517'; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const cellSize = 40;
        const cols = this.canvas.width / cellSize;
        const rows = this.canvas.height / cellSize;

        // Generación de salas y pasillos simples
        for (let r = 1; r < rows - 1; r++) {
            for (let c = 1; c < cols - 1; c++) {
                if (Math.random() > 0.7) {
                    this.ctx.fillStyle = '#8b7355'; 
                    this.ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                }
            }
        }

        this.ctx.font = '28px Cinzel';
        this.ctx.fillStyle = '#ff4500'; 
        this.ctx.textAlign = 'left';
        this.ctx.fillText("Mazmorra Generada", 20, 40);
    },
    
    addTokens() {
        if(!this.ctx) return;
        this.generateDungeon(); 
        
        const cellSize = 40;
        for(let i=0; i<5; i++) {
            const x = Math.floor(Math.random() * 18) * cellSize + cellSize + cellSize/2;
            const y = Math.floor(Math.random() * 13) * cellSize + cellSize + cellSize/2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 15, 0, 2*Math.PI);
            this.ctx.fillStyle = i===0 ? 'rgba(65, 105, 225, 0.9)' : 'rgba(139, 0, 0, 0.9)'; 
            this.ctx.fill();
            this.ctx.strokeStyle = '#ffd700'; 
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            this.ctx.font = '12px Cinzel';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(i===0 ? 'H' : 'M', x, y+5);
        }
    }
};

// ==========================================
// 🚀 APP - LÓGICA PRINCIPAL DEL PROYECTO
// ==========================================

const app = {
    currentUniverse: 'DND',
    
    init() {
        console.log("⚔️ D&D Forge V3.0 (Multiverso) Iniciado");
        this.setupMultiverseSelector();
        MapEngine.init('mapCanvas');
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        // Personaje
        document.getElementById('generateRandomBtn')?.addEventListener('click', () => this.forgeCharacter('random'));
        document.getElementById('generateCustomBtn')?.addEventListener('click', () => this.forgeCharacter('custom'));
        document.getElementById('generateChaosBtn')?.addEventListener('click', () => this.forgeCharacter('chaos'));
        document.getElementById('mintNFTBtn')?.addEventListener('click', () => this.mintNFT());
        document.getElementById('downloadPDFBtn')?.addEventListener('click', () => this.downloadPDF());
        document.getElementById('showHistoryBtn')?.addEventListener('click', () => this.showHistory());

        // Mapa
        document.getElementById('generateMapBtn')?.addEventListener('click', () => MapEngine.generateDungeon());
        document.getElementById('addTokensBtn')?.addEventListener('click', () => MapEngine.addTokens());

        // Bestiario
        document.getElementById('generateCreatureBtn')?.addEventListener('click', () => this.generateCreature('random'));
        document.getElementById('generateChaosBeastBtn')?.addEventListener('click', () => this.generateCreature('chaos'));
        document.querySelector('.close-modal')?.addEventListener('click', () => document.getElementById('historyModal').classList.add('hidden'));
    },

    setupMultiverseSelector() {
        const multiverseSelect = document.getElementById('multiverseSelect');
        if (!multiverseSelect) return;
        
        for (const key in MULTIVERSE_DATA) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = MULTIVERSE_DATA[key].name;
            multiverseSelect.appendChild(option);
        }
        
        this.updateUniverse(); 
        multiverseSelect.onchange = () => this.updateUniverse();
    },

    updateUniverse() {
        const multiverseSelect = document.getElementById('multiverseSelect');
        this.currentUniverse = multiverseSelect.value;
        const raceSelect = document.getElementById('raceSelect');
        const classSelect = document.getElementById('classSelect');
        
        raceSelect.innerHTML = '<option value="">— Raza (Random) —</option>';
        classSelect.innerHTML = '<option value="">— Clase (Random) —</option>';
        
        let data = MULTIVERSE_DATA[this.currentUniverse];
        
        data.races.forEach(r => raceSelect.innerHTML += `<option value="${r}">${r}</option>`);
        data.classes.forEach(c => classSelect.innerHTML += `<option value="${c}">${c}</option>`);
    },

    async forgeCharacter(mode) {
        document.getElementById('characterSheet').classList.add('hidden');
        document.getElementById('charImage').src = 'loading.gif'; 
        document.getElementById('charName').textContent = 'Forjando...';

        const universeKeys = Object.keys(MULTIVERSE_DATA);
        let universe, race, charClass, name, universeData;
        
        if (mode === 'chaos') {
            universe = randomFromArray(universeKeys);
            universeData = MULTIVERSE_DATA[universe];
            race = randomFromArray(universeData.races);
            charClass = randomFromArray(universeData.classes);
            document.getElementById('multiverseSelect').value = universe; 
        } else {
            universe = document.getElementById('multiverseSelect').value;
            universeData = MULTIVERSE_DATA[universe];
            
            const customRace = document.getElementById('raceSelect').value;
            const customClass = document.getElementById('classSelect').value;
            
            race = (mode === 'custom' && customRace) ? customRace : randomFromArray(universeData.races);
            charClass = (mode === 'custom' && customClass) ? customClass : randomFromArray(universeData.classes);
        }
        
        name = document.getElementById('customName').value || generateRandomName(race, charClass, universe);
        
        // Generación de datos
        const stats = generateStats(); 
        const nftData = this.calculateNFTRarity(universe);
        
        // Llamada a APIs
        const [apiDetails, imgUrl] = await Promise.all([
            CORE_API.fetchUniverseDetails(universe, race, charClass),
            CORE_API.getEpicImage(`${race} ${charClass} ${universeData.name} portrait`, universe)
        ]);
        
        // Objeto Personaje Global
        window.currentCharacter = {
            name, race, class: charClass, universe,
            stats, nft: nftData, apiDetails,
            hp: 10 + calculateModifier(stats.constitution),
            ac: 10 + calculateModifier(stats.dexterity),
        };

        this.renderCharacter(window.currentCharacter, imgUrl);
        saveToHistory(window.currentCharacter);
    },
    
    renderCharacter(char, imgUrl) {
        const sheet = document.getElementById('characterSheet');
        sheet.classList.remove('hidden'); 
        sheet.scrollIntoView({ behavior: 'smooth' });

        document.getElementById('charName').textContent = char.name;
        document.getElementById('charMeta').textContent = `${char.race} | ${char.class} | Nivel 1`;
        document.getElementById('charUniverse').textContent = MULTIVERSE_DATA[char.universe].name;
        document.getElementById('charImage').src = imgUrl; 
        
        // Stats
        const statsDiv = document.getElementById('statsDisplay');
        statsDiv.innerHTML = '';
        for (const [key, val] of Object.entries(char.stats)) {
            const mod = calculateModifier(val);
            statsDiv.innerHTML += `
                <div class="stat-box">
                    <div class="stat-name">${key.toUpperCase()}</div>
                    <div class="stat-value">${val}</div>
                    <div class="stat-modifier">${mod >= 0 ? '+' : ''}${mod}</div>
                </div>
            `;
        }

        document.getElementById('displayHP').textContent = char.hp;
        document.getElementById('displayAC').textContent = char.ac;

        // Renderizado NFT
        const card = document.getElementById('nftCard');
        const badge = document.getElementById('nftRarity');
        
        card.className = 'nft-card ' + this.getRarityClass(char.nft.rarity);
        if (char.nft.isFoil) card.classList.add('nft-foil');
        
        badge.textContent = char.nft.rarity.toUpperCase();
        document.getElementById('tokenId').textContent = char.nft.tokenId;
        document.getElementById('nftValue').textContent = char.nft.value.toLocaleString();

        // Detalle Enriquecido de API
        document.getElementById('apiBonus').innerHTML = `
            <strong>Bonus Épico:</strong> ${char.apiDetails.bonus || 'No Aplica'}
            <p class="flavor-text">${char.apiDetails.flavor || 'Datos base D&D.'}</p>
        `;
    },

    // ===== LÓGICA BESTIARIO Y CHAOS =====
    generateCreature(mode) {
        let creature;
        if (mode === 'chaos') {
            creature = this.generateChaosBeast();
        } else {
            const monsterNames = Object.keys(DND_BESTIARY).filter(k => k !== 'version' && k !== 'creatureTypes' && k !== 'environments' && k !== 'challengeRatings');
            const randomName = randomFromArray(monsterNames);
            creature = DND_BESTIARY[randomName];
            creature.name = randomName;
        }
        
        window.currentCreature = creature;
        this.displayCreature(creature);
    },

    generateChaosBeast() {
        const allTypes = DND_BESTIARY.creatureTypes;
        const allEnvironments = DND_BESTIARY.environments;
        
        const randomType = randomFromArray(allTypes);
        const randomEnvironment = randomFromArray(allEnvironments);
        const randomCR = randomFromArray(DND_BESTIARY.challengeRatings).cr;
        
        const creature = {
            name: `${generateRandomName('Desconocido', 'Caos')} el Terrible`,
            type: randomType,
            cr: randomCR,
            xp: 0, // No calculamos XP para el caos
            environment: randomEnvironment,
            hp: rollDice(20) * (parseFloat(randomCR) || 1) + 50,
            ac: 10 + rollDice(10),
            speed: `${rollDice(6) * 10} ft`,
            stats: generateStats(),
            traits: [`Aura de Caos (Todos los tiros con Desventaja)`, `Mimetismo de ${randomType}`],
            actions: [
                `Ataque Caótico: +${calculateModifier(generateStats().strength) + 5}, ${rollDice(6)}d${rollDice(12)} de daño de ${randomFromArray(['Fuego', 'Frío', 'Nigromancia'])}`,
                `Habilidad Especial: Desaparición Dimensional (Teletransporte)`
            ],
            description: `Una criatura ${randomType} de CR ${randomCR} que habita en ${randomEnvironment}. ¡TOTALMENTE IMPREDECIBLE!`
        };
        
        return creature;
    },

    displayCreature(creature) {
        document.getElementById('creatureSheet').classList.remove('hidden');
        document.getElementById('creatureSheet').scrollIntoView({ behavior: 'smooth' });

        document.getElementById('creatureName').textContent = creature.name;
        document.getElementById('creatureMeta').textContent = `${creature.size || 'Mediano'} ${creature.type} | CR ${creature.cr} (${creature.xp ? creature.xp + ' XP' : '-- XP'})`;
        document.getElementById('creatureHP').textContent = creature.hp;
        document.getElementById('creatureAC').textContent = creature.ac;
        document.getElementById('creatureSpeed').textContent = creature.speed || '30 ft';
        
        const statsDiv = document.getElementById('creatureStatsDisplay');
        statsDiv.innerHTML = '';
        for (const [key, val] of Object.entries(creature.stats || {str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10})) {
            const mod = calculateModifier(val);
            statsDiv.innerHTML += `<div class="stat-box"><div class="stat-name">${key.toUpperCase()}</div><div class="stat-value">${val}</div><div class="stat-modifier">${mod >= 0 ? '+' : ''}${mod}</div></div>`;
        }
        
        document.getElementById('creatureTraits').innerHTML = (creature.traits || []).map(t => `<li>${t}</li>`).join('');
        document.getElementById('creatureActions').innerHTML = (creature.actions || []).map(a => `<li>${a}</li>`).join('');
        document.getElementById('creatureLegendaryActions').innerHTML = (creature.legendaryActions || []).map(a => `<li>${a}</li>`).join('');

        document.getElementById('creatureEnvironment').textContent = Array.isArray(creature.environments) ? creature.environments.join(', ') : creature.environment || '--';
    },

    // ===== LÓGICA NFT Y RAREZA PROFESIONAL =====
    calculateNFTRarity(universe) {
        const roll = Math.random();
        let rarity = 'Común';
        
        if (roll > 0.999) rarity = 'Mítica'; 
        else if (roll > 0.99) rarity = 'Legendaria';
        else if (roll > 0.95) rarity = 'Épica';
        else if (roll > 0.8) rarity = 'Rara';
        
        if (universe !== 'DND' && Math.random() > 0.90) { // Bonus por Crossover (10% más de rareza)
             if (rarity === 'Rara') rarity = 'Épica';
             if (rarity === 'Común') rarity = 'Rara';
        }

        return {
            rarity,
            isFoil: Math.random() > 0.85, 
            value: Math.floor(Math.random() * 50000) + 1000,
            tokenId: `0x${(Math.random() * 0xFFFFFFFFFFFFFFFF).toString(16).padStart(16, '0').toUpperCase()}` 
        };
    },

    getRarityClass(rarity) {
        if (rarity === 'Mítica') return 'rarity-mythic'; 
        if (rarity === 'Legendaria') return 'rarity-legendary';
        if (rarity === 'Épica') return 'rarity-epic';
        if (rarity === 'Rara') return 'rarity-rare';
        return 'rarity-common';
    },

    mintNFT() {
        if (!window.currentCharacter) {
            return alert("❌ ¡Debes generar un personaje primero para acuñar!");
        }
        
        alert(`
        ✅ ¡NFT Acuñado con Éxito!
        ------------------------------------
        Personaje: ${window.currentCharacter.name}
        Rareza: ${window.currentCharacter.nft.rarity} ${window.currentCharacter.nft.isFoil ? '(Holográfico)' : ''}
        Token ID: ${window.currentCharacter.nft.tokenId}
        Valor Estimado: ${window.currentCharacter.nft.value.toLocaleString()} Gold Pieces
        
        (Simulación de conexión a Wallet)
        `);
    },
    
    // ===== EXPORTACIÓN PDF =====
    downloadPDF() {
        if (!window.currentCharacter || typeof window.jspdf === 'undefined') {
            return alert("❌ Genera un personaje y asegúrate de que jsPDF esté cargado en tu HTML.");
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFont("Cinzel", "bold");
        doc.setFontSize(18);
        doc.text(`FICHA DE PERSONAJE: ${window.currentCharacter.name}`, 10, 20);
        
        doc.setFontSize(10);
        doc.text(`Universo: ${MULTIVERSE_DATA[window.currentCharacter.universe].name}`, 10, 28);
        doc.text(`Raza: ${window.currentCharacter.race}`, 10, 34);
        doc.text(`Clase: ${window.currentCharacter.class}`, 50, 34);
        
        let y = 45;
        doc.setFontSize(12);
        doc.text("ESTADÍSTICAS", 10, y);
        y += 5;
        
        for (const [key, val] of Object.entries(window.currentCharacter.stats)) {
            const mod = calculateModifier(val);
            doc.text(`${key.toUpperCase()}: ${val} (${mod >= 0 ? '+' : ''}${mod})`, 10, y += 6);
        }
        
        doc.text("BONUS DE UNIVERSO", 100, 45);
        doc.setFontSize(10);
        doc.text(`Bonus: ${window.currentCharacter.apiDetails.bonus}`, 100, 52, { maxWidth: 100 });
        doc.text(`Flavor: ${window.currentCharacter.apiDetails.flavor}`, 100, 65, { maxWidth: 100 });
        
        doc.save(`${window.currentCharacter.name.replace(/ /g, '_')}_ficha_epic.pdf`);
    },
    
    // ===== HISTORIAL =====
    showHistory() {
        const modal = document.getElementById('historyModal');
        const list = document.getElementById('historyList');
        if (modal) {
            modal.classList.remove('hidden');
            let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            list.innerHTML = history.map(item => `
                <div class="history-item ${this.getRarityClass(item.rarity)}">
                    <strong>${item.name}</strong> (${item.race} ${item.class})<br>
                    <small>Universo: ${MULTIVERSE_DATA[item.universe].name} | Rareza: ${item.rarity}</small>
                </div>
            `).join('');
            
            // Cierra con el overlay
            window.onclick = (event) => {
                if (event.target == modal) {
                    modal.classList.add('hidden');
                    window.onclick = null; // Limpiar para evitar conflictos
                }
            }
        }
    }
};

// Inicializa la aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.app = app;
    window.app.init();
});
