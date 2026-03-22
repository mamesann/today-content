import { computed, ref, watch } from 'vue';

export const today = computed(() => {
  return {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };
});
export const todayDetail = ref(null);

/* 本日の詳細情報読み込み */
export async function loadTodayDetail() {
  try {
    // 開発中は Vite の proxy を経由して取得する
    const url = `https://koyomi.zingsystem.com/api/?mode=d&cnt=1&targetyyyy=${today.value.year}&targetmm=${String(today.value.month).padStart(2, "0")}&targetdd=${String(today.value.day).padStart(2, "0")}`;
    // console.log('占いAPI 取得 URL (proxy 経由):', url);
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response
        .text()
        .catch(() => "(レスポンス本文取得失敗)");
      console.error(`今日の情報取得エラー: status=${response.status}`, body);
      return;
    }
    const todatObjKey = `${today.value.year}-${String(today.value.month).padStart(2, "0")}-${String(today.value.day).padStart(2, "0")}`;
    const getJson = await response.json();
    todayDetail.value = getJson.datelist[todatObjKey] || {};
  } catch (error) {
    console.error("今日の情報取得エラー:", error);
  }
}

export default {
  today,
  loadTodayDetail,
  todayDetail,
};

// 表示設定（DisplaySettings と TodayContent で共有）
export const displayItems = ref({
  weather: {
    name: "天気",
    value: "weather",
    index: 0,
    checked: true,
    display: true,
  },
  fortune: {
    name: "占い",
    value: "fortune",
    index: 1,
    checked: true,
    display: true,
  },
  meigen: {
    name: "ランダム名言",
    value: "meigen",
    index: 2,
    checked: true,
    display: true,
  },
  yoga: { name: "ヨガ", value: "yoga", index: 3, checked: true, display: true },
  qiita: {
    name: "ランダムQiita",
    value: "qiita",
    index: 4,
    checked: true,
    display: true,
  },
  todayDetail: {
    name: "今日の詳細",
    value: "todayDetail",
    index: 5,
    checked: true,
    display: true,
  },
});

export const sortedDisplayItems = computed(() => {
  return Object.values(displayItems.value).sort((a, b) => a.index - b.index);
});

// localStorage に保存・読み込み
const STORAGE_KEY = 'displayItems';
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    // マージではなく、保存されている定義を優先して反映
    displayItems.value = parsed;
  }
} catch (e) {
  console.error('displayItems localStorage load error:', e);
}

watch(
  displayItems,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch (e) {
      console.error('displayItems localStorage save error:', e);
    }
  },
  { deep: true }
);
