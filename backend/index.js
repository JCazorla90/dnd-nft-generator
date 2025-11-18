const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { create } = require('ipfs-http-client');

const app = express();
app.use(cors());
app.use(express.json());

// IPFS Client (Infura)
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: 'Basic ' + Buffer.from(
      process.env.IPFS_PROJECT_ID + ':' + process.env.IPFS_PROJECT_SECRET
    ).toString('base64')
  }
});

// Datos de D&D
const races = ["Elfo", "Enano", "Humano", "Orco", "Mediano", "Tiefling", "Dracónido"];
const classes = ["Guerrero", "Mago", "Bardo", "Pícaro", "Clérigo", "Paladín", "Brujo"];
const backgrounds = ["Noble", "Criminal", "Erudito", "Soldado", "Artista", "Ermitaño"];
const alignments = ["Legal Bueno", "Neutral Bueno", "Caótico Bueno", "Legal Neutral", "Neutral", "Caótico Neutral"];

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

// Generar prompt para IA
function generateImagePrompt(character) {
  return `Fantasy character portrait, ${character.race} ${character.class}, detailed digital art, D&D character sheet style, high quality, colorful, epic fantasy`;
}

// Generar imagen con Replicate (Stable Diffusion)
async function generateCharacterImage(prompt) {
  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        input: { prompt }
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Esperar a que la imagen esté lista
    let prediction = response.data;
    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await axios.get(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: { Authorization: `Token ${process.env.REPLICATE_TOKEN}` }
        }
      );
      prediction = statusResponse.data;
    }

    if (prediction.status === 'succeeded') {
      return prediction.output[0]; // URL de la imagen
    }
    throw new Error('Image generation failed');
  } catch (error) {
    console.error('Error generando imagen:', error);
    // Fallback: imagen placeholder
    return 'https://via.placeholder.com/512x512.png?text=D%26D+Character';
  }
}

// Subir metadata a IPFS
async function uploadToIPFS(metadata) {
  try {
    const { path } = await ipfs.add(JSON.stringify(metadata));
    return `https://ipfs.io/ipfs/${path}`;
  } catch (error) {
    console.error('Error subiendo a IPFS:', error);
    throw error;
  }
}

// Endpoint: Generar personaje aleatorio
app.get('/api/generate-character', (req, res) => {
  const character = {
    name: `${randomFromArray(races)} el ${randomFromArray(classes)}`,
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
    name: `${race || randomFromArray(races)} el ${charClass || randomFromArray(classes)}`,
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

// Endpoint: Crear NFT completo (imagen + metadata IPFS)
app.post('/api/create-nft', async (req, res) => {
  try {
    const character = req.body;
    
    // 1. Generar imagen con IA
    console.log('🎨 Generando imagen...');
    const prompt = generateImagePrompt(character);
    const imageUrl = await generateCharacterImage(prompt);
    
    // 2. Crear metadata NFT
    const metadata = {
      name: character.name,
      description: `${character.race} ${character.class} - Nivel ${character.level}`,
      image: imageUrl,
      attributes: [
        { trait_type: 'Raza', value: character.race },
        { trait_type: 'Clase', value: character.class },
        { trait_type: 'Trasfondo', value: character.background },
        { trait_type: 'Alineamiento', value: character.alignment },
        { trait_type: 'Nivel', value: character.level },
        { trait_type: 'HP', value: character.hp },
        { trait_type: 'Fuerza', value: character.stats.fuerza },
        { trait_type: 'Destreza', value: character.stats.destreza },
        { trait_type: 'Constitución', value: character.stats.constitución },
        { trait_type: 'Inteligencia', value: character.stats.inteligencia },
        { trait_type: 'Sabiduría', value: character.stats.sabiduría },
        { trait_type: 'Carisma', value: character.stats.carisma }
      ]
    };
    
    // 3. Subir metadata a IPFS
    console.log('📦 Subiendo a IPFS...');
    const metadataUrl = await uploadToIPFS(metadata);
    
    res.json({
      success: true,
      imageUrl,
      metadataUrl,
      metadata
    });
  } catch (error) {
    console.error('Error creando NFT:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('🧙 Backend D&D con NFT/IPFS listo en puerto 3000');
});
