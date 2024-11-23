import { ref } from 'vue';

class WishlistService {
  // Reactive 상태
  constructor() {
    this.wishlist = ref([]);
    this.loadWishlist();
  }

  // 로컬 스토리지에서 위시리스트를 로드
  loadWishlist () {
    const storedWishlist = localStorage.getItem('movieWishlist');
    if (storedWishlist) {
      this.wishlist.value = JSON.parse(storedWishlist);
    }
  }

  // 위시리스트를 로컬 스토리지에 저장
  saveWishlist () {
    localStorage.setItem('movieWishlist', JSON.stringify(this.wishlist.value));
  }

  // 위시리스트에 영화 추가/제거
  toggleWishlist (movie) {
    const index = this.wishlist.value.findIndex(item => item.id === movie.id);

    if (index === -1) {
      // 영화가 위시리스트에 없으면 추가
      this.wishlist.value.push(movie);
    } else {
      // 영화가 이미 위시리스트에 있으면 제거
      this.wishlist.value = this.wishlist.value.filter(item => item.id !== movie.id);
    }

    this.saveWishlist();
  }

  // 영화가 위시리스트에 있는지 확인
  isInWishlist (movieId) {
    return this.wishlist.value.some(item => item.id === movieId);
  }

  // 현재 위시리스트 반환
  getCurrentWishlist () {
    return this.wishlist.value;
  }
}

// Singleton 인스턴스 생성
const wishlistService = new WishlistService();
export default wishlistService;
