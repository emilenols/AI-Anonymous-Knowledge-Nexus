import json
import re

with open("data.js", "r", encoding="utf-8") as f:
    data_js = f.read()

m_match = re.search(r'members:\s*(\[[\s\S]*?\])\s*\n\};', data_js)
if not m_match:
    print("Error: Could not find members array in data.js")
    exit(1)

members = json.loads(m_match.group(1))

for m in members:
    if "caluwaerts" in m['name'].lower():
        m['name'] = "Tom Caluwaerts"

def get_surname_sort_key(member):
    name_parts = member['name'].strip().split()
    if len(name_parts) == 1:
        return name_parts[0].lower()
    surname = " ".join(name_parts[1:])
    clean_surname = re.sub(r'^(van\s+den\s+|van\s+der\s+|van\s+|de\s+|d\'\s*)', '', surname, flags=re.IGNORECASE)
    return clean_surname.lower()

members.sort(key=get_surname_sort_key)

print("Re-sorted members list by surname:")
for i, m in enumerate(members):
    print(f"{i+1}. {m['name']}")

members_json = json.dumps(members, indent=2, ensure_ascii=False)
new_data_js = data_js[:m_match.start(1)] + members_json + data_js[m_match.end(1):]

with open("data.js", "w", encoding="utf-8") as f:
    f.write(new_data_js)

print("Updated data.js cleanly!")
