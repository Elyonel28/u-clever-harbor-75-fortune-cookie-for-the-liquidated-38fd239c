// Fortune Cookie for the Liquidated Trader
// make.fun bounty: u-clever-harbor-75-fortune-cookie-for-the-liquidated-38fd239c
//
// One fortune cookie line for a crypto trader who has just been liquidated.
// The program prints it and writes it to /output/entry.txt (the harness
// reads that file), falling back to ./output/entry.txt when /output is
// not writable, e.g. on a developer machine.
//
// Gate (from the kit's RULES.txt):
//   - UTF-8 text, 1 to 160 characters, not only whitespace
//   - a single line, at most 20 words of plain text

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FORTUNE =
  "You will meet a wealthy stranger soon: it is you, in five years, still laughing about this liquidation.";

const MAX_CHARS = 160;
const MAX_WORDS = 20;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function checkGate(text: string): string[] {
  const problems: string[] = [];
  if (text.length < 1 || text.length > MAX_CHARS) {
    problems.push(`length ${text.length} chars, must be 1-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    problems.push("text is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("must be a single line");
  }
  const words = wordCount(text);
  if (words > MAX_WORDS) {
    problems.push(`${words} words, must be at most ${MAX_WORDS}`);
  }
  return problems;
}

function pickOutputDir(): string {
  // The grading sandbox mounts /output; a local run uses ./output.
  const candidates = ["/output", join(dirname(fileURLToPath(import.meta.url)), "output")];
  for (const dir of candidates) {
    try {
      mkdirSync(dir, { recursive: true });
      return dir;
    } catch {
      // Not writable here; try the next candidate.
    }
  }
  throw new Error("no writable output directory found");
}

const problems = checkGate(FORTUNE);
if (problems.length > 0) {
  console.error(`Gate failed: ${problems.join("; ")}`);
  process.exit(1);
}

const outDir = pickOutputDir();
const outFile = join(outDir, "entry.txt");
// No trailing newline: the gate counts every character, and a smaller
// file also wins the byte-size tie-break on the leaderboard.
writeFileSync(outFile, FORTUNE, "utf8");

console.log(FORTUNE);
console.log(`Wrote ${outFile} (${FORTUNE.length} chars, ${wordCount(FORTUNE)} words)`);
