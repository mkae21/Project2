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
import SignInComponent from "@/components/sign-in/SignInComponent.vue";
import axios from "axios";

export default {
  name: "HomeComponent",
  components: {
    HeaderComponent,
    SignInComponent,
  },
  data() {
    return {
      isReady: false, // 렌더링 준비 상태
      email: "",
      password: "",
      kakaoAccessToken: null,
      user: {},
      kakaoCode: null, // 카카오 인증 코드를 저장할 변수
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log("HomeComponent: 카카오 인증 코드 감지:", code);
      // 자식에게 내려줄 kakaoCode에 저장
      this.kakaoCode = code;
    }

    // 렌더링 준비 완료
    this.isReady = true;
  },
  methods: {
    async handleLogin() {
      // (일반 email/password 로그인 예시)
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
      // 카카오 로그인 URL로 이동
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