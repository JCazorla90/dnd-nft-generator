const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Datos de D&D
const races = ["Elfo", "Enano", "Humano", "Orco", "Mediano", "Tiefling"];
const classes = ["Guerrero", "Mago", "Bardo", "Pícaro", "Clérigo", "Paladín"];
const backgrounds = ["Noble", "Criminal", "Erudito", "Soldado", "Artista"];
const alignments = ["Legal Bueno", "Neutral", "Caótico Neutral", "Legal Malvado"];

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateStats() {
  return {
    fuerza: Math.floor(Math.random() * 15) + 6,
    destreza: Math.floor(Math.random() * 15) + 6,
    constitución: Math.floor(Math.random() * 15) + 6,
    inteligencia: Math.floor(Math.random() * 15) + 6,
    sabiduría: Math.floor(Math.random() * 15) + 6,
    carisma: Math.floor(Math.random() * 15) + 6
  };
}

// Endpoint: Generar personaje aleatorio
app.get('/api/generate-character', (req, res) => {
  const character = {
    name: `${randomFromArray(races)} ${randomFromArray(classes)}`,
    race: randomFromArray(races),
    class: randomFromArray(classes),
    background: randomFromArray(backgrounds),
    alignment: randomFromArray(alignments),
    level: 1,
    stats: generateStats(),
    hp: Math.floor(Math.random() * 10) + 10
  };
  res.json(character);
});

// Endpoint: Crear personaje personalizado
app.post('/api/create-character', (req, res) => {
  const { race, class: charClass } = req.body;
  const character = {
    name: `${race || randomFromArray(races)} ${charClass || randomFromArray(classes)}`,
    race: race || randomFromArray(races),
    class: charClass || randomFromArray(classes),
    background: randomFromArray(backgrounds),
    alignment: randomFromArray(alignments),
    level: 1,
    stats: generateStats(),
    hp: Math.floor(Math.random() * 10) + 10
  };
  res.json(character);
});

app.listen(3000, () => {
  console.log('🧙 Backend D&D listo en puerto 3000');
});
