// ==========================================================================
// CRYPTOGRAPHIC PASSCODE AUTHENTICATION GATE
// High-Security Salted Hashing & Timing-Safe Verification
// ==========================================================================
const PASSCODE_SALT = "ai_anon_salt_2026";
const PASSCODE_HASH = "0ac2c403ccc603101f9f6f30e102266fb80c3ba75f0b213a59f8973e66e9b7b6"; // Salted SHA-256 digest of passcode
const EXPECTED_AUTH_TOKEN = "5d8ab8d2990926af6b0cd591eeb1ff287a84f6fc7231faffca5f9583c977a208"; // Salted SHA-256 digest of (PASSCODE_HASH + PASSCODE_SALT)
const AUTH_KEY = "ai_anon_auth_token";
const ATTEMPTS_KEY = "ai_anon_auth_attempts";
const LOCKOUT_KEY = "ai_anon_auth_lockout";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30000; // 30 seconds lockout cooldown

/**
 * Computes SHA-256 digest using browser Web Crypto API
 */
async function hashPasscode(passcode, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(passcode + salt);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Timing-safe string comparison to prevent timing side-channel attacks
 */
function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

(function checkAuthGate() {
  const token = sessionStorage.getItem(AUTH_KEY);
  const isAuth = token && timingSafeEqual(token, EXPECTED_AUTH_TOKEN);
  if (isAuth) {
    document.documentElement.classList.remove("locked-gate");
    window.addEventListener("DOMContentLoaded", () => {
      document.body.classList.remove("locked");
      const gate = document.getElementById("auth-gate-modal");
      if (gate) gate.classList.remove("active");
    });
  } else {
    document.documentElement.classList.add("locked-gate");
    window.addEventListener("DOMContentLoaded", () => {
      document.body.classList.add("locked");
      const gate = document.getElementById("auth-gate-modal");
      if (gate) gate.classList.add("active");
      checkLockoutStatus();
    });
  }
})();

function checkLockoutStatus() {
  const lockoutTime = parseInt(localStorage.getItem(LOCKOUT_KEY) || "0", 10);
  const now = Date.now();
  const errorMsg = document.getElementById("auth-error-msg");
  const input = document.getElementById("passcode-input");
  const submitBtn = document.querySelector("#auth-gate-modal button[type='submit']");

  if (lockoutTime > now) {
    const remainingSec = Math.ceil((lockoutTime - now) / 1000);
    if (errorMsg) {
      errorMsg.textContent = `Too many failed attempts. Locked out for ${remainingSec}s.`;
      errorMsg.style.display = "block";
    }
    if (input) input.disabled = true;
    if (submitBtn) submitBtn.disabled = true;

    setTimeout(() => {
      checkLockoutStatus();
    }, 1000);
    return true;
  } else {
    if (lockoutTime > 0) {
      localStorage.removeItem(LOCKOUT_KEY);
      localStorage.removeItem(ATTEMPTS_KEY);
      if (errorMsg) errorMsg.style.display = "none";
      if (input) input.disabled = false;
      if (submitBtn) submitBtn.disabled = false;
    }
    return false;
  }
}

async function verifyPasscode(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("passcode-input");
  const errorMsg = document.getElementById("auth-error-msg");
  if (!input) return false;

  if (checkLockoutStatus()) return false;

  const val = input.value.trim();
  if (!val) return false;

  try {
    const computedHash = await hashPasscode(val, PASSCODE_SALT);
    if (timingSafeEqual(computedHash, PASSCODE_HASH)) {
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);

      sessionStorage.setItem(AUTH_KEY, EXPECTED_AUTH_TOKEN);
      document.documentElement.classList.remove("locked-gate");
      document.body.classList.remove("locked");
      const gate = document.getElementById("auth-gate-modal");
      if (gate) gate.classList.remove("active");
      if (typeof showToast === "function") {
        showToast("Passcode accepted! Welcome to AI Anonymous.");
      }
    } else {
      let attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || "0", 10) + 1;
      localStorage.setItem(ATTEMPTS_KEY, attempts.toString());

      if (attempts >= MAX_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
        localStorage.setItem(LOCKOUT_KEY, lockoutTime.toString());
        checkLockoutStatus();
      } else {
        const remaining = MAX_ATTEMPTS - attempts;
        if (errorMsg) {
          errorMsg.textContent = `Incorrect passcode. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`;
          errorMsg.style.display = "block";
        }
        input.value = "";
        input.focus();
      }
    }
  } catch (err) {
    console.error("Authentication error:", err);
    if (errorMsg) {
      errorMsg.textContent = "An error occurred during verification. Please try again.";
      errorMsg.style.display = "block";
    }
  }
  return false;
}

