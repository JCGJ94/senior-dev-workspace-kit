# MCP Builder

## Purpose
Guide the creation of high-quality Model Context Protocol (MCP) servers that enable LLMs to interact with external services through well-designed, constrained, and secure tools.

## Use when
- Building an MCP server to integrate external APIs.
- Developing in TypeScript (via `@modelcontextprotocol/sdk`) or Python (via `mcp[cli]` or `FastMCP`).
- Creating comprehensive evaluations to test MCP effectiveness.

## Do not use when
- Developing standard REST/GraphQL APIs that do not need to be interacted with by an LLM via the MCP protocol.
- The user is only acting as a client calling existing tools.

## Development Phases
1. **Deep Research**: Understand modern MCP design, prioritize comprehensive API coverage vs. workflow tools, design clear tool schemas.
2. **Implementation**: Set up project structure, build core infrastructure, and implement `@mcp.tool()` or `server.registerTool` endpoints with Zod/Pydantic validation.
3. **Review & Test**: Evaluate via MCP Inspector, ensure actionable error messages, and verify structured outputs.
4. **Evaluations**: Create complex, realistic questions mapping to the implemented server tools to test LLM effectiveness.

## Rules
- **Type Safety is Mandatory**: Use Zod or Pydantic to tightly constrain input schemas.
- **Actionable Errors**: Return error messages that actually guide the agent towards an alternative syntax or parameter if they make a mistake.
- **Support Pagination**: Build pagination into GET tools natively.
- **Provide Structured Data**: Return both text content and JSON structured content for tool responses when supported by the SDK.

## Context Efficiency
- Only scan the required endpoint specifications from the underlying API integration, rather than loading the entire SDK reference code.

## Validation
- Compilation/interpreter builds cleanly without types dropping to `any`.
- Server launches locally via stdio or streamable-http without immediate crashing.
- End-to-end tests confirm the agent can naturally utilize the tool without context leakage.

## Output

Return an MCP Server Development Report:
### Progress Snapshot
Phase 1, 2, 3, or 4 status update.
### Tool Specifications
The name, schema, and docstrings of the tools implemented or modified.
### Testing Results
Inspector or manual tool evaluation findings.
