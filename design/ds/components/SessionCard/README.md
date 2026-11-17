# SessionCard

A logged session in the journal list: time, strain, method, amount, effects, note and rating.

- Props: `time` ("21:40"), `ago` ("Today", "Sat"), `strain`, `type`, `photo` (small StrainAvatar beside the name), `method`, `amount` ("0.15 g"), `setting`, `effects` (array), `note`, `rating`.
- Only `time` and `strain` are required; everything else is optional, matching the quick-log flow.
- Lists group cards by day under an `overline` label with `space-3` between cards.
