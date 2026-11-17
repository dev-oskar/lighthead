# SegmentedControl

One choice from two to five options, shown together. Used for consumption method and chart ranges (Week, Month, Year).

- Props: `options` `[{value, label, icon?}]`, `value` + `onChange` or `defaultValue`, `label` (the group's accessible name).
- More than five options: use a list of Chips or a picker sheet.
- The track scrolls sideways on narrow screens instead of wrapping.
