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

echo "Fixing Image Paths";

# Remove all ../ from image paths 
perl -p -i -e "s/\]\(\.\.\/images/\]\(images/g" ./dist/PhotosynQ-Help-Manual.md
perl -p -i -e "s/\]\(\.\.\/images/\]\(images/g" ./dist/PhotosynQ-Getting-Started.md


# Adding date to indicate latest updates
echo "Adding Dates";
perl -p -i -e "s/INSERT_DATE/$(date +%b) $(date +%d), $(date +%Y)/g" ./dist/PhotosynQ-Help-Manual.md
perl -p -i -e "s/INSERT_DATE/$(date +%b) $(date +%d), $(date +%Y)/g" ./dist/PhotosynQ-Getting-Started.md


echo "Converting markdown to pdf";

# Now we can build the pdfs as well
pandoc ./dist/PhotosynQ-Help-Manual.md --from=markdown_github -o ./dist/PhotosynQ-Help-Manual.html
pandoc ./dist/PhotosynQ-Getting-Started.md --from=markdown_github --table-of-contents -o ./dist/PhotosynQ-Getting-Started.html

pandoc ./dist/PhotosynQ-Help-Manual.html --latex-engine=xelatex --table-of-contents --wrap=auto --variable=geometry:"top=2cm, bottom=2cm, left=2cm, right=5cm" -o ./dist/PhotosynQ-Help-Manual.pdf
pandoc ./dist/PhotosynQ-Getting-Started.html --latex-engine=xelatex --table-of-contents --wrap=auto --variable=geometry:"top=2cm, bottom=2cm, left=2cm, right=5cm" -o ./dist/PhotosynQ-Getting-Started.pdf

# Clean up
rm ./dist/PhotosynQ-Help-Manual.html
rm ./dist/PhotosynQ-Getting-Started.html

# Compiling finished
echo -e "\033[92mDone...\033[0m";