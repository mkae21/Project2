<template>
    <div class="movie-row">
      <h2>{{ title }}</h2>
      <div class="slider-container" @wheel="handleWheel" @mousemove="showButtons = true" @mouseleave="showButtons = false">
        <button class="slider-button left" @click="slide('left')" :disabled="atLeftEdge">&lt;</button>
        <div class="slider-window" ref="sliderWindow">
          <div class="movie-slider" ref="slider" :style="{ transform: 'translateX(' + (-scrollAmount) + 'px)' }">
            <div v-for="movie in movies" :key="movie.id" class="movie-card" @click="toggleWishlist(movie)">
              <img :src="getImageUrl(movie.poster_path)" :alt="movie.title">
              <div v-if="isInWishlist(movie.id)" class="wishlist-indicator">👍</div>
            </div>
          </div>
        </div>
        <button class="slider-button right" @click="slide('right')" :disabled="atRightEdge">&gt;</button>
      </div>
    </div>
  </template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

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
      // 위시리스트 기능 추가
    }

    const isInWishlist = (movieId) => {
      // 위시리스트 확인 기능 추가
      return false
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
  /* 여기에 CSS를 붙여 넣으세요 */
  </style>
