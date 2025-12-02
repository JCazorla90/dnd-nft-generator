# Plan de fusión: DnD NFT Generator + DnD Character Forge

## Objetivo
Crear una experiencia única para generar, personalizar y mintear personajes de Dungeons & Dragons, combinando el generador NFT existente con las capacidades del proyecto "DnD-Character-Forge".

## Estado actual de `dnd-nft-generator`
- Generación automática y manual de fichas de personaje al estilo D&D, incluyendo cálculo de HP, AC e iniciativa.
- Personalización completa de raza, clase, trasfondo y alineamiento, con descarga y compartición de la ficha.
- Creación de imágenes (IA o capas) y minteo de NFTs ERC-721 con subida a IPFS.
- Frontend en React/Vite, backend en Node.js/Express y smart contract ERC-721 para custodiar metadatos e imagen.

## Información pendiente de `DnD-Character-Forge`
No se ha podido leer el código ni el README del repositorio `DnD-Character-Forge` debido a restricciones de red en este entorno. En el intento más reciente, la descarga del README falló con `CONNECT tunnel failed, response 403`. Es necesario revisar su documentación y estructura cuando se disponga de acceso para mapear funcionalidades solapadas o complementarias.

## Propuesta de fusión técnica
1. **Catálogo de funcionalidades**: documentar las características clave de ambos proyectos (generación de personajes, personalización, exportaciones, integración blockchain) y detectar duplicidades.
2. **Modelo de datos unificado**: definir un esquema común de personaje (atributos, trasfondo, inventario, imagen, tokenId/NFT URI) que funcione tanto para la generación offline como para el backend de mint.
3. **Frontend único**:
   - Consolidar la UI de creación/edición con un flujo de asistente (wizard) y previsualización en vivo.
   - Mantener la generación offline (sin servidor) para pruebas rápidas, pero conectada opcionalmente a la API para minteo.
   - Centralizar componentes en Vite + React con tipado y pruebas unitarias.
4. **Backend y servicios**:
   - Normalizar la API Express (endpoints para generación, renderizado de imagen, subida a IPFS y acuñación).
   - Incorporar cualquier lógica avanzada de `DnD-Character-Forge` (p. ej., reglas de clase/trasfondo o validaciones) como módulos reutilizables.
   - Añadir autenticación ligera para proteger operaciones de mint/testnet.
5. **Smart contract**:
   - Verificar si el contrato actual cubre los metadatos requeridos; extenderlo solo si las nuevas funcionalidades añaden atributos on-chain.
   - Automatizar despliegue y verificación en testnet (scripts Hardhat/Foundry) junto con un set de pruebas de gas y seguridad.
6. **Experiencia DevOps**:
   - Añadir `.gitignore`, scripts de instalación/arranque y docker-compose coherentes para frontend, backend y nodo blockchain simulado.
   - Configurar CI para lint/test/build y una CD opcional a GitHub Pages (frontend) y a contenedores (backend).

Consulta el documento `docs/INTEGRATION_BLUEPRINT.md` para ver un esquema propuesto de modelo de datos, API y flujo de UI unificados.

## Próximos pasos sugeridos
1. Obtener acceso a `DnD-Character-Forge` y documentar su funcionalidad y stack.
2. Preparar un documento de comparación funcional (tabla de características y gaps).
3. Definir el modelo de datos unificado y actualizar los esquemas/types en frontend y backend.
4. Crear un prototipo integrado: UI única conectada a un backend Express estandarizado con endpoints para generación y minteo.
5. Añadir pruebas automatizadas (unitarias y E2E) y pipelines CI para garantizar calidad antes de producción.
