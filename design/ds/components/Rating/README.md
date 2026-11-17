# Rating

Leaf rating from one to five. Optional on every session and strain.

- Props: `value` + `onChange` or `defaultValue`, `max` (5), `readOnly`, `size`, `label`.
- Tapping the current value clears it, so a rating can be removed.
- Filled leaves use `resin`, empty ones `line-strong`. The read-only form announces "Rated 4 of 5".
