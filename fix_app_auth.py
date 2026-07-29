import os
import re

auth_js_code = """// ==========================================================================
// AIRTIGHT PASSCODE AUTHENTICATION GATE
// Passcode: A1An0nym0us!
// ==========================================================================
const SITE_PASSCODE = "A1An0nym0us!";
const AUTH_KEY = "ai_anon_auth_granted";

(function checkAuthGate() {
  const isAuth = sessionStorage.getItem(AUTH_KEY) === "true";
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
    });
  }
})();

function verifyPasscode(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("passcode-input");
  const errorMsg = document.getElementById("auth-error-msg");
  if (!input) return false;

  const val = input.value.trim();
  if (val === SITE_PASSCODE) {
    sessionStorage.setItem(AUTH_KEY, "true");
    document.documentElement.classList.remove("locked-gate");
    document.body.classList.remove("locked");
    const gate = document.getElementById("auth-gate-modal");
    if (gate) gate.classList.remove("active");
    if (typeof showToast === "function") {
      showToast("Passcode accepted! Welcome to AI Anonymous.");
    }
  } else {
    if (errorMsg) {
      errorMsg.textContent = "Incorrect passcode. Please try again.";
      errorMsg.style.display = "block";
    }
    input.value = "";
    input.focus();
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
  if (input) input.value = "";
}

"""

with open("app.js", "r", encoding="utf-8") as f:
    existing_js = f.read()

if "SITE_PASSCODE" not in existing_js:
    full_js = auth_js_code + existing_js
    with open("app.js", "w", encoding="utf-8") as f:
        f.write(full_js)
    print("Added authentication functions to app.js!")
else:
    print("Auth functions already present in app.js")

# Update styles.css
with open("styles.css", "r", encoding="utf-8") as f:
    css = f.read()

airtight_css = """
/* ==========================================================================
   AIRTIGHT FULL-SCREEN LOCK GATE STYLING
   ========================================================================== */
html.locked-gate body header,
html.locked-gate body main,
html.locked-gate body footer,
html.locked-gate body section,
html.locked-gate body .container,
body.locked header,
body.locked main,
body.locked footer,
body.locked section,
body.locked .container {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

.auth-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 9999999 !important;
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

if "html.locked-gate" not in css:
    css += "\n" + airtight_css
    with open("styles.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("Updated styles.css with airtight full-screen lock CSS!")
