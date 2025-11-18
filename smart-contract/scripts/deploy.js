const hre = require("hardhat");

async function main() {
  const CharacterNFT = await hre.ethers.getContractFactory("CharacterNFT");
  const contract = await CharacterNFT.deploy();
  await contract.deployed();
  
  console.log(`🎉 Contrato desplegado en: ${contract.address}`);
  console.log(`📝 Actualiza CONTRACT_ADDRESS en frontend/src/utils/web3.js`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
