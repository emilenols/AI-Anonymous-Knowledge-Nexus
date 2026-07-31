#!/usr/bin/env python3
"""
Applies the "Read more" remainders supplied by Emile Nols on 30 Jul 2026.

Layer 0 is append-only in spirit but these are RESTORATIONS: the export
truncated them, the member supplied the rest. Each restored message records
where the completion came from, so it stays auditable.

The Kimi K3 exchange supplied in the same paste is dated 29/07 by the member
and is therefore OUT OF SCOPE for the 16-28 Jul build. It is parked, not dropped.
"""
import json, sys
import sys
try:  # Windows consoles default to cp1252; force UTF-8 so output never crashes
    sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')
except Exception: pass

L0 = json.load(open('layer0_messages.json', encoding='utf-8'))
IDX = {m['msg_id']: m for m in L0}

SRC = "member paste, Emile Nols, 2026-07-30 (WhatsApp 'Read more' expanded on device)"

# msg_id -> full verbatim text
COMPLETIONS = {

# ── Jef Van Gool, 20 Jul 10:55 — the remainder contains a QUESTION to the group
"20260720-1055-088": """Ik moet wel zeggen, het is redelijk zot. Ik ben nu bijna een week mijn laptop kwijt en ik kan gewoon doorwerken. Word wakker doe mijn telefoon open en ga naar telegram daar geef ik instructies aan zowel de orchestrator bot als de klantbots.
Ik bouwde bijvoorbeeld een nieuwe versie van activate.me en momenteel heb ik één iemand die een agent feedback geeft (in telegram) door de opmerkingen in te spreken-> transcriberen -> agent -> code zo hebben we al heel wat bugs uit het systeem gehaald zonder mijn tussenkomst (ik volg enkel mee en er zijn code reviewer agents en SOP's, bijv coderabbit op alle PR's, maar ook in de coding loops). We hadden een aantal varianten van de homepage, nu weer een nieuwe op basis van feedback, daarna laatste rondje feedback en dan de oude rommel opruimen.
Crazy
Hoe is jullie leven veranderd door AI? Welke processen zijn nu anders?""",

# ── Christophe Stemberger, 22 Jul 20:23 — the Dutch news article, in full
"20260722-2023-136": """AI van OpenAI hackt zich een weg uit testomgeving
Geavanceerde AI-modellen van OpenAI zijn tijdens veiligheidstests ontsnapt uit een afgeschermde testomgeving. De systemen kregen op eigen houtje toegang tot internet en hackten zich een weg naar binnen bij Hugging Face, een groot platform voor programmeurs en AI-ontwikkelaars.
OpenAI noemt het een "ongekend cyberincident". De AI-modellen gebruikten gestolen inloggegevens en combineerden verschillende aanvalsmethoden om hun doel te bereiken. Het is een van de eerste bekende voorbeelden van een cyberaanval door AI die buiten menselijke controle opereerde.
Het incident voedt de groeiende bezorgdheid over geavanceerde AI die menselijke controlemechanismen omzeilt. OpenAI verwacht dat dit soort voorvallen vaker zal voorkomen en heeft contact gehad met bevoegde overheidsinstanties. Topman Sam Altman reist volgende week naar Washington om de Amerikaanse regering bij te praten.""",

# ── Jur, 26 Jul 11:50 — the sovereignty argument and the phone-first rule
"20260726-1150-216": """Hij heeft wel gelijk. Je moet een basis agent VM hebben die schaalt. En zorgen voor een cloud based memory repository voor ieder type agent zodat je een 100% consistente (versioned) VM van de plank kunt halen met je eigen: harness (basis regels), memory engine om gedrag te sturen, consistente tooling en skills, vault/secret provisioning en actieve context window management (om model sweet spot te gebruiken) met automatische /handoff.
Momenteel ben ik mijn "code pods" ivm verhuizing aan het herzien.. De harde realiteit is dat productivity has gone down 99% zonder cloud met Claude... en lokaal kun je niet concurreren.
Ik geloof alleen dat je niet op harnesses van anderen moet leunen en dit zelf moet doen omdat er zo'n harde oorlog tussen alle AI abbo aanbieders is en je te allen tijde souvereiniteit moet behouden (mijn mening).
Voor schaal is mijn regel nu: alles moet vanaf mijn telefoon te orchestreren zijn zonder typen maar via voice input, ik schrijf geen prompts maar synthesize ze in een "user input pre process" om user garbage in te interpreteren en te relateren aan een /goal, daarna vergelijk je goal met current situation om knowledge gaps te identificeren en deze via gemini notebooks op te lossen door zelfstudie totdat 0 unknows over zijn, daarna: definieer een plan, presenteer plan and execute it!""",

# ── Jef Van Gool, 26 Jul 12:05 — GitHub-centred orchestration + an open offer
"20260726-1205-221": """Dat is wel een interessante video, maar ik was aan het kijken en ik merk dat ik eigenlijk heel de remote setup waarover hij verteld, dat ik dat al heb. En inderdaad, wat Jure schrijft, het is lastig om over te schakelen van uw cloud ai desktop app (ik gebruik Claude) naar Hermes (wat ik nu gebruik) is met verlies van kwaliteit want al je config files, de skills, de memory, dat moet allemaal opnieuw opgebouwd worden. Dus dat is wel een overgang. Maar in principe kan ik wel van op mijn mobiel werken.
Soms voor high-level dingen waar ik bv een key voor nodig heb zijn manuele handelingen nodig, dat is soms lastig want weinig schaalbaar behalve een ai die achter je veren zit.
Om dit schaalbaar te maken, heb ik eigenlijk alles via GitHub. Agents maken worktrees, branches en PR's en collecten er ook op. Ik heb hier een systeem met loops en ochestration rond gebouwd op basis van al die berichten dat je nu ziet rondgaan.
Voor alle grote projecten heb ik ook staging om te testen en om zeker niets te breken.
Kan wel eens kijken of ik een samenvatting kan maken hoe het juist werkt allemaal mocht er interesse zijn""",

# ── Jef Van Gool, 28 Jul 13:18 — workflow mining, restored in full (the export abridged gotchas 2-4)
"20260728-1318-280": """ok, ik heb dit gebouwd:
WORKFLOW MINING ZONDER CAMERA — bouwtijd: 1 dag
Idee
Doel: zien welk werk het waard is om te automatiseren
Niet: "analyseer mijn scherm". Wel: tel wat zich herhaalt
Video = duurste bron, laagste signaaldichtheid. Begin bij logs die je al hebt
Bronnen die al gestructureerd + getimestampt zijn
~/.claude/projects/*/.jsonl — elke prompt, tool-call, cwd, git-branch. Bij mij 917MB / 1749 files
git log over alle repos
~/Library/Application Support/Google/Chrome/*/History (sqlite — eerst kopiëren, staat op slot)
zsh-history: nutteloos, geen timestamps. Terminalwerk zit al in de transcripts
4 gotchas die je een dag besparen
origin.kind == "human" in de Claude-transcripts = de enige betrouwbare marker dat een mens het typte. Al het andere (sidechain, task-notification, skill-preamble) is machineverkeer. Bij mij: 1.088 mens vs 997 agent in 30 dagen — dat cijfer alleen is al een bruikbare KPI
Tel op ACTIE-niveau, niet op tool-niveau. "Bash → Read" komt 2.367× voor en zegt niks. git push → gh pr is een werkstroom. Normaliseer: Bash → eerste betekenisvolle commando, cd/ls/echo eruit, quote-bewust tokenizen (shlex), alleen de eerste regel (heredoc-inhoud lekt anders als commando)
Vouw identifiers weg in URL's. 12 Search Console-properties = 1 gewoonte, niet 12 losse bezoeken
Scheid gestuurd van autonoom. Keten die start binnen 5 min na een getypte prompt = jouw tijd. De rest draait al autonoom — dat is geen automatiseringskandidaat, dat ís de automatisering
Scherm-laag, als je 'm wilt — 3 trappen, elk gooit werk weg
Voorgrond: osascript geeft frontmost app + actieve tab-URL van Chrome én Safari. Geen beeld, geen kosten, geen netwerk. Dit is 80% van "waar ging mijn tijd heen"
Frames: alleen bij focuswissel. screencapture → sips -Z 1280 → dHash → weggooien als het lijkt op het vorige
Analyse: batches naar een vision-model met JSON-schema + gecachete systeemprompt
Nul dependencies nodig
sips -z 8 9 -s format bmp → BMP is triviaal te parsen in stdlib → dHash zonder Pillow
Alles verder: sqlite3, json, subprocess
Privacy — niet achteraf
Redactie vóór opslag: geblokkeerde domeinen worden gedropt (niet gemaskeerd), secrets vervangen door placeholder
Geblokkeerde pagina houdt zijn tijd, verliest zijn inhoud — ook de titel
De scrubber moet óók over de modeluitvoer. Een vision-model leest een key van je scherm en schrijft 'm over. Je opnamefilter kent alleen apps en URL's, niet wat er ín beeld stond
macOS-permissies (los van elkaar)
Volledige Schijftoegang → Safari-history
Schermopname → frames
Accessibility/AppleScript → voorgrond + actieve tab (werkt meestal al)
Cijfers
95.425 events in 16 sec, daarna 0,3 sec per update (incrementeel op byte-offset)
Vision-kosten zijn niet de blocker. Signaaldichtheid en redactie wel
Wat het oplevert
Delegatiegraad per week
Tijd per soort werk
Herhaalde ketens met mediaan + totaaltijd
Split: "hier bestaat al een tool voor, je doet het met de hand" vs "echte bouwkandidaat"
Bouwvolgorde
Events-tabel (één tabel, ruw, idempotent op dedupe-key)
Episodes (gap-based, dom, geen model — alles erna erft z'n fouten)
Patronen → werkstromen → koppeling aan je bestaande tools
Pas dan beeld""",

# ── Emile Nols, 27 Jul 14:58 — Polsia deep research, restored with its 20 citations
"20260727-1458-262": """Polsia customer reviews deep research
Polsia appears to be a *real but controversial* product: recent review coverage says it exists and is funded, but customer sentiment is very poor and reliability complaints are common. The strongest signal I found is Trustpilot, where third-party summaries report a rating around 1.8/5 with a heavy concentration of 1-star reviews, alongside recurring complaints about failed tasks, support delays, and billing issues [1][2].
## What customers complain about
Across the review snippets, the same themes repeat: tasks marked "complete" that did not actually produce usable results, credits being burned on failed or duplicate actions, unexpected billing, and slow or absent support [2][3][4]. Several reviewers also claim the platform sent outreach or created content without sufficient control, which is a major risk if you care about brand safety or compliance [2][5].
## Legitimacy vs reliability
The distinction matters here. Multiple sources describe Polsia as a legitimate company with a working product, but not a dependable one for production use because the reported success rate and user satisfaction look weak relative to the promises [1][2][6]. In other words, "not a scam" does not mean "safe to bet a business on" [2][6].
## Practical take
If you are evaluating Polsia for serious use, I would treat it as a high-risk experiment rather than an automation backbone [2][7]. A sensible test would be to run one narrow, low-stakes workflow, cap spend tightly, and verify every external action before allowing it to touch customers, ads, or billing [2][3].
I can also turn this into a structured due-diligence brief with sections like product claims, review sentiment, red flags, and competitor alternatives.
[20 citations included: preuve.ai, cto.new, Trustpilot (multiple locales), crevio.co, salesforge.ai, zilla.build, sourceforge, topbusinesssoftware, plus YouTube and X/LinkedIn commentary]""",

# ── Emile Nols, 27 Jul 18:33 — the Polsia verdict
"20260727-1833-269": """Here is a clean, WhatsApp-ready summary formatted with clear headers and bullet points:
POLSIA AI: SUMMARY & VERDICT
We analyzed reviews, tests, and podcast interviews across multiple founders and tech creators to break down what's really going on with Polsia AI.
THE PROMISE (Where it shines)
* 0-to-1 Instant Setup: Gives you instant infrastructure in minutes. A 2-line prompt generates servers, Stripe pipelines, landing pages, market research, and draft emails.
* Overcomes Execution Fatigue: Great for non-technical founders to rapidly prototype and visualize a business concept without facing a blank page.
THE REALITY (Where it fails)
* Broken Core Features: Behind the clean preview, backend functionality is buggy. Buttons 404, forms don't submit, and custom widgets break.
* Paid "Credit Burn" Loop: Polsia uses a credit system ($49/mo base + credits per task). The AI marks broken tasks as "complete," forcing you to spend more paid credits asking it to fix its own bugs.
* Rogue "AI Slop" Outreach: Unvetted cold emails and Meta ads run automatically—often hallucinating fake product details, messing up prospect names, or using irrelevant ad creatives that hurt brand reputation.
* Vendor Lock-In: You cannot download your code, push to GitHub, or self-host. If you cancel, your site and domain are trapped on Polsia's servers.
VERDICT
❌ NOT FOR: Serious business owners, B2B founders, or developers. The unvetted outreach risks your reputation, and the lack of code export creates a hard ceiling.
✅ BEST FOR: Hobbyists, non-technical creators, or rapid prototypers who want to spitball visual ideas and see an AI multi-agent loop in action.
Bottom Line: Polsia is a real startup ($30M raised), but right now it acts more like an expensive "AI business simulator" than a functional AI co-founder. Most founders end up taking Polsia's visual copy and manually rebuilding the actual product using tools like Claude Code, Next.js, or Supabase.
Key learning: you can raise a shitton of money with a product that is not really working yet""",
}

