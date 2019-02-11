#!/usr/bin/env node
'use strict';
const program = require('commander');
const lunr = require('lunr');
const jetpack = require('fs-jetpack');
const mime = require('mime');
const moment = require('moment-timezone');
const Mustache = require('mustache');
const epub = require('epub-gen');
const Remarkable = require('remarkable');
const Entities = require('html-entities').XmlEntities;
const version = require('./package.json').version;
const through2 = require('through2');
const sizeOf = require('image-size');
const markdownLinkCheck = require('markdown-link-check');
const chalk = require('chalk');
const hljs = require('highlight.js');
const puppeteer = require('puppeteer');
const timeStamp = 'YYYY-MM-DDTHH:mm:ssZ';

var createIDX = function(options){

	// Set up index and loop through the files in help
	var hfc = 0;
	var src_path = './help/';

	if(options.source)
		src_path = jetpack.path(options.source, 'help') + '/';

	if(!jetpack.exists(src_path)){
		console.log(chalk.red('Error:') + ' Source files not found');
		return;
	}
	var lunrIDX = lunr(function(){
		this.field('title');
		this.field('content');
		// the id
		this.ref('href');
		var files = jetpack.inspectTree(src_path).children;

		for(var i in files){
			if( files[i].type != 'file' || mime.getType(files[i].name) != 'text/markdown')
				continue;
			var entry = jetpack.read( jetpack.path('./help/', files[i].name) );
			var title = files[i].name.substr(1).substr(-3).split('_').join(' ');

			var mdParser = new Remarkable({
				"html":true,
				"linkify": true,
				"plugins": []
			});
			entry = mdParser.render(entry);

			this.add({
				href: files[i].name.substr(1),
				title: title,
				content: entry.replace(/<[^>]*>/g, ' ')
			});

			hfc++;
		}
	});

	// Now generate the help index
	jetpack.write(__dirname+'/dist/lunr-help-idx.json', lunrIDX, { jsonIndent: 0 });
	hfc++;
	console.log('Search index for '+hfc+' files generated ('+ (jetpack.inspect( jetpack.path(__dirname,'dist','lunr-help-idx.json') ).size / 1024).toFixed(2) +' kb).');
};

var searchIDX = function(options){

	var idxfile = jetpack.read( jetpack.path(__dirname,'dist','lunr-help-idx.json') ,'json');
	var idx = lunr.Index.load(idxfile);

	if(options.query !== undefined || options.query != ''){
		var results = idx.search( options.query);
		console.log('\nSearch for "'+ options.query + '" (Hits: '+results.length+')\n');

		console.log( JSON.stringify(results, null, 2) );

		for(var i in results){
			console.log((parseInt(i)+1)+'. '+results[i].ref+' (score: '+ results[i].score +')' );
		}
	}
	else{
		console.log('Enter a search term.');
	}
};

