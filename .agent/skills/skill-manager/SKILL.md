---
name: "skill-manager"
description: "Act as a JIT (Just-In-Time) Package Manager for AI capabilities. Dynamically download, standardise, and install missing skills based on the task requirement."
tier: 2
triggers: ["install skill", "fetch capability", "missing skill", "need workflow", "jit"]
context_cost: 250
---

# Skill Manager (JIT Capability Installer)

## Purpose
Enables the AI agent to extend its capabilities mid-workflow using a governed Just-In-Time protocol. If a task implies a missing capability, the agent should search trusted sources, request approval when required, and adapt the skill to the local V3 format before activation.

## Use when
- You receive an instruction for a complex task (e.g., configure GitHub actions) but lack a specific local skill for it.
- A workflow explicitly tells you to use an external tool or framework, but its rules aren't in your registry.
- You encounter an obsolete library and need to download an updated internal skill.

## Do not use when
- Your task can be solved completely and safely with local core rules or currently active skills.
- The capability requested implies no reproducible workflow (don't force standardise simple tasks).

## Workflow Execution (The Pipeline)
1. **Identify Gap:** Acknowledge that the requested capability is missing locally. Identify the hypothetical canonical name for it (e.g., `git-worktrees-pro`, `react-19-router-fix`).
2. **Check Local and Trusted Upstream:** Run the manager script to check the trusted local upstream first:
   \`\`\`bash
   bash scripts/skill-manager.sh install <skill-name>
   \`\`\`
3. **Parse Output:** 
    - If the script outputs \`✅ Download successful\`, the new skill is injected into \`.agent/skills/\` and the registry has been regenerated. Read the new \`SKILL.md\` immediately and fulfill the task using its new rules.
    - If the script outputs \`⚠️ Skill not found\`, the Upstream repo did not contain this specific skill.
4. **Fallback & Standardization:** If Upstream fails:
    - Search trusted external sources in this order: \`skills.sh\`, \`agents.md\`, \`github.com/obra/superpowers\`.
    - Summarize the source, purpose, and expected impact to the developer and ask for approval before adoption.
    - If approval is granted, activate the \`skill-creator\` tool.
    - Instruct \`skill-creator\` to parse the source content and create a native, compliant \`SKILL.md\`, placing it inside \`.agent/skills/<skill-name>/\`.
    - Run \`bash scripts/generate-registry.sh\` to register it locally.

## Rules
- **No Manual Modding:** Do NOT try to manually edit \`skills.json\`. The script or the \`generate-registry.sh\` will handle indexing securely.
- **Strict Verification:** Once a skill is successfully installed, you MUST reload your operational context and follow the newly installed \`SKILL.md\` constraints immediately.
- **Approval Gate:** External skill adoption requires developer approval before the skill enters the runtime.
- **Fail Fast:** If the JIT installation from Upstream and external sources both fail, inform the user clearly that the skill does not exist and ask if they prefer manual resolution.

## Validation
Before acting on a newly installed skill, confirm:
- The \`.agent/skills/<skill-name>/SKILL.md\` exists.
- The registry script ran without errors.
- The new constraints apply accurately to the current project framework.
