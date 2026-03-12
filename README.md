```text
       ___  ____
      / _ \/  _/
     / __ _/ /  
    /_/ |_/___/ 
                
   A G E N T   K I T
```

**English** | [Español](README.es.md)

The **AI Engineering Workspace Kit** is a purpose-built runtime designed to contextualize, constrain limit, and empower AI agents (such as Claude, Cursor, Copilot, or Gemini) executing within a standard repository.

It provisions a lightweight, strictly-typed `.agent/` orchestrator that establishes base operational ground truths for your codebase.

---

## The Problem

Foundational models lack persistent context regarding a project's architectural standards and its current tech stack. This leads to "vibe-coding": generating code that superficially works but violates the underlying codebase design principles.

## The Solution

The Kit injects a predictable architecture into the project. It acts as the bridge between LLM reasoning and the source code.

1. **Determinism:** Autodetects the working environment (e.g., Node, Bun, Python) and adapts execution tokens accordingly.
2. **Skill System:** Provides a standardized suite of capabilities for analysis, refactoring, and quality-of-code operations.
3. **Strict Workflows:** Forces the agent to follow empirical Standard Operating Procedures (SOPs) for features, bugfixes, and releases.

---

## Quick Start Installation

For a professional deployment, the kit functions as a "Master Suite" that injects the AI brain into your target projects.

### 1. Set up the Master Suite (Clone)
Clone this repository into a stable directory on your machine (e.g., `~/tools/`):

```bash
# Clone the kit into a tools directory
mkdir -p ~/tools && cd ~/tools
git clone https://github.com/YOUR_USER/ai-engineering-workspace-kit.git
```

### 2. Inject into your Project
Navigate to your project's root (new or existing) and run the initializer:

```bash
# Enter your project directory
cd /path/to/your/project

# Run the agent (pointing to where you cloned the kit)
bash ~/tools/ai-engineering-workspace-kit/scripts/agent init
```

That's it! The agent will autodetect your stack and configure the `.agent/` environment automatically.

---

## Runtime Architecture

Once initialized, the repository root will contain a hidden `.agent/` directory. This acts as the operational brain.

- `core/`: Foundational behavior rules.
- `registry/`: Local manifests and routing rules for operative skills.
- `skills/`: A library of atomic technical capabilities executable by the LLM.
- `workflows/`: Step-by-step Standard Operating Procedures for complex tasks.
- `state/`: Analyzed environment topology and dynamic configuration.

---

## Auditing and Orchestration

The kit incorporates hallucination-detection capabilities ("Doctor") by forcing the agent to ground its code via actual context from repositories like Context7 (if available) and MCP (Model Context Protocol) ecosystems.

To audit connectivity availability and runtime health:

```bash
bash path/to/ai-engineering-workspace-kit/scripts/agent doctor
```

To force a synchronization of the base state and skills when the upstream has been updated:

```bash
bash path/to/ai-engineering-workspace-kit/scripts/agent sync
```

---

*Built for precision AI-driven engineering.*