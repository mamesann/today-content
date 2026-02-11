<script setup>
import { ref } from "vue";
import TodayWether from "./TodayWether.vue";
import TodayFortune from "./TodayFortune.vue";
import DailyYoga from "./DailyYoga.vue";

defineProps({});
</script>

<template>
  <div class="today-wrap">
    <div class="today">
      <!-- <section class="header">
        <div class="title">今日のInfo <span class="steam">☕</span></div>
        <div class="subtitle">いろんな"今日"を詰め込みました</div>
      </section> -->

      <ol id="today-list">
        <li class="content" id="wether">
          <TodayWether></TodayWether>
        </li>

        <li class="content" id="fortune">
          <TodayFortune></TodayFortune>
        </li>

        <li class="content" id="fortune">
          <DailyYoga></DailyYoga>
        </li>

        <!-- <li class="content" id="flower"> -->
        <!-- <TodayFlower></TodayFlower> -->
        <!-- <h3>お花</h3>
        <div class="value">チューリップ — 花言葉：思いやり</div> -->
        <!-- </li> -->
      </ol>
    </div>
  </div>
</template>

<style>
.today-wrap {
  padding: 1rem;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6), transparent);
  color: var(--cafe-text);

  /* make the wrapper scrollable when content is taller than viewport */
  max-height: calc(100vh - 4rem);
  overflow: auto;
}

.today {
  /* keep inner layout natural; wrapper handles scrolling */
  height: fit-content;
}

.header {
  margin-bottom: 0.8rem;
}
.title {
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--cafe-accent);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.subtitle {
  font-size: 0.9rem;
  color: var(--cafe-muted);
  margin-top: 0.15rem;
}

ol#today-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.content {
  background: var(--cafe-paper);
  padding: 0.95rem 1rem;
  border-radius: 10px;
  box-shadow: 0 8px 20px var(--cafe-shadow);
  border: 1px solid rgba(0, 0, 0, 0.04);
  min-height: 72px;
}

.content h3 {
  margin: 0 0 0.45rem 0;
  font-size: 0.98rem;
  color: var(--cafe-accent);
  display: flex;
  align-items: center;
}
.content h3::before {
  content: "☕";
  margin-right: 0.5rem;
  opacity: 0.9;
}

.value {
  color: var(--cafe-text);
  font-size: 0.95rem;
  line-height: 1.4;
}

@media (max-width: 480px) {
  .title {
    font-size: 1rem;
  }
  .content {
    padding: 0.75rem;
  }
}
</style>
