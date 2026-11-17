# Notice

Inline message inside a screen. Not a toast.

- Props: `tone` `private | backup | info | warn | danger`, `title`, children (one or two sentences), `icon`, `action`.
- `private` is the standard reminder that data stays on the device. Show it on onboarding, export and settings, not everywhere.
- `backup` introduces Premium backup. Inform, don't nag: once per screen at most, never blocking a flow.
- Every tone has its own icon, so meaning never rests on the tint alone.
