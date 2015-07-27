Package.describe({
  name: 'spectrum:kakao',
  version: '0.0.1',
  summary: 'Kakao OAuth flow',
  git: 'https://github.com/acidsound/meteor-kakao',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Kakao');

  api.addFiles(
      ['kakao_configure.html', 'kakao_configure.js'],
      'client');

  api.addFiles('kakao_server.js', 'server');
  api.addFiles('kakao_client.js', 'client');
});