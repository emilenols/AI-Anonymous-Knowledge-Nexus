import os

# Update styles.css with solid lock gate styling
with open("styles.css", "r", encoding="utf-8") as f:
    css = f.read()

lock_css = """
/* ==========================================================================
   SOLID AIRTIGHT LOCK GATE STYLING
   ========================================================================== */
body.locked header,
body.locked main,
body.locked footer,
body.locked section {
  display: none !important;
  visibility: hidden !important;
}

.auth-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 999999 !important;
  background: #030508 !important;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.auth-overlay.active {
  display: flex !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
"""

if "body.locked" not in css:
    css += "\n" + lock_css

with open("styles.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated styles.css with airtight lock gate CSS")

# Update app.js auth gate logic
with open("app.js", "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace(
  'document.body.style.overflow = "auto";',
  'document.body.classList.remove("locked"); document.body.style.overflow = "auto";'
).replace(
  'document.body.style.overflow = "hidden";',
  'document.body.classList.add("locked"); document.body.style.overflow = "hidden";'
)

with open("app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated app.js with body.locked toggle")
