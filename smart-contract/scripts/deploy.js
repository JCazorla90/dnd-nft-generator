const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("🧙 Desplegando contrato con la cuenta:", deployer.address);
  console.log("💰 Balance:", (await deployer.provider.getBalance(deployer.address)).toString());
  console.log("🌐 Red:", hre.network.name);

  const CharacterNFT = await hre.ethers.getContractFactory("CharacterNFT");
  console.log("⏳ Desplegando CharacterNFT...");
  
  const characterNFT = await CharacterNFT.deploy();
  await characterNFT.waitForDeployment();
  
  const address = await characterNFT.getAddress();
  
  console.log("✅ CharacterNFT desplegado en:", address);
  console.log("📝 Guarda esta dirección en frontend/src/utils/web3.js");
  
  // Esperar a que se confirme en block explorers
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Esperando confirmaciones...");
    await characterNFT.deploymentTransaction().wait(6);
    console.log("✅ Contrato confirmado");
  }
  
  return address;
}

main()
  .then((address) => {
    console.log(`\n🎉 Deployment completo!`);
    console.log(`📋 Dirección: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

