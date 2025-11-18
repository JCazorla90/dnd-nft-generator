import { ethers } from 'ethers';

// ABI del contrato (simplificado)
const CONTRACT_ABI = [
  "function mintCharacter(address recipient, string memory tokenURI) public returns (uint256)"
];

// Dirección del contrato (cambiar por la tuya después de desplegar)
const CONTRACT_ADDRESS = "0xTU_CONTRATO_ADDRESS_AQUI";

export async function mintNFT(tokenURI) {
  if (!window.ethereum) {
    throw new Error("MetaMask no está instalado");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  const address = await signer.getAddress();
  
  const tx = await contract.mintCharacter(address, tokenURI);
  await tx.wait();
  
  return tx.hash;
}
