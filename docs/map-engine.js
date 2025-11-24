/**
 * ═══════════════════════════════════════════════════════════════════
 * 🗺️ TACTICAL MAP GENERATOR
 * Genera escenarios de batalla con grid real tipo D&D
 * ═══════════════════════════════════════════════════════════════════
 */

const MapEngine = {
    canvas: null,
    ctx: null,
    tileSize: 40, // Pixeles por casilla (5ft)

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        // Ajustar tamaño
        this.canvas.width = 600;
        this.canvas.height = 400;
    },

    generateDungeon() {
        if (!this.ctx) return;
        
        // 1. Fondo (Suelo de piedra)
        this.ctx.fillStyle = '#2a2a2a'; // Fondo oscuro
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 2. Dibujar Habitaciones Aleatorias
        const rooms = Math.floor(Math.random() * 5) + 3;
        this.ctx.fillStyle = '#5d4037'; // Color suelo tierra/piedra
        
        for (let i = 0; i < rooms; i++) {
            const w = (Math.floor(Math.random() * 6) + 2) * this.tileSize;
            const h = (Math.floor(Math.random() * 6) + 2) * this.tileSize;
            const x = Math.floor(Math.random() * (this.canvas.width - w) / this.tileSize) * this.tileSize;
            const y = Math.floor(Math.random() * (this.canvas.height - h) / this.tileSize) * this.tileSize;
            
            this.ctx.fillRect(x, y, w, h);
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, w, h);
        }

        // 3. Dibujar Grid (Rejilla táctica)
        this.drawGrid();
    },

    drawGrid() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;

        // Líneas Verticales
        for (let x = 0; x <= this.canvas.width; x += this.tileSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
        }

        // Líneas Horizontales
        for (let y = 0; y <= this.canvas.height; y += this.tileSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
        }

        this.ctx.stroke();
    }
};
