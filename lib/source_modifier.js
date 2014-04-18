// via https://github.com/ModuleLoader/es6-module-loader

/*
 * SourceModifier
 *
 * Allows for partial modification of a source file based on successive
 * range adjustment operations consistent with the original source file
 *
 * Example:
 *                               012345678910
 *   var h = new SourceModifier('hello world');
 *   h.replace(2, 4, 'y');
 *   h.replace(6, 10, 'person');
 *   h.source == 'hey person';
 *   h.rangeOps == [{start: 2, end: 4, diff: -2}, {start: 4, end: 9, diff: 1}]
 *
 */
var SourceModifier = function(source) {
  this.source = source;
  this.rangeOps = [];
};

SourceModifier.prototype = {
  mapIndex: function(index) {
    // apply the range operations in order to the index
    for (var i = 0; i < this.rangeOps.length; i++) {
      var curOp = this.rangeOps[i];
      if (curOp.start >= index)
        continue;
      if (curOp.end <= index) {
        index += curOp.diff;
        continue;
      }
      throw new Error('Source location ' + index + ' has already been transformed!');
    }
    return index;
  },
  replace: function(start, end, replacement) {
    var diff = replacement.length - (end - start + 1);

    start = this.mapIndex(start);
    end = this.mapIndex(end);

    this.source = this.source.substr(0, start) + replacement + this.source.substr(end + 1);

    this.rangeOps.push({
      start: start,
      end: end,
      diff: diff
    });
  },
  getRange: function(start, end) {
    return this.source.substr(this.mapIndex(start), this.mapIndex(end));
  },
  toString: function() {
    return this.source;
  }
};

module.exports = SourceModifier;
