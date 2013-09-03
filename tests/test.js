var fs = require("fs");
var featureify = require("../index");

exports.testFixture = function(test){
  var source = fs.readFileSync(__dirname + "/fixture/example.in.js").toString();
  var expected = fs.readFileSync(__dirname + "/fixture/example.out.js").toString();
  var res = featureify(source, {
    enabled: {"good-to-go": true}
  });
  test.expect(1);
  test.equal(res, expected, "Removed feature not whitelisted");
  test.done();
};
