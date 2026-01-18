<script setup>
import { useTemplateRef, ref, onBeforeMount, onMounted, computed } from "vue";
import TodayWether from "./TodayWether.vue";
// import { areaData, selectAreaName, selectedAreaForecast } from "../stores/weatherStore";
import { selectAreaName, selectedAreaForecast, officesList } from "../stores/weatherStore";
import wetherCodes from "../assets/wetherCodes.json";
// https://www.jma.go.jp/bosai/common/const/area.json

// const selectRef = useTemplateRef("selectRef");
const wetherCodesJson = computed(() => {
  return wetherCodes;
});
// areaData, selectAreaName, selectedAreaForecast are provided by shared store

// offices を配列として扱うための正規化
// const officesList = computed(() => {
//   const offices = (areaData.value && areaData.value.offices) || [];
//   if (Array.isArray(offices)) return offices;
//   // offices がオブジェクトの場合は [ { code, ...data } ] の配列を返す
//   try {
//     return Object.entries(offices).map(([code, data]) => ({ code, ...data }));
//   } catch (e) {
//     return [];
//   }
// });

/*
 * マウント前
 */
// onBeforeMount(() => {
//   loadAreaData();
// });

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
  return (officesList.value || []).find((o) => o.name === selectAreaName.value) || {};
});

/**
 * マウント時に選択エリアを決定して予報を取得するヘルパー
 * 以前の実装で呼び出されていた getSelectArea が欠けていたため、
 * マウントフックで未定義エラーが発生していました。
 */
async function getSelectArea() {
  try {
    const first = (officesList.value && officesList.value[0] && officesList.value[0].name) || null;
    if ((!selectAreaName.value || selectAreaName.value === 'none') && first) {
      selectAreaName.value = first;
    }
    // 選択が決まったら予報を取得
    await setForecast();
  } catch (e) {
    console.error('getSelectArea エラー:', e);
  }
}

/*
 * 天気予報の設定
 */
