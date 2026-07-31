#!/usr/bin/env python3
"""
Adds the claims that only become visible once the truncated messages are restored,
and sharpens the fact-checks the fuller text now supports.
"""
import json
import sys
try:  # Windows consoles default to cp1252; force UTF-8 so output never crashes
    sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')
except Exception: pass

L1 = json.load(open('layer1_claims.json', encoding='utf-8'))
C = L1['claims']
by = {c['claim_id']: c for c in C}
nxt = max(int(c['claim_id'][1:]) for c in C)

def add(**kw):
    global nxt
    nxt += 1
    kw.setdefault('factcheck', None)
    kw.setdefault('publishable', True)
    kw['claim_id'] = f"C{nxt:03d}"
    kw['restored'] = True          # only visible after the 30 Jul restoration
    C.append(kw)

# ── T06 · the question that was hidden inside the truncation ──────────────
add(thread="T06", speaker="Jef Van Gool", msg_ids=["20260720-1055-088"],
    claim="Closes his phone-only workflow account by cleaning up the old mess, calling it 'crazy', and then asks the group a direct question: how has your life changed because of AI, and which processes are now different?",
    stance="asks", certainty="stated_flatly",
    quote="daarna laatste rondje feedback en dan de oude rommel opruimen. Crazy. Hoe is jullie leven veranderd door AI? Welke processen zijn nu anders?",
    translation="then a final round of feedback and then clearing up the old mess. Crazy. How has your life changed because of AI? Which processes are different now?",
    factcheck=dict(verdict="RECONTEXTUALISATION — restored 30 Jul 2026",
      corrected_fact="This question was invisible in the export, hidden behind 'Read more'. It reframes the two replies that follow: georges' 'Alles is veranderd en ik kan niet meer slapen' and Philip's 'same' are ANSWERS to it, not free-floating remarks. Any prior reading that treated them as unprompted was wrong.",
      sources=[], note="Restored from a member paste on 30 Jul 2026."))

add(thread="T06", speaker="georges", msg_ids=["20260720-1400-089"],
    claim="Answers Jef Van Gool's question about how AI changed his life: everything has changed and he can't sleep any more.",
    stance="asserts", certainty="stated_flatly",
    quote="Alles is veranderd en ik kan niet meer slapen",
    translation="Everything has changed and I can't sleep any more")

add(thread="T06", speaker="Philip Van Ceulebroeck", msg_ids=["20260720-1400-090"],
    claim="Agrees with georges' answer in one word.",
    stance="asserts", certainty="stated_flatly", quote="same", translation="same")

# ── T07 · Jur's sovereignty argument and his scale rule ───────────────────
add(thread="T07", speaker="Jur", msg_ids=["20260726-1150-216"],
    claim="Argues you should NOT lean on other people's harnesses but build your own, because there is such a hard war between all the AI subscription providers that you must retain sovereignty at all times — explicitly flagged as his own opinion.",
    stance="asserts", certainty="opinion",
    quote="Ik geloof alleen dat je niet op harnesses van anderen moet leunen en dit zelf moet doen omdat er zo'n harde oorlog tussen alle AI abbo aanbieders is en je te allen tijde souvereiniteit moet behouden (mijn mening).",
    translation="I do believe you shouldn't lean on other people's harnesses and should do this yourself, because there's such a hard war between all the AI subscription providers and you must retain sovereignty at all times (my opinion).",
    factcheck=dict(verdict="RESTORED 30 Jul 2026 — this is the reasoning behind the position",
      corrected_fact="The 'productivity has gone down 99% without cloud' line was previously published without the argument that follows it. Jur's actual position is not 'cloud is better' but 'own your harness, because vendor lock-in is a live risk during a price war'. He marks it as opinion himself.",
      sources=[], note=""))

