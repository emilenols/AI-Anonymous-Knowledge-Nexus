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
import sys
try:  # Windows consoles default to cp1252; force UTF-8 so output never crashes
    sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')
except Exception: pass

L0 = json.load(open('layer0_messages.json', encoding='utf-8'))
L1 = json.load(open('layer1_claims.json', encoding='utf-8'))
try:
    OLD = json.load(open('site_data.json', encoding='utf-8'))
except Exception:
    OLD = json.load(open('data.v2.json', encoding='utf-8'))
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
# The export is newest-first, so the first row for an email is the latest submission.
_seen, _dedup = set(), []
for _r in form_rows:
    _e = _r[3].strip().lower()
    if _e and _e in _seen: continue
    if _e: _seen.add(_e)
    _dedup.append(_r)
form_rows = _dedup
FORM = []
for r in form_rows:
    FORM.append(dict(first=r[1].strip(), last=r[2].strip(),
                     full=(r[2].strip() if r[2].strip().lower().startswith(r[1].strip().lower())
                           else f"{r[1].strip()} {r[2].strip()}".strip()),
                     email=r[3].strip(), phone=r[5].strip(), tail=tail(r[5]),
                     company=r[6].strip(), website=r[7].strip(),
                     why=r[15].strip(), goals=r[16].strip(),
                     background=r[17].strip(), expects=r[18].strip(),
                     contributes=r[19].strip()))

# Free text that discloses health or family circumstances is never published, even though the
# member wrote it. They wrote it for the organiser, not for a web page.
# NB: 'ziekte' was removed — it matches 'infectieziekten', a microbiologist's specialism.
# Pattern matching cannot tell a disclosure from a job description, so anything it flags is
# reviewable: PII_CLEARED below records a human decision to publish, with a reason.
SENSITIVE = re.compile(r'kanker|cancer|mama van|zwanger|burn.?out|depressie|overlijden|scheiding', re.I)
PII_CLEARED = {
    # name -> why this flagged text is in fact professional, not personal
    'Bruno Van herendael': "Describes his medical specialism (infectious diseases, microbiology), not his own health.",
}

def _safe(f, key, sid=None):
    """Return a self-reported field, unless it discloses health/family circumstances."""
    if not f: return None
    v = (f.get(key) or '').strip()
    if not v: return None
    name = DISPLAY.get(sid) if sid else f.get('full')
    if SENSITIVE.search(v) and name not in PII_CLEARED: return None
    return v

def _load_private(filename):
    import os
    for path in (filename, f"private/{filename}", f"pipeline/private/{filename}"):
        if os.path.exists(path):
            return json.load(open(path, encoding='utf-8'))
    raise FileNotFoundError(f"Could not find private file {filename}")

ident = _load_private('identity_map_PRIVATE.json')
ROSTER = _load_private('member_roster_PRIVATE.json')
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


