# 🐲 D&D NFT Character Forge 🛡️

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

## 🐉 Despliegue: ¡invoca el poder!

### 1. Clona la forja digital

git clone https://github.com/JCazorla90/dnd-nft-generator.git
cd dnd-nft-generator

# 🐲 D&D NFT Character Forge 🛡️

![CI Status](https://github.com/JCazorla90/dnd-nft-generator/workflows/CI%20-%20Test%20%26%20Build/badge.svg)
![Release](https://github.com/JCazorla90/dnd-nft-generator/workflows/Release/badge.svg)
![Docker](https://github.com/JCazorla90/dnd-nft-generator/workflows/Docker%20Build%20%26%20Push/badge.svg)
![Version](https://img.shields.io/github/v/release/JCazorla90/dnd-nft-generator?style=flat-square)
![License](https://img.shields.io/github/license/JCazorla90/dnd-nft-generator?style=flat-square)
