var SourceModifier = require("./lib/source_modifier");
var esprima = require('esprima');

var defeatureify = function(source, config) {
  config = config || {};
  enabled = config.enabled || {};

  var namespace = config.namespace || "Ember";

  var tree = esprima.parse(source, {
    range: true,
    loc: true
  });

  var sourceModifier = new SourceModifier(source);
  var walk = function(node) {
    if (node.type === "IfStatement") {
      if (node.test.type === "CallExpression" && node.test.callee) {
        // test object.property.property
        if (node.test.callee.object &&
            node.test.callee.object.object &&
            node.test.callee.object.property) {
          // test namespace.FEATURES.isEnabled()
          if (node.test.callee.object.object.name === namespace &&
              node.test.callee.object.property.name === "FEATURES" &&
              node.test.callee.property.name === "isEnabled") {
            var featureName = node.test.arguments[0].value;
            if (enabled[featureName]) {
              // remove if (x) {
              sourceModifier.replace(node.range[0],
                                     node.consequent.range[0], "");

              // TODO: reindent

              // remove closing brace }
              var body = node.consequent.body;
              var lastStatement = body[body.length - 1];
              sourceModifier.replace(lastStatement.range[1],
                                     node.range[1], "");
            } else {
              sourceModifier.replace(node.range[0], node.range[1], "");
            }
          }
        }
      }
    }

    if (node.body && node.body.length > 0) {
      node.body.forEach(walk);
    } else if (node.type === "ExpressionStatement" &&
               node.expression.callee && 
               node.expression.callee.type === "FunctionExpression") {
      node.expression.callee.body.body.forEach(walk);
    }
  };
  walk(tree);

  return sourceModifier.toString();
};

module.exports = defeatureify;
