import React from "react";
import CharacterGenerator from "./components/CharacterGenerator";

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🐲 D&D NFT Character Forge 🛡️</h1>
      <CharacterGenerator />
    </div>
  );
}

export default App;
