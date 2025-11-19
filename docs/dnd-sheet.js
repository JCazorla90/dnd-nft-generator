const SHEETS = {
  "5e": renderSheet5e,
  "3.5e": renderSheet35e
};
const main = document.getElementById('mainSheet');
const select = document.getElementById('editionSelect');
const powerLvl = document.getElementById('powerLevel');
const btnExportJSON = document.getElementById('btnExportJSON');
const btnImportJSON = document.getElementById('btnImportJSON');
const fileImport = document.getElementById('fileImport');
const btnMarkdown = document.getElementById('btnMarkdown');
const btnHistory = document.getElementById('btnHistory');
const btnExportPDF = document.getElementById('btnExportPDF');
const btnToggleTheme = document.getElementById('toggleTheme');
const btnRandom = document.getElementById('btnRandom');
const powerBar = document.getElementById('powerbar');
const historyModal = document.getElementById("historyModal");
const storageKey = "dnd_sheet_history";

// Datos para generar aleatorio
const DATA_5E = {
  names: ["Arannis", "Thorin", "Miriel", "Kara", "Ulfgar", "Lia", "Draven", "Soren", "Valen", "Leena", "Grym", "Jax"],
  races: ["Humano","Enano","Elfo","Orco","Mediano","Dracónido","Tiefling"],
  classes: ["Guerrero","Mago","Pícaro","Clérigo","Paladín","Bardo","Bárbaro","Druida","Monje","Explorador","Hechicero","Brujo"],
  backgrounds: ["Noble","Soldado","Erudito","Acólito","Héroe popular","Marinero"],
  alignments: ["Legal Bueno","Neutral Bueno","Caótico Bueno","Legal Neutral","Neutral","Caótico Neutral","Legal Malvado","Neutral Malvado","Caótico Malvado"]
};

// Inicial
SHEETS[select.value]();

// Cambia edición
select.addEventListener('change', () => { main.innerHTML = ""; SHEETS[select.value](); setTimeout(updatePowerLevel,300); });
btnToggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.querySelector('.sheet-surface').classList.toggle('dark');
  if(historyModal)historyModal.classList.toggle('dark');
});

// --------- RENDER 5e
function renderSheet5e() {
  main.innerHTML = `
<div class="avatar-block"><svg id="charAvatar" width="96" height="96"></svg></div>
<div class="fantasy-img-block">
  <img id="aiPortraitImg" src="" alt="Retrato IA" style="display:block;">
  <button id="reloadAIPortrait" class="btn btn-secondary">🔄 Cambiar retrato IA</button>
</div>
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
        <span class="block-title">Info de personaje</span>
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
          <label>DGolpe <input id="hd" maxlength="6" value="1d10"></label>
        </div>
        <span class="block-title">Equipo & notas</span>
        <div class="notes-area"><textarea id="equipNotes" placeholder="Equipo, conjuros, notas..."></textarea></div>
      </div>
    </form>
  `;
  renderSkillsAndSaves();

  // Bind
  bindFields5e();
}

// -----
function renderSheet35e() {
  main.innerHTML = `<div style="padding:2em;font-size:1.3em;text-align:center;color:#b4653d;">Hoja 3.5 en construcción.<br>¿Quieres colaborar? 😄</div>`;
}

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
    ["Fuerza","Destreza","Constitución","Inteligencia","Sabiduría","Carisma"]
    .map(sv=>`<div class="save-item"><input type="checkbox">${sv}</div>`).join('');
}

