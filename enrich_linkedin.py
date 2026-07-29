import urllib.request
import csv
import json
import re

url = 'https://docs.google.com/spreadsheets/d/1MVmP5S0nekdMurbrNBCxB7-qsuvYPcIhoYMUn-AQf5A/export?format=csv'

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')
    lines = content.splitlines()
    reader = csv.reader(lines)
    rows = list(reader)

linkedin_data = {}
for r in rows[1:]:
    if not r: continue
    first = r[0].strip() if len(r) > 0 else ''
    last = r[1].strip() if len(r) > 1 else ''
    name = f"{first} {last}".strip().lower()
    email = r[2].strip().lower() if len(r) > 2 else ''
    link = r[3].strip() if len(r) > 3 else ''
    tagline = r[4].strip() if len(r) > 4 else ''
    summary = r[5].strip() if len(r) > 5 else ''

    if link and link.startswith("http"):
        linkedin_data[name] = {
            "linkedin": link,
            "tagline": tagline,
            "linkedinSummary": summary
        }
        if email:
            linkedin_data[email] = {
                "linkedin": link,
                "tagline": tagline,
                "linkedinSummary": summary
            }

print(f"Extracted {len(linkedin_data)} LinkedIn map entries!")

# Now load data.js members and enrich them!
with open('data.js', 'r', encoding='utf-8') as f:
    data_js = f.read()

m_match = re.search(r'members:\s*(\[[\s\S]*?\])\s*\n\};', data_js)
if not m_match:
    print("Could not find members array in data.js!")
    exit(1)

members = json.loads(m_match.group(1))
print(f"Loaded {len(members)} existing members from data.js")

enriched_count = 0
for m in members:
    m_name = m['name'].strip().lower()
    m_email = m.get('email', '').strip().lower()

    info = linkedin_data.get(m_email) or linkedin_data.get(m_name)
    if not info:
        # Partial name match check
        for k, v in linkedin_data.items():
            if '@' not in k and (k in m_name or m_name in k):
                info = v
                break

    if info:
        m['linkedin'] = info['linkedin']
        if info['tagline'] and info['tagline'] != "Not found":
            m['linkedinTagline'] = info['tagline']
        if info['linkedinSummary'] and info['linkedinSummary'] != "Could not confirm a matching LinkedIn profile":
            m['linkedinSummary'] = info['linkedinSummary']
        enriched_count += 1

print(f"Enriched {enriched_count} out of {len(members)} members with LinkedIn URLs, taglines, and bios!")

# Replace back in data.js
members_json = json.dumps(members, indent=2, ensure_ascii=False)
new_data_js = data_js[:m_match.start(1)] + members_json + data_js[m_match.end(1):]

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(new_data_js)

print("Updated data.js with enriched LinkedIn data!")
