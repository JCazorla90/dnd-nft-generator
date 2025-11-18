const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CharacterNFT", function () {
  let characterNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const CharacterNFT = await ethers.getContractFactory("CharacterNFT");
    characterNFT = await CharacterNFT.deploy();
    await characterNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await characterNFT.name()).to.equal("DnDCharacter");
      expect(await characterNFT.symbol()).to.equal("DNDNFT");
    });

    it("Should set the right owner", async function () {
      expect(await characterNFT.owner()).to.equal(owner.address);
    });

    it("Should start with 0 tokens minted", async function () {
      expect(await characterNFT.getTotalMinted()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should mint a new character NFT", async function () {
      const tokenURI = "ipfs://QmTest123";
      
      await expect(characterNFT.mintCharacter(addr1.address, tokenURI))
        .to.emit(characterNFT, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, 0);
      
      expect(await characterNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await characterNFT.tokenURI(0)).to.equal(tokenURI);
      expect(await characterNFT.getTotalMinted()).to.equal(1);
    });

    it("Should mint multiple NFTs with sequential IDs", async function () {
      await characterNFT.mintCharacter(addr1.address, "ipfs://QmTest1");
      await characterNFT.mintCharacter(addr2.address, "ipfs://QmTest2");
      
      expect(await characterNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await characterNFT.ownerOf(1)).to.equal(addr2.address);
      expect(await characterNFT.getTotalMinted()).to.equal(2);
    });

    it("Should return correct token ID when minting", async function () {
      const tx = await characterNFT.mintCharacter(addr1.address, "ipfs://test");
      const receipt = await tx.wait();
      
      // Verificar que se emitió Transfer con tokenId 0
      const transferEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === 'Transfer'
      );
      expect(transferEvent.args[2]).to.equal(0n);
    });
  });

  describe("Gas costs", function () {
    it("Should report gas cost for minting", async function () {
      const tx = await characterNFT.mintCharacter(
        addr1.address, 
        "ipfs://QmTest123"
      );
      const receipt = await tx.wait();
      
      console.log(`⛽ Gas usado para mint: ${receipt.gasUsed.toString()}`);
      expect(receipt.gasUsed).to.be.below(200000); // Menos de 200k gas
    });
  });

  describe("Edge cases", function () {
    it("Should handle empty tokenURI", async function () {
      await characterNFT.mintCharacter(addr1.address, "");
      expect(await characterNFT.tokenURI(0)).to.equal("");
    });

    it("Should handle very long tokenURI", async function () {
      const longURI = "ipfs://Qm" + "a".repeat(500);
      await characterNFT.mintCharacter(addr1.address, longURI);
      expect(await characterNFT.tokenURI(0)).to.equal(longURI);
    });
  });
});
