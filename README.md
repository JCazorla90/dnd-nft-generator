# 🐲 D&D NFT Character Forge 🛡️


![Release](https://github.com/JCazorla90/dnd-nft-generator/workflows/Release/badge.svg)
![Docker](https://github.com/JCazorla90/dnd-nft-generator/workflows/Docker%20Build%20%26%20Push/badge.svg)
![Version](https://img.shields.io/github/v/release/JCazorla90/dnd-nft-generator?style=flat-square)
![License](https://img.shields.io/github/license/JCazorla90/dnd-nft-generator?style=flat-square)


¡Saludos, aventurero!  
Bienvenido a la **Forja definitiva de Personajes NFT para Dragones y Mazmorras**, donde la fantasía se une a la blockchain y el código es la mejor arma mágica.

Repositorio oficial: [github.com/JCazorla90/dnd-nft-generator](https://github.com/JCazorla90/dnd-nft-generator/)

---

## ⚔️ ¿Qué es este proyecto?

Imagina lanzar los dados y ver cómo surge ante ti un héroe, pícaro o mago, listo para la aventura y convertido en un NFT único.  
¡Eso hace este proyecto!:

- **Generador automático y manual de fichas** al estilo D&D
- **Creación de imágenes únicas por IA** o por capas, en tiempo real
- **Minteo de NFT** para tu personaje, preservando sus hazañas (o pifias) eternamente
- **Compartir y coleccionar** tus héroes digitales: esto es la taberna 3.0

---

## 🧙‍♂️ Magia del Código: arquitectura arcana


Jugador 👨‍💻  
 │  
 ▼  
Frontend React 🧝 ────▶ Backend Node.js/Express 🧙  
 │               │  
 ▼               ▼  
NFT Smart Contract ⛓️ ◀─── IPFS (Imágenes + Datos)


### Componentes principales

- **Frontend (React + Vite):**
  - UI para generar personajes de D&D al azar o a medida
  - Visualización de ficha, imagen y botón de mint NFT

- **Backend (Node.js/Express):**
  - Lógica de generación de personaje
  - Creación automática de imágenes (por capas o IA, a gusto del mago)
  - Subida de imágenes y metadatos a IPFS (¡que la historia perdure!)

- **Smart Contract (Solidity ERC-721):**
  - NFT único por cada ficha
  - Integra atributos e imagen en la blockchain

---

## 🧪 Testing & Quality

- ✅ Unit tests (100% coverage)
- ✅ E2E integration tests
- ✅ Gas cost analysis
- ✅ Security audits (Slither + Mythril)
- ✅ Automated testnet deployment
- ✅ Real-time gas monitoring

## 📊 Metrics

[View Live Gas Dashboard](https://jcazorla90.github.io/dnd-nft-generator/gas-dashboard.html)


## 🐉 Despliegue: ¡invoca el poder!

### 1. Clona la forja digital

git clone https://github.com/JCazorla90/dnd-nft-generator.git
cd dnd-nft-generator
# Sepolia
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/TU_INFURA_KEY
ETHERSCAN_API_KEY=tu_etherscan_api_key

# Mumbai (Polygon)
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/TU_INFURA_KEY
POLYGONSCAN_API_KEY=tu_polygonscan_api_key

# Wallet (usa una wallet SOLO para testnet)
TESTNET_PRIVATE_KEY=tu_private_key_de_testnet

# Opcional
COINMARKETCAP_API_KEY=para_gas_reporter





