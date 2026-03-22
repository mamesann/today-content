<script setup>
import { ref, computed, onMounted } from "vue";

const flowerData = ref(null);
const error = ref(null);

const today = computed(() => {
  const d = new Date();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  // API expects MMDD concatenated with zero padding (e.g., Nov 26 -> 1126, Jan 12 -> 0112)
  return `${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
});

async function loadFlower(mmdd) {
  // try {
  // Build URL using the current page origin so we hit the same host/port the
  // browser is connected to (avoids mismatches when Vite picks a different port).

  const url = `/api/flower/v3/birthflower/${mmdd}`;
  // const url = '/api/whatistoday/v3/birthflower/' + mmdd;
    console.log(' 花情報 取得 URL (proxy 経由):', url);
  try {
    const response = await fetch(url);
    console.log("Fetch response:", response);
    // if (!response.ok) {
    //   const body = await response
    //     .text()
    //     .catch(() => "(レスポンス本文取得失敗)");
    //   console.error(
    //     `花情報取得に失敗しました。status=${response.status} body=`,
    //     body,
    //   );
    //   return;
    // }
    // // const data = await response.json();
    // const data = await response.text();
    // console.log("花データ取得成功:", response);
    // console.log("data:", data);
    return;
  } catch (error) {
    console.error(`花情報取得エラー:`, error);
  }

  // console.log('loadFlower mmdd:', mmdd)
  // // const origin = (typeof window !== undefined && window.location && window.location.origin) ? window.location.origin : ''
  // // console.log('Determined origin:', origin)
  // const url = `https://api.whatistoday.cyou/index.cgi/v3/birthflower/${mmdd}`
  // // https://api.whatistoday.cyou/index.cgi/v3/birthflower/1126
  // console.log('Fetching from URL:', url)
  // const res = await fetch(url);
  // console.log('Fetch response:', res)
  // const json = res.json();
  // console.log("json:", json);

  // const json = await res.json();
  // console.log('[res :', res, 'origin:', origin )
  // flowerData.value = json
  //   let res
  //   try {
  //     res = await fetch(url)
  //     console.log(res)
  //   } catch (networkErr) {
  //     // ネットワーク層の失敗（CORS / ネットワーク断など）
  //     console.error('[TodayFlower] fetch failed (network):', networkErr)
  //     throw networkErr
  //   }
  //   console.log('[TodayFlower] fetch response status:', res.status)
  //   if (!res.ok) {
  //     const body = await res.text().catch(() => '(レスポンス本文取得失敗)')
  //     throw new Error(`status=${res.status} body=${body}`)
  //   }
  //   const json = await res.json()
  //   console.log('[TodayFlower] response JSON:', json)
  //   flowerData.value = json
  // } catch (e) {
  //   console.error('birthflower 取得エラー:', e)
  //   error.value = e.message || String(e)
  //   flowerData.value = null
  // }
}

onMounted(() => {
  loadFlower(today.value);
});
</script>

<template>
  <div id="today-flower">
    <h3>誕生花</h3>
    <!-- <div v-if="error" class="error">取得エラー: {{ error }}</div>
    <div v-else-if="!flowerData">読み込み中...</div> -->
    <!-- <div class="flower-card">
      <div class="name">{{ flowerData.flower || flowerData.name || '不明' }}</div>
      <div class="meta">id: {{ flowerData.id }} / mmdd: {{ flowerData.mmdd }}</div>
      <div class="lang">言語: {{ flowerData.lang }}</div>
    </div> -->
  </div>
</template>

<style scoped>
#today-flower h3::before {
  content: "💐";
}
.flower-card {
  background: var(--cafe-paper);
  padding: 0.6rem;
  border-radius: 8px;
  box-shadow: var(--cafe-shadow);
}
.name {
  font-weight: 700;
  font-size: 1.05rem;
}
.meta {
  font-size: 0.8rem;
  color: var(--cafe-muted);
}
.error {
  color: #c33;
}
</style>
