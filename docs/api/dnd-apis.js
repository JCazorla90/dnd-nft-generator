// ==========================================
// 🌐 INTEGRACIÓN DE APIs D&D - SISTEMA COMPLETO FINAL
// Módulos: Datos y Imágenes de Alta Definición (Simulado)
// ==========================================

const DND_API = {
  // URLs base de las APIs (Mantenidas)
  dnd5e: 'https://www.dnd5eapi.co/api',
  open5e: 'https://api.open5e.com',
  
  // Cache para optimizar llamadas (Mantenidas)
  cache: { monsters: {}, classes: {}, races: {} },
  
  // ===================================
  // 📸 MÓDULO DE IMÁGENES (Simula la Búsqueda de Arte)
  // ===================================
  Images: {
    /**
     * Simula la búsqueda de una imagen específica de alta definición.
     * @param {string} query Consulta base (Ej: Tiefling Warlock)
     * @param {'character' | 'creature' | 'generic'} type Tipo de búsqueda.
     * @returns {Promise<string>} URL de la imagen o URL de fallback.
     */
    async getEpicImage(query, type) {
        console.log(`🔎 Simulación: Buscando imagen para: ${query} (Tipo: ${type})`);
        
        // Simulación de URL de Imagen (Usamos placehold.co con colores temáticos)
        const placeholderColor = type === 'character' ? '300x400/5c0000/d4af37' : '300x400/1a0f08/f4e9d8';
        const fallbackUrl = `https://placehold.co/${placeholderColor}?text=${type.toUpperCase()}+${encodeURIComponent(query).substring(0, 15)}`;

        // En un entorno real, aquí se realizaría la llamada a la API.
        // Simulamos un retraso de red.
        await new Promise(resolve => setTimeout(resolve, 800));

        return fallbackUrl; 
    }
  },

  // ===================================
  // 👹 MÓDULO DE MONSTRUOS (Simulado con API D&D 5e)
  // ===================================
  /** Simula la obtención de un monstruo de la API (solo para que funcione generateAPICreature) */
  async fetchRandomAPIMonster() {
    console.log("📡 Simulación: Petición de monstruo a API D&D 5e...");
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // Monstruo de ejemplo (simulado)
    return {
        name: "Golem de Carne (API)",
        type: "Constructo",
        cr: "5",
        xp: 1800,
        ac: 9,
        hp: 93,
        speed: "30 ft",
        stats: { str: 19, dex: 9, con: 18, int: 3, wis: 11, cha: 5 },
        actions: ["Multiataque", "Golpe: +7, 2d8+4 de daño"],
        traits: ["Absorción de Relámpago", "Inmunidad Mágica"],
        legendaryActions: [],
        defenses: "Inmunidad: Relámpago, Veneno, Contundente/Perforante/Cortante no mágico"
    };
  }
};
