<script setup>
import { computed, onBeforeMount, onMounted, ref } from "vue";
// import { today, loadTodayDetail, todayDetail } from "../stores/commonStore";

/*
 * マウント前
 */
onBeforeMount(async () => {
  try {
    await loadQiitaTags();
    // 読み込み終えてから、アイテムを検索する
    searchItem();
  } catch (e) {
    console.error("Qiitaタグ読み込み失敗", e);
  }
});

/*
 * マウント後
 */
onMounted(() => {
  // https://qiita.com/api/v2/users?page=1
});

/* Qiita API からタグを取得するための関数 */
const page = computed(() => {
  // 1から100までの数値をランダムで返す
  return Math.floor(Math.random() * 100) + 1;
});

const getTags = ref([]);
const targetItem = ref(null);
const getItem = ref({});
const isLoaded = computed(() => {
  return getTags.value.length > 0 && targetItem.value !== null && Object.keys(getItem.value).length > 0;
});

/* 本日の詳細情報読み込み */
async function loadQiitaTags() {
  try {
    // 開発中は Vite の proxy を経由して取得する
    // const url = `https://qiita.com/api/v2/users?page=1`;
    const url = `https://qiita.com/api/v2/tags?page=${page.value}&per_page=100`;
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response
        .text()
        .catch(() => "(レスポンス本文取得失敗)");
      console.error(`Qiitaタグ取得エラー: status=${response.status}`, body);
      return;
    }
    const getJson = await response.json();
    getTags.value = getJson;
  } catch (error) {
    console.error("Qiitaタグ取得エラー:", error);
  }
}

const searchItem = () => {
  if (!getTags.value || getTags.value.length === 0) return;
  const startIndex = Math.floor(Math.random() * getTags.value.length);
  for (let i = 0; startIndex + i < getTags.value.length; i++) {
    const item = getTags.value[startIndex + i];
    if (item && item.items_count > 0) {
      targetItem.value = item;
      loadQiitaItems();
      return;
    }
  }
  const item = getTags.value[startIndex];
  targetItem.value = item;
  loadQiitaItems();
};

async function loadQiitaItems() {
  try {
    // /api/v2/tags/:tag_id/items
    const url = `https://qiita.com/api/v2/tags/${targetItem.value.id}/items`;
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response
        .text()
        .catch(() => "(レスポンス本文取得失敗)");
      console.error(`Qiitaアイテム取得エラー: status=${response.status}`, body);
      return;
    }
    const getItemJson = await response.json();
    getItem.value = getItemJson[0]; // 最初のアイテムを取得
  } catch (error) {
    console.error("Qiitaアイテム取得エラー:", error);
  }
}
</script>

<template>
  <div id="my-qiita" v-if="isLoaded">
    <h3>ランダムQiita</h3>
    <div v-if="targetItem">
        <span class="value-day">タイトル</span>
        <br/>
        <div id="title-name">
          <span class="mutedvalue">{{ getItem.title }}</span>
        </div>
          <span class="value-day">タグ</span>
        <ul>
          <li v-for="tag in getItem.tags" :key="tag.id" class="mutedvalue">
            {{ tag.name }}
          </li>
        </ul>
        <a :href="getItem.url" target="_blank">
          CHECK→
        </a>
    </div>
  </div>
</template>

<style scoped>
h3 a {
  text-decoration: none;
  color: inherit;
}
#my-qiita h3::before {
  content: "🦠";
}
span.value-day {
  color: var(--cafe-text);
}

#title-name {
  color: var(--cafe-text);
  margin-left: 20px;
}

a {
  color: var(--cafe-text);
  font: bold;
}

mutedvalue {
  color: var(--cafe-muted, #7a6f6f);
}

ul>li {
  list-style: disc;
}
</style>
