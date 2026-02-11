<!--
<template>
  <div class="fortune-page">
    <h2>占い</h2>
    <p>ここに占いの情報を表示します（設定ページと同じような簡易レイアウト）。</p>
  </div>
</template>

<script setup>

</script>

<style scoped>
.fortune-page{
  padding: 1rem;
}
</style>
-->
<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { selectConstellation, CONSTELLATION } from '../stores/fortuneStore'

// https://jugemkey.jp/api/waf/api_free.php

const fortuneResponse = ref({});

// const selectConstellation = ref(7);
const todayFortuneData = ref(null);

const today = computed(() => {
  return {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };
});

onBeforeMount(() => {
  loadTodayFortune();
});

// onMounted を使って先に setFortuneData を呼ぶと、fetch が完了しておらず
// `fortuneResponse` がまだ空のため期待通りに動かないことがあります。
// そのため fetch 成功後に明示的に setFortuneData() を呼ぶようにします。

async function loadTodayFortune() {
  try {
  // 開発中は Vite の proxy を経由して取得する
  const url = `/api/horoscope/free/${today.value.year}/${String(today.value.month).padStart(2, '0')}/${String(today.value.day).padStart(2, '0')}`;
    // console.log('占いAPI 取得 URL (proxy 経由):', url);
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response.text().catch(() => '(レスポンス本文取得失敗)');
      console.error(`占いAPI エラー: status=${response.status}`, body);
      return;
    }
  const getJson = await response.json();
  fortuneResponse.value = getJson.horoscope || {};
  // console.log('占いデータ取得成功:', fortuneResponse.value);
  // データ取得後に今日の運勢データをセットする
  setFortuneData();

  } catch (error) {
    console.error("占いデータ取得エラー:", error);
  }
};

/**
 * 今日の運勢を取得
 */
const result = computed(() => {
  if(!todayFortuneData.value) {
    return {
      rank: "?",
      total: "?",
      love: "?",
      money: "?",
      job: "?",
      item: "?",
      color: "?",
      content: "?",
    }
  }
  return {
    rank: todayFortuneData.value.rank ? todayFortuneData.value.rank : "?",
    total: todayFortuneData.value.total ? todayFortuneData.value.total : "?",
    love: todayFortuneData.value.love ? todayFortuneData.value.love : "?",
    money: todayFortuneData.value.money ? todayFortuneData.value.money : "?",
    job: todayFortuneData.value.job ? todayFortuneData.value.job : "?",
    item: todayFortuneData.value.item ? todayFortuneData.value.item : "?",
    color: todayFortuneData.value.color ? todayFortuneData.value.color : "?",
    content: todayFortuneData.value.content ? todayFortuneData.value.content : "?",
  }
});

function setFortuneData() {
  try {
    if (!fortuneResponse.value) {
      todayFortuneData.value = null;
      return;
    }
    const dateKey = `${today.value.year}/${String(today.value.month).padStart(2, '0')}/${String(today.value.day).padStart(2, '0')}`;
    const dayData = fortuneResponse.value[dateKey];
    if (!dayData || !dayData[selectConstellation.value]) {
      todayFortuneData.value = null;
      return;
    }
    todayFortuneData.value = dayData[selectConstellation.value];
  } catch (e) {
    console.error('setFortuneData エラー:', e);
    todayFortuneData.value = null;
  }
}

</script>

<template>
  <div id="today-fortune">
    <h3><router-link to="/fortune">占い</router-link></h3>
    <p>星座：{{ CONSTELLATION[selectConstellation] }}</p>
    <div class="fortune-status">
      <ol>
        <li>順位：{{ result.rank }}</li>
        <li>総合運：{{ result.total }}/5</li>
        <li>恋愛運：{{ result.love }}/5</li>
        <li>金運：{{ result.money }}/5</li>
        <li>仕事運：{{ result.job }}/5</li>
        <li>幸運アイテム：{{ result.item }}</li>
        <li>色：{{ result.color }}</li>
        <li>今日の運勢：{{ result.content }}</li>
      </ol>
    </div>
    <!-- <select v-model="selectConstellation" name="constellation" id="constellation-select" @change="setFortuneData">
      <option value="none" disabled>星座を選択してください</option>
      <option v-for="(name, index) in CONSTELLATION" :key="index" :value="index">{{ name }}</option>
    </select> -->
  </div>
</template>

<style scoped>
h3 a{
  text-decoration: none;
  color: inherit;
}
#today-fortune h3::before{ content: "🔮"; }
.value{
  color: var(--cafe-text);
}

.pressure-status{
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
