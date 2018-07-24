#!/usr/bin/env node
'use strict';
const program = require('commander');
const elasticlunr = require('elasticlunr');
const jetpack = require('fs-jetpack');
const mime = require('mime');
const moment = require('moment-timezone');
const Mustache = require('mustache');
const markdownpdf = require('markdown-pdf');
const version = require('./package.json').version;
const through2 = require('through2');
const sizeOf = require('image-size');
const markdownLinkCheck = require('markdown-link-check');
const chalk = require('chalk');

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

program.parse(process.argv);