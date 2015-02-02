var fs = require("fs");
var defeatureify = require("../defeatureify");

exports.testFixture = function(test){
  var source = fs.readFileSync(__dirname + "/fixture/example.in.js").toString();
  var expected = fs.readFileSync(__dirname + "/fixture/example.out.js").toString();
  var res = defeatureify(source, {
    enabled: {"good-to-go": true, "ambivalent": null}
  });
  test.expect(1);
  test.equal(res, expected, "Non-whitelisted feature was removed, whitelisted feature had conditional removed, and null feature was left flagged");
  test.done();
};

exports.testIIFE = function(test) {
  var source = fs.readFileSync(__dirname + "/fixture/iife.in.js").toString();
  var expected = fs.readFileSync(__dirname + "/fixture/iife.out.js").toString();
  var res = defeatureify(source);
  test.expect(1);
  test.equal(res, expected, "IIFEs are parsed");
  test.done();
};

exports.testElse = function(test) {
  var source = fs.readFileSync(__dirname + "/fixture/else.in.js").toString();

  var expectedDisabled = fs.readFileSync(__dirname + "/fixture/else.out.disabled.js").toString();
  var resDisabled = defeatureify(source);

  var expectedEnabled = fs.readFileSync(__dirname + "/fixture/else.out.enabled.js").toString();
  var resEnabled = defeatureify(source, {
    enabled: {"else-testing": true}
  });

  var resNull = defeatureify(source, {
    enabled: {"else-testing": null}
  });

  test.expect(3);
  test.equal(resDisabled, expectedDisabled, "Else statements are kept in when the feature is disabled");
  test.equal(resEnabled, expectedEnabled, "Else statements are removed when the feature is enabled");
  test.equal(resNull, source, "The raw input is output when a flag value is null");
  test.done();
};

exports.testNestedIf = function(test) {
  // TODO
  test.done();
};

exports.testFunctionDefinition = function(test) {
  // TODO
  test.done();
};

exports.testStripDebugStatements = function(test) {
  var source = fs.readFileSync(__dirname + "/fixture/strip_debug.in.js").toString();
  var expected = fs.readFileSync(__dirname + "/fixture/strip_debug.out.js").toString();
  var res = defeatureify(source, {
    "enableStripDebug": true,
    "debugStatements": ["Ember.warn", "Ember.assert", "Ember.deprecate", "Ember.debug", "Ember.Logger.info"]
  });
  test.expect(1);
  test.equal(res, expected, "Ember debug messages are stripped");
  test.done();
};

exports.testNamespaceDefault = function(test){
  var source = fs.readFileSync(__dirname + "/fixture/namespace.default.in.js").toString();
  var expected = fs.readFileSync(__dirname + "/fixture/namespace.default.out.js").toString();
  var res = defeatureify(source, {
    enabled: {"good-to-go": true, "ambivalent": null}
  });
  test.expect(1);
  test.equal(res, expected, "Non-whitelisted feature was removed, whitelisted feature had conditional removed, and null feature was left flagged");
  test.done();
};