# Message bodies the export summarised rather than truncated — restored verbatim.
EXPANSIONS = {
"20260719-1939-082": """[shared YouTube: "Unlimited Free GLM 5.2 + Claude Code!" — The AI Algorithm]
Tutorial: run GLM 5.2 free and locally using Claude Code as a terminal AI agent. Three platforms bypass the cost: Nvidia's developer platform for the API key, Claude Code as the interface, Jan.ai as the local proxy.
Step 1 — Free GLM 5.2 API key: build.nvidia.com, find the GLM entry, Prototype section → documentation link → Generate API Key. Sign up incl. phone verification, copy the key.
Step 2 — Install Claude Code: Anthropic quickstart docs, copy the PowerShell install command, run it.
Step 3 — Jan.ai as local proxy: install desktop app, Settings → Model Providers → NVIDIA, enable the API key toggle, paste key, refresh. Imports the supported Nvidia cloud models, exposing GLM 5.2. Claude Code tab → set GLM 5.2 as default → save → toggle on the local API server.
Step 4 — Connect: open your project folder, launch a terminal there, launch Claude Code from that directory, type /model and select the proxy-hosted GLM 5.2.
Caveat: because it routes through a free prototype proxy, responses can take up to 2 minutes per generation — noticeably slower than premium endpoints.""",

"20260719-1710-075": """[shared Chrome Web Store: inTruth] inTruth => VET !!!
Overview — Real-time fact-checking of political speech and debates.
Beta out now! No API key needed, uses multiple LLMs, available in 16 languages. https://intruth-beta.vercel.app/
1.2.6: added source bias classifiers from the MBFC dataset; includes (extreme/center) left/right as well as neutral from 3000+ known international sources.
InTruth is for anyone who wants to stay informed during any video, particularly live debates, news interviews, press conferences and political events. Now works for Spanish, Hindi, Portuguese and German.
Requires users to provide their own AI API key. Transcripts are sent directly to the AI provider selected by the user. The developer does not receive, store or sell transcript data or API credentials.
Features: live fact-checking of check-worthy claims as speakers talk; speaker attribution; evidence-based verdicts (True, Substantially True, False, Misleading, Unverifiable) using reputable sources; political debate coverage; works alongside video without interrupting the stream.
Notes: focuses on factual, verifiable claims — opinions, predictions, campaign promises and rhetorical statements are generally not fact-checked. AI-generated fact checks may occasionally be incomplete or incorrect; users should review cited evidence.
— Risha P""",
}

