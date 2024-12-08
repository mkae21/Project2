<template>
  <div class="movie-row">
    <h2>{{ title }}</h2>
    <div
      class="slider-container"
      @wheel="handleWheel"
      @mousemove="showButtons = true"
      @mouseleave="showButtons = false"
    >
      <button
        class="slider-button left"
        @click="slide('left')"
        :disabled="atLeftEdge"
      >
        &lt;
      </button>
      <div class="slider-window" ref="sliderWindow">
        <div
          class="movie-slider"
          ref="slider"
          :style="{ transform: 'translateX(' + -scrollAmount + 'px)' }"
        >
          <div
            v-for="movie in movies"
            :key="movie.id"
            class="movie-card"
            @click="toggleWishlist(movie)"
          >
            <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
            <div v-if="isInWishlist(movie.id)" class="wishlist-indicator">
              👍
            </div>
            <!-- 영화 개요 추가 -->
            <div class="movie-overview">
              <p>{{ movie.overview }}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        class="slider-button right"
        @click="slide('right')"
        :disabled="atRightEdge"
      >
        &gt;
      </button>
    </div>
  </div>
</template>


<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import WishlistService from "@/util/movie/WishlistService";

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    fetchUrl: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const movies = ref([])
    const scrollAmount = ref(0)
    const showButtons = ref(false)
    const maxScroll = ref(0)
    const slider = ref(null)
    const sliderWindow = ref(null)


    onMounted(async () => {
      await fetchMovies()
      calculateMaxScroll()
    })

    const fetchMovies = async () => {
      try {
        const response = await axios.get(props.fetchUrl)
        movies.value = response.data.results
      } catch (error) {
        console.error('Error fetching movies:', error)
      }
    }

    const calculateMaxScroll = () => {
      if (slider.value && sliderWindow.value) {
        maxScroll.value = Math.max(0, slider.value.scrollWidth - sliderWindow.value.clientWidth)
      }
    }

    const slide = (direction) => {
      const slideAmount = sliderWindow.value.clientWidth * 0.8
      if (direction === 'left') {
        scrollAmount.value = Math.max(0, scrollAmount.value - slideAmount)
      } else {
        scrollAmount.value = Math.min(maxScroll.value, scrollAmount.value + slideAmount)
      }
    }

    const getImageUrl = (path) => `https://image.tmdb.org/t/p/w300${path}`

    const atLeftEdge = computed(() => scrollAmount.value <= 0)
    const atRightEdge = computed(() => scrollAmount.value >= maxScroll.value)

    const toggleWishlist = (movie) => {
      WishlistService.toggleWishlist(movie)
    }

    const isInWishlist = (movieId) => {
      return WishlistService.isInWishlist(movieId)
    }

    return {
      movies,
      scrollAmount,
      showButtons,
      atLeftEdge,
      atRightEdge,
      slide,
      getImageUrl,
      toggleWishlist,
      isInWishlist,
      slider,
      sliderWindow
    }
  }
}
</script>

<style scoped>
  .wishlist-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
  border-radius: 50%;
  font-size: 12px;
}

.movie-row {
  margin-bottom: 40px;
  position: relative;
  width: 100%;
  overflow: hidden;
}

.movie-row h2 {
  text-align: left;
  margin-left: 30px;
}

.slider-container {
  position: relative;
  touch-action: pan-y;
}

.slider-window {
  overflow: hidden;
  margin: 0 40px;
}

.movie-slider {
  display: flex;
  transition: transform 0.3s ease;
  padding: 20px 0;
}

.movie-card {
  flex: 0 0 auto;
  width: 200px;
  margin-right: 10px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}
.movie-card:hover .movie-overview {
  opacity: 1;
  transform: translateY(0);
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
  max-height: calc(1.4em * 3); /* 3줄 제한, 1.4는 line-height */
  overflow: hidden; /* 넘치는 텍스트 숨기기 */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 최대 3줄로 제한 */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis; /* 넘친 텍스트에 "..." 추가 */
  white-space: normal; /* 줄바꿈 허용 */
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slider-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 20px 10px;
  cursor: pointer;
  z-index: 10;
  transition: opacity 0.3s, background-color 0.3s;
}

.slider-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.slider-button.left {
  left: 0;
}

.slider-button.right {
  right: 0;
}

.slider-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .movie-row {
    margin-bottom: 20px;
  }

  .movie-card {
    width: 120px;
    margin-right: 5px;
  }

  .movie-slider {
    padding: 0;
  }

  .slider-window {
    margin: 0 10px;
  }

  .movie-overview {
    font-size: 12px;
    padding: 5px;
  }
}
</style>
