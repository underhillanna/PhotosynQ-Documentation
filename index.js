#!/usr/bin/env node
'use strict';
const program = require('commander');
const elasticlunr = require('elasticlunr');
const jetpack = require('fs-jetpack');
const mime = require('mime');
const moment = require('moment-timezone');
const Mustache = require('mustache');
const markdownpdf = require('markdown-pdf');
const epub = require('epub-gen');
const Remarkable = require('remarkable');
const Entities = require('html-entities').XmlEntities;
const version = require('./package.json').version;
const through2 = require('through2');
const sizeOf = require('image-size');
const markdownLinkCheck = require('markdown-link-check');
const chalk = require('chalk');

const timeStamp = 'YYYY-MM-DDTHH:mm:ssZ';

var createIDX = function(){

	var elasticIDX = elasticlunr(function(){
		this.addField('title');
		this.addField('content');
		// the id
		this.setRef('href');
		this.saveDocument(false);
	});

	// Now loop through the files in help
	var files = jetpack.inspectTree('./help/').children;
	var hfc = 0;

	for(var i in files){
		if( files[i].type != 'file' || mime.getType(files[i].name) != 'text/markdown')
			continue;
		var entry = jetpack.read( jetpack.path('./help/', files[i].name) );
		var title = files[i].name.substr(1).substr(-3).split('_').join(' ');
		var category = files[i].name.substr(1).split('_')[0];

		elasticIDX.addDoc({
			href: files[i].name.substr(1),
			title: title,
			category: category,
			content: entry.replace(/<[^>]*>/g, ' ')
		});

		hfc++;
	}

	// Now generate the help index
	jetpack.write(__dirname+'/dist/elasticlunr-help-idx.json', elasticIDX, { jsonIndent: 0 });
	hfc++;
	console.log('Search index for '+hfc+' files generated ('+ (jetpack.inspect( jetpack.path(__dirname,'dist','elasticlunr-help-idx.json') ).size / 1024).toFixed(2) +' kb).');
};

