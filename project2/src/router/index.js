import { createRouter, createWebHistory } from 'vue-router'
import HomeMainView from '@/views/HomeMain.vue'
import HomeSineIn from '@/components/Sine-in.vue'

const routes = [
  {
    path: '/',
    name: 'SineIn',
    component: HomeSineIn
  },
  {
    path: '/home',
    name: 'home',
    component: HomeMainView
  },
  {
    path: '/popular',
    name: 'popular',
    component: HomeMainView
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: HomeMainView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
