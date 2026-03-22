<script setup>
import { onBeforeMount, computed, ref } from "vue";
import { areaData, selectedAreaName, selectedAreaInfo } from "../stores/weatherStore";

const loadError = ref("");
const isSupport = ref(false); // クラス10/15/20のサポート判定

onBeforeMount(() => {
  loadAreaData();
});

const selectCenters = ref("");
const selectOffices = ref("");
const selectClass10 = ref("");
const selectClass15 = ref("");
const selectClass20 = ref("");

const centers = computed(() => {
  if (!areaData.value) return [];
  const c = areaData.value.centers || [];
  if (Array.isArray(c)) {
    return c.map((item, idx) => (item.code ? item : { code: item.code || String(idx), ...item }));
  }
  return Object.entries(c).map(([code, data]) => ({ code, ...data }));
});

const offices = computed(() => {
  const o = (areaData.value && areaData.value.offices) || {};
  if (Array.isArray(o)) {
    return o.map((item, idx) => (item.code ? item : { code: item.code || String(idx), ...item }));
  }
  const map = {};
  Object.entries(o).forEach(([code, data]) => {
    map[code] = { code, ...data };
  });
  return map;
});

const class10s = computed(() => {
  const o = (areaData.value && areaData.value.class10s) || {};
  const map = {};
  if (Array.isArray(o)) {
    o.forEach((item, idx) => {
      const code = item.code || String(idx);
      map[code] = { code, ...item };
    });
    return map;
  }
  Object.entries(o).forEach(([code, data]) => {
    map[code] = { code, ...data };
  });
  return map;
});

const class15s = computed(() => {
  const o = (areaData.value && areaData.value.class15s) || {};
  const map = {};
  if (Array.isArray(o)) {
    o.forEach((item, idx) => {
      const code = item.code || String(idx);
      map[code] = { code, ...item };
    });
    return map;
  }
  Object.entries(o).forEach(([code, data]) => {
    map[code] = { code, ...data };
  });
  return map;
});

const class20s = computed(() => {
  const o = (areaData.value && areaData.value.class20s) || {};
  const map = {};
  if (Array.isArray(o)) {
    o.forEach((item, idx) => {
      const code = item.code || String(idx);
      map[code] = { code, ...item };
    });
    return map;
  }
  Object.entries(o).forEach(([code, data]) => {
    map[code] = { code, ...data };
  });
  return map;
});

const targetOffices = computed(() => {
  if (!selectCenters.value) return [];
  const selected = centers.value.find((c) => c.code === selectCenters.value.code);
  if (!selected) return [];
  const children = selected.children;
  if (!children || !Array.isArray(children)) return [];
  return children.map((code) => offices.value[code]).filter(Boolean);
});

const targetClass10s = computed(() => {
  if (!selectOffices.value) return [];
  const selectedOffice = offices.value[selectOffices.value.code];
  if (!selectedOffice) return [];
  const children = selectedOffice.children;
  if (!children || !Array.isArray(children)) return [];
  return children.map((code) => class10s.value[code]).filter(Boolean);
});

const targetClass15s = computed(() => {
  if (!selectClass10.value) return [];
  const selectedClass10 = class10s.value[selectClass10.value.code];
  if (!selectedClass10) return [];
  const children = selectedClass10.children;
  if (!children || !Array.isArray(children)) return [];
  return children.map((code) => class15s.value[code]).filter(Boolean);
});

const targetClass20s = computed(() => {
  if (!selectClass15.value) return [];
  const selectedClass15 = class15s.value[selectClass15.value.code];
  if (!selectedClass15) return [];
  const children = selectedClass15.children;
  if (!children || !Array.isArray(children)) return [];
  return children.map((code) => class20s.value[code]).filter(Boolean);
});

const getSelectedAreaName = (code) => {
  const center = centers.value.find((c) => c.code === code);
  if (center) return center.name;
  const office = Object.values(offices.value).find((o) => o.code === code);
  if (office) return office.name;
  const class10 = Object.values(class10s.value).find((c) => c.code === code);
  if (class10) return class10.name;
  const class15 = Object.values(class15s.value).find((c) => c.code === code);
  if (class15) return class15.name;
  const class20 = Object.values(class20s.value).find((c) => c.code === code);
  if (class20) return class20.name;
};

async function loadAreaData() {
  try {
    loadError.value = "";
    const response = await fetch("https://www.jma.go.jp/bosai/common/const/area.json");
    areaData.value = await response.json();
  } catch (error) {
    console.error("エリアデータ取得エラー:", error);
    loadError.value = String(error || "fetch error");
  }
}

function changeCenters() {}
function changeOffices() {}
function changeClass10() {}
function changeClass15() {}
function changeClass20() {}

