// API DE IMÁGENES Y DATOS
const DND_API = {
  dnd5e: 'https://www.dnd5eapi.co/api',
  
  Images: {
    async getEpicImage(query, type = 'character') {
      // 1. Lexica (Arte real)
      try {
        const res = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.images?.length) return data.images[0].src;
        }
      } catch(e) {}

      // 2. Pollinations (Generativo - Fallback)
      const seed = Math.floor(Math.random()*9999);
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=512&height=768&seed=${seed}&nologo=true`;
    }
  },

  async listMonsters() {
    const res = await fetch(`${this.dnd5e}/monsters`);
    const data = await res.json();
    return data.results;
  },

  async getMonsterDetails(index) {
    const res = await fetch(`${this.dnd5e}/monsters/${index}`);
    return await res.json();
  }
};
