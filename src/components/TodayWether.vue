<script setup>
import { onBeforeMount, onMounted, computed } from "vue";
import sadIcon from '../assets/icon/pressure-bad.svg'
import happyIcon from '../assets/icon/pressure-good.svg'
import {
  selectedAreaInfo,
  selectedAreaName,
  selectedAreaForecast,
  officesList,
} from "../stores/weatherStore";
import wetherCodes from "../assets/wetherCodes.json";
// https://www.jma.go.jp/bosai/common/const/area.json

// const selectRef = useTemplateRef("selectRef");
const wetherCodesJson = computed(() => {
  return wetherCodes;
});

/*
 * マウント前
 */
onBeforeMount(() => {
  // ローカルストレージから情報取得
  const storedAreaName = localStorage.getItem("selectedAreaName");
  const storedAreaInfo = localStorage.getItem("selectedAreaInfo");
  if (storedAreaName) {
    selectedAreaName.value = storedAreaName;
  }
  if (storedAreaInfo) {
    try {
      selectedAreaInfo.value = JSON.parse(storedAreaInfo);
    } catch (e) {
      console.error("storedAreaInfo のパースエラー:", e);
    }
  }
});

/*
 * マウント後
 */
onMounted(() => {
  getSelectArea();
});

/*
 * 選択エリアの取得
 */
const selectedArea = computed(() => {
  return (
    (officesList.value || []).find((o) => o.name === selectedAreaName.value) ||
    {}
  );
});

/**
 * マウント時に選択エリアを決定して予報を取得するヘルパー
 * 以前の実装で呼び出されていた getSelectArea が欠けていたため、
 * マウントフックで未定義エラーが発生していました。
 */
async function getSelectArea() {
  try {
    // 選択が決まったら予報を取得
    await setForecast();
  } catch (e) {
    console.error("getSelectArea エラー:", e);
  }
}

/*
 * 天気予報の設定
 */
async function setForecast() {
  if (!selectedAreaInfo.value.office) {
    return;
  }
  const url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${selectedAreaInfo.value.office.code}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response
        .text()
        .catch(() => "(レスポンス本文取得失敗)");
      console.error(
        `${selectedAreaInfo.value.name} の天気予報取得に失敗しました。status=${response.status} body=`,
        body,
      );
      selectedAreaForecast.value = null;
      return;
    }
    const data = await response.json();
    selectedAreaForecast.value = data;
    return;
  } catch (error) {
    console.error(
      `${selectedAreaInfo.value.name} の天気予報取得エラー:`,
      error,
    );
  }
  selectedAreaForecast.value = null;
}

/*
 * 天気状態の取得
 */
const weatherStatus = computed(() => {
  if (!selectedAreaForecast.value) {
    return "データなし";
  }
  // ここでselectedAreaForecast.valueを解析して、適切な天気状態を返すロジックを実装
  const nowData = selectedAreaForecast.value[0]; // 最新データ
  const reportDatetime = nowData.reportDatetime; // 予報の取得時間
  const wether = nowData.timeSeries[0]; // 天気
  // const rainProbability = nowData.timeSeries[1];  // 降水確率
  // const temperature = nowData.timeSeries[2];      // 気温

  const timeDefines = wether.timeDefines;
  let areaWether;
  // timerDefinesの要素がreportDatetimeと一致していれば、本日の天気予報
  // 本日の天気予報を探索
  for (let i = 0; i < timeDefines.length; i++) {
    const timeDefine = timeDefines[i];
    if (timeDefine === reportDatetime) {
      areaWether = wether.areas[i];
      // console.log(`index[${i}] が本日の天気予報`, areaWether);
      break;
    }
  }
  const todayWeatherCode = areaWether.weatherCodes[0]; // 今日の天気コード

  // jsonデータから天気コード情報を探索
  let weatherCodeInfo = {};
  for (const jsonKey in wetherCodesJson.value) {
    if (jsonKey === todayWeatherCode) {
      weatherCodeInfo = wetherCodesJson.value[jsonKey];
      break;
    }
  }
  const imgUrl = `https://www.jma.go.jp/bosai/forecast/img/${weatherCodeInfo[1]}`;
  // const todayWeatherText = areaWether.weathers[0];　// このままだと使いにくい
  const todayWeatherText = weatherCodeInfo[3]; // 天気説明文を使用
  return {
    dispName: todayWeatherText ? todayWeatherText : "データなし",
    imgUrl: imgUrl ? imgUrl : "",
  };
});

/*
 * 降水確率の取得
 */
const rainProbability = computed(() => {
  if (!selectedAreaForecast.value) return "";
  const nowData = selectedAreaForecast.value[0];
  if (!nowData || !nowData.timeSeries) return "";
  const popsSeries = nowData.timeSeries[1];
  if (!popsSeries) return "";
  const timeDefines = popsSeries.timeDefines || [];
  const reportDatetime = nowData.reportDatetime;
  let idx = timeDefines.findIndex((td) => td === reportDatetime);
  if (idx === -1) idx = 0;
  const area =
    (popsSeries.areas && (popsSeries.areas[idx] || popsSeries.areas[0])) || {};
  const pops = area.pops || area.probabilities || [];
  const pop = pops && pops[0] !== undefined ? pops[0] : null;
  return pop !== null ? `降水確率: ${pop}%` : "";
});

/**
 * ラベル化ルール（簡易）
 * - 最大降水確率 >= 50% -> 低気圧
 * - 最大降水確率 < 20% -> 高気圧
 * - それ以外 -> 普通
 */
const pressureLabel = computed(() => {
  const data = selectedAreaForecast.value
  if (!data || !Array.isArray(data) || data.length === 0) return 'データなし'
  const nowData = data[0]
  if (!nowData || !nowData.timeSeries) return 'データなし'

  const popsSeries = nowData.timeSeries[1]
  if (!popsSeries || !popsSeries.areas) return 'データなし'

  // 各 area の pops 配列の最大値を求める
  let maxPop = -1
  for (const area of popsSeries.areas) {
    const pops = area.pops || area.probabilities || []
    for (const p of pops) {
      const num = parseInt(p, 10)
      if (!isNaN(num) && num > maxPop) maxPop = num
    }
  }
  if (maxPop === -1) return 'データなし'
  if (maxPop >= 50) return '低気圧'
  if (maxPop < 20) return '高気圧'
  return '普通'
})

/**
 * 気圧ラベルに応じたアイコン取得
 */
const pressureImg = computed(() => {
  const label = pressureLabel.value
  if (label === '低気圧') return sadIcon
  // 普通（その他）は晴れアイコンを使う
  return happyIcon
})
</script>

<template>
  <div id="today-wether">
    <!-- <h3><router-link to="/wether">天気</router-link></h3> -->
    <h3>天気</h3>
    <div id="info-wether">
      <span
        >対象：<span id="area-name">{{ selectedAreaName || "未選択" }}</span></span
      >
      <div class="wether-status">
        <img
          :src="weatherStatus.imgUrl"
          alt=""
          width="40"
          height="40"
        />
        <span class="value">{{
          weatherStatus.dispName ? weatherStatus.dispName : "データなし"
        }}</span>
        <span class="rain-probability">{{ rainProbability }}</span>
      </div>
      <div class="pressure-status">
        <img
          v-if="pressureImg"
          :src="pressureImg"
          alt="アイコン"
          width="40"
          height="40"
        />
        <div class="value">気圧は{{ pressureLabel }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 a {
  text-decoration: none;
  color: inherit;
}
#today-wether h3::before {
  content: "🌤️";
}

.wether-status,
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

</style>