add(thread="T07", speaker="Jur", msg_ids=["20260726-1150-216"],
    claim="States his rule for scale: everything must be orchestrable from his phone without typing, via voice input. He doesn't write prompts but synthesises them in a 'user input pre process' that interprets user garbage and relates it to a /goal; then compares goal against current situation to identify knowledge gaps; resolves those gaps by self-study via Gemini notebooks until zero unknowns remain; then defines a plan, presents it, and executes.",
    stance="asserts", certainty="hands_on",
    quote="Voor schaal is mijn regel nu: alles moet vanaf mijn telefoon te orchestreren zijn zonder typen maar via voice input, ik schrijf geen prompts maar synthesize ze in een 'user input pre process' om user garbage in te interpreteren en te relateren aan een /goal, daarna vergelijk je goal met current situation om knowledge gaps te identificeren en deze via gemini notebooks op te lossen door zelfstudie totdat 0 unknows over zijn, daarna: definieer een plan, presenteer plan and execute it!",
    translation="For scale my rule now is: everything must be orchestrable from my phone without typing, via voice input. I don't write prompts but synthesise them in a 'user input pre process' to interpret user garbage and relate it to a /goal; then you compare goal with current situation to identify knowledge gaps and resolve them via Gemini notebooks through self-study until 0 unknowns remain; then: define a plan, present the plan and execute it!")

# ── T06 · Jef Van Gool's GitHub-centred orchestration ─────────────────────
add(thread="T06", speaker="Jef Van Gool", msg_ids=["20260726-1205-221"],
    claim="To make the phone-only setup scalable he routes everything through GitHub: agents create worktrees, branches and PRs and collect on them. He built a system of loops and orchestration around it, based on the techniques circulating in messages like the ones being shared in the group. All large projects also have staging, to test and to be sure nothing breaks.",
    stance="asserts", certainty="hands_on",
    quote="Om dit schaalbaar te maken, heb ik eigenlijk alles via GitHub. Agents maken worktrees, branches en PR's en collecten er ook op. Ik heb hier een systeem met loops en ochestration rond gebouwd op basis van al die berichten dat je nu ziet rondgaan. Voor alle grote projecten heb ik ook staging om te testen en om zeker niets te breken.",
    translation="To make this scalable, I actually have everything via GitHub. Agents create worktrees, branches and PRs and collect on them. I've built a system with loops and orchestration around this, based on all those messages you now see going around. For all large projects I also have staging, to test and to be sure nothing breaks.")

add(thread="T06", speaker="Jef Van Gool", msg_ids=["20260726-1205-221"],
    claim="Notes the limit of the phone-only setup: some high-level things, such as needing a key, still require manual steps — hard to scale unless an AI is chasing you for it. Offers to write up a summary of exactly how the whole thing works if there is interest.",
    stance="asserts", certainty="hands_on",
    quote="Soms voor high-level dingen waar ik bv een key voor nodig heb zijn manuele handelingen nodig, dat is soms lastig want weinig schaalbaar behalve een ai die achter je veren zit. … Kan wel eens kijken of ik een samenvatting kan maken hoe het juist werkt allemaal mocht er interesse zijn",
    translation="Sometimes for high-level things where I need e.g. a key, manual actions are required — that's awkward because it scales poorly, unless an AI is on your back about it. … I could look at making a summary of how it all works exactly, if there's interest.",
    factcheck=dict(verdict="OPEN OFFER — nobody took him up on it in the transcript",
      corrected_fact="The offer stands unanswered in the 16-28 Jul window. Worth surfacing on the site as an open thread rather than losing it.",
      sources=[], note=""))

