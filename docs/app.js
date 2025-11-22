"use strict";
/* =========================
 * DATOS BASE DE D&D
 * ========================= */

const DND_DATA = {
  races: {
    Humano: { description: 'Versátiles y adaptativos.', speed: 30, size: 'Mediano', traits: ['+1 a todas las características', 'Idiomas: común'] },
    Elfo: { description: 'Ágiles y perceptivos.', speed: 30, size: 'Mediano', traits: ['Visión en la oscuridad', '+2 Destreza'] }
  },
  classes: {
    Guerrero: { description: 'Maestro en armas y defensa.', hitDie: 10, primaryAbility: 'Fuerza/Destreza', spellcasting: false },
    Mago: { description: 'Dominio del arcano.', hitDie: 6, primaryAbility: 'Inteligencia', spellcasting: true }
  },
  backgrounds: {
    Noble: { feature: 'Contactos privilegiados', skills: ['Historia', 'Persuasión'] },
    Forajido: { feature: 'Refugio secreto', skills: ['Sigilo', 'Juego de manos'] }
  },
  alignments: [
    'Legal Bueno','Neutral Bueno','Caótico Bueno',
    'Legal Neutral','Neutral','Caótico Neutral',
    'Legal Malvado','Neutral Malvado','Caótico Malvado'
  ],
  pointBuyCosts: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
};

/* =========================
 * MONSTRUOS
 * ========================= */

const DND_MONSTERS = [
  { name: "Goblin", type: "Humanoide", cr: "1/4", xp: 50, ac: 15, hp: 7, speed: "30 ft", stats: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 }, environment: ["Bosque", "Mazmorra"], traits: ["Nimble Escape"], actions: ["Hoja curva: +4, 1d6 + 2 daño cortante."], legendaryActions: [] },
  { name: "Ogro", type: "Gigante", cr: "2", xp: 450, ac: 11, hp: 59, speed: "40 ft", stats: { str: 19, dex: 8, con: 17, int: 5, wis: 7, cha: 7 }, environment: ["Montaña", "Bosque"], traits: [], actions: ["Garrote grande: +6, 2d8 + 4 daño contundente."], legendaryActions: [] }
];

/* =========================
 * METADATOS Y HELPERS BESTIARIO
 * ========================= */

const DND_BESTIARY = {
  version: "5e",
  creatureTypes: ["Aberración","Bestia","Celestial","Constructo","Dragón","Elemental","Feérico","Demonio","Gigante","Humanoide","Monstruosidad","Cieno","Planta","No-muerto"],
  environments: ["Mazmorra","Bosque","Montaña","Pantano","Desierto","Subterráneo","Ciudad","Costa","Ártico","Plano Abismal"],
  challengeRatings: [ { cr: "0", xp: 10 }, { cr: "1/8", xp: 25 }, { cr: "1/4", xp: 50 }, { cr: "1/2", xp: 100 }, { cr: "1", xp: 200 }, { cr: "2", xp: 450 }]
};

/* =========================
 * API D&D EXTERNA
 * ========================= */
const DND_API = {
  dnd5e: 'https://www.dnd5eapi.co/api',
  open5e: 'https://api.open5e.com/v1',
  cache: { details: {}, lists: {} },
  async fetchData(url) {
    if (this.cache.details[url]) return this.cache.details[url];
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Error en la API');
      const data = await resp.json();
      this.cache.details[url] = data;
      return data;
    } catch (err) { console.error(err); return null; }
  }
};

/* =========================
 * WIZARD AVANZADO PERSONAJES
 * ========================= */

class CharacterWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 6;
    this.character = { name: '', race: null, class: null, background: null, alignment: 'Neutral', stats: { strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8 }, hp: 0, ac: 10, equipment: [] };
    this.pointBuyRemaining = 27;
  }
  start() {
    document.getElementById('mainContainer').classList.add('hidden');
    document.getElementById('wizard-container').classList.remove('hidden');
    this.renderWizard();
  }
  finishWizard() {
    setTimeout(() => {
      document.getElementById('wizard-container').classList.add('hidden');
      document.getElementById('mainContainer').classList.remove('hidden');
      alert("Personaje creado:\n" + JSON.stringify(this.character, null, 2));
    }, 700);
  }
  renderWizard() {
    document.getElementById('wizard-container').innerHTML =
      `<div class="wizard">
        <h2 class="wizard-title">Paso ${this.currentStep} / ${this.totalSteps}</h2>
        <!-- Renderiza contenidos según el paso actual aquí -->
        <button onclick="window.wizard.finishWizard()" class="btn btn-success">Finalizar</button>
      </div>`;
  }
}
window.wizard = new CharacterWizard();

