import { ref } from 'vue'

// 共有ストア（簡易）
export const areaData = ref({ offices: [] })
export const selectAreaName = ref('愛知県')
export const selectedAreaForecast = ref(null)
export const officesList = ref([])
// 今後必要ならここに setter やヘルパーを追加

export default {
  areaData,
  selectAreaName,
  selectedAreaForecast,
  officesList,
}
