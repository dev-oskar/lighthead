# BreakProgress

The tolerance-break counter: a ring, the day number and days left. It is the one place the `display` style appears on its screen.

- Props: `day`, `total` (default 21), `since` (preformatted start date), `label`, `action` (a quiet Button).
- Common lengths are 2, 7, 14, 21 and 28 days.
- Shows "Break complete" when `day` reaches `total`. Copy stays neutral: a break is a choice, not a test.
