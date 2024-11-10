<template>
  <div v-if="movie" class="banner" :style="{ backgroundImage: 'url(' + backdropUrl + ')' }">
    <div class="banner-content">
      <h1>{{ movie.title }}</h1>
      <p>{{ movie.overview }}</p>
      <button class="play-btn title-btn">재생</button>
      <button class="info-btn title-btn">상세 정보</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  computed: {
    backdropUrl () {
      return this.movie ? `https://image.tmdb.org/t/p/original${this.movie.backdrop_path}` : ''
    }
  }
}
</script>

<style scoped>
.banner {
  height: 50vh; /* 화면의 80%를 차지하도록 설정 */
  width: 300vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.banner-content {
  padding: 40px;
  width: 50%; /* 텍스트와 버튼이 차지할 넓이 */
  background:transparent;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  bottom: 0; /* 하단에 배치 */
  left: 20px; /* 왼쪽 여백 */
}

.banner h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: normal;
}

.banner p {
  font-size: 1.3rem;
  max-width: 600px;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.play-btn, .info-btn {
  padding: 10px 25px;
  /* 마진 바텀 */
  margin-bottom: 2rem;
  margin-right: 15px;
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

@media (max-width: 768px) {
  .banner {
    height: 60vh; /* 모바일 화면에서는 배너 높이를 줄임 */
  }
  .banner h1 {
    font-size: 2.5rem;
  }
  .banner p {
    font-size: 1rem;
  }
  .play-btn, .info-btn {
    font-size: 0.9rem;
    padding: 8px 20px;
  }
}
</style>
