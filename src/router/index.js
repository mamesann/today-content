import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import TodayContent from '../components/TodayContent.vue'
import Settings from '../views/Settings.vue'
import Wether from '../views/Wether.vue'
import Pressure from '../views/Pressure.vue'
import Fortune from '../views/Fortune.vue'

const routes = [
  { path: '/', name: 'Home', component: TodayContent },
  { path: '/wether', name: 'Wether', component: Wether },
  { path: '/pressure', name: 'Pressure', component: Pressure },
  { path: '/fortune', name: 'Fortune', component: Fortune },
  { path: '/settings', name: 'Settings', component: Settings },
]

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// })

const router = createRouter({
  history: createWebHashHistory(),  // GitHub Pages にデプロイする際の history オプション
  routes,
})

export default router
