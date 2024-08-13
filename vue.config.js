const {
  defineConfig
} = require('@vue/cli-service');
// const AutoImport = require('unplugin-auto-import/webpack');
// const Components = require('unplugin-vue-components/webpack');
// const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
module.exports = defineConfig({
  transpileDependencies: true,
  //关闭eslint校验
  lintOnSave: false,
  // ElementPlus按需导入方式
  // configureWebpack: {
  //   plugins: [
  //     AutoImport({
  //       resolvers: [ElementPlusResolver()],
  //     }),
  //     Components({
  //       resolvers: [ElementPlusResolver()],
  //     }),
  //   ],
  // }
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    // 设置跨域
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^api': ''
        }
      }
    }
  }
})
