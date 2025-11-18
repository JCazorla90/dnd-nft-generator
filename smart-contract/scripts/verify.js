const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS no definida en .env");
  }
  
  console.log("🔍 Verificando contrato en:", contractAddress);
  console.log("🌐 Red:", hre.network.name);
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    
    console.log("✅ Contrato verificado!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Contrato ya verificado");
    } else {
      console.error("❌ Error verificando:", error);
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
