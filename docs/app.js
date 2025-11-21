// Estado global
let currentCharacter = null;
let currentMonster = null;
let currentEncounter = null;

// Utilidades generales
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function calculateModifier(stat) {
  return Math.floor((stat - 10) / 2);
}

// Generación de características 4d6 drop lowest
function generateStats() {
  const rollStat = () => {
    const rolls = [rollDice(6), rollDice(6), rollDice(6), rollDice(6)];
    rolls.sort((a, b) => a - b);
    return rolls.slice(1).reduce((a, b) => a + b, 0);
  };

  return {
    strength: rollStat(),
    dexterity: rollStat(),
    constitution: rollStat(),
    intelligence: rollStat(),
    wisdom: rollStat(),
    charisma: rollStat()
  };
}

// Calcula nivel de poder en base a la media de stats
function calculatePowerLevel(character) {
  const statsTotal = Object.values(character.stats).reduce((a, b) => a + b, 0);
  const avgStat = statsTotal / 6;

  if (avgStat >= 16) return "⭐⭐⭐⭐⭐ Legendario";
  if (avgStat >= 14) return "⭐⭐⭐⭐ Épico";
  if (avgStat >= 12) return "⭐⭐⭐ Heroico";
  if (avgStat >= 10) return "⭐⭐ Promedio";
  return "⭐ Novato";
}

// Historia breve
function generateBackstory(character) {
  const stories = {
    "Guerrero": "forjado en el campo de batalla",
    "Mago": "estudiante de las artes arcanas",
    "Pícaro": "superviviente de las calles",
    "Clérigo": "elegido por los dioses",
    "Paladín": "campeón de la justicia",
    "Bardo": "viajero de mil historias",
    "Bárbaro": "hijo de las tierras salvajes",
    "Druida": "guardián de la naturaleza",
    "Monje": "maestro del cuerpo y mente",
    "Explorador": "cazador de las tierras inhóspitas",
    "Hechicero": "portador de magia innata",
    "Brujo": "pactante de poderes oscuros"
  };

  const base = stories[character.class] || "aventurero de origen incierto";
  return `${character.name}, ${character.race.toLowerCase()} ${base}, busca su destino en un mundo lleno de magia y peligros.`;
}

// Generador de personaje
function generateCharacter(customData = {}) {
  const allRaces = Object.keys(DND_DATA.races);
  const allClasses = Object.keys(DND_DATA.classes);
  const allBackgrounds = Object.keys(DND_DATA.backgrounds);

  const race = customData.race || randomFromArray(allRaces);
  const charClass = customData.class || randomFromArray(allClasses);
  const background = customData.background || randomFromArray(allBackgrounds);
  const alignment = customData.alignment || randomFromArray(DND_DATA.alignments);

  const stats = generateStats();

  const classData =
    DND_DATA.classes[charClass] || DND_DATA.classes[allClasses[0]];
  const raceData = DND_DATA.races[race] || DND_DATA.races[allRaces[0]];
  const backgroundData =
    DND_DATA.backgrounds[background] || DND_DATA.backgrounds[allBackgrounds[0]];

  const hp = classData.hitDie + calculateModifier(stats.constitution);
  const ac = 10 + calculateModifier(stats.dexterity);

  const character = {
    id: Date.now().toString(),
    name:
      (customData.name && customData.name.trim()) ||
      `${race} ${charClass}`,
    race,
    class: charClass,
    background,
    alignment,
    level: 1,
    stats,
    hp,
    ac,
    speed: raceData.speed,
    racialTraits: raceData.traits || [],
    classProficiencies: classData.proficiencies || [],
    classFeatures: classData.features || [],
    savingThrows: classData.savingThrows || [],
    skills: classData.skills || "",
    equipment: classData.equipment || [],
    backgroundData
  };

  character.powerLevel = calculatePowerLevel(character);
  character.backstory = generateBackstory(character);

  return character;
}