function areaSave() {
  if(!selectCenters.value || !selectOffices.value)
  {
      alert("センターとオフィスを選択してください。");
      return;
  }
  let areaNames = "";
  let areaInfo = {};
  if(selectCenters.value) {
    areaNames = getSelectedAreaName(selectCenters.value.code);
    areaInfo.center = selectCenters.value;
  }
  if (selectOffices.value) {
    areaNames += " " + getSelectedAreaName(selectOffices.value.code);
    areaInfo.office = selectOffices.value;
  }
  if (selectClass10.value) {
    areaNames += " " + getSelectedAreaName(selectClass10.value.code);
    areaInfo.class10 = selectClass10.value;
  }
  if (selectClass15.value) {
    areaNames += " " + getSelectedAreaName(selectClass15.value.code);
    areaInfo.class15 = selectClass15.value;
  }
  if (selectClass20.value) {
    areaNames += " " + getSelectedAreaName(selectClass20.value.code);
    areaInfo.class20 = selectClass20.value;
  }
  const result = window.confirm("以下でエリアを設定します。\n\n" + areaNames);
  if (result) {
    selectedAreaName.value = areaNames;
    selectedAreaInfo.value = areaInfo;
    localStorage.setItem("selectedAreaName", areaNames);
    localStorage.setItem("selectedAreaInfo", JSON.stringify(areaInfo));
    alert("エリア設定が保存されました。");
    selectCenters.value = "";
    selectOffices.value = "";
  }
}

function clearSelections() {
  selectCenters.value = "";
  selectOffices.value = "";
  selectClass10.value = "";
  selectClass15.value = "";
  selectClass20.value = "";
}
</script>

<template>
  <fieldset class="area-settings">
    <legend>エリア設定</legend>
    <p class="area-desc">表示する地域を選択してください。</p>
    <p>現在の設定値：{{ selectedAreaName || "未設定" }}</p>

    <div class="field">
      <label for="area-select">センター</label>
      <select id="area-select" name="area-select" v-model="selectCenters" @change="changeCenters">
        <option value="" disabled>エリアを選択してください</option>
        <option v-for="(center, index) in centers" :key="center.code || index" :value="center">
          {{ center.name }}
        </option>
      </select>
    </div>

    <div class="field">
      <label for="office-select">オフィス</label>
      <select id="office-select" name="office-select" v-model="selectOffices" @change="changeOffices" :disabled="targetOffices.length===0">
        <option value="" disabled>オフィスを選択してください</option>
        <option v-for="(office, index) in targetOffices" :key="office.code || index" :value="office">
          {{ office.name }}
        </option>
      </select>
    </div>

    <div class="field" v-if="isSupport">
      <label for="class10-select">クラス10</label>
      <select id="class10-select" name="class10-select" v-model="selectClass10" @change="changeClass10" :disabled="targetClass10s.length===0">
        <option value="" disabled>クラス10を選択してください</option>
        <option v-for="(class10Item, index) in targetClass10s" :key="class10Item.code || index" :value="class10Item">
          {{ class10Item.name }}
        </option>
      </select>
    </div>
    <div class="field" v-if="isSupport">
      <label for="class15-select">クラス15</label>
      <select id="class15-select" name="class15-select" v-model="selectClass15" @change="changeClass15" :disabled="targetClass15s.length===0">
        <option value="" disabled>クラス15を選択してください</option>
        <option v-for="(class15Item, index) in targetClass15s" :key="class15Item.code || index" :value="class15Item">
          {{ class15Item.name }}
        </option>
      </select>
    </div>

    <div class="field" v-if="isSupport">
      <label for="class20-select">クラス20</label>
      <select id="class20-select" name="class20-select" v-model="selectClass20" @change="changeClass20" :disabled="targetClass20s.length===0">
        <option value="" disabled>クラス20を選択してください</option>
        <option v-for="(class20Item, index) in targetClass20s" :key="class20Item.code || index" :value="class20Item">
          {{ class20Item.name }}
        </option>
      </select>
    </div>

    <div class="field button-field">
      <button type="button" id="area-settings-clear" class="area-setting-button" :disabled="!selectCenters" @click="clearSelections">クリア</button>
      <button type="button" id="area-settings-save" class="area-setting-button" :disabled="!selectOffices" @click="areaSave">保存</button>
    </div>
  </fieldset>
</template>

<style scoped>
.area-settings {
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.95));
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 8px 22px rgba(33,23,19,0.06);
  padding: 1rem 1.2rem;
  border-radius: 12px;
  max-width: 780px;
  margin-top: 0.8rem;
}

.area-settings legend {
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

#class15-select, #class20-select {
  margin-top: 0.8rem;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.08);
  background: #fff;
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
  .area-settings {
    padding: 0.8rem;
    border-radius: 8px;
  }
  .field select {
    min-width: 100%;
  }
}
</style>
