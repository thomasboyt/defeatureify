var foo;



  console.log("Beta channel, whoo!");
  var bar;
  // comments?
  console.log("testing multi-lines");


if (Ember.FEATURES.isEnabled("ambivalent")) {
  console.log("Meh, who cares");
  var biff;
  // comments?
  console.log("testing multi-lines");
}

