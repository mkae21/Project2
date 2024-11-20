<template>
  <div id="app">
    <!-- Angular의 <router-outlet>에 대응하는 Vue의 <router-view> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      title: 'Angular-demo' // Angular의 title 속성
    };
  },
  mounted () {
    console.log(`App loaded with title: ${this.title}`);
  }
};
</script>

<style scoped>
/* app.component.css에 해당하는 스타일을 여기에 추가 */
</style>