// ---- AVATAR SVG y Retrato IA
function updateAvatar() {
  const name = document.getElementById("cName")?.value || "Aventurero";
  const race = document.getElementById("cRace")?.value || "Humano";
  const clazz = (document.getElementById("cClassLevel")?.value||"Guerrero").split(" ")[0];
  drawAvatar(name, race, clazz);
}
function drawAvatar(name, race, clazz) {
  const races = {
    'Elfo': ['#bce4d7','#325254'],'Enano':['#d8a867','#855e29'],'Mediano':['#fdeec7','#d19c52'],
    'Orco':['#94b869','#3a501e'],'Humano':['#ffe5c0','#c1946a'],'Dracónido':['#e6d773','#aa8a21'],
    'Tiefling':['#e1adc8','#7b2670']
  };
  const eyes = ['#372502','#365f63','#3a276d','#375514'];
  let hash = (Array.from(name+race+clazz).reduce((a,c)=>a+c.charCodeAt(0),0)%1000)/1000;
  let raceColors = races[race] || ['#ffe4bc','#947855'];
  let svg = `<ellipse cx="48" cy="60" rx="32" ry="36" fill="${raceColors[0]}" stroke="${raceColors[1]}" stroke-width="4"/>
    <ellipse cx="48" cy="49" rx="8" ry="12" fill="${eyes[Math.floor(hash*eyes.length)]}" />
    <ellipse cx="${38+hash*6}" cy="50" rx="4" ry="5" fill="white"/>
    <ellipse cx="${58-hash*6}" cy="50" rx="4" ry="5" fill="white"/>
    <rect x="32" y="80" width="32" height="7" rx="3" fill="${raceColors[1]}" opacity="0.7"/>
    <ellipse cx="48" cy="25" rx="18" ry="15" fill="#${clazz==="Mago"?"b5d0e2":clazz==="Ladrón"?"a2b39c":clazz==="Guerrero"?"7972a9":"e5b6ac"}" opacity="0.5"/>
    <text x="48" y="92" text-anchor="middle" font-size="15" fill="#7a3913">${race[0]}</text>`;
  document.getElementById('charAvatar').innerHTML = svg;
}
async function fetchFantasyPortrait() {
  const race = document.getElementById("cRace")?.value || "Human";
  const clazz = (document.getElementById("cClassLevel")?.value||"Warrior").split(' ')[0];
  const prompt = encodeURIComponent([race, clazz, "fantasy dnd portrait"].filter(Boolean).join(" "));
  document.getElementById("aiPortraitImg").src = "https://placehold.co/170x210/fbf0e6/7a3a13?text=Loading...";
  const res = await fetch(`https://lexica.art/api/v1/search?q=${prompt}`);
  const data = await res.json();
  const img = data.images && data.images.length ? data.images[Math.floor(Math.random()*data.images.length)].srcSmall : null;
  document.getElementById("aiPortraitImg").src = img || "https://placehold.co/170x210/edd8cc/7a3a13?text=No+portrait";
}

