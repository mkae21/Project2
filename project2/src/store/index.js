import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    kakaoAccessToken: localStorage.getItem("kakaoAccessToken"),
  },
  mutations: {
    setKakaoAccessToken(state, token) {
      state.kakaoAccessToken = token
    },
  },
  actions: {
    async kakaoLogout({ state, commit }) {
      if (!state.kakaoAccessToken) {
        console.log("액세스 토큰이 없습니다. 로그아웃 불가"); // 디버깅 로그
        return;
      }
      try {
        await axios.post(
          "https://kapi.kakao.com/v1/user/logout",
          {},
          {
            headers: { Authorization: `Bearer ${state.kakaoAccessToken}` },
          }
        );
        console.log("[카카오 로그아웃 성공]");
        commit("setKakaoAccessToken", null);
      } catch (err) {
        console.error("카카오 로그아웃 오류:", err);
      }
    }
  },
});