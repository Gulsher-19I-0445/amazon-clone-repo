#!/usr/bin/env node
/**
 * 8x assignment capture hook.
 *
 * Wired to two Claude Code lifecycle events (see ../settings.json):
 *   - UserPromptSubmit: fires right when a prompt is submitted. Logs the
 *     verbatim prompt text immediately (authoritative source: hook stdin,
 *     not the transcript, which is written asynchronously and can lag).
 *   - Stop: fires at the end of the assistant's turn. Reads the session
 *     transcript to pull the final text response for that turn (skipping
 *     thinking blocks and tool_use/tool_result blocks) and the model id
 *     that produced it, then backfills the model onto the matching PROMPT
 *     entry too, since UserPromptSubmit's payload does not include model.
 *
 * Genuine user prompts vs. tool-result "user" turns are told apart by
 * content shape: a real prompt's message.content is a plain string; a
 * tool-result turn's content is an array of tool_result blocks.
 */
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const LOG_DIR = path.join(REPO_ROOT, ".agent-logs");
const STATE_DIR = path.join(__dirname, "_state");
const DEBUG_DIR = path.join(__dirname, "_debug");

for (const d of [LOG_DIR, STATE_DIR, DEBUG_DIR]) fs.mkdirSync(d, { recursive: true });

function readStdinJSON() {
  let raw = "";
  try {
    raw = fs.readFileSync(0, "utf8");
  } catch (e) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { _rawUnparsed: raw };
  }
}

const input = readStdinJSON();
const eventName = input.hook_event_name || "unknown";

// Debug trail kept while bringing this up / diagnosing issues. Not part of
// the graded log; not committed (see .gitignore).
try {
  fs.appendFileSync(
    path.join(DEBUG_DIR, `${eventName}.jsonl`),
    JSON.stringify({ capturedAt: new Date().toISOString(), input }) + "\n"
  );
} catch (e) {
  /* debug trail is best-effort only */
}

const sessionId = input.session_id || input.sessionId || "unknown-session";
const statePath = path.join(STATE_DIR, `${sessionId}.json`);

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch (e) {
    return { nextExchangeNum: 1, pendingNum: null, logFile: null, firstPromptTime: null, lastPromptTime: null };
  }
}

function saveState(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function tsStamp(iso) {
  return iso.replace("T", "_").replace(/:/g, "-").slice(0, 19);
}

function writeFrontmatter(state, model) {
  return `---
session_id: ${sessionId}
date: ${state.firstPromptTime.slice(0, 10)}
author: gulsher-khan
model: ${model || "unknown"}
tool: claude-code
project: amazon-clone
total_exchanges: ${state.nextExchangeNum - 1}
first_prompt_time: ${state.firstPromptTime}
last_prompt_time: ${state.lastPromptTime}
---

# Session Log - ${state.firstPromptTime.slice(0, 10)}

Session: \`${sessionId}\` | Project: \`amazon-clone\` | Author: \`gulsher-khan\`

---
`;
}

function rewriteFrontmatter(state, model) {
  const content = fs.readFileSync(state.logFile, "utf8");
  const bodyStart = content.indexOf("\n---\n\n[LOG_ENTRY");
  const body = bodyStart === -1 ? "" : content.slice(bodyStart + "\n---\n".length);
  fs.writeFileSync(state.logFile, writeFrontmatter(state, model) + body);
}

function appendEntry(state, block) {
  fs.appendFileSync(state.logFile, block);
}

// ---- extraction helpers for the Stop event ----

function extractTurnFromTranscript(transcriptPath) {
  let lines;
  try {
    lines = fs.readFileSync(transcriptPath, "utf8").trim().split("\n").filter(Boolean).map((l) => {
      try {
        return JSON.parse(l);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
  } catch (e) {
    return { text: "", model: null };
  }

  const isGenuineUserPrompt = (obj) => obj.type === "user" && typeof obj.message?.content === "string";

  let lastUserIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (isGenuineUserPrompt(lines[i])) {
      lastUserIdx = i;
      break;
    }
  }
  if (lastUserIdx === -1) return { text: "", model: null };

  let text = "";
  let model = null;
  for (let i = lastUserIdx + 1; i < lines.length; i++) {
    const obj = lines[i];
    if (obj.type !== "assistant") continue;
    model = obj.message?.model || model;
    const blocks = Array.isArray(obj.message?.content) ? obj.message.content : [];
    for (const b of blocks) {
      if (b.type === "text" && typeof b.text === "string") {
        text += (text ? "\n\n" : "") + b.text;
      }
    }
  }
  return { text, model };
}

// ---- main ----

if (eventName === "UserPromptSubmit") {
  const promptText = input.prompt ?? input.user_prompt ?? input.message ?? "";
  const timestamp = new Date().toISOString();
  const state = loadState();

  const num = state.nextExchangeNum;
  state.pendingNum = num;
  state.nextExchangeNum = num + 1;
  if (!state.logFile) {
    state.firstPromptTime = timestamp;
    state.logFile = path.join(LOG_DIR, `${tsStamp(timestamp)}_${sessionId}.md`);
  }
  state.lastPromptTime = timestamp;

  const isNewFile = !fs.existsSync(state.logFile);
  if (isNewFile) {
    fs.writeFileSync(state.logFile, writeFrontmatter(state, `__MODEL_PENDING_${num}__`));
  } else {
    rewriteFrontmatter(state, state.lastKnownModel || `__MODEL_PENDING_${num}__`);
  }

  const block = `
[LOG_ENTRY type=PROMPT num=${num} session=${sessionId}]
timestamp: ${timestamp}
model: __MODEL_PENDING_${num}__

${promptText}

`;
  appendEntry(state, block);
  saveState(state);
} else if (eventName === "Stop") {
  const state = loadState();
  if (!state.logFile) {
    // Stop fired without a matching UserPromptSubmit in this session (shouldn't
    // normally happen); nothing to attach the response to.
    process.exit(0);
  }
  const num = state.pendingNum || state.nextExchangeNum - 1;
  const timestamp = new Date().toISOString();
  // last_assistant_message is the confirmed, verbatim final response text for
  // this turn (verified against real hook payloads during canary testing).
  // Transcript parsing is kept only as a fallback and as the sole source for
  // the model id, which isn't included in the Stop payload.
  let { text: transcriptText, model } = extractTurnFromTranscript(input.transcript_path);
  let text = typeof input.last_assistant_message === "string" && input.last_assistant_message
    ? input.last_assistant_message
    : transcriptText;
  for (let attempt = 0; !text && !model && attempt < 5; attempt++) {
    const until = Date.now() + 200;
    while (Date.now() < until) {
      /* busy-wait: no async available in a synchronous hook script */
    }
    ({ text: transcriptText, model } = extractTurnFromTranscript(input.transcript_path));
    text = text || transcriptText;
  }
  const finalModel = model || state.lastKnownModel || "unknown";
  state.lastKnownModel = finalModel;

  // Backfill the model placeholder for this exchange number everywhere it appears
  // (prompt entry's placeholder + frontmatter placeholder) with the real model id.
  let content = fs.readFileSync(state.logFile, "utf8");
  content = content.split(`__MODEL_PENDING_${num}__`).join(finalModel);
  fs.writeFileSync(state.logFile, content);
  rewriteFrontmatter(state, finalModel);

  const block = `
[LOG_ENTRY type=RESPONSE num=${num} session=${sessionId}]
timestamp: ${timestamp}
model: ${finalModel}

${text}

`;
  appendEntry(state, block);
  state.pendingNum = null;
  saveState(state);
}
