# Phase 4 Intake — Context7 y MCP en Producción

**Fecha:** 2026-03-21
**Fase:** V4 Phase 4
**Packages afectados:** `@pedrito/engram`, `@pedrito/installer`

---

## Contexto

Al finalizar Fase 3, `pedrito install` configura los agentes incluyendo MCP, pero de forma básica.
Fase 4 hace que MCP funcione realmente en producción: transporte correcto por agente, SSE real en Engram, Context7 funcional vía stdio, y management post-install de servers MCP.

### Estado actual de Engram MCP (`packages/engram/src/mcp/server.ts`)

El servidor ya implementa JSON-RPC 2.0 sobre HTTP en `/mcp`:
- `GET /mcp` → discovery (tools list)
- `POST /mcp` → JSON-RPC handler (`tools/list`, `tools/call`)
- Herramientas: `search_memory`, `get_context`, `save_observation`

**Lo que falta:**
- Transporte SSE real (Server-Sent Events) para agentes que lo requieren
- Handshake `initialize` / `initialized` del protocolo MCP completo
- Notificaciones server→client (necesario para streaming de resultados)

### Estado actual del componente MCP en el installer

El componente `packages/installer/src/components/mcp.ts` se spec'ó en Fase 3 con
`resolveMCPServers()` y un placeholder. Fase 4 lo implementa completamente:
configs exactas por agente, manejo de tokens, y CLI de gestión.

## Problema que resuelve

Los agentes de IA (Claude Code, Cursor, OpenCode) esperan formatos de configuración MCP
específicos y transportes distintos. Sin Fase 4:
- Claude Code recibe config de Engram como SSE pero el endpoint no implementa SSE
- Context7 no funciona porque requiere transport stdio (ejecutar npx) y no está configurado
- No hay forma de añadir/quitar MCP servers después de la instalación
- Notion/Jira requieren tokens del usuario que `pedrito install` no solicita

## Objetivo de la fase

1. **Engram:** Implementar SSE transport real (`GET /mcp/sse` + `POST /mcp/message`)
   junto al JSON-RPC HTTP existente, para compatibilidad máxima
2. **Installer:** `components/mcp.ts` completo con config exacta por agente
3. **Context7:** Configurar stdio transport (`npx -y @upstash/context7-mcp@latest`)
   en todos los agentes que lo soportan
4. **P1 servers:** Notion + Jira con token prompting en el flujo de instalación
5. **CLI de gestión:** `pedrito mcp add/list/remove/status`

## Criterios de éxito

1. `use context7` en Claude Code devuelve documentación real de una librería
2. `search_memory` vía MCP desde Claude Code devuelve resultados de Engram
3. `pedrito mcp status` muestra qué servers están activos por agente
4. `pedrito mcp add notion --token <tok>` configura Notion en todos los agentes instalados
5. Engram MCP SSE pasa el handshake MCP completo (initialize → initialized → tools/list)
