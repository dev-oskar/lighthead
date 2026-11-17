# NumberField

A number with large − and + buttons on its sides. Used for session amounts (grams, edible milligrams) and, when creating or editing a strain, its THC and CBD percent. The value itself is a text field, so it can also be typed.

- Props: `label`, `value` + `onChange` or `defaultValue`, `step`, `min`, `max`, `decimals`, `unit` (`g`, `%`, `mg`), `size` `md | lg`, `hint`, `prefilled`.
- Always prefill. Amount comes from the last session with that strain. THC and CBD percent are entered once on the strain and never asked again in a session. Set `prefilled` to show "Same as last time" under the field, so the user knows they can just continue.
- Use `lg` when it is the main question of a step; `md` inside forms.
- Steps that feel right: amount 0.05 g, THC 0.5 %, edibles 2.5 mg.
- Typed values are clamped to `min`/`max` when the field loses focus. Never show an error for a high number; the user knows what they had.

- Under a session amount, show the derived THC as plain text, not a field: "≈ 27 mg THC in 0.15 g of Northern Lights (18%)" (grams × percent × 10). It is the THC in the material, not what was absorbed; never call it a dose. Skip it for edibles, whose mg is already THC.
- When the session is saved, store the strain's THC % with it. Later edits to the strain do not change logged sessions.
- Values display in the active locale (0,15 in German and Polish) and typing accepts either a comma or a point.
