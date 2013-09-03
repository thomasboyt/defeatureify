var foo;

if (Ember.FEATURES.isEnabled("experiment")) {
  console.log("I'm some terrifying experimental stuff! Aaah!");
}

if (Ember.FEATURES.isEnabled("good-to-go")) {
  console.log("Beta channel, whoo!");
}

