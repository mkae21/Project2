<template>
    <div>
      <!-- Movie Wishlist 관련 템플릿 -->
      <h2>My Movie Wishlist</h2>
      <ul>
        <li v-for="movie in movies" :key="movie.id">
          {{ movie.title }}
        </li>
      </ul>
    </div>
  </template>

<script>
export default {
  name: 'MovieWishlist',
  data () {
    return {
      movies: [
        { id: 1, title: 'Inception' },
        { id: 2, title: 'Interstellar' },
        { id: 3, title: 'The Dark Knight' }
      ]
    }
  }
}
</script>

  <style scoped>
  /* Angular의 movie-wishlist.component.css 내용을 여기에 복사 */
  </style>