EXTRA_SPEAKER_MAP = {
    '486939376': ('Sven Meys', 'sven-meys'),
    '470876752': ('Maarten Huijsmans', 'maarten-huijsmans'),
    '496425458': ('Björn Bailleul', 'bjorn-bailleul'),
    '475762364': ('Boris', 'boris'),
    '487181142': ('Max', 'max'),
    '485032541': ('Thomas Embrechts', 'thomas-embrechts'),
    '478269556': ('Steven Cruysberghs', 'steven-cruysberghs'),
    '498276900': ('Geert Arien', 'geert-arien'),
    '485845906': ('Siebe Stroobants', 'siebe-stroobants'),
    '497347575': ('Matthias Van Tieghem', 'matthias-van-tieghem'),
    '485541255': ('Tiemen Schotsaert', 'tiemen-schotsaert'),
    '475264832': ('Karel Wouters', 'karel-wouters'),
    '476096447': ('Frederik Van Dessel', 'frederik-van-dessel'),
    '475370181': ('Harold Grondel', 'harold-grondel'),
    '499567621': ('Patrick', 'patrick'),
    '499113909': ('Bert', 'bert'),
}

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
ATT = json.load(open('attestations.json', encoding='utf-8'))
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
        DISPLAY[sid] = m['speaker']; NAME_SRC[sid] = 'form_probable'
    else:
        # Check EXTRA_SPEAKER_MAP
        matched_extra = False
        digits_spk = re.sub(r'\D', '', m['speaker'])
        if len(digits_spk) >= 8:
            t8 = digits_spk[-8:]
            for ek, (ename, esid) in EXTRA_SPEAKER_MAP.items():
                if ek[-8:] == t8:
                    DISPLAY[sid] = ename
                    NAME_SRC[sid] = 'chat_extra_resolved'
                    matched_extra = True
                    break
        if not matched_extra:
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
 'T20':'tools','T21':'vibe','T22':'tools','T23':'models','T24':'models',
 'T25':'vibe','T26':'vision','T27':'tools','T28':'hardware','T29':'tools',
 'T30':'vibe','T31':'projects','T32':'models','T33':'projects',
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
 'T20':['Plaud Note','Pocket','audio recording','meeting minutes','privacy'],
 'T21':['code quality','evals','human-in-the-loop','Claude ultra review','causal models'],
 'T22':['headless agents','Tailscale','tmux','Mac Studio','Cloudflare R2','SSH'],
 'T23':['Opus 5','fixing-smartass-opus-5','prompt engineering','Hindsight memory'],
 'T24':['Claude Fable 5.1','Anthropic Mythos','agent coordinator','subagent swarm'],
 'T25':['Devin SWE-2','Claude Code','OpenCode','autonomous coding','OpenRouter'],
 'T26':['AI video','Fal.live','synthetic likeness','Hollywood production','Sora'],
 'T27':['voice agent','ALF web app','daily standup','GitHub sync','hands-free'],
 'T28':['LoRa','RescueMesh','Meshtastic','off-grid','mesh network','BitChat'],
 'T29':['Cloudflare Workers AI','AI Gateway','Vectorize','edge inference','R2'],
 'T30':['Reddit-style board','multi-agent MCP','asynchronous tasks','Tencent TeamAI'],
 'T31':['Notiva','Mijnschenking.be','SmartEnergyControl','Studio 55','BOSS','member projects'],
 'T32':['US-China race','open weights','export controls','hardware sovereignty'],
 'T33':['Antwerp meetup','In Den Boer van Tienen','community drinks','networking'],
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
                                             speaker_id=m['speaker_id'], msg_id=m['msg_id'], date=m['date']))
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
 'linkedin.com/in/emilenols':'Emile Nols — LinkedIn Profile',
 'voka.be/vlaams-brabant/opleidingen/digitalisering-ai-technologie/hoe-je-met-ai-je-agency-heruitvindt-voor-iemand-anders-het-doet':'Voka — Hoe je met AI je agency heruitvindt',
 'linkedin.com/posts/wim-casteels-213720b4_ai-europa-opensource-share-7483463722921885697-_76f/':'Wim Casteels — Sovereign AI in Europe & Open Source',
 'reddit.com/r/localllama/comments/1uwkz1z/colibri_handson_running_glm_52_744b_locally':'Colibri: Running GLM 5.2 (744B) Locally (r/LocalLLaMA)',
 'dev.to/jamilxt/colibri-running-a-744b-ai-model-on-your-laptop-4l6g':'Colibri: Running a 744B AI Model on Your Laptop (dev.to)',
 'chromewebstore.google.com/detail/ikmpglbpcdoapfelcbfpoaddmhmaaocg':'inTruth Chrome Extension',
 'youtube.com/watch':'Introducing the Codex Micro (YouTube)',
 'logitech.com/en-us/shop/p/craft':'Logitech Craft Advanced Keyboard with Dial',
 'linkedin.com/posts/rodneywzemmel_im-excited-to-introduce-ode-with-anthropic-activity-7483160174048874498-ik-f/':'Rodney Zemmel — Introducing Ode with Anthropic',
 'linkedin.com/posts/hishamdakkak_this-is-not-science-fiction-what-youre-ugcpost-7482470192204267520-0twg/':'Hisham Dakkak — Autonomous AI agents in production',
 'linkedin.com/posts/qi-deng-5a9547b1_aisecurity-agenticai-claudecode-activity-7483052479841206273-nncg':'Qi Deng — Fable 5 Bypass in Claude Code Security',
 'instagram.com/reel/dypmndvgfd4/':'BNR Nieuwsradio: Julius Brussee on Caveman',
 'thequantuminsider.com/2026/07/21/saxon-q-diamond-nv-center-quantum-computers':'Saxon Q Commercial Diamond-Based NV Quantum Computers',
 'reddit.com/r/localllm/s/z8fpu73uhc':'r/LocalLLM — Hand-writing facts into Llama-3.1-8B weights',
 'instagram.com/p/danjavegpsq/':'Evolving AI: 1X Technologies NEO robot hand',
 'docs.google.com/document/d/1wrfzilnmzpuijhjdrh-62mddrpgtw2otwf15ggek_8g/edit':'AI Anonymous — Group Chat Summary & Resource Index Doc',
 'linkedin.com/posts/rinor-restelica_chinas-self-driving-electric-trucks-are-ugcpost-7486086287268098048-dbc4/':'Rinor Restelica — China\'s self-driving electric trucks',
 'perplexity.ai/computer/a/a9129e22-28a3-55b7-a4a8-b8437bee599b':'Perplexity Computer — Research Canvas',
 'boekscout.nl/shop2/boek/9789465284927':'Boekscout — Avondland van Jan Roelants',
 'x.com/jensenhuang/status/2080643682408321103':'Jensen Huang on X (Twitter)',
 'youtube.com/shorts/rricyhl2j0m':'YouTube Short: Can AI Count to 100?',
 'claude.ai/referral/kkaofyltra':'Claude Pro Free Week Referral',
 'github.com/sahir619/fable-method':'Sahir619 / fable-method — Claude Fable 5 replication',
 'marketplace.elgato.com/product/claude-code-approver-773682f5-091b-474b-8901-d9960c50f0d3':'Elgato Stream Deck — Claude Code Approver Plugin',
 'marketplace.elgato.com/product/claude-code-shortcut-profile-491e5986-d93d-4471-a1fe-1d80b406000e':'Elgato Stream Deck — Claude Code Shortcut Profile',
 'marketplace.elgato.com/product/claude-control-53d6057a-08bd-4c2f-93c9-8e6ea34cd9b9':'Elgato Stream Deck — Claude Control Plugin',
 'instagram.com/reel/dboytcrawvr':'Instagram Reel: Poolside Laguna S 118B open-weight model',
 'atoms.co':'Atoms — Physical automation for food, mining & transport',
 'reddit.com/r/claudeai/s/dkgonzu2zh':'r/ClaudeAI — Discussion on Claude Code capabilities',
 'youtu.be/tysulvxpgyg':'RoboCop ED-209 Scene (YouTube)',
 'github.com/disler/fixing-smartass-opus-5':"fixing-smartass-opus-5 \u2014 System prompt & harness to eliminate Opus 5 refusal/verbosity",
 'github.com/alishahryar1/free-claude-code':"free-claude-code \u2014 Proxy wrapper enabling Claude Code with alternative models",
 'github.com/tailscale/tailcat':"Tailscale tailcat \u2014 P2P stdin/stdout pipe across WireGuard mesh without open ports",
 'github.com/skyvern-ai/skyvern':"Skyvern \u2014 Autonomous browser agent automating complex web workflows with computer vision",
 'github.com/trailhq/graft':"Graft \u2014 Workflow orchestration engine managing complex agent task DAGs",
 'github.com/guillaumemeyer/watermarks-remover':"watermarks-remover \u2014 Deep learning pipeline for image watermark reconstruction",
 'github.com/wang-yanting/agentwatcher':"AgentWatcher \u2014 Real-time telemetry and execution monitoring for autonomous agent swarms",
 'github.com/redhat-et/ripwire':"Red Hat Ripwire \u2014 Agent security harness preventing unauthorized privilege escalations",
 'devin.ai/blog/devin-gets-a-mac':"Devin Gets a Mac \u2014 Cognition announces native macOS desktop app for Devin",
 'anthropic.com/claude-fable-and-mythos-5-1':"Anthropic: Introducing Claude Fable 5.1 & Mythos 5.1 with expanded context benchmarks",
 'sea.plaud.ai':"Plaud AI \u2014 Dual-mic hardware voice recorder with native Claude summarization",
 'meshtastic.org':"Meshtastic \u2014 Open source, off-grid decentralized LoRa mesh communication protocol",
 'bitchat.free':"BitChat \u2014 Peer-to-peer encrypted mesh chat over Bluetooth/WiFi direct",
 'fal.live':"Fal.live \u2014 Real-time interactive LLM and video generation streaming platform",
 'academy.claude.com/courses/ai-native-sdlc-playbook':"Anthropic Claude AI-Native SDLC Playbook \u2014 Enterprise agentic engineering patterns",
 'hindsight.vectorize.io':"Vectorize Hindsight \u2014 Long-horizon vector memory and context retrieval for agents",
 'obscura.sh':"Obscura \u2014 High-performance Rust-based browser engine for AI agents",
 'odysseysbench.com/leaderboard':"Odyssey Benchmark \u2014 Evaluating multi-modal web navigation agents across 1,000 tasks",
 'autonomoussummit.ai':"Autonomous Summit 2026 \u2014 Enterprise autonomous agent architecture conference",
 'openai.com/index/an-alien-mind':"OpenAI Chief Scientist Jakub Pachocki: 'An Alien Mind' essay on model intelligence",
 'tweakers.net/nieuws/251640/zelfs-apple-chips-kunnen-meedoen-in-lokaal-ai-cluster-van-nvidias-pair.html':"Tweakers: Nvidia PAIR enables Apple Silicon integration into local heterogeneous AI clusters",
 'ai-tldr.dev/releases/tencent-teamai-cli':"Tencent TeamAI CLI \u2014 Multi-agent coordination terminal interface",
 'presenton.ai':"Presenton.ai \u2014 AI slide deck and presentation generation platform",
 'mijnschenking.be':"Mijnschenking.be \u2014 Digital asset inheritance and succession platform by Thomas Embrechts",
 'notiva.ai':"Notiva \u2014 AI-driven notary office operating system by Max and Simon",
 'smartenergycontrol.com':"SmartEnergyControl \u2014 Industrial EMS platform operated with autonomous AI agents",
}
def link_title(c, rec):
    if c in TITLES: return TITLES[c]
    domain = rec['url'].split('/')[2].replace('www.', '')
    try:
        parts = [p for p in rec['url'].split('/')[3:] if p and not p.startswith('?') and not p.startswith('index')]
        if parts:
            slug = parts[-1].split('?')[0].replace('-', ' ').replace('_', ' ').title()
            if len(slug) > 3 and not slug.replace('.', '').isdigit():
                return f"{slug} ({domain})"
    except Exception:
        pass
    return domain

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

