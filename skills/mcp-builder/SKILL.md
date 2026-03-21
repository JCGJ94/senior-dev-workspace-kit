---
name: "mcp-builder"
description: "Diseñar, implementar y evaluar servidores MCP (Model Context Protocol) seguros y bien tipados para que los LLMs puedan interactuar con APIs externas."
tier: 2
triggers: ["mcp", "model-context-protocol", "mcp-server", "@modelcontextprotocol", "fastmcp", "mcp[cli]", "llm-tools", "tool-server"]
context_cost: 600
---
# MCP Builder

## Purpose
Guiar la construcción de servidores MCP de alta calidad que permitan a los LLMs interactuar con servicios externos a través de herramientas bien diseñadas, seguras y con tipado estricto.

Referencia completa en: `skills/mcp-builder/SKILL.md` y `skills/mcp-builder/reference/`.

## Use when
- Se va a construir o extender un servidor MCP en TypeScript (`@modelcontextprotocol/sdk`) o Python (`mcp[cli]` / `FastMCP`).
- El código importa `@modelcontextprotocol/sdk`, `mcp`, o `fastmcp`.
- El usuario menciona "MCP", "model context protocol", "tool server", o "servidor de herramientas para LLM".
- Se evalúa la efectividad de herramientas MCP existentes.

## Do not use when
- Se está construyendo una API REST/GraphQL estándar sin intención de exponerla como MCP.
- El usuario solo llama herramientas MCP existentes como cliente (no las construye).

## Development Phases
1. **Investigación**: Entender qué endpoints de la API externa son necesarios. No cargar el SDK completo — solo los specs relevantes.
2. **Implementación**: Setup del proyecto, infraestructura core, registro de tools con Zod/Pydantic.
3. **Review y Test**: Validar via MCP Inspector, mensajes de error accionables, outputs estructurados.
4. **Evaluaciones**: Crear casos de prueba realistas que mapeen el comportamiento del LLM con las tools.

## Rules (V3-aligned)
- **Tipado obligatorio**: Zod (TS) o Pydantic (Python) para todos los inputs. Sin `any` implícito.
- **Errores accionables**: El mensaje de error debe guiar al agente hacia la sintaxis o parámetro correcto.
- **Paginación nativa**: Incluir paginación en los GET tools desde el inicio.
- **Outputs estructurados**: Devolver tanto `text` como `json` cuando el SDK lo soporte.
- **Eficiencia de contexto**: Cargar solo los specs de endpoints necesarios, no el SDK completo.
- **Seguridad**: No exponer credenciales en las tool descriptions. No aceptar inputs sin validar.

## Activation Sequence (V3)
Bajo el modelo V3, esta skill se activa normalmente como domain skill dentro del flujo:
1. `context-optimization`
2. `writing-plans`
3. **`mcp-builder`** ← esta skill
4. `executing-plans`
5. `verification-before-completion`

Si el servidor MCP tiene implicaciones de seguridad significativas, activar también `security-reviewer`.

## Validation
- Compilación limpia sin `any` implícito.
- Servidor levanta localmente via stdio o streamable-http sin crash inmediato.
- Las tools pasan por MCP Inspector con schemas válidos.
- Tests end-to-end confirman que el LLM puede usar las tools sin context leakage.

## Output

### MCP Server Development Report
#### Progress Snapshot
Estado de la fase actual (1–4).
#### Tool Specifications
Nombre, schema, y docstrings de las tools implementadas o modificadas.
#### Testing Results
Hallazgos del MCP Inspector o evaluación manual.