async function setForecast() {
  // officesList が空の場合は area.json を読み込んで初期化する
  if (!officesList.value || officesList.value.length === 0) {
    try {
      const resp = await fetch("https://www.jma.go.jp/bosai/common/const/area.json");
      if (resp.ok) {
        const areaJson = await resp.json();
        const offices = (areaJson && areaJson.offices) || [];
        if (Array.isArray(offices)) {
          officesList.value = offices;
        } else {
          // オブジェクトの場合は配列に変換
          officesList.value = Object.entries(offices || {}).map(([code, data]) => ({ code, ...data }));
        }
        // selectAreaName が未設定なら先頭を選択
        try {
          const first = (officesList.value && officesList.value[0] && officesList.value[0].name) || null;
          if ((!selectAreaName.value || selectAreaName.value === 'none') && first) {
            selectAreaName.value = first;
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      console.error('area.json 読込エラー:', e);
    }
  }

  const officeCode = selectedArea.value && selectedArea.value.code;
  const officeName = selectedArea.value && selectedArea.value.name;
  if (!officeCode) {
    console.warn("オフィスコードが見つかりません。setForecast をスキップします。selectedArea=", selectedArea.value);
    selectedAreaForecast.value = null;
    return;
  }
  const url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${officeCode}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response.text().catch(() => "(レスポンス本文取得失敗)");
      console.error(`${officeName} の天気予報取得に失敗しました。status=${response.status} body=`, body);
      selectedAreaForecast.value = null;
      return;
    }
    const data = await response.json();
    selectedAreaForecast.value = data;
    return;
  } catch (error) {
    console.error(`${officeName} の天気予報取得エラー:`, error);
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
  const nowData = selectedAreaForecast.value[0];  // 最新データ
  const reportDatetime = nowData.reportDatetime;  // 予報の取得時間
  const wether = nowData.timeSeries[0];           // 天気
  // const rainProbability = nowData.timeSeries[1];  // 降水確率
  // const temperature = nowData.timeSeries[2];      // 気温

  const timeDefines = wether.timeDefines;
  let areaWether;
  // timerDefinesの要素がreportDatetimeと一致していれば、本日の天気予報
  // 本日の天気予報を探索
  for(let i = 0; i < timeDefines.length; i++) {
    const timeDefine = timeDefines[i];
    if(timeDefine === reportDatetime) {
      areaWether = wether.areas[i];
      // console.log(`index[${i}] が本日の天気予報`, areaWether);
      break;
    }
  }
  const todayWeatherCode = areaWether.weatherCodes[0];            // 今日の天気コード

  // jsonデータから天気コード情報を探索
  let weatherCodeInfo = {};
  for(const jsonKey in wetherCodesJson.value) {
    if(jsonKey === todayWeatherCode) {
      weatherCodeInfo = wetherCodesJson.value[jsonKey];
      break;
    }
  }
  const imgUrl = `https://www.jma.go.jp/bosai/forecast/img/${weatherCodeInfo[1]}`;
  // const todayWeatherText = areaWether.weathers[0];　// このままだと使いにくい
  const todayWeatherText = weatherCodeInfo[3];  // 天気説明文を使用
  return {
    dispName: todayWeatherText ? todayWeatherText : "データなし",
    imgUrl: imgUrl ? imgUrl : "",
  }
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
  const area = (popsSeries.areas && (popsSeries.areas[idx] || popsSeries.areas[0])) || {};
  const pops = area.pops || area.probabilities || [];
  const pop = (pops && pops[0] !== undefined) ? pops[0] : null;
  return pop !== null ? `降水確率: ${pop}%` : "";
});

// /**
//  * エリアデータの読み込み
//  */
// async function loadAreaData() {
//   try {
//     const response = await fetch(
//       "https://www.jma.go.jp/bosai/common/const/area.json"
//     );
//     areaData.value = await response.json();
//     // エリアデータ取得後に初期の天気情報を取得する
//     // selectAreaName の初期値（例："愛知県"）に一致するエリアがあれば fetch を行う
//     // 初期選択が未指定 or 'none' の場合は officesList の先頭を選ぶ
//     try {
//       const first = (officesList.value && officesList.value[0] && officesList.value[0].name) || null;
//       if ((!selectAreaName.value || selectAreaName.value === 'none') && first) {
//         selectAreaName.value = first;
//       }
//     } catch (e) {
//       // ignore
//     }
//     await setForecast();
//   } catch (error) {
//     console.error("エリアデータ取得エラー:", error);
//   }
//   // console.log("エリアデータ読み込み完了", areaData.value);
// }

</script>

<template>
  <div id="today-wether">
    <h3><router-link to="/wether">天気</router-link></h3>
    <!-- {{ selectedAreaForecast }} -->
    <div id="info-wether">
      <span
        >対象：<span id="area-name">{{ selectAreaName }}</span></span
      >
      <div class="wether-status">
        <img
          :src="weatherStatus.imgUrl"
          alt="アイコン"
          width="40"
          height="40"
        />
        <span class="value">{{ weatherStatus.dispName ? weatherStatus.dispName : "データなし"  }}</span>
        <span class="rain-probability">{{ rainProbability }}</span>
      </div>
    </div>
    <!-- <select
      id="area-select"
      name="area-select"
      ref="selectRef"
      v-model="selectAreaName"
      size="5"
      @change="setForecast"
    >
      <option value="none" disabled selected>エリアを選択してください</option>
      <option
        v-for="(area, index) in officesList"
        :key="area.code || index"
        :value="area.name"
      >
        {{ area.name }}
      </option>
    </select> -->
  </div>
</template>

<style scoped>
h3 a{
  text-decoration: none;
  color: inherit;
}
#today-wether h3::before {
  content: "🌤️";
}

.wether-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rain-probability{
  color: var(--cafe-muted, #7a6f6f);
  font-size: 0.9rem;
  margin-left: 0.25rem;
}
</style>
