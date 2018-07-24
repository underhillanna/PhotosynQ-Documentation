#!/usr/bin/bash
echo -e "\033[92mBuild Master Documents for PhotosynQ\033[0m";
echo "------------------------------------";
# Empty the distribution folder dist
echo "Remove previous distribution files"
rm ./dist/*

# Generate new documentation index
# This will collect also the firmware documentation if available
node index.js index

# Compiling the master markdown files from templates
# The tag gets used from the git repo
TAG=$(git describe --abbrev=0 --tags)
echo "Compile master files for Github tag $TAG";
node index.js compile -i ./build/help-master.md -o ./dist/PhotosynQ-Help-Manual.md -t $TAG
node index.js compile -i ./build/tutorials-master.md -o ./dist/PhotosynQ-Getting-Started.md -t $TAG
node index.js compile -i ./build/firmware-master.md -o ./dist/PhotosynQ-Firmware.md -t $TAG

node index.js compile -i ./build/MultispeQ-v1.0.md -o ./dist/PhotosynQ-MultispeQ-v1.0.md -t $TAG
node index.js compile -i ./build/MultispeQ-v2.0.md -o ./dist/PhotosynQ-MultispeQ-v2.0.md -t $TAG


# Now we can build the pdfs as well
echo "Converting markdown to pdf";
node index.js pdf -i ./dist/PhotosynQ-Help-Manual.md -o ./dist/PhotosynQ-Help-Manual.pdf
node index.js pdf -i ./dist/PhotosynQ-Getting-Started.md -o ./dist/PhotosynQ-Getting-Started.pdf
node index.js pdf -i ./dist/PhotosynQ-Firmware.md -o ./dist/PhotosynQ-Firmware.pdf

node index.js pdf -i ./dist/PhotosynQ-MultispeQ-v1.0.md -o ./dist/PhotosynQ-MultispeQ-v1.0.pdf
node index.js pdf -i ./dist/PhotosynQ-MultispeQ-v2.0.md -o ./dist/PhotosynQ-MultispeQ-v2.0.pdf

echo "Compiling markdown into ebook";
node index epub -t "PhotosynQ Documentation" -a '["Sebastian", "Dan", "Sean"]' -o ./dist/PhotosynQ-Documentation.epub -i ./dist/PhotosynQ-Help-Manual.md ./dist/PhotosynQ-Getting-Started.md ./dist/PhotosynQ-Firmware.md

# Compiling finished
echo -e "\033[92mDone...\033[0m";