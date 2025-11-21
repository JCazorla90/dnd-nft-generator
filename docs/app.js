// Estado global
let currentCharacter = null;

/* =====================
 * Utilidades básicas
 * ===================== */

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function calculateModifier(stat) {
  return Math.floor((stat - 10) / 2);
}

function formatModifier(value) {
  return (value >= 0 ? "+" : "") + value;
}

/* =====================
 * Generación de stats
 * ===================== */

// 4d6 tirando 4 dados de 6, se descarta el más bajo y se suman los otros 3
function generateStats() {
  const rollStat = () => {
    const rolls = [rollDice(6), rollDice(6), rollDice(6), rollDice(6)];
    rolls.sort((a, b) => a - b); // el menor queda en [0]
    return rolls[1] + rolls[2] + rolls[3];
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

/* =====================
 * Lógica de personaje
 * ===================== */

function calculateInitiative(stats) {
  return calculateModifier(stats.dexterity);
}

function calculatePowerLevel(character) {
  const s = character.stats;
  const sumStats =
    s.strength +
    s.dexterity +
    s.constitution +
    s.intelligence +
    s.wisdom +
    s.charisma;

  const mods = [
    calculateModifier(s.strength),
    calculateModifier(s.dexterity),
    calculateModifier(s.constitution),
    calculateModifier(s.intelligence),
    calculateModifier(s.wisdom),
    calculateModifier(s.charisma)
  ].reduce((a, b) => a + b, 0);

  const base =
    sumStats / 6 +
    mods * 2 +
    (character.hp || 0) +
    (character.ac || 0) +
    (character.level || 1) * 2;

  return Math.round(base);
}

function generateBackstory(character) {
  const hooks = [
    "ha sobrevivido a una batalla que debería haberle costado la vida",
    "ha traicionado a alguien importante en su pasado",
    "busca redención por algo que hizo hace años",
    "tiene una deuda pendiente con un poderoso noble o mercader",
    "sueña con fundar su propio gremio o reino",
    "ha hecho un trato peligroso con una entidad extraplanar"
  ];

  const hook = randomFromArray(hooks);

  return `${character.name} es un ${character.race.toLowerCase()} ` +
    `${character.class.toLowerCase()} con trasfondo de ${character.background.toLowerCase()}, ` +
    `de alineamiento ${character.alignment.toLowerCase()}. ${character.name} ${hook}.`;
}

/**
 * Genera un personaje a partir de DND_DATA
 * customData puede tener: name, race, class, background, alignment
 */
function generateCharacter(customData = {}) {
  if (typeof DND_DATA === "undefined") {
    throw new Error(
      "DND_DATA no está definido. Asegúrate de que dnd-data.js se carga antes de app.js"
    );
  }

  const race =
    customData.race || randomFromArray(Object.keys(DND_DATA.races));
  const charClass =
    customData.class || randomFromArray(Object.keys(DND_DATA.classes));
  const background =
    customData.background || randomFromArray(Object.keys(DND_DATA.backgrounds));
  const alignment =
    customData.alignment || randomFromArray(DND_DATA.alignments);

  const stats = generateStats();

  const classData = DND_DATA.classes[charClass];
  const raceData = DND_DATA.races[race];
  const backgroundData = DND_DATA.backgrounds[background];

  const hp = (classData?.hitDie || 8) + calculateModifier(stats.constitution);
  const ac = 10 + calculateModifier(stats.dexterity);
  const initiative = calculateInitiative(stats);

  const skills = Array.from(
    new Set([
      ...(classData?.skills || []),
      ...(backgroundData?.skills || [])
    ])
  );

  const equipment = [
    ...(classData?.equipment || []),
    ...(backgroundData?.equipment || [])
  ];

  const character = {
    name: customData.name && customData.name.trim()
      ? customData.name.trim()
      : `${race} ${charClass}`,
    race,
    class: charClass,
    background,
    alignment,
    level: 1,
    stats,
    hp,
    ac,
    speed: raceData?.speed || 30,
    initiative,
    racialTraits: raceData?.traits || [],
    classProficiencies: classData?.proficiencies || [],
    classFeatures: classData?.features || [],
    savingThrows: classData?.savingThrows || [],
    skills,
    equipment,
    backgroundData: backgroundData || {}
  };

  // añadimos info “narrativa”
  character.powerLevel = calculatePowerLevel(character);
  character.backstory = generateBackstory(character);

  return character;
}

/* =====================
 * Pintar en la ficha
 * ===================== */

function updateStatsOnSheet(stats) {
  const map = [
    ["Str", "strength"],
    ["Dex", "dexterity"],
    ["Con", "constitution"],
    ["Int", "intelligence"],
    ["Wis", "wisdom"],
    ["Cha", "charisma"]
  ];

  map.forEach(([id, key]) => {
    const value = stats[key];
    const mod = calculateModifier(value);

    const valueEl = document.getElementById("stat" + id);
    const modEl = document.getElementById("mod" + id);

    if (valueEl) valueEl.textContent = value;
    if (modEl) modEl.textContent = formatModifier(mod);
  });
}

function displayCharacter(character) {
  currentCharacter = character;

  // Info básica
  document.getElementById("displayName").textContent = character.name;
  document.getElementById("displayRace").textContent = character.race;
  document.getElementById("displayClass").textContent = character.class;
  document.getElementById("displayLevel").textContent = character.level;
  document.getElementById("displayBackground").textContent =
    character.background;
  document.getElementById("displayAlignment").textContent =
    character.alignment;

  // Combate
  document.getElementById("displayHP").textContent = character.hp;
  document.getElementById("displayAC").textContent = character.ac;
  document.getElementById("displaySpeed").textContent =
    character.speed + " ft";
  document.getElementById("displayInit").textContent =
    formatModifier(character.initiative);

  // Stats
  updateStatsOnSheet(character.stats);

  // Salvaciones y habilidades
  document.getElementById("displaySavingThrows").textContent =
    (character.savingThrows || []).join(", ") || "-";
  document.getElementById("displaySkills").textContent =
    (character.skills || []).join(", ") || "-";

  // Equipo inicial
  const eqList = document.getElementById("equipment");
  eqList.innerHTML = "";
  (character.equipment || []).forEach(item => {
    const li = document.createElement("li");
    li.className = "trait-item";
    li.textContent = "• " + item;
    eqList.appendChild(li);
  });

  // Trasfondo
  const bg = character.backgroundData || {};
  document.getElementById("backgroundName").textContent =
    character.background || "-";
  document.getElementById("backgroundSkills").textContent =
    (bg.skills || []).join(", ") || "-";
  document.getElementById("backgroundFeature").textContent =
    bg.feature || "-";

  const bgEqList = document.getElementById("backgroundEquipment");
  bgEqList.innerHTML = "";
  (bg.equipment || []).forEach(item => {
    const li = document.createElement("li");
    li.className = "trait-item";
    li.textContent = "• " + item;
    bgEqList.appendChild(li);
  });

  // Rasgos raciales
  const racialList = document.getElementById("racialTraits");
  racialList.innerHTML = "";
  (character.racialTraits || []).forEach(trait => {
    const li = document.createElement("li");
    li.className = "trait-item";
    li.textContent = "• " + trait;
    racialList.appendChild(li);
  });

  // Competencias de clase
  const profList = document.getElementById("classProficiencies");
  profList.innerHTML = "";
  (character.classProficiencies || []).forEach(p => {
    const li = document.createElement("li");
    li.className = "trait-item";
    li.textContent = "• " + p;
    profList.appendChild(li);
  });

  // Rasgos de clase
  const featuresList = document.getElementById("classFeatures");
  featuresList.innerHTML = "";
  (character.classFeatures || []).forEach(f => {
    const li = document.createElement("li");
    li.className = "trait-item";
    li.textContent = "• " + f;
    featuresList.appendChild(li);
  });

  // Mostrar ficha
  const sheet = document.getElementById("characterSheet");
  sheet.classList.remove("hidden");

  // Guardar en localStorage
  saveCharacterToStorage(character);
}

/* =====================
 * LocalStorage
 * ===================== */

function saveCharacterToStorage(character) {
  try {
    localStorage.setItem("lastCharacter", JSON.stringify(character));
  } catch (e) {
    console.warn("No se pudo guardar el personaje en localStorage", e);
  }
}

function loadLastCharacter() {
  try {
    const raw = localStorage.getItem("lastCharacter");
    if (!raw) return false;
    const char = JSON.parse(raw);
    displayCharacter(char);
    return true;
  } catch (e) {
    console.warn("No se pudo cargar el último personaje", e);
    return false;
  }
}

/* =====================
 * Selects de personalización
 * ===================== */

function populateSelects() {
  if (typeof DND_DATA === "undefined") {
    console.error(
      "DND_DATA no está definido. ¿Se está cargando dnd-data.js antes de app.js?"
    );
    return;
  }

  const raceSelect = document.getElementById("raceSelect");
  const classSelect = document.getElementById("classSelect");
  const bgSelect = document.getElementById("backgroundSelect");
  const alignmentSelect = document.getElementById("alignmentSelect");

  const fillSelect = (select, options) => {
    select.innerHTML = "";
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });
  };

  fillSelect(raceSelect, Object.keys(DND_DATA.races));
  fillSelect(classSelect, Object.keys(DND_DATA.classes));
  fillSelect(bgSelect, Object.keys(DND_DATA.backgrounds));
  fillSelect(alignmentSelect, DND_DATA.alignments);
}

