# Project2

## 프로젝트 기본 정보

**Project2**는 영화 데이터를 기반으로 인기 영화, 최신 영화, 장르별 영화 등을 제공하며, 사용자가 관심 있는 영화를 위시리스트에 추가할 수 있는 웹 애플리케이션입니다.  
이 프로젝트는 Vue.js와 The Movie Database API(TMDb)를 활용하여 구축되었습니다.


## 기술 스택

- **Frontend**: Vue 3, Vue Router, Vuex, Axios
- **UI 라이브러리**: FontAwesome, Swiper, Vue Carousel
- **기타**: TMDb API (영화 데이터 제공), Local Storage (위시리스트 저장)


## 설치 및 실행 가이드

1. **필수 요구사항**:
   - Node.js(최소 14.0 이상)와 npm이 설치되어 있어야 합니다.

2. **프로젝트 복제**:

   git clone https://github.com/your-repo/project2.git

   cd project2

3. **의존성 설치**:
   npm install

4. **개발 서버 실행**:
    npm run serve

5. **회원 가입 및 로그인**

    - 회원 가입시 이메일 형식으로 가입을 하셔야 합니다.

    - 회원 가입시 비밀번호를 TDMB API 키로 가입을 하셔야 합니다.

    - TDMB API 키를 발급받기 위해 회원 가입이 필요합니다.

    - 로그인을 해야 위시리스트를 포함한 다른 페이지에 접근이 가능합니다.


# 주요 기능

1. 영화 데이터 제공
    - 인기 영화, 최신 영화, 장르별 영화 등 다양한 영화 데이터를 제공합니다.
2. 위시리스트
    - 사용자가 관심 있는 영화를 위시리스트에 추가할 수 있습니다.
    - 로컬 스토리지에 위시리스트 데이터를 저장합니다.
    - 영화 추가및 삭제 기능을 제공합니다.
3. 반응형 디자인
    - 모바일, 태블릿, 데스크탑 환경에 대응하는 반응형 디자인을 제공합니다.
4. 필터링 기능
    - 인기 영화, 최신 영화, 장르별 영화 등 다양한 필터링 기능을 제공합니다.
4. 자동 빌드 및 배포
    - GitHub Actions를 활용하여 코드 푸시 시 자동으로 빌드 및 배포를 진행합니다.


# 프로젝트 구조

    src
    ├── assets                   # 프로젝트 이미지 및 정적 파일
    ├── components               # 재사용 가능한 Vue 컴포넌트
    │   ├── home                 # 홈 화면 관련 컴포넌트
    │   │   ├── main             # 메인 화면 (인기 영화 관련)
    │   │   │   └── HomePopularComponent.vue
    │   │   ├── wishlist         # 위시리스트 관련
    │   │   │   └── HomeWishlistComponent.vue
    │   │   └── HomeComponent.vue
    │   ├── search               # 검색 기능 관련 컴포넌트
    │   │   └── HomeSearchComponent.vue
    │   ├── sign-in              # 로그인 관련 컴포넌트
    │   │   └── SignInComponent.vue
    ├── layouts                  # 레이아웃 관련 컴포넌트
    │   └── HeaderComponent.vue
    ├── router                   # Vue Router 설정
    ├── store                    # Vuex 상태 관리
    ├── util                     # 유틸리티 클래스 및 서비스
    │   ├── URLService.js        # API URL 생성 및 인기 영화 데이터 관리
    │   └── WishlistService.js   # 위시리스트 관리 서비스
    ├── views                    # 주요 화면 뷰
    │   ├── home-main            # 홈 메인 뷰 컴포넌트
    │   │   ├── BannerComponent.vue
    │   │   └── MovieRowComponent.vue
    │   ├── home-wishlist        # 위시리스트 뷰 컴포넌트
    │   │   └── MovieWishlistComponent.vue
    │   ├── search               # 검색 화면 뷰 컴포넌트
    │   │   └── MovieSearchComponent.vue
    │   └── views                # 그리드 및 무한 스크롤 컴포넌트
    │       ├── MovieGridComponent.vue
    │       └── MovieInfiniteScrollComponent.vue
    ├── App.vue                  # 루트 Vue 컴포넌트
    ├── main.js                  # Vue 초기화 스크립트
