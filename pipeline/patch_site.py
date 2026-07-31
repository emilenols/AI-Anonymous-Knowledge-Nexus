#!/usr/bin/env python3
"""
Applies the v2 render patches to the site.

Reads  : repo/            (the current site)
Writes : site-v2/         (patched, deployable)

Every edit is asserted: if the anchor text isn't found, the patch fails loudly
rather than silently doing nothing.
"""
import shutil, os, sys, re, json
import sys
try:  # Windows consoles default to cp1252; force UTF-8 so output never crashes
    sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')
except Exception: pass

SRC, DST = 'repo', 'site-v2'
if os.path.exists(DST): shutil.rmtree(DST)
shutil.copytree(SRC, DST, ignore=shutil.ignore_patterns('.git'))
shutil.copy('data.v2.js', f'{DST}/data.js')          # the generated store replaces the old one

# The intake form must never sit in a deployable web root.
FORM = 'AI Anonymous (Responses) - Form Responses 29072026.csv'
if os.path.exists(f'{DST}/{FORM}'):
    os.remove(f'{DST}/{FORM}')

# Pipeline + source data live OUTSIDE the deployed surface.
os.makedirs(f'{DST}/pipeline', exist_ok=True)
os.makedirs(f'{DST}/pipeline/private', exist_ok=True)
for f in ('build_data_v2.py', 'validate.py', 'validate_site.py', 'apply_completions.py',
          'add_restored_claims.py', 'patch_site.py', 'attestations.json',
          'layer0_messages.json', 'layer1_claims.json', 'gaps_register.json',
          'corrected_counters.json', 'parked_2026-07-29.json', 'README.md',
          'data.v2.json', 'data.v2.js'):
    if os.path.exists(f): shutil.copy(f, f'{DST}/pipeline/{f}')
for f in ('identity_map_PRIVATE.json', 'member_roster_PRIVATE.json'):
    if os.path.exists(f): shutil.copy(f, f'{DST}/pipeline/private/{f}')
if os.path.exists(f'repo/{FORM}'):
    shutil.copy(f'repo/{FORM}', f'{DST}/pipeline/private/{FORM}')

# Vercel must not publish the pipeline or anything private.
open(f'{DST}/.vercelignore', 'w', encoding='utf-8').write(
  "# Nothing here is part of the website. Do not deploy it.\n"
  "pipeline/\n*.csv\n*.py\nlayer0_*.json\nlayer1_*.json\n*_PRIVATE.json\n")

# Git must never receive phone numbers or the intake form.
open(f'{DST}/.gitignore', 'w', encoding='utf-8').write(
  "# Personal data. Never commit — the repo may be public and Vercel serves the repo root.\n"
  "pipeline/private/\n*_PRIVATE.json\n*Form Responses*.csv\n\n"
  ".DS_Store\nnode_modules/\n__pycache__/\n")

# Defence in depth: even if a data file reaches the deployment, refuse to serve it.
open(f'{DST}/vercel.json', 'w', encoding='utf-8').write(json.dumps({
  "version": 2,
  "cleanUrls": True,
  "routes": [
    {"src": "/(.*)\\.(csv|py)$", "status": 404},
    {"src": "/(pipeline|private)/(.*)", "status": 404},
    {"src": "/layer0_(.*)", "status": 404},
    {"src": "/layer1_(.*)", "status": 404},
    {"src": "/(.*)_PRIVATE(.*)", "status": 404},
    {"handle": "filesystem"}
  ]
}, indent=2) + "\n")

APPLIED = []
def patch(path, old, new, label):
    p = f'{DST}/{path}'
    s = open(p, encoding='utf-8').read()
    if old not in s:
        print(f"✗ ANCHOR NOT FOUND in {path}: {label}\n   looking for: {old[:90]!r}")
        sys.exit(1)
    s = s.replace(old, new, 1)
    open(p, 'w', encoding='utf-8').write(s)
    APPLIED.append(f"{path}: {label}")

# ─────────────────────────────────────────────────────────────── app.js
# search must not reference the removed sharedBy field
patch('app.js',
"""      t.tags.some(tag => tag.toLowerCase().includes(q)) ||
      t.sharedBy.some(author => author.toLowerCase().includes(q));""",
"""      t.tags.some(tag => tag.toLowerCase().includes(q)) ||
      (t.participants || []).some(author => author.toLowerCase().includes(q)) ||
      (t.positions || []).some(p => p.quote.toLowerCase().includes(q) ||
                                    p.claim.toLowerCase().includes(q));""",
"search covers participants + verbatim quotes, not the removed sharedBy")

