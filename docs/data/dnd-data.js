const DND_DATA = {
  races: {
    "Humano": {
      traits: ["Versatilidad (+1 a todas las características)", "Idioma adicional", "Competencia adicional en una habilidad"],
      speed: 30,
      languages: ["Común", "1 adicional a elección"]
    },
    "Elfo": {
      traits: ["Visión en la oscuridad (60 ft)", "Sentidos agudos (Ventaja en Percepción)", "Trance élfico (4h descanso)", "Ancestro feérico (Ventaja vs encantar)"],
      speed: 30,
      languages: ["Común", "Élfico"]
    },
    "Enano": {
      traits: ["Visión en la oscuridad (60 ft)", "Resistencia enana (Ventaja vs veneno)", "Competencia en herramientas", "Conocimiento de la piedra"],
      speed: 25,
      languages: ["Común", "Enano"]
    },
    "Mediano": {
      traits: ["Afortunado (retirar 1s)", "Valiente (Ventaja vs miedo)", "Agilidad de mediano (atravesar criaturas grandes)", "Sigiloso por naturaleza"],
      speed: 25,
      languages: ["Común", "Mediano"]
    },
    "Orco": {
      traits: ["Visión en la oscuridad (60 ft)", "Agresivo (bonus acción dash hacia enemigo)", "Amenazador (competencia en Intimidación)", "Resistencia implacable (1 vez/descanso, quedar con 1 HP)"],
      speed: 30,
      languages: ["Común", "Orco"]
    },
    "Tiefling": {
      traits: ["Visión en la oscuridad (60 ft)", "Resistencia infernal (resistencia fuego)", "Legado infernal (Taumaturgia + Reprensión infernal + Oscuridad)"],
      speed: 30,
      languages: ["Común", "Infernal"]
    },
    "Dracónido": {
      traits: ["Ancestro dracónico (elige color)", "Arma de aliento (2d6, recarga descanso corto/largo)", "Resistencia al daño (según ancestro)"],
      speed: 30,
      languages: ["Común", "Dracónico"]
    },
    "Gnomo": {
      traits: ["Visión en la oscuridad (60 ft)", "Astucia gnómica (Ventaja vs magia INT/SAB/CAR)", "Pequeño (tamaño Small)"],
      speed: 25,
      languages: ["Común", "Gnómico"]
    },
    "Semielfo": {
      traits: ["Visión en la oscuridad (60 ft)", "Ancestro feérico", "Versatilidad de habilidad (+2 habilidades)", "Idiomas adicionales (2)"],
      speed: 30,
      languages: ["Común", "Élfico", "1 adicional"]
    },
    "Semiorco": {
      traits: ["Visión en la oscuridad (60 ft)", "Amenazador", "Resistencia implacable", "Ataques salvajes (críticos extra dado)"],
      speed: 30,
      languages: ["Común", "Orco"]
    }
  },
  
  classes: {
    "Guerrero": {
      hitDie: 10,
      proficiencies: ["Todas las armaduras", "Escudos", "Armas simples", "Armas marciales"],
      savingThrows: ["Fuerza", "Constitución"],
      skills: ["Elige 2: Acrobacias, Trato con animales, Atletismo, Historia, Perspicacia, Intimidación, Percepción, Supervivencia"],
      features: ["Estilo de combate", "Recuperación (1d10 + nivel)", "Oleada de acción"],
      equipment: ["Cota de mallas", "Escudo", "Arma marcial", "2 hachas de mano", "Equipo de explorador"]
    },
    "Mago": {
      hitDie: 6,
      proficiencies: ["Bastones", "Ballestas ligeras", "Dagas", "Dardos", "Hondas"],
      savingThrows: ["Inteligencia", "Sabiduría"],
      skills: ["Elige 2: Arcanos, Historia, Perspicacia, Investigación, Medicina, Religión"],
      features: ["Lanzamiento de conjuros", "Recuperación arcana", "Tradición arcana", "Libro de conjuros (6 nivel 1)"],
      equipment: ["Bastón arcano", "Bolsa de componentes", "Libro de conjuros", "Ropa de erudito"]
    },
    "Pícaro": {
      hitDie: 8,
      proficiencies: ["Armaduras ligeras", "Armas simples", "Ballestas de mano", "Espadas cortas", "Espadas largas", "Estoques", "Herramientas de ladrón"],
      savingThrows: ["Destreza", "Inteligencia"],
      skills: ["Elige 4: Acrobacias, Atletismo, Engaño, Perspicacia, Intimidación, Investigación, Percepción, Interpretación, Persuasión, Juego de manos, Sigilo"],
      features: ["Pericia (doble bonif. en 2 habilidades)", "Ataque furtivo (1d6)", "Jerga de ladrones", "Acción astuta"],
      equipment: ["Armadura de cuero", "2 dagas", "Herramientas de ladrón", "Equipo de explorador"]
    },
    "Clérigo": {
      hitDie: 8,
      proficiencies: ["Armaduras ligeras", "Armaduras medianas", "Escudos", "Armas simples"],
      savingThrows: ["Sabiduría", "Carisma"],
      skills: ["Elige 2: Historia, Perspicacia, Medicina, Persuasión, Religión"],
      features: ["Lanzamiento de conjuros", "Dominio divino", "Canalizar divinidad (1/descanso)"],
      equipment: ["Cota de mallas", "Escudo", "Maza", "Símbolo sagrado", "Equipo de sacerdote"]
    },
    "Paladín": {
      hitDie: 10,
      proficiencies: ["Todas las armaduras", "Escudos", "Armas simples", "Armas marciales"],
      savingThrows: ["Sabiduría", "Carisma"],
      skills: ["Elige 2: Atletismo, Perspicacia, Intimidación, Medicina, Persuasión, Religión"],
      features: ["Sentido divino", "Imposición de manos (5 x nivel HP)", "Estilo de combate", "Castigo divino"],
      equipment: ["Cota de mallas", "Escudo", "Arma marcial", "5 jabalinas", "Símbolo sagrado"]
    },
    "Bardo": {
      hitDie: 8,
      proficiencies: ["Armaduras ligeras", "Armas simples", "Ballestas de mano", "Espadas largas", "Estoques", "Espadas cortas", "3 instrumentos musicales"],
      savingThrows: ["Destreza", "Carisma"],
      skills: ["Elige 3 cualquiera"],
      features: ["Lanzamiento de conjuros", "Inspiración bárdica (d6, 1/descanso)", "Multicompetente", "Canción de descanso"],
      equipment: ["Armadura de cuero", "Daga", "Instrumento musical", "Equipo de artista"]
    },
    "Bárbaro": {
      hitDie: 12,
      proficiencies: ["Armaduras ligeras", "Armaduras medianas", "Escudos", "Armas simples", "Armas marciales"],
      savingThrows: ["Fuerza", "Constitución"],
      skills: ["Elige 2: Trato con animales, Atletismo, Intimidación, Naturaleza, Percepción, Supervivencia"],
      features: ["Ira (2/descanso, +2 daño, ventaja FUE, resistencia físico)", "Defensa sin armadura", "Ataque temerario", "Sentido del peligro"],
      equipment: ["Hacha de batalla", "2 hachas de mano", "Equipo de explorador", "4 jabalinas"]
    },
    "Druida": {
      hitDie: 8,
      proficiencies: ["Armaduras ligeras (no metal)", "Armaduras medianas (no metal)", "Escudos (no metal)", "Clavas", "Dagas", "Dardos", "Jabalinas", "Mazas", "Bastones", "Cimitarras", "Hondas", "Lanzas"],
      savingThrows: ["Inteligencia", "Sabiduría"],
      skills: ["Elige 2: Arcanos, Trato con animales, Perspicacia, Medicina, Naturaleza, Percepción, Religión, Supervivencia"],
      features: ["Lanzamiento de conjuros", "Druídico (idioma secreto)", "Forma salvaje (2/descanso)"],
      equipment: ["Escudo de madera", "Cimitarra", "Armadura de cuero", "Equipo de explorador", "Foco druídico"]
    },
    "Monje": {
      hitDie: 8,
      proficiencies: ["Armas simples", "Espadas cortas", "Herramientas de artesano o instrumento"],
      savingThrows: ["Fuerza", "Destreza"],
      skills: ["Elige 2: Acrobacias, Atletismo, Historia, Perspicacia, Religión, Sigilo"],
      features: ["Defensa sin armadura", "Artes marciales (1d4)", "Ki (3 puntos)", "Movimiento sin armadura (+10 ft)", "Deflectar proyectiles"],
      equipment: ["Espada corta", "10 dardos", "Equipo de explorador"]
    },
    "Explorador": {
      hitDie: 10,
      proficiencies: ["Armaduras ligeras", "Armaduras medianas", "Escudos", "Armas simples", "Armas marciales"],
      savingThrows: ["Fuerza", "Destreza"],
      skills: ["Elige 3: Trato con animales, Atletismo, Perspicacia, Investigación, Naturaleza, Percepción, Sigilo, Supervivencia"],
      features: ["Enemigo predilecto", "Explorador nato", "Estilo de combate", "Lanzamiento de conjuros", "Conciencia primaria"],
      equipment: ["Armadura de escamas", "2 espadas cortas", "Equipo de explorador", "Arco largo + 20 flechas"]
    },
    "Hechicero": {
      hitDie: 6,
      proficiencies: ["Dagas", "Dardos", "Hondas", "Bastones", "Ballestas ligeras"],
      savingThrows: ["Constitución", "Carisma"],
      skills: ["Elige 2: Arcanos, Engaño, Perspicacia, Intimidación, Persuasión, Religión"],
      features: ["Lanzamiento de conjuros", "Origen de hechicería", "Puntos de hechicería", "Metamagia (2 opciones)"],
      equipment: ["Ballesta ligera + 20 virotes", "Bolsa de componentes", "Equipo de explorador", "2 dagas"]
    },
    "Brujo": {
      hitDie: 8,
      proficiencies: ["Armaduras ligeras", "Armas simples"],
      savingThrows: ["Sabiduría", "Carisma"],
      skills: ["Elige 2: Arcanos, Engaño, Historia, Intimidación, Investigación, Naturaleza, Religión"],
      features: ["Lanzamiento de conjuros (Pacto)", "Invocaciones sobrenaturales (2)", "Don del pacto", "Explosión mística"],
      equipment: ["Armadura de cuero", "Arma simple", "2 dagas", "Bolsa de componentes", "Equipo de erudito"]
    }
  },
  
  skills: [
    "Acrobacias (DES)", "Trato con animales (SAB)", "Arcanos (INT)", "Atletismo (FUE)",
    "Engaño (CAR)", "Historia (INT)", "Perspicacia (SAB)", "Intimidación (CAR)",
    "Investigación (INT)", "Medicina (SAB)", "Naturaleza (INT)", "Percepción (SAB)",
    "Interpretación (CAR)", "Persuasión (CAR)", "Religión (INT)", "Juego de manos (DES)",
    "Sigilo (DES)", "Supervivencia (SAB)"
  ],
  
  backgrounds: {
    "Noble": {
      skills: ["Historia", "Persuasión"],
      equipment: ["Ropas finas", "Anillo de sello", "Pergamino de linaje", "Bolsa con 25 po"],
      feature: "Posición de privilegio"
    },
    "Criminal": {
      skills: ["Engaño", "Sigilo"],
      equipment: ["Palanca", "Ropas oscuras con capucha", "Bolsa con 15 po"],
      feature: "Contacto criminal"
    },
    "Erudito": {
      skills: ["Arcanos", "Historia"],
      equipment: ["Tinta y pluma", "Cuchillo pequeño", "Carta de mentor", "Ropas de estudiante", "Bolsa con 10 po"],
      feature: "Investigador"
    },
    "Soldado": {
      skills: ["Atletismo", "Intimidación"],
      equipment: ["Insignia de rango", "Trofeo de enemigo", "Juego de dados", "Ropas comunes", "Bolsa con 10 po"],
      feature: "Rango militar"
    },
    "Acólito": {
      skills: ["Perspicacia", "Religión"],
      equipment: ["Símbolo sagrado", "Libro de plegarias", "5 varitas de incienso", "Ropas de ceremonia", "Bolsa con 15 po"],
      feature: "Refugio de los fieles"
    },
    "Artista": {
      skills: ["Acrobacias", "Interpretación"],
      equipment: ["Instrumento musical", "Regalo de admirador", "Disfraz", "Bolsa con 15 po"],
      feature: "A petición del público"
    },
    "Charlatán": {
      skills: ["Engaño", "Juego de manos"],
      equipment: ["Ropas finas", "Kit de disfraz", "Herramientas de estafador", "Bolsa con 15 po"],
      feature: "Identidad falsa"
    },
    "Ermitaño": {
      skills: ["Medicina", "Religión"],
      equipment: ["Estuche de pergaminos", "Manta de invierno", "Ropas comunes", "Kit de herbolario", "5 po"],
      feature: "Descubrimiento"
    },
    "Héroe popular": {
      skills: ["Trato con animales", "Supervivencia"],
      equipment: ["Herramientas de artesano", "Pala", "Olla de hierro", "Ropas comunes", "Bolsa con 10 po"],
      feature: "Hospitalidad rústica"
    },
    "Marinero": {
      skills: ["Atletismo", "Percepción"],
      equipment: ["Garfio de abordaje", "50 ft de cuerda de seda", "Amuleto de la suerte", "Ropas comunes", "Bolsa con 10 po"],
      feature: "Paso de barco"
    }
  },
  
  alignments: [
    "Legal Bueno", "Neutral Bueno", "Caótico Bueno",
    "Legal Neutral", "Neutral", "Caótico Neutral",
    "Legal Malvado", "Neutral Malvado", "Caótico Malvado"
  ]
};
