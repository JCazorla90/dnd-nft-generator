const DND_DATA = {
  races: {
    "Humano": {
      traits: ["Versatilidad (+1 a todas las características)", "Idioma adicional", "Competencia adicional en una habilidad"],
      speed: 30
    },
    "Elfo": {
      traits: ["Visión en la oscuridad", "Sentidos agudos", "Trance élfico", "Ancestro feérico"],
      speed: 30
    },
    "Enano": {
      traits: ["Visión en la oscuridad", "Resistencia enana", "Competencia en herramientas", "Conocimiento de la piedra"],
      speed: 25
    },
    "Mediano": {
      traits: ["Afortunado", "Valiente", "Agilidad de mediano", "Sigiloso por naturaleza"],
      speed: 25
    },
    "Orco": {
      traits: ["Visión en la oscuridad", "Agresivo", "Amenazador", "Resistencia implacable"],
      speed: 30
    },
    "Tiefling": {
      traits: ["Visión en la oscuridad", "Resistencia infernal", "Legado infernal (magia)"],
      speed: 30
    },
    "Dracónido": {
      traits: ["Ancestro dracónico", "Arma de aliento", "Resistencia al daño"],
      speed: 30
    }
  },
  
  classes: {
    "Guerrero": {
      hitDie: 10,
      proficiencies: ["Armaduras pesadas", "Armas marciales", "Escudos"],
      features: ["Estilo de combate", "Recuperación", "Oleada de acción"]
    },
    "Mago": {
      hitDie: 6,
      proficiencies: ["Bastones", "Ballestas ligeras", "Dagas", "Hondas"],
      features: ["Lanzamiento de conjuros", "Recuperación arcana", "Tradición arcana"]
    },
    "Pícaro": {
      hitDie: 8,
      proficiencies: ["Armaduras ligeras", "Armas simples", "Herramientas de ladrón"],
      features: ["Ataque furtivo", "Astucia", "Pericia", "Evasión"]
    },
    "Clérigo": {
      hitDie: 8,
      proficiencies: ["Armaduras medianas", "Escudos", "Armas simples"],
      features: ["Lanzamiento de conjuros", "Dominio divino", "Canalizar divinidad"]
    },
    "Paladín": {
      hitDie: 10,
      proficiencies: ["Todas las armaduras", "Escudos", "Armas marciales"],
      features: ["Sentido divino", "Imposición de manos", "Castigo divino"]
    },
    "Bardo": {
      hitDie: 8,
      proficiencies: ["Armaduras ligeras", "Armas simples", "Tres instrumentos musicales"],
      features: ["Lanzamiento de conjuros", "Inspiración bárdica", "Multicompetente"]
    },
    "Bárbaro": {
      hitDie: 12,
      proficiencies: ["Armaduras medianas", "Escudos", "Armas marciales"],
      features: ["Ira", "Defensa sin armadura", "Ataque temerario"]
    }
  },
  
  backgrounds: [
    "Noble",
    "Criminal",
    "Erudito",
    "Soldado",
    "Artista",
    "Acólito",
    "Charlatán",
    "Ermitaño",
    "Héroe popular",
    "Marinero"
  ],
  
  alignments: [
    "Legal Bueno",
    "Neutral Bueno",
    "Caótico Bueno",
    "Legal Neutral",
    "Neutral",
    "Caótico Neutral",
    "Legal Malvado",
    "Neutral Malvado",
    "Caótico Malvado"
  ]
};
