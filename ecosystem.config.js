module.exports = {
  apps: [
    {
      name: "meituan",
      script: "./node_modules/nuxt/bin/nuxt-start",
      env: {
        "HOST": "0.0.0.0",
        "PORT": 80,
        "NODE_ENV": "production",
      }
    }
  ]
}