# card: date field + status pill
patch('app.js',
"""            <span class="date-tag">${t.date}</span>""",
"""            <span class="date-tag">${t.dateRange || t.date}</span>
            <span class="status-pill status-${t.status}" title="${(t.statusReason || '').replace(/"/g,'&quot;')}">${t.status}</span>""",
"card shows dateRange + status pill")

# card: keyTakeaways -> positions preview
patch('app.js',
"""          <ul class="takeaways-list">
            ${t.keyTakeaways.slice(0, 2).map(item => `<li>${item}</li>`).join('')}
          </ul>""",
"""          <ul class="positions-list">
            ${(t.positions || []).slice(0, 2).map(p => `
              <li>
                <span class="pos-speaker">${p.speaker}</span>
                <span class="cert-badge cert-${p.certainty}">${p.certainty.replace(/_/g,' ')}</span>
                <span class="pos-claim">${p.claim}</span>
              </li>`).join('')}
          </ul>
          ${t.factChecks && t.factChecks.length ? `<div class="fc-flag">⚑ ${t.factChecks.length} fact-check${t.factChecks.length>1?'s':''}</div>` : ''}""",
"card renders positions with certainty badges + fact-check flag")

# card footer: sharedBy -> participants
patch('app.js',
"""            <div class="author-avatar">${t.sharedBy[0].charAt(0)}</div>
            <span>${t.sharedBy.join(', ')}</span>""",
"""            <div class="author-avatar">${(t.participants && t.participants[0] || '?').charAt(0)}</div>
            <span>${(t.participants || []).join(', ')}</span>""",
"card footer uses participants")

# resources renderer: v2 fields
patch('app.js',
"""    <div class="resource-item">
      <div>
        <h4 class="res-name">${res.name}</h4>
        <p class="res-desc">${res.desc}</p>
      </div>
      <div class="res-meta">
        <span>Shared by: ${res.sharedBy}</span>""",
"""    <div class="resource-item">
      <div>
        <h4 class="res-name">${res.title || res.name}</h4>
        <p class="res-desc">${res.topic || res.desc || ''}</p>
      </div>
      <div class="res-meta">
        <span>Shared by: ${res.sharedBy}${res.date ? ' · ' + res.date : ''}</span>
        ${res.evidence ? `<span class="evidence-chip" title="Traced to this message in the transcript">${res.evidence}</span>` : ''}""",
"resources use v2 fields + evidence chip")

# modal: takeaways -> positions, status banner, fact-checks
patch('app.js',
"""  const takeList = document.getElementById("modal-takeaways");
  takeList.innerHTML = topic.keyTakeaways.map(t => `<li>${t}</li>`).join('');""",
"""  // Status banner — replaces the old "Group Consensus" framing
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
            f.sources.map(u => `<a href="${u}" target="_blank" rel="noopener">${u.replace(/^https?:\\/\\/(www\\.)?/,'').split('/')[0]}</a>`).join('')
          }</div>` : ''}
        </div>`).join('')}` : '';
  }""",
"modal renders status banner, positions with quotes + evidence, and fact-checks")

# counters from metadata
patch('app.js',
"""  if (mEl && KNOWLEDGE_DATA.members) mEl.textContent = KNOWLEDGE_DATA.members.length;""",
"""  // the label says "people who posted" — count exactly that, not the directory
  if (mEl && KNOWLEDGE_DATA.members) mEl.textContent =
    KNOWLEDGE_DATA.members.filter(m => m.messages > 0).length;""",
"members counter counts posters, matching its label")

patch('app.js',
"""  const tEl = document.getElementById("stat-topics");""",
"""  const md = KNOWLEDGE_DATA.metadata || {};
  const periodEl = document.getElementById("hero-period");
  if (periodEl && md.periodLabel) periodEl.textContent =
    `Live Group Intelligence Archive • ${md.periodLabel}`;
  const tEl = document.getElementById("stat-topics");""",
"hero period label driven by metadata")

# ─────────────────────────────────────────────────────────────── index.html
patch('index.html',
"""            <span>Live Group Intelligence Archive • July 16–29, 2026</span>""",
"""            <span id="hero-period">Live Group Intelligence Archive • 16 – 28 July 2026</span>""",
"period label 16–28 July")

