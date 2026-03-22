<script setup>
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { today, loadTodayDetail, todayDetail } from "../stores/commonStore";

/*
 * マウント前
 */
onBeforeMount(() => {
  // loadTodayDetail();
});

/*
 * マウント後
 */
onMounted(() => {

});

const localTodayDetail = computed(() => {
  if (todayDetail.value) {
    return todayDetail.value;
  }
  return {
    gengo: "---",
    wareki: "---",
    week: "---",
    eto: "---",
    rokuyou: "---",
  };
});

const etoImg = computed(() => {
  switch (todayDetail.value?.eto) {
    case "子":
      return "🐭";
    case "丑":
      return "🐮";
    case "寅":
      return "🐯";
    case "卯":
      return "🐰";
    case "辰":
      return "🐲";
    case "巳":
      return "🐍";
    case "午":
      return "🐴";
    case "未":
      return "🐐";
    case "申":
      return "🐒";
    case "酉":
      return "🐓";
    case "戌":
      return "🐕";
    case "亥":
      return "🐖";
  }
  return "";
});

const rokuyouImg = computed(() => {
  switch (todayDetail.value?.rokuyou) {
    case "大安":
      return "🟢";
    case "赤口":
      return "🔴";
    case "先勝":
      return "⚪️";
    case "友引":
      return "🟡";
    case "先負":
      return "⚫️";
    case "仏滅":
      return "💀";
  }
  return "";
});

</script>

<template>
  <div id="detail">
    <h3>詳細</h3>

    <div id="info-detail">
      <span>今日は <span class="value-day">{{ today.year }}年{{ today.month }}月{{ today.day }}日({{ localTodayDetail.week }})</span>です。</span>
      <br>
      <span>元号では <span class="value-day">{{ localTodayDetail.gengo }}{{ localTodayDetail.wareki }}年{{ today.month }}月{{ today.day }}日({{ localTodayDetail.week }})</span>です。</span>
      <br>
      <span>六曜は{{localTodayDetail.rokuyou}}{{ rokuyouImg }}です。</span>
      <br>
      <span>今年は{{localTodayDetail.eto}}年{{ etoImg }}です。</span>
    </div>
  </div>
</template>

<style scoped>
h3 a {
  text-decoration: none;
  color: inherit;
}
#detail h3::before {
  content: "🔍";
}
span.value-day {
  font-weight: bold;
  color: var(--cafe-text);
}
</style>
