# AA / Ai Anonymous — structured archive, v1

Coverage: **16–28 July 2026** (13 days, 299 messages). Built from the raw transcript, not from any summary.

This replaces the summary-of-a-summary pipeline. The rule that makes it work: **nothing publishes without a `msg_id` and a verbatim quote.**

---

## Files

| File | What it is |
|---|---|
| `layer0_messages.json` / `.csv` | **SOURCE.** One record per message, verbatim, append-only. 299 records. The only thing that is ever "true." |
| `layer1_claims.json` / `.csv` | **CLAIMS.** 105 publishable assertions, each traced to ≥1 `msg_id`, each carrying its verbatim quote, its stance, and its certainty *as stated*. |
| `threads.csv` | 19 threads with a `status` of `resolved` / `contested` / `open` and a stated resolution. |
| `dropped_claims.csv` | 15 claims from the previous archive that are unsourced, misattributed, or inverted — each with the reason and the required action. |
| `gaps_register.json` | Everything the source cannot support: truncated messages, failed media, deleted messages, coverage boundary. Publish this, don't hide it. |
| `corrected_counters.json` | Real counters computed from Layer 0, mapped against the invented ones currently on the site. |
| `identity_map_PRIVATE.json` | Canonical speaker IDs + phone numbers + **collision warnings**. ⚠️ Never ships to the web. |
| `member_roster_PRIVATE.json` | 77 roster entries with phone numbers. ⚠️ Never ships to the web. |
| `validate.py` | Guards the archive. Fails on broken references, missing quotes, stripped hedges, or fabricated consensus. |
| `validate_site.py` | Guards what ships to the browser: every link traceable, no PII the person didn't supply, LinkedIn requires provenance, counters computed, no `keyTakeaways`. |
| `build_data_v2.py` → `data.v2.js` | Generates the site data store. Never hand-edit the output. |
| `attestations.json` | Human confirmations of identity links that phone-matching couldn't make. Data, not code. |

---

## Layer 0 — SOURCE

```json
{
  "msg_id": "20260728-1318-280",     // date-time-seq, stable
  "date": "2026-07-28", "time": "13:18",
  "speaker_id": "jef-van-gool", "speaker": "Jef Van Gool",
  "edited": false,
  "reply_to_hint": null,
  "text_original": "...",            // VERBATIM. Dutch stays Dutch.
  "links": ["https://..."],
  "truncated": false,                // "Read more" — recoverable only from a phone
  "media": false, "failed_to_load": false,
  "deleted": false, "poll": false, "system": false
}
```

Append-only. Never edited to "improve" it. Phone numbers are **not** in Layer 0 — they live only in `identity_map_PRIVATE.json`.

## Layer 1 — CLAIMS

```json
{
  "claim_id": "C075",
  "thread": "T14",
  "speaker": "Philip Van Ceulebroeck",
  "msg_ids": ["20260728-1751-297"],       // REQUIRED, non-empty
  "claim": "Says FinBERT is just niche, and APPARENTLY three times as good as standard BERT...",
  "stance": "hedges",                      // asserts|asks|jokes|shares|secondhand|hedges|disputes
  "certainty": "hedged",                   // hands_on|stated_flatly|hedged|secondhand|untested|sarcasm|unresolved
  "quote": "Awel gewoon niche, en blijkbaar 3 keer zo goed als standaard bert...",
  "translation": "Well, just niche, and apparently 3 times as good as standard BERT...",
  "factcheck": {
    "verdict": "WRONG — no published basis for a 3x figure",
    "corrected_fact": "...",
    "sources": ["https://..."],
    "note": "Philip hedged with 'blijkbaar'. The previous version stripped the hedge."
  }
}
```

**`stance` and `certainty` are the anti-slop mechanism.** A hedge is data, not noise. A joke is tagged as a joke. `sarcasm` exists because this group is relentlessly ironic in Dutch and two of the previous version's worst errors came from reading sarcasm as reporting.

## Layer 2 — RESEARCH

Lives in `claims[].factcheck`. Renders as a **visually separate block**. It never enters a sentence describing what the group said. 26 of 105 claims carry one.

---

## Thread status — replaces "Group Consensus"

| Status | Count | Meaning |
|---|---|---|
| `resolved` | 10 | The thread reached an answer. State it. |
| `contested` | 4 | Members hold incompatible positions. **Publish the positions, not an average.** |
| `open` | 5 | Raised, not settled. Say so. |

