var foo;

if (Ember.FEATURES.isEnabled("experiment")) {
  console.log("I'm some terrifying experimental stuff! Aaah!");
  var baz;
  // comments?
  console.log("testing multi-lines");
}

if (Ember.FEATURES.isEnabled("good-to-go")) {
  console.log("Beta channel, whoo!");
  var bar;
  // comments?
  console.log("testing multi-lines");
}

if (Ember.FEATURES.isEnabled("ambivalent")) {
  console.log("Meh, who cares");
  var biff;
  // comments?
  console.log("testing multi-lines");
}

