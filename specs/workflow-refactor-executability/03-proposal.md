# Proposal

## Recommended Approach
Batch-rewrite all 5 workflows to strictly follow a unified 5-stage vocabulary: Plan, Prepare, Execute, Verify, Close. Remove all phantom state dependencies. Map correct skills. Add universal verification. Extract the vocabulary decision to `engram`.

## Alternatives Considered
- **Create `.agent/state/current_spec.md`**: Discarded. This violates SDD. Specs must be modular inside `specs/<change-id>/`, not a global monolith.
- **Fix workflows incrementally when they fail**: Discarded. Leaves the system in an unpredictable state where the user doesn't know which workflow actually works.

## Tradeoffs
- Rewriting 5 workflows simultaneously has a higher risk of introducing a typo into the core lifecycle, but doing it together is the only way to guarantee uniform vocabulary and stage alignment.
