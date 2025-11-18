import React from "react";
import CharacterGenerator from "./components/CharacterGenerator";
import axios from "axios";

function App() {
  const handleExportNFT = async (character) => {
    // Puedes mejorar: enviar imagen/ficha completa
    const { data } = await axios.post("http://localhost:3000/api/create-nft", character);
    alert("NFT creado: " + data.nftUrl);
  };

  return (
    <div>
      <CharacterGenerator onExport={handleExportNFT} />
    </div>
  );
}

export default App;
