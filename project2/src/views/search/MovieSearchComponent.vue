<template>
  <div class="dropdown-container">
    <label>선호하는 설정을 선택하세요</label>
    <div
      v-for="dropdown in dropdownEntries"
      :key="dropdown.key"
      class="custom-select"
    >
      <!-- 현재 선택된 옵션 -->
      <div
        class="select-selected"
        @click="toggleDropdown(dropdown.key)"
      >
        {{ selectedOptions[dropdown.key] }}
      </div>

      <!-- 드롭다운 리스트 -->
      <div
        v-if="activeDropdown === dropdown.key"
        class="select-items"
      >
        <div
          v-for="option in dropdown.options"
          :key="option"
          @click="selectOption(dropdown.key, option)"
        >
          {{ option }}
        </div>
      </div>
    </div>

    <!-- 초기화 버튼 -->
    <button class="clear-options" @click="clearOptions">초기화</button>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  name: "MovieSearchComponent",
  emits: ["change-options"],
  setup(_, { emit }) {
    const dropdowns = {
      originalLanguage: ["장르 (전체)", "Action", "Adventure", "Comedy", "Crime", "Family"],
      translationLanguage: [
        "평점 (전체)",
        "9~10",
        "8~9",
        "7~8",
        "6~7",
        "5~6",
        "4~5",
        "4점 이하",
      ],
      sorting: ["언어 (전체)", "영어", "한국어"],
    };

    const DEFAULT_OPTIONS = {
      originalLanguage: "장르 (전체)",
      translationLanguage: "평점 (전체)",
      sorting: "언어 (전체)",
    };

    const selectedOptions = ref({ ...DEFAULT_OPTIONS });
    const activeDropdown = ref(null);

    const dropdownEntries = computed(() =>
      Object.entries(dropdowns).map(([key, options]) => ({
        key,
        options,
      }))
    );

    const toggleDropdown = (key) => {
      activeDropdown.value = activeDropdown.value === key ? null : key;
    };

    const selectOption = (key, option) => {
      selectedOptions.value = {
        ...selectedOptions.value,
        [key]: option,
      };

      emit("change-options", selectedOptions.value);
      activeDropdown.value = null;
    };

    const clearOptions = () => {
      selectedOptions.value = { ...DEFAULT_OPTIONS };
      activeDropdown.value = null;
      emit("change-options", selectedOptions.value);
    };

    return {
      dropdownEntries,
      selectedOptions,
      activeDropdown,
      toggleDropdown,
      selectOption,
      clearOptions,
    };
  },
};
</script>

<style scoped>
.dropdown-container {
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.custom-select {
  min-width: 120px;
  position: relative;
  display: inline-block;
}

.select-selected {
  background-color: black;
  color: white;
  padding: 10px;
  border: 1px solid #fff;
  font-size: 16px;
  cursor: pointer;
}

.select-items {
  display: block;
  position: absolute;
  background-color: #333;
  border: 1px solid #fff;
  z-index: 99;
  top: 100%;
  left: 0;
  right: 0;
}

.select-items div {
  color: white;
  padding: 10px;
  cursor: pointer;
}

.select-items div:hover {
  background-color: #575757;
}

.clear-options {
  min-width: 120px;
  background-color: black;
  color: white;
  padding: 10px;
  border: 1px solid #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-options:hover {
  background-color: #333;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .dropdown-container {
    flex-direction:row;
    align-items: stretch;
  }

  .custom-select {
    min-width: 100%;
    margin-bottom: 10px;
  }

  .select-selected {
    font-size: 14px;
    padding: 8px;
  }

  .select-items div {
    font-size: 14px;
    padding: 8px;
  }

  .clear-options {
    width: 100%;
    font-size: 14px;
    padding: 8px;
  }
}
</style>
