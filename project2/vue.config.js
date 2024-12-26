const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    // eslint 규칙 제거
    config.module.rules.delete("eslint");
  },
  lintOnSave: false,
  publicPath: '/Project2',
  outputDir: 'dist',

  // 개발 서버 설정 추가
  devServer: {
    host: process.env.VUE_APP_IP_ADDRESS,
    port: process.env.VUE_APP_PORT,
    https: false,
  },
});
