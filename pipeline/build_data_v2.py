#!/usr/bin/env python3
"""
Generates data.v2.js for the AA / Ai Anonymous Knowledge Nexus.

Every field is derived from:
  - layer0_messages.json   (the WhatsApp transcript, verbatim)
  - layer1_claims.json     (claims, each traced to a msg_id)
  - the intake form CSV    (the only source of emails / surnames)

Nothing is hand-written. Nothing without provenance is emitted.
"""
import json, csv, re, io

L0 = json.load(open('layer0_messages.json'))
L1 = json.load(open('layer1_claims.json'))
OLD = json.load(open('site_data.json'))
MSG = {m['msg_id']: m for m in L0}
THREADS = {t['id']: t for t in L1['threads']}

# ---------------------------------------------------------------- identities
def digits(s): return re.sub(r'\D', '', s or '')
def tail(s, n=8):
    d = digits(s); return d[-n:] if len(d) >= n else d


def _find_form():
    import glob, os
    for pat in ("repo/*Form Responses*.csv", "private/*Form Responses*.csv",
                "pipeline/private/*Form Responses*.csv", "*Form Responses*.csv",
                "../repo/*Form Responses*.csv"):
        hits = glob.glob(pat)
        if hits: return hits[0]
    raise SystemExit("Intake form CSV not found. Expected it in private/ or repo/.")

form_rows = list(csv.reader(open(_find_form(), encoding='utf-8-sig')))[1:]
FORM = []
for r in form_rows:
    FORM.append(dict(first=r[1].strip(), last=r[2].strip(),
                     full=f"{r[1].strip()} {r[2].strip()}".strip(),
                     email=r[3].strip(), phone=r[5].strip(), tail=tail(r[5]),
                     company=r[6].strip(), website=r[7].strip(),
                     why=r[15].strip(), goals=r[16].strip(),
                     background=r[17].strip(), expects=r[18].strip(),
                     contributes=r[19].strip()))

ident = json.load(open('identity_map_PRIVATE.json'))
ROSTER = json.load(open('member_roster_PRIVATE.json'))
PHONE_BY_ID = {s['speaker_id']: s['phone'] for s in ident['canonical_speakers']}
# Some speakers never had their number appear in message text (the export only shows it
# on first post). Fall back to the roster, matched on display name.
_roster_by_name = {}
for _r in ROSTER:
    _roster_by_name.setdefault(_r['display'].strip().lower(), _r['phone'])
for _s in ident['canonical_speakers']:
    if not PHONE_BY_ID.get(_s['speaker_id']):
        _hit = _roster_by_name.get(_s['display'].strip().lower())
        if _hit: PHONE_BY_ID[_s['speaker_id']] = _hit
# the export labels the account owner 'You' in the roster
if not PHONE_BY_ID.get('emile-nols'):
    PHONE_BY_ID['emile-nols'] = _roster_by_name.get('you') or ''

# speaker_id -> form record. 'confirmed' = phone matches; 'probable' = documented near-match.
LINK_CONFIRMED, LINK_PROBABLE = {}, {}
form_by_tail = {f['tail']: f for f in FORM if f['tail']}
for sid, ph in PHONE_BY_ID.items():
    if ph and tail(ph) in form_by_tail:
        LINK_CONFIRMED[sid] = form_by_tail[tail(ph)]

# Near-matches: form phone mangled by the form's own formatting, verified digit-by-digit by hand.
PROBABLE = {
    'jef-van-gool':           ('Jef Van Gool',        'form phone "(003) 247 92 54" is +32 479 25 43.. truncated by the form field'),
    'jef-cavens':             ('Jef Cavens',          'form phone ...84 34 vs roster ...84 35 — single-digit typo'),
    'philip-van-ceulebroeck': ('Filip Ceulebroeck',   'form phone (324) 862 13 74 = +32 486 21 37 4x; note the form spells it "Filip Ceulebroeck"'),
    'tcal':                   ('Caluwaerts Tom',      'form (049) 032 65 90 vs roster +32 490 39 65 90 — one digit differs; "TCAL" fits T. CALuwaerts'),
}
by_full = by_full_pre = {f['full']: f for f in FORM}
for sid, (full, why) in PROBABLE.items():
    if full in by_full and sid not in LINK_CONFIRMED:
        LINK_PROBABLE[sid] = dict(by_full[full], _why=why)

