## v0.2.0

* `features.json` format changed to support `options`:

```js
// before
{
  "foo-feature": true
}

// after
{
  "features": {
    "foo-feature": true
  },
  "someOption": true
}
```

* `-w`/`--whitelist` option is now `-c`/`--config`
* Support stripping out debug statements:

```js
//features.json
{
  "features": { ... },
  "enableStripDebug": true,
  "debugStatements": ["Ember.warn", "Ember.assert", "Ember.deprecate", "Ember.debug", "Ember.Logger.info"]
}
```
