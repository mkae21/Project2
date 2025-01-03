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
        <span v-if="isLoggedIn" class="icon-id desktop-logout">
          <font-awesome-icon :icon="['far', 'id-badge']" />
        </span>
        <button v-if="!isLoggedIn" class="icon-login desktop-logout" @click="logIn">
          <font-awesome-icon :icon="['fas', 'door-open']" />
        </button>
        <span v-if="isLoggedIn" class="username">{{ kakaoName }}</span>
        <span v-if="!isLoggedIn" class="username">로그인이 필요합니다.</span>
        <button v-if="isLoggedIn" class="icon-button desktop-logout" @click="handleLogout">
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
        <button v-if="!isLoggedIn" class="icon-ui-login icon-button" @click="logIn">
          <font-awesome-icon :icon="['fas', 'door-open']" />
        </button>
        <div class="mobile-nav-ui">
          <button v-if = "isLoggedIn" class="icon-button icon-ui" @click="handleLogout">
            <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
          </button>
        </div>
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
import { useStore } from 'vuex'
import { mapActions } from 'vuex'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTicket, faDoorOpen, faBars, faTimes, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faIdBadge } from '@fortawesome/free-regular-svg-icons'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

library.add(faIdBadge, faDoorOpen, faTicket, faBars, faTimes, faArrowRightFromBracket)

export default {
  components: { FontAwesomeIcon },
  setup () {
    const store = useStore()
    const isScrolled = ref(false)
    const isMobileMenuOpen = ref(false)
    const router = useRouter()
    const isLoggedIn = ref(localStorage.getItem('isLoggedIn'))
    const loggedInUser = ref(localStorage.getItem('loggedInUser'))
    const kakaoName = ref(localStorage.getItem('kakaoNickname'))

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }

    const loginValid = () => {
      if (!isLoggedIn.value) {
        toast('로그인이 필요합니다.', { type: 'error' })
        router.push('/signin')
      } else {
        toast('로그인 되어있는 사용자: ' + kakaoNickname.value, { type: 'success' })
      }
    }
    const logIn = () => {
      if (!isLoggedIn.value) {
        router.push('/signin')
      }
    }

    const logOut = () => {
      try {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('loggedInUser')
        isLoggedIn.value = false
        loggedInUser.value = ''
        toast('로그아웃 되었습니다.', { type: 'success' })
      } catch (err) {
        alert('Error during logout:', err)
      }
    }

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }
    const handleLogout = async () => {
      console.log("로그아웃 버튼이 클릭되었습니다.")
      try {
        // 1) 일반 로컬 로그아웃
        logOut()

        // 2) 카카오 로그아웃
        await store.dispatch('kakaoLogout')

        // 추가 후처리
        isLoggedIn.value = false
        kakaoName.value = ""
        toast("로그아웃 완료", { type: "success" })
      } catch (err) {
        console.error("로그아웃 중 오류 발생:", err)
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      ...mapActions(["kakaoLogout"]), // Vuex의 kakaoLogout 액션 연결
      isScrolled,
      isMobileMenuOpen,
      isLoggedIn,
      loggedInUser,
      loginValid,
      logOut,
      logIn,
      toggleMobileMenu,
      kakaoName,
      handleLogout
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
.icon-id{
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  margin-left: 20px;
  margin-right: 15px;
}

.icon-login{
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  margin-left: 20px;
  margin-right: 15px;
  cursor:pointer;
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

.mobile-nav-ui {
  position: absolute;
  bottom:10px;
  left: 8px;
  background: none;
  border: none;
  color: white;
  padding: 0;
  cursor: pointer;
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

.username{
  color: white;
  font-size: 1rem;
  margin-left: 10px;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  .desktop-logout {
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
  .icon-ui {
    font-size: 1.5rem;
  }

  .icon-ui-login {
    font-size: 1.5rem;
    margin-left: 10px;
    margin-top: 30px;
  }

  a {
    text-align: left;
    font-size: 1.15rem !important;
  }
}
</style>
