const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    // eslint 규칙 제거
    config.module.rules.delete("eslint");
  },
  lintOnSave: false,
  publicPath: '/Project2',
  outputDir: 'dist'

  // 개발 서버 설정 추가
  devServer: {
    host: process.env.VUE_APP_IP_ADDRESS, // IP 주소, 모든 네트워크 인터페이스에서 접근 가능
    port: process.env.VUE_APP_PORT,      // 사용할 포트 번호
    https: false,    // HTTP 프로토콜 사용 (필요 시 true로 설정)
    open: true,      // 서버 시작 시 기본 브라우저 열기
  },
});
