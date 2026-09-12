# Capture Test

## Tool and model

- **Tool:** Claude Code (CLI), v2.1.269
- **Model:** Sonnet 5 (`claude-sonnet-5`) — one model does both planning and execution in this setup; there is no separate planner/executor split.

## Mechanism

Claude Code hooks, configured in `.claude/settings.json` (committed to the repo root):

- `UserPromptSubmit` and `Stop` are both wired to run `node "${CLAUDE_PROJECT_DIR}/.claude/hooks/capture.js"`.
- `UserPromptSubmit` fires the instant a prompt is submitted and receives the verbatim prompt text directly on stdin (`input.prompt`) — this is written to the log immediately, since it's the most authoritative source for "verbatim, no truncation, no cleanup."
- `Stop` fires when the assistant's turn ends. Its stdin payload includes `last_assistant_message` (the final response text) plus `transcript_path` (the session's `.jsonl` transcript). The script uses `last_assistant_message` as the primary response text and only falls back to parsing the transcript if that field is ever empty. The transcript is also the only place the model id lives (`message.model` on the last assistant entry in the JSONL), since neither hook payload includes a model field directly — so the script reads it from there and backfills it onto both the `PROMPT` and `RESPONSE` entries for that exchange.
- Genuine user prompts vs. tool-result turns (Claude Code logs tool results as `type: "user"` entries too) are told apart in the transcript by content shape: a real prompt's `message.content` is a plain string; a tool-result turn's is an array of `tool_result` blocks. This only matters for the transcript-fallback path.
- Per-session state (which log file is open, the running exchange counter) is kept in `.claude/hooks/_state/<session_id>.json`, gitignored — it's working state, not part of the graded log.

Config file changed: `.claude/settings.json`. Script: `.claude/hooks/capture.js`.

## Verification

Ran the canary three times, each as a **separate, independently-invoked** `claude -p "..."` process (a genuinely fresh session each time, not a continuation of the session that wrote `settings.json`), confirming the hook is installed at the repo level rather than tied to one session:

1. Session `42d1955a-2e19-4efd-a9eb-10a5cda12d1e` → `.agent-logs/2026-09-12_07-45-43_42d1955a-2e19-4efd-a9eb-10a5cda12d1e.md`
2. Session `604e1aad-c132-4493-b6c7-c4de893921c6` → `.agent-logs/2026-09-12_07-46-16_604e1aad-c132-4493-b6c7-c4de893921c6.md`
3. Session `cfb62931-3b4f-4bb9-aced-67b0864178e8` → `.agent-logs/2026-09-12_07-47-34_cfb62931-3b4f-4bb9-aced-67b0864178e8.md` (re-run after simplifying the script to prefer `last_assistant_message` over transcript parsing — confirms the edit didn't regress anything)

Both required canary entries, pasted raw from log file #2 (`.agent-logs/2026-09-12_07-46-16_604e1aad-c132-4493-b6c7-c4de893921c6.md`):

```
[LOG_ENTRY type=PROMPT num=1 session=604e1aad-c132-4493-b6c7-c4de893921c6]
timestamp: 2026-09-12T07:46:16.160Z
model: claude-sonnet-5

CAPTURE TEST — 8x assignment, Gulsher Khan


[LOG_ENTRY type=RESPONSE num=1 session=604e1aad-c132-4493-b6c7-c4de893921c6]
timestamp: 2026-09-12T07:46:41.681Z
model: claude-sonnet-5

The capture setup is working correctly. The `UserPromptSubmit` and `Stop` hooks fired automatically and logged this exact prompt to `.agent-logs/2026-09-12_07-46-16_604e1aad-c132-4493-b6c7-c4de893921c6.md` — it captured the session metadata, timestamp, and your "CAPTURE TEST" text. The model field currently shows `__MODEL_PENDING_1__`, which gets filled in on the `Stop` event, so it should resolve once this turn completes.

Capture test: **passed**. You're clear to move past gate P2 and start on `F1` (Header/Navigation), the first must-have in `feature_list.json`.

One reminder per your CLAUDE.md: commit `.agent-logs/` now (and after each meaningful chunk going forward) rather than batching it — want me to make that commit?
```

## What I tried first that didn't work

Before touching the config, I dispatched a research subagent to look up the exact hook JSON schema (event names, stdin field names, transcript format) rather than guessing. Its report came back flagged by the harness as containing instruction-shaped patterns (mentions of `settings-json` / `bypassPermissions`), so I treated it as unverified rather than acting on it directly. Concretely, I did **not** trust its claims about field names on faith — I verified everything empirically instead:

- Read a real session transcript JSONL directly (`~/.claude/projects/.../*.jsonl`) to confirm the actual entry shapes, including how to tell a genuine user prompt apart from a tool-result entry (both are `type: "user"` — content shape is the only reliable signal).
- Ran real canary prompts and inspected the raw stdin JSON each hook actually received (kept temporarily in `.claude/hooks/_debug/*.jsonl`, gitignored) instead of assuming the subagent's guessed field names (`user_prompt`, etc.) were correct. The real field turned out to be `prompt`, and `last_assistant_message` on `Stop` turned out to genuinely exist (one part of the flagged report that happened to be accurate) — but I only relied on it after confirming that from the real payload, not from the report.
- My first implementation of the `Stop` handler only parsed the transcript for the response text (not knowing yet that `last_assistant_message` existed). It worked, but was more complex than necessary and carried a theoretical async-lag risk. Once the debug payload showed `last_assistant_message` was present and exactly matched the transcript-derived text, I simplified the script to prefer it, keeping transcript parsing only as a fallback and as the sole source for the model id (which isn't in either hook's payload).

Author note: `gulsher-khan` in the log frontmatter is a placeholder derived from the local git identity (`Gulsher Khan`) — no GitHub CLI was configured to confirm the actual handle. Replace it in `.claude/hooks/capture.js` (`author:` line) if it's wrong before the final submission.
