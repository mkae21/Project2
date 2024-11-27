<template>
  <div>
    <div class="bg-image"></div>
    <div class="container">
      <div id="phone">
        <div id="content-wrapper">
          <div :class="['card', { hidden: !isLoginVisible }]" id="login">
            <form @submit.prevent="handleLogin">
              <h1>Sign in</h1>
              <div class="input" :class="{ active: isEmailFocused || email }">
                <input
                  id="email"
                  type="email"
                  v-model="email"
                  @focus="focusInput('email')"
                  @blur="blurInput('email')"
                />
                <label for="email">Username or Email</label>
              </div>
              <div class="input" :class="{ active: isPasswordFocused || password }">
                <input
                  id="password"
                  type="password"
                  v-model="password"
                  @focus="focusInput('password')"
                  @blur="blurInput('password')"
                />
                <label for="password">Password</label>
              </div>
              <span class="checkbox remember">
                <input type="checkbox" id="remember" v-model="rememberMe" />
                <label for="remember" class="read-text">Remember me</label>
              </span>
              <span class="checkbox forgot">
                <a href="#">Forgot Password?</a>
              </span>
              <button  :disabled="!isLoginFormValid">Login</button>
            </form>
            <a href="javascript:void(0)" class="account-check" @click="toggleCard">
              {{ isLoginVisible ? "Don't have an account? Sign up" : "Already have an account? Sign in" }}
            </a>
          </div>
          <div :class="['card', { hidden: isLoginVisible }]" id="register">
            <form @submit.prevent="handleRegister">
              <h1>Sign up</h1>
              <div class="input" :class="{ active: isRegisterEmailFocused || registerEmail }">
                <input
                  id="register-email"
                  type="email"
                  v-model="registerEmail"
                  @focus="focusInput('registerEmail')"
                  @blur="blurInput('registerEmail')"
                />
                <label for="register-email">Email</label>
              </div>
              <div class="input" :class="{ active: isRegisterPasswordFocused || registerPassword }">
                <input
                  id="register-password"
                  type="password"
                  v-model="registerPassword"
                  @focus="focusInput('registerPassword')"
                  @blur="blurInput('registerPassword')"
                />
                <label for="register-password">Password</label>
              </div>
              <div class="input" :class="{ active: isConfirmPasswordFocused || confirmPassword }">
                <input
                  id="confirm-password"
                  type="password"
                  v-model="confirmPassword"
                  @focus="focusInput('confirmPassword')"
                  @blur="blurInput('confirmPassword')"
                />
                <label for="confirm-password">Confirm Password</label>
              </div>
              <span class="checkbox remember">
                <input type="checkbox" id="terms" v-model="acceptTerms" />
                <label for="terms" class="read-text">
                  I have read <b>Terms and Conditions</b>
                </label>
              </span>
              <button :disabled="!isRegisterFormValid">Register</button>
            </form>
            <a href="javascript:void(0)" class="account-check" @click="toggleCard">
              {{ isLoginVisible ? "Don't have an account? Sign up" : "Already have an account? Sign in" }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'; // 최신 버전에서는 이 경로가 맞습니다.

export default {
  data () {
    return {
      isLoginVisible: true,
      email: '',
      password: '',
      registerEmail: '',
      registerPassword: '',
      confirmPassword: '',
      rememberMe: false,
      acceptTerms: false,
      isEmailFocused: false,
      isPasswordFocused: false,
      isRegisterEmailFocused: false,
      isRegisterPasswordFocused: false,
      isConfirmPasswordFocused: false
    }
  },
  computed: {
    isLoginFormValid () {
      return this.email && this.password
    },
    isRegisterFormValid () {
      return (
        this.registerEmail &&
        this.registerPassword &&
        this.confirmPassword &&
        this.registerPassword === this.confirmPassword &&
        this.acceptTerms
      )
    }
  },
  methods: {
    toggleCard () {
      this.isLoginVisible = !this.isLoginVisible
    },
    focusInput (inputName) {
      this[`is${inputName.charAt(0).toUpperCase() + inputName.slice(1)}Focused`] = true;
    },
    blurInput (inputName) {
      this[`is${inputName.charAt(0).toUpperCase() + inputName.slice(1)}Focused`] = false;
    },
    handleLogin () {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(
        (user) => user.email === this.email && user.apiKey === this.password
      )
      if (user) {
        toast('로그인에 성공하셨습니다.',{
          autoClose: 6000,
        })

        // 로그인 상태와 사용자 정보 저장
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', this.email);

        // Remember me 체크 여부에 따라 사용자 정보 저장
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true'); // Remember me 플래그 저장
        } else {
          localStorage.removeItem('rememberMe');
        }

        this.$router.push('/Project2/');
      } 
      else {
        toast('비밀번호나 계정을 확인해 주십시오.',{
          autoClose: 3500
        });
      }
    },
    handleRegister () {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (users.some((user) => user.email === this.registerEmail)) {
        toast('이미 가입된 이메일 입니다.',{
          autoClose: 3500
        });
        return
      }

      const newUser = { email: this.registerEmail, apiKey: this.registerPassword }
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('TMDb-Key', this.registerPassword); // TMDb API 키 저장
      toast('회원가입이 되었습니다. 로그인해주세요!',{
        autoClose: 3500
      });
      this.toggleCard(); // Switch to login form
    },
    initializeLoginState () {
      const isRemembered = localStorage.getItem('rememberMe');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const loggedInUser = localStorage.getItem('loggedInUser');

      if (isLoggedIn && loggedInUser && isRemembered) {
        this.email = loggedInUser
        this.$router.push('/Project2')
      }
    }
  },
  setup () {
    const router = useRouter();
    return { router };
  },
  mounted () {
    this.initializeLoginState();
  },
};
</script>

