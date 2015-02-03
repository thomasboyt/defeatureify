var o = Ember.Object.extend();
Ember.assert("This should be removed");
Ember.warn("This should be removed");
Ember.debug("This should be removed");
Ember.deprecate("This should be removed");
Ember.Logger.info("This should be removed");
Ember.run(o, o.destroy);
Ember['default'].debug("This should be removed");