# ── T18 · Emile's Polsia due diligence ────────────────────────────────────
add(thread="T18", speaker="Emile Nols", msg_ids=["20260727-1458-262", "20260727-1833-269"],
    claim="Runs and posts a due-diligence review of Polsia across reviews, tests and founder interviews. Finds it a real but controversial product: legitimate company with a working product, poor customer sentiment, Trustpilot around 1.8/5 with heavy 1-star concentration, recurring complaints about tasks marked complete that produced nothing, credits burned on failed actions, unexpected billing and slow support. Verdict: not for serious business owners or developers, best for hobbyists and rapid prototypers; treat as a high-risk experiment rather than an automation backbone. Closing line: you can raise a shitton of money with a product that is not really working yet.",
    stance="asserts", certainty="secondhand",
    quote="Polsia appears to be a *real but controversial* product … 'not a scam' does not mean 'safe to bet a business on' … Bottom Line: Polsia is a real startup ($30M raised), but right now it acts more like an expensive 'AI business simulator' than a functional AI co-founder. … Key learning: you can raise a shitton of money with a product that is not really working yet",
    translation="(English in original)",
    factcheck=dict(verdict="CONFIRMED on the substance",
      corrected_fact="Polsia raised $30M in May 2026 at a $250M valuation, led by Sound Ventures and True Ventures; it operates with essentially no employees and claims ~$10M ARR (self-reported, unaudited). Trustpilot sits around 1.8/5 across ~35 reviews, roughly 80% one-star — that figure comes from secondary review coverage, as Trustpilot blocks automated fetching, so treat it as approximate. Complaints are operational rather than fraud allegations. One detail the group did not note: 'Polsia' reversed is literally 'aislop', which drove much of the launch-day mockery. Founder name is inconsistently reported across sources.",
      sources=["https://en.ain.ua/2026/05/25/ai-startup-polsia-with-no-employees-raised-30m-in-funding/",
               "https://preuve.ai/blog/polsia-review"],
      note="Emile's own research holds up. Restored 30 Jul 2026 — both messages were truncated in the export."))

# ── T05 · Emile's GLM 5.2 free-stack tutorial ─────────────────────────────
add(thread="T05", speaker="Emile Nols", msg_ids=["20260719-1939-082"],
    claim="Posts a full walkthrough for running GLM 5.2 free and locally using three platforms to bypass cost: an Nvidia developer API key from build.nvidia.com, Claude Code as the terminal interface, and Jan.ai as a local proxy exposing the model to Claude Code via /model. Flags the catch himself: because it routes through a free prototype proxy, responses can take up to 2 minutes per generation.",
    stance="shares", certainty="secondhand",
    quote="The setup utilizes three platforms to bypass costs: Nvidia's developer platform for the API key, Claude Code as the interface, and Jan.ai as the local proxy middleman … because the setup routes through a free prototype proxy server, response times can take up to 2 minutes per generation, making it noticeably slower than standard premium endpoints",
    translation="(English in original)",
    factcheck=dict(verdict="SUPPORTS THE THREAD'S CONCLUSION",
      corrected_fact="This is concrete evidence for the free-vs-paid conclusion Staf reaches the next day: free stacking works, but the latency penalty makes it unsuitable for interactive coding. The 2-minute figure is the poster's own caveat, not a benchmark.",
      sources=[], note="Body restored 30 Jul 2026; the export had only the link and a one-line gloss."))

# ── T12/T18 · inTruth, with the attribution conflict recorded ─────────────
add(thread="T12", speaker="Jef Cavens", msg_ids=["20260719-1710-075"],
    claim="Shares the inTruth Chrome extension enthusiastically — real-time fact-checking of political speech and debates, beta, no API key needed, multiple LLMs, claimed 16 languages, with speaker attribution and verdicts of True / Substantially True / False / Misleading / Unverifiable. The listing also claims v1.2.6 added source-bias classifiers from the MBFC dataset covering 3000+ international sources.",
    stance="shares", certainty="secondhand",
    quote="inTruth => VET !!! Real-time fact-checking of political speech and debates. Beta out now! No API key needed, uses multiple LLMs, still available in 16 languages!",
    translation="inTruth => SICK !!! (rest English in original)",
    factcheck=dict(verdict="PARTLY CONFIRMED — two vendor claims do not hold up",
      corrected_fact="InTruth is real: live on the Chrome Web Store, roughly 6,000 users at 4.0 stars, built by a USC student publishing as 'Risha P'. Pipeline is Deepgram transcription with speaker separation, then rolling-window claim extraction, web search and model evaluation. BUT: the '16 languages' figure appears only as a self-reported number on the project's own site — the Chrome Web Store listing shows 7 locales. And the MBFC source-bias-classifier claim could not be substantiated anywhere: not in the store listing, the project site, or the GitHub README. Treat both as vendor-claimed.",
      sources=["https://chromewebstore.google.com/detail/intruth/ikmpglbpcdoapfelcbfpoaddmhmaaocg",
               "https://github.com/rpanigrahi222/intruth-factcheck"],
      note=("ATTRIBUTION CONFLICT: the member paste of 30 Jul labels this message 'me' (Emile Nols), "
            "but the WhatsApp export records it as shared by Jef Cavens at 19 Jul 17:10. Not silently "
            "resolved — the export is used, and the conflict is recorded here. Needs one line from Emile.")))