function lockSession() {
  sessionStorage.removeItem(AUTH_KEY);
  document.documentElement.classList.add("locked-gate");
  document.body.classList.add("locked");
  const gate = document.getElementById("auth-gate-modal");
  if (gate) gate.classList.add("active");
  const input = document.getElementById("passcode-input");
  if (input) {
    input.value = "";
    input.disabled = false;
  }
  const submitBtn = document.querySelector("#auth-gate-modal button[type='submit']");
  if (submitBtn) submitBtn.disabled = false;
  checkLockoutStatus();
}

// AI Anonymous Main Application Logic
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

let currentCategory = "all";
let currentSearch = "";
let currentTopicData = null;
let activePromptTab = "deepDive";

function initApp() {
  renderStats();
  renderCategoryPills();
  renderTopics();
  renderResources();
  initCountdown();
  setupEventListeners();
}

function renderStats() {
  const md = KNOWLEDGE_DATA.metadata || {};
  const periodEl = document.getElementById("hero-period");
  if (periodEl && md.periodLabel) periodEl.textContent =
    `Live Group Intelligence Archive • ${md.periodLabel}`;
  const tEl = document.getElementById("stat-topics");
  const lEl = document.getElementById("stat-links");
  const mEl = document.getElementById("stat-members");

  if (tEl && KNOWLEDGE_DATA.topics) tEl.textContent = KNOWLEDGE_DATA.topics.length;
  if (lEl && KNOWLEDGE_DATA.resources) lEl.textContent = KNOWLEDGE_DATA.resources.length;
  // the label says "people who posted" — count exactly that, not the directory
  if (mEl && KNOWLEDGE_DATA.members) mEl.textContent =
    KNOWLEDGE_DATA.members.filter(m => m.messages > 0).length;
}

function renderCategoryPills() {
  const container = document.getElementById("category-pills");
  if (!container || !KNOWLEDGE_DATA.categories) return;

  container.innerHTML = KNOWLEDGE_DATA.categories.map(cat => `
    <button class="pill ${cat.id === currentCategory ? 'active' : ''}" data-cat="${cat.id}">
      <span>${cat.name}</span>
    </button>
  `).join('');

  container.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentCategory = e.currentTarget.getAttribute('data-cat');
      renderCategoryPills();
      renderTopics();
    });
  });
}

function getCategoryColor(catId) {
  const cat = KNOWLEDGE_DATA.categories.find(c => c.id === catId);
  return cat ? cat.color : "#6366f1";
}

function getCategoryName(catId) {
  const cat = KNOWLEDGE_DATA.categories.find(c => c.id === catId);
  return cat ? cat.name : catId;
}

