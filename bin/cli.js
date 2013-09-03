#!/usr/bin/env node

var argv = require('optimist').argv;
var fs = require('fs');

var filename = argv._[0];
var source = fs.readFileSync(filename).toString();

var whitelist;
if (argv.w) {
  whitelist = JSON.parse(fs.readFileSync(argv.w).toString());
} else {
  whitelist = {};
}

var config = {
  enabled: whitelist,
  namespace: argv.n
};

var defeatureify = require(__dirname + "/../defeatureify.js");
process.stdout.write(defeatureify(source, config));
