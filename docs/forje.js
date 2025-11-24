<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🐉 D&D Character Forge - La Forja Épica</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=MedievalSharp&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="styles.css">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
</head>
<body>
    
    <div class="mini-header">
        <a href="index.html" class="back-link">← Volver al Menú Principal</a>
        <div class="mode-indicator">Forja Activa</div>
    </div>

    <div class="forge-container container">
        
        <div id="controlPanel" class="control-panel parchment-box">
            <h2 class="control-title">Configuración de la Forja</h2>

            <div class="multiverse-selector">
                <label for="multiverseSelect">🌌 Selecciona el Universo:</label>
                <select id="multiverseSelect" onchange="updateUniverse()">
                    <option value="DND">Dungeons & Dragons Estándar</option>
                    <option value="MTG">Magic: The Gathering (Crossover)</option>
                    <option value="ELDRING">Elden Ring (Crossover)</option>
                </select>
            </div>

            <div class="controls-grid">
                <button onclick="forgeCharacter('random')" class="btn btn-primary">
                    🎲 Generar Héroe Random
                    <span class="btn-subtitle">Crea un personaje aleatorio</span>
                </button>
                <button onclick="forgeCharacter('custom')" class="btn btn-secondary">
                    ⚙️ Generar Héroe Custom
                    <span class="btn-subtitle">Usando las opciones de abajo</span>
                </button>
                <button onclick="forgeCharacter('chaos')" class="btn btn-accent">
                    🌀 Modo CHAOS
                    <span class="btn-subtitle">Fusión de universos y stats locos</span>
                </button>
            </div>
            
            <div id="customInputs" class="custom-inputs">
                <h3 class="section-subtitle">Ajustes Personalizados</h3>
                <div class="grid-2">
                    <input type="text" id="customName" placeholder="Nombre del Héroe">
                    <select id="raceSelect" placeholder="Raza"></select>
                    <select id="classSelect" placeholder="Clase"></select>
                    <select id="customAlign" placeholder="Alineamiento">
                        <option value="LB">Legal Bueno</option>
                        <option value="CN">Caótico Neutral</option>
                    </select>
                </div>
            </div>
        </div>

        <div id="outputArea" style="display: none;">

            <div id="characterSheet" class="character-sheet parchment-box">
                <div class="sheet-header">
                    <h2 id="charName" class="char-name">Nombre</h2>
                    <p id="charMeta" class="char-meta">Raza | Clase | Nivel 1</p>
                    <p class="char-universe">🌌 Universo: <span id="charUniverse">D&D Estándar</span></p>
                </div>

                <div class="grid-2 character-details-grid">
                    
                    <div style="text-align: center;">
                        <div id="nftCard" class="nft-card">
                            <div class="portrait-frame">
                                <img id="charImage" src="https://placehold.co/300x400/3a2517/f4e9d8?text=Cargando+Retrato..." alt="Retrato del Personaje">
                            </div>
                            <div class="nft-metadata">
                                <span id="nftRarity" class="rarity-badge">COMÚN</span>
                                <p>Token ID: <span id="tokenId">000000</span></p>
                            </div>
                        </div>
                        <button onclick="mintNFT()" class="btn btn-gold mint-btn">🔗 Acuñar NFT</button>
                    </div>
                    
                    <div>
                        <h3 class="section-subtitle">📊 Estadísticas Base (STR, DEX...)</h3>
                        <div id="statsDisplay" class="stats-grid">
                            </div>
                        
                        <h3 class="section-subtitle" style="margin-top: 20px;">📜 Habilidades y Rasgos</h3>
                        <div id="abilitiesArea">
                            <p>Rasgos genéricos del Multiverso.</p>
                        </div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button onclick="downloadPDF()" class="btn btn-action">📄 Exportar PDF Épico</button>
                    <button class="btn btn-action">💾 Exportar JSON</button>
                </div>
            </div>

            <div id="mapArea" class="map-area parchment-box">
                <h2 class="control-title">Generador de Mazmorras 🗺️</h2>
                <div class="map-controls">
                    <button onclick="generateMap()" class="btn btn-secondary">Generar Mazmorra</button>
                    <button onclick="addTokens()" class="btn btn-secondary">Añadir Tokens</button>
                </div>
                <canvas id="mapCanvas" width="800" height="600" style="border: 2px solid var(--ink-dark); background-color: #f0f0f0; display: block; margin: 15px auto;"></canvas>
            </div>
        </div>
    </div>

    <footer class="epic-footer">
        <p>⚔️ D&D Character Forge v2.0 - Ultimate Edition</p>
        <p>Creado con ❤️ por <a href="https://github.com/JCazorla90" target="_blank">José Cazorla</a></p>
    </footer>

    <script src="dnd-data-and-multiverse.js"></script> 
    <script src="dnd-apis.js"></script> 
    <script src="forge.js"></script> </body>
</html>