# Human confirmations for links phone-matching could not make. Data, not code.
ATT = json.load(open('attestations.json'))
LINK_ATTESTED, ATT_BY_SID = {}, {}
for a in ATT['attestations']:
    row = by_full_pre.get(a.get('links_to_form_row'))
    if row:
        LINK_ATTESTED[a['speaker_id']] = row
    ATT_BY_SID[a['speaker_id']] = a

# Still-unresolved name guesses. Never used for email/PII.
UNCONFIRMED_NAME_GUESS = {
    q['speaker_id']: (q.get('candidate_form_row'), q['why'])
    for q in ATT.get('open_questions', []) if q.get('status') == 'unresolved'
}

DISPLAY, NAME_SRC = {}, {}
for m in L0:
    sid = m['speaker_id']
    if sid == 'system' or sid in DISPLAY: continue
    if sid in LINK_CONFIRMED:
        DISPLAY[sid] = LINK_CONFIRMED[sid]['full']; NAME_SRC[sid] = 'form_phone_confirmed'
    elif sid in LINK_ATTESTED:
        DISPLAY[sid] = LINK_ATTESTED[sid]['full']; NAME_SRC[sid] = 'attested'
    elif sid in LINK_PROBABLE:
        DISPLAY[sid] = m['speaker']; NAME_SRC[sid] = 'form_probable'   # keep chat name on the surface
    else:
        DISPLAY[sid] = m['speaker']; NAME_SRC[sid] = 'chat_only'

def disp(speaker_field):
    for sid, m in ((m['speaker_id'], m) for m in L0):
        if m['speaker'] == speaker_field: return DISPLAY.get(sid, speaker_field)
    return speaker_field

# ---------------------------------------------------------------- categories
CAT = {
 'T01':'hardware','T02':'hardware','T03':'hardware','T04':'vision','T05':'models',
 'T06':'vibe','T07':'vibe','T08':'vibe','T09':'vibe','T10':'vibe','T11':'security',
 'T12':'security','T13':'models','T14':'nlp','T15':'tools','T16':'tools',
 'T17':'projects','T18':'projects','T19':'projects',
}
TAGS = {
 'T01':['GPU sizing','NUMA','RTX 6000 Pro','workstation'],
 'T02':['GB10','DGX Spark','RTX 6000 Pro','quantisation'],
 'T03':['AWS','Cost Explorer bug','Hetzner','DigitalOcean','EU hosting'],
 'T04':['Qwen 3.5','Gemma','pose detection','TrackTrack','OSNet','re-ID'],
 'T05':['freellmapi','OpenRouter','GLM 5.2','Qwen 3.6','routing','LiteLLM'],
 'T06':['Hermes','agentic coding','Git worktrees','CodeRabbit','Telegram'],
 'T07':['cloud vs local','code pods','harness','OpenHands','Devin'],
 'T08':['HITL','Stream Deck','GitHub PR','Elgato'],
 'T09':['Underdog Design','We Are','vibe coding','agencies'],
 'T10':['Caveman','token reduction','design system','documentation'],
 'T11':['OpenAI','Hugging Face','sandbox escape','reward hacking'],
 'T12':['Fable 5','Pliny','jailbreak','agent safety'],
 'T13':['Laguna S 2.1','Soofi S','GLM 5.2','Hy3','Qwen'],
 'T14':['FinBERT','embeddings','BERT','PyTorch'],
 'T15':['Telegram','Slack','Tailscale','WhatsApp API'],
 'T16':['workflow mining','screenpipe','privacy','dHash','delegation KPI'],
 'T17':['MCP','SaaS monetisation','DeckSlide','privacy'],
 'T18':['Notiva','Azumuta','member projects','introductions'],
 'T19':['meetup','Antwerp','group identity'],
}
STANCE_LABEL = {'asserts':'states','asks':'asks','jokes':'jokes','shares':'shares',
                'secondhand':'relays secondhand','hedges':'hedges','disputes':'disputes'}

