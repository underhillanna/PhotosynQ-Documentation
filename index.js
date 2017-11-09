#!/usr/bin/env node
'use strict';
const program = require('commander');
const elasticlunr = require('elasticlunr');
const jetpack = require('fs-jetpack');
const mime = require('mime');
var markdownpdf = require('markdown-pdf')

var createIDX = function(options){

	var elasticIDX = elasticlunr(function(){
		this.addField('title');
		this.addField('content');
		// the id
		this.setRef('href');
		this.saveDocument(false);
	});

	// Copy the protocol commands from the firmware documentation
	try{
		var file = '_protocols_Commands.md'
		var path = '../PhotosynQ-Firmware/commands/docs/'
		jetpack.copy(path+file, './help/'+file, { overwrite: true });
		console.log('Firmware Documentation copied.');
	}catch(e){
		console.log('Firmware Documentation Repo not found.');
	}

	// Copy the protocol commands from the firmware documentation
	try{
		var file = '_instruments_Console_Commands.md'
		var path = '../PhotosynQ-Firmware/commands/docs/'
		jetpack.copy(path+file, './help/'+file, { overwrite: true });
		console.log('Firmware Instrument Commands copied.');
	}catch(e){
		console.log('Firmware Documentation Repo not found.');
	}

	// Now loop through the files in help
	var files = jetpack.inspectTree('./help/').children;
	var hfc = 0;
	
	for(var i in files){
		if( files[i].type != 'file' || mime.lookup(files[i].name) != 'text/markdown')
			continue;
		
		var entry = jetpack.read('./help/'+files[i].name);
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
	console.log('Search index for '+hfc+' files generated ('+ (jetpack.inspectTree(__dirname+'/dist/elasticlunr-help-idx.json').size / 1024).toFixed(2) +' kb).')
}

var searchIDX = function(options){

	var idxfile = jetpack.read(__dirname+'/dist/elasticlunr-help-idx.json','json');	
	var idx = elasticlunr.Index.load(idxfile)
		
	if(options.term !== undefined || options.term != ''){
		var results = idx.search( options.term,
		{
// 			fields: {
// 				title: {boost: 3},
// 				category: {boost: 2},
// 				content: {boost: 1}
// 			},
// 			bool: "OR",
// 			expand: true
		});
		console.log('\nSearch for "'+options.term + '" (Hits: '+results.length+')\n');

		for(var i in results){
			console.log((parseInt(i)+1)+'. '+results[i].ref+' (score: '+ results[i].score.toFixed(6) +')' );
		}
	}
	else{
		console.log('Enter a search term.');
	}
}

var createPDF = function (options){
	var MARKDOWN_OPTIONS = {
		cssPath: 'src/css/print.css',
		phantomPath: 'node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs',
		paperBorder: '1cm',
		renderDelay: 5000, // 1500
		runningsPath: 'src/runnings.js',
		paperFormat: 'Letter',
		paperOrientation: 'portrait',
		remarkable: {"html":true}
	};
	markdownpdf(MARKDOWN_OPTIONS).from(options.input).to(options.output, function (data) {
		console.log('📄 PDF created:',options.output);
	});
}

program
  .version('0.0.2')

program
	.command('create')
	.description('Generate search index')
	.action(createIDX)

program
	.command('search')
	.option('-t, --term <term>','search term')
	.description('Search terms based on the search index')
	.action(searchIDX);

program
	.command('pdf')
	.option('-i, --input <input>','Markdown File')
	.option('-o, --output <output>','PDF File')
	.description('Generate PDF from Markdown')
	.action(createPDF)

program.parse(process.argv);