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

  // naively searches for "body" keys in nodes to recurse through
  var findBody = function(node) {
    for (var key in node) {
      if (key === 'body') {
        node[key].forEach(walk);
      } else if (typeof node[key] === 'object' && node !== null) {
        findBody(node[key]);
      }
    }
  };

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
              sourceModifier.replace(node.consequent.range[1] - 1,
                                     node.consequent.range[1] - 1, "");

              // remove else clause if exists
              if (node.alternate && node.alternate.type === "BlockStatement") {
                sourceModifier.replace(node.consequent.range[1], node.alternate.range[1], "");
              }
            } else {
              // remove if, leave else
              if (!node.alternate) {
                sourceModifier.replace(node.range[0], node.range[1], "");
              } else {
                sourceModifier.replace(node.range[0], node.alternate.range[0], "");
                sourceModifier.replace(node.alternate.range[1]-1, node.alternate.range[1]-1, "");
              }
            }
          }
        }
      }
    }

    findBody(node);
  };
  walk(tree);

  return sourceModifier.toString();
};

module.exports = defeatureify;
