import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// How the joke works, in plain terms: the reviewer is the AI and the
// person being reviewed is its human operator, which flips the usual
// power dynamic of a performance review. The verdict sounds like praise
// ("Exceeds expectations"), but the evidence for it is the operator
// handing over every single task and then looming over the progress bar
// as though watching the bar move were a management skill. Dressing that
// up in review-speak — a rating, a 100% KPI, a job title — is what makes
// doing nothing look like a promotion-worthy achievement.
//
// The program is fully deterministic: the line is a fixed string, there
// is no clock, no network, no randomness and no environment input other
// than the output directory, so two runs write identical bytes.

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.length > 0) {
    return fromEnv;
  }
  return "/output";
}

function buildReviewLine(): string {
  const verdict = "Exceeds expectations";
  const evidence =
    "delegated 100% of tasks to me, then hovered over the progress bar like a project manager on deadline";
  return `${verdict}: ${evidence}.`;
}

function writeEntry(): void {
  const targetDir = resolveOutputDir();
  mkdirSync(targetDir, { recursive: true });
  const targetFile = join(targetDir, "entry.txt");
  writeFileSync(targetFile, buildReviewLine(), "utf8");
}

writeEntry();
