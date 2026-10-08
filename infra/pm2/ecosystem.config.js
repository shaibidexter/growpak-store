module.exports = {
  apps: [
    {
      name: 'growpak-api',
      script: './apps/api/dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
    {
      name: 'growpak-web-ssr',
      script: './dist/apps/web/server/server.mjs',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4200,
      },
    },
  ],
};
