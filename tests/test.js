var fs = require("fs");
var defeatureify = require("../defeatureify");

exports.testFixture = function(test){
  var source = fs.readFileSync(__dirname + "/fixture/example.in.js").toString();
  var expected = fs.readFileSync(__dirname + "/fixture/example.out.js").toString();
  var res = defeatureify(source, {
    enabled: {"good-to-go": true}
  });
  test.expect(1);
  test.equal(res, expected, "Non-whitelisted feature was removed, whitelisted feature had conditional removed");
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

  test.expect(2);
  test.equal(resDisabled, expectedDisabled, "Else statements are kept in when the feature is disabled");
  test.equal(resEnabled, expectedEnabled, "Else statements are removed when the feature is enabled");
  test.done();
};

exports.testNestedIf = function(test) {
  // TODO
  test.done();
};
