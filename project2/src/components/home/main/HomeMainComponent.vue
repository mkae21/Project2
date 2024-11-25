<template>
  <div class="home">
    <!-- Featured Movie Banner -->
    <BannerComponent v-if="featuredMovies.length > 0" :movies="featuredMovies" />

    <!-- Movie Rows -->
    <MovieRowComponent title="인기 영화" :fetchUrl="popularMoviesUrl" />
    <MovieRowComponent title="최신 영화" :fetchUrl="newReleasesUrl" />
    <MovieRowComponent title="액션 영화" :fetchUrl="actionMoviesUrl" />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import URLService from '@/util/movie/URLService.js'
import BannerComponent from "@/views/home-main/BannerComponent.vue";
import MovieRowComponent from "@/views/home-main/MovieRowComponent.vue";

export default {
  name: "HomeMainComponent",
  components: {
    BannerComponent,
    MovieRowComponent
  },
  //상태와 로직 정의
  setup () {
    const apiKey = localStorage.getItem("TMDb-Key") || "";

    // Reactive data
    const featuredMovies = ref([]);
    const popularMoviesUrl = ref(URLService.getURL4PopularMovies(apiKey));
    const newReleasesUrl = ref(URLService.getURL4ReleaseMovies(apiKey));
    const actionMoviesUrl = ref(URLService.getURL4GenreMovies(apiKey, "28"));

    // Load featured movie
    const loadFeaturedMovie = async () => {
      try {
        const movies = await URLService.fetchFeaturedMovie(apiKey);
        console.log("Fetched featured movies:", movies) // 데이터 확인용 로그
        featuredMovies.value = movies.slice(0, 5)
      } catch (error) {
        console.error("Error loading featured movie:", error);
      }
    };

    // Scroll listener for header styling
    const initializeScrollListener = () => {
      const onScroll = () => {
        const header = document.querySelector(".app-header");
        if (window.scrollY > 50) {
          header?.classList.add("scrolled");
        } else {
          header?.classList.remove("scrolled");
        }
      }
      window.addEventListener("scroll", onScroll);

      // Cleanup function
      return () => {
        window.removeEventListener("scroll", onScroll);
      }
    }

    let cleanupScroll;

    onMounted(() => {
      loadFeaturedMovie()
      cleanupScroll = initializeScrollListener()
    })

    onBeforeUnmount(() => {
      cleanupScroll?.()
    })

    return {
      featuredMovies,
      popularMoviesUrl,
      newReleasesUrl,
      actionMoviesUrl
    }
  }
}
</script>

<style scoped>
.home {
  display: block;
  padding: 20px;
  background-color: #333;
}

html,
body {
  overflow-y: scroll;
}
</style>
