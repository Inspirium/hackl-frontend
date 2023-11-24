module.exports = {
  apps: [
    {
      name: 'Tennis',
      exec_mode: 'cluster',
      instances: 2,
      script: './.output/server/index.mjs',
      env: {
        PORT: 3002,
        NUXT_PORT: 3002,
      },
    },
  ],
}
