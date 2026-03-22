# Summary — V4 Phase 8: Self-Update & Mantenimiento

**Status:** Planning
**Started:** 2026-03-21
**Completed:** —

## What This Is

Pedrito se actualiza a sí mismo. Tres capacidades nuevas:
1. **Binary self-update** — descarga, verifica checksum, reemplaza atómicamente
2. **Skills sync** — propaga skills actualizados del kit a todos los agentes instalados
3. **Config sync** — exporta/importa config entre máquinas via archivo o GitHub Gist privado

## Key Decisions

- **`renameSync` atómico en Unix** — reemplazar un binario corriendo es seguro en Unix (el inode se mantiene válido hasta que el proceso termina); no hay ventana de corrupción
- **`.new.exe` + startup check en Windows** — Windows bloquea binarios en ejecución; el patrón "descargo el nuevo, lo aplico al próximo inicio" evita un updater helper separado (un cuarto binario a distribuir)
- **`syncSkills` nunca elimina** — el usuario puede tener skills personalizados; eliminar automáticamente sería destructivo; solo add + update
- **`pedrito sync` es alias de profile export/import** — no duplicar lógica; solo añade el transport layer de Gist encima
- **gistId en ConfigStore** — persiste entre sesiones para que `pedrito sync --github-gist` sea idempotente (actualiza el mismo Gist en lugar de crear uno nuevo cada vez)

## Nuevos módulos

```
src/updater/
  release.ts       GitHub Releases API + detección de plataforma
  downloader.ts    Descarga binario + verifica SHA256
  replacer.ts      Reemplazo atómico (Unix) / pending-restart (Windows)
  skills-sync.ts   Sincroniza skills kit → agentes
  updater.ts       Orquestador: binarios + skills + Engram stop/restart

src/sync/
  sync.ts          pedrito sync --to/--from/--github-gist
```

## Files to Create / Modify

20 tareas en `06-tasks.md`:
- 4 nuevos módulos updater (release, downloader, replacer, updater)
- 2 tareas skills sync (skills-sync.ts + agent.interface.ts `skillsDir()`)
- 2 tareas config sync (sync.ts + ConfigStore update)
- 3 CLI subcomandos (update, sync, startup check Windows)
- 1 test suite (10 casos)
- 8 build + verificación (incluyendo smoke test con release real)
