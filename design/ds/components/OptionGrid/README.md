# OptionGrid

Big choice tiles in the style of a lesson app: one tap answers the question. Used for strain, method, setting and mood.

- Props: `options` `[{value, label, icon?, media?, hint?}]` (`media` is a node such as a `StrainAvatar` shown instead of the icon), `value` + `onChange` or `defaultValue`, `multiple`, `columns` `1 | 2 | 3`, `label` (accessible name).
- Preselect the most likely answer (last strain, last method) and mark it with `hint: 'Last time'`. The user should be able to press Continue without touching anything.
- Two columns for short labels with icons, one column for strain names. Keep it to six tiles; put the rest behind "Something else".
- Selected tiles get a moss border, the moss tint and a check, so state is never colour alone. Tiles have a thicker bottom edge so they read as pressable.
