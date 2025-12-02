/**
 * ═══════════════════════════════════════════════════════════════════
 * 🧙 D&D CHARACTER FORGE - MAIN LOGIC
 * Soporta Multiverso, Mapas, NFT y Exportación Épica (LaTeX)
 * Copyright (c) 2025 José Cazorla
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

let currentUniverse = 'DND';
let activeCharacter = null;
const STAT_KEYS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

// 1. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    console.log("⚔️ Sistema Forge V2 Iniciado");
    
    // Rellenar selector de universo con opciones
    const multiverseSelect = document.getElementById('multiverseSelect');
    multiverseSelect.innerHTML = ''; // Limpiar opciones por defecto
    
    for (const key in MULTIVERSE_DATA) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = MULTIVERSE_DATA[key].name;
        multiverseSelect.appendChild(option);
    }
    
    updateUniverse(); // Carga datos iniciales y llena selects de Raza/Clase
    // Asegurar que MapEngine existe antes de inicializar
    if (typeof MapEngine !== 'undefined' && document.getElementById('mapCanvas')) {
        MapEngine.init('mapCanvas'); // Inicia motor de mapas
    } else {
        console.warn("MapEngine o 'mapCanvas' no están disponibles.");
    }
});

// 2. SISTEMA DE MULTIVERSO
function updateUniverse() {
    currentUniverse = document.getElementById('multiverseSelect').value;
    const raceSelect = document.getElementById('raceSelect');
    const classSelect = document.getElementById('classSelect');
    
    // Limpiar
    raceSelect.innerHTML = '';
    classSelect.innerHTML = '';
    
    let data;
    
    if (currentUniverse === 'DND') {
        // Asumiendo que DND_DATA contiene 'races' y 'classes' como objetos o arrays
        data = { 
            races: Object.keys(DND_DATA.races || {}), 
            classes: Object.keys(DND_DATA.classes || {}) 
        };
    } else {
        // Cargar de MULTIVERSE_DATA
        data = MULTIVERSE_DATA[currentUniverse];
    }
    
    // Opciones por defecto para personalización
    raceSelect.innerHTML += '<option value="">(Aleatorio)</option>';
    classSelect.innerHTML += '<option value="">(Aleatorio)</option>';

    // Llenar selects
    data.races.forEach(r => raceSelect.innerHTML += `<option value="${r}">${r}</option>`);
    data.classes.forEach(c => classSelect.innerHTML += `<option value="${c}">${c}</option>`);
    
    console.log(`🌌 Universo cambiado a: ${currentUniverse}`);
}

// 3. GENERACIÓN DE PERSONAJE
async function forgeCharacter(mode) {
    const output = document.getElementById('outputArea');
    output.style.display = 'block';
    
    // 1. Obtener datos base y manejar aleatoriedad/custom
    let race = document.getElementById('raceSelect').value;
    let charClass = document.getElementById('classSelect').value;
    let name = document.getElementById('customName').value;
    
    const universeData = MULTIVERSE_DATA[currentUniverse];
    
    if (mode === 'random' || (mode === 'custom' && !race)) {
        race = universeData.races[Math.floor(Math.random() * universeData.races.length)];
    }
    if (mode === 'random' || (mode === 'custom' && !charClass)) {
        charClass = universeData.classes[Math.floor(Math.random() * universeData.classes.length)];
    }
    
    if (mode !== 'custom' || !name) {
        // Asumiendo que DND_DATA.generateRandomName está disponible
        name = DND_DATA.generateRandomName ? DND_DATA.generateRandomName(race, charClass) : `Héroe Anónimo de ${race}`; 
    }

    // 2. Generar Stats y Mods
    const stats = generateStats(mode);
    const mods = {
        str: calculateModifier(stats.strength),
        dex: calculateModifier(stats.dexterity),
        con: calculateModifier(stats.constitution),
        int: calculateModifier(stats.intelligence),
        wis: calculateModifier(stats.wisdom),
        cha: calculateModifier(stats.charisma),
    };
    
    // 3. Calcular Rareza NFT y Proficiencia
    const nftData = calculateNFTRarity();
    const prof = 2 + Math.floor((1 - 1) / 4); // Nivel 1, Proficiencia +2

    // 4. Guardar Objeto Personaje
    activeCharacter = {
        name, race, class: charClass, universe: currentUniverse,
        stats, mods, nft: nftData,
        lvl: 1, xp: 0, prof: prof,
        hp: (DND_DATA.classes[charClass]?.hitDie || 6) + mods.con,
        ac: 10 + mods.dex,
        initiative: mods.dex,
        traits: [
            universeData.bonus || "Bono de universo no especificado.",
            `Rasgo de ${race} (Visión)`,
            `Habilidad de ${charClass} (Combate)`
        ],
        // Añadir el bonus de universo como un rasgo adicional
        universeBonus: universeData.bonus || 'N/A'
    };

    // 5. Renderizar UI
    renderCharacter(activeCharacter);
    
    // 6. Generar Imagen IA (Simulada o API)
    const imgQuery = `${race} ${charClass} ${currentUniverse} fantasy portrait`;
    if (typeof DND_API !== 'undefined' && DND_API.Images && DND_API.Images.getEpicImage) {
        // En un entorno real, esto sería una llamada async. Aquí lo simulamos.
        document.getElementById('charImage').src = 'https://placehold.co/400x550/3a2517/d4c4a8?text=RETRATO+ÉPICO';
    }
}

// 4. RENDERIZADO
function renderCharacter(char) {
    document.getElementById('charName').textContent = char.name;
    document.getElementById('charMeta').textContent = `${char.race} | ${char.class} | Nivel ${char.lvl}`;
    document.getElementById('charUniverse').textContent = MULTIVERSE_DATA[char.universe]?.name || "D&D Estándar";
    
    // Stats HTML
    const statsDiv = document.getElementById('statsDisplay');
    statsDiv.innerHTML = '';
    
    // Usar la lista STAT_KEYS para garantizar el orden
    STAT_KEYS.forEach(key => {
        const val = char.stats[key];
        // Obtener el mod usando el mapeo de la clave completa a la clave corta (ej: strength -> str)
        const shortKey = key.substring(0, 3);
        const mod = char.mods[shortKey]; 
        
        statsDiv.innerHTML += `
            <div class="stat-box">
                <div class="stat-name">${key.toUpperCase()}</div>
                <div class="stat-value">${val}</div>
                <div class="stat-modifier">${mod >= 0 ? '+' : ''}${mod}</div>
            </div>
        `;
    });
    
    // Rasgos
    const charTraits = document.getElementById('charTraits');
    charTraits.innerHTML = char.traits.map(trait => `<li>${trait}</li>`).join('');

    // NFT Card Visuals
    const card = document.getElementById('nftCard');
    const badge = document.getElementById('nftRarity');
    
    // Reset clases
    card.className = 'nft-card'; // Clase base
    
    if (char.nft.isFoil) card.classList.add('nft-foil');
    // Mapeo de rareza a clase CSS (asumiendo que las clases como .rarity-legendaria están en styles.css)
    card.classList.add(`rarity-${char.nft.rarity.toLowerCase().replace('á', 'a')}`); 
    
    badge.textContent = char.nft.rarity.toUpperCase();
    badge.style.backgroundColor = getRarityColor(char.nft.rarity);
    
    document.getElementById('tokenId').textContent = char.nft.tokenId;
}

// 5. LÓGICA NFT Y RAREZA
function calculateNFTRarity() {
    const roll = Math.random();
    let rarity = 'Común';
    
    if (roll > 0.99) rarity = 'Mítica';
    else if (roll > 0.95) rarity = 'Legendaria';
    else if (roll > 0.85) rarity = 'Épica';
    else if (roll > 0.65) rarity = 'Rara';
    
    return {
        rarity,
        isFoil: Math.random() > 0.8,
        value: Math.floor(Math.random() * 5000) + 100,
        tokenId: Math.floor(Math.random() * 999999)
    };
}

function getRarityColor(rarity) {
    if (rarity === 'Mítica') return '#ff1493';
    if (rarity === 'Legendaria') return '#d4af37';
    if (rarity === 'Épica') return '#9b59b6';
    if (rarity === 'Rara') return '#3498db';
    return '#95a5a6';
}

function mintNFT() {
    if (!activeCharacter) {
        // Usar mensaje personalizado en lugar de alert()
        console.error("❌ ¡Debes generar un personaje primero!");
        return;
    }
    // Muestra un mensaje simple en consola o un modal, no alert
    console.log(`🔗 Conectando a Wallet... ¡NFT "${activeCharacter.name}" acuñado!`);
}

// 6. MAPA (Utiliza el objeto MapEngine)
function generateMap() {
    if (typeof MapEngine !== 'undefined') {
        MapEngine.generateDungeon();
    }
}

function addTokens() {
    if (typeof MapEngine !== 'undefined') {
        // MapEngine.generateDungeon(); // Genera un nuevo mapa y limpia los tokens viejos
        // Solo llamo a generateDungeon si quiero limpiar el mapa antes. 
        // Si quiero superponer tokens sobre lo que haya:
        if(!MapEngine.ctx) return;
        const ctx = MapEngine.ctx;
        
        // Dibuja tokens simples
        for(let i=0; i<5; i++) {
            const x = Math.floor(Math.random() * 18) * 40 + 40; 
            const y = Math.floor(Math.random() * 13) * 40 + 40;
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, 2*Math.PI);
            ctx.fillStyle = i===0 ? 'blue' : 'red';
            ctx.globalAlpha = 0.8;
            ctx.fill();
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
        console.log("🗺️ Tokens añadidos al mapa.");
    }
}

// 7. UTILIDADES
function calculateModifier(stat) { return Math.floor((stat - 10) / 2); }

function roll(sides) { return Math.floor(Math.random() * sides) + 1; }

function generateStats(mode) {
    // Usamos nombres completos de STAT_KEYS para consistencia
    let stats = {};
    STAT_KEYS.forEach(key => {
        stats[key] = roll(20);
    });
    
    if (mode === 'chaos') {
        // Stats aún más ridículos para el modo Chaos
        STAT_KEYS.forEach(k => stats[k] = roll(30) + roll(30)); // Rango de 2 a 60
    }
    
    return stats;
}


// 8. EXPORTACIÓN A FICHA ÉPICA LATEX (REEMPLAZO DE PDF)
function downloadPDF() {
    if (!activeCharacter) {
        // Usar mensaje personalizado en lugar de alert()
        console.error("❌ ¡Genera un personaje para poder exportarlo!");
        return;
    }

    const char = activeCharacter;
    const mods = char.mods;
    const prof = char.prof; // Usamos el bonus de proficiencia calculado

    // Función auxiliar para generar la caja de stats
    const createStatBox = (shortName, fullName) => {
        const value = char.stats[fullName];
        const mod = mods[shortName];
        const sign = mod >= 0 ? '+' : '' : '';
        return `\\statbox{${fullName.substring(0, 3).toUpperCase()}}{${value}}{${sign}${mod}}`;
    };

    // Recopilar rasgos para las columnas
    const traitList = char.traits.map(t => `\\item ${t}`);
    const midPoint = Math.ceil(traitList.length / 2);
    const col1Traits = traitList.slice(0, midPoint).join('\n');
    const col2Traits = traitList.slice(midPoint).join('\n');


    // Construcción del contenido del .tex
    const latexContent = `
% ======================================================================
% FICHA DE PERSONAJE ÉPICA (D&D Forge)
% Generado dinámicamente para ${char.name}
% ======================================================================

\\documentclass[10pt, a4paper]{article}

% --- UNIVERSAL PREAMBLE BLOCK ---
\\usepackage[a4paper, top=1.5cm, bottom=1.5cm, left=1.5cm, right=1.5cm]{geometry}
\\usepackage{fontspec}

\\usepackage[spanish, bidi=basic, provide=*]{babel}

\\babelprovide[import, onchar=ids fonts]{spanish}
\\babelprovide[import, onchar=ids fonts]{english}

\\babelfont{rm}{Noto Serif}
\\babelfont{sf}{Noto Sans}

% Paquetes esenciales para el diseño
\\usepackage{xcolor}
\\usepackage{tabularx}
\\usepackage{titlesec}
\\usepackage{fontawesome5}
\\usepackage{eso-pic}
\\usepackage{enumitem} % Para listas personalizadas

% --- COLORES Y ESTILOS PERSONALIZADOS ---
\\definecolor{ParcDark}{HTML}{d4c4a8}
\\definecolor{Gold}{HTML}{d4af37}
\\definecolor{BloodRed}{HTML}{8b0000}
\\definecolor{InkBlack}{HTML}{1a0f08}

\\pagecolor{ParcDark}

\\titleformat{\section}
  {\\normalfont\\Large\\bfseries\\color{BloodRed}\\filcenter}
  {\\relax}{0em}{\\rule{\\linewidth}{0.8pt}\\centerline{#1}\\rule{\\linewidth}{0.8pt}}
\\titlespacing*{\\section}{0pt}{1.5ex plus 1ex minus .2ex}{1ex}

\\renewcommand{\\arraystretch}{1.2}
\\setlist[itemize]{label={--}} % Usar guiones para las listas

% Macro para la caja de estadística con MODIFICADOR
\\newcommand{\\statbox}[3]{%
    \\fcolorbox{InkBlack}{ParcDark}{\\parbox{1.5cm}{%
        \\centering
        \\vspace{0.1cm}
        {\\bfseries\\color{BloodRed} #1}\\\\[-0.5ex]
        \\fontsize{14}{16}\\selectfont\\color{InkBlack} #2\\\\[-0.5ex]
        \\fontsize{10}{12}\\selectfont\\color{Gold} (#3)
        \\vspace{0.1cm}
    }}%
}

% --- INICIO DEL DOCUMENTO ---
\\begin{document}

\\thispagestyle{empty}

% ======================================================================
% DATOS DEL ENCABEZADO
% ======================================================================

\\begin{center}
    \\fontsize{24}{26}\\selectfont
    \\color{BloodRed}\\textbf{FICHA ÉPICA - ${char.name}}
\\end{center}

\\vspace{0.2cm}
\\noindent\\begin{tabularx}{\\textwidth}{|X|X|X|}
    \\hline
    \\textbf{Nombre del Héroe:} \\textbf{${char.name}} & \\textbf{Clase:} ${char.class} & \\textbf{Nivel/XP:} ${char.lvl} / ${char.xp} \\\\
    \\hline
\\end{tabularx}

\\vspace{0.1cm}
\\noindent\\begin{tabularx}{\\textwidth}{|X|X|X|}
    \\hline
    \\textbf{Raza:} ${char.race} & \\textbf{Universo:} ${MULTIVERSE_DATA[char.universe]?.name || 'DND Estándar'} & \\textbf{Alineamiento:} N/A \\\\
    \\hline
\\end{tabularx}


% ======================================================================
% SECCIÓN PRINCIPAL: ESTADÍSTICAS Y RASGOS
% ======================================================================

\\section*{ESTADÍSTICAS BASE}
\\vspace{0.1cm}
\\centering
${createStatBox('str', 'strength')} \\quad
${createStatBox('dex', 'dexterity')} \\quad
${createStatBox('con', 'constitution')} \\\\
\\vspace{0.5cm}
${createStatBox('int', 'intelligence')} \\quad
${createStatBox('wis', 'wisdom')} \\quad
${createStatBox('cha', 'charisma')}

\\vspace{0.5cm}
\\noindent\\begin{tabularx}{\\textwidth}{|p{0.48\\textwidth}|p{0.48\\textwidth}|}
    \\hline
    \\centering\\textbf{\\color{BloodRed}COMBATE Y DEFENSA} & \\centering\\textbf{\\color{BloodRed}ATRIBUTOS Y MAGIA} \\\\
    \\hline
    \\begin{itemize}
        \\item \\textbf{Clase de Armadura (CA):} ${char.ac}
        \\item \\textbf{Puntos de Golpe (PG):} ${char.hp}
        \\item \\textbf{Iniciativa:} ${mods.dex >= 0 ? '+' : ''}${mods.dex}
        \\item \\textbf{Velocidad:} 30 ft. (Est.)
    \\end{itemize}
    &
    \\begin{itemize}
        \\item \\textbf{Proficiencia (PB):} +${prof}
        \\item \\textbf{Bono de Ataque:} +${mods.str + prof} (Cuerpo a cuerpo)
        \\item \\textbf{CD Hechizos:} 8 + ${prof} + ${mods.cha} = ${8 + prof + mods.cha}
        \\item \\textbf{Tiradas de Salvación:} ${char.class} (Est.)
    \\end{itemize} \\\\
    \\hline
\\end{tabularx}


\\section*{RASGOS DE LINAJE Y MULTIVERSO}

\\noindent\\begin{tabularx}{\\textwidth}{|X|X|}
    \\hline
    \\begin{itemize}
        ${col1Traits}
    \\end{itemize}
    &
    \\begin{itemize}
        ${col2Traits}
        \\item \\textbf{Bonus de Universo:} ${char.universeBonus}
    \\end{itemize} \\\\
    \\hline
\\end{tabularx}

\\section*{FICHA NFT}

\\fcolorbox{Gold}{InkBlack!10}{\\parbox{\\textwidth-2\\fboxsep-2\\fboxrule}{%
    \\centering
    \\color{Gold}\\faGem \\textbf{TOKEN ÚNICO} \\faGem\\
    \\color{InkBlack}\\textbf{Rareza:} ${char.nft.rarity.toUpperCase()}\\
    \\textit{ID Token: #${char.nft.tokenId}}
}}


\\end{document}
`;

    // 9. Descargar el archivo .tex
    const filename = `${char.name.replace(/ /g, '_')}_ficha_epic.tex`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(latexContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Sustitución de alert por console.log o un modal
    console.log(`🎉 ¡Éxito! El archivo LaTeX (${filename}) se ha descargado.\n\nPara ver la ficha épica como PDF, por favor, cópialo y compílalo usando un editor LaTeX (como Overleaf).`);
}
