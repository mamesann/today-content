import { ref, computed } from 'vue';
import { today } from "../stores/commonStore";

export const selectConstellation = ref(7);
export const CONSTELLATION = {
  0: '牡羊座',
  1: '牡牛座',
  2: '双子座',
  3: '蟹座',
  4: '獅子座',
  5: '乙女座',
  6: '天秤座',
  7: '蠍座',
  8: '射手座',
  9: '山羊座',
  10: '水瓶座',
  11: '魚座'
};

const fortuneResponse = ref({});
const todayFortuneData = ref(null);

function setFortuneData() {
  try {
    if (!fortuneResponse.value) {
      todayFortuneData.value = null;
      return;
    }
    const dateKey = `${today.value.year}/${String(today.value.month).padStart(2, "0")}/${String(today.value.day).padStart(2, "0")}`;
    const dayData = fortuneResponse.value[dateKey];
    if (!dayData || !dayData[selectConstellation.value]) {
      todayFortuneData.value = null;
      return;
    }
    todayFortuneData.value = dayData[selectConstellation.value];
  } catch (e) {
    console.error("setFortuneData エラー:", e);
    todayFortuneData.value = null;
  }
}

export async function loadTodayFortune() {
  try {
    // 開発中は Vite の proxy を経由して取得する
    const url = `/api/horoscope/free/${today.value.year}/${String(today.value.month).padStart(2, "0")}/${String(today.value.day).padStart(2, "0")}`;
    // console.log('占いAPI 取得 URL (proxy 経由):', url);
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response
        .text()
        .catch(() => "(レスポンス本文取得失敗)");
      console.error(`占いAPI エラー: status=${response.status}`, body);
      return;
    }
    const getJson = await response.json();
    fortuneResponse.value = getJson.horoscope || {};
    // データ取得後に今日の運勢データをセットする
    setFortuneData();
  } catch (error) {
    console.error("占いデータ取得エラー:", error);
  }
}

/**
 * 今日の運勢を取得
 */
export const result = computed(() => {
  if (!todayFortuneData.value) {
    return {
      rank: "?",
      total: "?",
      love: "?",
      money: "?",
      job: "?",
      item: "?",
      color: "?",
      content: "?",
    };
  }
  return {
    rank: todayFortuneData.value.rank ? todayFortuneData.value.rank : "?",
    total: todayFortuneData.value.total ? todayFortuneData.value.total : "?",
    love: todayFortuneData.value.love ? todayFortuneData.value.love : "?",
    money: todayFortuneData.value.money ? todayFortuneData.value.money : "?",
    job: todayFortuneData.value.job ? todayFortuneData.value.job : "?",
    item: todayFortuneData.value.item ? todayFortuneData.value.item : "?",
    color: todayFortuneData.value.color ? todayFortuneData.value.color : "?",
    content: todayFortuneData.value.content
      ? todayFortuneData.value.content
      : "?",
  };
});

export default {
  selectConstellation,
  CONSTELLATION,
  loadTodayFortune,
  result,
};
