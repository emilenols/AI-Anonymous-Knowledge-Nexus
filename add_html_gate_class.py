for fname in ['index.html', 'members.html']:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('<html lang="en">', '<html lang="en" class="locked-gate">')
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {fname} with class locked-gate on <html> tag")
