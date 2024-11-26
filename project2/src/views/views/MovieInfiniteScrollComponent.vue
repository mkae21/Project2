<template>
<div class="movie-grid" ref="gridContainer">
    <div :class="['grid-container', currentView]">
    <div
        v-for="(movieGroup, groupIndex) in visibleMovieGroups"
        :key="`group-${groupIndex}`"
        class="movie-row"
    >
        <div
        v-for="movie in movieGroup"
        :key="movie.id"
        class="movie-card"
        @mouseup="toggleWishlist(movie)"
        >
        <img
            :src="getImageUrl(movie.poster_path)"
            :alt="movie.title"
            loading="lazy"
        />
        <div class="movie-title">{{ movie.title }}</div>
        <div class="movie-overview">
            <p>{{ movie.overview }}</p>
          </div>
        <div v-if="isInWishlist(movie.id)" class="wishlist-indicator">👍</div>
        </div>
    </div>
    </div>

    <div ref="loadingTrigger" class="loading-trigger">
    <div v-if="isLoading" class="loading-indicator">
        <div class="spinner"></div>
        <span>Loading...</span>
    </div>
    </div>

    <button
    v-if="showTopButton"
    @click="scrollToTopAndReset"
    class="top-button"
    aria-label="Scroll to Top"
    >
    Top
    </button>
</div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import WishlistService from '@/util/movie/WishlistService.js';

export default {
  name: 'MovieInfiniteScrollComponent',
  props: {
    genreCode: {
      type: String,
      required: true,
    },
    apiKey: {
      type: String,
      required: true,
    },
    sortingOrder: {
      type: String,
      default: 'all',
    },
    voteEverage: {
      type: Number,
      default: 100,
    },
  },

  setup (props) {
    const movies = ref([]);
    const currentPage = ref(1);
    const rowSize = ref(4);
    const isLoading = ref(false);
    const hasMore = ref(true);
    const isMobile = ref(window.innerWidth <= 768);
    const currentView = ref('grid');
    const showTopButton = ref(false);

    const gridContainer = ref(null);
    const loadingTrigger = ref(null);

    let wishlistTimer = null;
    let observer = null;

    const fetchMovies = async () => {
      if (isLoading.value || !hasMore.value) return;

      isLoading.value = true;
      try {
        const url =
          props.genreCode === '0'
            ? 'https://api.themoviedb.org/3/movie/popular'
            : 'https://api.themoviedb.org/3/discover/movie';

        const params = {
          api_key: props.apiKey,
          language: 'ko-KR',
          page: currentPage.value,
          per_page: 10,
          ...(props.genreCode !== '0' && { with_genres: props.genreCode }),
        }

        const { data } = await axios.get(url, { params });
        const newMovies = data.results;

        if (newMovies.length > 0) {
          const filteredMovies = newMovies
            .filter((movie) =>
              props.sortingOrder === 'all'
                ? true
                : movie.original_language === props.sortingOrder
            )
            .filter((movie) =>
              props.voteEverage === -1
                ? true
                : props.voteEverage === -2
                ? movie.vote_average <= 4
                : movie.vote_average >= props.voteEverage &&
                  movie.vote_average < props.voteEverage + 1
            )

          movies.value = [...movies.value, ...filteredMovies];
          currentPage.value++;
        } else {
          hasMore.value = false;
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        isLoading.value = false;
      }
    };

    watch(
      () => [props.genreCode, props.sortingOrder, props.voteEverage],
      ([newGenreCode, newSortingOrder, newVoteEverage]) => {
        console.log('Props changed:', {
          newGenreCode,
          newSortingOrder,
          newVoteEverage,
        });

        // Reset movies and fetch new data
        movies.value = [];
        currentPage.value = 1;
        hasMore.value = true;
        fetchMovies();
      }
    );

    const setupIntersectionObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoading.value && hasMore.value) {
            fetchMovies();
          }
        },
        { rootMargin: '100px', threshold: 0.1 }
      );

      if (loadingTrigger.value) {
        observer.observe(loadingTrigger.value);
      }
    };

    const getImageUrl = (path) =>
      path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg';

    const visibleMovieGroups = computed(() =>
      movies.value.reduce((resultArray, item, index) => {
        const groupIndex = Math.floor(index / rowSize.value);
        if (!resultArray[groupIndex]) {
          resultArray[groupIndex] = [];
        }
        resultArray[groupIndex].push(item);
        return resultArray;
      }, [])
    );

    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768;
      calculateLayout();
    };

    const calculateLayout = () => {
      if (gridContainer.value) {
        const containerWidth = gridContainer.value.offsetWidth;
        const movieCardWidth = isMobile.value ? 100 : 300;
        const horizontalGap = isMobile.value ? 10 : 15;
        rowSize.value = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      }
    };

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      showTopButton.value = scrollTop > 300;
    };

    const scrollToTopAndReset = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      resetMovies();
    };

    const resetMovies = () => {
      movies.value = [];
      currentPage.value = 1;
      hasMore.value = true;
      fetchMovies();
    };

    const toggleWishlist = (movie) => {
      if (wishlistTimer) {
        clearTimeout(wishlistTimer);
      }
      wishlistTimer = setTimeout(() => {
        WishlistService.toggleWishlist(movie);
      }, 800);
    };

    const isInWishlist = (movieId) =>
      WishlistService.isInWishlist(movieId);

    onMounted(() => {
      setupIntersectionObserver();
      fetchMovies();
      handleResize();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
      if (wishlistTimer) clearTimeout(wishlistTimer);
    });

    return {
      gridContainer,
      loadingTrigger,
      movies,
      currentPage,
      rowSize,
      isLoading,
      hasMore,
      isMobile,
      currentView,
      showTopButton,
      getImageUrl,
      visibleMovieGroups,
      scrollToTopAndReset,
      toggleWishlist,
      isInWishlist,
    };
  },
};
</script>


