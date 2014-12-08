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
    if (node.type === 'MemberExpression') { return getCalleeExpression(node.object) + '.' + node.property.name; }
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

  var isValidIfNode = function(node) {
    return node.type === "IfStatement" &&
    node.test.type === "CallExpression" &&
    node.test.callee;
  };

  var isValidNotIfNode = function(node) {
    return node.type === "IfStatement" &&
    node.test.type === "UnaryExpression" &&
    node.test.argument.type == "CallExpression" &&
    node.test.argument.callee;
  };

  var isEnabled = function(featureName, inverse) {
    if (inverse) {
      return enabled[featureName] === false || enabled[featureName] === undefined;
    } else {
      return enabled[featureName] === true;
    }
  };

  var isDisabled = function(featureName, inverse) {
    if (inverse) {
      return enabled[featureName] === true;
    } else {
      return enabled[featureName] === false || enabled[featureName] === undefined;
    }
  };

  var walkIfTree = function(node, testNode, inverse) {

    // test object.property.property
    if (testNode.callee.object &&
        testNode.callee.object.object &&
        testNode.callee.object.property) {
      // test namespace.FEATURES.isEnabled()
      if (testNode.callee.object.object.name === namespace &&
          testNode.callee.object.property.name === "FEATURES" &&
          testNode.callee.property.name === "isEnabled") {
        var featureName = testNode.arguments[0].value;

        if (isEnabled(featureName, inverse)) {
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
        } else if (isDisabled(featureName, inverse)) {
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
  };

  var walk = function(node) {
    if (isValidIfNode(node)) {
      walkIfTree(node, node.test);
    } else if (isValidNotIfNode(node)) {
      walkIfTree(node, node.test.argument, true);
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