var commands = function(options){
	var time = moment().utc().format(timeStamp);

	if(options.new !== undefined){
		var file = "./firmware/"+options.new+".json";

		if(jetpack.exists(file)){
			console.log(chalk.red('Error: Command already exists'));
			return;
		}

		// The command data code
		var data = {
			"name": options.new,
			"description": "",
			"alias": [],
			"input": "",
			"values": [],
			"example": "",
			"type": "",
			"editor": "",
			"compatibility": {},
			"time":{
				"modified": time,
				"created": time
			},
			"deprecated": false,
			"dependencies":[],
			"parent": "",
			"access": "public"
		};

		jetpack.write(file, data, { jsonIndent: 2 });
		console.log(chalk.green(`Command ${options.new} created`));
		return;
	}

	if(options.view !== undefined){
		var file = "./firmware/"+options.view+".json";

		if(!jetpack.exists(file)){
			console.log(chalk.red('Error: Command doesn\'t exists'));
			return;
		}

		var cmd = jetpack.read(file, 'json');
		var output = chalk.yellow('\n'+ cmd.name);
		output += '\n------------------------\n';
		output += chalk.grey(cmd.description+'\n\n');
		output += 'Alias: '+ chalk.grey( (cmd.alias.join(', ') || '') +'\n');
		output += 'Input: '+ chalk.grey(cmd.input+'\n');
		output += 'Values: '+ chalk.grey( (cmd.values.join(', ') || '') +'\n');
		output += 'Example: '+ chalk.grey(cmd.example+'\n');
		output += 'Type: '+ chalk.grey(cmd.type+'\n');
		output += 'Editor: '+ chalk.grey(cmd.editor+'\n');
		output += 'Instruments:\n';

		var instruments = Object.keys(cmd.compatibility);
		for(var i in instruments){
			output += chalk.cyan( instruments[i]+':\n');
			output += chalk.grey( ' + ' + cmd.compatibility[instruments[i]].join('\n + ') +'\n');
		}

		output += 'Created: '+ chalk.grey(cmd.time.created+'\n');
		output += 'Modified: '+ chalk.grey(cmd.time.modified+'\n');
		output += 'Url: '+ chalk.grey(cmd.url+'\n');
		output += 'Dependancies: '+ chalk.cyan( (cmd.dependencies.join(', ') || '') +'\n');
		output += 'Parent: '+ chalk.grey(cmd.parent+'\n');

		if(cmd.deprecated)
			output += chalk.red('Command is deprecated');

		console.log(output);
		return;
	}

	if(options.release !== undefined){
		var files = jetpack.list('./firmware');
		for(var f in files){
			var content = null;
			if(files[f].match(/\.json$/)){
				content = jetpack.read('./firmware/'+files[f], 'json');
				if(!content.depreacted){
					content.time.modified = time;
					if(content.versions.indexOf(options.release) == -1)
						content.versions.push(options.release);
				}
				jetpack.write('./firmware/'+files[f], content, { jsonIndent: 2 });
			}
		}
		console.log(chalk.green(`Release ${options.release} created`));
		return;
	}

	if(options.documents !== undefined){
		var protocols = [];
		var consolecmds = [];

		var files = jetpack.list('./firmware');
		var active = [];
		var deprecated = [];

		for(var f in files){
			var content = null;
			if(files[f].match(/\.json$/)){
				content = jetpack.read('./firmware/'+files[f], 'json');
				if(content.deprecated)
					deprecated.push(files[f]);
				else
					active.push(files[f]);
			}
		}

		files = active.concat(deprecated);

		for(var f in files){
			var content = null;
			if(files[f].match(/\.json$/)){
				content = jetpack.read('./firmware/'+files[f], 'json');
				var document = '### '+ content.name.replace(/(\_)/g,'\\$1') + ((content.deprecated) ? ' `deprecated`' : '') + '\n\n' ;
				if(content.description != "")
					document += content.description+'\n\n';
				if(content.alias.length > 0)
					document += '**Alias:** '+ content.alias.map(function(a){
						return '`' + a + '`';
					}) + '\n\n';

				if(content.editor != "")
					document += '**Input:** '+ content.input +'\n\n';

				if(content.values.length > 0)
					document += '**Values:**\n\n'+ content.values.map(function(a){
						return '+ '+ a;
					}).join(' ') + '\n\n';

				if(content.example != "" && content.type == 'console')
					document += '**Example:**\n\n```bash\n'+ content.example + '\n```\n\n';

				if(content.example != "" && content.type == 'protocol')
					document += '**Example:**\n\n```Javascript\n'+ content.example + '\n```\n\n';

				if(content.editor != "" && content.type == 'protocol')
					document += '**Editor:** '+ content.editor +'\n\n';

				// document += '**Last Edited:** '+ moment(content.time.modified).format('LL') +'\n\n';

				if(content.dependencies.length > 0)
					document += '**Dependancies:**\n\n'+ content.dependencies.map(function(a){
						return `+ ${a}`;
					}).join('\n') + '\n\n';

				if(content.parent != "")
					document += '**Parent:** <'+ content.parent+'>\n\n';

				if(Object.keys(content.compatibility).length > 0){
					document += '**Instruments:**\n\n';
					document += Object.keys(content.compatibility).map(function(a){
						if(content.compatibility[a].length == 0)
							return `+ ${a}: \`not available\``;
						return `+ ${a}: `+ content.compatibility[a].reverse().map(function(b){
							return '`'+b+'`';
						}).join(' ');

					}).join('\n') + '\n\n';

				}

				if(content.type == 'console'){
					consolecmds.push(document.trim());
				}

				if(content.type == 'protocol'){
					protocols.push(document.trim());
				}
			}
		}

		consolecmds = consolecmds.join('\n\n***\n\n').trim();
		protocols = protocols.join('\n\n***\n\n').trim();

		jetpack.write('./help/_instruments_Console_Commands.md', consolecmds);
		jetpack.write('./help/_protocols_Commands.md', protocols);
		console.log(chalk.green(`Documents created`));
		return;
	}

	if(options.merge !== undefined){
		var src_path = './firmware';
		if(options.source)
			src_path = jetpack.path(options.source, 'firmware' );

		if(!jetpack.exists(src_path)){
			console.log(chalk.red('Error:') + ' Source files not found');
			return;
		}
		var files = jetpack.list(src_path);
		var merged = {};
		var file_path = null;
		for(var f in files){
			if(files[f].match(/\.json$/)){
				file_path = jetpack.path(src_path, files[f]);
				content = jetpack.read(file_path, 'json');
				merged[content.name] = content;
			}
		}
		jetpack.write('./dist/firmware-commands.json', merged, { jsonIndent: 2 });
		console.log(chalk.green(`${Object.keys(merged).length} Files merged`));
		return;
	}

};

