# Step

Wrapper that gives each step its entrance: a 24px slide with a fade, 240ms ease-out, once. Going back slides from the other side.

- Props: `stepKey`, `direction` `fwd | back`, children. Give the element a React `key` that changes per step so it re-enters.
- This is the only screen motion in the app. No bounce, no scale, no shaking text, no confetti.
- With reduced motion turned on it becomes a plain fade.
