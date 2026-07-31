#!/usr/bin/env python3
"""
Pre-publish validator for the AA / Ai Anonymous structured archive.

Run this before every publish. Non-zero exit = do not ship.
It enforces the rules that the previous pipeline broke silently.
"""
import json, re, sys

FAIL, WARN = [], []
def fail(rule, msg): FAIL.append(f"[{rule}] {msg}")
def warn(rule, msg): WARN.append(f"[{rule}] {msg}")

l0 = json.load(open('layer0_messages.json'))
l1 = json.load(open('layer1_claims.json'))
claims, threads = l1['claims'], {t['id']: t for t in l1['threads']}
ids = {m['msg_id'] for m in l0}
idx = {m['msg_id']: m for m in l0}

STANCE = {'asserts','asks','jokes','shares','secondhand','hedges','disputes'}
CERT   = {'hands_on','stated_flatly','hedged','opinion','secondhand','untested','sarcasm','unresolved'}

# Hedge markers matched against the ORIGINAL-LANGUAGE quote. Translations are not matched,
# because rendering 'denk ik' as 'I think' would false-positive on unrelated English.
# A hedge expresses uncertainty ABOUT A FACT.
HEDGES = ['blijkbaar', 'als ik me niet vergis', 'denk ik', 'ik denk dat', 'ofzo', 'vermoed',
          'zou me verbazen', 'nog niet kunnen', 'nog niet kunnen draaien', 'zonder het te gebruiken',
          'als dat werkt', 'wellicht', 'misschien']
# Opinion markers are NOT hedges. They mark a stated view, and require certainty='opinion'.
OPINIONS = ['volgens mij', 'imo', 'zou ik verwachten', 'ik zou verwachten', 'lijkt mij', 'lijkt me']
# NB: 'nog niet' alone is excluded on purpose - 'nog niet structureel' and 'nog niet maar staat
# op backlog' are factual statements of current state, not hedges.

# ---- R1: every claim traces to a real message ----
for c in claims:
    if not c.get('msg_ids'):
        fail('R1-evidence', f"{c['claim_id']} has no msg_ids — cannot publish")
    for m in c.get('msg_ids', []):
        if m not in ids:
            fail('R1-evidence', f"{c['claim_id']} cites unknown msg_id {m}")

# ---- R2: quote-or-cut ----
for c in claims:
    if not (c.get('quote') or '').strip():
        fail('R2-quote', f"{c['claim_id']} has no verbatim quote — cannot publish")
    if len((c.get('quote') or '').strip()) < 3:
        warn('R2-quote', f"{c['claim_id']} quote is suspiciously short")

# ---- R3: quote must actually appear in a cited message ----
def norm(s): return re.sub(r'[^a-z0-9]', '', (s or '').lower())
for c in claims:
    pool = norm(' '.join(idx[m]['text_original'] for m in c.get('msg_ids', []) if m in idx))
    frags = [f for f in re.split(r'…|\.\.\.', c.get('quote','')) if len(norm(f)) > 25]
    if not frags or not pool: continue
    if not any(norm(f)[:60] in pool for f in frags):
        if c.get('provenance_verified'):
            continue        # human-verified: link-share wrapper or quoted reply-context
        warn('R3-provenance', f"{c['claim_id']} quote not found in its cited message(s) — verify by hand, "
                              f"then set provenance_verified:true with a provenance_note")

# ---- R4: hedges must survive ----
for c in claims:
    q = (c.get('quote','') or '').lower()          # original language only
    def hit(marker):                                # word-boundary: 'lijkt me' must not match 'lijkt meer'
        return re.search(r'(?<![a-z])' + re.escape(marker) + r'(?![a-z])', q) is not None
    found = [h for h in HEDGES if hit(h)]
    opin  = [o for o in OPINIONS if hit(o)]
    if found and c['certainty'] not in ('hedged','untested','secondhand','unresolved'):
        fail('R4-hedge', f"{c['claim_id']} quote contains hedge {found[0]!r} but certainty={c['certainty']!r}")
    if opin and c['certainty'] not in ('opinion','hedged','untested','unresolved'):
        fail('R4-hedge', f"{c['claim_id']} quote contains opinion marker {opin[0]!r} but certainty={c['certainty']!r}")
    if found and not any(w in c['claim'].lower() for w in
                         ['apparent','estimates','if he','if i','not been able','without having',
                          'suspect','would be surprised','believe','thinks','says','considering',
                          'hearsay','relays','about','or so','roughly','seems']):
        warn('R4-hedge', f"{c['claim_id']} hedge {found[0]!r} may not survive into the claim text")

# ---- R5: sarcasm must never be published as assertion ----
for c in claims:
    if c['certainty'] == 'sarcasm' and c['stance'] not in ('jokes',):
        fail('R5-sarcasm', f"{c['claim_id']} is sarcasm but stance={c['stance']!r} — will read as reporting")

