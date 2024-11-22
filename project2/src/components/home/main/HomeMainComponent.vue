<template>
  <div class="home">
    <!-- Featured Movie Banner -->
    <BannerComponent :movie="featuredMovie" />

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
    const apiKey = localStorage.getItem("TMDb-Key") || "b1907f9b9967490f278a974270b85f60";

    // Reactive data
    const featuredMovie = ref(null);
    const popularMoviesUrl = ref(URLService.getURL4PopularMovies(apiKey));
    const newReleasesUrl = ref(URLService.getURL4ReleaseMovies(apiKey));
    const actionMoviesUrl = ref(URLService.getURL4GenreMovies(apiKey, "28"));

    // Load featured movie
    const loadFeaturedMovie = async () => {
      try {
        featuredMovie.value = await URLService.fetchFeaturedMovie(apiKey);
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
      };
      window.addEventListener("scroll", onScroll);

      // Cleanup function
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    };

    let cleanupScroll;

    onMounted(() => {
      loadFeaturedMovie();
      cleanupScroll = initializeScrollListener();
    });

    onBeforeUnmount(() => {
      cleanupScroll?.();
    });

    return {
      featuredMovie,
      popularMoviesUrl,
      newReleasesUrl,
      actionMoviesUrl,
    };
  },
};
</script>

<style scoped>
.home {
  display: block;
  padding: 20px;
  background-color: #141414;
}

html,
body {
  overflow-y: scroll;
}
</style>