// Pintar ficha de personaje
function displayCharacter(character, options = {}) {
  const { skipSave = false, skipCelebrate = false } = options;
  currentCharacter = character;

  // Información básica
  document.getElementById("displayName").textContent = character.name;
  document.getElementById("displayRace").textContent = character.race;
  document.getElementById("displayClass").textContent = character.class;
  document.getElementById("displayLevel").textContent = character.level;
  document.getElementById("displayBackground").textContent =
    character.background;
  document.getElementById("displayAlignment").textContent =
    character.alignment;

  // Nivel de poder e historia
  const powerEl = document.getElementById("displayPowerLevel");
  const storyEl = document.getElementById("displayBackstory");
  if (powerEl) powerEl.textContent = character.powerLevel || "-";
  if (storyEl) storyEl.textContent = character.backstory || "-";

  // Características
  const statsMap = [
    { id: "Str", value: character.stats.strength },
    { id: "Dex", value: character.stats.dexterity },
    { id: "Con", value: character.stats.constitution },
    { id: "Int", value: character.stats.intelligence },
    { id: "Wis", value: character.stats.wisdom },
    { id: "Cha", value: character.stats.charisma }
  ];

  statsMap.forEach((stat) => {
    const modifier = calculateModifier(stat.value);
    const statEl = document.getElementById(`stat${stat.id}`);
    const modEl = document.getElementById(`mod${stat.id}`);
    if (statEl) statEl.textContent = stat.value;
    if (modEl)
      modEl.textContent = (modifier >= 0 ? "+" : "") + modifier;
  });

  // Combate
  document.getElementById("displayHP").textContent = character.hp;
  document.getElementById("displayAC").textContent = character.ac;
  document.getElementById(
    "displaySpeed"
  ).textContent = `${character.speed} ft`;
  const initMod = calculateModifier(character.stats.dexterity);
  document.getElementById("displayInit").textContent =
    (initMod >= 0 ? "+" : "") + initMod;

  // Salvaciones y habilidades
  document.getElementById("displaySavingThrows").textContent =
    character.savingThrows.join(", ");
  document.getElementById("displaySkills").textContent =
    character.skills || "-";

  // Equipo de clase
  const equipmentHTML = (character.equipment || [])
    .map((item) => `<li>• ${item}</li>`)
    .join("");
  document.getElementById("equipment").innerHTML = equipmentHTML;

  // Trasfondo
  if (character.backgroundData) {
    document.getElementById("backgroundName").textContent =
      character.background;
    document.getElementById("backgroundSkills").textContent =
      (character.backgroundData.skills || []).join(", ");
    document.getElementById("backgroundFeature").textContent =
      character.backgroundData.feature || "-";

    const bgEquipHTML = (character.backgroundData.equipment || [])
      .map((item) => `<li>• ${item}</li>`)
      .join("");
    document.getElementById("backgroundEquipment").innerHTML =
      bgEquipHTML;
  }

  // Rasgos raciales
  const traitsHTML = (character.racialTraits || [])
    .map((trait) => `<li>• ${trait}</li>`)
    .join("");
  document.getElementById("racialTraits").innerHTML = traitsHTML;

  // Competencias de clase
  const profHTML = (character.classProficiencies || [])
    .map((prof) => `<li>• ${prof}</li>`)
    .join("");
  document.getElementById("classProficiencies").innerHTML = profHTML;

  // Características de clase
  const featuresHTML = (character.classFeatures || [])
    .map((feature) => `<li>• ${feature}</li>`)
    .join("");
  document.getElementById("classFeatures").innerHTML = featuresHTML;

  // Mostrar ficha y botón NFT
  const sheet = document.getElementById("characterSheet");
  sheet.classList.remove("hidden");
  const nftBtn = document.getElementById("mintNFTBtn");
  if (nftBtn) {
    nftBtn.style.display = "inline-flex";
  }

  // Scroll suave
  sheet.scrollIntoView({ behavior: "smooth" });

  // Guardar en localStorage y recargar historial
  if (!skipSave) {
    saveCharacterToStorage(character);
  }

  // Confetti
  if (!skipCelebrate) {
    celebrateCharacterCreation();
  }
}

