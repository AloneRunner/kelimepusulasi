
words_to_find = [
    "civert", "lodosp", "basilik", "dobermani", "proyektör", "trajed", "üryani", "subtitl", 
    "red panda", "urkeklik", "rimel", "hava cıvası", "sosis köpek", "lehim", "oktay usta", 
    "kentsel tasarımcı", "tesbih", "traş", "karnı yarık", "deniz anası", "vejeteryan", 
    "hoşbeş", "nescafe", "benetton", "skype", "r.a.m", "çedar", "cheddar", "zoom", "zip", "karnıyarık"
]

file_path = "data/wordLists.ts"
output_path = "found_lines.txt"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    with open(output_path, "w", encoding="utf-8") as out:
        for i, line in enumerate(lines):
            line_num = i + 1
            line_lower = line.lower()
            for word in words_to_find:
                if word in line_lower:
                    out.write(f"{line_num}:{word}\n")

except Exception as e:
    with open(output_path, "w", encoding="utf-8") as out:
        out.write(f"Error: {e}")