# ---- R6: no fabricated consensus ----
BANNED = ['consensus was','the consensus','group agreed','group concluded','all agree',
          'everyone agreed','the group decided','landing on','unanimous']
for c in claims:
    for b in BANNED:
        if b in c['claim'].lower():
            fail('R6-consensus', f"{c['claim_id']} asserts consensus ({b!r}). Use thread status + Positions instead.")
for t in l1['threads']:
    if t['status'] not in ('resolved','contested','open'):
        fail('R6-consensus', f"thread {t['id']} has invalid status {t['status']!r}")
    if t['status'] in ('contested','open') and re.search(r'\bconsensus\b', t['resolution'], re.I):
        fail('R6-consensus', f"thread {t['id']} is {t['status']} but its resolution claims consensus")

# ---- R7: external research must be quarantined ----
for c in claims:
    fc = c.get('factcheck')
    if fc:
        if not fc.get('corrected_fact'):
            fail('R7-research', f"{c['claim_id']} factcheck has no corrected_fact")
        # figures the member themselves said, quoted back inside the correction, need no external source
        cf_ext = re.sub(r'''["\u2018\u2019\u201c\u201d'][^"\u2018\u2019\u201c\u201d']{0,200}["\u2018\u2019\u201c\u201d']''', '', fc.get('corrected_fact',''))
        hard = re.findall(r'\b\d[\d.,]*\s*(?:%|B\b|GB|TB|petaFLOP|PFLOP|trillion|billion)', cf_ext)
        if hard and not fc.get('sources') and 'WARNING' not in fc.get('verdict','') \
           and 'STATUS' not in fc.get('verdict','') and 'VOICE' not in fc.get('verdict','') \
           and 'ORIGIN' not in fc.get('verdict',''):
            fail('R7-research', f"{c['claim_id']} factcheck states hard figures with no source URL")
    # researched specs must not sit inside the claim text unsourced
    if not fc and re.search(r'\b(petaFLOP|PFLOP|Terminal-Bench|hidden_size|A\d+B\b)', c['claim']):
        warn('R7-research', f"{c['claim_id']} claim text contains a spec-like figure but has no factcheck block")

# ---- R8: enum + schema hygiene ----
for c in claims:
    if c['stance'] not in STANCE: fail('R8-schema', f"{c['claim_id']} bad stance {c['stance']!r}")
    if c['certainty'] not in CERT: fail('R8-schema', f"{c['claim_id']} bad certainty {c['certainty']!r}")
    if c['thread'] not in threads: fail('R8-schema', f"{c['claim_id']} unknown thread {c['thread']!r}")
    if not (c.get('translation') or '').strip():
        warn('R8-schema', f"{c['claim_id']} has no translation")

# ---- R9: privacy — no phone numbers in publishable layers ----
PHONE = re.compile(r'\+\s?\d{2}\s?\d[\d\s]{6,}')
for m in l0:
    if PHONE.search(m['text_original']):
        warn('R9-privacy', f"{m['msg_id']} verbatim text contains a phone number — redact before rendering")
for c in claims:
    for fld in ('claim','quote','translation'):
        if PHONE.search(c.get(fld) or ''):
            fail('R9-privacy', f"{c['claim_id']} field {fld} contains a phone number")

# ---- R10: coverage honesty ----
dates = sorted({m['date'] for m in l0})
try:
    g = json.load(open('gaps_register.json'))
    if g['coverage']['actual_range'] != f"{dates[0]} to {dates[-1]}":
        fail('R10-coverage', "gaps_register coverage does not match Layer 0")
except FileNotFoundError:
    fail('R10-coverage', "gaps_register.json missing — gaps must be published, not hidden")
if not any(m['truncated'] for m in l0):
    restored = sum(1 for m in l0 if m.get('restored'))
    if restored:
        print(f"note: 0 truncated, {restored} message(s) restored from member pastes")
    else:
        warn('R10-coverage', "no truncated messages flagged and none restored — verify this is real")

# ---- report ----
print(f"Layer 0: {len(l0)} messages, {dates[0]} to {dates[-1]}")
print(f"Layer 1: {len(claims)} claims across {len(threads)} threads, "
      f"{sum(1 for c in claims if c.get('factcheck'))} fact-checked")
print()
for w in WARN: print("WARN ", w)
if WARN: print()
for f_ in FAIL: print("FAIL ", f_)
print()
if FAIL:
    print(f"✗ {len(FAIL)} blocking failure(s), {len(WARN)} warning(s). DO NOT PUBLISH.")
    sys.exit(1)
print(f"✓ All rules passed ({len(WARN)} warning(s)). Safe to publish.")