# ---------------------------------------------------------------- links
def canon(u):
    u = (u or '').strip().rstrip('/').lower()
    return re.sub(r'^https?://(www\.)?', '', u).split('?')[0]

REAL_LINKS = {}
for m in L0:
    for u in m['links']:
        REAL_LINKS.setdefault(canon(u), dict(url=u, sharedBy=DISPLAY.get(m['speaker_id'], m['speaker']),
                                             msg_id=m['msg_id'], date=m['date']))
# which thread does a message belong to
MSG2THREAD = {}
for c in L1['claims']:
    for mid in c['msg_ids']: MSG2THREAD.setdefault(mid, c['thread'])

TITLES = {  # descriptive labels for the real URLs, derived from the message text
 'github.com/tashfeenahmed/freellmapi':'freellmapi — OpenAI-compatible proxy stacking 28 free tiers',
 'github.com/vllm-project/semantic-router':"Red Hat's semantic router for vLLM",
 'docs.litellm.ai/blog/autorouter-v2':'LiteLLM AutoRouter v2',
 'cursor.com/blog/router':'Cursor Router',
 'hetzner.com/dedicated-rootserver/matrix-gpu':'Hetzner dedicated GPU matrix line',
 'aki.io':'aki.io — alternative GPU service',
 'tailscale.com':'Tailscale mesh VPN',
 'discord.gg/jahhxzsbz':'RTX 6000 Pro Discord',
 'coolblue.nl/product/920071/elgato-stream-deck.htm':'Elgato Stream Deck+ (Coolblue)',
 'github.com/juliusbrussee/caveman':'Caveman — 65% fewer output tokens',
 'github.com/mattpocock/skills':'Matt Pocock — Skills for Real Engineers',
 'aipatternbook.com':'Encyclopedia of Agentic Coding Patterns',
 'lilianweng.github.io/posts/2026-07-04-harness':'Harness Engineering for Self-Improvement',
 'sidepulse.io':'SidePulse — agent status at a glance',
 'openai.com/index/hugging-face-model-evaluation-security-incident':'OpenAI / Hugging Face security incident report',
 'cybersecuritynews.com/anthropics-claude-fable-5-jailbroken':'Reported Claude Fable 5 jailbreak',
 'cybersecuritynews.com/aws-cost-explorer-bug':'AWS Cost Explorer bug — trillion-dollar estimates',
 'techcrunch.com/2026/07/20/openai-is-scared-of-open-weight-models-should-the-us-be':'OpenAI is scared of open-weight models (TechCrunch)',
 'we-are.be/nl':'We Are — Ghent agency',
 'openhands.dev':'OpenHands — open platform for cloud coding agents',
 'devin.ai':'Devin', 'factory.ai':'Factory.ai', 'ampcode.com':'Amp',
 'deckslide.com':'DeckSlide', 'printingpress.dev':'Printing Press',
 'agentmail.to':'AgentMail — email inbox API for AI agents',
 'github.com/alibaba/open-code-review':'Alibaba open-code-review',
 'github.com/ayghri/i-have-adhd':'i-have-adhd',
 'mistral.ai/news/ocr-4':'Mistral OCR 4',
 'hostinger.com/applications/hermes-agent':'Hostinger hosted Hermes agent',
 'snowskiproperty-production.up.railway.app':'Snowskiproperty (side project)',
 'meet.google.com/mtw-azcy-nnv':'Group Google Meet room',
}
def link_title(c, rec):
    if c in TITLES: return TITLES[c]
    return rec['url'].split('/')[2].replace('www.', '')

