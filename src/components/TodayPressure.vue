<script setup>
import { computed } from 'vue'
import { selectedAreaForecast, selectAreaName } from '../stores/weatherStore'
import sadIcon from '../assets/sad.svg'
import happyIcon from '../assets/happy.svg'

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
  <div id="today-pressure">
    <h3><router-link to="/pressure">気圧</router-link></h3>
          <span
        >対象：<span id="area-name">{{ selectAreaName }}</span></span
      >
    <div class="pressure-status">
      <img v-if="pressureImg" :src="pressureImg" alt="アイコン" width="40" height="40" />
      <div class="value">{{ pressureLabel }}</div>
    </div>
  </div>
</template>

<style scoped>
h3 a{
  text-decoration: none;
  color: inherit;
}
#today-pressure h3::before{ content: "🧭"; }
.value{
  color: var(--cafe-text);
}

.pressure-status{
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