var pingLinks = function(){
	var list = jetpack.find('.', { matching: ['help/*.md', 'tutorials/*.md'] });
	var files = {};
	var linkList = [];
	var localList = [];
	var deadLinks = [];
	for(var i in list){
		var content = jetpack.read(list[i]);
		files[list[i]] = {'links':[], 'local': []}
		var links = content.match(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim)
		var internalLinks = content.match(/[^!]\[(.*?)\]\((\.{0,2}\/.*?)\)/gm);
		var images = content.match(/!\[(.*?)\]\((.*?)\)/gm);
		if(links){
			for(var l in links){
				files[list[i]].links.push(links[l]);
				if(linkList.indexOf(links[l]) == -1)
					linkList.push(links[l]);
			}
		}
		if(internalLinks){
			internalLinks = internalLinks.map(function(x){
				return x.match(/[^!]\[(.*?)\]\((\.{0,2}\/.*?)\)/m)[2];
			});
			for(var l in internalLinks){
				files[list[i]].local.push(internalLinks[l]);
				if(localList.indexOf(internalLinks[l]) == -1)
					localList.push(internalLinks[l]);
			}
		}
		if(images){
			images = images.map(function(x){
				return x.match(/(!\[(.*?)\]\()(.*?)(\))/m)[3];
			});
			for(var l in images){
				files[list[i]].local.push(images[l]);
				if(localList.indexOf(images[l]) == -1)
					localList.push('../'+images[l]);
			}
		}
	}

	console.log(chalk.yellow(`Testing ${linkList.length} Unique Links`));

	markdownLinkCheck(linkList.join('\n'), {
		baseUrl: 'https://photosynq.org',
		showProgressBar: true
	}, function (err, results) {
		if (err) {
			console.error('Error', err);
			return;
		}
		results.forEach(function (result) {
			if(result.status == 'dead')
				deadLinks.push(result.link);
		});
		var errors = false;
		for(var file in files){
			console.log(`\n${chalk.cyan(file)}`);
			var toCheck = false;
			if(files[file]['links'] !== undefined){
				for(var l in files[file]['links']){
					toCheck = true;
					if(deadLinks.indexOf(files[file]['links'][l]) > -1){
						console.log(`[${chalk.red('✖')}] ${chalk.yellow('LINK')} ${files[file]['links'][l]}`);
						errors = true;
					}
					else
						console.log(`[${chalk.green('✓')}] ${chalk.yellow('LINK')} ${files[file]['links'][l]}`);
				}
			}
			if(files[file].local !== undefined){
				for(var l in files[file].local){
					toCheck = true;
					if(files[file].local[l].match(/^data:image/))
						console.log(`[${chalk.green('✓')}] ${chalk.yellow('LOCAL')} base64 image`);
					else if(jetpack.exists(files[file].local[l])){
						console.log(`[${chalk.red('✖')}] ${chalk.yellow('LOCAL')} ${files[file].local[l]}`);
						errors = true;
					}
					else
						console.log(`[${chalk.green('✓')}] ${chalk.yellow('LOCAL')} ${files[file].local[l]}`);
				}
			}
			if(!toCheck)
				console.log(`- ${chalk.yellow('Nothing to Check')}`);
		}
		if(errors)
			console.log(chalk.red(`\nError: ${deadLinks.length} Dead links or missing files found`));
	});
};

