import axios from 'axios';

class URLService {
  // 인기 영화 데이터 가져오기
  async fetchFeaturedMovie (apiKey, limit = 5) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`
      );

      // 인기 영화 중 limit 개수만 반환
      return response.data.results.slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured movies:', error);
      throw error;
    }
  }

  // 인기 영화 URL 생성
  getURL4PopularMovies(apiKey, page = 1) {
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`;
  }

  // 최신 영화 URL 생성
  getURL4ReleaseMovies(apiKey, page = 2) {
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`;
  }

  // 특정 장르 영화 URL 생성
  getURL4GenreMovies(apiKey, genre, page = 1) {
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`;
  }
}

// Singleton 인스턴스 생성 후 내보내기
export default new URLService();