function renderTopics() {
  const grid = document.getElementById("topics-grid");
  if (!grid || !KNOWLEDGE_DATA.topics) return;

  const filtered = KNOWLEDGE_DATA.topics.filter(t => {
    const matchCat = currentCategory === "all" || t.category === currentCategory;
    const q = currentSearch.toLowerCase();
    const matchSearch = !q || 
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q)) ||
      (t.participants || []).some(author => author.toLowerCase().includes(q)) ||
      (t.positions || []).some(p => p.quote.toLowerCase().includes(q) ||
                                    p.claim.toLowerCase().includes(q));

    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-glass);">
        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 8px;">No topics found matching your query "${currentSearch}".</p>
        <p style="font-size: 0.85rem; color: var(--text-dim);">Try searching for terms like "GB10", "Hetzner", "Hermes", "FinBERT", or "Pliny".</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(t => {
    const color = getCategoryColor(t.category);
    return `
      <article class="topic-card" style="border-top: 3px solid ${color};">
        <div class="card-top">
          <div class="card-meta">
            <span class="category-tag" style="background: ${color}20; color: ${color}; border: 1px solid ${color}40;">
              ${getCategoryName(t.category)}
            </span>
            <span class="date-tag">${t.dateRange || t.date}</span>
            <span class="status-pill status-${t.status}" title="${(t.statusReason || '').replace(/"/g,'&quot;')}">${t.status}</span>
          </div>

          <h3 class="card-title">${t.title}</h3>
          <p class="card-summary">${t.summary}</p>

          <ul class="positions-list">
            ${(t.positions || []).slice(0, 2).map(p => `
              <li>
                <span class="pos-speaker">${p.speaker}</span>
                <span class="cert-badge cert-${p.certainty}">${p.certainty.replace(/_/g,' ')}</span>
                <span class="pos-claim">${p.claim}</span>
              </li>`).join('')}
          </ul>
          ${t.factChecks && t.factChecks.length ? `<div class="fc-flag">⚑ ${t.factChecks.length} fact-check${t.factChecks.length>1?'s':''}</div>` : ''}

          <div class="tags-container">
            ${t.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
          </div>
        </div>

        <div class="card-footer">
          <div class="author-info">
            <div class="author-avatar">${(t.participants && t.participants[0] || '?').charAt(0)}</div>
            <span>${(t.participants || []).join(', ')}</span>
          </div>

          <button class="btn-card-action" onclick="openTopicModal('${t.id}')">
            <span>Dig Deeper</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function renderResources() {
  const grid = document.getElementById("resources-grid");
  if (!grid || !KNOWLEDGE_DATA.resources) return;

  grid.innerHTML = KNOWLEDGE_DATA.resources.map(res => `
    <div class="resource-item">
      <div>
        <h4 class="res-name">${res.title || res.name}</h4>
        <p class="res-desc">${res.topic || res.desc || ''}</p>
      </div>
      <div class="res-meta">
        <span>Shared by: ${res.sharedBy}${res.date ? ' · ' + res.date : ''}</span>
        ${res.evidence ? `<span class="evidence-chip" title="Traced to this message in the transcript">${res.evidence}</span>` : ''}
        <a href="${res.url}" target="_blank" rel="noopener" class="res-link">
          <span>Open Link</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
        </a>
      </div>
    </div>
  `).join('');
}

/* Topic Modal & AI Prompt Studio */
function openTopicModal(topicId) {
  const topic = KNOWLEDGE_DATA.topics.find(t => t.id === topicId);
  if (!topic) return;

  currentTopicData = topic;
  activePromptTab = "deepDive";

  document.getElementById("modal-title").textContent = topic.title;
  document.getElementById("modal-category").textContent = getCategoryName(topic.category);
  document.getElementById("modal-summary").textContent = topic.summary;

  // Status banner — replaces the old "Group Consensus" framing
  const statusEl = document.getElementById("modal-status");
  if (statusEl) {
    statusEl.innerHTML = `
      <span class="status-pill status-${topic.status}">${topic.status}</span>
      <span class="status-reason">${topic.shape || ''}</span>`;
  }

  // Positions — every one carries its verbatim quote and its evidence
  const takeList = document.getElementById("modal-takeaways");
  takeList.innerHTML = (topic.positions || []).map(p => `
    <li class="position">
      <div class="pos-head">
        <span class="pos-speaker">${p.speaker}</span>
        <span class="stance-badge">${p.stanceLabel || p.stance}</span>
        <span class="cert-badge cert-${p.certainty}">${p.certainty.replace(/_/g,' ')}</span>
        <span class="pos-date">${p.date || ''}</span>
      </div>
      <p class="pos-claim">${p.claim}</p>
      <blockquote class="pos-quote">
        <span class="q-orig">“${p.quote}”</span>
        ${p.translation && p.translation.replace(/[^a-z0-9]/gi,'').toLowerCase() !== p.quote.replace(/[^a-z0-9]/gi,'').toLowerCase() ? `<span class="q-trans">${p.translation}</span>` : ''}
      </blockquote>
      <div class="pos-evidence">
        ${(p.evidence || []).map(e => `<span class="evidence-chip" title="Message ID in the transcript">${e}</span>`).join('')}
      </div>
    </li>`).join('');

  // Fact-checks — external research, kept visually separate from what members said
  const fcWrap = document.getElementById("modal-factchecks");
  if (fcWrap) {
    const fcs = topic.factChecks || [];
    fcWrap.innerHTML = fcs.length ? `
      <h4 class="section-label">Fact-check <span class="section-note">— external research, not from the chat</span></h4>
      ${fcs.map(f => `
        <div class="factcheck">
          <div class="fc-verdict">${f.verdict}</div>
          <p class="fc-fact">${f.correctedFact}</p>
          ${f.note ? `<p class="fc-note">${f.note}</p>` : ''}
          ${(f.sources || []).length ? `<div class="fc-sources">${
            f.sources.map(u => `<a href="${u}" target="_blank" rel="noopener">${u.replace(/^https?:\/\/(www\.)?/,'').split('/')[0]}</a>`).join('')
          }</div>` : ''}
        </div>`).join('')}` : '';
  }

  const linksContainer = document.getElementById("modal-links");
  if (topic.links && topic.links.length > 0) {
    linksContainer.innerHTML = topic.links.map(l => `
      <a href="${l.url}" target="_blank" class="res-link" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
        🔗 <strong>${l.title}</strong> (${l.sharedBy})
      </a>
    `).join('');
  } else {
    linksContainer.innerHTML = '<span style="color: var(--text-dim); font-size: 0.85rem;">No external links attached.</span>';
  }

  // Render Interactive Tool if topic has one
  const toolContainer = document.getElementById("modal-tool-container");
  if (topic.hasTool === "vramCalc") {
    toolContainer.innerHTML = renderVramCalculatorHTML();
    initVramCalculatorLogic();
  } else if (topic.hasTool === "tokenCalc") {
    toolContainer.innerHTML = renderTokenCalculatorHTML();
    initTokenCalculatorLogic();
  } else if (topic.hasTool === "agentFactorySim") {
    toolContainer.innerHTML = renderAgentFactorySimulatorHTML();
    initAgentFactorySimulatorLogic();
  } else if (topic.hasTool === "freeTierCalc") {
    toolContainer.innerHTML = renderFreeTierCalculatorHTML();
    initFreeTierCalculatorLogic();
  } else {
    toolContainer.innerHTML = '';
  }

  renderPromptText();

  const overlay = document.getElementById("topic-modal");
  overlay.classList.add("active");
}

function closeTopicModal() {
  document.getElementById("topic-modal").classList.remove("active");
}

function setPromptTab(tabName) {
  activePromptTab = tabName;
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
  });
  renderPromptText();
}

function renderPromptText() {
  if (!currentTopicData || !currentTopicData.prompts) return;
  const text = currentTopicData.prompts[activePromptTab] || "No prompt template available.";
  document.getElementById("prompt-content").textContent = text;
}

function copyActivePrompt() {
  const text = document.getElementById("prompt-content").textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast("AI Prompt copied to clipboard! Ready to paste into Claude / ChatGPT.");
  }).catch(err => {
    showToast("Failed to copy. Please select text manually.");
  });
}

/* Interactive Calculators & Simulators */

function renderVramCalculatorHTML() {
  return `
    <div class="calc-card">
      <div class="calc-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 1 0-10z"/></svg>
        <span>Interactive Local Workstation VRAM & NUMA Calculator</span>
      </div>
      
      <div class="slider-group">
        <div class="slider-label">
          <span>Target Model Parameters:</span>
          <strong id="vram-params-lbl">32B Parameters (e.g., Qwen VL 32B)</strong>
        </div>
        <input type="range" min="8" max="70" step="1" value="32" id="vram-params-slider" class="custom-slider">
      </div>

      <div class="slider-group">
        <div class="slider-label">
          <span>Quantization Precision:</span>
          <strong id="vram-quant-lbl">Q4_K_M (4-bit - Optimal VRAM/Speed)</strong>
        </div>
        <select id="vram-quant-select" class="btn-secondary" style="width: 100%; margin-top: 4px;">
          <option value="4">4-bit (Q4_K_M / Q4_0) - Best VRAM Efficiency</option>
          <option value="8">8-bit (Q8_0 / INT8) - Near-FP16 Accuracy</option>
          <option value="16">16-bit (FP16 / BF16) - Full Uncompressed Precision</option>
        </select>
      </div>

      <div class="calc-result">
        <div>
          <div class="res-val" id="res-vram-needed">22.4 GB</div>
          <div class="res-lbl">Required VRAM</div>
        </div>
        <div>
          <div class="res-val" id="res-recommended-gpu" style="color: var(--accent-secondary);">RTX 4090 / 6000 Pro</div>
          <div class="res-lbl">Recommended Hardware</div>
        </div>
        <div>
          <div class="res-val" id="res-numa-warning" style="color: var(--accent-warning);">Single CPU Preferred</div>
          <div class="res-lbl">NUMA Risk Status</div>
        </div>
      </div>
    </div>
  `;
}

function initVramCalculatorLogic() {
  const slider = document.getElementById("vram-params-slider");
  const select = document.getElementById("vram-quant-select");
  if (!slider || !select) return;

  const update = () => {
    const params = parseInt(slider.value);
    const bits = parseInt(select.value);

    document.getElementById("vram-params-lbl").textContent = `${params}B Parameters`;

    const vramNeeded = ((params * bits / 8) * 1.25).toFixed(1);
    document.getElementById("res-vram-needed").textContent = `${vramNeeded} GB`;

    let gpu = "Single RTX 4080 (16GB)";
    if (vramNeeded > 40) {
      gpu = "NVIDIA RTX 6000 Pro / GB10 Superchip";
    } else if (vramNeeded > 20) {
      gpu = "NVIDIA RTX 4090 (24GB) / RTX 6000";
    } else if (vramNeeded > 12) {
      gpu = "NVIDIA RTX 4080 / 3090";
    }
    document.getElementById("res-recommended-gpu").textContent = gpu;
  };

  slider.addEventListener("input", update);
  select.addEventListener("change", update);
  update();
}

function renderTokenCalculatorHTML() {
  return `
    <div class="calc-card">
      <div class="calc-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        <span>Caveman AI Prompt Token Savings Calculator</span>
      </div>

      <div class="slider-group">
        <div class="slider-label">
          <span>Monthly Prompts Sent:</span>
          <strong id="token-prompts-lbl">2,500 Prompts / Month</strong>
        </div>
        <input type="range" min="200" max="10000" step="100" value="2500" id="token-prompts-slider" class="custom-slider">
      </div>

      <div class="calc-result">
        <div>
          <div class="res-val" id="res-tokens-saved">1.62 M</div>
          <div class="res-lbl">Output Tokens Saved</div>
        </div>
        <div>
          <div class="res-val" id="res-cost-saved" style="color: var(--accent-success);">$24.30 / mo</div>
          <div class="res-lbl">Estimated API Savings</div>
        </div>
        <div>
          <div class="res-val" id="res-latency-boost" style="color: var(--accent-secondary);">2.8x Faster</div>
          <div class="res-lbl">Generation Speedup</div>
        </div>
      </div>
    </div>
  `;
}

function initTokenCalculatorLogic() {
  const slider = document.getElementById("token-prompts-slider");
  if (!slider) return;

  const update = () => {
    const prompts = parseInt(slider.value);
    document.getElementById("token-prompts-lbl").textContent = `${prompts.toLocaleString()} Prompts / Month`;

    const savedTokens = prompts * 650;
    const millionSaved = (savedTokens / 1000000).toFixed(2);
    document.getElementById("res-tokens-saved").textContent = `${millionSaved} M`;

    const costSaved = (millionSaved * 15).toFixed(2);
    document.getElementById("res-cost-saved").textContent = `$${costSaved} / mo`;
  };

  slider.addEventListener("input", update);
  update();
}

function renderAgentFactorySimulatorHTML() {
  return `
    <div class="calc-card">
      <div class="calc-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span>Jef Van Gool's Agentic Coding Factory Simulator</span>
      </div>

      <div class="slider-group">
        <div class="slider-label">
          <span>Active Client Subagents (Isolated Worktrees):</span>
          <strong id="factory-agents-lbl">18 Active Subagents</strong>
        </div>
        <input type="range" min="1" max="50" step="1" value="18" id="factory-agents-slider" class="custom-slider">
      </div>

      <div class="slider-group">
        <div class="slider-label">
          <span>Model Routing Ratio:</span>
          <strong id="factory-routing-lbl">80% Sonnet 3.7 / 20% Opus Fallback</strong>
        </div>
        <select id="factory-routing-select" class="btn-secondary" style="width: 100%; margin-top: 4px;">
          <option value="90">90% Sonnet / 10% Opus (Standard Feature Builds)</option>
          <option value="80" selected>80% Sonnet / 20% Opus (Standard Factory Pipeline)</option>
          <option value="50">50% Sonnet / 50% Opus (High Complexity Refactoring Swarm)</option>
        </select>
      </div>

      <div class="calc-result">
        <div>
          <div class="res-val" id="res-worktrees">18 Worktrees</div>
          <div class="res-lbl">Git Worktree Containers</div>
        </div>
        <div>
          <div class="res-val" id="res-monthly-spend" style="color: var(--accent-success);">$184.00 / mo</div>
          <div class="res-lbl">Token Governor Spend</div>
        </div>
        <div>
          <div class="res-val" id="res-qa-gate" style="color: var(--accent-cyan);">CodeRabbit Automated</div>
          <div class="res-lbl">QA Gate Protocol</div>
        </div>
      </div>
    </div>
  `;
}

function initAgentFactorySimulatorLogic() {
  const slider = document.getElementById("factory-agents-slider");
  const select = document.getElementById("factory-routing-select");
  if (!slider || !select) return;

  const update = () => {
    const agents = parseInt(slider.value);
    const sonnetRatio = parseInt(select.value) / 100;
    const opusRatio = 1 - sonnetRatio;

    document.getElementById("factory-agents-lbl").textContent = `${agents} Active Subagents`;
    document.getElementById("res-worktrees").textContent = `${agents} Worktrees`;

    // Base cost per agent with token governor = ~$10/mo for Sonnet, ~$35/mo for Opus
    const estSpend = agents * (sonnetRatio * 8 + opusRatio * 32);
    document.getElementById("res-monthly-spend").textContent = `$${estSpend.toFixed(0)}.00 / mo`;
  };

  slider.addEventListener("input", update);
  select.addEventListener("change", update);
  update();
}

function renderFreeTierCalculatorHTML() {
  return `
    <div class="calc-card">
      <div class="calc-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <span>2.7M Article Processing: Free-Tier Stacking vs Paid LLM Estimator</span>
      </div>

      <div class="slider-group">
        <div class="slider-label">
          <span>Total Articles to Process:</span>
          <strong id="freetier-articles-lbl">2,700,000 Articles</strong>
        </div>
        <input type="range" min="100000" max="5000000" step="100000" value="2700000" id="freetier-articles-slider" class="custom-slider">
      </div>

      <div class="calc-result">
        <div>
          <div class="res-val" id="res-freetier-cost" style="color: var(--accent-success);">$0.00 (Free)</div>
          <div class="res-lbl">freellmapi Cost (~28 Providers)</div>
        </div>
        <div>
          <div class="res-val" id="res-paid-deepseek" style="color: var(--accent-cyan);">$324.00</div>
          <div class="res-lbl">DeepSeek V3/V4 Paid Batch</div>
        </div>
        <div>
          <div class="res-val" id="res-stacking-time" style="color: var(--accent-warning);">4.2 Days</div>
          <div class="res-lbl">Est. Free-Tier Rate-Limit Latency</div>
        </div>
      </div>
    </div>
  `;
}

function initFreeTierCalculatorLogic() {
  const slider = document.getElementById("freetier-articles-slider");
  if (!slider) return;

  const update = () => {
    const articles = parseInt(slider.value);
    document.getElementById("freetier-articles-lbl").textContent = `${(articles / 1000000).toFixed(2)} M Articles`;

    // 2.7M articles ~810M tokens. DeepSeek batch is ~$0.40 per M tokens
    const tokensM = (articles * 300) / 1000000;
    const paidCost = (tokensM * 0.40).toFixed(2);
    document.getElementById("res-paid-deepseek").textContent = `$${paidCost}`;

    // Rate-limit latency for freellmapi (~4B tokens/mo ceiling)
    const days = (tokensM / 200).toFixed(1);
    document.getElementById("res-stacking-time").textContent = `${days} Days`;
  };

  slider.addEventListener("input", update);
  update();
}

/* Event Countdown Timer */
function initCountdown() {
  if (!KNOWLEDGE_DATA.metadata || !KNOWLEDGE_DATA.metadata.nextEvent) return;
  const target = new Date(KNOWLEDGE_DATA.metadata.nextEvent.date).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = target - now;

    const dEl = document.getElementById("cd-days");
    const hEl = document.getElementById("cd-hours");
    const mEl = document.getElementById("cd-mins");
    const sEl = document.getElementById("cd-secs");

    if (!dEl || !hEl || !mEl || !sEl) return;

    if (diff <= 0) {
      dEl.textContent = "00";
      hEl.textContent = "00";
      mEl.textContent = "00";
      sEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    dEl.textContent = String(days).padStart(2, '0');
    hEl.textContent = String(hours).padStart(2, '0');
    mEl.textContent = String(mins).padStart(2, '0');
    sEl.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* Maintainer Studio (5-Minute Daily Update Tool) */
function openMaintainerStudio() {
  const modal = document.getElementById("maintainer-modal");
  if (modal) modal.classList.add("active");
}

function closeMaintainerStudio() {
  const modal = document.getElementById("maintainer-modal");
  if (modal) modal.classList.remove("active");
}

function parseAndImportText() {
  const input = document.getElementById("maintainer-input");
  if (!input) return;
  const text = input.value.trim();
  if (!text) {
    showToast("Please paste group chat summary text first.");
    return;
  }

  const titleMatch = text.match(/^([^\n]+)/);
  const title = titleMatch ? titleMatch[1].replace(/^[#\s*]+/, '') : "New Group Summary Update";

  const newTopic = {
    id: "topic-" + Date.now(),
    category: "vibe",
    title: title,
    summary: text.slice(0, 220) + "...",
    date: "Just now",
    sharedBy: ["Group Admin"],
    keyTakeaways: [
      "Imported directly via 5-Minute Maintainer Studio.",
      "Indexed instantly into local Knowledge Nexus state."
    ],
    tags: ["Daily Update", "WhatsApp Summary"],
    prompts: {
      deepDive: `Analyze this newly imported topic from AI Anonymous: ${title}. Provide an architectural assessment.`,
      codeGen: `Write a prototype script to test the key concepts mentioned in: ${title}.`,
      executive: `Summarize the impact of ${title} for engineering leaders.`
    }
  };

  KNOWLEDGE_DATA.topics.unshift(newTopic);
  renderStats();
  renderTopics();
  closeMaintainerStudio();
  showToast("New group summary imported and published locally!");
}

/* General Event Listeners & Toast Notifications */
function setupEventListeners() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderTopics();
    });
  }

  // Backdrop click dismiss for mobile modals
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    });
  });
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
