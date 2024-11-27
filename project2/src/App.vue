<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      title: 'Movie' // Angular의 title 속성
    };
  },
  mounted () {
    console.log(`App loaded with title: ${this.title}`);
  }
};
</script>

<style>
  body{
  -ms-overflow-style: none;
  }
  
  ::-webkit-scrollbar {
    display: none;
  }
</style>


