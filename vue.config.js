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
    port: 9000,
    proxy: "http://127.0.0.1:8081", //代理服务器
    https: false,
    // 设置跨域
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:9000',
    //     ws: true,
    //     changeOrigin: true,
    //     pathRewrite: {
    //     }
    //   }
    // }
  }
})
