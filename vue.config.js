const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    "open": false,
    "host": "0.0.0.0",
    "port": 9153,
    "proxy": {
      "/api": {
        "target": "http://app.rmsdmedia.com",
        "changeOrigin": true,
        "secure": false,
        "pathRewrite": {
          "^/api": ""
        }
      }
    }
  },
})
