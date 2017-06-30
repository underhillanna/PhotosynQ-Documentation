#!/usr/bin/bash
echo -e "\033[92mBuild Master Documents for PhotosynQ\033[0m";
echo "------------------------------------";
echo "Compiling Help Files";

# Merge all files into one markdown document
perl -ne 's/^\[(.+)\].*/`cat $1`/e;print' help-master.md > PhotosynQ-Help-Manual.md
perl -ne 's/^\[(.+)\].*/`cat $1`/e;print' tutorials-master.md > PhotosynQ-Getting-Started.md

echo "Fixing Image Paths";

# Remove all ../ from image paths 
perl -p -i -e "s/\]\(\.\.\/images/\]\(images/g" PhotosynQ-Help-Manual.md
perl -p -i -e "s/\]\(\.\.\/images/\]\(images/g" PhotosynQ-Getting-Started.md


# Adding date to indicate latest updates
echo "Adding Dates";
perl -p -i -e "s/INSERT_DATE/$(date +%b) $(date +%d), $(date +%Y)/g" PhotosynQ-Help-Manual.md
perl -p -i -e "s/INSERT_DATE/$(date +%b) $(date +%d), $(date +%Y)/g" PhotosynQ-Getting-Started.md


echo "Converting markdown to pdf";

# Now we can build the pdfs as well
pandoc PhotosynQ-Help-Manual.md --from=markdown_github -o PhotosynQ-Help-Manual.html
pandoc PhotosynQ-Getting-Started.md --from=markdown_github --table-of-contents -o PhotosynQ-Getting-Started.html

pandoc PhotosynQ-Help-Manual.html --latex-engine=xelatex --table-of-contents --wrap=auto --variable=geometry:"top=2cm, bottom=2cm, left=2cm, right=5cm" -o PhotosynQ-Help-Manual.pdf
pandoc PhotosynQ-Getting-Started.html --latex-engine=xelatex --table-of-contents --wrap=auto --variable=geometry:"top=2cm, bottom=2cm, left=2cm, right=5cm" -o PhotosynQ-Getting-Started.pdf

# Clean up
rm PhotosynQ-Help-Manual.html
rm PhotosynQ-Getting-Started.html

# Compiling finished
echo "Done...";