/* =========================
 * FUNCIONES Y EVENTOS PRINCIPALES
 * ========================= */

// --- Eventos principales de botones ---
document.getElementById('wizardBtn').addEventListener('click', () => window.wizard.start());
document.getElementById('randomBtn').addEventListener('click', generateRandomCharacter);
document.getElementById('chaosCharacterBtn').addEventListener('click', generateChaosCharacter);
document.getElementById('generateCreatureBtn').addEventListener('click', generateCreature);
document.getElementById('generateEncounterBtn').addEventListener('click', generateEncounter);

// --- Paneles de filtro para bestiario ---
function initFilters() {
  populateSelect('filterType', DND_BESTIARY.creatureTypes);
  populateSelect('filterEnv', DND_BESTIARY.environments);
  populateSelect('filterCR', DND_BESTIARY.challengeRatings.map(c => c.cr));
}
function populateSelect(selectId, values) {
  const select = document.getElementById(selectId);
  select.innerHTML = `<option value="">Todos</option>` + values.map(v => `<option value="${v}">${v}</option>`).join('');
}
initFilters();

/* ========== Generador de Personaje Aleatorio ========== */

function generateRandomCharacter() {
  const race = randomFromArray(Object.keys(DND_DATA.races));
  const clazz = randomFromArray(Object.keys(DND_DATA.classes));
  const bg = randomFromArray(Object.keys(DND_DATA.backgrounds));
  const stats = generateRandomStats();
  const align = randomFromArray(DND_DATA.alignments);
  const char = {
    name: 'Héroe Aleatorio',
    race, class: clazz, background: bg, alignment: align,
    stats,
    hp: DND_DATA.classes[clazz].hitDie + calculateModifier(stats.constitution)
  };
  displayCharacter(char);
}
function generateRandomStats() {
  const base = [15,14,13,12,10,8];
  return ['strength','dexterity','constitution','intelligence','wisdom','charisma']
    .reduce((obj, stat, i) => { obj[stat]=base[i]; return obj; }, {});
}
function calculateModifier(stat) { return Math.floor((stat-10)/2); }
function displayCharacter(char) {
  const html = `
    <div class="character-sheet">
      <h3>${char.name}</h3>
      <ul>
        <li><strong>Raza:</strong> ${char.race}</li>
        <li><strong>Clase:</strong> ${char.class}</li>
        <li><strong>Trasfondo:</strong> ${char.background}</li>
        <li><strong>Alineamiento:</strong> ${char.alignment}</li>
        <li><strong>HP:</strong> ${char.hp}</li>
      </ul>
      <h4>Características:</h4>
      <ul>${Object.entries(char.stats).map(
          ([k, v]) => `<li>${k}: ${v} (${formatMod(calculateModifier(v))})</li>`
        ).join('')}</ul>
    </div>`;
  openModal(html);
}
function formatMod(mod) { return (mod>=0?'+':'')+mod; }

/* ========== Generador modo Caos ========== */
function generateChaosCharacter() {
  const stats = {};
  ["strength","dexterity","constitution","intelligence","wisdom","charisma"].forEach(stat => {
    stats[stat] = 16 + Math.floor(Math.random()*3);
  });
  displayCharacter({
    name: 'Personaje Caótico',
    race: randomFromArray(Object.keys(DND_DATA.races)),
    class: randomFromArray(Object.keys(DND_DATA.classes)),
    background: randomFromArray(Object.keys(DND_DATA.backgrounds)),
    alignment: randomFromArray(DND_DATA.alignments),
    stats,
    hp: 26
  });
}

/* ========== Generador de Criatura ========== */
function generateCreature() {
  let type = document.getElementById('filterType').value;
  let env = document.getElementById('filterEnv').value;
  let cr = document.getElementById('filterCR').value;
  let monsters = DND_MONSTERS;
  if(type) monsters = monsters.filter(m => m.type === type);
  if(env) monsters = monsters.filter(m => m.environment.includes(env));
  if(cr) monsters = monsters.filter(m => m.cr === cr);
  const monster = monsters.length ? randomFromArray(monsters) : randomFromArray(DND_MONSTERS);
  displayCreature(monster);
}
function displayCreature(monster) {
  document.getElementById('creatureSheet').innerHTML = `
    <div class="creature-sheet">
      <h3>${monster.name}</h3>
      <p><strong>Tipo:</strong> ${monster.type} | <strong>CR:</strong> ${monster.cr}</p>
      <p><strong>HP:</strong> ${monster.hp} | <strong>AC:</strong> ${monster.ac}</p>
      <ul>
        ${Object.entries(monster.stats).map(([k, v])=>`<li>${k}: ${v}</li>`).join('')}
        <li><strong>Entorno:</strong> ${monster.environment.join(', ')}</li>
        <li><strong>Acciones:</strong> ${monster.actions.join(', ')}</li>
        <li><strong>Rasgos:</strong> ${monster.traits.join(', ')}</li>
      </ul>
    </div>`;
}

