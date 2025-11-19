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
// Generar PDF profesional
async function generatePDF() {
  if (!currentCharacter) return;
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  let y = 20;
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(102, 126, 234);
  doc.text(currentCharacter.name, 105, y, { align: 'center' });
  
  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(118, 75, 162);
  doc.text(`${currentCharacter.race} ${currentCharacter.class} - Nivel ${currentCharacter.level}`, 105, y, { align: 'center' });
  
  y += 15;
  doc.setLineWidth(0.5);
  doc.setDrawColor(102, 126, 234);
  doc.line(20, y, 190, y);
  
  // Información básica
  y += 10;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('INFORMACIÓN BÁSICA', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Trasfondo: ${currentCharacter.background}`, 20, y);
  doc.text(`Alineamiento: ${currentCharacter.alignment}`, 120, y);
  
  // Características
  y += 15;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('CARACTERÍSTICAS', 20, y);
  
  y += 10;
  const stats = [
    ['FUE', currentCharacter.stats.strength],
    ['DES', currentCharacter.stats.dexterity],
    ['CON', currentCharacter.stats.constitution],
    ['INT', currentCharacter.stats.intelligence],
    ['SAB', currentCharacter.stats.wisdom],
    ['CAR', currentCharacter.stats.charisma]
  ];
  
  let x = 20;
  stats.forEach(([name, value]) => {
    const mod = calculateModifier(value);
    doc.setFillColor(102, 126, 234);
    doc.rect(x, y, 25, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(name, x + 12.5, y + 5, { align: 'center' });
    doc.setFontSize(14);
    doc.text(value.toString(), x + 12.5, y + 10, { align: 'center' });
    doc.setFontSize(10);
    doc.text((mod >= 0 ? '+' : '') + mod, x + 12.5, y + 14, { align: 'center' });
    x += 28;
  });
  
  // Combate
  y += 25;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('COMBATE', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`HP: ${currentCharacter.hp}`, 20, y);
  doc.text(`CA: ${currentCharacter.ac}`, 60, y);
  doc.text(`Velocidad: ${currentCharacter.speed} ft`, 100, y);
  doc.text(`Iniciativa: ${(calculateModifier(currentCharacter.stats.dexterity) >= 0 ? '+' : '')}${calculateModifier(currentCharacter.stats.dexterity)}`, 150, y);
  
  // Salvaciones
  y += 10;
  doc.setFont(undefined, 'bold');
  doc.text('Salvaciones competentes:', 20, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  const classData = DND_DATA.classes[currentCharacter.class];
  doc.text(classData.savingThrows.join(', '), 20, y);
  
  // Habilidades
  y += 10;
  doc.setFont(undefined, 'bold');
  doc.text('Habilidades:', 20, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  doc.text(classData.skills, 20, y, { maxWidth: 170 });
  
  // Rasgos raciales
  y += 15;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('RASGOS RACIALES', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  currentCharacter.racialTraits.forEach(trait => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`• ${trait}`, 20, y, { maxWidth: 170 });
    y += 6;
  });
  
  // Competencias de clase
  y += 10;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('COMPETENCIAS Y RASGOS DE CLASE', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  currentCharacter.classProficiencies.forEach(prof => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`• ${prof}`, 20, y, { maxWidth: 170 });
    y += 6;
  });
  
  // Equipo
  y += 10;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('EQUIPO INICIAL', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  classData.equipment.forEach(item => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`• ${item}`, 20, y, { maxWidth: 170 });
    y += 6;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Generado en D&D NFT Character Forge', 105, 285, { align: 'center' });
  doc.text(new Date().toLocaleString(), 105, 290, { align: 'center' });
  
  // Guardar
  doc.save(`${currentCharacter.name.replace(/\s/g, '_')}.pdf`);
}

// Conectar wallet y mintear NFT
async function connectWalletAndMint() {
  if (!currentCharacter) {
    alert('Primero genera un personaje');
    return;
  }
  
  if (typeof window.ethereum === 'undefined') {
    alert('Por favor instala MetaMask para crear NFTs');
    window.open('https://metamask.io/', '_blank');
    return;
  }
  
  try {
    // Solicitar acceso a la wallet
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    
    alert(`Wallet conectada: ${account.substring(0, 6)}...${account.substring(38)}\n\n⚠️ Función de minteo en desarrollo.\n\nPróximamente podrás:\n• Generar imagen NFT única\n• Subir metadata a IPFS\n• Mintear en blockchain`);
    
    // TODO: Implementar minteo real
    // 1. Generar imagen del personaje
    // 2. Subir a IPFS
    // 3. Llamar al contrato NFT
    
  } catch (error) {
    console.error('Error conectando wallet:', error);
    alert('Error conectando wallet: ' + error.message);
  }
}

// Actualizar event listeners
document.addEventListener('DOMContentLoaded', () => {
  // ... código anterior ...
  
  // Descargar PDF (reemplazar el anterior)
  document.getElementById('downloadBtn').addEventListener('click', generatePDF);
  
  // Añadir botón de NFT
  const nftBtn = document.createElement('button');
  nftBtn.id = 'mintNFTBtn';
  nftBtn.className = 'btn btn-success';
  nftBtn.innerHTML = '🔗 Crear NFT';
  nftBtn.style.display = 'none';
  nftBtn.addEventListener('click', connectWalletAndMint);
  
  const actionsDiv = document.querySelector('.actions');
  actionsDiv.insertBefore(nftBtn, actionsDiv.firstChild);
  
  // Mostrar botón NFT cuando se genera personaje
  const originalDisplay = displayCharacter;
  window.displayCharacter = function(character) {
    originalDisplay(character);
    document.getElementById('mintNFTBtn').style.display = 'inline-block';
  };
});
