<template>
  <div class="movie-grid" ref="gridContainer">
    <div :class="['grid-container', currentView]">
      <div
        v-for="(movieGroup, groupIndex) in visibleMovieGroups"
        :key="`group-${groupIndex}`"
        :class="['movie-row', { full: movieGroup.length === rowSize }]"
      >
        <div
          v-for="movie in movieGroup"
          :key="movie.id"
          class="movie-card"
          @mouseup="toggleWishlist(movie)"
        >
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
          <div class="movie-title">{{ movie.title }}</div>
          <div class="movie-overview">
            <p>{{ movie.overview }}</p>
          </div>
          <div v-if="isInWishlist(movie.id)" class="wishlist-indicator">👍</div>
        </div>
      </div>
    </div>
    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1">&lt; 이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음 &gt;</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import WishlistService from '@/util/movie/WishlistService';

export default {
  name: 'MovieGridComponent',
  props: {
    fetchUrl: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const movies = ref([]);
    const currentPage = ref(1);
    const rowSize = ref(4);
    const moviesPerPage = ref(20);
    const isMobile = ref(window.innerWidth <= 768);
    const currentView = ref('grid');
    const gridContainer = ref(null);
    let wishlistTimer = null;

    // Fetch movies
    const fetchMovies = async () => {
      try {
        const totalMoviesNeeded = 120
        const numberOfPages = Math.ceil(totalMoviesNeeded / 20)
        let allMovies = []

        for (let page = 1; page <= numberOfPages; page++) {
          const response = await axios.get(props.fetchUrl, {
            params: {
              page,
              per_page: moviesPerPage.value
            }
          })
          allMovies = [...allMovies, ...response.data.results]
        }
        movies.value = allMovies.slice(0, totalMoviesNeeded)
      } catch (error) {
        console.error('Error fetching movies:', error)
      }
    };

    // Compute visible movie groups
    const visibleMovieGroups = computed(() => {
      const startIndex = (currentPage.value - 1) * moviesPerPage.value;
      const endIndex = startIndex + moviesPerPage.value;
      const paginatedMovies = movies.value.slice(startIndex, endIndex);

      return paginatedMovies.reduce((resultArray, item, index) => {
        const groupIndex = Math.floor(index / rowSize.value);
        if (!resultArray[groupIndex]) {
          resultArray[groupIndex] = [];
        }
        resultArray[groupIndex].push(item);
        return resultArray;
      }, []);
    });

    // Pagination methods
    const totalPages = computed(() =>
      Math.ceil(movies.value.length / moviesPerPage.value)
    );

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    // Wishlist methods
    const toggleWishlist = (movie) => {
      if (wishlistTimer) {
        clearTimeout(wishlistTimer);
      }
      wishlistTimer = setTimeout(() => {
        WishlistService.toggleWishlist(movie);
      }, 2000);
    };

    const isInWishlist = (movieId) => WishlistService.isInWishlist(movieId);

    // Resize and layout calculation
    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768;
      calculateLayout();
    };

    const calculateLayout = () => {
      if (gridContainer.value) {
        const container = gridContainer.value;
        const containerWidth = container.offsetWidth;
        const containerHeight = window.innerHeight - container.offsetTop;
        const movieCardWidth = isMobile.value ? 90 : 200;
        const movieCardHeight = isMobile.value ? 150 : 220;
        const horizontalGap = isMobile.value ? 10 : 15;
        const verticalGap = -10;

        rowSize.value = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
        const maxRows = Math.floor(containerHeight / (movieCardHeight + verticalGap));
        moviesPerPage.value = rowSize.value * maxRows;
      }
    };

    // Image URL helper
    const getImageUrl = (path) => `https://image.tmdb.org/t/p/w300${path}`;

    // Lifecycle hooks
    onMounted(async () => {
      await fetchMovies();
      calculateLayout();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      if (wishlistTimer) {
        clearTimeout(wishlistTimer);
      }
    });

    return {
      gridContainer,
      movies,
      currentPage,
      rowSize,
      moviesPerPage,
      currentView,
      visibleMovieGroups,
      totalPages,
      nextPage,
      prevPage,
      toggleWishlist,
      isInWishlist,
      getImageUrl,
    };
  },
};
</script>

<style scoped>
.wishlist-indicator {
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 20px;
  background-color: rgba(229, 9, 20, 0.5);
  box-shadow: 0 0 5px rgba(229, 9, 20, 0.7);
}

.movie-overview {
  position: absolute;
  bottom: 0;
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

.movie-grid {
  width: 100%;
  height: calc(100vh - 200px);
  margin-bottom: 40px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.movie-card {
  width: 200px;
  margin: 0 10px;
  transition: transform 0.3s;
  position: relative;
}

.grid-container.list .movie-card {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%; /* 카드 너비에 맞게 조정 */
  height: auto; /* 이미지 비율 유지 */
  border-radius: 10px; /* 둥근 모서리 */
  object-fit: contain; /* 이미지 비율을 유지하며 잘리지 않게 조정 */
}

.grid-container.list .movie-card img {
  width: 100px;
  margin-right: 20px;
}

.movie-title {
  margin-top: 5px;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.grid-container.list .movie-title {
  text-align: left;
  white-space: normal;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .movie-grid {
    height: calc(90svh - 200px);
  }

  .movie-card {
    width: 90px;
    margin: 0 5px;
  }

  .movie-title {
    font-size: 12px;
  }

  .pagination button {
    padding: 8px 12px;
    font-size: 14px;
  }

  .grid-container.list .movie-card img {
    width: 60px;
  }
}

</style>
