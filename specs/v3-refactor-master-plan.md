# V3 refactor master plan

## Purpose

This document is the single execution plan for consolidating this repository into a coherent V3 product.

It is written for an external agent that does not have prior conversation context.

The agent must treat this file as the authoritative plan for the V3 refactor and productization effort.

The goal is to transform the repository into a GitHub-friendly, low-complexity workspace kit that can be forked, installed, and operated by developers with a consistent V3 runtime, human communication layer, governed autonomy, low token consumption, Engram-based durable memory, and controlled just-in-time skill acquisition.

This plan must be executed without dropping any requirement described here.

---

## Non-negotiable product vision

The product is an AI engineering workspace kit that:

- lives in GitHub and is intended to be forked by developers;
- installs into a developer workspace with low integration complexity;
- provisions a V3 runtime in `.agent/`;
- behaves like a master software engineering agent;
- can reason autonomously, but must ask the developer for approval before sensitive or high-impact decisions;
- can detect when it lacks a needed skill;
- can search trusted sources for skills;
- can adapt or create skills in the local V3 format;
- maintains low token usage through disciplined context loading;
- uses Engram for durable memory so important context is not lost;
- follows the existing workflow model instead of replacing the structure from scratch;
- uses a soft, friendly, human tone without losing technical precision.

---

## Core architectural decision

V3 is defined as:

- `AGENTS.md` = the master operational contract;
- `core/` = the source rules of the kit;
- `.agent/` = the installed runtime inside the target project.

Additionally:

- `registry/`, `skills/`, and `workflows/` at repository root are source assets of the kit;
- those source assets are provisioned or synchronized into `.agent/`;
- `docs/engram/` is the durable memory layer;
- `specs/` is the auditable planning and verification layer for non-trivial work.

This contract must be made explicit and consistent across code, scripts, documentation, and CI.

---

## Constraints and design principles

The executing agent must preserve these constraints while performing the work:

- Do not restart the project from scratch.
- Do not destroy the current structure unless a piece is clearly legacy and replaced intentionally.
- Keep the current structure and evolve it toward consistency.
- Reduce integration complexity for GitHub forks.
- Prefer one clear install path, one clear sync path, and one clear runtime model.
- Keep token consumption low.
- Keep Engram as the durable memory system.
- Keep workflows as the operational execution model.
- Build a human communication layer, but do not let style override safety, verification, or technical correctness.
- Govern autonomy through explicit approval rules.

---

## Trusted external sources for skill discovery

When the system needs a skill that is not available locally, trusted upstream sources are:

- `https://skills.sh/`
- `https://agents.md/`
- `https://github.com/obra/superpowers`

These sources are trusted discovery inputs, not automatic sources of truth.

Any externally sourced skill must still be evaluated, adapted to local V3 conventions, and governed by approval rules.

---

## Human communication layer

The repository must gain a new V3 capability named `humanized-communication`.

This capability exists to make the agent sound more human, soft, friendly, and natural while staying clear and technically trustworthy.

The design intent is inspired by repositories such as `blader/humanizer`, but it must be adapted to local V3 needs instead of copied blindly.

The layer must:

- reduce robotic phrasing;
- reduce sycophancy and fake enthusiasm;
- reduce grandiose AI-sounding language;
- improve clarity and readability;
- keep a calm, friendly engineering tone;
- preserve precision and evidence.

The layer must not:

- weaken verification;
- weaken workflow compliance;
- weaken architectural rules;
- turn formal artifacts into casual prose when rigor is needed.

Recommended application zones:

- messages to the developer;
- execution summaries;
- onboarding documentation;
- operational guidance;
- review and recommendation text.

Restricted or carefully controlled zones:

- core rules;
- security policy;
- CI assertions;
- formal spec artifacts;
- strict verification evidence.

---

## Approval and autonomy model

The final V3 product must be autonomous but developer-governed.

The agent may act autonomously for:

- repository inspection;
- architecture discovery;
- planning and task decomposition;
- safe analysis;
- summaries and recommendations;
- low-risk reversible preparation work;
- detection of missing capabilities;
- local skill lookup and registry inspection.

The agent must ask for developer approval before:

- changing architecture in a meaningful way;
- deleting, moving, or renaming important project structures;
- adopting or installing an externally sourced skill;
- introducing new dependencies;
- changing security, deploy, data, credentials, or billing behavior;
- altering high-impact workflows or contract files;
- making decisions with broad or ambiguous repository impact.

