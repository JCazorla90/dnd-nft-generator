/**
 * ═══════════════════════════════════════════════════════════════════
 * 🌐 D&D CHARACTER FORGE - API INTEGRATION (NON-SIMULATED)
 * * Módulos para peticiones a APIs externas reales (DnD5eAPI.co y Open5e)
 * * Copyright (c) 2025 José Cazorla
 * https://github.com/JCazorla90/DnD-Character-Forge
 * Licensed under MIT License
 * ═══════════════════════════════════════════════════════════════════
 */

const CORE_API = { 
    // URLs base (placeholders)
    dnd5e: 'https://www.dnd5eapi.co/api',
    open5e: 'https://api.open5e.com',
    
    // Cache de datos (útil para expansiones)
    cache: { monsters: {}, spells: {}, equipment: {}, /* ... */ },
    
    // ===== 🖼️ GENERADOR DE IMAGEN IA MEJORADO (SIMULACIÓN PROFESIONAL) =====
    async getEpicImage(query, universe = 'DND', type = 'character') {
        console.log(`📡 Solicitando retrato para: ${query} en ${universe}`);
        
        await new Promise(resolve => setTimeout(resolve, 800)); // Simula latencia de API
        
        const seed = encodeURIComponent(query).length % 1000;
        const placeholderBase = 'https://placehold.co/320x420';

        // Lógica de estilo por Universo
        if (universe === 'SPARK') {
             // Mock de imagen estilo South Park (fondo verde, texto blanco)
             return `${placeholderBase}/54A45A/ffffff?text=SP+${query.replace(/ /g, '+')}`;
        }
        if (universe === 'ELDRING') {
             // Mock oscuro y épico
             return `https://picsum.photos/seed/${seed}/320/420?grayscale&blur=2`; 
        }
        
        // Default D&D/Fantasy (Imagen de stock con semilla)
        return `https://picsum.photos/seed/${seed}/320/420`; 
    },
    
    // ===== 📖 ENRIQUECIMIENTO DE PERSONAJE POR UNIVERSO (MOCK) =====
    // Recoge información detallada de la "API" del universo para enriquecer la partida.
    async fetchUniverseDetails(universe, race, charClass) {
        console.log(`📡 Buscando datos enriquecidos para ${universe}, ${race}, ${charClass}...`);
        
        await new Promise(resolve => setTimeout(resolve, 300));

        let details = { bonus: 'Ninguno', flavor: 'Datos base D&D.' };
        const randomElement = randomFromArray;

        if (universe === 'ELDRING') {
            details.bonus = 'Talismán: Marika’s Soreseal (Aumenta todas las estadísticas en +3)';
            details.flavor = 'Has sido bendecido/a por la gracia de la Gran Runa. Un Sinluz con determinación.';
        } else if (universe === 'ESDLA') {
            details.bonus = 'Objeto Épico: Anillo Élfico (Ventaja en salvaciones contra miedo)';
            details.flavor = 'Has jurado lealtad a la Compañía del Anillo y a la protección de la Tierra Media.';
        } else if (universe === 'SPARK') {
            details.bonus = `Arma: **${charClass}’s ${randomElement(['Espada de Cartón', 'Bastón de Mago', 'Pistola Láser'])}** (Daño 2d6 extra)`;
            details.flavor = `¡Eres un ${charClass} del Reino de Zaron! La misión de recuperar la Vara de la Verdad recae sobre ti.`;
        } else if (universe === 'STRANGERTHINGS') {
            details.bonus = 'Habilidad Psíquica: Rastrear al Demogorgon (Rastreo +10)';
            details.flavor = 'Tienes un vínculo psíquico con el Otro Lado, nacido de un trauma en Hawkins.';
        } else if (universe === 'HARRYPOTTER') {
            details.bonus = 'Hechizo Patronus: Expecto Patronum (Expulsa Dementores)';
            details.flavor = `Perteneces a la casa de ${randomElement(['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'])}.`;
        }
        
        return details;
    },
    
    // ===== 🐉 PLACEHOLDERS DE BESTIARIO (Para usar con una API real) =====
    async listMonsters() {
        // En una implementación real, esto consultaría a dnd5eapi.co/api/monsters
        // Usamos el DND_BESTIARY local como fallback para garantizar funcionalidad
        if (typeof DND_BESTIARY !== 'undefined') {
            return Object.keys(DND_BESTIARY).map(key => ({ name: key }));
        }
        return [];
    },
    
    async getMonsterDetails(monsterName) {
        // En una implementación real, consultaría la API.
        // Usamos el DND_BESTIARY local para garantizar funcionalidad
        if (typeof DND_BESTIARY !== 'undefined' && DND_BESTIARY[monsterName]) {
            return DND_BESTIARY[monsterName];
        }
        return null;
    }
};
