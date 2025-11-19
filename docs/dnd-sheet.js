// ====== D&D SHEET: Modular multipestaña, power bar, JSON, markdown, modo oscuro

const SHEETS = {
  "5e": renderSheet5e,
  "3.5e": renderSheet35e,
  "retro": renderSheetRetro
};
const main = document.getElementById('mainSheet');
const select = document.getElementById('editionSelect');
const powerLvl = document.getElementById('powerLevel');
const powerBar = document.getElementById('powerbar');
const btnExportJSON = document.getElementById('btnExportJSON');
const btnImportJSON = document.getElementById('btnImportJSON');
const fileImport = document.getElementById('fileImport');
const btnMarkdown = document.getElementById('btnMarkdown');
const btnHistory = document.getElementById('btnHistory');
const btnToggleTheme = document.getElementById('toggleTheme');
const btnExportPDF = document.getElementById('btnExportPDF');
const historyModal = document.getElementById('historyModal');
const storageKey = "dnd_sheet_history";

// Render initial
SHEETS[select.value]();

// Cambia edición
select.addEventListener('change', () => {
  main.innerHTML = ""; SHEETS[select.value]();
  setTimeout(() => { updatePowerLevel(); }, 300);
});

// Modo oscuro
btnToggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.querySelector('.sheet-surface').classList.toggle('dark');
  if(historyModal) historyModal.classList.toggle('dark');
});

// ========== 5e Sheet DEMO (Completa)
function renderSheet5e() {
  main.innerHTML = `
    <form class="sheet5e" id="form5e" autocomplete="off">
      <div class="stats-panel">
        <span class="block-title">Características</span>
        <div class="stats-circles">
          ${["FUE", "DES", "CON", "INT", "SAB", "CAR"].map(stat => `
            <div class="stat-circle">
              <label>${stat}</label>
              <input type="number" min="1" max="20" value="10" id="stat${stat}">
              <div class="stat-val" id="val${stat}">10</div>
              <div class="stat-mod" id="mod${stat}">+0</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="main-panel">
        <span class="block-title">Información de personaje</span>
        <div class="sheet-row">
          <label>Nombre</label><input id="cName"><label>Clase/Nvl</label><input id="cClassLevel"><label>Raza</label><input id="cRace">
        </div>
        <div class="sheet-row">
          <label>Trasfondo</label><input id="cBg"><label>Alineamiento</label><input id="cAlign"><label>XP</label><input id="cXP" type="number">
        </div>
        <span class="block-title">Salvaciones & Habilidades</span>
        <div class="saves-list" id="saveList5e"></div>
        <div class="skills-list" id="skillList5e"></div>
        <span class="block-title">Combate</span>
        <div class="combatgrid">
          <label>CA <input id="ca" maxlength="2" value="10"></label>
          <label>Iniciativa <input id="init" maxlength="3" value="+0"></label>
          <label>Velocidad <input id="speed" maxlength="3" value="30"></label>
          <label>PV <input id="hpMax" maxlength="3" value="10"></label>
          <label>Actual <input id="hpCurr" maxlength="3" value="10"></label>
          <label>Dado Golpe <input id="hd" maxlength="6" value="1d10"></label>
        </div>
        <span class="block-title">Equipo & notas</span>
        <div class="notes-area"><textarea id="equipNotes" placeholder="Equipo, conjuros, notas..."></textarea></div>
      </div>
    </form>
  `;
  // Habilidades+salvaciones
  renderSkillsAndSaves();
  // Hooks para stats
  for (let stat of ["FUE", "DES", "CON", "INT", "SAB", "CAR"]) {
    document.getElementById(`stat${stat}`).addEventListener('input', (e) => {
      let val = parseInt(e.target.value)||10;
      document.getElementById(`val${stat}`).textContent = val;
      let mod = Math.floor((val-10)/2); 
      let dom = document.getElementById(`mod${stat}`);
      dom.textContent = (mod>=0?'+':'')+mod;
      dom.style.color = mod>=0 ? "#267654" : "#a31e1e";
      updatePowerLevel();
    });
  }
  updatePowerLevel();
}
// Habilidades y salvaciones 5e
function renderSkillsAndSaves() {
  const skills = [
    "Acrobacias (Dex)","Arcanos (Int)","Atletismo (Fue)","Engaño (Car)",
    "Historia (Int)","Interpretación (Car)","Intimidación (Car)","Investigación (Int)",
    "Medicina (Sab)","Naturaleza (Int)","Percepción (Sab)","Perspicacia (Sab)",
    "Religión (Int)","Sigilo (Dex)","Supervivencia (Sab)","Trato animales (Sab)",
    "Juego de manos (Dex)","Persuasión (Car)"
  ];
  document.getElementById('skillList5e').innerHTML = skills.map(skill =>
    `<div class="skill-item"><input type="checkbox">${skill}</div>`
  ).join('');
  document.getElementById('saveList5e').innerHTML =
    ["Fuerza", "Destreza", "Constitución", "Inteligencia", "Sabiduría", "Carisma"]
    .map(sv=>`<div class="save-item"><input type="checkbox">${sv}</div>`).join('');
}
// Otras versiones
function renderSheet35e() {
  main.innerHTML = `<form class="sheet35e"><div style="padding:2em;font-size:1.3em;text-align:center;color:#b4653d;">Hoja 3.5 en construcción.<br>¿Quieres colaborar? 😄</div></form>`;
}
function renderSheetRetro() {
  main.innerHTML = `<form class="sheetRetro"><div style="padding:2em;font-size:1.3em;text-align:center;color:#254b22;">Ficha retro "old school" muy pronto 🛡️</div></form>`;
}

// Power bar: calcula medias de stats
function updatePowerLevel() {
  const stats = ["FUE","DES","CON","INT","SAB","CAR"].map(s=>parseInt(document.getElementById(`stat${s}`)?.value||10));
  const avg = stats.reduce((a,b)=>a+b,0)/6;
  let lvl = "⭐ Novato";
  if(avg > 16){ lvl = "⭐⭐⭐⭐⭐ Legendario"; powerBar.style.background="linear-gradient(90deg,#ffefd6, gold)";}
  else if(avg>=14){ lvl = "⭐⭐⭐⭐ Épico"; powerBar.style.background="linear-gradient(90deg,#fff0c0,#d89341)";}
  else if(avg>=12){ lvl = "⭐⭐⭐ Heroico"; powerBar.style.background="linear-gradient(90deg,#f8e9c0 65%, #b89560)";}
  else if(avg>=10){ lvl = "⭐⭐ Promedio"; powerBar.style.background="linear-gradient(90deg,#ece7bc, #caa87a)";}
  else { lvl="⭐ Novato"; powerBar.style.background="linear-gradient(90deg,#eeeeda, #b89560)";}
  powerLvl.textContent = lvl;
}

// PDF export
btnExportPDF.addEventListener('click', () => {
  if(typeof window.jspdf === "undefined"){alert("Cargar jsPDF!");return;}
  alert("🎲 Exportación a PDF básica demo. Mejora a medida en desarrollo.");
});

// JSON export
btnExportJSON.addEventListener('click', () => {
  const form = document.querySelector('.sheet5e');
  if(!form){alert("No hay ficha cargada");return;}
  const data = Object.fromEntries([...form.querySelectorAll("input,textarea")].map(f=>[f.id || f.name,f.value]));
  saveHistory(data);
  navigator.clipboard.writeText(JSON.stringify(data,null,2));
  alert("JSON copiado al portapapeles. ¡Guárdalo para tus aventuras!");
});

// JSON import
btnImportJSON.addEventListener('click', ()=>fileImport.click());
fileImport.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload
