# ActionBar

The bottom of a step: one big primary button, optionally a quiet Skip beside it. Fixed above the keyboard and the home indicator.

- Props: `primary` (default "Continue"), `onPrimary`, `disabled`, `secondary`, `onSecondary`.
- The primary button stays in the same place on every step, so the thumb can stay there.
- Last step says what happens: "Save session". Optional steps always offer Skip.
- Disable the primary only when an answer is truly required; prefill so that is rare.
