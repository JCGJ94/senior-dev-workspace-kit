---
name: "python-performance-optimization"
description: "Profile, analyze and optimize Python code using cProfile, line_profiler and memory_profiler to eliminate bottlenecks."
tier: 2
triggers: ["python performance", "optimize python", "profile python", "slow python", "python bottleneck", "latency python"]
context_cost: 500
---
# Python Performance Optimization

## Purpose
Profile, analyze, and optimize Python code using proper tooling (cProfile, line_profiler, memory_profiler) and implementation best practices to eliminate bottlenecks and reduce latency/memory consumption.

## Use when
- Identifying performance bottlenecks in Python applications.
- Reducing application latency and improving CPU-intensive operations.
- Tracking down memory leaks or optimizing memory footprint.
- Speeding up data processing and database queries.

## Do not use when
- The codebase is prioritizing rapid prototyping over efficiency.
- The performance issue originates outside Python (e.g., network latency from an external API).
-Premature optimization is not warranted (the code is fast enough).

## Core Concepts & Tools
- **CPU Profiling**: Use `cProfile` and `pstats` to identify time-consuming function calls globally.
- **Line Profiling**: Use `line_profiler` (`@profile`) to inspect granularity if one function is deeply problematic.
- **Memory Profiling**: Use `memory_profiler` (`@profile`) to track peak usage.
- **Production Profiling**: Use `py-spy` for sampling without modifying the code.

## Optimization Strategies
1. **Algorithmic Changes**: Move from O(n^2) to O(n) or O(log n); rely on `dict`/`set` lookups (O(1)) instead of list scans (O(n)).
2. **Implementation Patterns**: Use list comprehensions, generator expressions for memory efficiency, and `str.join()` over string concatenation (`+`).
3. **Data Structures**: Use `__slots__` for memory improvements on large object counts; embrace `collections` and `itertools`.
4. **Vectorization**: Defer to `numpy` or `pandas` C-extensions for heavy numerical or matrix computations.
5. **Caching**: Leverage `@functools.lru_cache` for pure recursive or repetitive functions.
6. **Concurrency**: Use `asyncio` / `aiohttp` for I/O-bound tasks; `multiprocessing` for CPU-bound tasks.
7. **Database Batching**: Opt for `executemany` over iterative inserts.

## Rules
- **Profile First**: Never guess bottlenecks. Measure before optimizing.
- **Preserve Behavior**: Performance optimizations must not alter the correct business logic.
- **Generators over Lists**: When data size is enormous, use generators `(x for x in ...)` instead of comprehensions `[x for x in ...]`.
- **Local Variable Priority**: Python resolves local variables faster than globals; localize lookups in hot loops.

## Context Efficiency
- Only load and review the specific files flagged as slow or memory-intensive.
- Do not optimize components that consume <1% of the application's runtime.

## Validation
- A measurable speedup or memory reduction must be demonstrated (e.g., using `timeit`).
- Existing unit tests MUST pass without modifications.
- Production profiling confirms the elimination of the targeted bottleneck.

## Output

Return a Structured Performance Report:
### Bottleneck Identification
Where the original code was failing or performing poorly based on profiles.
### Optimization Strategy
Explanation of the applied pattern (e.g., caching, algorithmic fix).
### Code Implementation
The optimized piece of code.
### Performance Difference
Before/After metrics demonstrating the improvement.
