# StrainAvatar

The strain's picture: the user's own photo, or its initials in the strain type's colour when there is none. Shaped like a leaf (round and sharp corners alternating).

- Props: `name`, `type` (`indica | sativa | hybrid | cbd`, picks the tint), `src` (photo URL, usually an object URL from IndexedDB), `size` `sm` 32 · `md` 48 · `lg` 72 · `xl` 112, `editable`, `onPick(file)`.
- Initials: first letter of the first two words (Northern Lights → NL, Gelato #41 → G4), the first two letters of a single word (ACDC → AC). Symbols are ignored; letters keep their case rules for every language (Łódzka Mgła → ŁM).
- `editable` turns it into a button with a camera badge that opens the phone's photo picker or camera. Use it on the strain form and the strain detail screen, nowhere else.
- Always pass the picked file through `LightHead.prepareStrainPhoto(file)` before saving. It crops to a square, scales to 512 px and re-encodes as WebP (about 30–60 KB), which also removes EXIF data such as GPS location and the camera model.
- Photos are stored on the device with the strain (IndexedDB) and travel only inside a Premium backup. Never upload them anywhere else.
- Photo is optional. Never prompt for one in the quick log flow.
- Sizes: `sm` in session cards, `md` in strain tiles in OptionGrid, `lg` in strain cards, `xl` on the strain detail screen.