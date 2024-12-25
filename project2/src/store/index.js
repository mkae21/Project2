import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    kakaoAccessToken: localStorage.getItem("kakaoAccessToken"),
  },
  mutations: {
    clearKakaoAccessToken(state) {
      state.kakaoAccessToken = null;
      localStorage.clear();
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
        commit("clearKakaoAccessToken");
      } catch (err) {
        console.error("카카오 로그아웃 오류:", err);
      }
    }
  },
});