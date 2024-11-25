// @/util/authservice.js

export default {
  // 로그인 메소드
  tryLogin (email, password, saveToken = true) {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(user => user.id === email && user.password === password);

      if (user) {
        // 로그인 성공 시, 토큰을 localStorage에 저장
        if (saveToken) {
          localStorage.setItem('TMDb-Key', user.password);
        }
        resolve(user); // 성공한 사용자 반환
      } else {
        reject('Login failed'); // 실패 시 에러 반환
      }
    });
  },

  // 회원가입 메소드
  tryRegister (email, password) {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(existingUser => existingUser.id === email);

        if (userExists) {
          reject('User already exists'); // 사용자 이미 존재하는 경우 에러
          return;
        }

        const newUser = { id: email, password: password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users)); // 사용자 추가
        resolve(); // 성공적으로 등록된 경우
      } catch (err) {
        reject(err); // 에러 발생 시
      }
    });
  }
};
