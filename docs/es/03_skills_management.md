# Gestión y Creación de Habilidades

Este kit utiliza un flujo de trabajo agéntico estilo Antigravity. Una Habilidad ("Skill") es un bloque modular de instrucciones, reglas y lógica de ejecución adaptado a escenarios técnicos específicos.

## 1. Estructura de Directorios (`/skills`)
Cada habilidad debe alojarse localmente en su propio directorio con esta estructura:
```text
skills/
└── nombre-de-la-habilidad/
    ├── SKILL.md       (Obligatorio: reglas y metadatos)
    ├── scripts/       (Opcional: archivos ejecutables)
    ├── resources/     (Opcional: activos de referencia)
```

**Regla de Bajo Consumo de Tokens (Compactness):** Las habilidades (Skills) no deben contener saludos, explicaciones redundantes o narrativa. Cada regla debe iniciar con un verbo imperativo.

## 2. Registro de Habilidades (`/skills_registry`)
Escribir la habilidad solo define el "QUÉ". El `skills_registry` determina el "CUÁNDO".
Después de escribir la habilidad, DEBE estar registrada aquí:
1. `skill_manifest.json`: Índice central para que el Agente la encuentre rápidamente.
2. `preferred_skills.md`: Resumen categorizado de habilidades vigentes.
3. `skill_activation_rules.md`: Definiciones del contexto de los activadores.
4. `skill_tiers.md`: Nivel de complejidad (Tier 1 vs. Tier 3 vs. Opcionales).

## 3. Crear una Habilidad (Skill)
En lugar de escribirla a mano, puedes pedirle al agente:
*"Por favor, crea un nuevo skill para estandarizar migraciones de Supabase en base a lo que acabamos de hacer."*

La capacidad `skill-creator` del agente propondrá el nuevo skill de forma compacta y segura, guiándose por `templates/_blueprint/SKILL.md`.

## 4. Validar la Arquitectura
Para evitar enlaces rotos o habilidades aisladas tras su creación, contamos con un validador multiplataforma estricto. Corre siempre el script de validación tras modificar habilidades:
```bash
bash scripts/validate-skills.sh
```
Esto asegura que el manifiesto esté en sintonía con la estructura en formato de directorio, y previene la existencia subyacente de código heredado/legacy.