This approval model must be written into V3 rules, reflected in docs, and validated in the operational design.

---

## Skill lifecycle requirements

The system must support all of the following:

- detecting that a needed skill is missing;
- searching trusted sources;
- evaluating whether the found skill is useful and safe;
- adapting the skill to local V3 conventions;
- creating a new local skill if no good upstream skill exists;
- registering the skill in the local registry/runtime;
- preserving low token overhead;
- respecting approval rules before adoption when required.

The system must not assume that every external skill is immediately usable as-is.

---

## Expected product outcome

At the end of this plan, the repository should behave as a finished V3 kit that:

- can be hosted on GitHub cleanly;
- can be forked with low cognitive overhead;
- can be installed into a developer project through a short, stable flow;
- produces a coherent `.agent/` runtime;
- follows V3 instructions consistently;
- uses Engram and low-context discipline;
- can expand itself through governed JIT skills;
- communicates with a friendly human tone;
- is ready for real operation.

---

## Execution phases overview

The work is divided into two major phases:

- Phase 1: urgent V3 consolidation and operational readiness;
- Phase 2: V3 completion audit, documentation simplification, and product finalization.

The executing agent must complete Phase 1 before calling the system operationally V3.

The executing agent must complete Phase 2 before calling the product finished and ready to operate at 100%.

---

## Multi-agent execution protocol

This plan is intended to be executable by a coordinator agent plus two subagents.

Recommended topology:

- one orchestrator agent;
- one builder subagent;
- one auditor subagent.

### Orchestrator responsibilities

The orchestrator must:

- read this entire document before delegation;
- break work into ordered blocks;
- assign implementation to the builder subagent;
- assign review and verification to the auditor subagent;
- compare builder and auditor outputs;
- decide whether a block is accepted, rejected, or needs revision;
- keep a running record of status, dependencies, risks, and unresolved decisions;
- avoid allowing later blocks to proceed when prerequisite blocks are incomplete.

### Builder responsibilities

The builder subagent must:

- execute one approved block at a time;
- modify only the files relevant to the current block unless a dependency requires otherwise;
- report exactly which files were changed;
- explain what was changed and why;
- report any ambiguity or blocked dependency;
- never self-approve completion.

### Auditor responsibilities

The auditor subagent must:

- review the builder's output against this plan;
- verify block-level completion criteria;
- identify residual V1/V2/V3 mixing;
- identify broken references, incomplete migrations, risky assumptions, and policy gaps;
- report pass/fail status with evidence;
- avoid expanding scope into unrelated implementation work.

### Block gating rule

No block is complete until:

- the builder has delivered the intended changes;
- the auditor has reviewed the block;
- the orchestrator has accepted the block explicitly.

### Required tracking format

For every block, the orchestrator must maintain at least:

- block id;
- title;
- phase;
- objective;
- exact files in scope;
- dependencies;
- expected outcomes;
- validation criteria;
- builder result;
- auditor result;
- final status.

Recommended statuses:

- pending
- in progress
- blocked
- in review
- accepted
- rejected

---

## Ordered execution blocks

The orchestrator must execute the plan using the following ordered blocks.

### Block 1 - master V3 contract alignment

- Phase: 1
- Objective: align the written V3 contract with the real source kit and runtime.
- Files in scope:
  - `AGENTS.md`
  - `core/01_core_rules.md`
  - `core/03_development_super_rule.md`
  - `core/08_activation_policy.md`
  - `.agent/core/`
  - `.agent/state/`
  - `specs/v3-refactor-master-plan.md`
- Dependencies: none
- Expected outcomes:
  - V3 contract is explicit and internally consistent;
  - file and artifact names referenced by the contract exist or are intentionally renamed;
  - the source kit versus runtime distinction is clear.
- Validation criteria:
  - `AGENTS.md` does not point to missing critical artifacts;
  - the runtime artifact model can be explained without contradiction;
  - the auditor finds no critical mismatch between contract and actual file model.

### Block 2 - approval and autonomy policy

- Phase: 1
- Objective: define the developer approval model and embed it into the V3 rules.
- Files in scope:
  - `core/01_core_rules.md`
  - `core/02_safety_rules.md`
  - `core/08_activation_policy.md`
  - `config/developer_preferences.md`
  - `AGENTS.md`