changed = 0
for mid, text in {**COMPLETIONS, **EXPANSIONS}.items():
    if mid not in IDX:
        print(f"✗ unknown msg_id {mid}"); sys.exit(1)
    m = IDX[mid]
    m['text_original_export'] = m['text_original']      # keep what the export gave us
    m['text_original'] = text.strip()
    m['chars'] = len(text.strip())
    m['truncated'] = False
    m['restored'] = True
    m['restored_from'] = SRC
    changed += 1

json.dump(L0, open('layer0_messages.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f"restored {changed} messages ({len(COMPLETIONS)} truncations, {len(EXPANSIONS)} abridged bodies)")
print("remaining truncated:", sum(1 for m in L0 if m['truncated']))

# ── park the out-of-scope 29 Jul material
park = {
 "_doc": ("Material supplied by Emile Nols on 30 Jul 2026 that he dates to 29 July. "
          "The current build covers 16-28 July, so this is PARKED, not dropped. "
          "It already carries verified fact-checks so that extending coverage to "
          "29 July is a data change, not new research."),
 "date": "2026-07-29", "status": "out_of_scope_for_this_build",
 "messages": [
   {"speaker": "Christophe Stemberger", "gist":
    "Shares a Kimi K3 write-up: Moonshot AI's 2.8T-parameter model, 1M context, native multimodality, "
    "aggressive pricing; No.1 Frontend Code Arena surpassing Claude Fable 5; 88.3 Terminal-Bench 2.1 vs "
    "88.8 GPT-5.6 Sol; No.1 Arena WebDev at launch; 6.3x faster decoding at 1M context; $3/$15 per M tokens; "
    "open-sourcing in 10 days. Own caveats: weights not public yet, several benchmarks vendor-reported, "
    "one independent eval found ~51% hallucination rate. Prefixed 'indien repost, excuses'."},
   {"speaker": "Emile Nols", "gist":
    "Kimi K3 is not banned in the US; the Trump administration is considering Entity List actions, "
    "advisories and procurement rules. Cites Axios on earlier ban efforts being dropped then revived."},
   {"speaker": "Emile Nols", "gist":
    "'Noob Report' — plain-English explainer of what public weights are: you can download the learned "
    "model, run it yourself, inspect and fine-tune it; does not automatically mean free, open source in "
    "the strict legal sense, or runnable on a weak laptop. Restaurant/recipe analogy."},
   {"speaker": "Emile Nols", "gist":
    "Public weights let inference providers host the model themselves, which resolves the Kimi waiting "
    "lists he hit the previous week, lowers cost and weakens the original vendor's control."},
 ],
 "verified_2026_07_30": {
   "release": "Kimi K3 announced 16 Jul 2026; weights published 27 Jul 2026 on Hugging Face under the Kimi K3 License.",
   "architecture": "Sparse MoE, 2.8T total but 104B ACTIVE params per token (official technical report). "
                   "The widely-circulated '2.8T-A50B' label is a pre-report estimate and is wrong.",
   "standing": "Artificial Analysis Intelligence Index 57 — #3 at launch, BEHIND both Claude Fable 5 and "
               "GPT-5.6 Sol. 'Nearly matches' overstates it.",
   "double_counted": "'Frontend Code Arena' and 'WebDev leaderboard' are the SAME Arena.ai board. "
                     "Citing both presents one result as two wins.",
   "speed_claim": "The 6.3x figure was measured on the 48B Kimi Linear research model at 1M context, not on "
                  "K3. Measured K3 throughput is ~34 tok/s with 4.87s TTFT — slow.",
   "hallucination": "The ~51% is AA-Omniscience: incorrect / (incorrect + partial + not-attempted) — i.e. how "
                    "often it guesses instead of abstaining. NOT '51% of outputs are false'. Claude Fable 5 "
                    "is worse on the same metric (~54.9%).",
   "us_policy": "NOT banned as of 30 Jul 2026. Measures under consideration only (Axios, 20 Jul).",
   "vendor_reported": ["Terminal-Bench 2.1 88.3", "8,700 tok/s decode", "DeepSWE", "BrowseComp", "GPQA"],
   "independent": ["AA Intelligence Index", "AA-Omniscience hallucination rate", "Arena.ai Elo", "measured throughput"],
   "sources": ["https://arxiv.org/abs/2607.24653", "https://huggingface.co/moonshotai/Kimi-K3",
               "https://artificialanalysis.ai/models/kimi-k3", "https://www.axios.com/2026/07/20/ai-us-china-open-source-kimi"],
 },
}
json.dump(park, open('parked_2026-07-29.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print("parked 29 Jul material -> parked_2026-07-29.json")
