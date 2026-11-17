# StrainCard

A strain in the library, with type, cannabinoids, terpenes, how much is in the stash and the user's rating.

- Props: `name`, `type`, `photo` (shown in a `StrainAvatar`; initials when absent), `breeder`, `thc`, `cbd` (numbers, percent), `sessions`, `inStash` (preformatted, "3.2 g"), `terpenes` (array), `rating`.
- Uses the leaf corner (`radius-lg` and `radius-xs` on opposite corners) so strains read as different objects from sessions.
- Terpene names are capitalised common names: Myrcene, Limonene, Caryophyllene, Pinene, Linalool.
