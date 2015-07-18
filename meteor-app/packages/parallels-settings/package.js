Package.describe({
  name: 'parallels-settings',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use([
    'reactive-dict',
    'parallels-lib'
  ], ['client', 'server']);

  api.addFiles('namespace.js', ['client', 'server']);
  api.addFiles('server.js', 'server');
  api.addFiles('client.js', 'client');
});

Package.onTest(function(api) {
  api.use(['coffeescript', 'peerlibrary:classy-test', 'parallels-lib']);
  api.use('parallels-settings');

  api.addFiles('test/integration/env_tests.coffee');
});