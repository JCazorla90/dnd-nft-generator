// ==========================================
// 🐉 BESTIARIO D&D COMPLETO - ESTRUCTURA
// (Metadatos y listas base para bestiario)
// ==========================================

const DND_BESTIARY = {
  version: "5e",
  
  creatureTypes: [
    "Aberración", "Bestia", "Celestial", "Constructo", "Dragón", 
    "Elemental", "Feérico", "Demonio", "Gigante", "Humanoide", 
    "Monstruosidad", "Cieno", "Planta", "No-muerto"
  ],
  
  environments: [
    "Mazmorra", "Bosque", "Montaña", "Pantano", "Desierto", 
    "Subterráneo", "Ciudad", "Costa", "Ártico", "Plano Abismal"
  ],
  
  challengeRatings: [
    { cr: "0", xp: 10 },
    { cr: "1/8", xp: 25 },
    { cr: "1/4", xp: 50 },
    { cr: "1/2", xp: 100 },
    { cr: "1", xp: 200 },
    { cr: "2", xp: 450 },
    { cr: "3", xp: 700 },
    { cr: "4", xp: 1100 },
    { cr: "5", xp: 1800 },
    { cr: "6", xp: 2300 },
    { cr: "7", xp: 2900 },
    { cr: "8", xp: 3900 },
    { cr: "9", xp: 5000 },
    { cr: "10", xp: 5900 },
    { cr: "11", xp: 7200 },
    { cr: "12", xp: 8400 }
  ]
};
