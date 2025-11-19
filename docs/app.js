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
  const background = customData.background || randomFromArray(Object.keys(DND_DATA.backgrounds)); // FIX: Object.keys()
  const alignment = customData.alignment || randomFromArray(DND_DATA.alignments);
  
  const stats = generateStats();
  const classData = DND_DATA.classes[charClass];
  const raceData = DND_DATA.races[race];
  const backgroundData = DND_DATA.backgrounds[background];
  
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
    classFeatures: classData.features,
    savingThrows: classData.savingThrows,
    skills: classData.skills,
    equipment: classData.equipment,
    backgroundData: backgroundData
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
  
  // Salvaciones y habilidades
  document.getElementById('displaySavingThrows').textContent = character.savingThrows.join(', ');
  document.getElementById('displaySkills').textContent = character.skills;
  
  // Equipo de clase
  const equipmentHTML = character.equipment
    .map(item => `<li>• ${item}</li>`)
    .join('');
  document.getElementById('equipment').innerHTML = equipmentHTML;
  
  // Información de trasfondo
  document.getElementById('backgroundName').textContent = character.background;
  document.getElementById('backgroundSkills').textContent = character.backgroundData.skills.join(', ');
  document.getElementById('backgroundFeature').textContent = character.backgroundData.feature;
  
  const bgEquipHTML = character.backgroundData.equipment
    .map(item => `<li>• ${item}</li>`)
    .join('');
  document.getElementById('backgroundEquipment').innerHTML = bgEquipHTML;
  
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
  
  // Características de clase
  const featuresHTML = character.classFeatures
    .map(feature => `<li>• ${feature}</li>`)
    .join('');
  document.getElementById('classFeatures').innerHTML = featuresHTML;
  
  // Mostrar ficha y botón NFT
  document.getElementById('characterSheet').classList.remove('hidden');
  const nftBtn = document.getElementById('mintNFTBtn');
  if (nftBtn) {
    nftBtn.style.display = 'inline-block';
  }
  
  // Scroll suave
  document.getElementById('characterSheet').scrollIntoView({ behavior: 'smooth' });
  
  // Guardar en localStorage para persistencia
  saveCharacterToStorage(character);
  
  // Animación de celebración
  celebrateCharacterCreation();
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
  
  // Trasfondos - FIX: usar Object.keys()
  Object.keys(DND_DATA.backgrounds).forEach(bg => {
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
  doc.text('Salvaciones:', 20, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  doc.text(currentCharacter.savingThrows.join(', '), 20, y);
  
  // Habilidades
  y += 10;
  doc.setFont(undefined, 'bold');
  doc.text('Habilidades:', 20, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  const skillsLines = doc.splitTextToSize(currentCharacter.skills, 170);
  skillsLines.forEach(line => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 20, y);
    y += 5;
  });
  
  // Rasgos raciales
  y += 10;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
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
    const lines = doc.splitTextToSize(`• ${trait}`, 170);
    lines.forEach(line => {
      doc.text(line, 20, y);
      y += 5;
    });
  });
  
  // Competencias de clase
  y += 10;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('COMPETENCIAS DE CLASE', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  currentCharacter.classProficiencies.forEach(prof => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`• ${prof}`, 20, y);
    y += 5;
  });
  
  // Características de clase
  y += 10;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('CARACTERÍSTICAS DE CLASE', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  currentCharacter.classFeatures.forEach(feature => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`• ${feature}`, 20, y);
    y += 5;
  });
  
  // Equipo
  y += 10;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('EQUIPO INICIAL', 20, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  currentCharacter.equipment.forEach(item => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`• ${item}`, 20, y);
    y += 5;
  });
  
  // Equipo de trasfondo
  y += 8;
  if (y > 270) {
    doc.addPage();
    y = 20;
  }
  doc.setFont(undefined, 'bold');
  doc.text('Equipo de trasfondo:', 20, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  currentCharacter.backgroundData.equipment.forEach(item => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`• ${item}`, 20, y);
    y += 5;
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
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    
    alert(`Wallet conectada: ${account.substring(0, 6)}...${account.substring(38)}\n\n⚠️ Función de minteo en desarrollo.\n\nPróximamente podrás:\n• Generar imagen NFT única\n• Subir metadata a IPFS\n• Mintear en blockchain`);
    
  } catch (error) {
    console.error('Error conectando wallet:', error);
    alert('Error conectando wallet: ' + error.message);
  }
}

// FUNCIONES ADICIONALES

