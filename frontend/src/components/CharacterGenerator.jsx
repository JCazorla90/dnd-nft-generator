import React, { useState } from "react";
import axios from "axios";

export default function CharacterGenerator() {
  const [character, setCharacter] = useState(null);
  const [customRace, setCustomRace] = useState("");
  const [customClass, setCustomClass] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRandom = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:3000/api/generate-character");
      setCharacter(data);
    } catch (error) {
      console.error("Error generando personaje:", error);
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
    } catch (error) {
      console.error("Error creando personaje:", error);
    }
    setLoading(false);
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

      {loading && <p>⏳ Generando...</p>}

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

          <button style={{ marginTop: '15px', padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            🔗 Mintear NFT (Próximamente)
          </button>
        </div>
      )}
    </div>
  );
}
