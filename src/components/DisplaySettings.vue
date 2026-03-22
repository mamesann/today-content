<script setup>
import { ref, computed } from "vue";
import { displayItems } from "../stores/commonStore";

// ローカルで編集するためのコピー
const localItems = ref(JSON.parse(JSON.stringify(displayItems.value)));

const sortedLocalItems = computed(() => {
  return Object.values(localItems.value).sort((a, b) => a.index - b.index);
});

const isDirty = computed(() => {
  return JSON.stringify(localItems.value) !== JSON.stringify(displayItems.value);
});

const onClickLeft = (event) => {
  noneDispItem.value.forEach((item) => {
    localItems.value[item].display = true;
  });
  let indexDisp = 0;
  let indexNoneDisp = 0;
  for (const item in localItems.value) {
    if (localItems.value[item].display) {
      localItems.value[item].index = indexDisp++;
    } else {
      localItems.value[item].index = indexNoneDisp++;
    }
  }
  noneDispItem.value = [];
};

const onClickRight = (event) => {
  dispItem.value.forEach((item) => {
    localItems.value[item].display = false;
  });
  let indexDisp = 0;
  let indexNoneDisp = 0;
  for (const item in localItems.value) {
    if (localItems.value[item].display) {
      localItems.value[item].index = indexDisp++;
    } else {
      localItems.value[item].index = indexNoneDisp++;
    }
  }
  dispItem.value = [];
};

const onClickUp = (event) => {
  dispItem.value.forEach((item) => {
    const currentIndex = localItems.value[item].index;
    if (currentIndex > 0) {
      const aboveItem = Object.values(localItems.value).find(
        (i) => i.index === currentIndex - 1 && i.display === true
      );
      if (aboveItem) {
        localItems.value[item].index = currentIndex - 1;
        localItems.value[aboveItem.value].index = currentIndex;
      }
    }
  });
};

const onClickDown = (event) => {
  dispItem.value.forEach((item) => {
    const currentIndex = localItems.value[item].index;
    if (currentIndex < Object.keys(localItems.value).length - 1) {
      const belowItem = Object.values(localItems.value).find(
        (i) => i.index === currentIndex + 1 && i.display === true
      );
      if (belowItem) {
        localItems.value[item].index = currentIndex + 1;
        localItems.value[belowItem.value].index = currentIndex;
      }
    }
  });
};

const dispItem = ref([]);
const noneDispItem = ref([]);

const clearSelections = () => {
  // リセット（store の現状をローカルにコピー）
  localItems.value = JSON.parse(JSON.stringify(displayItems.value));
  dispItem.value = [];
  noneDispItem.value = [];
};

const dispSave = () => {
  const result = window.confirm("表示設定を保存します。");
  if (result) {
  // 保存（ローカルを store に反映）
    displayItems.value = JSON.parse(JSON.stringify(localItems.value));
    alert("表示設定が保存されました。");
  }
};

const onFocusDisplay = () => {
  noneDispItem.value = [];
}

const onFocusNoneDisplay = () => {
  dispItem.value = [];
}

</script>

<template>
  <fieldset class="display-settings">
    <legend>表示設定</legend>
    <p class="display-desc">表示する項目を選択してください。</p>
    <div id="display-settings-content">
      <div class="display-selectbox">
        <span>表示</span>
        <select
          multiple
          :size="sortedLocalItems.length"
          name=""
          class="items-select"
          v-model="dispItem"
          @focus="onFocusDisplay"
        >
          <option
            class="item-option"
            :value="item.value"
            v-for="item in sortedLocalItems"
            :key="item.value"
            v-show="item.display"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="display-selectbox">
        <span>非表示</span>
        <select
          multiple
            :size="sortedLocalItems.length"
          name=""
          class="items-select"
          v-model="noneDispItem"
          @focus="onFocusNoneDisplay"
        >
          <option
            class="item-option"
            :value="item.value"
            v-for="item in sortedLocalItems"
            :key="item.value"
            v-show="!item.display"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
    </div>
    <div id="move-buttons">
      <button class="move-button" @click="onClickLeft" :disabled="dispItem.length > 0">←</button>
      <button class="move-button" @click="onClickRight" :disabled="noneDispItem.length > 0">→</button>
      <button class="move-button" @click="onClickUp" :disabled="noneDispItem.length > 0">↑</button>
      <button class="move-button" @click="onClickDown" :disabled="noneDispItem.length > 0">↓</button>
    </div>
    <div class="field button-field">
      <button type="button" id="disp-settings-clear" class="disp-setting-button" :disabled="!isDirty" @click="clearSelections">クリア</button>
      <button type="button" id="disp-settings-save" class="disp-setting-button" :disabled="!isDirty" @click="dispSave">保存</button>
    </div>
  </fieldset>
</template>

<style scoped>
.display-settings {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9),
    rgba(250, 250, 250, 0.95)
  );
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 22px rgba(33, 23, 19, 0.06);
  padding: 1rem 1.2rem;
  border-radius: 12px;
  max-width: 780px;
  margin-top: 0.8rem;
}

.display-settings legend {
  font-weight: 700;
  font-size: 1.02rem;
  padding: 0 0.25rem;
}

.display-desc {
  color: var(--cafe-muted, #7a6f6f);
  margin-bottom: 1rem;
}

.items-select {
  width: 200px;
  height: 240px;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.item-option {
  padding: 0.3rem;
}

#display-settings-content {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.display-selectbox {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

#move-buttons {
  display: flex;
  gap: 0.5rem;
}

.move-button {
  /* padding: 0.3rem 0.6rem; */
  height: 32px;
  width: 32px;
  border: none;
  background-color: var(--cafe-primary, #d2691e);
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.move-button:hover {
  background-color: var(--cafe-primary-dark, #a0522d);
}

.move-button:active {
  background-color: #532612;
}

.move-button:disabled {
  background-color: var(--cafe-muted, #7a6f6f);
  cursor: not-allowed;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.button-field {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
}

.disp-setting-button {
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

.disp-setting-button:hover {
  background-color: var(--cafe-primary-dark, #5a4dff);
}

.disp-setting-button:active {
  background-color: var(--cafe-primary-dark, #261e94);
}

.disp-setting-button:disabled {
  cursor: not-allowed;
  background-color: var(--cafe-primary-dark, #a0a0a0);
}

</style>
