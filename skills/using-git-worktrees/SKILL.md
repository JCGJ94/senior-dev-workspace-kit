# Using Git Worktrees

## Purpose
Manage multiple active branches or tasks in parallel without switching branches in the main directory, preserving build state and minimizing context switching overhead.

## Use when
- You need to perform a critical bugfix while working on a long-term feature.
- Comparing behavior or running tests on different branches simultaneously.
- Performing code reviews that require local execution without disturbing your current workspace.
- Managing multiple environments (staging vs. main) side-by-side.

## Do not use when
- The task is simple and branch switching is trivial.
- The repository is not versioned with Git.
- Disk space is extremely limited (worktrees create a new checkout).

## Git Worktree Workflow

1. **Assess the Need**
   - Confirm that switching branches would be more expensive than creating a worktree (e.g., due to heavy build artifacts or environment setup).

2. **Create a New Worktree**
   - Use `git worktree add <path> <branch>` to create a separate checkout in a dedicated directory outside the main project root.
   - If the branch doesn't exist, use `-b <new-branch>`.

3. **Isolate Environment State**
   - Understand that each worktree might need its own `node_modules`, `.env`, or build cache depending on the repository structure.
   - Run `[OP_INSTALL]` in the new worktree path before executing logic.

4. **Task Execution**
   - Perform the secondary task in the worktree directory.
   - Verify changes using the worktree's local context and tooling.

5. **Commit & Cleanup**
   - Commit changes within the worktree.
   - Once the task is finished and merged/pushed, remove the worktree with `git worktree remove <path>`.
   - Ensure no stale worktree directories are left behind.

6. **Prune Stale Metadata**
   - Use `git worktree prune` if directories were manually deleted to clean up Git's internal tracking.

## Rules
- **Path Separation**: Always create worktrees in a predictable location (e.g., `../worktrees/<branch-name>`) to avoid cluttering the main project root.
- **Lock Management**: Be aware that some lockfiles or databases might conflict if two worktrees access them simultaneously.
- **Explicit Cleanup**: Always remove the worktree via Git commands once the task is done.
- **State Awareness**: Never assume a worktree shares the same build artifacts as the main folder.

## Context Efficiency
- Only load files from the active worktree involved in the secondary task.
- Avoid cross-referencing files from the main directory to prevent path confusion.

## Validation
- The worktree was created successfully.
- The task was completed and committed in the correct branch.
- The worktree was removed and resources were cleaned up.
- The main workspace remains undisturbed.

## Output

Return a Worktree Management Report:

### Worktree Path
Location of the parallel checkout.

### Target Branch
Branch being worked on in the worktree.

### Task Status
Status of the secondary task.

### Cleanup Status
Confirmation that the worktree was removed or is ready for removal.