/* ========== Generador criatura desde API ========== */
async function generateApiCreature() {
  const data = await DND_API.fetchData(DND_API.open5e + '/monsters/?limit=1&ordering=random');
  if(data && data.results && data.results.length) {
    const m = data.results[0];
    const html = `
      <div class="creature-sheet">
        <h3>${m.name}</h3>
        <p><strong>Tipo:</strong> ${m.type || ''} | <strong>CR:</strong> ${m.challenge_rating}</p>
        <p><strong>HP:</strong> ${m.hit_points} | <strong>AC:</strong> ${m.armor_class}</p>
        <ul>
          <li><strong>Alineamiento:</strong> ${m.alignment || '-'}</li>
          <li><strong>Size:</strong> ${m.size}</li>
          <li><strong>Environment:</strong> ${m.environment || '-'}</li>
        </ul>
      </div>`;
    document.getElementById('creatureSheet').innerHTML = html;
  }
}

/* ========== Encuentros D&D ========== */
function generateEncounter() {
  const lvl = Number(document.getElementById('groupLevel').value) || 1;
  const size = Number(document.getElementById('groupSize').value) || 4;
  let pool = DND_MONSTERS;
  let monsters = [];
  for(let i = 0; i < size; i++) {
    monsters.push(randomFromArray(pool));
  }
  document.getElementById('encounterSheet').innerHTML =
    `<strong>Encuentro nivel ${lvl}, grupo ${size}:</strong>` +
    monsters.map(m => `<div>${m.name} (CR ${m.cr})</div>`).join('');
}