/* =====================
 * PDF
 * ===================== */

function generatePDF() {
  if (!currentCharacter) {
    alert("Primero genera un personaje.");
    return;
  }

  const jspdf = window.jspdf;
  if (!jspdf || !jspdf.jsPDF) {
    alert("No se ha podido cargar jsPDF.");
    return;
  }

  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(18);
  doc.text(`D&D - ${currentCharacter.name}`, 20, y);

  y += 10;
  doc.setFontSize(12);
  doc.text(
    `${currentCharacter.race} ${currentCharacter.class} (Nivel ${currentCharacter.level})`,
    20,
    y
  );

  y += 8;
  doc.text(`Trasfondo: ${currentCharacter.background}`, 20, y);
  y += 8;
  doc.text(`Alineamiento: ${currentCharacter.alignment}`, 20, y);

  // Stats
  y += 12;
  doc.setFontSize(14);
  doc.text("Características", 20, y);
  y += 8;
  doc.setFontSize(11);

  const s = currentCharacter.stats;
  const statsLines = [
    `FUE: ${s.strength} (${formatModifier(calculateModifier(s.strength))})`,
    `DES: ${s.dexterity} (${formatModifier(calculateModifier(s.dexterity))})`,
    `CON: ${s.constitution} (${formatModifier(calculateModifier(s.constitution))})`,
    `INT: ${s.intelligence} (${formatModifier(calculateModifier(s.intelligence))})`,
    `SAB: ${s.wisdom} (${formatModifier(calculateModifier(s.wisdom))})`,
    `CAR: ${s.charisma} (${formatModifier(calculateModifier(s.charisma))})`
  ];

  statsLines.forEach(line => {
    doc.text(line, 20, y);
    y += 6;
  });

  // Combate
  y += 6;
  doc.setFontSize(14);
  doc.text("Combate", 20, y);
  y += 8;
  doc.setFontSize(11);
  doc.text(
    `PG: ${currentCharacter.hp}   CA: ${currentCharacter.ac}   Velocidad: ${currentCharacter.speed} ft   Iniciativa: ${formatModifier(
      currentCharacter.initiative
    )}`,
    20,
    y
  );

  // Salvaciones / habilidades
  y += 10;
  doc.setFontSize(14);
  doc.text("Salvaciones y habilidades", 20, y);
  y += 8;
  doc.setFontSize(11);
  doc.text(
    `Tiradas de salvación: ${(currentCharacter.savingThrows || []).join(
      ", "
    ) || "-"}`,
    20,
    y
  );
  y += 6;
  doc.text(
    `Habilidades: ${(currentCharacter.skills || []).join(", ") || "-"}`,
    20,
    y
  );

  // Rasgos
  const addListSection = (title, items) => {
    if (!items || !items.length) return;
    y += 10;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(14);
    doc.text(title, 20, y);
    y += 8;
    doc.setFontSize(11);
    items.forEach(it => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text("- " + it, 20, y);
      y += 5;
    });
  };

  addListSection("Rasgos raciales", currentCharacter.racialTraits);
  addListSection("Competencias de clase", currentCharacter.classProficiencies);
  addListSection("Rasgos de clase", currentCharacter.classFeatures);
  addListSection("Equipo", currentCharacter.equipment);

  // Historieta
  y += 10;
  if (y > 270) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.text("Trasfondo narrativo", 20, y);
  y += 8;
  doc.setFontSize(11);

  const textLines = doc.splitTextToSize(
    currentCharacter.backstory || "",
    170
  );
  textLines.forEach(line => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 20, y);
    y += 5;
  });

  const safeName = currentCharacter.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "");

  doc.save(`personaje-${safeName || "dnd"}.pdf`);
}