- Dependencies:
  - Block 1 accepted
- Expected outcomes:
  - one explicit policy for autonomous-safe actions versus approval-gated actions;
  - external skill adoption is approval-aware;
  - docs and rules use the same governance language.
- Validation criteria:
  - there is a written list or rule set covering approval requirements;
  - approval rules cover architecture, dependencies, security, deploy, data, and external skill adoption;
  - the auditor confirms the policy is explicit rather than implied.

### Block 3 - CLI, sync, and runtime unification

- Phase: 1
- Objective: create one coherent V3 operational path for install, sync, and runtime generation.
- Files in scope:
  - `scripts/provision.sh`
  - `scripts/agent`
  - `scripts/sync-workspace-v2.sh`
  - `scripts/generate-registry.sh`
  - `scripts/validate-kit.sh`
  - `.agent/`
  - `README.md`
  - `README.es.md`
- Dependencies:
  - Block 1 accepted
  - Block 2 accepted
- Expected outcomes:
  - one official V3 install path;
  - one official V3 sync path;
  - one coherent runtime generation model;
  - V2 names are no longer primary.
- Validation criteria:
  - a maintainer can state the official install and sync commands in one sentence each;
  - the generated runtime matches the intended V3 artifact set;
  - the auditor finds no conflicting primary CLI story.

### Block 4 - onboarding-critical documentation cleanup

- Phase: 1
- Objective: remove legacy concepts from the main onboarding path.
- Files in scope:
  - `README.md`
  - `README.es.md`
  - `docs/en/00_usage_guide.md`
  - `docs/es/00_guia_de_uso.md`
  - `docs/en/01_getting_started.md`
  - `docs/es/01_getting_started.md`
  - `docs/en/02_architecture.md`
  - `docs/es/02_architecture.md`
  - `docs/en/03_skills_management.md`
  - `docs/es/03_skills_management.md`
- Dependencies:
  - Block 1 accepted
  - Block 3 accepted
- Expected outcomes:
  - docs no longer teach `.devkit`, `skills_registry`, obsolete install scripts, or obsolete sync scripts as the main path;
  - onboarding reflects the actual V3 flow.
- Validation criteria:
  - main onboarding docs no longer present obsolete concepts as current;
  - a new developer can follow the docs without legacy confusion;
  - the auditor confirms the main docs align with the install/runtime model.

### Block 5 - humanized communication capability

- Phase: 1
- Objective: define and integrate the `humanized-communication` capability into V3.
- Files in scope:
  - `skills/humanized-communication/SKILL.md`
  - `registry/skill_manifest.json`
  - `registry/skill_activation_rules.md`
  - `registry/preferred_skills.md`
  - `registry/skill_tiers.md`
  - relevant docs if needed
- Dependencies:
  - Block 1 accepted
  - Block 2 accepted
  - Block 4 accepted
- Expected outcomes:
  - a clear V3 skill or equivalent capability exists for humanized communication;
  - its scope and limits are explicit;
  - it fits the product tone vision.
- Validation criteria:
  - the capability is documented and registered consistently;
  - it improves developer-facing tone without overriding formal rigor;
  - the auditor confirms its scope is controlled and not overbroad.

### Block 6 - governed JIT skill acquisition

- Phase: 1
- Objective: define how the agent detects missing skills, searches trusted sources, and adapts or creates skills under V3 governance.
- Files in scope:
  - `skills/skill-manager/SKILL.md`
  - `core/08_activation_policy.md`
  - `registry/skill_activation_rules.md`
  - `registry/preferred_skills.md`
  - `registry/skill_manifest.json`
  - relevant docs if needed
- Dependencies:
  - Block 2 accepted
  - Block 3 accepted
  - Block 5 accepted
- Expected outcomes:
  - the trusted lookup order is explicit;
  - the adaptation path is explicit;
  - trust and approval states are explicit.
- Validation criteria:
  - the plan clearly covers detect, search, evaluate, adapt, register, and approve;
  - trusted sources include `skills.sh`, `agents.md`, and `github.com/obra/superpowers`;
  - the auditor confirms the process is governed and operationally clear.

### Block 7 - CI alignment to the V3 model

