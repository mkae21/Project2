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

// 독립적으로 handleKakaoLogin 함수 정의
async function handleKakaoLogin(code, router) {
  try {
    const response = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.VUE_APP_REST_API_KEY,
        redirect_uri: process.env.VUE_APP_REDIRECT_URI,
        code: code,
      }),
    });

    const data = await response.json();
    console.log('카카오 토큰:', data);

    if (data.access_token) {
      localStorage.setItem('kakaoAccessToken', data.access_token);
      router.push('/Project2'); // 로그인 성공 시 리다이렉트
    }
  } catch (error) {
    console.error('카카오 로그인 처리 중 오류:', error);
  }
}

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
    handleKakaoLogin(code, router); // 독립 함수 호출
    return; // 비동기 작업 중복 실행 방지
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    toast('로그인이 필요합니다.', { type: 'error', autoClose: 3000 });
    return next('/signin'); // 인증이 필요한 경우 로그인 페이지로 이동
  }

  next();
});

export default router;