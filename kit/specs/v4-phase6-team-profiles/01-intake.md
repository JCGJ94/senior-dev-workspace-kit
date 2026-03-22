# Phase 6 Intake — Team Sharing & Perfiles

**Fecha:** 2026-03-21
**Fase:** V4 Phase 6
**Package:** `@pedrito/installer`
**Directorio:** `packages/installer/src/profiles/`

---

## Contexto

Al finalizar Fase 5, `~/.pedrito/config.json` registra exactamente qué agentes,
componentes, skills y MCPs están instalados. Fase 6 convierte ese estado en un
formato portable (`pedrito-profile.json`) que puede compartirse, versionarse en git
y aplicarse en otra máquina con un solo comando.

## Problema que resuelve

Onboarding de un nuevo miembro del equipo hoy:
1. Buscar qué agentes usa el equipo
2. Copiar manualmente CLAUDE.md / equivalente
3. Instalar skills uno a uno
4. Configurar MCP servers a mano
5. Configurar GGA con el provider correcto
6. Repetir para cada agente

Con perfiles:
```bash
pedrito profile import https://raw.githubusercontent.com/mi-equipo/dotfiles/main/pedrito-profile.json
```
→ Entorno completo en < 5 minutos.

## Objetivo de la fase

1. **Export** — leer `ConfigStore` y generar `pedrito-profile.json` sanitizado (sin tokens)
2. **Import desde archivo** — validar, resolver tokens faltantes, instalar
3. **Import desde URL** — fetch + validar + instalar
4. **Store local** — `~/.pedrito/profiles/` para perfiles guardados y reutilizables
5. **CLI `pedrito profile`** — export / import / list / save / delete
6. **Stub registry** — `publish`, `search`, `install` con mensaje "coming soon" (Fase 7+)

## Dependencias

- **Fase 5** — `ConfigStore` (para saber qué exportar)
- **Fase 3** — `orchestrator.runInstall()` + `InstallState` (para ejecutar el import)
- **Fase 4** — catálogo `MCP_SERVERS` (para saber qué tokens son necesarios)

## Restricciones

- Los perfiles no contienen API keys ni tokens — los campos de tokens son siempre `null` en exports
- Los perfiles deben ser reproducibles entre macOS y Linux (no paths absolutos)
- Import desde URL solo acepta HTTPS — no HTTP
- Validación Zod estricta antes de ejecutar cualquier install desde un perfil importado
- Compatibilidad de versión: perfiles `"version": "4.x"` son compatibles entre sí;
  versiones futuras `5.x` requieren actualización del installer

## Criterios de éxito

1. `pedrito profile export` genera un JSON válido y sanitizado desde una instalación existente
2. `pedrito profile import team-profile.json` instala el entorno completo sin input adicional
   (excepto tokens de P1 servers si están en null)
3. `pedrito profile import <url>` funciona con URLs HTTPS de GitHub raw content
4. `pedrito profile list` muestra perfiles guardados localmente
5. El perfil exportado + importado en otra máquina produce el mismo resultado que `pedrito install` con ese preset
6. `bun test` verde
