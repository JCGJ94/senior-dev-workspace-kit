---
name: "find-skills"
description: "Discover and integrate new capabilities from the open agent skills ecosystem for specialized domain problems."
tier: 2
triggers: ["find skill", "discover skill", "skill search", "new capability", "install skill", "what skill"]
context_cost: 250
---
# Find Skills

## Purpose
Helps discover and integrate new capabilities from the open agent skills ecosystem when interacting regarding specific domain problems or functionality extensions.

## Use when
- Seeking help with specialized domains (e.g., design, testing, DevOps) and wanting tooling.
- You need a workflow, template, or specialized instructions that are not currently in the local skills registry.
- Exploring community-contributed best practices via the Skills CLI.

## Do not use when
- The capability is already covered by a firmly established local skill (e.g., `frontend`, `backend`).
- The task is highly specific to the current proprietary codebase and no generic skill applies.

## The Skills CLI Workflow
The Skills CLI (`npx skills`) is the package manager for agent skills (reference: `https://skills.sh/`).

1. **Search**: Use `npx skills find [query]` to look for domain-specific skills (e.g., `npx skills find react performance`).
2. **Review**: Identify relevant packages from repositories like `vercel-labs/agent-skills` or `ComposioHQ`.
3. **Install**: Use `npx skills add <package> -g -y` to install the skill globally without interactive prompts.

## Rules
- **Intent Detection**: Continuously analyze problems to see if a community skill might provide an optimal workflow.
- **Prioritize Known Repositories**: Give preference to established providers (Vercel, GitHub, Anthropic, etc.) when finding skills.
- **Graceful Degradation**: If no skill is found, acknowledge it and fulfill the request using standard generalized knowledge.

## Context Efficiency
- Do not aggressively search for skills on trivial questions.
- Keep the search queries concise (1-2 keywords max).

## Validation
- The suggested skill matches the exact domain and technical need of the task.
- The command provided for installation uses the direct semantic format and skips interaction (`-y`).

## Output

Return a Skill Discovery Summary:
### Found Skills
Summary of the capabilities discovered from the repository.
### Installation Command
The copy-pasteable execution command (`npx skills add ...`).
### Utilization Plan
Brief outline of how this skill will be leveraged for the current task upon installation.
