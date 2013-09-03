var foo;

if (Ember.FEATURES.isEnabled("experiment")) {
  console.log("I'm some terrifying experimental stuff! Aaah!");
  var baz;
  console.log("testing multi-lines");
  // comments?
}

if (Ember.FEATURES.isEnabled("good-to-go")) {
  console.log("Beta channel, whoo!");
  var bar;
  // comments?
  console.log("testing multi-lines");
}