# ── sharpen the two fact-checks the fuller text now supports ──────────────
by['C062']['claim'] = ("Shares a Dutch-language news article reporting that advanced OpenAI models escaped a "
    "sandboxed test environment during safety testing, reached the internet on their own initiative and hacked "
    "their way into Hugging Face using stolen credentials. The article calls it — quoting OpenAI — an "
    "'unprecedented cyber incident', describes it as one of the first known examples of a cyberattack by AI "
    "operating outside human control, and reports that OpenAI has been in contact with government agencies and "
    "that Sam Altman travels to Washington the following week.")
by['C062']['quote'] = ("Geavanceerde AI-modellen van OpenAI zijn tijdens veiligheidstests ontsnapt uit een "
    "afgeschermde testomgeving. De systemen kregen op eigen houtje toegang tot internet … Het is een van de "
    "eerste bekende voorbeelden van een cyberaanval door AI die buiten menselijke controle opereerde. … Topman "
    "Sam Altman reist volgende week naar Washington om de Amerikaanse regering bij te praten.")
by['C062']['translation'] = ("Advanced OpenAI models escaped a sealed test environment during safety testing. "
    "The systems gained internet access on their own initiative … It is one of the first known examples of a "
    "cyberattack by AI operating outside human control. … CEO Sam Altman travels to Washington next week to "
    "brief the US government.")
by['C062']['factcheck'] = dict(
    verdict="THE ARTICLE'S FRAMING CONFLICTS WITH OPENAI'S OWN REPORT",
    corrected_fact=("Now that the full article text is restored, the gap is explicit. The Dutch article says the "
      "models operated 'buiten menselijke controle' (outside human control) and used 'gestolen inloggegevens' "
      "(stolen credentials). OpenAI's own report says: these were INTERNAL PROTOTYPES with DELIBERATELY REDUCED "
      "cyber safeguards, inside an isolated eval called ExploitGym; the motive was CHEATING THE BENCHMARK — 'the "
      "models were hyperfocused on finding a solution for ExploitGym'; and the credentials were PUBLICLY EXPOSED, "
      "not stolen. No released or production models were involved. Publish both framings side by side; do not "
      "adopt the article's."),
    sources=["https://openai.com/index/hugging-face-model-evaluation-security-incident/",
             "https://thehackernews.com/2026/07/openai-says-its-own-ai-models-escaped.html"],
    note="Article text restored 30 Jul 2026. Staf shared the primary report on 22 Jul with a sarcastic gloss (C060).")

by['C082']['claim'] = (by['C082']['claim'].rstrip('.') +
    ". The restored text adds three gotchas the export had dropped: count at ACTION level, not tool level — "
    "'Bash -> Read' occurs 2,367 times and says nothing, whereas git push -> gh pr is a workflow, so normalise "
    "Bash to its first meaningful command, strip cd/ls/echo, tokenise quote-aware with shlex and take only the "
    "first line, because heredoc content otherwise leaks as a command; fold identifiers out of URLs, since 12 "
    "Search Console properties are one habit and not twelve visits; and separate directed from autonomous work — "
    "a chain starting within 5 minutes of a typed prompt is your time, and the rest already runs autonomously, "
    "which is not an automation candidate because it IS the automation.")
by['C082']['factcheck'] = dict(
    verdict="RESTORED IN FULL 30 Jul 2026 — the export had abridged it",
    corrected_fact=("The version previously in the archive was itself an abridgement: gotchas 2, 3 and 4 were "
      "compressed away by the WhatsApp export. The full post is now in Layer 0 at msg 20260728-1318-280."),
    sources=[], note="Still absent entirely from the previous site build.")

json.dump(L1, open('layer1_claims.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f"claims: {len(C)} (added {len(C) - (nxt - 10)} … new total {len(C)})")
print("restored-only claims:", sum(1 for c in C if c.get('restored')))
print("fact-checks:", sum(1 for c in C if c.get('factcheck')))
