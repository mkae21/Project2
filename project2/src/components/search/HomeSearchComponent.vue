<template>
  <div class="container-search">
    <!-- 검색 바 컴포넌트 -->
    <div class="container-search-bar">
      <MovieSearchComponent @change-options="changeOptions" />
    </div>

    <!-- 무한 스크롤 컴포넌트 -->
    <div class="content-search">
      <MovieInfiniteScrollComponent
        :apiKey="apiKey"
        :genreCode="genreId"
        :sortingOrder="sortId"
        :voteEverage="ageId"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import MovieSearchComponent from "@/views/search/MovieSearchComponent.vue";
import MovieInfiniteScrollComponent from "@/views/views/MovieInfiniteScrollComponent.vue";

export default {
  name: "HomeSearchComponent",
  components: {
    MovieSearchComponent,
    MovieInfiniteScrollComponent
  },
  setup () {
    // API Key
    const apiKey = ref(localStorage.getItem("TMDb-Key") || "");

    // 기본 옵션 값
    const genreId = ref("28"); // 기본: Action
    const ageId = ref(-1); // 기본: 평점 전체
    const sortId = ref("all"); // 기본: 정렬 전체

    // 장르 코드 매핑
    const genreCode = {
      "장르 (전체)": 0,
      Action: 28,
      Adventure: 12,
      Comedy: 35,
      Crime: 80,
      Family: 10751
    }

    // 정렬 코드 매핑
    const sortingCode = {
      "언어 (전체)": "all",
      영어: "en",
      한국어: "ko",
    }

    // 나이 제한 코드 매핑
    const ageCode = {
      "평점 (전체)": -1,
      "9~10": 9,
      "8~9": 8,
      "7~8": 7,
      "6~7": 6,
      "5~6": 5,
      "4~5": 4,
      "4점 이하": -2
    }

    // 옵션 변경 메서드
    const changeOptions = (selectedOptions) => {
      console.log("Received options:", selectedOptions); // 디버깅 로그
      genreId.value = `${genreCode[selectedOptions.originalLanguage]}`
      ageId.value = ageCode[selectedOptions.translationLanguage]
      sortId.value = sortingCode[selectedOptions.sorting]

      // console.log("Updated genreId:", genreId.value); // 업데이트된 값 확인
      // console.log("Updated ageId:", ageId.value);
      // console.log("Updated sortId:", sortId.value);
    }


    return {
      apiKey,
      genreId,
      ageId,
      sortId,
      changeOptions
    }
  }
}
</script>

<style scoped>
.container-search {
  margin-top: 50px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.container-search-bar {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: right;
  margin-top: 10px;
}

.content-search {
  width: 100%;
}
</style>
