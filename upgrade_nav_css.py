with open("styles.css", "r", encoding="utf-8") as f:
    css = f.read()

swanky_css = """
/* ==========================================================================
   WORLD-CLASS SWANKY NAV SWITCHER CAPSULE
   ========================================================================== */
.nav-switcher {
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  background: rgba(13, 17, 23, 0.85) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  padding: 4px 6px !important;
  border-radius: 9999px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
}

.nav-switcher a,
.nav-link-tab {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 8px 18px !important;
  border-radius: 9999px !important;
  font-size: 0.88rem !important;
  font-weight: 600 !important;
  color: #94a3b8 !important;
  text-decoration: none !important;
  transition: all 0.2s ease !important;
  border: 1px solid transparent !important;
}

.nav-switcher a:visited,
.nav-switcher a:link {
  color: #94a3b8 !important;
  text-decoration: none !important;
}

.nav-switcher a:hover,
.nav-link-tab:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  text-decoration: none !important;
}

.nav-switcher a.active,
.nav-link-tab.active {
  color: #ffffff !important;
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border-color: rgba(199, 210, 254, 0.5) !important;
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
  text-decoration: none !important;
}
"""

if "WORLD-CLASS SWANKY NAV SWITCHER" in css:
    import re
    css = re.sub(r'/\* ==+[\s\S]*?NAV SWITCHER[\s\S]*?\*/[\s\S]*?(?=\n/\*|\Z)', '', css)

css += "\n" + swanky_css

with open("styles.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated styles.css with World-Class Nav Switcher Capsule styling!")