<style scoped>

  :root {
    --container-start-x: -50%;
    --container-end-x: -90%;
    --container-start-y: -58%;
    --container-end-y: -42%;
    --container-start-color: #ECECEC;
    --container-end-color: #100f0f;
  }
  .bg-image {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('https://plus.unsplash.com/premium_photo-1723874470047-d7edf459c2a8?q=80&w=2888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    background-size: cover;
    background-position: center;
    filter: blur(5px);
  }
  .bg-image::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(27, 27, 27, 0.90);
  }
  a {
    text-decoration:none;
    margin:0;
    padding: 0;
  }
  .container {
    height: 100svh;
    width: 100svw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #phone {
    width: 50svw;
    max-width: 80dvh;
    max-height: 50dvh;
    aspect-ratio: 3.35 / 4;
    border-radius: min(2.5cqw, 2.0cqh);
    text-align: center;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  @media (max-height: 600px) {
    #phone {
      transform: translate(-50%, -50%) scale(0.5); /* 작은 화면에서 축소 */
    }
  }
  @media (max-height: 400px) {
    #phone {
      transform: translate(-50%, -50%) scale(0.3); /* 더 작은 화면에서 추가 축소 */
    }
  }
  #content-wrapper {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position:relative;
  }
  input {
    font-size: 1.2rem;
    font-weight: 600;
    color: #000;
    background-color: transparent;
    border: none;
    outline: none;
    width: 100%;
    height: 2.5rem;
    padding: 0;
    margin: 0;
  }
  .read-text {
    display: flex;
    align-items: center;
    justify-content: center;
    text-indent: 10px;
    color: #2b2b2b !important;
    font-weight: 900;
  }
  h1 {
    font-size:24px;
    font-weight:800;
    text-align:center;
    margin-top:0;
    color:#272727;
  }
  button {
    display:block;
    border-radius:50px;
    border:none;
    width:100%;
    background-color: #2069ff;
    color:#fff;
    padding:17px;
    text-transform:uppercase;
    letter-spacing:2px;
    box-shadow: 0px 10px 30px rgba(23,83,209,0.3);
    transition: all 0.2s ease;
  }
  button:hover {
    box-shadow: 0px 2px 10px rgba(23,83,209,0.4)
  }
  
  button:disabled {
    background-color: grey; /* 비활성화 상태일 때 회색 */
    color: lightgray; /* 텍스트 색상도 연하게 */
    cursor: not-allowed; /* 마우스 커서를 "금지" 모양으로 */
  }

  .input {
    position: relative;
    margin-top: 1.5rem;
  }
  .line-active {
    border-bottom:1px solid #2069ff !important;
    box-shadow: 0px 1px 0px #2069ff !important;
  }
  .input input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #9e9e9e;
    border-radius: 0;
    outline: none;
    height: 2.5rem;
    width: 100%;
    font-size: 1rem;
    padding: 0;
    -webkit-box-shadow: none;
    box-shadow: none;
    box-sizing: content-box;
    transition: all 0.3s ease;
  }
  .input label {
    color: #9e9e9e;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    font-size: 1rem;
    cursor: text;
    transition: transform .2s ease-out;
    transform-origin: 0% 100%;
    text-align: initial;
    transform: translateY(12px);
    pointer-events: none;
  }
  .label-active {
    transform: translateY(-14px) scale(0.8) !important;
    transform-origin: 0 0 !important;
  }
  .label-blue {
    color: #2069ff !important;
  }
  [type="checkbox"]:not(:checked), [type="checkbox"]:checked {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  [type="checkbox"]+label {
    position: relative;
    padding-left: 25px;
    cursor: pointer;
    display: inline-block;
    height: 25px;
    line-height: 22px;
    font-size: 1rem;
    user-select: none;
  }
  [type="checkbox"]+label:before, [type="checkbox"]:not(.filled-in)+label:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 18px;
    height: 18px;
    z-index: 0;
    border: 2px solid #5a5a5a;
    border-radius: 3px;
    margin-top: 2px;
    transition: .2s;
  }
  [type="checkbox"]:not(.filled-in)+label:after {
    border: 0;
    transform: scale(0);
  }
  [type="checkbox"]:checked+label:before {
    top: -4px;
    left: -5px;
    width: 12px;
    height: 22px;
    border-top: 2px solid transparent;
    border-left: 2px solid transparent;
    border-right: 2px solid #2069ff;
    border-bottom: 2px solid #2069ff;
    transform: rotate(40deg);
    backface-visibility: hidden;
    transform-origin: 100% 100%;
    border-radius: 1px;
  }
  .checkbox {
    margin-top:2rem;
    display:block;
    margin-bottom:2rem;
  }
  .remember {
    float:left;
  }
  .forgot {
    float:right;
  }
  .forgot a {
    text-decoration:none;
    color:#000;
    font-weight:900;
    line-height: 22px;
  }
  .card {
    border-radius:10px;
    width:100%;
    max-width: 800px;
    position:absolute;
    background-color:white;
    padding:27px 30px 46px 30px;
    box-shadow: 0 5px 10px rgba(0,0,0,0.16);
    transition: transform 0.6s;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotateY(0deg);
  }
  .card.hidden {
    transform: translate(-50%, -50%) rotateY(180deg);
  }
  .card form {
    transition: opacity 0.3s;
  }
  .card.hidden form {
    opacity: 0;
  }
  .account-check {
    width:100%;
    text-align:center;
    position:absolute;
    bottom:15px;
    left:0;
    opacity:1;
    text-decoration:none;
    visibility:visible;
    color:#000;
    padding:10px;
    transition: all 0.2s ease;
  }
  .account-check:active {
    color:#000;
    transform: translateY(2px);
  }
  .active > label {
    color: rgba(0, 0, 0, 0);
  }
  @media (max-width: 768px) {
    #phone {
      width: 70%;
      transform: translate(-50%, -50%) scale(1); /* 모바일 화면에서도 중앙에 위치하도록 */
    }
  }
</style>
