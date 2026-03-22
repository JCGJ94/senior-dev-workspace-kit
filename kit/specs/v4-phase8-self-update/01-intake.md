# Phase 8 Intake — Self-Update & Mantenimiento

**Fecha:** 2026-03-21
**Fase:** V4 Phase 8
**Package:** `@pedrito/installer`
**Directorio:** `packages/installer/src/updater/`

---

## Contexto

Al finalizar Fase 7, Pedrito se distribuye como binarios compilados via Homebrew,
curl y descarga directa. Sin embargo, una vez instalado, actualizarlo requiere
repetir el proceso de instalación manualmente.

Fase 8 agrega:
1. **Auto-update**: `pedrito update` descarga la última versión y reemplaza el binario
2. **Skills sync**: actualiza los archivos de skills en todos los agentes configurados
3. **Engram update**: actualiza el servidor de memoria al latest
4. **GGA update**: actualiza el pre-commit hook
5. **Config sync entre máquinas**: `pedrito sync` exporta/importa via archivo o GitHub Gist privado

## Estado actual

- `ConfigStore` (Fase 5) sabe qué agentes y componentes están instalados
- Los binarios están en `$PATH` como `pedrito`, `pedrito-engram`, `gga`
- Los skills están en paths de agentes registrados en ConfigStore
- El `release.yml` (Fase 7) genera releases con checksums en GitHub

## Problema que resuelve

Sin Fase 8:
- Actualizar Pedrito = descargar manualmente + reemplazar binario
- Los skills del kit no se sincronizan cuando hay nuevas versiones
- Si el usuario trabaja en 2 máquinas, la configuración diverge
- No hay forma de saber si hay una versión más nueva disponible

## Objetivo de la fase

1. **`pedrito update`** — descarga el último binario desde GitHub Releases,
   verifica checksum, reemplaza en-place de forma atómica
2. **`pedrito update --skills`** — sincroniza skills del kit a todos los agentes instalados
3. **`pedrito update --engram`** — detiene Engram, reemplaza binario, reinicia
4. **`pedrito update --all`** — todo lo anterior en secuencia
5. **`pedrito sync`** — sincronización de config entre máquinas via archivo o Gist

## Dependencias

- Fase 5 → `ConfigStore` (qué agentes/skills están instalados)
- Fase 6 → `exporter/importer` (para `pedrito sync`)
- Fase 7 → GitHub Releases como fuente de binarios + checksums

## Restricciones

- En macOS/Linux: el reemplazo atómico usa `mv` (funciona aunque el binario esté corriendo)
- En Windows: el binario no puede reemplazarse mientras está en uso → estrategia de "reemplazo al próximo inicio"
- El update nunca sobrescribe configs del usuario — solo binarios y archivos del kit
- `pedrito sync --github-gist` requiere `gh` CLI autenticado

## Criterios de éxito

1. `pedrito update` descarga, verifica checksum y reemplaza el binario en < 30 segundos
2. `pedrito update --skills` sincroniza skills modificados a todos los agentes registrados
3. `pedrito update --all` completa sin errores en una instalación limpia
4. `pedrito sync --to profile.json` + `pedrito sync --from profile.json` en otra máquina replica el entorno
5. `pedrito update` en Windows notifica al usuario y deja el binario nuevo listo para el próximo inicio