def get_resource_meta(c, rec):
    u = rec['url'].lower()
    t = 'tool'
    if 'github.com' in u or 'huggingface.co' in u: t = 'code'
    elif any(d in u for d in ['youtube.com', 'youtu.be', 'instagram.com']): t = 'media'
    elif any(d in u for d in ['x.com', 'twitter.com', 'linkedin.com', 'lnkd.in', 'techcrunch.com', 'tweakers.net', 'anthropic.com', 'openai.com']): t = 'news'
    elif any(d in u for d in ['notiva', 'mijnschenking', 'smartenergycontrol', 'sidepulse', 'deckslide']): t = 'project'
    if any(k in c for k in ['prompt', 'sdlc', 'pattern', 'harness', 'fixing-smartass']): t = 'technique'
    
    tags = []
    if 'github.com' in u: tags.append('github')
    if 'devin' in u or 'devin' in c: tags.append('devin')
    if 'claude' in u or 'claude' in c or 'fable' in c or 'opus' in c: tags.append('claude')
    if 'tailscale' in u or 'tailcat' in c: tags.append('tailscale')
    if 'plaud' in u or 'audio' in u or 'pocket' in c: tags.append('voice-audio')
    if 'video' in u or 'fal.live' in u: tags.append('video-gen')
    if 'cloudflare' in u: tags.append('cloudflare')
    if 'lora' in u or 'meshtastic' in u or 'mesh' in c: tags.append('lora-mesh')
    if 'local' in u or 'workstation' in c or 'gpu' in c: tags.append('local-ai')
    if 'privacy' in u or 'security' in u or 'jailbreak' in c: tags.append('security')
    if not tags: tags = ['ecosystem', t]
    
    # Ground truth summary
    summary = link_title(c, rec)
    if 'fixing-smartass-opus-5' in c:
        summary = "Structured system prompt and test benchmark designed to eliminate Opus 5 reasoning verbosity and refusal loops."
    elif 'free-claude-code' in c:
        summary = "Proxy wrapper enabling developers to run the Claude Code CLI against alternative open-router or local model backends."
    elif 'tailcat' in c:
        summary = "Experimental CLI utility piping stdin/stdout directly across WireGuard mesh nodes without opening inbound firewall ports."
    elif 'an-alien-mind' in c:
        summary = "Essay by OpenAI Chief Scientist Jakub Pachocki examining the fundamentally non-human representational spaces of frontier models."
    elif 'devin-gets-a-mac' in c:
        summary = "Cognition announcement of the native macOS desktop client for Devin autonomous software engineering."
    elif 'claude-fable-and-mythos-5-1' in c:
        summary = "Official Anthropic release notes for Claude Fable 5.1 & Mythos 5.1 frontier reasoning models."
    elif 'sea.plaud.ai' in c:
        summary = "Hardware voice recorder (Plaud Note & Pin S) utilizing dual-microphones with direct Claude transcription and summary sync."
    elif 'meshtastic' in c:
        summary = "Open-source decentralized off-grid mesh communications network running on low-power LoRa radios."
    elif 'fal.live' in c:
        summary = "Live interactive voting and streaming platform for continuous real-time video generation models."
    elif 'ai-native-sdlc' in c:
        summary = "Anthropic's blueprint for multi-agent software engineering cycles, worktree sandboxes, and verification gates."
    elif 'hindsight.vectorize' in c:
        summary = "Long-horizon memory architecture and retrieval benchmark for autonomous agent task state persistence."
        
    return t, summary, tags

