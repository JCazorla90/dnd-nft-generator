# Blueprint de Integración: DnD NFT Generator + DnD Character Forge

## Inventario funcional (estado actual)
- **Frontend Vite/React**: generador de personajes con flujo aleatorio/manual, vista de ficha, descarga y botón de minteo.
- **Backend Node/Express**: generación de personaje, renderizado de imagen (capas/IA), subida de IPFS y orquestación de mint ERC-721.
- **Smart contract ERC-721**: custodio de metadatos e imagen con URI en IPFS.
- **Infra**: docker-compose, scripts npm (front/back), sin CI documentada.

## Información pendiente de `DnD-Character-Forge`
- README y código no accesibles por restricciones de red (`curl` falló con `CONNECT tunnel failed, response 403`).
- Necesario validar su stack (¿React? ¿Node? ¿CLI?) y sus módulos clave (generación, validación de reglas, exportaciones) cuando se disponga de acceso.

## Modelo de datos unificado (propuesto)
```json
{
  "id": "uuid",
  "name": "Arannis",
  "race": "Elf",
  "class": "Rogue",
  "background": "Charlatan",
  "alignment": "CG",
  "level": 1,
  "abilities": { "str": 10, "dex": 16, "con": 12, "int": 13, "wis": 11, "cha": 15 },
  "skills": [{ "name": "Stealth", "proficient": true, "bonus": "+5" }],
  "hp": 9,
  "ac": 14,
  "initiative": 3,
  "equipment": ["Rapier", "Dagger", "Leather Armor"],
  "traits": ["Darkvision", "Cunning Action"],
  "image": { "url": "ipfs://...", "prompt": "" },
  "nft": { "tokenId": null, "contract": "0x...", "network": "sepolia" },
  "metadataUri": "ipfs://...",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```
- **Compatibilidad**: mantener campos comunes (atributos, HP/AC, equipo) para mapear fácilmente lo que aporte `DnD-Character-Forge` (ej. validaciones o cálculo de habilidades).
- **Extensibilidad**: permitir anexar módulos de reglas (proficiencias, spell slots, rasgos de trasfondo) como secciones opcionales.

## API estandarizada (borrador)
- `POST /api/characters/generate` → genera un personaje (modo aleatorio/manual) y devuelve el JSON anterior.
- `POST /api/characters/:id/image` → genera/renderiza imagen y guarda `image.url`.
- `POST /api/characters/:id/mint` → sube metadatos a IPFS y acuña NFT (requiere auth mínima o clave de servicio).
- `GET /api/characters/:id` → recupera personaje.
- `GET /api/characters` → lista personajes (filtros por clase/raza/nivel/red). 
- **Módulos portables**: cada endpoint delega en servicios que se puedan importar desde `DnD-Character-Forge` (p. ej., generador de stats o validador de reglas).

## Flujo de UI unificado
1. **Wizard**: paso a paso (Raza → Clase → Trasfondo → Stats → Equipo → Imagen → Resumen).
2. **Vista de ficha**: panel con bloques colapsables; botón de descarga y de mint.
3. **Sincronización**: guardar borradores en localStorage; si hay backend, sincronizar por API.
4. **Modo offline**: permitir generación básica sin backend y activar endpoints de mint solo cuando haya red.

## Roadmap inmediato
- Documentar el README de `DnD-Character-Forge` cuando sea accesible y rellenar matriz de funcionalidades.
- Crear adaptadores en backend para cargar generadores/validadores externos como plugins.
- Definir tipos compartidos (`/frontend/src/types/character.ts` y `/backend/src/types/character.d.ts`) basados en el modelo anterior.
- Unificar los endpoints Express existentes al contrato de API arriba indicado.
- Ajustar componentes React a un flujo de wizard reutilizando el modelo unificado.

## Métricas y calidad
- Lint y tests unitarios front/back en CI.
- Tests de contrato (ERC-721) con mocks de IPFS.
- Smoke E2E: generar → renderizar imagen → mintear en testnet.
