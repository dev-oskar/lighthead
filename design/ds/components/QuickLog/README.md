# QuickLog

The reference flow for logging a session, built from StepHeader, Step, OptionGrid, NumberField, Chip, Rating and ActionBar. Click through it in the preview.

- Three steps, one question each: what (strain), how much (method, amount), how it felt (optional).
- Everything is prefilled from the last session and the strain, so the fastest log is Continue, Continue, Skip: three taps in the same spot.
- THC is not asked. It comes from the strain's THC % and is shown under the amount as "≈ 27 mg THC", updating as the amount changes.
- Time defaults to now; it can be changed on step one.
- The saved screen confirms quietly in `tide` with the facts of the session. No praise, no streaks, no confetti.
