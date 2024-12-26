<template>
  <div v-if="isReady" id="app">
    <!-- Header Component -->
    <HeaderComponent />

    <!-- Main Content -->
    <div id="container">
      <!-- SignInComponent로 code를 전달 -->
      <SignInComponent :kakaoCode="kakaoCode" />

      <!-- 기존 router-view -->
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/layouts/HeaderComponent.vue";
import SignInComponent from "@/components/sign-in/SignInComponent.vue";

export default {
  name: "HomeComponent",
  components: {
    HeaderComponent,
    SignInComponent,
  },
  data() {
    return {
      isReady: false,
      kakaoCode: null, // 감지된 카카오 인증 코드 저장
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log("HomeComponent: 카카오 인증 코드 감지:", code);
      // 감지된 code를 kakaoCode에 저장하여 자식으로 전달
      this.kakaoCode = code;
    }

    this.isReady = true; // 렌더링 준비 완료
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