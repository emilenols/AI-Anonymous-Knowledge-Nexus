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
    { name: "Emile Nols", role: "AI Dev / Creator", linkedin: "https://www.linkedin.com/in/emilenols", topicsContributed: ["Tailscale", "Open Code Review", "Buzz"] },
    { name: "Jef Cavens", role: "AI Architect / Notiva", topicsContributed: ["AI Pattern Book", "Lilian Weng Harnesses", "Ornn", "Museum of AI Failures"] },
    { name: "Philip Van Ceulebroeck", role: "Prompt Engineer", topicsContributed: ["Caveman AI Prompting"] },
    { name: "Xavier Leclair", role: "Agent Workflows & Hospitality", topicsContributed: ["Autonomous Agent Workflows"] },
    { name: "Patrik", role: "IT @ DNA & PilarBKK", topicsContributed: ["Local Inference & Enterprise Integration"] },
    { name: "Johannes", role: "Co-Founder PilarBKK", topicsContributed: ["Problem Solving & AI Tooling"] },
    { name: "Jef Van Gool", role: "SaaS Creator", topicsContributed: ["Snowskiproperty"] },
    { name: "+31 6 41488324", role: "Hardware Enthusiast", topicsContributed: ["Dual-CPU RTX 6000 Pro Workstation", "Elgato Stream Deck"] }
  ]
};
