# Proceso de Lanzamiento (Release)

Este documento describe el proceso estándar y liviano (ligero) para lanzar nuevas versiones del AI Engineering Workspace Kit. Nos adherimos al [Semantic Versioning](https://semver.org/) (Versionado Semántico).

## Lógica de Versiones
- **MAJOR (MAYOR x.0.0)**: Cambios perjudiciales (*breaking changes*) en las reglas o estructura del kit.
- **MINOR (MENOR 0.x.0)**: Nueva funcionalidad compatible con versiones anteriores (ej., nuevas habilidades o reglas).
- **PATCH (PARCHE 0.0.x)**: Arreglos (*fixes*) y mejoras menores a scripts.

## Estrategia de Lanzamiento Mínima

Cuando estés listo para realizar un nuevo lanzamiento (Release), sigue estos pasos localmente:

1. **Actualizar Archivos**: Asegúrate de que todos los nuevos scripts, templates o modificaciones de reglas estén acabados.
2. **Actualizar Changelog**: Añade el bloque de la nueva versión en el archivo `CHANGELOG.md` correspondiendo al tag de Git que sacarás. Revisa las entradas previas de ejemplo.
3. **Guardar Cambios (Commits)**: Utiliza Conventional Commits.
   ```bash
   git commit -m "chore(release): bump to version vX.Y.Z"
   ```
4. **Crear Tag (Etiqueta)**: Genera el tag apuntando explícitamente a tu commit the release.
   ```bash
   git tag vX.Y.Z
   ```
5. **Pushear la rama**: Sube los cambios estándar en la rama base a GitHub.
   ```bash
   git push origin main
   ```
6. **Pushear el tag**: Envía la nueva etiqueta de versión generada hacia GitHub.
   ```bash
   git push origin vX.Y.Z
   ```
7. **Crear GitHub Release**: Ve a la UI del propio repositorio en GitHub (`Tags` -> `Create Release`), elige tu nuevo tag recien subido, establece el título como `vX.Y.Z` y copia-pega los cambios desde `CHANGELOG.md` que acabas de documentar como Notas de Versión.

> **Nota**: Evita usar plugins redundantes de empaquetado y automatización innecesarios dentro de pipelines CI/CD locales a menos de que un requerimiento explícito en la escalabilidad lo demande rigurosamente.
