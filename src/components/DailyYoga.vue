<script setup>
import { onBeforeMount, onMounted, ref } from "vue";

const yogaMovies = {
  morning: [
    {
      title: "朝のヨガ",
      time: "10分",
      url: "https://www.youtube.com/embed/1Z3SifFe4RM?si=rcRzuxuDXdRMl7ae",
    },
    {
      title: "朝のストレッチヨガ",
      time: "15分",
      url: "https://www.youtube.com/embed/CddjNFlEn4Y?si=e6xWhRLUzmE_5htu",
    },
  ],
  evening: [
    {
      title: "寝る前のヨガ",
      time: "15分",
      url: "https://www.youtube.com/embed/fJJrJ2dd1U4?si=m6A0NGXgvB_Ddo3J",
    },
    {
      title: "寝たままストレッチヨガ",
      time: "20分",
      url: "https://www.youtube.com/embed/3Onj5J0gBBY?si=xsURU5mR78E6W7r3",
    },
    {
      title: "夜の腸活ヨガ",
      time: "30分",
      url: "https://www.youtube.com/embed/wtX9c4vlkMs?si=nMYG6Y0bUxrdkfDn",
    },
  ],
  power: [
    {
      title: "最高のフローヨガ",
      time: "12分",
      url: "https://www.youtube.com/embed/V9wT2bDe_wc?si=0jMIn_-hva0nI_zv",
    },
    {
      title: "全身のフローヨガ",
      time: "20分",
      url: "https://www.youtube.com/embed/szQ2ujCZW1Y?si=w-KQxKOTQvFNY-6k",
    },
  ],
  shoulder: [
    {
      title: "肩甲骨ストレッチ",
      time: "10分",
      url: "https://www.youtube.com/embed/A22Qhp6APt8?si=BuR7Nh3lf5SFCgkW",
    },
  ],
  leg: [
    {
      title: "脚やせストレッチ",
      time: "10分",
      url: "https://www.youtube.com/embed/m1v_4uXIYcs?si=H4Pqs8DLIINuPQ3w",
    },
  ],
  yin: [
    {
      title: "女性ホルモンを高める陰ヨガ",
      time: "25分",
      url: "https://www.youtube.com/embed/ULn_6OHvwLQ?si=xahGxiLyy6l8mIdK",
    },
    {
      title: "寝る前の陰ヨガ",
      time: "30分",
      url: "https://www.youtube.com/embed/uJ5OjJgqjOY?si=xDRDnJ9Rls-W8WZ2",
    },
  ],
  autonomicNervous: [
    {
      title: "不調改善ヨガ",
      time: "5分",
      url: "https://www.youtube.com/embed/8FX9ZwDvf_0?si=KlMdQN-THHdf_6Wt",
    },
    {
      title: "自律神経を整える全身ストレッチ",
      time: "10分",
      url: "https://www.youtube.com/embed/TL4Jb7d4zFU?si=2QmpBrSGz0rbHO_h",
    },
  ],
};

/*
 * マウント前
 */
onBeforeMount(() => {});

/*
 * マウント後
 */
onMounted(() => {
  getIframeSize();
  window.addEventListener("resize", getIframeSize);
});

const getIframeSize = () => {
  iframeSize.value.width = todayYogaAreaRef.value.clientWidth;
  iframeSize.value.height = todayYogaAreaRef.value.clientWidth / 2 - 16;
};

const selectedKind = ref("morning");
const todayYogaAreaRef = ref(null);
const iframeSize = ref({ width: 0, height: 0 });
</script>

<template>
  <div id="today-yoga" ref="todayYogaAreaRef">
    <!-- <h3><router-link to="/yoga">ヨガ</router-link></h3> -->
    <h3>ヨガ</h3>
    <div id="info-yoga">
      <select name="yoga-type" id="yoga-type" v-model="selectedKind">
        <option value="morning">morning 🌞</option>
        <option value="evening">evening 🌙</option>
        <option value="power">power 💪</option>
        <option value="shoulder">shoulder 🦴</option>
        <option value="leg">leg 🦵</option>
        <option value="yin">yin 🌸</option>
        <option value="autonomicNervous">autonomicNervous 🧠</option>
      </select>
      <div id="yoga-movies">
        <div
          class="yoga-movie"
          v-for="movie in yogaMovies[selectedKind]"
          :key="movie.title"
        >
          <p>◎{{ movie.title }} ({{ movie.time }})</p>
          <iframe
            :width="iframeSize.width"
            :height="iframeSize.height"
            :src="movie.url"
            title="YouTube video player"
            frameborder="0"
            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture;
              web-share;
            "
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 a {
  text-decoration: none;
  color: inherit;
}
#today-yoga h3::before {
  content: "🧘";
}

.yoga-status,
.pressure-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rain-probability {
  color: var(--cafe-muted, #7a6f6f);
  font-size: 0.9rem;
  margin-left: 0.25rem;
}

#info-yoga select {
  padding: 0.5rem 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #ffffff;
  max-width: 100%;
  width: 100%;
  min-width: 120px;
  transition:
    box-shadow 0.12s ease,
    border-color 0.12s ease;
}

#info-yoga select:focus {
  outline: none;
  box-shadow: 0 8px 20px rgba(115, 103, 255, 0.08);
  border-color: rgba(115, 103, 255, 0.6);
}

.yoga-movie p {
  margin: 0 0 8px;
}

#yoga-movies {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(v-bind('iframeSize.height') * 2 + 16px);
  max-height: calc(v-bind('iframeSize.height') * 2 + 16px);
  overflow-y: auto;
}
</style>
