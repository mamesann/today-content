<script setup>
import { ref } from "vue";

const menuOpen = ref(false);
</script>

<template>
  <div id="app-root">
    <header id="app-header">
      <div class="hamburger-wrapper">
        <button
          class="hamburger"
          :aria-expanded="menuOpen"
          aria-label="メニューを開く"
          @click="menuOpen = !menuOpen"
        >
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>

        <nav class="side-menu" :class="{ open: menuOpen }" aria-hidden="false">
          <ul>
            <li>
              <router-link to="/" @click="menuOpen = false">トップページ</router-link>
            </li>
            <li>
              <router-link to="/wether" @click="menuOpen = false">天気</router-link>
            </li>
            <li>
              <router-link to="/pressure" @click="menuOpen = false">気圧</router-link>
            </li>
            <li>
              <router-link to="/fortune" @click="menuOpen = false">占い</router-link>
            </li>
            <li>
              <router-link to="/settings" @click="menuOpen = false">設定</router-link>
            </li>
          </ul>
        </nav>

        <div
          v-if="menuOpen"
          class="overlay"
          @click="menuOpen = false"
          aria-hidden="true"
        ></div>
      </div>
      <span class="title"><router-link to="/" @click="menuOpen = false">TODAY<span class="steam">☕</span></router-link></span>
    </header>
    <router-view />
  </div>
</template>

<style scoped>
.title a{
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--cafe-accent);
  align-self: center;
  width: 100%;
  margin-left: 8px;
  text-decoration: none;
}

#app-header {
  /* position: relative; */
  /* z-index: 1000; */
  /* top: 40; */
  height: 40px;
  display: flex;
  align-items: center; /* center children vertically to remove top gap */
  padding: 4px 8px;
}

/* existing logo styles kept for compatibility */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

/* Hamburger/button */
.hamburger-wrapper {
  display: flex;
  align-items: center;
}
.hamburger {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  width: 36px;
  height: 26px;
  padding: 2px;
  border: none;
  /* background: var(--cafe-paper); */
  border-radius: 8px;
  box-shadow: 0 6px 18px var(--cafe-shadow);
  cursor: pointer;
}
.hamburger:focus {
  outline: 2px solid rgba(0, 0, 0, 0.08);
}
.bar {
  display: block;
  height: 3px;
  background: var(--cafe-accent);
  border-radius: 2px;
  transition: transform 200ms ease, opacity 200ms ease;
}
.hamburger[aria-expanded="true"] .bar:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
.hamburger[aria-expanded="true"] .bar:nth-child(2) {
  opacity: 0;
}
.hamburger[aria-expanded="true"] .bar:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* Side menu */
.side-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  background: var(--cafe-paper);
  transform: translateX(-110%);
  transition: transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1);
  padding: 4.5rem 1rem 1rem 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  z-index: 1150;
  border-radius: 0 10px 10px 0;
}
.side-menu.open {
  transform: translateX(0);
}
.side-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.side-menu a {
  color: var(--cafe-text);
  text-decoration: none;
  font-weight: 600;
  padding: 8px 6px;
  display: block;
}
.side-menu a:hover {
  color: var(--cafe-accent);
}

/* Overlay when menu open */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1100;
}

@media (min-width: 960px) {
  /* on wide screens, slightly offset the menu from the very edge */
  .hamburger-wrapper {
    left: 20px;
  }
}
</style>
