# Specs — SDD Operational Guide

This directory stores **Spec-Driven Development (SDD)** artifacts for non-trivial work.

> **Golden rule:** no implementation without a spec. If the change is non-trivial, it goes through here.

---

## When do I need a spec?

| Change type | Spec? | Required artifacts |
|-------------|-------|--------------------|
| **Trivial** (typo, 1 file, obvious fix) | ❌ No | None |
| **Medium** (touches 2-3 files, bounded new logic) | ✅ Reduced | `01-intake`, `06-tasks`, `08-verification`, `summary` |
| **Non-trivial** (multi-file, architecture, security, deploy) | ✅ Full | All 9 phases + `summary` |

### How to tell if it's non-trivial

If it meets **any** of these criteria:
- Touches more than 3 files or modules
- Changes visible system behavior
- Requires developer approval (per the approval policy)
- Involves security, deploy, data, or external dependencies
- Implementation would take more than ~30 minutes

---

## How to start a spec

1. **Choose a `change-id`**: descriptive kebab-case slug. E.g.: `repair-skills-semantics`, `runtime-env-refresh`
2. **Create the directory**: `specs/<change-id>/`
3. **Copy the templates**: `cp specs/_template/* specs/<change-id>/`
4. **Start with `01-intake.md`** and fill the sections following the inline guide comments
5. **Update `summary.md`** on each phase transition

---

## The 9 phases

| # | Phase | File | Purpose |
|---|-------|------|---------|
| 1 | Intake | `01-intake.md` | What, why, constraints, risks, DoD |
| 2 | Explore | `02-explore.md` | Current state, relevant files, unknowns |
| 3 | Proposal | `03-proposal.md` | Recommended solution, alternatives, tradeoffs |
| 4 | Spec | `04-spec.md` | Formal requirements, acceptance criteria |
| 5 | Design | `05-design.md` | Components, boundaries, data flow, decisions |
| 6 | Tasks | `06-tasks.md` | Ordered list of atomic tasks |
| 7 | Apply | `07-implementation-log.md` | Record of actual changes vs plan |
| 8 | Verify | `08-verification.md` | Concrete evidence (commands, results) |
| 9 | Archive | `09-archive.md` | Outcome, Engram candidates, follow-ups |
| — | Summary | `summary.md` | Executive status. Updated on each phase |

---

## Conventions

- **`change-id`**: kebab-case, descriptive, no date. E.g.: `repair-skills-semantics`
- **Status in summary**: `Pending` → `Active` → `Complete` → `Archived`
- **Phase in summary**: `1-Intake` through `9-Archive`
- **`<!-- -->` comments in templates are guidance** — you can keep or remove them when filling in

---

## Reduced cycle (medium changes)

For medium changes, you only need 4 artifacts:

```
specs/<change-id>/
  01-intake.md         ← what and why
  06-tasks.md          ← what to do
  08-verification.md   ← evidence
  summary.md           ← status
```

---

## Real examples

| Spec | Type | Phases | Status |
|------|------|--------|--------|
| [`repair-skills-semantics`](./repair-skills-semantics/) | Non-trivial | 9 complete | Archived |
| [`runtime-env-refresh`](./runtime-env-refresh/) | Non-trivial | 9 complete | Archived |
| [`workflow-refactor-executability`](./workflow-refactor-executability/) | Non-trivial | 9 complete | Archived |

---

## Reference

- **Rule that mandates it**: [03_development_super_rule.md](../.agent/core/03_development_super_rule.md) §1
- **Skill that enforces it**: `sdd-manager` in `.agent/skills/`
- **Templates**: [`_template/`](./_template/)