// Selects del panel personalizado
function populateSelects() {
  const raceSelect = document.getElementById("raceSelect");
  const classSelect = document.getElementById("classSelect");
  const backgroundSelect = document.getElementById("backgroundSelect");
  const alignmentSelect = document.getElementById("alignmentSelect");

  // Razas
  Object.keys(DND_DATA.races).forEach((race) => {
    const option = document.createElement("option");
    option.value = race;
    option.textContent = race;
    raceSelect.appendChild(option);
  });

  // Clases
  Object.keys(DND_DATA.classes).forEach((cls) => {
    const option = document.createElement("option");
    option.value = cls;
    option.textContent = cls;
    classSelect.appendChild(option);
  });

  // Trasfondos
  Object.keys(DND_DATA.backgrounds).forEach((bg) => {
    const option = document.createElement("option");
    option.value = bg;
    option.textContent = bg;
    backgroundSelect.appendChild(option);
  });

  // Alineamientos
  DND_DATA.alignments.forEach((align) => {
    const option = document.createElement("option");
    option.value = align;
    option.textContent = align;
    alignmentSelect.appendChild(option);
  });
}

// PDF con jsPDF
async function generatePDF() {
  if (!currentCharacter) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text("D&D Character Forge", 20, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(currentCharacter.name, 20, y);
  y += 6;

  doc.setDrawColor(102, 126, 234);
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 10;

  // Información básica
  doc.setFontSize(14);
  doc.text("INFORMACIÓN BÁSICA", 20, y);
  y += 8;
  doc.setFontSize(10);

  const basicInfo = [
    `Nombre: ${currentCharacter.name}`,
    `Raza: ${currentCharacter.race}`,
    `Clase: ${currentCharacter.class} (Nivel ${currentCharacter.level})`,
    `Trasfondo: ${currentCharacter.background}`,
    `Alineamiento: ${currentCharacter.alignment}`
  ];

  basicInfo.forEach((line) => {
    doc.text(line, 20, y);
    y += 5;
  });

  y += 5;
  const pLevel = currentCharacter.powerLevel || "";
  const bStory = currentCharacter.backstory || "";
  if (pLevel || bStory) {
    doc.setFontSize(11);
    doc.text(`Nivel de poder: ${pLevel}`, 20, y);
    y += 5;
    const storyLines = doc.splitTextToSize(
      `Historia: ${bStory}`,
      170
    );
    storyLines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 5;
    });
  }

  // Stats
  y += 8;
  if (y > 270) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.text("CARACTERÍSTICAS", 20, y);
  y += 7;
  doc.setFontSize(10);

  const statsMap = [
    ["FUE", currentCharacter.stats.strength],
    ["DES", currentCharacter.stats.dexterity],
    ["CON", currentCharacter.stats.constitution],
    ["INT", currentCharacter.stats.intelligence],
    ["SAB", currentCharacter.stats.wisdom],
    ["CAR", currentCharacter.stats.charisma]
  ];

  statsMap.forEach(([label, score], idx) => {
    const mod = calculateModifier(score);
    const text = `${label}: ${score} (${mod >= 0 ? "+" : ""}${mod})`;
    const x = 20 + (idx % 3) * 55;
    const yy = y + Math.floor(idx / 3) * 6;
    doc.text(text, x, yy);
  });

  y += 18;

  // Combate
  if (y > 270) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.text("COMBATE", 20, y);
  y += 7;
  doc.setFontSize(10);
  const combatLines = [
    `Puntos de golpe: ${currentCharacter.hp}`,
    `Clase de armadura: ${currentCharacter.ac}`,
    `Velocidad: ${currentCharacter.speed} ft`,
    `Iniciativa: ${
      (calculateModifier(currentCharacter.stats.dexterity) >= 0 ? "+" : "") +
      calculateModifier(currentCharacter.stats.dexterity)
    }`
  ];
  combatLines.forEach((line) => {
    doc.text(line, 20, y);
    y += 5;
  });

  // Salvaciones y habilidades
  y += 7;
  if (y > 270) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.text("COMPETENCIAS", 20, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(
    `T. Salvación: ${currentCharacter.savingThrows.join(", ")}`,
    20,
    y
  );
  y += 5;
  const skillsLines = doc.splitTextToSize(
    `Habilidades: ${currentCharacter.skills || "-"}`,
    170
  );
  skillsLines.forEach((line) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 20, y);
    y += 5;
  });

  // Rasgos y características
  y += 7;
  if (y > 270) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.text("RASGOS & CARACTERÍSTICAS", 20, y);
  y += 7;
  doc.setFontSize(10);

  const sections = [
    ["Rasgos raciales", currentCharacter.racialTraits || []],
    ["Competencias de clase", currentCharacter.classProficiencies || []],
    ["Características de clase", currentCharacter.classFeatures || []],
    [
      "Equipo",
      (currentCharacter.equipment || []).concat(
        currentCharacter.backgroundData?.equipment || []
      )
    ]
  ];

  sections.forEach(([title, items]) => {
    if (!items.length) return;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFont(undefined, "bold");
    doc.text(title + ":", 20, y);
    y += 5;
    doc.setFont(undefined, "normal");
    const lines = doc.splitTextToSize(
      items.map((i) => `• ${i}`).join("\n"),
      170
    );
    lines.forEach((line) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 4;
    });
    y += 3;
  });

  doc.save(`${currentCharacter.name.replace(/\s+/g, "_")}_ficha.pdf`);
}

