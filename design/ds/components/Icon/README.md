# Icon

Line icons on a 24px grid, 1.75 stroke, round caps and joins, drawn for LightHead.

- Props: `name` (one of `Icon.names`), `size` (default 24), `filled` (fills the shape; used by Rating), `title` (gives the icon a label; without it the icon is hidden from screen readers).
- Inherits `currentColor`. Put it inside text coloured with `ink`, `ink-muted` or `moss`.
- Use 20px inside buttons and notices, 22px in the tab bar, 16px beside metadata.
- Do: pair every icon with a word, except well-known actions (plus, close) that have an `aria-label` on their button.
- Don't: mix in filled icons from other sets, or use emoji in place of icons.
