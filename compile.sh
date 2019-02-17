#!/usr/bin/bash
echo "\033[92mBuild Master Documents for PhotosynQ\033[0m";
echo "------------------------------------";
# Empty the distribution folder dist
echo "Remove previous distribution files"
rm ./dist/*

# Get the latest release from Github
TAG=$(git describe --abbrev=0 --tags)
DATE=$(git log --tags --simplify-by-decoration --pretty="format:%aI" --max-count=1)

if [ "$1" = "HEAD" ]
then
    TAG=$(git rev-parse --short HEAD)
    DATE=$(git log --simplify-by-decoration --pretty="format:%aI" --max-count=1)
fi

echo "Compile files for Github tag $TAG ($DATE)";
mkdir ./dist/tmp/
git archive -o ./dist/latest.zip --prefix=tmp/ HEAD
unzip ./dist/latest.zip -d ./dist -x tmp/src/* tmp/*.sh tmp/package.json tmp/package-lock.json tmp/*.js tmp/README.md tmp/LICENSE
rm ./dist/latest.zip

# Get all the firmware commands and build the help files
node index.js cmd --documents -s ./dist/tmp

# Generate new documentation index
echo "Generate Search index"
node index.js index -s ./dist/tmp

# Compiling the master markdown files from templates
echo "Compile master files from build templates"
node index.js compile -i ./dist/tmp/build/help-master.md -o ./dist/PhotosynQ-Help-Manual.md -t $TAG -d $DATE -s ./dist/tmp
node index.js compile -i ./dist/tmp/build/tutorials-master.md -o ./dist/PhotosynQ-Getting-Started.md -t $TAG -d $DATE -s ./dist/tmp
node index.js compile -i ./dist/tmp/build/firmware-master.md -o ./dist/PhotosynQ-Firmware.md -t $TAG -d $DATE -s ./dist/tmp

node index.js compile -i ./dist/tmp/build/MultispeQ-v1.0.md -o ./dist/PhotosynQ-MultispeQ-v1.0.md -t $TAG -d $DATE -s ./dist/tmp
node index.js compile -i ./dist/tmp/build/MultispeQ-v2.0.md -o ./dist/PhotosynQ-MultispeQ-v2.0.md -t $TAG -d $DATE -s ./dist/tmp

# add the file for the server to the distribution as well
echo "Generate Firmware Commands file for Server";
node index.js cmd -s ./dist/tmp --merge

# Now we can build the pdfs as well
echo "Converting markdown to pdf";
node index.js pdf -i ./dist/PhotosynQ-Help-Manual.md -o ./dist/PhotosynQ-Help-Manual.pdf
node index.js pdf -i ./dist/PhotosynQ-Getting-Started.md -o ./dist/PhotosynQ-Getting-Started.pdf
node index.js pdf -i ./dist/PhotosynQ-Firmware.md -o ./dist/PhotosynQ-Firmware.pdf

node index.js pdf -i ./dist/PhotosynQ-MultispeQ-v1.0.md -o ./dist/PhotosynQ-MultispeQ-v1.0.pdf
node index.js pdf -i ./dist/PhotosynQ-MultispeQ-v2.0.md -o ./dist/PhotosynQ-MultispeQ-v2.0.pdf

echo "Compiling markdown into ebook";
node index epub -t "PhotosynQ Documentation" -a 'PhotosynQ' -v $TAG -d $DATE -o ./dist/PhotosynQ-Documentation.epub -i ./dist/PhotosynQ-Help-Manual.md ./dist/PhotosynQ-Getting-Started.md ./dist/PhotosynQ-Firmware.md

echo "Cleaning up temporary files..."
rm ./dist/*.md
rm -r ./dist/tmp

# Compiling finished
echo "\033[92mDone\033[0m";