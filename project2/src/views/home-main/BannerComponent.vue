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
        <!-- 재생 버튼 -->
        <button class="play-btn title-btn">재생</button>
        <!-- 상세 정보 버튼 -->
        <button class="info-btn title-btn" @click="toggleDetails(movie.id)">
          {{ selectedMovieId === movie.id ? '닫기' : '상세 정보' }}
        </button>
        <!-- overview 표시 -->
        <p
          v-if="selectedMovieId === movie.id"
          class="overview slide-down"
        >
          {{ movie.overview }}
        </p>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
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
  setup () {
    const selectedMovieId = ref(null);

    // 상세 정보 토글 함수
    const toggleDetails = (id) => {
      selectedMovieId.value = selectedMovieId.value === id ? null : id;
    };

    return {
      modules: [Autoplay, Pagination, Navigation],
      selectedMovieId,
      toggleDetails,
    };
  },
};
</script>

<style scoped>
/* 타이틀 스타일 */
.title {
  font-size: 3rem;
  font-weight: bold;
  margin-top: 60px;
  text-align: center;
}

/* 배너 컨테이너 */
.banner-container {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
}

/* 슬라이드 스타일 */
.swiper-slide {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  background-size: cover;
  background-position: center;
}

/* 배너 내용 */
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

/* 재생 버튼 스타일 */
.play-btn {
  background-color: white;
  color: black;
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.play-btn:hover {
  background-color: rgba(200, 200, 200, 0.9);
}

/* 상세 정보 버튼 스타일 */
.info-btn {
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
}

.info-btn:hover {
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
}

/* overview 애니메이션 기본 스타일 */
.overview {
  font-size: 1rem;
  max-width: 500px;
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* overview가 보일 때 */
.slide-down {
  opacity: 1;
  transform: translateY(0);
}
</style>
