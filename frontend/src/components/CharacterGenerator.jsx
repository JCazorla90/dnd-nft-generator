import React, { useState } from "react";

// Ejemplo sencillo de atributos, amplíalo cómo quieras.
const races = ["Elfo", "Enano", "Humano", "Orco"];
const classes = ["Guerrero", "Mago", "Bardo", "Pícaro"];

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function CharacterGenerator() {
  const [character, setCharacter] = useState(null);

  const generateRandomCharacter = () => {
    setCharacter({
      race: randomFromArray(races),
      class: randomFromArray(classes),
    });
  };

  return (
    <div>
      <h2>Generador de Personaje D&D</h2>
      <button onClick={generateRandomCharacter}>
        Generar Personaje Aleatorio
      </button>
      {character && (
        <div>
          <h3>Ficha:</h3>
          <p>Raza: {character.race}</p>
          <p>Clase: {character.class}</p>
        </div>
      )}
    </div>
  );
}
