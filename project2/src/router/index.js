import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '../components/home/HomeComponent.vue'
import HomeMainComponent from '../components/home/main/HomeMainComponent.vue'
import SignInComponent from '../components/sign-in/SignInComponent.vue'
import HomePopularComponent from '../components/home/popular/HomePopularComponent.vue'
import HomeWishlistComponent from '../components/home/wishlist/HomeWishlistComponent.vue'
import HomeSearchComponent from '../components/search/HomeSearchComponent.vue'

const routes = [
  {
    path: '/Project2', // 부모 컴포넌트 경로
    component: HomeComponent,
    children: [
      {
        path: '', // 부모 경로에 상대적인 기본 자식 경로
        component: HomeMainComponent
      },
      {
        path: 'popular', // 부모 경로에 상대적인 'popular' 경로
        component: HomePopularComponent
      },
      {
        path: 'wishlist', // 부모 경로에 상대적인 'popular' 경로
        component: HomeWishlistComponent
      },
      {
        path: 'search',
        component: HomeSearchComponent
      }
    ]
  },
  {
    path: '/signin',
    component: SignInComponent
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