// Guardar en localStorage
function saveCharacterToStorage(character) {
  try {
    const savedCharacters = JSON.parse(
      localStorage.getItem("dnd_characters") || "[]"
    );
    savedCharacters.unshift({
      ...character,
      savedAt: new Date().toISOString()
    });
    const trimmed = savedCharacters.slice(0, 10);
    localStorage.setItem(
      "dnd_characters",
      JSON.stringify(trimmed)
    );
    renderHistory(trimmed);
  } catch (e) {
    console.log("No se pudo guardar en localStorage");
  }
}

// Cargar historial + último personaje
function loadHistoryAndLastCharacter() {
  try {
    const savedCharacters = JSON.parse(
      localStorage.getItem("dnd_characters") || "[]"
    );
    renderHistory(savedCharacters);
    if (savedCharacters.length > 0) {
      const { savedAt, ...lastChar } = savedCharacters[0];
      displayCharacter(lastChar, {
        skipSave: true,
        skipCelebrate: true
      });
      return true;
    }
  } catch (e) {
    console.log("No se pudo cargar historial");
  }
  return false;
}

// Render del historial
function renderHistory(savedCharacters) {
  const list = document.getElementById("historyList");
  if (!list) return;

  if (!savedCharacters || savedCharacters.length === 0) {
    list.innerHTML =
      '<li class="history-empty">Todavía no hay personajes guardados.</li>';
    return;
  }

  list.innerHTML = savedCharacters
    .map((ch, index) => {
      const date =
        ch.savedAt && !Number.isNaN(Date.parse(ch.savedAt))
          ? new Date(ch.savedAt).toLocaleString()
          : "";
      return `
      <li class="history-item" data-index="${index}">
        <div class="history-main">
          <strong>${ch.name}</strong>
          <span>${ch.race} · ${ch.class}</span>
        </div>
        <div class="history-meta">
          <span>Nivel ${ch.level}</span>
          <span>${ch.alignment}</span>
          ${
            ch.powerLevel
              ? `<span>${ch.powerLevel}</span>`
              : ""
          }
          ${date ? `<span>${date}</span>` : ""}
        </div>
      </li>
    `;
    })
    .join("");
}