var searchIDX = function(options){

	var idxfile = jetpack.read( jetpack.path(__dirname,'dist','elasticlunr-help-idx.json') ,'json');
	var idx = elasticlunr.Index.load(idxfile);

	if(options.query !== undefined || options.query != ''){
		var results = idx.search( options.query,
		{
// 			fields: {
// 				title: {boost: 3},
// 				category: {boost: 2},
// 				content: {boost: 1}
// 			},
// 			bool: "OR",
			expand: true
		});
		console.log('\nSearch for "'+ options.query + '" (Hits: '+results.length+')\n');

		for(var i in results){
			console.log((parseInt(i)+1)+'. '+results[i].ref+' (score: '+ results[i].score.toFixed(6) +')' );
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
			"versions": [],
			"devices":[],
			"time":{
			"modified": time,
			"created": time
			},
			"deprecated": false,
			"url": "",
			"dependencies":[],
			"parent": ""
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
		var output = chalk.yellow('\n'+ cmd.name + '\n') + '------------------------\n';
		output += chalk.grey(cmd.description+'\n\n');
		output += 'Alias: '+ chalk.grey( (cmd.alias.join(', ') || '') +'\n');
		output += 'Input: '+ chalk.grey(cmd.input+'\n');
		output += 'Values: '+ chalk.grey( (cmd.values.join(', ') || '') +'\n');
		output += 'Example: '+ chalk.grey(cmd.example+'\n');
		output += 'Type: '+ chalk.grey(cmd.type+'\n');
		output += 'Editor: '+ chalk.grey(cmd.editor+'\n');
		output += 'Versions: '+ chalk.cyan( (cmd.versions.reverse().join(', ') || '') +'\n');
		output += 'Instruments: '+ chalk.cyan( (cmd.devices.join(', ') || '') +'\n');
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
		var protocols = '';
		var consolecmds = '';

		var files = jetpack.list('./firmware');
		for(var f in files){
			var content = null;
			if(files[f].match(/\.json$/)){
				content = jetpack.read('./firmware/'+files[f], 'json');
				var document = '### '+ content.name.replace(/(\_)/g,'\\$1') + ((content.deprecated) ? ' `deprecated`' : '') + '\n\n' ;
				if(content.description != "")
					document += content.description+'\n\n';
				if(content.alias.length > 0)
					document += '**Alias:**\n\n'+ content.alias.map(function(a){
						return '+ ' + a;
					}) + '\n\n';

				if(content.editor != "")
					document += '**Input:** '+ content.input +'\n\n';

				if(content.values.length > 0)
					document += '**Values:**\n\n'+ content.values.map(function(a){
						return '+ '+ a;
					}).join(' ') + '\n\n';

				if(content.example != "")
					document += '**Example:**\n\n```Javascript\n'+ content.example + '\n```\n\n';

				if(content.editor != "")
					document += '**Editor:** '+ content.editor +'\n\n';

				if(content.versions.length > 0)
					document += '**Versions:**\n\n'+ content.versions.reverse().map(function(a){
						return '`' + a + '`';
					}).join(' ') + '\n\n';

				if(content.devices.length > 0)
					document += '**Instruments:**\n\n'+ content.devices.map(function(a){
						return '`' + a + '`';
					}).join(' ') + '\n\n';

				// document += '**Last Edited:** '+ moment(content.time.modified).format('LL') +'\n\n';
				if(content.url != "")
					document += '**Url:** <'+ content.url+'>\n\n';
				if(content.dependencies.length > 0)
					document += '**Dependancies:**\n\n'+ content.dependencies.map(function(a){
						return '+ ' + a;
					}) + '\n\n';
				if(content.parent != "")
					document += '**Parent:** <'+ content.parent+'>\n\n';

				// Add a page - break
				document += '***\n\n';

				if(content.type == 'console'){
					consolecmds += document;
				}

				if(content.type == 'protocol'){
					protocols += document;
				}
			}
		}

		consolecmds = consolecmds.trim();
		protocols = protocols.trim();

		jetpack.write('./help/_instruments_Console_Commands.md', consolecmds);
		jetpack.write('./help/_protocols_Commands.md', protocols);
		console.log(chalk.green(`Documents created`));
		return;
	}

	if(options.merge !== undefined){
		var files = jetpack.list('./firmware');
		var merged = [];
		for(var f in files){
			if(files[f].match(/\.json$/)){
				content = jetpack.read('./firmware/'+files[f], 'json');
				merged.push(content);
			}
		}
		jetpack.write('./dist/firmware.json', merged, { jsonIndent: 2 });
		console.log(chalk.green(`Files merged`));
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
				files[list[i]].links.push(links[l])
				if(linkList.indexOf(links[l]) == -1)
					linkList.push(links[l])
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
				deadLinks.push(result.link)
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
	var md = jetpack.read(options.input);
	var list = jetpack.find('.', { matching: ['help/*.md', 'tutorials/*.md'] });
	var files = {};
	for(var i in list){
		files[list[i]] = jetpack.read(list[i]) + '\n';
	}
	md = Mustache.render(md, {date: moment().format('LL'), version: (options.tag || '--') }, files);
	md = md.replace(/\]\(\.\.\/images\//gm, '](images/');
	jetpack.write(options.output, md);
};

function preProcessMd () {
	return through2((data, enc, cb) => {
		let nd = data.toString().trim();
		cb( null, new Buffer( nd ) );
	});
}

function preProcessHtml () {
	return through2((data, enc, cb) => {
		let nd = data.toString().trim().split('\n');
		nd = nd.map(function(element){

			var src = element.match(/(img\s?src\s?=\s?\")(.*?)(\")/im);
			if(src){
				if(jetpack.exists(src[2])){
					var dimensions = sizeOf(src[2]);
					if(dimensions.width < 800 && (dimensions.width / dimensions.height) < 1.5 ){
						element = element.replace('>',' style="max-width:50%">');
					}
				}
			}

			var href = element.match(/(a href\s?=\s?\")(\.{0,2})(\/.*?)(\")/im);
			if(href){
				element = element.replace(/(a href\s?=\s?\")(\.{0,2})(\/.*?)(\")/im, '$1https://photosynq.org$3$4');
			}

			return element;
		});
		// Clean up to avoid empty pages
		nd = nd.join('\n').replace(/(<hr>)(\n<h[1-4]>)/gim,'$2'); // h1-4 can lead to a page break
		nd = nd.replace(/<hr>\n{0,}<hr>/gim, '<hr>'); // Two page breaking <hr> in a row
		// jetpack.write('./dist/'+nd.length+'.html',nd);
		cb( null, new Buffer( nd ) );
	});
}

var createPDF = function (options){

	var MARKDOWN_OPTIONS = {
		cssPath: 'src/css/print.css',
		// phantomPath: 'node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs',
		paperBorder: '1cm',
		renderDelay: 2500,
		runningsPath: 'src/runnings.js',
		paperFormat: 'Letter',
		paperOrientation: 'portrait',
		preProcessMd: preProcessMd,
		preProcessHtml: preProcessHtml,
		remarkable: {
			"html":true,
			"linkify": true,
			"plugins": []
		}
	};

	var filename = jetpack.inspect(options.input).name;
	filename = filename.substr(0,(filename.length -3)).split('-').slice(1).join(' ');
	jetpack.write(__dirname+'/dist/title.json', {title: filename }, { jsonIndent: 0 });

	markdownpdf(MARKDOWN_OPTIONS).from(options.input).to(options.output, function (data) {
		jetpack.remove(__dirname+'/dist/title.json');
		console.log('PDF created: ', options.output);
	});
};


var createEPUB = function (){

	var cwd = jetpack.cwd();

    var option = {
        title: "", // *Required, title of the book.
        author: "", // *Required, string or array.
		// publisher: "", // optional
		version: 3, // or 2
		css: jetpack.read( jetpack.path( cwd, 'src', 'css', 'epub.css' ) ), // sting with css
		// fonts: ,
		lang: 'en',
        cover: jetpack.path( cwd, 'src', 'css', 'epub-cover.png' ), // Url or File path, both ok.
		content: [],
		remarkable: {
			"html":true,
			"linkify": true,
			"plugins": []
		}
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
	.pipe(preProcessMd())
	.pipe(
		through2(
			function transform (chunk, enc, cb) {
				_html += chunk;
				cb();
			},
			function flush (cb) {
				var self = this;
				var mdParser = new Remarkable(option.remarkable);
				self.push(mdParser.render(_html));
				self.push(null);
				cb();
			}
		)
	)
	.pipe(preProcessHtml())
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
				chapters[chapterTitle] += _html[i].replace(/images/i, jetpack.path(cwd, 'images'));
			}
		}
		for(var c in chapters){
			option.content.push({
				title: entities.decode(c),
				data: chapters[c]
			});
		}
		new epub(option, output);
		jetpack.remove(jetpack.path( cwd, 'dist', 'temp.md' ));
	});
};

program
  .version(version);

program
	.command('index')
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
	.description('Manage firmware commands')
	.action(commands);


program
	.command('test-links')
	.description('Ping all links in markdown documents to see if they are alive')
	.action(pingLinks);

program
	.command('compile')
	.option('-i, --input <input>','Markdown Template File')
	.option('-o, --output <output>','Output file')
	.option('-t, --tag <tag>','Set Version (tag) of the document')
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
	.description('Generate ePub from Markdown')
	.action(createEPUB);

program.parse(process.argv);