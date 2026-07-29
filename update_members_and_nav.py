import json
import re

# 1. Update data.js
with open("data.js", "r", encoding="utf-8") as f:
    data_js = f.read()

m_match = re.search(r'members:\s*(\[[\s\S]*?\])\s*\n\};', data_js)
if not m_match:
    print("Error: Could not find members array in data.js")
    exit(1)

members = json.loads(m_match.group(1))

# Fix Filip Ceulebroeck -> Philip Van Ceulebroeck
for m in members:
    if "filip" in m['name'].lower() and "ceulebroeck" in m['name'].lower():
        m['name'] = "Philip Van Ceulebroeck"
        m['role'] = "Altervisions (Prompting & Token Optimization)"
        m['company'] = "Altervisions"
    elif "filip" in m['name'].lower() and "coulebroeck" in m['name'].lower():
        m['name'] = "Philip Van Ceulebroeck"
        m['role'] = "Altervisions (Prompting & Token Optimization)"
        m['company'] = "Altervisions"

# Helper function to get surname sort key
def get_surname_sort_key(member):
    name_parts = member['name'].strip().split()
    if len(name_parts) == 1:
        return name_parts[0].lower()
    
    # Check for prefix names like "Van Ceulebroeck", "Van Gool", "D'Hondt", etc.
    # Join everything after first name as surname
    surname = " ".join(name_parts[1:])
    # Remove prefix for strict alphabetical ordering if desired, e.g. "Van Ceulebroeck" -> "Ceulebroeck"
    clean_surname = re.sub(r'^(van\s+den\s+|van\s+der\s+|van\s+|de\s+|d\'\s*)', '', surname, flags=re.IGNORECASE)
    return clean_surname.lower()

members.sort(key=get_surname_sort_key)

print(f"Sorted {len(members)} members by surname:")
for i, m in enumerate(members):
    print(f"{i+1}. {m['name']}")

# Save back to data.js
members_json = json.dumps(members, indent=2, ensure_ascii=False)
new_data_js = data_js[:m_match.start(1)] + members_json + data_js[m_match.end(1):]

with open("data.js", "w", encoding="utf-8") as f:
    f.write(new_data_js)

print("Saved sorted members to data.js!")

# 2. Add Swanky World-Class Nav Switcher CSS to styles.css
with open("styles.css", "r", encoding="utf-8") as f:
    css = f.read()

swanky_nav_css = """
/* ==========================================================================
   WORLD-CLASS SWANKY NAV SWITCHER TABS
   ========================================================================== */
.nav-switcher {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  background: rgba(15, 23, 42, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  padding: 5px !important;
  border-radius: 9999px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
}

.nav-link-tab {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 8px 20px !important;
  border-radius: 9999px !important;
  font-size: 0.88rem !important;
  font-weight: 600 !important;
  color: #94a3b8 !important;
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: 1px solid transparent !important;
}

.nav-link-tab:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.08) !important;
  text-decoration: none !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
}

.nav-link-tab.active {
  color: #ffffff !important;
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border: 1px solid rgba(199, 210, 254, 0.5) !important;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
  text-decoration: none !important;
}

.nav-link-tab svg {
  transition: transform 0.2s ease !important;
}

.nav-link-tab:hover svg {
  transform: scale(1.1) !important;
}
"""

if ".nav-switcher" in css:
    css = re.sub(r'/\* ==+[\s\S]*?nav-switcher[\s\S]*?\*/\s*\.nav-switcher[\s\S]*?\}', '', css)

css += "\n" + swanky_nav_css

with open("styles.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated styles.css with World-Class Nav Switcher CSS!")
