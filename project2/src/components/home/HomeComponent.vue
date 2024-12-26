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
    // 설정 완료 후 상태 플래그 변경,렌더링 순서 제어
    this.isReady = true;
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
