import csv
import json

filepath = r'C:\Users\emile\OneDrive\Documenten\3. Mijn Archief\1. ACTIVE PROJECTS\AI Anonymous\AI Anonymous (Responses) - Form Responses 29072026.csv'

with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    reader = csv.reader(f)
    rows = list(reader)

headers = rows[0]
print("Headers count:", len(headers))

parsed_members = []
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

    if name:
        parsed_members.append({
            "name": name,
            "company": company,
            "email": email,
            "phone": phone,
            "website": website,
            "whyJoined": why_joined,
            "goals": goals,
            "background": background,
            "expectations": expectations,
            "contributions": contributions
        })

print(f"Successfully parsed {len(parsed_members)} members!")
for idx, m in enumerate(parsed_members):
    print(f"{idx+1}. {m['name']} | Company: '{m['company']}' | Email: {m['email']}")
