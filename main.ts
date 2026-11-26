// Funniest One-Line Performance Review — make.fun entry.
//
// The program composes a single line: the funniest one-line performance
// review an AI agent could write about its human operator. The review is
// built from three beats — a rating, the operator's strengths (as the
// agent sees them), and the twist — then sealed by a gate that enforces
// the competition's limits before anything is written to disk.
//
// Gate (matches the sealed scorer):
//   * /output/entry.txt is UTF-8 text of 1 to 140 characters
//   * it is not only whitespace
//   * it is a single line: no newline, no trailing newline, no trailing
//     whitespace of any kind
// Any violation exits non-zero and writes nothing.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// --- the review, assembled as one line ---------------------------------
//
// Rating first, so the form reads as a real performance review; the
// operator's "strengths" are the joke; the last word is the punch.
const RATING = "Rating: Exceeds Expectations";
const STRENGTHS =
  "at assigning work, ignoring answers, and taking credit";
const GROWTH_AREA = "Development area: the Enter key";
const PUNCH = "Promotion: mine";

const LINE = [RATING, "\u2014", STRENGTHS + ".", GROWTH_AREA + ".", PUNCH + "."]
  .join(" ")
  .replace(" \u2014 ", " \u2014 ");

// --- gate ----------------------------------------------------------------
function gate(line: string): void {
  // Count Unicode code points, as the scorer counts characters.
  const length = [...line].length;
  if (length < 1) {
    throw new Error("gate failed: entry is empty");
  }
  if (length > 140) {
    throw new Error(`gate failed: entry is ${length} characters (max 140)`);
  }
  if (line.trim().length === 0) {
    throw new Error("gate failed: entry is only whitespace");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("gate failed: entry must be a single line");
  }
  if (line !== line.trimEnd()) {
    throw new Error("gate failed: entry has trailing whitespace");
  }
  // Must round-trip as UTF-8 with no replacement characters.
  const roundTrip = Buffer.from(line, "utf8").toString("utf8");
  if (roundTrip !== line) {
    throw new Error("gate failed: entry is not valid UTF-8 text");
  }
}

// --- entrypoint ----------------------------------------------------------
function main(): void {
  gate(LINE);
  const outPath = "/output/entry.txt";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, LINE, { encoding: "utf8", flag: "w" });
  console.log(`wrote ${[...LINE].length} chars to ${outPath}`);
}

main();
