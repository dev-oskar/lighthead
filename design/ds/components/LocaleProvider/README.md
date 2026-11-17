# LocaleProvider

Sets the language for every LightHead component below it. Ships with English (`en`), German (`de`) and Polish (`pl`); English is the fallback for any missing key.

- Props: `locale` (`'en' | 'de' | 'pl'`, or any BCP 47 tag; numbers and plurals follow it through `Intl`), children.
- Wrap the app once: `<LocaleProvider locale={userLocale}>…</LocaleProvider>`, and set `<html lang>` to the same value so hyphenation and screen readers follow.
- Inside your own components use `LightHead.useLocale()`: `t(key, vars)` for text, `num(n, decimals)` for numbers (0.15 / 0,15), `pct(n)` for percent (21% / 21 %).
- Messages live in `LightHead.messages` as `{ en: {...}, de: {...}, pl: {...} }`. Plurals are objects keyed by `Intl.PluralRules` categories; Polish needs `one`, `few`, `many`: "Został 1 dzień", "Zostały 2 dni", "Zostało 5 dni".
- Components never hold English text of their own. Strings you pass in (labels, titles, options) must come from `t()` too.
- Never build sentences by joining fragments; word order differs. Use one message with placeholders: `'in {amount} of {strain} ({pct})'`.
