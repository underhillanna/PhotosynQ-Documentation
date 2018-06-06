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

var createIDX = function(options){

	var elasticIDX = elasticlunr(function(){
		this.addField('title');
		this.addField('content');
		// the id
		this.setRef('href');
		this.saveDocument(false);
	});

	// Copy the protocol commands from the firmware documentation
	var file, path;
	try{
		file = '_protocols_Commands.md';
		path = '../PhotosynQ-Firmware/commands/docs/';
		jetpack.copy( jetpack.path(path,file) , jetpack.path( './help',file), { overwrite: true });
		console.log('Firmware Documentation copied.');
	}catch(e){
		console.log('Firmware Documentation Repo not found.');
	}

	// Copy the protocol commands from the firmware documentation
	try{
		file = '_instruments_Console_Commands.md';
		path = '../PhotosynQ-Firmware/commands/docs/';
		jetpack.copy( jetpack.path(path,file) , jetpack.path( './help',file), { overwrite: true });
		console.log('Firmware Instrument Commands copied.');
	}catch(e){
		console.log('Firmware Documentation Repo not found.');
	}

	// Now loop through the files in help
	var files = jetpack.inspectTree('./help/').children;
	var hfc = 0;

	for(var i in files){
		if( files[i].type != 'file' || mime.getType(files[i].name) != 'text/markdown' || files[i].name == '_instruments_Console_Commands.md')
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

var compileMD = function(options){
	var md = jetpack.read(options.input);
	md = Mustache.render(md, {date: moment().format('LL'), version: (options.tag || '--') });

	var files = md.match(/^\[(.+)\]/gm);
	var file = null;

	for(var i in files){
		file = files[i].substr(1, (files[i].length -2) );
		if(jetpack.exists( file ) == 'file'){
			var content = jetpack.read(file);
			var regex = files[i].replace('[', '\\[').replace(']', '\\]').replace('.', '\\.').replace('/', '\\/');
			md = md.replace( new RegExp( regex, 'm' ), content );
		}
	}

	md = md.replace(/\]\(\.\.\/images\//gm, '](images/');

	jetpack.write(options.output, md);
};

function preProcessMd () {
	return through2((data, enc, cb) => {
		let nd = data.toString().trim();
		cb( null, new Buffer( nd ) );
	});
  }

var createPDF = function (options){

	var MARKDOWN_OPTIONS = {
		cssPath: 'src/css/print.css',
		// phantomPath: 'node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs',
		paperBorder: '1cm',
		renderDelay: 1500,
		runningsPath: 'src/runnings.js',
		paperFormat: 'Letter',
		paperOrientation: 'portrait',
		preProcessMd: preProcessMd,
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
	.command('create')
	.description('Generate search index')
	.action(createIDX);

program
	.command('search')
	.option('-q, --query <query>','Query (e.g. measurement)')
	.description('Search terms based on the search index')
	.action(searchIDX);

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