// AI Anonymous Knowledge Nexus & Data Store
// Consolidated from Group Chat Summaries (July 16-29, 2026)

const KNOWLEDGE_DATA = {
  metadata: {
    title: "AA / Ai Anonymous",
    subtitle: "Group Knowledge Base & Prompt Engineering Nexus",
    period: "July 16 – July 29, 2026",
    totalTopics: 12,
    totalLinks: 28,
    totalMembers: 16,
    nextEvent: {
      name: "Antwerp AI Community Meetup & Drinks",
      date: "2026-08-13T19:00:00",
      location: "In Den Boer van Tienen",
      address: "Mechelseplein, Antwerp, Belgium",
      mapUrl: "https://share.google/nc3NJ2YqlIq7NGzgu",
      organizer: "+32 478 82 59 61"
    }
  },

  categories: [
    { id: "all", name: "All Intelligence", icon: "sparkles", color: "#6366f1" },
    { id: "hardware", name: "Hardware & Infrastructure", icon: "cpu", color: "#3b82f6" },
    { id: "vision", name: "Vision, VLMs & Pose", icon: "eye", color: "#06b6d4" },
    { id: "vibe", name: "Vibe Coding & Agencies", icon: "code-bracket", color: "#10b981" },
    { id: "security", name: "Security & Governance", icon: "shield-check", color: "#ef4444" },
    { id: "nlp", name: "NLP, FinBERT & Embeddings", icon: "cube", color: "#a855f7" },
    { id: "projects", name: "Group Projects & SaaS", icon: "rocket", color: "#f59e0b" }
  ],

  topics: [
    {
      id: "hw-workstations",
      category: "hardware",
      title: "Local AI Workstations vs. Cloud GPUs",
      summary: "Prioritize GPU VRAM over CPU/RAM. Dual-CPU configurations introduce severe NUMA memory latency bottlenecks, making single high-end CPUs with high-VRAM NVIDIA cards far superior for local inference.",
      date: "July 16-24, 2026",
      sharedBy: ["+31 6 41488324", "Emile Nols"],
      keyTakeaways: [
        "Single high-end CPU is preferable over Dual-CPU due to NUMA (Non-Uniform Memory Access) bandwidth penalties during model weights loading.",
        "NVIDIA RTX 6000 Pro (48GB-48GB setups) praised for multi-stream workloads.",
        "Cloud GPU hourly rentals recommended for stress-testing and benchmarking workloads before buying hardware.",
        "Elgato Stream Deck (MK.2) beats Codex Micro for macro status feedback and visual status displays."
      ],
      tags: ["Workstation", "NVIDIA RTX 6000", "NUMA Bottleneck", "Hardware", "Stream Deck"],
      links: [
        { title: "Elgato Stream Deck MK.2", url: "https://www.coolblue.nl/product/920071/elgato-stream-deck.html", sharedBy: "+31 6 41488324", category: "Hardware & Infrastructure" },
        { title: "RTX 6000 Pro Workstation Discord", url: "https://discord.gg/jAHhXZsbz", sharedBy: "+31 6 41488324", category: "Hardware & Infrastructure" },
        { title: "Tailscale Mesh VPN", url: "https://tailscale.com/", sharedBy: "Emile Nols", category: "Hardware & Infrastructure" }
      ],
      prompts: {
        deepDive: "Act as a Principal AI Infrastructure Engineer. Analyze a local AI workstation build for LLM inference (30B to 70B models) vs Cloud GPU instances (RunPod, Lambda, Hetzner). Focus on: 1) Impact of NUMA memory architecture on token generation latency, 2) VRAM requirements for FP16, INT8, and Q4_K_M quantizations, 3) Cost-benefit analysis over 12 months for 8 hours daily inference.",
        codeGen: "Write a Python script using PyTorch and pynvml to measure GPU VRAM utilization, PCIe bandwidth transfer rate, and token output per second (tokens/sec) during streaming inference with llama.cpp or vLLM.",
        executive: "Give me a 3-bullet executive summary comparing local hardware investment ($6,000–$12,000 RTX workstation) vs cloud API spend for a 15-person engineering team."
      },
      hasTool: "vramCalc"
    },
    {
      id: "vlm-pose-detection",
      category: "vision",
      title: "Vision LLMs Latency: Qwen 3.5 VL vs. Gemma",
      summary: "In visual processing and multi-blob ergonomics pose tracking, Qwen 3.5 / Qwen VL (30B & 32B-instruct) achieved sub-300ms latency, while Gemma lagged severely at 7,000ms–12,000ms per frame.",
      date: "July 16-24, 2026",
      sharedBy: ["+32 485 74 96 21", "Jef Cavens"],
      keyTakeaways: [
        "Qwen 3.5 VL (30B/32B-instruct) provides sub-300ms processing times, ideal for real-time ergonomics pose detection.",
        "Gemma vision models exhibited 7s–12s latency per frame, rendering them unusable for multi-blob vision applications.",
        "Production vision tracking stack: TrackTrack + OSNet + Qwen VL for robust person re-identification (Re-ID) and spatial positioning."
      ],
      tags: ["Computer Vision", "Qwen 3.5 VL", "Gemma", "Pose Detection", "TrackTrack", "OSNet"],
      links: [
        { title: "Cursor Blog: LLM Router Architectures", url: "https://cursor.com/blog/router", sharedBy: "+32 485 74 96 21", category: "AI & Developer Tools" },
        { title: "vLLM Semantic Router", url: "https://github.com/vllm-project/semantic-router", sharedBy: "+32 472 72 88 00", category: "AI & Developer Tools" },
        { title: "LiteLLM AutoRouter v2", url: "https://docs.litellm.ai/blog/autorouter-v2", sharedBy: "+32 472 72 88 00", category: "AI & Developer Tools" }
      ],
      prompts: {
        deepDive: "Act as a Computer Vision Architect specializing in real-time edge processing. Compare Qwen 3.5 VL (30B/32B) against Gemma 2 Vision for real-time ergonomics pose estimation and person re-identification. Explain why Qwen achieves sub-300ms frame latency while Gemma experiences 7s+ latency, focusing on vision encoder tokenization and cross-attention layer bottlenecks.",
        codeGen: "Write a Python OpenCV + PyTorch pipeline script that feeds video frames into a local Qwen VL endpoint, extracts keypoint pose coordinates, and calculates tracking latency per frame with visual bounding box rendering.",
        executive: "What are the top 3 considerations when choosing a Vision-Language Model for live video stream analysis and safety compliance?"
      }
    },
    {
      id: "vibe-coding-agencies",
      category: "vibe",
      title: "Vibe Coding Adoption in Web & Digital Agencies",
      summary: "Belgian and Antwerp digital agencies (Underdog Design, We Are) are pioneering 'Vibe Coding' workflows—blending automated AI generation with human review pipelines and prompt token optimization techniques.",
      date: "July 16-24, 2026",
      sharedBy: ["+32 474 58 06 40", "Philip Van Ceulebroeck", "Jef Cavens"],
      keyTakeaways: [
        "Antwerp agencies (Underdog Design) and Gent agencies (We Are) actively implement AI code generation with senior developer code review pipelines.",
        "Caveman AI Prompting: Concise system instructions that reduce LLM output token verbosity by ~65% without compromising code functional precision.",
        "AI Architecture Patterns: Leveraging 'AI Pattern Book' design patterns and Lilian Weng's agent testing harnesses to prevent production code degradation."
      ],
      tags: ["Vibe Coding", "Caveman Prompt", "Token Reduction", "Underdog Design", "AI Testing", "Agencies"],
      links: [
        { title: "Caveman AI Prompting (65% Token Saver)", url: "https://github.com/juliusbrussee/caveman", sharedBy: "Philip Van Ceulebroeck", category: "AI & Developer Tools" },
        { title: "AI Pattern Book", url: "https://aipatternbook.com/", sharedBy: "Jef Cavens", category: "AI Engineering & Architecture" },
        { title: "Lilian Weng Blog (Agent Harnesses)", url: "https://lilianweng.github.io/posts/2026-07-04-harness/", sharedBy: "Jef Cavens", category: "AI Engineering & Architecture" },
        { title: "Underdog Design (Antwerp Agency)", url: "https://underdogdesign.be", sharedBy: "+32 474 58 06 40", category: "Vibe Coding Agencies" },
        { title: "We Are (Gent Agency)", url: "https://we-are.be/nl", sharedBy: "+32 474 99 17 97", category: "Vibe Coding Agencies" }
      ],
      prompts: {
        deepDive: "Examine the 'Caveman AI' prompting philosophy. How does stripping prose, polite filler, and superfluous explanatory commentary from system prompts impact: 1) Output token consumption (~65% reduction), 2) LLM generation speed/throughput, 3) Code syntax accuracy and edge case handling?",
        codeGen: "Generate a System Prompt template based on the Caveman AI format that forces the AI to output zero conversational text, raw code only, concise error handling, and strict TypeScript types.",
        executive: "How can an agency implement AI-assisted development (vibe coding) while maintaining strict QA and code safety standards for clients?"
      },
      hasTool: "tokenCalc"
    },
    {
      id: "nlp-finbert-embeddings",
      category: "nlp",
      title: "FinBERT vs. ModernBERT: Specialized Domain Embeddings",
      summary: "Domain-specific fine-tuned models like FinBERT outperform general BERT and newer general LLM embeddings by 3x in financial sentiment and vector pre-filtering, proving domain training beats raw parameters.",
      date: "July 28-29, 2026",
      sharedBy: ["+32 472 72 88 00", "Emile Nols", "Jef Cavens"],
      keyTakeaways: [
        "FinBERT with PyTorch produces ~800-dimensional vector embeddings, delivering 3x higher precision in financial domain tasks than standard BERT.",
        "Debate on 'Is BERT dead?': Consensus is that compact BERT architectures still outperform 7B+ LLM embeddings in low-latency search pre-filtering.",
        "Emerging lightweight architectures to watch: GLiNER (named entity recognition), SetFit (few-shot classification), and ModernBERT.",
        "Custom 'No-Hallucinate Skill': Implementing validation steps in agentic tools to eliminate hallucinated facts during search retrieval."
      ],
      tags: ["FinBERT", "Embeddings", "ModernBERT", "GLiNER", "PyTorch", "Hallucination Defense"],
      links: [
        { title: "Open Code Review (Alibaba)", url: "https://github.com/alibaba/open-code-review", sharedBy: "Emile Nols", category: "AI & Developer Tools" },
        { title: "AgentMail (Email API for Agents)", url: "https://www.agentmail.to", sharedBy: "+32 490 39 65 90", category: "AI & Developer Tools" },
        { title: "Museum of AI Failures", url: "https://museumoffailure.com/ai-failure", sharedBy: "Jef Cavens", category: "AI Engineering & Architecture" }
      ],
      prompts: {
        deepDive: "Compare FinBERT vs ModernBERT vs OpenAI text-embedding-3-small for domain-specific financial document vector search. Evaluate embedding dimension, cosine similarity accuracy, latency per 1000 tokens, and memory footprint in vector databases (pgvector/Qdrant).",
        codeGen: "Write a PyTorch Python script using HuggingFace Transformers that loads FinBERT, generates vector embeddings for a list of financial texts, and performs cosine similarity matching with top-k ranking.",
        executive: "Why should businesses use lightweight domain-tuned embedding models instead of sending all data to expensive cloud LLM APIs?"
      }
    },
    {
      id: "ai-security-governance",
      category: "security",
      title: "Agent Sandbox Escapes, Jailbreaks & Governance",
      summary: "Emerging risks in autonomous agent deployment include sandbox breakouts, credential exposure, and sophisticated jailbreak patterns like Pliny's Claude/Fable 5 exploit.",
      date: "July 16-24, 2026",
      sharedBy: ["+32 472 72 88 00", "+32 486 64 19 31"],
      keyTakeaways: [
        "Jailbreak Vulnerabilities: Analysis of Pliny's Claude / Fable 5 jailbreaks highlights prompt injection risks in autonomous tool-using agents.",
        "Open-Weight vs. Proprietary AI Debate: Regulatory friction between open weights (Qwen, Llama, Gemma) and closed systems (OpenAI, Anthropic).",
        "Agent Credential Theft: Real-world security incidents (e.g. OpenAI Hugging Face evaluation incident) underscore the danger of hardcoded API keys in agent environments."
      ],
      tags: ["AI Security", "Jailbreaks", "Pliny Claude", "Agent Governance", "Open Weight"],
      links: [
        { title: "OpenAI HuggingFace Security Incident Report", url: "https://openai.com/index/hugging-face-model-evaluation-security-incident/", sharedBy: "+32 472 72 88 00", category: "Security & Industry News" },
        { title: "Claude / Fable 5 Jailbreak Analysis", url: "https://cybersecuritynews.com/anthropics-claude-fable-5-jailbroken/", sharedBy: "+32 472 72 88 00", category: "Security & Industry News" },
        { title: "TechCrunch: Open-Weight Models Debate", url: "https://techcrunch.com/2026/07/20/openai-is-scared-of-open-weight-models-should-the-us-be/", sharedBy: "+32 486 64 19 31", category: "Security & Industry News" },
        { title: "LinkedIn: Agent Security & Claude Code", url: "https://www.linkedin.com/posts/qi-deng-5a9547b1_aisecurity-agenticai-claudecode-activity-7483052479841206273-nNCG", sharedBy: "+32 472 72 88 00", category: "Security & Industry News" }
      ],
      prompts: {
        deepDive: "Act as a Cybersecurity Penetration Tester specializing in Agentic AI systems. Detail the threat model of Indirect Prompt Injection (IPI) on autonomous coding agents (e.g., Claude Code, Cursor, AutoGPT). Explain how malicious payload comments in open-source repos can lead to unprompted file system access or credential exfiltration.",
        codeGen: "Write a Python input sanitizer function that detects prompt injection patterns, system role overrides, and jailbreak tokens before sending user input to an LLM agent tool call.",
        executive: "What are the 5 mandatory security rules every company must establish before granting AI agents file system or API execute permissions?"
      }
    },
    {
      id: "group-projects-saas",
      category: "projects",
      title: "Member AI Projects: Notiva, Deckslide & Ornn",
      summary: "Highlighting innovation within the AA / AI Anonymous community: Stealth AI OS for Notary offices, compute marketplace platforms, and user-token SaaS integrations.",
      date: "July 16-29, 2026",
      sharedBy: ["Jef Cavens", "+32 474 84 74 93", "Jef Van Gool", "Xavier Leclair"],
      keyTakeaways: [
        "Notiva: Stealth-mode AI OS specifically built for Notary offices delivering +70% time savings per legal deed.",
        "Deckslide SaaS Dilemma: Discussion on whether to offer AI features via built-in platform token billing vs. Model Context Protocol (MCP) allowing users to bring their own API keys.",
        "Ornn: Compute trading financial infrastructure platform for AI workloads.",
        "Snowskiproperty: Side project for kite enthusiasts, currently being updated for responsive mobile viewports."
      ],
      tags: ["Notiva", "Deckslide", "Ornn", "SaaS", "MCP", "Snowskiproperty"],
      links: [
        { title: "Deckslide", url: "https://deckslide.com", sharedBy: "+32 474 84 74 93", category: "AI & Developer Tools" },
        { title: "Ornn (Compute Trading Platform)", url: "https://ornn.com", sharedBy: "Jef Cavens", category: "AI & Developer Tools" },
        { title: "Sandbar", url: "https://www.sandbar.com", sharedBy: "Jef Cavens", category: "AI & Developer Tools" },
        { title: "Snowskiproperty", url: "https://snowskiproperty-production.up.railway.app", sharedBy: "Jef Van Gool", category: "Group Projects & Resources" },
        { title: "BoekScout Book Recommendation", url: "https://www.boekscout.nl/shop2/boek/9789465284927", sharedBy: "Jef Cavens", category: "Group Projects & Resources" },
        { title: "Claude Pro 3-Week Free Referral", url: "https://claude.ai/referral/KkaOFYLTrA", sharedBy: "+31 6 53618688", category: "Group Projects & Resources" }
      ],
      prompts: {
        deepDive: "Analyze the architectural trade-offs of integrating AI capabilities into a SaaS platform (e.g. Deckslide) via Model Context Protocol (MCP) vs. Native Platform API billing. Compare user privacy, friction, onboarding, profit margins, and rate-limiting enforcement.",
        codeGen: "Write an MCP (Model Context Protocol) TypeScript server starter template that exposes local data functions securely to any compliance-focused LLM client.",
        executive: "How can a specialized B2B vertical SaaS (like Notiva for notary offices) build a defensible moat against horizontal AI models like ChatGPT and Claude?"
      }
    }
  ],

  resources: [
    { name: "Cursor Router Blog", category: "AI & Dev Tools", url: "https://cursor.com/blog/router", sharedBy: "+32 485 74 96 21", desc: "LLM router architectures and model dispatch optimization." },
    { name: "vLLM Semantic Router", category: "AI & Dev Tools", url: "https://github.com/vllm-project/semantic-router", sharedBy: "+32 472 72 88 00", desc: "Local semantic routing tool built by Red Hat / vLLM team." },
    { name: "LiteLLM AutoRouter v2", category: "AI & Dev Tools", url: "https://docs.litellm.ai/blog/autorouter-v2", sharedBy: "+32 472 72 88 00", desc: "Routing framework balancing load between vLLM & llama.cpp." },
    { name: "Caveman AI Prompting", category: "AI & Dev Tools", url: "https://github.com/juliusbrussee/caveman", sharedBy: "Philip Van Ceulebroeck", desc: "Repository for stripping LLM prompt verbosity and cutting tokens ~65%." },
    { name: "Matt Pocock Dev Skills", category: "AI & Dev Tools", url: "https://github.com/mattpocock/skills", sharedBy: "Emile Nols", desc: "TypeScript and developer skills reference repository." },
    { name: "AI Pattern Book", category: "Architecture", url: "https://aipatternbook.com/", sharedBy: "Jef Cavens", desc: "Design patterns for building production agentic AI applications." },
    { name: "Lilian Weng (Agent Harnesses)", category: "Architecture", url: "https://lilianweng.github.io/posts/2026-07-04-harness/", sharedBy: "Jef Cavens", desc: "Research post on testing harnesses and eval frameworks for agents." },
    { name: "SidePulse", category: "Architecture", url: "https://sidepulse.io", sharedBy: "+32 472 72 88 00", desc: "Platform for managing side-projects and micro-SaaS ventures." },
    { name: "Tailscale Mesh VPN", category: "Infrastructure", url: "https://tailscale.com/", sharedBy: "Emile Nols / +32 477 36 22 82", desc: "Mesh VPN for hybrid local/cloud work and client infrastructure." },
    { name: "OpenAI Security Incident", category: "Security", url: "https://openai.com/index/hugging-face-model-evaluation-security-incident/", sharedBy: "+32 472 72 88 00", desc: "Security disclosure report on model evaluation environment leak." },
    { name: "Claude / Fable 5 Jailbreak", category: "Security", url: "https://cybersecuritynews.com/anthropics-claude-fable-5-jailbroken/", sharedBy: "+32 472 72 88 00", desc: "Breakdown of Pliny's Claude jailbreak techniques." },
    { name: "Buzz by Jack Dorsey", category: "Industry News", url: "https://techcrunch.com/2026/07/21/jack-dorsey-is-taking-on-slack-with-buzz-a-group-chat-platform-for-teams-and-their-ai-agents/", sharedBy: "Emile Nols", desc: "TechCrunch report on Buzz group chat built for human-AI agent teams." },
    { name: "AgentMail", category: "AI & Dev Tools", url: "https://www.agentmail.to", sharedBy: "+32 490 39 65 90", desc: "Email API designed specifically for AI agents." },
    { name: "Alibaba Open Code Review", category: "AI & Dev Tools", url: "https://github.com/alibaba/open-code-review", sharedBy: "Emile Nols", desc: "AI-assisted code review tooling on GitHub." },
    { name: "Ornn", category: "AI Infrastructure", url: "https://ornn.com", sharedBy: "Jef Cavens", desc: "Financial infrastructure platform for compute trading markets." },
    { name: "In Den Boer van Tienen (Meetup)", category: "Events", url: "https://share.google/nc3NJ2YqlIq7NGzgu", sharedBy: "+32 478 82 59 61", desc: "Google Maps location for Antwerp group drinks on August 13, 2026." }
  ],

  members: [
  {
    "name": "Klaas Bellemans",
    "role": "Jack BV (Webapps & Eng)",
    "email": "klaas@jack-bv.be",
    "phone": "(047) 770 84 14",
    "company": "Jack BV (Webapps & Eng)",
    "website": "",
    "background": "Opleiding ingenieur => zelfstandige website en webapp bouwer, vanuit probleemoplossende insteek => projectleider grondwerken in industriebouw => operationeel verantwoordelijke bij gevelwerken firma.",
    "goals": "Efficiëntie",
    "contributions": "Geef me een voorzet, en ik...",
    "topicsContributed": [
      "Opleiding ingenieur => zelfstandige website en webapp bouwer, vanuit probleemoplossende insteek => projectleid...",
      "Geef me een voorzet, en ik..."
    ],
    "linkedin": "https://www.linkedin.com/in/klaasbellemans",
    "linkedinTagline": "Operations @JACK!",
    "linkedinSummary": "Long-time web/webapp builder since 1996; currently in Operations at JACK! and owner of Yaki.be."
  },
  {
    "name": "Tom Caluwaerts",
    "role": "Telenet",
    "email": "tom.caluwaerts@telenet.be",
    "phone": "(049) 032 65 90",
    "company": "Telenet",
    "website": "",
    "background": "Was applicatiespecialist bij Sysmex, wereldwijd marktleider in het bepalen van het bloedbeeld. Vandaag ondernemer met meerdere vennootschappen, gespecialiseerd in lokale LLM's en GDPR-conforme AI-implementatie. Ik focus me op een ecosysteem voor geautomatiseerde leadgeneratie, nieuwsbrieven en op termijn een hybride leerplatform over AI. Specifieke interesse daarbij: legal tech — ik deed diepgaand onderzoek naar geautomatiseerde juridische documentgeneratie en compliance-workflows voor de Belgische en Nederlandse markt, en verken momenteel een eerste concrete toepassing.",
    "goals": "Concreet: mijn eigen architectuur toetsen aan die van anderen, en sneller leren welke tools in de praktijk standhouden. Ik start momenteel met het bouwen van AI-automatiseringen voor KMO's en wil mijn beeld van wat de Vlaamse markt écht nodig heeft scherper krijgen. Op termijn sta ik open voor samenwerkingen die verder gaan dan louter kennisdeling.",
    "contributions": "Praktijkervaring met geavanceerde architecturen. Concreet: Een zelflerend agent-systeem in opbouw: Claude Code als orchestrator met aparte builder- en reviewer-instanties, en menselijke goedkeuring via een Telegram-approve gate. n8n-workflows, ingericht als MCP-server. Lokale LLM-opstellingen (Qwen3.5, Qdrant voor RAG, 100% GDPR-conform on-premise). Een AI-contentpijplijn in opbouw (curatie → draft → approve → verzending; stem- en videokloning via ElevenLabs en HeyGen gepland voor de volgende fase). Ik ben breed inzetbaar als AI Generalist — van app-builders en scraping tot video- en audiogeneratie — dus ik kan bij de meeste onderwerpen praktisch meedenken.",
    "topicsContributed": [
      "Was applicatiespecialist bij Sysmex, wereldwijd marktleider in het bepalen van het bloedbeeld. Vandaag onderne...",
      "Praktijkervaring met geavanceerde architecturen. Concreet: Een zelflerend agent-systeem in opbouw: Claude Code..."
    ],
    "linkedin": "https://www.linkedin.com/in/tomcaluwaerts",
    "linkedinTagline": "Geniet van de dag",
    "linkedinSummary": "Based in Antwerp Metropolitan Area; profile lists Gemeente Niel experience (unconfirmed match - verify)."
  },
  {
    "name": "Jef Cavens",
    "role": "Cavens.io & Notiva AI OS",
    "email": "jef@cavens.io",
    "phone": "(047) 723 84 34",
    "company": "Cavens.io & Notiva AI OS",
    "website": "",
    "background": "Sinds ~2003 actief is web wereld in allerhande rollen. Focus op product en ondernemerschap. Sinds een tijdje vol op de vibe-code trein gesprongen en dat consumeert nu ongeveer al mijn tijd.",
    "goals": "Ik deel graag met mensen, maar wil nog meer zelf leren van anderen",
    "contributions": "Ik ben veel verschillende dingen ah bouwen en deel graag de details",
    "topicsContributed": [
      "Sinds ~2003 actief is web wereld in allerhande rollen. Focus op product en ondernemerschap. Sinds een tijdje v...",
      "Ik ben veel verschillende dingen ah bouwen en deel graag de details"
    ]
  },
  {
    "name": "Philip Van Ceulebroeck",
    "role": "Altervisions (Prompting & Token Optimization)",
    "email": "altervisions@gmail.com",
    "phone": "(324) 862 13 74",
    "company": "Altervisions",
    "website": "",
    "background": "Nu quantitative finance prop firm  AI en systeemdenken. In een vorig professioneel hoofdstuk was ik sterk bezig met modulaire systemen (smallest common denominator puzzle :-). Daarnaast heb ik ook enige ervaring met lesgeven en kennisoverdracht.",
    "goals": "Ik wil mijn kennis verder verdiepen, ideeën uitwisselen en nieuwe inzichten opdoen over zowel de technische als maatschappelijke impact van AI. Ik interesseer mij ook sterk voor macro-economische en structurele veranderingen door AI. Denkers als Acemoglu & Johnson, Korinek, Brynjolfsson en Dwarkesh Patel houden mij bezig. Hoe ziet onze politiek en economie eruit in 50 jaar, en welke systeemkeuzes maken we nu met langdurige consequenties —  De structurele impact van AI op economieën en markten  -dat soort vragen.",
    "contributions": "Technische diepgang gecombineerd met praktijkervaring. Ik bouw zelf modellen en modelarchitectuur— PCA, random forests, XGBoost, LSTM's, vector embeddings, llm composities , sentiment analysis etc --  Daarnaast heb ik veel tijd besteed aan statistiek, random walks, probability distributions, linear regression bias en het nadenken over curve fitting & overfitting Veel ervaring met meta-prompting, vibe coding en modulair systeemdenken. Vroeger afhankelijk van externe programmeurs; vandaag autonoom.",
    "topicsContributed": [
      "Nu quantitative finance prop firm  AI en systeemdenken. In een vorig professioneel hoofdstuk was ik sterk bezi...",
      "Technische diepgang gecombineerd met praktijkervaring. Ik bouw zelf modellen en modelarchitectuur— PCA, random..."
    ]
  },
  {
    "name": "Vincent Crynen",
    "role": "Altiro",
    "email": "vincent@altiro.be",
    "phone": "(049) 721 57 33",
    "company": "Altiro",
    "website": "",
    "background": "Ik heb een een tenten bedrijf, altiro, met een 20tal vaste werknemers aangevuld met jobstudenten en freelancers tijdens drukke momenten. Ik ben heel analytisch van geest, vroeger veel met excel macro’s gewerkt (van aanvraag in mailbox naar gepersonaliseerde offerte met bijlagen en berekende transportprijs, in monder dan 30seconden, wel niet schaalbaar, dus nu traag crm pakket 😕😅) Momenteel zelf volop met claude aan de slag, in bedrijf net copilot licenties voorzien. Wil graag snel agents implementeren",
    "goals": "Uiteindelijke doel is een ai architectuur op te zetten en ai écht te implementeren in mijn bedrijf",
    "contributions": "Praktijk vanuit kmo, koppeling met thema’s van mijn mba opleiding (momenteel bezig), algemene strategie",
    "topicsContributed": [
      "Ik heb een een tenten bedrijf, altiro, met een 20tal vaste werknemers aangevuld met jobstudenten en freelancer...",
      "Praktijk vanuit kmo, koppeling met thema’s van mijn mba opleiding (momenteel bezig), algemene strategie"
    ]
  },
  {
    "name": "Yannick Cuvelie",
    "role": "Profit Intelligence",
    "email": "yannick@profitintelligence.net",
    "phone": "(047) 484 74 93",
    "company": "Profit Intelligence",
    "website": "",
    "background": "Ik ben gespecialiseerd in databases en data-analyse, met een sterke focus op modelleren en optimaliseren van data, vooral binnen de hotelbranche. Daarnaast onderzoek ik ook hoe AI kansen biedt in KMO’s en de corporate wereld, waar nog veel potentieel ligt.",
    "goals": "Ik wil in de AI-groep mijn kennis verdiepen, nieuwe inzichten opdoen en samen ontdekken hoe we AI kunnen inzetten om echte veranderingen teweeg te brengen in diverse sectoren.",
    "contributions": "Ik kan bijdragen door mijn praktijkervaring met AI te delen en actief mee te denken over concrete toepassingen binnen ons team.",
    "topicsContributed": [
      "Ik ben gespecialiseerd in databases en data-analyse, met een sterke focus op modelleren en optimaliseren van d...",
      "Ik kan bijdragen door mijn praktijkervaring met AI te delen en actief mee te denken over concrete toepassingen..."
    ]
  },
  {
    "name": "Frederik Van Dessel",
    "role": "AI Innovator & Entrepreneur",
    "email": "frederikvandessel@gmail.com",
    "phone": "(047) 609 64 47",
    "company": "AI Innovator & Entrepreneur",
    "website": "",
    "background": "Altijd willen ondernemen, dus ook gedaan na TEW te studeren. Start-up in muziekrechten (lees Sabam transparanter maken), nadien Deliveroo mee opgestart in België en Head of Operations geweest, Head of Sales geweest bij Too Good To Go en een paar jaar liggen kauwen op een duurzame food propositie met Jef :) Intussen gefocused op GTM bij Give a Day (de Tinder van't vrijwilligerswerk).  Veel passie dus voor (sociaal) ondernemerschap, innovatie en eigenlijk ook voorliefde voor gezonde voeding en longevity na een heftige teelbalkankerervaring in 2020.",
    "goals": "Meer kennis, up-to-date blijven, sparringpartners, samen productjes bouwen en testen",
    "contributions": "Zelf al in redelijk wat start-en scale ups gewerkt en dus best wat achtergrond in groei, teams leiden, strategie en innovatie. Zelf ook op exploratie in AI-land dus kan zeker ook mijn learnings delen naast uiteraard mijn lens als ondernemer",
    "topicsContributed": [
      "Altijd willen ondernemen, dus ook gedaan na TEW te studeren. Start-up in muziekrechten (lees Sabam transparant...",
      "Zelf al in redelijk wat start-en scale ups gewerkt en dus best wat achtergrond in groei, teams leiden, strateg..."
    ],
    "linkedin": "https://www.linkedin.com/in/frederikvandessel",
    "linkedinTagline": "GTM & Partnerships @ Give a Day | Volunteering made easy",
    "linkedinSummary": "Experienced in GTM, partnerships, business development and co-founding ventures; previously built The Belgian Food Network and Cookwork."
  },
  {
    "name": "Stijn Deweer",
    "role": "Maldini & PilarBKK",
    "email": "stijn@maldini.be",
    "phone": "(047) 882 59 61",
    "company": "Maldini & PilarBKK",
    "website": "",
    "background": "ondernemer in IT, media, digital marketing:  Cronos, Calibrate, Adsanddata, Maldini, PilarBKK",
    "goals": "slimmer worden, maar vooral netwerk opbouwen van specialisten die PilarBKK gaan kunnen ondersteunen.",
    "contributions": "goed zicht op hoe AI en algoritmes al heel lang de basis vormen van digitale marketing trajecten, andere verticals/sectoren zouden hier veel van kunnen leren",
    "topicsContributed": [
      "ondernemer in IT, media, digital marketing:  Cronos, Calibrate, Adsanddata, Maldini, PilarBKK",
      "goed zicht op hoe AI en algoritmes al heel lang de basis vormen van digitale marketing trajecten, andere verti..."
    ],
    "linkedin": "https://www.linkedin.com/in/stijndeweer",
    "linkedinTagline": "Owner, Maldini.be - marketing & media in a digital world",
    "linkedinSummary": "Runs Maldini, a network of media & marketing experts helping Belgian businesses grow through digital platforms and smart media exposure."
  },
  {
    "name": "Chantal Dierickx",
    "role": "Club Santé",
    "email": "info@clubsante.be",
    "phone": "(049) 949 93 93",
    "company": "Club Santé",
    "website": "",
    "background": "Master in fitheid in gezondheid, die het holistische gezondheidspad opging na een korte carrière in pharma. Afgelopen jaren werk ik als zelfstandig plantaardig chef en gezondheidscoach, zowel freelance als voor particulieren. Sinds 2jaar orthomoleculair therapeut. In oktober start ik mijn eigen wellbeing space (Berchem). Vooral voor social media, website beheer en online cursussen (passief inkomen) ben ik geïnteresseerd in AI gebruik. Ik ben een autodidact, maar heb me nog niet op AI toegelegd. Sinds 9weken mama van Ono ;).",
    "goals": "Werkflow optimalisatie én leren van nieuwe kennis",
    "contributions": "Op dit moment nog niet veel. Tenzij indien we live samenkomen de catering :D.  Maar ik zou wel een presentatie ineensteken over hoe ik het heb gebruikt, nadat ik heb geleerd het goed te implementeren.",
    "topicsContributed": [
      "Master in fitheid in gezondheid, die het holistische gezondheidspad opging na een korte carrière in pharma. Af...",
      "Op dit moment nog niet veel. Tenzij indien we live samenkomen de catering :D.  Maar ik zou wel een presentatie..."
    ]
  },
  {
    "name": "Mathieu D’Hondt",
    "role": "Bluemoon",
    "email": "mathieu@bluemoon.be",
    "phone": "(047) 736 22 82",
    "company": "Bluemoon",
    "website": "",
    "background": "Bij Blue Moon (www.bluemoon.be) verantwoordelijk voor het technische, IT en operations gedeelte.  In die hoedanigheid en vanuit passie voor ondernemen, ontwikkelen en technologie volg ik van dichtbij uiteraard ook de AI ontwikkelingen. Daarvoor ervaring bij grotere corporates als Fortis en General Electric.",
    "goals": "Beter op de hoogte blijven en peer validation van het verschil tussen wat werkt en ruis.",
    "contributions": "De ervaringen delen van de AI transformatie van een KMO, in mijn geval Blue Moon.",
    "topicsContributed": [
      "Bij Blue Moon (www.bluemoon.be) verantwoordelijk voor het technische, IT en operations gedeelte.  In die hoeda...",
      "De ervaringen delen van de AI transformatie van een KMO, in mijn geval Blue Moon."
    ]
  },
  {
    "name": "Patrick Fransen",
    "role": "Aqualion Earth",
    "email": "patrick.fransen@aqualion.earth",
    "phone": "",
    "company": "Aqualion Earth",
    "website": "",
    "background": "Burg Ir computewetenschappen 15 jaar Business consulting bedrijf gehad met 70 man en verkocht 7 jaar bezig met bewuste bedrijven bouwen Ondernemerscoach voor veerkracht en bewustzijnsgroei Beginner met ai",
    "goals": "Opgestart geraken met ai en begrijpen wat er kan , mogelijks zelf een toepassing maken",
    "contributions": "Goede vibe, ben een totale beginner, dus inhoudelijk weinig momenteel, ben wel ondernemer en aan het kijken om misschien iets nieuws te starten , mogelijks met anderen, wie weet leden uit de groep",
    "topicsContributed": [
      "Burg Ir computewetenschappen 15 jaar Business consulting bedrijf gehad met 70 man en verkocht 7 jaar bezig met...",
      "Goede vibe, ben een totale beginner, dus inhoudelijk weinig momenteel, ben wel ondernemer en aan het kijken om..."
    ],
    "linkedin": "https://www.linkedin.com/in/patrickfransen",
    "linkedinTagline": "Founder, Aqualion - Conscious impact investments and entrepreneurship",
    "linkedinSummary": "Impact investor and serial entrepreneur with 20 years experience founding, leading, and investing in companies, focused on health system efficiency."
  },
  {
    "name": "Jef Van Gool",
    "role": "Sherlock SEO & Snowskiproperty",
    "email": "jef@sherlockseo.com",
    "phone": "(003) 247 92 54",
    "company": "Sherlock SEO & Snowskiproperty",
    "website": "",
    "background": "Van oorsprong een Webdesigner, in sales gewerkt sinds 10 jaar eigenaar van een search marketing agency. Ik had ooit ook een coding Academy. Ik heb recentelijk een softwareplatform gebouwd voor mijn marketing agency te automatiseren.",
    "goals": "Netwerken, samenwerking, plezier",
    "contributions": "Ervaring, enthousiasme",
    "topicsContributed": [
      "Van oorsprong een Webdesigner, in sales gewerkt sinds 10 jaar eigenaar van een search marketing agency. Ik had...",
      "Ervaring, enthousiasme"
    ],
    "linkedin": "https://www.linkedin.com/in/jefvangool",
    "linkedinTagline": "Owner, Sherlock SEO Agency",
    "linkedinSummary": "Founded Sherlock SEO Agency in 2015 (Antwerp); digital growth/marketing consultant with multiple industry certifications."
  },
  {
    "name": "Bruno Van herendael",
    "role": "ZAS Healthcare",
    "email": "bruno.vanherendael@zas.be",
    "phone": "(048) 591 85 45",
    "company": "ZAS Healthcare",
    "website": "",
    "background": "Arts. Gespecialiseerd in infectieziekten en microbiologie. Ondertussen leidinggevend microbioloog in laboratorium van de ZAS ziekenhuizen. Door meerdere fusies zijn we  nu grootste ziekenhuislab van België met 300 werknemers. Nog weinig AI uptake in ons labo dus veel ruimte voor verbetering.",
    "goals": "Meenemen van ideeën die ik kan implementeren in mijn dagelijks werk. Links naar interessante tools en opleidingen die door anderen al getest zijn.",
    "contributions": "Waarschijnlijk voorlopig niet al te veel. Ben zelf vooralsnog niet al te beslagen in verschillende AI tools. Ik dacht me in de eerste plaats te verdiepen in CoPilot gezien mijn werkplek een Office 365 omgeving is en dit me op werkgebied de snelste stap voorwaarts lijkt. Dus als ik daar interessante use cases vind wil ik die ooit wel voorstellen.",
    "topicsContributed": [
      "Arts. Gespecialiseerd in infectieziekten en microbiologie. Ondertussen leidinggevend microbioloog in laborator...",
      "Waarschijnlijk voorlopig niet al te veel. Ben zelf vooralsnog niet al te beslagen in verschillende AI tools. I..."
    ]
  },
  {
    "name": "Peter Van keer",
    "role": "Peter Van Keer Consulting",
    "email": "info@petervankeer.com",
    "phone": "(049) 487 94 92",
    "company": "Peter Van Keer Consulting",
    "website": "",
    "background": "Ik ben Peter, oprichter van VNKR Studio in Antwerpen. Mijn achtergrond is technisch: ik ben begonnen in de PC-hardware wereld en ben zo'n acht jaar geleden overgestapt naar video en contentproductie. Vandaag werk ik met B2B-bedrijven in tech, finance, medische sector en juridische dienstverlening. Geen klassieke videoproductie, maar recurring content partnerships waarbij video écht een rol speelt in hoe een bedrijf zich positioneert en communiceert. AI gebruik ik dagelijks, zowel in mijn eigen workflows als in de systemen die ik bouw (voor mijn studio en voor klanten). Geen hype voor mij, wel een tool die ik probeer goed te begrijpen en slim in te zetten.",
    "goals": "Kennis en connecties",
    "contributions": "Ik heb een mooi kantoor en filmstudio te Antwerpen die ik met plezier openstel voor gatherings. Dat terzijde, ervaring in (content) en video marketing, video producties voor startups, scale-ups en corporates (niet de typische film background, maar digitale marketing).",
    "topicsContributed": [
      "Ik ben Peter, oprichter van VNKR Studio in Antwerpen. Mijn achtergrond is technisch: ik ben begonnen in de PC-...",
      "Ik heb een mooi kantoor en filmstudio te Antwerpen die ik met plezier openstel voor gatherings. Dat terzijde, ..."
    ],
    "linkedin": "https://www.linkedin.com/in/petervankeer",
    "linkedinTagline": "Strategic Creative Director | B2B Video Content Producer | Camera Presence Coach",
    "linkedinSummary": "Runs VNKR Studio in Antwerp, helping B2B brands turn expertise into video content (e-learning, podcasts, testimonials)."
  },
  {
    "name": "Maarten Kooiman",
    "role": "AI Innovator & Entrepreneur",
    "email": "mwp.kooiman@gmail.com",
    "phone": "(049) 605 90 72",
    "company": "AI Innovator & Entrepreneur",
    "website": "",
    "background": "Tech entrepreneur. Sharing economy, prop tech, health tech.  Did a lot of different things: some went right, some less so. Still don't understand when to push through and when to give up.  Implementing innovation is hard but exciting. Living between Ghent, Belgium, and Lisbon, Portugal.",
    "goals": "Learn, grow, and experiment together",
    "contributions": "Sharing lessons learned from experience and hopefully asking some useful questions",
    "topicsContributed": [
      "Tech entrepreneur. Sharing economy, prop tech, health tech.  Did a lot of different things: some went right, s...",
      "Sharing lessons learned from experience and hopefully asking some useful questions"
    ],
    "linkedin": "https://www.linkedin.com/in/maartenkooiman",
    "linkedinTagline": "Entrepreneur, Environmental laureate, and Innovation Partner",
    "linkedinSummary": "Ghent-based founder focused on building partnerships to co-create solutions for sustainability and innovation."
  },
  {
    "name": "Mark Lens",
    "role": "Lean Mean Business",
    "email": "mark@leanmeanbusiness.com",
    "phone": "(047) 595 03 35",
    "company": "Lean Mean Business",
    "website": "",
    "background": "Ik ben een social serial entrepreneur. Afgelopen jaren al mijn bedrijven verkocht. Enkel nog mede-eigenaar van Novation.be en heb ik me gericht met een klein team op korte termijn verhuur voor grote groepen in Belgie en Spanje. (oa https://hoogmolen.be). Beheer gebeurt volledig door dit kleine team, met AI en automation ben ik nu vooral bezig om de sites te optimaliseren. Mij hoofdactiviteit gaat naar de VZW die ik 8 jaar geleden heb opgericht Https://ovwb.be - Ondernemers Voor een Warm Belgie - Waarbij we ons richten op scholen met de kans op kansarmoede groter dan 50 % om deze kwetsbare kinderen te helpen, meer info vind je op de website, alsook onze impact reporten. Als iemand peterschap gedeeltelijk of volledig wilt nemen over een school en mee wil sponseren stuur me dan maar een berichtje",
    "goals": "Ik wil slimmer werken met AI, zodat ik minder tijd verlies aan repetitieve taken en meer ruimte heb voor werk dat echt waarde toevoegt. Ik wil mijn kennis verdiepen, betere keuzes kunnen maken tussen tools en AI praktisch inzetten in mijn werk en projecten. Ik wil ook ideeën kunnen uitwisselen met gelijkgestemden, zodat ik sneller leer, nieuwe toepassingen ontdek en mijn aanpak kan verbeteren. Uiteindelijk wil ik efficiënter werken, slimmer automatiseren en sterker worden in AI.",
    "contributions": "Ik denk dat ik zelf vooral kan bijdragen met praktische ervaring en vragen over het echte gebruik van AI in je werk en dagelijks leven. Ik test veel tools, probeer ze in concrete projecten te zetten en kijk wat er werkt en wat niet. Ik kan bijdragen door:   - Concrete voorbeelden te geven van hoe ik AI‑tools inzet (bijvoorbeeld automatisering, content, marketing).  - Achterliggende vragen en logica te verduidelijken, zodat anderen sneller kunnen leren en minder moeten proberen.  - Structuur en richting te geven aan vrij gesprek door steeds terug te koppelen naar praktische toepassingen en mogelijke stappen. Ik zie mezelf als iemand die helpt om de chaos van AI‑tools te vertalen naar bruikbare, simpele toepassingen die je daadwerkelijk kunt gebruiken.",
    "topicsContributed": [
      "Ik ben een social serial entrepreneur. Afgelopen jaren al mijn bedrijven verkocht. Enkel nog mede-eigenaar van...",
      "Ik denk dat ik zelf vooral kan bijdragen met praktische ervaring en vragen over het echte gebruik van AI in je..."
    ],
    "linkedin": "https://www.linkedin.com/in/marklens",
    "linkedinTagline": "Founder - Owner, Lean Mean Business",
    "linkedinSummary": "Over 30 years of experience in tech and software industries and process optimization; also involved with Hoogmolen estate for group stays."
  },
  {
    "name": "Georges Lieben",
    "role": "AI Innovator & Entrepreneur",
    "email": "georges.lieben@gmail.com",
    "phone": "",
    "company": "AI Innovator & Entrepreneur",
    "website": "",
    "background": "Productontwikkeling background, vrij snel beginnen te ondernemen : - Bagaar > IOT agency ( 50+ FTE / exited )  - Twikit > customisation for digital manufacturing - June > energy democratiseringsplatform - ...",
    "goals": "peers vinden in de speer.",
    "contributions": "ervaring ondernemerschap & tech",
    "topicsContributed": [
      "Productontwikkeling background, vrij snel beginnen te ondernemen : - Bagaar > IOT agency ( 50+ FTE / exited ) ...",
      "ervaring ondernemerschap & tech"
    ],
    "linkedin": "https://www.linkedin.com/in/georgeslieben",
    "linkedinTagline": "Generative AI & Energy. Innovator & entrepreneur.",
    "linkedinSummary": "Co-founder of Bagaar (45-person company); focused on generative AI, energy, tinkering, and bringing ideas to life, based in Antwerp & Porto."
  },
  {
    "name": "Staf Van Lierde",
    "role": "Cynexia",
    "email": "svl@cynexia.be",
    "phone": "(047) 272 88 00",
    "company": "Cynexia",
    "website": "",
    "background": "Programmeur van opleiding, heb nu een cursus bij Syntra: Local Large Language Model Specialist",
    "goals": "Technische kennis uitwisseling",
    "contributions": "Desnoods elk stukken verder dan gewoonlijk onderzoeken en delen",
    "topicsContributed": [
      "Programmeur van opleiding, heb nu een cursus bij Syntra: Local Large Language Model Specialist",
      "Desnoods elk stukken verder dan gewoonlijk onderzoeken en delen"
    ]
  },
  {
    "name": "Bert Marievoet",
    "role": "AI Innovator & Entrepreneur",
    "email": "bert.marievoet@gmail.com",
    "phone": "",
    "company": "AI Innovator & Entrepreneur",
    "website": "",
    "background": "Entrepreneur, writer, AI first thinker",
    "goals": "Leren en delen",
    "contributions": "Delen wat ik oppik op Twitter en uit eigen ervaring",
    "topicsContributed": [
      "Entrepreneur, writer, AI first thinker",
      "Delen wat ik oppik op Twitter en uit eigen ervaring"
    ],
    "linkedin": "https://www.linkedin.com/in/bertmvt",
    "linkedinTagline": "Writing \"Own The Demand\" (Lannoo, Winter 2026); Entre/intrapreneur",
    "linkedinSummary": "Managing founder at Beam, previously founded Native Nation (influencer/content marketing agency); was Country Lead at Twitter."
  },
  {
    "name": "Emile Nols",
    "role": "FocusFinder Consulting",
    "email": "emile@focusfinder.consulting",
    "phone": "(049) 926 94 35",
    "company": "FocusFinder Consulting",
    "website": "",
    "background": "10 jaar zelfstandig consultant. Ik heb een achtergrond van ongeveer 15 jaar in performance marketing en digitale implementaties (o.a. CRM- en salesstack-uitrol voor internationale klanten). De laatste jaren heb ik die focus verlegd naar AI-enablement: ik help Belgische organisaties met het effectief inzetten van AI in hun dagelijkse werking. Vandaag run ik FocusFinder Consulting vanuit Antwerpen, met klanten in oa vastgoedontwikkeling en duurzaamheidsadvies. Mijn werk gaat van AI-geletterdheidstrajecten voor teams tot het bouwen van werkende tools — datapijplijnen, analysemodellen, interne dashboards.",
    "goals": "Drie dingen: mijn eigen werkwijze laten uitdagen door mensen die het anders aanpakken, sneller zicht krijgen op wat er werkt bij anderen zonder het zelf eerst een maand te moeten uittesten, en een netwerk opbouwen waar ik concrete vragen kan stellen. Op termijn hoop ik ook op samenwerkingen — mijn projecten raken vaak aan domeinen waar ik zelf geen specialist in ben.",
    "contributions": "Ik geef trainingen, bouw en lever werkende AI-implementaties  — geen pilots die stilvallen. Ik kan concrete cases inbrengen: wat een klant effectief betaalt, waar adoptie vastloopt, hoe je een engagement structureert zodat er iets blijft draaien na oplevering. Daarnaast heb ik veel praktijkervaring met prompting, lokale modellen en automatisering, en ik deel dat graag inclusief de mislukkingen. Ook de commerciële kant — hoe je AI-werk verkoopt en prijst — is iets waar ik over kan meepraten.",
    "topicsContributed": [
      "10 jaar zelfstandig consultant. Ik heb een achtergrond van ongeveer 15 jaar in performance marketing en digita...",
      "Ik geef trainingen, bouw en lever werkende AI-implementaties  — geen pilots die stilvallen. Ik kan concrete ca..."
    ],
    "linkedin": "https://www.linkedin.com/in/emilenols",
    "linkedinTagline": "EU AI Act compliance consulting",
    "linkedinSummary": "Helps European real estate and professional-services firms adopt AI; makes teams AI-fluent while keeping usage compliant with the EU AI Act."
  },
  {
    "name": "Toon Proost",
    "role": "Noma Law (Legal AI)",
    "email": "toon.proost@noma.law",
    "phone": "(049) 699 33 08",
    "company": "Noma Law (Legal AI)",
    "website": "",
    "background": "Advocaat: van stagiair tot vennoot in een traject van 18 jaar bij hetzelfde kantoor.",
    "goals": "Een administratiefrechtelijke vereenvoudiging van de dossierbehandeling, waardoor er tijd vrijkomt om echt inhoudelijk juridisch werk te verrichten in plaats van administratieve taken. Momenteel is de verhouding administraite/werk: 75/25. Dit is niet houdbaar.",
    "contributions": "nihil, buiten een luisterend oor en kritische blik.",
    "topicsContributed": [
      "Advocaat: van stagiair tot vennoot in een traject van 18 jaar bij hetzelfde kantoor.",
      "nihil, buiten een luisterend oor en kritische blik."
    ],
    "linkedin": "https://www.linkedin.com/in/toon-proost-94b62816",
    "linkedinTagline": "Advocaat - Curator bij Noma.law",
    "linkedinSummary": "Attorney and bankruptcy trustee, partner at NOMA law firm; guides entrepreneurs from start-up through estate planning."
  },
  {
    "name": "Laura Schillemans",
    "role": "Simply (AI & Marketing)",
    "email": "laura.schillemans@gmail.com",
    "phone": "(047) 495 82 28",
    "company": "Simply (AI & Marketing)",
    "website": "",
    "background": "Ik heb een achtergrond in marketing en productontwikkeling. Momenteel werk ik bij Simply in Tel Aviv, waar ik me bezighoud met het verkennen en ontwikkelen van AI-toepassingen binnen onze producten en marketing.",
    "goals": "Om concrete ervaringen, successen en uitdagingen delen. Het lijkt me waardevol om nieuwe AI-tools en use cases te ontdekken, feedback te kunnen geven of ontvangen en te leren van mensen met verschillende achtergronden. Voor mij hoeft het niet alleen over het bouwen van AI-producten te gaan, maar ook over hoe AI op een slimme manier kan worden toegepast in werk en dagelijkse processen.",
    "contributions": "Ik kan vooral bijdragen vanuit het perspectief van praktische AI-toepassingen binnen producten en marketing. Ik ben dagelijks bezig met het verkennen van hoe AI kan helpen om ideeën sneller tot leven te brengen, processen te verbeteren en nieuwe waarde te creëren. Daarnaast deel ik graag ervaringen uit mijn eigen experimenten en leer ik graag van de inzichten en ervaringen van anderen.",
    "topicsContributed": [
      "Ik heb een achtergrond in marketing en productontwikkeling. Momenteel werk ik bij Simply in Tel Aviv, waar ik ...",
      "Ik kan vooral bijdragen vanuit het perspectief van praktische AI-toepassingen binnen producten en marketing. I..."
    ],
    "linkedin": "https://www.linkedin.com/in/lauraschillemans",
    "linkedinTagline": "Senior Marketing Lead at Simply",
    "linkedinSummary": "Marketing leader with growth, product, and brand experience across high-tech, mobility, education, and government sectors."
  },
  {
    "name": "Diego Vanhee",
    "role": "One To Win",
    "email": "dvanhee@onetowin.be",
    "phone": "(047) 761 92 56",
    "company": "One To Win",
    "website": "",
    "background": "Handelsingenieur (marketing / beleidsinformatica) van achtergrond, carrière in consulting (C&L / PwC), eigen consultancy & detacheringsbedrijf gedurende > 25 jaar (& counting), nu vooral m'n focus op ons telemonitoring bedrijf wat een data platform heeft dat alle gezondheidsspelers inclusief patiënten en gebruikers met elkaar verbindt. AI is zowel relevant binnen de consulting/detacheringsbusiness als binnen ons health tech bedrijf en de omgeving waarbinnen we opereren. Daar heb ik voorlopig beperkte ervaring, m'n grootste AI ervaring tot nu toe situeert zich in mijn dagelijkse manier van werken (meeting transcripties, Notion AI, chatGPT, Claude, Perplexity, NotebookLM, SuperWhisper, Cursor, ... ).",
    "goals": "Waar mogelijk en relevant (!) zo hoog mogelijk mee te blijven op de AI wave.",
    "contributions": "Mijn ervaringen met de integratie van AI binnen de omgevingen waarbinnen ik actief met duidelijke feedback over wat wél en niet werkt.",
    "topicsContributed": [
      "Handelsingenieur (marketing / beleidsinformatica) van achtergrond, carrière in consulting (C&L / PwC), eigen c...",
      "Mijn ervaringen met de integratie van AI binnen de omgevingen waarbinnen ik actief met duidelijke feedback ove..."
    ],
    "linkedin": "https://www.linkedin.com/in/diego-vanhee-a5036b",
    "linkedinTagline": "Not confirmed",
    "linkedinSummary": "Ghent-based; previous role noted at Onetown data services and later Project Manager at Televitas (unconfirmed match - verify)."
  },
  {
    "name": "Bert Verstappen",
    "role": "Maar Digital",
    "email": "hi@maar.digital",
    "phone": "",
    "company": "Maar Digital",
    "website": "",
    "background": "Self-employed AI powered product owner/manager/builder. Jef, mezelf en anderen in de groep gaan reeds een lange weg terug (digital agency -> corporate innovation -> digital products -> ??)",
    "goals": "/claude answer",
    "contributions": "/claude answer",
    "topicsContributed": [
      "Self-employed AI powered product owner/manager/builder. Jef, mezelf en anderen in de groep gaan reeds een lang...",
      "/claude answer"
    ],
    "linkedin": "https://www.linkedin.com/in/bertollies",
    "linkedinTagline": "Digital Creative & Product Leader diving into AI, Web3, and emerging tech",
    "linkedinSummary": "Co-founded AMAI, leading digital design and delivery for SMEs, corporates, and top brands over 7 years."
  },
  {
    "name": "Wim Wouters",
    "role": "Wim Wouters Design",
    "email": "hello@wimwouters.com",
    "phone": "(047) 967 89 96",
    "company": "Wim Wouters Design",
    "website": "",
    "background": "Old-school Creative Technologist, sinds 1999 gepassioneerd door game-tech; de wieg van vele relevante tech ontwikkelingen (from the first soundcard to the processors building/running AI and all the software mechanics). Love prototyping & positive world impact. Sci-fi thinking. Change through experience-design. Failed Hard. Pioneer. Hype sceptic. VR/XR. Digital Twins. Conversational AI Avatars. Emotion in living digital entities. Work hard/Play hard. Gen X.",
    "goals": "Onderhouden van toekomst gericht denken en maken...",
    "contributions": "Link tussen game-tech",
    "topicsContributed": [
      "Old-school Creative Technologist, sinds 1999 gepassioneerd door game-tech; de wieg van vele relevante tech ont...",
      "Link tussen game-tech"
    ],
    "linkedin": "https://www.linkedin.com/in/wimwouters",
    "linkedinTagline": "CTO at EnergyVision",
    "linkedinSummary": "Three decades in software development; currently CTO at EnergyVision (Antwerp) (unconfirmed match - verify)."
  }
]
};
