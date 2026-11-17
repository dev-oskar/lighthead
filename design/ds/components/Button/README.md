# Button

Pill-shaped actions. One `primary` per screen, for the thing the screen is for: "Log session", "Start a break", "Save".

- Props: `variant` `primary | secondary | quiet | danger` (default `secondary`), `size` `md | lg`, `icon`, `block`, plus every native button attribute.
- Icon-only buttons need `aria-label`. Add `className="lh-btn-fab"` with `size="lg"` for the floating log button; its leaf corner points to the top right.
- Labels are verbs in sentence case, two words when possible. No exclamation marks.
- `danger` is for deleting data. Confirm in-page; the browser `confirm()` dialog is not used.
- Minimum touch target is 44px; never shrink below `md`. In flows the primary is `lg` (56px) and `block`, in ActionBar.
- Pressing darkens the fill slightly. Buttons never scale, bounce or wiggle.