// Confetti de celebración
function celebrateCharacterCreation() {
  const colors = ["#667eea", "#764ba2", "#FFD700", "#48bb78"];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${
          colors[Math.floor(Math.random() * colors.length)]
        };
        top: -10px;
        left: ${Math.random() * 100}vw;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: fall ${2 + Math.random() * 2}s linear forwards;
      `;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4000);
    }, i * 20);
  }
}

// Añadir keyframe para confetti
(function injectConfettiKeyframes() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
})();

// NFT demo
async function connectWalletAndMint() {
  if (!currentCharacter) {
    alert("Primero genera un personaje");
    return;
  }

  if (typeof window.ethereum === "undefined") {
    alert("Por favor instala MetaMask para crear NFTs");
    window.open("https://metamask.io/", "_blank");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    const account = accounts[0];
    alert(
      `Conectado a ${account}.\nAquí iría la lógica real de mintear el NFT del personaje.`
    );
  } catch (e) {
    console.error(e);
    alert("No se pudo conectar con MetaMask.");
  }
}

/* ====================== */
/*    BESTIARIO           */
/* ====================== */

function parseCRFilter(value) {
  if (!value) return { min: null, max: null };
  if (value === "11+") return { min: 11, max: null };
  const [minStr, maxStr] = value.split("-");
  return {
    min: Number(minStr),
    max: Number(maxStr)
  };
}

function filterMonsters(filters) {
  const { type, environment, crRange } = filters;
  let pool = Array.isArray(DND_MONSTERS) ? DND_MONSTERS.slice() : [];

  if (type) {
    pool = pool.filter((m) => m.type === type);
  }
  if (environment) {
    pool = pool.filter((m) =>
      (m.environments || []).includes(environment)
    );
  }
  if (crRange && (crRange.min != null || crRange.max != null)) {
    pool = pool.filter((m) => {
      if (crRange.min != null && m.cr < crRange.min) return false;
      if (crRange.max != null && m.cr > crRange.max) return false;
      return true;
    });
  }
  return pool;
}

function generateRandomMonsterFromFilters() {
  const type = document.getElementById("monsterTypeFilter").value;
  const env = document.getElementById("monsterEnvFilter").value;
  const crValue = document.getElementById("monsterCRFilter").value;
  const crRange = parseCRFilter(crValue);

  let pool = filterMonsters({ type, environment: env, crRange });
  if (!pool.length) {
    pool = Array.isArray(DND_MONSTERS) ? DND_MONSTERS : [];
  }
  if (!pool.length) return null;
  return randomFromArray(pool);
}

function displayMonster(monster) {
  currentMonster = monster;
  const emptyMsg = document.getElementById("monsterEmptyMsg");
  const card = document.getElementById("monsterCard");
  if (!monster) {
    card.classList.add("hidden");
    emptyMsg.textContent = "No se encontró ninguna criatura con esos filtros.";
    return;
  }

  card.classList.remove("hidden");
  emptyMsg.textContent = "";

  document.getElementById("displayMonsterName").textContent =
    monster.name;
  document.getElementById("displayMonsterType").textContent =
    monster.type;
  document.getElementById("displayMonsterCR").textContent =
    monster.cr;
  document.getElementById("displayMonsterXP").textContent =
    monster.xp;
  document.getElementById("displayMonsterAC").textContent =
    monster.ac;
  document.getElementById("displayMonsterHP").textContent =
    monster.hp;
  document.getElementById("displayMonsterSpeed").textContent =
    monster.speed;
  document.getElementById("displayMonsterAlignment").textContent =
    monster.alignment || "-";
  document.getElementById("displayMonsterEnv").textContent = (
    monster.environments || []
  ).join(", ");

  // Stats criatura
  const statsContainer = document.getElementById("monsterStats");
  const stats = monster.stats || {};
  const map = [
    ["FUE", stats.str],
    ["DES", stats.dex],
    ["CON", stats.con],
    ["INT", stats.int],
    ["SAB", stats.wis],
    ["CAR", stats.cha]
  ];

  statsContainer.innerHTML = map
    .map(([label, value]) => {
      if (value == null) return "";
      const mod = calculateModifier(value);
      return `
      <div class="stat">
        <span class="stat-label">${label}</span>
        <span class="stat-score">${value}</span>
        <span class="stat-mod">${mod >= 0 ? "+" : ""}${mod}</span>
      </div>`;
    })
    .join("");

  // Rasgos y acciones
  const traitsUl = document.getElementById("monsterTraits");
  const actionsUl = document.getElementById("monsterActions");

  traitsUl.innerHTML = (monster.traits || [])
    .map((t) => `<li>• ${t}</li>`)
    .join("");
  actionsUl.innerHTML = (monster.actions || [])
    .map((a) => `<li>• ${a}</li>`)
    .join("");
}

/* ====================== */
/*    ENCUENTROS          */
/* ====================== */

function getTargetXP(level, partySize, difficulty) {
  const basePerLevel = {
    easy: 25,
    medium: 50,
    hard: 75,
    deadly: 100
  };
  const base = basePerLevel[difficulty] || basePerLevel.medium;
  return level * partySize * base;
}

function generateEncounter(params) {
  const { level, partySize, difficulty } = params;
  const targetXP = getTargetXP(level, partySize, difficulty);

  const pool = Array.isArray(DND_MONSTERS) ? DND_MONSTERS.slice() : [];
  if (!pool.length) {
    return { monsters: [], xp: 0, targetXP, level, partySize, difficulty };
  }

  const monsters = [];
  let xpSum = 0;
  let safety = 1000;

  while (xpSum < targetXP * 0.9 && safety-- > 0) {
    const monster = randomFromArray(pool);
    if (!monster) break;
    const newXP = xpSum + monster.xp;
    if (newXP <= targetXP * 1.4 || monsters.length === 0) {
      monsters.push(monster);
      xpSum = newXP;
    } else {
      // Quita esta criatura del pool para intentar variedad
      const idx = pool.indexOf(monster);
      if (idx >= 0) pool.splice(idx, 1);
      if (!pool.length) break;
    }
  }

  return {
    monsters,
    xp: xpSum,
    targetXP,
    level,
    partySize,
    difficulty
  };
}

function displayEncounter(encounter) {
  currentEncounter = encounter;
  const resultEl = document.getElementById("encounterResult");
  const summaryEl = document.getElementById("encounterSummary");
  const listEl = document.getElementById("encounterList");

  if (!encounter || !encounter.monsters.length) {
    resultEl.classList.add("hidden");
    summaryEl.textContent =
      "No se pudo generar un encuentro con los parámetros dados.";
    return;
  }

  resultEl.classList.remove("hidden");

  const diffLabelMap = {
    easy: "Fácil",
    medium: "Media",
    hard: "Difícil",
    deadly: "Mortal"
  };

  summaryEl.textContent = `Nivel grupo ${encounter.level}, ${encounter.partySize} PJ · Dificultad ${
    diffLabelMap[encounter.difficulty] || encounter.difficulty
  } · XP objetivo ${encounter.targetXP} · XP generado ${encounter.xp}`;

  listEl.innerHTML = encounter.monsters
    .map((m) => {
      const env = (m.environments || []).join(", ");
      return `<li>• ${m.name} (CR ${m.cr}, ${m.xp} XP) · CA ${m.ac}, PG ${m.hp} · ${m.type}${
        env ? " · Entornos: " + env : ""
      }</li>`;
    })
    .join("");
}

/* ====================== */
/*   EVENTOS / INICIAL    */
/* ====================== */

document.addEventListener("DOMContentLoaded", () => {
  populateSelects();

  // Cargar último personaje si existe
  loadHistoryAndLastCharacter();

  // Generar aleatorio
  document.getElementById("randomBtn").addEventListener("click", () => {
    try {
      const character = generateCharacter();
      displayCharacter(character);
    } catch (error) {
      console.error("Error generando personaje:", error);
      alert("Error al generar personaje. Por favor, recarga la página.");
    }
  });

  // Mostrar/ocultar panel personalizado
  document.getElementById("toggleCustom").addEventListener("click", () => {
    const panel = document.getElementById("customPanel");
    panel.classList.toggle("hidden");
  });

  // Generar personalizado
  document
    .getElementById("customGenerateBtn")
    .addEventListener("click", () => {
      try {
        const customData = {
          name: document.getElementById("charName").value,
          race: document.getElementById("raceSelect").value,
          class: document.getElementById("classSelect").value,
          background:
            document.getElementById("backgroundSelect").value,
          alignment:
            document.getElementById("alignmentSelect").value
        };

        const character = generateCharacter(customData);
        displayCharacter(character);
      } catch (error) {
        console.error("Error generando personaje personalizado:", error);
        alert("Error al generar personaje. Verifica los datos.");
      }
    });

  // Descargar PDF
  document
    .getElementById("downloadBtn")
    .addEventListener("click", generatePDF);

  // Mintear NFT
  const nftBtn = document.getElementById("mintNFTBtn");
  if (nftBtn) {
    nftBtn.addEventListener("click", connectWalletAndMint);
  }

  // Nuevo personaje (oculta ficha)
  document.getElementById("newCharBtn").addEventListener("click", () => {
    const sheet = document.getElementById("characterSheet");
    sheet.classList.add("hidden");
    const nftBtn = document.getElementById("mintNFTBtn");
    if (nftBtn) {
      nftBtn.style.display = "none";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    currentCharacter = null;
  });

  // Compartir
  document.getElementById("shareBtn").addEventListener("click", async () => {
    if (!currentCharacter) return;

    const text = [
      `🧙 Personaje D&D: ${currentCharacter.name}`,
      `${currentCharacter.race} ${currentCharacter.class}, nivel ${currentCharacter.level}`,
      `Alineamiento: ${currentCharacter.alignment}`,
      `Nivel de poder: ${currentCharacter.powerLevel}`,
      "",
      currentCharacter.backstory || ""
    ].join("\n");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mi personaje D&D",
          text
        });
      } catch (e) {
        console.log("Compartir cancelado");
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      alert("Texto copiado al portapapeles.");
    } else {
      alert(text);
    }
  });

  // Click en historial
  const historyList = document.getElementById("historyList");
  historyList.addEventListener("click", (e) => {
    const item = e.target.closest(".history-item");
    if (!item) return;
    const index = Number(item.dataset.index);
    try {
      const savedCharacters = JSON.parse(
        localStorage.getItem("dnd_characters") || "[]"
      );
      const entry = savedCharacters[index];
      if (!entry) return;
      const { savedAt, ...char } = entry;
      displayCharacter(char, {
        skipSave: true,
        skipCelebrate: true
      });
    } catch (err) {
      console.error("Error cargando personaje del historial:", err);
    }
  });

  // Bestiario
  document
    .getElementById("generateMonsterBtn")
    .addEventListener("click", () => {
      const monster = generateRandomMonsterFromFilters();
      displayMonster(monster);
    });

  // Encuentros
  document
    .getElementById("generateEncounterBtn")
    .addEventListener("click", () => {
      const level = Number(
        document.getElementById("partyLevel").value || 1
      );
      const size = Number(
        document.getElementById("partySize").value || 4
      );
      const difficulty =
        document.getElementById("encounterDifficulty").value ||
        "medium";

      const encounter = generateEncounter({
        level: Math.max(1, level),
        partySize: Math.max(1, size),
        difficulty
      });
      displayEncounter(encounter);
    });

  // Atajos de teclado
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + R = Generar aleatorio
    if ((e.ctrlKey || e.metaKey) && e.key === "r") {
      e.preventDefault();
      const btn = document.getElementById("randomBtn");
      if (btn) btn.click();
    }
    // Ctrl/Cmd + S = Descargar PDF
    if ((e.ctrlKey || e.metaKey) && e.key === "s" && currentCharacter) {
      e.preventDefault();
      generatePDF();
    }
  });
});

// Easter egg: Konami code
let konamiCode = [];
const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a"
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.key);
  if (konamiCode.length > KONAMI_SEQUENCE.length) {
    konamiCode.shift();
  }

  const match = KONAMI_SEQUENCE.every(
    (key, idx) =>
      (konamiCode[idx] || "").toLowerCase() === key.toLowerCase()
  );

  if (match) {
    konamiCode = [];
    const legendaryChar = generateCharacter();
    legendaryChar.stats = {
      strength: 18,
      dexterity: 18,
      constitution: 18,
      intelligence: 18,
      wisdom: 18,
      charisma: 18
    };
    legendaryChar.powerLevel = calculatePowerLevel(legendaryChar);
    legendaryChar.backstory = generateBackstory(legendaryChar);
    legendaryChar.name =
      "⭐ " + legendaryChar.name + " el Legendario";
    displayCharacter(legendaryChar);
    alert(
      "🎉 ¡Código Konami activado! Personaje legendario generado con stats máximos!"
    );
  }
});
