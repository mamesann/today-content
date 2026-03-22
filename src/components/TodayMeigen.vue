<script setup>
import { computed, onBeforeMount, onMounted, ref } from "vue";

onBeforeMount(() => {
  loadTodayMeigen();
});

const meigenResponse = ref({});
const meigenAuther = ref({});

async function loadTodayMeigen() {
  try {
    // 開発中は Vite の proxy を経由して取得する
    // Vite dev proxy 経由で取得する（開発中は /api/... を使う）
    const url = `/api/json.php`;
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response
        .text()
        .catch(() => "(レスポンス本文取得失敗)");
      console.error(`名言API エラー: status=${response.status}`, body);
      return;
    }
    const getJson = await response.json();
    // データ取得後に今日の名言データをセットする
    meigenResponse.value = getJson[0]?.meigen || {};
    meigenAuther.value = getJson[0]?.auther || {};
  } catch (error) {
    console.error("名言データ取得エラー:", error);
  }
}

</script>

<template>
  <div id="today-meigen">
    <!-- <h3><router-link to="/meigen">名言</router-link></h3> -->
    <h3>ランダム名言</h3>
    <div class="meigen-status">
      <p>{{ meigenResponse }}</p>
      <p class="auther">{{ meigenAuther }}</p>
    </div>
  </div>
</template>

<style scoped>
h3 a {
  text-decoration: none;
  color: inherit;
}
#today-fortune h3::before {
  content: "💡";
}
.value {
  color: var(--cafe-text);
}
.auther {
  text-align: right;
  color: var(--cafe-muted, #7a6f6f);
}

</style>
