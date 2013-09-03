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
