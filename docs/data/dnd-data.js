const DND_DATA = {
  version: "5e",
  
  races: {
    "Humano": {
      abilityBonuses: { all: 1 }, // +1 a todas
      traits: [
        "Versatilidad: +1 a todas las características",
        "Idioma adicional a elección",
        "Competencia adicional en una habilidad a elección"
      ],
      speed: 30,
      size: "Medium",
      languages: ["Común", "1 adicional a elección"],
      vision: "Normal"
    },
    
    "Elfo": {
      subraces: {
        "Alto Elfo": {
          abilityBonuses: { dexterity: 2, intelligence: 1 },
          traits: [
            "Visión en la oscuridad (60 ft)",
            "Sentidos agudos: Competencia en Percepción",
            "Trance élfico: 4 horas de meditación = descanso largo",
            "Ancestro feérico: Ventaja contra encantamiento, inmune a dormir",
            "Entrenamiento élfico con armas: Competencia espada larga, corta, arco largo y corto",
            "Truco de mago: Conoces 1 truco de la lista de mago"
          ],
          cantrip: "1 truco de Mago"
        },
        "Elfo Oscuro (Drow)": {
          abilityBonuses: { dexterity: 2, charisma: 1 },
          traits: [
            "Visión en la oscuridad superior (120 ft)",
            "Sensibilidad a la luz solar: Desventaja en ataques y Percepción con luz solar",
            "Magia drow: Conoces Luces danzantes. En nivel 3: Fuego feérico 1/día. En nivel 5: Oscuridad 1/día",
            "Entrenamiento drow con armas: Competencia estoques, espadas cortas, ballestas de mano"
          ]
        },
        "Elfo de los Bosques": {
          abilityBonuses: { dexterity: 2, wisdom: 1 },
          traits: [
            "Visión en la oscuridad (60 ft)",
            "Pies ligeros: Velocidad base 35 ft",
            "Máscara de lo salvaje: Puedes esconderte incluso con cobertura ligera de follaje, lluvia, nieve, niebla",
            "Entrenamiento élfico con armas: Competencia espada larga, corta, arco largo y corto"
          ]
        }
      },
      speed: 30,
      size: "Medium",
      languages: ["Común", "Élfico"],
      vision: "Visión en la oscuridad (60 ft)"
    },
    
    "Enano": {
      subraces: {
        "Enano de las Montañas": {
          abilityBonuses: { constitution: 2, strength: 2 },
          traits: [
            "Visión en la oscuridad (60 ft)",
            "Resistencia enana: Ventaja contra veneno, resistencia al daño de veneno",
            "Entrenamiento enano de combate: Competencia hacha de batalla, hacha de mano, martillo ligero, martillo de guerra",
            "Competencia en herramientas: Competencia en herramientas de artesano a elección",
            "Conocimiento de la piedra: +2 a Historia relacionada con piedra",
            "Armadura enana: Competencia en armaduras ligeras y medianas"
          ]
        },
        "Enano de las Colinas": {
          abilityBonuses: { constitution: 2, wisdom: 1 },
          traits: [
            "Visión en la oscuridad (60 ft)",
            "Resistencia enana: Ventaja contra veneno, resistencia al daño de veneno",
            "Dureza enana: Máximo de puntos de golpe aumenta en 1 por nivel",
            "Entrenamiento enano de combate: Competencia hacha de batalla, hacha de mano, martillo ligero, martillo de guerra",
            "Competencia en herramientas: Competencia en herramientas de artesano a elección"
          ]
        }
      },
      speed: 25,
      size: "Medium",
      languages: ["Común", "Enano"],
      vision: "Visión en la oscuridad (60 ft)",
      special: "La velocidad no se reduce por llevar armadura pesada"
    },
    
    "Mediano": {
      subraces: {
        "Mediano Piesligeros": {
          abilityBonuses: { dexterity: 2, charisma: 1 },
          traits: [
            "Afortunado: Cuando saques 1 natural, puedes volver a tirar",
            "Valiente: Ventaja contra estar asustado",
            "Agilidad de mediano: Puedes moverte a través del espacio de criaturas más grandes",
            "Sigiloso por naturaleza: Puedes esconderte detrás de criaturas más grandes"
          ]
        },
        "Mediano Fornido": {
          abilityBonuses: { dexterity: 2, constitution: 1 },
          traits: [
            "Afortunado: Cuando saques 1 natural, puedes volver a tirar",
            "Valiente: Ventaja contra estar asustado",
            "Resistencia de fornido: Ventaja contra veneno, resistencia al daño de veneno",
            "Agilidad de mediano: Puedes moverte a través del espacio de criaturas más grandes"
          ]
        }
      },
      speed: 25,
      size: "Small",
      languages: ["Común", "Mediano"],
      vision: "Normal"
    },
    
    "Orco": {
      abilityBonuses: { strength: 2, constitution: 1 },
      traits: [
        "Visión en la oscuridad (60 ft)",
        "Agresivo: Como acción bonus, puedes hacer Dash hacia un enemigo que veas",
        "Amenazador: Competencia en Intimidación",
        "Resistencia implacable: 1 vez por descanso largo, cuando quedas a 0 HP puedes quedar con 1 HP"
      ],
      speed: 30,
      size: "Medium",
      languages: ["Común", "Orco"],
      vision: "Visión en la oscuridad (60 ft)"
    },
    
    "Tiefling": {
      abilityBonuses: { charisma: 2, intelligence: 1 },
      traits: [
        "Visión en la oscuridad (60 ft)",
        "Resistencia infernal: Resistencia al daño de fuego",
        "Legado infernal: Conoces el truco Taumaturgia. Al nivel 3: Reprensión infernal 1/día. Al nivel 5: Oscuridad 1/día (CAR es tu característica)"
      ],
      speed: 30,
      size: "Medium",
      languages: ["Común", "Infernal"],
      vision: "Visión en la oscuridad (60 ft)"
    },
    
    "Dracónido": {
      abilityBonuses: { strength: 2, charisma: 1 },
      draconicAncestry: {
        "Rojo": { damageType: "Fuego", breathWeapon: "Cono de 15 ft" },
        "Azul": { damageType: "Relámpago", breathWeapon: "Línea de 5x30 ft" },
        "Verde": { damageType: "Veneno", breathWeapon: "Cono de 15 ft" },
        "Negro": { damageType: "Ácido", breathWeapon: "Línea de 5x30 ft" },
        "Blanco": { damageType: "Frío", breathWeapon: "Cono de 15 ft" },
        "Bronce": { damageType: "Relámpago", breathWeapon: "Línea de 5x30 ft" },
        "Cobre": { damageType: "Ácido", breathWeapon: "Línea de 5x30 ft" },
        "Oro": { damageType: "Fuego", breathWeapon: "Cono de 15 ft" },
        "Plata": { damageType: "Frío", breathWeapon: "Cono de 15 ft" },
        "Latón": { damageType: "Fuego", breathWeapon: "Línea de 5x30 ft" }
      },
      traits: [
        "Ancestro dracónico: Elige un tipo de dragón (determina resistencia y arma de aliento)",
        "Arma de aliento: Acción, 2d6 de daño (CD 8 + CON + bonif. competencia), recupera tras descanso corto/largo",
        "Resistencia al daño: Resistencia al tipo de daño de tu ancestro dracónico"
      ],
      speed: 30,
      size: "Medium",
      languages: ["Común", "Dracónico"],
      vision: "Normal"
    },
    
    "Gnomo": {
      subraces: {
        "Gnomo de las Rocas": {
          abilityBonuses: { intelligence: 2, constitution: 1 },
          traits: [
            "Visión en la oscuridad (60 ft)",
            "Astucia gnómica: Ventaja en salvaciones INT, SAB y CAR contra magia",
            "Conocimiento de artífice: Competencia en Historia (Arcanos) relacionada con objetos mágicos, alquímicos y tecnológicos. Puedes añadir el doble de tu bonificador",
            "Manitas: Competencia en herramientas de artesano (juguetes mecánicos)"
          ]
        },
        "Gnomo de los Bosques": {
          abilityBonuses: { intelligence: 2, dexterity: 1 },
          traits: [
            "Visión en la oscuridad (60 ft)",
            "Astucia gnómica: Ventaja en salvaciones INT, SAB y CAR contra magia",
            "Ilusionista nato: Conoces el truco Ilusión menor (INT)",
            "Hablar con bestias pequeñas: Puedes comunicarte de forma simple con bestias Pequeñas o menores"
          ]
        }
      },
      speed: 25,
      size: "Small",
      languages: ["Común", "Gnómico"],
      vision: "Visión en la oscuridad (60 ft)"
    },
    
    "Semielfo": {
      abilityBonuses: { charisma: 2, choice: 2 }, // +2 a dos características a elección
      traits: [
        "Visión en la oscuridad (60 ft)",
        "Ancestro feérico: Ventaja contra encantamiento, inmune a dormir",
        "Versatilidad de habilidad: Competencia en 2 habilidades a elección",
        "+2 a dos características a elección (además del +2 CAR)"
      ],
      speed: 30,
      size: "Medium",
      languages: ["Común", "Élfico", "1 adicional a elección"],
      vision: "Visión en la oscuridad (60 ft)"
    },
    
    "Semiorco": {
      abilityBonuses: { strength: 2, constitution: 1 },
      traits: [
        "Visión en la oscuridad (60 ft)",
        "Amenazador: Competencia en Intimidación",
        "Resistencia implacable: 1 vez por descanso largo, cuando quedas a 0 HP puedes quedar con 1 HP",
        "Ataques salvajes: Cuando hagas crítico con arma cuerpo a cuerpo, tira un dado de daño adicional"
      ],
      speed: 30,
      size: "Medium",
      languages: ["Común", "Orco"],
      vision: "Visión en la oscuridad (60 ft)"
    }
  },
  
  classes: {
    "Guerrero": {
      hitDie: 10,
      primaryAbility: ["Fuerza", "Destreza"],
      proficiencies: {
        armor: ["Todas las armaduras", "Escudos"],
        weapons: ["Armas simples", "Armas marciales"],
        tools: [],
        savingThrows: ["Fuerza", "Constitución"]
      },
      skills: {
        choose: 2,
        from: ["Acrobacias", "Trato con animales", "Atletismo", "Historia", "Perspicacia", "Intimidación", "Percepción", "Supervivencia"]
      },
      features: [
        "Estilo de combate (nivel 1): Elige uno - Arquería, Defensa, Duelo, Armas grandes, Protección, Combate con dos armas",
        "Recuperación (nivel 1): 1 vez por descanso corto, recupera 1d10 + nivel de guerrero HP",
        "Oleada de acción (nivel 2): 1 vez por descanso corto, acción adicional en tu turno"
      ],
      subclasses: {
        "Campeón": "Críticos mejorados (19-20), Atleta notable, Crítico superior (18-20)",
        "Maestro de batalla": "Maniobras de combate, Dados de superioridad, Conoce tu enemigo",
        "Caballero arcano": "Lanzamiento de conjuros, Vínculo con arma, Golpe de guerra"
      },
      equipment: [
        "Opción A: Cota de mallas + Escudo",
        "Opción B: Armadura de cuero, Arco largo + 20 flechas",
        "Arma marcial + escudo O 2 armas marciales",
        "Ballesta ligera + 20 virotes O 2 hachas de mano",
        "Equipo de explorador O Equipo de mazmorreo"
      ],
      spellcasting: false
    },
    
    "Mago": {
      hitDie: 6,
      primaryAbility: ["Inteligencia"],
      proficiencies: {
        armor: [],
        weapons: ["Dagas", "Dardos", "Hondas", "Bastones", "Ballestas ligeras"],
        tools: [],
        savingThrows: ["Inteligencia", "Sabiduría"]
      },
      skills: {
        choose: 2,
        from: ["Arcanos", "Historia", "Perspicacia", "Investigación", "Medicina", "Religión"]
      },
      features: [
        "Lanzamiento de conjuros (INT)",
        "Recuperación arcana (nivel 1): Recupera espacios de conjuro (total nivel igual a la mitad de tu nivel de mago)",
        "Tradición arcana (nivel 2): Escuela de Abjuración, Adivinación, Encantamiento, Evocación, Ilusión, Invocación, Nigromancia, Transmutación"
      ],
      subclasses: {
        "Escuela de Evocación": "Esculpir conjuros, Truco potente, Evocación potenciada",
        "Escuela de Abjuración": "Guardián abjurador, Conjuración proyectada, Abjuración mejorada",
        "Escuela de Ilusión": "Ilusión mejorada menor, Ilusiones maleables, Yo ilusorio"
      },
      spellcasting: {
        ability: "Inteligencia",
        level1Spells: 6,
        cantrips: 3,
        preparedSpells: "INT + nivel"
      },
      startingSpells: {
        cantrips: ["Rayo de escarcha", "Mano de mago", "Luces danzantes"],
        level1: ["Armadura de mago", "Proyectil mágico", "Escudo", "Detectar magia", "Comprensión de idiomas", "Alarma"]
      },
      equipment: [
        "Bastón arcano O Daga",
        "Bolsa de componentes O Foco arcano",
        "Equipo de erudito O Equipo de explorador",
        "Libro de conjuros"
      ]
    },
    
    "Pícaro": {
      hitDie: 8,
      primaryAbility: ["Destreza"],
      proficiencies: {
        armor: ["Armaduras ligeras"],
        weapons: ["Armas simples", "Ballestas de mano", "Espadas cortas", "Espadas largas", "Estoques"],
        tools: ["Herramientas de ladrón"],
        savingThrows: ["Destreza", "Inteligencia"]
      },
      skills: {
        choose: 4,
        from: ["Acrobacias", "Atletismo", "Engaño", "Perspicacia", "Intimidación", "Investigación", "Percepción", "Interpretación", "Persuasión", "Juego de manos", "Sigilo"]
      },
      features: [
        "Pericia (nivel 1): Dobla bonificador de competencia en 2 habilidades que elijas",
        "Ataque furtivo (nivel 1): 1d6 daño extra (escala con nivel)",
        "Jerga de ladrones (nivel 1): Idioma secreto + señales",
        "Acción astuta (nivel 2): Dash, Desenganche o Esconderse como acción bonus",
        "Esquiva asombrosa (nivel 5): No puedes ser sorprendido si no estás incapacitado"
      ],
      subclasses: {
        "Ladrón": "Manos rápidas, Trabajo de segunda historia, Reflejos supremos",
        "Asesino": "Bonificador de asesino, Infiltración experta, Impostor",
        "Embaucador arcano": "Lanzamiento de conjuros, Truco de mano de mago, Emboscada mágica"
      },
      equipment: [
        "Estoque O Espada corta",
        "Arco corto + 20 flechas O Espada corta",
        "Pack de ladrón O Pack de explorador O Pack de mazmorreo",
        "Armadura de cuero + 2 dagas + Herramientas de ladrón"
      ],
      spellcasting: false
    },
    
    "Clérigo": {
      hitDie: 8,
      primaryAbility: ["Sabiduría"],
      proficiencies: {
        armor: ["Armaduras ligeras", "Armaduras medianas", "Escudos"],
        weapons: ["Armas simples"],
        tools: [],
        savingThrows: ["Sabiduría", "Carisma"]
      },
      skills: {
        choose: 2,
        from: ["Historia", "Perspicacia", "Medicina", "Persuasión", "Religión"]
      },
      features: [
        "Lanzamiento de conjuros (SAB)",
        "Dominio divino (nivel 1): Conocimiento, Guerra, Engaño, Luz, Naturaleza, Tempestad, Vida",
        "Canalizar divinidad (nivel 2): 1/descanso corto. Opciones según dominio + Expulsar muertos vivientes"
      ],
      subclasses: {
        "Dominio de Vida": "Discípulo de la vida, Canalizar: Preservar vida, Sanador bendecido",
        "Dominio de Luz": "Truco adicional (Luz), Canalizar: Resplandor del alba, Llamarada protectora",
        "Dominio de Guerra": "Competencia armas y armaduras, Canalizar: Golpe guiado, Ataque de guerra"
      },
      spellcasting: {
        ability: "Sabiduría",
        cantrips: 3,
        preparedSpells: "SAB + nivel",
        domainSpells: "Siempre preparados según dominio"
      },
      startingSpells: {
        cantrips: ["Llama sagrada", "Orientación", "Taumaturgia"],
        domainExamples: {
          Vida: ["Bendición", "Curar heridas"],
          Luz: ["Manos ardientes", "Hada de fuego"]
        }
      },
      equipment: [
        "Maza O Martillo de guerra (con competencia)",
        "Armadura de escamas O Armadura de cuero O Cota de mallas (con competencia)",
        "Ballesta ligera + 20 virotes O Arma simple",
        "Pack de sacerdote O Pack de explorador",
        "Escudo + Símbolo sagrado"
      ]
    },
    
    "Bárbaro": {
      hitDie: 12,
      primaryAbility: ["Fuerza"],
      proficiencies: {
        armor: ["Armaduras ligeras", "Armaduras medianas", "Escudos"],
        weapons: ["Armas simples", "Armas marciales"],
        tools: [],
        savingThrows: ["Fuerza", "Constitución"]
      },
      skills: {
        choose: 2,
        from: ["Trato con animales", "Atletismo", "Intimidación", "Naturaleza", "Percepción", "Supervivencia"]
      },
      features: [
        "Ira (nivel 1): 2/descanso largo. +2 daño cuerpo a cuerpo, ventaja en FUE y tiradas de salvación FUE, resistencia daño contundente/cortante/perforante",
        "Defensa sin armadura (nivel 1): CA = 10 + DES + CON (sin armadura)",
        "Ataque temerario (nivel 2): Ventaja en ataques, enemigos tienen ventaja contra ti",
        "Sentido del peligro (nivel 2): Ventaja en DES contra efectos que veas",
        "Camino primario (nivel 3): Senda del Berserker, Senda del Luchador totémico"
      ],
      subclasses: {
        "Senda del Berserker": "Frenesí (ataque bonus durante Ira), Ira sin sentido, Presencia intimidante",
        "Senda del Luchador totémico": "Espíritu tótem (Oso/Águila/Lobo), Aspecto de la bestia, Sintonía con espíritus"
      },
      equipment: [
        "Hacha de batalla O Cualquier arma marcial cuerpo a cuerpo",
        "2 hachas de mano O Cualquier arma simple",
        "Pack de explorador + 4 jabalinas"
      ],
      spellcasting: false
    },
    
    "Paladín": {
      hitDie: 10,
      primaryAbility: ["Fuerza", "Carisma"],
      proficiencies: {
        armor: ["Todas las armaduras", "Escudos"],
        weapons: ["Armas simples", "Armas marciales"],
        tools: [],
        savingThrows: ["Sabiduría", "Carisma"]
      },
      skills: {
        choose: 2,
        from: ["Atletismo", "Perspicacia", "Intimidación", "Medicina", "Persuasión", "Religión"]
      },
      features: [
        "Sentido divino (nivel 1): Detectar celestiales/demonios/muertos vivientes 60 ft",
        "Imposición de manos (nivel 1): 5 x nivel HP de curación como acción",
        "Estilo de combate (nivel 2)",
        "Lanzamiento de conjuros (nivel 2, CAR)",
        "Castigo divino (nivel 2): Gasta espacio de conjuro, +2d8 radiante por nivel",
        "Juramento sagrado (nivel 3): Devoción, Antiguos, Venganza"
      ],
      subclasses: {
        "Juramento de Devoción": "Arma sagrada, Expulsar lo profano, Aura de devoción",
        "Juramento de los Antiguos": "Ira de la naturaleza, Expulsar lo infiel, Aura de guardián",
        "Juramento de Venganza": "Abjurar enemigo, Voto de enemistad, Vengador implacable"
      },
      spellcasting: {
        ability: "Carisma",
        preparedSpells: "CAR/2 + nivel paladín",
        oathSpells: "Siempre preparados según juramento"
      },
      equipment: [
        "Arma marcial + escudo O 2 armas marciales",
        "5 jabalinas O Arma simple cuerpo a cuerpo",
        "Pack de sacerdote O Pack de explorador",
        "Cota de mallas + Símbolo sagrado"
      ]
    },
    
    "Explorador": {
      hitDie: 10,
      primaryAbility: ["Destreza", "Sabiduría"],
      proficiencies: {
        armor: ["Armaduras ligeras", "Armaduras medianas", "Escudos"],
        weapons: ["Armas simples", "Armas marciales"],
        tools: [],
        savingThrows: ["Fuerza", "Destreza"]
      },
      skills: {
        choose: 3,
        from: ["Trato con animales", "Atletismo", "Perspicacia", "Investigación", "Naturaleza", "Percepción", "Sigilo", "Supervivencia"]
      },
      features: [
        "Enemigo predilecto (nivel 1): Ventaja en rastrear + conocimiento adicional sobre un tipo de criatura",
        "Explorador nato (nivel 1): Beneficios en terreno favorito",
        "Estilo de combate (nivel 2)",
        "Lanzamiento de conjuros (nivel 2, SAB)",
        "Arquetipo de explorador (nivel 3): Cazador, Maestro de bestias, Acechador sombrío"
      ],
      subclasses: {
        "Cazador": "Presa del cazador, Tácticas defensivas, Ataque múltiple mejorado",
        "Maestro de bestias": "Compañero del explorador, Entrenamiento excepcional, Furia de la bestia",
        "Acechador sombrío": "Magia del acechador, Esquiva de las sombras, Emboscada"
      },
      spellcasting: {
        ability: "Sabiduría",
        preparedSpells: "Todos los conjuros conocidos"
      },
      equipment: [
        "Armadura de escamas O Armadura de cuero",
        "2 espadas cortas O 2 armas simples cuerpo a cuerpo",
        "Pack de explorador O Pack de mazmorreo",
        "Arco largo + Carcaj con 20 flechas"
      ]
    },
    
    "Bardo": {
      hitDie: 8,
      primaryAbility: ["Carisma"],
      proficiencies: {
        armor: ["Armaduras ligeras"],
        weapons: ["Armas simples", "Ballestas de mano", "Espadas largas", "Estoques", "Espadas cortas"],
        tools: ["3 instrumentos musicales a elección"],
        savingThrows: ["Destreza", "Carisma"]
      },
      skills: {
        choose: 3,
        from: "Cualquier habilidad"
      },
      features: [
        "Lanzamiento de conjuros (CAR)",
        "Inspiración bárdica (nivel 1): d6, número de veces igual a CAR por descanso largo",
        "Multicompetente (nivel 2): Mitad de bonif. competencia en habilidades sin competencia",
        "Canción de descanso (nivel 2): Aliados recuperan 1d6 extra HP en descanso corto",
        "Colegio bárdico (nivel 3): Saber, Valor, Glamour"
      ],
      subclasses: {
        "Colegio del Saber": "Competencias bonus, Palabras cortantes, Secretos mágicos adicionales",
        "Colegio del Valor": "Competencias armas y armaduras medianas, Inspiración en combate, Ataque extra",
        "Colegio del Glamour": "Presencia cautivadora, Manto de inspiración, Performance fascinante"
      },
      spellcasting: {
        ability: "Carisma",
        cantrips: 2,
        knownSpells: "Tabla de bardo",
        ritual: false
      },
      equipment: [
        "Estoque O Espada larga O Arma simple",
        "Pack de diplomático O Pack de artista",
        "Laúd O Cualquier otro instrumento musical",
        "Armadura de cuero + Daga"
      ]
    },
    
    "Druida": {
      hitDie: 8,
      primaryAbility: ["Sabiduría"],
      proficiencies: {
        armor: ["Armaduras ligeras (no metal)", "Armaduras medianas (no metal)", "Escudos (no metal)"],
        weapons: ["Clavas", "Dagas", "Dardos", "Jabalinas", "Mazas", "Bastones", "Cimitarras", "Hondas", "Lanzas"],
        tools: ["Kit de herbolario"],
        savingThrows: ["Inteligencia", "Sabiduría"]
      },
      skills: {
        choose: 2,
        from: ["Arcanos", "Trato con animales", "Perspicacia", "Medicina", "Naturaleza", "Percepción", "Religión", "Supervivencia"]
      },
      features: [
        "Druídico (nivel 1): Idioma secreto",
        "Lanzamiento de conjuros (nivel 1, SAB)",
        "Forma salvaje (nivel 2): 2 usos/descanso corto, transforma en bestia (CR basado en nivel)",
        "Círculo druídico (nivel 2): Tierra, Luna, Esporas"
      ],
      subclasses: {
        "Círculo de la Tierra": "Recuperación natural, Conjuros de círculo, Paso de la tierra",
        "Círculo de la Luna": "Forma salvaje de combate, Formas circulares, Golpe primario",
        "Círculo de las Esporas": "Halo de esporas, Cuerpo simbiótico, Propagación de esporas"
      },
      spellcasting: {
        ability: "Sabiduría",
        cantrips: 2,
        preparedSpells: "SAB + nivel",
        ritual: true
      },
      equipment: [
        "Escudo de madera O Arma simple",
        "Cimitarra O Arma simple cuerpo a cuerpo",
        "Armadura de cuero + Pack de explorador + Foco druídico"
      ]
    },
    
    "Monje": {
      hitDie: 8,
      primaryAbility: ["Destreza", "Sabiduría"],
      proficiencies: {
        armor: [],
        weapons: ["Armas simples", "Espadas cortas"],
        tools: ["1 tipo de herramienta de artesano o instrumento musical"],
        savingThrows: ["Fuerza", "Destreza"]
      },
      skills: {
        choose: 2,
        from: ["Acrobacias", "Atletismo", "Historia", "Perspicacia", "Religión", "Sigilo"]
      },
      features: [
        "Defensa sin armadura (nivel 1): CA = 10 + DES + SAB (sin armadura ni escudo)",
        "Artes marciales (nivel 1): 1d4 daño desarmado/armas monje, DES para ataques, ataque desarmado como bonus",
        "Ki (nivel 2): 2 puntos. Ráfaga de golpes, Defensa paciente, Paso del viento",
        "Movimiento sin armadura (nivel 2): +10 ft velocidad",
        "Deflectar proyectiles (nivel 3): Reacción, reduce daño 1d10 + DES + nivel",
        "Tradición monástica (nivel 3): Mano abierta, Sombra, Cuatro elementos"
      ],
      subclasses: {
        "Camino de la Mano abierta": "Técnica de la mano abierta, Tranquilidad total, Vibración sofocante",
        "Camino de la Sombra": "Artes de las sombras, Paso de sombra, Manto de sombras",
        "Camino de los Cuatro elementos": "Discípulo de los elementos, Disciplinas elementales"
      },
      equipment: [
        "Espada corta O Arma simple",
        "Pack de mazmorreo O Pack de explorador",
        "10 dardos"
      ],
      spellcasting: false
    },
    
    "Hechicero": {
      hitDie: 6,
      primaryAbility: ["Carisma"],
      proficiencies: {
        armor: [],
        weapons: ["Dagas", "Dardos", "Hondas", "Bastones", "Ballestas ligeras"],
        tools: [],
        savingThrows: ["Constitución", "Carisma"]
      },
      skills: {
        choose: 2,
        from: ["Arcanos", "Engaño", "Perspicacia", "Intimidación", "Persuasión", "Religión"]
      },
      features: [
        "Lanzamiento de conjuros (CAR)",
        "Origen de hechicería (nivel 1): Alma dracónica, Magia salvaje, Magia de las sombras",
        "Fuente de magia (nivel 2): Puntos de hechicería = nivel",
        "Metamagia (nivel 3): 2 opciones - Conjuro acelerado, cuidadoso, distante, potenciado, prolongado, sutil, mellizo"
      ],
      subclasses: {
        "Alma dracónica": "Ancestro de dragón, Resistencia dracónica, Afinidad elemental",
        "Magia salvaje": "Oleada de magia salvaje, Mareas del caos, Suerte controlada",
        "Magia de las sombras": "Fuerza de la tumba, Sabueso de maldad, Caminar en las sombras"
      },
      spellcasting: {
        ability: "Carisma",
        cantrips: 4,
        knownSpells: "Tabla de hechicero"
      },
      equipment: [
        "Ballesta ligera + 20 virotes O Arma simple",
        "Bolsa de componentes O Foco arcano",
        "Pack de mazmorreo O Pack de explorador",
        "2 dagas"
      ]
    },
    
    "Brujo": {
      hitDie: 8,
      primaryAbility: ["Carisma"],
      proficiencies: {
        armor: ["Armaduras ligeras"],
        weapons: ["Armas simples"],
        tools: [],
        savingThrows: ["Sabiduría", "Carisma"]
      },
      skills: {
        choose: 2,
        from: ["Arcanos", "Engaño", "Historia", "Intimidación", "Investigación", "Naturaleza", "Religión"]
      },
      features: [
        "Patrón de otro mundo (nivel 1): Arcano, Celestial, Demonio, Gran Antiguo",
        "Magia de pacto (nivel 1): Espacios de conjuro se recuperan en descanso corto",
        "Invocaciones sobrenaturales (nivel 2): 2 opciones, más con niveles",
        "Don del pacto (nivel 3): Pacto de la cadena, Hoja, Tomo"
      ],
      subclasses: {
        "El Arcano": "Lista de conjuros expandida (mago), Iniciado arcano",
        "El Demonio": "Bendición del Oscuro, Suerte del Oscuro, Resistencia del Demonio",
        "El Gran Antiguo": "Mente despierta, Pensamientos entrópicos, Crear esclavo"
      },
      spellcasting: {
        ability: "Carisma",
        cantrips: 2,
        knownSpells: "Tabla de brujo",
        pactMagic: "Espacios se recuperan en descanso corto"
      },
      equipment: [
        "Ballesta ligera + 20 virotes O Arma simple",
        "Bolsa de componentes O Foco arcano",
        "Pack de erudito O Pack de mazmorreo",
        "Armadura de cuero + Arma simple + 2 dagas"
      ]
    }
  },
  
  backgrounds: {
    "Noble": {
      skills: ["Historia", "Persuasión"],
      languages: 1,
      equipment: ["Ropas finas", "Anillo de sello", "Pergamino de linaje", "Bolsa con 25 po"],
      feature: "Posición de privilegio",
      featureDescription: "Eres bienvenido en alta sociedad, la gente asume que tienes derecho a estar donde estás. Puedes asegurar audiencia con nobles locales."
    },
    
    "Criminal": {
      skills: ["Engaño", "Sigilo"],
      tools: ["Herramientas de ladrón", "1 tipo de juego"],
      equipment: ["Palanca", "Ropas oscuras con capucha", "Bolsa con 15 po"],
      feature: "Contacto criminal",
      featureDescription: "Tienes un contacto confiable que actúa como enlace con una red de otros criminales. Puedes enviar y recibir mensajes a través de esta red."
    },
    
    "Erudito": {
      skills: ["Arcanos", "Historia"],
      languages: 2,
      equipment: ["Tinta y pluma", "Cuchillo pequeño", "Carta de colega muerto", "Ropas de estudiante", "Bolsa con 10 po"],
      feature: "Investigador",
      featureDescription: "Cuando intentas aprender algo, sabes dónde y de quién obtener información. Normalmente de bibliotecas, archivos, universidades o sabios."
    },
    
    "Soldado": {
      skills: ["Atletismo", "Intimidación"],
      tools: ["1 tipo de juego", "Vehículos (tierra)"],
      equipment: ["Insignia de rango", "Trofeo de enemigo caído", "Juego de dados", "Ropas comunes", "Bolsa con 10 po"],
      feature: "Rango militar",
      featureDescription: "Tienes un rango militar de tu carrera como soldado. Los soldados leales a tu antigua organización aún reconocen tu autoridad."
    },
    
    "Acólito": {
      skills: ["Perspicacia", "Religión"],
      languages: 2,
      equipment: ["Símbolo sagrado", "Libro de plegarias", "5 varitas de incienso", "Vestimentas", "Ropas comunes", "Bolsa con 15 po"],
      feature: "Refugio de los fieles",
      featureDescription: "Tú y tus compañeros podéis recibir curación y cuidados gratuitos en templos de tu fe. Quienes comparten tu religión te apoyarán."
    },
    
    "Artista": {
      skills: ["Acrobacias", "Interpretación"],
      tools: ["Kit de disfraz", "1 instrumento musical"],
      equipment: ["Instrumento musical", "Regalo de admirador", "Disfraz", "Bolsa con 15 po"],
      feature: "A petición del público",
      featureDescription: "Puedes actuar en posadas, tabernas, circos, etc. y recibir alojamiento y comida modestos gratis. Tu actuación te hace localmente famoso."
    },
    
    "Charlatán": {
      skills: ["Engaño", "Juego de manos"],
      tools: ["Kit de disfraz", "Kit de falsificación"],
      equipment: ["Ropas finas", "Kit de disfraz", "Herramientas de estafador", "Bolsa con 15 po"],
      feature: "Identidad falsa",
      featureDescription: "Has creado una segunda identidad con documentación, contactos y disfraces. Puedes falsificar documentos oficiales."
    },
    
    "Ermitaño": {
      skills: ["Medicina", "Religión"],
      tools: ["Kit de herbolario"],
      languages: 1,
      equipment: ["Estuche de pergaminos lleno de notas", "Manta de invierno", "Ropas comunes", "Kit de herbolario", "5 po"],
      feature: "Descubrimiento",
      featureDescription: "El aislamiento te dio acceso a un descubrimiento único y poderoso (naturaleza determinada con DM)."
    },
    
    "Héroe popular": {
      skills: ["Trato con animales", "Supervivencia"],
      tools: ["Herramientas de artesano", "Vehículos (tierra)"],
      equipment: ["Herramientas de artesano", "Pala", "Olla de hierro", "Ropas comunes", "Bolsa con 10 po"],
      feature: "Hospitalidad rústica",
      featureDescription: "La gente común te da alojamiento y comida. Te esconden de la ley o cualquiera que te busque (excepto si es obvio que eres peligroso)."
    },
    
    "Marinero": {
      skills: ["Atletismo", "Percepción"],
      tools: ["Herramientas de navegante", "Vehículos (agua)"],
      equipment: ["Garfio de abordaje", "50 ft de cuerda de seda", "Amuleto de la suerte", "Ropas comunes", "Bolsa con 10 po"],
      feature: "Paso de barco",
      featureDescription: "Puedes asegurar paso gratis en velero para ti y compañeros. Viajas en las condiciones comparables a las de la tripulación."
    },
    
    "Forastero": {
      skills: ["Atletismo", "Supervivencia"],
      tools: ["1 instrumento musical"],
      languages: 1,
      equipment: ["Bastón", "Trampa de caza", "Trofeo de animal", "Ropas de viajero", "Bolsa con 10 po"],
      feature: "Vagabundo",
      featureDescription: "Excelente memoria para mapas y geografía. Siempre puedes recordar el diseño de terreno, asentamientos y características alrededor."
    },
    
    "Sabio": {
      skills: ["Arcanos", "Historia"],
      languages: 2,
      equipment: ["Tinta y pluma", "Cuchillo pequeño", "Carta con pregunta sin responder", "Ropas comunes", "Bolsa con 10 po"],
      feature: "Investigador",
      featureDescription: "Sabes cómo y dónde encontrar información. Puedes acceder a bibliotecas, archivos, universidades o sabios dispuestos a compartir conocimiento."
    },
    
    "Huérfano": {
      skills: ["Sigilo", "Juego de manos"],
      tools: ["Kit de disfraz", "Herramientas de ladrón"],
      equipment: ["Cuchillo pequeño", "Mapa de ciudad natal", "Ratón mascota", "Baratija de padres", "Ropas comunes", "Bolsa con 10 po"],
      feature: "Secretos de la ciudad",
      featureDescription: "Conoces los patrones secretos de calles y puedes encontrar pasajes que otros pasarían por alto. Cuando no estás en combate, tú y compañeros viajan el doble."
    }
  },
  
  alignments: [
    "Legal Bueno (LB)", "Neutral Bueno (NB)", "Caótico Bueno (CB)",
    "Legal Neutral (LN)", "Neutral (N)", "Caótico Neutral (CN)",
    "Legal Malvado (LM)", "Neutral Malvado (NM)", "Caótico Malvado (CM)"
  ],
  
  skills: [
    { name: "Acrobacias", ability: "DES" },
    { name: "Trato con animales", ability: "SAB" },
    { name: "Arcanos", ability: "INT" },
    { name: "Atletismo", ability: "FUE" },
    { name: "Engaño", ability: "CAR" },
    { name: "Historia", ability: "INT" },
    { name: "Perspicacia", ability: "SAB" },
    { name: "Intimidación", ability: "CAR" },
    { name: "Investigación", ability: "INT" },
    { name: "Medicina", ability: "SAB" },
    { name: "Naturaleza", ability: "INT" },
    { name: "Percepción", ability: "SAB" },
    { name: "Interpretación", ability: "CAR" },
    { name: "Persuasión", ability: "CAR" },
    { name: "Religión", ability: "INT" },
    { name: "Juego de manos", ability: "DES" },
    { name: "Sigilo", ability: "DES" },
    { name: "Supervivencia", ability: "SAB" }
  ]
};

// Exportar para uso
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DND_DATA;
}
