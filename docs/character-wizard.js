/**
 * ═══════════════════════════════════════════════════════════════════
 * 🧙 D&D CHARACTER FORGE - CHARACTER WIZARD
 * Copyright (c) 2025 José Cazorla
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

class CharacterWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 6;
    this.character = this.getInitialState();
    this.pointBuyRemaining = 27;
  }

  getInitialState() {
    return {
      name: '', race: null, class: null, background: null, alignment: 'Neutral',
      stats: { strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8 },
      hp: 0, ac: 10, equipment: []
    };
  }

  start() {
    this.character = this.getInitialState();
    this.pointBuyRemaining = 27;
    this.currentStep = 1;
    
    // UI Switch
    document.getElementById('mainContainer').classList.add('hidden');
    const wizardContainer = document.getElementById('wizard-container');
    wizardContainer.classList.remove('hidden');
    
    this.render();
  }

  render() {
    const container = document.getElementById('wizard-container');
    container.innerHTML = `
      <div class="wizard">
        <div class="wizard-header">
          ${this.renderProgress()}
          <h2 style="font-family: var(--font-title); color: var(--dragon-red)">${this.getStepTitle()}</h2>
          <p>Paso ${this.currentStep} de ${this.totalSteps}</p>
        </div>
        <div class="wizard-content">${this.renderStepContent()}</div>
        <div class="wizard-footer" style="margin-top: 30px; display: flex; justify-content: space-between;">
          ${this.renderButtons()}
        </div>
      </div>
    `;
  }

  renderProgress() {
    let html = '<div class="wizard-progress">';
    for (let i = 1; i <= this.totalSteps; i++) {
      let status = i === this.currentStep ? 'active' : (i < this.currentStep ? 'complete' : '');
      html += `<div class="progress-step ${status}" onclick="wizard.goToStep(${i})">${i < this.currentStep ? '✓' : i}</div>`;
    }
    return html + '</div>';
  }

  getStepTitle() {
    return ['Elige tu Raza', 'Elige tu Clase', 'Tu Historia', 'Estadísticas (Point Buy)', 'Equipo', 'Detalles Finales'][this.currentStep - 1];
  }

  renderStepContent() {
    switch(this.currentStep) {
      case 1: return this.gridSelection(DnDData.races, 'race');
      case 2: return this.gridSelection(DnDData.classes, 'class');
      case 3: return this.gridSelection(DnDData.backgrounds, 'background');
      case 4: return this.renderStats();
      case 5: return this.renderEquipment();
      case 6: return this.renderDetails();
    }
  }

  gridSelection(dataObj, field) {
    return `<div class="selection-grid">
      ${Object.keys(dataObj).map(key => {
        const item = dataObj[key];
        const selected = this.character[field] === key ? 'selected' : '';
        const desc = item.description || item.feature || '';
        return `<div class="selection-card ${selected}" onclick="wizard.select('${field}', '${key}')">
          <h3>${key}</h3><p style="font-size: 0.9rem">${desc}</p>
        </div>`;
      }).join('')}
    </div>`;
  }

  select(field, value) {
    this.character[field] = value;
    if (field === 'class') {
        // Calcular HP base
        const hitDie = DnDData.classes[value].hitDie;
        this.character.hp = hitDie + DnDData.getModifier(this.character.stats.constitution);
    }
    this.render();
  }

  renderStats() {
    return `
      <div style="text-align:center; margin-bottom: 20px;">
        <h3>Puntos Restantes: <span style="color:var(--dragon-red); font-size:1.5rem">${this.pointBuyRemaining}</span></h3>
      </div>
      <div class="selection-grid">
        ${Object.keys(this.character.stats).map(stat => {
          const val = this.character.stats[stat];
          const mod = DnDData.getModifier(val);
          return `<div class="stat-box">
            <label style="text-transform: capitalize"><strong>${stat}</strong></label>
            <div class="stat-controls">
              <button onclick="wizard.modStat('${stat}', -1)">-</button>
              <span class="stat-value">${val}</span>
              <button onclick="wizard.modStat('${stat}', 1)">+</button>
            </div>
            <small>Mod: ${mod >= 0 ? '+'+mod : mod}</small>
          </div>`;
        }).join('')}
      </div>
    `;
  }

  modStat(stat, delta) {
    const current = this.character.stats[stat];
    const next = current + delta;
    if (next < 8 || next > 15) return;
    
    const costDiff = DnDData.pointBuyCosts[next] - DnDData.pointBuyCosts[current];
    if (this.pointBuyRemaining - costDiff < 0) return;

    this.character.stats[stat] = next;
    this.pointBuyRemaining -= costDiff;
    this.render();
  }

  renderEquipment() {
    return `<div style="text-align:center; padding: 20px; background: rgba(0,0,0,0.1); border-radius: 8px;">
      <h3>🎒 Equipo Inicial de ${this.character.class || 'Aventurero'}</h3>
      <p>Tu clase y trasfondo te otorgan:</p>
      <ul style="list-style: none; margin-top: 10px;">
        <li>⚔️ Arma principal de clase</li>
        <li>🛡️ Armadura ligera/media</li>
        <li>🎒 Paquete de explorador</li>
        <li>💰 15 Piezas de Oro</li>
      </ul>
    </div>`;
  }

  renderDetails() {
    return `<div style="max-width: 400px; margin: 0 auto;">
      <label>Nombre del Héroe:</label>
      <input type="text" class="form-control" value="${this.character.name}" oninput="wizard.character.name = this.value" placeholder="Ej: Valerius">
      
      <label>Alineamiento:</label>
      <select class="form-control" onchange="wizard.character.alignment = this.value">
        ${DnDData.alignments.map(a => `<option value="${a}" ${this.character.alignment === a ? 'selected' : ''}>${a}</option>`).join('')}
      </select>
    </div>`;
  }

  renderButtons() {
    return `
      <button class="btn btn-secondary" onclick="wizard.prev()" ${this.currentStep === 1 ? 'disabled' : ''}>Anterior</button>
      <button class="btn btn-primary" onclick="wizard.next()">
        ${this.currentStep === this.totalSteps ? '✨ Finalizar' : 'Siguiente'}
      </button>
    `;
  }

  prev() { if (this.currentStep > 1) { this.currentStep--; this.render(); } }

  next() {
    if (this.currentStep === 1 && !this.character.race) return alert("Selecciona una raza.");
    if (this.currentStep === 2 && !this.character.class) return alert("Selecciona una clase.");
    if (this.currentStep === 3 && !this.character.background) return alert("Selecciona un trasfondo.");
    if (this.currentStep === 6) {
      if (!this.character.name) return alert("¡Ponle nombre a tu héroe!");
      this.finish();
    } else {
      this.currentStep++;
      this.render();
    }
  }
  
  goToStep(step) {
      // Navegación simple permitida hacia atrás
      if(step < this.currentStep) {
          this.currentStep = step;
          this.render();
      }
  }

  finish() {
    // Cálculos finales antes de enviar
    const mods = {
      str: DnDData.getModifier(this.character.stats.strength),
      dex: DnDData.getModifier(this.character.stats.dexterity),
      con: DnDData.getModifier(this.character.stats.constitution),
      int: DnDData.getModifier(this.character.stats.intelligence),
      wis: DnDData.getModifier(this.character.stats.wisdom),
      cha: DnDData.getModifier(this.character.stats.charisma)
    };
    
    this.character.modifiers = mods;
    this.character.ac = 10 + mods.dex;
    this.character.initiative = mods.dex;
    this.character.hp = DnDData.classes[this.character.class].hitDie + mods.con;
    this.character.equipment = ["Equipo de Clase", "Mochila", "15 PO"];
    this.character.traits = [...(DnDData.races[this.character.race].traits || [])];
    
    // Reset UI
    document.getElementById('wizard-container').classList.add('hidden');
    document.getElementById('mainContainer').classList.remove('hidden');
    
    // Callback a la app principal
    if (window.onWizardFinish) window.onWizardFinish(this.character);
  }
}

const wizard = new CharacterWizard();
window.wizard = wizard;
