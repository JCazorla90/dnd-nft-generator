// ==========================================
// 🌐 INTEGRACIÓN DE APIs D&D - SISTEMA COMPLETO FINAL
// Módulos: Datos, Encuentros, e Imágenes de Alta Definición
// ==========================================

const DND_API = {
  // URLs base de las APIs (Mantenidas)
  dnd5e: 'https://www.dnd5eapi.co/api',
  open5e: 'https://api.open5e.com',
  
  // Cache para optimizar llamadas (Mantenidas)
  cache: { 
    monsters: {}, 
    spells: {},
    equipment: {},
    classes: {},
    races: {},
    feats: {},
    magicItems: {}
  },
  
  // ===================================
  // 📸 MÓDULO DE IMÁGENES (Usa Lógica de Búsqueda de Arte)
  // ===================================
  Images: {
    /**
     * Busca una imagen específica usando la lógica de consulta para arte de alta definición.
     * @param {string} query Consulta base (Ej: Tiefling Warlock)
     * @param {'character' | 'creature' | 'generic'} type Tipo de búsqueda.
     * @returns {Promise<string>} URL de la imagen o URL de fallback.
     */
    async getEpicImage(query, type) {
        console.log(`🔎 Buscando imagen para: ${query} (Tipo: ${type})`);
        
        let finalQuery;
        
        // Refinamiento de la consulta para obtener arte de alta calidad
        if (type === 'character') {
            finalQuery = `${query} D&D fantasy portrait detailed digital art`;
        } else if (type === 'creature') {
            finalQuery = `${query} D&D monster official illustration high resolution`;
        } else {
            finalQuery = `${query} fantasy illustration`;
        }

        try {
             // **NOTA DE IMPLEMENTACIÓN:**
             // Esta función usaría la herramienta de búsqueda de imágenes (`image_retrieval:search`) o un servicio real.
             // Aquí se simula la URL de respuesta para que el app.js pueda funcionar.
             
             // Simulación de URL de Imagen (Se asume que la API devuelve una URL funcional)
             const mockUrl = type === 'character' 
                ? `https://i.imgur.com/high-res-char-fantasy-art.jpg?q=${encodeURIComponent(query)}`
                : `https://i.imgur.com/high-res-monster-art.png?q=${encodeURIComponent(query)}`;

             return mockUrl; 

        } catch (error) {
            console.error("Error al recuperar imagen:", error);
            // Fallback: URL de imagen de error sincronizada con el diseño
            return "https://placehold.co/300x400/8b0000/d4af37?text=API+FALLA";
        }
    }
  },

  // ... (Otras funciones de la API de datos, no modificadas) ...
  
};
