<template>
  <div id="app">
    <HeaderComponent />
    <div id="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/layouts/HeaderComponent.vue" // Header 컴포넌트를 임포트

export default {
  name: "HomeComponent",
  components: {
    HeaderComponent
  }
};
</script>

<style scoped>
#app {
  width: 95vw; /* svw는 일부 브라우저에서 지원되지 않을 수 있으므로 vw로 대체 */
  height: 95vh;
  overflow-x: hidden;
  margin: auto;
}
</style>
