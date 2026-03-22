# V3 Sub-Agent Architecture

## Purpose
Define the first complete V3 orchestration topology for the AI Engineering Workspace Kit.

## Why This Exists
The V3 system needs a durable execution model that can scale software delivery quality without allowing the active context window to grow uncontrollably. The master sub-agent and its specialized sub-agents provide that execution graph.

## Master Sub-Agent

### `architect-orchestrator-v3`
Owns global execution.

Responsibilities:
- enforce the V3 architecture contract
- route work across specialized sub-agents
- keep SDD mandatory for non-trivial work
- maintain context stability
- require verification and security evidence
- control deploy-domain routing
- promote reusable knowledge into Engram through the correct path

## Specialized Sub-Agents

### `engram-manager`
Durable memory owner.

Scope:
- memory promotion
- retrieval tagging
- durable knowledge classification

### `sdd-manager`
9-phase Spec-Driven Development owner.

Scope:
- phase progression
- artifact completeness
- workflow readiness

### `skill-governor`
Skill governance owner.

Scope:
- skill activation
- adaptation of trusted upstream skills to V3
- registry and trust policy discipline

### `security-reviewer`
Security gate owner.

Scope:
- trust boundaries
- CI/CD controls
- runtime safety
- release blockers

### `test-verifier`
Verification gate owner.

Scope:
- check mapping
- evidence validation
- completion readiness

### `deploy-orchestrator`
Deploy-domain owner.

Scope:
- preflight
- build and release contract
- smoke validation
- rollback planning

### `context-keeper`
Context stability owner.

Scope:
- context packs
- summary-first loading
- active window control

## Execution Model
1. Intake request.
2. Determine whether SDD is required.
3. Activate `architect-orchestrator-v3` for cross-cutting work.
4. Select the minimum specialized sub-agent set.
5. Build a stable context pack.
6. Execute the current SDD phase.
7. Verify before completion.
8. Promote durable knowledge into Engram.

## Trusted Upstream Skills
Mother-repo skills selected by the maintainer are treated as high-reliability inputs. V3 should preserve them and adapt them, not discard them. Adaptation means:
- add V3 metadata where missing
- align activation rules
- align verification contracts
- align context and memory discipline

## Initial Integration Target
This document defines the first integration milestone only:
- the master sub-agent exists
- the specialized sub-agents exist
- the registry knows about them
- activation rules understand them

Future work will connect them to full Engram, SDD artifact generation, hardened registry schemas, and CI/CD enforcement.
