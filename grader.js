#!/usr/bin/env node
// john refling

var util = require('util');
var rest = require('restler');
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
	var instr = infile.toString();
	if (!fs.existsSync(instr)) {
		console.log("%s does not exist. Exiting.", instr);
		process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
	}
	return instr;
};

var cheerioHtmlFile = function(htmlfile) {
	return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for (var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	}
	return out;
};

// Workaround for commander.js issue.
// http://stackoverflow.com/a/6772648
var clone = function(fn) {
	return fn.bind({});
};

var buildfn = function(file) {
	var response2console = function(result, response) {
		if (result instanceof Error) {
			console.error('Error: ' + util.format(response.message));
		} else {
			fs.writeFileSync(file, result);
			var checkJson = checkHtmlFile(file, program.checks);
			var outJson = JSON.stringify(checkJson, null, 4);
			fs.unlink(file);
			console.log(outJson);
//			console.log(result);
//			console.log(text);
//			console.log(response);
		}
	};
	return response2console;
};

if(require.main == module) {
	program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <http://url>', 'Full URL to check instead of -f')
	.parse(process.argv);

	if ( undefined == program.url ) {
		//console.error(program.file);
		var checkJson = checkHtmlFile(program.file, program.checks);
		var outJson = JSON.stringify(checkJson, null, 4);
		console.log(outJson);
	} else {
		console.error(program.url);
		var response2console = buildfn("tmp.http");
		rest.get(program.url).on('complete', response2console);
	}
} else {
	exports.checkHtmlFile = checkHtmlFile;
}
