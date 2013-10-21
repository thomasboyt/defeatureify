Ember.expandProperties = function (pattern, callback) {
  if (Ember.FEATURES.isEnabled('propertyBraceExpansion')) {
    if (IS_BRACE_EXPANSION.test(pattern)) {
      forEach(pattern.substring(1, pattern.length-1).split(','), callback);
      return;
    }
  }
};
