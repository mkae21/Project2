<template>
    <div class="home">
        <BannerComponent :movie="featuredMovie" />

        <MovieRowComponent title="인기 영화" :fetchUrl="popularMoviesUrl" />
        <MovieRowComponent title="최신 영화" :fetchUrl="newReleasesUrl" />
        <MovieRowComponent title="액션 영화" :fetchUrl="actionMoviesUrl" />
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import URLService from '@/util/movie/URL'
import BannerComponent from '@/views/home-main/BannerComponent.vue'
import MovieRowComponent from '@/views/home-main/MovieRowComponent.vue'

export default {
  name: 'HomeMainComponent',
  components: {
    BannerComponent,
    MovieRowComponent
  },
  setup () {
    const urlService = new URLService()
    const apiKey = localStorage.getItem('TMDb-Key') || ''

    const featuredMovie = ref(null)
    const popularMoviesUrl = ref(urlService.getURL4PopularMovies(apiKey))
    const newReleasesUrl = ref(urlService.getURL4ReleaseMovies(apiKey))
    const actionMoviesUrl = ref(urlService.getURL4GenreMovies(apiKey, '28'))

    const loadFeaturedMovie = async () => {
      featuredMovie.value = await urlService.fetchFeaturedMovie(apiKey)
    }

    const initializeScrollListener = () => {
      const onScroll = () => {
        const header = document.querySelector('.app-header')
        if (window.scrollY > 50) {
          header?.classList.add('scrolled')
        } else {
          header?.classList.remove('scrolled')
        }
      }
      window.addEventListener('scroll', onScroll)
      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }

    onMounted(() => {
      loadFeaturedMovie()
      initializeScrollListener()
    })

    onBeforeUnmount(() => {
      initializeScrollListener()() // Remove event listener
    })

    return {
      featuredMovie,
      popularMoviesUrl,
      newReleasesUrl,
      actionMoviesUrl
    }
  }
}
</script>

<style scoped>
.home {
display: block
}

html,
body {
overflow-y: scroll !important
}

body {
background-color: #141414 !important
}
</style>
