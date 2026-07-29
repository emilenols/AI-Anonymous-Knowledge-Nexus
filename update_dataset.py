import csv
import json
import re

filepath = r'C:\Users\emile\OneDrive\Documenten\3. Mijn Archief\1. ACTIVE PROJECTS\AI Anonymous\AI Anonymous (Responses) - Form Responses 29072026.csv'

with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    reader = csv.reader(f)
    rows = list(reader)

members_list = []

for i, r in enumerate(rows[1:]):
    if not r or len(r) < 4:
        continue
    
    first = r[1].strip() if len(r) > 1 else ''
    last = r[2].strip() if len(r) > 2 else ''
    name = f"{first} {last}".strip()
    email = r[3].strip() if len(r) > 3 else ''
    phone = r[5].strip() if len(r) > 5 else ''
    company = r[6].strip() if len(r) > 6 else ''
    website = r[7].strip() if len(r) > 7 else ''
    
    why_joined = r[15].strip() if len(r) > 15 else ''
    goals = r[16].strip() if len(r) > 16 else ''
    background = r[17].strip() if len(r) > 17 else ''
    expectations = r[18].strip() if len(r) > 18 else ''
    contributions = r[19].strip() if len(r) > 19 else ''

    # Clean up names and text
    name = name.replace("DHondt", "D'Hondt").replace("  ", " ")
    background = background.replace("", "'").replace("\n", " ").strip()
    why_joined = why_joined.replace("", "'").replace("\n", " ").strip()
    contributions = contributions.replace("", "'").replace("\n", " ").strip()

    if not name:
        continue

    # Derive company/role if empty
    role_str = company
    if not role_str:
        if "focusfinder" in email: role_str = "FocusFinder Consulting"
        elif "jack-bv" in email: role_str = "Jack BV (Webapps & Eng)"
        elif "simply" in email or "laura" in email: role_str = "Simply (AI & Marketing)"
        elif "sherlockseo" in email: role_str = "Sherlock SEO & Snowskiproperty"
        elif "noma.law" in email: role_str = "Noma Law (Legal AI)"
        elif "altervisions" in email: role_str = "Altervisions"
        elif "maar.digital" in email: role_str = "Maar Digital"
        elif "leanmeanbusiness" in email: role_str = "Lean Mean Business"
        elif "maldini" in email: role_str = "Maldini & PilarBKK"
        elif "aqualion" in email: role_str = "Aqualion Earth"
        elif "onetowin" in email: role_str = "One To Win"
        elif "altiro" in email: role_str = "Altiro"
        elif "cavens.io" in email: role_str = "Cavens.io & Notiva AI OS"
        elif "bluemoon" in email: role_str = "Bluemoon"
        elif "profitintelligence" in email: role_str = "Profit Intelligence"
        elif "zas.be" in email: role_str = "ZAS Healthcare"
        elif "cynexia" in email: role_str = "Cynexia"
        elif "wimwouters" in email: role_str = "Wim Wouters Design"
        elif "clubsante" in email: role_str = "Club Santé"
        elif "petervankeer" in email: role_str = "Peter Van Keer Consulting"
        elif "telenet" in email: role_str = "Telenet"
        else: role_str = "AI Innovator & Entrepreneur"

    # Derive topics/superpowers
    topics = []
    if background:
        topics.append(background[:110] + ("..." if len(background) > 110 else ""))
    if contributions:
        topics.append(contributions[:110] + ("..." if len(contributions) > 110 else ""))
    if not topics:
        topics = ["AI Implementation", "Group Networking & Strategy"]

    members_list.append({
        "name": name,
        "role": role_str,
        "email": email,
        "phone": phone,
        "company": company or role_str,
        "website": website,
        "background": background,
        "goals": goals or why_joined,
        "contributions": contributions,
        "topicsContributed": topics
    })

print(f"Formatted {len(members_list)} full member profiles!")

with open("data.js", "r", encoding="utf-8") as f:
    data_js_content = f.read()

members_json = json.dumps(members_list, indent=2, ensure_ascii=False)
new_data_js = re.sub(r'members:\s*\[[\s\S]*?\]\s*};', 'members: ' + members_json + '\n};', data_js_content)

with open("data.js", "w", encoding="utf-8") as f:
    f.write(new_data_js)

print("Updated data.js with all member profiles successfully!")
