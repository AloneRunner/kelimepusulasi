
import re

def main():
    try:
        with open('data/wordFacts.ts', 'r', encoding='utf-8') as f:
            content = f.read()
        
        with open('data/temp_animals.ts', 'r', encoding='utf-8') as f:
            new_animals_content = f.read()
            
    except FileNotFoundError as e:
        print(f"Error: {e}")
        return

    # 1. Identify where to splice.
    # We determined the block is from start of file (after export line) until "zürafa" block ends.
    # Start: line 3 (index 2-ish). 
    # Let's find index of "// --- A HARFİ ---" or just first key "ağaçkakan".
    
    # Actually, we want to keep the "export const WORD_FACTS: Record<string, string[]> = {" line.
    # It is usually at the top.
    
    header_match = re.search(r'export const WORD_FACTS: Record<string, string\[\]> = \{', content)
    if not header_match:
        print("Could not find WORD_FACTS header.")
        return
        
    start_index = header_match.end()
    
    # Find the end of the Animals block.
    # It ends after "zürafa" block.
    # "zürafa": [ ... ],
    
    # Let's search for "zürafa": [ ... ],
    # and the newline after it.
    
    # Be careful with regex dotall.
    # We want the LAST valid animal key.
    # We saw "zürafa" is likely last.
    
    # To be safer: Find the start of the Food section.
    # We saw line 1726 is "acıbadem".
    # And there was a "// --- A HARFİ ---" before it? 
    # Let's look for the FIRST key of the Food section or the separator.
    # In Step 2332 output:
    # 1721: "zürafa": [ ... ],
    # 1722: 
    # 1723: 
    # 1724: 
    # 1725:     // --- A HARFİ ---
    # 1726:     "acıbadem": [
    
    # So we want to replace everything from `start_index` up to `    // --- A HARFİ ---` (at line 1725)
    # But wait, lines 3 also had `// --- A HARFİ ---`.
    # So searching for `// --- A HARFİ ---` might find the FIRST one (line 3).
    # We want the SECOND one (line 1725).
    
    matches = list(re.finditer(r'// --- A HARFİ ---', content))
    if len(matches) >= 2:
        split_point = matches[1].start()
    else:
        # Fallback: Find "acıbadem"
        m = re.search(r'"acıbadem"', content)
        if m:
            # We want to cut before the comment above it if possible
            # But let's just cut at "acıbadem" and if we leave extra newlines/comments, fine.
            # Actually, let's look for the text around there.
            split_point = m.start()
            # Backtrack to include precending comment if we want, but honestly,
            # prepending the new content with a newline is enough.
            
            # Let's try to match the whitespace before it
            # But "acıbadem" key start.
        else:
            print("Could not find start of Food section (acıbadem).")
            # Fallback to zürafa end
            m_z = re.search(r'"zürafa":\s*\[.*?\]\s*,', content, re.DOTALL)
            if m_z:
                split_point = m_z.end()
            else:
                print("Critical failure to identify split point.")
                return

    # 2. Construct New Content
    # Header + New Animals + Tail
    
    # We should add a generic comment header for Animals if we stripped it
    # new_animals_content doesn't have it.
    
    final_animals_block = "\n    // --- HAYVANLAR (A-Z) ---\n" + new_animals_content.rstrip() + ",\n\n"
    
    # The tail is content[split_point:]
    # But we need to ensure comma correctness.
    # new_animals_content likely ends with "],\n" or similar.
    # We added a comma above.
    
    # 3. Collision Removal in Tail
    # We need to process the REST of the file (from split_point onwards) to delete colliding keys.
    tail_content = content[split_point:]
    
    # Keys to remove: "barbunya_DUP_FOOD", "palamut_DUP2", "pekin ördeği_DUP2", "tavuk_DUP2"
    
    keys_to_remove = ["barbunya_DUP_FOOD", "palamut_DUP2", "pekin ördeği_DUP2", "tavuk_DUP2"]
    
    for key in keys_to_remove:
        # Regex to match: "key": [ ... ], (including trailing comma and newline)
        # Be careful with nested brackets if any (facts usually don't have them but standard JSON structure)
        pattern = r'\s*"' + re.escape(key) + r'":\s*\[[^\]]*\],\n?'
        tail_content = re.sub(pattern, '', tail_content, flags=re.DOTALL)
        print(f"Removed {key}")
        
    # 4. Splice
    new_full_content = content[:start_index] + final_animals_block + tail_content
    
    # 5. Write
    with open('data/wordFacts.ts', 'w', encoding='utf-8') as f:
        f.write(new_full_content)
        
    print("Successfully updated wordFacts.ts")

if __name__ == "__main__":
    main()
