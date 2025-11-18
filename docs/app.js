// Estado global
let currentCharacter = null;

// Utilidades
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function calculateModifier(stat) {
  return Math.floor((stat - 10) / 2);
}

function generateStats() {
  // Método 4d6 drop lowest
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

function generateCharacter(customData = {}) {
  const race = customData.race || randomFromArray(Object.keys(DND_DATA.races));
  const charClass = customData.class || randomFromArray(Object.keys(DND_DATA.classes));
  const background = customData.background || randomFromArray(DND_DATA.backgrounds);
  const alignment = customData.alignment || randomFromArray(DND_DATA.alignments);
  
  const stats = generateStats();
  const classData = DND_DATA.classes[charClass];
  const raceData = DND_DATA.races[race];
  
  const hp = classData.hitDie + calculateModifier(stats.constitution);
  const ac = 10 + calculateModifier(stats.dexterity);
  
  return {
    name: customData.name || `${race} el ${charClass}`,
    race,
    class: charClass,
    background,
    alignment,
    level: 1,
    stats,
    hp,
    ac,
    speed: raceData.speed,
    racialTraits: raceData.traits,
    classProficiencies: classData.proficiencies,
    classFeatures: classData.features
  };
}

function displayCharacter(character) {
  currentCharacter = character;
  
  // Información básica
  document.getElementById('displayName').textContent = character.name;
  document.getElementById('displayRace').textContent = character.race;
  document.getElementById('displayClass').textContent = character.class;
  document.getElementById('displayLevel').textContent = character.level;
  document.getElementById('displayBackground').textContent = character.background;
  document.getElementById('displayAlignment').textContent = character.alignment;
  
  // Características
  const stats = [
    { id: 'Str', value: character.stats.strength },
    { id: 'Dex', value: character.stats.dexterity },
    { id: 'Con', value: character.stats.constitution },
    { id: 'Int', value: character.stats.intelligence },
    { id: 'Wis', value: character.stats.wisdom },
    { id: 'Cha', value: character.stats.charisma }
  ];
  
  stats.forEach(stat => {
    const modifier = calculateModifier(stat.value);
    document.getElementById(`stat${stat.id}`).textContent = stat.value;
    document.getElementById(`mod${stat.id}`).textContent = 
      (modifier >= 0 ? '+' : '') + modifier;
  });
  
  // Combate
  document.getElementById('displayHP').textContent = character.hp;
  document.getElementById('displayAC').textContent = character.ac;
  document.getElementById('displaySpeed').textContent = `${character.speed} ft`;
  document.getElementById('displayInit').textContent = 
    (calculateModifier(character.stats.dexterity) >= 0 ? '+' : '') + 
    calculateModifier(character.stats.dexterity);
  
  // Rasgos raciales
  const traitsHTML = character.racialTraits
    .map(trait => `<li>• ${trait}</li>`)
    .join('');
  document.getElementById('racialTraits').innerHTML = traitsHTML;
  
  // Competencias de clase
  const profHTML = character.classProficiencies
    .map(prof => `<li>• ${prof}</li>`)
    .join('');
  document.getElementById('classProficiencies').innerHTML = profHTML;
  
  // Mostrar ficha
  document.getElementById('characterSheet').classList.remove('hidden');
  document.getElementById('characterSheet').scrollIntoView({ behavior: 'smooth' });
}

function populateSelects() {
  const raceSelect = document.getElementById('raceSelect');
  const classSelect = document.getElementById('classSelect');
  const backgroundSelect = document.getElementById('backgroundSelect');
  const alignmentSelect = document.getElementById('alignmentSelect');
  
  // Razas
  Object.keys(DND_DATA.races).forEach(race => {
    const option = document.createElement('option');
    option.value = race;
    option.textContent = race;
    raceSelect.appendChild(option);
  });
  
  // Clases
  Object.keys(DND_DATA.classes).forEach(cls => {
    const option = document.createElement('option');
    option.value = cls;
    option.textContent = cls;
    classSelect.appendChild(option);
  });
  
  // Trasfondos
  DND_DATA.backgrounds.forEach(bg => {
    const option = document.createElement('option');
    option.value = bg;
    option.textContent = bg;
    backgroundSelect.appendChild(option);
  });
  
  // Alineamientos
  DND_DATA.alignments.forEach(align => {
    const option = document.createElement('option');
    option.value = align;
    option.textContent = align;
    alignmentSelect.appendChild(option);
  });
}

function downloadCharacterSheet() {
  if (!currentCharacter) return;
  
  const content = `
FICHA DE PERSONAJE D&D 5E
========================

INFORMACIÓN BÁSICA
------------------
Nombre: ${currentCharacter.name}
Raza: ${currentCharacter.race}
Clase: ${currentCharacter.class}
Nivel: ${currentCharacter.level}
Trasfondo: ${currentCharacter.background}
Alineamiento: ${currentCharacter.alignment}

CARACTERÍSTICAS
---------------
Fuerza: ${currentCharacter.stats.strength} (${calculateModifier(currentCharacter.stats.strength) >= 0 ? '+' : ''}${calculateModifier(currentCharacter.stats.strength)})
Destreza: ${currentCharacter.stats.dexterity} (${calculateModifier(currentCharacter.stats.dexterity) >= 0 ? '+' : ''}${calculateModifier(currentCharacter.stats.dexterity)})
Constitución: ${currentCharacter.stats.constitution} (${calculateModifier(currentCharacter.stats.constitution) >= 0 ? '+' : ''}${calculateModifier(currentCharacter.stats.constitution)})
Inteligencia: ${currentCharacter.stats.intelligence} (${calculateModifier(currentCharacter.stats.intelligence) >= 0 ? '+' : ''}${calculateModifier(currentCharacter.stats.intelligence)})
Sabiduría: ${currentCharacter.stats.wisdom} (${calculateModifier(currentCharacter.stats.wisdom) >= 0 ? '+' : ''}${calculateModifier(currentCharacter.stats.wisdom)})
Carisma: ${currentCharacter.stats.charisma} (${calculateModifier(currentCharacter.stats.charisma) >= 0 ? '+' : ''}${calculateModifier(currentCharacter.stats.charisma)})

COMBATE
-------
Puntos de Golpe: ${currentCharacter.hp}
Clase de Armadura: ${currentCharacter.ac}
Velocidad: ${currentCharacter.speed} ft
Iniciativa: ${calculateModifier(currentCharacter.stats.dexterity) >= 0 ? '+' : ''}${calculateModifier(currentCharacter.stats.dexterity)}

RASGOS RACIALES
---------------
${currentCharacter.racialTraits.map(t => `• ${t}`).join('\n')}

COMPETENCIAS DE CLASE
---------------------
${currentCharacter.classProficiencies.map(p => `• ${p}`).join('\n')}

Generado en: ${new Date().toLocaleString()}
D&D NFT Character Forge - https://github.com/JCazorla90/dnd-nft-generator
  `;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentCharacter.name.replace(/\s/g, '_')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  populateSelects();
  
  // Generar aleatorio
  document.getElementById('randomBtn').addEventListener('click', () => {
    const character = generateCharacter();
    displayCharacter(character);
  });
  
  // Toggle panel personalizado
  document.getElementById('toggleCustom').addEventListener('click', () => {
    const panel = document.getElementById('customPanel');
    panel.classList.toggle('hidden');
  });
  
  // Generar personalizado
  document.getElementById('customGenerateBtn').addEventListener('click', () => {
    const customData = {
      name: document.getElementById('charName').value,
      race: document.getElementById('raceSelect').value,
      class: document.getElementById('classSelect').value,
      background: document.getElementById('backgroundSelect').value,
      alignment: document.getElementById('alignmentSelect').value
    };
    
    const character = generateCharacter(customData);
    displayCharacter(character);
  });
  
  // Descargar ficha
  document.getElementById('downloadBtn').addEventListener('click', downloadCharacterSheet);
  
  // Nuevo personaje
  document.getElementById('newCharBtn').addEventListener('click', () => {
    document.getElementById('characterSheet').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Compartir
  document.getElementById('shareBtn').addEventListener('click', () => {
    if (!currentCharacter) return;
    
    const shareText = `¡He creado un personaje D&D!\n${currentCharacter.name} - ${currentCharacter.race} ${currentCharacter.class}\nCrea el tuyo en: https://jcazorla90.github.io/dnd-nft-generator/`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mi personaje D&D',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('¡Enlace copiado al portapapeles!');
    }
  });
});
