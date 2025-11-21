/**
 * ═══════════════════════════════════════════════════════════════════
 * 🐉 D&D NFT FORGE - CONTROLLER V2.0 (RESTORED)
 * Maneja Wallet, APIs, Lógica de Juego y UI
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

const App = {
    state: {
        character: null,
        monster: null,
        walletAddress: null,
        edition: '5e',
        history: []
    },

    init() {
        console.log("🐉 Initializing D&D Forge v2.0 Ultimate...");
        this.cacheDOM();
        this.bindEvents();
        this.loadHistory();
    },

    cacheDOM() {
        this.dom = {
            editionSelect: document.getElementById('editionSelect'),
            btnConnect: document.getElementById('connectWalletBtn'),
            walletDisplay: document.getElementById('walletAddress'),
            
            // Paneles
            welcome: document.getElementById('welcomeState'),
            charSheet: document.getElementById('characterSheet'),
            monsterCard: document.getElementById('monsterCard'),
            wizardContainer: document.getElementById('wizard-container'),
            
            // Botones
            btnGenRandom: document.getElementById('btnGenerateRandom'),
            btnWizard: document.getElementById('btnOpenWizard'),
            btnMonster: document.getElementById('btnGenerateMonster'),
            btnChaos: document.getElementById('btnChaosBeast'),
            btnEncounter: document.getElementById('btnEncounter'),
            btnExportPDF: document.getElementById('btnExportPDF'),
            btnExportJSON: document.getElementById('btnExportJSON'),
            btnMint: document.getElementById('btnMintNFT'),
            btnRegenImg: document.getElementById('btnRegenImage'),
            btnClearHistory: document.getElementById('btnClearHistory'),
            
            // Displays
            charImg: document.getElementById('charImage')
        };
    },

    bindEvents() {
        this.dom.btnConnect.addEventListener('click', () => this.connectWallet());
        this.dom.btnGenRandom.addEventListener('click', () => this.generateRandomCharacter());
        this.dom.btnWizard.addEventListener('click', () => this.openWizard());
        this.dom.btnMonster.addEventListener('click', () => this.generateMonster());
        this.dom.btnChaos.addEventListener('click', () => this.generateChaos());
        
        this.dom.btnExportPDF.addEventListener('click', () => this.exportPDF());
        this.dom.btnExportJSON.addEventListener('click', () => this.exportJSON());
        this.dom.btnMint.addEventListener('click', () => this.mintNFT());
        this.dom.btnRegenImg.addEventListener('click', () => this.regenCharacterImage());
        this.dom.btnClearHistory.addEventListener('click', () => this.clearHistory());
        
        this.dom.editionSelect.addEventListener('change', (e) => {
            this.state.edition = e.target.value;
            alert(`Edición cambiada a: ${this.state.edition}. Las reglas se ajustarán.`);
        });
    },

    // ------------------------------------------------------------------
    // 🦊 WEB3 & NFT FUNCTIONS
    // ------------------------------------------------------------------
    async connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.state.walletAddress = accounts[0];
                this.dom.walletDisplay.textContent = `${accounts[0].substring(0,6)}...${accounts[0].substring(38)}`;
                this.dom.walletDisplay.classList.remove('hidden');
                this.dom.btnConnect.classList.add('hidden');
                this.dom.btnMint.disabled = false; // Habilitar Mint
                alert("✅ Wallet Conectada. ¡Ahora puedes mintear tus héroes!");
            } catch (error) {
                console.error(error);
                alert("Error conectando wallet.");
            }
        } else {
            alert("⚠️ No se detectó MetaMask. Instálalo para usar funciones NFT.");
        }
    },

    async mintNFT() {
        if (!this.state.character) return alert("Genera un personaje primero.");
        
        // Simulación de interacción con Smart Contract
        const btn = this.dom.btnMint;
        btn.textContent = "⏳ Minteando en Blockchain...";
        btn.disabled = true;

        setTimeout(() => {
            alert(`🎉 ¡ÉXITO!\n\n${this.state.character.name} ha sido acuñado como NFT en la red Sepolia.\nHash: 0x7f...3a9`);
            btn.textContent = "💎 Mint NFT";
            btn.disabled = false;
        }, 3000);
    },

    // ------------------------------------------------------------------
    // 🎲 CHARACTER GENERATION
    // ------------------------------------------------------------------
    async generateRandomCharacter() {
        // Usar lógica local de dnd-data.js
        const race = DnDData.getRandomRace();
        const charClass = DnDData.getRandomClass();
        
        // Generar stats base
        const stats = DnDData.generateStats();
        
        // Intentar obtener hechizos de la API si es mago/clérigo
        let spells = [];
        if (['Mago', 'Clérigo', 'Hechicero', 'Brujo'].includes(charClass)) {
            const apiSpells = await DndAPI.getSpellsByClass(charClass);
            spells = apiSpells.map(s => s.name);
        }

        const char = {
            id: Date.now(),
            name: DnDData.generateName(race),
            race: race,
            class: charClass,
            background: DnDData.getRandomBackground(),
            level: 1,
            alignment: DnDData.alignments[Math.floor(Math.random() * DnDData.alignments.length)],
            stats: stats,
            hp: 10 + Math.floor((stats.constitution - 10)/2),
            ac: 10 + Math.floor((stats.dexterity - 10)/2),
            equipment: ["Mochila", "Raciones (5)", "Cuerda", "Arma de clase"],
            traits: DnDData.races[race].traits || [],
            spells: spells.length > 0 ? spells : ["Sin capacidad de conjuro"],
            imageUrl: DndAPI.generateCharacterImage(race, charClass)
        };

        this.displayCharacter(char);
    },

    openWizard() {
        this.hideAll();
        this.dom.wizardContainer.classList.remove('hidden');
        if(window.wizard) window.wizard.start();
    },

    // Llamado desde el Wizard cuando termina
    handleWizardComplete(char) {
        // Generar imagen si no tiene
        if (!char.imageUrl) {
            char.imageUrl = DndAPI.generateCharacterImage(char.race, char.class);
        }
        this.displayCharacter(char);
    },

    displayCharacter(char) {
        this.state.character = char;
        this.hideAll();
        this.dom.charSheet.classList.remove('hidden');
        
        // Render Textos
        document.getElementById('charName').textContent = char.name;
        document.getElementById('charRace').textContent = char.race;
        document.getElementById('charClass').textContent = char.class;
        document.getElementById('charBackground').textContent = char.background;
        document.getElementById('charAlignment').textContent = char.alignment;
        
        // Render Stats
        document.getElementById('statStr').textContent = char.stats.strength;
        document.getElementById('statDex').textContent = char.stats.dexterity;
        document.getElementById('statCon').textContent = char.stats.constitution;
        document.getElementById('statInt').textContent = char.stats.intelligence;
        document.getElementById('statWis').textContent = char.stats.wisdom;
        document.getElementById('statCha').textContent = char.stats.charisma;

        // Render Combat
        document.getElementById('valHP').textContent = char.hp;
        document.getElementById('valAC').textContent = char.ac;

        // Render Imagen
        this.dom.charImg.src = char.imageUrl;

        // Listas
        this.renderList('listEquipment', char.equipment);
        this.renderList('listTraits', char.traits);
        this.renderList('listSpells', char.spells || []);

        this.saveToHistory(char);
    },

    regenCharacterImage() {
        if (!this.state.character) return;
        this.dom.charImg.src = "https://via.placeholder.com/300?text=Generating...";
        setTimeout(() => {
            const newUrl = DndAPI.generateCharacterImage(this.state.character.race, this.state.character.class);
            this.dom.charImg.src = newUrl;
            this.state.character.imageUrl = newUrl;
        }, 500);
    },

    // ------------------------------------------------------------------
    // 🐺 BESTIARIO & API REAL
    // ------------------------------------------------------------------
    async generateMonster() {
        this.hideAll();
        // 1. Intentar API Externa
        const apiMonster = await DndAPI.getRandomMonster();
        
        if (apiMonster) {
            this.displayMonster({
                name: apiMonster.name,
                type: apiMonster.type,
                cr: apiMonster.challenge_rating,
                hp: apiMonster.hit_points,
                ac: apiMonster.armor_class,
                speed: JSON.stringify(apiMonster.speed),
                actions: apiMonster.actions ? apiMonster.actions.map(a => `${a.name}: ${a.desc}`) : [],
                isApi: true
            });
        } else {
            // 2. Fallback local (dnd-monsters.js)
            const localMonster = DND_MONSTERS[Math.floor(Math.random() * DND_MONSTERS.length)];
            this.displayMonster(localMonster);
        }
    },

    generateChaos() {
        this.hideAll();
        const chaos = {
            name: "Engendro del Vacío #" + Math.floor(Math.random()*666),
            type: "Aberración Cósmica",
            cr: Math.floor(Math.random()*20)+1,
            hp: Math.floor(Math.random()*200)+50,
            ac: 15 + Math.floor(Math.random()*10),
            speed: "Flotar 60ft",
            actions: ["Rayo Desintegrador", "Aullido de Locura", "Alterar Realidad"]
        };
        this.displayMonster(chaos);
    },

    displayMonster(m) {
        this.dom.monsterCard.classList.remove('hidden');
        document.getElementById('monsterName').textContent = m.name;
        document.getElementById('monsterCR').textContent = `CR ${m.cr}`;
        document.getElementById('monsterMeta').textContent = `${m.size || 'Mediano'} ${m.type}`;
        
        document.getElementById('monsterHP').textContent = m.hp;
        document.getElementById('monsterAC').textContent = m.ac;
        document.getElementById('monsterSpeed').textContent = m.speed || '30 ft';

        const actionContainer = document.getElementById('monsterActions');
        actionContainer.innerHTML = '<h3>Acciones</h3>';
        if (m.actions) {
            m.actions.forEach(a => {
                const p = document.createElement('p');
                p.textContent = typeof a === 'string' ? a : `${a.name}: ${a.desc}`;
                actionContainer.appendChild(p);
            });
        }
    },

    // ------------------------------------------------------------------
    // 💾 EXPORT FUNCTIONS
    // ------------------------------------------------------------------
    exportJSON() {
        if (!this.state.character) return alert("Nada que exportar.");
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.character, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${this.state.character.name}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },

    exportPDF() {
        if (!this.state.character) return alert("Nada que exportar.");
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const char = this.state.character;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text(char.name, 20, 20);
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text(`${char.race} ${char.class} - Nivel ${char.level}`, 20, 30);
        
        doc.text(`HP: ${char.hp} | AC: ${char.ac}`, 20, 45);
        
        doc.text("Estadísticas:", 20, 60);
        doc.text(`FUE: ${char.stats.strength} | DES: ${char.stats.dexterity} | CON: ${char.stats.constitution}`, 20, 70);
        doc.text(`INT: ${char.stats.intelligence} | SAB: ${char.stats.wisdom} | CAR: ${char.stats.charisma}`, 20, 80);

        doc.save(`${char.name}_sheet.pdf`);
    },

    // ------------------------------------------------------------------
    // ⚙️ UTILS
    // ------------------------------------------------------------------
    hideAll() {
        this.dom.welcome.classList.add('hidden');
        this.dom.charSheet.classList.add('hidden');
        this.dom.monsterCard.classList.add('hidden');
        this.dom.wizardContainer.classList.add('hidden');
    },

    renderList(id, items) {
        const ul = document.getElementById(id);
        ul.innerHTML = '';
        if (items) {
            items.forEach(i => {
                const li = document.createElement('li');
                li.textContent = i;
                ul.appendChild(li);
            });
        }
    },

    saveToHistory(char) {
        this.state.history.unshift(char);
        if (this.state.history.length > 10) this.state.history.pop();
        localStorage.setItem('dnd_ultimate_history', JSON.stringify(this.state.history));
        this.loadHistory();
    },

    loadHistory() {
        const stored = localStorage.getItem('dnd_ultimate_history');
        if (stored) this.state.history = JSON.parse(stored);
        
        const list = document.getElementById('historyList');
        list.innerHTML = '';
        this.state.history.forEach((c, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${c.name}</strong> <br><small>${c.race} ${c.class}</small>`;
            li.className = 'history-item';
            li.style.borderBottom = '1px solid #333';
            li.style.padding = '5px';
            li.style.cursor = 'pointer';
            li.onclick = () => this.displayCharacter(c);
            list.appendChild(li);
        });
    },

    clearHistory() {
        localStorage.removeItem('dnd_ultimate_history');
        this.state.history = [];
        this.loadHistory();
    }
};

// Callback global para el Wizard
window.onWizardFinish = (char) => App.handleWizardComplete(char);

// Init on Load
document.addEventListener('DOMContentLoaded', () => App.init());