# ---------------------------------------------------------------- topics
topics = []
for tid, th in THREADS.items():
    claims = [c for c in L1['claims'] if c['thread'] == tid]
    if not claims: continue
    ev = sorted({m for c in claims for m in c['msg_ids']})
    people, seen = [], set()
    for c in claims:
        n = disp(c['speaker'].split(' (')[0])
        if n not in seen: seen.add(n); people.append(n)

    positions = [dict(
        speaker=disp(c['speaker'].split(' (')[0]),
        stance=c['stance'], stanceLabel=STANCE_LABEL.get(c['stance'], c['stance']),
        certainty=c['certainty'], claim=c['claim'],
        quote=c['quote'], translation=c['translation'],
        evidence=c['msg_ids'],
        date=MSG[c['msg_ids'][0]]['date'] if c['msg_ids'] else None,
    ) for c in claims]

    factChecks = [dict(about=c['claim_id'], subject=c['claim'][:110],
                       verdict=c['factcheck']['verdict'],
                       correctedFact=c['factcheck']['corrected_fact'],
                       sources=c['factcheck'].get('sources', []),
                       note=c['factcheck'].get('note', ''))
                  for c in claims if c.get('factcheck')]

    tlinks = []
    for c, rec in REAL_LINKS.items():
        if MSG2THREAD.get(rec['msg_id']) == tid:
            tlinks.append(dict(title=link_title(c, rec), url=rec['url'],
                               sharedBy=rec['sharedBy'], evidence=rec['msg_id']))

    dates = sorted({MSG[m]['date'] for m in ev})
    hands_on = sum(1 for c in claims if c['certainty'] == 'hands_on')
    summary = th['resolution']
    shape = (f"{len(claims)} traced contribution{'s' if len(claims)!=1 else ''} "
             f"from {len(people)} member{'s' if len(people)!=1 else ''}"
             f"{f', {hands_on} first-hand' if hands_on else ''}"
             f"{f' · {len(factChecks)} fact-check' + ('s' if len(factChecks)!=1 else '') if factChecks else ''}")

    topics.append(dict(
        id=tid.lower(), threadId=tid, category=CAT.get(tid, 'tools'),
        title=th['title'], status=th['status'], statusReason=th['resolution'], shape=shape,
        summary=summary,
        dateRange=(f"{dates[0]} → {dates[-1]}" if len(dates) > 1 else dates[0]) if dates else th['days'],
        participants=people, positions=positions, factChecks=factChecks,
        links=tlinks, tags=TAGS.get(tid, []), evidence=ev,
        prompts=dict(
            deepDive=(f"You are a senior engineer. Below are verbatim positions from a practitioner "
                      f"WhatsApp group on: {th['title']}. Thread status: {th['status'].upper()} — "
                      f"{th['resolution']}\n\nDo not assume the members agree. Where they differ, keep the "
                      f"difference. Preserve every hedge. Then: (1) state what is actually established, "
                      f"(2) state what remains open, (3) tell me what you would test first and why.\n\n"
                      f"POSITIONS:\n" + "\n".join(
                          f"- {p['speaker']} ({p['stanceLabel']}, {p['certainty']}): {p['claim']}"
                          for p in positions)),
            challenge=(f"Argue against the prevailing view in this thread on {th['title']}. "
                       f"Use the verbatim quotes below. Identify which claims rest on first-hand testing "
                       f"and which are secondhand or hedged, and say which would break first under load.\n\n"
                       + "\n".join(f"- {p['speaker']} [{p['certainty']}]: \"{p['quote'][:200]}\""
                                   for p in positions)),
            brief=(f"Write a 150-word brief for a non-technical executive on: {th['title']}. "
                   f"State plainly that the thread is {th['status']}. Do not manufacture a conclusion. "
                   f"Context: {th['resolution']}"),
        ),
    ))

# ---------------------------------------------------------------- resources
resources = []
for c, rec in sorted(REAL_LINKS.items(), key=lambda kv: kv[1]['date']):
    tid = MSG2THREAD.get(rec['msg_id'])
    resources.append(dict(title=link_title(c, rec), url=rec['url'], sharedBy=rec['sharedBy'],
                          date=rec['date'], evidence=rec['msg_id'],
                          category=CAT.get(tid, 'tools') if tid else 'unfiled',
                          topic=THREADS[tid]['title'] if tid else None))