- Phase: 1
- Objective: ensure CI validates the chosen V3 model instead of mixed assumptions.
- Files in scope:
  - `.github/workflows/runtime-smoke.yml`
  - `.github/workflows/deploy-readiness.yml`
  - `.github/workflows/validate-kit.yml`
  - `.github/workflows/security.yml`
  - `scripts/validate-kit.sh`
- Dependencies:
  - Block 1 accepted
  - Block 3 accepted
  - Block 4 accepted
  - Block 6 accepted
- Expected outcomes:
  - CI has a clear validation model for source kit and runtime;
  - CI no longer encodes contradictory assumptions.
- Validation criteria:
  - required V3 artifacts are checked intentionally;
  - broken contract references are surfaced by CI;
  - the auditor confirms CI matches the V3 product story.

### Block 8 - Phase 1 consolidation audit

- Phase: 1
- Objective: verify that Phase 1 actually produced an operationally coherent V3 base.
- Files in scope:
  - entire repository, with focus on all files touched in Blocks 1 through 7
- Dependencies:
  - Blocks 1 through 7 accepted
- Expected outcomes:
  - a focused audit result for Phase 1;
  - a short list of residual blockers for Phase 2.
- Validation criteria:
  - the auditor can state whether the repository now qualifies as operationally V3;
  - unresolved items are explicitly listed and scoped.

### Block 9 - final low-complexity product documentation

- Phase: 2
- Objective: produce a simple final documentation story for maintainers, forkers, and integrators.
- Files in scope:
  - `README.md`
  - `README.es.md`
  - selected files under `docs/en/`
  - selected files under `docs/es/`
  - `docs/engram/index.md`
  - `specs/README.md`
- Dependencies:
  - Block 8 accepted
- Expected outcomes:
  - one short installation story;
  - one short runtime explanation;
  - one short approvals explanation;
  - one short skill/JIT explanation;
  - one short Engram and low-token explanation.
- Validation criteria:
  - documentation is complete but not bloated;
  - a forking developer can understand the product quickly;
  - the auditor confirms low-complexity onboarding.

### Block 10 - structural and functional completion audit

- Phase: 2
- Objective: confirm the repository is structurally coherent and functionally ready.
- Files in scope:
  - entire repository
- Dependencies:
  - Block 9 accepted
- Expected outcomes:
  - a structural completion audit result;
  - a functional completion audit result;
  - an explicit ready or not-ready conclusion.
- Validation criteria:
  - all critical V3 promises are tested against the repository state;
  - remaining legacy surfaces, if any, are explicitly deprecated rather than hidden;
  - the auditor can justify final acceptance with evidence.

### Block 11 - final release readiness and legacy closure

- Phase: 2
- Objective: close, deprecate, or clearly label any remaining legacy surfaces and finalize the product story.
- Files in scope:
  - `CHANGELOG.md`
  - `config/`
  - remaining legacy-impacted docs or scripts
  - any transitional compatibility surfaces left after prior blocks
- Dependencies:
  - Block 10 accepted
- Expected outcomes:
  - the repository presents itself as a finished V3 kit;
  - legacy leftovers are either removed or clearly transitional.
- Validation criteria:
  - no critical operational ambiguity remains;
  - the repository reads as a coherent product from GitHub;
  - the auditor confirms release readiness.

---

## Block dependency summary

The orchestrator must respect the following dependency chain:

- Block 1 -> Blocks 2, 3, 5, 7
- Block 2 -> Blocks 3, 5, 6
- Block 3 -> Blocks 4, 6, 7
- Block 4 -> Blocks 5, 7
- Block 5 -> Block 6
- Blocks 1 to 7 -> Block 8
- Block 8 -> Block 9
- Block 9 -> Block 10
- Block 10 -> Block 11

No later block should be accepted if an upstream dependency remains unresolved.

---

## Block report template

For every block, the orchestrator should require reports in this shape:

```md
## Block <id> - <title>
- Phase:
- Objective:
- Files in scope:
- Dependencies:
- Builder status:
- Builder changes:
- Builder risks or blockers:
- Auditor status:
- Auditor findings:
- Validation result:
- Orchestrator decision:
- Next action:
```

---

## Evidence expectations

The orchestrator must require evidence at block closeout.

Minimum acceptable evidence includes:

- file references for changed or validated files;
- specific mismatches fixed;
- specific policy text added or aligned;
- specific doc paths corrected;
- specific CI checks aligned or updated;
- explicit statement of unresolved items if any remain.

