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
    "name": "Emile Nols",
    "role": "FocusFinder Consulting",
    "email": "emile@focusfinder.consulting",
    "phone": "(049) 926 94 35",
    "company": "FocusFinder Consulting",
    "website": "",
    "background": "'1'0' 'j'a'a'r' 'z'e'l'f's't'a'n'd'i'g' 'c'o'n's'u'l't'a'n't'.' 'I'k' 'h'e'b' 'e'e'n' 'a'c'h't'e'r'g'r'o'n'd' 'v'a'n' 'o'n'g'e'v'e'e'r' '1'5' 'j'a'a'r' 'i'n' 'p'e'r'f'o'r'm'a'n'c'e' 'm'a'r'k'e't'i'n'g' 'e'n' 'd'i'g'i't'a'l'e' 'i'm'p'l'e'm'e'n't'a't'i'e's' '('o'.'a'.' 'C'R'M'-' 'e'n' 's'a'l'e's's't'a'c'k'-'u'i't'r'o'l' 'v'o'o'r' 'i'n't'e'r'n'a't'i'o'n'a'l'e' 'k'l'a'n't'e'n')'.' 'D'e' 'l'a'a't's't'e' 'j'a'r'e'n' 'h'e'b' 'i'k' 'd'i'e' 'f'o'c'u's' 'v'e'r'l'e'g'd' 'n'a'a'r' 'A'I'-'e'n'a'b'l'e'm'e'n't':' 'i'k' 'h'e'l'p' 'B'e'l'g'i's'c'h'e' 'o'r'g'a'n'i's'a't'i'e's' 'm'e't' 'h'e't' 'e'f'f'e'c't'i'e'f' 'i'n'z'e't't'e'n' 'v'a'n' 'A'I' 'i'n' 'h'u'n' 'd'a'g'e'l'i'j'k's'e' 'w'e'r'k'i'n'g'.' 'V'a'n'd'a'a'g' 'r'u'n' 'i'k' 'F'o'c'u's'F'i'n'd'e'r' 'C'o'n's'u'l't'i'n'g' 'v'a'n'u'i't' 'A'n't'w'e'r'p'e'n',' 'm'e't' 'k'l'a'n't'e'n' 'i'n' 'o'a' 'v'a's't'g'o'e'd'o'n't'w'i'k'k'e'l'i'n'g' 'e'n' 'd'u'u'r'z'a'a'm'h'e'i'd's'a'd'v'i'e's'.' 'M'i'j'n' 'w'e'r'k' 'g'a'a't' 'v'a'n' 'A'I'-'g'e'l'e't't'e'r'd'h'e'i'd's't'r'a'j'e'c't'e'n' 'v'o'o'r' 't'e'a'm's' 't'o't' 'h'e't' 'b'o'u'w'e'n' 'v'a'n' 'w'e'r'k'e'n'd'e' 't'o'o'l's' '—' 'd'a't'a'p'i'j'p'l'i'j'n'e'n',' 'a'n'a'l'y's'e'm'o'd'e'l'l'e'n',' 'i'n't'e'r'n'e' 'd'a's'h'b'o'a'r'd's'.'",
    "goals": "Drie dingen: mijn eigen werkwijze laten uitdagen door mensen die het anders aanpakken, sneller zicht krijgen op wat er werkt bij anderen zonder het zelf eerst een maand te moeten uittesten, en een netwerk opbouwen waar ik concrete vragen kan stellen. Op termijn hoop ik ook op samenwerkingen — mijn projecten raken vaak aan domeinen waar ik zelf geen specialist in ben.",
    "contributions": "'I'k' 'g'e'e'f' 't'r'a'i'n'i'n'g'e'n',' 'b'o'u'w' 'e'n' 'l'e'v'e'r' 'w'e'r'k'e'n'd'e' 'A'I'-'i'm'p'l'e'm'e'n't'a't'i'e's' ' '—' 'g'e'e'n' 'p'i'l'o't's' 'd'i'e' 's't'i'l'v'a'l'l'e'n'.' 'I'k' 'k'a'n' 'c'o'n'c'r'e't'e' 'c'a's'e's' 'i'n'b'r'e'n'g'e'n':' 'w'a't' 'e'e'n' 'k'l'a'n't' 'e'f'f'e'c't'i'e'f' 'b'e't'a'a'l't',' 'w'a'a'r' 'a'd'o'p't'i'e' 'v'a's't'l'o'o'p't',' 'h'o'e' 'j'e' 'e'e'n' 'e'n'g'a'g'e'm'e'n't' 's't'r'u'c't'u'r'e'e'r't' 'z'o'd'a't' 'e'r' 'i'e't's' 'b'l'i'j'f't' 'd'r'a'a'i'e'n' 'n'a' 'o'p'l'e'v'e'r'i'n'g'.' 'D'a'a'r'n'a'a's't' 'h'e'b' 'i'k' 'v'e'e'l' 'p'r'a'k't'i'j'k'e'r'v'a'r'i'n'g' 'm'e't' 'p'r'o'm'p't'i'n'g',' 'l'o'k'a'l'e' 'm'o'd'e'l'l'e'n' 'e'n' 'a'u't'o'm'a't'i's'e'r'i'n'g',' 'e'n' 'i'k' 'd'e'e'l' 'd'a't' 'g'r'a'a'g' 'i'n'c'l'u's'i'e'f' 'd'e' 'm'i's'l'u'k'k'i'n'g'e'n'.' 'O'o'k' 'd'e' 'c'o'm'm'e'r'c'i'ë'l'e' 'k'a'n't' '—' 'h'o'e' 'j'e' 'A'I'-'w'e'r'k' 'v'e'r'k'o'o'p't' 'e'n' 'p'r'i'j's't' '—' 'i's' 'i'e't's' 'w'a'a'r' 'i'k' 'o'v'e'r' 'k'a'n' 'm'e'e'p'r'a't'e'n'.'",
    "topicsContributed": [
      "'1'0' 'j'a'a'r' 'z'e'l'f's't'a'n'd'i'g' 'c'o'n's'u'l't'a'n't'.' 'I'k' 'h'e'b' 'e'e'n' 'a'c'h't'e'r'g'r'o'n'd' ...",
      "'I'k' 'g'e'e'f' 't'r'a'i'n'i'n'g'e'n',' 'b'o'u'w' 'e'n' 'l'e'v'e'r' 'w'e'r'k'e'n'd'e' 'A'I'-'i'm'p'l'e'm'e'n't..."
    ]
  },
  {
    "name": "Klaas Bellemans",
    "role": "Jack BV (Webapps & Eng)",
    "email": "klaas@jack-bv.be",
    "phone": "(047) 770 84 14",
    "company": "Jack BV (Webapps & Eng)",
    "website": "",
    "background": "'O'p'l'e'i'd'i'n'g' 'i'n'g'e'n'i'e'u'r' '='>' 'z'e'l'f's't'a'n'd'i'g'e' 'w'e'b's'i't'e' 'e'n' 'w'e'b'a'p'p' 'b'o'u'w'e'r',' 'v'a'n'u'i't' 'p'r'o'b'l'e'e'm'o'p'l'o's's'e'n'd'e' 'i'n's't'e'e'k' '='>' 'p'r'o'j'e'c't'l'e'i'd'e'r' 'g'r'o'n'd'w'e'r'k'e'n' 'i'n' 'i'n'd'u's't'r'i'e'b'o'u'w' '='>' 'o'p'e'r'a't'i'o'n'e'e'l' 'v'e'r'a'n't'w'o'o'r'd'e'l'i'j'k'e' 'b'i'j' 'g'e'v'e'l'w'e'r'k'e'n' 'f'i'r'm'a'.'",
    "goals": "Efficiëntie",
    "contributions": "'G'e'e'f' 'm'e' 'e'e'n' 'v'o'o'r'z'e't',' 'e'n' 'i'k'.'.'.'",
    "topicsContributed": [
      "'O'p'l'e'i'd'i'n'g' 'i'n'g'e'n'i'e'u'r' '='>' 'z'e'l'f's't'a'n'd'i'g'e' 'w'e'b's'i't'e' 'e'n' 'w'e'b'a'p'p' 'b...",
      "'G'e'e'f' 'm'e' 'e'e'n' 'v'o'o'r'z'e't',' 'e'n' 'i'k'.'.'.'"
    ]
  },
  {
    "name": "Maarten Kooiman",
    "role": "AI Innovator & Entrepreneur",
    "email": "mwp.kooiman@gmail.com",
    "phone": "(049) 605 90 72",
    "company": "AI Innovator & Entrepreneur",
    "website": "",
    "background": "'T'e'c'h' 'e'n't'r'e'p'r'e'n'e'u'r'.' 'S'h'a'r'i'n'g' 'e'c'o'n'o'm'y',' 'p'r'o'p' 't'e'c'h',' 'h'e'a'l't'h' 't'e'c'h'.' ' 'D'i'd' 'a' 'l'o't' 'o'f' 'd'i'f'f'e'r'e'n't' 't'h'i'n'g's':' 's'o'm'e' 'w'e'n't' 'r'i'g'h't',' 's'o'm'e' 'l'e's's' 's'o'.' 'S't'i'l'l' 'd'o'n'''t' 'u'n'd'e'r's't'a'n'd' 'w'h'e'n' 't'o' 'p'u's'h' 't'h'r'o'u'g'h' 'a'n'd' 'w'h'e'n' 't'o' 'g'i'v'e' 'u'p'.' ' 'I'm'p'l'e'm'e'n't'i'n'g' 'i'n'n'o'v'a't'i'o'n' 'i's' 'h'a'r'd' 'b'u't' 'e'x'c'i't'i'n'g'.' 'L'i'v'i'n'g' 'b'e't'w'e'e'n' 'G'h'e'n't',' 'B'e'l'g'i'u'm',' 'a'n'd' 'L'i's'b'o'n',' 'P'o'r't'u'g'a'l'.'",
    "goals": "Learn, grow, and experiment together",
    "contributions": "'S'h'a'r'i'n'g' 'l'e's's'o'n's' 'l'e'a'r'n'e'd' 'f'r'o'm' 'e'x'p'e'r'i'e'n'c'e' 'a'n'd' 'h'o'p'e'f'u'l'l'y' 'a's'k'i'n'g' 's'o'm'e' 'u's'e'f'u'l' 'q'u'e's't'i'o'n's'",
    "topicsContributed": [
      "'T'e'c'h' 'e'n't'r'e'p'r'e'n'e'u'r'.' 'S'h'a'r'i'n'g' 'e'c'o'n'o'm'y',' 'p'r'o'p' 't'e'c'h',' 'h'e'a'l't'h' 't...",
      "'S'h'a'r'i'n'g' 'l'e's's'o'n's' 'l'e'a'r'n'e'd' 'f'r'o'm' 'e'x'p'e'r'i'e'n'c'e' 'a'n'd' 'h'o'p'e'f'u'l'l'y' 'a..."
    ]
  },
  {
    "name": "Laura Schillemans",
    "role": "Simply (AI & Marketing)",
    "email": "laura.schillemans@gmail.com",
    "phone": "(047) 495 82 28",
    "company": "Simply (AI & Marketing)",
    "website": "",
    "background": "'I'k' 'h'e'b' 'e'e'n' 'a'c'h't'e'r'g'r'o'n'd' 'i'n' 'm'a'r'k'e't'i'n'g' 'e'n' 'p'r'o'd'u'c't'o'n't'w'i'k'k'e'l'i'n'g'.' 'M'o'm'e'n't'e'e'l' 'w'e'r'k' 'i'k' 'b'i'j' 'S'i'm'p'l'y' 'i'n' 'T'e'l' 'A'v'i'v',' 'w'a'a'r' 'i'k' 'm'e' 'b'e'z'i'g'h'o'u'd' 'm'e't' 'h'e't' 'v'e'r'k'e'n'n'e'n' 'e'n' 'o'n't'w'i'k'k'e'l'e'n' 'v'a'n' 'A'I'-'t'o'e'p'a's's'i'n'g'e'n' 'b'i'n'n'e'n' 'o'n'z'e' 'p'r'o'd'u'c't'e'n' 'e'n' 'm'a'r'k'e't'i'n'g'.'",
    "goals": "Om concrete ervaringen, successen en uitdagingen delen. Het lijkt me waardevol om nieuwe AI-tools en use cases te ontdekken, feedback te kunnen geven of ontvangen en te leren van mensen met verschillende achtergronden. Voor mij hoeft het niet alleen over het bouwen van AI-producten te gaan, maar ook over hoe AI op een slimme manier kan worden toegepast in werk en dagelijkse processen.",
    "contributions": "'I'k' 'k'a'n' 'v'o'o'r'a'l' 'b'i'j'd'r'a'g'e'n' 'v'a'n'u'i't' 'h'e't' 'p'e'r's'p'e'c't'i'e'f' 'v'a'n' 'p'r'a'k't'i's'c'h'e' 'A'I'-'t'o'e'p'a's's'i'n'g'e'n' 'b'i'n'n'e'n' 'p'r'o'd'u'c't'e'n' 'e'n' 'm'a'r'k'e't'i'n'g'.' 'I'k' 'b'e'n' 'd'a'g'e'l'i'j'k's' 'b'e'z'i'g' 'm'e't' 'h'e't' 'v'e'r'k'e'n'n'e'n' 'v'a'n' 'h'o'e' 'A'I' 'k'a'n' 'h'e'l'p'e'n' 'o'm' 'i'd'e'e'ë'n' 's'n'e'l'l'e'r' 't'o't' 'l'e'v'e'n' 't'e' 'b'r'e'n'g'e'n',' 'p'r'o'c'e's's'e'n' 't'e' 'v'e'r'b'e't'e'r'e'n' 'e'n' 'n'i'e'u'w'e' 'w'a'a'r'd'e' 't'e' 'c'r'e'ë'r'e'n'.' 'D'a'a'r'n'a'a's't' 'd'e'e'l' 'i'k' 'g'r'a'a'g' 'e'r'v'a'r'i'n'g'e'n' 'u'i't' 'm'i'j'n' 'e'i'g'e'n' 'e'x'p'e'r'i'm'e'n't'e'n' 'e'n' 'l'e'e'r' 'i'k' 'g'r'a'a'g' 'v'a'n' 'd'e' 'i'n'z'i'c'h't'e'n' 'e'n' 'e'r'v'a'r'i'n'g'e'n' 'v'a'n' 'a'n'd'e'r'e'n'.'",
    "topicsContributed": [
      "'I'k' 'h'e'b' 'e'e'n' 'a'c'h't'e'r'g'r'o'n'd' 'i'n' 'm'a'r'k'e't'i'n'g' 'e'n' 'p'r'o'd'u'c't'o'n't'w'i'k'k'e'l...",
      "'I'k' 'k'a'n' 'v'o'o'r'a'l' 'b'i'j'd'r'a'g'e'n' 'v'a'n'u'i't' 'h'e't' 'p'e'r's'p'e'c't'i'e'f' 'v'a'n' 'p'r'a'k..."
    ]
  },
  {
    "name": "Jef Van Gool",
    "role": "Sherlock SEO & Snowskiproperty",
    "email": "jef@sherlockseo.com",
    "phone": "(003) 247 92 54",
    "company": "Sherlock SEO & Snowskiproperty",
    "website": "",
    "background": "'V'a'n' 'o'o'r's'p'r'o'n'g' 'e'e'n' 'W'e'b'd'e's'i'g'n'e'r',' 'i'n' 's'a'l'e's' 'g'e'w'e'r'k't' 's'i'n'd's' '1'0' 'j'a'a'r' 'e'i'g'e'n'a'a'r' 'v'a'n' 'e'e'n' 's'e'a'r'c'h' 'm'a'r'k'e't'i'n'g' 'a'g'e'n'c'y'.' 'I'k' 'h'a'd' 'o'o'i't' 'o'o'k' 'e'e'n' 'c'o'd'i'n'g' 'A'c'a'd'e'm'y'.' 'I'k' 'h'e'b' 'r'e'c'e'n't'e'l'i'j'k' 'e'e'n' 's'o'f't'w'a'r'e'p'l'a't'f'o'r'm' 'g'e'b'o'u'w'd' 'v'o'o'r' 'm'i'j'n' 'm'a'r'k'e't'i'n'g' 'a'g'e'n'c'y' 't'e' 'a'u't'o'm'a't'i's'e'r'e'n'.'",
    "goals": "Netwerken, samenwerking, plezier",
    "contributions": "'E'r'v'a'r'i'n'g',' 'e'n't'h'o'u's'i'a's'm'e'",
    "topicsContributed": [
      "'V'a'n' 'o'o'r's'p'r'o'n'g' 'e'e'n' 'W'e'b'd'e's'i'g'n'e'r',' 'i'n' 's'a'l'e's' 'g'e'w'e'r'k't' 's'i'n'd's' '1...",
      "'E'r'v'a'r'i'n'g',' 'e'n't'h'o'u's'i'a's'm'e'"
    ]
  },
  {
    "name": "Caluwaerts Tom",
    "role": "Telenet",
    "email": "tom.caluwaerts@telenet.be",
    "phone": "(049) 032 65 90",
    "company": "Telenet",
    "website": "",
    "background": "'W'a's' 'a'p'p'l'i'c'a't'i'e's'p'e'c'i'a'l'i's't' 'b'i'j' 'S'y's'm'e'x',' 'w'e'r'e'l'd'w'i'j'd' 'm'a'r'k't'l'e'i'd'e'r' 'i'n' 'h'e't' 'b'e'p'a'l'e'n' 'v'a'n' 'h'e't' 'b'l'o'e'd'b'e'e'l'd'.' 'V'a'n'd'a'a'g' 'o'n'd'e'r'n'e'm'e'r' 'm'e't' 'm'e'e'r'd'e'r'e' 'v'e'n'n'o'o't's'c'h'a'p'p'e'n',' 'g'e's'p'e'c'i'a'l'i's'e'e'r'd' 'i'n' 'l'o'k'a'l'e' 'L'L'M'''s' 'e'n' 'G'D'P'R'-'c'o'n'f'o'r'm'e' 'A'I'-'i'm'p'l'e'm'e'n't'a't'i'e'.' 'I'k' 'f'o'c'u's' 'm'e' 'o'p' 'e'e'n' 'e'c'o's'y's't'e'e'm' 'v'o'o'r' 'g'e'a'u't'o'm'a't'i's'e'e'r'd'e' 'l'e'a'd'g'e'n'e'r'a't'i'e',' 'n'i'e'u'w's'b'r'i'e'v'e'n' 'e'n' 'o'p' 't'e'r'm'i'j'n' 'e'e'n' 'h'y'b'r'i'd'e' 'l'e'e'r'p'l'a't'f'o'r'm' 'o'v'e'r' 'A'I'.' 'S'p'e'c'i'f'i'e'k'e' 'i'n't'e'r'e's's'e' 'd'a'a'r'b'i'j':' 'l'e'g'a'l' 't'e'c'h' '—' 'i'k' 'd'e'e'd' 'd'i'e'p'g'a'a'n'd' 'o'n'd'e'r'z'o'e'k' 'n'a'a'r' 'g'e'a'u't'o'm'a't'i's'e'e'r'd'e' 'j'u'r'i'd'i's'c'h'e' 'd'o'c'u'm'e'n't'g'e'n'e'r'a't'i'e' 'e'n' 'c'o'm'p'l'i'a'n'c'e'-'w'o'r'k'f'l'o'w's' 'v'o'o'r' 'd'e' 'B'e'l'g'i's'c'h'e' 'e'n' 'N'e'd'e'r'l'a'n'd's'e' 'm'a'r'k't',' 'e'n' 'v'e'r'k'e'n' 'm'o'm'e'n't'e'e'l' 'e'e'n' 'e'e'r's't'e' 'c'o'n'c'r'e't'e' 't'o'e'p'a's's'i'n'g'.'",
    "goals": "Concreet: mijn eigen architectuur toetsen aan die van anderen, en sneller leren welke tools in de praktijk standhouden. Ik start momenteel met het bouwen van AI-automatiseringen voor KMO's en wil mijn beeld van wat de Vlaamse markt écht nodig heeft scherper krijgen. Op termijn sta ik open voor samenwerkingen die verder gaan dan louter kennisdeling.",
    "contributions": "'P'r'a'k't'i'j'k'e'r'v'a'r'i'n'g' 'm'e't' 'g'e'a'v'a'n'c'e'e'r'd'e' 'a'r'c'h'i't'e'c't'u'r'e'n'.' 'C'o'n'c'r'e'e't':' ' 'E'e'n' 'z'e'l'f'l'e'r'e'n'd' 'a'g'e'n't'-'s'y's't'e'e'm' 'i'n' 'o'p'b'o'u'w':' 'C'l'a'u'd'e' 'C'o'd'e' 'a'l's' 'o'r'c'h'e's't'r'a't'o'r' 'm'e't' 'a'p'a'r't'e' 'b'u'i'l'd'e'r'-' 'e'n' 'r'e'v'i'e'w'e'r'-'i'n's't'a'n't'i'e's',' 'e'n' 'm'e'n's'e'l'i'j'k'e' 'g'o'e'd'k'e'u'r'i'n'g' 'v'i'a' 'e'e'n' 'T'e'l'e'g'r'a'm'-'a'p'p'r'o'v'e' 'g'a't'e'.' 'n'8'n'-'w'o'r'k'f'l'o'w's',' 'i'n'g'e'r'i'c'h't' 'a'l's' 'M'C'P'-'s'e'r'v'e'r'.' 'L'o'k'a'l'e' 'L'L'M'-'o'p's't'e'l'l'i'n'g'e'n' '('Q'w'e'n'3'.'5',' 'Q'd'r'a'n't' 'v'o'o'r' 'R'A'G',' '1'0'0'%' 'G'D'P'R'-'c'o'n'f'o'r'm' 'o'n'-'p'r'e'm'i's'e')'.' 'E'e'n' 'A'I'-'c'o'n't'e'n't'p'i'j'p'l'i'j'n' 'i'n' 'o'p'b'o'u'w' '('c'u'r'a't'i'e' '→' 'd'r'a'f't' '→' 'a'p'p'r'o'v'e' '→' 'v'e'r'z'e'n'd'i'n'g';' 's't'e'm'-' 'e'n' 'v'i'd'e'o'k'l'o'n'i'n'g' 'v'i'a' 'E'l'e'v'e'n'L'a'b's' 'e'n' 'H'e'y'G'e'n' 'g'e'p'l'a'n'd' 'v'o'o'r' 'd'e' 'v'o'l'g'e'n'd'e' 'f'a's'e')'.' ' 'I'k' 'b'e'n' 'b'r'e'e'd' 'i'n'z'e't'b'a'a'r' 'a'l's' 'A'I' 'G'e'n'e'r'a'l'i's't' '—' 'v'a'n' 'a'p'p'-'b'u'i'l'd'e'r's' 'e'n' 's'c'r'a'p'i'n'g' 't'o't' 'v'i'd'e'o'-' 'e'n' 'a'u'd'i'o'g'e'n'e'r'a't'i'e' '—' 'd'u's' 'i'k' 'k'a'n' 'b'i'j' 'd'e' 'm'e'e's't'e' 'o'n'd'e'r'w'e'r'p'e'n' 'p'r'a'k't'i's'c'h' 'm'e'e'd'e'n'k'e'n'.'",
    "topicsContributed": [
      "'W'a's' 'a'p'p'l'i'c'a't'i'e's'p'e'c'i'a'l'i's't' 'b'i'j' 'S'y's'm'e'x',' 'w'e'r'e'l'd'w'i'j'd' 'm'a'r'k't'l'e...",
      "'P'r'a'k't'i'j'k'e'r'v'a'r'i'n'g' 'm'e't' 'g'e'a'v'a'n'c'e'e'r'd'e' 'a'r'c'h'i't'e'c't'u'r'e'n'.' 'C'o'n'c'r'e..."
    ]
  },
  {
    "name": "Wim Wouters",
    "role": "Wim Wouters Design",
    "email": "hello@wimwouters.com",
    "phone": "(047) 967 89 96",
    "company": "Wim Wouters Design",
    "website": "",
    "background": "'O'l'd'-'s'c'h'o'o'l' 'C'r'e'a't'i'v'e' 'T'e'c'h'n'o'l'o'g'i's't',' 's'i'n'd's' '1'9'9'9' 'g'e'p'a's's'i'o'n'e'e'r'd' 'd'o'o'r' 'g'a'm'e'-'t'e'c'h';' 'd'e' 'w'i'e'g' 'v'a'n' 'v'e'l'e' 'r'e'l'e'v'a'n't'e' 't'e'c'h' 'o'n't'w'i'k'k'e'l'i'n'g'e'n' '('f'r'o'm' 't'h'e' 'f'i'r's't' 's'o'u'n'd'c'a'r'd' 't'o' 't'h'e' 'p'r'o'c'e's's'o'r's' 'b'u'i'l'd'i'n'g'/'r'u'n'n'i'n'g' 'A'I' 'a'n'd' 'a'l'l' 't'h'e' 's'o'f't'w'a'r'e' 'm'e'c'h'a'n'i'c's')'.' 'L'o'v'e' 'p'r'o't'o't'y'p'i'n'g' '&' 'p'o's'i't'i'v'e' 'w'o'r'l'd' 'i'm'p'a'c't'.' 'S'c'i'-'f'i' 't'h'i'n'k'i'n'g'.' 'C'h'a'n'g'e' 't'h'r'o'u'g'h' 'e'x'p'e'r'i'e'n'c'e'-'d'e's'i'g'n'.' 'F'a'i'l'e'd' 'H'a'r'd'.' 'P'i'o'n'e'e'r'.' 'H'y'p'e' 's'c'e'p't'i'c'.' 'V'R'/'X'R'.' 'D'i'g'i't'a'l' 'T'w'i'n's'.' 'C'o'n'v'e'r's'a't'i'o'n'a'l' 'A'I' 'A'v'a't'a'r's'.' 'E'm'o't'i'o'n' 'i'n' 'l'i'v'i'n'g' 'd'i'g'i't'a'l' 'e'n't'i't'i'e's'.' 'W'o'r'k' 'h'a'r'd'/'P'l'a'y' 'h'a'r'd'.' 'G'e'n' 'X'.'",
    "goals": "Onderhouden van toekomst gericht denken en maken...",
    "contributions": "'L'i'n'k' 't'u's's'e'n' 'g'a'm'e'-'t'e'c'h'",
    "topicsContributed": [
      "'O'l'd'-'s'c'h'o'o'l' 'C'r'e'a't'i'v'e' 'T'e'c'h'n'o'l'o'g'i's't',' 's'i'n'd's' '1'9'9'9' 'g'e'p'a's's'i'o'n'e...",
      "'L'i'n'k' 't'u's's'e'n' 'g'a'm'e'-'t'e'c'h'"
    ]
  },
  {
    "name": "Bert Marievoet",
    "role": "AI Innovator & Entrepreneur",
    "email": "bert.marievoet@gmail.com",
    "phone": "",
    "company": "AI Innovator & Entrepreneur",
    "website": "",
    "background": "'E'n't'r'e'p'r'e'n'e'u'r',' 'w'r'i't'e'r',' 'A'I' 'f'i'r's't' 't'h'i'n'k'e'r'",
    "goals": "Leren en delen",
    "contributions": "'D'e'l'e'n' 'w'a't' 'i'k' 'o'p'p'i'k' 'o'p' 'T'w'i't't'e'r' 'e'n' 'u'i't' 'e'i'g'e'n' 'e'r'v'a'r'i'n'g'",
    "topicsContributed": [
      "'E'n't'r'e'p'r'e'n'e'u'r',' 'w'r'i't'e'r',' 'A'I' 'f'i'r's't' 't'h'i'n'k'e'r'",
      "'D'e'l'e'n' 'w'a't' 'i'k' 'o'p'p'i'k' 'o'p' 'T'w'i't't'e'r' 'e'n' 'u'i't' 'e'i'g'e'n' 'e'r'v'a'r'i'n'g'"
    ]
  },
  {
    "name": "Filip Ceulebroeck",
    "role": "Altervisions",
    "email": "altervisions@gmail.com",
    "phone": "(324) 862 13 74",
    "company": "Altervisions",
    "website": "",
    "background": "'N'u' 'q'u'a'n't'i't'a't'i'v'e' 'f'i'n'a'n'c'e' 'p'r'o'p' 'f'i'r'm' ' 'A'I' 'e'n' 's'y's't'e'e'm'd'e'n'k'e'n'.' 'I'n' 'e'e'n' 'v'o'r'i'g' 'p'r'o'f'e's's'i'o'n'e'e'l' 'h'o'o'f'd's't'u'k' 'w'a's' 'i'k' 's't'e'r'k' 'b'e'z'i'g' 'm'e't' 'm'o'd'u'l'a'i'r'e' 's'y's't'e'm'e'n' '('s'm'a'l'l'e's't' 'c'o'm'm'o'n' 'd'e'n'o'm'i'n'a't'o'r' 'p'u'z'z'l'e' ':'-')'.' 'D'a'a'r'n'a'a's't' 'h'e'b' 'i'k' 'o'o'k' 'e'n'i'g'e' 'e'r'v'a'r'i'n'g' 'm'e't' 'l'e's'g'e'v'e'n' 'e'n' 'k'e'n'n'i's'o'v'e'r'd'r'a'c'h't'.'",
    "goals": "Ik wil mijn kennis verder verdiepen, ideeën uitwisselen en nieuwe inzichten opdoen over zowel de technische als maatschappelijke impact van AI. Ik interesseer mij ook sterk voor macro-economische en structurele veranderingen door AI. Denkers als Acemoglu & Johnson, Korinek, Brynjolfsson en Dwarkesh Patel houden mij bezig. Hoe ziet onze politiek en economie eruit in 50 jaar, en welke systeemkeuzes maken we nu met langdurige consequenties —  De structurele impact van AI op economieën en markten  -dat soort vragen.",
    "contributions": "'T'e'c'h'n'i's'c'h'e' 'd'i'e'p'g'a'n'g' 'g'e'c'o'm'b'i'n'e'e'r'd' 'm'e't' 'p'r'a'k't'i'j'k'e'r'v'a'r'i'n'g'.' 'I'k' 'b'o'u'w' 'z'e'l'f' 'm'o'd'e'l'l'e'n' 'e'n' 'm'o'd'e'l'a'r'c'h'i't'e'c't'u'u'r'—' 'P'C'A',' 'r'a'n'd'o'm' 'f'o'r'e's't's',' 'X'G'B'o'o's't',' 'L'S'T'M'''s',' 'v'e'c't'o'r' 'e'm'b'e'd'd'i'n'g's',' 'l'l'm' 'c'o'm'p'o's'i't'i'e's' ',' 's'e'n't'i'm'e'n't' 'a'n'a'l'y's'i's' 'e't'c' '-'-' ' 'D'a'a'r'n'a'a's't' 'h'e'b' 'i'k' 'v'e'e'l' 't'i'j'd' 'b'e's't'e'e'd' 'a'a'n' 's't'a't'i's't'i'e'k',' 'r'a'n'd'o'm' 'w'a'l'k's',' 'p'r'o'b'a'b'i'l'i't'y' 'd'i's't'r'i'b'u't'i'o'n's',' 'l'i'n'e'a'r' 'r'e'g'r'e's's'i'o'n' 'b'i'a's' 'e'n' 'h'e't' 'n'a'd'e'n'k'e'n' 'o'v'e'r' 'c'u'r'v'e' 'f'i't't'i'n'g' '&' 'o'v'e'r'f'i't't'i'n'g' 'V'e'e'l' 'e'r'v'a'r'i'n'g' 'm'e't' 'm'e't'a'-'p'r'o'm'p't'i'n'g',' 'v'i'b'e' 'c'o'd'i'n'g' 'e'n' 'm'o'd'u'l'a'i'r' 's'y's't'e'e'm'd'e'n'k'e'n'.' 'V'r'o'e'g'e'r' 'a'f'h'a'n'k'e'l'i'j'k' 'v'a'n' 'e'x't'e'r'n'e' 'p'r'o'g'r'a'm'm'e'u'r's';' 'v'a'n'd'a'a'g' 'a'u't'o'n'o'o'm'.'",
    "topicsContributed": [
      "'N'u' 'q'u'a'n't'i't'a't'i'v'e' 'f'i'n'a'n'c'e' 'p'r'o'p' 'f'i'r'm' ' 'A'I' 'e'n' 's'y's't'e'e'm'd'e'n'k'e'n'....",
      "'T'e'c'h'n'i's'c'h'e' 'd'i'e'p'g'a'n'g' 'g'e'c'o'm'b'i'n'e'e'r'd' 'm'e't' 'p'r'a'k't'i'j'k'e'r'v'a'r'i'n'g'.' ..."
    ]
  },
  {
    "name": "Toon Proost",
    "role": "Noma Law (Legal AI)",
    "email": "toon.proost@noma.law",
    "phone": "(049) 699 33 08",
    "company": "Noma Law (Legal AI)",
    "website": "",
    "background": "'A'd'v'o'c'a'a't':' 'v'a'n' 's't'a'g'i'a'i'r' 't'o't' 'v'e'n'n'o'o't' 'i'n' 'e'e'n' 't'r'a'j'e'c't' 'v'a'n' '1'8' 'j'a'a'r' 'b'i'j' 'h'e't'z'e'l'f'd'e' 'k'a'n't'o'o'r'.'",
    "goals": "Een administratiefrechtelijke vereenvoudiging van de dossierbehandeling, waardoor er tijd vrijkomt om echt inhoudelijk juridisch werk te verrichten in plaats van administratieve taken. Momenteel is de verhouding administraite/werk: 75/25. Dit is niet houdbaar.",
    "contributions": "'n'i'h'i'l',' 'b'u'i't'e'n' 'e'e'n' 'l'u'i's't'e'r'e'n'd' 'o'o'r' 'e'n' 'k'r'i't'i's'c'h'e' 'b'l'i'k'.'",
    "topicsContributed": [
      "'A'd'v'o'c'a'a't':' 'v'a'n' 's't'a'g'i'a'i'r' 't'o't' 'v'e'n'n'o'o't' 'i'n' 'e'e'n' 't'r'a'j'e'c't' 'v'a'n' '1...",
      "'n'i'h'i'l',' 'b'u'i't'e'n' 'e'e'n' 'l'u'i's't'e'r'e'n'd' 'o'o'r' 'e'n' 'k'r'i't'i's'c'h'e' 'b'l'i'k'.'"
    ]
  },
  {
    "name": "Georges Lieben",
    "role": "AI Innovator & Entrepreneur",
    "email": "georges.lieben@gmail.com",
    "phone": "",
    "company": "AI Innovator & Entrepreneur",
    "website": "",
    "background": "'P'r'o'd'u'c't'o'n't'w'i'k'k'e'l'i'n'g' 'b'a'c'k'g'r'o'u'n'd',' 'v'r'i'j' 's'n'e'l' 'b'e'g'i'n'n'e'n' 't'e' 'o'n'd'e'r'n'e'm'e'n' ':' '-' 'B'a'g'a'a'r' '>' 'I'O'T' 'a'g'e'n'c'y' '(' '5'0'+' 'F'T'E' '/' 'e'x'i't'e'd' ')' ' '-' 'T'w'i'k'i't' '>' 'c'u's't'o'm'i's'a't'i'o'n' 'f'o'r' 'd'i'g'i't'a'l' 'm'a'n'u'f'a'c't'u'r'i'n'g' '-' 'J'u'n'e' '>' 'e'n'e'r'g'y' 'd'e'm'o'c'r'a't'i's'e'r'i'n'g's'p'l'a't'f'o'r'm' '-' '.'.'.'",
    "goals": "peers vinden in de speer.",
    "contributions": "'e'r'v'a'r'i'n'g' 'o'n'd'e'r'n'e'm'e'r's'c'h'a'p' '&' 't'e'c'h'",
    "topicsContributed": [
      "'P'r'o'd'u'c't'o'n't'w'i'k'k'e'l'i'n'g' 'b'a'c'k'g'r'o'u'n'd',' 'v'r'i'j' 's'n'e'l' 'b'e'g'i'n'n'e'n' 't'e' 'o...",
      "'e'r'v'a'r'i'n'g' 'o'n'd'e'r'n'e'm'e'r's'c'h'a'p' '&' 't'e'c'h'"
    ]
  },
  {
    "name": "Frederik Van Dessel",
    "role": "AI Innovator & Entrepreneur",
    "email": "frederikvandessel@gmail.com",
    "phone": "(047) 609 64 47",
    "company": "AI Innovator & Entrepreneur",
    "website": "",
    "background": "'A'l't'i'j'd' 'w'i'l'l'e'n' 'o'n'd'e'r'n'e'm'e'n',' 'd'u's' 'o'o'k' 'g'e'd'a'a'n' 'n'a' 'T'E'W' 't'e' 's't'u'd'e'r'e'n'.' 'S't'a'r't'-'u'p' 'i'n' 'm'u'z'i'e'k'r'e'c'h't'e'n' '('l'e'e's' 'S'a'b'a'm' 't'r'a'n's'p'a'r'a'n't'e'r' 'm'a'k'e'n')',' 'n'a'd'i'e'n' 'D'e'l'i'v'e'r'o'o' 'm'e'e' 'o'p'g'e's't'a'r't' 'i'n' 'B'e'l'g'i'ë' 'e'n' 'H'e'a'd' 'o'f' 'O'p'e'r'a't'i'o'n's' 'g'e'w'e'e's't',' 'H'e'a'd' 'o'f' 'S'a'l'e's' 'g'e'w'e'e's't' 'b'i'j' 'T'o'o' 'G'o'o'd' 'T'o' 'G'o' 'e'n' 'e'e'n' 'p'a'a'r' 'j'a'a'r' 'l'i'g'g'e'n' 'k'a'u'w'e'n' 'o'p' 'e'e'n' 'd'u'u'r'z'a'm'e' 'f'o'o'd' 'p'r'o'p'o's'i't'i'e' 'm'e't' 'J'e'f' ':')' 'I'n't'u's's'e'n' 'g'e'f'o'c'u's'e'd' 'o'p' 'G'T'M' 'b'i'j' 'G'i'v'e' 'a' 'D'a'y' '('d'e' 'T'i'n'd'e'r' 'v'a'n'''t' 'v'r'i'j'w'i'l'l'i'g'e'r's'w'e'r'k')'.' ' ' 'V'e'e'l' 'p'a's's'i'e' 'd'u's' 'v'o'o'r' '('s'o'c'i'a'a'l')' 'o'n'd'e'r'n'e'm'e'r's'c'h'a'p',' 'i'n'n'o'v'a't'i'e' 'e'n' 'e'i'g'e'n'l'i'j'k' 'o'o'k' 'v'o'o'r'l'i'e'f'd'e' 'v'o'o'r' 'g'e'z'o'n'd'e' 'v'o'e'd'i'n'g' 'e'n' 'l'o'n'g'e'v'i't'y' 'n'a' 'e'e'n' 'h'e'f't'i'g'e' 't'e'e'l'b'a'l'k'a'n'k'e'r'e'r'v'a'r'i'n'g' 'i'n' '2'0'2'0'.'",
    "goals": "Meer kennis, up-to-date blijven, sparringpartners, samen productjes bouwen en testen",
    "contributions": "'Z'e'l'f' 'a'l' 'i'n' 'r'e'd'e'l'i'j'k' 'w'a't' 's't'a'r't'-'e'n' 's'c'a'l'e' 'u'p's' 'g'e'w'e'r'k't' 'e'n' 'd'u's' 'b'e's't' 'w'a't' 'a'c'h't'e'r'g'r'o'n'd' 'i'n' 'g'r'o'e'i',' 't'e'a'm's' 'l'e'i'd'e'n',' 's't'r'a't'e'g'i'e' 'e'n' 'i'n'n'o'v'a't'i'e'.' ' 'Z'e'l'f' 'o'o'k' 'o'p' 'e'x'p'l'o'r'a't'i'e' 'i'n' 'A'I'-'l'a'n'd' 'd'u's' 'k'a'n' 'z'e'k'e'r' 'o'o'k' 'm'i'j'n' 'l'e'a'r'n'i'n'g's' 'd'e'l'e'n' 'n'a'a's't' 'u'i't'e'r'a'a'r'd' 'm'i'j'n' 'l'e'n's' 'a'l's' 'o'n'd'e'r'n'e'm'e'r'",
    "topicsContributed": [
      "'A'l't'i'j'd' 'w'i'l'l'e'n' 'o'n'd'e'r'n'e'm'e'n',' 'd'u's' 'o'o'k' 'g'e'd'a'a'n' 'n'a' 'T'E'W' 't'e' 's't'u'd...",
      "'Z'e'l'f' 'a'l' 'i'n' 'r'e'd'e'l'i'j'k' 'w'a't' 's't'a'r't'-'e'n' 's'c'a'l'e' 'u'p's' 'g'e'w'e'r'k't' 'e'n' 'd..."
    ]
  },
  {
    "name": "Chantal Dierickx",
    "role": "Club Santé",
    "email": "info@clubsante.be",
    "phone": "(049) 949 93 93",
    "company": "Club Santé",
    "website": "",
    "background": "'M'a's't'e'r' 'i'n' 'f'i't'h'e'i'd' 'i'n' 'g'e'z'o'n'd'h'e'i'd',' 'd'i'e' 'h'e't' 'h'o'l'i's't'i's'c'h'e' 'g'e'z'o'n'd'h'e'i'd's'p'a'd' 'o'p'g'i'n'g' 'n'a' 'e'e'n' 'k'o'r't'e' 'c'a'r'r'i'è'r'e' 'i'n' 'p'h'a'r'm'a'.' ' 'A'f'g'e'l'o'p'e'n' 'j'a'r'e'n' 'w'e'r'k' 'i'k' 'a'l's' 'z'e'l'f's't'a'n'd'i'g' 'p'l'a'n't'a'a'r'd'i'g' 'c'h'e'f' 'e'n' 'g'e'z'o'n'd'h'e'i'd's'c'o'a'c'h',' 'z'o'w'e'l' 'f'r'e'e'l'a'n'c'e' 'a'l's' 'v'o'o'r' 'p'a'r't'i'c'u'l'i'e'r'e'n'.' 'S'i'n'd's' '2'j'a'a'r' 'o'r't'h'o'm'o'l'e'c'u'l'a'i'r' 't'h'e'r'a'p'e'u't'.' ' 'I'n' 'o'k't'o'b'e'r' 's't'a'r't' 'i'k' 'm'i'j'n' 'e'i'g'e'n' 'w'e'l'l'b'e'i'n'g' 's'p'a'c'e' '('B'e'r'c'h'e'm')'.' 'V'o'o'r'a'l' 'v'o'o'r' 's'o'c'i'a'l' 'm'e'd'i'a',' 'w'e'b's'i't'e' 'b'e'h'e'e'r' 'e'n' 'o'n'l'i'n'e' 'c'u'r's'u's's'e'n' '('p'a's's'i'e'f' 'i'n'k'o'm'e'n')' 'b'e'n' 'i'k' 'g'e'ï'n't'e'r'e's's'e'e'r'd' 'i'n' 'A'I' 'g'e'b'r'u'i'k'.' ' 'I'k' 'b'e'n' 'e'e'n' 'a'u't'o'd'i'd'a'c't',' 'm'a'a'r' 'h'e'b' 'm'e' 'n'o'g' 'n'i'e't' 'o'p' 'A'I' 't'o'e'g'e'l'e'g'd'.' 'S'i'n'd's' '9'w'e'k'e'n' 'm'a'm'a' 'v'a'n' 'O'n'o' ';')'.'",
    "goals": "Werkflow optimalisatie én leren van nieuwe kennis",
    "contributions": "'O'p' 'd'i't' 'm'o'm'e'n't' 'n'o'g' 'n'i'e't' 'v'e'e'l'.' 'T'e'n'z'i'j' 'i'n'd'i'e'n' 'w'e' 'l'i'v'e' 's'a'm'e'n'k'o'm'e'n' 'd'e' 'c'a't'e'r'i'n'g' ':'D'.' ' ' 'M'a'a'r' 'i'k' 'z'o'u' 'w'e'l' 'e'e'n' 'p'r'e's'e'n't'a't'i'e' 'i'n'e'e'n's't'e'k'e'n' 'o'v'e'r' 'h'o'e' 'i'k' 'h'e't' 'h'e'b' 'g'e'b'r'u'i'k't',' 'n'a'd'a't' 'i'k' 'h'e'b' 'g'e'l'e'e'r'd' 'h'e't' 'g'o'e'd' 't'e' 'i'm'p'l'e'm'e'n't'e'r'e'n'.'",
    "topicsContributed": [
      "'M'a's't'e'r' 'i'n' 'f'i't'h'e'i'd' 'i'n' 'g'e'z'o'n'd'h'e'i'd',' 'd'i'e' 'h'e't' 'h'o'l'i's't'i's'c'h'e' 'g'e...",
      "'O'p' 'd'i't' 'm'o'm'e'n't' 'n'o'g' 'n'i'e't' 'v'e'e'l'.' 'T'e'n'z'i'j' 'i'n'd'i'e'n' 'w'e' 'l'i'v'e' 's'a'm'e..."
    ]
  },
  {
    "name": "Bert Verstappen",
    "role": "Maar Digital",
    "email": "hi@maar.digital",
    "phone": "",
    "company": "Maar Digital",
    "website": "",
    "background": "'S'e'l'f'-'e'm'p'l'o'y'e'd' 'A'I' 'p'o'w'e'r'e'd' 'p'r'o'd'u'c't' 'o'w'n'e'r'/'m'a'n'a'g'e'r'/'b'u'i'l'd'e'r'.' 'J'e'f',' 'm'e'z'e'l'f' 'e'n' 'a'n'd'e'r'e'n' 'i'n' 'd'e' 'g'r'o'e'p' 'g'a'a'n' 'r'e'e'd's' 'e'e'n' 'l'a'n'g'e' 'w'e'g' 't'e'r'u'g' '('d'i'g'i't'a'l' 'a'g'e'n'c'y' '-'>' 'c'o'r'p'o'r'a't'e' 'i'n'n'o'v'a't'i'o'n' '-'>' 'd'i'g'i't'a'l' 'p'r'o'd'u'c't's' '-'>' '?'?')'",
    "goals": "/claude answer",
    "contributions": "'/'c'l'a'u'd'e' 'a'n's'w'e'r'",
    "topicsContributed": [
      "'S'e'l'f'-'e'm'p'l'o'y'e'd' 'A'I' 'p'o'w'e'r'e'd' 'p'r'o'd'u'c't' 'o'w'n'e'r'/'m'a'n'a'g'e'r'/'b'u'i'l'd'e'r'....",
      "'/'c'l'a'u'd'e' 'a'n's'w'e'r'"
    ]
  },
  {
    "name": "Peter Van keer",
    "role": "Peter Van Keer Consulting",
    "email": "info@petervankeer.com",
    "phone": "(049) 487 94 92",
    "company": "Peter Van Keer Consulting",
    "website": "",
    "background": "'I'k' 'b'e'n' 'P'e't'e'r',' 'o'p'r'i'c'h't'e'r' 'v'a'n' 'V'N'K'R' 'S't'u'd'i'o' 'i'n' 'A'n't'w'e'r'p'e'n'.' 'M'i'j'n' 'a'c'h't'e'r'g'r'o'n'd' 'i's' 't'e'c'h'n'i's'c'h':' 'i'k' 'b'e'n' 'b'e'g'o'n'n'e'n' 'i'n' 'd'e' 'P'C'-'h'a'r'd'w'a'r'e' 'w'e'r'e'l'd' 'e'n' 'b'e'n' 'z'o'''n' 'a'c'h't' 'j'a'a'r' 'g'e'l'e'd'e'n' 'o'v'e'r'g'e's't'a'p't' 'n'a'a'r' 'v'i'd'e'o' 'e'n' 'c'o'n't'e'n't'p'r'o'd'u'c't'i'e'.' ' 'V'a'n'd'a'a'g' 'w'e'r'k' 'i'k' 'm'e't' 'B'2'B'-'b'e'd'r'i'j'v'e'n' 'i'n' 't'e'c'h',' 'f'i'n'a'n'c'e',' 'm'e'd'i's'c'h'e' 's'e'c't'o'r' 'e'n' 'j'u'r'i'd'i's'c'h'e' 'd'i'e'n's't'v'e'r'l'e'n'i'n'g'.' 'G'e'e'n' 'k'l'a's's'i'e'k'e' 'v'i'd'e'o'p'r'o'd'u'c't'i'e',' 'm'a'a'r' 'r'e'c'u'r'r'i'n'g' 'c'o'n't'e'n't' 'p'a'r't'n'e'r's'h'i'p's' 'w'a'a'r'b'i'j' 'v'i'd'e'o' 'é'c'h't' 'e'e'n' 'r'o'l' 's'p'e'e'l't' 'i'n' 'h'o'e' 'e'e'n' 'b'e'd'r'i'j'f' 'z'i'c'h' 'p'o's'i't'i'o'n'e'e'r't' 'e'n' 'c'o'm'm'u'n'i'c'e'e'r't'.' ' 'A'I' 'g'e'b'r'u'i'k' 'i'k' 'd'a'g'e'l'i'j'k's',' 'z'o'w'e'l' 'i'n' 'm'i'j'n' 'e'i'g'e'n' 'w'o'r'k'f'l'o'w's' 'a'l's' 'i'n' 'd'e' 's'y's't'e'm'e'n' 'd'i'e' 'i'k' 'b'o'u'w' '('v'o'o'r' 'm'i'j'n' 's't'u'd'i'o' 'e'n' 'v'o'o'r' 'k'l'a'n't'e'n')'.' 'G'e'e'n' 'h'y'p'e' 'v'o'o'r' 'm'i'j',' 'w'e'l' 'e'e'n' 't'o'o'l' 'd'i'e' 'i'k' 'p'r'o'b'e'e'r' 'g'o'e'd' 't'e' 'b'e'g'r'i'j'p'e'n' 'e'n' 's'l'i'm' 'i'n' 't'e' 'z'e't't'e'n'.'",
    "goals": "Kennis en connecties",
    "contributions": "'I'k' 'h'e'b' 'e'e'n' 'm'o'o'i' 'k'a'n't'o'o'r' 'e'n' 'f'i'l'm's't'u'd'i'o' 't'e' 'A'n't'w'e'r'p'e'n' 'd'i'e' 'i'k' 'm'e't' 'p'l'e'z'i'e'r' 'o'p'e'n's't'e'l' 'v'o'o'r' 'g'a't'h'e'r'i'n'g's'.' ' 'D'a't' 't'e'r'z'i'j'd'e',' 'e'r'v'a'r'i'n'g' 'i'n' '('c'o'n't'e'n't')' 'e'n' 'v'i'd'e'o' 'm'a'r'k'e't'i'n'g',' 'v'i'd'e'o' 'p'r'o'd'u'c't'i'e's' 'v'o'o'r' 's't'a'r't'u'p's',' 's'c'a'l'e'-'u'p's' 'e'n' 'c'o'r'p'o'r'a't'e's' '('n'i'e't' 'd'e' 't'y'p'i's'c'h'e' 'f'i'l'm' 'b'a'c'k'g'r'o'u'n'd',' 'm'a'a'r' 'd'i'g'i't'a'l'e' 'm'a'r'k'e't'i'n'g')'.'",
    "topicsContributed": [
      "'I'k' 'b'e'n' 'P'e't'e'r',' 'o'p'r'i'c'h't'e'r' 'v'a'n' 'V'N'K'R' 'S't'u'd'i'o' 'i'n' 'A'n't'w'e'r'p'e'n'.' 'M...",
      "'I'k' 'h'e'b' 'e'e'n' 'm'o'o'i' 'k'a'n't'o'o'r' 'e'n' 'f'i'l'm's't'u'd'i'o' 't'e' 'A'n't'w'e'r'p'e'n' 'd'i'e' ..."
    ]
  },
  {
    "name": "Mark Lens",
    "role": "Lean Mean Business",
    "email": "mark@leanmeanbusiness.com",
    "phone": "(047) 595 03 35",
    "company": "Lean Mean Business",
    "website": "",
    "background": "'I'k' 'b'e'n' 'e'e'n' 's'o'c'i'a'l' 's'e'r'i'a'l' 'e'n't'r'e'p'r'e'n'e'u'r'.' 'A'f'g'e'l'o'p'e'n' 'j'a'r'e'n' 'a'l' 'm'i'j'n' 'b'e'd'r'i'j'v'e'n' 'v'e'r'k'o'c'h't'.' 'E'n'k'e'l' 'n'o'g' 'm'e'd'e'-'e'i'g'e'n'a'a'r' 'v'a'n' 'N'o'v'a't'i'o'n'.'b'e' 'e'n' 'h'e'b' 'i'k' 'm'e' 'g'e'r'i'c'h't' 'm'e't' 'e'e'n' 'k'l'e'i'n' 't'e'a'm' 'o'p' 'k'o'r't'e' 't'e'r'm'i'j'n' 'v'e'r'h'u'u'r' 'v'o'o'r' 'g'r'o't'e' 'g'r'o'e'p'e'n' 'i'n' 'B'e'l'g'i'e' 'e'n' 'S'p'a'n'j'e'.' '('o'a' 'h't't'p's':'/'/'h'o'o'g'm'o'l'e'n'.'b'e')'.' 'B'e'h'e'e'r' 'g'e'b'e'u'r't' 'v'o'l'l'e'd'i'g' 'd'o'o'r' 'd'i't' 'k'l'e'i'n'e' 't'e'a'm',' 'm'e't' 'A'I' 'e'n' 'a'u't'o'm'a't'i'o'n' 'b'e'n' 'i'k' 'n'u' 'v'o'o'r'a'l' 'b'e'z'i'g' 'o'm' 'd'e' 's'i't'e's' 't'e' 'o'p't'i'm'a'l'i's'e'r'e'n'.' ' 'M'i'j' 'h'o'o'f'd'a'c't'i'v'i't'e'i't' 'g'a'a't' 'n'a'a'r' 'd'e' 'V'Z'W' 'd'i'e' 'i'k' '8' 'j'a'a'r' 'g'e'l'e'd'e'n' 'h'e'b' 'o'p'g'e'r'i'c'h't' 'H't't'p's':'/'/'o'v'w'b'.'b'e' '-' 'O'n'd'e'r'n'e'm'e'r's' 'V'o'o'r' 'e'e'n' 'W'a'r'm' 'B'e'l'g'i'e' '-' 'W'a'a'r'b'i'j' 'w'e' 'o'n's' 'r'i'c'h't'e'n' 'o'p' 's'c'h'o'l'e'n' 'm'e't' 'd'e' 'k'a'n's' 'o'p' 'k'a'n's'a'r'm'o'e'd'e' 'g'r'o't'e'r' 'd'a'n' '5'0' '%' 'o'm' 'd'e'z'e' 'k'w'e't's'b'a'r'e' 'k'i'n'd'e'r'e'n' 't'e' 'h'e'l'p'e'n',' 'm'e'e'r' 'i'n'f'o' 'v'i'n'd' 'j'e' 'o'p' 'd'e' 'w'e'b's'i't'e',' 'a'l's'o'o'k' 'o'n'z'e' 'i'm'p'a'c't' 'r'e'p'o'r't'e'n'.' 'A'l's' 'i'e'm'a'n'd' 'p'e't'e'r's'c'h'a'p' 'g'e'd'e'e'l't'e'l'i'j'k' 'o'f' 'v'o'l'l'e'd'i'g' 'w'i'l't' 'n'e'm'e'n' 'o'v'e'r' 'e'e'n' 's'c'h'o'o'l' 'e'n' 'm'e'e' 'w'i'l' 's'p'o'n's'e'r'e'n' 's't'u'u'r' 'm'e' 'd'a'n' 'm'a'a'r' 'e'e'n' 'b'e'r'i'c'h't'j'e'",
    "goals": "Ik wil slimmer werken met AI, zodat ik minder tijd verlies aan repetitieve taken en meer ruimte heb voor werk dat echt waarde toevoegt. Ik wil mijn kennis verdiepen, betere keuzes kunnen maken tussen tools en AI praktisch inzetten in mijn werk en projecten.
Ik wil ook ideeën kunnen uitwisselen met gelijkgestemden, zodat ik sneller leer, nieuwe toepassingen ontdek en mijn aanpak kan verbeteren. Uiteindelijk wil ik efficiënter werken, slimmer automatiseren en sterker worden in AI.",
    "contributions": "'I'k' 'd'e'n'k' 'd'a't' 'i'k' 'z'e'l'f' 'v'o'o'r'a'l' 'k'a'n' 'b'i'j'd'r'a'g'e'n' 'm'e't' 'p'r'a'k't'i's'c'h'e' 'e'r'v'a'r'i'n'g' 'e'n' 'v'r'a'g'e'n' 'o'v'e'r' 'h'e't' 'e'c'h't'e' 'g'e'b'r'u'i'k' 'v'a'n' 'A'I' 'i'n' 'j'e' 'w'e'r'k' 'e'n' 'd'a'g'e'l'i'j'k's' 'l'e'v'e'n'.' 'I'k' 't'e's't' 'v'e'e'l' 't'o'o'l's',' 'p'r'o'b'e'e'r' 'z'e' 'i'n' 'c'o'n'c'r'e't'e' 'p'r'o'j'e'c't'e'n' 't'e' 'z'e't't'e'n' 'e'n' 'k'i'j'k' 'w'a't' 'e'r' 'w'e'r'k't' 'e'n' 'w'a't' 'n'i'e't'.' ' 'I'k' 'k'a'n' 'b'i'j'd'r'a'g'e'n' 'd'o'o'r':' ' ' '-' 'C'o'n'c'r'e't'e' 'v'o'o'r'b'e'e'l'd'e'n' 't'e' 'g'e'v'e'n' 'v'a'n' 'h'o'e' 'i'k' 'A'I'‑'t'o'o'l's' 'i'n'z'e't' '('b'i'j'v'o'o'r'b'e'e'l'd' 'a'u't'o'm'a't'i's'e'r'i'n'g',' 'c'o'n't'e'n't',' 'm'a'r'k'e't'i'n'g')'.' ' '-' 'A'c'h't'e'r'l'i'g'g'e'n'd'e' 'v'r'a'g'e'n' 'e'n' 'l'o'g'i'c'a' 't'e' 'v'e'r'd'u'i'd'e'l'i'j'k'e'n',' 'z'o'd'a't' 'a'n'd'e'r'e'n' 's'n'e'l'l'e'r' 'k'u'n'n'e'n' 'l'e'r'e'n' 'e'n' 'm'i'n'd'e'r' 'm'o'e't'e'n' 'p'r'o'b'e'r'e'n'.' ' '-' 'S't'r'u'c't'u'u'r' 'e'n' 'r'i'c'h't'i'n'g' 't'e' 'g'e'v'e'n' 'a'a'n' 'v'r'i'j' 'g'e's'p'r'e'k' 'd'o'o'r' 's't'e'e'd's' 't'e'r'u'g' 't'e' 'k'o'p'p'e'l'e'n' 'n'a'a'r' 'p'r'a'k't'i's'c'h'e' 't'o'e'p'a's's'i'n'g'e'n' 'e'n' 'm'o'g'e'l'i'j'k'e' 's't'a'p'p'e'n'.' ' 'I'k' 'z'i'e' 'm'e'z'e'l'f' 'a'l's' 'i'e'm'a'n'd' 'd'i'e' 'h'e'l'p't' 'o'm' 'd'e' 'c'h'a'o's' 'v'a'n' 'A'I'‑'t'o'o'l's' 't'e' 'v'e'r't'a'l'e'n' 'n'a'a'r' 'b'r'u'i'k'b'a'r'e',' 's'i'm'p'e'l'e' 't'o'e'p'a's's'i'n'g'e'n' 'd'i'e' 'j'e' 'd'a'a'd'w'e'r'k'e'l'i'j'k' 'k'u'n't' 'g'e'b'r'u'i'k'e'n'.'",
    "topicsContributed": [
      "'I'k' 'b'e'n' 'e'e'n' 's'o'c'i'a'l' 's'e'r'i'a'l' 'e'n't'r'e'p'r'e'n'e'u'r'.' 'A'f'g'e'l'o'p'e'n' 'j'a'r'e'n' ...",
      "'I'k' 'd'e'n'k' 'd'a't' 'i'k' 'z'e'l'f' 'v'o'o'r'a'l' 'k'a'n' 'b'i'j'd'r'a'g'e'n' 'm'e't' 'p'r'a'k't'i's'c'h'e..."
    ]
  },
  {
    "name": "Stijn Deweer",
    "role": "Maldini & PilarBKK",
    "email": "stijn@maldini.be",
    "phone": "(047) 882 59 61",
    "company": "Maldini & PilarBKK",
    "website": "",
    "background": "'o'n'd'e'r'n'e'm'e'r' 'i'n' 'I'T',' 'm'e'd'i'a',' 'd'i'g'i't'a'l' 'm'a'r'k'e't'i'n'g':' ' 'C'r'o'n'o's',' 'C'a'l'i'b'r'a't'e',' 'A'd's'a'n'd'd'a't'a',' 'M'a'l'd'i'n'i',' 'P'i'l'a'r'B'K'K'",
    "goals": "slimmer worden, maar vooral netwerk opbouwen van specialisten die PilarBKK gaan kunnen ondersteunen.",
    "contributions": "'g'o'e'd' 'z'i'c'h't' 'o'p' 'h'o'e' 'A'I' 'e'n' 'a'l'g'o'r'i't'm'e's' 'a'l' 'h'e'e'l' 'l'a'n'g' 'd'e' 'b'a's'i's' 'v'o'r'm'e'n' 'v'a'n' 'd'i'g'i't'a'l'e' 'm'a'r'k'e't'i'n'g' 't'r'a'j'e'c't'e'n',' 'a'n'd'e'r'e' 'v'e'r't'i'c'a'l's'/'s'e'c't'o'r'e'n' 'z'o'u'd'e'n' 'h'i'e'r' 'v'e'e'l' 'v'a'n' 'k'u'n'n'e'n' 'l'e'r'e'n'",
    "topicsContributed": [
      "'o'n'd'e'r'n'e'm'e'r' 'i'n' 'I'T',' 'm'e'd'i'a',' 'd'i'g'i't'a'l' 'm'a'r'k'e't'i'n'g':' ' 'C'r'o'n'o's',' 'C'a...",
      "'g'o'e'd' 'z'i'c'h't' 'o'p' 'h'o'e' 'A'I' 'e'n' 'a'l'g'o'r'i't'm'e's' 'a'l' 'h'e'e'l' 'l'a'n'g' 'd'e' 'b'a's'i..."
    ]
  },
  {
    "name": "Patrick Fransen",
    "role": "Aqualion Earth",
    "email": "patrick.fransen@aqualion.earth",
    "phone": "",
    "company": "Aqualion Earth",
    "website": "",
    "background": "'B'u'r'g' 'I'r' 'c'o'm'p'u't'e'w'e't'e'n's'c'h'a'p'p'e'n' '1'5' 'j'a'a'r' 'B'u's'i'n'e's's' 'c'o'n's'u'l't'i'n'g' 'b'e'd'r'i'j'f' 'g'e'h'a'd' 'm'e't' '7'0' 'm'a'n' 'e'n' 'v'e'r'k'o'c'h't' '7' 'j'a'a'r' 'b'e'z'i'g' 'm'e't' 'b'e'w'u's't'e' 'b'e'd'r'i'j'v'e'n' 'b'o'u'w'e'n' 'O'n'd'e'r'n'e'm'e'r's'c'o'a'c'h' 'v'o'o'r' 'v'e'e'r'k'r'a'c'h't' 'e'n' 'b'e'w'u's't'z'i'j'n's'g'r'o'e'i' 'B'e'g'i'n'n'e'r' 'm'e't' 'a'i'",
    "goals": "Opgestart geraken met ai en begrijpen wat er kan , mogelijks zelf een toepassing maken",
    "contributions": "'G'o'e'd'e' 'v'i'b'e',' 'b'e'n' 'e'e'n' 't'o't'a'l'e' 'b'e'g'i'n'n'e'r',' 'd'u's' 'i'n'h'o'u'd'e'l'i'j'k' 'w'e'i'n'i'g' 'm'o'm'e'n't'e'e'l',' 'b'e'n' 'w'e'l' 'o'n'd'e'r'n'e'm'e'r' 'e'n' 'a'a'n' 'h'e't' 'k'i'j'k'e'n' 'o'm' 'm'i's's'c'h'i'e'n' 'i'e't's' 'n'i'e'u'w's' 't'e' 's't'a'r't'e'n' ',' 'm'o'g'e'l'i'j'k's' 'm'e't' 'a'n'd'e'r'e'n',' 'w'i'e' 'w'e'e't' 'l'e'd'e'n' 'u'i't' 'd'e' 'g'r'o'e'p'",
    "topicsContributed": [
      "'B'u'r'g' 'I'r' 'c'o'm'p'u't'e'w'e't'e'n's'c'h'a'p'p'e'n' '1'5' 'j'a'a'r' 'B'u's'i'n'e's's' 'c'o'n's'u'l't'i'n...",
      "'G'o'e'd'e' 'v'i'b'e',' 'b'e'n' 'e'e'n' 't'o't'a'l'e' 'b'e'g'i'n'n'e'r',' 'd'u's' 'i'n'h'o'u'd'e'l'i'j'k' 'w'e..."
    ]
  },
  {
    "name": "Diego Vanhee",
    "role": "One To Win",
    "email": "dvanhee@onetowin.be",
    "phone": "(047) 761 92 56",
    "company": "One To Win",
    "website": "",
    "background": "'H'a'n'd'e'l's'i'n'g'e'n'i'e'u'r' '('m'a'r'k'e't'i'n'g' '/' 'b'e'l'e'i'd's'i'n'f'o'r'm'a't'i'c'a')' 'v'a'n' 'a'c'h't'e'r'g'r'o'n'd',' 'c'a'r'r'i'è'r'e' 'i'n' 'c'o'n's'u'l't'i'n'g' '('C'&'L' '/' 'P'w'C')',' 'e'i'g'e'n' 'c'o'n's'u'l't'a'n'c'y' '&' 'd'e't'a'c'h'e'r'i'n'g's'b'e'd'r'i'j'f' 'g'e'd'u'r'e'n'd'e' '>' '2'5' 'j'a'a'r' '('&' 'c'o'u'n't'i'n'g')',' 'n'u' 'v'o'o'r'a'l' 'm'''n' 'f'o'c'u's' 'o'p' 'o'n's' 't'e'l'e'm'o'n'i't'o'r'i'n'g' 'b'e'd'r'i'j'f' 'w'a't' 'e'e'n' 'd'a't'a' 'p'l'a't'f'o'r'm' 'h'e'e'f't' 'd'a't' 'a'l'l'e' 'g'e'z'o'n'd'h'e'i'd's's'p'e'l'e'r's' 'i'n'c'l'u's'i'e'f' 'p'a't'i'ë'n't'e'n' 'e'n' 'g'e'b'r'u'i'k'e'r's' 'm'e't' 'e'l'k'a'a'r' 'v'e'r'b'i'n'd't'.' ' 'A'I' 'i's' 'z'o'w'e'l' 'r'e'l'e'v'a'n't' 'b'i'n'n'e'n' 'd'e' 'c'o'n's'u'l't'i'n'g'/'d'e't'a'c'h'e'r'i'n'g's'b'u's'i'n'e's's' 'a'l's' 'b'i'n'n'e'n' 'o'n's' 'h'e'a'l't'h' 't'e'c'h' 'b'e'd'r'i'j'f' 'e'n' 'd'e' 'o'm'g'e'v'i'n'g' 'w'a'a'r'b'i'n'n'e'n' 'w'e' 'o'p'e'r'e'r'e'n'.' 'D'a'a'r' 'h'e'b' 'i'k' 'v'o'o'r'l'o'p'i'g' 'b'e'p'e'r'k't'e' 'e'r'v'a'r'i'n'g',' 'm'''n' 'g'r'o'o't's't'e' 'A'I' 'e'r'v'a'r'i'n'g' 't'o't' 'n'u' 't'o'e' 's'i't'u'e'e'r't' 'z'i'c'h' 'i'n' 'm'i'j'n' 'd'a'g'e'l'i'j'k's'e' 'm'a'n'i'e'r' 'v'a'n' 'w'e'r'k'e'n' '('m'e'e't'i'n'g' 't'r'a'n's'c'r'i'p't'i'e's',' 'N'o't'i'o'n' 'A'I',' 'c'h'a't'G'P'T',' 'C'l'a'u'd'e',' 'P'e'r'p'l'e'x'i't'y',' 'N'o't'e'b'o'o'k'L'M',' 'S'u'p'e'r'W'h'i's'p'e'r',' 'C'u'r's'o'r',' '.'.'.' ')'.'",
    "goals": "Waar mogelijk en relevant (!) zo hoog mogelijk mee te blijven op de AI wave.",
    "contributions": "'M'i'j'n' 'e'r'v'a'r'i'n'g'e'n' 'm'e't' 'd'e' 'i'n't'e'g'r'a't'i'e' 'v'a'n' 'A'I' 'b'i'n'n'e'n' 'd'e' 'o'm'g'e'v'i'n'g'e'n' 'w'a'a'r'b'i'n'n'e'n' 'i'k' 'a'c't'i'e'f' 'm'e't' 'd'u'i'd'e'l'i'j'k'e' 'f'e'e'd'b'a'c'k' 'o'v'e'r' 'w'a't' 'w'é'l' 'e'n' 'n'i'e't' 'w'e'r'k't'.'",
    "topicsContributed": [
      "'H'a'n'd'e'l's'i'n'g'e'n'i'e'u'r' '('m'a'r'k'e't'i'n'g' '/' 'b'e'l'e'i'd's'i'n'f'o'r'm'a't'i'c'a')' 'v'a'n' 'a...",
      "'M'i'j'n' 'e'r'v'a'r'i'n'g'e'n' 'm'e't' 'd'e' 'i'n't'e'g'r'a't'i'e' 'v'a'n' 'A'I' 'b'i'n'n'e'n' 'd'e' 'o'm'g'e..."
    ]
  },
  {
    "name": "Vincent Crynen",
    "role": "Altiro",
    "email": "vincent@altiro.be",
    "phone": "(049) 721 57 33",
    "company": "Altiro",
    "website": "",
    "background": "'I'k' 'h'e'b' 'e'e'n' 'e'e'n' 't'e'n't'e'n' 'b'e'd'r'i'j'f',' 'a'l't'i'r'o',' 'm'e't' 'e'e'n' '2'0't'a'l' 'v'a's't'e' 'w'e'r'k'n'e'm'e'r's' 'a'a'n'g'e'v'u'l'd' 'm'e't' 'j'o'b's't'u'd'e'n't'e'n' 'e'n' 'f'r'e'e'l'a'n'c'e'r's' 't'i'j'd'e'n's' 'd'r'u'k'k'e' 'm'o'm'e'n't'e'n'.' 'I'k' 'b'e'n' 'h'e'e'l' 'a'n'a'l'y't'i's'c'h' 'v'a'n' 'g'e'e's't',' 'v'r'o'e'g'e'r' 'v'e'e'l' 'm'e't' 'e'x'c'e'l' 'm'a'c'r'o'’'s' 'g'e'w'e'r'k't' '('v'a'n' 'a'a'n'v'r'a'a'g' 'i'n' 'm'a'i'l'b'o'x' 'n'a'a'r' 'g'e'p'e'r's'o'n'a'l'i's'e'e'r'd'e' 'o'f'f'e'r't'e' 'm'e't' 'b'i'j'l'a'g'e'n' 'e'n' 'b'e'r'e'k'e'n'd'e' 't'r'a'n's'p'o'r't'p'r'i'j's',' 'i'n' 'm'o'n'd'e'r' 'd'a'n' '3'0's'e'c'o'n'd'e'n',' 'w'e'l' 'n'i'e't' 's'c'h'a'a'l'b'a'a'r',' 'd'u's' 'n'u' 't'r'a'a'g' 'c'r'm' 'p'a'k'k'e't' '😕'😅')' 'M'o'm'e'n't'e'e'l' 'z'e'l'f' 'v'o'l'o'p' 'm'e't' 'c'l'a'u'd'e' 'a'a'n' 'd'e' 's'l'a'g',' 'i'n' 'b'e'd'r'i'j'f' 'n'e't' 'c'o'p'i'l'o't' 'l'i'c'e'n't'i'e's' 'v'o'o'r'z'i'e'n'.' 'W'i'l' 'g'r'a'a'g' 's'n'e'l' 'a'g'e'n't's' 'i'm'p'l'e'm'e'n't'e'r'e'n'",
    "goals": "Uiteindelijke doel is een ai architectuur op te zetten en ai écht te implementeren in mijn bedrijf",
    "contributions": "'P'r'a'k't'i'j'k' 'v'a'n'u'i't' 'k'm'o',' 'k'o'p'p'e'l'i'n'g' 'm'e't' 't'h'e'm'a'’'s' 'v'a'n' 'm'i'j'n' 'm'b'a' 'o'p'l'e'i'd'i'n'g' '('m'o'm'e'n't'e'e'l' 'b'e'z'i'g')',' 'a'l'g'e'm'e'n'e' 's't'r'a't'e'g'i'e'",
    "topicsContributed": [
      "'I'k' 'h'e'b' 'e'e'n' 'e'e'n' 't'e'n't'e'n' 'b'e'd'r'i'j'f',' 'a'l't'i'r'o',' 'm'e't' 'e'e'n' '2'0't'a'l' 'v'a...",
      "'P'r'a'k't'i'j'k' 'v'a'n'u'i't' 'k'm'o',' 'k'o'p'p'e'l'i'n'g' 'm'e't' 't'h'e'm'a'’'s' 'v'a'n' 'm'i'j'n' 'm'b'a..."
    ]
  },
  {
    "name": "Jef Cavens",
    "role": "Cavens.io & Notiva AI OS",
    "email": "jef@cavens.io",
    "phone": "(047) 723 84 34",
    "company": "Cavens.io & Notiva AI OS",
    "website": "",
    "background": "'S'i'n'd's' '~'2'0'0'3' 'a'c't'i'e'f' 'i's' 'w'e'b' 'w'e'r'e'l'd' 'i'n' 'a'l'l'e'r'h'a'n'd'e' 'r'o'l'l'e'n'.' 'F'o'c'u's' 'o'p' 'p'r'o'd'u'c't' 'e'n' 'o'n'd'e'r'n'e'm'e'r's'c'h'a'p'.' 'S'i'n'd's' 'e'e'n' 't'i'j'd'j'e' 'v'o'l' 'o'p' 'd'e' 'v'i'b'e'-'c'o'd'e' 't'r'e'i'n' 'g'e's'p'r'o'n'g'e'n' 'e'n' 'd'a't' 'c'o'n's'u'm'e'e'r't' 'n'u' 'o'n'g'e'v'e'e'r' 'a'l' 'm'i'j'n' 't'i'j'd'.'",
    "goals": "Ik deel graag met mensen, maar wil nog meer zelf leren van anderen",
    "contributions": "'I'k' 'b'e'n' 'v'e'e'l' 'v'e'r's'c'h'i'l'l'e'n'd'e' 'd'i'n'g'e'n' 'a'h' 'b'o'u'w'e'n' 'e'n' 'd'e'e'l' 'g'r'a'a'g' 'd'e' 'd'e't'a'i'l's'",
    "topicsContributed": [
      "'S'i'n'd's' '~'2'0'0'3' 'a'c't'i'e'f' 'i's' 'w'e'b' 'w'e'r'e'l'd' 'i'n' 'a'l'l'e'r'h'a'n'd'e' 'r'o'l'l'e'n'.' ...",
      "'I'k' 'b'e'n' 'v'e'e'l' 'v'e'r's'c'h'i'l'l'e'n'd'e' 'd'i'n'g'e'n' 'a'h' 'b'o'u'w'e'n' 'e'n' 'd'e'e'l' 'g'r'a'a..."
    ]
  },
  {
    "name": "Mathieu D’Hondt",
    "role": "Bluemoon",
    "email": "mathieu@bluemoon.be",
    "phone": "(047) 736 22 82",
    "company": "Bluemoon",
    "website": "",
    "background": "'B'i'j' 'B'l'u'e' 'M'o'o'n' '('w'w'w'.'b'l'u'e'm'o'o'n'.'b'e')' 'v'e'r'a'n't'w'o'o'r'd'e'l'i'j'k' 'v'o'o'r' 'h'e't' 't'e'c'h'n'i's'c'h'e',' 'I'T' 'e'n' 'o'p'e'r'a't'i'o'n's' 'g'e'd'e'e'l't'e'.' ' 'I'n' 'd'i'e' 'h'o'e'd'a'n'i'g'h'e'i'd' 'e'n' 'v'a'n'u'i't' 'p'a's's'i'e' 'v'o'o'r' 'o'n'd'e'r'n'e'm'e'n',' 'o'n't'w'i'k'k'e'l'e'n' 'e'n' 't'e'c'h'n'o'l'o'g'i'e' 'v'o'l'g' 'i'k' 'v'a'n' 'd'i'c'h't'b'i'j' 'u'i't'e'r'a'a'r'd' 'o'o'k' 'd'e' 'A'I' 'o'n't'w'i'k'k'e'l'i'n'g'e'n'.' 'D'a'a'r'v'o'o'r' 'e'r'v'a'r'i'n'g' 'b'i'j' 'g'r'o't'e'r'e' 'c'o'r'p'o'r'a't'e's' 'a'l's' 'F'o'r't'i's' 'e'n' 'G'e'n'e'r'a'l' 'E'l'e'c't'r'i'c'.'",
    "goals": "Beter op de hoogte blijven en peer validation van het verschil tussen wat werkt en ruis.",
    "contributions": "'D'e' 'e'r'v'a'r'i'n'g'e'n' 'd'e'l'e'n' 'v'a'n' 'd'e' 'A'I' 't'r'a'n's'f'o'r'm'a't'i'e' 'v'a'n' 'e'e'n' 'K'M'O',' 'i'n' 'm'i'j'n' 'g'e'v'a'l' 'B'l'u'e' 'M'o'o'n'.'",
    "topicsContributed": [
      "'B'i'j' 'B'l'u'e' 'M'o'o'n' '('w'w'w'.'b'l'u'e'm'o'o'n'.'b'e')' 'v'e'r'a'n't'w'o'o'r'd'e'l'i'j'k' 'v'o'o'r' 'h...",
      "'D'e' 'e'r'v'a'r'i'n'g'e'n' 'd'e'l'e'n' 'v'a'n' 'd'e' 'A'I' 't'r'a'n's'f'o'r'm'a't'i'e' 'v'a'n' 'e'e'n' 'K'M'O..."
    ]
  },
  {
    "name": "Yannick Cuvelie",
    "role": "Profit Intelligence",
    "email": "yannick@profitintelligence.net",
    "phone": "(047) 484 74 93",
    "company": "Profit Intelligence",
    "website": "",
    "background": "'I'k' 'b'e'n' 'g'e's'p'e'c'i'a'l'i's'e'e'r'd' 'i'n' 'd'a't'a'b'a's'e's' 'e'n' 'd'a't'a'-'a'n'a'l'y's'e',' 'm'e't' 'e'e'n' 's't'e'r'k'e' 'f'o'c'u's' 'o'p' 'm'o'd'e'l'l'e'r'e'n' 'e'n' 'o'p't'i'm'a'l'i's'e'r'e'n' 'v'a'n' 'd'a't'a',' 'v'o'o'r'a'l' 'b'i'n'n'e'n' 'd'e' 'h'o't'e'l'b'r'a'n'c'h'e'.' 'D'a'a'r'n'a'a's't' 'o'n'd'e'r'z'o'e'k' 'i'k' 'o'o'k' 'h'o'e' 'A'I' 'k'a'n's'e'n' 'b'i'e'd't' 'i'n' 'K'M'O'’'s' 'e'n' 'd'e' 'c'o'r'p'o'r'a't'e' 'w'e'r'e'l'd',' 'w'a'a'r' 'n'o'g' 'v'e'e'l' 'p'o't'e'n't'i'e'e'l' 'l'i'g't'.'",
    "goals": "Ik wil in de AI-groep mijn kennis verdiepen, nieuwe inzichten opdoen en samen ontdekken hoe we AI kunnen inzetten om echte veranderingen teweeg te brengen in diverse sectoren.",
    "contributions": "'I'k' 'k'a'n' 'b'i'j'd'r'a'g'e'n' 'd'o'o'r' 'm'i'j'n' 'p'r'a'k't'i'j'k'e'r'v'a'r'i'n'g' 'm'e't' 'A'I' 't'e' 'd'e'l'e'n' 'e'n' 'a'c't'i'e'f' 'm'e'e' 't'e' 'd'e'n'k'e'n' 'o'v'e'r' 'c'o'n'c'r'e't'e' 't'o'e'p'a's's'i'n'g'e'n' 'b'i'n'n'e'n' 'o'n's' 't'e'a'm'.'",
    "topicsContributed": [
      "'I'k' 'b'e'n' 'g'e's'p'e'c'i'a'l'i's'e'e'r'd' 'i'n' 'd'a't'a'b'a's'e's' 'e'n' 'd'a't'a'-'a'n'a'l'y's'e',' 'm'e...",
      "'I'k' 'k'a'n' 'b'i'j'd'r'a'g'e'n' 'd'o'o'r' 'm'i'j'n' 'p'r'a'k't'i'j'k'e'r'v'a'r'i'n'g' 'm'e't' 'A'I' 't'e' 'd..."
    ]
  },
  {
    "name": "Bruno Van herendael",
    "role": "ZAS Healthcare",
    "email": "bruno.vanherendael@zas.be",
    "phone": "(048) 591 85 45",
    "company": "ZAS Healthcare",
    "website": "",
    "background": "'A'r't's'.' 'G'e's'p'e'c'i'a'l'i's'e'e'r'd' 'i'n' 'i'n'f'e'c't'i'e'z'i'e'k't'e'n' 'e'n' 'm'i'c'r'o'b'i'o'l'o'g'i'e'.' 'O'n'd'e'r't'u's's'e'n' 'l'e'i'd'i'n'g'g'e'v'e'n'd' 'm'i'c'r'o'b'i'o'l'o'o'g' 'i'n' 'l'a'b'o'r'a't'o'r'i'u'm' 'v'a'n' 'd'e' 'Z'A'S' 'z'i'e'k'e'n'h'u'i'z'e'n'.' 'D'o'o'r' 'm'e'e'r'd'e'r'e' 'f'u's'i'e's' 'z'i'j'n' 'w'e' ' 'n'u' 'g'r'o'o't's't'e' 'z'i'e'k'e'n'h'u'i's'l'a'b' 'v'a'n' 'B'e'l'g'i'ë' 'm'e't' '3'0'0' 'w'e'r'k'n'e'm'e'r's'.' 'N'o'g' 'w'e'i'n'i'g' 'A'I' 'u'p't'a'k'e' 'i'n' 'o'n's' 'l'a'b'o' 'd'u's' 'v'e'e'l' 'r'u'i'm't'e' 'v'o'o'r' 'v'e'r'b'e't'e'r'i'n'g'.'",
    "goals": "Meenemen van ideeën die ik kan implementeren in mijn dagelijks werk. Links naar interessante tools en opleidingen die door anderen al getest zijn.",
    "contributions": "'W'a'a'r's'c'h'i'j'n'l'i'j'k' 'v'o'o'r'l'o'p'i'g' 'n'i'e't' 'a'l' 't'e' 'v'e'e'l'.' 'B'e'n' 'z'e'l'f' 'v'o'o'r'a'l's'n'o'g' 'n'i'e't' 'a'l' 't'e' 'b'e's'l'a'g'e'n' 'i'n' 'v'e'r's'c'h'i'l'l'e'n'd'e' 'A'I' 't'o'o'l's'.' 'I'k' 'd'a'c'h't' 'm'e' 'i'n' 'd'e' 'e'e'r's't'e' 'p'l'a'a't's' 't'e' 'v'e'r'd'i'e'p'e'n' 'i'n' 'C'o'P'i'l'o't' 'g'e'z'i'e'n' 'm'i'j'n' 'w'e'r'k'p'l'e'k' 'e'e'n' 'O'f'f'i'c'e' '3'6'5' 'o'm'g'e'v'i'n'g' 'i's' 'e'n' 'd'i't' 'm'e' 'o'p' 'w'e'r'k'g'e'b'i'e'd' 'd'e' 's'n'e'l's't'e' 's't'a'p' 'v'o'o'r'w'a'a'r't's' 'l'i'j'k't'.' 'D'u's' 'a'l's' 'i'k' 'd'a'a'r' 'i'n't'e'r'e's's'a'n't'e' 'u's'e' 'c'a's'e's' 'v'i'n'd' 'w'i'l' 'i'k' 'd'i'e' 'o'o'i't' 'w'e'l' 'v'o'o'r's't'e'l'l'e'n'.'",
    "topicsContributed": [
      "'A'r't's'.' 'G'e's'p'e'c'i'a'l'i's'e'e'r'd' 'i'n' 'i'n'f'e'c't'i'e'z'i'e'k't'e'n' 'e'n' 'm'i'c'r'o'b'i'o'l'o'g...",
      "'W'a'a'r's'c'h'i'j'n'l'i'j'k' 'v'o'o'r'l'o'p'i'g' 'n'i'e't' 'a'l' 't'e' 'v'e'e'l'.' 'B'e'n' 'z'e'l'f' 'v'o'o'r..."
    ]
  },
  {
    "name": "Staf Van Lierde",
    "role": "Cynexia",
    "email": "svl@cynexia.be",
    "phone": "(047) 272 88 00",
    "company": "Cynexia",
    "website": "",
    "background": "'P'r'o'g'r'a'm'm'e'u'r' 'v'a'n' 'o'p'l'e'i'd'i'n'g',' 'h'e'b' 'n'u' 'e'e'n' 'c'u'r's'u's' 'b'i'j' 'S'y'n't'r'a':' 'L'o'c'a'l' 'L'a'r'g'e' 'L'a'n'g'u'a'g'e' 'M'o'd'e'l' 'S'p'e'c'i'a'l'i's't'",
    "goals": "Technische kennis uitwisseling",
    "contributions": "'D'e's'n'o'o'd's' 'e'l'k' 's't'u'k'k'e'n' 'v'e'r'd'e'r' 'd'a'n' 'g'e'w'o'o'n'l'i'j'k' 'o'n'd'e'r'z'o'e'k'e'n' 'e'n' 'd'e'l'e'n'",
    "topicsContributed": [
      "'P'r'o'g'r'a'm'm'e'u'r' 'v'a'n' 'o'p'l'e'i'd'i'n'g',' 'h'e'b' 'n'u' 'e'e'n' 'c'u'r's'u's' 'b'i'j' 'S'y'n't'r'a...",
      "'D'e's'n'o'o'd's' 'e'l'k' 's't'u'k'k'e'n' 'v'e'r'd'e'r' 'd'a'n' 'g'e'w'o'o'n'l'i'j'k' 'o'n'd'e'r'z'o'e'k'e'n' ..."
    ]
  }
]
};
