const { expect } = require("chai");
const { ethers } = require("hardhat");
const axios = require("axios");

describe("E2E: Complete NFT Flow", function () {
  let characterNFT;
  let owner, user1, user2;
  let backendUrl = "http://localhost:3000";

  before(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const CharacterNFT = await ethers.getContractFactory("CharacterNFT");
    characterNFT = await CharacterNFT.deploy();
    await characterNFT.waitForDeployment();
    
    console.log("📍 Contract deployed at:", await characterNFT.getAddress());
  });

  describe("Full user journey", function () {
    it("Should complete entire character creation to NFT flow", async function () {
      // 1. Generar personaje desde backend
      console.log("\n🎲 Step 1: Generando personaje aleatorio...");
      const characterResponse = await axios.get(`${backendUrl}/api/generate-character`);
      const character = characterResponse.data;
      
      expect(character).to.have.property('race');
      expect(character).to.have.property('class');
      expect(character).to.have.property('stats');
      console.log("✅ Personaje generado:", character.name);

      // 2. Crear NFT metadata (simular IPFS)
      console.log("\n📦 Step 2: Creando metadata NFT...");
      const mockIPFSUrl = `ipfs://QmMock${Date.now()}`;
      
      // 3. Mintear NFT
      console.log("\n🔗 Step 3: Minteando NFT...");
      const tx = await characterNFT.mintCharacter(user1.address, mockIPFSUrl);
      const receipt = await tx.wait();
      
      const tokenId = 0n;
      expect(await characterNFT.ownerOf(tokenId)).to.equal(user1.address);
      console.log("✅ NFT minteado. Token ID:", tokenId.toString());
      console.log("⛽ Gas usado:", receipt.gasUsed.toString());

      // 4. Verificar metadata
      console.log("\n🔍 Step 4: Verificando metadata...");
      const tokenURI = await characterNFT.tokenURI(tokenId);
      expect(tokenURI).to.equal(mockIPFSUrl);
      console.log("✅ Metadata verificada:", tokenURI);

      // 5. Verificar ownership
      console.log("\n👤 Step 5: Verificando ownership...");
      const balance = await characterNFT.balanceOf(user1.address);
      expect(balance).to.equal(1n);
      console.log("✅ User1 tiene", balance.toString(), "NFT(s)");

      console.log("\n🎉 E2E Flow completado exitosamente!");
    });

    it("Should handle multiple users creating characters", async function () {
      console.log("\n👥 Testing multiple concurrent users...");
      
      const promises = [
        characterNFT.mintCharacter(user1.address, "ipfs://user1"),
        characterNFT.mintCharacter(user2.address, "ipfs://user2"),
        characterNFT.mintCharacter(owner.address, "ipfs://owner")
      ];
      
      await Promise.all(promises);
      
      expect(await characterNFT.getTotalMinted()).to.be.gte(3n);
      console.log("✅ Múltiples usuarios manejados correctamente");
    });

    it("Should calculate accurate gas costs for user flow", async function () {
      console.log("\n⛽ Midiendo costos de gas...");
      
      const tx = await characterNFT.mintCharacter(user1.address, "ipfs://test");
      const receipt = await tx.wait();
      
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.gasPrice || (await ethers.provider.getFeeData()).gasPrice;
      const totalCost = gasUsed * gasPrice;
      const costInEth = ethers.formatEther(totalCost);
      
      console.log("💰 Gas usado:", gasUsed.toString());
      console.log("💰 Gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
      console.log("💰 Costo total:", costInEth, "ETH");
      
      // Verificar que el costo sea razonable
      expect(gasUsed).to.be.below(200000);
    });
  });

  describe("Error handling", function () {
    it("Should handle invalid addresses gracefully", async function () {
      await expect(
        characterNFT.mintCharacter(ethers.ZeroAddress, "ipfs://test")
      ).to.be.reverted;
    });

    it("Should handle querying non-existent tokens", async function () {
      const nonExistentTokenId = 999999n;
      await expect(
        characterNFT.ownerOf(nonExistentTokenId)
      ).to.be.reverted;
    });
  });
});
