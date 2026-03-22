---
name: "supabase-postgres-best-practices"
description: "Apply Supabase Postgres performance optimization rules for low-latency, scalable and secure database interactions."
tier: 2
triggers: ["supabase", "postgres", "postgresql", "database optimization", "sql performance", "connection pooling"]
context_cost: 500
---
# Supabase Postgres Best Practices

## Purpose
Apply comprehensive Postgres performance optimization rules and best practices compiled by Supabase to ensure low-latency, scalable database interactions, secure configurations, and efficient data storage.

## Use when
- Writing, reviewing, or optimizing Postgres SQL queries.
- Designing schema, adding indexes, or configuring scaling/connection pooling.
- Working with Row-Level Security (RLS) policies.

## Do not use when
- Operating on non-Postgres databases (e.g., MongoDB, Redis).
- The task is strictly frontend or middle-tier application logic with no database interplay.

## Strategies & Focus Areas
1. **Query Performance**: Indexing strategies, avoiding heavy seq scans, checking join performance.
2. **Connection Management**: Preventing connection exhaustion using PgBouncer/Supavisor configurations.
3. **Security & RLS**: Optimizing complex Row Level Security policies to avoid nested queries or slow execution.
4. **Schema Design**: Balancing normalization vs denormalization, usage of specialized Postgres types (e.g., JSONB, UUID arrays).

## Rules
- **Consult the References**: Read specific rule files from `skills/supabase-postgres-best-practices/references/` when tasked with an explicit database query refactor for detailed nuances (if available locally).
- **Always use EXPLAIN**: Do not blindly optimize production queries. Use `EXPLAIN ANALYZE` or logical analysis to verify theoretical plan improvements.
- **Prefer Partial Indexes**: When filtering on active flags, statues, or booleans, favor partial indexes to shrink index sizes.
- **Optimize RLS**: Ensure RLS expressions don't execute subqueries on every row lookup. Use security definer functions sparingly but optimally.

## Context Efficiency
- Do not blanket-scan the entire database schema if not requested. Target only the tables involved in the user's specific performance hit.

## Validation
- `EXPLAIN ANALYZE` verifies reduced execution time or smaller memory allocations via optimal access paths.
- No regression in security; RLS policies accurately restrict data while remaining performant.

## Output

Return a Query Optimization Report:
### The Bottleneck
What the prior query or schema design resulted in (e.g., sequential scan, massive index bloat, RLS latency).
### The Optimization
What specific Supabase Postgres guideline was applied.
### Target SQL
The resulting optimized SQL for indexes, RLS, or querying.
