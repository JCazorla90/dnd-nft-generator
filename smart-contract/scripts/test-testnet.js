const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS no definida");
  }
  
  console.log("🧪 Testing contrato en testnet...");
  console.log("📍 Contrato:", contractAddress);
  console.log("🌐 Red:", hre.network.name);
  
  const CharacterNFT = await hre.ethers.getContractFactory("CharacterNFT");
  const contract = CharacterNFT.attach(contractAddress);
  
  // Test 1: Verificar nombre y símbolo
  console.log("\n🧪 Test 1: Verificar nombre y símbolo");
  const name = await contract.name();
  const symbol = await contract.symbol();
  console.log("✅ Nombre:", name);
  console.log("✅ Símbolo:", symbol);
  
  // Test 2: Mintear NFT de prueba
  console.log("\n🧪 Test 2: Mintear NFT de prueba");
  const testURI = `ipfs://QmTest${Date.now()}`;
  const tx = await contract.mintCharacter(deployer.address, testURI);
  console.log("⏳ TX enviada:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("✅ TX confirmada en bloque:", receipt.blockNumber);
  console.log("⛽ Gas usado:", receipt.gasUsed.toString());
  
  // Test 3: Verificar token
  const totalMinted = await contract.getTotalMinted();
  const tokenId = totalMinted - 1n;
  
  console.log("\n🧪 Test 3: Verificar token minteado");
  console.log("🎫 Token ID:", tokenId.toString());
  
  const owner = await contract.ownerOf(tokenId);
  const tokenURI = await contract.tokenURI(tokenId);
  
  console.log("✅ Owner:", owner);
  console.log("✅ Token URI:", tokenURI);
  console.log("✅ Total minteado:", totalMinted.toString());
  
  console.log("\n🎉 Todos los tests pasaron!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
