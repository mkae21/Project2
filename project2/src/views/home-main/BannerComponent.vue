<template>
  <div class="title">
    <h4>오늘의 top 5</h4>
  </div>
  <swiper
    :spaceBetween="30"
    :centeredSlides="true"
    :autoplay="{
      delay: 3000,
      disableOnInteraction: false,
    }"
    :pagination="{
      clickable: true,
    }"
    :navigation="true"
    :modules="modules"
    class="banner-container"
  >
    <swiper-slide
      v-for="movie in movies"
      :key="movie.id"
      :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }"
    >
      <div class="banner-content">
        <h1>{{ movie.title }}</h1>
        <p>{{ movie.overview }}</p>
        <button class="play-btn title-btn">재생</button>
        <button class="info-btn title-btn">상세 정보</button>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export default {
  name: 'BannerComponent',
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    movies: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return {
      modules: [Autoplay, Pagination, Navigation],
    };
  },
};
</script>

<style scoped>
.title {
  font-size: 3rem;
  font-weight: bold;
  margin-top: 60px;
  text-align: center;
}

.banner-container {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
}

.swiper-slide {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  background-size: cover;
  background-position: center;
}

.banner-content {
  padding: 50px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  color: white;
  width: 100%;
}

.banner-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.banner-content p {
  font-size: 1rem;
  max-width: 500px;
  margin-bottom: 1rem;
}

.play-btn,
.info-btn {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.play-btn {
  background-color: white;
  color: black;
}

.info-btn {
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
}
</style>