// Guardar personaje en localStorage
function saveCharacterToStorage(character) {
  try {
    const savedCharacters = JSON.parse(localStorage.getItem('dnd_characters') || '[]');
    savedCharacters.unshift({
      ...character,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('dnd_characters', JSON.stringify(savedCharacters.slice(0, 10)));
  } catch (e) {
    console.log('No se pudo guardar en localStorage');
  }
}

// Cargar último personaje
function loadLastCharacter() {
  try {
    const savedCharacters = JSON.parse(localStorage.getItem('dnd_characters') || '[]');
    if (savedCharacters.length > 0) {
      const lastChar = savedCharacters[0];
      delete lastChar.savedAt;
      displayCharacter(lastChar);
      return true;
    }
  } catch (e) {
    console.log('No se pudo cargar personaje guardado');
  }
  return false;
}

// Animación de celebración
function celebrateCharacterCreation() {
  const colors = ['#667eea', '#764ba2', '#FFD700', '#48bb78'];
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
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
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    to {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Calcular nivel de poder del personaje
function calculatePowerLevel(character) {
  const statsTotal = Object.values(character.stats).reduce((a, b) => a + b, 0);
  const avgStat = statsTotal / 6;
  
  if (avgStat >= 16) return '⭐⭐⭐⭐⭐ Legendario';
  if (avgStat >= 14) return '⭐⭐⭐⭐ Épico';
  if (avgStat >= 12) return '⭐⭐⭐ Heroico';
  if (avgStat >= 10) return '⭐⭐ Promedio';
  return '⭐ Novato';
}

// Generar historia breve del personaje
function generateBackstory(character) {
  const stories = {
    'Guerrero': 'forjado en el campo de batalla',
    'Mago': 'estudiante de las artes arcanas',
    'Pícaro': 'superviviente de las calles',
    'Clérigo': 'elegido por los dioses',
    'Paladín': 'campeón de la justicia',
    'Bardo': 'viajero de mil historias',
    'Bárbaro': 'hijo de las tierras salvajes',
    'Druida': 'guardián de la naturaleza',
    'Monje': 'maestro del cuerpo y mente',
    'Explorador': 'cazador de las tierras inhóspitas',
    'Hechicero': 'portador de magia innata',
    'Brujo': 'pactante de poderes oscuros'
  };
  
  return `${character.name}, ${character.race} ${stories[character.class]}, busca su destino en un mundo lleno de magia y peligros.`;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  populateSelects();
  
  // Intentar cargar último personaje
  const hasLoadedCharacter = loadLastCharacter();
  if (hasLoadedCharacter) {
    console.log('✨ Último personaje cargado');
  }
  
  // Generar aleatorio
  document.getElementById('randomBtn').addEventListener('click', () => {
    try {
      const character = generateCharacter();
      displayCharacter(character);
      
      // Mostrar nivel de poder
      setTimeout(() => {
        const powerLevel = calculatePowerLevel(character);
        const backstory = generateBackstory(character);
        console.log(`🎲 ${character.name} - ${powerLevel}`);
        console.log(`📖 ${backstory}`);
      }, 500);
    } catch (error) {
      console.error('Error generando personaje:', error);
      alert('Error al generar personaje. Por favor, recarga la página.');
    }
  });
  
  // Toggle panel personalizado
  document.getElementById('toggleCustom').addEventListener('click', () => {
    const panel = document.getElementById('customPanel');
    panel.classList.toggle('hidden');
  });
  
  // Generar personalizado
  document.getElementById('customGenerateBtn').addEventListener('click', () => {
    try {
      const customData = {
        name: document.getElementById('charName').value,
        race: document.getElementById('raceSelect').value,
        class: document.getElementById('classSelect').value,
        background: document.getElementById('backgroundSelect').value,
        alignment: document.getElementById('alignmentSelect').value
      };
      
      const character = generateCharacter(customData);
      displayCharacter(character);
    } catch (error) {
      console.error('Error generando personaje personalizado:', error);
      alert('Error al generar personaje. Verifica los datos.');
    }
  });
  
  // Descargar PDF
  document.getElementById('downloadBtn').addEventListener('click', generatePDF);
  
  // Mintear NFT
  const nftBtn = document.getElementById('mintNFTBtn');
  if (nftBtn) {
    nftBtn.addEventListener('click', connectWalletAndMint);
  }
  
  // Nuevo personaje
  document.getElementById('newCharBtn').addEventListener('click', () => {
    document.getElementById('characterSheet').classList.add('hidden');
    const nftBtn = document.getElementById('mintNFTBtn');
    if (nftBtn) {
      nftBtn.style.display = 'none';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Compartir
  document.getElementById('shareBtn').addEventListener('click', () => {
    if (!currentCharacter) return;
    
    const powerLevel = calculatePowerLevel(currentCharacter);
    const shareText = `¡He creado un personaje D&D!\n\n${currentCharacter.name}\n${currentCharacter.race} ${currentCharacter.class}\n${powerLevel}\n\nCrea el tuyo en: https://jcazorla90.github.io/dnd-nft-generator/`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mi personaje D&D',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('¡Texto copiado al portapapeles!');
    }
  });
  
  // Atajos de teclado
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R = Generar aleatorio
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      document.getElementById('randomBtn').click();
    }
    // Ctrl/Cmd + S = Descargar PDF
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && currentCharacter) {
      e.preventDefault();
      generatePDF();
    }
  });
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    const legendaryChar = generateCharacter();
    legendaryChar.stats = {
      strength: 18,
      dexterity: 18,
      constitution: 18,
      intelligence: 18,
      wisdom: 18,
      charisma: 18
    };
    legendaryChar.name = '⭐ ' + legendaryChar.name + ' el Legendario';
    displayCharacter(legendaryChar);
    alert('🎉 ¡Código Konami activado! Personaje legendario generado con stats máximos!');
  }
});
