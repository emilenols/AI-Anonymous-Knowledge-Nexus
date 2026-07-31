#!/usr/bin/env python3
"""
Pre-deploy validator for data.v2.js.

validate.py guards the archive (Layer 0 / Layer 1).
This guards what actually ships to the browser.

Every rule here exists because the previous data.js broke it.
Non-zero exit = do not deploy.
"""
import json, csv, re, sys
import sys
try:  # Windows consoles default to cp1252; force UTF-8 so output never crashes
    sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')
except Exception: pass

FAIL, WARN = [], []
def fail(r, m): FAIL.append(f"[{r}] {m}")
def warn(r, m): WARN.append(f"[{r}] {m}")

D  = json.load(open('data.v2.json', encoding='utf-8'))
L0 = json.load(open('layer0_messages.json', encoding='utf-8'))
ATT = json.load(open('attestations.json', encoding='utf-8'))
MSG = {m['msg_id']: m for m in L0}


def _find_form():
    import glob, os
    for pat in ("repo/*Form Responses*.csv", "private/*Form Responses*.csv",
                "pipeline/private/*Form Responses*.csv", "*Form Responses*.csv",
                "../repo/*Form Responses*.csv"):
        hits = glob.glob(pat)
        if hits: return hits[0]
    raise SystemExit("Intake form CSV not found. Expected it in private/ or repo/.")

form_rows = list(csv.reader(open(_find_form(), encoding='utf-8-sig')))[1:]
FORM_EMAILS = {r[3].strip().lower() for r in form_rows if r[3].strip()}
ATT_IDS = {a['id'] for a in ATT['attestations']}

def canon(u):
    u = (u or '').strip().rstrip('/').lower()
    return re.sub(r'^https?://(www\.)?', '', u).split('?')[0]
REAL = {canon(u) for m in L0 for u in m['links']}

# ---- S1: every rendered link was actually shared in the chat -------------
for t in D['topics']:
    for l in t['links']:
        if canon(l['url']) not in REAL:
            fail('S1-link', f"topic {t['threadId']}: {l['url']} was never shared in the transcript")
        if not l.get('evidence'):
            fail('S1-link', f"topic {t['threadId']}: {l['url']} has no evidence msg_id")
        elif l['evidence'] not in MSG:
            fail('S1-link', f"topic {t['threadId']}: {l['url']} cites unknown msg {l['evidence']}")
for r in D['resources']:
    if canon(r['url']) not in REAL:
        fail('S1-link', f"resource {r['url']} was never shared in the transcript")

# ---- S2: link attribution matches who actually sent it -------------------
sharer = {}
for m in L0:
    for u in m['links']: sharer.setdefault(canon(u), m['msg_id'])
for coll, label in ((( l for t in D['topics'] for l in t['links']), 'topic'),
                    (D['resources'], 'resource')):
    for l in coll:
        mid = l.get('evidence') or sharer.get(canon(l['url']))
        if mid and mid in MSG:
            actual = MSG[mid]['speaker']
            claimed = l.get('sharedBy') or ''
            first = actual.split()[0].lower()
            if first not in claimed.lower() and claimed.split()[0].lower() not in actual.lower():
                fail('S2-attribution',
                     f"{label} {l['url']}: credited to {claimed!r}, actually sent by {actual!r} ({mid})")

# ---- S3: no PII the person did not supply --------------------------------
for m in D['members']:
    if m.get('email') and m['email'].lower() not in FORM_EMAILS:
        fail('S3-pii', f"{m['name']}: email {m['email']} is not in the intake form — fabricated")
    li = m.get('linkedin')
    if li:
        src = m.get('linkedinSource', '')
        att_ok = any(a in src for a in ATT_IDS)
        msg_ok = bool(re.search(r'\b\d{8}-\d{4}-\d{3}\b', src))
        if not (att_ok or msg_ok):
            fail('S3-pii', f"{m['name']}: LinkedIn URL has no provenance. A LinkedIn URL must come from "
                           f"a message the person posted, or a recorded attestation.")
    if m.get('email') or m.get('background'):
        if not m.get('profileSource'):
            fail('S3-pii', f"{m['name']}: publishes profile data with no profileSource")

# ---- S4: no fabricated consensus in rendered prose -----------------------
BANNED = ['consensus', 'the group backed', 'the group agreed', 'group concluded',
          'collective recommendation', 'landed again on', 'all endorse', 'unanimous']
for t in D['topics']:
    blob = ' '.join([t['title'], t['summary'], t.get('statusReason','')]).lower()
    for b in BANNED:
        if b in blob:
            fail('S4-consensus', f"topic {t['threadId']} prose contains {b!r}. "
                                 f"Use status ({t['status']}) + positions instead.")
    if t['status'] not in ('resolved','contested','open'):
        fail('S4-consensus', f"topic {t['threadId']} has invalid status {t['status']!r}")

# ---- S5: every position carries evidence ---------------------------------
for t in D['topics']:
    if not t.get('positions'):
        fail('S5-evidence', f"topic {t['threadId']} has no positions")
    for p in t.get('positions', []):
        if not p.get('evidence'):
            fail('S5-evidence', f"topic {t['threadId']}: position by {p['speaker']} has no evidence")
        for mid in p.get('evidence', []):
            if mid not in MSG:
                fail('S5-evidence', f"topic {t['threadId']}: unknown msg {mid}")
        if not (p.get('quote') or '').strip():
            fail('S5-evidence', f"topic {t['threadId']}: position by {p['speaker']} has no verbatim quote")
    if 'keyTakeaways' in t:
        fail('S5-evidence', f"topic {t['threadId']} still has keyTakeaways — that field has no "
                            f"evidence requirement and is where fabrications lived")

