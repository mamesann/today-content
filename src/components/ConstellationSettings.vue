<script setup>
import { ref } from "vue";
import { selectConstellation, CONSTELLATION } from "../stores/fortuneStore";

const selectedConstellationName = ref("");

function changeConstellations() {}

const constellationSave = () => {
  if (!selectedConstellationName.value) {
    alert("星座を選択してください。");
    return;
  }
  const result = window.confirm("以下で星座を設定します。\n\n" + CONSTELLATION[selectedConstellationName.value]);
  if (result) {
    selectConstellation.value = selectedConstellationName.value;
    alert("星座設定が保存されました。");
    localStorage.setItem("selectedConstellation", selectedConstellationName.value);
    selectedConstellationName.value = "";
  }
};

const constellationClear = () => {
  selectedConstellationName.value = "";
};
</script>

<template>
  <fieldset class="constellation-settings">
    <legend>星座設定</legend>
    <p class="area-desc">表示する星座を選択してください。</p>
    <p>現在の設定値：{{ CONSTELLATION[selectConstellation] || "未設定" }}</p>

    <div class="field">
      <label for="constellation-select">星座</label>
      <select id="constellation-select" name="constellation-select" v-model="selectedConstellationName" @change="changeConstellations">
        <option value="" disabled>星座を選択してください</option>
        <option v-for="(constellation, index) in CONSTELLATION" :key="constellation || index" :value="index">
          {{ constellation }}
        </option>
      </select>
    </div>

    <div class="field button-field">
      <button type="button" id="constellation-settings-clear" class="area-setting-button" :disabled="!selectedConstellationName" @click="constellationClear">クリア</button>
      <button type="button" id="constellation-settings-save" class="area-setting-button" :disabled="!selectedConstellationName" @click="constellationSave">保存</button>
    </div>
  </fieldset>
</template>

<style scoped>
.constellation-settings {
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.95));
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 8px 22px rgba(33,23,19,0.06);
  padding: 1rem 1.2rem;
  border-radius: 12px;
  max-width: 780px;
  margin-top: 0.8rem;
}

.constellation-settings legend {
  font-weight: 700;
  font-size: 1.02rem;
  padding: 0 0.25rem;
}

.area-desc {
  color: var(--cafe-muted);
  font-size: 0.9rem;
  margin: 0 0 0.75rem 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.field label {
  font-size: 0.85rem;
  color: var(--cafe-text);
}

.field select {
  padding: 0.5rem 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.12);
  background: #ffffff;
  min-width: 240px;
  transition: box-shadow .12s ease, border-color .12s ease;
}

.field select:focus {
  outline: none;
  box-shadow: 0 8px 20px rgba(115,103,255,0.08);
  border-color: rgba(115,103,255,0.6);
}

.field select:disabled {
  opacity: 0.6;
}

.area-setting-button {
  width: 140px;
  padding: 0.55rem 0.9rem;
  background-color: var(--cafe-primary, #7367ff);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color .12s ease;
}

.area-setting-button:hover {
  background-color: var(--cafe-primary-dark, #5a4dff);
}

.area-setting-button:active {
  background-color: var(--cafe-primary-dark, #261e94);
}

.area-setting-button:disabled {
  cursor: not-allowed;
  background-color: var(--cafe-primary-dark, #a0a0a0);
}

.button-field {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
}

@media (max-width: 640px) {
  .constellation-settings {
    padding: 0.8rem;
    border-radius: 8px;
  }
  .field select {
    min-width: 100%;
  }
}
</style>
