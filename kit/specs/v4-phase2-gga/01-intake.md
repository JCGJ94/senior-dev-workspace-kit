# Phase 2 Intake — GGA: Guardian Angel

**Fecha:** 2026-03-21
**Fase:** V4 Phase 2
**Package:** `@pedrito/gga`
**Directorio:** `packages/gga/`

---

## Contexto

Pedrito V4 convirtió el kit de Markdown a un monorepo TypeScript+Bun con tres packages:
- `@pedrito/engram` — servidor de memoria real (✓ completo, Fase 1)
- `@pedrito/gga` — Guardian Angel pre-commit hook (← esta fase)
- `@pedrito/installer` — CLI instalador con TUI (Fase 3)

La Fase 0 estableció el monorepo y las interfaces. La Fase 1 entregó el servidor Engram con SQLite + FTS5 + REST API. El package `@pedrito/gga` existe como stub vacío: solo tiene `src/index.ts` con un `VERSION = '4.0.0'`.

## Problema que resuelve

Los desarrolladores comiten código que viola los estándares del proyecto (definidos en `AGENTS.md`) porque no hay ningún checkpoint automático entre `git add` y `git commit`. La revisión manual es costosa, inconsistente, y depende de que el reviewer conozca las reglas vigentes.

GGA intercepta cada commit, extrae los archivos staged, los revisa con IA contra los estándares del proyecto, y bloquea el commit si el código no pasa — con feedback accionable antes de bloquear.

## Objetivo de la fase

Construir el CLI `gga` como binario compilado con Bun que:
1. Se instala como pre-commit hook en cualquier repositorio git
2. Revisa código staged usando el proveedor IA configurado
3. Cachea resultados por SHA256 para no re-revisar archivos sin cambios
4. Soporta múltiples proveedores: claude, ollama, gemini, opencode, lmstudio, github
5. Lee los estándares del proyecto desde `AGENTS.md` (fallback: `CLAUDE.md`)

## Usuarios

- Desarrolladores individuales que usan Pedrito en sus proyectos
- Equipos que quieren garantizar code standards sin depender de CI
- Usuarios con modelos locales (Ollama, LM Studio) que prefieren privacidad

## Restricciones

- Debe funcionar offline con proveedores locales (ollama, lmstudio)
- El hook no debe añadir más de 30 segundos de latencia en el caso normal (archivos cacheados)
- No debe bloquear el commit si GGA no está instalado o el provider no responde (fail-open configurable)
- Compatible con macOS, Linux. Windows es nice-to-have.

## Criterios de éxito

1. `git commit` en un repo con GGA instalado activa el review automático
2. Archivos que no cambiaron desde el último PASSED no se re-revisan (caché SHA256)
3. El feedback se muestra antes de bloquear el commit
4. Funciona con al menos `claude` y `ollama` como providers
5. `gga install` y `gga run` funcionan end-to-end
