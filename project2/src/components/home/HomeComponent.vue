<template>
  <div v-if="isReady" id="app">
    <!-- Header Component -->
    <HeaderComponent />

    <!-- Container for the main content -->
    <div id="container">
      <router-view /> <!-- 자식 컴포넌트를 렌더링 -->
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/layouts/HeaderComponent.vue";
import { useRouter } from "vue-router";

export default {
  name: "HomeComponent",
  components: {
    HeaderComponent,
  },
  data() {
    return {
      isReady: false, // 렌더링 준비 상태
    };
  },
  created() {
    // URL에서 "code" 파라미터를 확인
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log("카카오 인증 코드 감지:", code);
      this.handleKakaoLogin(code);
    }

    // 렌더링 준비 완료
    this.isReady = true;
  },
  methods: {
    async handleKakaoLogin(code) {
      try {
        const response = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.VUE_APP_REST_API_KEY,
            redirect_uri: process.env.VUE_APP_REDIRECT_URI,
            code: code,
          }),
        });

        const data = await response.json();
        console.log("카카오 토큰:", data);

        if (data.access_token) {
          localStorage.setItem("kakaoAccessToken", data.access_token);
          this.$router.push("/Project2"); // 로그인 성공 시 리다이렉트
        }
      } catch (error) {
        console.error("카카오 로그인 처리 중 오류:", error);
      }
    },
  },
};
</script>

<style scoped>
#app {
  width: 95svw;
  height: 95svh;
  overflow-x: hidden;
  margin: auto;
}

#container {
  margin-top: 10px;
}
</style>