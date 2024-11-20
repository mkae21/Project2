<template>
    <div class="popular-container">
      <!-- View Toggle Buttons -->
      <div class="view-toggle">
        <button
          @click="setView('grid')"
          :class="{ active: currentView === 'grid' }"
        >
          <font-awesome-icon :icon="faTh" />
        </button>
        <button
          @click="setView('list')"
          :class="{ active: currentView === 'list' }"
        >
          <font-awesome-icon :icon="faBars" />
        </button>
      </div>
  
      <!-- Grid View -->
      <MovieGridComponent
        v-if="currentView === 'grid'"
        title="인기 영화"
        :fetchUrl="fetchURL"
      />
  
      <!-- Infinite Scroll View -->
      <MovieInfiniteScrollComponent
        v-if="currentView === 'list'"
        :apiKey="apiKey"
        genreCode="28"
        sortingOrder="all"
        :voteEverage="-1"
      />
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from "vue";
  import { faTh, faBars } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import URLService from "@/util/movie/URLService.js"; // 경로를 프로젝트 구조에 맞게 수정
  import MovieGridComponent from "@/views/views/MovieGridComponent.vue";
  import MovieInfiniteScrollComponent from "@/views/views/MovieInfiniteScrollComponent.vue";
  
  export default {
    name: "HomePopularComponent",
    components: {
      FontAwesomeIcon,
      MovieGridComponent,
      MovieInfiniteScrollComponent,
    },
    setup() {
      const apiKey = localStorage.getItem("TMDb-Key") || "";
      const currentView = ref("grid");
      const fetchURL = ref(URLService.getURL4PopularMovies(apiKey));
  
      // Methods to toggle views
      const setView = (view) => {
        currentView.value = view;
        if (view === "grid") {
          disableScroll();
        } else {
          enableScroll();
        }
      };
  
      // Methods to manage body scroll
      const disableScroll = () => {
        document.body.style.overflow = "hidden";
      };
  
      const enableScroll = () => {
        document.body.style.overflow = "auto";
      };
  
      onMounted(() => {
        disableScroll();
      });
  
      return {
        faTh,
        faBars,
        apiKey,
        currentView,
        fetchURL,
        setView,
      };
    },
  };
  </script>
  
  <style scoped>
  .popular-container {
    padding: 20px;
  }
  
  .view-toggle {
    display: flex;
    justify-content: flex-end;
    margin-top: 50px;
  }
  
  .view-toggle button {
    background-color: #333;
    color: white;
    border: none;
    padding: 10px 15px;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .view-toggle button.active {
    background-color: #535bf2;
  }
  
  @media (max-width: 768px) {
    .view-toggle {
      margin-top: 80px;
    }
  }
  </style>
  