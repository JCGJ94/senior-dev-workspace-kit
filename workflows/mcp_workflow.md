# MCP Workflow — Construir un Servidor MCP

## Cuándo usar este workflow
Cuando el objetivo es construir, extender, o evaluar un servidor MCP (Model Context Protocol) que expone tools a un LLM.

**No usar** si solo estás consumiendo herramientas MCP como cliente.

---

## Skill activa
`mcp-builder` — ver `.agent/skills/mcp-builder/SKILL.md`

Referencia técnica completa: `skills/mcp-builder/reference/`

---

## Flujo de trabajo

### Fase 1 — Investigación (no escribas código aún)
- Identifica qué endpoints de la API externa son necesarios.
- Carga solo los specs relevantes (no el SDK completo).
- Define el set de tools: nombres, parámetros, outputs esperados.
- Decide el lenguaje: TypeScript (`@modelcontextprotocol/sdk`) o Python (`mcp[cli]` / `FastMCP`).

**Verificación:** ¿Tienes claro qué hace cada tool y qué devuelve?

---

### Fase 2 — Implementación
- Setup del proyecto con el SDK correcto.
- Registra cada tool con schema Zod (TS) o Pydantic (Python).
- Mensajes de error que guíen al agente, no que lo confundan.
- Incluye paginación en GET tools desde el inicio.
- Devuelve tanto `text` como `json` estructurado cuando el SDK lo soporta.

**Verificación:** ¿Compila sin `any` implícito? ¿El servidor levanta localmente?

---

### Fase 3 — Review y Test
- Valida las tools con MCP Inspector.
- Confirma que los schemas son correctos y los errores son accionables.
- Verifica que no hay context leakage entre tool calls.

**Verificación:** ¿MCP Inspector acepta el schema? ¿Los outputs son deterministas?

---

### Fase 4 — Evaluaciones
- Crea 3–5 preguntas realistas que un LLM haría al servidor.
- Confirma que el LLM puede resolver cada pregunta usando las tools disponibles.
- Documenta cualquier gap encontrado.

**Verificación:** `verification-before-completion` antes de declarar completo.

---

## Quickstart: Python con FastMCP

```python
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel

mcp = FastMCP("mi-servidor")

class BuscarParams(BaseModel):
    query: str
    limit: int = 10

@mcp.tool()
def buscar(params: BuscarParams) -> dict:
    """Busca registros por query. Devuelve lista paginada."""
    # implementación
    return {"results": [], "total": 0, "limit": params.limit}

if __name__ == "__main__":
    mcp.run()
```

---

## Quickstart: TypeScript con MCP SDK

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "mi-servidor", version: "1.0.0" });

server.registerTool(
  "buscar",
  {
    description: "Busca registros por query. Devuelve lista paginada.",
    inputSchema: z.object({
      query: z.string().describe("Texto a buscar"),
      limit: z.number().int().min(1).max(100).default(10),
    }),
  },
  async ({ query, limit }) => {
    // implementación
    return {
      content: [{ type: "text", text: JSON.stringify({ results: [], total: 0, limit }) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## Reglas de seguridad
- No exponer credenciales en tool descriptions ni en outputs.
- No aceptar paths arbitrarios sin sanitizar.
- Si el servidor maneja auth o datos sensibles → activar `security-reviewer`.

---

## Referencias
- Referencia Python: `skills/mcp-builder/reference/python_mcp_server.md`
- Referencia Node: `skills/mcp-builder/reference/node_mcp_server.md`
- Best practices: `skills/mcp-builder/reference/mcp_best_practices.md`
- Evaluaciones: `skills/mcp-builder/reference/evaluation.md`
