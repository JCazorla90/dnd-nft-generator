const hre = require("hardhat");
const axios = require("axios");

async function main() {
  console.log("⛽ Gas Price Monitor - D&D NFT Generator\n");
  
  const provider = hre.ethers.provider;
  
  // Obtener precio actual de gas
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  const maxFeePerGas = feeData.maxFeePerGas;
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
  
  console.log("📊 Current Gas Prices:");
  console.log(`   Gas Price: ${hre.ethers.formatUnits(gasPrice, "gwei")} gwei`);
  console.log(`   Max Fee: ${hre.ethers.formatUnits(maxFeePerGas, "gwei")} gwei`);
  console.log(`   Priority Fee: ${hre.ethers.formatUnits(maxPriorityFeePerGas, "gwei")} gwei`);
  
  // Estimar costo de operaciones
  const estimatedMintGas = 150000n;
  const mintCost = estimatedMintGas * gasPrice;
  
  console.log("\n💰 Estimated Costs:");
  console.log(`   Mint NFT: ${hre.ethers.formatEther(mintCost)} ETH`);
  
  // Obtener precio de ETH
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const ethPriceUSD = response.data.ethereum.usd;
    const mintCostUSD = parseFloat(hre.ethers.formatEther(mintCost)) * ethPriceUSD;
    
    console.log(`   Mint NFT: $${mintCostUSD.toFixed(2)} USD`);
    
    // Alertas
    if (parseFloat(hre.ethers.formatUnits(gasPrice, "gwei")) > 100) {
      console.log("\n🚨 WARNING: Gas prices are HIGH! Consider waiting.");
    } else if (parseFloat(hre.ethers.formatUnits(gasPrice, "gwei")) < 20) {
      console.log("\n✅ GOOD: Gas prices are LOW! Good time to deploy.");
    }
  } catch (error) {
    console.log("\n⚠️  Could not fetch ETH price");
  }
  
  // Recomendaciones
  console.log("\n📋 Recommendations:");
  const gasPriceGwei = parseFloat(hre.ethers.formatUnits(gasPrice, "gwei"));
  
  if (gasPriceGwei < 20) {
    console.log("   ✅ Deploy now - prices are optimal");
  } else if (gasPriceGwei < 50) {
    console.log("   ⚠️  Consider deploying - prices are moderate");
  } else if (gasPriceGwei < 100) {
    console.log("   ⏰ Wait if possible - prices are elevated");
  } else {
    console.log("   🚨 DO NOT DEPLOY - prices are extremely high");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
