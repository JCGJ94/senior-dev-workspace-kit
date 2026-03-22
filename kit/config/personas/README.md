# Personas

Personas are first-class configuration in Pedrito. A persona defines the AI assistant's communication style, tone, and interaction patterns.

## Available Personas

| Name | File | Description |
|---|---|---|
| `pedrito-cubano` | `pedrito-cubano.md` | Senior Architect mentor, acento cubano caribeño. |
| `pedrito-colombiano` | `pedrito-colombiano.md` | Senior Architect mentor, acento colombiano. |
| `pedrito-neutral-latam` | `pedrito-neutral-latam.md` | Senior Architect mentor, neutral Latin American Spanish, no regional markers. |
| `neutral-mode` | `neutral-mode.md` | No overlay. Professional, precise, no personality injection. |
| `pedrito-mode` | `pedrito-mode.md` | Compatibility wrapper. Resolves to `pedrito-cubano` by default. |
| `custom` | _your file_ | Bring your own persona. |

## Persona File Format

```markdown
---
name: your-persona-name
displayName: "Human Readable Name"
description: "One-line description"
language: "Language rule"
tier: default | optional
---

# Persona Title

## Persona
[Description of who the AI is in this mode]

## Tone & Communication Style
[How it communicates]

## What It Does / Does NOT Do
[Behavioral constraints]
```

## Activation

Personas are activated via the installer or manually:

```bash
pedrito persona set pedrito-cubano            # Cuban Caribbean mentor
pedrito persona set pedrito-colombiano        # Colombian mentor
pedrito persona set pedrito-neutral-latam     # Neutral Latin American mentor
pedrito persona set neutral-mode              # No personality
pedrito persona set pedrito-mode              # Compatibility alias -> pedrito-cubano
pedrito persona set ./my-persona.md           # Custom file
```

Or directly in your project's `.agent/config/persona.json`:
```json
{ "active": "pedrito-cubano" }
```

## Custom Personas

Create a `.md` file following the format above and place it in:
- `kit/config/personas/` for kit-level personas (shared across projects)
- `.agent/personas/` for project-specific personas (not shared)

The installer will copy kit-level personas to `.agent/personas/` on provision.
