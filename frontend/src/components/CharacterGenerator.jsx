import React, { useState } from "react";
import axios from "axios";
import { mintNFT } from "../utils/web3";

export default function CharacterGenerator() {
  const [character, setCharacter] = useState(null);
  const [customRace, setCustomRace] = useState("");
  const [customClass, setCustomClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [minting, setMinting] = useState(false);

  const generateRandom = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:3000/api/generate-character");
      setCharacter(data);
      setNftData(null);
    } catch (error) {
      console.error("Error generando personaje:", error);
      alert("Error generando personaje");
    }
    setLoading(false);
  };

  const generateCustom = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:3000/api/create-character", {
        race: customRace,
        class: customClass
      });
      setCharacter(data);
      setNftData(null);
    } catch (error) {
      console.error("Error creando personaje:", error);
      alert("Error creando personaje");
    }
    setLoading(false);
  };

  const createNFT = async () => {
    if (!character) return;
    
    setMinting(true);
    try {
      // 1. Crear imagen y metadata en IPFS
      const { data } = await axios.post("http://localhost:3000/api/create-nft", character);
      setNftData(data);
      
      // 2. Mintear NFT en blockchain
      const txHash = await mintNFT(data.metadataUrl);
      alert(`¡NFT minteado exitosamente! TX: ${txHash}`);
    } catch (error) {
      console.error("Error creando NFT:", error);
      alert("Error creando NFT: " + error.message);
    }
    setMinting(false);
  };

  return (
    <div>
      <h2>⚔️ Generador de Personajes</h2>
      
      <button onClick={generateRandom} disabled={loading}>
        🎲 Generar Personaje Aleatorio
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Personalizar</h3>
        <input
          placeholder="Raza (ej: Elfo)"
          value={customRace}
          onChange={e => setCustomRace(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input
          placeholder="Clase (ej: Mago)"
          value={customClass}
          onChange={e => setCustomClass(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button onClick={generateCustom} disabled={loading}>
          ✨ Crear Personalizado
        </button>
      </div>

      {loading && <p>⏳ Generando personaje...</p>}

      {character && (
        <div style={{ 
          marginTop: '30px', 
          border: '2px solid #333', 
          padding: '20px', 
          borderRadius: '10px',
          background: '#f9f9f9'
        }}>
          <h3>📜 Ficha de Personaje</h3>
          <p><strong>Nombre:</strong> {character.name}</p>
          <p><strong>Raza:</strong> {character.race}</p>
          <p><strong>Clase:</strong> {character.class}</p>
          <p><strong>Trasfondo:</strong> {character.background}</p>
          <p><strong>Alineamiento:</strong> {character.alignment}</p>
          <p><strong>Nivel:</strong> {character.level}</p>
          <p><strong>HP:</strong> {character.hp}</p>
          
          <h4>Estadísticas:</h4>
          <ul>
            <li>Fuerza: {character.stats.fuerza}</li>
            <li>Destreza: {character.stats.destreza}</li>
            <li>Constitución: {character.stats.constitución}</li>
            <li>Inteligencia: {character.stats.inteligencia}</li>
            <li>Sabiduría: {character.stats.sabiduría}</li>
            <li>Carisma: {character.stats.carisma}</li>
          </ul>

          <button 
            onClick={createNFT} 
            disabled={minting}
            style={{ 
              marginTop: '15px', 
              padding: '10px 20px', 
              background: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: minting ? 'not-allowed' : 'pointer',
              opacity: minting ? 0.6 : 1
            }}
          >
            {minting ? '⏳ Creando NFT...' : '🔗 Crear NFT'}
          </button>
        </div>
      )}

      {nftData && (
        <div style={{ 
          marginTop: '20px', 
          border: '2px solid #4CAF50', 
          padding: '20px', 
          borderRadius: '10px',
          background: '#e8f5e9'
        }}>
          <h3>✅ NFT Creado</h3>
          <img src={nftData.imageUrl} alt="Character" style={{ maxWidth: '300px', borderRadius: '10px' }} />
          <p><strong>Metadata URL:</strong> <a href={nftData.metadataUrl} target="_blank" rel="noopener noreferrer">{nftData.metadataUrl}</a></p>
        </div>
      )}
    </div>
  );
}