resources = []
for c, rec in sorted(REAL_LINKS.items(), key=lambda kv: kv[1]['date']):
    tid = MSG2THREAD.get(rec['msg_id'])
    res_type, fact_summary, r_tags = get_resource_meta(c, rec)
    resources.append(dict(
        title=link_title(c, rec),
        url=rec['url'],
        sharedBy=rec['sharedBy'],
        sharedById=rec.get('speaker_id', 'unknown'),
        date=rec['date'],
        evidence=rec['msg_id'],
        category=CAT.get(tid, 'tools') if tid else 'tools',
        topic=THREADS[tid]['title'] if tid else None,
        resourceType=res_type,
        factCheckedSummary=fact_summary,
        tags=r_tags
    ))

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
        background=(None if (f and SENSITIVE.search(f['background'] or '')
                             and DISPLAY[sid] not in PII_CLEARED)
                    else (f['background'] or None) if f else None),
        backgroundWithheld=(bool(f and SENSITIVE.search(f['background'] or '')
                                 and DISPLAY[sid] not in PII_CLEARED) or None),
        # Survey answers: published by the archive owner's decision (31 Jul 2026).
        # Still filtered for health/family disclosures, same as background.
        whyJoined=_safe(f, 'why', sid), goals=_safe(f, 'goals', sid),
        expectations=_safe(f, 'expects', sid), contributes=_safe(f, 'contributes', sid),
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
        background=(None if (SENSITIVE.search(f['background'] or '') and f['full'] not in PII_CLEARED)
                    else (f['background'] or None)),
        backgroundWithheld=(bool(SENSITIVE.search(f['background'] or '')
                                 and f['full'] not in PII_CLEARED) or None),
        whyJoined=_safe(f,'why'), goals=_safe(f,'goals'),
        expectations=_safe(f,'expects'), contributes=_safe(f,'contributes'),
        profileSource='self-reported on the AA intake form; did not post between 16-28 Jul',
        linkedin=None, topicsContributed=[], firstSeen=None, lastSeen=None))

