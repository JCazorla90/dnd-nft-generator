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
      proficiencies: ["Armas simples", "Espadas cortas", "Herramientas de artesano o instr
