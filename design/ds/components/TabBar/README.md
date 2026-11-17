# TabBar

Bottom navigation with five destinations: Today, Log, Strains, Stats, Break.

- Props: `items` `[{value, label, icon}]` (defaults to the five above), `value` + `onChange` or `defaultValue`.
- Fixed to the bottom of the screen; it adds the safe-area inset itself.
- The active tab gets the moss pill and moss text. Labels are always shown.
- Stash joins as a sixth item later only by replacing one; five is the maximum.
