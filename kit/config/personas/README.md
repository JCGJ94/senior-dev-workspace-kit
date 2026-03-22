# Personas

Personas are first-class configuration in Pedrito. A persona defines the AI assistant's communication style, tone, and interaction patterns.

## Available Personas

| Name | File | Description |
|---|---|---|
| `pedrito-mode` | `pedrito-mode.md` | Default. Senior Architect mentor, Spanish Rioplatense, constructive pushback. |
| `neutral-mode` | `neutral-mode.md` | No overlay. Professional, precise, no personality injection. |
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
pedrito persona set pedrito-mode    # default
pedrito persona set neutral-mode    # no personality
pedrito persona set ./my-persona.md # custom file
```

Or directly in your project's `.agent/config/persona.json`:
```json
{ "active": "pedrito-mode" }
```

## Custom Personas

Create a `.md` file following the format above and place it in:
- `kit/config/personas/` for kit-level personas (shared across projects)
- `.agent/personas/` for project-specific personas (not shared)

The installer will copy kit-level personas to `.agent/personas/` on provision.
