#!/usr/bin/env node

var argv = require('optimist')
            .boolean('v')
            .alias('v','version')
            .alias('w', 'whitelist')
            .argv;

var fs = require('fs');

if (argv.version) {
  var version = require('../package').version;
  process.stdout.write(version + '\n');
} else {
  var filename = argv._[0];
  if (!filename){
    process.stdout.write('You must supply the input file path.\n');
    process.exit(1);
  }

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
}
