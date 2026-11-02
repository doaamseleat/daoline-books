# Daoline Kids Production Studio

Production workspace for **The Magic Letters Adventure**, an original English-led Arabic-learning animated series for children aged 4–7 who do not speak Arabic.

## Source of truth
- Existing book companion pages: `/1/` through `/28/`.
- Existing pronunciation audio: `/audio/01.mp3` through `/audio/28.mp3`, and sentence audio `/audio/s01.mp3` through `/audio/s28.mp3`.
- Existing illustration assets: `/img/01.png` through `/img/28.png`.
- Verify each episode against its corresponding published book page and actual workbook before release.

## Workflow
1. Review the letter's published page and audio.
2. Draft a 90-second English-first story with one Arabic target word.
3. Review Arabic spelling, meaning, sound, and on-screen lettering.
4. Generate silent Grok clips using approved character references.
5. Record voices separately, add original music and Arabic overlays in editing.
6. Export 9:16 Shorts first; generate 16:9 separately when approved.
7. Review with an Arabic speaker and a parent/educator before publishing.

## Safety and cost
- Do not store Claude API keys in this public repository. Use local environment variables or GitHub Actions secrets.
- Claude API usage is billed separately from a Claude chat subscription.
- No automated paid calls or video generation are configured here.
- Keep existing book website, audio and QR-linked pages untouched.

## Contents
- `SERIES_BIBLE.md` — character, audience, narrative and production rules.
- `episodes/01-alif.md` — 90-second pilot script and shot list.
- `prompts/episode-generator.md` — reusable Claude prompt.
