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
import axios from "axios";

export default {
  name: "HomeComponent",
  components: {
    HeaderComponent,
  },
  data() {
    return {
      isReady: false, // 렌더링 준비 상태
      email: "",
      password: "",
      kakaoAccessToken: null,
      user: {},
    };
  },
  created() {
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
        const response = await axios.post(
          "https://kauth.kakao.com/oauth/token",
          new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.VUE_APP_REST_API_KEY,
            redirect_uri: process.env.VUE_APP_REDIRECT_URI,
            code: code,
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const data = response.data;
        console.log("카카오 토큰:", data);

        if (data.access_token) {
          this.kakaoAccessToken = data.access_token;
          localStorage.setItem("kakaoAccessToken", data.access_token);
          await this.fetchKakaoUserInfo(data.access_token);
          this.$router.push("/Project2"); // 로그인 성공 시 리다이렉트
        }
      } catch (error) {
        console.error("카카오 로그인 처리 중 오류:", error);
      }
    },
    async fetchKakaoUserInfo(accessToken) {
      try {
        const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        this.user = response.data;
        console.log("카카오 사용자 정보:", this.user);
        // 사용자 정보를 localStorage에 저장하거나 상태 관리
        localStorage.setItem("kakaoUserInfo", JSON.stringify(this.user));
      } catch (error) {
        console.error("카카오 사용자 정보 가져오기 오류:", error);
      }
    },
    async handleLogin() {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (user) => user.email === this.email && user.apiKey === this.password
      );
      if (user) {
        console.log("로그인 성공");
        localStorage.setItem("isLoggedIn", "true");
        this.$router.push("/Project2");
      } else {
        console.error("로그인 실패: 이메일 또는 비밀번호를 확인해주세요.");
      }
    },
    kakaoLogin() {
      const REST_API_KEY = process.env.VUE_APP_REST_API_KEY;
      const REDIRECT_URI = process.env.VUE_APP_REDIRECT_URI;
      const kakaoAuthUrl = 
        `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
      window.location.href = kakaoAuthUrl;
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