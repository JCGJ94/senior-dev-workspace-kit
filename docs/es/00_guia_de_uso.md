# Guia de uso del AI Engineering Workspace Kit

## Ciclo de vida

### 1. Instalar el runtime

```bash
bash /ruta/al/ai-engineering-workspace-kit/scripts/agent init
```

Esto provisiona `.agent/`, `docs/engram/` y `specs/` dentro del repositorio objetivo.

### 2. Sincronizar el runtime

```bash
bash /ruta/al/ai-engineering-workspace-kit/scripts/agent sync
```

Esto actualiza el runtime desde el kit fuente manteniendo intacto el modelo V3.

### 3. Validar el kit fuente

```bash
bash /ruta/al/ai-engineering-workspace-kit/scripts/validate-kit.sh
```

## Reglas operativas

- El agente lee `.agent/core/` como conjunto de reglas instaladas.
- `AGENTS.md` es el contrato operativo del runtime.
- `docs/engram/` guarda la memoria duradera.
- `specs/` guarda los artefactos de trabajo no trivial.
- El agente mantiene el contexto pequeno y activa el conjunto minimo util de skills.

## Modelo de aprobacion

El agente puede analizar, planificar, resumir y preparar cambios reversibles de bajo riesgo de forma autonoma.

Debe pedir aprobacion antes de cambios de arquitectura, adopcion de skills externas, cambios de dependencias, acciones destructivas en archivos o acciones de seguridad/deploy/datos.

## Skills JIT

Si falta una skill, el orden de busqueda confiable es:

1. skills locales del kit o del runtime
2. `https://skills.sh/`
3. `https://agents.md/`
4. `https://github.com/obra/superpowers`

Las skills externas requieren aprobacion y adaptacion al formato V3 antes de activarse.
