import { createRouter, createWebHistory } from 'vue-router'; // Web History 모드 사용
import HomeComponent from '../components/home/HomeComponent.vue';
import HomeMainComponent from '../components/home/main/HomeMainComponent.vue';
import SignInComponent from '../components/sign-in/SignInComponent.vue';
import HomePopularComponent from '../components/home/popular/HomePopularComponent.vue';
import HomeWishlistComponent from '../components/home/wishlist/HomeWishlistComponent.vue';
import HomeSearchComponent from '../components/search/HomeSearchComponent.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const routes = [
  {
    path: '/Project2',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: HomeMainComponent,
      },
      {
        path: 'popular',
        component: HomePopularComponent,
      },
      {
        path: 'wishlist',
        component: HomeWishlistComponent,
      },
      {
        path: 'search',
        component: HomeSearchComponent,
      },
    ],
    meta: { requiresAuth: true }, // 인증이 필요한 라우트
  },
  {
    path: '/signin',
    component: SignInComponent,
  },
];

const router = createRouter({
  history: createWebHistory(), // Web History 모드로 변경
  routes,
});

// 전역 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('kakaoAccessToken') !== null;

  // URL에서 "code" 파라미터를 확인
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code && !isLoggedIn) {
    handleKakaoLogin(code, router);
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    return next('/signin'); // 인증이 필요한 경우 로그인 페이지로 이동
  }

  next();
});

export default router;