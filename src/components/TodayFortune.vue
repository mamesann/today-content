<script setup>
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { selectConstellation, CONSTELLATION, loadTodayFortune, result } from "../stores/fortuneStore";
import { today } from "../stores/commonStore";


onBeforeMount(() => {
  loadTodayFortune();
  // ローカルストレージから情報取得
  const storedConstellation = localStorage.getItem("selectedConstellation");
  if (storedConstellation) {
    selectConstellation.value = parseInt(storedConstellation);
  }
});

</script>

<template>
  <div id="today-fortune">
    <h3><router-link to="/fortune">占い</router-link></h3>
    <p>星座：{{ CONSTELLATION[selectConstellation] }}</p>
    <div class="fortune-status">
      <table id="fortune-table" border="1px">
        <thead></thead>
        <tbody>
          <tr>
            <td class="img"><img src="../assets/icon/fortune-ranking.svg" alt="順位" /></td>
            <td class="header">順位</td>
            <td class="value">
              <span class="result-text">{{ result.rank }}</span
              ><span class="base-text"> / 12</span>
            </td>
          </tr>
          <tr>
            <td class="img">
              <img src="../assets/icon/fortune-total.svg" alt="総合運勢" />
            </td>
            <td class="header">総合運勢</td>
            <td class="value">
              <span class="result-text">{{ result.total }}</span
              ><span class="base-text"> / 5</span>
            </td>
          </tr>
          <tr>
            <td class="img"><img src="../assets/icon/fortune-love.svg" alt="恋愛運" /></td>
            <td class="header">恋愛運</td>
            <td class="value">
              <span class="result-text">{{ result.love }}</span
              ><span class="base-text"> / 5</span>
            </td>
          </tr>
          <tr>
            <td class="img"><img src="../assets/icon/fortune-work.svg" alt="仕事運" /></td>
            <td class="header">仕事運</td>
            <td class="value">
              <span class="result-text">{{ result.job }}</span
              ><span class="base-text"> / 5</span>
            </td>
          </tr>
          <tr>
            <td class="img"><img src="../assets/icon/fortune-money.svg" alt="金運" /></td>
            <td class="header">金運</td>
            <td class="value">
              <span class="result-text">{{ result.money }}</span
              ><span class="base-text"> / 5</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
h3 a {
  text-decoration: none;
  color: inherit;
}
#today-fortune h3::before {
  content: "🔮";
}
.value {
  color: var(--cafe-text);
}

#fortune-table {
  /* border: 1px solid var(--cafe-border); */
  border-collapse: collapse;
  border-color: var(--cafe-muted);
  /* width: 100%; */
  /* border-collapse: collapse; */
}

#fortune-table td {
  padding: 2px 8px;
  text-align: left;
  vertical-align: middle;
}

#fortune-table .header {
  width: 60%;
}

#fortune-table .value {
  text-align: right;
}

#fortune-table .result-text {
  /* font-weight: bold; */
  font-size: 1.2em;
  margin-right: 4px;
}
</style>
