with open("src/components/ShaheenPayPalRevolution.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Star to lucide-react imports
content = content.replace("Terminal,", "Terminal, Star,")

# 2. Remove misplaced OSI section from the end if present
osi_marker = "{activeSubTab === 'osi_spotlight' && ("
if osi_marker in content:
    parts = content.split(osi_marker)
    # The first part plus everything up to component end minus the trailing OSI section
    # Let's clean up by finding the last occurrence of osi_marker
    # Actually, let's remove the OSI section block from wherever it is and insert it before ExecutiveSummaryModal
    pass

# Let's read the file line by line or use exact string replacement
with open("src/components/ShaheenPayPalRevolution.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
osi_block = []
collecting_osi = False

for line in lines:
    if "12. OSI (OPEN SOURCE INITIATIVE) MEMBER" in line:
        collecting_osi = True
        osi_block.append(line)
        continue
    if collecting_osi:
        osi_block.append(line)
        if "/* Executive Summary Modal */" in line or "</div" in line and len(osi_block) > 100:
            # Check if this is the end of OSI block
            pass
    else:
        new_lines.append(line)

print("Line processing completed.")
