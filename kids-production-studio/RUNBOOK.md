# Runbook — Daoline Kids episode generator

## Prerequisites
Node.js 20+; a Claude API key with available credit; an exact supported Claude model ID.

## Setup
1. Download or clone the repo.
2. Open a terminal inside `kids-production-studio`.
3. Run `npm install`.
4. Preview the prompt for Alif at zero API cost: `npm run pilot`.
5. Review `output/01-prompt-preview.md`.
6. Set `ANTHROPIC_API_KEY` and `CLAUDE_MODEL` as environment variables **locally** (do not put them in GitHub files).
7. Run `npm run generate` to make **one billable** API request.
8. Review `output/01-episode-draft.md` and the printed token usage before any additional request.

## Safety
- No background automation or GitHub Actions billing has been enabled.
- There is no automatic retry on API errors.
- `output/` and environment files are gitignored.
- The first letter's data was checked against the existing published companion page. Remaining letters must be individually verified before generation.
- Avoid placing a real API key in chat, screenshots or repository files.
- API balance, credit expiry, and billing caps must be checked in Claude Console; this repository cannot verify them.

## Next engineering step
Build a reviewed 28-letter data manifest from the book companion pages and add validation tests. Keep approval required before each batch.