/* ========== Helpers generales ========== */
function randomFromArray(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function openModal(content) {
  // Simple: alert. Expande fácil a modal visual.
  alert(content.replace(/<\/?[^>]+(>|$)/g, ""));
}

/* ==========================
 * WIZARD PASO A PASO AVANZADO
 * ========================== */

class CharacterWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 6;
    this.character = this.getInitialState();
    this.statGenerationMethod = 'point-buy';
    this.pointBuyRemaining = 27;
    window.wizard = this;
  }

  getInitialState() {
    return {
      name: '',
      race: null,
      class: null,
      background: null,
      alignment: 'Neutral',
      stats: { strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8 },
      hp: 0,
      ac: 10,
      equipment: []
    };
  }

  /* --- Navegación Wizard --- */
  
  start() {
    this.character = this.getInitialState();
    this.currentStep = 1;
    document.getElementById('mainContainer').classList.add('hidden');
    document.getElementById('wizard-container').classList.remove('hidden');
    this.renderWizard();
  }
  goToStep(step) {
    if (step < 1 || step > this.totalSteps) return;
    if (step > this.currentStep && !this.validateCurrentStep()) return;
    this.currentStep = step;
    this.renderWizard();
  }
  nextStep() {
    if (!this.validateCurrentStep()) return;
    this.goToStep(this.currentStep + 1);
  }
  previousStep() {
    this.goToStep(this.currentStep - 1);
  }

  validateCurrentStep() {
    switch (this.currentStep) {
      case 1: return this.character.race !== null;
      case 2: return this.character.class !== null;
      case 3: return this.character.background !== null;
      case 4: return this.validateStats();
      case 5: return true; // Equipo auto-asignado
      case 6: return this.character.name.trim().length > 0;
      default: return true;
    }
  }
  validateStats() {
    const stats = Object.values(this.character.stats);
    switch (this.statGenerationMethod) {
      case 'point-buy': return this.pointBuyRemaining === 0 && stats.every(s => s >= 8 && s <= 15);
      case 'standard-array': return stats.every(s => s >= 8 && s <= 15);
      case 'roll': return stats.every(s => s >= 3 && s <= 18);
      default: return true;
    }
  }

  /* --- Renderización Wizard --- */
  
  renderWizard() {
    const html = `
      <div class="wizard">
        <div class="wizard-header">
          <h2 class="wizard-title">Paso ${this.currentStep} / ${this.totalSteps}: ${this.getStepTitle()}</h2>
        </div>
        <div class="wizard-content">
          ${this.renderStepContent()}
        </div>
        <div class="wizard-footer">
          <button class="btn btn-special" onclick="wizard.previousStep()" ${this.currentStep === 1 ? 'disabled' : ''}">← Anterior</button>
          <button class="btn btn-success" onclick="wizard.nextStep()">${this.currentStep === this.totalSteps ? 'Finalizar' : 'Siguiente →'}</button>
        </div>
      </div>
    `;
    document.getElementById('wizard-container').innerHTML = html;
    this.attachEventListeners();
  }

  getStepTitle() {
    const titles = [
      'Elige tu Raza', 'Elige tu Clase', 'Elige tu Trasfondo', 'Asignación de Stats', 'Equipo Inicial', 'Detalles Finales'
    ];
    return titles[this.currentStep - 1];
  }

  /* --- Render de los pasos --- */
  renderStepContent() {
    switch (this.currentStep) {
      case 1: return this.renderRaceSelection();
      case 2: return this.renderClassSelection();
      case 3: return this.renderBackgroundSelection();
      case 4: return this.renderStatsSelection();
      case 5: return this.renderEquipmentSelection();
      case 6: return this.renderFinalDetails();
      default: return '<p>Error</p>';
    }
  }

  renderRaceSelection() {
    const races = Object.keys(DND_DATA.races);
    return `<div class="selection-grid">${races.map(raceName => {
      const race = DND_DATA.races[raceName];
      const isSelected = this.character.race === raceName;
      return `<div class="selection-card ${isSelected ? 'selected' : ''}" onclick="wizard.selectRace('${raceName}')">
        <div class="card-header"><h3>${raceName}</h3>${isSelected ? '<span class="badge badge--success">✓ Seleccionado</span>' : ''}</div>
        <div class="card-body">
          <p>${race.description}</p>
          <ul>${race.traits.map(t => `<li>${t}</li>`).join('')}</ul>
          <span>Velocidad: ${race.speed} ft</span> | <span>Tamaño: ${race.size}</span>
        </div>
      </div>`;
    }).join('')}</div>`;
  }
  selectRace(raceName) {
    this.character.race = raceName;
    this.renderWizard();
  }

  renderClassSelection() {
    const classes = Object.keys(DND_DATA.classes);
    return `<div class="selection-grid">${classes.map(className => {
      const clazz = DND_DATA.classes[className];
      const isSelected = this.character.class === className;
      return `<div class="selection-card ${isSelected ? 'selected' : ''}" onclick="wizard.selectClass('${className}')">
        <div class="card-header"><h3>${className}</h3>${isSelected ? '<span class="badge badge--success">✓ Seleccionado</span>' : ''}</div>
        <div class="card-body">
          <p>${clazz.description}</p>
          <div>Dado de Golpe: d${clazz.hitDie}</div>
          <div>Primaria: ${clazz.primaryAbility}</div>
          ${clazz.spellcasting ? '<span class="badge">✨ Magia</span>' : ''}
        </div>
      </div>`;
    }).join('')}</div>`;
  }
  selectClass(className) {
    this.character.class = className;
    this.character.hp = DND_DATA.classes[className].hitDie + calculateModifier(this.character.stats.constitution);
    this.renderWizard();
  }

  renderBackgroundSelection() {
    const backgrounds = Object.keys(DND_DATA.backgrounds);
    return `<div class="selection-grid">${backgrounds.map(bgName => {
      const bg = DND_DATA.backgrounds[bgName];
      const isSelected = this.character.background === bgName;
      return `<div class="selection-card ${isSelected ? 'selected' : ''}" onclick="wizard.selectBackground('${bgName}')">
        <div class="card-header"><h3>${bgName}</h3>${isSelected ? '<span class="badge badge--success">✓</span>' : ''}</div>
        <div class="card-body">
          <p>${bg.feature}</p>
          <div><strong>Competencias:</strong> ${bg.skills.join(', ')}</div>
        </div>
      </div>`;
    }).join('')}</div>`;
  }
  selectBackground(bgName) {
    this.character.background = bgName;
    this.renderWizard();
  }

  renderStatsSelection() {
    return `
      <div class="stats-methods">
        <button class="btn ${this.statGenerationMethod === 'point-buy' ? 'btn-success' : ''}" onclick="wizard.setStatMethod('point-buy')">Point Buy</button>
        <button class="btn ${this.statGenerationMethod === 'standard-array' ? 'btn-success' : ''}" onclick="wizard.setStatMethod('standard-array')">Standard Array</button>
        <button class="btn ${this.statGenerationMethod === 'roll' ? 'btn-success' : ''}" onclick="wizard.setStatMethod('roll')">Roll</button>
      </div>
      ${this.renderStatInputs()}
    `;
  }
  renderStatInputs() {
    const stats = ['strength','dexterity','constitution','intelligence','wisdom','charisma'];
    const labels = ['Fuerza','Destreza','Constitución','Inteligencia','Sabiduría','Carisma'];
    return `<div class="stats-grid">${stats.map((stat,i) => {
      const value = this.character.stats[stat];
      const mod = calculateModifier(value);
      return `<div class="stat-box">
        <label>${labels[i]}</label>
        <div>
          <button onclick="wizard.decreaseStat('${stat}')">-</button>
          <span>${value}</span>
          <button onclick="wizard.increaseStat('${stat}')">+</button>
          <span style="margin-left:6px;">(${mod>=0?'+':''}${mod})</span>
        </div>
      </div>`;
    }).join('')}</div>
    ${this.statGenerationMethod === 'point-buy' ? `<div class="points-remaining"><strong>Puntos restantes:</strong> ${this.pointBuyRemaining}</div>` : ''}`;
  }
  setStatMethod(method) {
    this.statGenerationMethod = method;
    if (method === 'standard-array') {
      const array = [15,14,13,12,10,8];
      ['strength','dexterity','constitution','intelligence','wisdom','charisma'].forEach((stat,i) => this.character.stats[stat]=array[i]);
    } else if (method === 'roll') {
      ['strength','dexterity','constitution','intelligence','wisdom','charisma'].forEach(stat => {
        this.character.stats[stat] = this.roll4d6DropLowest();
      });
    } else { // point-buy
      ['strength','dexterity','constitution','intelligence','wisdom','charisma'].forEach(stat => {
        this.character.stats[stat]=8;
      });
      this.pointBuyRemaining=27;
    }
    this.renderWizard();
  }
  roll4d6DropLowest() {
    let rolls = Array.from({length:4},()=>Math.floor(Math.random()*6)+1);
    rolls.sort((a,b)=>a-b);
    return rolls.slice(1).reduce((a,b)=>a+b,0);
  }
  increaseStat(stat) {
    if(this.statGenerationMethod!=='point-buy') return;
    let v = this.character.stats[stat];
    if(v>=15||this.pointBuyRemaining<=0) return;
    const cost = DND_DATA.pointBuyCosts[v+1]-DND_DATA.pointBuyCosts[v];
    if(cost<=this.pointBuyRemaining) {
      this.character.stats[stat]++;
      this.pointBuyRemaining -= cost;
      this.renderWizard();
    }
  }
  decreaseStat(stat) {
    if(this.statGenerationMethod!=='point-buy') return;
    let v = this.character.stats[stat];
    if(v<=8) return;
    const refund = DND_DATA.pointBuyCosts[v]-DND_DATA.pointBuyCosts[v-1];
    this.character.stats[stat]--;
    this.pointBuyRemaining += refund;
    this.renderWizard();
  }

  renderEquipmentSelection() {
    return `<div><p>Equipo inicial asignado según tu clase. Ejemplo: <strong>Armas, armadura, mochila de explorador, 50 po</strong></p></div>`;
  }

  renderFinalDetails() {
    return `
      <div>
        <label>Nombre del Personaje *</label>
        <input type="text" id="characterNameInput" value="${this.character.name}" placeholder="Ej: Thorin Escudo de Roble" style="width:98%; font-size:1.09rem;" oninput="wizard.character.name = this.value">
        <label>Alineamiento:</label>
        <select id="characterAlignmentSelect" onchange="wizard.character.alignment = this.value">${DND_DATA.alignments.map(al => `<option value="${al}"${this.character.alignment===al?' selected':''}>${al}</option>`).join('')}</select>
        <div style="margin-top:15px;">
          <h4>Resumen:</h4>
          <ul>
            <li>Raza: ${this.character.race || 'No seleccionada'}</li>
            <li>Clase: ${this.character.class || 'No seleccionada'}</li>
            <li>Trasfondo: ${this.character.background || 'No seleccionado'}</li>
            <li>Nivel: 1</li>
            <li>HP: ${this.character.hp}</li>
            <li>Alineamiento: ${this.character.alignment}</li>
          </ul>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Puedes gestionar listeners extras aquí si usas modales, autocomplete, imágenes, etc.
  }
}
window.wizard = new CharacterWizard();
