<template>
    <header class="app-header" :class="{ scrolled: isScrolled }">
      <div class="header-left">
        <div class="logo">
          <router-link to="/Project2">
            <font-awesome-icon :icon="['fas', 'ticket']" style="height: 100%; color: #E50914;" />
          </router-link>
        </div>
        <nav class="nav-links desktop-nav">
          <ul>
            <li><router-link to="/Project2">홈</router-link></li>
            <li><router-link to="/Project2/popular">대세 콘텐츠</router-link></li>
            <li><router-link to="/Project2/wishlist">내가 찜한 리스트</router-link></li>
            <li><router-link to="/Project2/search">찾아보기</router-link></li>
          </ul>
        </nav>
      </div>
      <div class="header-right">
        <button class="icon-button" @click="loginValid">
          <font-awesome-icon :icon="['fas', 'user']" />
        </button>
        <button class="icon-button" @click="logOut">
          <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
        </button>
        <button class="icon-button mobile-menu-button" @click="toggleMobileMenu">
          <font-awesome-icon :icon="['fas', 'bars']" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div class="mobile-nav" :class="{ open: isMobileMenuOpen }">
        <button class="close-button" @click="toggleMobileMenu">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
        <nav>
          <ul>
            <li><router-link to="/Project2" @click="toggleMobileMenu">홈</router-link></li>
            <li><router-link to="/Project2/popular" @click="toggleMobileMenu">대세 콘텐츠</router-link></li>
            <li><router-link to="/Project2/wishlist" @click="toggleMobileMenu">내가 찜한 리스트</router-link></li>
            <li><router-link to="/Project2/search" @click="toggleMobileMenu">찾아보기</router-link></li>
          </ul>
        </nav>
      </div>
    </header>
  </template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faTicket, faBars, faTimes, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'; // 최신 버전에서는 이 경로가 맞습니다.

library.add(faUser, faTicket, faBars, faTimes, faArrowRightFromBracket)

export default {
  components: { FontAwesomeIcon },
  setup () {
    const isScrolled = ref(false)
    const isMobileMenuOpen = ref(false)
    const router = useRouter()

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }

    const loginValid = () => {
      if (!localStorage.getItem('isLoggedIn')) {
        toast('로그인이 필요합니다.', { type: 'error' })
        router.push('/signin')
      }
      else {
        toast('로그인 되어있는 사용자: ' + localStorage.getItem('loggedInUser'), { type: 'success' })
      }
    }

    const logOut = async () => {
      try {
        if (!localStorage.getItem('isLoggedIn')) {
          toast('로그인이 되어있지 않습니다.', { type: 'error' })
          return
        }

        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('loggedInUser')
        // await router.push('/signin') // 비동기로 이동 보장
        toast('로그아웃 되었습니다.', { type: 'success' })
      } catch (err) {
        alert('Error navigating to /signin:', err);
      }
    }

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      isScrolled,
      isMobileMenuOpen,
      loginValid,
      logOut,
      toggleMobileMenu
    }
  }
}
</script>

  <style scoped>
  .app-header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 4%;
    background-color: transparent;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: background-color 0.3s ease;
  }

  .app-header:hover,
  .app-header.scrolled {
    background-color: #141414;
  }

  .header-left,
  .header-right {
    display: flex;
    align-items: center;
  }

  .logo {
    height: 30px;
    margin-right: 25px;
    justify-items: center;
    align-items: center;
  }

  .nav-links ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .nav-links li {
    margin-right: 20px;
  }

  .nav-links a {
    color: #e5e5e5;
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.3s ease;
  }

  .nav-links a:hover {
    color: #b3b3b3;
  }

  .icon-button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    margin-left: 20px;
    cursor: pointer;
  }

  .icon-button:hover {
    opacity: 0.5;
  }

  .mobile-menu-button {
    display: none;
  }

  .mobile-nav {
    display: none;
    position: fixed;
    top: 0;
    right: -100%;
    width: 50%;
    height: 100%;
    background-color: #141414;
    z-index: 1001;
    transition: right 0.3s ease;
  }

  .mobile-nav.open {
    right: 0;
  }

  .mobile-nav ul {
    list-style-type: none;
    padding: 0;
    margin-top: 60px;
  }

  .mobile-nav li {
    margin: 20px 0;
  }

  .mobile-nav a {
    color: #e5e5e5;
    text-decoration: none;
    font-size: 1.2rem;
    display: block;
    padding: 10px 20px;
  }

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .desktop-nav {
      display: none;
    }

    .mobile-menu-button {
      display: block;
    }

    .mobile-nav {
      display: block;
    }

    .icon-button {
      font-size: 0.75rem;
      margin-left: 10px;
    }

    a {
      text-align: left;
      font-size: 1.15rem !important;
    }
  }

  </style>
