(function() {
  console.log("I'm an IIFE!");

  if (Ember.FEATURES.isEnabled("experiment")) {
    console.log("I shouldn't be here!");
  }
})();
