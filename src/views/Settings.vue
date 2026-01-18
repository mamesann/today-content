<script setup>
import { onBeforeMount, computed } from "vue";
import {
  areaData,
  selectAreaName,
  selectedAreaForecast,
  officesList,
} from "../stores/weatherStore";
import { selectConstellation, CONSTELLATION } from "../stores/fortuneStore";

onBeforeMount(() => {
  loadAreaData();
});

/**
 * エリアデータの読み込み
 */
async function loadAreaData() {
  try {
    const response = await fetch(
      "https://www.jma.go.jp/bosai/common/const/area.json"
    );
    areaData.value = await response.json();
    // エリアデータ取得後に初期の天気情報を取得する
    // selectAreaName の初期値（例："愛知県"）に一致するエリアがあれば fetch を行う
    // 初期選択が未指定 or 'none' の場合は officesList の先頭を選ぶ
    try {
      const first =
        (officesAreaList.value &&
          officesAreaList.value[0] &&
          officesAreaList.value[0].name) ||
        null;
      if ((!selectAreaName.value || selectAreaName.value === "none") && first) {
        selectAreaName.value = first;
      }
    } catch (e) {
      // ignore
    }
    await setForecast();
  } catch (error) {
    console.error("エリアデータ取得エラー:", error);
  }
  // console.log("エリアデータ読み込み完了", areaData.value);
}

/**
 * 予報データの設定
 */
// offices を配列として扱うための正規化
const officesAreaList = computed(() => {
  const offices = (areaData.value && areaData.value.offices) || [];
  if (Array.isArray(offices)) {
    officesList.value = offices;
    console.log("offices is array:", offices);
    return offices;
  }
  // offices がオブジェクトの場合は [ { code, ...data } ] の配列を返す
  try {
    const result = Object.entries(offices).map(([code, data]) => ({
      code,
      ...data,
    }));
    officesList.value = result;
    return result;
  } catch (e) {
    return [];
  }
});
</script>

<template>
  <div class="settings-page">
    <h2>設定</h2>
    <p>ここに設定を追加します。</p>
    <select
      id="area-select"
      name="area-select"
      ref="selectRef"
      v-model="selectAreaName"
      size="5"
      @change="changeArea"
    >
      <option value="none" disabled selected>エリアを選択してください</option>
      <option
        v-for="(area, index) in officesAreaList"
        :key="area.code || index"
        :value="area.name"
      >
        {{ area.name }}
      </option>
    </select>

    <select
      v-model="selectConstellation"
      name="constellation"
      id="constellation-select"
      @change="setFortuneData"
    >
      <option value="none" disabled>星座を選択してください</option>
      <option
        v-for="(name, index) in CONSTELLATION"
        :key="index"
        :value="index"
      >
        {{ name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.settings-page {
  padding: 1rem;
}
</style>