// Generador ALEATORIO
function random5e() {
  function randAr(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
  function stat() {
    const rolls=[...Array(4)].map(()=>1+Math.floor(Math.random()*6)).sort((a,b)=>a-b);
    return rolls[1]+rolls[2]+rolls[3];
  }
  document.getElementById("cName").value = randAr(DATA_5E.names)+" "+Math.floor(Math.random()*99);
  document.getElementById("cClassLevel").value = randAr(DATA_5E.classes)+" "+(1+Math.floor(Math.random()*4));
  document.getElementById("cRace").value = randAr(DATA_5E.races);
  document.getElementById("cBg").value = randAr(DATA_5E.backgrounds);
  document.getElementById("cAlign").value = randAr(DATA_5E.alignments);
  document.getElementById("cXP").value = Math.pow(2,6+Math.floor(Math.random()*6));
  ["FUE","DES","CON","INT","SAB","CAR"].forEach(s=>{
    document.getElementById("stat"+s).value = stat();
    document.getElementById("stat"+s).dispatchEvent(new Event('input'));
  });
  // Equipo/notas aleatorio
  document.getElementById("equipNotes").value = "Espada corta, Pócima de curación, Ropas de viaje";
  // Limpia/aleatoria habilidades
  [...document.querySelectorAll("#skillList5e input")].forEach(inpt=>inpt.checked = Math.random()>0.7);
  [...document.querySelectorAll("#saveList5e input")].forEach(inpt=>inpt.checked = Math.random()>0.8);
  updateAvatar(); fetchFantasyPortrait();
  updatePowerLevel();
}

function bindFields5e() {
  // Hooks de inputs para actualizar avatar, IA...
  ["cName","cRace","cClassLevel"].forEach(id=>{
    document.getElementById(id).addEventListener("input",()=>{
      updateAvatar(); fetchFantasyPortrait();
    });
  });
  // Stats power bar
  for(let stat of ["FUE","DES","CON","INT","SAB","CAR"]) {
    document.getElementById(`stat${stat}`).addEventListener('input',updatePowerLevel);
  }
  document.getElementById("aiPortraitImg").style.display="block";
  document.getElementById("reloadAIPortrait").style.display="inline-block";
  document.getElementById("reloadAIPortrait").onclick = fetchFantasyPortrait;
  // Al abrir, render avatar y retrato IA
  updateAvatar(); fetchFantasyPortrait();
}

// Power Bar
function updatePowerLevel() {
  const stats = ["FUE","DES","CON","INT","SAB","CAR"].map(s=>parseInt(document.getElementById(`stat${s}`)?.value||10));
  const avg = stats.reduce((a,b)=>a+b,0)/6;
  let lvl = "⭐ Novato";
  if(avg > 16){lvl="⭐⭐⭐⭐⭐ Legendario";powerBar.style.background="linear-gradient(90deg,#ffefd6,gold)";}
  else if(avg>=14){lvl="⭐⭐⭐⭐ Épico";powerBar.style.background="linear-gradient(90deg,#fff0c0,#d89341)";}
  else if(avg>=12){lvl="⭐⭐⭐ Heroico";powerBar.style.background="linear-gradient(90deg,#f8e9c0 65%,#b89560)";}
  else if(avg>=10){lvl="⭐⭐ Promedio";powerBar.style.background="linear-gradient(90deg,#ece7bc,#caa87a)";}
  else{lvl="⭐ Novato";powerBar.style.background="linear-gradient(90deg,#eeeeda,#b89560)";}
  powerLvl.textContent=lvl;
}

// ---- Funcional común (historial, json, markdown, pdf) ----
btnExportPDF.onclick = ()=>alert("Exportación PDF demo: integra jsPDF según ficha visual.");
btnExportJSON.onclick=()=>{
  const form = document.querySelector('.sheet5e');
  if(!form){alert("No hay ficha cargada");return;}
  const data = Object.fromEntries([...form.querySelectorAll("input,textarea")].map(f=>[f.id || f.name,f.value]));
  saveHistory(data);
  navigator.clipboard.writeText(JSON.stringify(data,null,2));
  alert("JSON copiado al portapapeles. ¡Guárdalo para tus aventuras!");
};
btnMarkdown.onclick=()=>{
  const form = document.querySelector('.sheet5e');
  if(!form){alert("No hay ficha cargada");return;}
  const fields = [...form.querySelectorAll("input,textarea")];
  let md = `## Ficha D&D\`\`\`\n`;
  fields.forEach(f=>{if(f.value) md+=`${f.id||f.name||""}: ${f.value}\n`;});
  md += "```
  navigator.clipboard.writeText(md); alert("Ficha D&D copiada como Markdown");
};
btnImportJSON.onclick = ()=>fileImport.click();
fileImport.addEventListener('change', (e)=>{
  const file = e.target.files; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => { const d = JSON.parse(ev.target.result); fillFormFromData(d);
    alert("Ficha importada del archivo JSON :)");
    fileImport.value = ""; };
  reader.readAsText(file);
});
function fillFormFromData(d){
  document.querySelectorAll('.sheet5e input, .sheet5e textarea').forEach(f=>{
    if(d[f.id]!==undefined) f.value=d[f.id];
    if(f.type==="number"||f.type==="text") f.dispatchEvent(new Event('input'));
  });
  updateAvatar(); fetchFantasyPortrait();
  updatePowerLevel();
}
btnHistory.onclick = ()=>showHistoryModal();
function saveHistory(data){
  let arr = JSON.parse(localStorage.getItem(storageKey)||"[]");
  arr.unshift({...data, saved:new Date().toISOString()});
  localStorage.setItem(storageKey,JSON.stringify(arr.slice(0,9)));
}
function showHistoryModal(){
  let arr = JSON.parse(localStorage.getItem(storageKey)||"[]");
  if(!arr.length){alert("Tu historial está vacío.");return;}
  historyModal.style.display="block"; historyModal.innerHTML='<ul>'+
    arr.map((ch,i)=>`<li><b>${ch.cName||'Sin nombre'}</b> (${ch.cClassLevel||''})<button onclick="loadHist(${i})">Cargar</button></li>`).join("")+'</ul><button onclick="closeHist()">Cerrar</button>';
  if(document.body.classList.contains('dark')) historyModal.classList.add('dark');
  else historyModal.classList.remove('dark');
}
window.loadHist = function(i){
  let arr = JSON.parse(localStorage.getItem(storageKey)||"[]");fillFormFromData(arr[i]);historyModal.style.display="none";
};
window.closeHist = function(){historyModal.style.display="none";};

// Powers: atajos teclado y "🎲 Aleatorio"
document.addEventListener('keydown',e=>{
  if(e.key==="d"&&e.ctrlKey)btnToggleTheme.click();
  if(e.key==="r"&&e.ctrlKey){ random5e(); }
});
if(btnRandom){
  btnRandom.onclick = ()=> random5e();
}
