// ==========================================
// 🎲 D&D 5E - DATOS COMPLETOS CON PROGRESIÓN
// Sistema de habilidades desbloqueables por nivel
// ==========================================

const DND_DATA = {
  version: "5e",
  
  // ===== RAZAS =====
  races: {
    "Humano": {
      speed: 30,
      traits: [
        "Versátil: +1 a todas las características",
        "Idioma adicional de tu elección",
        "Dote adicional en nivel 1"
      ]
    },
    "Elfo": {
      speed: 30,
      traits: [
        "Visión en la oscuridad (60 ft)",
        "Ventaja contra encantamiento",
        "Inmune a sueño mágico",
        "Percepción competente"
      ],
      subraces: {
        "Alto": {
          traits: [
            "+2 Destreza, +1 Inteligencia",
            "Truco de mago a elección",
            "Armas élficas competente"
          ]
        },
        "Bosque": {
          traits: [
            "+2 Destreza, +1 Sabiduría",
            "Velocidad 35 ft",
            "Puedes esconderte en follaje ligero"
          ]
        }
      }
    },
    "Enano": {
      speed: 25,
      traits: [
        "Visión en la oscuridad (60 ft)",
        "Ventaja contra veneno",
        "Competente con herramientas de artesano",
        "Conocimiento de piedra"
      ],
      subraces: {
        "Montaña": {
          traits: [
            "+2 Constitución, +2 Fuerza",
            "Competente con armaduras ligeras y medias"
          ]
        },
        "Colina": {
          traits: [
            "+2 Constitución, +1 Sabiduría",
            "+1 HP por nivel"
          ]
        }
      }
    },
    "Mediano": {
      speed: 25,
      traits: [
        "+2 Destreza",
        "Afortunado: repite 1s en dados",
        "Valiente: ventaja contra miedo",
        "Agilidad mediana: atraviesar criaturas grandes"
      ]
    },
    "Orco": {
      speed: 30,
      traits: [
        "+2 Fuerza, +1 Constitución",
        "Visión en la oscuridad (60 ft)",
        "Agresivo: bonus action para moverse",
        "Amenazador: competente en Intimidación"
      ]
    },
    "Tiefling": {
      speed: 30,
      traits: [
        "+2 Carisma, +1 Inteligencia",
        "Visión en la oscuridad (60 ft)",
        "Resistencia infernal: resistencia a fuego",
        "Legado infernal: magia innata (Taumaturgia, Reprender infernal, Oscuridad)"
      ]
    },
    "Dracónido": {
      speed: 30,
      traits: [
        "+2 Fuerza, +1 Carisma",
        "Ancestro dracónico: resistencia elemental",
        "Arma de aliento (1 uso, recarga descanso corto)",
        "Daño del aliento: 2d6 (mejora por nivel)"
      ]
    },
    "Gnomo": {
      speed: 25,
      traits: [
        "+2 Inteligencia",
        "Visión en la oscuridad (60 ft)",
        "Astucia gnómica: ventaja vs magia INT/SAB/CAR",
        "Pequeño pero valiente"
      ]
    },
    "Semielfo": {
      speed: 30,
      traits: [
        "+2 Carisma, +1 a otras dos características",
        "Visión en la oscuridad (60 ft)",
        "Ventaja contra encantamiento",
        "Dos habilidades adicionales competentes"
      ]
    },
    "Semiorco": {
      speed: 30,
      traits: [
        "+2 Fuerza, +1 Constitución",
        "Visión en la oscuridad (60 ft)",
        "Amenazador: competente en Intimidación",
        "Resistencia implacable: quedar con 1 HP en vez de 0 (1/día)"
      ]
    }
  },

  // ===== CLASES CON PROGRESIÓN =====
  classes: {
    "Guerrero": {
      hitDie: 10,
      proficiencies: {
        armor: ["Todas las armaduras", "Escudos"],
        weapons: ["Armas simples", "Armas marciales"],
        savingThrows: ["Fuerza", "Constitución"],
        tools: []
      },
      skills: {
        choose: 2,
        from: ["Acrobacias", "Trato con animales", "Atletismo", "Historia", "Perspicacia", "Intimidación", "Percepción", "Supervivencia"]
      },
      equipment: [
        "Cota de mallas",
        "Espada larga y escudo",
        "Dos hachas de mano",
        "Ballesta ligera y 20 virotes",
        "Mochila de explorador"
      ],
      // 🆕 PROGRESIÓN POR NIVEL
      progression: {
        1: {
          features: [
            "Segundo aliento (recuperar 1d10 + nivel HP como acción bonus, 1/descanso corto)",
            "Estilo de lucha (elige uno: Defensa +1 AC, Duelista +2 daño, Gran arma, Lucha con dos armas, Protección, Arquería +2 ataque)"
          ]
        },
        2: {
          features: [
            "Oleada de acción (acción adicional, 1/descanso corto)",
            "2 usos de Segundo aliento"
          ]
        },
        3: {
          features: [
            "Arquetipo marcial (Campeón, Maestro de batalla, Caballero arcano)",
            "Mejora crítica (19-20) si Campeón"
          ]
        },
        4: {
          features: ["Mejora de característica (+2 total o dote)"]
        },
        5: {
          features: [
            "Ataque extra (2 ataques por acción)",
            "Competencia adicional"
          ]
        },
        6: {
          features: ["Mejora de característica"]
        },
        7: {
          features: ["Característica de arquetipo"]
        },
        9: {
          features: ["Indomable (repetir salvación fallida, 1/día)"]
        },
        10: {
          features: ["Característica de arquetipo"]
        },
        11: {
          features: ["Ataque extra (3 ataques)"]
        },
        15: {
          features: ["Característica de arquetipo"]
        },
        17: {
          features: ["Oleada de acción (2 usos)", "Indomable (2 usos)"]
        },
        18: {
          features: ["Característica de arquetipo"]
        },
        20: {
          features: ["Ataque extra (4 ataques)"]
        }
      }
    },

    "Mago": {
      hitDie: 6,
      proficiencies: {
        armor: [],
        weapons: ["Dagas", "Dardos", "Hondas", "Bastones", "Ballestas ligeras"],
        savingThrows: ["Inteligencia", "Sabiduría"],
        tools: []
      },
      skills: {
        choose: 2,
        from: ["Arcana", "Historia", "Perspicacia", "Investigación", "Medicina", "Religión"]
      },
      equipment: [
        "Bastón o daga",
        "Bolsa de componentes",
        "Libro de conjuros",
        "Mochila de erudito"
      ],
      progression: {
        1: {
          features: [
            "Lanzamiento de conjuros (Inteligencia)",
            "Libro de conjuros (6 conjuros nivel 1)",
            "Preparar INT mod + nivel conjuros",
            "Recuperación arcana (recuperar espacios de conjuro 1/día)"
          ],
          spellSlots: { 1: 2 },
          cantrips: 3
        },
        2: {
          features: ["Tradición arcana (Abjuración, Conjuración, Adivinación, Encantamiento, Evocación, Ilusión, Nigromancia, Transmutación)"],
          spellSlots: { 1: 3 }
        },
        3: {
          features: ["Conjuros de nivel 2"],
          spellSlots: { 1: 4, 2: 2 },
          cantrips: 3
        },
        4: {
          features: ["Mejora de característica"],
          spellSlots: { 1: 4, 2: 3 },
          cantrips: 4
        },
        5: {
          features: ["Conjuros de nivel 3"],
          spellSlots: { 1: 4, 2: 3, 3: 2 },
          cantrips: 4
        },
        6: {
          features: ["Característica de tradición arcana"],
          spellSlots: { 1: 4, 2: 3, 3: 3 },
          cantrips: 4
        },
        9: {
          features: ["Conjuros de nivel 5"],
          spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
          cantrips: 5
        },
        10: {
          features: ["Característica de tradición arcana"],
          spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
          cantrips: 5
        },
        11: {
          features: ["Conjuros de nivel 6"],
          spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
          cantrips: 5
        },
        13: {
          features: ["Conjuros de nivel 7"],
          spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
          cantrips: 5
        },
        17: {
          features: ["Conjuros de nivel 9", "Maestría de conjuros (2 conjuros nivel 1-2 a voluntad)"],
          spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
          cantrips: 5
        },
        18: {
          features: ["Maestría de hechizos (1 conjuro nivel 3 a voluntad)"],
          spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
          cantrips: 5
        },
        20: {
          features: ["Mejora de firma (2 conjuros nivel 3 sin gastar espacios)"],
          spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
          cantrips: 5
        }
      }
    },

    "Pícaro": {
      hitDie: 8,
      proficiencies: {
        armor: ["Armadura ligera"],
        weapons: ["Armas simples", "Ballestas de mano", "Espadas largas", "Estoques", "Espadas cortas"],
        savingThrows: ["Destreza", "Inteligencia"],
        tools: ["Herramientas de ladrón"]
      },
      skills: {
        choose: 4,
        from: ["Acrobacias", "Atletismo", "Engaño", "Perspicacia", "Intimidación", "Investigación", "Percepción", "Interpretación", "Persuasión", "Juego de manos", "Sigilo"]
      },
      equipment: [
        "Estoques",
        "Arco corto y carcaj con 20 flechas",
        "Herramientas de ladrón",
        "Armadura de cuero",
        "Dos dagas",
        "Mochila de asaltante"
      ],
      progression: {
        1: {
          features: [
            "Pericia (doble bonificador en 2 habilidades)",
            "Ataque furtivo (+1d6 daño extra con ventaja o aliado cerca)",
            "Argot de ladrones"
          ]
        },
        2: {
          features: ["Acción astuta (Bonus action: Dash, Disengage, Hide)"]
        },
        3: {
          features: [
            "Arquetipo de pícaro (Ladrón, Asesino, Embaucador arcano, Inquisidor)",
            "Ladrón: Manos rápidas, Pies ligeros",
            "Asesino: Asesinar (+2d6 vs sorprendido)"
          ]
        },
        5: {
          features: ["Esquiva asombrosa (ataque con ventaja contra ti no tiene ventaja)", "Ataque furtivo +3d6"]
        },
        7: {
          features: ["Evasión (salvación DES exitosa = 0 daño, fallida = mitad)"]
        },
        9: {
          features: ["Característica de arquetipo", "Ataque furtivo +5d6"]
        },
        11: {
          features: ["Talento confiable (habilidades competentes mínimo 10)", "Ataque furtivo +6d6"]
        },
        13: {
          features: ["Característica de arquetipo", "Ataque furtivo +7d6"]
        },
        15: {
          features: ["Mente resbaladiza (ventaja vs encantamiento)", "Ataque furtivo +8d6"]
        },
        17: {
          features: ["Característica de arquetipo", "Ataque furtivo +9d6"]
        },
        18: {
          features: ["Escurridizo (atacantes sin ventaja vs ti)"]
        },
        20: {
          features: ["Golpe de suerte (convertir fallo en éxito, 1/descanso corto)", "Ataque furtivo +10d6"]
        }
      }
    },

    "Clérigo": {
      hitDie: 8,
      proficiencies: {
        armor: ["Armadura ligera", "Armadura media", "Escudos"],
        weapons: ["Armas simples"],
        savingThrows: ["Sabiduría", "Carisma"],
        tools: []
      },
      skills: {
        choose: 2,
        from: ["Historia", "Perspicacia", "Medicina", "Persuasión", "Religión"]
      },
      equipment: [
        "Maza",
        "Cota de escamas o armadura de cuero",
        "Ballesta ligera y 20 virotes",
        "Símbolo sagrado",
        "Mochila de sacerdote"
      ],
      progression: {
        1: {
          features: [
            "Lanzamiento de conjuros divinos (Sabiduría)",
            "Dominio divino (Vida, Luz, Conocimiento, Naturaleza, Tempestad, Engaño, Guerra)",
            "Canalizar divinidad (1/descanso corto)"
          ],
          spellSlots: { 1: 2 },
          cantrips: 3
        },
        2: {
          features: [
            "Canalizar divinidad: Expulsar muertos (30 ft, SAB CD)",
            "Característica de dominio"
          ],
          spellSlots: { 1: 3 },
          cantrips: 3
        },
        5: {
          features: ["Destruir muertos (CR 1/2 o menos)"],
          spellSlots: { 1: 4, 2: 3, 3: 2 },
          cantrips: 3
        },
        8: {
          features: ["Destruir muertos (CR 1)", "Golpe divino (+1d8 radiante en arma)"],
          spellSlots: { 1: 4, 2: 3, 3: 3, 4: 2 },
          cantrips: 4
        },
        10: {
          features: ["Intervención divina (SAB% de éxito, ayuda directa de deidad)"],
          spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
          cantrips: 5
        },
        17: {
          features: ["Destruir muertos (CR 4)", "Característica de dominio"],
          spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
          cantrips: 5
        },
        20: {
          features: ["Intervención divina garantizada"],
          spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
          cantrips: 5
        }
      }
    },

    // 🆕 RESTO DE CLASES CON PROGRESIÓN (resumen)
    "Paladín": {
      hitDie: 10,
      proficiencies: {
        armor: ["Todas las armaduras", "Escudos"],
        weapons: ["Armas simples", "Armas marciales"],
        savingThrows: ["Sabiduría", "Carisma"],
        tools: []
      },
      skills: { choose: 2, from: ["Atletismo", "Perspicacia", "Intimidación", "Medicina", "Persuasión", "Religión"] },
      equipment: ["Armadura completa", "Espada larga", "Escudo", "5 jabalinas", "Símbolo sagrado"],
      features: ["Sentido divino", "Imposición de manos", "Juramento sagrado (nivel 3)", "Golpe divino", "Aura protectora"],
      progression: {
        1: { features: ["Sentido divino (detectar celestial/demonio/no-muerto 60 ft)", "Imposición de manos (curar nivel×5 HP/día)"] },
        2: { features: ["Estilo de lucha", "Lanzamiento de conjuros (Carisma)"], spellSlots: { 1: 2 } },
        3: { features: ["Juramento sagrado (Devoción, Antiguos, Venganza)", "Salud divina (inmune a enfermedad)"] },
        5: { features: ["Ataque extra"] },
        6: { features: ["Aura de protección (+CAR mod a salvaciones aliados 10 ft)"] },
        11: { features: ["Golpe divino mejorado (2d8 extra)"] },
        20: { features: ["Transformación sagrada (avatar divino)"] }
      }
    },

    "Bárbaro": {
      hitDie: 12,
      proficiencies: {
        armor: ["Armadura ligera", "Armadura media", "Escudos"],
        weapons: ["Armas simples", "Armas marciales"],
        savingThrows: ["Fuerza", "Constitución"],
        tools: []
      },
      skills: { choose: 2, from: ["Trato con animales", "Atletismo", "Intimidación", "Naturaleza", "Percepción", "Supervivencia"] },
      equipment: ["Hacha grande", "Dos hachas de mano", "4 jabalinas", "Mochila de explorador"],
      features: ["Furia", "Defensa sin armadura", "Ataque temerario", "Sentido del peligro"],
      progression: {
        1: { features: ["Furia (2/día, +2 daño, ventaja FUE, resistencia físico)", "Defensa sin armadura (AC = 10 + DES + CON)"] },
        2: { features: ["Ataque temerario (ventaja en ataque, enemigos ventaja vs ti)", "Sentido del peligro (ventaja vs trampas)"] },
        3: { features: ["Senda primaria (Berserker, Tótem, Ancestral)"] },
        5: { features: ["Ataque extra", "Movimiento rápido (+10 ft sin armadura pesada)"] },
        9: { features: ["Crítico brutal (+1 dado de arma en crítico)"] },
        11: { features: ["Furia implacable (si furia cae a 0 HP, quedar con 1 HP una vez)"] },
        20: { features: ["Campeón primitivo (FUE y CON +4, máximo 24)"] }
      }
    },

    "Druida": {
      hitDie: 8,
      proficiencies: {
        armor: ["Armadura ligera (no metal)", "Armadura media (no metal)", "Escudos (no metal)"],
        weapons: ["Garrotes", "Dagas", "Dardos", "Jabalinas", "Mazas", "Bastones", "Cimitarras", "Hoces", "Hondas", "Lanzas"],
        savingThrows: ["Inteligencia", "Sabiduría"],
        tools: ["Kit de herbolario"]
      },
      skills: { choose: 2, from: ["Arcana", "Trato con animales", "Perspicacia", "Medicina", "Naturaleza", "Percepción", "Religión", "Supervivencia"] },
      equipment: ["Escudo de madera", "Cimitarra", "Armadura de cuero", "Mochila de explorador", "Foco druídico"],
      features: ["Druídico (lenguaje secreto)", "Lanzamiento de conjuros"],
      progression: {
        1: { features: ["Druídico", "Lanzamiento de conjuros (Sabiduría)"], spellSlots: { 1: 2 }, cantrips: 2 },
        2: { features: ["Forma salvaje (2/descanso corto, CR 1/4)", "Círculo druídico (Luna, Tierra, Sueños)"] },
        4: { features: ["Forma salvaje (CR 1/2, nadar)"] },
        8: { features: ["Forma salvaje (CR 1, volar)"] },
        18: { features: ["Cuerpo atemporal (1 año = 10 años)", "Conjuros bestia"] },
        20: { features: ["Archidruida (Forma salvaje ilimitada)"] }
      }
    },

    "Bardo": {
      hitDie: 8,
      proficiencies: {
        armor: ["Armadura ligera"],
        weapons: ["Armas simples", "Ballestas de mano", "Espadas largas", "Estoques", "Espadas cortas"],
        savingThrows: ["Destreza", "Carisma"],
        tools: ["Tres instrumentos musicales"]
      },
      skills: { choose: 3, from: ["Todas"] },
      equipment: ["Estoques", "Mochila de diplomático", "Laúd", "Armadura de cuero", "Daga"],
      features: ["Lanzamiento de conjuros", "Inspiración bárdica"],
      progression: {
        1: { features: ["Lanzamiento de conjuros (Carisma)", "Inspiración bárdica (d6, CAR mod veces/día)"], spellSlots: { 1: 2 }, cantrips: 2 },
        2: { features: ["Canción de descanso (aliados recuperan +d6 HP en descanso corto)", "Aprendiz de todo (+1/2 bonus competencia sin competencia)"] },
        3: { features: ["Colegio de bardos (Tradición, Valor, Glamour)", "Pericia (2 habilidades doble bonus)"] },
        5: { features: ["Inspiración bárdica (d8)", "Fuente de inspiración (descanso corto)"] },
        6: { features: ["Contrahechizo (reacción, gastar inspiración para interrumpir conjuro)"] },
        10: { features: ["Inspiración bárdica (d10)", "Secretos mágicos (2 conjuros de cualquier clase)"] },
        20: { features: ["Inspiración superior (d12, regenera si tiene 0)"] }
      }
    },

    "Monje": {
      hitDie: 8,
      proficiencies: {
        armor: [],
        weapons: ["Armas simples", "Espadas cortas"],
        savingThrows: ["Fuerza", "Destreza"],
        tools: ["Herramienta de artesano o instrumento musical"]
      },
      skills: { choose: 2, from: ["Acrobacias", "Atletismo", "Historia", "Perspicacia", "Religión", "Sigilo"] },
      equipment: ["Espada corta", "10 dardos", "Mochila de explorador"],
      features: ["Defensa sin armadura", "Artes marciales", "Ki"],
      progression: {
        1: { features: ["Defensa sin armadura (AC = 10 + DES + SAB)", "Artes marciales (d4 desarmado)"] },
        2: { features: ["Ki (2 puntos, recupera en descanso corto)", "Ráfaga de golpes", "Defensa paciente", "Paso del viento", "Movimiento sin armadura (+10 ft)"] },
        3: { features: ["Tradición monástica (Mano abierta, Sombra, Elementos, Kensei)"] },
        5: { features: ["Ataque extra", "Golpe aturdidor (gastar 1 Ki, CON CD o aturdido)"] },
        6: { features: ["Golpes potenciados con Ki (superan resistencia)"] },
        7: { features: ["Evasión", "Quietud mental (bonus action fin encanto/miedo)"] },
        9: { features: ["Mejora de movimiento sin armadura (+15 ft total)"] },
        10: { features: ["Pureza de cuerpo (inmune a enfermedad y veneno)"] },
        14: { features: ["Alma de diamante (competente en todas las salvaciones)"] },
        18: { features: ["Cuerpo vacío (invisible, resistencia vs todos excepto fuerza)"] },
        20: { features: ["Autoperfección (inicio turno sin Ki = 4 Ki)"] }
      }
    },

    "Explorador": {
      hitDie: 10,
      proficiencies: {
        armor: ["Armadura ligera", "Armadura media", "Escudos"],
        weapons: ["Armas simples", "Armas marciales"],
        savingThrows: ["Fuerza", "Destreza"],
        tools: []
      },
      skills: { choose: 3, from: ["Trato con animales", "Atletismo", "Perspicacia", "Investigación", "Naturaleza", "Percepción", "Sigilo", "Supervivencia"] },
      equipment: ["Cota de escamas", "Dos espadas cortas", "Arco largo y 20 flechas", "Mochila de explorador"],
      features: ["Enemigo predilecto", "Explorador nato"],
      progression: {
        1: { features: ["Enemigo predilecto (+2 daño, ventaja seguir)", "Explorador nato (terreno favorito, ventaja supervivencia)"] },
        2: { features: ["Estilo de lucha", "Lanzamiento de conjuros (Sabiduría)"], spellSlots: { 1: 2 } },
        3: { features: ["Arquetipo (Cazador, Maestro bestias, Acechador sombrío)"] },
        5: { features: ["Ataque extra"] },
        8: { features: ["Paso firme (terreno difícil no cuesta extra)", "Caminar sobre tierra"] },
        10: { features: ["Ocultarse a plena vista (bonus action esconderse si no te mueves)"] },
        14: { features: ["Desvanecerse (bonus action invisible hasta atacar)"] },
        20: { features: ["Asesino de enemigos (1 ataque automático crítico vs enemigo predilecto/día)"] }
      }
    },

    "Hechicero": {
      hitDie: 6,
      proficiencies: {
        armor: [],
        weapons: ["Dagas", "Dardos", "Hondas", "Bastones", "Ballestas ligeras"],
        savingThrows: ["Constitución", "Carisma"],
        tools: []
      },
      skills: { choose: 2, from: ["Arcana", "Engaño", "Perspicacia", "Intimidación", "Persuasión", "Religión"] },
      equipment: ["Ballesta ligera y 20 virotes", "Bolsa de componentes", "Daga", "Mochila de explorador"],
      features: ["Lanzamiento de conjuros", "Origen hechicero"],
      progression: {
        1: { features: ["Lanzamiento de conjuros (Carisma)", "Origen hechicero (Dracónico, Magia salvaje, Divino, Sombra)"], spellSlots: { 1: 2 }, cantrips: 4 },
        2: { features: ["Fuente de magia (Puntos hechicería = nivel)", "Metamagia (2 opciones: Gemelo, Potenciado, Acelerado, Sutil, etc)"] },
        3: { features: ["Metamagia mejora"], spellSlots: { 1: 4, 2: 2 } },
        6: { features: ["Característica de origen"] },
        17: { features: ["Metamagia (3 opciones)"] },
        20: { features: ["Restauración hechicera (recuperar 4 puntos si 0 en turno)"] }
      }
    },

    "Brujo": {
      hitDie: 8,
      proficiencies: {
        armor: ["Armadura ligera"],
        weapons: ["Armas simples"],
        savingThrows: ["Sabiduría", "Carisma"],
        tools: []
      },
      skills: { choose: 2, from: ["Arcana", "Engaño", "Historia", "Intimidación", "Investigación", "Naturaleza", "Religión"] },
      equipment: ["Ballesta ligera y 20 virotes", "Bolsa de componentes", "Armadura de cuero", "Daga", "Mochila de erudito"],
      features: ["Pacto de otro mundo", "Lanzamiento de conjuros"],
      progression: {
        1: { features: ["Pacto de otro mundo (Archifey, Demonio, Gran Antiguo, Celestial, Hexblade)", "Lanzamiento de conjuros (Carisma, espacios recuperan descanso corto)"], spellSlots: { 1: 1 }, cantrips: 2 },
        2: { features: ["Invocaciones arcanas (2 opciones)"], spellSlots: { 1: 2 } },
        3: { features: ["Dádiva del pacto (Tomo, Hoja, Cadena)"], spellSlots: { 2: 2 } },
        11: { features: ["Arcanum místico (1 conjuro nivel 6 gratis/día)"] },
        17: { features: ["Arcanum místico mejorado (nivel 7-9)"] },
        20: { features: ["Maestro arcano (recuperar 1 espacio con acción)"] }
      }
    }
  },

  // ===== TRASFONDOS =====
  backgrounds: {
    "Acólito": {
      skills: ["Perspicacia", "Religión"],
      feature: "Refugio de los fieles: Apoyo de templos de tu fe",
      equipment: ["Símbolo sagrado", "Libro de plegarias", "5 varitas de incienso", "Ropa de ceremonia", "15 po"]
    },
    "Criminal": {
      skills: ["Engaño", "Sigilo"],
      feature: "Contacto criminal: Conexión con red de criminales",
      equipment: ["Palanca", "Ropa oscura con capucha", "15 po"]
    },
    "Héroe popular": {
      skills: ["Trato con animales", "Supervivencia"],
      feature: "Hospitalidad rústica: Refugio gratis entre gente común",
      equipment: ["Herramientas de artesano", "Pala", "Olla de hierro", "10 po"]
    },
    "Noble": {
      skills: ["Historia", "Persuasión"],
      feature: "Posición de privilegio: Acceso a alta sociedad",
      equipment: ["Ropa fina", "Anillo con sello", "Pergamino de linaje", "25 po"]
    },
    "Sabio": {
      skills: ["Arcana", "Historia"],
      feature: "Investigador: Sabes dónde encontrar información",
      equipment: ["Tinta y pluma", "Carta de mentor", "Ropa común", "10 po"]
    },
    "Soldado": {
      skills: ["Atletismo", "Intimidación"],
      feature: "Rango militar: Autoridad sobre soldados de tu ejército",
      equipment: ["Insignia de rango", "Trofeo de guerra", "Dados", "10 po"]
    }
  },

  // ===== ALINEAMIENTOS =====
  alignments: [
    "Legal bueno",
    "Neutral bueno",
    "Caótico bueno",
    "Legal neutral",
    "Neutral",
    "Caótico neutral",
    "Legal malvado",
    "Neutral malvado",
    "Caótico malvado"
  ]
};

// Exportar globalmente
window.DND_DATA = DND_DATA;
