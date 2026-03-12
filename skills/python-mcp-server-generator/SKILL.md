# Python MCP Server Generator

## Purpose
Generate a complete, production-ready Model Context Protocol (MCP) server project in Python with tools, resources, and proper configuration using `mcp[cli]` and `FastMCP`.

## Use when
- Creating a new Model Context Protocol (MCP) server in Python.
- Setting up stdio or streamable-http MCP integrations.
- Implementing MCP tools, resources, and prompts with `FastMCP`.

## Do not use when
- Building an MCP client (this is for servers).
- Developing in non-Python environments (e.g., TypeScript MCPs).
- The task requires simple standalone scripts without MCP integration.

## Implementation Details

### Project Setup
- Initialize securely with `uv init project-name`
- Add MCP SDK dependency: `uv add "mcp[cli]"`
- Create the main server file (e.g., `server.py`) with `if __name__ == "__main__":` execution block.

### Server Configuration
- Inherit or instantiate `FastMCP` from `mcp.server.fastmcp`.
- Choose transport: `stdio` (default for local) or `streamable-http`.
- For HTTP servers, consider `stateless_http=True` for scalability and JSON response mode.

### Tool & Resource Implementation
- Decorate functions with `@mcp.tool()`.
- Define dynamic resources using `@mcp.resource("resource://{param}")`.
- Create Prompts returning strings or Message lists with `@mcp.prompt()`.
- Use async operations for anything I/O-bound.

## Rules
- **Type Safety is Mandatory**: Type hints must be used everywhere; they automatically generate MCP schemas.
- **Use Docstrings**: Write clear docstrings for tools; they compile into tool descriptions.
- **Output Structuring**: Use Pydantic models or TypedDicts for complex returned data.
- **Stderr Logging**: Always log to standard error (or through MCP's Context logging) to avoid polluting standard output, which MCP relies on for `stdio`.
- **Validation Early**: Validate parameters at the boundary before processing.

## Context Efficiency
- Only focus on the specific tools and server configurations required for the user's objective.
- Avoid building complex business logic into the MCP layer; keep tools as thin wrappers around existing logic if possible.

## Validation
- Verify the server initializes without errors locally.
- Confirm all tools have clear type annotations that correspond to valid JSON Schemas.
- The server responds correctly on the chosen transport type.

## Output

Return a Structured Delivery containing:
### Server Foundation
Initial configuration, `FastMCP` setup, and transport definition.
### Tool Specifications
Implementation of requested tools with type hints and docstrings.
### Instructions for Use
Commands to execute the server (`python server.py` or `uv run mcp dev server.py`).