var compileMD = function(options){

	if(options.input === undefined){
		console.log(chalk.red('Error:') + ' Input file not found');
		return;
	}

	var md = jetpack.read(options.input);
	var src_path = '.';

	var date = moment().format('LL');
	if(options.date !== undefined){
		date = moment(options.date).format('LL');
	}

	if (options.source !== undefined)
		src_path = options.source;

	if(!jetpack.exists(src_path)){
		console.log(chalk.red('Error:') + ' Source files not found');
		return;
	}

	var list = jetpack.find(src_path, { matching: ['help/*.md', 'tutorials/*.md'] });
	var files = {};
	var file = null;
	for(var i in list){
		if (options.source){
			file = list[i].split('/');
			file = file[file.length-2] + '/' + file[file.length-1];
		}
		else{
			file = list[i];
		}
		files[file] = jetpack.read(list[i]) + '\n';
	}
	md = Mustache.render(md, {date: date, version: (options.tag || '--') }, files);
	if (options.source)
		md = md.replace(/\]\(\.\.\/images\//gm, ']('+jetpack.path(src_path, 'images')+'/');
	else
		md = md.replace(/\]\(\.\.\/images\//gm, '](images/');
	jetpack.write(options.output, md);
};

function compileHTML(md){
	md = md.trim();
	var mdParser = new Remarkable({
		html: true,
		breaks: true,
		linkify: true,
		plugins: [],
		highlight: function (str, lang) {
			if (lang && hljs.getLanguage(lang)) {
			  try {
				return hljs.highlight(lang, str).value;
			  } catch (err) {}
			}

			try {
			  return hljs.highlightAuto(str).value;
			} catch (err) {}

			return ''; // use external default escaping
		}
	});
	var html = mdParser.render(md);
	html = html.split('\n');
	html = html.map(function(element){

		var src = element.match(/(img\s?src\s?=\s?\")(.*?)(\")/im);
		if(src){
			if(jetpack.exists(src[2])){
				var dimensions = sizeOf(src[2]);
				if(dimensions.height > 800 && (dimensions.width / dimensions.height) < 0.6 ){
					element = element.replace('<img','<img style="max-width:50%" ');
				}
			}
		}

		if(element.match(/<em>Tips?:<\/em>/)){
			element = element.replace(/^<p>/i, '<p class="tip">');
		}

		if(element.match(/<em>Notes?:<\/em>/)){
			element = element.replace(/^<p>/i, '<p class="note">');
		}

		if(element.match(/<img\/?[^>]+(>|$)/g)){
			var img = '';
			img += '<figure>';
			img += element.match(/<img\/?[^>]+(>|$)/)[0].replace(/(img\s?src\s?=\s?\")(.*?)(\")/im, `$1file://$2$3`);
			if(!jetpack.exists( element.match(/<img\/?[^>]+(>|$)/)[0].match(/(img\s?src\s?=\s?\")(.*?)(\")/im)[2] ))
				console.log(chalk.red(`Error - Missing file: `) + element.match(/<img\/?[^>]+(>|$)/)[0].match(/(img\s?src\s?=\s?\")(.*?)(\")/im)[2] +'\n');
			img += '<figcaption>';
			img +=  mdParser.render( element.match(/(alt=)(\"([^>]+)(\"|$))/)[3].replace(/<\/?p>/g, '') );
			img += '</figcaption>';
			img += '</figure>';
			element = element.replace(/<img\/?[^>]+(>|$)/, img);
		}

		if(element.match(/^<li>/)){
			element = element.replace(/^(\<li\>\s{0,})(\[x\])/i, `$1`);
		}

		var href = element.match(/(a href\s?=\s?\")(\.{0,2})(\/.*?)(\")/im);
		if(href){
			element = element.replace(/(a href\s?=\s?\")(\.{0,2})(\/.*?)(\")/im, '$1https://photosynq.org$3$4');
		}
		return element;
	});
	// Clean up to avoid empty pages
	html = html.join('\n').replace(/(<hr>)(\n<h[1-4]>)/gim,'$2'); // h1-4 can lead to a page break
	html = html.replace(/<hr>\n{0,}<hr>/gim, '<hr>'); // Two page breaking <hr> in a row
	// jetpack.write('./dist/'+html.length+'.html',html);
	return html;
}

var createPDF = function (options){

	var md = jetpack.read(options.input);
	var html = compileHTML(md);

	var filename = jetpack.inspect(options.input).name;
	filename = filename.substr(0,(filename.length -3)).split('-').slice(1).join(' ');

	(async () => {
		const browser = await puppeteer.launch({
			headless: true,
			args: [ "--disable-web-security" ]
		});

		const page = await browser.newPage();

		await page.setContent(html);

		await page.addStyleTag({
			content: jetpack.read( jetpack.path(__dirname, "src", "css", "print.css") ).replace(/(url\(\s?\')(\.{1,2})/g, `$1file://${__dirname}` )
		});

		await page.addStyleTag({
			path: jetpack.path(__dirname, "node_modules", "highlight.js", "styles", "github.css")
		});

		/** Make sure to install font-awesome into your font library! */
		await page.addStyleTag({
			path: jetpack.path(__dirname, "node_modules", "font-awesome", "css", "font-awesome.css")
		});

		await page.pdf({
			displayHeaderFooter: true,
			headerTemplate: `
				<div class="text center"></div>`,
			footerTemplate: `
				<div class="text center" style="font-size:10px; font-family: Arial, Helvetica, sans-serif;">
		 		<span class="pageNumber"></span> of <span class="totalPages"></span>
			 	</div>`,
			format: 'Letter',
			margin: {
				top: "20mm",
				right: "20mm",
				bottom: "20mm",
				left: "20mm"
			},
			path: jetpack.path(__dirname,options.output),
			printBackground: true,
			scale: 1
		}).then(function(){
			console.log('PDF created: ', options.output);
		}, function(error) {
			console.log(error);
		});

		await browser.close();

	})();
};

var createEPUB = function (){
	var cwd = jetpack.cwd();
	var cssString = jetpack.read( jetpack.path( cwd, 'src', 'css', 'epub.css' ) );
	cssString += jetpack.read( jetpack.path( cwd, "node_modules", "highlight.js", "styles", "github.css") );
	cssString += jetpack.read( jetpack.path( cwd, 'node_modules', 'font-awesome', 'css', 'font-awesome.css' ) ).replace( /\.\.\/fonts\/fontawesome/g , './fonts/fontawesome');

  var option = {
    title: "", // *Required, title of the book.
    author: "", // *Required, string or array.
		// publisher: "", // optional
		version: 3, // or 2
		css: cssString, // sting with css
		fonts: [ jetpack.path( cwd, 'node_modules', 'font-awesome', 'fonts', 'fontawesome-webfont.ttf' ) ],
		lang: 'en',
		tocTitle: 'Contents',
		customHtmlTocTemplatePath: jetpack.path( cwd, 'src', 'templates', 'toc.xhtml.ejs' ),
		customOpfTemplatePath: './src/templates/content.opf.ejs',
    cover: jetpack.path( cwd, 'src', 'css', 'epub-cover.png' ), // Url or File path, both ok.
		content: [],
		remarkable: {
			"html":true,
			"linkify": true,
			"plugins": []
		},
		verbose: true
	};

	const entities = new Entities();
	var output = null;
	var collect = false;
	for(var i in process.argv){
		if(process.argv[i].match(/^-i|--input/)){
			collect = true;
			continue;
		}
		if(process.argv[i].match(/^-o|--output/)){
			if(process.argv[(parseInt(i)+1)] !== undefined){
				output = process.argv[(parseInt(i)+1)];
			}
			collect = false;
			continue;
		}
		if(process.argv[i].match(/^-d|--date/)){
			if(process.argv[(parseInt(i)+1)] !== undefined){
				option.date = process.argv[(parseInt(i)+1)];
			}
			collect = false;
			continue;
		}
		if(process.argv[i].match(/^-v|--version/)){
			if(process.argv[(parseInt(i)+1)] !== undefined){
				option.version = process.argv[(parseInt(i)+1)];
			}
			collect = false;
			continue;
		}
		if(process.argv[i].match(/^-a|--author/)){
			if(process.argv[(parseInt(i)+1)] !== undefined){
				option.author = process.argv[(parseInt(i)+1)];
				try{
					option.author = JSON.parse(option.author);
				}
				catch(e){}
			}
			collect = false;
			continue;
		}
		if(process.argv[i].match(/^-t|--title/)){
			if(process.argv[(parseInt(i)+1)] !== undefined){
				option.title = process.argv[(parseInt(i)+1)];
			}
			collect = false;
			continue;
		}
		if(collect){
			var read = jetpack.read(process.argv[i]);
			if(read !== undefined)
				jetpack.append( jetpack.path( cwd, 'dist', 'temp.md' ), read);
		}
	}

	if(!output){
		console.log('\nNo output file defined\n');
		return;
	}

	if(!jetpack.exists(jetpack.path( cwd, 'dist', 'temp.md' ))){
		console.log('\nNo input file defined\n');
		return;
	}

	var _html = "";

	jetpack.createReadStream(jetpack.path( cwd, 'dist', 'temp.md' ))
	.pipe(
		through2(
			function transform (chunk, enc, cb) {
				_html += chunk;
				cb();
			},
			function flush (cb) {
				var self = this;
				self.push( compileHTML(_html) )
				self.push(null);
				cb();
			}
		)
	)
	.on('data', function (data) {
		_html = data.toString().trim().split('\n');
		var chapters = {};
		var chapterTitle = null;

		for(var i in _html){
			if(_html[i].match(/^<h2>/)){
				chapterTitle = _html[i].replace(/<\/?[^>]+(>|$)/g, "");
				chapters[chapterTitle] = "";
				continue;
			}
			if(chapterTitle){
				chapters[chapterTitle] += _html[i]+'\n';
			}
		}
		var date = moment( (option.date === undefined) ? new Date() : option.date ).format('LL') || moment().format('LL');
		var version = (option.version === undefined) ? "unknown" : option.version;

		var header = '<div style="margin-top:45%; text-align:center">';
			header += '<p>PhotosynQ Documentation</p>';
			header += '<small>Modified: '+date+'</small><br>';
			header += '<small>Version: '+version+'</small>';
		header += '</div>';

		option.content.push({
			data: header,
			excludeFromToc: true,
			beforeToc: false
		});

		for(var c in chapters){
			option.content.push({
				title: entities.decode(c),
				data: chapters[c]
			});
		}

		new epub(option, output)
		jetpack.remove(jetpack.path( cwd, 'dist', 'temp.md' ));
	});
};

program
  .version(version);

program
	.command('index')
	.option('-s, --source [dir]','Use files from a different source')
	.description('Generate search index')
	.action(createIDX);

program
	.command('search')
	.option('-q, --query <query>','Query (e.g. measurement)')
	.description('Search terms based on the search index')
	.action(searchIDX);

program
	.command('cmd')
	.option('-n, --new <command>','Add a new command')
	.option('-v, --view <command>','View a new command')
	.option('-r, --release <version>','Add a new release version to commands that are not deprecated')
	.option('-d, --documents','Generate new help documents')
	.option('-m, --merge','Merge all files into one JSON file')
	.option('-s, --source [dir]','Compile files from a different source')
	.description('Manage firmware commands')
	.action(commands);


program
	.command('test-links')
	.option('-s, --source [dir]','Compile files from a different source')
	.description('Ping all links in markdown documents to see if they are alive')
	.action(pingLinks);

program
	.command('compile')
	.option('-i, --input <input>','Markdown Template File')
	.option('-o, --output <output>','Output file')
	.option('-t, --tag <tag>','Set Version (tag) of the document')
	.option('-d, --date <date>','Set Date (date) of the document (ISO 8601 format)')
	.option('-s, --source [dir]','Compile files from a different source')
	.description('Generate master markdown file from template')
	.action(compileMD);

program
	.command('pdf')
	.option('-i, --input <input>','Markdown File')
	.option('-o, --output <output>','PDF File')
	.description('Generate PDF from Markdown')
	.action(createPDF);

program
	.command('epub')
	.option('-i, --input <input>','Markdown File')
	.option('-o, --output <output>','ePub File')
	.option('-t, --title [title]','Ebook Title')
	.option('-a, --author','Ebook Author(s)')
	.option('-v, --version <version>','Version (Github tag)')
	.option('-d, --date <date>','Release Date')
	.description('Generate ePub from Markdown')
	.action(createEPUB);

program.parse(process.argv);