LightHead is a private journal for cannabis use: log sessions, keep a strain library, plan tolerance breaks and see simple statistics. It is a PWA and everything lives on the user's device. Build every screen so it feels like a calm field notebook, never like a dispensary ad or a party app.

## Principles

- **Private by default.** Data stays on the device. Say so plainly where it matters (onboarding, export, settings) with a `Notice` of tone `private`. Premium backup is offered, never pushed.
- **No third-party requests.** The app never contacts a font service, CDN, analytics or crash reporter, because each request reveals the user's IP address and when they use the app. Fonts, icons and scripts ship inside the PWA and the service worker precaches them, so the app also works fully offline.
- **Neutral, not judging.** The app records; it does not praise or scold. "9 sessions this week", never "Great job" or "Too much".
- **Built for someone who is high.** Assume the user is relaxed, distracted or under the influence while logging. One question per screen, big tiles and buttons, nothing to remember between steps, nothing that punishes a mistake. Everything can be edited later.
- **Prefilled, not typed.** Every field starts with the most likely answer: last strain, last method, last amount, time = now. Strain facts (THC and CBD percent, terpenes) are entered once on the strain and never asked again in a session. Mark it with "Last time" or "Same as last time". The fastest log is Continue, Continue, Skip.
- **Never judging.** The app does not comment on how much or how often. No warnings on amounts, no red for heavy weeks, no streak guilt, no "Are you sure?" about usage. Red (`clay`) is only for deleting and for real failures.
- **Quiet.** No flashy colours, no confetti, no bouncing, jiggling or counting-up text, no sounds or haptics beyond the system defaults.
- **Legible in low light.** Touch targets 44px minimum (56px for the main action), generous line height, the hyperlegible type family, and a dark theme designed with the same care as the light one.

## Content fundamentals

- Voice: a knowledgeable friend who keeps notes. Short sentences, plain words, second person ("your stash", "you logged").
- Sentence case for everything: buttons, titles, tabs. Uppercase only in the `overline` style.
- No emoji, no exclamation marks, no slang ("sesh", "dank", "420"). Use the real terms: session, strain, tolerance break, stash, THC, CBD, terpenes.
- Derived THC: grams × the strain's THC % × 10 = mg, shown as "≈ 27 mg THC" in `data`. It is THC in the material, not absorbed; never call it a dose. Stats may sum it per week.
- Sessions keep a snapshot of what was true when they were logged: strain name, THC and CBD percent, and the derived mg. Editing or deleting a strain never changes past sessions or past statistics.
- Units: grams for flower (`0.15 g`, two decimals), milligrams for edibles and tinctures (`5 mg`), percent for cannabinoids (`THC 21%`). A thin space before the unit; numbers in the `data` or `numeral` style.
- Dates and times follow the device locale; times are 24-hour where the locale is.
- Examples: "Log session", "Start a break", "Day 9 of 21", "12 days to go", "Stored on this device only", "Same as last time", "Add a name so you can find this strain later."

## Languages

LightHead launches in English, German and Polish. Every component takes its words from `LocaleProvider`; nothing is hard-coded.

- Write each language natively, not word for word. Keep the meaning and the calm tone.
- Address the user informally: "you" in English, "du" in German, "ty" in Polish.
- German: nouns keep their capitals ("Sitzung speichern"). Words run about a third longer, so no control depends on a fixed text width; buttons and tiles wrap, and `hyphens: auto` applies when `<html lang>` is set.
- Polish: avoid past-tense verbs that mark gender ("miałeś/miałaś"). Ask with nouns or the present tense: "Jaka odmiana?", "Jak się czujesz?". Effects are nouns for the same reason: Spokój, Senność, Głód.
- Plurals go through `Intl.PluralRules`; Polish needs three forms (1 dzień, 2 dni, 5 dni).
- Numbers, percent, dates and times are formatted with `Intl` for the active locale: 0.15 g in English, 0,15 g in German and Polish; 21% in English and Polish, 21 % in German. Number fields accept both a comma and a point.
- Strain names, breeders and terpene names are never translated.
- The bundled fonts cover Polish and German characters (ą ę ł ń ó ś ź ż, ä ö ü ß). The ≈ sign is not in them and falls back to the system font, which is fine.

## Colour

