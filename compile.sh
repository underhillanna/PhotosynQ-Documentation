#!/usr/bin/bash
echo -e "\033[92mBuild Master Documents for PhotosynQ\033[0m";
echo "------------------------------------";
echo "Compiling Help Files";

# Generate new documentation index
# This will collect also the firmware documentation if available
node index.js create

# Compiling the master markdown files from templates
echo "Compile master files";
node index.js compile -i help-master.md -o ./dist/PhotosynQ-Help-Manual.md -t 0.0.3
node index.js compile -i tutorials-master.md -o ./dist/PhotosynQ-Getting-Started.md -t 0.0.3
node index.js compile -i firmware-master.md -o ./dist/PhotosynQ-Firmware.md -t 0.0.3

# Now we can build the pdfs as well
echo "Converting markdown to pdf";
node --no-deprecation index.js pdf -i ./dist/PhotosynQ-Help-Manual.md -o ./dist/PhotosynQ-Help-Manual.pdf
node --no-deprecation index.js pdf -i ./dist/PhotosynQ-Getting-Started.md -o ./dist/PhotosynQ-Getting-Started.pdf
node --no-deprecation index.js pdf -i ./dist/PhotosynQ-Firmware.md -o ./dist/PhotosynQ-Firmware.pdf

# Compiling finished
echo -e "\033[92mDone...\033[0m";