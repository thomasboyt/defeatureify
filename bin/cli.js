#!/usr/bin/env node

var argv = require('optimist')
            .boolean('v')
            .alias('v','version')
            .alias('c', 'config')
            .boolean('s')
            .alias('s', 'stripdebug')
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
  var configJson;
  if (argv.c) {
    configJson = JSON.parse(fs.readFileSync(argv.c).toString());
  } else {
    configJson = {};
  }

  if (!configJson.features) configJson.features = {};

  var config = {
    enabled: configJson.features,
    debugStatements: configJson.debugStatements,
    namespace: argv.n || configJson.namespace,
    enableStripDebug: argv.stripdebug || configJson.enableStripDebug
  };

  var defeatureify = require(__dirname + "/../defeatureify.js");
  process.stdout.write(defeatureify(source, config));
}
