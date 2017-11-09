#!/usr/bin/bash
echo -e "\033[92mBuild Master Documents for PhotosynQ\033[0m";
echo "------------------------------------";
echo "Compiling Help Files";

# Generate new documentation index
# This will collect also the firmware documentation if available
node index.js create

# Merge all files into one markdown document
perl -ne 's/^\[(.+)\].*/`cat $1`/e;print' help-master.md > ./dist/PhotosynQ-Help-Manual.md
perl -ne 's/^\[(.+)\].*/`cat $1`/e;print' tutorials-master.md > ./dist/PhotosynQ-Getting-Started.md
perl -ne 's/^\[(.+)\].*/`cat $1`/e;print' firmware-master.md > ./dist/PhotosynQ-Firmware.md

# Adding date to indicate latest updates
echo "Adding Dates";
perl -p -i -e "s/INSERT_DATE/$(date +%b) $(date +%d), $(date +%Y)/g" ./dist/PhotosynQ-Help-Manual.md
perl -p -i -e "s/INSERT_DATE/$(date +%b) $(date +%d), $(date +%Y)/g" ./dist/PhotosynQ-Getting-Started.md
perl -p -i -e "s/INSERT_DATE/$(date +%b) $(date +%d), $(date +%Y)/g" ./dist/PhotosynQ-Firmware.md

# Remove all ../ from image paths
echo "Fixing Image Paths";
perl -p -i -e "s/\]\(\.\.\/images/\]\(images/g" ./dist/PhotosynQ-Help-Manual.md
perl -p -i -e "s/\]\(\.\.\/images/\]\(images/g" ./dist/PhotosynQ-Getting-Started.md
perl -p -i -e "s/\]\(\.\.\/images/\]\(images/g" ./dist/PhotosynQ-Firmware.md

# Now we can build the pdfs as well
echo "Converting markdown to pdf";
node --no-deprecation index.js pdf -i ./dist/PhotosynQ-Help-Manual.md -o ./dist/PhotosynQ-Help-Manual.pdf
node --no-deprecation index.js pdf -i ./dist/PhotosynQ-Getting-Started.md -o ./dist/PhotosynQ-Getting-Started.pdf
node --no-deprecation index.js pdf -i ./dist/PhotosynQ-Firmware.md -o ./dist/PhotosynQ-Firmware.pdf

# Compiling finished
echo -e "\033[92mDone...\033[0m";