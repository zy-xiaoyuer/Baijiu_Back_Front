const {
  defineConfig
} = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  //关闭eslint校验
  lintOnSave: false,
  
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    proxy: {
      '/api': {
        target: 'http://192.168.90.120:9000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^api':''

        }
      }
    }
  }
})
