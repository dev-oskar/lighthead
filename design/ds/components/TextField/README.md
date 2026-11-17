# TextField

Labelled input for strain names, breeders and notes.

- Props: `label` (required), `hint`, `error`, `suffix` (unit such as `g`, `%`, `mg`), `multiline`, plus native input attributes.
- Always a visible label above the field; placeholders show an example, never the label.
- Errors say what is wrong and how to fix it, kindly: "Add a name so you can find this strain later." Never question how much someone used.
- For numbers (amount, THC, CBD) use NumberField instead.
