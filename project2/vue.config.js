const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    // eslint 규칙 제거
    config.module.rules.delete("eslint");
  },
  lintOnSave: false,
  publicPath: '/<repository_name>',
  outputDir: 'docs'
});
