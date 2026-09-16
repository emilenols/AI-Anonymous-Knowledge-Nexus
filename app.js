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
let currentCategory = "all";
let currentStatusFilter = "all";
let viewDensity = "cards";
let currentSearch = "";
let resourceSearchQuery = "";
let currentTopicData = null;
let activePromptTab = "deepDive";
let contribSortMetric = "handsOn";
let contribShowAll = false;

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  renderStats();
  renderContributors();
  renderCategoryPills();
  renderStatusPills();
  renderTopics();
  renderStickyIndexBar();
  renderWordCloud();
  renderResources();
  setupEventListeners();
}

function getRoleBadgeClass(role) {
  if (!role) return 'role-grey';
  const r = role.toLowerCase();
  if (r === 'builder' || r === 'practitioner') return 'role-green';
  if (r === 'curator' || r === 'connector') return 'role-blue';
  if (r === 'analyst') return 'role-purple';
  if (r === 'challenger') return 'role-orange';
  return 'role-grey';
}

function handleContribSortChange(value) {
  contribSortMetric = value;
  renderContributors();
}

function toggleContribShowAll() {
  contribShowAll = !contribShowAll;
  renderContributors();
}

function renderContributors() {
  const grid = document.getElementById("contributors-grid");
  const toggleBtn = document.getElementById("contrib-toggle-btn");
  if (!grid || typeof KNOWLEDGE_DATA === 'undefined' || !KNOWLEDGE_DATA.contributors) return;

  const list = [...KNOWLEDGE_DATA.contributors];

  list.sort((a, b) => {
    const valA = a[contribSortMetric] !== undefined ? a[contribSortMetric] : 0;
    const valB = b[contribSortMetric] !== undefined ? b[contribSortMetric] : 0;
    if (valB !== valA) {
      return valB - valA;
    }
    const msgDiff = (b.messages || 0) - (a.messages || 0);
    if (msgDiff !== 0) return msgDiff;
    return (a.name || '').localeCompare(b.name || '');
  });

  const totalCount = list.length;
  const limit = contribShowAll ? totalCount : Math.min(12, totalCount);
  const visible = list.slice(0, limit);

  grid.innerHTML = visible.map(c => {
    const roleClass = getRoleBadgeClass(c.role);
    const roleWhyAttr = c.roleWhy ? `title="${c.roleWhy.replace(/"/g, '&quot;')}"` : '';
    const roleBadgeHtml = c.role
      ? `<span class="contrib-role-badge ${roleClass}" ${roleWhyAttr}>${c.role}</span>`
      : '';

    return `
      <div class="contrib-card">
        <div class="contrib-card-header">
          <h4 class="contrib-name">${c.name || ''}</h4>
          ${roleBadgeHtml}
        </div>
        <div class="contrib-stats-grid">
          <div class="contrib-stat-item">
            <span class="contrib-stat-val">${c.messages !== undefined ? c.messages : ''}</span>
            <span class="contrib-stat-lbl">Messages</span>
          </div>
          <div class="contrib-stat-item">
            <span class="contrib-stat-val">${c.handsOn !== undefined ? c.handsOn : ''}</span>
            <span class="contrib-stat-lbl">Hands-on</span>
          </div>
          <div class="contrib-stat-item">
            <span class="contrib-stat-val">${c.threads !== undefined ? c.threads : ''}</span>
            <span class="contrib-stat-lbl">Threads</span>
          </div>
          <div class="contrib-stat-item">
            <span class="contrib-stat-val">${c.links !== undefined ? c.links : ''}</span>
            <span class="contrib-stat-lbl">Links</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (toggleBtn) {
    const btnSpan = toggleBtn.querySelector('span');
    const label = contribShowAll ? "Show top 12" : `Show all (${totalCount})`;
    if (btnSpan) {
      btnSpan.textContent = label;
    } else {
      toggleBtn.textContent = label;
    }
  }
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
      renderResources();
    });
  });
}

function renderStatusPills() {
  const container = document.getElementById("status-pills");
  if (!container) return;

  const statuses = [
    { id: "all", label: "All Statuses" },
    { id: "contested", label: "Contested" },
    { id: "open", label: "Open" },
    { id: "resolved", label: "Resolved" }
  ];

  container.innerHTML = statuses.map(s => `
    <button class="status-pill-btn ${s.id === currentStatusFilter ? 'active' : ''}" data-status="${s.id}" onclick="setStatusFilter('${s.id}')">
      <span>${s.label}</span>
    </button>
  `).join('');
}

function setStatusFilter(statusId) {
  currentStatusFilter = statusId;
  renderStatusPills();
  renderTopics();
}

function setDensity(density) {
  viewDensity = density;
  const toggleBtnCards = document.querySelector('.density-toggle .toggle-btn[data-density="cards"]');
  const toggleBtnCompact = document.querySelector('.density-toggle .toggle-btn[data-density="compact"]');
  if (toggleBtnCards) toggleBtnCards.classList.toggle('active', density === 'cards');
  if (toggleBtnCompact) toggleBtnCompact.classList.toggle('active', density === 'compact');

  renderTopics();
}

function renderStickyIndexBar() {
  const bar = document.getElementById("sticky-index-bar");
  if (!bar || typeof KNOWLEDGE_DATA === 'undefined' || !KNOWLEDGE_DATA.topics) return;

  const sortedTopics = [...KNOWLEDGE_DATA.topics].sort((a, b) => {
    const rA = a.statusRank !== undefined ? a.statusRank : (a.status === 'contested' ? 0 : a.status === 'open' ? 1 : 2);
    const rB = b.statusRank !== undefined ? b.statusRank : (b.status === 'contested' ? 0 : b.status === 'open' ? 1 : 2);
    if (rA !== rB) return rA - rB;
    const dA = a.dateRange || a.date || '';
    const dB = b.dateRange || b.date || '';
    return dA.localeCompare(dB);
  });

  bar.innerHTML = sortedTopics.map(t => {
    const shortTitle = t.title.length > 24 ? t.title.slice(0, 22) + '…' : t.title;
    const escapedTitle = t.title.replace(/"/g, '&quot;');
    return `
      <div class="index-chip" onclick="scrollToTopic('${t.id}')" title="${escapedTitle}">
        <span class="chip-dot ${t.status}"></span>
        <span class="chip-title">${shortTitle}</span>
      </div>
    `;
  }).join('');
}

function scrollToTopic(topicId) {
  if (typeof KNOWLEDGE_DATA === 'undefined' || !KNOWLEDGE_DATA.topics) return;
  const targetTopic = KNOWLEDGE_DATA.topics.find(t => t.id === topicId);

  if (targetTopic) {
    let needsRerender = false;
    if (currentStatusFilter !== 'all' && currentStatusFilter !== targetTopic.status) {
      currentStatusFilter = 'all';
      renderStatusPills();
      needsRerender = true;
    }
    if (currentCategory !== 'all' && currentCategory !== targetTopic.category) {
      currentCategory = 'all';
      renderCategoryPills();
      needsRerender = true;
    }
    if (currentSearch) {
      currentSearch = '';
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = '';
      needsRerender = true;
    }
    if (needsRerender) {
      renderTopics();
    }
  }

  const el = document.getElementById(`topic-${topicId}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('highlight-flash');
    void el.offsetWidth;
    el.classList.add('highlight-flash');
    setTimeout(() => {
      el.classList.remove('highlight-flash');
    }, 1600);
  }
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
  const countEl = document.getElementById("filtered-count");
  if (!grid || typeof KNOWLEDGE_DATA === 'undefined' || !KNOWLEDGE_DATA.topics) return;

  const filtered = KNOWLEDGE_DATA.topics.filter(t => {
    const matchCat = currentCategory === "all" || t.category === currentCategory;
    const matchStatus = currentStatusFilter === "all" || t.status === currentStatusFilter;
    const q = currentSearch.toLowerCase().trim();
    const matchSearch = !q || 
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q)) ||
      (t.participants || []).some(author => author.toLowerCase().includes(q)) ||
      (t.positions || []).some(p => p.quote.toLowerCase().includes(q) ||
                                    p.claim.toLowerCase().includes(q));

    return matchCat && matchStatus && matchSearch;
  });

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${KNOWLEDGE_DATA.topics.length} threads`;
  }

  if (viewDensity === "compact") {
    grid.classList.add("compact-mode");
  } else {
    grid.classList.remove("compact-mode");
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-glass);">
        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 8px;">No topics found matching your active filters.</p>
        <p style="font-size: 0.85rem; color: var(--text-dim);">Try adjusting your category, status, or search query.</p>
      </div>
    `;
    return;
  }

  const groups = [
    { rank: 0, status: "contested", label: "Contested — members disagree", topics: [] },
    { rank: 1, status: "open", label: "Open — raised, not settled", topics: [] },
    { rank: 2, status: "resolved", label: "Resolved", topics: [] }
  ];

  filtered.forEach(t => {
    const rank = t.statusRank !== undefined ? t.statusRank : (t.status === 'contested' ? 0 : t.status === 'open' ? 1 : 2);
    const grp = groups.find(g => g.rank === rank) || groups.find(g => g.status === t.status) || groups[2];
    grp.topics.push(t);
  });

  groups.forEach(g => {
    g.topics.sort((a, b) => {
      const dateA = a.dateRange || a.date || '';
      const dateB = b.dateRange || b.date || '';
      return dateA.localeCompare(dateB);
    });
  });

  let html = '';

  groups.forEach(g => {
    if (g.topics.length === 0) return;

    html += `
      <div class="status-group-header group-${g.status}">
        <span class="status-pill status-${g.status}">${g.status}</span>
        <span class="status-group-title">${g.label}</span>
        <span class="status-group-count">(${g.topics.length})</span>
      </div>
    `;

    g.topics.forEach(t => {
      if (viewDensity === "compact") {
        html += `
          <div class="compact-topic-row" id="topic-${t.id}" onclick="openTopicModal('${t.id}')">
            <div class="compact-left">
              <span class="status-pill status-${t.status}" title="${(t.statusReason || '').replace(/"/g,'&quot;')}">${t.status}</span>
              <span class="compact-title">${t.title}</span>
            </div>
            <div class="compact-right">
              <span class="compact-meta-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <span>${(t.participants || []).length} member${(t.participants || []).length !== 1 ? 's' : ''}</span>
              </span>
              ${t.factChecks && t.factChecks.length ? `
                <span class="compact-meta-chip fc-chip">
                  ⚑ ${t.factChecks.length} fact-check${t.factChecks.length > 1 ? 's' : ''}
                </span>
              ` : ''}
              <button class="btn-card-action compact-btn" onclick="event.stopPropagation(); openTopicModal('${t.id}')">
                <span>Dig Deeper</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        `;
      } else {
        const color = getCategoryColor(t.category);
        html += `
          <article class="topic-card" id="topic-${t.id}" style="border-top: 3px solid ${color};">
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
      }
    });
  });

  grid.innerHTML = html;
}



// ==========================================================================
// Multi-View Resource Hub & Smart Intel Cloud Logic
// ==========================================================================

let resourceViewMode = 'type'; // 'type' | 'member' | 'timeline'
let activeWordCloudTag = null;
let selectedMemberId = null;
let selectedArtifactType = 'all';

function setResourceView(view) {
  resourceViewMode = view;
  const buttons = document.querySelectorAll('.res-view-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === view);
  });
  renderResources();
}

function handleResourceSearch(e) {
  resourceSearchQuery = e.target.value;
  const clearBtn = document.getElementById('res-search-clear');
  if (clearBtn) {
    clearBtn.style.display = resourceSearchQuery ? 'flex' : 'none';
  }
  renderResources();
}

function clearResourceSearch() {
  const input = document.getElementById('resource-search-input');
  if (input) input.value = '';
  resourceSearchQuery = '';
  const clearBtn = document.getElementById('res-search-clear');
  if (clearBtn) clearBtn.style.display = 'none';
  renderResources();
}

function handleCloudTagClick(tag) {
  if (activeWordCloudTag === tag) {
    activeWordCloudTag = null;
  } else {
    activeWordCloudTag = tag;
  }
  renderWordCloud();
  renderResources();
}

function resetWordCloud() {
  activeWordCloudTag = null;
  renderWordCloud();
  renderResources();
}

function selectMemberCurator(memberId) {
  selectedMemberId = memberId;
  renderResources();
}

function filterResourcesByMember(memberId) {
  setResourceView('member');
  selectedMemberId = memberId;
  renderResources();
  const section = document.getElementById('resources-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function setArtifactTypeFilter(type) {
  selectedArtifactType = type;
  renderResources();
}

function renderWordCloud() {
  const container = document.getElementById('intel-cloud-pills');
  const resetBtn = document.getElementById('cloud-reset-btn');
  if (!container || typeof KNOWLEDGE_DATA === 'undefined' || !KNOWLEDGE_DATA.resources) return;

  const tagCounts = new Map();
  const resources = KNOWLEDGE_DATA.resources || [];
  
  resources.forEach(r => {
    const tags = r.tags || [];
    tags.forEach(t => {
      tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
    });
  });

  const popularTags = [
    { id: 'github', label: '🐙 github' },
    { id: 'devin', label: '🤖 devin' },
    { id: 'claude', label: '⚡ claude' },
    { id: 'voice-audio', label: '🎙️ voice/audio' },
    { id: 'tailscale', label: '🔒 tailscale' },
    { id: 'video-gen', label: '🎥 video-gen' },
    { id: 'local-ai', label: '🖥️ local-models' },
    { id: 'cloudflare', label: '☁️ cloudflare' },
    { id: 'lora-mesh', label: '📡 lora-mesh' },
    { id: 'security', label: '🛡️ security' },
    { id: 'apple-silicon', label: '🍏 apple-chips' },
    { id: 'member-venture', label: '🚀 startups' }
  ];

  if (resetBtn) {
    resetBtn.style.display = activeWordCloudTag ? 'inline-block' : 'none';
  }

  container.innerHTML = popularTags.map(pt => {
    const count = tagCounts.get(pt.id) || 0;
    if (count === 0) return '';
    const isActive = activeWordCloudTag === pt.id;
    return `
      <button class="cloud-tag-pill ${isActive ? 'active' : ''}" onclick="handleCloudTagClick('${pt.id}')" title="Filter by #${pt.id}">
        <span>${pt.label}</span>
        <span class="cloud-tag-count">(${count})</span>
      </button>
    `;
  }).join('');
}

function renderResourceCardHtml(res) {
  const titleAttr = res.title ? res.title.replace(/"/g, '&quot;') : '';
  const domain = (res.url || '').split('/')[2] ? res.url.split('/')[2].replace('www.', '') : '';
  const type = res.resourceType || 'tool';
  const typeLabelMap = {
    'code': 'Code & Repo',
    'tool': 'Tool & Platform',
    'technique': 'Technique',
    'news': 'News & Analysis',
    'media': 'Media / Video',
    'project': 'Member Startup'
  };
  const typeLabel = typeLabelMap[type] || 'Tool';
  const summary = res.factCheckedSummary || res.title;
  const topicHtml = res.topic ? `<span class="resource-topic-label" title="Discussed in this topic">${res.topic}</span>` : '';
  const evidenceHtml = res.evidence ? `<span class="evidence-chip" title="Verified in message ${res.evidence}">${res.evidence}</span>` : '';
  const dateHtml = res.date ? `<span class="resource-date">${res.date}</span>` : '';
  const sharedByHtml = res.sharedBy ? `<span class="res-author-tag" onclick="filterResourcesByMember('${res.sharedById || ''}')" title="Filter by ${res.sharedBy}">@${res.sharedBy}</span>` : '';

  return `
    <div class="resource-card-v3">
      <div>
        <div class="res-card-top">
          <span class="res-type-pill res-type-${type}">${typeLabel}</span>
          <span class="res-domain-pill">${domain}</span>
        </div>
        <h4 class="res-card-title">
          <a href="${res.url}" target="_blank" rel="noopener" title="${titleAttr}">${res.title}</a>
        </h4>
        <p class="res-fact-summary">${summary}</p>
      </div>
      <div class="res-card-footer">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          ${sharedByHtml}
          ${dateHtml}
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          ${evidenceHtml}
          ${topicHtml}
        </div>
      </div>
    </div>
  `;
}

function renderResources() {
  const grid = document.getElementById("resources-grid");
  const counterEl = document.getElementById("res-live-counter");
  const badgeEl = document.getElementById("res-total-badge");
  if (!grid || typeof KNOWLEDGE_DATA === 'undefined' || !KNOWLEDGE_DATA.resources) return;

  const resources = KNOWLEDGE_DATA.resources || [];
  if (badgeEl) badgeEl.textContent = `${resources.length} Traced Links`;
  
  const query = (resourceSearchQuery || "").toLowerCase().trim();

  // Filter resources
  const filtered = resources.filter(res => {
    // 1. Search Query filter
    if (query) {
      if (query === 'github' || query === 'repo') {
        if (!res.url.toLowerCase().includes('github.com')) return false;
      } else if (query === 'youtube' || query === 'video') {
        if (!res.url.toLowerCase().includes('youtube.com') && !res.url.toLowerCase().includes('youtu.be')) return false;
      } else {
        const mTitle = res.title && res.title.toLowerCase().includes(query);
        const mShared = res.sharedBy && res.sharedBy.toLowerCase().includes(query);
        const mUrl = res.url && res.url.toLowerCase().includes(query);
        const mSumm = res.factCheckedSummary && res.factCheckedSummary.toLowerCase().includes(query);
        const mTopic = res.topic && res.topic.toLowerCase().includes(query);
        const mTags = res.tags && res.tags.some(t => t.toLowerCase().includes(query));
        if (!mTitle && !mShared && !mUrl && !mSumm && !mTopic && !mTags) return false;
      }
    }

    // 2. Word Cloud Tag filter
    if (activeWordCloudTag) {
      if (activeWordCloudTag === 'github') {
        if (!res.url.toLowerCase().includes('github.com')) return false;
      } else {
        const hasTag = res.tags && res.tags.includes(activeWordCloudTag);
        const hasText = (res.url + ' ' + (res.factCheckedSummary || '')).toLowerCase().includes(activeWordCloudTag);
        if (!hasTag && !hasText) return false;
      }
    }

    return true;
  });

  if (counterEl) {
    counterEl.textContent = `Showing ${filtered.length} of ${resources.length} resources`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 48px 24px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
        <p style="font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin-bottom: 6px;">No resources found</p>
        <p style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 16px;">No links match "${resourceSearchQuery || activeWordCloudTag}".</p>
        <button class="btn-secondary" onclick="clearResourceSearch(); resetWordCloud();">Clear All Filters</button>
      </div>
    `;
    return;
  }

  // Render according to active view mode
  if (resourceViewMode === 'type') {
    renderResourcesByType(grid, filtered);
  } else if (resourceViewMode === 'member') {
    renderResourcesByMember(grid, filtered);
  } else if (resourceViewMode === 'timeline') {
    renderResourcesTimeline(grid, filtered);
  }
}

function renderResourcesByType(container, items) {
  // Artifact type filters
  const types = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'code', label: '💻 Code & Repos' },
    { id: 'tool', label: '🛠️ Tools & Platforms' },
    { id: 'technique', label: '🧠 Techniques & Patterns' },
    { id: 'news', label: '📰 News & Analysis' },
    { id: 'media', label: '🎙️ Media / Videos' },
    { id: 'project', label: '🚀 Member Startups' }
  ];

  const typeCounts = { 'all': items.length };
  items.forEach(it => {
    const t = it.resourceType || 'tool';
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });

  const typePillsHtml = `
    <div class="artifact-type-bar">
      ${types.map(tp => {
        const count = typeCounts[tp.id] || 0;
        if (tp.id !== 'all' && count === 0) return '';
        const isActive = selectedArtifactType === tp.id;
        return `
          <button class="artifact-type-btn ${isActive ? 'active' : ''}" onclick="setArtifactTypeFilter('${tp.id}')">
            <span>${tp.label}</span>
            <span style="opacity: 0.65; font-size: 0.74rem;">(${count})</span>
          </button>
        `;
      }).join('')}
    </div>
  `;

  const displayedItems = selectedArtifactType === 'all' 
    ? items 
    : items.filter(it => (it.resourceType || 'tool') === selectedArtifactType);

  const cardsHtml = `
    <div class="resource-grid-cards">
      ${displayedItems.map(it => renderResourceCardHtml(it)).join('')}
    </div>
  `;

  container.innerHTML = typePillsHtml + cardsHtml;
}

function renderResourcesByMember(container, items) {
  // Aggregate links by member
  const memberMap = new Map();
  items.forEach(it => {
    const sid = it.sharedById || 'unknown';
    const sname = it.sharedBy || 'Unknown Contributor';
    if (!memberMap.has(sid)) {
      memberMap.set(sid, {
        id: sid,
        name: sname,
        links: []
      });
    }
    memberMap.get(sid).links.push(it);
  });

  // Sort members by count descending
  const sortedMembers = Array.from(memberMap.values()).sort((a, b) => b.links.length - a.links.length);

  // If selectedMemberId is set, verify it exists in current filtered set or default to first
  let currentTargetId = selectedMemberId;
  if (!currentTargetId && sortedMembers.length > 0) {
    currentTargetId = sortedMembers[0].id;
  }

  const memberChipsHtml = `
    <div class="member-curator-selector">
      <div class="member-curator-chip ${!selectedMemberId || selectedMemberId === 'all' ? 'active' : ''}" onclick="selectMemberCurator('all')">
        <span>All Contributors</span>
        <span class="cloud-tag-count">(${items.length})</span>
      </div>
      ${sortedMembers.map(m => {
        const isActive = currentTargetId === m.id && selectedMemberId !== 'all';
        const initial = m.name.charAt(0).toUpperCase();
        return `
          <div class="member-curator-chip ${isActive ? 'active' : ''}" onclick="selectMemberCurator('${m.id}')" title="View links by ${m.name}">
            <div class="curator-avatar-mini">${initial}</div>
            <span>${m.name}</span>
            <span class="cloud-tag-count">(${m.links.length})</span>
          </div>
        `;
      }).join('')}
    </div>
  `;

  let dossierHtml = '';
  let cardsHtml = '';

  if (selectedMemberId && selectedMemberId !== 'all') {
    const memberObj = sortedMembers.find(m => m.id === selectedMemberId);
    if (memberObj) {
      // Find full member profile from KNOWLEDGE_DATA.members
      const profile = (KNOWLEDGE_DATA.members || []).find(m => m.id === selectedMemberId || m.name === memberObj.name) || {};
      const company = profile.company ? `<div class="dossier-company">🏢 ${profile.company}</div>` : '';
      const topics = (profile.topicsContributed || []).slice(0, 4);

      dossierHtml = `
        <div class="member-dossier-card">
          <div class="dossier-header-row">
            <div>
              <div class="dossier-name">
                <span>${memberObj.name}</span>
                <span class="role-badge role-blue">Curator Stack</span>
              </div>
              ${company}
            </div>
            <div class="dossier-stats-chips">
              <span class="dossier-chip">🔗 <strong>${memberObj.links.length}</strong> links shared</span>
              ${profile.messages ? `<span class="dossier-chip">💬 <strong>${profile.messages}</strong> messages</span>` : ''}
            </div>
          </div>
          ${topics.length ? `
            <div style="font-size: 0.78rem; color: var(--text-dim); display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px;">
              <span>Active in:</span>
              ${topics.map(t => `<span class="resource-topic-label">${t}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `;

      cardsHtml = `
        <div class="resource-grid-cards">
          ${memberObj.links.map(it => renderResourceCardHtml(it)).join('')}
        </div>
      `;
    }
  } else {
    // Show all filtered items
    cardsHtml = `
      <div class="resource-grid-cards">
        ${items.map(it => renderResourceCardHtml(it)).join('')}
      </div>
    `;
  }

  container.innerHTML = memberChipsHtml + dossierHtml + cardsHtml;
}

function renderResourcesTimeline(container, items) {
  // Sort reverse chronological
  const sorted = [...items].sort((a, b) => {
    const dateA = a.date || "";
    const dateB = b.date || "";
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return (b.evidence || "").localeCompare(a.evidence || "");
  });

  // Group by date
  const byDate = new Map();
  sorted.forEach(it => {
    const d = it.date || "2026-07-16";
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d).push(it);
  });

  const timelineHtml = `
    <div class="timeline-stream-container">
      ${Array.from(byDate.entries()).map(([dateStr, dItems]) => {
        return `
          <div class="timeline-day-group">
            <div class="timeline-day-header">
              <span>📅 ${dateStr}</span>
              <span style="font-size: 0.76rem; opacity: 0.7; font-weight: 500;">(${dItems.length} share${dItems.length > 1 ? 's' : ''})</span>
            </div>
            <div class="resource-grid-cards">
              ${dItems.map(it => renderResourceCardHtml(it)).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.innerHTML = timelineHtml;
}


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

  const resSearchInput = document.getElementById("resource-search-input");
  if (resSearchInput) {
    resSearchInput.addEventListener("input", (e) => {
      resourceSearchQuery = e.target.value;
      renderResources();
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
