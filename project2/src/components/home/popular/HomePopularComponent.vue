<template>
  <div class="popular-container">
    <div class="view-toggle">
      <button @click="setView('grid')" :class="{ active: currentView === 'grid' }">
        <font-awesome-icon :icon="['fas', 'th']" />
      </button>
      <button @click="setView('list')" :class="{ active: currentView === 'list' }">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </button>
    </div>

    <MovieGridComponent v-if="fetchUrl" v-show="currentView === 'grid'" :fetchUrl="fetchUrl" />
    <MovieInfiniteScrollComponent
      v-if="currentView === 'list'"
      :apiKey="apiKey"
      :genreCode="'28'"
      :sortingOrder="'all'"
      :voteEverage="-1"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTh, faBars } from '@fortawesome/free-solid-svg-icons';
import MovieGridComponent from '@/views/views/MovieGridComponent.vue';
import MovieInfiniteScrollComponent from '@/views/views/MovieInfiniteScrollComponent.vue';
import URLService from '@/util/movie/URLService.js';


library.add(faTh, faBars);

export default {
  name: 'HomePopular',
  components: {
    FontAwesomeIcon,
    MovieGridComponent,
    MovieInfiniteScrollComponent
  },
  setup () {
    const apiKey = ref(process.env.TDMB_KEY || '');
    const currentView = ref('grid');
    const fetchUrl = ref('');

    const setView = (view) => {
      currentView.value = view;
      if (view === 'grid') {
        disableScroll();
      } else {
        enableScroll();
      }
    };

    const disableScroll = () => {
      document.body.style.overflow = 'hidden';
    };

    const enableScroll = () => {
      document.body.style.overflow = 'auto';
    };

    onMounted(async () => {
      disableScroll();

      try {
        // URLService를 통해 URL 생성
        fetchUrl.value = URLService.getURL4PopularMovies(apiKey.value);
        console.log('Fetch URL in Parent Component before child:', fetchUrl.value); // 로그 추가
      } catch (error) {
        console.error('Error initializing HomePopular:', error)
      }
    })

    return {
      apiKey,
      currentView,
      fetchUrl,
      setView
    };
  },
};
</script>

<style scoped>
.popular-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background-color: #ed0a0a;
}
</style>