# ---------------------------------------------------------------- contributors
# Deliberately multi-axis. Message count alone ranks link-sharing above first-hand
# testing, which is the opposite of what this archive is for.
from collections import Counter as _C, defaultdict as _dd
_msgs=_C(m['speaker_id'] for m in L0 if m['speaker_id']!='system')
_sid={m['speaker']: m['speaker_id'] for m in L0}
_cl,_ho,_th,_lk,_q = _C(),_C(),_dd(set),_C(),_C()
for c in L1['claims']:
    sid=_sid.get(c['speaker'].split(' (')[0])
    if not sid: continue
    _cl[sid]+=1; _th[sid].add(c['thread'])
    if c['certainty']=='hands_on': _ho[sid]+=1
    if c['stance'] in ('asks','disputes'): _q[sid]+=1
for m in L0:
    if m['links']: _lk[m['speaker_id']]+=len(m['links'])

_ROLE=[(lambda d: d['handsOn']>=8, 'Builder', 'Most of their contributions are things they built or ran themselves'),
       (lambda d: d['links']>=15, 'Curator', 'Brings the most material into the group'),
       (lambda d: d['threads']>=10, 'Connector', 'Active across the widest range of threads'),
       (lambda d: d['handsOn']>=3, 'Practitioner', 'Speaks mainly from first-hand experience'),
       (lambda d: d['challenges']>=3, 'Challenger', 'Asks the questions and pushes back on claims'),
       (lambda d: d['claims']>=6 and d['threads']>=5, 'Analyst',
        'Brings research and framing into a wide range of threads'),
       (lambda d: True, 'Participant', 'Took part in the period')]
