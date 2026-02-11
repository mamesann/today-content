import { ref } from 'vue'


export const areaData = ref({ offices: [] })
export const selectedAreaName = ref('')
export const selectedAreaInfo = ref({})
export const selectedAreaForecast = ref(null)
export const officesList = ref([])

export default {
  areaData,
  selectedAreaName,
  selectedAreaForecast,
  officesList,
}