patch('index.html',
"""              <span class="stat-val" id="stat-topics">12</span>
              <span class="stat-lbl">Structured Topics</span>""",
"""              <span class="stat-val" id="stat-topics">19</span>
              <span class="stat-lbl">Threads</span>""",
"topics counter -> threads")

patch('index.html',
"""              <span class="stat-val" id="stat-links">28</span>
              <span class="stat-lbl">Curated Links</span>""",
"""              <span class="stat-val" id="stat-links">62</span>
              <span class="stat-lbl">Links (all traced)</span>""",
"links counter")

patch('index.html',
"""              <span class="stat-val" id="stat-members">16</span>
              <span class="stat-lbl">Active Contributors</span>""",
"""              <span class="stat-val" id="stat-members">31</span>
              <span class="stat-lbl">People who posted</span>""",
"contributors counter")

patch('index.html',
"""          <h4 style="font-size: 0.85rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.05em; font-weight: 700;">Key Takeaways & Group Consensus</h4>
          <ul class="takeaways-list" id="modal-takeaways"></ul>
        </div>""",
"""          <div id="modal-status" class="status-banner"></div>
          <h4 style="font-size: 0.85rem; color: var(--text-dim); text-transform: uppercase; margin: 16px 0 10px; letter-spacing: 0.05em; font-weight: 700;">Positions <span style="text-transform: none; font-weight: 500; color: var(--text-dim);">— who said what, verbatim</span></h4>
          <ul class="positions-list" id="modal-takeaways"></ul>
          <div id="modal-factchecks"></div>
        </div>""",
"modal: Group Consensus heading -> Positions + status banner + fact-checks")

# ─────────────────────────────────────────────────────────────── members.html
patch('members.html',
"""                  ${m.linkedin ? `""",
"""                  ${m.linkedin ? `""",
"(linkedin already guarded by a truthy check — verified)")

patch('members.html',
"""          <span class="stat-val" id="stat-members-count">25</span>
          <span class="stat-lbl">Active Members</span>""",
"""          <span class="stat-val" id="stat-members-count">41</span>
          <span class="stat-lbl">In the directory</span>""",
"member counter: honest fallback + label (10 of the 41 never posted in this period)")

patch('members.html',
"""        <div class="stat-item">
          <span class="stat-val">17+</span>
          <span class="stat-lbl">Verified LinkedIn Profiles</span>
        </div>""",
"""        <div class="stat-item">
          <span class="stat-val" id="stat-profiles">25</span>
          <span class="stat-lbl">Self-reported profiles</span>
        </div>""",
'"17+ Verified LinkedIn Profiles" -> self-reported profile count')

patch('members.html',
"""        <span>AI Anonymous Community Network • Verified LinkedIn Profiles</span>""",
"""        <span>AI Anonymous Community Network • 16 – 28 July 2026</span>""",
"members hero subtitle no longer claims verification")

patch('members.html',
"""      const countEl = document.getElementById("stat-members-count");""",
"""      const pEl = document.getElementById("stat-profiles");
      if (pEl) pEl.textContent = (KNOWLEDGE_DATA.members || [])
        .filter(m => m.profileSource && m.profileSource.indexOf('intake form') !== -1).length;
      const countEl = document.getElementById("stat-members-count");""",
"profile counter computed from provenance")

# show where each profile's data came from
patch('members.html',
"""        const bgSnippet = m.background ? (m.background.slice(0, 130) + (m.background.length > 130 ? '...' : '')) : (m.linkedinSummary || tagline);""",
"""        const bgSnippet = m.background ? (m.background.slice(0, 130) + (m.background.length > 130 ? '...' : '')) : (m.profileSource || tagline);""",
"member card falls back to provenance, not an invented summary")

