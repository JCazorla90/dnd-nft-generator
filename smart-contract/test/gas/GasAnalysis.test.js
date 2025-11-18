const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

describe("Gas Cost Analysis", function () {
  let characterNFT;
  let owner, user1;
  const gasResults = [];

  before(async function () {
    [owner, user1] = await ethers.getSigners();
    
    const CharacterNFT = await ethers.getContractFactory("CharacterNFT");
    characterNFT = await CharacterNFT.deploy();
    await characterNFT.waitForDeployment();
  });

  after(async function () {
    // Guardar resultados de gas
    const reportPath = path.join(__dirname, '../../gas-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(gasResults, null, 2));
    console.log("\n📊 Gas report guardado en:", reportPath);
    
    // Crear tabla markdown
    const markdownReport = generateMarkdownReport(gasResults);
    const mdPath = path.join(__dirname, '../../GAS_REPORT.md');
    fs.writeFileSync(mdPath, markdownReport);
    console.log("📊 Markdown report guardado en:", mdPath);
  });

  it("Deploy cost", async function () {
    const CharacterNFT = await ethers.getContractFactory("CharacterNFT");
    const deployTx = CharacterNFT.getDeployTransaction();
    const estimatedGas = await ethers.provider.estimateGas(deployTx);
    
    gasResults.push({
      operation: "Deploy Contract",
      gasUsed: estimatedGas.toString(),
      category: "Deployment"
    });
    
    console.log("⛽ Deploy gas:", estimatedGas.toString());
  });

  it("First mint (cold storage)", async function () {
    const tx = await characterNFT.mintCharacter(user1.address, "ipfs://first");
    const receipt = await tx.wait();
    
    gasResults.push({
      operation: "First Mint (Cold)",
      gasUsed: receipt.gasUsed.toString(),
      category: "Minting"
    });
    
    console.log("⛽ First mint:", receipt.gasUsed.toString());
  });

  it("Subsequent mints (warm storage)", async function () {
    const mints = [];
    for (let i = 0; i < 5; i++) {
      const tx = await characterNFT.mintCharacter(user1.address, `ipfs://mint${i}`);
      const receipt = await tx.wait();
      mints.push(receipt.gasUsed);
    }
    
    const avgGas = mints.reduce((a, b) => a + b, 0n) / BigInt(mints.length);
    
    gasResults.push({
      operation: "Average Mint (Warm)",
      gasUsed: avgGas.toString(),
      category: "Minting"
    });
    
    console.log("⛽ Average warm mint:", avgGas.toString());
  });

  it("Mint with short vs long URI", async function () {
    const shortTx = await characterNFT.mintCharacter(user1.address, "ipfs://a");
    const shortReceipt = await shortTx.wait();
    
    const longURI = "ipfs://Qm" + "a".repeat(500);
    const longTx = await characterNFT.mintCharacter(user1.address, longURI);
    const longReceipt = await longTx.wait();
    
    gasResults.push({
      operation: "Mint Short URI",
      gasUsed: shortReceipt.gasUsed.toString(),
      category: "URI Comparison"
    });
    
    gasResults.push({
      operation: "Mint Long URI (500 chars)",
      gasUsed: longReceipt.gasUsed.toString(),
      category: "URI Comparison"
    });
    
    const difference = longReceipt.gasUsed - shortReceipt.gasUsed;
    console.log("⛽ Diferencia short vs long:", difference.toString());
  });

  it("Gas cost at different network congestion (simulation)", async function () {
    const feeData = await ethers.provider.getFeeData();
    const baseGas = 150000n;
    
    const scenarios = [
      { name: "Low congestion (10 gwei)", price: ethers.parseUnits("10", "gwei") },
      { name: "Medium congestion (50 gwei)", price: ethers.parseUnits("50", "gwei") },
      { name: "High congestion (100 gwei)", price: ethers.parseUnits("100", "gwei") },
      { name: "Extreme congestion (500 gwei)", price: ethers.parseUnits("500", "gwei") }
    ];
    
    scenarios.forEach(scenario => {
      const totalCost = baseGas * scenario.price;
      const costInEth = ethers.formatEther(totalCost);
      
      gasResults.push({
        operation: scenario.name,
        gasUsed: baseGas.toString(),
        gasPrice: ethers.formatUnits(scenario.price, "gwei") + " gwei",
        totalCostETH: costInEth,
        category: "Network Conditions"
      });
      
      console.log(`💰 ${scenario.name}: ${costInEth} ETH`);
    });
  });
});

function generateMarkdownReport(results) {
  let markdown = "# ⛽ Gas Cost Analysis Report\n\n";
  markdown += `Generated: ${new Date().toISOString()}\n\n`;
  
  const categories = [...new Set(results.map(r => r.category))];
  
  categories.forEach(category => {
    markdown += `## ${category}\n\n`;
    markdown += "| Operation | Gas Used | Gas Price | Total Cost (ETH) |\n";
    markdown += "|-----------|----------|-----------|------------------|\n";
    
    results
      .filter(r => r.category === category)
      .forEach(result => {
        markdown += `| ${result.operation} | ${result.gasUsed} | ${result.gasPrice || 'N/A'} | ${result.totalCostETH || 'N/A'} |\n`;
      });
    
    markdown += "\n";
  });
  
  return markdown;
}
