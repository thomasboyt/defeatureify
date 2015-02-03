var SourceModifier = require("./lib/source_modifier");
var esprima = require('esprima');

var defeatureify = function(source, config) {
  config = config || {};
  enabled = config.enabled || {};

  var namespace = config.namespace || "Ember";
  var debugStatements = config.debugStatements;

  var tree = esprima.parse(source, {
    range: true,
    loc: true
  });

  var sourceModifier = new SourceModifier(source);

  var getCalleeExpression = function(node) {
    if (node.type === 'MemberExpression') {
      return getCalleeExpression(node.object) + '.' + (node.property.name || node.property.value);
    }
    else if (node.type === 'Identifier') { return node.name; }
    else { return null; }
  };

  // naively searches for "body" keys in nodes to recurse through
  var findBody = function(node) {
    for (var key in node) {
      if (key === 'body' && Array.isArray(node[key])) {
        node[key].forEach(walk);
      } else if (typeof node[key] === 'object' && node !== null) {
        findBody(node[key]);
      }
    }
  };

  var shouldProcessNode = function(node) {
    // test object.property.property
    if (node.test.callee.object &&
        node.test.callee.object.object &&
          node.test.callee.object.property) {
      // test namespace.FEATURES.isEnabled()
      if (node.test.callee.object.object.name === namespace &&
          node.test.callee.object.property.name === "FEATURES" &&
            node.test.callee.property.name === "isEnabled") {

        return true;
      }
    }

    // test object.object.{object,property} and object.property
    if (node.test.callee.object &&
          node.test.callee.object.object &&
          node.test.callee.object.object.property &&
          node.test.callee.object.object.object &&
          node.test.callee.object.property) {
      // test namespace['default'].FEATURES.isEnabled()
      if (node.test.callee.object.object.object.name === namespace &&
          node.test.callee.object.object.property.value === 'default' &&
          node.test.callee.object.property.name === "FEATURES" &&
            node.test.callee.property.name === "isEnabled") {

        return true;
      }
    }
  };

  var walk = function(node) {
    if (node.type === "IfStatement") {
      if (node.test.type === "CallExpression" && node.test.callee) {
        if (shouldProcessNode(node)) {
          var featureName = node.test.arguments[0].value;

          if (enabled[featureName] === true) {
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
          } else if (enabled[featureName] === false || enabled[featureName] === undefined) {
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

    if (config.enableStripDebug && node.type === "ExpressionStatement" && node.expression) {
      if (node.expression.type === "CallExpression") {
        var calleeExpression = getCalleeExpression(node.expression.callee);
        if (debugStatements.indexOf(calleeExpression) != -1) {
          sourceModifier.replace(node.range[0], node.range[1], "");
        }
      }
    }

    findBody(node);
  };
  walk(tree);

  return sourceModifier.toString();
};

module.exports = defeatureify;