# ─────────────────────────────────────────────────────────────── styles.css
open(f'{DST}/styles.css', 'a', encoding='utf-8').write("""

/* ==========================================================================
   v2 — evidence-first rendering
   Status replaces "consensus". Every claim shows who said it, how sure they
   were, and which message it came from.
   ========================================================================== */

.status-pill{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;
  font-size:.68rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.status-pill::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.status-resolved {background:rgba(34,197,94,.14); color:#4ade80; border:1px solid rgba(34,197,94,.35)}
.status-contested{background:rgba(249,115,22,.14);color:#fb923c; border:1px solid rgba(249,115,22,.35)}
.status-open     {background:rgba(99,102,241,.14);color:#a5b4fc; border:1px solid rgba(99,102,241,.35)}

.status-banner{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap;
  background:rgba(255,255,255,.03);border:1px solid var(--border-glass);
  border-radius:var(--radius-md);padding:12px 14px}
.status-reason{font-size:.88rem;color:var(--text-muted);line-height:1.5;flex:1;min-width:220px}

.cert-badge{padding:2px 7px;border-radius:var(--radius-sm);font-size:.63rem;font-weight:700;
  letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;
  background:rgba(255,255,255,.06);color:var(--text-dim);border:1px solid var(--border-glass)}
.cert-hands_on{background:rgba(34,197,94,.13);color:#4ade80;border-color:rgba(34,197,94,.3)}
.cert-hedged,.cert-untested,.cert-unresolved{background:rgba(249,115,22,.13);color:#fb923c;border-color:rgba(249,115,22,.3)}
.cert-sarcasm{background:rgba(236,72,153,.13);color:#f472b6;border-color:rgba(236,72,153,.3)}
.cert-secondhand,.cert-opinion{background:rgba(168,85,247,.13);color:#c084fc;border-color:rgba(168,85,247,.3)}

.stance-badge{font-size:.63rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;
  color:var(--text-dim)}

.positions-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:14px}
.positions-list > li{background:rgba(255,255,255,.02);border:1px solid var(--border-glass);
  border-left:3px solid rgba(99,102,241,.5);border-radius:var(--radius-md);padding:12px 14px}
.pos-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.pos-speaker{font-weight:800;font-size:.9rem;color:var(--text-main,#e8eaf2)}
.pos-date{font-size:.7rem;color:var(--text-dim);margin-left:auto}
.pos-claim{font-size:.92rem;line-height:1.55;color:var(--text-muted);margin:0 0 8px}
.pos-quote{margin:0 0 8px;padding:8px 12px;border-left:2px solid rgba(255,255,255,.14);
  background:rgba(0,0,0,.18);border-radius:0 var(--radius-sm) var(--radius-sm) 0;
  display:flex;flex-direction:column;gap:4px}
.q-orig{font-size:.87rem;font-style:italic;color:#cbd5e1;line-height:1.5}
.q-trans{font-size:.8rem;color:var(--text-dim);line-height:1.45}
.pos-evidence{display:flex;gap:6px;flex-wrap:wrap}

.evidence-chip{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.63rem;
  padding:2px 6px;border-radius:var(--radius-sm);background:rgba(255,255,255,.05);
  color:var(--text-dim);border:1px solid var(--border-glass)}

/* card preview variants */
.topic-card .positions-list{gap:8px;margin-bottom:12px}
.topic-card .positions-list > li{border-left-width:2px;padding:8px 10px;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:6px}
.topic-card .pos-claim{font-size:.85rem;margin:0;width:100%}
.fc-flag{display:inline-block;font-size:.7rem;font-weight:700;color:#fbbf24;
  background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.3);
  padding:2px 8px;border-radius:999px;margin-bottom:10px}

/* fact-check block — deliberately not styled like member content */
.section-label{font-size:.85rem;color:var(--text-dim);text-transform:uppercase;
  letter-spacing:.05em;font-weight:700;margin:24px 0 10px}
.section-note{text-transform:none;font-weight:500}
.factcheck{background:rgba(251,191,36,.05);border:1px solid rgba(251,191,36,.28);
  border-left:3px solid #fbbf24;border-radius:var(--radius-md);padding:12px 14px;margin-bottom:10px}
.fc-verdict{font-size:.72rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;
  color:#fbbf24;margin-bottom:6px}
.fc-fact{font-size:.88rem;line-height:1.55;color:var(--text-muted);margin:0 0 6px}
.fc-note{font-size:.8rem;line-height:1.5;color:var(--text-dim);margin:0 0 6px;font-style:italic}
.fc-sources{display:flex;flex-wrap:wrap;gap:8px}
.fc-sources a{font-size:.72rem;color:#93c5fd;text-decoration:none;
  background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.28);
  padding:2px 8px;border-radius:var(--radius-sm)}
.fc-sources a:hover{background:rgba(59,130,246,.2)}
""")
APPLIED.append("styles.css: v2 component styles appended")

print("Patches applied:")
for a in APPLIED: print("  ✓", a)
print(f"\n{DST}/ is ready.")