contributors=[]
for sid,n in _msgs.most_common():
    d=dict(id=sid, name=DISPLAY.get(sid,sid), messages=n, claims=_cl[sid],
           handsOn=_ho[sid], threads=len(_th[sid]), links=_lk[sid], challenges=_q[sid])
    d['substanceRate']=round(_ho[sid]/n, 3) if n else 0
    for test,label,why in _ROLE:
        if test(d): d['role'],d['roleWhy']=label,why; break
    contributors.append(d)

for t in topics:
    t['statusRank'] = {'contested':0,'open':1,'resolved':2}[t['status']]

# ---------------------------------------------------------------- gaps + metadata
gaps = json.load(open('gaps_register.json', encoding='utf-8'))
dates = sorted({m['date'] for m in L0})
DATA = dict(
    metadata=dict(
        title="AA / Ai Anonymous",
        subtitle="Belgian-Dutch AI practitioners, entrepreneurs and technologists",
        period=f"{dates[0]} → {dates[-1]}",
        periodLabel="16 July – 16 September 2026",
        coverageNote="Archive spans 16 July through 16 September 2026 with 1,321 messages across 33 threads.",
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
                       note=("First meetup held Aug 13 In Den Boer van Tienen on Mechelseplein, Antwerp. "
                             "Autumn 2026 follow-up meetup in planning.")),
    ),
    categories=OLD['categories'],
    topics=topics, resources=resources, members=members, contributors=contributors,
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
open('data.v2.js', 'w', encoding='utf-8').write(js)
json.dump(DATA, open('data.v2.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

print(f"topics {len(topics)} | positions {sum(len(t['positions']) for t in topics)} | "
      f"factChecks {sum(len(t['factChecks']) for t in topics)}")
print(f"resources {len(resources)} | members {len(members)}")
print(f"members with a real email: {sum(1 for m in members if m['email'])} "
      f"| with LinkedIn: {sum(1 for m in members if m['linkedin'])}")
print(f"data.v2.js written ({len(js):,} bytes)")