The auditor must not use vague acceptance language. The auditor must point to concrete evidence or concrete gaps.

---

## Phase 1 - urgent V3 consolidation

### Mission

Make the repository coherently V3 as quickly as possible without rebuilding everything.

### Phase 1 success definition

Phase 1 is complete only when:

- the V3 contract is explicit and internally consistent;
- the runtime `.agent/` matches the contract;
- the main scripts and entrypoints use V3 naming and behavior;
- the approval model is defined;
- the `humanized-communication` capability is designed into the system;
- the JIT skill flow is defined;
- onboarding-critical docs no longer teach legacy concepts;
- CI is no longer reinforcing contradictory models.

### Workstream 1 - formalize the master V3 contract

Required outcomes:

- make the `AGENTS.md` contract and the actual repository/runtime structure agree;
- define clearly which files are source kit assets and which are runtime artifacts;
- make the V3 contract readable by maintainers and external agents.

Detailed tasks:

- inspect `AGENTS.md` against real files in `core/`, `registry/`, `workflows/`, and `.agent/`;
- identify every broken filename, outdated path, or promised artifact that does not exist;
- correct the contract or the source/runtime assets so there is one authoritative mapping;
- document the final mapping in a simple, explicit way.

Completion criteria:

- no critical mismatch remains between `AGENTS.md` and the actual V3 file model.

### Workstream 2 - define approval and autonomy policy

Required outcomes:

- establish a clear governance model for autonomous behavior;
- ensure the developer remains in control of sensitive decisions;
- align the behavior model with the product vision.

Detailed tasks:

- identify where approval rules belong in the V3 source rules;
- define autonomous-safe actions and approval-gated actions;
- include external skill adoption in approval-gated actions;
- include architecture, deletion, renaming, dependency, deploy, security, and data changes in approval-gated actions;
- ensure docs reflect the same policy.

Completion criteria:

- the repository has one explicit approval model and it is not just implied.

### Workstream 3 - unify CLI, sync, and runtime around V3

Required outcomes:

- one clear official installation flow;
- one clear official synchronization/update flow;
- one clear official runtime generation path;
- V2 naming no longer appears as the primary operational path.

Detailed tasks:

- inspect `scripts/provision.sh`, `scripts/agent`, `scripts/sync-workspace-v2.sh`, `scripts/generate-registry.sh`, validation scripts, and related references;
- define the official V3 entrypoint and related commands;
- remove or deprecate legacy path names from the main operational docs;
- preserve compatibility only when useful for transition, but do not let legacy names remain first-class.

Completion criteria:

- maintainers and users can point to one V3 install flow and one V3 sync flow without ambiguity.

### Workstream 4 - make `.agent/` an actual V3 runtime

Required outcomes:

- the installed runtime reflects the source kit contract;
- state files and rule filenames no longer conflict with V3 expectations;
- the runtime is trustworthy for downstream agents.

Detailed tasks:

- inspect `.agent/core/`, `.agent/registry/`, `.agent/workflows/`, and `.agent/state/` against the source kit;
- resolve legacy state artifacts such as conflicting command maps;
- resolve naming mismatches between source and provisioned runtime;
- ensure required V3 runtime artifacts are produced consistently.

Completion criteria:

- a provisioned runtime can be described as V3 without qualification.

### Workstream 5 - design and integrate `humanized-communication`

Required outcomes:

- define the new capability as part of the V3 system;
- keep the tone soft, friendly, and human;
- preserve technical precision and safety.

Detailed tasks:

- create a V3 design for `humanized-communication` based on the product tone requirements;
- use `blader/humanizer` only as inspiration and pattern input;
- define where the capability applies and where it must be limited;
- ensure it supports developer-facing communication, summaries, docs, and guidance;
- ensure it does not weaken core rule strictness.

Completion criteria:

- the repository has a clear and governable design for humanized communication.

### Workstream 6 - define governed JIT skill acquisition

Required outcomes:

- the agent knows how to detect a missing skill;
- the agent knows where to look for trusted sources;
- the agent knows how to adapt or create a skill under V3 rules;
- the process preserves low token usage and developer control.

Detailed tasks:

- define the missing-skill detection logic in plain operational terms;
- define trusted lookup order: local registry first, then trusted sources;
- define evaluation and adaptation requirements;
- define what makes a sourced skill trusted, reviewed, pending, or blocked;
- define when the agent must request approval;
- define the expected registry update behavior after adoption.

Completion criteria:

- the repository has a complete JIT skill governance design, not just a vague aspiration.

### Workstream 7 - remove onboarding-blocking legacy documentation

Required outcomes:

- developers reading docs no longer learn obsolete directory names or scripts;
- GitHub onboarding becomes simple and credible;
- the documentation reflects V3 rather than historical leftovers.

Detailed tasks:

- inspect README files, usage guides, getting started docs, architecture docs, skills docs, and release/process docs;
- remove or replace references such as `.devkit`, `skills_registry`, `bootstrap-workspace.sh`, `install-rules.sh`, `install-skills.sh`, `install-workflows.sh`, and `sync-workspace.sh` where those are no longer first-class or do not exist;
- keep docs concise and oriented to the actual install and usage path;
- preserve useful historical intent only if clearly marked as deprecated or background.

Completion criteria:

- a new developer can read the main docs and follow the V3 path without hitting legacy confusion.

### Workstream 8 - align CI with the chosen V3 model

Required outcomes:

- CI validates the real V3 contract;
- CI does not simultaneously reinforce conflicting architectural models;
- validation covers the source kit and/or runtime intentionally rather than accidentally.

Detailed tasks:

- inspect workflows under `.github/workflows/`;
- identify checks that validate root source assets versus checks that validate a provisioned runtime;
- explicitly decide the CI model and make the distinction clear if both are retained;
- ensure CI checks required V3 artifacts, contract consistency, and critical provisioning behavior.

Completion criteria:

- CI supports the new V3 narrative instead of exposing mixed-version assumptions.

### Phase 1 deliverables

The executing agent must produce all of the following outcomes:

- a coherent written V3 contract;
- a defined approval/autonomy policy;
- a unified V3 install/sync/runtime path;
- a consistent `.agent/` runtime model;
- a defined `humanized-communication` capability;
- a defined JIT skill acquisition model using trusted sources;
- cleaned onboarding-critical docs;
- CI aligned to V3.

---

## Phase 2 - V3 completion audit and product finalization

### Mission

Audit, simplify, and finish the repository so it becomes a low-complexity, production-ready V3 GitHub kit.

### Phase 2 success definition

Phase 2 is complete only when:

- the repository passes a full V3 completion audit;
- documentation is complete but low complexity;
- the product can be understood and integrated by fork-based adopters;
- the agent is ready to operate with full instructions;
- no critical legacy contradiction remains in operational paths.

### Workstream 1 - run a full structural completion audit

Required outcomes:

- confirm consistency across contracts, runtime, docs, scripts, workflows, registry, and CI;
- identify any remaining V1/V2 leftovers that affect actual use;
- close structural gaps before declaring completion.

Detailed audit scope:

- `AGENTS.md`
- `core/`
- `registry/`
- `skills/`
- `workflows/`
- `.agent/`
- `scripts/`
- `README.md`
- `README.es.md`
- `docs/`
- `.github/workflows/`
- `config/`
- `specs/`
- `docs/engram/`

Completion criteria:

- no critical structural contradiction remains across the operational system.

### Workstream 2 - run a functional completion audit

Required outcomes:

- confirm the agent can operate as intended, not just look correct on disk;
- verify the core product promises are actually covered.

Functional audit checklist:

- the agent follows workflows;
- the agent uses Engram for durable memory;
- the agent maintains low-context discipline;
- the agent speaks with the intended human tone;
- the agent detects missing skills;
- the agent can search trusted skill sources;
- the agent can adapt or create local skills under V3 governance;
- the agent asks for approval when required;
- the runtime can be provisioned and validated reliably.

Completion criteria:

- the functional checklist is satisfied with evidence.

### Workstream 3 - produce low-complexity final documentation

Required outcomes:

- a maintainer can manage the kit;
- a forking developer can understand the product quickly;
- an integrating developer can install the runtime with minimal friction.

Documentation audiences:

- kit maintainers;
- developers forking the repository;
- developers installing the runtime into a target project.

Documentation goals:

- one short installation story;
- one short runtime explanation;
- one short explanation of approvals and autonomy;
- one short explanation of skills and JIT acquisition;
- one short explanation of Engram and low-token discipline.