/* =====================
 * Compartir
 * ===================== */

function buildShareText(character) {
  const power = calculatePowerLevel(character);
  const backstory = character.backstory || generateBackstory(character);

  return (
    `¡He creado un personaje de D&D!\n\n` +
    `${backstory}\n\n` +
    `Nivel de poder aproximado: ${power}\n\n` +
    `Crea el tuyo en: https://jcazorla90.github.io/dnd-nft-generator/`
  );
}

/* =====================
 * Konami code (huevo de pascua)
 * ===================== */

function setupKonamiCode() {
  const sequence = [
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
  let position = 0;

  document.addEventListener("keydown", e => {
    const key = e.key;
    if (key === sequence[position]) {
      position++;
      if (position === sequence.length) {
        position = 0;
        try {
          const legendary = generateCharacter();
          Object.keys(legendary.stats).forEach(stat => {
            legendary.stats[stat] = 18;
          });
          legendary.name = "⭐ " + legendary.name + " el Legendario";
          legendary.initiative = calculateInitiative(legendary.stats);
          legendary.powerLevel = calculatePowerLevel(legendary);
          legendary.backstory = generateBackstory(legendary);
          displayCharacter(legendary);
          alert(
            "🎉 ¡Código Konami activado! Personaje legendario generado con todas las estadísticas a 18."
          );
        } catch (err) {
          console.error("Error en Konami code:", err);
        }
      }
    } else {
      position = 0;
    }
  });
}

/* =====================
 * Event listeners iniciales
 * ===================== */

document.addEventListener("DOMContentLoaded", () => {
  try {
    populateSelects();
    loadLastCharacter();
  } catch (err) {
    console.error("Error inicializando la app:", err);
  }

  // Generar aleatorio
  document.getElementById("randomBtn").addEventListener("click", () => {
    try {
      const character = generateCharacter();
      displayCharacter(character);
    } catch (err) {
      console.error("Error generando personaje aleatorio:", err);
      alert("Ha ocurrido un error al generar el personaje.");
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
          background: document.getElementById("backgroundSelect").value,
          alignment: document.getElementById("alignmentSelect").value
        };
        const character = generateCharacter(customData);
        displayCharacter(character);
      } catch (err) {
        console.error("Error generando personaje personalizado:", err);
        alert("Revisa los datos del formulario. Algo ha fallado.");
      }
    });

  // Descargar PDF
  document.getElementById("downloadBtn").addEventListener("click", () => {
    generatePDF();
  });

  // Nuevo personaje (scroll arriba y ocultar nombre si quieres)
  document.getElementById("newCharBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const nameInput = document.getElementById("charName");
    if (nameInput) nameInput.focus();
  });

  // Compartir
  document.getElementById("shareBtn").addEventListener("click", async () => {
    if (!currentCharacter) {
      alert("Primero genera un personaje.");
      return;
    }

    const text = buildShareText(currentCharacter);

    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        alert("Texto copiado al portapapeles. ¡Pégalo donde quieras!");
      } else {
        alert(text);
      }
    } catch (err) {
      console.error("Error al compartir:", err);
      alert("No se ha podido compartir el personaje.");
    }
  });

  // Huevo de pascua
  setupKonamiCode();
});