The old site column `Key Takeaways & Group Consensus` was a required field, which structurally guaranteed fabricated consensus. There is no "consensus" field in this schema by design.

---

## Publish contract

A topic page renders, in this order:

1. **What was said** — speaker, timestamp, verbatim quote + translation, hedges intact
2. **Positions** — who holds what (a first-class section, not a footnote)
3. **Status** — resolved / contested / open, with the stated resolution
4. **Fact-check** — Layer 2, visually distinct, with source links
5. **Unresolved / unrecoverable** — from `gaps_register.json`
6. **Resources** — real names, never phone numbers

---

## The eight rules

1. **Never summarise a summary.** Every regeneration starts from Layer 0.
2. **Quote-or-cut.** No verbatim quote → no publish.
3. **Preserve hedges verbatim.** *blijkbaar*, *als ik me niet vergis*, *heb het nog niet kunnen draaien* are the highest-value words in the archive.
4. **Sarcasm pass.** Any sentence reading as a factual report gets checked against tone.
5. **Disagreement is the product.** A hands-on member contradicting a press release is the headline. See `C066`.
6. **External research annotates, never narrates.**
7. **Publish the gaps.** Truncations and boundaries are content.
8. **Two-pass build.** Pass 2 is an adversarial reviewer trying to break every claim. That pass produced 26 of the 26 fact-checks here, and caught the Soofi S and FinBERT errors.

---

## Landmines — do not let a rebuild merge these

- **Patrick** (vouched for Underdog Design, 22 Jul) ≠ **Patrik** (IT at DNA, co-founder PilarBKK, joined 28 Jul). Two people.
- **Valentijn** (Head of Product, Azumuta — posts here) ≠ **Valentijn Destoop** (quidante.com, Ghent — does not post).
- **bert mvt** (posts) ≠ **Bert Verstappen** ≠ **~Bert (Jef's mentor)**.
- **Emile Nols** appears as both `You` and `Emile Nols` in the export.
- **Jef Cavens** ≠ **Jef Van Gool**. Both highly active; both "Jef".
- Christophe's pose-detection question (`C022`) survives **only as quoted reply-context** inside Jef Cavens' 09:40 message. It has no standalone Layer 0 record.

---

## Counters

Replace the site's numbers with `corrected_counters.json`:

| Site says | Actually |
|---|---|
| 12 Structured Topics | 19 threads (10 resolved / 4 contested / 5 open) |
| 28 Curated Links | 66 unique URLs (72 shares) |
| 16 Active Contributors | 31 people posted |
| 25 Active Members | 77 in roster; 31 posted in this period |
| 17+ Verified LinkedIn Profiles | **1** was shared in the whole transcript. Delete this counter. |
| July 16–29 | July 16–**28** |

---

## Privacy

`identity_map_PRIVATE.json` and `member_roster_PRIVATE.json` contain **77 real Belgian and Dutch mobile numbers**. They exist so rebuilds can disambiguate people. They must never be committed to a public repo, deployed to Vercel, or pasted into a shared doc. The previous source document carried this roster *and was shared into the group chat*. Everything web-facing uses `speaker` / `speaker_id` only.

---

## Usage

```bash
python3 validate.py          # guards the archive
python3 build_data_v2.py     # regenerates data.v2.js from Layer 0 + Layer 1 + the form
python3 validate_site.py     # guards the deploy; non-zero exit = do not ship
```

## Attestations

Some identities can't be resolved from data alone. `attestations.json` is where a human
confirmation gets recorded — who confirmed it, when, and on what basis — so that resolving
an ambiguity is a data change rather than a code edit, and so it can be audited or undone.

```json
{ "id": "ATT-001", "speaker_id": "patrick",
  "links_to_form_row": "Patrick Fransen",
  "linkedin": "https://www.linkedin.com/in/patrickfransen/",
  "attested_by": "Emile Nols", "attested_on": "2026-07-30",
  "explicitly_not_merged_with": { "name": "Filip Fransen", "why": "different person, same surname" } }
```

Rules: an attestation names its attester and date; it never merges two `speaker_id`s;
and removing it cleanly removes the data it authorised. `validate_site.py` rejects any
published LinkedIn URL that lacks either a message ID or an attestation ID — which is
exactly the rule the previous `data.js` had no way to break loudly.

Unresolved links live in `open_questions` and stay unresolved until someone attests.
Currently open: `bert mvt` ↔ Bert Marievoet, `georges` ↔ Georges Lieben (no phone on
either form row), and `TCAL` ↔ Caluwaerts Tom (phone one digit off).
