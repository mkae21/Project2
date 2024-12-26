import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '../components/home/HomeComponent.vue';
import HomeMainComponent from '../components/home/main/HomeMainComponent.vue';
import SignInComponent from '../components/sign-in/SignInComponent.vue';
import HomePopularComponent from '../components/home/popular/HomePopularComponent.vue';
import HomeWishlistComponent from '../components/home/wishlist/HomeWishlistComponent.vue';
import HomeSearchComponent from '../components/search/HomeSearchComponent.vue';
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

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
    path: 'Project2/signin', 
    component: SignInComponent,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 전역 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      toast('로그인이 필요합니다.', { type: 'error', autoClose: 3000 })
      return next('/Project2/signin'); // 로그인 페이지로 리다이렉트
    }
  }
  next(); // 라우트 이동 허용
});

export default router;