<style scoped>
.movie-grid {
  width: 100%;
  margin-bottom: 40px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
}

.grid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.movie-row {
  display: flex;
  justify-content: center;
  margin: 0 auto 20px;
  width: 100%;
}

.grid-container.list .movie-row {
  flex-direction: column;
}
.movie-overview {
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  font-size: 14px;
  line-height: 1.4;
  max-height: calc(1.4em * 3); /* 최대 3줄 */
  overflow: hidden; /* 초과 텍스트 숨김 */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 최대 3줄 제한 */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis; /* 초과 텍스트에 ... 추가 */
  white-space: normal; /* 줄바꿈 허용 */
  opacity: 0; /* 기본적으로 숨김 */
  transform: translateY(100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.movie-card:hover .movie-overview {
  opacity: 1;
  transform: translateY(0);
}
.movie-card {
  width: 300px;
  margin: 0 10px;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  cursor: pointer;
  user-select: none;
  border-radius: 8px;
  overflow: hidden;
}

.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.movie-card img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  display: block;
}

.movie-title {
  margin-top: 8px;
  padding: 0 5px;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
}

.wishlist-indicator {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 30px;
  background-color: rgba(229, 9, 20, 0.5);
  padding: 5px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  animation: popIn 0.3s ease-out;
}

.loading-trigger {
  height: 20px;
  margin-top: 20px;
  text-align: center;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;
  font-size: 16px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.top-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #e50914;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s, transform 0.3s;
  z-index: 1000;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.top-button:hover {
  background-color: #9b0f16;
  transform: scale(1.1);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .movie-card {
    width: 120px;
    margin: 0 5px;
  }

  .movie-title {
    font-size: 12px;
  }

  .wishlist-indicator {
    font-size: 20px;
    top: -5px;
    right: -5px;
  }

  .top-button {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .loading-indicator {
    font-size: 14px;
  }
}
</style>