- Neutrals are green-grey: `surface` for the page, `surface-raised` for cards and fields, `surface-sunk` for wells and tracks. Separate with `line`; give controls a `line-strong` border.
- Text is `ink`, secondary text `ink-muted`. Both are legible on every surface and every `*-soft` tint in both themes.
- `moss` is the brand and the only action colour: primary buttons, selected chips, the active tab. Text on a moss fill is `on-moss`.
- Each strain type owns one hue: indica `dusk`, sativa `resin`, hybrid `moss`, CBD `tide`. Use the hue as text on its `*-soft` tint (see `StrainBadge`).
- Tolerance breaks and positive status use `tide`. Warnings use `resin`. Errors and destructive actions use `clay`. Status always carries a word or icon as well; positive status is blue, not green, so it is never told apart from `clay` by hue alone.
- Keyboard focus is the `focus-ring` shadow: a 2px gap in the page colour, then 2px of solid `tide`. It is tide, not moss, so focus is never mistaken for selection.

## Type

- `display`, `title` and `heading` are set in Bricolage Grotesque: screen titles, card titles, the break counter. One `display` per screen at most.
- Everything else is Atkinson Hyperlegible Next: `body` (16px) is the default, `body-sm` for metadata, `label` for field labels and buttons, `overline` for list group labels, `caption` for the tab bar and chart axes.
- Every quantity the user compares is Atkinson Hyperlegible Mono with tabular figures: `numeral` in stat tiles and the stepper, `data` in cards.
- All three are self-hosted from `fonts/` (six WOFF2 files, about 110 KB together): Next in 400, 600 and 700, Mono in 400 and 500, Bricolage in 600. Each file holds Latin and Latin Extended, so German and Polish need nothing extra. Precache them with the app shell. Licence: SIL Open Font License 1.1, in `licenses/fonts-OFL.txt`; ship it with the app.
- Use only the weights above. A missing weight would make the browser fake bold text.

## Shape, space and elevation

- 4px spacing base. Screens have `space-4` side gutters, `space-6` between cards, `space-8` between sections.
- Controls are pills (`radius-full`). Cards and notices use `radius-md`.
- The leaf corner is the signature: `radius-lg` on two opposite corners and `radius-xs` on the other two. It marks strains (`StrainCard`), the break panel and the floating log button. Use it on no more than one kind of object per screen.
- Separate with borders first. `shadow-sm` only for cards on `surface-sunk`; `shadow-lg` only for floating things (bottom sheets, the log button).
- Motion is calm and only where it explains something: steps slide in 24px with a fade (240ms ease-out, `Step`), the progress bar fills over 300ms, colour states fade in 150ms, the break ring eases over 600ms. Nothing scales, bounces, shakes or loops. With reduced motion, steps only fade.

## Logging flow

Lesson-style: one question per screen, the content in the middle, one big button at the bottom. See `QuickLog`.

- Structure each step as `StepHeader` (close, progress, question) → content → `ActionBar` (primary at the bottom, same spot every step). Wrap the content in `Step` for the entrance.
- Answers are `OptionGrid` tiles or `NumberField` with − and + on its sides. Typing is a fallback, never the main path.
- Questions are plain and short, written as you would ask a friend: "What did you have?", "How much?", "How do you feel?"
- Optional steps say so in the subtitle and offer Skip. Three steps for a session; never more than five for any flow.
- After saving, confirm with the facts ("21:40 · Northern Lights · 0.15 g"), then return. No rewards.

## Imagery

- The only photos in the app are the user's own strain photos, shown through `StrainAvatar`. Without a photo, the avatar shows the strain's initials (NL for Northern Lights) on its type tint, so lists never look broken or empty.
- Photos are processed on the device with `prepareStrainPhoto`: square, 512 px, WebP, with EXIF and location removed. They are stored with the strain and leave the device only inside a Premium backup.
- No stock photography, no illustrations of people, plants or smoke.

## Iconography

- LightHead's own line icons, 24px grid, 1.75 stroke, round caps and joins (`assets/Icons`). In the app draw them with the `Icon` component so they take `currentColor`.
- Filled shapes appear only in the leaf rating.
- No emoji, no cannabis-leaf clip art, no smoke illustrations. There is no logo yet; set the name "LightHead" in `title` or `display` in `ink`.

## Layout

- Phone first, one column, max content width 520px centred on larger screens.
- The `TabBar` is fixed at the bottom with five destinations: Today, Journal, Strains, Stats, Break. The primary action on Today is the floating log button above it.
- From 960px wide, a side rail on the left replaces the `TabBar`: the name, the log button, the five destinations, and Settings at the bottom. Content then uses two to four columns instead of one.
- A screen reads top to bottom: title, the one figure that matters (break ring or this week's stat), then lists.
