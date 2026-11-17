# StepHeader

The top of each step in a flow: close button, progress bar, step count, and the question.

- Props: `step`, `total`, `title` (the question, phrased plainly: "What did you have?"), `subtitle`, `onClose`, `closeLabel`.
- Closing never loses work silently. If anything was changed, ask in-page "Discard this session?" with Discard and Keep logging.
- Keep flows to three steps for logging a session. Progress fills smoothly (300ms), never jumps or bounces.