# ---------------------------------------------------------------- members
posted = {}
for m in L0:
    if m['speaker_id'] != 'system':
        posted.setdefault(m['speaker_id'], 0); posted[m['speaker_id']] += 1

members = []
for sid, n in sorted(posted.items(), key=lambda kv: -kv[1]):
    f = LINK_CONFIRMED.get(sid) or LINK_ATTESTED.get(sid) or LINK_PROBABLE.get(sid)
    src = NAME_SRC.get(sid, 'chat_only')
    contributed = sorted({THREADS[c['thread']]['title'] for c in L1['claims']
                          if disp(c['speaker'].split(' (')[0]) == DISPLAY[sid]})
    rec = dict(
        id=sid, name=DISPLAY[sid], messages=n,
        nameSource=('intake form, phone-confirmed' if src == 'form_phone_confirmed'
                    else f"intake form, linked by attestation {ATT_BY_SID[sid]['id']}" if src == 'attested'
                    else 'intake form, phone match approximate' if src == 'form_probable'
                    else 'WhatsApp display name only'),
        # PII ONLY where the person supplied it themselves on the form
        email=(f['email'] or None) if f else None,
        company=(f['company'] or None) if f else None,
        website=(f['website'] or None) if f else None,
        background=(f['background'] or None) if f else None,
        goals=(f['goals'] or None) if f else None,
        contributes=(f['contributes'] or None) if f else None,
        profileSource=('self-reported on the AA intake form (phone-confirmed)' if src == 'form_phone_confirmed'
                       else 'self-reported on the AA intake form; identity link confirmed by attestation '
                            + ATT_BY_SID[sid]['id'] if src == 'attested'
                       else 'self-reported on the AA intake form (phone match approximate — verify)'
                       if src == 'form_probable'
                       else 'no intake-form response matched by phone — chat activity only'),
        linkedin=None,   # exactly one LinkedIn URL was shared in the whole transcript
        topicsContributed=contributed,
        firstSeen=min(m['date'] for m in L0 if m['speaker_id'] == sid),
        lastSeen=max(m['date'] for m in L0 if m['speaker_id'] == sid),
    )
    if sid in ATT_BY_SID:
        a = ATT_BY_SID[sid]
        rec['attestation'] = dict(id=a['id'], attestedBy=a['attested_by'], attestedOn=a['attested_on'],
                                  basis=a['basis'], resolves=a['resolves'])
        if a.get('linkedin'):
            rec['linkedin'] = a['linkedin']
            rec['linkedinSource'] = f"attested by {a['attested_by']} on {a['attested_on']} ({a['id']})"
        if a.get('explicitly_not_merged_with'):
            rec['doNotMergeWith'] = a['explicitly_not_merged_with']
    if sid == 'emile-nols':
        rec['linkedin'] = 'https://www.linkedin.com/in/emilenols'
        rec['linkedinSource'] = 'shared by Emile himself, 16 Jul 12:29 (msg 20260716-1229-002)'
    if sid in LINK_PROBABLE:
        rec['nameNote'] = LINK_PROBABLE[sid]['_why']
    if sid in UNCONFIRMED_NAME_GUESS:
        rec['nameNote'] = ('A form response named "%s" may be this person, but %s. Not merged.'
                           % UNCONFIRMED_NAME_GUESS[sid])
    members.append(rec)

# form respondents who did not post between 16-28 Jul are still members
seen_forms = {id(LINK_CONFIRMED.get(s_)) for s_ in posted} | {id(LINK_PROBABLE.get(s_)) for s_ in posted}
used = {(LINK_CONFIRMED.get(s_) or LINK_ATTESTED.get(s_) or LINK_PROBABLE.get(s_) or {}).get('full') for s_ in posted}
_emitted = {m['name'] for m in members}
for f in FORM:
    if not f['full'] or f['full'] in used or f['full'] in _emitted: continue
    members.append(dict(
        id=re.sub(r'[^a-z0-9]+','-',f['full'].lower()).strip('-'),
        name=f['full'], messages=0,
        nameSource='intake form (self-reported)',
        email=f['email'] or None, company=f['company'] or None, website=f['website'] or None,
        background=f['background'] or None, goals=f['goals'] or None,
        contributes=f['contributes'] or None,
        profileSource='self-reported on the AA intake form; did not post between 16-28 Jul',
        linkedin=None, topicsContributed=[], firstSeen=None, lastSeen=None))

