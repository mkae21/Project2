<template>
    <div>
      <Banner :movie="featuredMovie" />
      <MovieRow v-for="row in movieRows" :key="row.title" :title="row.title" :fetchUrl="row.fetchUrl" />
    </div>
  </template>

<script>
import Banner from '@/components/MyBanner.vue'
import MovieRow from '@/components/MovieRow.vue'

export default {
  components: {
    Banner,
    MovieRow
  },
  data () {
    return {
      featuredMovie: {
        title: '영화 이름', // 임시 데이터
        overview: '영화 설명',
        backdrop_path: '/path/to/image.jpg'
      },
      movieRows: [
        { title: '인기 영화', fetchUrl: 'https://api.example.com/action-movies' },
        { title: '최신 영화', fetchUrl: 'https://api.example.com/latest-movies' },
        { title: '액션 영화', fetchUrl: 'https://api.example.com/action-movies' }
      ]
    }
  }
}
</script>
