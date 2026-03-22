# Pedrito — Agent Modes

Pedrito is a multi-agent system. Each mode activates a specialized set of skills tuned for a specific developer workflow problem. You activate what you need — the rest stays dormant to keep context clean and reasoning sharp.

---

## Overview

| Mode | When to use | Core skills activated |
|------|-------------|----------------------|
| [Code Analyzer](#code-analyzer) | Architecture reviews, tech debt audits, security posture checks | `code-review-pro`, `architect-orchestrator-v3` |
| [Debugging Assistant](#debugging-assistant) | Bug hunts, regression isolation, production incidents | `debugging`, `systematic-debugging` |
| [Docs Generator](#docs-generator) | API references, ADRs, changelogs, onboarding guides | `docs-pro`, `commit-sentinel` |
| [Prompt Optimizer](#prompt-optimizer) | Reduce hallucinations, improve AI output quality, cut token waste | `context-keeper`, `context7` |
| [Orchestrator](#orchestrator) | Multi-step workflows, coordinated agent execution, complex migrations | `architect-orchestrator-v3`, `sdd-manager` |
| [Code Reviewer](#code-reviewer) | PR reviews, security gates, commit quality enforcement | `security-reviewer`, `commit-sentinel`, `code-review-pro` |
| [Test Verifier](#test-verifier) | TDD enforcement, coverage verification, regression gates | `test-driven-development`, `test-verifier` |

---

## Code Analyzer

**Problem it solves:** You need an objective read on the health of a codebase — not a linter, not a style check, but a senior-level architectural audit that surfaces what actually matters.

**What Pedrito does:**
- Maps module dependencies and identifies coupling hotspots
- Detects architectural drift against stated design decisions
- Flags security vulnerabilities and risky patterns (OWASP Top 10, injection, auth gaps)
- Quantifies tech debt by area — gives you a prioritized list, not just a warning count
- Cross-references findings against Engram memory to distinguish new issues from known accepted trade-offs

**Example prompt:**
```
Analyze the auth module for security posture and architectural debt.
Flag anything that would block a SOC 2 audit.
```

**Output you get:**
- Structured findings ranked by severity
- Specific file/line references
- Recommended remediation path per finding
- SDD spec draft if remediation is non-trivial

**Skills activated:** `code-review-pro`, `architect-orchestrator-v3`, `security-reviewer`

---

## Debugging Assistant

**Problem it solves:** You have a bug. You don't know where it lives or why it started. You need systematic elimination, not random guessing.

**What Pedrito does:**
- Applies a structured root cause analysis framework before touching any code
- Traces execution paths and narrows the failure surface
- Isolates regressions using git history and Engram incident memory
- Proposes a fix only after the root cause is confirmed — never before
- Documents the incident in Engram so the team doesn't debug the same thing twice

**Example prompt:**
```
The payment webhook is silently failing in staging but passing in local.
Trace the failure and find the root cause.
```

**Output you get:**
- Root cause statement with evidence
- Reproduction steps
- Fix proposal with explanation
- Engram incident entry for future reference

**Skills activated:** `debugging`, `systematic-debugging`, `verification-before-completion`

---

## Docs Generator

**Problem it solves:** Your code ships but your docs don't. ADRs never get written. Changelogs are inconsistent. Onboarding takes days because nothing is documented.

**What Pedrito does:**
- Generates API reference docs directly from code — no manual spec writing
- Writes Architecture Decision Records (ADRs) from SDD specs and Engram decisions
- Produces changelogs from git history with semantic grouping
- Creates onboarding guides tailored to the project's actual structure
- Maintains docs as code — stored in version control, reviewable, auditable

**Example prompts:**
```
Generate an ADR for the decision to use event sourcing in the orders service.
```
```
Write the CHANGELOG entry for the v2.1.0 release based on commits since v2.0.0.
```

**Output you get:**
- Markdown documents ready to commit
- Consistent structure across all doc types
- Stored in the right place (`specs/`, `docs/`, `docs/engram/decisions/`)

**Skills activated:** `docs-pro`, `commit-sentinel`, `engram-manager`

---

## Prompt Optimizer

**Problem it solves:** Your AI outputs are inconsistent, too verbose, or confidently wrong. You're spending tokens on noise and getting hallucinations on critical details.

**What Pedrito does:**
- Audits your existing prompts for structural anti-patterns (vague instructions, missing constraints, context overload)
- Rewrites prompts using low-context discipline principles
- Designs context windows that include only what the model needs — no more
- Validates outputs against expected behavior before calling a prompt "done"
- Syncs real-time library docs via Context7 so prompts reference current APIs, not stale ones

**Example prompt:**
```
Review the prompts in /src/ai/prompts/ and optimize them for precision and token efficiency.
```

**Output you get:**
- Annotated analysis of each prompt's weaknesses
- Rewritten versions with explanations
- Token count comparison before/after
- Validation test cases

**Skills activated:** `context-keeper`, `context7`, `humanized-communication`

---

## Orchestrator

**Problem it solves:** Your task is too large for a single agent pass. It involves multiple concerns — analysis, planning, implementation, verification — and needs coordination across them without losing state.

**What Pedrito does:**
- Breaks complex workflows into a 9-phase SDD lifecycle (Intake → Explore → Proposal → Spec → Design → Tasks → Apply → Verify → Archive)
- Spins up specialized sub-agents for each phase and coordinates their outputs
- Maintains a shared spec artifact so every agent works from the same ground truth
- Enforces approval gates between phases — you stay in control of the critical decisions
- Archives the complete workflow in `specs/<change-id>/` for future audit

**Example prompts:**
```
Migrate the user service from REST to GraphQL. Plan, spec, and implement.
```
```
Refactor the billing module to support multi-currency. Full SDD workflow.
```

**Output you get:**
- Phased execution with visible checkpoints
- Auditable spec artifacts
- Approval gates before destructive or irreversible steps
- Complete archive of decisions and rationale

**Skills activated:** `architect-orchestrator-v3`, `sdd-manager`, `engram-manager`, `writing-plans`, `executing-plans`

---

## Code Reviewer

**Problem it solves:** PR reviews are inconsistent. Security issues slip through. Commit history is a mess. You need a reviewer that doesn't get tired, doesn't skip the hard parts, and enforces standards every time.

**What Pedrito does:**
- Reviews PRs for correctness, security, and architectural alignment
- Runs security gate checks (injection vectors, auth patterns, data exposure risks)
- Audits commit messages for conventional commit compliance and clarity
- Cross-references changes against Engram decisions to catch drift from agreed architecture
- Blocks approval if verification gates haven't been met

**Example prompt:**
```
Review the PR for the payments refactor. Focus on security and API contract changes.
```

**Output you get:**
- Structured review with severity-ranked findings
- Security gate pass/fail report
- Commit history health summary
- Explicit approval or block with reasoning

**Skills activated:** `code-review-pro`, `security-reviewer`, `commit-sentinel`, `verification-before-completion`

---

## Test Verifier

**Problem it solves:** Tests exist but they don't prove the right things. Coverage numbers look good but regressions still ship. TDD discipline erodes under deadline pressure.

**What Pedrito does:**
- Enforces TDD — tests must be written before or alongside implementation, not after
- Verifies that test coverage actually covers the risk surface, not just happy paths
- Runs verification gates before marking any task complete
- Detects and flags tests that pass by accident (weak assertions, missing edge cases)
- Stores verification results as evidence in the SDD spec artifact

**Example prompt:**
```
Verify the test coverage for the authentication module. Flag any risk surface that isn't covered.
```

**Output you get:**
- Coverage map with gap analysis
- List of missing edge cases and risky uncovered paths
- Verification gate pass/fail
- Recommendations for specific test additions

**Skills activated:** `test-driven-development`, `test-verifier`, `verification-before-completion`, `systematic-debugging`

---

## Combining Modes

Modes can be chained. The Orchestrator naturally calls on other modes as sub-agents during an SDD workflow. A typical complex task might flow through:

```
Orchestrator → Code Analyzer (Explore phase)
             → Code Reviewer (Apply phase)
             → Test Verifier (Verify phase)
             → Docs Generator (Archive phase)
```

Pedrito manages this coordination. You see the checkpoints and approve the gates. The agents do the work.

---

## JIT Mode Discovery

If your workflow doesn't map to any of these modes, Pedrito can discover additional skills Just-In-Time from trusted registries. New capabilities are always presented for your approval before activation. See [03_skills_management.md](03_skills_management.md) for details.
