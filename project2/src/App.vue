<template>
  <div id="app">
    <!-- Header 컴포넌트를 추가하여 최상단에 위치시킵니다 -->
    <Header />
    <!-- 라우트된 페이지를 렌더링하는 부분 -->
    <router-view />
  </div>
</template>

<script>
import Header from './layouts/MyHeader.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #fafafa;
  padding-top: 30px; /* Header 높이에 맞춰 조정 */
  /* 헤더와 padding left 맞추기 */
  padding-left: 40px;
  /* 볼드체 */
  font-weight: bold;

}

nav {
  padding: 10px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
