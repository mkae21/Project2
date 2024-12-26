<template>
  <div v-if="isReady" id="app">
    <!-- Header Component -->
    <HeaderComponent />

    <!-- Container for the main content -->
    <div id="container">
      <!-- 카카오 인증 코드가 있는 경우 SignInComponent로 props 전달 -->
      <SignInComponent
        :kakaoCode="kakaoCode"
      />
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
      kakaoCode: null, // 카카오 인증 코드
    };
  },
  created() {
    // URL 파라미터에서 "code" 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // code가 있다면 상태 변수에 저장
    if (code) {
      console.log("HomeComponent: 카카오 인증 코드 감지:", code);
      this.kakaoCode = code;
    }

    // 렌더링 준비 완료
    this.isReady = true;
  },
  methods: {
    // (필요하다면, HomeComponent에서도 별도의 handleKakaoLogin을 둘 수 있으나
    //  지금은 SignInComponent 쪽에서 처리하도록 위임함)
    
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