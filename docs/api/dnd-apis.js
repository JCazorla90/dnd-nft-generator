// ==========================================
// 🌐 INTEGRACIÓN DE APIs D&D - SISTEMA COMPLETO Y MULTIVERSAL
// APIs: DnD5eAPI.co + Open5e + Elden Ring + LOTR + Scryfall (MTG)
// ==========================================

const DND_API = {
    // URLs base de las APIs
    dnd5e: 'https://www.dnd5eapi.co/api',
    open5e: 'https://api.open5e.com',
    eldenRing: 'https://eldenring.fanapis.com/api',
    lotr: 'https://the-one-api.dev/v2', 
    scryfall: 'https://api.scryfall.com',

    // Nota: La API de LotR requiere una clave. Sustitúyela si la tienes.
    LOTR_API_KEY: 'YOUR_LOTR_API_KEY_HERE', 

    // Cache para optimizar llamadas
    cache: {
        monsters: {},
        spells: {},
        equipment: {},
        classes: {},
        races: {},
        feats: {},
        magicItems: {},
        bossNames: [], 
        lotrCharacters: []
    },

    // ==========================================
    // ⚔️ UTILIDADES BASE ASÍNCRONAS
    // ==========================================

    async fetchData(url, headers = {}) {
        try {
            const res = await fetch(url, { headers });
            if (!res.ok) {
                // Notificar error pero no detener la ejecución.
                throw new Error(`HTTP error! status: ${res.status} from ${url}`);
            }
            return await res.json();
        } catch (e) {
            console.error(`Error fetching data from ${url}:`, e);
            return null;
        }
    },
    
    // Funciones base de D&D (Se asume su reescritura a asíncrona)
    async getRaceDetails(raceName) {
        // Implementación simplificada. El propósito es mostrar la estructura asíncrona.
        console.log(`📡 Obteniendo detalles de raza: ${raceName}`);
        const apiName = raceName.toLowerCase().replace(/ /g, '-').replace('á', 'a');
        const res = await this.fetchData(`${this.dnd5e}/races/${apiName}`);
        if (res && res.traits) {
            return { traits: res.traits.map(t => t.name) };
        }
        return { traits: [`Rasgos básicos de ${raceName}.`] };
    },

    async getClassDetails(className) {
        console.log(`📡 Obteniendo detalles de clase: ${className}`);
        const apiName = className.toLowerCase().replace(/ /g, '-').replace('ó', 'o');
        const res = await this.fetchData(`${this.dnd5e}/classes/${apiName}`);
        if (res && res.proficiencies) {
            return { 
                features: [`Competente con: ${res.proficiencies.map(p => p.name).slice(0, 3).join(', ')}`]
            };
        }
        return { features: [`Características básicas de ${className}.`] };
    },

    // ==========================================
    // 🐉 ELDEN RING - BESTIAS CAÓTICAS (Para generateChaosBeast)
    // ==========================================

    async getRandomEldenRingBossName() {
        console.log('📡 Obteniendo nombre de Jefe de Elden Ring...');
        if (this.cache.bossNames.length === 0) {
            try {
                const data = await this.fetchData(`${this.eldenRing}/bosses?limit=100`);
                if (data && data.data && data.data.length > 0) {
                    this.cache.bossNames = data.data.map(boss => boss.name).filter(n => n);
                }
            } catch (e) {
                console.warn(`⚠️ Error en Elden Ring API, usando fallback: ${e.message}`);
            }
        }
        
        const names = this.cache.bossNames.length > 0 ? this.cache.bossNames : ['Margit', 'Malenia', 'Radahn', 'Godrick'];
        return names[Math.floor(Math.random() * names.length)] || 'Entidad Desconocida';
    },

    // ==========================================
    // 💍 LORD OF THE RINGS - LORE MULTIVERSAL (Para generateCharacter)
    // ==========================================

    async getLotrUniverseDescription() {
        console.log('📡 Obteniendo cita épica de LotR...');
        
        // Cita de Fallback
        const fallbackQuotes = [
            "No todos los que vagan están perdidos.",
            "La oscuridad debe enfrentarse a la luz.",
            "Una gran aventura es lo que se avecina."
        ];

        // Intentamos cargar personajes una vez para usarlos en el lore
        if (this.cache.lotrCharacters.length === 0 && this.LOTR_API_KEY !== 'YOUR_LOTR_API_KEY_HERE') {
            try {
                const data = await this.fetchData(`${this.lotr}/character?limit=100`, { 'Authorization': `Bearer ${this.LOTR_API_KEY}` });
                if (data && data.docs && data.docs.length > 0) {
                    this.cache.lotrCharacters = data.docs.map(c => c.name).filter(n => n && n !== 'NaN');
                }
            } catch (e) {
                console.warn(`⚠️ Fallo en LotR API: ${e.message}. Usando fallback.`);
            }
        }
        
        if (this.cache.lotrCharacters.length > 0) {
            const randomCharacter = this.cache.lotrCharacters[Math.floor(Math.random() * this.cache.lotrCharacters.length)];
            return `Este héroe lleva consigo el linaje de ${randomCharacter}, listo para la próxima Senda.`;
        }

        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    },

    // ==========================================
    // 🪄 MAGIC: THE GATHERING (SCRYFALL) - OBJETOS MÁGICOS (Para generateCharacter)
    // ==========================================
    
    async getRandomMagicItemDescription() {
        console.log('📡 Obteniendo objeto mágico de Scryfall (MTG)...');
        try {
            // Filtramos por tipo de carta "Artifact" o "Land" en español
            const uri = `${this.scryfall}/cards/random?q=type%3Aartifact+OR+type%3Aland+lang%3Aes`;
            const data = await this.fetchData(uri);
            
            if (data && data.name) {
                const name = data.name;
                // Usamos la primera parte del texto de oráculo
                const oracleText = data.oracle_text ? data.oracle_text.split('.')[0] : "Un objeto de gran poder arcano.";
                
                return `**${name}** (Rareza: ${data.rarity.toUpperCase()}): ${oracleText}.`;
            }
        } catch (e) {
            console.error(`Error Scryfall API:`, e);
        }
        
        return "Un objeto mágico menor, con inscripciones arcanas ilegibles.";
    }
};