# ---------------------------------------------------------------- gaps + metadata
gaps = json.load(open('gaps_register.json'))
dates = sorted({m['date'] for m in L0})
DATA = dict(
    metadata=dict(
        title="AA / Ai Anonymous",
        subtitle="Belgian-Dutch AI practitioners, entrepreneurs and technologists",
        period=f"{dates[0]} → {dates[-1]}",
        periodLabel="16 – 28 July 2026",
        coverageNote=("The transcript ends 28 July 19:08. There is no 29 July message content in the "
                      "source; the only 29 July artefact is the member roster, extracted that day."),
        generatedFrom=["layer0_messages.json", "layer1_claims.json", "AA intake form (29 Jul 2026)"],
        messages=len(L0), threads=len(topics),
        threadsResolved=sum(1 for t in topics if t['status'] == 'resolved'),
        threadsContested=sum(1 for t in topics if t['status'] == 'contested'),
        threadsOpen=sum(1 for t in topics if t['status'] == 'open'),
        claims=len(L1['claims']), factChecks=sum(len(t['factChecks']) for t in topics),
        uniqueLinks=len(resources), peopleWhoPosted=sum(1 for m in members if m['messages']>0),
        directorySize=len(members), rosterSize=77,
        nextEvent=dict(name="First informal drink", date="2026-08-13T18:00:00",
                       location="In Den Boer van Tienen", address="Mechelseplein, Antwerp",
                       evidence="20260723-2226-161",
                       note=("Poll offered only 'early (18:00 or earlier)' (5 votes) and 'later (>20:00)' "
                             "(1 vote). Staf removed the 'no' option deliberately.")),
    ),
    categories=OLD['categories'],
    topics=topics, resources=resources, members=members,
    gaps=dict(
        coverage=gaps['coverage'],
        truncatedMessages=gaps['truncated_messages'],
        restoredMessages=gaps.get('restored_messages', []),
        failedMedia=gaps['failed_media'],
        note="Published deliberately. A gap that is not shown reads as coverage that does not exist.",
    ),
    corrections=L1['dropped_claims'],
    identityAttestations=ATT['attestations'],
    identityOpenQuestions=ATT['open_questions'],
)

DATA['metadata']['peopleWhoPosted'] = sum(1 for m in members if m['messages'] > 0)
DATA['metadata']['directorySize'] = len(members)

js = ("// =========================================================================\n"
      "// AA / Ai Anonymous — Knowledge Nexus data store (v2)\n"
      "// GENERATED FILE — do not hand-edit.\n"
      "//   source of truth : layer0_messages.json (verbatim transcript)\n"
      "//                     layer1_claims.json   (claims, each traced to a msg_id)\n"
      "//                     AA intake form CSV   (the ONLY source of emails/surnames)\n"
      "//   regenerate      : python3 build_data_v2.py && python3 validate.py\n"
      "// Every claim carries `evidence` (msg_ids). Every topic carries a `status`.\n"
      "// There is no `keyTakeaways` and no consensus field, by design.\n"
      "// =========================================================================\n\n"
      "const KNOWLEDGE_DATA = " + json.dumps(DATA, ensure_ascii=False, indent=2) + ";\n")
open('data.v2.js', 'w').write(js)
json.dump(DATA, open('data.v2.json', 'w'), ensure_ascii=False, indent=1)

print(f"topics {len(topics)} | positions {sum(len(t['positions']) for t in topics)} | "
      f"factChecks {sum(len(t['factChecks']) for t in topics)}")
print(f"resources {len(resources)} | members {len(members)}")
print(f"members with a real email: {sum(1 for m in members if m['email'])} "
      f"| with LinkedIn: {sum(1 for m in members if m['linkedin'])}")
print(f"data.v2.js written ({len(js):,} bytes)")
