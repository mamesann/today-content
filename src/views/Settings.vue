<script setup>
import { onBeforeMount, computed, ref } from "vue";
import { areaData, selectedAreaForecast, officesList, selectedAreaName, selectedAreaInfo } from "../stores/weatherStore";
import { selectConstellation, CONSTELLATION } from "../stores/fortuneStore";
import AreaSettings from "../components/AreaSettings.vue";
import ConstellationSettings from "../components/ConstellationSettings.vue";
import DisplaySettings from "../components/DisplaySettings.vue";

const loadError = ref("");
const areaSaveBtn = ref(null);

</script>

<template>
  <div class="settings-page">
    <h2>設定</h2>
    <AreaSettings />
    <ConstellationSettings />
    <DisplaySettings />
  </div>
</template>

<style scoped>
.settings-page {
  padding: 8px;
  height: calc(100vh - 48px - 16px);
  overflow: auto;
}
</style>
