/**
 * ═══════════════════════════════════════════════════════════════════
 * 🌌 MULTIVERSE DATA ENGINE
 * Soporte para: MTG, Elden Ring, Stranger Things, LOTR
 * ═══════════════════════════════════════════════════════════════════
 */

const MULTIVERSE_DATA = {
    'MTG': {
        name: "Magic: The Gathering (Ravnica/Dominaria)",
        races: ['Vampiro de Zendikar', 'Tritón', 'Leonino', 'Vedalken', 'Loxodon'],
        classes: ['Planeswalker', 'Mago de Gremio', 'Artífice', 'Chamán'],
        bonus: "Color Pie: Obtienes resistencia basada en tu color de maná.",
        backgrounds: ['Agente Dimir', 'Soldado Boros', 'Científico Izzet']
    },
    'EldenRing': {
        name: "Las Tierras Intermedias (Elden Ring)",
        races: ['Sinluz (Tarnished)', 'Numen', 'Augurio', 'Albináurico'],
        classes: ['Confesor', 'Samurái', 'Prisionero', 'Astrólogo'],
        bonus: "Gracia Perdida: Puedes revivir 1 vez por día con 1 HP.",
        backgrounds: ['Dedo Sangriento', 'Caballero del Crisol', 'Recusante']
    },
    'StrangerThings': {
        name: "Hawkins / Upside Down",
        races: ['Humano (80s)', 'Sujeto de Prueba', 'Desollado'],
        classes: ['Psíquico', 'Investigador', 'Sheriff', 'Club Hellfire'],
        bonus: "Mundo del Revés: Ventaja en tiradas contra miedo y aberraciones.",
        backgrounds: ['Estudiante', 'Científico de Laboratorio', 'Punk']
    },
    'LOTR': {
        name: "Tierra Media",
        races: ['Hobbit', 'Elfo Sindar', 'Uruk-hai', 'Hombre de Numenor'],
        classes: ['Montaraz', 'Guardia de la Ciudadela', 'Jinete de Rohan'],
        bonus: "Luz de Eärendil: +2 a Sabiduría y resistencia a la corrupción.",
        backgrounds: ['Portador del Anillo', 'Jardinero', 'Exiliado']
    }
};