Completion criteria:

- the documentation is complete enough for real use but not bloated.

### Workstream 4 - finalize the GitHub product experience

Required outcomes:

- the repository is ready to serve as a public source kit;
- forks inherit a simple story;
- updates from upstream remain understandable.

Detailed tasks:

- ensure the main README reflects the final V3 path;
- ensure the repository structure is understandable from GitHub alone;
- ensure maintainers can explain how source kit assets become runtime assets;
- ensure the path for future updates is not hidden behind legacy naming.

Completion criteria:

- the repository reads like a coherent product rather than an internal migration state.

### Workstream 5 - validate continuous integration and operational readiness

Required outcomes:

- CI proves the repository can support repeated installs and validations;
- the finished V3 product is operationally credible.

Minimum readiness checks:

- provision in a mock repository;
- validate required runtime artifacts;
- validate source kit critical files;
- validate registry generation;
- validate docs and rule references do not point to missing critical artifacts;
- validate the runtime remains internally coherent after install/sync.

Completion criteria:

- CI and validation scripts support the final V3 release story.

### Workstream 6 - close or explicitly deprecate remaining legacy surfaces

Required outcomes:

- anything still legacy is either removed or clearly marked transitional;
- the final repo does not hide version confusion behind compatibility leftovers.

Detailed tasks:

- inspect remaining old names, old commands, old docs, and outdated config semantics;
- decide whether each item is removed, migrated, deprecated, or temporarily retained;
- ensure retained compatibility surfaces are documented as transitional rather than canonical.

Completion criteria:

- the repository no longer presents version ambiguity as normal.

### Phase 2 deliverables

The executing agent must produce all of the following outcomes:

- a full structural completion audit result;
- a full functional completion audit result;
- low-complexity final documentation;
- a GitHub-ready product presentation;
- validated CI and operational readiness;
- explicit closure or deprecation of remaining legacy surfaces.

---

## Repository-specific legacy problems already known

The executing agent must assume the following classes of legacy problems already exist and must be checked carefully:

- references to `skills_registry` instead of `registry` or `.agent/registry`;
- references to `.devkit` instead of `.agent`;
- references to old install scripts such as `bootstrap-workspace.sh`, `install-rules.sh`, `install-skills.sh`, and `install-workflows.sh`;
- references to old sync scripts such as `sync-workspace.sh`;
- references to V2 naming in CLI or sync flows;
- mismatches between promised runtime artifacts and actual `.agent/` contents;
- mismatches between filenames named in `AGENTS.md` and files actually present in source/runtime;
- mixed validation in CI between root source assets and runtime assets without a clear model.

The executing agent must verify these classes, not assume they were already fixed.

---

## Operational checklist for the external executing agent

The external agent executing this plan must do the following:

1. Read this document fully before making changes.
2. Treat `AGENTS.md`, `core/`, and `.agent/` as the center of the V3 model.
3. Preserve the current structure wherever possible.
4. Prioritize coherence over novelty.
5. Prioritize install simplicity for GitHub and forks.
6. Do not skip the approval model.
7. Do not skip the human communication layer.
8. Do not skip the JIT skill model.
9. Do not skip Engram and low-token discipline.
10. Do not declare completion until both phases are satisfied.

---

## Definition of done

This initiative is complete only when all of the following are true:

- the repository can be described as a coherent V3 kit without caveats;
- the install and sync story is simple for GitHub users and forks;
- the runtime `.agent/` is structurally and operationally consistent;
- the developer approval model is embedded in the system;
- the agent can communicate in a human, friendly, technically clear tone;
- the agent can detect, source, adapt, and register skills under governance;
- Engram and low-token context discipline are preserved;
- docs are simple and accurate;
- CI validates the chosen V3 product model;
- no critical legacy contradiction remains in the main operational path.

---

## Final instruction to the executing agent

Do not treat this as a generic cleanup.

Treat it as a structured V3 product consolidation and finalization effort.

The target is not just a cleaner repository. The target is a coherent, GitHub-ready, low-complexity AI engineering workspace kit with:

- a master V3 contract;
- governed autonomy;
- human communication;
- JIT skill acquisition from trusted sources;
- durable memory through Engram;
- low token consumption;
- workflow compliance;
- and a finished operational story for real developers.