# ---- S6: external research stays quarantined -----------------------------
SPEC = re.compile(r'\b(petaFLOP|PFLOP|Terminal-Bench|\d+\s*%|\d+B[- ]A\d+B)\b', re.I)
for t in D['topics']:
    if SPEC.search(t['summary']):
        warn('S6-research', f"topic {t['threadId']} summary contains a spec figure — "
                            f"verify it is the group's claim, not researched context")
    for fc in t.get('factChecks', []):
        if not fc.get('correctedFact'):
            fail('S6-research', f"topic {t['threadId']} factCheck has no correctedFact")
        cf_ext = re.sub(r'''["\u2018\u2019\u201c\u201d'][^"\u2018\u2019\u201c\u201d']{0,200}["\u2018\u2019\u201c\u201d']''', '', fc.get('correctedFact',''))
        if re.search(r'\b\d[\d.,]*\s*(?:%|GB|TB|trillion|billion)', cf_ext) \
           and not fc.get('sources') and 'WARNING' not in fc.get('verdict','') \
           and not any(k in fc.get('verdict','') for k in ('STATUS','VOICE','ORIGIN')):
            fail('S6-research', f"topic {t['threadId']} factCheck states figures with no source URL")

# ---- S7: counters are computed, not typed --------------------------------
md = D['metadata']
checks = {
    'threads': len(D['topics']),
    'uniqueLinks': len(D['resources']),
    'peopleWhoPosted': sum(1 for m in D['members'] if m['messages'] > 0),
    'directorySize': len(D['members']),
    'threadsResolved': sum(1 for t in D['topics'] if t['status'] == 'resolved'),
    'threadsContested': sum(1 for t in D['topics'] if t['status'] == 'contested'),
    'threadsOpen': sum(1 for t in D['topics'] if t['status'] == 'open'),
    'factChecks': sum(len(t['factChecks']) for t in D['topics']),
}
for k, v in checks.items():
    if md.get(k) != v:
        fail('S7-counters', f"metadata.{k} = {md.get(k)}, actual = {v}")

# ---- S8: coverage honesty ------------------------------------------------
dates = sorted({m['date'] for m in L0})
if dates[-1] not in md.get('period', ''):
    fail('S8-coverage', f"metadata.period {md.get('period')!r} does not end at the last message ({dates[-1]})")
if '29' in md.get('periodLabel', '') and '2026-07-29' not in dates:
    fail('S8-coverage', "period label claims 29 July, but no 29 July messages exist")
_g = D.get('gaps', {})
if not _g.get('truncatedMessages') and not _g.get('restoredMessages'):
    fail('S8-coverage', "gaps ship neither truncations nor restorations — gaps must be published, not hidden")

# ---- S10: sensitive personal disclosures must never be published ---------
# NB: 'ziekte' was removed — it matches 'infectieziekten', a microbiologist's specialism.
# Pattern matching cannot tell a disclosure from a job description, so anything it flags is
# reviewable: PII_CLEARED below records a human decision to publish, with a reason.
SENSITIVE = re.compile(r'kanker|cancer|mama van|zwanger|burn.?out|depressie|overlijden|scheiding', re.I)
PII_CLEARED = {
    # name -> why this flagged text is in fact professional, not personal
    'Bruno Van herendael': "Describes his medical specialism (infectious diseases, microbiology), not his own health.",
}
SURVEY_FIELDS = ('whyJoined', 'goals', 'expectations', 'contributes')
for m in D['members']:
    for fld in ('background', 'company', 'website') + SURVEY_FIELDS:
        v = m.get(fld)
        if v and SENSITIVE.search(v) and m['name'] not in PII_CLEARED:
            fail('S10-sensitive', f"{m['name']}: published {fld} contains a health/family disclosure. "
                                  f"Members wrote this for the organiser, not for a web page.")
    # Survey answers are published by owner decision (31 Jul 2026). They remain health-filtered
    # above. If that decision is ever reversed, set PUBLISH_SURVEY = False here.

# ---- S9: identity safety -------------------------------------------------
names = [m['name'] for m in D['members']]
if len(names) != len(set(names)):
    dupes = {n for n in names if names.count(n) > 1}
    fail('S9-identity', f"duplicate member names: {dupes}")
for m in D['members']:
    if m.get('doNotMergeWith'):
        other = m['doNotMergeWith']['name']
        if other not in names:
            fail('S9-identity', f"{m['name']} is marked do-not-merge with {other!r}, "
                                f"but {other!r} is absent — they may have been merged")

# ---- report --------------------------------------------------------------
print(f"data.v2: {len(D['topics'])} topics, {sum(len(t['positions']) for t in D['topics'])} positions, "
      f"{md['factChecks']} fact-checks, {len(D['resources'])} links, {len(D['members'])} members")
print(f"period {md['periodLabel']} | {md['threadsResolved']} resolved / {md['threadsContested']} contested / "
      f"{md['threadsOpen']} open")
print(f"PII: {sum(1 for m in D['members'] if m.get('email'))} emails (all from the intake form), "
      f"{sum(1 for m in D['members'] if m.get('linkedin'))} LinkedIn URLs (all with provenance)")
print()
for w in WARN: print("WARN ", w)
if WARN: print()
for f in FAIL: print("FAIL ", f)
print()
if FAIL:
    print(f"✗ {len(FAIL)} blocking failure(s), {len(WARN)} warning(s). DO NOT DEPLOY.")
    sys.exit(1)
print(f"✓ All rules passed ({len(WARN)} warning(s)). Safe to deploy.")
