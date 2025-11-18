require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { create } = require('ipfs-http-client');

const app = express();
app.use(cors());
app.use(express.json());

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: { authorization: `Basic ${Buffer.from(process.env.IPFS_PROJECT_ID + ":" + process.env.IPFS_PROJECT_SECRET).toString('base64')}` }
});

app.post('/api/create-nft', async (req, res) => {
  try {
    const character = req.body;
    const metadata = {
      name: `${character.race} ${character.class}`,
      description: "Personaje D&D generado con NFT.",
      attributes: [
        { trait_type: "Raza", value: character.race },
        { trait_type: "Clase", value: character.class },
      ]
    };
    const { path } = await ipfs.add(JSON.stringify(metadata));
    res.json({ ipfsUrl: `https://ipfs.io/ipfs/${path}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Backend listo en puerto 3000."));
